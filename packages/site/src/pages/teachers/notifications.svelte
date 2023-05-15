<script>
  import { url } from "@roxi/routify";
  import { session } from "../../stores/session";
</script>

<div>
  <div class="max-w-xl mx-auto">
    <h1>Benachrichtigungen</h1>

    <ul>
      {#each $session.notifications as notification, index (notification.id)}
        <li class="px-5 py-3 mb-3 bg-white rounded-lg">
          <a href={$url('./' + notification.url)} on:click|once={() => session.dismissNotification(notification.id)}>
            <header class="text-teal-600">{notification.title}</header>
            <p class="mb-0 text-sm text-gray-600">{notification.body}</p>
            <footer class="flex justify-end mt-1 text-sm text-gray-500">
              <span>
                {new Date(notification.created_at * 1000).toLocaleString()}
              </span>
            </footer>
          </a>
        </li>
      {/each}
    </ul>
  </div>
</div>
