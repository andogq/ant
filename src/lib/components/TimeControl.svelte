<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { Footprints, Pause, Play, RotateCcw } from "lucide-svelte";

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
</script>

<div class="container">
    <label class="multiplier">
        <span>Multiplier</span>

        <input
            type="number"
            bind:value={multiplier}
            min={1}
            step={1}
            disabled={disable_controls}
        />
    </label>

    <button
        on:click={toggle_running}
        disabled={disable_controls}
        class="icon primary"
    >
        {#if running}
            <Pause />
        {:else}
            <Play />
        {/if}
    </button>

    <button
        on:click={tick}
        disabled={disable_controls || running}
        class="icon primary"
    >
        <Footprints />
    </button>

    <button on:click={reset} class="icon primary">
        <RotateCcw />
    </button>
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
</style>
