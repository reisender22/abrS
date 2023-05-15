<script>
  import { createEventDispatcher } from "svelte";
  import { clss, status } from "../stores/class";

  export let lesson;
  export let class_id

  let { id, date_from, title, notes_md, homeworks_md } = lesson;

  const dispatch = createEventDispatcher();

  const date = new Date(date_from * 1000);

  let dateFrom = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;

  $: if ($status === "UPDATED_LESSON") dispatch("updated");

  function update() {
    date_from = Math.floor(
      new Date(
        dateFrom + " " + new Date().getHours() + ":" + new Date().getMinutes()
      ).getTime() / 1000
    );

    const date_to = date_from;

    clss.updateLesson(id, {
      date_from,
      date_to,
      title,
      notes_md,
      homeworks_md,
      class_id,
    });
  }
</script>

<div class="p-6 mb-8 bg-white border rounded">
  <h1>Unterricht bearbeiten</h1>

  <form>
    <div>
      <div class="flex mb-5">
        <div class="mr-6">
          <label for="date_from">Datum</label>
          <input
            type="date"
            bind:value={dateFrom}
            id="date_from"
            class="h-10 px-3 bg-transparent appearance-none" />
        </div>
      </div>
    </div>

    <div class="mb-5">
      <label for="text_md" class="lbl">Titel</label>
      <input type="text" bind:value={title} id="text_md" />
    </div>

    <div class="mb-5">
      <label for="notes_md" class="lbl">
        Notizen (Markdown wird unterstützt)
      </label>
      <textarea bind:value={notes_md} id="notes_md" rows="6" />
    </div>

    <div class="mb-8">
      <label for="homeworks_md" class="lbl">
        Hausaufgaben (Markdown wird unterstützt)
      </label>
      <textarea bind:value={homeworks_md} id="homeworks_md" rows="6" />
    </div>
  </form>

  <div class="flex justify-between">
    <button on:click={() => dispatch('canceled')}>Abbrechen</button>
    <button
      on:click={update}
      class="btn btn--primary"
      disabled={$status === 'UPDATING_LESSON'}>
      {$status === 'UPDATING_LESSON' ? 'Bitte warten...' : 'Speichern'}
    </button>
  </div>
</div>
