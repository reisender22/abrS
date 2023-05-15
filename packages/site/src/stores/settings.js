import { client, gql } from "../utils/client";
import { notifications } from "./quickNotifications";
import createStatusStore from "../utils/createStatusStore";

const status = createStatusStore();

const fragments = {
  ALL_FIELDS: gql`
    SMTP_HOST
    SMTP_PORT
    SMTP_USER
    SMTP_PASS
    EMAIL_TEMPLATE_STUDENT_SIGN_UP_PAYPAL_SUBJECT
    EMAIL_TEMPLATE_STUDENT_SIGN_UP_PAYPAL_TEXT
    EMAIL_TEMPLATE_STUDENT_SIGN_UP_BANK_TRANSFER_SUBJECT
    EMAIL_TEMPLATE_STUDENT_SIGN_UP_BANK_TRANSFER_TEXT
    EMAIL_TEMPLATE_REGISTRATION_FEE_PAID_SUBJECT
    EMAIL_TEMPLATE_REGISTRATION_FEE_PAID_TEXT
    EMAIL_TEMPLATE_NEW_INVOICE_SUBJECT
    EMAIL_TEMPLATE_NEW_INVOICE_TEXT
    EMAIL_TEMPLATE_INVOICE_REMINDER_SUBJECT
    EMAIL_TEMPLATE_INVOICE_REMINDER_TEXT`,
};

const queries = {
  GET: gql`
    query GetAllSettings {
      getSettings {
        ${fragments.ALL_FIELDS}
      }
    }`,

  UPDATE: gql`
    mutation UpdateSettings($settingsInput: SettingsInput!) {
      updateSettings(settingsInput: $settingsInput) {
        ${fragments.ALL_FIELDS}
      }
    }`,
};

function createSettingsStore() {
  let settings = [];
  let subs = [];

  function subscribe(handler) {
    subs.push(handler);
    handler(settings);

    return function unsubscribe() {
      subs = subs.filter((fn) => fn !== handler);
    };
  }

  function set(value) {
    settings = value;
    for (const fn of subs) fn(settings);
  }

  async function fetch() {
    status.set("FETCHING");

    const { data, errors } = await client.request(queries.GET);

    if (errors) {
      status.set("ERROR");

      notifications.display({
        message: "Fehler: " + errors[0].message,
        level: "error",
      });
    } else {
      set(data.getSettings);
      status.set("FETCHED");
    }
  }

  async function update() {
    status.set("UPDATING");

    const { data, errors } = await client.request(queries.UPDATE, {
      settingsInput: settings,
    });

    if (errors) {
      status.set("ERROR");

      notifications.display({
        message: "Fehler: " + errors[0].message,
        level: "error",
      });
    } else {
      set(data.updateSettings);

      status.set("UPDATED");

      notifications.display({ message: "Einstellungen wurden gespeichert" });
    }
  }

  return { subscribe, fetch, update, set };
}

const settings = createSettingsStore();

export { settings, status };
