import {Type as rcType, Object as rcObject} from "richang.js/dist/RichangEs.js"
import minimatch from "../../lib/minimatch.js"
import cloneDeep from "lodash/cloneDeep"

if (window)
{
    (<any>window).minimatch = minimatch
}

/**
 * 判断是否是异步函数
 * @param {Function} func
 * @returns {boolean}
 */
function isAsyncFunction(func: Function)
{
    var str = func.toString().trim()
    return !!(
        str.match(/^async /) ||
        str.match(/return _ref[^\.]*\.apply/)
    )
}


/**
 * 规则化 path，让数组与字符串两种路径都可以用 ["a","b"], "a.b", "a\b\c", "a/b/c"
 * @param {string[] | string} path
 * @returns {string[]}
 */
function normalizePath(path: string[] | string): string[]
{
    if (typeof path === "string")
    {
        return path.split(/[\.\\/]/)
    }
    else
    {
        return path
    }
}

const Util = {
    rcType: rcType,
    rcObject: rcObject,
    name: "util",
    isAsyncFunction,
    minimatch: minimatch,
    normalizePath: normalizePath,
    cloneDeep: cloneDeep
}


export default Util
