<script>
  import { users } from "../../../stores/users";
  import { clss, status } from "../../../stores/class";
  import { metatags, redirect } from "@roxi/routify";

  metatags.title = "Neue Klasse";
  metatags.description = "Description coming soon...";

  status.reset();

  users.fetch({ role: "TEACHER" });

  let classInput = {
    name: "",
    subject: "",
    level: "",
    times: [{ day: "FRI", from: "18:00", to: "20:00" }],
    gender: "MALE",
    description_md: "",
    price_per_hour: 1000,
    registration_fee: 2500,
    registration_fee_offer: 0,
    hours_per_lesson: 2,
    invoice_cycle: 8,
    teacher_id: "",
    notes: "",
  };

  $: if ($status === "CREATED") $redirect("../classes");
</script>

<h1>Neue Klasse</h1>

<form on:submit|preventDefault={() => clss.create(classInput)}>
  <div class="mb-5">
    <label for="name">Name (optional)</label>
    <input type="text" bind:value={classInput.name} id="name" />
  </div>

  <div class="mb-5">
    <label for="subject">Fach</label>
    <input type="text" bind:value={classInput.subject} id="subject" />
  </div>

  <div class="mb-5">
    <label for="gender">Klasse für</label>
    <select bind:value={classInput.gender} id="gender">
      <option value="MALE">Brüder</option>
      <option value="FEMALE">Schwestern</option>
    </select>
  </div>

  <div class="flex mb-5 -mx-3">
    {#each classInput.times as time, index}
      <div class="w-full mx-3">
        <label for="day_{index}">Tag</label>
        <select bind:value={classInput.times[index].day} id="day_{index}">
          <option value="MON">Montag</option>
          <option value="TUE">Dienstag</option>
          <option value="WED">Mittwoch</option>
          <option value="THU">Donnerstag</option>
          <option value="FRI">Freitag</option>
          <option value="SAT">Samstag</option>
          <option value="SUN">Sonntag</option>
        </select>
      </div>

      <div class="mx-3">
        <label for="from_{index}">von</label>
        <input
          type="time"
          bind:value={classInput.times[index].from}
          id="from_{index}" />
      </div>

      <div class="mx-3">
        <label for="to_{index}">bis</label>
        <input
          type="time"
          bind:value={classInput.times[index].to}
          id="to_{index}" />
      </div>
    {/each}
  </div>

  <div class="mb-5">
    <label for="teacher_id">Lehrer</label>
    <select bind:value={classInput.teacher_id} id="teacher_id">
      {#each $users as { id, first_name, last_name }, index (id)}
        <option value="" />
        <option value={id}>{first_name + ' ' + last_name}</option>
      {/each}
    </select>
  </div>

  <div class="flex mb-5 -mx-3">
        <div class="w-1/2 mx-3">
          <label for="registration_fee">Registrierungsgebühr (in Cents)</label>
          <input
            type="number"
            bind:value={classInput.registration_fee}
            id="registration_fee"
            min="0" />
        </div>

        <div class="w-1/2 mx-3">
          <label for="registration_fee_offer">Registrierungsgebühr Angebot (in Cents)</label>
          <input
            type="number"
            bind:value={classInput.registration_fee_offer}
            id="registration_fee_offer"
            min="0" />
        </div>
      </div>

      <div class="flex mb-5 -mx-3">
        <div class="w-1/2 mx-3">
          <label for="price_per_hour">Preis je Stunde (in Cents)</label>
          <input
            type="number"
            bind:value={classInput.price_per_hour}
            id="price_per_hour"
            min="0" />
        </div>

        <div class="w-1/2 mx-3">
          <label for="hours_per_lesson">Stunden je Unterricht</label>
          <input
            type="number"
            bind:value={classInput.hours_per_lesson}
            id="hours_per_lesson"
            min="1" />
        </div>
      </div>
      
      <div class="flex mb-5 -mx-3">
        <div class="w-1/2 mx-3">
          <label for="invoice_cycle">Abrechnungszyklus in Stunden</label>
          <input
            type="number"
            bind:value={classInput.invoice_cycle}
            id="invoice_cycle"
            min="0" />
        </div>
      </div>

  <div class="mb-5">
    <label for="description">Beschreibung (Markdown wird unterstützt)</label>
    <textarea rows="5" bind:value={classInput.description} id="description" />
  </div>

  <div class="mb-5">
    <label for="notes">Notizen (nicht öffentlich)</label>
    <textarea rows="3" bind:value={classInput.notes} id="notes" />
  </div>

  <button class="btn btn--primary" disabled={$status === 'CREATING'}>
    {$status === 'CREATING' ? 'Bitte warten...' : 'Erstellen'}
  </button>
</form>
