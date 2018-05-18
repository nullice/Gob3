// Created by nullice on 2018/04/17 - 14:39 

import giveProxyHandler from "./giveProxyHandler"
import StimuliBus from "./StimuliBus/StimuliBus"
import cloneDeep from "lodash/cloneDeep"

const GOB_CORE_NAME = "[Gob Core]"


/*
*    GobFactory(state) =>  gob instance = GobProxy: {GobCore + state }
* */

export class GobCore
{
    public data: object
    public gate: object
    public options: GobOptions
    public proxy: any
    public GobFactory = GobFactory
    public stimuliBus = new StimuliBus(this)
    public isGob = 3

    constructor(options: GobOptions = {})
    {
        this.data = {}
        this.gate = {}
        this.options = Object.assign({}, GobCore.DEFAULT_OPTIONS, options)
    }

    // 默认参数
    static DEFAULT_OPTIONS: GobOptions = {
        syncLog: false,
        disableLog: false,
        logType: {
            set: true,
            get: false,
            delete: true
        },
        logSize: 2048,
    }

}

export interface GobOptions
{
    // 是否同步记录刺激，默认为 false ，异步记录可以让性能表现更好
    syncLog?: Boolean,
    // 禁止记录 Log，默认为 false ，
    disableLog?: Boolean,
    // 允许记录 log 的类型
    logType?: {
        set?: Boolean,
        get?: Boolean,
        delete?: Boolean,
        [propName: string]: any;
    }
    // 每种类型(set, get, delete)刺激的最大记录数量，默认为 2048
    logSize?: Number

    [propName: string]: any;
}


export interface GobProxy
{
    ["[Gob Core]"]?: GobCore,
    $get?: (path: string | string[]) => any,
    $set?: (path: string | string[], value: any) => Boolean,
    $delete?: (path: string | string[]) => Boolean,
    $core?: GobCore,

    [propName: string]: any;
}

interface GobFactory
{
    (this: any, object: any, options?: object): GobProxy;

    default: {
        options: GobOptions,
        cloneDeep: Function,
    }
    GOB_CORE_NAME: string,
    inspect: Function
}

let GobFactory = <GobFactory> function (this: any, object: any, options?: object): GobProxy
{
    // 创建一个 GobCore
    let gobCore = new GobCore(options)

    // 创建一个代理
    let proxy: GobProxy = new Proxy(gobCore.data,
        giveProxyHandler(gobCore.data, gobCore.gate, [], {
            coreData: gobCore.data,
            coreGate: gobCore.gate,
            gobCore,
            GOB_CORE_NAME
        })
    )


    // 设置初始值
    if (object)
    {
        for (var key in object)
        {
            proxy[key] = object[key]
        }
    }

    gobCore.proxy = proxy
    return proxy
}


// GobFactory 提供的默认设置
GobFactory.default = {
    options: {},
    cloneDeep: cloneDeep
}

// 注册一些方法和常量到 Gob
GobFactory.GOB_CORE_NAME = GOB_CORE_NAME

/**
 * 检查一个 gob 实例的 Core
 * @param gob
 * @returns {any}
 */
GobFactory.inspect = function (gob: any): GobCore
{

    let core = gob[GOB_CORE_NAME]
    if (core)
    {
        return gob[GOB_CORE_NAME]
    }
    else
    {
        throw Error("[Gob] Gob.inspect: param is not Gob3 Instance. :" + gob)

    }
}


export default GobFactory
