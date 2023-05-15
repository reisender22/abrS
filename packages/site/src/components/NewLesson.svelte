<script>
  import { clss, status } from "../stores/class";
  import { metatags, url } from "@roxi/routify";

  let lessonInput, sessionInputs;

  let dateFrom, timeFrom, timeTo;

  $: if ($status !== "FETCHING" && !lessonInput) {
    lessonInput = {
      date_from: "",
      date_to: "",
      title: "",
      notes_md: "",
      homeworks_md: "",
      class_id: $clss.id,
    };

    sessionInputs = $clss.enrollments.map((e) => ({
      attendance: "PRESENT",
      has_done_homework: true,
      student_id: e.student.id,
      notes: "",
    }));
  }

  function create() {
    /* lessonInput.date_from = Math.floor(
      new Date(dateFrom + " " + timeFrom).getTime() / 1000
    );

    lessonInput.date_to = Math.floor(
      new Date(dateFrom + " " + timeTo).getTime() / 1000
    ); */

    lessonInput.date_from = Math.floor(
      new Date(
        dateFrom + " " + new Date().getHours() + ":" + new Date().getMinutes()
      ).getTime() / 1000
    );

    lessonInput.date_to = lessonInput.date_from;

    clss.createLesson(lessonInput, sessionInputs);
  }
</script>

{#if $status === 'FETCHING'}
  <p>Einen Moment...</p>
{:else}
  <div>
    <h1>Neuer Unterricht</h1>

    <h2>Beschreibung</h2>

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

          <!-- <div class="mr-6">
            <label for="time_from">Von</label>
            <input
              type="time"
              bind:value={timeFrom}
              id="time_from"
              class="h-10 px-3 bg-transparent appearance-none" />
          </div>

          <div class="">
            <label for="time_to">Bis</label>
            <input
              type="time"
              bind:value={timeTo}
              id="time_to"
              class="h-10 px-3 appearance-none" />
          </div> -->
        </div>
      </div>

      <div class="mb-5">
        <label for="text_md" class="lbl"> Titel </label>
        <input type="text" bind:value={lessonInput.title} id="text_md" />
      </div>

      <div class="mb-5">
        <label for="notes_md" class="lbl">
          Notizen (Markdown wird unterstützt)
        </label>
        <textarea bind:value={lessonInput.notes_md} id="notes_md" rows="6" />
      </div>

      <div class="mb-8">
        <label for="homeworks_md" class="lbl">
          Hausaufgaben (Markdown wird unterstützt)
        </label>
        <textarea
          bind:value={lessonInput.homeworks_md}
          id="homeworks_md"
          rows="6" />
      </div>
    </form>

    <h2>Schüler</h2>

    <div class="mb-8 overflow-hidden border rounded shadow-md">
      <header
        class="hidden px-6 py-2 text-sm leading-none tracking-wide text-gray-600 bg-gray-200 border-b md:flex">
        <div class="w-4/12">Name</div>
        <div class="w-4/12 text-center">Anwesenheit</div>
        <div class="w-2/12 text-center">Hausaufgaben</div>
        <div class="w-2/12 text-center">Offene Rechnungen</div>
      </header>

      <ul class="bg-white">
        {#each $clss.enrollments as enrollment, index (enrollment.id)}
          <li
            class="flex flex-wrap px-6 py-3 text-gray-800 border-b hover:bg-gray-100">
            <div class="w-full mb-2 md:mb-0 md:w-4/12">
              {enrollment.student.first_name + ' ' + enrollment.student.last_name}
            </div>

            <div class="flex w-full mb-2 md:justify-center md:items-center md:mb-0 md:w-4/12">
              <select
                bind:value={sessionInputs[index].attendance}
                class="bg-transparent">
                <option value="PRESENT">anwesend</option>
                <option value="ABSENT">fehlt</option>
                <option value="EXCUSED">entschuldigt</option>
                <option value="PASSIVE">passiv</option>
              </select>
            </div>

            <div class="flex w-full mb-2 md:justify-center md:items-center md:mb-0 md:w-2/12">
              <label
                for="homemwork_{index}"
                class="mr-2 md:hidden">Hausaufgaben:</label>
              <input
                type="checkbox"
                id="homemwork_{index}"
                bind:checked={sessionInputs[index].has_done_homework} />
            </div>

            <div class="w-full text-center md:w-2/12">
              {#each enrollment.student.invoices as { id }}
                <span class="inline-block px-2">MI{id}</span>
              {/each}
            </div>
          </li>
        {/each}
      </ul>
    </div>

    <div class="flex justify-between">
      <a href={$url('./')} class="btn btn--secondary">Abbrechen</a>
      <button
        on:click={create}
        class="btn btn--primary"
        disabled={$status === 'CREATING_LESSON'}>
        {$status === 'CREATING_LESSON' ? 'Bitte warten...' : 'Speichern'}
      </button>
    </div>
  </div>
{/if}
