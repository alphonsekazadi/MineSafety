const dm = require('@progress/kendo-date-math');
dm.loadTimezone({
  "zones": {
    "America/Thunder_Bay": "America/Toronto"
  },
  "rules": {},
  "titles": {
    "America/Thunder_Bay": {
      "long": "Eastern Standard Time",
      "group": "(GMT-05:00) Eastern Time (US & Canada)"
    }
  }
});