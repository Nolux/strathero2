<script>
  export let link = "";
  export let title = "";
  export let callback = () => {};
  export let sizeXl = false;
</script>

{#if link}
  <a
    href={link}
    class={`${sizeXl ? "text-2xl" : ""} w-1/4 text-center bgyellow text-black rounded p-2 transition-all`}
    >{title}</a
  >
{:else}
  <button on:click={callback}>{title}</button>
{/if}
