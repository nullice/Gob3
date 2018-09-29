import {GobCore} from "@/Core/Core"
import util from "@/Util/Util"
import {GobState, HandlerContext} from "./../../Abstract.Handler"



/**
 * 创建一个基于 path 的代理处理器
 * @param localData
 * @param {string[]} localpath
 * @param {string[]} fullPath
 * @param {{gobCore: GobCore; GOB_CORE_NAME: string}} state
 * @returns {{set: (target: any, key: any, value: any) => boolean; get: (target: any, property: any) => (any)}}
 */

function giveProxyHandler(localData: any, localGate: any, fullPath: string[], state: GobState)
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
            let handlerContext = {localData, localGate, state}
            return state.gobCore.stimuliBus.receptor({type: "set", path: nowFullPath, value: value, origin: null}, handlerContext)

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
            let handlerContext = {localData, localGate, state}

            return state.gobCore.stimuliBus.receptor({type: "get", path: nowFullPath, value: undefined, origin: null}, handlerContext)
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
            let handlerContext = {localData, localGate, state}

            return state.gobCore.stimuliBus.receptor( {type: "delete", path: nowFullPath, value: null, origin: null}, handlerContext)

        }
    }


    function $get(inPath: string[] | string, origin: object | string | null = null)
    {
        let path = util.normalizePath(inPath)
        let nowFullPath = [...fullPath, ...path]
        console.log("$get", nowFullPath)


        return state.gobCore.stimuliBus.receptor({type: "get", path: nowFullPath, value: undefined, origin: origin})
    }

    function $set(inPath: string[] | string, value: any, origin: object | string | null = null)
    {
        let path = util.normalizePath(inPath)
        let nowFullPath = [...fullPath, ...path]
        console.log("$set", nowFullPath, value)

        return state.gobCore.stimuliBus.receptor( {type: "set", path: nowFullPath, value: value, origin: origin})
    }

    function $delete(inPath: string[] | string, origin: object | string | null = null)
    {
        let path = util.normalizePath(inPath)
        let nowFullPath = [...fullPath, ...path]
        console.log("$delete", nowFullPath)
        return state.gobCore.stimuliBus.receptor({type: "delete", path: nowFullPath, value: undefined, origin: origin})
    }
}


export default giveProxyHandler
