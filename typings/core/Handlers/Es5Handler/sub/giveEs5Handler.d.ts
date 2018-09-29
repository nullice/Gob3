import { GobCore } from "@/Core/Core";
export interface HandlerContext {
    localData: any;
    localGate: any;
}
declare function giveDefine(gobCore: GobCore, parentObject: object, key: string, value: any, fullPath: string[]): void;
export default giveDefine;
