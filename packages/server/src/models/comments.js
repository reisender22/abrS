const db = require("../loaders/sqlite")

const db = sqlite();

const _sql = {
  CREATE: db.prepare(`
    INSERT INTO comments (
      body_md,
      lesson_id
    )
    VALUES (
      :body_md,
      :lesson_id
    );`),

  GET_BY_ID: db.prepare(`SELECT * FROM comments WHERE id = ?;`),

  GET_BY_LESSON_ID: db.prepare(`SELECT * FROM comments WHERE lesson_id = ?;`),

  UPDATE: db.prepare(`
    UPDATE comments SET
      body_md = :body_md,
      lesson_id = :lesson_id
    WHERE id = ?;`),

  DEL: db.prepare("DELETE FROM comments WHERE id = ?;"),
};

module.exports = Object.freeze({
  create({ body_md, lesson_id }) {
    const { lastInsertRowid } = _sql.CREATE.run({
      body_md,
      lesson_id,
    });

    return lastInsertRowid;
  },

  getById(id) {
    return _sql.GET_BY_ID.get(id);
  },

  getByLessonId(id) {
    return _sql.GET_BY_LESSON_ID.all(id);
  },

  update(id, commentInput) {
    const { changes } = _sql.UPDATE.run(commentInput, id);

    return Boolean(changes);
  },

  del(id) {
    const { changes } = _sql.DEL.run(id);

    return Boolean(changes);
  },
});
