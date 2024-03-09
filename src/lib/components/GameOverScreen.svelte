<script>
  export let score;
</script>

<div class="flex flex-col justify-center items-center gap-10 h-1/2 text-white">
  <div class="text-9xl textyellow">GAME OVER!</div>
  <div class="text-3xl">Score: {Math.round($score)}</div>
  <a href="/" data-sveltekit-reload>Restart</a>
</div>

<style>
  .textyellow {
    color: #eaeea2;
  }
</style>
