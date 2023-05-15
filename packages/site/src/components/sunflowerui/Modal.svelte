<script>
  import { getContext } from "svelte";

  const app = getContext("sunflower-app");
  const ref = this;

  function init() {
    if (app) {
      app.registerModal(ref);

      return {
        destrory() {
          app.unregisterModal(ref)
        }
      }
    }
  }
</script>

<div use:init>

</div>
