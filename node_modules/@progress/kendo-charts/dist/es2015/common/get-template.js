import TemplateService from '../services/template-service';
import isFunction from './is-function';

export default function getTemplate(options = {}) {
    let template;
    if (options.template) {
        options.template = template = TemplateService.compile(options.template);
    } else if (isFunction(options.content)) {
        template = options.content;
    }

    return template;
}
