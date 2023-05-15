<script>
  import { setContext } from "svelte";

  let inputs = [];

  /**
   * Validates every input inside the form
   */
  export function validate() {
    for (const input of inputs) {
      input.validate();
    }
  }

  const api = {
    /**
     * @param
     */
    registerInput(ref) {
      inputs.push(ref);
    },

    /**
     *
     */
    unregisterInput(ref) {
      inputs = inputs.filter(input => input !== ref);
    },
  };

  setContext("sunflower-form", api);
</script>

<form on:submit>
  <slot />
</form>
