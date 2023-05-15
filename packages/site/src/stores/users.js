import { client, gql } from "../utils/client";
import { notifications } from "./quickNotifications";
import createStatusStore from "../utils/createStatusStore";

const status = createStatusStore();

const fragments = {
  ALL_FIELDS: gql`
    id
    email
    first_name
    last_name
    address_line_1
    address_line_2
    postal_code
    locality
    country`,
};

const queries = {
  GET: gql`
    query ListUsersByRole($role: Role, $offset: ID, $page_size: Int) {
      getUsers(role: $role, offset: $offset, page_size: $page_size) {
        ${fragments.ALL_FIELDS}
      }
    }`,

  GET_BY_SEARCH_QUERY: gql`
    query SearchUsers($query: String!, $roles: [Role!], $page_size: Int) {
      searchUsers(query: $query, roles: $roles, page_size: $page_size) {
        ${fragments.ALL_FIELDS}
      }
    }`,
};

function createUsersStore() {
  let users = [];
  let subs = [];

  function subscribe(handler) {
    subs.push(handler);
    handler(users);

    return function unsubscribe() {
      subs = subs.filter((fn) => fn !== handler);
    };
  }

  function set(value) {
    users = value;
    for (const fn of subs) fn(users);
  }

  function reset() {
    set([])
  }

  async function fetch({ role = "all", offset = "0", page_size = 20 } = {}) {
    status.set("FETCHING");

    const { data, errors } = await client.request(queries.GET, {
      role,
      offset,
      page_size,
    });

    if (errors) {
      status.set("ERROR");

      notifications.display({
        message: "Fehler: " + errors[0].message,
        level: "error",
      });
    } else {
      set(data.getUsers);
      status.set("FETCHED");
    }
  }

  async function search(query, { roles, page_size } = {}) {
    status.set("FETCHING");

    const { data, errors } = await client.request(queries.GET_BY_SEARCH_QUERY, {
      query,
      roles,
      page_size,
    });

    if (errors) {
      status.set("ERROR");

      notifications.display({
        message: "Fehler: " + errors[0].message,
        level: "error",
      });
    } else {
      set(data.searchUsers);

      status.set("FETCHED");
    }
  }

  return {
    reset,
    fetch,
    search,
    subscribe,
  };
}

const users = createUsersStore();

export { users, status };
