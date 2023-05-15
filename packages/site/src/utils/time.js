const weekdays = {
  MON: "Montag",
  TUE: "Dienstag",
  WED: "Mittwoch",
  THU: "Donnerstag",
  FRI: "Freitag",
  SAT: "Samstag",
  SUN: "Sonntag",
};

function getTimeString(times) {
  return times
    .map(({ day, from, to }) => `${weekdays[day]}s ${from}-${to} Uhr`)
    .join(" und ");
}

export { getTimeString };
