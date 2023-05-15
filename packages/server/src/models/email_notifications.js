const sqlite = require("../loaders/sqlite");

const db = sqlite();

const _sql = {
  CREATE: db.prepare(`
    INSERT INTO email_notifications (
      subject,
      status,
      user_id
    )
    VALUES (
      :subject,
      :status,
      :user_id
    );`),

  GET_BY_USER_ID: db.prepare(
    `SELECT * FROM email_notifications WHERE user_id = ?;`
  ),

  GET_BY_STATUS: db.prepare(`
    SELECT
      *
    FROM
      email_notifications
    WHERE
      status = :status AND
      id > :offset
    ORDER BY
      id DESC
    LIMIT :page_size;`),

  GET_ALL: db.prepare(`
    SELECT
      *
    FROM
      email_notifications
    WHERE
      id > :offset
    ORDER BY
      id DESC
    LIMIT :page_size;`),
};

module.exports = Object.freeze({
  create({ subject, status, user_id }) {
    const { lastInsertRowid } = _sql.CREATE.run({
      subject,
      status,
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

  geByStatus({ status, offset = 0, page_size = 25 } = {}) {
    return _sql.GET_BY_STATUS.all({ status, offset, page_size });
  },

  getAll({ offset = 0, page_size = 25 } = {}) {
    return _sql.GET_ALL.all({ offset, page_size });
  },

  update(id, emailNotificationInput) {
    const { changes } = _sql.UPDATE.run(emailNotificationInput, id);

    return Boolean(changes);
  },

  del(id) {
    const { changes } = _sql.DEL.run(id);

    return Boolean(changes);
  },
});
