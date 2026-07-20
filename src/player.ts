import { playerState } from "./data.ts";

(() => {
  // --- Input Listener ---
  globalThis.addEventListener("keydown", (e) => {
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
