<script>
  export let data;

  console.log(data);
  let active = 0;

  const onKeyDown = (e) => {
    console.log(e);
    if (e.keyCode == 38) {
      // UP
      active = active + 1;
    }
    if (e.keyCode == 40) {
      // DOWN
      active = active + 1;
    }
    if (e.keyCode == 37) {
      // LEFT
      active = active + 1;
    }
    if (e.keyCode == 39) {
      // RIGHT
      active = active + 1;
    }

    console.log(active);
  };
</script>

{#each data.stratagems as stratagem}
  <div>
    <h1>{stratagem.name}</h1>
    <img src="stratagems/{stratagem.icon}" alt="" />
    <div>
      {#each stratagem.keys as keys, i}
        <img
          src="arrows/{keys}.webp"
          alt=""
          class={i == active ? "active" : "deactive"}
        />
      {/each}
    </div>
  </div>
{/each}

<svelte:window on:keydown|preventDefault={onKeyDown} />

<style>
  .active {
    opacity: 1;
  }
  .deactive {
    opacity: 0.2;
  }
</style>
