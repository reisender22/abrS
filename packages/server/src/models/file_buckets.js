const db = require("../loaders/sqlite")

const db = sqlite();

const _sql = {
  CREATE: db.prepare(`
    INSERT INTO file_buckets (name)
    VALUES (:name);`),

  GET_BY_ID: db.prepare(`SELECT * FROM file_buckets WHERE id = ?;`),

  UPDATE: db.prepare(`
    UPDATE file_buckets SET
      name = :name,
    WHERE id = ?;`),

  DEL: db.prepare("DELETE FROM file_buckets WHERE id = ?;"),
};

module.exports = Object.freeze({
  create({ name }) {
    const { lastInsertRowid } = _sql.CREATE.run({ name });

    return lastInsertRowid;
  },

  getById(id) {
    return _sql.GET_BY_ID.get(id);
  },

  update(id, name) {
    const { changes } = _sql.UPDATE.run(name, id);

    return Boolean(changes);
  },

  del(id) {
    const { changes } = _sql.DEL.run(id);

    return Boolean(changes);
  },
});
