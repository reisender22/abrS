async function notifyNotificationBot({ category, body, isSilent = false }) {
  const options = {
    method: "POST",
    headers: {
      token: TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ category, body, isSilent }),
  };

  const res = await fetch("https://notify.kaerim.dev", options);

  return res.ok;
}

export { notifyNotificationBot };
