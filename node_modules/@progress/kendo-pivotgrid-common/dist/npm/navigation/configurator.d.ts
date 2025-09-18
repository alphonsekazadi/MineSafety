import { Navigation } from './navigation';
/**
 * The PivotGrid Configurator keyboard navigation functionality.
 *
 * Usage:
 *
 * On Initialize
 * const navigation = new ConfiguratorNavigation({ tabindex: 0 });
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
export declare class ConfiguratorNavigation extends Navigation {
    selectors: string[];
    mouseEvents: {
        [type: string]: (target: HTMLElement, nav: ConfiguratorNavigation, ev: Event) => void;
    };
    keyboardEvents: {
        [type: string]: {
            [key: string]: (target: HTMLElement, nav: ConfiguratorNavigation, ev: KeyboardEvent) => void;
        };
    };
}
