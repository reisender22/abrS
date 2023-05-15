<script>
  import { Router } from "@roxi/routify";
  import { routes } from "../.routify/routes";
</script>

<style global>
  /* purgecss start ignore */
  @import "tailwindcss/base";

  @import "tailwindcss/components";
  /* purgecss end ignore */

  h1 {
    @apply mb-6 text-4xl text-gray-700;
  }

  h2 {
    @apply mb-5 text-2xl font-semibold text-teal-600;
  }

  h3 {
    @apply mb-3 text-xl font-semibold text-gray-800;
  }

  h4 {
    @apply mb-1 font-semibold text-gray-700;
  }

  p {
    @apply mb-6 text-gray-800;
  }

  .lbl,
  form label {
    @apply block mb-1 text-sm text-gray-700;
  }

  .inp,
  form input[type="text"],
  form input[type="time"],
  form input[type="date"],
  form input[type="email"],
  form input[type="number"],
  form input[type="password"],
  form select {
    @apply w-full h-10 px-3 leading-none text-gray-800 transition-colors duration-75 bg-white border border-gray-400 rounded appearance-none;
  }

  .texta,
  form textarea {
    @apply w-full p-3 text-gray-800 transition-colors duration-75 bg-white border border-gray-400 rounded appearance-none;
  }

  .inp:hover,
  form input:hover,
  form select:hover {
    @apply border-gray-500;
  }

  .texta:hover,
  form textarea:hover {
    @apply border-gray-500;
  }

  .inp:focus,
  form input:focus,
  form select:focus {
    @apply border-teal-500 shadow-md outline-none;
  }

  .texta:focus,
  form textarea:focus {
    @apply border-teal-500 shadow-md outline-none;
  }

  .inp:disabled,
  form input:disabled,
  form select:disabled {
    @apply text-gray-600 border-gray-200;
  }

  select.inp::after,
  form select::after {
    @apply w-2 h-2 bg-black;
  }

  label.checkbox {
    @apply w-8 h-8 overflow-hidden bg-white border border-teal-400 rounded-full cursor-pointer;
  }

  label.checkbox input:checked + div {
    @apply flex items-center justify-center;
  }

  @import "tailwindcss/utilities";

  .btn {
    @apply relative leading-none whitespace-no-wrap select-none;
  }

  .btn--primary {
    @apply px-5 py-2 leading-none text-white bg-gray-800 border border-gray-800;
  }

  .btn--primary:hover {
    @apply bg-gray-900 border-gray-900;
  }

  .btn--secondary {
    @apply px-5 py-2 leading-none text-gray-900 bg-gray-300 border border-gray-300;
  }

  .btn--secondary:hover {
    @apply bg-gray-400 border-gray-400;
  }

  .btn--primary:disabled,
  .btn--secondary:disabled {
    @apply text-gray-400 bg-white border-gray-400 pointer-events-none;
  }

  .btn--accent {
  }
</style>

<Router {routes} />
