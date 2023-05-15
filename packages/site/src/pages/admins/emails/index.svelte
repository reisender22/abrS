<script>
  import { emails, status } from "../../../stores/emails";
  import { getTimeString } from "../../../utils/time";
  import { metatags, url } from "@roxi/routify";

  metatags.title = "Versendete Emails";
  metatags.description = "Description coming soon...";

  let emailStatus = "SUCCESS";
  let offset = 0;
  let page_size = 25;

  $: emails.fetch({ status: emailStatus, offset, page_size });
</script>

<h1>Versendete Emails</h1>

<div class="flex items-baseline justify-between">
  <div
    class="flex mb-6 overflow-hidden text-sm text-teal-500 border border-teal-500 rounded-md">
    <input
      class="hidden"
      type="radio"
      bind:group={emailStatus}
      name="tabs"
      id="successful"
      value="SUCCESS" />
    <label
      for="successful"
      class="block px-4 py-2 leading-none border-r border-teal-500
      cursor-pointer {emailStatus === 'SUCCESS' ? 'bg-teal-500 text-white' : 'text-teal-500'}">
      Gesendet
    </label>

    <input
      class="hidden"
      type="radio"
      bind:group={emailStatus}
      name="tabs"
      id="failed"
      value="FAILURE" />
    <label
      for="failed"
      class="block px-4 py-2 leading-none cursor-pointer {emailStatus === 'FAILURE' ? 'bg-teal-500 text-white' : 'text-teal-500'}">
      Fehlgeschlagen
    </label>
  </div>
</div>

{#if $status === 'FETCHING'}
  <p>Loading...</p>
{:else if $emails.length > 0}
  <div class="overflow-hidden border rounded shadow-md">
    <header
      class="hidden px-6 py-2 text-sm leading-none tracking-wide text-gray-600 bg-gray-200 border-b sm:flex">
      <div class="w-5/12">Betreff</div>
      <div class="w-3/12 text-center">an</div>
      <div class="w-2/12 text-center">Status</div>
      <div class="w-2/12 text-center">Datum</div>
    </header>
    <ul class="bg-white">
      {#each $emails as email, index (email.id)}
        <li
          class="flex flex-wrap px-6 py-3 text-gray-800 border-b hover:bg-gray-100">
          <div class="w-full mb-2 sm:mb-0 sm:w-5/12">
            <div>{email.subject}</div>
          </div>

          <div class="flex w-full mb-2 text-gray-700 sm:items-center sm:justify-center sm:mb-0 sm:w-3/12">
            <a href={$url('../users/' + email.user.id)}>
              {email.user.first_name + ' ' + email.user.last_name}
            </a>
          </div>

          <div class="flex w-full mb-2 sm:items-center sm:justify-center sm:mb-0 sm:w-2/12">
            <div
              class="text-sm leading-none py-1 px-4 rounded-full {email.status === 'SUCCESS' ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}">
              {email.status === 'SUCCESS' ? 'Gesendet' : 'Fehlgeschlagen'}
            </div>
          </div>

          <div class="flex w-full mb-2 sm:items-center sm:justify-center sm:mb-0 sm:w-2/12">
            <div>{new Date(email.created_at * 1000).toLocaleDateString()}</div>
          </div>
        </li>
      {/each}
    </ul>
  </div>
{:else}
  <div>keine versendeten Emails</div>
{/if}
