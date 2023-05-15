const sqlite = require("../loaders/sqlite");

const db = sqlite();

const _sql = {
  CREATE: db.prepare(`
    INSERT INTO classes (
      name,
      subject,
      times,
      gender,
      description_md,
      registration_fee,
      registration_fee_offer,
      price_per_hour,
      hours_per_lesson,
      invoice_cycle,
      teacher_id,
      state,
      notes
    )
    VALUES (
      :name,
      :subject,
      :times,
      :gender,
      :description_md,
      :registration_fee,
      :registration_fee_offer,
      :price_per_hour,
      :hours_per_lesson,
      :invoice_cycle,
      :teacher_id,
      :state,
      :notes
    );`),

  GET_BY_ID: db.prepare(`SELECT * FROM classes WHERE id = ?;`),

  GET_ALL: db.prepare(`SELECT * FROM classes ORDER BY teacher_id ASC;`),

  UPDATE: db.prepare(`
    UPDATE classes SET
      name = :name,
      subject = :subject,
      times = :times,
      gender = :gender,
      description_md = :description_md,
      registration_fee = :registration_fee,
      registration_fee_offer = :registration_fee_offer,
      price_per_hour = :price_per_hour,
      hours_per_lesson = :hours_per_lesson,
      invoice_cycle = :invoice_cycle,
      teacher_id = :teacher_id,
      state = :state,
      notes = :notes
    WHERE id = ?;`),

  DEL: db.prepare(`DELETE FROM classes WHERE id = ?;`),

  GET_TOTAL_TAUGHT_TIME: db.prepare(`
    SELECT
      (SUM(date_to - date_from) / 3600)
    AS
      taught_time
    FROM
      lessons
    WHERE
      class_id = ?;`),

  GET_HOURS_UNTIL_NEXT_INVOICE: db.prepare(`
    SELECT
      (SELECT invoice_cycle FROM classes WHERE id = :id) - (
        (SELECT
          (SUM(date_to - date_from) / 3600)
        FROM
          lessons
        WHERE
          class_id = :id) %
        (SELECT invoice_cycle FROM classes WHERE id = :id)
      ) AS hours`),

  GET_LAST_INVOICE_AT: db.prepare(`
    SELECT
      invoices.created_at
    FROM
      order_items
    INNER JOIN
      orders ON orders.id = order_items.order_id
    INNER JOIN
      invoices ON invoices.order_id = orders.id
    WHERE
      order_items.class_id = :id
    ORDER BY
      invoices.created_at
    DESC LIMIT 1;
  `),
};

module.exports = Object.freeze({
  create({
    name = "",
    subject,
    times,
    gender,
    description_md = "",
    registration_fee,
    registration_fee_offer,
    price_per_hour,
    hours_per_lesson,
    invoice_cycle,
    teacher_id,
    state = 0,
    notes = "",
  }) {
    const { lastInsertRowid } = _sql.CREATE.run({
      name,
      subject,
      times,
      gender,
      description_md,
      registration_fee,
      registration_fee_offer,
      price_per_hour,
      hours_per_lesson,
      invoice_cycle,
      teacher_id,
      state,
      notes,
    });

    return lastInsertRowid;
  },

  getById(id) {
    return _sql.GET_BY_ID.get(id);
  },

  getAll() {
    return _sql.GET_ALL.all();
  },

  getTotalTaughtTime(id) {
    return _sql.GET_TOTAL_TAUGHT_TIME.get(id);
  },

  getHoursUntilNextInvoice(id) {
    const { hours } = _sql.GET_HOURS_UNTIL_NEXT_INVOICE.get({ id });

    return hours || 0;
  },

  getLastInvoiceAt(id) {
    const result = _sql.GET_LAST_INVOICE_AT.get({ id });

    return result ? result.created_at : null;
  },

  update(id, classInput) {
    const { changes } = _sql.UPDATE.run(classInput, id);

    return Boolean(changes);
  },

  del(id) {
    const { changes } = _sql.DEL.run(id);

    return Boolean(changes);
  },
});
