<script lang="ts">
  import { Engine } from "./engine";
  import type { DamageTick } from "./engine";
  import { orderBy } from "lodash";

  let durationInSeconds = 10;

  let critRating = 516;
  let critChancePerc = critRating / 17.7;
  let hasteRating = 551;
  let hasteMultiplier = 1 + hasteRating / 32.79 / 100;
  let bonusSpellDamage = 1750;

  let resultTotalDamage = 0;
  let resultDps = 0;

  let resultDamageTicks: DamageTick[] = [];

  function runButtonClick() {
    const engine = new Engine({
      bonusSpellDamage: bonusSpellDamage,
      critChancePerc: critChancePerc,
      hasteMultiplier: hasteMultiplier,
    });

    const simulationDurationMs = 60 * 1000;

    engine.run(simulationDurationMs);

    resultDamageTicks = orderBy(engine.damageTicks, "happenedAtMills");
    resultTotalDamage = resultDamageTicks.reduce((a, b) => {
      return a + b.damage;
    }, 0);
    resultDps = (resultTotalDamage / simulationDurationMs) * 1000;

    console.log(resultDamageTicks);
  }
</script>

<main>
  <h1>Shaman dps calculator</h1>
  <table>
    <tr>
      <td>duration</td>
      <td><input bind:value={durationInSeconds} /></td>
    </tr>
    <tr>
      <td>crit rating</td>
      <td><input bind:value={critRating} /></td>
      <td>=</td>
      <td>{critChancePerc.toFixed(1)}%</td>
    </tr>
    <tr>
      <td>haste</td>
      <td><input bind:value={hasteRating} /></td>
      <td>=</td>
      <td>{hasteMultiplier.toFixed(2)}</td>
    </tr>
    <tr>
      <td>spell powa</td>
      <td><input bind:value={bonusSpellDamage} /></td>
    </tr>
  </table>
  <br />
  <br /><button on:click={runButtonClick}>Run</button>
  <br />

  {#if resultTotalDamage}
    <span>total damage: {resultTotalDamage.toFixed(0)}</span>
  {/if}

  {#if resultDps}
    <span>total damage: {resultDps.toFixed(0)}</span>
  {/if}

  <ul>
    {#each resultDamageTicks as tick}
      <li>{tick.spell.name}</li>
    {/each}
  </ul>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }

  table {
    display: inline;
  }

  td > input {
    vertical-align: middle;
    margin-bottom: 0;
  }

  ul {
    width: 200px;
  }
</style>
