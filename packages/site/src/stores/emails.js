import { client, gql } from "../utils/client";
import { notifications } from "./quickNotifications";
import createStatusStore from "../utils/createStatusStore";

const status = createStatusStore();

const queries = {
  GET: gql`
    query ListAllEmailNotifications($offset: ID, $page_size: Int!) {
      getEmailNotifications(offset: $offset, page_size: $page_size) {
        id
        subject
        status
        created_at
        user {
          id
          first_name
          last_name
        }
      }
    }`,
};

function createEmailNotificationsStore() {
  let emailNotifications = [];
  let subs = [];

  function subscribe(handler) {
    subs.push(handler);
    handler(emailNotifications);

    return function unsubscribe() {
      subs = subs.filter((fn) => fn !== handler);
    };
  }

  function set(value) {
    emailNotifications = value;
    for (const fn of subs) fn(emailNotifications);
  }

  async function fetch(variables) {
    status.set("FETCHING");

    const { data, errors } = await client.request(queries.GET, variables);

    if (errors) {
      status.set("ERROR");

      notifications.display({
        message: "Fehler: " + errors[0].message,
        level: "error",
      });
    } else {
      set(data.getEmailNotifications);
      status.set("FETCHED");
    }
  }

  return { subscribe, fetch };
}

const emails = createEmailNotificationsStore();

export { emails, status };
