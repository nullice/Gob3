import {GobCore} from "@/Core/Core"

export const GATE_PROXY_NAME = "[PROXY]"

export interface Gate
{
    [GATE_PROXY_NAME]?: object

    [propName: string]: any;
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
    loaclData: any,
    localGate: any,
    state: GobState
}

/**
 * 创建一个基于 path 的代理处理器
 * @param loaclData
 * @param {string[]} loaclpath
 * @param {string[]} fullPath
 * @param {{gobCore: GobCore; GOB_CORE_NAME: string}} state
 * @returns {{set: (target: any, key: any, value: any) => boolean; get: (target: any, property: any) => (any)}}
 */

function giveProxyHandler(loaclData: any, localGate: any, fullPath: string[], state: GobState)
{

    return {
        "set": function (target: any, key: any, value: any)
        {
            // 处理特殊属性 [Gob Core]
            if (key == state.GOB_CORE_NAME)
            {
                return true
            }

            let nowFullPath = [...fullPath, key]
            let handlerContext = {loaclData, localGate, state}
            return state.gobCore.stimuliBus.receptor("set", nowFullPath, value, null, handlerContext)

        },
        "get": function (target: any, key: any)
        {
            // 处理特殊属性 [Gob Core]
            if (key == state.GOB_CORE_NAME)
            {
                return state.gobCore
            }

            if (key == "$get") return $get
            if (key == "$set") return $set
            if (key == "$delete") return $delete
            if (key == "$core") return state.gobCore



            let nowFullPath = [...fullPath, key]
            let handlerContext = {loaclData, localGate, state}
            return state.gobCore.stimuliBus.receptor("get", nowFullPath, undefined, null, handlerContext)
        },
        "deleteProperty": function (target: any, key: any)
        {

            // 处理特殊属性 [Gob Core]
            if (key == state.GOB_CORE_NAME)
            {
                return true
            }
            console.log("called: " + key)
            let nowFullPath = [...fullPath, key]
            let handlerContext = {loaclData, localGate, state}
            return state.gobCore.stimuliBus.receptor("delete", nowFullPath, null, null, handlerContext)

        }
    }


    function $get(inPath: string[]|string, origin: object | string | null = null)
    {
        let path = normalizePath(inPath)
        let nowFullPath = [...fullPath, ...path]
        console.log("$get", nowFullPath)
        return state.gobCore.stimuliBus.receptor("get", nowFullPath, undefined, origin)
    }

    function $set(inPath: string[]|string, value: any, origin: object | string | null = null)
    {
        let path = normalizePath(inPath)
        let nowFullPath = [...fullPath, ...path]
        console.log("$set", nowFullPath, value)
        return state.gobCore.stimuliBus.receptor("set", nowFullPath, value, origin)
    }

    function $delete(inPath: string[]|string, origin: object | string | null = null)
    {
        let path = normalizePath(inPath)
        let nowFullPath = [...fullPath, ...path]
        console.log("$delete", nowFullPath)
        return state.gobCore.stimuliBus.receptor("delete", nowFullPath, undefined, origin)
    }
}


/**
 * 规则化 path，让数组与字符串两种路径都可以用 ["a","b"], "a.b", "a\b\c", "a/b/c"
 * @param {string[] | string} path
 * @returns {string[]}
 */
function normalizePath(path: string[] | string): string[]
{
    if (typeof path === "string")
    {
        return path.split(/[\.\\/]/)
    }
    else
    {
        return path
    }
}


export default giveProxyHandler
