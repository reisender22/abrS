const sqlite = require("../loaders/sqlite")

const db = sqlite();

const _sql = {
  CREATE: db.prepare(`
    INSERT INTO payments (
      amount,
      description,
      paypal_order_id,
      invoice_id,
      notes
    )
    VALUES (
      :amount,
      :description,
      :paypal_order_id,
      :invoice_id,
      :notes
    );`),

  CREATE_BY_REFERENCE: db.prepare(`
    INSERT INTO payments (
      amount,
      notes,
      invoice_id
    )
    SELECT
      invoices.amount,
      'automatic-sepa',
      invoices.id
    FROM
      invoices
    WHERE
      'mi' || invoices.id = lower(trim(:reference))
      AND CAST(invoices.amount AS INTEGER) = CAST((:amount * 100) AS INTEGER)
      AND state = 0;
    `),

  GET_BY_ID: db.prepare(`SELECT * FROM payments WHERE id = ?;`),

  GET_BY_INVOICE_ID: db.prepare(`SELECT * FROM payments WHERE invoice_id = ?;`),

  UPDATE: db.prepare(`
    UPDATE payments SET
      notes = :notes
    WHERE id = ?;`),

  DEL: db.prepare("DELETE FROM payments WHERE id = ?;"),
};

module.exports = Object.freeze({
  createByReference({ reference, amount }) {
    const info = _sql.CREATE_BY_REFERENCE.run({
      amount,
      reference
    });

    if (info.changes) return info.lastInsertRowid;
  },

  create({ amount, description, paypal_order_id, invoice_id, notes = '' }) {
    const { lastInsertRowid } = _sql.CREATE.run({
      amount,
      description,
      invoice_id,
      paypal_order_id,
      notes,
    });

    return lastInsertRowid;
  },

  getById(id) {
    return _sql.GET_BY_ID.get(id);
  },

  getByInvoiceId(id) {
    return _sql.GET_BY_INVOICE_ID.all(id);
  },

  update(id, paymentInput) {
    const { changes } = _sql.UPDATE.run(paymentInput, id);

    return Boolean(changes);
  },

  del(id) {
    const { changes } = _sql.DEL.run(id);

    return Boolean(changes);
  },
});
