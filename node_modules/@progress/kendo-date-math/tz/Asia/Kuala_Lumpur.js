const dm = require('@progress/kendo-date-math');
dm.loadTimezone({
  "zones": {
    "Asia/Kuala_Lumpur": "Asia/Singapore"
  },
  "rules": {},
  "titles": {
    "Asia/Kuala_Lumpur": {
      "long": "Singapore Standard Time",
      "group": "(GMT+08:00) Kuala Lumpur, Singapore"
    }
  }
});