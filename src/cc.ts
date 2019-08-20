import { tryExecute, tryExecutor, createId, } from './utils';
import * as utils from './utils';
import { Routine, EventToken } from './cc-interfaces';
import ccd3 from './cc-d3'


declare global {
    interface Window { cc_runtime: any; }
}

const CANCEL_REQUEST_TIMEOUT = cancelAnimationFrame || clearTimeout;

class CC {
    private static instance: CC

    static Utils = utils;

    private routineQueue: Routine[] = [];
    private routineRecycle: Routine[] = [];

    private actionQueue: (() => void)[] = [];
    private eventQueue: EventToken[] = [];
    private handlerMap: Map<string, Map<any, (...args: any[]) => any>> = new Map();

    private dataMap: Map<string, any> = new Map();

    private cycleRunning: boolean = false;

    public utils = utils;

    static create() {
        if (!CC.instance) {
            CC.instance = new CC()
        }
        return CC.instance
    }

    private constructor() {
        this.cycle();
    }

    private cycle() {
        if (this.cycleRunning) {
            return;
        }
        let self = this;
        self.cycleRunning = true;
        setTimeout(tryExecutor(self.runCycle.bind(self)), 20)
    }

    private runCycle() {
        this.doRoutine();
        this.doActions();
        this.handleEvents();
        this.reloadRoutines();
        this.cycleRunning = false;
        this.cycle();
    }

    private doRoutine() {
        while (this.routineQueue.length > 0) {
            let routine: Routine = this.routineQueue.shift();
            this.routineRecycle.push(routine);
            if (--routine.wait <= 0) {
                routine.hasError = true;
                routine.isDone = tryExecute(routine.task) === false;
                routine.hasError = false;
            }
        }
    }

    private reloadRoutines() {
        while (this.routineRecycle.length > 0) {
            let routine = this.routineRecycle.shift();
            if (routine.hasError === true) {
                console.warn(`Routine '${routine.name}' had a runtime error. It has been removed`);
                continue;
            }
            if (routine.isDone !== true) {
                routine.wait = routine.wait <= 0 ? routine.frame : routine.wait;
                this.routineQueue.push(routine)
            }

        }
    }

    private doActions() {
        while (this.actionQueue.length > 0) {
            tryExecute(this.actionQueue.shift());
        }
    }

    private handleEvents() {
        while (this.eventQueue.length > 0) {
            let { eventName, payload } = this.eventQueue.shift();
            let handlers = this.handlerMap.get(eventName) || new Map();
            handlers.forEach(function (handler: (...args: any[]) => any, key: any) {
                if (handler(payload) === false) {
                    handlers.delete(key);
                };
            })
            if (handlers.size === 0) {
                this.handlerMap.delete(eventName);
            }
        }
    }

    public select(selector: string) {
        return ccd3.select(selector);
    }

    public get(key: string) {
        return this.dataMap.get(key);
    }

    public set(key: string, value: any) {
        let self = this;
        this.do(function () {
            self.dataMap.set(key, value);
            self.cast(key, value);
        })
        return this;
    }

    public cast(eventName: string, payload: any) {
        this.eventQueue.push({
            eventName: eventName,
            payload: payload
        })
    }

    public routine(name: string, task: () => any, wait = 50) {
        this.routineQueue.push({
            name: name,
            isDone: false,
            task: task,
            wait: 0,
            frame: wait,
            hasError: false,
        })
    }

    public do(fn: () => void) {
        this.actionQueue.push(fn);
        return this;
    }

    public handle(eventName: string, handler: (...args: any[]) => any) {
        let handlers = this.handlerMap.get(eventName) || new Map();
        handlers.set(createId(), handler);
        this.handlerMap.set(eventName, handlers);
        return this;
    }

    requestAnimationTimeout(fn: () => any, delay: number) {
        if (!requestAnimationFrame)
            return setTimeout(fn, delay);

        let start = Date.now(),
            handle: number

        function loop() {
            Date.now() - start >= delay ? fn() : handle = requestAnimationFrame(loop);
        }

        handle = requestAnimationFrame(loop);
        return handle;
    }

    clearRequestAnimationTimeout(handle: number) {
        CANCEL_REQUEST_TIMEOUT(handle)
    }
}
let cc = CC.create();

window.cc_runtime = cc;

export default cc;

export { ccd3 }
