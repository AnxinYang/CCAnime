export function tryExecute(fn: () => any) {
    let result: any;
    try {
        result = fn()
    } catch (e) {
        console.error(e);
    }
    return result;
}

export function tryExecutor(fn: () => any): () => any {
    return function () {
        try {
            fn()
        } catch (e) {
            console.error(e);
        }
    };
}

export function createId(): string {
    let s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

export function read(value: any, ...args: any[]): any {
    return typeof value === 'function' ? value(...args) : value;
}

export function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
