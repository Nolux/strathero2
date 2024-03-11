<script>
  import Ad from "$lib/Ad.svelte";

  export let gameStart;
</script>

<div class="flex flex-col justify-center items-center gap-10 h-1/2 text-white">
  <div class="text-9xl textyellow text-center">STRAT HERO 2</div>
  <div class="text-xs">USE ARROWS or WASD to input stratagems</div>
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
