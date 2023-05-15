import { client, gql } from "../utils/client";
import { notifications } from "./quickNotifications";
import createStatusStore from "../utils/createStatusStore";

const fragments = {
  ALL_FIELDS: gql`
    id
    email
    gender
    first_name
    last_name
    address_line_1
    address_line_2
    postal_code
    locality
    administrative_area
    country
    phone_number
    role
    is_email_verified
    is_registration_fee_paid
    is_locked
    comments {
      id
      body_md
      author {
        id
        first_name
        last_name
      }
      updated_at
      created_at
    }
    last_login_at
    updated_at
    created_at
    invoices {
      id
      amount
      state
      created_at
    }`,

  ALL_COMMENT_FIELDS: gql`
    id
    body_md
    author {
      id
      first_name
      last_name
    }
    updated_at
    created_at`,
};

const queries = {
  GET: gql`
    query GetUserById($id: ID!) {
      getUser(id: $id) {
        ${fragments.ALL_FIELDS}
      }
    }`,
};

const mutations = {
  CREATE: gql`
    mutation CreateNewUser($userInput: UserInput!, $sendEmail: Boolean) {
      createUser(userInput: $userInput, sendEmail: $sendEmail) {
        ${fragments.ALL_FIELDS}
      }
    }`,

  UPDATE: gql`
    mutation UpdateUser($id: ID!, $userInput: UserInput!) {
      updateUser(id: $id, userInput: $userInput) {
        ${fragments.ALL_FIELDS}
      }
    }`,

  DEL: gql`
    mutation DeleteUser($id: ID!) {
      deleteUser(id: $id)
    }
  `,

  CREATE_COMMENT: gql`
    mutation CreateUserComment($userCommentInput: UserCommentInput!) {
      createUserComment(userCommentInput: $userCommentInput) {
        ${fragments.ALL_COMMENT_FIELDS}
      }
    }`,

  UPDATE_COMMENT: gql`
    mutation UpdateUserComment($id: ID!, body_md) {
      updateUserComment(id: $id, body_md: $body_md) {
        ${fragments.ALL_COMMENT_FIELDS}
      }
    }`,
};

const status = createStatusStore();

function createUserStore() {
  let user;
  let subs = [];

  function subscribe(handler) {
    subs.push(handler);
    handler(user);

    return function unsubscribe() {
      subs = subs.filter((fn) => fn !== handler);
    };
  }

  function set(value) {
    user = value;
    for (const fn of subs) fn(user);
  }

  function create(input, sendEmail) {
    const onSuccess = (data) => set(data.createUser);
    const messages = { success: "Benutzer wurde erstellt" };

    makeApiCall({
      query: mutations.CREATE,
      variables: { input, sendEmail },
      onSuccess,
      messages,
    });
  }

  function get(id) {
    const onSuccess = (data) => set(data.users);

    makeApiCall({
      query: queries.GET,
      variables: { id },
      onSuccess,
    });
  }

  function update(id, input) {
    const onSuccess = (data) => set(data.updateUser);
    const messages = { success: "Benutzer wurde gespeichert" };

    makeApiCall({
      query: mutations.UPDATE,
      variables: { id, input },
      onSuccess,
      messages,
    });
  }

  function del(id) {
    const messages = { success: "Benutzer wurde gelöscht" };
    const onSuccess = (data) => set(data.createUser);

    makeApiCall({
      query: mutations.DEL,
      variables: { id },
      onSuccess,
      messages,
    });
  }

  function createComment(input) {
    const messages = { success: "Kommentar wurde erstellt" };

    const onSuccess = (data) => {
      user.comments = [data.createUserComment, ...user.comments];
      set(user);
    };

    makeApiCall({
      query: mutations.CREATE_COMMENT,
      variables: { input },
      onSuccess,
      messages,
    });
  }

  function updateComment(id, input) {
    const messages = { success: "Änderungen wurden gespeichert" };

    const onSuccess = (data) => {
      user.comments = [data.updateUserComment, ...user.comments];
      set(user);
    };

    makeApiCall({
      query: mutations.UPDATE_COMMENT,
      variables: { id, input },
      onSuccess,
      messages,
    });
  }

  return {
    set,
    get,
    del,
    create,
    update,
    subscribe,
    createComment,
    updateComment,
  };
}

const user = createUserStore();

export { user, status };
