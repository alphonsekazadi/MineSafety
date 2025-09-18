function trendlineFactory(registry, type, context) {
    const impl = registry[String(type)];
    if (impl) {
        return impl(context);
    }

    return null;
}

export default trendlineFactory;
