import { client, gql } from "../utils/client";
import { notifications } from "./quickNotifications";
import createStatusStore from "../utils/createStatusStore";

const status = createStatusStore();

const queries = {
  GET: gql`
    query ListAllClasses($gender: Gender) {
      getClasses(gender: $gender) {
        id
        subject
        level
        gender
        registration_fee
        registration_fee_offer
        times {
          day
          from
          to
        }
        state
      }
    }
  `,
};

const mutations = {
  SIGN_UP: gql`
    mutation SignUpStudent(
      $userInput: UserInput!
      $class_id: ID!
      $payByTransfer: Boolean
    ) {
      signUpStudent(userInput: $userInput, class_id: $class_id, payByTransfer: $payByTransfer) {
        id
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

  async function fetch({ gender } = {}) {
    status.set("FETCHING");

    const { data, errors } = await client.request(queries.GET, {
      gender: gender,
      state: "OPEN_FOR_REGISTRATION",
    });

    if (errors) {
      status.set("ERROR");

      notifications.display({
        message: "Ein Fehler ist aufgetreten",
        level: "error",
      });
    } else {
      set(data.getClasses);
      status.set("FETCHED");
    }
  }

  async function signUp(userInput, class_id, payByTransfer) {
    status.set("SIGNING_UP");

    const { errors } = await client.request(mutations.SIGN_UP, {
      userInput,
      class_id,
      payByTransfer
    });

    if (errors) {
      status.set("ERROR");

      notifications.display({
        message: "Fehler: " + errors[0].message,
        level: "error",
      });
    } else {
      status.set("SIGNED_UP");
    }
  }

  return { subscribe, fetch, signUp };
}

const classes = createClassesStore();

export { classes, status };
