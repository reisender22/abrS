<script>
  import { formatter } from "../utils/currency";
  import { classes } from "../stores/classes";
  import { getTimeString } from "../utils/time";
  import { invoice, status } from "../stores/invoice";
  import { clss } from "../stores/class";

  export let student;
  export let show = false;
  export let requestClassChange = false;
  export let oldClassId;

  let newClassId;

  status.reset();
  classes.fetch();

  $: filteredClasses = $classes.filter(
    (c) =>
      c.gender === student.gender &&
      c.state !== "CANCELLED" &&
      c.state !== "COMPLETED"
  );

  $: if (oldClassId && newClassId)
    clss
      .requestClassChange(student.id, oldClassId, newClassId)
      .then((i) => (input = i));

  $: if ($status === "CREATED") {
    show = false;
  }

  let input = {
    student_id: student.id,
    items: [{ type: "class", description: "", price: 1000, quantity: 1 }],
  };

  function addItem() {
    input.items = [
      ...input.items,
      { type: "material", description: "", price: 1000, quantity: 1 },
    ];
  }

  function addClass() {
    input.items = [
      ...input.items,
      { type: "class", description: "", price: 0, quantity: 2, class_id: null },
    ];
  }

  function removeItem(index) {
    input.items = input.items.filter((item, i) => i !== index);
  }

  function hide() {
    show = false;
  }

  function create() {
    let incomplete = false;

    for (const item of input.items) {
      if (
        item.type === "class" &&
        !filteredClasses.find(({ id }) => id === item.class_id)
      ) {
        incomplete = true;
      }

      if (item.type === "material" && !item.description) {
        incomplete = true;
      }
    }

    if (incomplete) return;

    const items = input.items.map(
      ({ description, price, quantity, class_id }) => ({
        description,
        price,
        quantity,
        class_id,
      })
    );

    invoice.create({ ...input, items });

    if (requestClassChange) {
      clss.delEnrollment(student.enrollment_id);
      clss.createEnrollment(student.id, newClassId);
    }
  }
</script>

{#if show}
  <div>
    <div class="fixed top-0 left-0 z-20 w-full min-h-screen">
      <!-- transparent Backdrop -->
      <div
        class="absolute top-0 left-0 z-40 w-full h-full bg-black opacity-75" />

      <!-- Wrapper -->
      <div
        class="absolute top-0 left-0 z-50 flex items-end justify-center w-full h-full p-4 sm:items-center">
        <!-- Modal -->
        <div
          class="w-full overflow-hidden bg-gray-100 rounded shadow sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3">
          <header class="p-4 bg-white">
            <p class="m-0 text-xl">
              Neue Rechnung für
              {student.first_name + ' ' + student.last_name}
            </p>
          </header>

          {#if requestClassChange}
            <form class="p-4 bg-white">
              <div>
                <label for="new_class">Neue Klasse</label>
                <select id="new_class" bind:value={newClassId}>
                  <option value="" />
                  {#each filteredClasses as { id, subject, times, teacher }}
                    <option value={id}>
                      {`${subject}, ${getTimeString(times)}, ${teacher.first_name} ${teacher.last_name}`}
                    </option>
                  {/each}
                </select>
              </div>
            </form>
          {/if}

          <div class="p-4 bg-white">
            <div class="flex justify-end mb-6">
              <button
                on:click={addClass}
                class="mr-3 text-green-600 focus:outline-none hover:text-green-700">Unterricht
              </button>
              <button
                on:click={addItem}
                class="text-green-600 focus:outline-none hover:text-green-700">Material
              </button>
            </div>
            <div class="flex mb-1">
              <div class="w-7/12 mr-3 text-sm text-gray-700">Beschreibung</div>
              <div class="w-2/12 mr-3 text-sm text-gray-700 uppercase">
                Preis
              </div>
              <div class="w-2/12 text-sm text-gray-700 uppercase">Menge</div>
              <div class="w-1/12" />
            </div>

            {#each input.items as item, index (item)}
              {#if item.type === 'class'}
                <div class="flex mb-3">
                  <select
                    bind:value={item.class_id}
                    on:blur={({ target }) => (item.price = filteredClasses.find((c) => c.id === target.value).price_per_hour)}
                    class="w-7/12 mr-3 inp">
                    <option value="" />

                    {#each filteredClasses as { id, subject, times, teacher }}
                      <option value={id}>
                        {`${subject}, ${getTimeString(times)}, ${teacher.first_name} ${teacher.last_name}`}
                      </option>
                    {/each}
                  </select>

                  <input
                    type="number"
                    min="0"
                    bind:value={item.price}
                    class="w-2/12 mr-3 inp" />

                  <input
                    type="number"
                    min="1"
                    bind:value={item.quantity}
                    class="w-2/12 inp" />

                  <div class="flex items-center justify-end w-1/12">
                    <button
                      on:click={() => removeItem(index)}
                      class="p-1 text-red-700 bg-red-100 rounded-full focus:outline-none hover:bg-red-200">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"><line
                          x1="18"
                          y1="6"
                          x2="6"
                          y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                </div>
              {:else}
                <div class="flex mb-3">
                  <input
                    type="text"
                    bind:value={item.description}
                    class="w-7/12 mr-3 inp" />

                  <input
                    type="number"
                    bind:value={item.price}
                    class="w-2/12 mr-3 inp" />

                  <input
                    type="number"
                    min="1"
                    bind:value={item.quantity}
                    class="w-2/12 inp" />

                  <div class="flex items-center justify-end w-1/12">
                    <button
                      on:click={() => removeItem(index)}
                      class="p-1 text-red-700 bg-red-100 rounded-full focus:outline-none hover:bg-red-200">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"><line
                          x1="18"
                          y1="6"
                          x2="6"
                          y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                </div>
              {/if}
            {/each}

            <div class="flex">
              <div class="w-7/12 mr-3" />
              <div class="w-2/12 mr-3">Gesamt:</div>
              <div class="w-2/12 font-semibold text-teal-700">
                {formatter.format(input.items.reduce((acc, i) => (acc += i.price * i.quantity), 0) / 100)}
              </div>
              <div class="w-1/12" />
            </div>
          </div>

          <footer class="flex justify-between p-4 bg-gray-200">
            <button on:click={hide} class="btn btn--secondary">
              Abbrechen
            </button>
            <button
              on:click={create}
              disabled={$status === 'CREATING'}
              class="btn btn--primary">
              {$status === 'CREATING' ? 'Einen Moment...' : requestClassChange ? 'Klasse wechseln' : 'Erstellen'}
            </button>
          </footer>
        </div>
      </div>
    </div>
  </div>
{/if}
