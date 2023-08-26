<script lang="ts">
    import type { RuleMap } from "./Ant.svelte";

    export let rules: RuleMap<boolean>;
</script>

<div class="container">
    {#each rules as [state, move]}
        <div class="rule">
            <p>Current state:</p>
            <div class="cell" class:filled={state} />

            <p>Next state:</p>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div
                class="cell"
                class:filled={move.color}
                on:click={() => (move.color = !move.color)}
            />

            <p>Rotation:</p>
            <select bind:value={move.rotate}>
                <option value={90}>90</option>
                <option value={0}>0</option>
                <option value={-90}>-90</option>
            </select>
        </div>
    {/each}
</div>

<style>
    .rule {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .cell {
        --size: 12px;
        height: var(--size);
        width: var(--size);

        display: inline-block;

        position: relative;

        border: 1px solid black;
    }

    .cell.filled {
        background: black;
    }
</style>
