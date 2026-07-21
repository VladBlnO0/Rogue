import { Application, Container, Assets, BitmapText } from "pixi.js";

import * as data from "./data.ts";
import "./player.ts";

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
    for (let x = 0; x < data.MAP_WIDTH; x++) {
      // 0 = Wall, 1 = Floor
      if (
        x === 0 ||
        x === data.MAP_WIDTH - 1 ||
        y === 0 ||
        y === data.MAP_HEIGHT - 1
      ) {
        row.push(0);
      } else {
        row.push(Math.random() > 0.85 ? 0 : 1);
      }
    }
    data.mapData.push(row);
  }

  const mapContainer = new Container();
  app.stage.addChild(mapContainer);

  for (let y = 0; y < data.MAP_HEIGHT; y++) {
    for (let x = 0; x < data.MAP_WIDTH; x++) {
      const isWall = data.mapData[y][x] === 0;

      const tile = new BitmapText({
        text: isWall ? "#" : ".",
        style: {
          fontFamily: "Brass Mono Regular",
          fontSize: data.TILE_SIZE,
          fill: isWall ? "0x555555" : "0x333333",
        },
      });
      tile.x = x * data.TILE_SIZE;
      tile.y = y * data.TILE_SIZE;
      mapContainer.addChild(tile);
    }
  }

  // --- Graphics ---
  const playerSprite = new BitmapText({
    text: "@",
    style: {
      fontFamily: "Brass Mono Regular",
      fontSize: data.TILE_SIZE,
      fill: 0xffffff,
    },
  });
  app.stage.addChild(playerSprite);

  // --- 60 FPS ---
  app.ticker.add((_time) => {
    playerSprite.x = data.playerState.x * data.TILE_SIZE;
    playerSprite.y = data.playerState.y * data.TILE_SIZE;
  });
})();
