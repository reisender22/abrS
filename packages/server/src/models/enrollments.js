const sqlite = require("../loaders/sqlite");

const db = sqlite();

const _sql = {
  CREATE: db.prepare(`
    INSERT INTO enrollments (
      custom_price_per_hour,
      student_id,
      class_id,
      notes
    )
    VALUES (
      :custom_price_per_hour,
      :student_id,
      :class_id,
      :notes
    );`),

  GET_BY_ID: db.prepare(`SELECT * FROM enrollments WHERE id = ?;`),

  GET_BY_CLASS_ID: db.prepare(`SELECT * FROM enrollments WHERE class_id = ?;`),

  GET_ATTENDANCE_STATS: db.prepare(`
    SELECT
	    sessions.attendance,
	    COUNT(*) AS count
    FROM
      sessions
    INNER JOIN
      lessons ON sessions.lesson_id = lessons.id
    WHERE
      lessons.class_id = :class_id AND
    	student_id = :student_id
    GROUP BY
      attendance;`),

  GET_HOMEWORK_STATS: db.prepare(`
    SELECT
	    sessions.has_done_homework,
	    COUNT(*) AS count
    FROM
    	sessions
    INNER JOIN
      lessons ON sessions.lesson_id = lessons.id
    WHERE
      lessons.class_id = :class_id AND
    	student_id = :student_id
    GROUP BY
    	has_done_homework;`),

  UPDATE: db.prepare(`
    UPDATE enrollments SET
      custom_price_per_hour = :custom_price_per_hour,
      notes = :notes
    WHERE id = ?;`),

  DEL: db.prepare(`DELETE FROM enrollments WHERE id = ?;`),
};

module.exports = Object.freeze({
  create({ custom_price_per_hour, student_id, class_id, notes = "" }) {
    const { lastInsertRowid } = _sql.CREATE.run({
      custom_price_per_hour,
      student_id,
      class_id,
      notes,
    });

    return lastInsertRowid;
  },

  getById(id) {
    return _sql.GET_BY_ID.get(id);
  },

  getByClassId(id) {
    return _sql.GET_BY_CLASS_ID.all(id);
  },

  getAttendanceStatsByStudentId(student_id, class_id) {
    return _sql.GET_ATTENDANCE_STATS.all({ student_id, class_id });
  },

  getHomeworkStatsByStudentId(student_id, class_id) {
    return _sql.GET_HOMEWORK_STATS.all({ student_id, class_id });
  },

  update(id, enrollmentInput) {
    const { changes } = _sql.UPDATE.run(enrollmentInput, id);

    return Boolean(changes);
  },

  del(id) {
    const { changes } = _sql.DEL.run(id);

    return Boolean(changes);
  },
});
