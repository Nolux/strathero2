<script>
  import Border from "./Border.svelte";

  export let score;
  export let roundScore;
  export let round;
  export let startRound;
</script>

<div class="flex flex-col justify-center items-center gap-10 text-white">
  <div class="text-6xl textyellow text-center z-20">ROUND OVER!</div>

  <table class="w-full">
    <tr
      ><td>Perfect:</td>
      <td class="text-right">{roundScore.perfect}</td></tr
    >
    <tr
      ><td>Time Bonus: </td>
      <td class="text-right">{roundScore.timeBonus}</td></tr
    >
    <tr
      ><td>Strat score: </td>
      <td class="text-right">{roundScore.score}</td></tr
    >
    <tr class="h-0.5 bg-white"
      ><td></td>
      <td></td></tr
    >
    <tr class="text-3xl text-white"
      ><td><span class="textyellow">SCORE</span>: </td>
      <td class="text-right">{Math.round($score)}</td></tr
    >
  </table>
  <button
    on:click={() => {
      startRound(round);
    }}>Click here to start new round or press a key!</button
  >
</div>

<style>
  .textyellow {
    color: #eaeea2;
  }
</style>
