const sqlite = require("../loaders/sqlite");

const db = sqlite();

const _sql = {
  GET_BY_NAME: db.prepare(`SELECT * FROM settings WHERE name = ?;`),

  GET_ALL: db.prepare(`SELECT * FROM settings;`),

  UPDATE: db.prepare(`
    UPDATE settings SET
      value = :value
    WHERE name = :name;`),
};

module.exports = Object.freeze({
  getByName(id) {
    return _sql.GET_BY_NAME.get(id);
  },

  getAll() {
    return _sql.GET_ALL.all();
  },

  update(name, value) {
    const { changes } = _sql.UPDATE.run({ name, value });

    return Boolean(changes);
  },
});
