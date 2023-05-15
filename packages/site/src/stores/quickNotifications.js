function createNotificationStore() {
  let notifications = [];
  let subs = [];

  function subscribe(handler) {
    subs.push(handler);
    handler(notifications);

    return function unsubscribe() {
      subs = subs.filter((fn) => fn !== handler);
    };
  }

  function display({ message = "", level = "success", url = "", action }) {
    notifications.push({ message, level, url, action });
    for (const fn of subs) fn(notifications);
  }

  function get() {
    const notification = notifications.shift();

    for (const fn of subs) fn(notifications);

    return notification;
  }

  return { get, display, subscribe };
}

const notifications = createNotificationStore();

export { notifications };
