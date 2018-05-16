import util from "@/Util/Util"
let rcType = util.rcType


import giveProxyHandler, {HandlerContext, Gate, GATE_PROXY_NAME} from "@/core/giveProxyHandler"


/**
 * 收到 delete 刺激后对 gob 实例进行的操作
 * @param {string[]} fullPath
 * @param value
 * @param {string} key
 * @param {HandlerContext} handlerContext handler
 */
function del(fullPath: string[], value: any, key: string, handlerContext: HandlerContext)
{
    let valueType = rcType.getType(value)
    console.log("[del]", "fullPath:", fullPath, { key})
    return delete handlerContext.loaclData[key]
}


export default del
