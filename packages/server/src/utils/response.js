const Hashids = require("hashids/cjs");

const hashids = new Hashids("", 8);

function filterProps(object, keys) {
  delete object.password;

  if (!keys) return object;

  let filtered = {};

  for (const key of keys) {
    filtered[key] = object[key];
  }

  return filtered;
}

function hashIds(object) {
  let encoded = { ...object };

  for (const key in encoded) {
    if (key === "id" || key.endsWith("_id")) {
      encoded[key] = hashids.encode(encoded[key]);
    }
  }

  return encoded;
}

function unhashIds(object) {
  let decoded = { ...object };

  for (const key in decoded) {    
    if (key === "id" || key.endsWith("_id")) {
      decoded[key] = hashids.decode(decoded[key])[0];
    }
  }

  return decoded;
}

function prepareResponse(data, keys) {
  if (Array.isArray(data)) {
    const filtered = data.map((object) => hashIds(filterProps(object, keys)));

    return JSON.stringify(filtered, null, 2);
  }

  const filtered = hashIds(filterProps(data, keys));

  return JSON.stringify(filtered, null, 2);
}

module.exports = Object.freeze({ unhashIds, prepareResponse });
