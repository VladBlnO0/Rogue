import { Application, Container, Assets, Text } from "pixi.js";

import * as data from "./data.ts";
import "./player/player.ts";

import levelData from "../data/level/level1.json" with { type: "json" };

import { TurnManager } from "./turnManager.ts";
import { waitForPlayerInput } from "./player/controls.ts";
import { loadLevel } from "./map.ts";
import { playerDijkstra } from "./math/dijkstra.ts";
import { activeMonsters, spawnEntitiesForLevel } from "./entity.ts";
import { createPlayer, getPlayer } from "./player/player.ts";
import { updateHUD } from "./ui.ts";

(async () => {
  console.dir(data.mapData);

  const canvasContainer = document.getElementById("canvas-container")!;

  const app = new Application();
  await app.init({
    background: "#111111",
    width: globalThis.innerWidth,
    height: globalThis.innerHeight,
    antialias: false,
    roundPixels: true,
  });
  canvasContainer.appendChild(app.canvas);

  await Assets.load("font.xml");
  loadLevel(levelData);

  const mapContainer = new Container();
  app.stage.addChild(mapContainer);

  for (let y = 0; y < data.MAP_HEIGHT; y++) {
    for (let x = 0; x < data.MAP_WIDTH; x++) {
      const tile = data.mapData[y][x];

      if (!tile) continue;

      const tileSprite = new Text({
        text: tile.character,
        style: {
          fontFamily: "monospace",
          fontSize: data.TILE_SIZE,
          fontWeight: "bold",
          fill: tile.tint,
        },
        roundPixels: true,
      });
      tileSprite.x = x * data.TILE_SIZE;
      tileSprite.y = y * data.TILE_SIZE;
      mapContainer.addChild(tileSprite);
    }
  }

  const player = createPlayer("Hero", "warrior", getPlayer().x, getPlayer().y);

  console.log("Player Class:", player.className);
  console.log("HP:", player.hp, "/", player.maxHp);
  console.log("Mana:", player.mana);
  console.log("Learned Skills:", Array.from(player.skills.keys()));
  console.log("Known Spells:", Array.from(player.spells.keys()));

  // NEED BITMAP
  const playerSprite = new Text({
    text: "@",
    style: {
      fontFamily: "monospace",
      fontSize: data.TILE_SIZE,
      fontWeight: "bold",
      fill: 0xffffff,
    },
    roundPixels: true,
  });
  playerSprite.zIndex = 2;
  app.stage.addChild(playerSprite);

  // --- Ticker ---
  app.ticker.add((ticker) => {
    updateHUD();

    const targetX = getPlayer().x * data.TILE_SIZE;
    const targetY = getPlayer().y * data.TILE_SIZE;

    playerSprite.x += targetX - playerSprite.x;
    playerSprite.y += targetY - playerSprite.y;

    if (Math.abs(targetX - playerSprite.x) < 0.1) playerSprite.x = targetX;
    if (Math.abs(targetY - playerSprite.y) < 0.1) playerSprite.y = targetY;

    for (const monster of activeMonsters) {
      monster.update();
    }
  });

  const turnManager = new TurnManager();

  turnManager.addEntity({
    id: "player",
    isPlayer: true,
    speed: 1,
    energy: 0,
    takeTurn: () => {},
  });

  playerDijkstra.update(getPlayer().x, getPlayer().y);

  spawnEntitiesForLevel(levelData.entities, app.stage, turnManager);

  const handlePlayerTurn = async (): Promise<number> => {
    const cost = await waitForPlayerInput(turnManager);
    playerDijkstra.update(getPlayer().x, getPlayer().y);
    return cost;
  };

  await turnManager.runTurnLoop(handlePlayerTurn);
  await turnManager.runTurnLoop(waitForPlayerInput);
})();
