<script lang="ts">
    import config from "$lib/stores/config";
    import type { Rotation } from "$lib/util/rotation";
    import { apply_rotation } from "$lib/util/rotation";

    interface Ant {
        x: number;
        y: number;
        rotation: Rotation;
    }

    export let cursor_color: number;

    let cell_size = 16;

    let container_height: number = 1;
    let container_width: number = 1;

    let grid_width: number, grid_height: number;
    $: grid_height = Math.floor(container_height / cell_size);
    $: grid_width = Math.floor(container_width / cell_size);

    // Ant controls
    let ant: Ant;
    let grid: number[][];
    $: {
        generate_grid(grid_height, grid_width);
        reset();
    }

    export function reset() {
        generate_grid(grid_height, grid_width);
        ant = {
            x: Math.floor(grid_width / 2),
            y: Math.floor(grid_height / 2),
            rotation: "L",
        };
    }

    export function random_grid() {
        generate_grid(grid_height, grid_width, true);
    }

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

    function generate_grid(height: number, width: number, random = false) {
        grid = new Array(height).fill(undefined).map(() =>
            new Array(width).fill(0).map(() => {
                if (random) {
                    return Math.floor(Math.random() * $config.states.length);
                } else {
                    return 0;
                }
            })
        );
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

            // Change the current cell
            grid[ant.y][ant.x] = rule.color;

            ant.x = (grid_width + new_x) % grid_width;
            ant.y = (grid_height + new_y) % grid_height;
            ant.rotation = next_rotation;

            return true;
        } else {
            console.error("No matching rule found for", current_color);
            return false;
        }
    }

    /* Grid drag functions */
    let dragging = false;
    function start_drag(x: number, y: number) {
        dragging = true;
        grid[y][x] = cursor_color;
    }

    function end_drag() {
        dragging = false;
    }

    function drag_toggle(x: number, y: number) {
        if (dragging) {
            grid[y][x] = cursor_color;
        }
    }
</script>

<div
    class="container"
    bind:clientHeight={container_height}
    bind:clientWidth={container_width}
    style:--cell_size={cell_size + "px"}
    style:padding-left={(container_width - cell_size * grid_width) / 2 + "px"}
    style:padding-top={(container_height - cell_size * grid_height) / 2 + "px"}
>
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
</div>

<style>
    .container {
        box-sizing: border-box;
        border: 1px solid black;
        margin: 1rem;

        height: calc(100% - 2rem);
    }

    .row {
        height: var(--cell_size);
    }

    .cell {
        height: var(--cell_size);
        width: var(--cell_size);

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
