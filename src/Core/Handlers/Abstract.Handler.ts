import {GobCore, GobProxy} from "@/Core/Core"

export abstract class Abstract_Handler
{
    /**
     * 创建一个 GobProxy
     * @param {GobCore} gobCore
     * @param initData
     * @returns {GobProxy}
     */
    public  abstract createGobProxy(gobCore: GobCore, initData?: any): GobProxy

    abstract get: Function
    abstract set: Function
    abstract delete: Function
}
