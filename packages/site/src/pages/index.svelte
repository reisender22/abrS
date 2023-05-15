<script>
  import Login from "../components/Login.svelte";

  import { session, status } from "../stores/session";
  import { metatags, redirect } from "@roxi/routify";

  metatags.title = "My Routify app";
  metatags.description = "Description coming soon...";

  function navigate() {
    const { role } = $session.user;

    if (role === 0) $redirect("/admins");
    if (role === 1) $redirect("/teachers/classes");
    if (role === 2) $redirect("/students/classes");
  }
</script>

<div class="flex items-center justify-center min-h-screen bg-gray-100">
  {#if $session.user}
    {navigate()}
  {:else}
    <Login />
  {/if}
</div>
