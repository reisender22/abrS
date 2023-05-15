module.exports = {
  privateKey: process.env.PRIVATE_KEY || 'abc',

  site: {
    name: "",
  },

  server: {
    state_directory: process.env.STATE_DIRECTORY || "../data",
    port: process.env.PORT || 3000,
  },

  paypal: {
    clientId: process.env.PAYPAL_CLIENT_ID,
    secret: process.env.PAYPAL_SECRET,
  },
};
