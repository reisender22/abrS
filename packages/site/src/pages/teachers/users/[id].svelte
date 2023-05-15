<script>
  import { session } from "../../../stores/session";
  import { user, status } from "../../../stores/user";
  import { url, params, metatags, redirect } from "@roxi/routify";

  metatags.title = "Benutzer";
  metatags.description = "Description coming soon...";

  let tab = "invoices";
  let showNewCommentDialog = false;
  let newUserComment = "";

  user.fetch($params.id);

  $: if ($status === "DELETED") $redirect("../");

  const formatter = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  });

  const InvoiceStateArray = [
    ["OPEN", "offen", "yellow"],
    ["PAID", "bezahlt", "teal"],
    ["VOID", "storniert", "red"],
  ];

  function formatInvoiceState(state) {
    return InvoiceStateArray.find((s) => s[0] === state)[1];
  }

  function getInvoiceStateColor(state) {
    return InvoiceStateArray.find((s) => s[0] === state)[2];
  }

  function createComment() {
    user.createComment({
      body_md: newUserComment,
      author_id: $session.user.id,
    });

    newUserComment = "";
    showNewCommentDialog = false;
  }
</script>

{#if $status === 'FETCHING'}
  <p>Loading...</p>
{:else}
  <h1>{$user.first_name + ' ' + $user.last_name}</h1>

  <div class="flex items-baseline justify-between">
    <div
      class="flex mb-6 overflow-hidden text-sm text-teal-500 border border-teal-500 rounded-md">
      <input
        class="hidden"
        type="radio"
        bind:group={tab}
        name="tabs"
        id="invoices"
        value="invoices" />
      <label
        for="invoices"
        class="block px-4 py-2 leading-none border-r border-teal-500
        cursor-pointer {tab === 'invoices' ? 'bg-teal-500 text-white' : 'text-teal-500'}">
        Rechnungen
      </label>

      <input
        class="hidden"
        type="radio"
        bind:group={tab}
        name="tabs"
        id="comments"
        value="comments" />
      <label
        for="comments"
        class="block px-4 py-2 leading-none cursor-pointer {tab === 'comments' ? 'bg-teal-500 text-white' : 'text-teal-500'}">
        Kommentare
      </label>
    </div>
  </div>

  {#if tab === 'personal_data'}
    <form on:submit|preventDefault={user.update}>
      <div class="flex mb-5 -mx-2">
        <div class="w-1/3 mx-2">
          <label for="gender">Anrede</label>
          <select bind:value={$user.gender} id="gender">
            <option value="MALE">Herr</option>
            <option value="FEMALE">Frau</option>
          </select>
        </div>

        <div class="w-1/3 mx-2">
          <label for="first_name">Vorname</label>
          <input type="text" bind:value={$user.first_name} id="first_name" />
        </div>

        <div class="w-1/3 mx-2">
          <label for="last_name">Nachname</label>
          <input type="text" bind:value={$user.last_name} id="last_name" />
        </div>
      </div>

      <div class="mb-5">
        <label for="address_line_1">Straße und Hausnummer</label>
        <input
          type="text"
          bind:value={$user.address_line_1}
          id="address_line_1" />
      </div>

      <div class="mb-5">
        <label for="address_line_2">Adresszusatz (optional)</label>
        <input
          type="text"
          bind:value={$user.address_line_2}
          id="address_line_2" />
      </div>

      <div class="flex mb-5 -mx-3">
        <div class="w-1/3 mx-3">
          <label for="postal_code">Postleitzahl</label>
          <input type="text" bind:value={$user.postal_code} id="postal_code" />
        </div>

        <div class="w-1/3 mx-3">
          <label for="locality">Stadt</label>
          <input type="text" bind:value={$user.locality} id="locality" />
        </div>

        <div class="w-1/3 mx-3">
          <label for="country">Land</label>
          <select bind:value={$user.country} id="country">
            <option value="" />
            <option value="AF">Afghanistan</option>
            <option value="EG">Ägypten</option>
            <option value="AX">Aland</option>
            <option value="AL">Albanien</option>
            <option value="DZ">Algerien</option>
            <option value="AS">Amerikanisch-Samoa</option>
            <option value="VI">Amerikanische Jungferninseln</option>
            <option value="AD">Andorra</option>
            <option value="AO">Angola</option>
            <option value="AI">Anguilla</option>
            <option value="AQ">Antarktis</option>
            <option value="AG">Antigua und Barbuda</option>
            <option value="GQ">Äquatorialguinea</option>
            <option value="AR">Argentinien</option>
            <option value="AM">Armenien</option>
            <option value="AW">Aruba</option>
            <option value="AC">Ascension</option>
            <option value="AZ">Aserbaidschan</option>
            <option value="ET">Äthiopien</option>
            <option value="AU">Australien</option>
            <option value="BS">Bahamas</option>
            <option value="BH">Bahrain</option>
            <option value="BD">Bangladesch</option>
            <option value="BB">Barbados</option>
            <option value="BE">Belgien</option>
            <option value="BZ">Belize</option>
            <option value="BJ">Benin</option>
            <option value="BM">Bermuda</option>
            <option value="BT">Bhutan</option>
            <option value="BO">Bolivien</option>
            <option value="BA">Bosnien und Herzegowina</option>
            <option value="BW">Botswana</option>
            <option value="BV">Bouvetinsel</option>
            <option value="BR">Brasilien</option>
            <option value="BN">Brunei</option>
            <option value="BG">Bulgarien</option>
            <option value="BF">Burkina Faso</option>
            <option value="BI">Burundi</option>
            <option value="CL">Chile</option>
            <option value="CN">China</option>
            <option value="CK">Cookinseln</option>
            <option value="CR">Costa Rica</option>
            <option value="CI">Cote d'Ivoire</option>
            <option value="DK">Dänemark</option>
            <option value="DE">Deutschland</option>
            <option value="DG">Diego Garcia</option>
            <option value="DM">Dominica</option>
            <option value="DO">Dominikanische Republik</option>
            <option value="DJ">Dschibuti</option>
            <option value="EC">Ecuador</option>
            <option value="SV">El Salvador</option>
            <option value="ER">Eritrea</option>
            <option value="EE">Estland</option>
            <option value="EU">Europäische Union</option>
            <option value="FK">Falklandinseln</option>
            <option value="FO">Färöer</option>
            <option value="FJ">Fidschi</option>
            <option value="FI">Finnland</option>
            <option value="FR">Frankreich</option>
            <option value="GF">Französisch-Guayana</option>
            <option value="PF">Französisch-Polynesien</option>
            <option value="GA">Gabun</option>
            <option value="GM">Gambia</option>
            <option value="GE">Georgien</option>
            <option value="GH">Ghana</option>
            <option value="GI">Gibraltar</option>
            <option value="GD">Grenada</option>
            <option value="GR">Griechenland</option>
            <option value="GL">Grönland</option>
            <option value="GB">Großbritannien</option>
            <option value="CP">Guadeloupe</option>
            <option value="GU">Guam</option>
            <option value="GT">Guatemala</option>
            <option value="GG">Guernsey</option>
            <option value="GN">Guinea</option>
            <option value="GW">Guinea-Bissau</option>
            <option value="GY">Guyana</option>
            <option value="HT">Haiti</option>
            <option value="HM">Heard und McDonaldinseln</option>
            <option value="HN">Honduras</option>
            <option value="HK">Hongkong</option>
            <option value="IN">Indien</option>
            <option value="ID">Indonesien</option>
            <option value="IQ">Irak</option>
            <option value="IR">Iran</option>
            <option value="IE">Irland</option>
            <option value="IS">Island</option>
            <option value="IL">Israel</option>
            <option value="IT">Italien</option>
            <option value="JM">Jamaika</option>
            <option value="JP">Japan</option>
            <option value="YE">Jemen</option>
            <option value="JE">Jersey</option>
            <option value="JO">Jordanien</option>
            <option value="KY">Kaimaninseln</option>
            <option value="KH">Kambodscha</option>
            <option value="CM">Kamerun</option>
            <option value="CA">Kanada</option>
            <option value="IC">Kanarische Inseln</option>
            <option value="CV">Kap Verde</option>
            <option value="KZ">Kasachstan</option>
            <option value="QA">Katar</option>
            <option value="KE">Kenia</option>
            <option value="KG">Kirgisistan</option>
            <option value="KI">Kiribati</option>
            <option value="CC">Kokosinseln</option>
            <option value="CO">Kolumbien</option>
            <option value="KM">Komoren</option>
            <option value="CG">Kongo</option>
            <option value="HR">Kroatien</option>
            <option value="CU">Kuba</option>
            <option value="KW">Kuwait</option>
            <option value="LA">Laos</option>
            <option value="LS">Lesotho</option>
            <option value="LV">Lettland</option>
            <option value="LB">Libanon</option>
            <option value="LR">Liberia</option>
            <option value="LY">Libyen</option>
            <option value="LI">Liechtenstein</option>
            <option value="LT">Litauen</option>
            <option value="LU">Luxemburg</option>
            <option value="MO">Macao</option>
            <option value="MG">Madagaskar</option>
            <option value="MW">Malawi</option>
            <option value="MY">Malaysia</option>
            <option value="MV">Malediven</option>
            <option value="ML">Mali</option>
            <option value="MT">Malta</option>
            <option value="MA">Marokko</option>
            <option value="MH">Marshallinseln</option>
            <option value="MQ">Martinique</option>
            <option value="MR">Mauretanien</option>
            <option value="MU">Mauritius</option>
            <option value="YT">Mayotte</option>
            <option value="MK">Mazedonien</option>
            <option value="MX">Mexiko</option>
            <option value="FM">Mikronesien</option>
            <option value="MD">Moldawien</option>
            <option value="MC">Monaco</option>
            <option value="MN">Mongolei</option>
            <option value="MS">Montserrat</option>
            <option value="MZ">Mosambik</option>
            <option value="MM">Myanmar</option>
            <option value="NA">Namibia</option>
            <option value="NR">Nauru</option>
            <option value="NP">Nepal</option>
            <option value="NC">Neukaledonien</option>
            <option value="NZ">Neuseeland</option>
            <option value="NT">Neutrale Zone</option>
            <option value="NI">Nicaragua</option>
            <option value="NL">Niederlande</option>
            <option value="AN">Niederländische Antillen</option>
            <option value="NE">Niger</option>
            <option value="NG">Nigeria</option>
            <option value="NU">Niue</option>
            <option value="KP">Nordkorea</option>
            <option value="MP">Nördliche Marianen</option>
            <option value="NF">Norfolkinsel</option>
            <option value="NO">Norwegen</option>
            <option value="OM">Oman</option>
            <option value="AT">Österreich</option>
            <option value="PK">Pakistan</option>
            <option value="PS">Palästina</option>
            <option value="PW">Palau</option>
            <option value="PA">Panama</option>
            <option value="PG">Papua-Neuguinea</option>
            <option value="PY">Paraguay</option>
            <option value="PE">Peru</option>
            <option value="PH">Philippinen</option>
            <option value="PN">Pitcairninseln</option>
            <option value="PL">Polen</option>
            <option value="PT">Portugal</option>
            <option value="PR">Puerto Rico</option>
            <option value="RE">Réunion</option>
            <option value="RW">Ruanda</option>
            <option value="RO">Rumänien</option>
            <option value="RU">Russische Föderation</option>
            <option value="SB">Salomonen</option>
            <option value="ZM">Sambia</option>
            <option value="WS">Samoa</option>
            <option value="SM">San Marino</option>
            <option value="ST">São Tomé und Príncipe</option>
            <option value="SA">Saudi-Arabien</option>
            <option value="SE">Schweden</option>
            <option value="CH">Schweiz</option>
            <option value="SN">Senegal</option>
            <option value="CS">Serbien und Montenegro</option>
            <option value="SC">Seychellen</option>
            <option value="SL">Sierra Leone</option>
            <option value="ZW">Simbabwe</option>
            <option value="SG">Singapur</option>
            <option value="SK">Slowakei</option>
            <option value="SI">Slowenien</option>
            <option value="SO">Somalia</option>
            <option value="ES">Spanien</option>
            <option value="LK">Sri Lanka</option>
            <option value="SH">St. Helena</option>
            <option value="KN">St. Kitts und Nevis</option>
            <option value="LC">St. Lucia</option>
            <option value="PM">St. Pierre und Miquelon</option>
            <option value="VC">St. Vincent/Grenadinen (GB)</option>
            <option value="ZA">Südafrika, Republik</option>
            <option value="SD">Sudan</option>
            <option value="KR">Südkorea</option>
            <option value="SR">Suriname</option>
            <option value="SJ">Svalbard und Jan Mayen</option>
            <option value="SZ">Swasiland</option>
            <option value="SY">Syrien</option>
            <option value="TJ">Tadschikistan</option>
            <option value="TW">Taiwan</option>
            <option value="TZ">Tansania</option>
            <option value="TH">Thailand</option>
            <option value="TL">Timor-Leste</option>
            <option value="TG">Togo</option>
            <option value="TK">Tokelau</option>
            <option value="TO">Tonga</option>
            <option value="TT">Trinidad und Tobago</option>
            <option value="TA">Tristan da Cunha</option>
            <option value="TD">Tschad</option>
            <option value="CZ">Tschechische Republik</option>
            <option value="TN">Tunesien</option>
            <option value="TR">Türkei</option>
            <option value="TM">Turkmenistan</option>
            <option value="TC">Turks- und Caicosinseln</option>
            <option value="TV">Tuvalu</option>
            <option value="UG">Uganda</option>
            <option value="UA">Ukraine</option>
            <option value="HU">Ungarn</option>
            <option value="UY">Uruguay</option>
            <option value="UZ">Usbekistan</option>
            <option value="VU">Vanuatu</option>
            <option value="VA">Vatikanstadt</option>
            <option value="VE">Venezuela</option>
            <option value="AE">Vereinigte Arabische Emirate</option>
            <option value="US">Vereinigte Staaten von Amerika</option>
            <option value="VN">Vietnam</option>
            <option value="WF">Wallis und Futuna</option>
            <option value="CX">Weihnachtsinsel</option>
            <option value="BY">Weißrussland</option>
            <option value="EH">Westsahara</option>
            <option value="CF">Zentralafrikanische Republik</option>
            <option value="CY">Zypern</option>
          </select>
        </div>
      </div>

      <div class="mb-5">
        <label for="role">Rolle</label>
        <select bind:value={$user.role} id="role">
          <option value="ADMIN">Admin</option>
          <option value="TEACHER">Lehrer</option>
          <option value="STUDENT">Schüler</option>
        </select>
      </div>

      <div class="flex mb-8 -mx-3">
        <div class="w-1/3 mx-3">
          <label for="is_registration_fee_paid">
            Registrierungsgebühr bezahlt
          </label>
          <input
            type="checkbox"
            bind:checked={$user.is_registration_fee_paid}
            id="is_registration_fee_paid" />
        </div>

        <div class="w-1/3 mx-3">
          <label for="is_email_verified">E-Mail bestätigt</label>
          <input
            type="checkbox"
            bind:checked={$user.is_email_verified}
            id="is_email_verified" />
        </div>

        <div class="w-1/3 mx-3">
          <label for="is_locked">Konto gesperrt</label>
          <input
            type="checkbox"
            bind:checked={$user.is_locked}
            id="is_locked" />
        </div>
      </div>

      <button
        on:click|preventDefault={user.update}
        disabled={$status === 'UPDATING'}
        class="btn btn--primary">
        {$status === 'UPDATING' ? 'Bitte warten...' : 'Speichern'}
      </button>
    </form>
  {:else if tab === 'invoices'}
    {#if $user.invoices.length > 0}
      <div class="overflow-hidden border rounded shadow-md">
        <header
          class="hidden px-6 py-2 text-sm leading-none tracking-wide text-gray-600 bg-gray-200 border-b md:flex">
          <div class="w-2/12 text-center">#</div>
          <div class="w-2/12 text-center">Betrag</div>
          <div class="w-2/12 text-center">Datum</div>
          <div class="w-4/12 text-center">Status</div>
          <div class="w-2/12 text-center" />
        </header>
        <ul class="bg-white">
          {#each $user.invoices as invoice, index (invoice.id)}
            <li
              class="flex flex-wrap px-6 py-3 text-gray-800 border-b hover:bg-gray-100">
              <div
                class="flex items-center justify-center w-2/12 text-gray-700">
                <div class="text-sm">MI{invoice.id}</div>
              </div>

              <div class="flex items-center justify-center w-2/12">
                <div>{formatter.format(invoice.amount / 100)}</div>
              </div>

              <div class="flex items-center justify-center w-2/12">
                <div>
                  {new Date(invoice.created_at * 1000).toLocaleDateString()}
                </div>
              </div>

              <div class="flex items-center justify-center w-4/12">
                <div
                  class="px-4 py-1 text-sm leading-none text-{getInvoiceStateColor(invoice.state)}-600
                  bg-{getInvoiceStateColor(invoice.state)}-100 rounded-full">
                  {formatInvoiceState(invoice.state)}
                </div>
              </div>

              <div class="flex items-center justify-end w-2/12">
                <a
                  href={$url('../invoices/' + invoice.id)}
                  class="flex items-center justify-center w-8 h-8 text-green-500 bg-green-100 rounded-full hover:text-green-600 hover:bg-green-200">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round">
                    <path
                      d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0
                      2-2v-7" />
                    <path
                      d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </a>
              </div>
            </li>
          {/each}
        </ul>
      </div>
    {:else}
      <p>Keine Rechnungen</p>
    {/if}
  {:else if tab === 'comments'}
    <header class="flex justify-end mb-8">
      <button
        on:click={() => (showNewCommentDialog = !showNewCommentDialog)}
        class="text-gray-800 hover:text-teal-600">
        Notiz hinzufügen
      </button>
    </header>

    {#if showNewCommentDialog}
      <form on:submit|preventDefault={createComment} class="mb-8">
        <div class="mb-6">
          <label for="new_comment" />
          <textarea bind:value={newUserComment} id="new_comment" rows="5" />
        </div>
        <button class="btn btn--primary" disabled={$status === 'CREATING_COMMENT'}>
          {$status === 'CREATING_COMMENT' ? 'Einen Moment...' : 'Speichern'}
        </button>
      </form>
    {/if}

    <ul>
      {#each $user.comments as { id, body_md, created_at, author }, index (id)}
        <li class="p-4 mb-3 bg-white border rounded shadow">
          <header>
            <a class="mb-1 text-sm text-gray-700" href={$url('./' + author.id)}>
              {author.first_name + ' ' + author.last_name}
            </a>
          </header>

          <div class="mb-1">{body_md}</div>

          <footer class="flex justify-end">
            <div class="text-sm text-gray-700">
              {new Date(created_at * 1000).toLocaleDateString()}
            </div>
          </footer>
        </li>
      {/each}
    </ul>
  {/if}
{/if}
