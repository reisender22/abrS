<script>
  /**
   * @type {string}
   */
  export let value = "";

  /**
   * @type {string}
   */
  export let id = "sunflower-" + Math.random().toString(36);

  /**
   * @type {boolean}
   */
  export let readonly = false;

  /**
   * @type {string}
   */
  export let labelText = "";

  /**
   *
   */
  export let rules = [];

  import { getContext } from "svelte";

  const form = getContext("sunflower-form");
  const ref = this;

  export function validate() {}

  function init() {
    if (form) {
      form.registerInput(ref);

      return {
        destroy() {
          form.unregisterInput(ref);
        },
      };
    }
  }
</script>

<div use:init>
  <label for={id}>{labelText}</label>
  <input type="text" {id} bind:value {readonly} />
</div>
