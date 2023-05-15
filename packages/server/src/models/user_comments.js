const sqlite = require("../loaders/sqlite");

const db = sqlite();

const _sql = {
  CREATE: db.prepare(`
    INSERT INTO user_comments (
      body_md,
      author_id,
      user_id
    )
    VALUES (
      :body_md,
      :author_id,
      :user_id
    );`),

  GET_BY_ID: db.prepare(`SELECT * FROM user_comments WHERE id = ?;`),

  GET_BY_USER_ID: db.prepare(`
    SELECT * FROM user_comments
    WHERE user_id = ?
    ORDER BY created_at DESC;`),

  UPDATE: db.prepare(`
    UPDATE user_comments SET
      body_md = :body_md
    WHERE id = ?;`),

  DEL: db.prepare("DELETE FROM user_comments WHERE id = ?;"),
};

module.exports = Object.freeze({
  create({ body_md, author_id, user_id }) {
    const { lastInsertRowid } = _sql.CREATE.run({
      body_md,
      author_id,
      user_id,
    });

    return lastInsertRowid;
  },

  getById(id) {
    return _sql.GET_BY_ID.get(id);
  },

  getByUserId(id) {
    return _sql.GET_BY_USER_ID.all(id);
  },

  update(id, body_md) {
    const { changes } = _sql.UPDATE.run({ body_md }, id);

    return Boolean(changes);
  },

  del(id) {
    const { changes } = _sql.DEL.run(id);

    return Boolean(changes);
  },
});
