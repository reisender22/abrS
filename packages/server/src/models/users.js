const sqlite = require("../loaders/sqlite");

const db = sqlite();

const _sql = {
  CREATE: db.prepare(`
    INSERT INTO users (
      email,
      password,
      gender,
      first_name,
      last_name,
      address_line_1,
      address_line_2,
      postal_code,
      locality,
      administrative_area,
      country,
      phone_number,
      role,
      is_registration_fee_paid,
      is_email_verified,
      is_locked,
      notes
    )
    VALUES (
      :email,
      :password,
      :gender,
      :first_name,
      :last_name,
      :address_line_1,
      :address_line_2,
      :postal_code,
      :locality,
      :administrative_area,
      :country,
      :phone_number,
      :role,
      :is_registration_fee_paid,
      :is_email_verified,
      :is_locked,
      :notes
    );`),

  GET_BY_ID: db.prepare(`SELECT * FROM users WHERE id = ?;`),

  GET_BY_EMAIL: db.prepare(`SELECT * FROM users WHERE email = ?;`),

  GET_BY_ROLE: db.prepare(`
    SELECT
      *
    FROM
      users
    WHERE
      role = :role AND
      id > :offset
    ORDER BY
      id DESC
    LIMIT :page_size;`),

  GET_BY_CLASS_ID: db.prepare(`
    SELECT
      users.*
    FROM
      classes
    INNER JOIN
      enrollments
    ON
      classes.id = enrollments.class_id
    INNER JOIN
      users
    ON
      enrollments.student_id = users.id;`),

  GET_ALL: db.prepare(`
    SELECT
      *
    FROM
      users
    WHERE
      id > :offset
    ORDER BY
      id DESC
    LIMIT :page_size;`),

  UPDATE: db.prepare(`
    UPDATE users SET
      email = :email,
      password = :password,
      gender = :gender,
      first_name = :first_name,
      last_name = :last_name,
      address_line_1 = :address_line_1,
      address_line_2 = :address_line_2,
      postal_code = :postal_code,
      locality = :locality,
      administrative_area = :administrative_area,
      country = :country,
      phone_number = :phone_number,
      role = :role,
      notes = :notes,
      is_registration_fee_paid = :is_registration_fee_paid,
      is_email_verified = :is_email_verified,
      is_locked = :is_locked
    WHERE id = ?;`),

  UPDATE_LAST_LOGIN_AT: db.prepare(
    `UPDATE users SET last_login_at = (strftime('%s','now')) WHERE id = ?;`
  ),

  DEL: db.prepare("DELETE FROM users WHERE id = ?;"),
};

module.exports = Object.freeze({
  create({
    email,
    password = "",
    gender = 0,
    first_name = "",
    last_name = "",
    address_line_1 = "",
    address_line_2 = "",
    postal_code = "",
    locality = "",
    administrative_area = "",
    country = "",
    phone_number = "",
    role = 2,
    is_registration_fee_paid = 0,
    is_email_verified = 0,
    is_locked = 0,
    notes = "",
  }) {
    const { lastInsertRowid } = _sql.CREATE.run({
      email,
      password,
      gender,
      first_name,
      last_name,
      address_line_1,
      address_line_2,
      postal_code,
      locality,
      administrative_area,
      country,
      phone_number,
      role,
      is_registration_fee_paid,
      is_email_verified,
      is_locked,
      notes,
    });

    return lastInsertRowid;
  },

  getById(id) {
    return _sql.GET_BY_ID.get(id);
  },

  getByEmail(email) {
    return _sql.GET_BY_EMAIL.get(email);
  },

  getByRole(role = 0, { offset = 0, page_size = 20 } = {}) {
    return _sql.GET_BY_ROLE.all({ role, offset, page_size });
  },

  getBySearchQuery(query, { roles = [0, 1, 2], page_size = 5 } = {}) {
    const params = "?,".repeat(roles.length).slice(0, -1);

    const stmt = db.prepare(`
      SELECT
        *
      FROM
        users
      WHERE
        role IN (${params}) AND (
          email LIKE lower(:query) OR
          lower(first_name) LIKE lower(:query) OR
          lower(last_name) LIKE lower(:query)
        )
      ORDER BY
        id DESC  
      LIMIT
        :page_size;
      `);

    return stmt.all(roles, {
      query: `%${query}%`,
      page_size,
    });
  },

  get({ offset = 0, page_size = 15 } = {}) {
    return _sql.GET_ALL.all({ offset, page_size });
  },

  getPasswordById(id) {
    const { password } = _sql.GET_PASSWORD_BY_ID.get(id);

    return password;
  },

  getPasswordByEmail(email) {
    const { password } = _sql.GET_PASSWORD_BY_EMAIL.get(email);

    return password;
  },

  update(id, userInput) {
    const { changes } = _sql.UPDATE.run(userInput, id);

    return Boolean(changes);
  },

  updatePassword(id, password) {
    const { changes } = _sql.UPDATE_PASSWORD.run(password, id);

    return Boolean(changes);
  },

  updateLastLoginAt(id) {
    const { changes } = _sql.UPDATE_LAST_LOGIN_AT.run(id);

    return Boolean(changes);
  },

  del(id) {
    const { changes } = _sql.DEL.run(id);

    return Boolean(changes);
  },
});
