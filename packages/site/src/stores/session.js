import { client, gql } from "../utils/client";
import { notifications } from "./quickNotifications";
import createStatusStore from "../utils/createStatusStore";

const status = createStatusStore();

status.set("LOGGED_OUT");

function createSessionStore() {
  let session = {};
  let subs = [];

  const mutations = {
    REQUEST_PASSWORD_RESET: gql`
      mutation RequestPasswordReset($email: String!) {
        requestPasswordReset(email: $email)
      }
    `,

    RESET_PASSWORD: gql`
      mutation ResetPassword($token: String!) {
        resetPassword(token: $token)
      }
    `,
  };

  function subscribe(handler) {
    subs.push(handler);
    handler(session);

    return function unsubscribe() {
      subs = subs.filter((fn) => fn !== handler);
    };
  }

  function set(value) {
    session = value;
    for (const fn of subs) fn(session);
  }

  async function login(email, password) {
    status.set("AUTHENTICATING");

  const url = "https://api-kurse.miftahul-ilm.net/auth/login";
  // const url = "http://localhost:3000/auth/login";

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    };

    const response = await fetch(url, options);

    if (response.ok) {
      const { user, notifications } = await response.json();

      set({ ...session, user, notifications });

      status.set("AUTHENTICATED");
    } else {
      const { message } = await response.json();

      notifications.display({ message: "Fehler: " + message, level: "error" });

      status.set("ERROR");
    }
  }

  async function logout() {
    set({ ...session, user: null });
    status.reset();
  }

  async function dismissNotification(id) {
    if (session.notifications.find((n) => n.id == id).is_dismissed) return;

    status.set("DISMISSING_NOTIFICATION");

    const url ="https://api-kurse.miftahul-ilm.net/auth/notifications/${id}/dismiss";
    // const url = `http://localhost:3000/auth/notifications/${id}/dismiss`;
    const options = { method: "PUT" };
    const response = await fetch(url, options);

    if (response.ok) {
      session.notifications.find((n) => n.id == id).is_dismissed = true;

      set(session);

      status.set("DISMISSED_NOTIFICATION");
    } else {
      const { message } = await response.json();

      notifications.display({ message: "Fehler: " + message, level: "error" });

      status.set("ERROR");
    }
  }

  async function requestPasswordReset(email) {
    status.set("REQUESTING_PASSWORD_RESET");

    const { data, errors } = await client.request(
      mutations.REQUEST_PASSWORD_RESET,
      {
        email,
      }
    );

    if (errors) {
      status.set("ERROR");

      notifications.display({
        message: "Fehler: " + errors[0].message,
        level: "error",
      });
    } else {
      status.set("REQUESTED_PASSWORD_RESET");
      notifications.display({ message: "Eine Email wurde Dir zugesendet." });
    }
  }

  async function resetPassword(token) {
    status.set("RESETTING_PASSWORD");

    const { data, errors } = await client.request(mutations.RESET_PASSWORD, {
      token,
    });

    if (errors) {
      status.set("ERROR");

      notifications.display({
        message: "Fehler: " + errors[0].message,
        level: "error",
      });
    } else {
      status.set("RESETTED_PASSWORD");
      notifications.display({ message: "Passwort wurde zurücksetzen" });

      return data.resetPassword;
    }
  }

  return {
    subscribe,
    login,
    logout,
    dismissNotification,
    requestPasswordReset,
    resetPassword,
  };
}

const session = createSessionStore();

export { session, status };
