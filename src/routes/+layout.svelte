<script>
  import "../app.css";
  import { inject } from "@vercel/analytics";
  import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";

  import Byline from "$lib/components/Byline.svelte";

  injectSpeedInsights();
  inject();
</script>

<div
  class="absolute h-dvh w-dvw crt bg-clip-border z-10 hidden md:block opacity-50"
></div>
<div class="h-dvh w-dvw bg-black monda flex flex-col justify-center gap-4">
  <slot />
  <Byline />
</div>

<style>
  @font-face {
    font-family: "Monda Bold";
    src: url("$lib/fonts/Monda-Bold.ttf");
  }
  .monda {
    font-family: "Monda Bold";
  }
  .crt {
    pointer-events: none;

    background: radial-gradient(
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0),
      #333333,
      #333333
    );
  }

  .crt:before {
    content: " ";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: linear-gradient(
      to bottom,
      rgba(18, 16, 16, 0) 50%,
      rgba(0, 0, 0, 0.25) 50%
    );
    background-size: 100% 8px;
    z-index: 2;
    pointer-events: none;
  }
</style>
