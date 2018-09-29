import {GATE_PROXY_NAME} from "@/Core/Handlers/Abstract.Handler"
import {HandlerContext} from "@/Core/Handlers/Abstract.Handler"
import util from "@/Util/Util"

const rcType = util.rcType

function get(fullPath: string[], key: string, handlerContext: HandlerContext)
{
    // 获取原始值
    // let value = rcObject.getObjectValueByNames(localData, [key], null)
    let value = handlerContext.localData[key]
    console.log("[Es5Handler get]", fullPath, {localData: handlerContext.localData, key})

    // 根据值属性处理读出值
    let valueType = rcType.getType(value)
    console.log("  [Es5Handler get value]", value, valueType)

    console.log("  Es5Handler return value", value)
    return value
}

export default get
