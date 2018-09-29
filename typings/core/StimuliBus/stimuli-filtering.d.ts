/**
 *
 */
import { Stimuli } from "@/Core/StimuliBus/StimuliBus";
import { Filter } from "@/Core/FilterManager/FilterManager";
declare const _default: {
    async: (stimuli: Stimuli, filters: Filter[]) => void;
    sync: (stimuli: Stimuli, filters: Filter[]) => void;
};
export default _default;
