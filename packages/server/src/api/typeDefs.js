const { gql } = require("apollo-server-express");

module.exports = gql`
  type Query {
    getStats: Stats!
    getUser(id: ID!): User
    getUsers(role: Role, offset: ID, page_size: Int): [User!]!
    searchUsers(query: String!, roles: [Role!], page_size: Int): [User!]!

    getClass(id: ID!): Class
    getClasses(teacher_id: ID, gender: Gender, state: ClassState): [Class!]!

    getInvoice(id: ID!): Invoice
    getInvoices(state: InvoiceState, offset: ID, page_size: Int): [Invoice!]!
    searchInvoices(query: String!, page_size: Int): [Invoice!]!

    getEmailNotifications(
      status: EmailNotificationStatus
      offset: ID
      page_size: Int
    ): [EmailNotification!]!
    getSettings: Settings!
  }

  type Mutation {
    signUpStudent(
      userInput: UserInput!
      class_id: ID!
      payByTransfer: Boolean
    ): User!

    requestPasswordReset(email: String!): String!
    resetPassword(token: String!): String!

    createUser(userInput: UserInput!, sendEmail: Boolean): User!
    updateUser(id: ID!, userInput: UserInput!): User!
    updateUserPassword(id: ID!, password: String!): Boolean!
    deleteUser(id: ID!): Boolean!
    createUserComment(userCommentInput: UserCommentInput!): UserComment!
    updateUserComment(id: ID!, body_md: String!): UserComment!
    deleteUserComment(id: ID!): Boolean!

    createClass(classInput: ClassInput!): Class!
    updateClass(id: ID!, classInput: ClassInput!): Class!
    deleteClass(id: ID!): Boolean!
    createEnrollment(student_id: ID!, class_id: ID!): Enrollment!
    updateEnrollment(id: ID!, custom_price_per_hour: Int!): Enrollment!
    delEnrollment(id: ID!): Boolean!
    requestClassChange(
      student_id: ID!
      currentClassId: ID!
      newClassId: ID!
    ): ClassChangeInvoiceInput!

    createFirstInvoices(id: ID!): Class!
    createLesson(
      lessonInput: LessonInput!
      sessionInputs: [SessionInput!]!
    ): Lesson!
    updateLesson(id: ID!, lessonInput: LessonInput!): Lesson!

    createInvoice(input: InvoiceInput!): Invoice
    voidInvoice(id: ID!): Invoice!
    unvoidInvoice(id: ID!): Invoice!
    resendInvoice(id: ID!): Boolean!
    createPayment(paymentInput: PaymentInput!): Payment!
    deletePayment(id: ID!): Boolean!

    updateSettings(settingsInput: SettingsInput!): Settings!
  }

  enum Gender {
    NOT_SPECIFIED
    MALE
    FEMALE
  }

  enum Role {
    ADMIN
    TEACHER
    STUDENT
  }

  enum Day {
    MON
    TUE
    WED
    THU
    FRI
    SAT
    SUN
  }

  enum ClassState {
    IN_PREPARATION
    OPEN_FOR_REGISTRATION
    ONGOING
    COMPLETED
    CANCELLED
  }

  enum Attendance {
    PRESENT
    ABSENT
    EXCUSED
    PASSIVE
  }

  enum InvoiceState {
    OPEN
    PAID
    VOID
  }

  enum EmailNotificationStatus {
    FAILURE
    SUCCESS
  }

  type Stats {
    salesByMonth: [MonthStat!]!
    salesByYear: [YearStat!]!
    students: Int!
    teachers: Int!
    classes: Int!
    openInvoices: Int!
    openInvoicesAmount: Int!
  }

  type MonthStat {
    month: String!
    sales: Int!
  }

  type YearStat {
    year: String!
    sales: Int!
  }

  type User {
    id: ID!
    email: String!
    gender: Gender!
    first_name: String!
    last_name: String!
    address_line_1: String!
    address_line_2: String!
    postal_code: String!
    locality: String!
    administrative_area: String!
    country: String!
    phone_number: String!
    role: Role!
    is_email_verified: Boolean!
    is_registration_fee_paid: Boolean!
    is_locked: Boolean!
    comments: [UserComment!]!
    invoices(state: InvoiceState): [Invoice!]!
    last_login_at: Int!
    updated_at: Int!
    created_at: Int!
  }

  input UserInput {
    email: String!
    password: String
    gender: Gender
    first_name: String
    last_name: String
    address_line_1: String
    address_line_2: String
    postal_code: String
    locality: String
    administrative_area: String
    country: String
    phone_number: String
    role: Role
    is_email_verified: Boolean
    is_registration_fee_paid: Boolean
    is_locked: Boolean
  }

  type UserComment {
    id: ID!
    body_md: String!
    author: User
    updated_at: Int!
    created_at: Int!
  }

  input UserCommentInput {
    body_md: String!
    author_id: ID!
    user_id: ID!
  }

  type ClassTime {
    day: Day
    from: String!
    to: String!
  }

  input ClassTimeInput {
    day: Day
    from: String!
    to: String!
  }

  type Class {
    id: ID!
    subject: String!
    level: String!
    times: [ClassTime!]!
    name: String!
    gender: Gender!
    description_md: String!
    registration_fee: Int!
    registration_fee_offer: Int
    price_per_hour: Int!
    hours_per_lesson: Int
    invoice_cycle: Int!
    teacher: User!
    state: ClassState!
    notes: String!
    enrollments: [Enrollment!]!
    hoursUntilNextInvoice: Int!
    last_invoice_at: Int
    lessons(offset: ID, page_size: Int): [Lesson!]!
    updated_at: Int!
    created_at: Int!
  }

  input ClassInput {
    subject: String!
    level: String
    times: [ClassTimeInput!]!
    name: String
    gender: Gender!
    description_md: String
    registration_fee: Int
    registration_fee_offer: Int
    price_per_hour: Int!
    hours_per_lesson: Int
    invoice_cycle: Int!
    teacher_id: ID!
    state: ClassState
    notes: String
  }

  type Enrollment {
    id: ID!
    custom_price_per_hour: Int
    student: User!
    stats: EnrollmentStats
    notes: String!
  }

  type EnrollmentStats {
    attendance: AttendanceStats
    homeworks: HomeworkStats
  }

  type AttendanceStats {
    present: Int!
    absent: Int!
    excused: Int!
    passive: Int!
  }

  type HomeworkStats {
    done: Int!
    notDone: Int!
  }

  type Lesson {
    id: ID!
    date_from: Int!
    date_to: Int!
    title: String!
    notes_md: String!
    homeworks_md: String!
    updated_at: Int!
    created_at: Int!
  }

  input LessonInput {
    date_from: Int!
    date_to: Int!
    title: String!
    notes_md: String
    homeworks_md: String
    class_id: ID!
  }

  type Session {
    id: ID!
    attendance: Attendance!
    has_done_homework: Boolean!
    student: User!
    notes: String!
    created_at: Int!
  }

  input SessionInput {
    attendance: Attendance!
    has_done_homework: Boolean!
    student_id: ID!
    notes: String
  }

  type Payment {
    id: ID!
    amount: Int!
    description: String!
    notes: String!
    created_at: Int!
  }

  input PaymentInput {
    amount: Int!
    description: String!
    notes: String
    invoice_id: ID!
  }

  type Invoice {
    id: ID!
    state: InvoiceState!
    amount: Int!
    items: [InvoiceItem!]!
    customer_gender: Gender!
    customer_first_name: String!
    customer_last_name: String!
    customer_address_line_1: String!
    customer_address_line_2: String!
    customer_postal_code: String!
    customer_locality: String!
    customer_administrative_area: String!
    customer_country: String!
    customer_phone_number: String!
    due_at: Int
    notes: String!
    payments: [Payment!]!
    student: User
    clss: Class
    created_at: Int!
  }

  input InvoiceInput {
    student_id: ID!
    items: [InvoiceItemInput!]!
  }

  type InvoiceItem {
    description: String!
    price: Int!
    quantity: Int!
    amount: Int!
  }

  input InvoiceItemInput {
    description: String!
    price: Int!
    quantity: Int!
    class_id: ID
  }

  type ClassChangeInvoiceInput {
    student_id: ID!
    items: [ClassChangeInvoiceItemInput!]!
  }

  type ClassChangeInvoiceItemInput {
    description: String!
    price: Int!
    quantity: Int!
    class_id: ID
  }

  type EmailNotification {
    id: ID!
    subject: String!
    status: EmailNotificationStatus!
    user: User
    created_at: String!
  }

  type Settings {
    SMTP_HOST: String!
    SMTP_PORT: String!
    SMTP_USER: String!
    SMTP_PASS: String!
    EMAIL_TEMPLATE_STUDENT_SIGN_UP_PAYPAL_SUBJECT: String!
    EMAIL_TEMPLATE_STUDENT_SIGN_UP_PAYPAL_TEXT: String!
    EMAIL_TEMPLATE_STUDENT_SIGN_UP_BANK_TRANSFER_SUBJECT: String!
    EMAIL_TEMPLATE_STUDENT_SIGN_UP_BANK_TRANSFER_TEXT: String!
    EMAIL_TEMPLATE_REGISTRATION_FEE_PAID_SUBJECT: String!
    EMAIL_TEMPLATE_REGISTRATION_FEE_PAID_TEXT: String!
    EMAIL_TEMPLATE_NEW_INVOICE_SUBJECT: String!
    EMAIL_TEMPLATE_NEW_INVOICE_TEXT: String!
    EMAIL_TEMPLATE_INVOICE_REMINDER_SUBJECT: String!
    EMAIL_TEMPLATE_INVOICE_REMINDER_TEXT: String!
  }

  input SettingsInput {
    SMTP_HOST: String!
    SMTP_PORT: String!
    SMTP_USER: String!
    SMTP_PASS: String!
    EMAIL_TEMPLATE_STUDENT_SIGN_UP_PAYPAL_SUBJECT: String!
    EMAIL_TEMPLATE_STUDENT_SIGN_UP_PAYPAL_TEXT: String!
    EMAIL_TEMPLATE_STUDENT_SIGN_UP_BANK_TRANSFER_SUBJECT: String!
    EMAIL_TEMPLATE_STUDENT_SIGN_UP_BANK_TRANSFER_TEXT: String!
    EMAIL_TEMPLATE_REGISTRATION_FEE_PAID_SUBJECT: String!
    EMAIL_TEMPLATE_REGISTRATION_FEE_PAID_TEXT: String!
    EMAIL_TEMPLATE_NEW_INVOICE_SUBJECT: String!
    EMAIL_TEMPLATE_NEW_INVOICE_TEXT: String!
    EMAIL_TEMPLATE_INVOICE_REMINDER_SUBJECT: String!
    EMAIL_TEMPLATE_INVOICE_REMINDER_TEXT: String!
  }
`;
