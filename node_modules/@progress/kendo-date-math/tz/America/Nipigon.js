const dm = require('@progress/kendo-date-math');
dm.loadTimezone({
  "zones": {
    "America/Nipigon": "America/Toronto"
  },
  "rules": {},
  "titles": {
    "America/Nipigon": {
      "long": "Eastern Standard Time",
      "group": "(GMT-05:00) Eastern Time (US & Canada)"
    }
  }
});