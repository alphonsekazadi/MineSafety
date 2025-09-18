import { Encoding } from './encoding';
import deepExtend from '../../common/deep-extend';
import inArray from '../../common/in-array';

const numberRegex = /^\d+$/;
const alphanumericRegex = /^[a-z0-9]+$/i;
const extend = Object.assign;

export class State128 {
    constructor(encoding) {
        this.encoding = encoding;
        this.initProperties();
    }

    initProperties() { }

    addStart() { }

    is() { }

    isCode() {
        return false;
    }

    move() { }

    pushState() { }
}

export class State128AB extends State128 {
    constructor(encoding, states) {
        super(encoding);
        this.states = states;
        this._initMoves(states);
    }

    initProperties() {
        super.initProperties();

        deepExtend(this, {
            FNC4: "FNC4",
            SHIFT: 98
        });
    }

    addStart() {
        this.encoding.addPattern(this.START);
    }

    is(value, index) {
        let code = value.charCodeAt(index);
        return this.isCode(code);
    }

    move(encodingState) {
        let idx = 0;

        while (!this._moves[idx].call(this, encodingState) && idx < this._moves.length) {
            idx++;
        }
    }

    pushState(encodingState) {
        let states = this.states,
            value = encodingState.value,
            maxLength = value.length,
            code;

        if (inArray("C", states)) {
            let numberMatch = value.substr(encodingState.index).match(/\d{4,}/g);

            if (numberMatch) {
                maxLength = value.indexOf(numberMatch[0], encodingState.index);
            }
        }

        while ((code = encodingState.value.charCodeAt(encodingState.index)) >= 0 &&
            this.isCode(code) &&
            encodingState.index < maxLength) {
            this.encoding.addPattern(this.getValue(code));
            encodingState.index++;
        }
    }

    _initMoves(states) {
        this._moves = [];

        if (inArray(this.FNC4, states)) {
            this._moves.push(this._moveFNC);
        }

        if (inArray(this.shiftKey, states)) {
            this._moves.push(this._shiftState);
        }

        this._moves.push(this._moveState);
    }

    _moveFNC(encodingState) {
        if (encodingState.fnc) {
            encodingState.fnc = false;
            return encodingState.previousState === this.key;
        }
    }

    _shiftState(encodingState) {
        if (encodingState.previousState === this.shiftKey &&
            (encodingState.index + 1 >= encodingState.value.length ||
                this.encoding[this.shiftKey].is(encodingState.value, encodingState.index + 1))) {
            this.encoding.addPattern(this.SHIFT);
            encodingState.shifted = true;
            return true;
        }
    }

    _moveState() {
        this.encoding.addPattern(this.MOVE);
        return true;
    }
}

const states128 = {};

states128.A = class State128A extends State128AB {
    initProperties() {
        super.initProperties();

        extend(this, {
            key: "A",
            shiftKey: "B",
            MOVE: 101,
            START: 103
        });
    }

    isCode(code) {
        return 0 <= code && code < 96;
    }

    getValue(code) {
        if (code < 32) {
            return code + 64;
        }

        return code - 32;
    }
};

states128.B = class State128B extends State128AB {
    initProperties() {
        super.initProperties();

        extend(this, {
            key: "B",
            shiftKey: "A",
            MOVE: 100,
            START: 104
        });
    }

    isCode(code) {
        return 32 <= code && code < 128;
    }

    getValue(code) {
        return code - 32;
    }
};

states128.C = class State128C extends State128 {
    initProperties() {
        super.initProperties();

        extend(this, {
            key: "C",
            MOVE: 99,
            START: 105
        });
    }

    addStart() {
        this.encoding.addPattern(this.START);
    }

    is(value, index) {
        let next4 = getSubstring(value, index, 4);
        return (index + 4 <= value.length || value.length === 2) && numberRegex.test(next4);
    }

    move() {
        this.encoding.addPattern(this.MOVE);
    }

    pushState(encodingState) {
        let code;

        while ((code = getSubstring(encodingState.value, encodingState.index, 2)) &&
            numberRegex.test(code) && code.length === 2) {
            this.encoding.addPattern(parseInt(code, 10));
            encodingState.index += 2;
        }
    }

    getValue(code) {
        return code;
    }
};

states128.FNC4 = class State128FNC4 extends State128 {
    constructor(encoding, states) {
        super(encoding);
        this._initSubStates(states);
    }

    initProperties() {
        super.initProperties();

        extend(this, {
            key: "FNC4",
            dependentStates: ["A", "B"]
        });
    }

    addStart(encodingState) {
        let code = encodingState.value.charCodeAt(0) - 128,
            subState = this._getSubState(code);

        this.encoding[subState].addStart();
    }

    is(value, index) {
        let code = value.charCodeAt(index);
        return this.isCode(code);
    }

    isCode(code) {
        return 128 <= code && code < 256;
    }

    pushState(encodingState) {
        let subState = this._initSubState(encodingState),
            encoding = this.encoding,
            length = subState.value.length;
        let code;

        encodingState.index += length;

        if (length < 3) {
            for (; subState.index < length; subState.index++) {
                code = subState.value.charCodeAt(subState.index);
                subState.state = this._getSubState(code);

                if (subState.previousState !== subState.state) {
                    subState.previousState = subState.state;
                    encoding[subState.state].move(subState);
                }

                encoding.addPattern(encoding[subState.state].MOVE);
                encoding.addPattern(encoding[subState.state].getValue(code));
            }
        } else {
            if (subState.state !== subState.previousState) {
                encoding[subState.state].move(subState);
            }

            this._pushStart(subState);
            encoding.pushData(subState, this.subStates);

            if (encodingState.index < encodingState.value.length) {
                this._pushStart(subState);
            }
        }

        encodingState.fnc = true;
        encodingState.state = subState.state;
    }

    _pushStart(subState) {
        this.encoding.addPattern(this.encoding[subState.state].MOVE);
        this.encoding.addPattern(this.encoding[subState.state].MOVE);
    }

    _initSubState(encodingState) {
        const subState = {
            value: this._getAll(encodingState.value, encodingState.index),
            index: 0
        };

        subState.state = this._getSubState(subState.value.charCodeAt(0));
        subState.previousState = encodingState.previousState === this.key ?
            subState.state :
            encodingState.previousState;

        return subState;
    }

    _initSubStates(states) {
        this.subStates = [];

        for (let i = 0; i < states.length; i++) {
            if (inArray(states[i], this.dependentStates)) {
                this.subStates.push(states[i]);
            }
        }
    }

    _getSubState(code) {
        for (let i = 0; i < this.subStates.length; i++) {
            if (this.encoding[this.subStates[i]].isCode(code)) {
                return this.subStates[i];
            }
        }
    }

    _getAll(value, index) {
        let code;
        let result = "";
        let i = index;

        while ((code = value.charCodeAt(i++)) && this.isCode(code)) {
            result += String.fromCharCode(code - 128);
        }

        return result;
    }
};

states128.FNC1 = class States128FNC1 extends State128 {
    constructor(encoding, states) {
        super(encoding);
        this.states = states;
    }

    initProperties() {
        super.initProperties();

        extend(this, {
            key: "FNC1",
            startState: "C",
            startAI: "(",
            endAI: ")",
            dependentStates: ["C", "B"],
            applicationIdentifiers: {
                "22": { max: 29, type: "alphanumeric" },
                "402": { length: 17 },
                "7004": { max: 4, type: "alphanumeric" },
                "242": { max: 6, type: "alphanumeric" },
                "8020": { max: 25, type: "alphanumeric" },
                "703": { min: 3, max: 30, type: "alphanumeric" },
                "8008": { min: 8, max: 12, type: "alphanumeric" },
                "253": { min: 13, max: 17, type: "alphanumeric" },
                "8003": { min: 14, max: 30, type: "alphanumeric" },
                multiKey: [{
                    ids: ["15", "17", "8005", "8100"],
                    ranges: [
                        [11, 13],
                        [310, 316],
                        [320, 336],
                        [340, 369]
                    ],
                    type: { length: 6 }
                }, {
                    ids: ["240", "241", "250", "251", "400", "401", "403", "7002", "8004", "8007", "8110"],
                    ranges: [[90 - 99]],
                    type: { max: 30, type: "alphanumeric" }
                }, {
                    ids: ["7001"],
                    ranges: [[410, 414]],
                    type: { length: 13 }
                }, {
                    ids: ["10", "21", "254", "420", "8002"],
                    type: { max: 20, type: "alphanumeric" }
                }, {
                    ids: ["00", "8006", "8017", "8018"],
                    type: { length: 18 }
                }, {
                    ids: ["01", "02", "8001"],
                    type: { length: 14 }
                }, {
                    ids: ["422"],
                    ranges: [
                        [424, 426]
                    ],
                    type: { length: 3 }
                }, {
                    ids: ["20", "8102"],
                    type: { length: 2 }
                }, {
                    ids: ["30", "37"],
                    type: { max: 8, type: "alphanumeric" }
                }, {
                    ids: ["390", "392"],
                    type: { max: 15, type: "alphanumeric" }
                }, {
                    ids: ["421", "423"],
                    type: { min: 3, max: 15, type: "alphanumeric" }
                }, {
                    ids: ["391", "393"],
                    type: { min: 3, max: 18, type: "alphanumeric" }
                }, {
                    ids: ["7003", "8101"],
                    type: { length: 10 }
                }]
            },
            START: 102
        });
    }


    addStart() {
        this.encoding[this.startState].addStart();
    }

    is() {
        return inArray(this.key, this.states);
    }

    pushState(encodingState) {
        let encoding = this.encoding,
            value = encodingState.value.replace(/\s/g, ""),
            regexSeparators = new RegExp("[" + this.startAI + this.endAI + "]", "g"),
            index = encodingState.index,
            subState = {
                state: this.startState
            },
            current,
            nextStart,
            separatorLength;

        encoding.addPattern(this.START);

        const trueCondition = true;

        while (trueCondition) {
            subState.index = 0;

            separatorLength = value.charAt(index) === this.startAI ? 2 : 0;
            current = separatorLength > 0 ? this.getBySeparator(value, index) : this.getByLength(value, index);

            if (current.ai.length) {
                nextStart = index + separatorLength + current.id.length + current.ai.length;
            } else {
                nextStart = value.indexOf(this.startAI, index + 1);

                if (nextStart < 0) {
                    if (index + current.ai.max + current.id.length + separatorLength < value.length) {
                        throw new Error("Separators are required after variable length identifiers");
                    }

                    nextStart = value.length;
                }
            }

            subState.value = value.substring(index, nextStart).replace(regexSeparators, "");
            this.validate(current, subState.value);
            encoding.pushData(subState, this.dependentStates);

            if (nextStart >= value.length) {
                break;
            }

            index = nextStart;

            if (subState.state !== this.startState) {
                encoding[this.startState].move(subState);
                subState.state = this.startState;
            }

            if (!current.ai.length) {
                encoding.addPattern(this.START);
            }
        }

        encodingState.index = encodingState.value.length;
    }

    validate(current, value) {
        let code = value.substr(current.id.length),
            ai = current.ai;

        if (!ai.type && !numberRegex.test(code)) {
            throw new Error("Application identifier " + current.id + " is numeric only but contains non numeric character(s).");
        }

        if (ai.type === "alphanumeric" && !alphanumericRegex.test(code)) {
            throw new Error("Application identifier " + current.id + " is alphanumeric only but contains non alphanumeric character(s).");
        }

        if (ai.length && ai.length !== code.length) {
            throw new Error("Application identifier " + current.id + " must be " + ai.length + " characters long.");
        }

        if (ai.min && ai.min > code.length) {
            throw new Error("Application identifier " + current.id + " must be at least " + ai.min + " characters long.");
        }

        if (ai.max && ai.max < code.length) {
            throw new Error("Application identifier " + current.id + " must be at most " + ai.max + " characters long.");
        }
    }

    getByLength(value, index) {
        let id;
        let applicationIdentifier;

        for (let i = 2; i <= 4; i++) {
            id = getSubstring(value, index, i);
            applicationIdentifier = this.getApplicationIdentifier(id) || this.getApplicationIdentifier(id.substring(0, id.length - 1));
            if (applicationIdentifier) {
                return {
                    id: id,
                    ai: applicationIdentifier
                };
            }
        }
        this.unsupportedAIError(id);
    }

    unsupportedAIError(id) {
        throw new Error("'" + id + "' is not a supported Application Identifier");
    }

    getBySeparator(value, index) {
        let start = value.indexOf(this.startAI, index),
            end = value.indexOf(this.endAI, start),
            id = value.substring(start + 1, end),
            ai = this.getApplicationIdentifier(id) || this.getApplicationIdentifier(id.substr(id.length - 1));

        if (!ai) {
            this.unsupportedAIError(id);
        }

        return {
            ai: ai,
            id: id
        };
    }

    getApplicationIdentifier(id) {
        let applicationIdentifier = this.applicationIdentifiers,
            multiKey = applicationIdentifier.multiKey;

        if (applicationIdentifier[id]) {
            return applicationIdentifier[id];
        }

        for (let i = 0; i < multiKey.length; i++) {
            if (multiKey[i].ids && inArray(id, multiKey[i].ids)) {
                return multiKey[i].type;
            } else if (multiKey[i].ranges) {
                let ranges = multiKey[i].ranges;

                for (let j = 0; j < ranges.length; j++) {
                    if (ranges[j][0] <= id && id <= ranges[j][1]) {
                        return multiKey[i].type;
                    }
                }
            }
        }
    }
};

export class Code128Base extends Encoding {
    constructor(options) {
        super(options);
        this._initStates();
    }

    initProperties() {
        super.initProperties();

        extend(this, {
            characterMap: [
                212222, 222122, 222221, 121223, 121322, 131222, 122213, 122312, 132212, 221213,
                221312, 231212, 112232, 122132, 122231, 113222, 123122, 123221, 223211, 221132,
                221231, 213212, 223112, 312131, 311222, 321122, 321221, 312212, 322112, 322211,
                212123, 212321, 232121, 111323, 131123, 131321, 112313, 132113, 132311, 211313,
                231113, 231311, 112133, 112331, 132131, 113123, 113321, 133121, 313121, 211331,
                231131, 213113, 213311, 213131, 311123, 311321, 331121, 312113, 312311, 332111,
                314111, 221411, 431111, 111224, 111422, 121124, 121421, 141122, 141221, 112214,
                112412, 122114, 122411, 142112, 142211, 241211, 221114, 413111, 241112, 134111,
                111242, 121142, 121241, 114212, 124112, 124211, 411212, 421112, 421211, 212141,
                214121, 412121, 111143, 111341, 131141, 114113, 114311, 411113, 411311, 113141,
                114131, 311141, 411131, 211412, 211214, 211232, 2331112
            ],
            STOP: 106
        });
    }

    _initStates() {
        for (let i = 0; i < this.states.length; i++) {
            this[this.states[i]] = new states128[this.states[i]](this, this.states);
        }
    }

    initValue(value, width, height) {
        this.pattern = [];
        this.value = value;
        this.width = width;
        this.height = height;
        this.checkSum = 0;
        this.totalUnits = 0;
        this.index = 0;
        this.position = 1;
    }

    addData() {
        let encodingState = {
            value: this.value,
            index: 0,
            state: ""
        };

        if (this.value.length === 0) {
            return;
        }

        encodingState.state =
            encodingState.previousState = this.getNextState(encodingState, this.states);

        this.addStart(encodingState);

        this.pushData(encodingState, this.states);

        this.addCheckSum();
        this.addStop();
        this.setBaseUnit();
    }

    pushData(encodingState, states) {
        const trueCondition = true;

        while (trueCondition) {
            this[encodingState.state].pushState(encodingState);

            if (encodingState.index >= encodingState.value.length) {
                break;
            }

            if (!encodingState.shifted) {
                encodingState.previousState = encodingState.state;
                encodingState.state = this.getNextState(encodingState, states);
                this[encodingState.state].move(encodingState);
            } else {
                let temp = encodingState.state;
                encodingState.state = encodingState.previousState;
                encodingState.previousState = temp;
                encodingState.shifted = false;
            }
        }
    }

    addStart(encodingState) {
        this[encodingState.state].addStart(encodingState);
        this.position = 1;
    }

    addCheckSum() {
        this.checksum = this.checkSum % 103;
        this.addPattern(this.checksum);
    }

    addStop() {
        this.addPattern(this.STOP);
    }

    setBaseUnit() {
        this.baseUnit = this.width / (this.totalUnits + this.quietZoneLength);
    }

    addPattern(code) {
        const pattern = this.characterMap[code].toString();
        let value;

        for (let i = 0; i < pattern.length; i++) {
            value = parseInt(pattern.charAt(i), 10);
            this.pattern.push(value);
            this.totalUnits += value;
        }
        this.checkSum += code * this.position++;
    }

    getNextState(encodingState, states) {
        for (let i = 0; i < states.length; i++) {
            if (this[states[i]].is(encodingState.value, encodingState.index)) {
                return states[i];
            }
        }

        this.invalidCharacterError(encodingState.value.charAt(encodingState.index));
    }
}

export class Code128a extends Code128Base {
    initProperties() {
        super.initProperties();

        extend(this, {
            name: "Code 128 A",
            states: ["A"]
        });
    }
}

export class Code128b extends Code128Base {
    initProperties() {
        super.initProperties();

        extend(this, {
            name: "Code 128 B",
            states: ["B"]
        });
    }
}

export class Code128c extends Code128Base {
    initProperties() {
        super.initProperties();

        extend(this, {
            name: "Code 128 C",
            states: ["C"]
        });
    }
}

export class Code128 extends Code128Base {
    initProperties() {
        super.initProperties();

        extend(this, {
            name: "Code 128",
            states: ["C", "B", "A", "FNC4"]
        });
    }
}

export class CodeGS1128 extends Code128Base {
    initProperties() {
        super.initProperties();

        extend(this, {
            name: "Code GS1-128",
            states: ["FNC1", "C", "B"]
        });
    }
}

function getSubstring(value, index, count) {
    return value.substring(index, index + count);
}
