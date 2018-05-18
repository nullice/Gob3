import util from "@/Util/Util"


export enum FilterType
{
    pre = "pre",
    fin = "fin",
}

export interface Filter
{
    path: string[] | string | RegExp,
    type: FilterType,
    name: string,
    func: Function,
    isAsync: Boolean,
    level: number,
    disable?: Boolean,
}


export interface FilterManagerOptions
{
    /**
     * 路径分隔符
     */
    pathSeparator?: string
}


class FilterManager
{
    public filters: {
        pre: object,
        fin: object,
        get: object,
    }
    public globFilters: Filter[]
    public options: FilterManagerOptions

    static DEFAULT_OPTIONS = {
        pathSeparator: "."
    }

    constructor(options: FilterManagerOptions)
    {
        this.filters = {
            pre: {},
            fin: {},
            get: {}
        }
        this.globFilters = []
        this.options = Object.assign({}, FilterManager.DEFAULT_OPTIONS, options)
    }

    /**
     * 添加一个过滤器
     * @param {Filter} filter
     */
    addFilter(filter: Filter)
    {

        if (Array.isArray(filter.path))
        {
            const NODE_KEY = "[GOB:FILTERS NODE]"
            let filtersSub = this.filters[filter.type]
            let node = util.rcObject.getObjectValueByNames(filtersSub, [...filter.path, NODE_KEY], undefined)
            if (node === undefined)
            {
                util.rcObject.setObjectValueByNames(filtersSub, [...filter.path, NODE_KEY], [filter])
            }
            else
            {
                if (node.push)
                {
                    node.push(filter)
                }
                else
                {
                    throw Error("[Gob] FilterManager.addFilter() filters Node not found. path:" + JSON.stringify(filter.path))
                }
            }

            return filter
        }
        else
        {
            this.globFilters.push(filter)
            return filter
        }


    }


    /**
     * 根据 path 和过滤器 Type 获取一个过滤器列表
     * @param path
     * @param type
     * @return {any}
     */
    getFilters(path: string[], type: FilterType)
    {
        const NODE_KEY = "[GOB:FILTERS NODE]"
        let filtersSub = this.filters[type]
        let node = util.rcObject.getObjectValueByNames(filtersSub, [...path, NODE_KEY], undefined)

        let globResult = this.globFilters.filter((filter) =>
        {
            if (filter.path instanceof RegExp)
            {
                return filter.path.test(path.join(this.options.pathSeparator))
            }
            else
            {
                return util.minimatch(path.join(this.options.pathSeparator), <string>filter.path)
            }

        })

        if (node == undefined) node = []
        if (globResult == undefined) globResult = []
        return [...node, ...globResult]
    }


    /**
     * 移除一个过滤器
     * @param {Filter} filter
     * @returns {any}
     */
    removeFilter(filter: Filter)
    {
        let node = null
        if (Array.isArray(filter.path))
        {
            const NODE_KEY = "[GOB:FILTERS NODE]"
            let filtersSub = this.filters[filter.type]
            node = util.rcObject.getObjectValueByNames(filtersSub, [...filter.path, NODE_KEY], undefined)
        }
        else
        {
            node = this.globFilters
        }

        if (node)
        {
            for (var i = 0; i < node.length; i++)
            {
                if (node[i] === filter)
                {
                    node.splice(i, 1)
                    return true
                }
            }
        }
    }

    /**
     * 新建一个过滤器
     * @param {string[]} path
     * @param {FilterType} type
     * @param {Function} func
     * @param {string} name
     * @param {number} level
     */
    newFilter(path: string[] | RegExp | string, type: FilterType, func: Function, name: string = "", level: number = 5, isAsync?: Boolean)
    {

        if (typeof  func !== "function")
        {
            throw Error("[Gob] FilterManager.newFilter(), func is not a functin. func is " + typeof  func)
        }path instanceof String
        if (!Array.isArray(path) && !(path instanceof RegExp) && !(typeof path === "string"))
        {
            throw Error("[Gob] FilterManager.newFilter(), path is not a Array|String|RegExp. path is " + typeof  path)
        }
        if (!this.filters[type])
        {
            throw Error(`[Gob] FilterManager.newFilter(), type is not a FilterType: "fin", "pre", "get". type is ` + type)
        }

        var filter = {
            path: path,
            type: type,
            name: name,
            func: func,
            isAsync: isAsync,
            level: level,
            disable: false
        }

        // 如果没有显式指定过滤器是否是异步,则自动判断
        if (isAsync == undefined)
        {
            filter.isAsync = util.isAsyncFunction(func)
        }

        return filter
    }
}


export default FilterManager
