<script lang="ts">
    import Ant, { type RuleMap } from "$lib/components/Ant.svelte";
    import RuleController from "$lib/components/RuleController.svelte";

    let rules: RuleMap<boolean> = new Map([
        [true, { rotate: 90, color: false }],
        [false, { rotate: -90, color: true }],
    ]);

    let ant_controller: Ant;

    let multiplier = 1;
    let tick_count = 0;
    let valid_state = true;
    let running = false;

    function toggle_running() {
        running = !running;

        if (running) {
            animation_callback();
        }
    }

    function tick() {
        for (let i = 0; i < multiplier; i++) {
            if (!valid_state) break;

            tick_count += 1;
            valid_state = ant_controller.tick();
        }
    }

    function reset() {
        tick_count = 0;
        multiplier = 1;
        valid_state = true;
        running = false;

        ant_controller.reset();
    }

    function animation_callback() {
        tick();

        if (!valid_state) {
            running = false;
        } else if (running) {
            requestAnimationFrame(animation_callback);
        }
    }
</script>

<h1>Langton's Ant</h1>

<p>Tick count: <b>{tick_count}</b></p>

<div class="controller">
    <RuleController bind:rules />

    <label>
        Multiplier
        <input type="number" bind:value={multiplier} min={1} step={1} />
    </label>

    <button on:click={toggle_running}>
        {#if running}
            Pause
        {:else}
            Play
        {/if}
    </button>

    <button on:click={tick} disabled={!valid_state && running}>Tick</button>

    <button on:click={reset}>Reset</button>
</div>

<Ant bind:this={ant_controller} {rules} />

<style>
</style>
