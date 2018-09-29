export declare enum FilterType {
    pre = "pre",
    fin = "fin",
}
export interface Filter {
    path: string[] | string | RegExp;
    type: FilterType;
    name: string;
    func: Function;
    isAsync: Boolean;
    level: number;
    disable?: Boolean;
}
export interface FilterManagerOptions {
    /**
     * 路径分隔符
     */
    pathSeparator?: string;
}
declare class FilterManager {
    filters: {
        pre: object;
        fin: object;
        get: object;
    };
    globFilters: Filter[];
    options: FilterManagerOptions;
    static DEFAULT_OPTIONS: {
        pathSeparator: string;
    };
    constructor(options?: FilterManagerOptions);
    /**
     * 添加一个过滤器
     * @param {Filter} filter
     */
    addFilter(filter: Filter): Filter;
    /**
     * 根据 path 和过滤器 Type 获取一个过滤器列表
     * @param path
     * @param type
     * @return {any}
     */
    getFilters(path: string[], type: FilterType): any[];
    /**
     * 移除一个过滤器
     * @param {Filter} filter
     * @returns {any}
     */
    removeFilter(filter: Filter): true | undefined;
    /**
     * 新建一个过滤器
     * @param {string[]} path
     * @param {FilterType} type
     * @param {Function} func
     * @param {string} name
     * @param {number} level
     */
    newFilter(path: string[] | RegExp | string, type: FilterType, func: Function, name?: string, level?: number, isAsync?: Boolean): {
        path: string | RegExp | string[];
        type: FilterType;
        name: string;
        func: Function;
        isAsync: Boolean | undefined;
        level: number;
        disable: boolean;
    };
}
export default FilterManager;
