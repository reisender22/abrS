import { client, gql } from "../utils/client";
import { notifications } from "./quickNotifications";
import createStatusStore from "../utils/createStatusStore";

const status = createStatusStore();

const queries = {
  GET: gql`
    query GetInvoice($id: ID!) {
      getInvoice(id: $id) {
        id
        amount
        items {
          description
        }
        state
        customer_first_name
        customer_last_name
        customer_address_line_1
        customer_address_line_2
        customer_postal_code
        customer_locality
        customer_country
        created_at
        payments {
          id
        }
        student {
          id
        }
      }
    }
  `,
};

const mutations = {
  CREATE: gql`
    mutation CreateInvoice($input: InvoiceInput!) {
      createInvoice(input: $input) {
        id
      }
    }
  `,
};

function createInvoiceStore() {
  let invoices = [];
  let subs = [];

  function subscribe(handler) {
    subs.push(handler);
    handler(invoices);

    return function unsubscribe() {
      subs = subs.filter((fn) => fn !== handler);
    };
  }

  function set(value) {
    invoices = value;
    for (const fn of subs) fn(invoices);
  }

  async function fetch(id) {}

  async function create(input) {
    status.set("CREATING");

    const { data, errors } = await client.request(mutations.CREATE, { input });

    if (errors) {
      status.set("ERROR");

      notifications.display({
        message: "Fehler: " + errors[0].message,
        level: "error",
      });
    } else {
      set(data.createInvoice);
      status.set("CREATED");

      notifications.display({
        message: "Rechnung wurder erstellt.",
      });
    }
  }

  return {
    fetch,
    create,
    subscribe,
  };
}

const invoice = createInvoiceStore();

export { invoice, status };
