<script>
  import { tweened } from "svelte/motion";
  import { writable } from "svelte/store";
  export let data;

  console.log(data);
  let active = 0;

  const stratagems = writable(data.stratagems);

  const score = tweened(0);

  let round = 0;

  let totalTime = 10;
  let timeRemaining = 10;

  let gameOver = false;

  const timeProcentage = tweened(100);
  setInterval(() => {
    if (timeRemaining < 0) {
      gameOver = true;
    }
    if (!gameOver) {
      timeProcentage.set((timeRemaining / totalTime) * 100);
      timeRemaining = timeRemaining - 1;
    }
  }, 1000);

  const onKeyDown = (e) => {
    console.log(e);
    if (e.keyCode == 38) {
      // UP
      if ($stratagems[0].keys[active] == "UP") {
        active = active + 1;
      }
    }
    if (e.keyCode == 40) {
      // DOWN
      if ($stratagems[0].keys[active] == "DOWN") {
        active = active + 1;
      }
    }
    if (e.keyCode == 37) {
      // LEFT
      if ($stratagems[0].keys[active] == "LEFT") {
        active = active + 1;
      }
    }
    if (e.keyCode == 39) {
      // RIGHT
      if ($stratagems[0].keys[active] == "RIGHT") {
        active = active + 1;
      }
    }

    if (data.stratagems[0].keys.length <= active) {
      console.log("done");
      data.stratagems.shift();
      stratagems.set(data.stratagems);

      active = 0;
      score.set($score + 1);

      if (timeRemaining < totalTime) {
        timeRemaining = timeRemaining + Math.random() * 5;
        timeProcentage.set((timeRemaining / totalTime) * 100);
      }
      console.log(timeRemaining);
    }

    console.log(active);
  };
</script>

<div class="h-screen bg-black monda flex flex-col justify-center gap-10">
  <div class="h-1 bg-white w-full"></div>
  {#if gameOver}
    <div
      class="flex flex-col justify-center items-center gap-10 h-1/2 text-white"
    >
      <div class="text-9xl">GAME OVER!</div>
      <div class=" text-3xl">Score: {Math.round($score)}</div>
    </div>
  {:else}
    <div class="flex justify-center items-center gap-10 h-1/2">
      <div class="text-white self-start">
        <div>ROUND</div>

        <div class="text-3xl textyellow">{round}</div>
      </div>
      <div class="h-full w-1/2 flex flex-col justify-center">
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
            <img
              src="arrows/{keys}.webp"
              alt=""
              class="h-16 w-16 deactive {i == active ? 'active' : ''} {i <
              active
                ? 'done'
                : ''}"
            />
          {/each}
        </div>
        <div class="bg-gray-500 h-6">
          <div
            class="h-full yellow"
            style="width:{$timeProcentage > 100 ? 100 : $timeProcentage}%"
          ></div>
        </div>
      </div>
      <div class="text-white text-right self-start">
        <div class="text-3xl textyellow bold font-bold">
          {Math.round($score)}
        </div>
        <div>SCORE</div>
      </div>
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
