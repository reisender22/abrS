<script>
  import { metatags, url } from "@roxi/routify";
  import { users, status } from "../../../stores/users";

  metatags.title = "Benutzer";

  let role = "STUDENT";
  let offset = "0";
  let page_size = 25;

  let showSearch = false;

  $: users.fetch({ role, offset, page_size });

  function toggleSearch() {
    if (showSearch) {
      showSearch = false;
      users.fetch({ role, offset, page_size });
    } else {
      showSearch = true;
    }
  }
</script>

<h1>Benutzer</h1>

<div class="flex flex-wrap items-end justify-between mb-6">
  {#if showSearch}
    <input
      on:input={(e) => users.search(e.target.value)}
      class="w-2/3 inp"
      type="text"
      placeholder="Suchen..." />
  {:else}
    <div
      class="flex overflow-hidden text-sm text-teal-500 border border-teal-500 rounded-md">
      <input
        class="hidden"
        type="radio"
        bind:group={role}
        name="tabs"
        id="students"
        value="STUDENT"
        checked />
      <label
        for="students"
        class="block px-4 py-2 leading-none border-r border-teal-500
          cursor-pointer {role === 'STUDENT' ? 'bg-teal-500 text-white' : 'text-teal-500'}">
        Schüler
      </label>

      <input
        class="hidden"
        type="radio"
        bind:group={role}
        name="tabs"
        id="teachers"
        value="TEACHER" />
      <label
        for="teachers"
        class="block px-4 py-2 leading-none border-r border-teal-500
          cursor-pointer {role === 'TEACHER' ? 'bg-teal-500 text-white' : 'text-teal-500'}">
        Lehrer
      </label>

      <input
        class="hidden"
        type="radio"
        bind:group={role}
        name="tabs"
        id="admins"
        value="ADMIN" />
      <label
        for="admins"
        class="block px-4 py-2 leading-none cursor-pointer {role === 'ADMIN' ? 'bg-teal-500 text-white' : 'text-teal-500'}">
        Admins
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
{:else if $users.length > 0}
  <div class="overflow-hidden border rounded shadow-md">
    <header
      class="hidden px-6 py-2 text-sm leading-none tracking-wide text-gray-600 bg-gray-200 border-b sm:flex">
      <div class="w-4/12">Name</div>
      <div class="w-8/12">Adresse</div>
    </header>
    <div class="bg-white">
      {#each $users as user, index (user.id)}
        <a
          href={$url('./' + user.id)}
          class="flex flex-wrap px-6 py-3 text-gray-800 border-b hover:bg-gray-100">
          <div class="w-full mb-2 sm:mb-0 sm:w-4/12">
            <div>{user.first_name + ' ' + user.last_name}</div>
            <div class="text-sm text-gray-700">{user.email}</div>
          </div>

          <div class="flex items-center w-full mb-2 sm:mb-0 sm:w-8/12">
            <div>
              {[
                user.address_line_1,
                user.address_line_2,
                user.postal_code + ' ' + user.locality,
                user.country,
              ]
                .filter(Boolean)
                .join(', ')}
            </div>
          </div>
        </a>
      {/each}
    </div>
  </div>
{:else}
  <div>keine Benutzer</div>
{/if}
