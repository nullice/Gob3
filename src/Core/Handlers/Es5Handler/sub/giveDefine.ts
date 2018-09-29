// import {GobCore} from "src/Core/Core"
//
// export const GATE_PROXY_NAME = "[PROXY]"
//
// export interface Gate
// {
//     [GATE_PROXY_NAME]?: object
//
//     [propName: string]: any;
// }
//
// export interface GobState
// {
//     coreData: any,
//     coreGate: any,
//     gobCore: GobCore,
//     GOB_CORE_NAME: string
// }
//
//
// export interface HandlerContext
// {
//     localData: any,
//     localGate: any,
//     state: GobState
// }
//
// /**
//  * 创建一个基于 path 的代理处理器
//  * @param localData
//  * @param {string[]} localpath
//  * @param {string[]} fullPath
//  * @param {{gobCore: GobCore; GOB_CORE_NAME: string}} state
//  * @returns {{set: (target: any, key: any, value: any) => boolean; get: (target: any, property: any) => (any)}}
//  */
//
// function giveEs5Handler(localData: any, localGate: any, fullPath: string[], state: GobState)
// {
//
//     return {
//         "set": function (target: any, key: any, value: any)
//         {
//             // 处理特殊属性 [Gob Core]
//             if (key == state.GOB_CORE_NAME)
//             {
//                 return true
//             }
//
//             let nowFullPath = [...fullPath, key]
//             let handlerContext = {localData, localGate, state}
//             return state.gobCore.stimuliBus.receptor("set", nowFullPath, value, null, handlerContext)
//
//         },
//         "get": function (target: any, key: any)
//         {
//             // 处理特殊属性 [Gob Core]
//             if (key == state.GOB_CORE_NAME)
//             {
//                 return state.gobCore
//             }
//
//             if (key == "$get") return $get
//             if (key == "$set") return $set
//             if (key == "$delete") return $delete
//             if (key == "$core") return state.gobCore
//
//
//
//             let nowFullPath = [...fullPath, key]
//             let handlerContext = {localData, localGate, state}
//             return state.gobCore.stimuliBus.receptor("get", nowFullPath, undefined, null, handlerContext)
//         },
//         "deleteProperty": function (target: any, key: any)
//         {
//
//             // 处理特殊属性 [Gob Core]
//             if (key == state.GOB_CORE_NAME)
//             {
//                 return true
//             }
//             console.log("called: " + key)
//             let nowFullPath = [...fullPath, key]
//             let handlerContext = {localData, localGate, state}
//             return state.gobCore.stimuliBus.receptor("delete", nowFullPath, null, null, handlerContext)
//
//         }
//     }
//
//
//     function $get(inPath: string[]|string, origin: object | string | null = null)
//     {
//         let path = normalizePath(inPath)
//         let nowFullPath = [...fullPath, ...path]
//         console.log("$get", nowFullPath)
//         return state.gobCore.stimuliBus.receptor("get", nowFullPath, undefined, origin)
//     }
//
//     function $set(inPath: string[]|string, value: any, origin: object | string | null = null)
//     {
//         let path = normalizePath(inPath)
//         let nowFullPath = [...fullPath, ...path]
//         console.log("$set", nowFullPath, value)
//         return state.gobCore.stimuliBus.receptor("set", nowFullPath, value, origin)
//     }
//
//     function $delete(inPath: string[]|string, origin: object | string | null = null)
//     {
//         let path = normalizePath(inPath)
//         let nowFullPath = [...fullPath, ...path]
//         console.log("$delete", nowFullPath)
//         return state.gobCore.stimuliBus.receptor("delete", nowFullPath, undefined, origin)
//     }
// }
//
//
// /**
//  * 规则化 path，让数组与字符串两种路径都可以用 ["a","b"], "a.b", "a\b\c", "a/b/c"
//  * @param {string[] | string} path
//  * @returns {string[]}
//  */
// function normalizePath(path: string[] | string): string[]
// {
//     if (typeof path === "string")
//     {
//         return path.split(/[\.\\/]/)
//     }
//     else
//     {
//         return path
//     }
// }
//
//
// export default giveEs5Handler


import {GobCore} from "@/Core/Core"
import {HandlerContext} from "@/Core/Handlers/Abstract.Handler"
import {GOB_CORE_NAME} from "@/Core/Core.consts"
import util from "@/Util/Util"


function giveDefine(gobCore: GobCore, parentData: any, parentGate: any, key: string, value: any, fullPath: string[])
{

    let handlerContext: HandlerContext = {
        localData: parentData,
        localGate: parentGate,
        state: {
            coreData: gobCore.data,
            coreGate: gobCore.gate,
            gobCore,
            GOB_CORE_NAME
        }
    }

    let descriptor = {
        enumerable: true,
        configurable: true,
        get()
        {
            // if (key == "$get") return $get
            // if (key == "$set") return $set
            // if (key == "$delete") return $delete
            // if (key == "$core") return gobCore

            return gobCore.stimuliBus.receptor({
                type: "get",
                path: fullPath,
                value: undefined,
                origin: null
            }, handlerContext)
        },


        set(newValue: any)
        {
            return gobCore.stimuliBus.receptor({
                type: "set",
                path: fullPath,
                value: newValue,
                origin: null
            }, handlerContext)
        }

    }

    Object.defineProperty(parentGate, key, descriptor)

    let parentPath: any
    if (!parentGate.$get)
    {
        if (!parentPath) parentPath = fullPath.slice(0, fullPath.length - 1)
        Object.defineProperty(parentGate, "$get", {
            enumerable: false,
            configurable: false,
            get()
            {
                return function $get(inPath: string[] | string, origin: object | string | null = null)
                {
                    let path = util.normalizePath(inPath)
                    let nowFullPath = [...parentPath, ...path]
                    console.log("es5 $get", nowFullPath)
                    let re = gobCore.stimuliBus.receptor({
                        type: "get",
                        path: nowFullPath,
                        value: undefined,
                        origin: origin
                    })
                    console.log("es5 $get", {nowFullPath}, {re})
                    return re

                }

            }

        })
    }

    if (!parentGate.$set)
    {
        if (!parentPath) parentPath = fullPath.slice(0, fullPath.length - 1)
        Object.defineProperty(parentGate, "$set", {
            enumerable: false,
            configurable: false,
            get()
            {
                return function $set(inPath: string[] | string, value: any, origin: object | string | null = null)
                {
                    let path = util.normalizePath(inPath)
                    let nowFullPath = [...parentPath, ...path]
                    console.log("es5 $set", nowFullPath, value)
                    return gobCore.stimuliBus.receptor({type: "set", path: nowFullPath, value: value, origin: origin})
                }
            }
        })
    }

    if (!parentGate.$delete)
    {
        if (!parentPath) parentPath = fullPath.slice(0, fullPath.length - 1)
        Object.defineProperty(parentGate, "$delete", {
            enumerable: false,
            configurable: false,
            get()
            {
                return function $delete(inPath: string[] | string, origin: object | string | null = null)
                {
                    let path = util.normalizePath(inPath)
                    let nowFullPath = [...parentPath, ...path]
                    let re = gobCore.stimuliBus.receptor({
                        type: "delete",
                        path: nowFullPath,
                        value: undefined,
                        origin: origin
                    })
                    console.log("es5 $delete", {nowFullPath}, {re})
                    return re
                }
            }
        })
    }

    if (!parentGate.$core)
    {

        Object.defineProperty(parentGate, "$core", {
            enumerable: false,
            configurable: false,
            get()
            {
                return gobCore
            }
        })
    }
}


export default giveDefine
