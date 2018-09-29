import StimuliBus from "./StimuliBus/StimuliBus";
import FilterManager from "./FilterManager/FilterManager";
import { Abstract_Handler } from "@/Core/Handlers/Abstract.Handler";
import Recorder from "@/Core/Recorder/Recorder";
export declare class GobCore {
    data: any;
    gate: any;
    proxy: any;
    options: GobOptions;
    stimuliBus: StimuliBus;
    filterManager: FilterManager;
    recorder: Recorder;
    handler: Abstract_Handler;
    isGob: number;
    constructor(options?: GobOptions);
    static DEFAULT_OPTIONS: GobOptions;
}
export interface GobOptions {
    syncLog?: Boolean;
    disableLog?: Boolean;
    logType?: {
        set?: Boolean;
        get?: Boolean;
        delete?: Boolean;
        [propName: string]: any;
    };
    logSize?: Number;
    [propName: string]: any;
}
export interface GobProxy {
    ["[Gob Core]"]?: GobCore;
    $get?: (path: string | string[]) => any;
    $set?: (path: string | string[], value: any) => Boolean;
    $delete?: (path: string | string[]) => Boolean;
    $core?: GobCore;
    [propName: string]: any;
}
interface GobFactory {
    (this: any, object: any, options?: object): GobProxy;
    default: {
        options: GobOptions;
    };
    GOB_CORE_NAME: string;
    inspect: Function;
}
declare let GobFactory: GobFactory;
export default GobFactory;
