// Created by nullice on 2018/04/24 - 15:05

import util from "@/Util/Util"

let rcObject = util.rcObject

import {GobState} from "@/Core/Handlers/Abstract.Handler.ts"
import {FilterType} from "@/Core/FilterManager/FilterManager"
import IgnoreSideEffect from "./ignore-side-effect"
import stimuliFiltering from "./stimuli-filtering"
import {GobCore} from "@/Core/Core"
import {Filter} from "@/Core/FilterManager/FilterManager"


export interface HandlerContext
{
    localData: any,
    localGate: any,
    state: GobState
}

export interface Stimuli
{
    type: string,
    path: string[] | string,
    value: any,
    origin: object | string | null,
    info?: {
        time?: number,
        index?: number,
        typeIndex?: number,
    }
}


/**
 * 刺激总线
 */
class StimuliBus
{
    public stimuliLog:
        {
            changes: Stimuli[],
            visits: Stimuli[],
            indexes: { set: number, get: number, delete: number, all: number, [propName: string]: number },
            latestPath: string[] | null,
            latestType: string | null,
        }
        = {
        changes: [],    // 存放改变值的刺激记录
        visits: [],     // 存放不改变值的刺激记录
        indexes: {      // 记录各种刺激的次数
            set: 0,
            get: 0,
            delete: 0,
            all: 0
        },
        latestPath: null, // 最后一次 Stimuli 用到的路径
        latestType: null, // 最后一次 Stimuli 类型
    }

     gobCore: GobCore

    constructor(gobCore: GobCore)
    {
        this.gobCore = gobCore
    }

    /**
     * 总线的刺激受体，根据接收的刺激
     * @param {HandlerContext} [handlerContext] 上下文
     * @return {any | any | any | void | boolean}
     * @param stimuli
     */
    public receptor(this: any, stimuli: Stimuli, handlerContext?: HandlerContext)
    {

        // 过滤器处理
        let activeFilters = this.gobCore.filterManager.getFilters(stimuli.path, FilterType.pre)
        let isAsyncFlow = false // 是否是一个异步的过滤器流程

        for (var i = 0; i < activeFilters.length; i++)
        {
            if (activeFilters[i].isAsync)
            {
                isAsyncFlow = true
                break
            }
        }

        return this.react(stimuli, handlerContext)
    }


    /**
     * 刺激最终反应，根据刺激改变 data
     * @param {string} stimuliType
     * @param {string[]} path
     * @param value
     * @param {object | string | null} origin
     * @param {HandlerContext} handlerContext
     * @returns {any}
     */
    private react(this: any, stimuli: Stimuli, handlerContext?: HandlerContext)
    {
        console.log("[receptor]", handlerContext ? "<Handler>" : "<noHandler>", stimuli.type, stimuli.path)

        // 记录刺激
        if (handlerContext)
        {
            // 是否忽略一些副作用产生的刺激
            if (!IgnoreSideEffect(stimuli.type, util.normalizePath(stimuli.path), handlerContext))
            {
                // console.log("Ignore IgnoreSideEffect", handlerContext)
                // 记录刺激
                this.gobCore.recorder.recOnce(stimuli)
            }
        }

        // 写入刺激
        let type = stimuli.type
        let path = util.normalizePath(stimuli.path)
        let value = stimuli.value

        const set = this.gobCore.handler.set
        const get = this.gobCore.handler.get
        const del = this.gobCore.handler.delete

        switch (stimuli.type)
        {
            case "get":
            {
                if (!handlerContext)
                {
                    return rcObject.getObjectValueByNames(this.gobCore.proxy, path, null)
                }
                else
                {
                    return get(path, path[path.length - 1], handlerContext)
                }
            }
            case "set":
            {
                if (!handlerContext)
                {
                    return rcObject.setObjectValueByNames(this.gobCore.proxy, path, value)
                }
                else
                {
                    return set(path, value, path[path.length - 1], handlerContext)
                }
            }
            case "delete":
            {
                if (!handlerContext)
                {
                    return rcObject.deleteObjectValueByNames(this.gobCore.proxy, path)
                }
                else
                {
                    return del(path, value, path[path.length - 1], handlerContext)
                }
            }
            default:
            {
            }
        }
    }



}

export default StimuliBus
