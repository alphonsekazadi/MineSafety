const dm = require('@progress/kendo-date-math');
dm.loadTimezone({
  "zones": {
    "America/Creston": "America/Phoenix"
  },
  "rules": {},
  "titles": {
    "America/Creston": {
      "long": "US Mountain Standard Time",
      "group": "(GMT-07:00) Arizona"
    }
  }
});