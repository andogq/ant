import type { RotationChange } from "$lib/util/rotation";
import { writable } from "svelte/store";

export interface Move {
    rotate: RotationChange;
    color: number;
}

export interface Config {
    states: string[],
    rules: Move[]
}

export const templates: {[key: string]: () => Config } = {
    classic: () => ({
        states: ["#ffffff", "#000000"],
        rules: [
            { rotate: -90, color: 1 },
            { rotate: 90, color: 0 },
        ]
    }),
    gajardo: () => ({
        states: ["#ffffff", "#000000"],
        rules: [
            { rotate: 90, color: 1 },
            { rotate: -90, color: 0 },
        ]
    }),
    counter: () => ({
        states: ["#ffffff", "#000000"],
        rules: [
            { rotate: 90, color: 1 },
            { rotate: 0, color: 0 },
        ]
    })
}

export default writable<Config>(templates["classic"]());
