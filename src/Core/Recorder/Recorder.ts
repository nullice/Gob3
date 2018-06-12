import {GobCore} from "@/Core/Core"
import util from "@/Util/Util"
import {Stimuli} from "@/Core/StimuliBus/StimuliBus"


/**
 * 刺激记录器
 */
class Recorder
{
    private gobCore: GobCore

    constructor(gobCore: GobCore)
    {
        this.gobCore = gobCore
    }

    public logs = {
        changes: <Stimuli[]> [],    // 存放改变值的刺激记录
        visits: <Stimuli[]> [],     // 存放不改变值的刺激记录
        indexes: <any> {      // 记录各种刺激的次数
            set: <number> 0,
            get: <number> 0,
            delete: <number> 0,
            all: <number> 0,
        },
        latestPath: <string[] | null> null, // 最后一次 Stimuli 用到的路径
        latestType: <string | null> null, // 最后一次 Stimuli 类型
    }

    /**
     * 记录一次 stimuli
     * @param stimuli
     */
    public recOnce(stimuli: Stimuli)
    {
        // 如果禁用记录，则立即返回
        if (this.gobCore.options.disableLog === true)
        {
            return
        }
        if (this.gobCore.options.logType)
        {
            if (this.gobCore.options.logType[stimuli.type] === false)
            {
                return
            }
        }

        // 基本记录
        this.logs.latestPath = util.normalizePath(stimuli.path)
        this.logs.latestType = stimuli.type
        let index = this.logs.indexes.all++
        let typeIndex = this.logs.indexes[stimuli.type]++


        // 详细记录
        if (this.gobCore.options.syncLog === true)
        {
            // 同步记录
            this._recStimuli(stimuli, index, typeIndex)
        }
        else
        {
            // 异步记录
            setTimeout(() =>
            {
                this._recStimuli(stimuli, index, typeIndex)
            }, 0)
        }
    }


    /**
     * 实际生成记录并放入 logs
     * @param stimuli
     * @param index
     * @param typeIndex
     * @private
     */
    private _recStimuli(stimuli: Stimuli, index: number, typeIndex: number)
    {
        let logStimuli: Stimuli = {
            type: stimuli.type,
            path: util.normalizePath(stimuli.path),
            value: util.cloneDeep(stimuli.value),
            origin: util.cloneDeep(stimuli.origin),
            info: {
                index: index,
                typeIndex: typeIndex,
            }
        }

        // 判断保存的类型
        if (stimuli.type === "set" || stimuli.type === "delete")
        {
            this.logs.changes.push(logStimuli)
        }
        else
        {
            this.logs.visits.push(logStimuli)
        }
    }


    /**
     * 获取最后一次刺激的类型与路径
     * @returns {{type: string | null; path: string[] | null} | undefined}
     */
    public getLatestStimuliInfo(): { type: string | null, path: string[] | null } | undefined
    {
        if (this.logs.latestType)
        {
            return {
                type: this.logs.latestType,
                path: this.logs.latestPath
            }
        }
    }

}

export default Recorder
