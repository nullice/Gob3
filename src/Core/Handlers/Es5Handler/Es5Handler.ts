import {Abstract_Handler} from "@/Core/Handlers/Abstract.Handler"
import {GobCore, GobProxy} from "@/Core/Core"
import del from "./sub/del"
import set from "./sub/set"
import get from "./sub/get"
import {GOB_CORE_NAME} from "@/Core/Core.consts"
import giveDefine from "./sub/giveDefine"


class Es5Handler extends Abstract_Handler
{
    public delete = del
    public get = get
    public set = set

    public createGobProxy(gobCore: GobCore, initData?: any): GobProxy
    {
        // 设置初始值
        if (initData)
        {
            for (var key in initData)
            {
                giveDefine(gobCore, gobCore.data, gobCore.gate, key, initData[key], [key])
                gobCore.gate[key] = initData[key]
            }
        }
        else
        {
            giveDefine(gobCore, gobCore.data, gobCore, "gate", {}, [])
        }
        return gobCore.gate

    }

}

export default Es5Handler
