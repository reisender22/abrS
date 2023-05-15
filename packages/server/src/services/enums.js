module.exports = {
  Gender: {
    NOT_SPECIFIED: 0,
    MALE: 1,
    FEMALE: 2,
  },

  Role: {
    ADMIN: 0,
    TEACHER: 1,
    STUDENT: 2,
  },

  Day: {
    MON: "MON",
    TUE: "TUE",
    WED: "WED",
    THU: "THU",
    FRI: "FRI",
    SAT: "SAT",
    SUN: "SUN",
  },

  ClassState: {
    IN_PREPARATION: 0,
    OPEN_FOR_REGISTRATION: 1,
    ONGOING: 2,
    COMPLETED: 3,
    CANCELLED: 4,
  },

  Attendance: {
    PRESENT: 0,
    ABSENT: 1,
    EXCUSED: 2,
    PASSIVE: 3,
  },

  InvoiceState: {
    OPEN: 0,
    PAID: 1,
    VOID: 2,
  },

  EmailNotificationStatus: {
    FAILURE: 0,
    SUCCESS: 1,
  },
};
