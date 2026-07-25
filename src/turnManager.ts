import { setTimeValue, time } from "./time.ts";

export interface Entity {
  id: string;
  isPlayer: boolean;
  speed: number;
  energy: number;
  takeTurn: () => void;
}

export class TurnManager {
  private entities: Entity[] = [];

  addEntity(entity: Entity) {
    this.entities.push(entity);
  }

  removeEntity(id: string) {
    this.entities = this.entities.filter((e) => e.id !== id);
  }

  async runTurnLoop(waitForPlayerInput: () => Promise<number>) {
    while (true) {
      const minEnergy = Math.min(...this.entities.map((e) => e.energy));
      const timeToAdvance = Math.max(0, minEnergy);

      if (timeToAdvance > 0) {
        setTimeValue(timeToAdvance);
        for (const entity of this.entities) {
          entity.energy -= timeToAdvance;
        }
      }
      for (const entity of this.entities) {
        if (entity.energy <= 0) {
          if (entity.isPlayer) {
            console.log(`Current time: ${time.join(":")}`);
            const energyCost = await waitForPlayerInput();
            entity.energy += energyCost;
          } else {
            entity.takeTurn();

            entity.energy += entity.speed;
          }
        }
      }
    }
  }
}
