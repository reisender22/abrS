<script>
  import { client, gql } from "../../utils/client";
  import { formatter } from "../../utils/currency";

  const promise = client.request(`
    query GetStats {
      getStats {
        salesByMonth {
          month
          sales
        }
        salesByYear {
          year
          sales
        }
        students
        teachers
        classes
        openInvoices
        openInvoicesAmount
      }
    }
  `);
</script>

<h1>Übersicht</h1>

{#await promise then { data }}
  <h2>Statistik</h2>

  <div class="overflow-hidden border rounded shadow-md">
    <div class="bg-white">
      <div
        class="flex flex-wrap px-6 py-3 text-gray-800 border-b hover:bg-gray-100">
        <div class="w-3/12">Schüler</div>
        <div class="w-9/12">{data.getStats.students}</div>
      </div>
      <div
        class="flex flex-wrap px-6 py-3 text-gray-800 border-b hover:bg-gray-100">
        <div class="w-3/12">Lehrer</div>
        <div class="w-9/12">{data.getStats.teachers}</div>
      </div>
      <div
        class="flex flex-wrap px-6 py-3 text-gray-800 border-b hover:bg-gray-100">
        <div class="w-3/12">Klassen</div>
        <div class="w-9/12">{data.getStats.classes}</div>
      </div>
      <div
        class="flex flex-wrap px-6 py-3 text-gray-800 border-b hover:bg-gray-100">
        <div class="w-3/12">Offene Rechnungen</div>
        <div class="w-9/12">{`${data.getStats.openInvoices} (${formatter.format(data.getStats.openInvoicesAmount / 100)})` }</div>
      </div>
      {#each data.getStats.salesByYear as { year, sales }}
        <div
          class="flex flex-wrap px-6 py-3 text-gray-800 border-b hover:bg-gray-100">
          <div class="w-3/12">{year}</div>
          <div class="w-9/12">{formatter.format(sales / 100)}</div>
        </div>
      {/each}
      {#each data.getStats.salesByMonth as { month, sales }}
        <div
          class="flex flex-wrap px-6 py-3 text-gray-800 border-b hover:bg-gray-100">
          <div class="w-3/12">{month}</div>
          <div class="w-9/12">{formatter.format(sales / 100)}</div>
        </div>
      {/each}
    </div>
  </div>
{/await}
