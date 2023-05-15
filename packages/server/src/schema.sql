CREATE TABLE IF NOT EXISTS users (
  id                       INTEGER PRIMARY KEY,
  email                    TEXT    NOT NULL UNIQUE CHECK (email LIKE '%_@__%.__%'),
  password                 TEXT    NOT NULL,
  gender                   INTEGER NOT NULL CHECK (gender IN (0, 1 ,2)) DEFAULT 0,
  -- 0: NOT_SPECIFIED
  -- 1: MALE
  -- 2: FEMALE
  first_name               TEXT    NOT NULL DEFAULT '',
  last_name                TEXT    NOT NULL DEFAULT '',
  address_line_1           TEXT    NOT NULL DEFAULT '',
  address_line_2           TEXT    NOT NULL DEFAULT '',
  postal_code              TEXT    NOT NULL DEFAULT '',
  locality                 TEXT    NOT NULL DEFAULT '',
  administrative_area      TEXT    NOT NULL DEFAULT '',
  country                  TEXT    NOT NULL DEFAULT '',
  phone_number             TEXT    NOT NULL DEFAULT '',
  role                     INTEGER NOT NULL CHECK (role IN (0, 1, 2)) DEFAULT 2,
  -- 0: ADMIN
  -- 1: TEACHER
  -- 2: STUDENT
  is_email_verified        INTEGER NOT NULL CHECK (is_email_verified IN (0, 1)) DEFAULT 0,
  is_registration_fee_paid INTEGER NOT NULL CHECK (is_registration_fee_paid IN (0, 1)) DEFAULT 0,
  is_locked                INTEGER NOT NULL CHECK (is_locked IN (0, 1)) DEFAULT 0,
  notes                    TEXT    NOT NULL DEFAULT '',
  last_login_at            INTEGER NOT NULL DEFAULT (strftime('%s','now')), 
  updated_at               INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  created_at               INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS notifications (
  id           INTEGER PRIMARY KEY,
  title        TEXT    NOT NULL,
  body         TEXT    NOT NULL,
  url          TEXT    NOT NULL,
  level        TEXT    NOT NULL CHECK (level IN ('INFO', 'ERROR')) DEFAULT 'INFO',
  is_dismissed INTEGER NOT NULL CHECK (is_dismissed IN (0, 1)) DEFAULT 0,
  user_id      INTEGER NOT NULL,
  created_at   INTEGER NOT NULL DEFAULT (strftime('%s','now')),

  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_comments (
  id         INTEGER PRIMARY KEY,
  body_md    TEXT    NOT NULL DEFAULT '',
  author_id  INTEGER NOT NULL,
  user_id    INTEGER NOT NULL,
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),

  FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS classes (
  id                     INTEGER PRIMARY KEY,
  subject                TEXT    NOT NULL,
  level                  TEXT    NOT NULL DEFAULT '',
  times                  TEXT    NOT NULL,
  -- e.g.
  -- 'FRI 12:00-14:00'
  -- 'TUE 18:00-20:00,SAT 11:00-13:00'
  name                   TEXT    NOT NULL DEFAULT '',
  gender                 INTEGER NOT NULL CHECK (gender IN (0, 1 ,2)) DEFAULT 0,
  -- 0: NOT_SPECIFIED
  -- 1: MALE
  -- 2: FEMALE
  description_md         TEXT    NOT NULL DEFAULT '',
  registration_fee       INTEGER NOT NULL CHECK (registration_fee >= 0) DEFAULT 2500,
  registration_fee_offer INTEGER CHECK (registration_fee_offer >= 0) DEFAULT NULL,
  price_per_hour         INTEGER NOT NULL CHECK (price_per_hour >= 0) DEFAULT 0,
  hours_per_lesson       INTEGER          CHECK (hours_per_lesson > 0) DEFAULT NULL,
  invoice_cycle          INTEGER NOT NULL CHECK (invoice_cycle >= 1) DEFAULT 8,
  teacher_id             INTEGER NOT NULL,
  state                  INTEGER NOT NULL CHECK (state IN (0, 1, 2, 3, 4)) DEFAULT 0,
  -- 0: IN_PREPARATION
  -- 1: OPEN_FOR_REGISTRATION
  -- 2: ONGOING
  -- 3: COMPLETED
  -- 4: CANCELLED
  notes                  TEXT    NOT NULL DEFAULT '',
  updated_at             INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  created_at             INTEGER NOT NULL DEFAULT (strftime('%s','now')),

  FOREIGN KEY (teacher_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS lessons (
  id           INTEGER PRIMARY KEY,
  date_from    INTEGER NOT NULL,
  date_to      INTEGER NOT NULL,
  title        TEXT    NOT NULL,
  notes_md     TEXT    NOT NULL DEFAULT '',
  homeworks_md TEXT    NOT NULL DEFAULT '',
  class_id     INTEGER NOT NULL,
  updated_at   INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  created_at   INTEGER NOT NULL DEFAULT (strftime('%s','now')),

  FOREIGN KEY (class_id) REFERENCES classes (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
  id         INTEGER PRIMARY KEY,
  body_md    TEXT    NOT NULL DEFAULT '',
  lesson_id  INTEGER NOT NULL,
  user_id    INTEGER          DEFAULT NULL,
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),

  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL,
  FOREIGN KEY (lesson_id) REFERENCES lessons (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS enrollments (
  id                    INTEGER PRIMARY KEY,
  custom_price_per_hour INTEGER CHECK (custom_price_per_hour >= 0) DEFAULT NULL,
  student_id            INTEGER NOT NULL,
  class_id              INTEGER NOT NULL,
  notes                 TEXT    NOT NULL DEFAULT '',
  
  FOREIGN KEY (student_id) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (class_id) REFERENCES classes (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sessions (
  id                INTEGER PRIMARY KEY,
  attendance        INTEGER CHECK (attendance IN (0, 1, 2, 3)) DEFAULT NULL,
  -- 0: PRESENT
  -- 1: ABSENT
  -- 2: EXCUSED
  -- 3: PASSIVE
  has_done_homework INTEGER NOT NULL,
  student_id        INTEGER NOT NULL,
  lesson_id         INTEGER NOT NULL,
  notes             TEXT    NOT NULL DEFAULT '',
  created_at        INTEGER NOT NULL DEFAULT (strftime('%s','now')),

  FOREIGN KEY (student_id) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (lesson_id) REFERENCES lessons (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS files (
  id             INTEGER PRIMARY KEY,
  name           TEXT NOT NULL,
  mime_type      TEXT NOT NULL DEFAULT '',
  file_bucket_id INTEGER NOT NULL,

  FOREIGN KEY (file_bucket_id) REFERENCES file_buckets (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS file_buckets (
  id   INTEGER PRIMARY KEY,
  name TEXT    NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS homeworks (
  id             INTEGER PRIMARY KEY,
  description_md TEXT    NOT NULL DEFAULT '',
  lesson_id      INTEGER NOT NULL,
  due_at         INTEGER NOT NULL,
  created_at     INTEGER NOT NULL DEFAULT (strftime('%s','now')),

  FOREIGN KEY (lesson_id) REFERENCES lessons (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS homework_submissions (
  id                 INTEGER PRIMARY KEY,
  file_id            INTEGER NOT NULL,
  corrected_file_id  INTEGER NOT NULL,
  teacher_comment_md TEXT    NOT NULL DEFAULT '',
  student_id         INTEGER NOT NULL,
  homework_id        INTEGER NOT NULL,
  created_at         INTEGER NOT NULL DEFAULT (strftime('%s','now')),

  FOREIGN KEY (file_id) REFERENCES files (id) ON DELETE CASCADE,
  FOREIGN KEY (corrected_file_id) REFERENCES files (id) ON DELETE SET NULL,
  FOREIGN KEY (student_id) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (homework_id) REFERENCES homeworks (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders (
  id          INTEGER PRIMARY KEY,
	amount      INTEGER NOT NULL CHECK (amount >= 0) DEFAULT 0,
  notes       TEXT    NOT NULL DEFAULT '',
  student_id  INTEGER NOT NULL,
  created_at  INTEGER NOT NULL DEFAULT (strftime('%s','now')),

  FOREIGN KEY (student_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_items (
  id          INTEGER PRIMARY KEY,
  description TEXT    NOT NULL,
  price       INTEGER NOT NULL,
  quantity    INTEGER NOT NULL CHECK (quantity > 0) DEFAULT 1,
	amount      INTEGER NOT NULL DEFAULT 0,
  class_id    INTEGER          DEFAULT NULL,
  order_id    INTEGER NOT NULL,

  FOREIGN KEY (class_id) REFERENCES classes (id) ON DELETE SET NULL,
  FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS invoices (
  id                           INTEGER PRIMARY KEY,
  state                        INTEGER NOT NULL CHECK (state IN (0, 1, 2)) DEFAULT 0,
  -- 0: OPEN
  -- 1: PAID
  -- 2: VOID
	amount                       INTEGER NOT NULL CHECK (amount >= 0) DEFAULT 0,
  customer_gender              INTEGER NOT NULL CHECK (customer_gender IN (0, 1 ,2)) DEFAULT 0,
  -- 0: NOT_SPECIFIED
  -- 1: MALE
  -- 2: FEMALE
  customer_first_name          TEXT    NOT NULL DEFAULT '',
  customer_last_name           TEXT    NOT NULL DEFAULT '',
  customer_address_line_1      TEXT    NOT NULL DEFAULT '',
  customer_address_line_2      TEXT    NOT NULL DEFAULT '',
  customer_postal_code         TEXT    NOT NULL DEFAULT '',
  customer_locality            TEXT    NOT NULL DEFAULT '',
  customer_administrative_area TEXT    NOT NULL DEFAULT '',
  customer_country             TEXT    NOT NULL DEFAULT '',
  customer_phone_number        TEXT    NOT NULL DEFAULT '',
  due_at                       INTEGER          DEFAULT (strftime('%s', 'now', '+29 days', 'start of day') - 1),
  notes                        TEXT    NOT NULL DEFAULT '',
  order_id                     INTEGER,
  student_id                   INTEGER          DEFAULT NULL,
  created_at                   INTEGER NOT NULL DEFAULT (strftime('%s','now')),

  FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE SET NULL,
  FOREIGN KEY (student_id) REFERENCES users (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS invoice_items (
  id          INTEGER PRIMARY KEY,
  description TEXT    NOT NULL,
  price       INTEGER NOT NULL,
  quantity    INTEGER NOT NULL CHECK (quantity > 0) DEFAULT 1,
	amount      INTEGER NOT NULL DEFAULT 0,
  invoice_id  INTEGER NOT NULL,

  FOREIGN KEY (invoice_id) REFERENCES invoices (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payments (
  id              INTEGER PRIMARY KEY,
	amount          INTEGER NOT NULL CHECK (amount >= 0) DEFAULT 0,
  description     TEXT    NOT NULL DEFAULT '',
  paypal_order_id TEXT    DEFAULT NULL,
  invoice_id      INTEGER NOT NULL,
  notes           TEXT    NOT NULL DEFAULT '',
  created_at      INTEGER NOT NULL DEFAULT (strftime('%s','now')),

  FOREIGN KEY (invoice_id) REFERENCES invoices (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS email_notifications (
  id         INTEGER PRIMARY KEY,
  subject    TEXT    NOT NULL,
  status     INTEGER NOT NULL CHECK (status IN (0, 1)),
  user_id    INTEGER          DEFAULT NULL,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),

  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS settings (
  name  TEXT NOT NULL UNIQUE,
  value TEXT DEFAULT NULL
);


----------------------------------------
-- Triggers
----------------------------------------

CREATE TRIGGER IF NOT EXISTS email_to_lowercase_insert AFTER INSERT ON users
  BEGIN
    UPDATE users SET email = lower(NEW.email) WHERE id = NEW.id;
  END;

CREATE TRIGGER IF NOT EXISTS email_to_lowercase_update AFTER UPDATE ON users
  BEGIN
    UPDATE users SET email = lower(NEW.email) WHERE id = NEW.id;
  END;

CREATE TRIGGER IF NOT EXISTS update_date_on_users AFTER UPDATE ON users
  WHEN OLD.last_login_at = NEW.last_login_at
  BEGIN
    UPDATE users SET updated_at = (strftime('%s','now')) WHERE id = NEW.id;
  END;

-- 

CREATE TRIGGER IF NOT EXISTS check_is_teacher BEFORE INSERT ON classes
  BEGIN
    SELECT CASE WHEN
      (SELECT role FROM users WHERE id = NEW.teacher_id) != 1
    THEN
      RAISE (ABORT, 'INVALID_TEACHER')
    END;
  END;

CREATE TRIGGER IF NOT EXISTS update_order_item_and_order AFTER INSERT ON order_items
  BEGIN
    UPDATE order_items SET amount = NEW.price * NEW.quantity WHERE id = NEW.id;

    UPDATE orders SET amount =
      (SELECT SUM(amount) FROM order_items WHERE order_id = NEW.order_id)
    WHERE id = NEW.order_id;
  END;

CREATE TRIGGER IF NOT EXISTS check_order_amount_is_not_zero BEFORE INSERT ON invoices
  BEGIN
    SELECT CASE WHEN
      (SELECT amount FROM orders WHERE id = NEW.order_id) = 0
    THEN
      RAISE (ABORT, 'ORDER_TOTAL_IS_ZERO')
    END;
  END;

CREATE TRIGGER IF NOT EXISTS insert_address_into_invoice AFTER INSERT ON invoices
  BEGIN
    UPDATE invoices SET
      amount = (SELECT amount FROM orders WHERE id = NEW.order_id),
      student_id = (SELECT student_id FROM orders WHERE id = NEW.order_id)
    WHERE id = NEW.id;
    
    UPDATE invoices SET (
      customer_gender,
      customer_first_name,
      customer_last_name,
      customer_address_line_1,
      customer_address_line_2,
      customer_postal_code,
      customer_locality,
      customer_administrative_area,
      customer_country,
      customer_phone_number
    ) = (
      SELECT
        gender,
        first_name,
        last_name,
        address_line_1,
        address_line_2,
        postal_code,
        locality,
        administrative_area,
        country,
        phone_number
      FROM users WHERE id = (SELECT student_id FROM orders WHERE id = NEW.order_id)
    ) WHERE id = NEW.id;

    INSERT INTO invoice_items (
      description,
      price,
      quantity,
      amount,
      invoice_id
    ) SELECT
      order_items.description,
      order_items.price,
      order_items.quantity,
      order_items.amount,
      NEW.id
    FROM order_items WHERE order_items.order_id = NEW.order_id;
  END;

CREATE TRIGGER IF NOT EXISTS mark_invoice_as_paid AFTER INSERT ON payments
  WHEN
    (SELECT TOTAL(amount) FROM payments WHERE invoice_id = NEW.invoice_id) >= (SELECT amount FROM invoices WHERE id = NEW.invoice_id)
  BEGIN
    UPDATE invoices SET state = 1 WHERE id = NEW.invoice_id;
  END;

CREATE TRIGGER IF NOT EXISTS mark_invoice_as_open AFTER DELETE ON payments
  WHEN
    (SELECT TOTAL(amount) FROM payments WHERE invoice_id = OLD.invoice_id) < (SELECT amount FROM invoices WHERE id = OLD.invoice_id)
  BEGIN
    UPDATE invoices SET state = 0 WHERE id = OLD.invoice_id;
  END;


--

INSERT OR IGNORE INTO settings
  (name, value)
VALUES
  ('SMTP_HOST', 'smtp.gmail.com'),
  ('SMTP_PORT', '465'),
  ('SMTP_USER', 'example@example.com'),
  ('SMTP_PASS', '926731@RAIN.kr'),
  ('EMAIL_TEMPLATE_STUDENT_SIGN_UP_PAYPAL_SUBJECT', 'Miftahul Ilm: Anmeldung erfolgreich'),
  ('EMAIL_TEMPLATE_STUDENT_SIGN_UP_PAYPAL_TEXT', 'Salam Alaykum :first_name'),
  ('EMAIL_TEMPLATE_STUDENT_SIGN_UP_BANK_TRANSFER_SUBJECT', 'Miftahul Ilm: Anmeldung erfolgreich'),
  ('EMAIL_TEMPLATE_STUDENT_SIGN_UP_BANK_TRANSFER_TEXT', 'Salam Alaykum :first_name'),
  ('EMAIL_TEMPLATE_REGISTRATION_FEE_PAID_SUBJECT', 'Miftahul Ilm: Anmeldung erfolgreich'),
  ('EMAIL_TEMPLATE_REGISTRATION_FEE_PAID_TEXT', 'Salam Alaykum :first_name'),
  ('EMAIL_TEMPLATE_NEW_INVOICE_SUBJECT', 'Rechnung'),
  ('EMAIL_TEMPLATE_NEW_INVOICE_TEXT', 'Salam Alaykum :first_name'),
  ('EMAIL_TEMPLATE_INVOICE_REMINDER_SUBJECT', 'Rechnung'),
  ('EMAIL_TEMPLATE_INVOICE_REMINDER_TEXT', 'Salam Alaykum :first_name');
