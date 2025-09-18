const dm = require('@progress/kendo-date-math');
dm.loadTimezone({
  "zones": {
    "Europe/Uzhgorod": "Europe/Kyiv"
  },
  "rules": {},
  "titles": {
    "Europe/Uzhgorod": {
      "long": "FLE Standard Time",
      "group": "(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius"
    }
  }
});