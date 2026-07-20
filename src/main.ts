import { Application, Text } from "pixi.js";
import { TILE_SIZE, playerState } from "./data.ts";
import "./player.ts";

(async () => {
  const app = new Application();

  await app.init({
    background: "#111111",
    resizeTo: window,
  });

  document.body.appendChild(app.canvas);

  // --- Graphics ---
  const playerSprite = new Text({
    text: "@",
    style: {
      fontFamily: "monospace",
      fontSize: TILE_SIZE,
      fill: 0xffffff,
      fontWeight: "bold",
    },
  });
  app.stage.addChild(playerSprite);

  // --- 60 FPS ---
  app.ticker.add((_time) => {
    playerSprite.x = playerState.x * TILE_SIZE;
    playerSprite.y = playerState.y * TILE_SIZE;
  });
})();
