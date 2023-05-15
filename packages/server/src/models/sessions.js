const sqlite = require("../loaders/sqlite");

const db = sqlite();

const _sql = {
  CREATE: db.prepare(`
    INSERT INTO sessions (
      attendance,
      has_done_homework,
      student_id,
      lesson_id,
      notes
    )
    VALUES (
      :attendance,
      :has_done_homework,
      :student_id,
      :lesson_id,
      :notes
    );`),

  GET_BY_ID: db.prepare(`SELECT * FROM sessions WHERE id = ?;`),

  GET_BY_LESSON_ID: db.prepare(`SELECT * FROM sessions WHERE lesson_id = ?;`),

  GET_BY_STUDENT_ID: db.prepare(`SELECT * FROM sessions WHERE student_id = ?;`),

  UPDATE: db.prepare(`
    UPDATE sessions SET
      attendance = :attendance,
      has_done_homework = :has_done_homework,
      student_id = :student_id,
      lesson_id = :lesson_id,
      notes = :notes
    WHERE id = ?;`),

  DEL: db.prepare("DELETE FROM sessions WHERE id = ?;"),
};

module.exports = Object.freeze({
  create({ attendance, has_done_homework, student_id, lesson_id, notes = "" }) {
    const { lastInsertRowid } = _sql.CREATE.run({
      attendance,
      has_done_homework: has_done_homework ? 1 : 0,
      student_id,
      lesson_id,
      notes,
    });

    return lastInsertRowid;
  },

  getById(id) {
    return _sql.GET_BY_ID.get(id);
  },

  getByLessonId(id) {
    return _sql.GET_BY_LESSON_ID.all(id);
  },

  getByStudentId(id) {
    return _sql.GET_BY_STUDENT_ID.all(id);
  },

  getByClassId(id) {
    return _sql.GET_BY_CLASS_ID.all(id);
  },

  update(id, sessionInput) {
    const { changes } = _sql.UPDATE.run(sessionInput, id);

    return Boolean(changes);
  },

  del(id) {
    const { changes } = _sql.DEL.run(id);

    return Boolean(changes);
  },
});
