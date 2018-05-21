import {Type as rcType, Object as rcObject} from "richang.js/dist/RichangEs.js"
import  minimatch from "../../lib/minimatch.js"


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


const Util = {
    rcType: rcType,
    rcObject: rcObject,
    name: "util",
    isAsyncFunction,
    minimatch: minimatch
}


export default Util
