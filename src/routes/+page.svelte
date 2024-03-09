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

  let volumeMuted = false;
  const audioFiles = {
    win: null,
    loose: null,
    click: null,
    error: null,
    success: null,
  };

  console.log(audioFiles);
  const errorCooloff = (timeout) => {
    if (!volumeMuted) {
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

    active = 0;
    round = 0;

    startRound(round);

    let interval = setInterval(() => {
      let now = new Date();
      if (
        endTime.getTime() - now.getTime() < 0 &&
        roundOver == false &&
        gameOver == false
      ) {
        gameOver = true;
        if (!volumeMuted) {
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

  const timeProcentage = tweened(100);

  const onKeyDown = (e) => {
    const cooloffTime = 1000;

    if (gameStarted == false) {
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
    if (!volumeMuted) {
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

        if (!volumeMuted) {
          audioFiles.win.play();
        }

        let shiftedList = $stratagems;
        shiftedList.shift();
        stratagems.set(shiftedList);
      } else {
        addedScore = addedScore + $stratagems[0].keys.length * 10;
        roundScore.score = roundScore.score + $stratagems[0].keys.length * 10;

        active = 0;

        if (!volumeMuted) {
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

          <div class="text-3xl textyellow">{round + 1}</div>
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
                <div>Score: {roundScore.score}</div>
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
            <div class="flex justify-center gap-4 h-20 mt-4">
              {#each $stratagems[0].keys as keys, i}
                <div
                  class="h-16 w-16 transition-all bg-white deactive {i == active
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
      <button class="text-3xl" on:click={gameStart}
        >Click here or press a key to start!</button
      >
      <Ad />
    </div>
  {/if}
  <div>
    <div class="h-1 bg-white w-full"></div>
    <div class="mt-2 flex w-full justify-center text-white text-xs">
      Atle Selbek © 2024 -<a
        href="https://github.com/Nolux/stratagemhero2/issues"
      >
        - Found a bug?</a
      >
    </div>
  </div>
</div>

<div
  class="w-6 h-6 absolute top-4 right-4"
  on:click={() => {
    volumeMuted = !volumeMuted;
  }}
>
  {#if volumeMuted}
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
      ><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
        fill="#ffffff"
        d="M215 71.1L126.1 160H24c-13.3 0-24 10.7-24 24v144c0 13.3 10.7 24 24 24h102.1l89 89c15 15 41 4.5 41-17V88c0-21.5-26-32-41-17zM461.6 256l45.6-45.6c6.3-6.3 6.3-16.5 0-22.8l-22.8-22.8c-6.3-6.3-16.5-6.3-22.8 0L416 210.4l-45.6-45.6c-6.3-6.3-16.5-6.3-22.8 0l-22.8 22.8c-6.3 6.3-6.3 16.5 0 22.8L370.4 256l-45.6 45.6c-6.3 6.3-6.3 16.5 0 22.8l22.8 22.8c6.3 6.3 16.5 6.3 22.8 0L416 301.6l45.6 45.6c6.3 6.3 16.5 6.3 22.8 0l22.8-22.8c6.3-6.3 6.3-16.5 0-22.8L461.6 256z"
      /></svg
    >
  {:else}
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"
      ><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
        fill="#ffffff"
        d="M215 71.1L126.1 160H24c-13.3 0-24 10.7-24 24v144c0 13.3 10.7 24 24 24h102.1l89 89c15 15 41 4.5 41-17V88c0-21.5-26-32-41-17zm233.3-51.1c-11.2-7.3-26.2-4.2-33.5 7-7.3 11.2-4.2 26.2 7 33.5 66.3 43.5 105.8 116.6 105.8 195.6 0 79-39.6 152.1-105.8 195.6-11.2 7.3-14.3 22.3-7 33.5 7 10.7 21.9 14.6 33.5 7C528.3 439.6 576 351.3 576 256S528.3 72.4 448.4 20zM480 256c0-63.5-32.1-121.9-85.8-156.2-11.2-7.1-26-3.8-33.1 7.5s-3.8 26.2 7.4 33.4C408.3 166 432 209.1 432 256s-23.7 90-63.5 115.4c-11.2 7.1-14.5 22.1-7.4 33.4 6.5 10.4 21.1 15.1 33.1 7.5C447.9 377.9 480 319.5 480 256zm-141.8-76.9c-11.6-6.3-26.2-2.2-32.6 9.5-6.4 11.6-2.2 26.2 9.5 32.6C328 228.3 336 241.6 336 256c0 14.4-8 27.7-20.9 34.8-11.6 6.4-15.8 21-9.5 32.6 6.4 11.7 21.1 15.8 32.6 9.5 28.2-15.6 45.8-45 45.8-76.9s-17.5-61.3-45.8-76.9z"
      /></svg
    >
    >{/if}
</div>

<audio src="audio/win.wav" bind:this={audioFiles.win}></audio>
<audio src="audio/click.wav" bind:this={audioFiles.click}></audio>
<audio src="audio/loose.wav" bind:this={audioFiles.loose}></audio>
<audio src="audio/error.wav" bind:this={audioFiles.error}></audio>
<audio src="audio/success.wav" bind:this={audioFiles.success}></audio>

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
