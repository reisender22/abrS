const sqlite = require("../loaders/sqlite")

const db = sqlite();

const _sql = {
  CREATE: db.prepare(`
    INSERT INTO homework_submissions (
      file_id,
      corrected_file_id,
      teacher_comment_md,
      student_id,
      homework_id
    )
    VALUES (
      :file_id,
      :corrected_file_id,
      :teacher_comment_md,
      :student_id,
      :homework_id
    );`),

  GET_BY_ID: db.prepare(`SELECT * FROM homework_submissions WHERE id = ?;`),

  GET_BY_HOMEWORK_ID: db.prepare(
    `SELECT * FROM homework_submissions WHERE homework_id = ?;`
  ),

  UPDATE: db.prepare(`
    UPDATE homework_submissions SET
      file_id = :file_id,
      corrected_file_id = : corrected_file_id,
      teacher_comment_md = :teacher_comment_md,
      student_id = :student_id,
      homework_id = :homework_id
    WHERE id = ?;`),

  DEL: db.prepare("DELETE FROM homework_submissions WHERE id = ?;"),
};

module.exports = Object.freeze({
  create({
    file_id,
    corrected_file_id,
    teacher_comment_md,
    student_id,
    homework_id,
  }) {
    const { lastInsertRowid } = _sql.CREATE.run({
      file_id,
      corrected_file_id,
      teacher_comment_md,
      student_id,
      homework_id,
    });

    return lastInsertRowid;
  },

  getById(id) {
    return _sql.GET_BY_ID.get(id);
  },

  getByHomeworkId(id) {
    return _sql.GET_BY_HOMEWORK_ID.all(id);
  },

  update(id, homeworkSubmissionInput) {
    const { changes } = _sql.UPDATE.run(homeworkSubmissionInput, id);

    return Boolean(changes);
  },

  del(id) {
    const { changes } = _sql.DEL.run(id);

    return Boolean(changes);
  },
});
