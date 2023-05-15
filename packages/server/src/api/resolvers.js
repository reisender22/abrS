const enums = require("../services/enums");
const UserService = require("../services/user");
const ClassService = require("../services/class");
const EmailService = require("../services/email");
const InvoiceService = require("../services/invoice");
const SettingService = require("../services/setting");

const StatsModel = require("../models/stats");

module.exports = {
  ...enums,

  Query: {
    getStats() {
      return {
        salesByMonth: StatsModel.getByMonth(),
        salesByYear: StatsModel.getByYear(),
        students: StatsModel.getNumberOfStudents(),
        teachers: StatsModel.getNumberOfTeachers(),
        classes: StatsModel.getNumberOfClasses(),
        openInvoices: StatsModel.getNumberOfOpenInvoices(),
        openInvoicesAmount: StatsModel.getAmountOfOpenInvoices(),
      };
    },

    getUser(_, { id }, context) {
      return UserService.getById(id);
    },

    getUsers(_, args, context) {
      return UserService.get(args);
    },

    searchUsers(_, { query, roles, page_size }, context) {
      return UserService.search(query, { roles, page_size });
    },

    getClass(_, { id }, context) {
      return ClassService.getById(id);
    },

    getClasses(_, args, context) {
      return ClassService.get(args);
    },

    getInvoices(_, args, context) {
      return InvoiceService.get(args);
    },

    searchInvoices(_, { query, page_size }, context) {
      return InvoiceService.search(query, { page_size });
    },

    getEmailNotifications(_, args, context) {
      return EmailService.get(args);
    },

    getSettings(_, args, context) {
      return SettingService.getAll();
    },
  },

  Mutation: {
    async signUpStudent(_, { userInput, class_id, payByTransfer }) {
      return await UserService.signUpStudent(userInput, class_id, {
        payByTransfer,
      });
    },

    async requestPasswordReset(_, { email }) {
      return await UserService.requestPasswordReset(email);
    },

    resetPassword(_, { token }) {
      return UserService.resetPassword(token);
    },

    async createUser(_, { userInput, sendEmail }, context) {
      return await UserService.create(userInput, { sendEmail });
    },

    updateUser(_, { id, userInput }, context) {
      return UserService.update(id, userInput);
    },

    updateUserPassword(_, { id, password }, context) {
      return UserService.updatePassword(id, password);
    },

    deleteUser(_, { id }, context) {
      return UserService.del(id);
    },

    createUserComment(_, { userCommentInput }, context) {
      return UserService.createComment(userCommentInput);
    },

    updateUserComment(_, { id, body_md }, context) {
      return UserService.updateComment(id, body_md);
    },

    deleteUserComment(_, { id }, context) {
      return UserService.delComment(id);
    },

    createClass(_, { classInput }, context) {
      return ClassService.create(classInput);
    },

    updateClass(_, { id, classInput }, context) {
      return ClassService.update(id, classInput);
    },

    deleteClass(_, { id }, context) {
      return ClassService.del(id);
    },

    createEnrollment(_, { student_id, class_id }, context) {
      return ClassService.createEnrollment({ student_id, class_id });
    },

    updateEnrollment(_, { id, custom_price_per_hour }, context) {
      return ClassService.updateEnrollment(id, { custom_price_per_hour });
    },

    delEnrollment(_, { id }, context) {
      return ClassService.delEnrollment(id);
    },

    requestClassChange(_, { student_id, currentClassId, newClassId }) {
      return ClassService.requestClassChange(
        student_id,
        currentClassId,
        newClassId
      );
    },

    createFirstInvoices(_, { id }, context) {
      ClassService.createFirstInvoices(id);

      return ClassService.getById(id);
    },

    createLesson(_, { lessonInput, sessionInputs }, context) {
      return ClassService.createLesson(lessonInput, sessionInputs);
    },

    updateLesson(_, { id, lessonInput }, context) {
      return ClassService.updateLesson(id, lessonInput);
    },

    // Invoice
    createInvoice(_, { input }, context) {
      return InvoiceService.create(input);
    },

    voidInvoice(_, { id }, context) {
      return InvoiceService.vd(id);
    },

    unvoidInvoice(_, { id }, context) {
      return InvoiceService.unvd(id);
    },

    resendInvoice(_, { id }, context) {
      return InvoiceService.resend(id);
    },

    createPayment(_, { paymentInput }, context) {
      return InvoiceService.createPayment(paymentInput);
    },

    deletePayment(_, { id }, context) {
      return InvoiceService.delPayment(id);
    },

    // Settings
    updateSettings(_, { settingsInput }, context) {
      SettingService.setAll(settingsInput);

      return SettingService.getAll();
    },
  },

  // --

  User: {
    invoices({ id }, { state }) {
      return InvoiceService.get({ student_id: id, state });
    },

    comments({ id }) {
      return UserService.getComments(id);
    },
  },

  UserComment: {
    author({ author_id }) {
      return UserService.getById(author_id);
    },
  },

  Class: {
    teacher({ teacher_id }) {
      return UserService.getById(teacher_id);
    },

    enrollments({ id }) {
      return ClassService.getEnrollmentsByClassId(id);
    },

    lessons({ id }, { offset, page_size }) {
      return ClassService.getLessonsByClassId(id, { offset, page_size });
    },

    hoursUntilNextInvoice({ id }) {
      return ClassService.getHoursUntilNextInvoice(id);
    },

    last_invoice_at({ id }) {
      return ClassService.getLastInvoiceAt(id);
    },
  },

  Enrollment: {
    student({ student_id }) {
      return UserService.getById(student_id);
    },
  },

  Invoice: {
    payments({ id }) {
      return InvoiceService.getPaymentsByInvoiceId(id);
    },

    student({ user_id }) {
      return UserService.getById(user_id);
    },

    clss({ class_id }) {
      return ClassService.getById(class_id);
    },
  },

  EmailNotification: {
    user({ user_id }) {
      return UserService.getById(user_id);
    },
  },
};
