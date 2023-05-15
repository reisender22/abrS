<script>
  import { classes, status } from "../../../stores/classes";
  import { getTimeString } from "../../../utils/time";
  import { metatags, url } from "@roxi/routify";

  metatags.title = "Klassen";
  metatags.description = "Description coming soon...";

  classes.fetch();

  $: sortedClasses = $classes.sort((a, b) => {
    let comparison = 0;

    if (a.state > b.state) comparison = -1;

    if (a.state < b.state) comparison = 1;

    return comparison;
  });

  const StateArray = [
    ["IN_PREPARATION", "in Vorbereitung", "purple"],
    ["OPEN_FOR_REGISTRATION", "Anmeldung geöffnet", "blue"],
    ["ONGOING", "laufend", "yellow"],
    ["COMPLETED", "abgeschlossen", "teal"],
    ["CANCELLED", "abgebrochen", "red"],
  ];

  function formatClassState(state) {
    return StateArray.find((s) => s[0] === state)[1];
  }

  function getClassStateColor(state) {
    return StateArray.find((s) => s[0] === state)[2];
  }
</script>

<h1>Klassen</h1>

<div class="flex items-baseline justify-end mb-6">
  <a href={$url('./new')} class="text-gray-800 hover:text-teal-600">
    Neue Klasse erstellen
  </a>
</div>

{#if $status === 'FETCHING'}
  <p>Loading...</p>
{:else if sortedClasses.length > 0}
  <div class="overflow-hidden border rounded shadow-md">
    <header
      class="hidden px-6 py-2 text-sm leading-none tracking-wide text-gray-600 bg-gray-200 border-b md:flex">
      <div class="w-3/12">Fach</div>
      <div class="w-5/12 text-center">Lehrer</div>
      <div class="w-1/12 text-center">Schüler</div>
      <div class="w-3/12 text-center">Status</div>
    </header>
    <div class="bg-white">
      {#each sortedClasses as clss, index (clss.id)}
        <a
          href={$url('./' + clss.id)}
          class="flex flex-wrap px-6 py-3 text-gray-800 border-b hover:bg-gray-100">
          <div class="w-full mb-2 sm:mb-0 sm:w-3/12">
            <div>{clss.subject}</div>
            <div class="text-sm text-gray-700">{getTimeString(clss.times)}</div>
          </div>

          <div class="flex w-full mb-2 text-gray-700 sm:mb-0 sm:items-center sm:justify-center sm:w-5/12">
            <div>{clss.teacher.first_name + ' ' + clss.teacher.last_name}</div>
          </div>

          <div class="flex w-full mb-2 sm:mb-0 sm:items-center sm:justify-center sm:w-1/12">
            <div><span class="sm:hidden">Schüler:</span> {clss.enrollments.length}</div>
          </div>

          <div class="flex w-full mb-2 sm:mb-0 sm:items-center sm:justify-center sm:w-3/12">
            <div
              class="px-4 py-1 text-sm leading-none text-{getClassStateColor(clss.state)}-600
                bg-{getClassStateColor(clss.state)}-100 rounded-full">
              {formatClassState(clss.state)}
            </div>
          </div>
        </a>
      {/each}
    </div>
  </div>
{:else}
  <div>keine Klassen</div>
{/if}
