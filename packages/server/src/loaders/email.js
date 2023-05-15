const nodemailer = require("nodemailer");
const SettingsModel = require("../models/settings");

let smtpTransporter;

module.exports = function email({ reload = false } = {}) {
  if (smtpTransporter && !reload) return smtpTransporter;

  const port = SettingsModel.getByName("SMTP_PORT").value;
  const secure = port == 465;

  smtpTransporter = nodemailer.createTransport({
    host: SettingsModel.getByName("SMTP_HOST").value,
    port,
    secure,
    auth: {
      user: SettingsModel.getByName("SMTP_USER").value,
      pass: SettingsModel.getByName("SMTP_PASS").value,
    },
  });

  return smtpTransporter;
};
