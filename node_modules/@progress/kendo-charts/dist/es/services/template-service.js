let current = {
    compile: function(template) {
        return template;
    }
};

class TemplateService {
    static register(userImplementation) {
        current = userImplementation;
    }

    static compile(template, options) {
        return current.compile(template, options);
    }
}

export default TemplateService;
