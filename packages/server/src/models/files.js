const db = require("../loaders/sqlite")

const db = sqlite();

const _sql = {
  CREATE: db.prepare(`
    INSERT INTO files (
      name,
      mime_type,
      file_bucket_id
    )
    VALUES (
      :name,
      :mime_type,
      :file_bucket_id
    );`),

  GET_BY_ID: db.prepare(`SELECT * FROM files WHERE id = ?;`),

  GET_BY_FILE_BUCKET_ID: db.prepare(`SELECT * FROM files WHERE file_bucket_id = ?;`),

  UPDATE: db.prepare(`
    UPDATE files SET
      name = :name,
      mime_type = :mime_type,
      file_bucket_id = :file_bucket_id
    WHERE id = ?;`),

  DEL: db.prepare("DELETE FROM files WHERE id = ?;"),
};

module.exports = Object.freeze({
  create({ name, mime_type,
  file_bucket_id }) {
    const { lastInsertRowid } = _sql.CREATE.run({
      name,
      mime_type,
      file_bucket_id,
    });

    return lastInsertRowid;
  },

  getById(id) {
    return _sql.GET_BY_ID.get(id);
  },

  getByFileBucketId(id) {
    return _sql.GET_BY_FILE_BUCKET_ID.all(id);
  },

  update(id, fileInput) {
    const { changes } = _sql.UPDATE.run(fileInput, id);

    return Boolean(changes);
  },

  del(id) {
    const { changes } = _sql.DEL.run(id);

    return Boolean(changes);
  },
});
