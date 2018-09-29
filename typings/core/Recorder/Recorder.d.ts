import { GobCore } from "@/Core/Core";
import { Stimuli } from "@/Core/StimuliBus/StimuliBus";
/**
 * 刺激记录器
 */
declare class Recorder {
    private gobCore;
    constructor(gobCore: GobCore);
    logs: {
        changes: Stimuli[];
        visits: Stimuli[];
        indexes: any;
        latestPath: string[] | null;
        latestType: string | null;
    };
    /**
     * 记录一次 stimuli
     * @param stimuli
     */
    recOnce(stimuli: Stimuli): void;
    /**
     * 实际生成记录并放入 logs
     * @param stimuli
     * @param index
     * @param typeIndex
     * @private
     */
    private _recStimuli(stimuli, index, typeIndex);
    /**
     * 获取最后一次刺激的类型与路径
     * @returns {{type: string | null; path: string[] | null} | undefined}
     */
    getLatestStimuliInfo(): {
        type: string | null;
        path: string[] | null;
    } | undefined;
}
export default Recorder;
