const cors = require("cors");
const polka = require("./polka");
const { raw } = require("@polka/parse");
const { unhashIds } = require("../utils/response");

const app = polka();

function unhashRequest(req, _, next) {
  req.params = unhashIds(req.params);
  req.query = unhashIds(req.query);
  req.body = unhashIds(req.body);

  next();
}

function authorizeRequest(req, res, next) {
  next();
}

module.exports = function applyMiddlewares() {
  app.use(
    raw({ type: "application/json" }),
    (req, res, next) => {
      const rawBody = req.body;

      if (typeof rawBody === 'object') return next()

      req.body = JSON.parse(rawBody);
      req.rawBody = rawBody;

      next();
    })
  app.use(cors({ origin: "*" }));
};
