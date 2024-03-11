<script>
  export let score;
  export let round;
  export let restartGame;
</script>

<div class="flex flex-col justify-center items-center gap-10 h-1/2 text-white">
  <div class="text-9xl textyellow text-center">GAME OVER!</div>
  <table class="w-1/2">
    <tr class="text-3xl">
      <td><span class="textyellow">Score </span>:</td>
      <td class="text-right">{Math.round($score)}</td>
    </tr>
    <tr class="text-3xl"
      ><td><span class="textyellow">Round </span>: </td>
      <td class="text-right">{round + 1}</td></tr
    >
  </table>
  <button on:click={restartGame}
    >Click here to Restart new round or press a key</button
  >
</div>

<style>
  .textyellow {
    color: #eaeea2;
  }
</style>
