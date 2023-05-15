import { client, gql } from "../utils/client";
import { notifications } from "./quickNotifications";
import createStatusStore from "../utils/createStatusStore";

const fragments = {
  ALL_FIELDS: gql`
    id
    subject
    level
    times {
      day
      from
      to
    }
    name
    gender
    description_md
    registration_fee
    registration_fee_offer
    price_per_hour
    hours_per_lesson
    invoice_cycle
    teacher {
      id
      first_name
      last_name
    }
    state
    notes
    hoursUntilNextInvoice
    last_invoice_at
    enrollments {
      id
      custom_price_per_hour
      student {
        id
        email
        phone_number
        gender
        first_name
        last_name
        address_line_1
        address_line_2
        postal_code
        locality
        country
        is_registration_fee_paid
        invoices(state: OPEN) {
          id
        }
      }
      stats {
        attendance {
          present
          absent
          excused
          passive
        }
        homeworks {
          done
          notDone
        }
      }
      notes
    }
    lessons {
      id
      date_from
      date_to
      title
      homeworks_md
      notes_md
      updated_at
      created_at
    }
    updated_at
    created_at`,

  ALL_LESSON_FIELDS: gql`
    id
    date_from
    date_to
    title
    notes_md
    homeworks_md
    updated_at
    created_at`,
};

const queries = {
  GET_BY_ID: gql`
    query GetClassById($id: ID!) {
      getClass(id: $id) {
        ${fragments.ALL_FIELDS}
      }
    }`,

  CREATE: gql`
    mutation CreateNewClass($classInput: ClassInput!) {
      createClass(classInput: $classInput) {
        ${fragments.ALL_FIELDS}
      }
    }`,

  UPDATE: gql`
    mutation UpdateClass($id: ID!, $classInput: ClassInput!) {
      updateClass(id: $id, classInput: $classInput) {
        ${fragments.ALL_FIELDS}
      }
    }`,

  CREATE_FIRST_INVOICES: gql`
    mutation CreateFirstInvoices($id: ID!) {
      createFirstInvoices(id: $id) {
        ${fragments.ALL_FIELDS}
      }
    }`,

  DELETE: gql`
    mutation DeleteClass($id: ID!) {
      deleteClass(id: $id)
    }
  `,

  CREATE_LESSON: gql`
    mutation CreateNewLesson($lessonInput: LessonInput!, $sessionInputs: [SessionInput!]!) {
      createLesson(lessonInput: $lessonInput, sessionInputs: $sessionInputs) {
        ${fragments.ALL_LESSON_FIELDS}
      }
    }`,

  UPDATE_LESSON: gql`
    mutation UpdateLesson($id: ID!, $lessonInput: LessonInput!) {
      updateLesson(id: $id, lessonInput: $lessonInput) {
        ${fragments.ALL_LESSON_FIELDS}
      }
    }`,

  CREATE_ENROLLMENT: gql`
    mutation EnrollStudentIntoClass($student_id: ID!, $class_id: ID!) {
      createEnrollment(student_id: $student_id, class_id: $class_id) {
        id
        custom_price_per_hour
        student {
          id
          email
          first_name
          last_name
          address_line_1
          address_line_2
          postal_code
          locality
          country
          is_registration_fee_paid
          invoices(state: OPEN) {
            id
          }
        }
        stats {
          attendance {
            present
            absent
            excused
            passive
          }
          homeworks {
            done
            notDone
          }
        }
        notes
      }
    }
  `,

  UPDATE_ENROLLMENT: gql`
    mutation UpdateEnrollment($id: ID!, $custom_price_per_hour: Int!) {
      updateEnrollment(id: $id, custom_price_per_hour: $custom_price_per_hour) {
        id
        custom_price_per_hour
        student {
          id
          email
          first_name
          last_name
          address_line_1
          address_line_2
          postal_code
          locality
          country
          is_registration_fee_paid
          invoices(state: OPEN) {
            id
          }
        }
        stats {
          attendance {
            present
            absent
            excused
            passive
          }
          homeworks {
            done
            notDone
          }
        }
        notes
      }
    }
  `,

  DEL_ENROLLMENT: gql`
    mutation DeleteEnrollment($id: ID!) {
      delEnrollment(id: $id)
    }
  `,

  REQUEST_CLASS_CHANGE: gql`
    mutation RequestClassChange($student_id: ID!, $currentClassId: ID!, $newClassId: ID!) {
      requestClassChange(student_id: $student_id, currentClassId: $currentClassId, newClassId: $newClassId) {
        student_id
        items {
          description
          price
          quantity
          class_id
        }
      }
    }
  `,
};

const status = createStatusStore();

function createClassStore() {
  let clss;
  let subs = [];

  function subscribe(handler) {
    subs.push(handler);
    handler(clss);

    return function unsubscribe() {
      subs = subs.filter((fn) => fn !== handler);
    };
  }

  function set(value) {
    clss = value;
    for (const fn of subs) fn(clss);
  }

  async function create(classInput) {
    status.set("CREATING");

    const { data, errors } = await client.request(queries.CREATE, {
      classInput,
    });

    if (errors) {
      status.set("ERROR");

      notifications.display({
        message: "Fehler: " + errors[0].message,
        level: "error",
      });
    } else {
      data.createClass.teacher_id = data.createClass.teacher.id;
      set(data.createClass);

      status.set("CREATED");
      notifications.display({ message: "Klasse wurde erstellt" });
    }
  }

  async function fetch(id) {
    status.set("FETCHING");

    const { data, errors } = await client.request(queries.GET_BY_ID, { id });

    if (errors) {
      status.set("ERROR");

      notifications.display({
        message: "Fehler: " + errors[0].message,
        level: "error",
      });
    } else {
      data.getClass.teacher_id = data.getClass.teacher.id;
      set(data.getClass);

      status.set("FETCHED");
    }
  }

  async function update() {
    status.set("UPDATING");

    const {
      name,
      subject,
      level,
      times,
      gender,
      description_md,
      price_per_hour,
      registration_fee,
      registration_fee_offer,
      hours_per_lesson,
      invoice_cycle,
      teacher_id,
      state,
      notes,
    } = clss;

    const { data, errors } = await client.request(queries.UPDATE, {
      id: clss.id,
      classInput: {
        name,
        subject,
        level,
        times,
        gender,
        description_md,
        price_per_hour,
        registration_fee,
        registration_fee_offer,
        hours_per_lesson,
        invoice_cycle,
        teacher_id,
        state,
        notes,
      },
    });

    if (errors) {
      status.set("ERROR");

      notifications.display({
        message: "Fehler: " + errors[0].message,
        level: "error",
      });
    } else {
      data.updateClass.teacher_id = data.updateClass.teacher.id;
      set(data.updateClass);

      status.set("UPDATED");
      notifications.display({ message: "Klasse wurde gespeichert" });
    }
  }

  async function del() {
    status.set("DELETING");

    const { errors } = await client.request(queries.DELETE, { id: clss.id });

    if (errors) {
      status.set("ERROR");

      notifications.display({
        message: "Fehler: " + errors[0].message,
        level: "error",
      });
    } else {
      status.set("DELETED");
    }
  }

  async function createFirstInvoices() {
    status.set("CREATING_FIRST_INVOICES");

    const { data, errors } = await client.request(
      queries.CREATE_FIRST_INVOICES,
      {
        id: clss.id,
      }
    );

    if (errors) {
      status.set("ERROR");

      notifications.display({
        message: "Fehler: " + errors[0].message,
        level: "error",
      });
    } else {
      data.createFirstInvoices.teacher_id = data.createFirstInvoices.teacher.id;
      set(data.createFirstInvoices);

      status.set("FIRST_INVOICES_CREATED");
      notifications.display({ message: "Rechnungen werden verschickt..." });
    }
  }

  async function createLesson(lessonInput, sessionInputs) {
    status.set("CREATING_LESSON");

    const { data, errors } = await client.request(queries.CREATE_LESSON, {
      lessonInput,
      sessionInputs,
    });

    if (errors) {
      status.set("ERROR");

      notifications.display({
        message: "Fehler: " + errors[0].message,
        level: "error",
      });
    } else {
      clss.lessons = [data.createLesson, ...clss.lessons];
      set(clss);

      status.set("LESSON_CREATED");
      notifications.display({ message: "Unterricht wurde erstellt" });
    }
  }

  async function updateLesson(id, lessonInput) {
    status.set("UPDATING_LESSON");

    const { data, errors } = await client.request(queries.UPDATE_LESSON, {
      id,
      lessonInput,
    });

    if (errors) {
      status.set("ERROR");
    } else {
      const index = clss.lessons.findIndex((lesson) => lesson.id === id);
      clss.lessons[index] = data.updateLesson;
      set(clss);

      status.set("UPDATED_LESSON");
    }
  }

  async function createEnrollment(student_id, class_id) {
    status.set("CREATING_ENROLLMENT");

    const { data, errors } = await client.request(queries.CREATE_ENROLLMENT, {
      student_id,
      class_id,
    });

    if (errors) {
      status.set("ERROR");

      notifications.display({
        message: "Fehler: " + errors[0].message,
        level: "error",
      });
    } else {
      clss.enrollments.push(data.createEnrollment);
      set(clss);

      status.set("CREATED_ENROLLMENT");
      notifications.display({
        message: "Schüler wurde der Klasse hingezufügt.",
      });
    }
  }

  async function updateEnrollment(id, { custom_price_per_hour }) {
    status.set("UPDATING_ENROLLMENT");

    const { data, errors } = await client.request(queries.UPDATE_ENROLLMENT, {
      id,
      custom_price_per_hour,
    });

    if (errors) {
      status.set("ERROR");

      notifications.display({
        message: "Fehler: " + errors[0].message,
        level: "error",
      });
    } else {
      let old = clss.enrollments.find((e) => e.id === id);
      old = data.updateEnrollment;
      set(clss);

      status.set("UPDATED_ENROLLMENT");
      notifications.display({
        message: "Stundenpreis wurde aktualisiert.",
      });
    }
  }

  async function delEnrollment(id) {
    status.set("DELETING_ENROLLMENT");

    const { data, errors } = await client.request(queries.DEL_ENROLLMENT, {
      id,
    });

    if (errors) {
      status.set("ERROR");

      notifications.display({
        message: "Fehler: " + errors[0].message,
        level: "error",
      });
    } else {
      clss.enrollments = clss.enrollments.filter((e) => e.id !== id);
      set(clss);

      status.set("DELETED_ENROLLMENT");
      notifications.display({
        message: "Schüler wurde aus der Klasse entfernt.",
      });
    }
  }

  async function requestClassChange(student_id, currentClassId, newClassId) {
    status.set("REQUESTING_CLASS_CHANGE");

    const { data, errors } = await client.request(
      queries.REQUEST_CLASS_CHANGE,
      {
        student_id,
        currentClassId,
        newClassId,
      }
    );

    if (errors) {
      status.set("ERROR");

      notifications.display({
        message: "Fehler: " + errors[0].message,
        level: "error",
      });
    } else {
      status.set("REQUESTED_CLASS_CHANGE");

      return data.requestClassChange;
    }
  }

  return {
    set,
    del,
    fetch,
    create,
    update,
    subscribe,
    createLesson,
    updateLesson,
    delEnrollment,
    createEnrollment,
    updateEnrollment,
    requestClassChange,
    createFirstInvoices,
  };
}

const clss = createClassStore();

export { clss, status };
