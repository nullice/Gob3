import { GobState } from "./../../Abstract.Handler";
/**
 * 创建一个基于 path 的代理处理器
 * @param localData
 * @param {string[]} localpath
 * @param {string[]} fullPath
 * @param {{gobCore: GobCore; GOB_CORE_NAME: string}} state
 * @returns {{set: (target: any, key: any, value: any) => boolean; get: (target: any, property: any) => (any)}}
 */
declare function giveProxyHandler(localData: any, localGate: any, fullPath: string[], state: GobState): {
    "set": (target: any, key: any, value: any) => any;
    "get": (target: any, key: any) => any;
    "deleteProperty": (target: any, key: any) => any;
};
export default giveProxyHandler;