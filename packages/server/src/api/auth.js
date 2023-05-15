const AuthService = require("../services/auth");
const NotificationModel = require("../models/notifications");

const Errors = {
  INVALID_EMAIL: "Ein Konto mit dieser E-Mailadresse existiert nicht.",
  INVALID_PASSWORD: "Das Passwort ist falsch.",
  EMAIL_NOT_VERIFIED:
    "Bitte bestätige Deine E-Mailadresse bevor Du dich einloggst.",
  ACCOUNT_IS_LOCKED: "Dein Konto ist gesperrt.",
};

module.exports = function (server) {
  server.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;

    try {
      const { user } = await AuthService.signIn(email, password);
      const notifications = NotificationModel.getByUserId(user.id)
      res.end(JSON.stringify({ user, notifications }));
    } catch (error) {
      res.statusCode = 401;
      res.end(
        JSON.stringify({
          error,
          message: Errors[error],
        })
      );
    }
  });

  server.put("/auth/notifications/:id/dismiss", async (req, res) => {
    NotificationModel.dismiss(req.params.id);
    res.end();
  });
};
