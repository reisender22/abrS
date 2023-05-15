export default function createStatusStore() {
  let _status = "";
  const subscribers = [];

  function subscribe(callback) {
    subscribers.push(callback);
    callback(_status);

    return function unsubscribe() {
      const index = subscribers.findIndex((fn) => fn === callback);
      subscribers.splice(index, 1);
    };
  }

  function set(status) {
    _status = status;
    for (const fn of subscribers) fn(_status);
  }

  function reset() {
    set("");
  }

  return { subscribe, set, reset };
}
