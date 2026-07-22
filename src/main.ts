import { Application, Container, Assets, Text } from "pixi.js";

import * as data from "./data.ts";
import "./player.ts";

import levelData from "../data/level/level1.json" with { type: "json" };

import { TurnManager } from "./turnManager.ts";
import { waitForPlayerInput } from "./player.ts";

(async () => {
  const app = new Application();
  await app.init({
    background: "#111111",
    width: globalThis.innerWidth,
    height: globalThis.innerHeight,
    antialias: false,
    roundPixels: true,
  });
  document.body.appendChild(app.canvas);

  await Assets.load("font.xml");

  for (let y = 0; y < data.MAP_HEIGHT; y++) {
    const row = [];
    const rowString = levelData.layout[y];

    for (let x = 0; x < data.MAP_WIDTH; x++) {
      const char = rowString[x];

      const numericValue =
        levelData.legend[char] !== undefined ? levelData.legend[char] : 0;

      row.push(numericValue);
    }
    data.mapData.push(row);
  }

  const mapContainer = new Container();
  app.stage.addChild(mapContainer);

  const TILE_VISUALS: Record<number, { character: string; tint: number }> = {
    0: { character: "#", tint: 0x555555 }, // Wall (Gray)
    1: { character: ".", tint: 0x333333 }, // Floor (Dark Gray)
    2: { character: "+", tint: 0x8b4513 }, // Door (Brown)
    3: { character: "≈", tint: 0x1e90ff }, // Water (Blue)
    4: { character: "c", tint: 0xff0000 }, // Cobold (Brown)
  };

  for (let y = 0; y < data.MAP_HEIGHT; y++) {
    for (let x = 0; x < data.MAP_WIDTH; x++) {
      const tileId = data.mapData[y][x];
      const visual = TILE_VISUALS[tileId] || { character: "!", tint: 0xff0000 };

      // NEED BITMAP
      const tile = new Text({
        text: visual.character,
        style: {
          fontFamily: "monospace",
          fontSize: data.TILE_SIZE,
          fontWeight: "bold",
          fill: visual.tint,
        },
        roundPixels: true,
      });
      tile.x = x * data.TILE_SIZE;
      tile.y = y * data.TILE_SIZE;
      mapContainer.addChild(tile);
    }
  }

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
  app.stage.addChild(playerSprite);

  // --- 60 FPS ---
  app.ticker.add((_time) => {
    playerSprite.x = data.playerState.x * data.TILE_SIZE;
    playerSprite.y = data.playerState.y * data.TILE_SIZE;
  });

  const turnManager = new TurnManager();

  turnManager.addEntity({
    id: "player",
    isPlayer: true,
    speed: 1,
    energy: 0,
    takeTurn: () => {
      console.log("Player turn taken!");
    },
  });

  await turnManager.runTurnLoop(waitForPlayerInput);
})();
