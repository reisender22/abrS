const fs = require("fs");
const config = require("../../../../config");
const database = require("better-sqlite3");

let dbConnection;

if (!fs.existsSync(config.server.state_directory)) {
  fs.mkdirSync(config.server.state_directory);
}

if (!fs.existsSync(`${config.server.state_directory}/invoices`)) {
  fs.mkdirSync(`${config.server.state_directory}/invoices`);
}

module.exports = function sqlite() {
  if (dbConnection) return dbConnection;

  dbConnection = new database(`${config.server.state_directory}/database.sqlite`);

  const schema = fs.readFileSync("src/schema.sql", "utf8");

  dbConnection.exec(schema);
  dbConnection.pragma("journal_mode = WAL");

  return dbConnection;
};
