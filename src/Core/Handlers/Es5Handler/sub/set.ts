import util from "@/Util/Util"

const rcType = util.rcType
const rcObject = util.rcObject

import {GATE_PROXY_NAME, Gate} from "@/Core/Handlers/Abstract.Handler"
import {HandlerContext} from "./../../Abstract.Handler"
import giveDefine from "@/Core/Handlers/Es5Handler/sub/giveDefine"

/**
 * 收到 set 刺激后对 gob 实例进行的操作
 * @param {string[]} fullPath
 * @param value
 * @param {string} key
 * @param {HandlerContext} handlerContext handler
 */
function set(fullPath: string[], value: any, key: string, handlerContext: HandlerContext)
{

    let valueType = rcType.getType(value)
    console.log("[set]", "fullPath:", fullPath, {valueType, key, value})
    if (valueType === "object" || valueType === "array")
    {
        // 写入值到 data
        handlerContext.localData[key] = value
        creatGate(value, [key], fullPath, handlerContext)
        // 遍历值来创建 gate
        rcObject.pathEach(value, function (item: any, path: string[])
        {
            console.log("pathEach type:", typeof item, {item, path})
            if (shouldCreatGate(item))
            {
                creatGate(item, [key, ...path], [...fullPath, ...path], handlerContext)
            }
            else
            {
                // definde
                creatDefine(item, [key, ...path], [...fullPath, ...path], handlerContext)
            }
        }, creatCycleGate)
    }
    else
    {
        handlerContext.localData[key] = value
    }

    return true



}

/**
 * 为循环引用创建 Gate
 * @param {Object} object 循环引用对象
 * @param {string[]} path 发生循环引用的对象的 path
 * @param {string[]} cyclePath 循环引用目标的 path
 */
function creatCycleGate(object: Object, path: string[], cyclePath: string[])
{

}


/**
 * 在这个 Handler 的 localData 上根据 localPath 设置 Gate
 * @param {object} inData
 * @param {string[]} targetPath
 * @param {string[]} fullPath
 * @param handlerContext
 * @returns {Gate}
 */
function creatGate(inData: object, targetPath: string[], fullPath: string[], handlerContext: HandlerContext): any
{
    console.log("creatGate", {inData, targetPath, fullPath, handlerContext})
    const gobCore = handlerContext.state.gobCore
    let gate: Gate = {}
    Object.defineProperty(gate, GATE_PROXY_NAME, {
        enumerable: false,
        configurable: true,
        value: inData
    })

    let parentPath = targetPath.slice(0, targetPath.length - 1)
    let key = targetPath[targetPath.length - 1]

    let parent
    if (parentPath.length == 0)
    {
        parent = handlerContext.localGate
    }
    else
    {
        parent = rcObject.getObjectValueByNames(handlerContext.localGate, parentPath, null)
    }

    Object.defineProperty(parent, key, {
        enumerable: true,
        configurable: true,
        get()
        {
            console.log("vGate get")
            return gate
        },
        set(value)
        {
            console.log("vGate set", value,{handlerContext})

            if (shouldCreatGate(value))
            {

                handlerContext.localData[key] = value
                creatGate(value, targetPath, fullPath, handlerContext)
                rcObject.pathEach(value, function (item: any, path: string[])
                {
                    console.log("pathEach type:", typeof item, {item, path})
                    if (shouldCreatGate(item))
                    {
                        creatGate(item, [key, ...path], [...fullPath, ...path], handlerContext)
                    }
                    else
                    {
                        creatDefine(item, [key, ...path], [...fullPath, ...path], handlerContext)
                    }
                }, creatCycleGate)
            }
            else
            {
                gate = value
            }


            handlerContext.localData[key] = value
            return true
        }

    })
    return gate
}

function creatDefine(inData: object, targetPath: string[], fullPath: string[], handlerContext: HandlerContext): any
{

    const gobCore = handlerContext.state.gobCore
    let parentPath = targetPath.slice(0, targetPath.length - 1)
    let key = targetPath[targetPath.length - 1]
    console.log("creatDefine", {inData, targetPath, fullPath, handlerContext, key, parentPath})
    let parentGate = rcObject.getObjectValueByNames(handlerContext.localGate, parentPath, null)
    let parentData = rcObject.getObjectValueByNames(handlerContext.localData, parentPath, null)

    giveDefine(gobCore, parentData, parentGate, key, inData, fullPath)
}
function shouldCreatGate(value: any): Boolean
{
    if (typeof value === "object")
    {
        return true
    }
    return false
}

export default set
