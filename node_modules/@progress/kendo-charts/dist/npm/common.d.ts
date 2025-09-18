export class InstanceObserver {
    observer: any;

    constructor(observer: any, handlers?: any);

    trigger(name: string, args: any): boolean;

    callObserver(fnName: string, ...args: any[]): boolean;

    requiresHandlers(names: string[]): boolean;
}

export function deepExtend(destination: any, ...source: any[]): any;
