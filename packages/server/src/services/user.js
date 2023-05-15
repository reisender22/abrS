const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const random = require("../utils/random");

const sqlite = require("../loaders/sqlite");

const Events = require("../jobs/events");
const EventBus = require("../jobs/eventBus");

const UserModel = require("../models/users");
const OrderModel = require("../models/orders");
const InvoiceModel = require("../models/invoices");
const PaymentModel = require("../models/payments");
const UserCommentModel = require("../models/user_comments");

const ClassService = require("./class");

const db = sqlite();

function parse(object) {
  if (!object) return;

  let copy = { ...object };

  for (const key in copy) {
    if (key.startsWith("is_")) {
      copy[key] = Boolean(copy[key]);
    }
  }

  return copy;
}

function unparse(object) {
  if (!object) return;

  let copy = { ...object };

  for (const key in copy) {
    if (key.startsWith("is_")) {
      copy[key] = copy[key] ? 1 : 0;
    }
  }

  return copy;
}

module.exports = Object.freeze({
  async create(userInput, { sendEmail = false } = {}) {
    userInput = unparse(userInput);

    let randomPassword;
    let hash;

    if (userInput.password) {
      // if a password has been provided...
      hash = await bcrypt.hash(userInput.password, 10);
    } else {
      // ...else generate a random password
      randomPassword = random.getString();
      hash = await bcrypt.hash(randomPassword, 10);
    }

    // save the new user to the database
    const id = UserModel.create({ ...userInput, password: hash });

    const userRecord = UserModel.getById(id);

    if (sendEmail)
      EventBus.emit(Events.onUserCreated, {
        user: userRecord,
        password: randomPassword,
      });

    // return the newly created user from the database
    return userRecord;
  },

  async signUpStudent(userInput, class_id, { payByTransfer }) {
    const transaction = db.transaction(
      async (userInput, class_id, payByTransfer) => {
        const student = await this.create({
          ...userInput,
          is_registration_fee_paid: payByTransfer ? false : true,
        });

        const classRecord = ClassService.getById(class_id);

        const order_id = OrderModel.create({
          student_id: student.id,
          items: [
            {
              description: "Anmeldung",
              price:
                classRecord.registration_fee_offer > 0
                  ? classRecord.registration_fee_offer
                  : classRecord.registration_fee,
              quantity: 1,
              class_id: classRecord.id,
            },
          ],
        });

        const orderRecord = OrderModel.getById(order_id);

        let invoice;

        if (orderRecord.amount > 0) {
          const invoice_id = InvoiceModel.create({ order_id });
          invoice = InvoiceModel.getById(invoice_id);

          if (!payByTransfer) {
            PaymentModel.create({
              amount: invoice.amount,
              description: "PayPal",
              invoice_id: invoice.id,
            });
          }
        }

        ClassService.createEnrollment({
          class_id,
          student_id: student.id,
        });

        return { student, invoice };
      }
    );

    const { student, invoice } = await transaction(
      userInput,
      class_id,
      payByTransfer
    );

    if (invoice) {
      EventBus.emit(Events.onStudentSignUp, {
        student,
        invoice,
        payByTransfer,
      });

      return student;
    }
  },

  requestPasswordReset(email) {
    const user = UserModel.getByEmail(email);

    if (!user) throw new Error("User does not exist");

    const password = random.getString();

    const token = jwt.sign({ id: user.id, password }, "654aesd658756ergq658");

    EventBus.emit(Events.onPasswordResetRequest, { user, token });

    return true;
  },

  async resetPassword(token) {
    const { id, password } = jwt.verify(token, "654aesd658756ergq658");

    const userRecord = UserModel.getById(id);
    const hash = await bcrypt.hash(password, 10);

    UserModel.update(id, { ...userRecord, password: hash });

    return password;
  },

  get({ role = null, offset = 0, page_size = 25 } = {}) {
    const options = { offset, page_size };

    if (role === null) return UserModel.getAll(options);

    return UserModel.getByRole(role, options);
  },

  search(query, { roles = [0, 1, 2], page_size = 5 } = {}) {
    return UserModel.getBySearchQuery(query, { roles, page_size });
  },

  getById(id) {
    return parse(UserModel.getById(id));
  },

  getBySearchQuery(query, { offset = 0, page_size = 25 } = {}) {
    const userRecords = UserModel.getBySearchQuery({
      query,
      offset,
      page_size,
    });

    return userRecords;
  },

  update(id, userInput) {
    userInput = unparse(userInput);

    const userRecord = UserModel.getById(id);

    UserModel.update(id, { ...userRecord, ...userInput });

    const user = UserModel.getById(id);

    EventBus.emit(Events.onUserUpdate, { user });

    return user;
  },

  async updatePassword(id, password) {
    const userRecord = UserModel.getById(id);

    const hash = await bcrypt.hash(password, 10);

    return UserModel.update(id, { ...userRecord, password: hash });
  },

  del(id) {
    return UserModel.del(id);
  },

  // User Comments
  getComments(id) {
    return UserCommentModel.getByUserId(id);
  },

  createComment(userCommentInput) {
    const id = UserCommentModel.create(userCommentInput);

    const userCommentRecord = UserCommentModel.getById(id);

    EventBus.emit(Events.onUserCommentCreated, {
      userComment: userCommentRecord,
    });

    return userCommentRecord;
  },

  updateComment(id, userCommentInput) {
    UserCommentModel.update(id, userCommentInput);

    return UserCommentModel.getById(id);
  },

  delComment(id) {
    return UserCommentModel.del(id);
  },
});
