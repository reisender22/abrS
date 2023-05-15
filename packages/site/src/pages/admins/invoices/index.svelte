<script>
  import { metatags, url } from "@roxi/routify";
  import { formatter } from "../../../utils/currency";
  import { getTimeString } from "../../../utils/time";
  import { invoices, status } from "../../../stores/invoices";

  metatags.title = "Rechnungen";

  let state = "OPEN";
  let offset = "0";
  let page_size = 25;

  let showSearch = false;

  $: invoices.fetch({ state, offset, page_size });

  function toggleSearch() {
    if (showSearch) {
      showSearch = false;
      invoices.fetch({ state, offset, page_size });
    } else {
      showSearch = true;
    }
  }

  const InvoiceStateArray = [
    ["OPEN", "offen", "yellow"],
    ["PAID", "bezahlt", "teal"],
    ["VOID", "storniert", "red"],
  ];

  function formatInvoiceState(state) {
    return InvoiceStateArray.find((s) => s[0] === state)[1];
  }

  function getInvoiceStateColor(state) {
    return InvoiceStateArray.find((s) => s[0] === state)[2];
  }
</script>

<h1>Rechnungen</h1>

<div class="flex items-baseline justify-between mb-6">
  {#if showSearch}
    <input
      on:input={(e) => invoices.search(e.target.value)}
      class="w-2/3 inp"
      type="text"
      placeholder="Suchen..." />
  {:else}
    <div
      class="flex mb-6 overflow-hidden text-sm text-teal-500 border border-teal-500 rounded-md">
      <input
        class="hidden"
        type="radio"
        bind:group={state}
        name="tabs"
        id="open"
        value="OPEN"
        checked />
      <label
        for="open"
        class="block px-4 py-2 leading-none border-r border-teal-500
          cursor-pointer {state === 'OPEN' ? 'bg-teal-500 text-white' : 'text-teal-500'}">
        offen
      </label>

      <input
        class="hidden"
        type="radio"
        bind:group={state}
        name="tabs"
        id="paid"
        value="PAID" />
      <label
        for="paid"
        class="block px-4 py-2 leading-none border-r border-teal-500
          cursor-pointer {state === 'PAID' ? 'bg-teal-500 text-white' : 'text-teal-500'}">
        bezahlt
      </label>

      <input
        class="hidden"
        type="radio"
        bind:group={state}
        name="tabs"
        id="void"
        value="VOID" />
      <label
        for="void"
        class="block px-4 py-2 leading-none cursor-pointer {state === 'VOID' ? 'bg-teal-500 text-white' : 'text-teal-500'}">
        storniert
      </label>
    </div>
  {/if}

  <div class="flex items-center">
    <button
      on:click={toggleSearch}
      class="p-2 mr-3 text-teal-700 bg-gray-100 rounded-full hover:bg-teal-200">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="stroke-current">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    </button>
    <a
      href={$url('./new')}
      class="p-2 text-teal-700 bg-gray-100 rounded-full hover:bg-teal-200">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="stroke-current">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </a>
  </div>
</div>

{#if $status === 'FETCHING'}
  <p>Loading...</p>
{:else if $invoices.length > 0}
  <div class="overflow-hidden border rounded shadow-md">
    <header
      class="hidden px-6 py-2 text-sm leading-none tracking-wide text-gray-600 bg-gray-200 border-b md:flex">
      <div class="w-1/12 text-center">#</div>
      <div class="w-2/12 text-center">Betrag</div>
      <div class="w-2/12 text-center">Datum</div>
      <div class="w-3/12">Name</div>
      <div class="w-2/12 text-center">Status</div>
      <div class="w-2/12 text-center" />
    </header>
    <ul class="bg-white">
      {#each $invoices as invoice, index (invoice.id)}
        <li
          on:click={() => (invoice.showDetails = !invoice.showDetails)}
          class="border-b hover:bg-gray-100">
          <header class="flex flex-wrap px-6 py-3 text-gray-800">
            <div
              class="w-full mb-2 text-sm text-gray-700  sm:mb-0 sm:justify-center sm:items-center sm:w-1/12">
              <div>MI{invoice.id}</div>
            </div>

            <div class="w-full mb-2  sm:mb-0 sm:justify-center sm:items-center sm:w-2/12">
              <div>{formatter.format(invoice.amount / 100)}</div>
            </div>

            <div class="w-full mb-2  sm:mb-0 sm:justify-center sm:items-center sm:w-2/12">
              <div>
                {new Date(invoice.created_at * 1000).toLocaleDateString()}
              </div>
            </div>

            <div class="w-full mb-2 sm:mb-0 sm:w-3/12">
              <div>
                {invoice.customer_first_name + ' ' + invoice.customer_last_name}
              </div>
              <div class="text-sm text-gray-700">
                {`${invoice.customer_address_line_2 ? invoice.customer_address_line_1 + ', ' + invoice.customer_address_line_2 : invoice.customer_address_line_1}, ${invoice.customer_postal_code + ' ' + invoice.customer_locality + ', ' + invoice.customer_country}`}
              </div>
            </div>

            <div class="flex w-full mb-2 sm:mb-0 sm:justify-center sm:items-center sm:w-2/12">
              <div
                class="px-4 py-1 text-sm leading-none text-{getInvoiceStateColor(invoice.state)}-600
                  bg-{getInvoiceStateColor(invoice.state)}-100 rounded-full">
                {formatInvoiceState(invoice.state)}
              </div>
            </div>

            <div class="flex w-full mb-2 sm:mb-0 sm:justify-end sm:items-center sm:w-2/12">
              {#if invoice.state === 'OPEN'}
                <button
                  on:click={() => invoices.createPayment({
                      amount: invoice.amount,
                      description: 'SEPA Transfer',
                      invoice_id: invoice.id,
                    })}
                  class="flex items-center justify-center w-8 h-8 mr-3 text-green-500 bg-green-100 rounded-full hover:text-green-600 hover:bg-green-200">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </button>
                <button
                  on:click={() => invoices.vd(invoice.id)}
                  class="flex items-center justify-center w-8 h-8 mr-3 text-red-500 bg-red-100 rounded-full hover:text-red-600 hover:bg-red-200">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                  </svg>
                </button>
                <button
                  on:click={() => invoices.resend(invoice.id)}
                  class="flex items-center justify-center w-8 h-8 text-blue-500 bg-blue-100 rounded-full hover:text-blue-600 hover:bg-blue-200">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              {/if}

              {#if invoice.state === 'PAID'}
                <button
                  on:click={() => invoices.deletePayment(invoice.payments[0].id)}
                  class="flex items-center justify-center w-8 h-8 text-green-500 bg-green-100 rounded-full hover:text-green-600 hover:bg-green-200">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </button>
              {/if}

              {#if invoice.state === 'VOID'}
                <button
                  on:click={() => invoices.unvd(invoice.id)}
                  class="flex items-center justify-center w-8 h-8 text-green-500 bg-green-100 rounded-full hover:text-green-600 hover:bg-green-200">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </button>
              {/if}
            </div>
          </header>

          {#if invoice.showDetails}
            <footer class="px-6 py-3 text-gray-800">
              {#each invoice.items as { description, price, quantity, amount }}
                <div>
                  {`${description}, Preis: ${formatter.format(price / 100)}, Menge: ${quantity}, Gesamt: ${formatter.format(amount / 100)} `}
                </div>
                {#if invoice.clss}
                  <div>
                    {`Klasse: ${invoice.clss.subject} ${getTimeString(invoice.clss.times)} Lehrer: ${invoice.clss.teacher.last_name} ${invoice.clss.teacher.first_name}`}
                  </div>
                {/if}
              {/each}
            </footer>
          {/if}
        </li>
      {/each}
    </ul>
  </div>
{:else}
  <div>keine Rechnungen</div>
{/if}
