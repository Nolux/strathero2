<script>
  import "../app.css";
  import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";

  injectSpeedInsights();
</script>

<slot />

<style>
  @font-face {
    font-family: "Monda Bold";
    src: url("$lib/fonts/Monda-Bold.ttf");
  }
</style>
