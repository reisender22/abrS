import { client, gql } from "../utils/client";
import { notifications } from "./quickNotifications";
import createStatusStore from "../utils/createStatusStore";

const status = createStatusStore();

const queries = {
  GET: gql`
    query ListAllClasses($teacher_id: ID) {
      getClasses(teacher_id: $teacher_id) {
        id
        subject
        level
        gender
        price_per_hour
        times {
          day
          from
          to
        }
        name
        teacher {
          id
          first_name
          last_name
        }
        state
        enrollments {
          id
          student {
            id
          }
        }
      }
    }
  `,
};

function createClassesStore() {
  let classes = [];
  let subs = [];

  function subscribe(handler) {
    subs.push(handler);
    handler(classes);

    return function unsubscribe() {
      subs = subs.filter((fn) => fn !== handler);
    };
  }

  function set(value) {
    classes = value;
    for (const fn of subs) fn(classes);
  }

  async function fetch({ teacher_id } = {}) {
    status.set("FETCHING");

    const { data, errors } = await client.request(queries.GET, { teacher_id });

    if (errors) {
      status.set("ERROR");

      notifications.display({
        message: "Fehler: " + errors[0].message,
        level: "error",
      });
    } else {
      set(data.getClasses);
      status.set("FETCHED");
    }
  }

  return { subscribe, fetch };
}

const classes = createClassesStore();

export { classes, status };
