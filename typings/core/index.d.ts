import StimuliBus from "./StimuliBus/index";
export declare class GobCore {
    data: object;
    gate: object;
    options: GobOptions;
    proxy: any;
    GobFactory: GobFactory;
    stimuliBus: StimuliBus;
    isGob: number;
    constructor(options?: GobOptions);
}
export interface GobOptions {
    syncLog?: Boolean;
    disableLog?: Boolean;
    [propName: string]: any;
}
export interface GobProxy {
    ["[Gob Core]"]?: GobCore;
    $get?: (path: string | string[]) => any;
    [propName: string]: any;
}
interface GobFactory {
    (this: any, object: any, options?: object): GobProxy;
    default: {
        options: GobOptions;
        cloneDeep: Function;
    };
}
declare let GobFactory: GobFactory;
export default GobFactory;
