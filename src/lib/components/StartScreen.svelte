<script>
  import Ad from "$lib/Ad.svelte";

  export let gameStart;
</script>

<div class="flex flex-col justify-center items-center gap-10 h-1/2 text-white">
  <div class="text-9xl textyellow">STRAT HERO 2</div>
  <button class="text-3xl" on:click={gameStart}
    >Click here or press a key to start!</button
  >
  <Ad />
</div>

<style>
  .textyellow {
    color: #eaeea2;
  }
</style>
