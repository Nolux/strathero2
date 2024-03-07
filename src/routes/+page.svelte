<script>
  import { tweened } from "svelte/motion";
  import { writable } from "svelte/store";

  import Ad from "../lib/Ad.svelte";

  export let data;

  let active = 0;

  const stratagems = writable(data.rounds[0]);

  const score = tweened(0);

  let gameOver = false;
  let gameStarted = false;
  let roundOver = false;

  let round = 0;
  let roundScore = {
    perfect: 0,
    timeBonus: 0,
    score: 0,
  };

  let startTime = new Date();
  let endTime = new Date();
  let timeBonus = new Date();

  let errorDone = false;
  let perfectInput = true;

  const errorCooloff = (timeout) => {
    errorDone = true;
    perfectInput = false;

    setTimeout(() => {
      errorDone = false;
    }, timeout);
  };

  const gameStart = () => {
    score.set(0);
    timeProcentage.set(100);

    gameOver = false;
    gameStarted = true;
    roundOver = false;
    errorDone = false;

    active = 0;
    round = 0;

    startRound(round);

    let interval = setInterval(() => {
      let now = new Date();
      if (endTime.getTime() - now.getTime() < 0 && roundOver == false) {
        gameOver = true;
      }

      if (!gameOver) {
        timeProcentage.set(
          ((endTime.getTime() - now.getTime()) / data.rounds[round].totalTime) *
            100
        );
      }
    }, 500);
  };

  const startRound = (roundNumber) => {
    startTime = new Date();
    endTime = new Date();

    endTime.setMilliseconds(
      startTime.getMilliseconds() + data.rounds[roundNumber].totalTime
    );

    stratagems.set(data.rounds[roundNumber].stratagems);
    roundOver = false;
    timeBonus = new Date();
    roundScore = {
      perfect: 0,
      timeBonus: 0,
      score: 0,
    };
  };

  const timeProcentage = tweened(100);

  const onKeyDown = (e) => {
    const cooloffTime = 1000;
    console.log(e);
    if (errorDone) {
      return;
    }
    if (roundOver) {
      startRound(round);
      return;
    }
    if (e.keyCode == 38 || e.keyCode == 87) {
      // UP
      if ($stratagems[0].keys[active] == "UP") {
        active = active + 1;
      } else {
        errorCooloff(cooloffTime);
      }
    }
    if (e.keyCode == 40 || e.keyCode == 83) {
      // DOWN
      if ($stratagems[0].keys[active] == "DOWN") {
        active = active + 1;
      } else {
        errorCooloff(cooloffTime);
      }
    }
    if (e.keyCode == 37 || e.keyCode == 65) {
      // LEFT
      if ($stratagems[0].keys[active] == "LEFT") {
        active = active + 1;
      } else {
        errorCooloff(cooloffTime);
      }
    }
    if (e.keyCode == 39 || e.keyCode == 68) {
      // RIGHT
      if ($stratagems[0].keys[active] == "RIGHT") {
        active = active + 1;
      } else {
        errorCooloff(cooloffTime);
      }
    }

    if ($stratagems[0].keys.length <= active) {
      if (!gameOver) {
        endTime.setMilliseconds(
          endTime.getMilliseconds() +
            Math.random() * ($stratagems[0].keys.length * 500)
        );
      }

      let addedScore = 0;

      if (perfectInput) {
        const perfectInputBonus = 50;
        addedScore = addedScore + perfectInputBonus;
        roundScore.perfect = roundScore.perfect + perfectInputBonus;
      }

      const bonusEndTime = new Date();
      console.log("points:", $stratagems[0].keys.length * 500);
      const timeElapsed = bonusEndTime.getTime() - timeBonus.getTime();
      console.log("time", timeElapsed);

      const bonusPoints = $stratagems[0].keys.length * 500;

      if (timeElapsed < bonusPoints) {
        const addedTimeBonus = bonusPoints - timeElapsed;
        addedScore = addedScore + addedTimeBonus;
        roundScore.timeBonus = roundScore.timeBonus + addedTimeBonus;
      }
      console.log(addedScore);

      if ($stratagems[1]) {
        addedScore = addedScore + $stratagems[0].keys.length * 10;
        roundScore.score = roundScore.score + $stratagems[0].keys.length * 10;
        active = 0;

        let shiftedList = $stratagems;
        shiftedList.shift();
        stratagems.set(shiftedList);
      } else {
        addedScore = addedScore + $stratagems[0].keys.length * 10;
        roundScore.score = roundScore.score + $stratagems[0].keys.length * 10;

        active = 0;

        round++;
        roundOver = true;
        stratagems.set(data.rounds[round].stratagems);
      }
      perfectInput = true;
      score.set($score + addedScore);
    }
  };
</script>

<div class="h-screen bg-black monda flex flex-col justify-center gap-10">
  <div class="h-1 bg-white w-full"></div>

  {#if gameStarted}
    {#if gameOver}
      <div
        class="flex flex-col justify-center items-center gap-10 h-1/2 text-white"
      >
        <div class="text-9xl">GAME OVER!</div>
        <div class="text-3xl">Score: {Math.round($score)}</div>
        <a href="/" data-sveltekit-reload>Restart</a>
      </div>
    {:else}
      <div class="flex justify-center items-center gap-10 h-1/2">
        <div class="text-white self-start">
          <div>ROUND</div>

          <div class="text-3xl textyellow">{round}</div>
        </div>
        <div class="h-full w-1/2 flex flex-col justify-center">
          {#if roundOver}
            <div
              class="flex flex-col justify-center items-center gap-10 h-1/2 text-white"
            >
              <div class="text-6xl text-white">ROUND OVER!</div>
              <div class="text-2xl text-white">Score: {Math.round($score)}</div>
              <div class="flex flex-col">
                <div>Perfect: {roundScore.perfect}</div>
                <div>Time Bonus: {roundScore.timeBonus}</div>
                <div>Score {roundScore.score}</div>
              </div>
              <button
                on:click={() => {
                  startRound(round);
                }}>Click here to start new round or press a key!</button
              >
            </div>
          {:else}
            <div class="flex justify-between gap-2 items-center h-1/3">
              {#each $stratagems as stratagem, i}
                {#if i < 6}
                  <img
                    src="stratagems/{stratagem.icon}"
                    class={i == 0
                      ? "border borderyellow h-full aspect-square"
                      : " h-1/3 aspect-square"}
                    alt=""
                  />
                {/if}
              {/each}
            </div>
            <div class="flex justify-around yellow text-center text-xl">
              {$stratagems[0].name}
            </div>
            <div class="flex justify-center gap-4 h-20">
              {#each $stratagems[0].keys as keys, i}
                <div
                  class="h-16 w-16 transition-all bg-white deactive {i == active
                    ? 'active'
                    : ''} {errorDone ? 'red' : ''} {i < active ? 'done' : ''}"
                  style="mask-image: url(arrows/{keys}.svg); mask-repeat: no-repeat; mask-size: cover; "
                ></div>
              {/each}
            </div>
            <div class="bg-gray-500 h-6">
              <div
                class="h-full yellow"
                style="width:{$timeProcentage > 100 ? 100 : $timeProcentage}%"
              ></div>
            </div>
          {/if}
        </div>
        <div class="text-white text-right self-start">
          <div class="text-3xl textyellow bold font-bold">
            {Math.round($score)}
          </div>
          <div>SCORE</div>
        </div>
      </div>
    {/if}
  {:else}
    <div
      class="flex flex-col justify-center items-center gap-10 h-1/2 text-white"
    >
      <div class="text-9xl textyellow">STRAT HERO 2</div>
      <button class="text-3xl" on:click={gameStart}>Press to start!</button>
      <Ad />
    </div>
  {/if}

  <div class="h-1 bg-white w-full"></div>
</div>

<svelte:window on:keydown|preventDefault={onKeyDown} />

<style>
  .active {
    opacity: 1 !important;
  }
  .done {
    opacity: 0.5 !important;
  }
  .deactive {
    opacity: 0.2;
  }
  .monda {
    font-family: "Monda Bold";
  }
  .red {
    background-color: #ff0000;
  }
  .yellow {
    background-color: #eaeea2;
  }
  .borderyellow {
    border-color: #eaeea2;
  }
  .textyellow {
    color: #eaeea2;
  }
</style>
