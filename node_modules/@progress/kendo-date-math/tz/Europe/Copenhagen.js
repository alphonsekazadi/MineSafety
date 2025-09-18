const dm = require('@progress/kendo-date-math');
dm.loadTimezone({
  "zones": {
    "Europe/Copenhagen": "Europe/Berlin"
  },
  "rules": {},
  "titles": {
    "Europe/Copenhagen": {
      "long": "Romance Standard Time",
      "group": "(GMT+01:00) Brussels, Copenhagen, Madrid, Paris"
    }
  }
});