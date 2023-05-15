module.exports = Object.freeze({
  getInt(min = 10000, max  = 99999) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  getString() {
    return (Math.random() + 1).toString(36).substring(2);
  },
});
