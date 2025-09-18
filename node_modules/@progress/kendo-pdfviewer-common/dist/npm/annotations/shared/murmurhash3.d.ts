declare class MurmurHash3_64 {
    h1: any;
    h2: any;
    constructor(seed: any);
    update(input: any): void;
    hexdigest(): string;
}
export { MurmurHash3_64 };
