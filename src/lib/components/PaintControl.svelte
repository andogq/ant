<script lang="ts">
    import StateList from "./StateList.svelte";

    export let value: number;
</script>


<div>
    <p>Paint color:</p>
    <StateList bind:value />
</div>

<style>
    p {
        font-size: 0.8rem;
    }
</style>
