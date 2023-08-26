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

        <div class="controller">
            <ConfigEditor />

            <TimeControl
                bind:multiplier
                bind:running
                disable_controls={!valid_state}

                on:tick={tick}
                on:reset={reset}
            />
        </div>
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
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        
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
    }

    .ant {
        flex-grow: 1;
        flex-shrink: 1;
        flex-basis: 0;
        overflow: hidden;
    }
</style>
