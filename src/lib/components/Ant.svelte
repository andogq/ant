<script lang="ts">
    import config from "$lib/stores/config";
    import type { Rotation } from "$lib/util/rotation";
    import { apply_rotation } from "$lib/util/rotation";

    interface Ant {
        x: number;
        y: number;
        rotation: Rotation;
    }

    export let size = 100;


    let grid: number[][];
    $: generate_grid(size);

    // Ant controls
    let ant: Ant = {
        x: Math.floor(size / 2),
        y: Math.floor(size / 2),
        rotation: "L",
    };

    let known_states = 0;
    config.subscribe((config) => {
        // Trigger a reset if change is detected in the states or rules
        if (known_states !== config.states.length) {
            known_states = config.states.length;
            reset();
        }
    });

    function coord_matches(ant: Ant, x: number, y: number): boolean {
        return ant.x === x && ant.y === y;
    }

    function generate_grid(size: number) {
        grid = new Array(size)
            .fill(undefined)
            .map(() => new Array(size).fill(0));
    }

    export function reset() {
        generate_grid(size);
        ant = {
            x: Math.floor(size / 2),
            y: Math.floor(size / 2),
            rotation: "L",
        };
    }

    export function tick(): boolean {
        let current_color = grid[ant.y][ant.x];
        let rule = $config.rules[current_color] || null;

        if (rule) {
            // Rotate the ant
            let next_rotation = apply_rotation(ant.rotation, rule.rotate);

            // Move the ant
            let dy = 0;
            let dx = 0;

            if (next_rotation === "U") {
                dy -= 1;
            } else if (next_rotation === "D") {
                dy += 1;
            } else if (next_rotation === "L") {
                dx -= 1;
            } else if (next_rotation === "R") {
                dx += 1;
            }

            let new_x = ant.x + dx;
            let new_y = ant.y + dy;

            // Bounds checks
            if (new_x < 0 || new_y < 0 || new_x >= 100 || new_y >= 100) {
                console.error("Ant reached boundary");
                return false;
            } else {
                // Change the current cell
                grid[ant.y][ant.x] = rule.color;

                ant.x = new_x;
                ant.y = new_y;
                ant.rotation = next_rotation;

                return true;
            }
        } else {
            console.error("No matching rule found for", current_color);
            return false;
        }
    }

    /* Grid drag functions */
    let dragging: number | null = null;
    function start_drag(x: number, y: number) {
        // TODO: Temporary
        dragging = 0;
        grid[y][x] = dragging;
    }

    function end_drag() {
        dragging = null;
    }

    function drag_toggle(x: number, y: number) {
        if (dragging !== null) {
            grid[y][x] = dragging;
        }
    }
</script>

{#each grid as row, y}
    <div class="row">
        {#each row as cell, x}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-mouse-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div
                class="cell"
                class:ant={coord_matches(ant, x, y)}
                style:--background={$config.states[cell]}
                on:mousedown={() => start_drag(x, y)}
                on:mouseup={() => end_drag()}
                on:mouseover={() => drag_toggle(x, y)}
            />
        {/each}
    </div>
{/each}

<style>
    .row {
        --size: 12px;

        margin: 0;
        padding: 0;

        height: var(--size);
    }

    .cell {
        height: var(--size);
        width: var(--size);

        display: inline-block;
        position: relative;

        background: var(--background);
    }

    .cell:hover {
        cursor: pointer;
    }

    .cell:hover::after {
        content: "";
        position: absolute;

        top: 0;
        left: 0;
        right: 0;
        bottom: 0;

        background: #00000055;
    }

    .cell.ant::after {
        content: "";
        position: absolute;

        --inset: 15%;
        top: var(--inset);
        left: var(--inset);
        right: var(--inset);
        bottom: var(--inset);

        background: red;
        border-radius: 50%;
    }
</style>
