<script lang="ts">
  import {
    NumberInput,
    Header,
    Content,
    Grid,
    Row,
    Column,
    Tile,
    Tag,
  } from "carbon-components-svelte";
  import { Button, FluidForm, DataTable } from "carbon-components-svelte";
  import { Engine } from "./engine";
  import type { DirectDamageTick, DebuffDamageTick } from "./engine";
  import { orderBy } from "lodash";

  let durationInSeconds = 10;

  let critRating = 516;
  let critChancePerc = critRating / 17.7;
  let hasteRating = 551;
  let hasteMultiplier = 1 + hasteRating / 32.79 / 100;
  let bonusSpellDamage = 1750;

  let resultTotalDamage = 0;
  let resultDps = 0;

  let resultDirectDamageTicks: DirectDamageTick[] = [];
  let resultDebuffDamageTicks: DebuffDamageTick[] = [];

  runButtonClick();
  function runButtonClick() {
    const engine = new Engine({
      bonusSpellDamage: bonusSpellDamage,
      critChancePerc: critChancePerc,
      hasteMultiplier: hasteMultiplier,
    });

    const simulationDurationMs = 60 * 1000;

    engine.run(simulationDurationMs);

    resultDirectDamageTicks = engine.directSpellDamageTicks;

    resultDebuffDamageTicks = orderBy(engine.debuffDamageTicks, "momentMS");

    resultTotalDamage = engine.totalDamage;
    resultDps = resultTotalDamage / (simulationDurationMs / 1000);
    console.log(resultDirectDamageTicks);
  }
</script>

<main>
  <Header platformName="Shaman dps calculator" />
  <Content>
    <div class="content-container">
      <Grid noGutterLeft noGutterRight>
        <Row style="margin-bottom: 10px">
          <Column
            ><NumberInput
              bind:value={durationInSeconds}
              label="Simulation Duration"
            /></Column
          >
          <Column>
            <NumberInput bind:value={critRating} label="Crit Rating" /></Column
          >
        </Row>
        <Row>
          <Column>
            <NumberInput
              bind:value={hasteRating}
              label="Haste Rating"
            /></Column
          >
          <Column>
            <NumberInput
              bind:value={bonusSpellDamage}
              label="Bonus Spell Damage"
            /></Column
          >
        </Row>
      </Grid>

      <br />
      <div style="display:flex; justify-content: space-between;">
        <div><Button on:click={runButtonClick}>Run</Button></div>

        <Tile>
          {#if resultTotalDamage}
            <p>
              total damage: <Tag type="blue">{resultTotalDamage.toFixed(0)}</Tag
              >
            </p>
          {/if}

          {#if resultDps}
            <p>dps: <Tag type="purple">{resultDps.toFixed(0)}</Tag></p>
          {/if}
        </Tile>
      </div>

      <br />

      {#if resultDirectDamageTicks.length}
        <DataTable
          style="max-height: 300px; overflow:scroll"
          headers={[
            { key: "name", value: "Name" },
            { key: "damage", value: "Damage" },
            { key: "start", value: "Started Cast At" },
            { key: "end", value: "Ended Cast At" },
          ]}
          rows={resultDirectDamageTicks.map((r) => ({
            name: r.spell.name,
            id: Math.random(),
            damage: r.damage.toFixed(0),
            start: r.castStartedAtMS.toFixed(0),
            end: r.castEnedAtMS.toFixed(0),
          }))}
        />

        <DataTable
          style="max-height: 300px; overflow:scroll"
          headers={[
            { key: "name", value: "Name" },
            { key: "damage", value: "Damage" },
            { key: "momentMS", value: "Moment" },
          ]}
          rows={resultDebuffDamageTicks.map((r) => ({
            name: r.spell.name,
            id: Math.random(),
            damage: r.damage.toFixed(0),
            momentMS: r.momentMS.toFixed(0),
          }))}
        />
      {/if}
    </div>
  </Content>
</main>

<style>
  @import "carbon-components-svelte/css/g10.css";

  .content-container {
    max-width: 700px;
    margin: auto;
  }
</style>
