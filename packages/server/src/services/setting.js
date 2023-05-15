const email = require("../loaders/email");
const sqlite = require("../loaders/sqlite");

const SettingModel = require("../models/settings");

const db = sqlite();

module.exports = Object.freeze({
  get(name) {
    return SettingModel.getByName(name).value;
  },

  set(name, value) {
    SettingModel.update(name, value);

    return SettingModel.getByName(name).value;
  },

  getAll() {
    const array = SettingModel.getAll();

    return array.reduce(
      (object, item) => ({ ...object, [item.name]: item.value }),
      {}
    );
  },

  setAll(settingsInput) {
    db.transaction((settingsInput) => {
      for (const name in settingsInput) {
        SettingModel.update(name, settingsInput[name]);
      }
    })(settingsInput);

    email({ reload: true });
  },
});
