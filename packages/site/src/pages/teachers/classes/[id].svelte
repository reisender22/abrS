<script>
  import { url, params } from "@roxi/routify";
  import { getTimeString } from "../../../utils/time";
  import { clss, status } from "../../../stores/class";
  import NewLesson from "../../../components/NewLesson.svelte";
  import EditLesson from "../../../components/EditLesson.svelte";

  let tab = "students";

  let showNewLessonDialog = false;

  let editLessonIndex;

  clss.fetch($params.id);

  $: if ($status === "LESSON_CREATED") showNewLessonDialog = false;
</script>

{#if $status === 'FETCHING'}
  <p>Lädt...</p>
{:else}
  <header class="mb-6">
    <h1>{$clss.subject}</h1>
    <div class="text-lg text-gray-700">{getTimeString($clss.times)}</div>
    <div class="text-sm text-gray-600">
      Stunden bis zur naechsten Rechnung: <span
        class="text-teal-600">{$clss.hoursUntilNextInvoice}</span>, letzte
      Rechnung am: {new Date($clss.last_invoice_at * 1000).toLocaleDateString()}
    </div>
  </header>

  <div class="flex items-baseline justify-between">
    <div
      class="flex mb-6 overflow-hidden text-sm text-teal-500 border border-teal-500 rounded-md">
      <input
        class="hidden"
        type="radio"
        bind:group={tab}
        name="tabs"
        id="students"
        value="students" />
      <label
        for="students"
        class="block px-4 py-2 leading-none border-r border-teal-500
          cursor-pointer {tab === 'students' ? 'bg-teal-500 text-white' : 'text-teal-500'}">
        Schüler
      </label>

      <input
        class="hidden"
        type="radio"
        bind:group={tab}
        name="tabs"
        id="lessons"
        value="lessons" />
      <label
        for="lessons"
        class="block px-4 py-2 leading-none cursor-pointer {tab === 'lessons' ? 'bg-teal-500 text-white' : 'text-teal-500'}">
        Unterrichte
      </label>
    </div>

    {#if tab === 'lessons' && $clss.state === 'ONGOING'}
      <button
        on:click={() => (showNewLessonDialog = !showNewLessonDialog)}
        class="text-gray-800 hover:text-teal-600">
        Neuer Unterricht
      </button>
    {/if}
  </div>

  {#if tab === 'students'}
    <div class="overflow-hidden border rounded shadow-md">
      <header
        class="hidden px-6 py-2 text-sm leading-none tracking-wide text-gray-600 bg-gray-200 border-b md:flex">
        <div class="w-3/12">Name</div>
        <div class="w-4/12">Anwesenheit</div>
        <div class="w-2/12">Hausaufgaben</div>
        <div class="w-1/12" />
      </header>
      <ul class="bg-white">
        {#each $clss.enrollments as { student, stats }, index (student.id)}
          <a
            href={$url('../users/' + student.id)}
            class="flex flex-wrap px-6 py-3 text-gray-800 border-b hover:bg-gray-100">
            <div class="w-full mb-2 md:mb-0 md:w-3/12">
              <div>{student.first_name + ' ' + student.last_name}</div>
            </div>

            <div class="flex items-center w-full mb-2 md:mb-0 md:w-4/12">
              {#if stats}
                <div class="w-1/4">
                  <div class="text-xs text-gray-700">Anw.:</div>
                  <div class="text-sm">{stats.attendance.present}</div>
                </div>

                <div class="w-1/4">
                  <div class="text-xs text-gray-700">Unent.:</div>
                  <div class="text-sm">{stats.attendance.absent}</div>
                </div>

                <div class="w-1/4">
                  <div class="text-xs text-gray-700">Ent.:</div>
                  <div class="text-sm">{stats.attendance.excused}</div>
                </div>

                <div class="w-1/4">
                  <div class="text-xs text-gray-700">Passiv:</div>
                  <div class="text-sm">{stats.attendance.passive}</div>
                </div>
              {/if}
            </div>

            <div class="flex items-center w-full mb-2 md:mb-0 md:w-2/12">
              {#if stats}
                <div class="w-1/4 md:w-1/2">
                  <div class="text-xs text-gray-700">Gem.:</div>
                  <div class="text-sm">{stats.homeworks.done}</div>
                </div>

                <div class="w-1/4 md:w-1/2">
                  <div class="text-xs text-gray-700">N. gem.:</div>
                  <div class="text-sm">{stats.homeworks.notDone}</div>
                </div>
              {/if}
            </div>

            <div class="flex w-full mb-2 md:items-center sn:justify-end md:mb-0 md:w-1/12">
              {#if student.invoices.length > 0}
                <div class="w-6 h-6 mr-3 red-orange-500">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0M8 10.5h4m-4 3h4m9-1.5a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              {/if}
            </div>
          </a>
        {/each}
      </ul>
    </div>
  {:else if tab === 'lessons'}
    <div>
      {#if showNewLessonDialog}
        <div class="mb-8">
          <NewLesson />
        </div>
      {/if}

      <h2>Vergangene Unterrichte</h2>

      {#each $clss.lessons as lesson, index (lesson.id)}
        {#if editLessonIndex === index}
          <EditLesson
            {lesson}
            class_id={$clss.id}
            on:updated={() => (editLessonIndex = null)}
            on:canceled={() => (editLessonIndex = null)} />
        {:else}
          <article class="p-4 mb-5 bg-white border rounded-lg shadow">
            <header
              class="flex items-end justify-between mb-1 text-sm font-semibold text-gray-600">
              <div>
                <h3>{lesson.title}</h3>
                <div>
                  {new Date(lesson.date_to * 1000).toLocaleDateString()}
                </div>
              </div>
              <button
                on:click={() => (editLessonIndex = index)}>Bearbeiten</button>
            </header>
            <p class="whitespace-pre-line">{lesson.notes_md}</p>
            {#if lesson.homeworks_md}
              <p class="whitespace-pre-line">
                <span class="font-semibold text-teal-500">Hausaufgaben: </span>{lesson.homeworks_md}
              </p>
            {/if}
          </article>
        {/if}
      {/each}
    </div>
  {/if}
{/if}
