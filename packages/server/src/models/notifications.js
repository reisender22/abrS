const sqlite = require("../loaders/sqlite");

const db = sqlite();

const _sql = {
  CREATE: db.prepare(`
    INSERT INTO notifications (
      title,
      body,
      url,
      level,
      user_id
    )
    VALUES (
      :title,
      :body,
      :url,
      :level,
      :user_id
    );`),

  GET_BY_ID: db.prepare(`SELECT * FROM notifications WHERE id = ?;`),

  GET_BY_USER_ID: db.prepare(`SELECT * FROM notifications WHERE user_id = ?;`),

  DISMISS: db.prepare(
    `UPDATE notifications SET is_dismissed = 1 WHERE id = ?;`
  ),

  DEL: db.prepare("DELETE FROM notifications WHERE id = ?;"),
};

module.exports = Object.freeze({
  create({ title, body, url, user_id, level = "INFO" }) {
    const { lastInsertRowid } = _sql.CREATE.run({
      title,
      body,
      url,
      level,
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

  dismiss(id) {
    const { changes } = _sql.DISMISS.run(id);

    return Boolean(changes);
  },

  del(id) {
    const { changes } = _sql.DEL.run(id);

    return Boolean(changes);
  },
});
