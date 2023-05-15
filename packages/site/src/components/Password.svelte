<script>
  export let value = "";
  export let id = "password";

  let show = false;

  function input(event) {
    value = event.target.value;
  }

  function toggle() {
    show = !show;
  }
</script>

<div class="flex">
  <input type={show ? 'text' : 'password'} {id} {value} on:input={input} />

  <button
    type="button"
    tabindex="-1"
    on:click={toggle}
    class="flex items-center justify-center pl-2 focus:outline-none">
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="text-gray-700">
      {#if show}
        <path
          d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      {:else}
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      {/if}
    </svg>
  </button>
</div>
