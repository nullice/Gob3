"use strict";
// Created by nullice on 2018/04/17 - 14:39 
Object.defineProperty(exports, "__esModule", { value: true });
const giveProxyHandler_1 = require("./giveProxyHandler");
const StimuliBus_1 = require("./StimuliBus/StimuliBus");
const cloneDeep_1 = require("lodash/cloneDeep");
const GOB_CORE_NAME = "[Gob Core]";
/*
*    GobFactory(state) =>  gob instance = GobProxy: {GobCore + state }
* */
class GobCore {
    constructor(options = {}) {
        this.GobFactory = GobFactory;
        this.stimuliBus = new StimuliBus_1.default(this);
        this.isGob = 3;
        this.data = {};
        this.gate = {};
        this.options = Object.assign({}, GobCore.DEFAULT_OPTIONS, options);
    }
}
// 默认参数
GobCore.DEFAULT_OPTIONS = {
    syncLog: false,
    disableLog: false,
    logType: {
        set: true,
        get: false,
        delete: true
    },
    logSize: 2048,
};
exports.GobCore = GobCore;
let GobFactory = function (object, options) {
    // 创建一个 GobCore
    let gobCore = new GobCore(options);
    // 创建一个代理
    let proxy = new Proxy(gobCore.data, giveProxyHandler_1.default(gobCore.data, gobCore.gate, [], {
        coreData: gobCore.data,
        coreGate: gobCore.gate,
        gobCore,
        GOB_CORE_NAME
    }));
    // 设置初始值
    if (object) {
        for (var key in object) {
            proxy[key] = object[key];
        }
    }
    gobCore.proxy = proxy;
    return proxy;
};
// GobFactory 提供的默认设置
GobFactory.default = {
    options: {},
    cloneDeep: cloneDeep_1.default
};
// 注册一些方法和常量到 Gob
GobFactory.GOB_CORE_NAME = GOB_CORE_NAME;
/**
 * 检查一个 gob 实例的 Core
 * @param gob
 * @returns {any}
 */
GobFactory.inspect = function (gob) {
    let core = gob[GOB_CORE_NAME];
    if (core) {
        return gob[GOB_CORE_NAME];
    }
    else {
        throw Error("Gob.inspect: param is not Gob3 Instance. :" + gob);
    }
};
exports.default = GobFactory;
//# sourceMappingURL=Core.js.map
