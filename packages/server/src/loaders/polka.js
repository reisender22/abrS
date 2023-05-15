const Polka = require("polka");
const config = require("../../../../config");

let app;

module.exports = function polka() {
  if (app) return app;

  app = Polka();

  app.listen(config.server.port, (err) => {
    if (err) throw err;
    console.log(`> Running on localhost:${config.server.port}`);
  });

  return app;
};
