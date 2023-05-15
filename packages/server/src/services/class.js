const sqlite = require("../loaders/sqlite");

const Events = require("../jobs/events");
const EventBus = require("../jobs/eventBus");

const OrderModel = require("../models/orders");
const ClassModel = require("../models/classes");
const LessonModel = require("../models/lessons");
const SessionModel = require("../models/sessions");
const InvoiceModel = require("../models/invoices");
const EnrollmentModel = require("../models/enrollments");

const db = sqlite();

function parse(object) {
  if (!object) return;

  let copy = { ...object };

  // transform times string into array
  copy.times = copy.times.split(",");

  copy.times = copy.times.map((t) => {
    const [day, time] = t.split(" ");
    const [from, to] = time.split("-");

    return { day, from, to };
  });

  return copy;
}

function unparse(object) {
  if (!object) return;

  let copy = { ...object };

  // transform times array into string
  copy.times = copy.times
    .map(({ day, from, to }) => `${day} ${from}-${to}`)
    .join(",");

  return copy;
}

module.exports = Object.freeze({
  create(classInput) {
    classInput = unparse(classInput);

    const id = ClassModel.create(classInput);

    return parse(ClassModel.getById(id));
  },

  createEnrollment({
    student_id,
    class_id,
    custom_price_per_hour = null,
    notes = "",
  }) {
    const id = EnrollmentModel.create({
      student_id,
      class_id,
      custom_price_per_hour,
      notes,
    });

    return EnrollmentModel.getById(id);
  },

  updateEnrollment(id, { custom_price_per_hour, notes = "" }) {
    EnrollmentModel.update(id, { custom_price_per_hour, notes });

    return EnrollmentModel.getById(id);
  },

  delEnrollment(id) {
    return EnrollmentModel.del(id);
  },

  requestClassChange(student_id, currentClassId, newClassId) {
    const newClassRecord = ClassModel.getById(newClassId);
    const hours = this.getHoursUntilNextInvoice(newClassId);

    const leftHours = OrderModel.getFreeHoursByStudentAndClassId(
      student_id,
      currentClassId
    );

    let currentPricePerHour = OrderModel.getLastPricePerHourByStudentAndClassId(
      student_id,
      currentClassId
    );

    const input = {
      student_id,
      items: [
        {
          description: newClassRecord.subject,
          price: newClassRecord.price_per_hour,
          quantity: hours,
          class_id: newClassId,
        },
      ],
    };

    if (leftHours > 0) {
      input.items.push({
        description: "Rabatt",
        price: -currentPricePerHour,
        quantity: leftHours,
      });
    }

    return input;
  },

  createLesson(lessonInput, sessionInputs) {
    const transaction = db.transaction((lessonInput, sessionInputs) => {
      const classRecord = ClassModel.getById(lessonInput.class_id);

      if (classRecord.hours_per_lesson) {
        lessonInput.date_to =
          lessonInput.date_from + 3600 * classRecord.hours_per_lesson;
      }

      // 1. create lesson
      const id = LessonModel.create(lessonInput);
      const lessonRecord = LessonModel.getById(id);

      // 2. create session for every student
      for (const sessionInput of sessionInputs) {
        SessionModel.create({ ...sessionInput, lesson_id: id });
      }

      // 3. Check if it is time to create new invoices...
      const hours = ClassModel.getHoursUntilNextInvoice(classRecord.id);

      // ...if yes
      if (hours === classRecord.invoice_cycle) {
        const invoices = [];
        const enrollmentRecords = EnrollmentModel.getByClassId(classRecord.id);

        for (const { student_id, custom_price_per_hour } of enrollmentRecords) {
          const free_hours = OrderModel.getFreeHoursByStudentAndClassId(
            student_id,
            classRecord.id
          );

          // If the studdent still has enough hours do not create an invoice
          // if (free_hours >= classRecord.invoice_cycle) continue;

          // create order
          const order_id = OrderModel.create({
            student_id,
            items: [
              {
                description: classRecord.subject,
                price:
                  custom_price_per_hour === null
                    ? classRecord.price_per_hour
                    : custom_price_per_hour,
                quantity: classRecord.invoice_cycle,
                class_id: classRecord.id,
              },
            ],
          });

          // create invoice
          const orderRecord = OrderModel.getById(order_id);

          if (orderRecord.amount > 0) {
            const invoice_id = InvoiceModel.create({ order_id });
            invoices.push(InvoiceModel.getById(invoice_id));
          }
        }

        return { lesson: lessonRecord, invoices };
      }

      // ...if not
      return { lesson: lessonRecord };
    });

    const { lesson, invoices } = transaction(lessonInput, sessionInputs);

    if (invoices) {
      EventBus.emit(Events.onInvoicesCreated, { invoices });
    }

    return lesson;
  },

  createFirstInvoices(class_id) {
    const transaction = db.transaction((class_id) => {
      const invoices = [];

      const classRecord = ClassModel.getById(class_id);
      const enrollmentRecords = EnrollmentModel.getByClassId(class_id);

      for (const { student_id, custom_price_per_hour } of enrollmentRecords) {
        const free_hours = OrderModel.getFreeHoursByStudentAndClassId(
          student_id,
          class_id
        );

        // If the student still has enough hours do not create an invoice
        if (free_hours >= classRecord.invoice_cycle) continue;

        // create order
        const order_id = OrderModel.create({
          student_id,
          items: [
            {
              description: classRecord.subject,
              price:
                custom_price_per_hour === null
                  ? classRecord.price_per_hour
                  : custom_price_per_hour,
              quantity: classRecord.invoice_cycle - free_hours,
              class_id: classRecord.id,
            },
          ],
        });

        // create invoice
        const orderRecord = OrderModel.getById(order_id);

        if (orderRecord.amount > 0) {
          const invoice_id = InvoiceModel.create({ order_id });
          invoices.push(InvoiceModel.getById(invoice_id));
        }
      }

      ClassModel.update(class_id, { ...classRecord, state: 2 });

      return invoices;
    });

    const invoices = transaction(class_id);

    EventBus.emit(Events.onInvoicesCreated, { invoices });

    return invoices;
  },

  getById(id) {
    let classRecord = ClassModel.getById(id);

    return parse(classRecord);
  },

  get({ teacher_id, state, gender } = {}) {
    const filterObject = { teacher_id, state, gender };

    const classRecords = ClassModel.getAll();

    return classRecords.reduce((array, clss) => {
      for (const key in filterObject) {
        if (
          filterObject[key] !== undefined &&
          clss[key] !== undefined &&
          clss[key] != filterObject[key]
        ) {
          return array;
        }
      }

      return [...array, parse(clss)];
    }, []);
  },

  getEnrollmentsByClassId(id) {
    const enrollments = EnrollmentModel.getByClassId(id);

    return enrollments.map((enrollment) => {
      const attendanceStat = EnrollmentModel.getAttendanceStatsByStudentId(
        enrollment.student_id, id
      );

      const homeworkStat = EnrollmentModel.getHomeworkStatsByStudentId(
        enrollment.student_id, id
      );

      const attendance = {
        present: 0,
        absent: 0,
        excused: 0,
        passive: 0,
      };

      for (const a of attendanceStat) {
        if (a.attendance === 0) attendance.present = a.count;
        if (a.attendance === 1) attendance.absent = a.count;
        if (a.attendance === 2) attendance.excused = a.count;
        if (a.attendance === 3) attendance.passive = a.count;
      }

      let homeworks = {
        notDone: 0,
        done: 0,
      };

      for (const h of homeworkStat) {
        if (h.has_done_homework === 0) homeworks.notDone = h.count;
        if (h.has_done_homework === 1) homeworks.done = h.count;
      }

      return {
        ...enrollment,
        stats: { attendance, homeworks },
      };
    });
  },

  getHoursUntilNextInvoice(id) {
    return ClassModel.getHoursUntilNextInvoice(id);
  },

  getLastInvoiceAt(id) {
    return ClassModel.getLastInvoiceAt(id);
  },

  getLessonsByClassId(id, { offset = 0, page_size = 20 }) {
    return LessonModel.getByClassId(id, { offset, page_size });
  },

  update(id, classInput) {
    classInput = unparse(classInput);

    const classRecord = ClassModel.getById(id);

    ClassModel.update(id, { ...classRecord, ...classInput });

    return parse(ClassModel.getById(id));
  },

  updateLesson(id, { date_from, date_to, title, notes_md, homeworks_md }) {
    const lessonRecord = LessonModel.getById(id);

    const classRecord = ClassModel.getById(lessonRecord.class_id);

    if (classRecord.hours_per_lesson) {
      date_to = date_from + 3600 * classRecord.hours_per_lesson;
    }

    LessonModel.update(id, {
      ...lessonRecord,
      date_from,
      date_to,
      title,
      notes_md,
      homeworks_md,
    });

    return LessonModel.getById(id);
  },

  del(id) {
    return ClassModel.del(id);
  },
});
