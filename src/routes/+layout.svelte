<script>
  import "../app.css";
  import { inject } from "@vercel/analytics";
  import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";

  injectSpeedInsights();
  inject();
</script>

<slot />

<style>
  @font-face {
    font-family: "Monda Bold";
    src: url("$lib/fonts/Monda-Bold.ttf");
  }
</style>
