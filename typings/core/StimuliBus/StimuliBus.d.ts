import { GobState } from "@/Core/Handlers/Abstract.Handler.ts";
import { GobCore } from "@/Core/Core";
export interface HandlerContext {
    localData: any;
    localGate: any;
    state: GobState;
}
export interface Stimuli {
    type: string;
    path: string[] | string;
    value: any;
    origin: object | string | null;
    info?: {
        time?: number;
        index?: number;
        typeIndex?: number;
    };
}
/**
 * 刺激总线
 */
declare class StimuliBus {
    stimuliLog: {
        changes: Stimuli[];
        visits: Stimuli[];
        indexes: {
            set: number;
            get: number;
            delete: number;
            all: number;
            [propName: string]: number;
        };
        latestPath: string[] | null;
        latestType: string | null;
    };
    gobCore: GobCore;
    constructor(gobCore: GobCore);
    /**
     * 总线的刺激受体，根据接收的刺激
     * @param {HandlerContext} [handlerContext] 上下文
     * @return {any | any | any | void | boolean}
     * @param stimuli
     */
    receptor(this: any, stimuli: Stimuli, handlerContext?: HandlerContext): any;
    /**
     * 刺激最终反应，根据刺激改变 data
     * @param {string} stimuliType
     * @param {string[]} path
     * @param value
     * @param {object | string | null} origin
     * @param {HandlerContext} handlerContext
     * @returns {any}
     */
    private react(this, stimuli, handlerContext?);
}
export default StimuliBus;
