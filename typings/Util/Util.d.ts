import minimatch from "../../lib/minimatch.js";
declare const Util: {
    rcType: {
        getType: (value: any) => any;
    };
    rcObject: {
        isEmptyObject: (obj: any) => boolean;
        objectCopyToObject: (ob1: any, ob2: any, func_allowCopy: any, func_rename: any, func_valueFiter: any, func_for: any) => void;
        getObjectValueByNames: (object: any, names: any, aheadEndTime: any) => any;
        setObjectValueByNames: (object: any, names: any, value: any) => void;
        deleteObjectValueByNames: (object: any, names: any) => void;
        treeFind: (objectArr: any, match: any, childrenKey: any, findAll: any, depthFirst: any) => any;
        treeEach: (objectArr: any, eachFunc: any, childrenKey: any, depthFirst: any) => {
            struct: any[];
            deep: number;
            total: number;
        };
        pathEach: (object: any, eachFunc: any, checkCycle: any) => void;
    };
    name: string;
    isAsyncFunction: (func: Function) => boolean;
    minimatch: typeof minimatch;
    normalizePath: (path: string | string[]) => string[];
    cloneDeep: <T>(value: T) => T;
};
export default Util;
