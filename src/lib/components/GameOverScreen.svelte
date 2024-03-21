<script>
  export let score;
  export let totalStratsDone;
  export let round;
  export let restartGame;

  let shareTitle = "SHARE";
</script>

<div class="flex flex-col justify-center items-center gap-10 h-1/2 text-white">
  <div class="text-6xl textyellow text-center z-20">GAME OVER!</div>
  <table class="w-1/2">
    <tr class="text-3xl"
      ><td><span class="textyellow">Round </span>: </td>
      <td class="text-right">{round + 1}</td></tr
    >
    <tr class="text-3xl"
      ><td><span class="textyellow">Total Stratagems done </span>: </td>
      <td class="text-right">{totalStratsDone}</td></tr
    >
    <tr class="text-5xl">
      <td><span class="textyellow">Total Score </span>: </td>
      <td class="text-right">{Math.round($score)}</td>
    </tr>
  </table>
  <button
    class="bgyellow text-black rounded p-2 transition-all"
    on:click={async () => {
      shareTitle = "COPIED!";
      await navigator.clipboard.writeText(
        `## My Strat Hero Score:\nScore: ${$score}\nRound: ${round + 1}\nTotal Stratagems done: ${totalStratsDone}\nFor DEMOCRACY!\nPlay StratHero 2 https://strathero2.vercel.app`
      );
      setTimeout(() => {
        shareTitle = "SHARE";
      }, 3000);
    }}>{shareTitle}</button
  >
  <button on:click={restartGame}
    >Click here to Restart new round or press a key</button
  >
</div>
