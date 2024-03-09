<script>
  import "../app.css";
  import { inject } from "@vercel/analytics";
  import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";

  injectSpeedInsights();
  inject();
</script>

<div class="h-screen bg-black monda flex flex-col justify-center gap-10">
  <slot />
</div>

<style>
  @font-face {
    font-family: "Monda Bold";
    src: url("$lib/fonts/Monda-Bold.ttf");
  }
  .monda {
    font-family: "Monda Bold";
  }
</style>
