<script>
  export let onKeyDown;
</script>

<div class="flex flex-col text-white w-full">
  <div class="flex justify-center">
    <button
      on:click={() => {
        onKeyDown({ keyCode: 38 });
      }}><img src="arrows/UP.svg" class="h-16 w-16 fill-white" alt="" /></button
    >
  </div>
  <div class="flex justify-center">
    <button
      on:click={() => {
        onKeyDown({ keyCode: 37 });
      }}
      ><img src="arrows/LEFT.svg" class="h-16 w-16 fill-white" alt="" /></button
    ><button
      on:click={() => {
        onKeyDown({ keyCode: 40 });
      }}
      ><img src="arrows/DOWN.svg" class="h-16 w-16 fill-white" alt="" /></button
    ><button
      on:click={() => {
        onKeyDown({ keyCode: 39 });
      }}
      ><img
        src="arrows/RIGHT.svg"
        class="h-16 w-16 fill-white"
        alt=""
      /></button
    >
  </div>
</div>
