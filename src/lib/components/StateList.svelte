<script lang="ts">
    import config from "$lib/stores/config";

    export let value: number;
</script>

<div class="container">
    {#each $config.states as color, i}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <button
            class="color_preview"
            class:selected={value === i}
            style:--color={color}
            on:click={() => (value = i)}
        />
    {/each}
</div>

<style>
    .container {
        display: flex;
        --size: 16px;
        height: var(--size);
    }

    .container > *:not(:last-child) {
        margin-right: 0.5rem;
    }

    .color_preview {
        display: inline-block;

        background: var(--color);
        border: 1px solid black;
        border-radius: 50%;

        height: var(--size);
        width: var(--size);

        flex-shrink: 0;
    }

    .color_preview.selected {
        outline: 2px solid var(--primary);
    }
    *:has(.color_preview.selected) > .color_preview:not(.selected) {
        opacity: 0.25;
    }
</style>
