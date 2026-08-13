import { Application, Container, Assets, Text, Graphics } from "pixi.js";

import * as data from "./data.ts";
import type * as types from "./types/types.d.ts";

import "./player/player.ts";

import jsonMapData from "../data/level/1 - Start/level1.json" with { type: "json" };

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

  const mapData = jsonMapData as types.LevelJSON;
  loadLevel(mapData);

  if (jsonMapData.playerStart) {
    getPlayer().x = jsonMapData.playerStart.x;
    getPlayer().y = jsonMapData.playerStart.y;
  }

  const bgGraphics = new Graphics();
  const mapContainer = new Container();
  const entityContainer = new Container();

  app.stage.addChild(bgGraphics);
  app.stage.addChild(mapContainer);
  app.stage.addChild(entityContainer);

  if (jsonMapData.playerStart) {
    getPlayer().x = jsonMapData.playerStart.x;
    getPlayer().y = jsonMapData.playerStart.y;
  }

  for (let y = 0; y < data.MAP_HEIGHT; y++) {
    for (let x = 0; x < data.MAP_WIDTH; x++) {
      const tile = data.mapData[y][x];
      if (!tile) continue;

      const px = x * data.TILE_SIZE;
      const py = y * data.TILE_SIZE;

      if (tile.background && tile.background !== "#000000") {
        bgGraphics.rect(px, py, data.TILE_SIZE, data.TILE_SIZE);
        bgGraphics.fill(tile.background);
      }

      if (tile.character && tile.character !== " ") {
        const tileSprite = new Text({
          text: tile.character,
          style: {
            fontFamily: "monospace",
            fontSize: data.TILE_SIZE,
            fontWeight: "bold",
            fill: tile.foreground || "#ffffff",
          },
          roundPixels: true,
        });
        tileSprite.x = px;
        tileSprite.y = py;
        mapContainer.addChild(tileSprite);
      }
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

  entityContainer.addChild(playerSprite);

  // --- Ticker ---
  app.ticker.add(() => {
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

  spawnEntitiesForLevel(jsonMapData.entities, entityContainer, turnManager);

  playerDijkstra.update(getPlayer().x, getPlayer().y);

  turnManager.addEntity({
    id: "player",
    isPlayer: true,
    speed: 1,
    energy: 0,
    takeTurn: () => {},
  });

  await turnManager.runTurnLoop((tm) => waitForPlayerInput(tm));
})();
