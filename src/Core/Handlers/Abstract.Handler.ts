import {GobCore, GobProxy} from "@/Core/Core"

export abstract class Abstract_Handler
{
    /**
     * 创建一个 GobProxy
     * @param {GobCore} gobCore
     * @param initData
     * @returns {GobProxy}
     */
    public abstract createGobProxy(gobCore: GobCore, initData?: any): GobProxy

    abstract get: Function
    abstract set: Function
    abstract delete: Function
}


export interface GobState
{
    coreData: any,
    coreGate: any,
    gobCore: GobCore,
    GOB_CORE_NAME: string
}


export interface HandlerContext
{
    localData: any,
    localGate: any,
    state: GobState
}


export const GATE_PROXY_NAME = "[PROXY]"

export interface Gate
{
    [GATE_PROXY_NAME]?: object

    [propName: string]: any;
}
