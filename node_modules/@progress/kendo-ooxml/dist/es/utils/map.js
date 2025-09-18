export default function map(array, func) {
    return array.reduce((result, el, i) => {
        const val = func(el, i);
        if (val != null) {
            result.push(val);
        }
        return result;
    }, []);
}