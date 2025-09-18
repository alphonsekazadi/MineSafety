export default function cycleIndex(index, length) {
    if (length === 1 || (index % length) === 0) {
        return 0;
    }

    if (index < 0) {
        return length + (index % length);
    } else if (index >= length) {
        return index % length;
    }

    return index;
}