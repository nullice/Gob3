import {Abstract_Handler} from "@/Core/Handlers/Abstract.Handler.ts"
import giveProxyHandler from "./sub/giveProxyHandler"
import get from "./sub/get"
import set from "./sub/set"
import del from "./sub/delete"
import {GobCore, GobProxy} from "@/Core/Core"
import {GOB_CORE_NAME} from "@/Core/Core.consts"


class ProxyHandler extends Abstract_Handler
{
    public createGobProxy(gobCore: GobCore, initData: any)
    {
        // 创建代理
        let proxy: GobProxy = new Proxy(gobCore.data,
            giveProxyHandler(gobCore.data, gobCore.gate, [], {
                coreData: gobCore.data,
                coreGate: gobCore.gate,
                gobCore,
                GOB_CORE_NAME
            })
        )

        // 设置初始值
        if (initData)
        {
            for (var key in initData)
            {
                proxy[key] = initData[key]
            }
        }
        return proxy
    }

    public get = get
    public set = set
    public delete = del
}

export default ProxyHandler
