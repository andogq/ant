<script lang="ts">
    import config, { templates } from "$lib/stores/config";
    import { rotation_changes, } from "$lib/util/rotation";
    import { X } from "lucide-svelte";
    import StateList from "./StateList.svelte";

    function add_state() {
        $config.states.push(
            "#" +
                Math.floor(Math.random() * (0xffffff + 1))
                    .toString(16)
                    .padStart(6, "0")
        );
        $config.rules.push({
            rotate: rotation_changes[Math.floor(Math.random() * rotation_changes.length)],
            color: Math.floor(Math.random() * $config.states.length),
        });

        $config = $config;
    }

    function remove_state(state: number) {
        // Remove the state color and the rule
        $config.states.splice(state, 1);
        $config.rules.splice(state, 1);

        for (let rule of $config.rules) {
            if (rule.color === state) {
                // Don't use this state rule any more
                rule.color = 0;
            } else if (rule.color > state) {
                // Shift states along
                rule.color -= 1;
            }
        }

        $config = $config;
    }

    function update_config(name: string) {
        if (templates[name]) {
            $config = templates[name]();
        } else {
            console.error("Cannot find template with name", name);
        }
    }
</script>

<div class="container">
    <label>
        Template

        <select on:change={(e) => update_config(e.currentTarget.value)}>
            {#each Object.keys(templates) as template_name}
                <option value={template_name}>{template_name}</option>
            {/each}
        </select>
    </label>

    {#each $config.rules as move, state}
        <div class="rule">
            <button
                on:click={() => remove_state(state)}
                disabled={$config.rules.length === 1}
                class="icon"
            >
                <X size={16} />
            </button>

            <label>
                Current state:

                <input type="color" bind:value={$config.states[state]} />

                <div class="color_preview" style:--color={$config.states[state]} />
            </label>

            <p>Next state:</p>

            <StateList bind:value={move.color} />

            <p>Rotation:</p>
            <select bind:value={move.rotate}>
                {#each rotation_changes as rotation}
                    <option value={rotation}>{rotation}</option>
                {/each}
            </select>
        </div>
    {/each}

    <button on:click={add_state}>+ State</button>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        max-height: 250px;
        overflow: scroll;
    }

    .rule {
        display: flex;
        align-items: center;
        gap: 1rem;

        font-size: 0.8rem;
    }

    button.icon {
        height: 20px;
        width: 20px;

        background: #eeeeee;
        color: var(--primary);
    }

    label {
        font-size: 0.8rem;

        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.25rem;
    }

    input[type="color"] {
        border: none;
        opacity: 0;
        width: 0;
    }

    .color_preview {
        display: inline-block;

        background: var(--color);
        border: 1px solid black;
        border-radius: 50%;

        --size: 1lh;
        height: var(--size);
        width: var(--size);

        flex-shrink: 0;
    }
</style>
