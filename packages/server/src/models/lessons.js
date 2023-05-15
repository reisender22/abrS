const sqlite = require("../loaders/sqlite");

const db = sqlite();

const _sql = {
  CREATE: db.prepare(`
    INSERT INTO lessons (
      date_from,
      date_to,
      title,
      notes_md,
      homeworks_md,
      class_id
    )
    VALUES (
      :date_from,
      :date_to,
      :title,
      :notes_md,
      :homeworks_md,
      :class_id
    );`),

  GET_BY_ID: db.prepare(`SELECT * FROM lessons WHERE id = ?;`),

  GET_BY_CLASS_ID: db.prepare(`
    SELECT
      *
    FROM
      lessons
    WHERE
      class_id = :class_id AND
      id > :offset
    ORDER BY
      id DESC
    LIMIT :page_size;`),

  UPDATE: db.prepare(`
    UPDATE lessons SET
      date_from = :date_from,
      date_to = :date_to,
      title = :title,
      notes_md = :notes_md,
      homeworks_md = :homeworks_md,
      class_id = :class_id
    WHERE id = ?;`),

  DEL: db.prepare("DELETE FROM lessons WHERE id = ?;"),
};

module.exports = Object.freeze({
  create({
    date_from,
    date_to,
    title,
    notes_md = '',
    homeworks_md = '',
    class_id,
  }) {
    const { lastInsertRowid } = _sql.CREATE.run({
      date_from,
      date_to,
      title,
      notes_md,
      homeworks_md,
      class_id,
    });

    return lastInsertRowid;
  },

  getById(id) {
    return _sql.GET_BY_ID.get(id);
  },

  getByClassId(class_id, { offset = 0, page_size = 5 } = {}) {
    return _sql.GET_BY_CLASS_ID.all({ class_id, offset, page_size });
  },

  update(id, lessonInput) {
    const { changes } = _sql.UPDATE.run(lessonInput, id);

    return Boolean(changes);
  },

  del(id) {
    const { changes } = _sql.DEL.run(id);

    return Boolean(changes);
  },
});
