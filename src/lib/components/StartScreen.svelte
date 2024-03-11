<script>
  import Ad from "$lib/Ad.svelte";

  export let gameStart;
</script>

<div class="flex flex-col justify-center items-center gap-10 h-1/2 text-white">
  <div class="md:text-9xl text-6xl textyellow text-center z-20">
    STRAT HERO 2
  </div>
  <div class="text-xs">USE ARROWS or WASD to input stratagems</div>
  <button class="text-xl" on:click={gameStart}
    >Click here or press a key to start!</button
  >
  <Ad />
</div>

<style>
  .textyellow {
    color: #eaeea2;
  }
</style>
