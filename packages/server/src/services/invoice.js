const Events = require("../jobs/events");
const EventBus = require("../jobs/eventBus");

const UserModel = require("../models/users");
const OrderModel = require("../models/orders");
const ClassModel = require("../models/classes");
const PaymentModel = require("../models/payments");
const InvoiceModel = require("../models/invoices");

const { createInvoicePdf } = require("../utils/pdf");

module.exports = Object.freeze({
  create({ student_id, items }) {
    items = items.map((item) => {
      if (!item.class_id) return item;

      const { subject } = ClassModel.getById(item.class_id);

      return {
        description: subject,
        price: item.price,
        quantity: item.quantity,
        class_id: item.class_id,
      };
    });

    const order_id = OrderModel.create({
      student_id,
      items,
    });

    const orderRecord = OrderModel.getById(order_id);

    if (orderRecord.amount > 0) {
      const id = InvoiceModel.create({ order_id });
      const invoice = InvoiceModel.getById(id);

      EventBus.emit(Events.onInvoicesCreated, { invoices: [invoice] });

      return invoice;
    }
  },

  getById(id) {
    return InvoiceModel.getById(id);
  },

  get({ state = null, student_id, offset = 0, page_size = 100 } = {}) {
    const options = { offset, page_size };

    if (student_id) {
      const invoices = InvoiceModel.getByStudentId(student_id, options);

      if (state !== null) {
        return invoices.filter((invoice) => invoice.state === state);
      }

      return invoices;
    }

    if (state === null) {
      return InvoiceModel.getAll(options);
    }

    if (state != null) {
      return InvoiceModel.getByStatus(state, options);
    }
  },

  getByStudentId(student_id) {
    return InvoiceModel.getByStudentId(student_id);
  },

  search(query, { page_size = 50 } = {}) {
    return InvoiceModel.getBySearchQuery(query, { page_size });
  },

  addNote(id, note) {
    const invoiceRecord = InvoiceModel.getById(id);

    InvoiceModel.update(id, { ...invoiceRecord, note });

    return InvoiceModel.getById(id);
  },

  getPaymentsByInvoiceId(invoice_id) {
    return PaymentModel.getByInvoiceId(invoice_id);
  },

  createPayment({ amount, description, invoice_id, notes }) {
    const id = PaymentModel.create({
      notes,
      amount,
      invoice_id,
      description,
    });

    const invoice = this.getById(invoice_id);

    if (invoice.items[0].description === "Anmeldegebühr") {
      const user = UserModel.getById(invoice.student_id);
      UserModel.update(user.id, { ...user, is_registration_fee_paid: 1 });
    }

    return PaymentModel.getById(id);
  },

  createPaymentByReference({ reference, amount }) {
    const id = PaymentModel.createByReference({
      reference, amount
    });

    if(!id) return

    const payment = PaymentModel.getById(id)
    const invoice = this.getById(payment.invoice_id);

    if (invoice.items[0].description === "Anmeldegebühr") {
      const user = UserModel.getById(invoice.student_id);
      UserModel.update(user.id, { ...user, is_registration_fee_paid: 1 });
    }

    return payment;
  },

  delPayment(id) {
    return PaymentModel.del(id);
  },

  vd(id) {
    const invoiceRecord = InvoiceModel.getById(id);

    InvoiceModel.update(id, { ...invoiceRecord, state: 2 });

    return InvoiceModel.getById(id);
  },

  unvd(id) {
    const invoiceRecord = InvoiceModel.getById(id);

    InvoiceModel.update(id, { ...invoiceRecord, state: 0 });

    return InvoiceModel.getById(id);
  },

  createPdf(id) {
    const invoiceRecord = this.getById(id);

    createInvoicePdf(invoiceRecord);
  },

  resend(id) {
    const invoice = InvoiceModel.getById(id);
    EventBus.emit(Events.onInvoicesCreated, { invoices: [invoice] });

    return true;
  },
});
