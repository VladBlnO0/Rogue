import * as data from "./data.ts";
import type { TileDefinition } from "./types/types.d.ts";

export function waitForPlayerInput(): Promise<number> {
  return new Promise((resolve) => {
    const handleInput = (e: KeyboardEvent) => {
      let intentX = data.playerState.x;
      let intentY = data.playerState.y;

      let actionTaken = false;
      let energyCost = 0;

      switch (e.key) {
        case "k":
        case "8":
          intentY -= 1;
          actionTaken = true;
          energyCost = 1;
          break;
        case "j":
        case "2":
          intentY += 1;
          actionTaken = true;
          energyCost = 1;
          break;
        case "h":
        case "4":
          intentX -= 1;
          actionTaken = true;
          energyCost = 1;
          break;
        case "l":
        case "6":
          intentX += 1;
          actionTaken = true;
          energyCost = 1;
          break;

        // --- Diagonal Movement ---
        case "y":
        case "7":
          intentX -= 1;
          intentY -= 1;
          actionTaken = true;
          energyCost = 1;
          break;
        case "u":
        case "9":
          intentX += 1;
          intentY -= 1;
          actionTaken = true;
          energyCost = 1;
          break;
        case "b":
        case "1":
          intentX -= 1;
          intentY += 1;
          actionTaken = true;
          energyCost = 1;
          break;
        case "n":
        case "3":
          intentX += 1;
          intentY += 1;
          actionTaken = true;
          energyCost = 1;
          break;

        case "c":
          console.log("You spend some time building a campfire...");
          actionTaken = true;
          energyCost = 60;
          break;

        case "0":
          console.log("You spend some time resting...");
          actionTaken = true;
          energyCost = 1;
          break;

        default:
          console.log("Invalid key pressed");
          break;
      }

      if (actionTaken) {
        if (intentX !== data.playerState.x || intentY !== data.playerState.y) {
          if (
            intentX >= 0 &&
            intentX < data.MAP_WIDTH &&
            intentY >= 0 &&
            intentY < data.MAP_HEIGHT
          ) {
            const targetTile: TileDefinition = data.mapData[intentY][intentX];

            if (targetTile.walkable) {
              data.playerState.x = intentX;
              data.playerState.y = intentY;
              console.log(`Stepped onto ${targetTile.name}.`);

              globalThis.removeEventListener("keydown", handleInput);
              resolve(energyCost);
            } else {
              console.log(`Blocked by ${targetTile.name}!`);
            }
          }
        } else {
          globalThis.removeEventListener("keydown", handleInput);
          resolve(energyCost);
        }
      }
    };

    globalThis.addEventListener("keydown", handleInput);
  });
}
