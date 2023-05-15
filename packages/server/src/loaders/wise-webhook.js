const crypto = require("crypto");
const fetch = require("node-fetch");
const InvoiceService = require("../services/invoice");
const Notifications = require("../services/notifications");

const productionPubKey = `
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvO8vXV+JksBzZAY6GhSO
XdoTCfhXaaiZ+qAbtaDBiu2AGkGVpmEygFmWP4Li9m5+Ni85BhVvZOodM9epgW3F
bA5Q1SexvAF1PPjX4JpMstak/QhAgl1qMSqEevL8cmUeTgcMuVWCJmlge9h7B1CS
D4rtlimGZozG39rUBDg6Qt2K+P4wBfLblL0k4C4YUdLnpGYEDIth+i8XsRpFlogx
CAFyH9+knYsDbR43UJ9shtc42Ybd40Afihj8KnYKXzchyQ42aC8aZ/h5hyZ28yVy
Oj3Vos0VdBIs/gAyJ/4yyQFCXYte64I7ssrlbGRaco4nKF3HmaNhxwyKyJafz19e
HwIDAQAB
-----END PUBLIC KEY-----
`;

function exec(cmd) {
  const e = require("child_process").exec;

  return new Promise((resolve, reject) => {
    e(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
      }
      resolve(stdout ? stdout : stderr);
    });
  });
}

function verify(body, signature) {
  const publicKey = crypto.createPublicKey({
    key: productionPubKey,
    format: "pem",
  });

  return crypto.verify(
    "RSA-SHA256",
    Buffer.from(body),
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    Buffer.from(signature, "base64")
  );
}

async function getAccountStatement(
  api_token,
  profile_id,
  currency,
  headers = {}
) {
  const now = new Date();
  now.setUTCHours(23, 59, 59, 999);
  const sevenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  sevenDaysAgo.setUTCHours(0, 0, 0, 0);

  const intervalStart = sevenDaysAgo.toISOString();
  const intervalEnd = now.toISOString();

  let balance;
  let response;

  response = await fetch(
    `https://api.transferwise.com/v4/profiles/${profile_id}/balances?types=STANDARD`,
    {
      headers: {
        ...headers,
        Authorization: `Bearer ${api_token}`,
      },
    }
  );

  if (!response.ok) {
    return;
  }

  balance = await response
    .json()
    .then((balances) => balances.find((b) => b.currency === currency));

  response = await fetch(
    `https://api.transferwise.com/v1/profiles/${profile_id}/balance-statements/${balance.id}/statement.json?intervalStart=${intervalStart}&intervalEnd=${intervalEnd}&type=COMPACT`,
    {
      headers: {
        ...headers,
        Authorization: `Bearer ${api_token}`,
      },
    }
  );

  if (response.status === 403) {
    console.log("Signing OTT...");

    const ott = response.headers.get("x-2fa-approval");
    const signedOtt = await exec(
      `printf '${ott}' | openssl sha256 -sign private.pem | base64 -w 0`
    );

    return getAccountStatement(api_token, profile_id, currency, {
      "X-2FA-Approval": ott,
      "X-Signature": signedOtt,
    });
  } else if (response.ok) {
    console.log("Everything ok. Continuing...");
    return await response.json();
  } else {
    console.log("Something went wrong!");
    console.log(await response.text());
  }
}

const createWebhook = (api_token) => async (req, res) => {
  const body = req.body;
  const rawBody = req.rawBody;
  const signature = req.headers["x-signature-sha256"];
  const isTestNotification = req.headers["x-test-notification"] !== undefined;

  if (!verify(rawBody, signature)) {
    return;
  }

  (res.statusCode = 200), res.end();

  if (isTestNotification) return;

  const { profile_id } = body.data.resource;
  const statement = await getAccountStatement(
    api_token,
    profile_id,
    body.data.currency
  );

  if (!statement) {
    Notifications.send({
      site: "",
      level: "ERROR",
      text: `Failed to fetch statement.`,
    });

    return;
  }

  for (const transaction of statement.transactions.filter(
    (t) => t.type === "CREDIT" && t.amount.currency === "EUR"
  )) {
    const amount = transaction.amount.value;
    const reference = transaction.details.paymentReference.split("/")[0];

    const payment = InvoiceService.createPaymentByReference({
      reference,
      amount,
    });
  }
};

async function test() {
  const statement = await getAccountStatement(
    "4f4c4c60-0b51-4cf4-958d-83e8801d651d",
    18225367,
    "EUR"
  );

  console.log(JSON.stringify(statement.transactions, null, 2));
}

module.exports = { createWebhook };
