<script>
  import { url, redirect } from "@roxi/routify";
  import { session } from "../../stores/session";

  let show = false;
</script>

{#if $session.user && $session.user.role === 1}
  <nav
    class="fixed z-10 w-full px-6 py-2 text-sm text-gray-700 bg-white border-b">
    <div class="flex items-center justify-between w-full">
      <div class="font-semibold text-teal-500">Verwaltung</div>
      <div>
        <div class="items-center justify-between hidden md:flex">
          <a href={$url('./classes')} class="mr-3">Meine Klassen</a>

          <a
            href={$url('./notifications')}
            class="flex items-center justify-center p-1 mr-8 rounded-full appearance-none hover:bg-gray-200">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class={$session.user.notifications.filter(({ is_dismissed }) => !is_dismissed).length > 0 ? 'text-teal-500 fill-current' : 'text-gray-600'}>
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </a>

          <button
            on:click={session.logout}
            class="px-4 py-2 leading-none text-teal-600 border border-teal-600 rounded-md hover:bg-teal-600 hover:text-white">
            abmelden
          </button>
        </div>

        <button
          on:click={() => (show = !show)}
          class="px-4 py-2 leading-none text-teal-600 border border-teal-500 rounded-md md:hidden hover:bg-teal-500 hover:text-white">
          Menu
        </button>
      </div>
    </div>

    {#if show}
      <div class="items-center justify-between mt-3">
        <a
          href={$url('./classes')}
          class="block p-2"
          on:click={() => (show = false)}>Meine Klassen</a>

        <a
          href={$url('./notifications')}
          class="block p-2 {$session.user.notifications.filter(({ is_dismissed }) => !is_dismissed).length > 0 ? 'text-teal-500' : ''}"
          on:click={() => (show = false)}>
          Benachrichtigungen
        </a>

        <button
          on:click={session.logout}
          class="px-4 py-2 mb-3 leading-none text-teal-600 border border-teal-500 rounded-md hover:bg-teal-500 hover:text-white">
          Abmelden
        </button>
      </div>
    {/if}
  </nav>

  <div class="min-h-screen px-6 py-16 bg-gray-100">
    <div class="max-w-6xl mx-auto">
      <slot />
    </div>
  </div>
{:else}{$redirect('/')}{/if}
