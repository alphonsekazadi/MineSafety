const dm = require('@progress/kendo-date-math');
dm.loadTimezone({
  "zones": {
    "America/Nassau": "America/Toronto"
  },
  "rules": {},
  "titles": {
    "America/Nassau": {
      "long": "Eastern Standard Time",
      "group": "(GMT-05:00) Eastern Time (US & Canada)"
    }
  }
});