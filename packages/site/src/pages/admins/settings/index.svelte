<script>
  import { metatags } from "@roxi/routify";
  import Password from "../../../components/Password.svelte";
  import UserSettings from "../../../components/UserSettings.svelte";
  import { settings, status } from "../../../stores/settings";

  metatags.title = "Einstellungen";

  let tab = "EMAIL_TEMPLATES";

  settings.fetch();
</script>

<h1>Einstellungen</h1>

<div class="flex items-baseline justify-between">
  <div
    class="flex mb-6 overflow-hidden text-sm text-teal-500 border border-teal-500 rounded-md">
    <input
      class="hidden"
      type="radio"
      bind:group={tab}
      name="tabs"
      id="email_templates"
      value="EMAIL_TEMPLATES" />
    <label
      for="email_templates"
      class="block px-4 py-2 border-r border-teal-500 leading-none
        cursor-pointer {tab === 'EMAIL_TEMPLATES' ? 'bg-teal-500 text-white' : 'text-teal-500'}">
      Email Templates
    </label>

    <input
      class="hidden"
      type="radio"
      bind:group={tab}
      name="tabs"
      id="smtp"
      value="SMTP" />
    <label
      for="smtp"
      class="block px-4 py-2 border-r border-teal-500 leading-none
        cursor-pointer {tab === 'SMTP' ? 'bg-teal-500 text-white' : 'text-teal-500'}">
      SMTP
    </label>

    <input
      class="hidden"
      type="radio"
      bind:group={tab}
      name="tabs"
      id="user"
      value="USER" />
    <label
      for="user"
      class="block px-4 py-2 border-r border-teal-500 leading-none
        cursor-pointer {tab === 'USER' ? 'bg-teal-500 text-white' : 'text-teal-500'}">
      Persönliche Daten
    </label>

    <input
      class="hidden"
      type="radio"
      bind:group={tab}
      name="tabs"
      id="changelog"
      value="CHANGELOG" />
    <label
      for="changelog"
      class="block px-4 py-2 leading-none cursor-pointer {tab === 'CHANGELOG' ? 'bg-teal-500 text-white' : 'text-teal-500'}">
      Changelog
    </label>
  </div>
</div>

{#if $status === 'FETCHING'}
  <p>Einen Moment...</p>
{:else if tab === 'EMAIL_TEMPLATES'}
  <form on:submit|preventDefault={settings.update}>
    <div>
      <h2>Neue Schüleranmeldung (PayPal)</h2>
      <div class="mb-5">
        <label for="student_signup_subject_paypal">Betreff</label>
        <input
          bind:value={$settings.EMAIL_TEMPLATE_STUDENT_SIGN_UP_PAYPAL_SUBJECT}
          type="text"
          id="student_signup_subject_paypal" />
      </div>
      <div class="mb-5">
        <label for="student_signup_text_paypal">Text</label>
        <textarea
          bind:value={$settings.EMAIL_TEMPLATE_STUDENT_SIGN_UP_PAYPAL_TEXT}
          id="student_signup_text_paypal"
          rows="10" />
      </div>
    </div>

    <div>
      <h2>Neue Schüleranmeldung (Überweisung)</h2>
      <div class="mb-5">
        <label for="student_signup_subject_bank_transfer">Betreff</label>
        <input
          bind:value={$settings.EMAIL_TEMPLATE_STUDENT_SIGN_UP_BANK_TRANSFER_SUBJECT}
          type="text"
          id="student_signup_subject_bank_transfer" />
      </div>
      <div class="mb-5">
        <label for="student_signup_text_bank_transfer">Text</label>
        <textarea
          bind:value={$settings.EMAIL_TEMPLATE_STUDENT_SIGN_UP_BANK_TRANSFER_TEXT}
          id="student_signup_text_bank_transfer"
          rows="10" />
      </div>
    </div>

    <div>
      <h2>Anmeldegebühr bezahlt (Überweisung)</h2>
      <div class="mb-5">
        <label for="registration_fee_paid_subject">Betreff</label>
        <input
          bind:value={$settings.EMAIL_TEMPLATE_REGISTRATION_FEE_PAID_SUBJECT}
          type="text"
          id="registration_fee_paid_subject" />
      </div>
      <div class="mb-5">
        <label for="registration_fee_paid_text">Text</label>
        <textarea
          bind:value={$settings.EMAIL_TEMPLATE_REGISTRATION_FEE_PAID_TEXT}
          id="registration_fee_paid_text"
          rows="10" />
      </div>
    </div>

    <div>
      <h2>Neue Rechnung</h2>
      <div class="mb-5">
        <label for="new_invoice_subject">Betreff</label>
        <input
          bind:value={$settings.EMAIL_TEMPLATE_NEW_INVOICE_SUBJECT}
          type="text"
          id="new_invoice_subject" />
      </div>
      <div class="mb-8">
        <label for="new_invoice_text">Text</label>
        <textarea
          bind:value={$settings.EMAIL_TEMPLATE_NEW_INVOICE_TEXT}
          id="new_invoice_text"
          rows="10" />
      </div>
    </div>

    <div>
      <h2>Rechnungserinnerung</h2>
      <div class="mb-5">
        <label for="invoice_reminder_subject">Betreff</label>
        <input
          bind:value={$settings.EMAIL_TEMPLATE_INVOICE_REMINDER_SUBJECT}
          type="text"
          id="invoice_reminder_subject" />
      </div>
      <div class="mb-8">
        <label for="invoice_reminder_text">Text</label>
        <textarea
          bind:value={$settings.EMAIL_TEMPLATE_INVOICE_REMINDER_TEXT}
          id="invoice_reminder_text"
          rows="10" />
      </div>
    </div>

    <button class="btn btn--primary" disabled={$status === 'UPDATING'}>
      {$status === 'UPDATING' ? 'Einen Moment...' : 'Speichern'}
    </button>
  </form>
{:else if tab === 'SMTP'}
  <form on:submit|preventDefault={settings.update}>
    <div class="flex mb-5 -mx-3">
      <div class="w-1/2 mx-3">
        <label for="smtp_host">Host</label>
        <input bind:value={$settings.SMTP_HOST} type="text" id="smtp_host" />
      </div>
      <div class="w-1/2 mx-3">
        <label for="smtp_port">Port</label>
        <input bind:value={$settings.SMTP_PORT} type="text" id="smtp_port" />
      </div>
    </div>

    <div class="flex mb-8 -mx-3">
      <div class="w-1/2 mx-3">
        <label for="smtp_user">Benutzer</label>
        <input bind:value={$settings.SMTP_USER} type="text" id="smtp_user" />
      </div>
      <div class="w-1/2 mx-3">
        <label for="smtp_pass">Passwort</label>
        <Password id="smtp_pass" bind:value={$settings.SMTP_PASS} />
      </div>
    </div>

    <button class="btn btn--primary" disabled={$status === 'UPDATING'}>
      {$status === 'UPDATING' ? 'Einen Moment...' : 'Speichern'}
    </button>
  </form>
{:else if tab === 'USER'}
  <UserSettings />
{:else if tab === 'CHANGELOG'}
  <h2>Changelog</h2>
  <p>23/9/2020</p>
  <ol class="pl-6 mb-6 list-disc">
    <li>Klassenuebersicht zusammengefuehrt</li>
    <li>falsche Rechnungen neu berechnet</li>
    <li>Datum der letzten Rechnung bei Klasse hinzugefuegt</li>
    <li>
      Uebersicht der Schueler einer Klasse zeigt einenn Hinweis bei unbezahlten
      Rechnungen
    </li>
    <li>fehlerhafter Unterricht entfernt</li>
    <li>Preisanzeige bei der Anmeldung ueberarbeitet</li>
    <li>Email Templates angepast</li>
  </ol>

  <p>22/9/2020</p>
  <ol class="pl-6 mb-6 list-disc">
    <li>Suchfunktion fuer Rechnungen</li>
    <li>Studen bis zur naechsten Rechnung werden in den Klassen angezeigt</li>
    <li>
      Schueler aus Klasse entfernen und einfuegen funktioniert jetzt ohne die
      Generierung von falschen Rechnungen
    </li>
    <li>Das erstellen von rechnungen erlaubt die Angabe einer Klassen ID</li>
    <li>Lehrer koennen auch auf ihre alten Klassenzugreifen</li>
  </ol>

  <h2>TODO</h2>
  <ol class="pl-6 list-disc">
    <li>Menu fuer Rechnungsoperationen erstellen</li>
    <li>Weiterleitung auf Tabs</li>
    <li>Modal System</li>
    <li>Stores ueberarbeiten</li>
    <li>Responsive Design optimieren</li>
  </ol>
{/if}
