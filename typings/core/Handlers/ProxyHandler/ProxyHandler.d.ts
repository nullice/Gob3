import { Abstract_Handler } from "@/Core/Handlers/Abstract.Handler.ts";
import get from "./sub/get";
import set from "./sub/set";
import del from "./sub/delete";
import { GobCore, GobProxy } from "@/Core/Core";
declare class ProxyHandler extends Abstract_Handler {
    createGobProxy(gobCore: GobCore, initData: any): GobProxy;
    get: typeof get;
    set: typeof set;
    delete: typeof del;
}
export default ProxyHandler;
