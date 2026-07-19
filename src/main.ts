import { Application, Text } from "pixi.js";

(async () => {
  // Initialize the PixiJS application
  const app = new Application();

  await app.init({
    background: "#111111", // Let's make it a dark dungeon color
    resizeTo: window,
  });

  document.body.appendChild(app.canvas);

  // --- 1. THE GAME STATE (Pure Data) ---
  // In a roguelike, everything happens on a grid.
  const TILE_SIZE = 32;

  // This object is the absolute truth of where the player is.
  const playerState = {
    x: 5,
    y: 5,
  };

  // --- 2. THE RENDERER (PixiJS Graphics) ---
  // We create a Text object for the classic roguelike '@' player character.
  const playerSprite = new Text({
    text: "@",
    style: {
      fontFamily: "monospace",
      fontSize: TILE_SIZE,
      fill: 0xffffff, // White text
      fontWeight: "bold",
    },
  });

  // Add the player to the scene so it can be drawn
  app.stage.addChild(playerSprite);

  // --- 3. THE TICKER (The Bridge) ---
  // The ticker runs every single frame (usually 60FPS).
  // Its only job here is to ensure the screen reflects our pure data state.
  app.ticker.add((time) => {
    // Translate grid coordinates (e.g., 5, 5) into pixel coordinates (160, 160)
    playerSprite.x = playerState.x * TILE_SIZE;
    playerSprite.y = playerState.y * TILE_SIZE;
  });

  // --- Input Listener ---
  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "k":
      case "8":
        playerState.y -= 1; // North
        break;

      case "j":
      case "2":
        playerState.y += 1; // South
        break;

      case "h":
      case "4":
        playerState.x -= 1; // West
        break;

      case "l":
      case "6":
        playerState.x += 1; // East
        break;

      // --- Diagonal Movement ---
      case "y":
      case "7":
        playerState.x -= 1; // North-West
        playerState.y -= 1;
        break;

      case "u":
      case "9":
        playerState.x += 1; // North-East
        playerState.y -= 1;
        break;

      case "b":
      case "1":
        playerState.x -= 1; // South-West
        playerState.y += 1;
        break;

      case "n":
      case "3":
        playerState.x += 1; // South-East
        playerState.y += 1;
        break;
    }
  });
})();
