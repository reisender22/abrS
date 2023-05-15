<script>
  import { slide } from "svelte/transition";
  import { notifications } from "../stores/quickNotifications";

  let notification;

  $: if ($notifications.length > 0) {
    if (notification) {
      setTimeout(() => {
        notification = null;
      }, 800);

      setTimeout(() => {
        notification = notifications.get();
      }, 880);
    } else {
      notification = notifications.get();

      setTimeout(() => {
        notification = null;
      }, 3000);
    }
  }
</script>

{#if notification}
  <div
    class="fixed z-50 flex items-center justify-center w-full h-12 p-4 py-2
    font-semibold text-center {notification.level === 'success' ? 'text-green-800 bg-green-200' : 'text-yellow-800 bg-yellow-200'}"
    transition:slide={{ duration: 140 }}>
    <span>{notification.message}</span>
  </div>
{/if}
