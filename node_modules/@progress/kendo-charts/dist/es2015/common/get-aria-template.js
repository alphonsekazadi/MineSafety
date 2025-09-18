import TemplateService from '../services/template-service';
import isFunction from './is-function';

export default function getTemplate(options = {}) {
    let ariaTemplate;
    if (options.ariaTemplate) {
        options.ariaTemplate = ariaTemplate = TemplateService.compile(options.ariaTemplate);
    } else if (isFunction(options.ariaContent)) {
        ariaTemplate = options.ariaContent;
    }

    return ariaTemplate;
}
