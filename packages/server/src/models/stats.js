const sqlite = require("../loaders/sqlite");

const db = sqlite();

const _sql = {
  SALES_MONTH: db.prepare(`
    SELECT
      strftime('%m-%Y', datetime(created_at, 'unixepoch')) AS month,
      sum(amount) AS sales,
      created_at
    FROM
      payments
    GROUP BY
      month
    ORDER BY
      created_at DESC;`),

  SALES_YEAR: db.prepare(`
    SELECT
      strftime('%Y', datetime(created_at, 'unixepoch')) AS year,
      sum(amount) AS sales,
      created_at
    FROM
      payments
    GROUP BY
      year
    ORDER BY
      created_at DESC;`),

  STUDENTS: db.prepare(
    `SELECT COUNT(*) AS count FROM users WHERE role = 2 AND is_registration_fee_paid = 1;`
  ),

  TEACHER: db.prepare(`SELECT COUNT(*) AS count FROM users WHERE role = 1;`),

  CLASSES: db.prepare(`SELECT COUNT(*) AS count FROM classes;`),

  INVOICES: db.prepare(
    `SELECT COUNT(*) AS count FROM invoices WHERE state = 0;`
  ),

  INVOICES_AMOUNT: db.prepare(
    `SELECT SUM(amount) AS amount FROM invoices WHERE state = 0;`
  ),
};

module.exports = Object.freeze({
  getByMonth() {
    return _sql.SALES_MONTH.all();
  },

  getByYear() {
    return _sql.SALES_YEAR.all();
  },

  getNumberOfStudents() {
    const { count } = _sql.STUDENTS.get();

    return count ? count : 0;
  },

  getNumberOfTeachers() {
    const { count } = _sql.TEACHER.get();

    return count ? count : 0;
  },

  getNumberOfClasses() {
    const { count } = _sql.CLASSES.get();

    return count ? count : 0;
  },

  getNumberOfOpenInvoices() {
    const { count } = _sql.INVOICES.get();

    return count ? count : 0;
  },

  getAmountOfOpenInvoices() {
    const { amount } = _sql.INVOICES_AMOUNT.get();

    return amount ? amount : 0;
  },
});
