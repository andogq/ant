<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { Dices, Footprints, Pause, Play, RotateCcw } from "lucide-svelte";

    export let multiplier = 1;
    export let running = false;
    export let disable_controls: boolean;

    const dispatch = createEventDispatcher<{ tick: void; reset: void }>();

    function tick() {
        dispatch("tick");
    }

    function reset() {
        dispatch("reset");
    }

    function toggle_running() {
        running = !running;
    }

    function randomise_grid() {
        dispatch("randomise_grid");
    }
</script>

<div class="container">
    <label class="multiplier">
        <span>Speed Multiplier</span>

        <input
            type="number"
            bind:value={multiplier}
            min={1}
            step={1}
            disabled={disable_controls}
        />
    </label>

    <div class="labelled_button">
        <p>
            {#if running}
                Pause
            {:else}
                Play
            {/if}
        </p>

        <button
            on:click={toggle_running}
            disabled={disable_controls}
            title={running ? "Pause" : "Play"}
            class="icon primary"
        >
            {#if running}
                <Pause />
            {:else}
                <Play />
            {/if}
        </button>
    </div>

    <div class="labelled_button">
        <p>Step</p>

        <button
            on:click={tick}
            disabled={disable_controls || running}
            class="icon primary"
            title="Tick"
        >
            <Footprints />
        </button>
    </div>

    <div class="labelled_button">
        <p>Restart</p>

        <button on:click={reset} class="icon primary" title="Restart">
            <RotateCcw />
        </button>
    </div>

    <div class="labelled_button">
        <p>Randomise Grid</p>

        <button on:click={randomise_grid} class="icon primary" title="Randomise Grid">
            <Dices />
        </button>
    </div>
</div>

<style>
    .container {
        display: flex;
        flex-direction: row;

        align-items: center;
        gap: 1rem;
    }

    .multiplier {
        border: 2px solid #cccccc;
        border-radius: 5px;

        padding: 0.25rem;
    }

    .multiplier:focus-within {
        border-color: var(--primary);
    }

    .multiplier > * {
        display: block;
    }

    .multiplier > span {
        font-size: 0.8rem;
        font-weight: bold;
        color: #aaaaaa;
    }

    .multiplier > input {
        border: none;
        background: none;
        font-size: 1rem;

        width: 10ch;
        margin: 0.25rem 0.5rem 0;
    }
    .multiplier > input:focus {
        outline: none;
    }

    button {
        height: 40px;
        width: 40px;
    }

    .labelled_button {
        display: flex;
        flex-direction: column;

        align-items: center;

        gap: 0.25rem;
    }

    .labelled_button > p {
        font-size: 0.8rem;
        font-weight: bold;
        color: #aaaaaa;
        cursor: default;
        user-select: none;
    }
</style>
