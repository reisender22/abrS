const email = require("../loaders/email");
const SettingModel = require("../models/settings");
const EmailNotificationModel = require("../models/email_notifications");

const emailTransporter = email();

module.exports = Object.freeze({
  async send(
    {
      to,
      subject,
      text,
      html,
      attachments,
      from = '"Miftahul Ilm" <info@miftahul-ilm.net>',
    },
    user_id
  ) {
    const { accepted } = await emailTransporter.sendMail({
      to,
      from,
      text,
      html,
      subject,
      attachments,
    });

    const status = accepted.length > 0 ? 1 : 0;

    EmailNotificationModel.create({ subject, status, user_id });
  },

  get({ status = null, offset = 0, page_size = 25 } = {}) {
    if (status === null) {
      return EmailNotificationModel.getAll({ offset, page_size });
    }

    return EmailNotificationModel.geByStatus({ status, offset, page_size });
  },

  replaceEmailTemplate(template, data) {
    var regex = new RegExp(":(" + Object.keys(data).join("|") + ")", "g");
    return template.replace(regex, (s, $1) => data[$1] || s);
  },
});
