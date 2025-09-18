import { RecurrenceRule } from './types/recurrence-rule.interface';
/** @hidden */
export declare class BaseFrequency {
    next(date: Date, rule: RecurrenceRule): boolean;
    normalize(options: any): void;
    limit(date: Date, end: Date, rule: RecurrenceRule): void;
    interval(rule: RecurrenceRule, current: Date): boolean;
    protected _hour(date: Date, rule: RecurrenceRule, interval?: number): void;
    protected _date(date: Date, rule: RecurrenceRule, interval: number): void;
    private getNumberOfWeeksBetweenDates;
}
/** @hidden */
export declare class HourlyFrequency extends BaseFrequency {
    next(date: Date, rule: RecurrenceRule): boolean;
    normalize(options: any): void;
}
/** @hidden */
export declare class DailyFrequency extends BaseFrequency {
    next(date: Date, rule: RecurrenceRule): boolean;
}
/** @hidden */
export declare class WeeklyFrequency extends DailyFrequency {
    setup(rule: RecurrenceRule, eventStartDate: Date): void;
}
/** @hidden */
export declare class MonthlyFrequency extends BaseFrequency {
    next(date: Date, rule: RecurrenceRule): boolean;
    normalize(options: any): void;
    setup(rule: RecurrenceRule, eventStartDate: Date, date: Date): void;
}
/** @hidden */
export declare class YearlyFrequency extends MonthlyFrequency {
    next(date: Date, rule: RecurrenceRule): boolean;
    setup(): void;
}
