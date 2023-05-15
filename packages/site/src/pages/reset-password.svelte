<script>
  import { params } from "@roxi/routify";
  import { session } from "../stores/session";
</script>

<div class="flex items-center justify-center min-h-screen">
  <div class='w-1/3 break-words'>
    {#await session.resetPassword($params.token)}
      <p>Einen Moment...</p>
    {:then password}
      <p>
        Dein neues Passwort ist: <span class="font-semibold text-teal-600">{password}</span>
      </p>
      <p>Bitte logge Dich ein und ändere es.</p>
    {/await}
  </div>
</div>
