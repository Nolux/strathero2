<script>
  import { tweened } from "svelte/motion";
  import { writable } from "svelte/store";

  import { audioMuted } from "$lib/stores/AudioStore.js";
  import { touchEnabled } from "$lib/stores/TouchStore.js";
  import {} from "$lib/stores/GameStore.js";

  import AudioIndicator from "$lib/components/AudioIndicator.svelte";

  import GameOverScreen from "$lib/components/GameOverScreen.svelte";
  import RoundOverScreen from "$lib/components/RoundOverScreen.svelte";
  import ScoreIndicator from "$lib/components/ScoreIndicator.svelte";
  import RoundIndicator from "$lib/components/RoundIndicator.svelte";
  import ArrowInput from "$lib/components/ArrowInput.svelte";
  import TouchIndicator from "$lib/components/TouchIndicator.svelte";
  import Holder from "../../lib/components/Holder.svelte";
  import Title from "../../lib/components/Title.svelte";

  export let data;

  let innerHeight;
  let innerWidth;

  let active = 0;

  const stratagems = writable(data.rounds[0]);

  const score = tweened(0);

  let gameOver = false;
  let gameStarted = false;
  let roundOver = false;
  let restartEnabled = false;

  let countDown = 3;

  let countDownInterval = setInterval(() => {
    if (countDown == 0) {
      clearInterval(countDownInterval);
      gameStart();
    } else {
      countDown--;
    }
  }, 1000);

  let round = 0;
  let roundScore = {
    perfect: 0,
    timeBonus: 0,
    score: 0,
  };
  let totalStratsDone = 0;

  let startTime = new Date();
  let endTime = new Date();
  let timeBonus = new Date();

  let errorDone = false;
  let perfectInput = true;

  const audioFiles = {
    win: null,
    loose: null,
    click: null,
    error: null,
    success: null,
  };

  const errorCooloff = (timeout) => {
    if (!audioMuted) {
      audioFiles.error.play();
    }
    errorDone = true;
    perfectInput = false;
    active = 0;

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
    restartEnabled = false;

    active = 0;
    round = 0;
    totalStratsDone = 0;

    startRound(round);

    let interval = setInterval(async () => {
      let now = new Date();
      if (
        endTime.getTime() - now.getTime() < 0 &&
        roundOver == false &&
        gameOver == false
      ) {
        gameOver = true;
        await getNewRounds();
        restartEnabled = true;

        if (!$audioMuted) {
          audioFiles.loose.play();
        }
      }

      if (!gameOver && !roundOver) {
        timeProcentage.set(
          ((endTime.getTime() - now.getTime()) / data.rounds[round].totalTime) *
            100
        );
      }
    }, 250);
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
  const getNewRounds = async () => {
    const res = await fetch("api/getRounds");
    const newData = await res.json();
    data.rounds = newData.rounds;
    stratagems.set(data.rounds[0].stratagems);
  };

  const restartGame = async () => {
    gameStart();
  };

  const timeProcentage = tweened(100);

  const onKeyDown = (e) => {
    console.log(e);
    const cooloffTime = 1000;

    if (gameStarted == false) {
      gameStart();
      return;
    }

    if (restartEnabled == true) {
      gameStart();
      return;
    }
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
    if (!$audioMuted) {
      audioFiles.click.play();
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
      const timeElapsed = bonusEndTime.getTime() - timeBonus.getTime();

      const bonusPoints = $stratagems[0].keys.length * 500;

      if (timeElapsed < bonusPoints) {
        const addedTimeBonus = Math.floor((bonusPoints - timeElapsed) / 10);
        addedScore = addedScore + addedTimeBonus;
        roundScore.timeBonus = roundScore.timeBonus + addedTimeBonus;
      }

      if ($stratagems[1]) {
        addedScore = addedScore + $stratagems[0].keys.length * 10;
        roundScore.score = roundScore.score + $stratagems[0].keys.length * 10;

        active = 0;
        totalStratsDone++;

        if (!$audioMuted) {
          audioFiles.win.play();
        }

        let shiftedList = $stratagems;
        shiftedList.shift();
        stratagems.set(shiftedList);
      } else {
        addedScore = addedScore + $stratagems[0].keys.length * 10;
        roundScore.score = roundScore.score + $stratagems[0].keys.length * 10;

        active = 0;
        totalStratsDone++;

        if (!$audioMuted) {
          audioFiles.success.play();
        }

        round++;
        roundOver = true;
        timeProcentage.set(100, { duration: 0 });
        stratagems.set(data.rounds[round].stratagems);
      }
      perfectInput = true;
      timeBonus = new Date();
      score.set($score + addedScore);
    }
  };
</script>

<svelte:head>
  {#each data.stratagems as stratagem}
    <link rel="preload" as="image" href="stratagems/{stratagem.icon}" />
  {/each}
  <link rel="preload" as="image" href="arrows/UP.svg" />
  <link rel="preload" as="image" href="arrows/DOWN.svg" />
  <link rel="preload" as="image" href="arrows/LEFT.svg" />
  <link rel="preload" as="image" href="arrows/RIGHT.svg" />
</svelte:head>

{#if gameStarted}
  {#if gameOver}
    <GameOverScreen {score} {totalStratsDone} {round} {restartGame} />
  {:else}
    <div
      class="flex justify-center items-center gap-10 md:w-1/2 md:mx-auto h-1/2 md:relative z-20"
    >
      <RoundIndicator {round} />
      <div class="h-full w-full flex flex-col justify-center m-4">
        {#if roundOver}
          <RoundOverScreen {roundScore} {score} {round} {startRound} />
        {:else}
          <div
            class="flex justify-start md:gap-2 items-center h-1/3 overflow-hidden"
          >
            {#each $stratagems as stratagem, i}
              <img
                src="stratagems/{stratagem.icon}"
                class={i == 0
                  ? "border borderyellow h-full aspect-square"
                  : " h-1/3 aspect-square"}
                alt=""
              />
            {/each}
          </div>
          <div class="flex justify-around yellow text-center text-xl mt-2">
            {$stratagems[0].name}
          </div>
          <div class="flex justify-center gap-4 h-20 my-4">
            {#each $stratagems[0].keys as keys, i}
              <div
                class="h-6 w-6 md:h-16 md:w-16 transition-all bg-white deactive {i ==
                active
                  ? 'active scale-125'
                  : ''} {errorDone && i == active
                  ? 'red scale-100'
                  : ''} {errorDone ? 'red scale-125' : ''} {i < active
                  ? 'done'
                  : ''}"
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
      <ScoreIndicator {score} />
    </div>
  {/if}
{:else}
  <Holder>
    <Title title="Starting in" />
    <Title title={countDown} />
  </Holder>
{/if}

{#if innerWidth < 800 || $touchEnabled}
  <ArrowInput {onKeyDown} />
{/if}

<AudioIndicator {audioFiles} />
<TouchIndicator />

<svelte:window
  bind:innerWidth
  bind:innerHeight
  on:keydown|preventDefault={onKeyDown}
/>

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
