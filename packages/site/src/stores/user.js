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
  GET_BY_ID: gql`
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

  UPDATE_PASSWORD: gql`
    mutation UpdateUserPassword($id: ID!, $password: String!) {
      updateUserPassword(id: $id, password: $password)
    }
  `,

  DEL: gql`
    mutation DeleteUser($id: ID!) {
      deleteUser(id: $id)
    }
  `,

  CREATE_COMMENT: gql`
    mutation CreateNewUserComment($userCommentInput: UserCommentInput!) {
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

  DEL_COMMENT: gql`
    mutation DeleteUserComment($id: ID!) {
     
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

  async function create(userInput, sendEmail) {
    status.set("CREATING");

    const { data, errors } = await client.request(mutations.CREATE, {
      userInput,
      sendEmail,
    });

    if (errors) {
      status.set("ERROR");

      notifications.display({
        message: "Fehler: " + errors[0].message,
        level: "error",
      });
    } else {
      set(data.createUser);
      status.set("CREATED");
      notifications.display({ message: "Benutzer wurde erstellt" });
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
      set(data.getUser);
      status.set("FETCHED");
    }
  }

  async function update() {
    status.set("UPDATING");

    const {
      id,
      last_login_at,
      created_at,
      updated_at,
      invoices,
      comments,
      ...userInput
    } = user;

    const { data, errors } = await client.request(mutations.UPDATE, {
      id,
      userInput,
    });

    if (errors) {
      status.set("ERROR");

      notifications.display({
        message: "Fehler: " + errors[0].message,
        level: "error",
      });
    } else {
      set(data.updateUser);
      status.set("UPDATED");
      notifications.display({ message: "Benutzer wurde gespeichert" });
    }
  }

  async function updatePassword(password, passwordRepeat) {
    if (password !== passwordRepeat) {
      notifications.display({
        message: "Passwörter stimmen nicht überein",
        level: "error",
      });
    }

    status.set("UPDATING_PASSWORD");

    const { data, errors } = await client.request(mutations.UPDATE_PASSWORD, {
      id: user.id,
      password,
    });

    if (errors) {
      status.set("ERROR");

      notifications.display({
        message: "Fehler: " + errors[0].message,
        level: "error",
      });
    } else {
      status.set("UPDATED_PASSWORD");
      notifications.display({ message: "Passwort wurde gespeichert" });
    }
  }

  async function del(id) {
    status.set("DELETING");

    const { errors } = await client.request(mutations.DEL, { id });

    if (errors) {
      status.set("ERROR");

      notifications.display({
        message: "Fehler: " + errors[0].message,
        level: "error",
      });
    } else {
      status.set("DELETED");
      notifications.display({ message: "Benutzer wurde gelöscht" });
    }
  }

  async function createComment({ body_md, author_id }) {
    status.set("CREATING_COMMENT");

    const { data, errors } = await client.request(mutations.CREATE_COMMENT, {
      userCommentInput: { body_md, author_id, user_id: user.id },
    });

    if (errors) {
      status.set("ERROR");

      notifications.display({
        message: "Fehler: " + errors[0].message,
        level: "error",
      });
    } else {
      user.comments = [data.createUserComment, ...user.comments];
      set(user);
      status.set("COMMENT_CREATED");
      notifications.display({ message: "Notiz wurde erstellt" });
    }
  }

  async function updateComment(id, body_md) {
    status.set("UPDATING_COMMENT");

    const { data, errors } = await client.request(mutations.UPDATE_COMMENT, {
      id,
      body_md,
    });

    if (errors) {
      status.set("ERROR");

      notifications.display({
        message: "Fehler: " + errors[0].message,
        level: "error",
      });
    } else {
      user.comments = [data.updateUserComment, ...user.comments];
      set(user);
      status.set("UPDATED_COMMENT");
      notifications.display({ message: "Änderungen wurden gespeichert" });
    }
  }

  async function delComment(id) {
    status.set("DELETING_COMMENT");

    const { errors } = await client.request(mutations.DEL_COMMENT, { id });

    if (errors) {
      status.set("ERROR");

      notifications.display({
        message: "Fehler: " + errors[0].message,
        level: "error",
      });
    } else {
      user.comments = user.comments.filter((comment) => comment.id !== id);
      set(user);
      status.set("DELETED_COMMENT");
      notifications.display({ message: "Notiz wurde gelöscht" });
    }
  }

  return {
    set,
    del,
    fetch,
    create,
    update,
    subscribe,
    delComment,
    createComment,
    updateComment,
    updatePassword,
  };
}

const user = createUserStore();

export { user, status };
