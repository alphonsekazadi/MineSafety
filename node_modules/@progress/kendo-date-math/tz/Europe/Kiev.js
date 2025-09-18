const dm = require('@progress/kendo-date-math');
dm.loadTimezone({
  "zones": {
    "Europe/Kiev": "Europe/Kyiv"
  },
  "rules": {},
  "titles": {
    "Europe/Kiev": {
      "long": "FLE Standard Time",
      "group": "(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius"
    }
  }
});