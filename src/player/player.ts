import * as data from "../data.ts";
import * as isOccupied from "../func/isOccupied.ts";
import type { TurnManager } from "../turnManager.ts";

export function getDirectionFromKey(
  key: string,
): { dx: number; dy: number } | null {
  switch (key) {
    case "k":
      return { dx: 0, dy: -1 };
    case "j":
      return { dx: 0, dy: 1 };
    case "h":
      return { dx: -1, dy: 0 };
    case "l":
      return { dx: 1, dy: 0 };

    case "y":
      return { dx: -1, dy: -1 };
    case "u":
      return { dx: 1, dy: -1 };
    case "b":
      return { dx: -1, dy: 1 };
    case "n":
      return { dx: 1, dy: 1 };

    default:
      return null;
  }
}

export function waitForDirectionInput(): Promise<{
  dx: number;
  dy: number;
} | null> {
  return new Promise((resolve) => {
    const handleDirectionKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        console.log("Action cancelled");
        globalThis.removeEventListener("keydown", handleDirectionKey);
        resolve(null);
        return;
      }

      const dir = getDirectionFromKey(e.key);

      if (dir) {
        globalThis.removeEventListener("keydown", handleDirectionKey);
        resolve(dir);
      } else {
        console.log("Invalid direction!");
      }
    };

    globalThis.addEventListener("keydown", handleDirectionKey);
  });
}

export function waitForPlayerInput(turnManager: TurnManager): Promise<number> {
  return new Promise((resolve) => {
    const handleInput = (e: KeyboardEvent) => {
      const moveDir = getDirectionFromKey(e.key);

      if (moveDir) {
        const intentX = data.playerState.x + moveDir.dx;
        const intentY = data.playerState.y + moveDir.dy;

        if (
          intentX >= 0 &&
          intentX < data.MAP_WIDTH &&
          intentY >= 0 &&
          intentY < data.MAP_HEIGHT
        ) {
          const targetTile = data.mapData[intentY][intentX];

          const monster = isOccupied.getMonsterAt(intentX, intentY);

          if (monster) {
            console.log(`You bump into ${monster.name}!`);
            globalThis.removeEventListener("keydown", handleInput);
            resolve(null);
            return;
          }

          if (targetTile && targetTile.walkable) {
            data.playerState.x = intentX;
            data.playerState.y = intentY;

            globalThis.removeEventListener("keydown", handleInput);
            resolve(1);
            return;
          } else {
            console.log(`Blocked by ${targetTile.name}!`);
          }
        }
        return;
      }

      // --- Targeted actions ---
      switch (e.key) {
        case "a": {
          globalThis.removeEventListener("keydown", handleInput);
          console.log("Attack in which direction? (Esc to cancel)");

          waitForDirectionInput().then((dir) => {
            if (!dir) {
              globalThis.addEventListener("keydown", handleInput);
              return;
            }

            const targetX = data.playerState.x + dir.dx;
            const targetY = data.playerState.y + dir.dy;

            const targetMonster = isOccupied.getMonsterAt(targetX, targetY);

            if (targetMonster) {
              console.log(`You strike the ${targetMonster.name}!`);

              targetMonster.takeDamage(10, turnManager);

              if (targetMonster.hp <= 0) {
                console.log(`You defeated ${targetMonster.name}!`);
              }
            } else {
              const targetTile = data.mapData[targetX][targetY];

              console.log(`You swing your weapon at ${targetTile.name}!`);
            }

            resolve(1);
          });
          break;
        }

        case "c": {
          console.log("You spend some time building a campfire...");
          globalThis.removeEventListener("keydown", handleInput);
          resolve(60);
          break;
        }

        case "0": {
          console.log("You wait for a moment...");
          globalThis.removeEventListener("keydown", handleInput);
          resolve(1);
          break;
        }

        default:
          console.log("Unrecognized command");
          break;
      }
    };

    globalThis.addEventListener("keydown", handleInput);
  });
}
