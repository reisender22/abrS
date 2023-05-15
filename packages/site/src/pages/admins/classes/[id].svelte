<script>
  import { getTimeString } from "../../../utils/time";
  import { formatter } from "../../../utils/currency";
  import { params, metatags, redirect, url } from "@roxi/routify";

  import { users } from "../../../stores/users";
  import { clss, status as classStatus } from "../../../stores/class";
  import CreateInvoiceModal from "../../../components/CreateInvoiceModal.svelte";
  import CustomPricePerHourModal from "../../../components/CustomPricePerHourModal.svelte";

  metatags.title = "My Routify app";
  metatags.description = "Description coming soon...";

  let tab = "settings";
  let showAddStudentSearch = false;
  let showRequestClassChangeDialog = false;
  let student;
  let enrollmentToEdit;

  clss.fetch($params.id);

  $: if (tab === "settings") users.fetch({ role: "TEACHER" });

  $: if ($classStatus === "DELETED") $redirect("../");

  $: if ($classStatus === "CREATED_ENROLLMENT") {
    showAddStudentSearch = false;
    classStatus.reset();
  }

  let studentToAdd;
</script>

{#if $classStatus === 'FETCHING'}
  <p>Loading...</p>
{:else}
  <header class="mb-6">
    <h1>{$clss.subject}</h1>
    <div class="text-lg text-gray-700">{getTimeString($clss.times)}</div>
    <div class="text-sm text-gray-600">
      Stunden bis zur naechsten Rechnung:
      <span class="text-teal-600">{$clss.hoursUntilNextInvoice}</span>
      {#if $clss.last_invoice_at}
        , letzte Rechnung am:
        {new Date($clss.last_invoice_at * 1000).toLocaleDateString()}
      {/if}
    </div>
  </header>

  <div class="flex flex-wrap items-end justify-between mb-6">
    <div
      class="flex overflow-hidden text-sm text-teal-500 border border-teal-500 rounded-md">
      <input
        class="hidden"
        type="radio"
        bind:group={tab}
        name="tabs"
        id="settings"
        value="settings" />
      <label
        for="settings"
        class="block px-4 py-2 leading-none border-r border-teal-500
          cursor-pointer {tab === 'settings' ? 'bg-teal-500 text-white' : 'text-teal-500'}">
        Einstellungen
      </label>

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

    {#if tab === 'settings' && $clss.state === 'OPEN_FOR_REGISTRATION'}
      <button
        on:click={clss.createFirstInvoices}
        class="px-3 py-1 text-sm text-yellow-700 bg-yellow-200 border border-yellow-300 rounded btn"
        disabled={$classStatus === 'CREATING_FIRST_INVOICES'}>
        {$classStatus === 'CREATING_FIRST_INVOICES' ? 'Bitte warten...' : 'Rechnungen verschicken'}
      </button>
    {:else if tab === 'students'}
      <button
        on:click={() => {
          showAddStudentSearch = !showAddStudentSearch;
          users.reset();
        }}
        class="p-2 text-teal-700 bg-gray-100 rounded-full hover:bg-teal-200">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    {/if}
  </div>

  {#if tab === 'settings'}
    <form>
      <div class="mb-5">
        <label for="name">Name (optional)</label>
        <input type="text" bind:value={$clss.name} id="name" />
      </div>

      <div class="mb-5">
        <label for="subject">Fach</label>
        <input
          type="text"
          bind:value={$clss.subject}
          id="subject"
          disabled={$clss.state !== 'IN_PREPARATION'} />
      </div>

      <div class="mb-5">
        <label for="gender">Klasse für</label>
        <select
          bind:value={$clss.gender}
          id="gender"
          disabled={$clss.state !== 'IN_PREPARATION'}>
          <option value="MALE">Brüder</option>
          <option value="FEMALE">Schwestern</option>
        </select>
      </div>

      <div class="flex flex-wrap mb-5 -mx-3">
        {#each $clss.times as time, index}
          <div class="w-full mx-3 mb-5 sm:mb-0">
            <label for="day_{index}">Tag</label>
            <select
              bind:value={$clss.times[index].day}
              id="day_{index}"
              disabled={$clss.state !== 'IN_PREPARATION'}>
              <option value="MON">Montag</option>
              <option value="TUE">Dienstag</option>
              <option value="WED">Mittwoch</option>
              <option value="THU">Donnerstag</option>
              <option value="FRI">Freitag</option>
              <option value="SAT">Samstag</option>
              <option value="SUN">Sonntag</option>
            </select>
          </div>

          <div class="w-full mx-3 mb-5 sm:w-auto sm:mb-0">
            <label for="from_{index}">von</label>
            <input
              type="time"
              bind:value={$clss.times[index].from}
              id="from_{index}"
              disabled={$clss.state !== 'IN_PREPARATION'} />
          </div>

          <div class="w-full mx-3 sm:w-auto">
            <label for="to_{index}">bis</label>
            <input
              type="time"
              bind:value={$clss.times[index].to}
              id="to_{index}"
              disabled={$clss.state !== 'IN_PREPARATION'} />
          </div>
        {/each}
      </div>

      <div class="mb-5">
        <label for="teacher_id">Lehrer</label>
        <select
          bind:value={$clss.teacher_id}
          id="teacher_id"
          disabled={$clss.state !== 'IN_PREPARATION'}>
          {#each $users as { id, first_name, last_name }, index (id)}
            <option value={id}>{first_name + ' ' + last_name}</option>
          {/each}
        </select>
      </div>

      <div class="flex flex-wrap mb-5 -mx-3">
        <div class="w-full mx-3 mb-5 sm:mb-0 sm:w-1/2">
          <label for="registration_fee">Registrierungsgebühr (in Cents)</label>
          <input
            type="number"
            bind:value={$clss.registration_fee}
            id="registration_fee"
            min="0"
            disabled={$clss.state !== 'IN_PREPARATION'} />
        </div>

        <div class="w-full mx-3 sm:w-1/2">
          <label for="registration_fee_offer">Registrierungsgebühr Angebot (in
            Cents)</label>
          <input
            type="number"
            bind:value={$clss.registration_fee_offer}
            id="registration_fee_offer"
            min="0"
            disabled={$clss.state !== 'IN_PREPARATION'} />
        </div>
      </div>

      <div class="flex flex-wrap mb-5 -mx-3">
        <div class="w-full mx-3 mb-5 sm:mb-0 sm:w-1/2">
          <label for="price_per_hour">Preis je Stunde (in Cents)</label>
          <input
            type="number"
            bind:value={$clss.price_per_hour}
            id="price_per_hour"
            min="0"
            disabled={$clss.state !== 'IN_PREPARATION'} />
        </div>

        <div class="w-full mx-3 sm:w-1/2">
          <label for="hours_per_lesson">Stunden je Unterricht</label>
          <input
            type="number"
            bind:value={$clss.hours_per_lesson}
            id="hours_per_lesson"
            min="1"
            disabled={$clss.state !== 'IN_PREPARATION'} />
        </div>
      </div>

      <div class="flex flex-wrap mb-5 -mx-3">
        <div class="w-full mx-3 mb-5 sm:mb-0 sm:w-1/2">
          <label for="invoice_cycle">Abrechnungszyklus in Stunden</label>
          <input
            type="number"
            bind:value={$clss.invoice_cycle}
            id="invoice_cycle"
            min="0"
            disabled={$clss.state !== 'IN_PREPARATION'} />
        </div>
        <div class="w-full mx-3 sm:w-1/2">
          <label for="state">Status</label>
          <select bind:value={$clss.state} id="state">
            <option value="IN_PREPARATION">in Vorbereitung</option>
            <option value="OPEN_FOR_REGISTRATION">
              Registrierung geöffnet
            </option>
            <option value="ONGOING">laufend</option>
            <option value="COMPLETED">abgeschlossen</option>
            <option value="CANCELLED">abgebrochen</option>
          </select>
        </div>
      </div>

      <div class="mb-5">
        <label for="description"> Beschreibung </label>
        <textarea rows="5" bind:value={$clss.description} id="description" />
      </div>

      <div class="mb-5">
        <label for="notes">Notizen (nicht öffentlich)</label>
        <textarea rows="3" bind:value={$clss.notes} id="notes" />
      </div>

      <div class="flex justify-between">
        <button
          on:click|preventDefault={clss.update}
          class="btn btn--primary"
          disabled={$classStatus === 'UPDATING'}>
          {$classStatus === 'UPDATING' ? 'Speichert...' : 'Speichern'}
        </button>
      </div>
    </form>
  {:else if tab === 'students'}
    <div class="overflow-hidden border rounded shadow-md">
      <header
        class="hidden px-6 py-2 text-sm leading-none tracking-wide text-gray-600 bg-gray-200 border-b md:flex">
        <div class="w-4/12">Name</div>
        <div class="w-4/12">Anwesenheit</div>
        <div class="w-2/12">Hausaufgaben</div>
        <div class="w-1/12">Stundenpreis</div>
        <div class="w-1/12" />
      </header>
      <div class="bg-white">
        {#each $clss.enrollments as enrollment, index (enrollment.id)}
          <div
            class="flex flex-wrap px-6 py-3 text-gray-800 border-b hover:bg-gray-100">
            <div class="w-full mb-2 sm:mb-0 sm:w-4/12">
              <a
                href={$url('../users/' + enrollment.student.id)}>{enrollment.student.first_name + ' ' + enrollment.student.last_name}</a>
              <div class="text-sm text-gray-700">
                {[enrollment.student.email, enrollment.student.phone_number]
                  .filter(Boolean)
                  .join(', ')}
              </div>
            </div>

            <div class="flex w-full mb-2 sm:items-center sm:mb-0 sm:w-4/12">
              {#if enrollment.stats}
                <div class="w-1/4">
                  <div class="text-xs text-gray-700">Anw.:</div>
                  <div class="text-sm">
                    {enrollment.stats.attendance.present}
                  </div>
                </div>

                <div class="w-1/4">
                  <div class="text-xs text-gray-700">Unent.:</div>
                  <div class="text-sm">
                    {enrollment.stats.attendance.absent}
                  </div>
                </div>

                <div class="w-1/4">
                  <div class="text-xs text-gray-700">Ent.:</div>
                  <div class="text-sm">
                    {enrollment.stats.attendance.excused}
                  </div>
                </div>

                <div class="w-1/4">
                  <div class="text-xs text-gray-700">Passiv:</div>
                  <div class="text-sm">
                    {enrollment.stats.attendance.passive}
                  </div>
                </div>
              {/if}
            </div>

            <div class="flex items-center w-full mb-2 sm:mb-0 sm:w-2/12">
              {#if enrollment.stats}
                <div class="w-1/4 sm:w-1/2">
                  <div class="text-xs text-gray-700">Gem.:</div>
                  <div class="text-sm">{enrollment.stats.homeworks.done}</div>
                </div>

                <div class="w-1/4 sm:w-1/2">
                  <div class="text-xs text-gray-700">Nicht:</div>
                  <div class="text-sm">
                    {enrollment.stats.homeworks.notDone}
                  </div>
                </div>
              {/if}
            </div>

            <div class="flex items-center w-full mb-2 sm:mb-0 sm:w-1/12">
              <button
                on:click={() => (enrollmentToEdit = enrollment)}
                class="text-sm text-gray-600 btn">
                <span class="sm:hidden">Stundenpreis</span>
                {enrollment.custom_price_per_hour ? formatter.format(enrollment.custom_price_per_hour / 100) : 'Standard'}
              </button>
            </div>

            <div
              class="flex w-full mb-2 sm:justify-end sm:items-center sm:mb-0 sm:w-1/12">
              {#if enrollment.student.invoices.length > 0}
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

              <button
                on:click={() => clss.delEnrollment(enrollment.id)}
                class="flex items-center justify-center w-8 h-8 mr-2 text-red-500 bg-red-100 rounded-full hover:text-red-600 hover:bg-red-200">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>

              <button
                on:click={() => {
                  student = { enrollment_id: enrollment.id, ...enrollment.student };
                  showRequestClassChangeDialog = !showRequestClassChangeDialog;
                }}
                class="flex items-center justify-center w-8 h-8 text-teal-500 bg-teal-100 rounded-full hover:text-teal-600 hover:bg-teal-200">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"><path
                    d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" /></svg>
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {:else if tab === 'lessons'}
    {#each $clss.lessons as lesson, index (lesson.id)}
      <article class="p-4 mb-5 bg-white border rounded-lg shadow">
        <header class="mb-1 text-sm font-semibold text-gray-600">
          <h3>{lesson.title}</h3>
          <div>{new Date(lesson.date_to * 1000).toLocaleDateString()}</div>
        </header>
        <p>{lesson.notes_md}</p>
        {#if lesson.homeworks_md}
          <p>
            <span class="font-semibold text-teal-500">Hausaufgaben:
            </span>{lesson.homeworks_md}
          </p>
        {/if}
      </article>
    {/each}
  {/if}
{/if}

{#if showAddStudentSearch || enrollmentToEdit}
  <div class="fixed top-0 left-0 z-20 w-full min-h-screen">
    <!-- transparent Backdrop -->
    <div class="absolute top-0 left-0 z-40 w-full h-full bg-black opacity-75" />

    <!-- Wrapper -->
    <div
      class="absolute top-0 left-0 z-50 flex items-end justify-center w-full h-full p-4 sm:items-center">
      <!-- Student Dialog -->
      {#if showAddStudentSearch}
        <div
          class="w-full overflow-hidden bg-gray-100 rounded shadow sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4">
          <header class="p-4 bg-white">
            <p class="m-0 text-xl">Schüler zur Klasse hinzufügen</p>
          </header>
          <div class="p-4 bg-white">
            <form
              on:input|preventDefault={(event) => {
                studentToAdd = null;
                users.search(event.target.value, {
                  roles: ['STUDENT'],
                  page_size: 3,
                });
              }}>
              <input type="text" placeholder="Schüler suchen" />
            </form>

            <ul class="mt-3">
              {#each $users as { id, first_name, last_name, email }, index (id)}
                <li
                  on:click={() => (studentToAdd === id ? (studentToAdd = null) : (studentToAdd = id))}
                  class="p-2 cursor-pointer rounded border border-transparent {studentToAdd === id ? 'border-teal-500' : ''}">
                  <div>{first_name + ' ' + last_name}</div>
                  <div class="text-sm text-gray-700">{email}</div>
                </li>
              {/each}
            </ul>
          </div>
          <footer class="flex justify-between p-4 bg-gray-200">
            <button
              on:click={() => (showAddStudentSearch = false)}
              class="btn btn--secondary">
              Abbrechen
            </button>
            <button
              on:click={() => clss.createEnrollment(studentToAdd, $clss.id)}
              disabled={!studentToAdd || $classStatus === 'CREATING_ENROLLMENT'}
              class="btn btn--primary">
              {$classStatus === 'CREATING_ENROLLMENT' ? 'Einen Moment...' : 'Hinzufügen'}
            </button>
          </footer>
        </div>
      {:else if enrollmentToEdit}
        <CustomPricePerHourModal
          enrollment={enrollmentToEdit}
          on:updated={() => (enrollmentToEdit = null)}
          on:cancel={() => (enrollmentToEdit = null)} />
      {/if}
    </div>
  </div>
{/if}

{#if student}
  <CreateInvoiceModal
    show={showRequestClassChangeDialog}
    requestClassChange={true}
    oldClassId={$params.id}
    {student} />
{/if}
