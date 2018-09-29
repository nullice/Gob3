import util from "@/Util/Util"
let rcType = util.rcType

import {HandlerContext} from "./../../Abstract.Handler"

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
    return delete handlerContext.localData[key]
}


export default del
