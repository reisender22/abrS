const fs = require("fs");
const polka = require("./polka");
const email = require("./email");
const sqlite = require("./sqlite");
const apollo = require("./apollo");
const auth = require("../api/auth");
const jobs = require("../jobs/subscribers");
const middlewares = require("./middlewares");
const { createWebhook } = require("./wise-webhook");

module.exports = () => {
  console.log("> Init SQLite connection...");
  sqlite();

  console.log("> Init email connection...");
  email();

  console.log("> Init jobs...");
  jobs();

  console.log("> Init server...");
  polka();

  console.log("> Apply middlewares...");
  middlewares();

  console.log("> Register Auth routes...");
  auth(polka());

  console.log("> Init Apollo GraphQL server...");
  apollo();

  polka().post("/webhooks/wise", createWebhook("4f4c4c60-0b51-4cf4-958d-83e8801d651d"))
};
