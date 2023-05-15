<script>
  export let columns = [];
  export let items = [];
  export let actions = [];

  const id = ({ id }) => id;

  const fullName = ({ first_name, last_name }) => first_name + " " + last_name;

  const email = ({ email }) => email;

  const address = ({
    address_line_1,
    address_line_2,
    postal_code,
    locality,
    country,
  }) =>
    [address_line_1, address_line_2, postal_code + " " + locality, country]
      .filter(Boolean)
      .join(", ");

  columns = [
    { text: "ID", size: 1, align: "center", value: id },
    { text: "E-Mail", size: 3, align: "left", value: email },
    { text: "Name", size: 3, align: "left", value: fullName },
    { text: "Adresse", size: 5, align: "left", value: address },
  ];
</script>

<div class="overflow-hidden border rounded shadow-md">
  <header
    class="flex px-2 py-2 text-sm leading-none tracking-wide text-gray-600 bg-gray-200 border-b">
    {#each columns as { text, size, align }}
      <div class="w-{size}/12 text-{align}">{text}</div>
    {/each}
  </header>

  <div class="bg-white">
    {#each items as item, index (item.id || item)}
      <div>
        <div class="flex px-2 py-3 text-gray-800">
          {#each columns as { size, align, value }}
            <div class="w-{size}/12 text-{align}">{value(item)}</div>
          {/each}
        </div>
        {#if actions.length > 0}<button> Menu </button>{/if}
      </div>
    {/each}
  </div>
</div>
