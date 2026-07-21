import * as data from "./data.ts";

(() => {
  // --- Input Listener ---
  globalThis.addEventListener("keydown", (e) => {
    let intentX = data.playerState.x;
    let intentY = data.playerState.y;

    switch (e.key) {
      case "k":
      case "8":
        intentY -= 1; // North
        break;

      case "j":
      case "2":
        intentY += 1; // South
        break;

      case "h":
      case "4":
        intentX -= 1; // West
        break;

      case "l":
      case "6":
        intentX += 1; // East
        break;

      // --- Diagonal Movement ---
      case "y":
      case "7":
        intentX -= 1; // North-West
        intentY -= 1;
        break;

      case "u":
      case "9":
        intentX += 1; // North-East
        intentY -= 1;
        break;

      case "b":
      case "1":
        intentX -= 1; // South-West
        intentY += 1;
        break;

      case "n":
      case "3":
        intentX += 1; // South-East
        intentY += 1;
        break;
    }
    if (
      intentX >= 0 &&
      intentX < data.MAP_WIDTH &&
      intentY >= 0 &&
      intentY < data.MAP_HEIGHT
    ) {
      if (data.mapData[intentY][intentX] === 1) {
        data.playerState.x = intentX;
        data.playerState.y = intentY;
      } else {
        console.log("Wall");
      }
    }
  });
})();
