export default function cycleDown(index, count) {
    let result = index - 1;

    return result < 0 ? count - 1 : result;
}
