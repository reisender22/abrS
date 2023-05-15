function registerClientErrorLogger() {
  // send any client side errors to the server
  window.onerror = function (msg, url, lineNo, columnNo, error) {
    const data = {
      name: "",
      message: "",
      url: "",
      stack: "",
    };

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };

    // fetch("/api/log", options);

    console.log('Send error to server');

    return false;
  };
}

export { registerClientErrorLogger };
