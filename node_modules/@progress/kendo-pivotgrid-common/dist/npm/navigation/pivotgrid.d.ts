import { Navigation } from './navigation';
/**
 * The PivotGrid keyboard navigation functionality.
 *
 * Usage:
 *
 * On Initialize
 * const navigation = new PivotGridNavigation({ tabindex: 0 });
 *
 * Turn on
 * navigation.start(rootDomElement);
 *
 * On After Update
 * navigation.update();
 *
 * On Destroy / Turn off
 * navigation.stop();
 */
export declare class PivotGridNavigation extends Navigation {
    selectors: string[];
    mouseEvents: {
        [type: string]: (target: HTMLElement, nav: PivotGridNavigation, ev: Event) => void;
    };
    keyboardEvents: {
        [type: string]: {
            [key: string]: (target: HTMLElement, nav: PivotGridNavigation, ev: KeyboardEvent) => void;
        };
    };
}
