<script lang="ts">
    import Ant from "$lib/components/Ant.svelte";
    import ConfigEditor from "$lib/components/ConfigEditor.svelte";
    import PaintControl from "$lib/components/PaintControl.svelte";
    import TimeControl from "$lib/components/TimeControl.svelte";

    let ant_controller: Ant;

    let multiplier = 1;
    let tick_count = 0;
    let valid_state = true;
    let running = false;
    let log: string | null = null;

    let cursor_color = 0;

    $: if (running) {
        log = null;
        animation_callback();
    }

    function tick() {
        for (let i = 0; i < multiplier; i++) {
            if (!valid_state || !running) {
                break;
            }

            tick_count += 1;
            valid_state = ant_controller.tick();
        }
    }

    function reset() {
        tick_count = 0;
        multiplier = 1;
        valid_state = true;
        running = false;
        log = null;

        ant_controller.reset();
    }

    function animation_callback() {
        tick();

        if (!valid_state) {
            log = "Ant reached end of world.";
            running = false;
        } else if (running) {
            requestAnimationFrame(animation_callback);
        }
    }
</script>

<div class="container">
    <div class="header">
        <h1>Langton's Ant</h1>

        <p class="blurb">
            Created by <a href="https://ando.gq/">Tom Anderson</a> for Computing
            Theory (S2 2023).
            <a href="https://github.com/andogq/ant">Source</a>.
        </p>

        <p>Tick count: <b>{tick_count}</b></p>

        <ConfigEditor />

        <TimeControl
            bind:multiplier
            bind:running
            disable_controls={!valid_state}
            on:tick={tick}
            on:reset={reset}
            on:randomise_grid={ant_controller.random_grid}
        />

        <PaintControl bind:value={cursor_color} />
    </div>

    <div class="ant">
        <Ant bind:this={ant_controller} {cursor_color} />

        {#if log}
            <p class="log">{log}</p>
        {/if}
    </div>
</div>

<style>
    :global(*) {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
            sans-serif;

        --primary: #aaaaee;
    }

    :global(html, body) {
        height: 100%;
    }

    .container {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .blurb {
        font-size: 0.8rem;
    }

    .header {
        width: 100%;
        max-width: 750px;
        margin: 0 auto;
        padding: 1rem;

        display: flex;
        flex-direction: column;
        gap: 1rem;

        overflow: hidden;
    }

    .ant {
        flex-grow: 1;
        flex-shrink: 1;
        flex-basis: 0;
        overflow: hidden;

        position: relative;
    }

    :global(button) {
        background: #eeeeee;
        color: var(--primary);
        font-weight: bold;

        border: none;
        border-radius: 5px;
        padding: 0.25rem 0.4rem;

        cursor: pointer;
    }

    :global(button.primary) {
        background: var(--primary);
        color: black;
    }

    :global(button.icon) {
        border-radius: 50%;

        padding: 0;

        display: flex;
        align-items: center;
        justify-content: center;
    }

    .log {
        position: absolute;
        bottom: 2rem;
        right: 2rem;
        max-width: 100%;

        border-radius: 2px;
        border: 2px solid #ff8888;
        background: #ffffffcc;

        pointer-events: none;

        padding: 0.25rem;

        font-family: 'Courier New', Courier, monospace;
        font-weight: bold;
    }
</style>
