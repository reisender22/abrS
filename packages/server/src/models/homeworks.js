const sqlite = require("../loaders/sqlite")

const db = sqlite();

const _sql = {
  CREATE: db.prepare(`
    INSERT INTO homeworks (
      description_md,
      lesson_id,
      due_at
    )
    VALUES (
      :description_md,
      :lesson_id,
      :due_at
    );`),

  GET_BY_ID: db.prepare(`SELECT * FROM homeworks WHERE id = ?;`),

  GET_BY_LESSON_ID: db.prepare(`SELECT * FROM homeworks WHERE lesson_id = ?;`),

  UPDATE: db.prepare(`
    UPDATE homeworks SET
      description_md = :description_md,
      lesson_id = :lesson_id,
      due_at = :due_at
    WHERE id = ?;`),

  DEL: db.prepare("DELETE FROM homeworks WHERE id = ?;"),
};

module.exports = Object.freeze({
  create({ description_md, lesson_id, due_at }) {
    const { lastInsertRowid } = _sql.CREATE.run({
      description_md,
      lesson_id,
      due_at,
    });

    return lastInsertRowid;
  },

  getById(id) {
    return _sql.GET_BY_ID.get(id);
  },

  getByLessonId(id) {
    return _sql.GET_BY_LESSON_ID.all(id);
  },

  update(id, homeworkInput) {
    const { changes } = _sql.UPDATE.run(homeworkInput, id);

    return Boolean(changes);
  },

  del(id) {
    const { changes } = _sql.DEL.run(id);

    return Boolean(changes);
  },
});
