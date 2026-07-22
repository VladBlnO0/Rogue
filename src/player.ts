import * as data from "./data.ts";

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
          console.log(
            "Invalid key pressed. Use arrow keys or numpad for movement.",
          );
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
            if (data.mapData[intentY][intentX] === 1) {
              data.playerState.x = intentX;
              data.playerState.y = intentY;
              console.log("Good move!");

              globalThis.removeEventListener("keydown", handleInput);

              resolve(energyCost);
            } else {
              console.log("Bad move!");
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
