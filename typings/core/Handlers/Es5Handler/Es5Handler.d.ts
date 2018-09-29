import { Abstract_Handler } from "@/Core/Handlers/Abstract.Handler";
import { GobCore, GobProxy } from "@/Core/Core";
import del from "./sub/del";
import set from "./sub/set";
import get from "./sub/get";
declare class Es5Handler extends Abstract_Handler {
    delete: typeof del;
    get: typeof get;
    set: typeof set;
    createGobProxy(gobCore: GobCore, initData?: any): GobProxy;
}
export default Es5Handler;
