const dm = require('@progress/kendo-date-math');
dm.loadTimezone({
  "zones": {
    "America/Rainy_River": "America/Winnipeg"
  },
  "rules": {},
  "titles": {
    "America/Rainy_River": {
      "long": "Central Standard Time",
      "group": "(GMT-06:00) Central Time (US & Canada)"
    }
  }
});