export default function isPlainObject(value) {
    return Object.prototype.toString.call(value) === "[object Object]";
}