const dm = require('@progress/kendo-date-math');
dm.loadTimezone({
  "zones": {
    "Australia/Currie": "Australia/Hobart"
  },
  "rules": {},
  "titles": {
    "Australia/Currie": {
      "long": "Tasmania Standard Time",
      "group": "(GMT+10:00) Hobart"
    }
  }
});