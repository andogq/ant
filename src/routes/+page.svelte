<script lang="ts">
    import Ant, { type RuleMap } from "$lib/components/Ant.svelte";

    const rules: RuleMap<boolean> = new Map([
        [true, { rotate: 90, color: false }],
        [false, { rotate: -90, color: true }],
    ]);

    let ant_controller: Ant;

    let tick_count = 0;
    let running = false;

    function toggle_running() {
        running = !running;

        if (running) {
            animation_callback();
        }
    }

    function tick() {
        tick_count += 1;
        ant_controller.tick();
    }

    function animation_callback() {
        tick();
        if (running) requestAnimationFrame(animation_callback);
    }
</script>

<h1>Langton's Ant</h1>

<p>Tick count: <b>{tick_count}</b></p>

<div class="controller">
    <button on:click={toggle_running}>
        {#if running}
            Pause
        {:else}
            Play
        {/if}
    </button>

    <button on:click={tick} disabled={running}>Tick</button>
</div>

<Ant bind:this={ant_controller} {rules} />

<style>

</style>
