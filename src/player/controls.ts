import * as data from "../data.ts";
import * as isOccupied from "../func/isOccupied.ts";
import type { TurnManager } from "../turnManager.ts";
import { getPlayer } from "./player.ts";

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

    case "0":
      return { dx: 0, dy: 0 };

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
        const intentX = getPlayer().x + moveDir.dx;
        const intentY = getPlayer().y + moveDir.dy;

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
            resolve(1);
            return;
          }

          if (targetTile && targetTile.walkable) {
            getPlayer().x = intentX;
            getPlayer().y = intentY;

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

            const targetX = getPlayer().x + dir.dx;
            const targetY = getPlayer().y + dir.dy;

            const targetMonster = isOccupied.getMonsterAt(targetX, targetY);

            if (targetMonster) {
              console.log(`You strike the ${targetMonster.name}!`);

              targetMonster.takeDamage(10, turnManager);

              if (targetMonster.hp <= 0) {
                console.log(`You defeated ${targetMonster.name}!`);
              }
            } else if (
              targetY >= 0 &&
              targetY < data.MAP_HEIGHT &&
              targetX >= 0 &&
              targetX < data.MAP_WIDTH
            ) {
              const targetTile = data.mapData[targetY][targetX];
              console.log(
                `You swing your weapon at ${targetTile?.name || "empty air"}!`,
              );
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

        case "w": {
          console.log("You wait for a moment...");

          getPlayer().hp = Math.min(getPlayer().maxHp, getPlayer().hp + 1);

          console.log(
            `You feel a bit better. HP: ${getPlayer().hp}/${getPlayer().maxHp}`,
          );

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
