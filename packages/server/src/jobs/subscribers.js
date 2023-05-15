const Events = require("./events");
const EventBus = require("./eventBus");
const sqlite = require("../loaders/sqlite");

const UserModel = require("../models/users");
const NotificationModel = require("../models/notifications");

const EmailService = require("../services/email");
const InvoiceService = require("../services/invoice");
const SettingService = require("../services/setting");

const config = require("../../../../config")

const db = sqlite();

module.exports = function () {
  EventBus.on(Events.onStudentSignUp, ({ student, invoice, payByTransfer }) => {
    // 1. generate pdf
    InvoiceService.createPdf(invoice.id);

    // 2. send email
    let emailTemplateSubject;
    let emailTemplateText;

    if (payByTransfer) {
      emailTemplateSubject = SettingService.get(
        "EMAIL_TEMPLATE_STUDENT_SIGN_UP_BANK_TRANSFER_SUBJECT"
      );
      emailTemplateText = SettingService.get(
        "EMAIL_TEMPLATE_STUDENT_SIGN_UP_BANK_TRANSFER_TEXT"
      );
    } else {
      emailTemplateSubject = SettingService.get(
        "EMAIL_TEMPLATE_STUDENT_SIGN_UP_PAYPAL_SUBJECT"
      );
      emailTemplateText = SettingService.get(
        "EMAIL_TEMPLATE_STUDENT_SIGN_UP_PAYPAL_TEXT"
      );
    }

    EmailService.send(
      {
        to: student.email,
        subject: EmailService.replaceEmailTemplate(
          emailTemplateSubject,
          student
        ),
        text: EmailService.replaceEmailTemplate(emailTemplateText, student),
        attachments: [{ path: `${config.server.state_directory}/invoices/${invoice.id}.pdf` }],
      },
      student.id
    );
  });

  EventBus.on(Events.onPasswordResetRequest, ({ user, token }) => {
    EmailService.send(
      {
        to: process.env.DEVELOPMENT ? "example@example.com" : user.email,
        subject: "Passwort vergessen",
        html: `<a href="https://kurse.arabisch-lernen.net/reset-password?token=${token}">Klicke hier</a> um Dein Passwort zurueck zusetzen.`,
      },
      user.id
    );
  });

  EventBus.on(Events.onUserCreated, ({ user, password }) => {
    const emailTemplateSubject = SettingService.get(
      "EMAIL_TEMPLATE_STUDENT_SIGN_UP_SUBJECT"
    );
    const emailTemplateText = SettingService.get(
      "EMAIL_TEMPLATE_STUDENT_SIGN_UP_TEXT"
    );

    EmailService.send(
      {
        to: user.email,
        subject: "Dein Passwort",
        text: `Dein Passwort fuer Dein neues Konto ist: ${password}`,
      },
      user.id
    );
  });

  EventBus.on(Events.onUserCommentCreated, ({ userComment }) => {
    const admins = UserModel.getByRole(0).filter(
      (user) => user.id !== userComment.author_id
    );

    const teachers = db
      .prepare(
        `
      SELECT
	      classes.teacher_id AS id
      FROM
      	classes
      INNER JOIN
      	enrollments
      ON
      	enrollments.class_id = classes.id
      WHERE
      	enrollments.student_id = ?;`
      )
      .all(userComment.user_id);

    for (const user of [...admins, ...teachers]) {
      NotificationModel.create({
        title: "Neuer Benutzerkommentar für ",
        body: userComment.body_md.slice(0, 30),
        url: "users/" + userComment.user_id + "?tab=comments",
        user_id: user.id,
      });

      const author = UserModel.getById(userComment.author_id);
      const student = UserModel.getById(userComment.user_id);

      EmailService.send(
        {
          to: process.env.DEVELOPMENT ? "example@example.com" : user.email,
          subject: "Neuer Benutzerkommentar",
          text: `${author.first_name} ${author.last_name} hat einen neuen Kommentar zum Schüler/in ${student.first_name} ${student.last_name} verfasst:

          "${userComment.body_md}"
          `,
        },
        user.id
      );
    }
  });

  EventBus.on(Events.onInvoicesCreated, ({ invoices }) => {
    for (const invoice of invoices) {
      const student = UserModel.getById(invoice.student_id);

      // 1. generate pdf
      InvoiceService.createPdf(invoice.id);

      // 2. send email
      const emailTemplateSubject = SettingService.get(
        "EMAIL_TEMPLATE_NEW_INVOICE_SUBJECT"
      );
      const emailTemplateText = SettingService.get(
        "EMAIL_TEMPLATE_NEW_INVOICE_TEXT"
      );

      EmailService.send(
        {
          to: process.env.DEVELOPMENT
            ? "example@example.com"
            : student.email,
          subject: EmailService.replaceEmailTemplate(
            emailTemplateSubject,
            student
          ),
          text: EmailService.replaceEmailTemplate(emailTemplateText, student),
          attachments: [{ path: `${config.server.state_directory}/invoices/${invoice.id}.pdf` }],
        },
        student.id
      );
    }
  });
};
