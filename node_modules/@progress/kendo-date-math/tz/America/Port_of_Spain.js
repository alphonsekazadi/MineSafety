const dm = require('@progress/kendo-date-math');
dm.loadTimezone({
  "zones": {
    "America/Port_of_Spain": "America/Puerto_Rico"
  },
  "rules": {},
  "titles": {
    "America/Port_of_Spain": {
      "long": "SA Western Standard Time",
      "group": "(GMT-04:00) La Paz"
    }
  }
});