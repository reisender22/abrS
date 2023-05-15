const sqlite = require("../loaders/sqlite");

const db = sqlite();

const _sql = {
  CREATE: db.prepare(`
    INSERT INTO invoices (
      due_at,
      notes,
      order_id
    )
    VALUES (
      :due_at,
      :notes,
      :order_id
    );`),

  GET_BY_ID: db.prepare(`SELECT * FROM invoices WHERE id = ?;`),

  GET_BY_STATUS: db.prepare(`
    SELECT
      invoices.*,
      classes.id AS class_id
    FROM
      invoices
    INNER JOIN
      order_items ON invoices.order_id = order_items.order_id
    LEFT JOIN
      classes ON order_items.class_id = classes.id
    WHERE
      invoices.state = :state AND
      invoices.id > :offset
    GROUP BY
      invoices.id
    ORDER 
      BY invoices.id DESC
    LIMIT
      :page_size;`),

  GET_BY_USER_ID: db.prepare(`
    SELECT
      *
    FROM
      invoices
    WHERE
      student_id = :student_id AND
      id > :offset
    ORDER BY
      id DESC
    LIMIT
      :page_size;`),

  GET_ALL: db.prepare(`
    SELECT
      invoices.*,
      classes.id AS class_id
    FROM
      invoices
    INNER JOIN
      order_items ON invoices.order_id = order_items.order_id
    INNER JOIN
      classes ON order_items.class_id = classes.id
    WHERE
      invoices.id > :offset
    ORDER BY
      invoices.id DESC
    LIMIT
      :page_size;`),

  UPDATE: db.prepare(`
    UPDATE invoices SET
      state = :state,
      notes = :notes
    WHERE id = ?;`),

  DEL: db.prepare(`DELETE FROM invoices WHERE id = ?;`),

  GET_ITEMS_BY_INVOICE_ID: db.prepare(
    `SELECT * FROM invoice_items WHERE invoice_id = ?;`
  ),
};

module.exports = Object.freeze({
  create({ order_id = null, due_at = null, notes = "" }) {
    const { lastInsertRowid } = _sql.CREATE.run({
      order_id,
      due_at,
      notes,
    });

    return lastInsertRowid;
  },

  getById(id) {
    const invoice = _sql.GET_BY_ID.get(id);
    const items = _sql.GET_ITEMS_BY_INVOICE_ID.all(id);

    return { ...invoice, items };
  },

  getByStatus(state = 0, { offset = 0, page_size = 25 } = {}) {
    const invoices = _sql.GET_BY_STATUS.all({ state, offset, page_size });

    const params = "?,".repeat(invoices.length).slice(0, -1);

    const items = db
      .prepare(`SELECT * FROM invoice_items WHERE invoice_id IN(${params})`)
      .all(invoices.map(({ id }) => id));

    return invoices.map((invoice) => ({
      ...invoice,
      items: items.filter(({ invoice_id }) => invoice_id === invoice.id),
    }));
  },

  getByStudentId(student_id, { offset = 0, page_size = 100 } = {}) {
    const invoices = _sql.GET_BY_USER_ID.all({ student_id, offset, page_size });

    const params = "?,".repeat(invoices.length).slice(0, -1);

    const items = db
      .prepare(`SELECT * FROM invoice_items WHERE invoice_id IN(${params})`)
      .all(invoices.map(({ id }) => id));

    return invoices.map((invoice) => ({
      ...invoice,
      items: items.filter(({ invoice_id }) => invoice_id === invoice.id),
    }));
  },

  getAll({ offset = 0, page_size = 25 } = {}) {
    const invoices = _sql.GET_ALL.all({ offset, page_size });

    console.log(invoices);

    const params = "?,".repeat(invoices.length).slice(0, -1);

    const items = db
      .prepare(`SELECT * FROM invoice_items WHERE invoice_id IN(${params})`)
      .all(invoices.map(({ id }) => id));

    return invoices.map((invoice) => ({
      ...invoice,
      items: items.filter(({ invoice_id }) => invoice_id === invoice.id),
    }));
  },

  getBySearchQuery(query, { state = [0, 1, 2], page_size = 5 } = {}) {
    let params = "?,".repeat(state.length).slice(0, -1);

    const pattern = `%${query}%`;

    const stmt = db.prepare(`
      SELECT
        *
      FROM
        invoices
      WHERE
        id = ${Number(query) ? Number(query) : 0} OR
        lower(customer_first_name) LIKE lower('${pattern}') OR
        lower(customer_last_name) LIKE lower('${pattern}') OR
        lower(customer_address_line_1) LIKE lower('${pattern}') OR
        lower(customer_address_line_2) LIKE lower('${pattern}') OR
        lower(customer_postal_code) LIKE lower('${pattern}') OR
        lower(customer_locality) LIKE lower('${pattern}')
      ORDER BY
        id DESC  
      LIMIT
        :page_size;
      `);

    const invoices = stmt.all({ page_size });

    params = "?,".repeat(invoices.length).slice(0, -1);

    const items = db
      .prepare(`SELECT * FROM invoice_items WHERE invoice_id IN(${params})`)
      .all(invoices.map(({ id }) => id));

    return invoices.map((invoice) => ({
      ...invoice,
      items: items.filter(({ invoice_id }) => invoice_id === invoice.id),
    }));
  },

  update(id, invoiceInput) {
    const { changes } = _sql.UPDATE.run(invoiceInput, id);

    return Boolean(changes);
  },

  del(id) {
    const { changes } = _sql.DEL.run(id);

    return Boolean(changes);
  },
});
