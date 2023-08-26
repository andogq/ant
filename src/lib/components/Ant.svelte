<script lang="ts" context="module">
    export interface Move<Color> {
        rotate: 90 | -90;
        color: Color;
    }

    export type RuleMap<Color> = Map<Color, Move<Color>>;
    type MoveOf<R> = Move<ColorOf<R>>;
    type ColorOf<R> = R extends RuleMap<infer Color> ? Color : never;

    const rotations = ["U", "R", "D", "L"] as const;
    type Rotation = (typeof rotations)[number];

    interface Ant {
        x: number;
        y: number;
        rotation: Rotation;
    }
</script>

<script lang="ts">
    export let size = 100;
    export let rules: RuleMap<boolean>;

    let grid: ColorOf<typeof rules>[][];
    $: grid = new Array(size)
        .fill(undefined)
        .map(() => new Array(size).fill(false));

    // Ant controls
    let ant: Ant = {
        x: Math.floor(size / 2),
        y: Math.floor(size / 2),
        rotation: "L",
    };
    function coord_matches(ant: Ant, x: number, y: number): boolean {
        return ant.x === x && ant.y === y;
    }

    function apply_rotation(rotation: Rotation, change: 90 | -90): Rotation {
        let di;

        if (change === 90) {
            // Turning left
            di = -1;
        } else if (change === -90) {
            // Turning right
            di = 1;
        } else {
            console.error("Unknown change", change);
            return rotation;
        }

        // Rotate rotations with wrapping
        let current_index = rotations.indexOf(rotation);
        let index = (rotations.length + current_index + di) % rotations.length;

        return rotations[index];
    }

    export function tick() {
        let current_color = grid[ant.y][ant.x];
        let rule = rules.get(current_color) || null;

        if (rule) {
            // Change the current cell
            grid[ant.y][ant.x] = rule.color;

            // Rotate the ant
            ant.rotation = apply_rotation(ant.rotation, rule.rotate);

            // Move the ant
            let dy = 0;
            let dx = 0;

            if (ant.rotation === "U") {
                dy -= 1;
            } else if (ant.rotation === "D") {
                dy += 1;
            } else if (ant.rotation === "L") {
                dx -= 1;
            } else if (ant.rotation === "R") {
                dx += 1;
            }

            let new_x = ant.x + dx;
            let new_y = ant.y + dy;

            // Bounds checks
            if (new_x < 0 || new_y < 0 || new_x >= 100 || new_y >= 100) {
                console.error("Ant reached boundary");
            } else {
                ant.x = new_x;
                ant.y = new_y;
            }
        } else {
            console.error("No matching rule found for", current_color);
        }
    }

    /* Grid drag functions */
    let dragging: boolean | null = null;
    function start_drag(x: number, y: number) {
        dragging = !grid[y][x];
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
                class:filled={cell}
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

    .cell.filled {
        background: black;
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
