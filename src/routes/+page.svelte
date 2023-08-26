<script lang="ts">
    import Ant from "$lib/components/Ant.svelte";
    import ConfigEditor from "$lib/components/ConfigEditor.svelte";
    import TimeControl from "$lib/components/TimeControl.svelte";

    let ant_controller: Ant;

    let multiplier = 1;
    let tick_count = 0;
    let valid_state = true;
    let running = false;

    $: if (running) {
        animation_callback();
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

<div class="container">
    <div class="header">
        <h1>Langton's Ant</h1>
        <p>Tick count: <b>{tick_count}</b></p>

        <ConfigEditor />

        <TimeControl
            bind:multiplier
            bind:running
            disable_controls={!valid_state}
            on:tick={tick}
            on:reset={reset}
        />
    </div>

    <div class="ant">
        <Ant bind:this={ant_controller} />
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

    .header {
        max-width: 750px;
        margin: 0 auto;

        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .ant {
        flex-grow: 1;
        flex-shrink: 1;
        flex-basis: 0;
        overflow: hidden;
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
</style>
