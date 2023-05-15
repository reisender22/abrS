import { client, gql } from "../utils/client";
import { notifications } from "./quickNotifications";
import createStatusStore from "../utils/createStatusStore";

const status = createStatusStore();

const fragments = {
  ALL_FIELDS: `
    id
    amount
    items {
      description
      price
      quantity
      amount
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
    clss {
      subject
      times {
        day
        from
        to
      }
      teacher {
        first_name
        last_name
      }
    }
    `,
};

const queries = {
  GET: gql`
    query ListAllInvoices($state: InvoiceState) {
      getInvoices(state: $state) {
        ${fragments.ALL_FIELDS}
      }
    }
  `,

  GET_BY_SEARCH_QUERY: gql`
    query SearchInvoices($query: String!, $page_size: Int) {
      searchInvoices(query: $query, page_size: $page_size) {
        ${fragments.ALL_FIELDS}
      }
    }`,
};

const mutations = {
  CREATE_PAYMENT: gql`
    mutation CreatePayment($paymentInput: PaymentInput!) {
      createPayment(paymentInput: $paymentInput) {
        id
      }
    }
  `,

  DELETE_PAYMENT: gql`
    mutation DeletePayment($id: ID!) {
      deletePayment(id: $id)
    }
  `,

  VOID: gql`
    mutation VoidInvoice($id: ID!) {
      voidInvoice(id: $id) {
        id
      }
    }
  `,

  UNVOID: gql`
    mutation UnvoidInvoice($id: ID!) {
      unvoidInvoice(id: $id) {
        id
      }
    }
  `,

  RESEND: gql`
    mutation ResendInvoice($id: ID!) {
      resendInvoice(id: $id)
    }
  `,
};

function createInvoicesStore() {
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

  async function fetch({ state } = {}) {
    status.set("FETCHING");

    const { data, errors } = await client.request(queries.GET, { state });

    if (errors) {
      status.set("ERROR");

      notifications.display({
        message: "Fehler: " + errors[0].message,
        level: "error",
      });
    } else {
      set(data.getInvoices);
      status.set("FETCHED");
    }
  }

  async function search(query, { page_size } = {}) {
    status.set("FETCHING");

    const { data, errors } = await client.request(queries.GET_BY_SEARCH_QUERY, {
      query,
      page_size,
    });

    if (errors) {
      status.set("ERROR");

      notifications.display({
        message: "Fehler: " + errors[0].message,
        level: "error",
      });
    } else {
      set(data.searchInvoices);

      status.set("FETCHED");
    }
  }

  async function createPayment(paymentInput) {
    status.set("CREATING_PAYMENT");

    const { errors } = await client.request(mutations.CREATE_PAYMENT, {
      paymentInput,
    });

    if (errors) {
      status.set("ERROR");

      notifications.display({
        message: "Fehler: " + errors[0].message,
        level: "error",
      });
    } else {
      const index = invoices.findIndex(
        (invoice) => invoice.id === paymentInput.invoice_id
      );

      invoices.splice(index, 1);
      set(invoices);

      status.set("PAYMENT_CREATED");
      notifications.display({ message: "Rechnung wurde bezahlt" });
    }
  }

  async function deletePayment(id) {
    status.set("DELETING_PAYMENT");

    const { errors } = await client.request(mutations.DELETE_PAYMENT, {
      id,
    });

    if (errors) {
      status.set("ERROR");

      notifications.display({
        message: "Fehler: " + errors[0].message,
        level: "error",
      });
    } else {
      invoices = invoices.filter((i) => i.id !== id);
      set(invoices);

      status.set("PAYMENT_DELETED");
      notifications.display({
        message: "Rechnung wurde als 'offen' markiert.",
      });
    }
  }

  async function vd(id) {
    status.set("VOIDING");

    const { errors } = await client.request(mutations.VOID, {
      id,
    });

    if (errors) {
      status.set("ERROR");

      notifications.display({
        message: "Fehler: " + errors[0].message,
        level: "error",
      });
    } else {
      const index = invoices.findIndex((invoice) => invoice.id === id);

      invoices.splice(index, 1);
      set(invoices);

      status.set("VOIDED");
      notifications.display({
        message: "Rechnung wurde storniert.",
      });
    }
  }

  async function unvd(id) {
    status.set("VOIDING");

    const { errors } = await client.request(mutations.UNVOID, {
      id,
    });

    if (errors) {
      status.set("ERROR");

      notifications.display({
        message: "Fehler: " + errors[0].message,
        level: "error",
      });
    } else {
      const index = invoices.findIndex((invoice) => invoice.id === id);

      invoices.splice(index, 1);
      set(invoices);

      status.set("VOIDED");
      notifications.display({
        message: "Rechnung wurde als 'offen' markiert.",
      });
    }
  }

  async function resend(id) {
    status.set("RESENDING");

    const { errors } = await client.request(mutations.RESEND, {
      id,
    });

    if (errors) {
      status.set("ERROR");

      notifications.display({
        message: "Fehler: " + errors[0].message,
        level: "error",
      });
    } else {
      status.set("RESENT");
      notifications.display({
        message: "Rechnung wurde per E-Mail erneut gesendet.",
      });
    }
  }

  return {
    vd,
    set,
    unvd,
    fetch,
    resend,
    search,
    subscribe,
    createPayment,
    deletePayment,
  };
}

const invoices = createInvoicesStore();

export { invoices, status };
