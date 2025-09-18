import { isNumber } from '../common';

export default function firstDay(options, intlService) {
    if (isNumber(options.weekStartDay)) {
        return options.weekStartDay;
    }

    if (intlService && intlService.firstDay) {
        return intlService.firstDay();
    }

    return 0;
}
