const sqlite = require("../loaders/sqlite");

const db = sqlite();

const _sql = {
  CREATE: db.prepare(`
    INSERT INTO orders (
      student_id,
      notes
    )
    VALUES (
      :student_id,
      :notes
    );`),

  CREATE_ITEM: db.prepare(`
    INSERT INTO order_items (
      description,
      price,
      quantity,
      class_id,
      order_id
      )
      VALUES (
        :description,
        :price,
        :quantity,
        :class_id,
        :order_id
        );`),

  GET_BY_ID: db.prepare(`SELECT * FROM orders WHERE id = ?;`),

  GET_FREE_HOURS: db.prepare(`
    SELECT 
      (SELECT
	      SUM(order_items.quantity)
      FROM
        order_items
      INNER JOIN
        orders ON orders.id = order_items.id
      LEFT JOIN
        invoices ON invoices.order_id = orders.id
      WHERE
	      orders.student_id = :student_id AND
	      order_items.class_id = :class_id AND
        (invoices.state IS NULL OR invoices.state != 2))
      -
      (SELECT
        (SUM(lessons.date_to - lessons.date_from) / 3600)
      FROM
        lessons
      INNER JOIN
        sessions ON sessions.lesson_id = lessons.id
      WHERE
        lessons.class_id = :class_id AND
        sessions.student_id = :student_id)
      AS free_hours;
  `),

  GET_LAST_PRICE_PER_HOUR: db.prepare(`
    SELECT
      order_items.price
    FROM
      order_items
    INNER JOIN
      orders ON orders.id = order_items.order_id
    INNER JOIN
      invoices ON invoices.order_id = orders.id
    WHERE
      orders.student_id = :student_id AND
      invoices.state != 2 AND
      order_items.class_id = :class_id
    ORDER BY
      order_items.id DESC
    LIMIT 1;
  `),
};

module.exports = Object.freeze({
  create({ student_id, items, notes = "" }) {
    return db.transaction((student_id, notes, items) => {
      const { lastInsertRowid } = _sql.CREATE.run({
        student_id,
        notes,
      });

      for (const item of items) {
        _sql.CREATE_ITEM.run({
          class_id: null,
          ...item,
          order_id: lastInsertRowid,
        });
      }

      return lastInsertRowid;
    })(student_id, notes, items);
  },

  getById(id) {
    return _sql.GET_BY_ID.get(id);
  },

  getFreeHoursByStudentAndClassId(student_id, class_id) {
    const { free_hours } = _sql.GET_FREE_HOURS.get({ student_id, class_id });

    return !free_hours || free_hours < 0 ? 0 : free_hours;
  },

  getLastPricePerHourByStudentAndClassId(student_id, class_id) {
    const result = _sql.GET_LAST_PRICE_PER_HOUR.get({
      student_id,
      class_id,
    });

    return result ? result.price : 0;
  },
});
