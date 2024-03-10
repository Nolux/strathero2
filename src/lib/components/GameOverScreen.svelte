<script>
  export let score;
  export let restartGame;
</script>

<div class="flex flex-col justify-center items-center gap-10 h-1/2 text-white">
  <div class="text-9xl textyellow">GAME OVER!</div>
  <div class="text-3xl">Score: {Math.round($score)}</div>
  <button on:click={restartGame}
    >Click here to Restart new round or press a key</button
  >
</div>

<style>
  .textyellow {
    color: #eaeea2;
  }
</style>
