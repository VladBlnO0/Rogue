import { Application, Container, Assets, Text } from "pixi.js";

import * as data from "./data.ts";
import "./player.ts";

import levelData from "../data/level/level1.json" with { type: "json" };

import { TurnManager } from "./turnManager.ts";
import { waitForPlayerInput } from "./player.ts";
import { loadLevel } from "./map.ts";

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
