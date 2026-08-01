import { setTimeValue, time } from "./time.ts";

import type * as types from "./types/types.d.ts";

export class TurnManager {
  private entities: types.Entity[] = [];
  public isGameOver: boolean = false;

  addEntity(entity: types.Entity) {
    if (entity.isPlayer) {
      this.entities.unshift(entity);
    } else {
      this.entities.push(entity);
    }
  }

  removeEntity(id: string) {
    this.entities = this.entities.filter((e) => e.id !== id);
  }

  gameOver() {
    this.isGameOver = true;
    console.log("--- GAME OVER ---");
  }

  async runTurnLoop(
    waitForPlayerInput: (turnManager: TurnManager) => Promise<number>,
  ) {
    while (!this.isGameOver) {
      const minEnergy = Math.min(...this.entities.map((e) => e.energy));
      const timeToAdvance = Math.max(0, minEnergy);

      if (timeToAdvance > 0) {
        setTimeValue(timeToAdvance);
        for (const entity of this.entities) {
          entity.energy -= timeToAdvance;
        }
      }

      for (const entity of this.entities) {
        if (this.isGameOver) break;

        if (entity.energy <= 0) {
          if (entity.isPlayer) {
            const energyCost = await waitForPlayerInput(this);
            entity.energy += energyCost;

            if (energyCost > 0) {
              console.debug(
                `Player took an action costing ${energyCost} energy`,
              );
              console.log(`Current time: ${time.join(":")}`);
            } else {
              console.debug("Player did nothing");
            }
          } else {
            entity.takeTurn();

            entity.energy += 1 / entity.speed;
          }
        }
      }
      console.log("--- GAME OVER ---");
    }
  }
}
