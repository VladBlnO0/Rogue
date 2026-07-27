import { Container } from "pixi.js";
import monsterDefs from "../data/entities/monsters.json" with { type: "json" };
import type { MonsterDefinition } from "./types/types.d.ts";
import type { TurnManager } from "./turnManager.ts";
export const MONSTER_TYPES: Record<string, MonsterDefinition> = monsterDefs;

import { Monster } from "./npc/monster.ts";
export const activeMonsters: Monster[] = [];

/**
 * Spawns monsters from Level JSON spawn list and registers them with TurnManager
 */
export function spawnEntitiesForLevel(
  levelEntities: { type: string; x: number; y: number }[] | undefined,
  stage: Container,
  turnManager: TurnManager,
): void {
  activeMonsters.length = 0;

  if (!levelEntities) return;

  levelEntities.forEach((spawn, index) => {
    const definition = MONSTER_TYPES[spawn.type];
    if (!definition) {
      console.warn(`Unknown monster type in level: ${spawn.type}`);
      return;
    }

    const monsterId = `${spawn.type}_${index}`;
    const monster = new Monster(monsterId, definition, spawn.x, spawn.y, stage, turnManager);
    activeMonsters.push(monster);

    turnManager.addEntity({
      id: monsterId,
      isPlayer: false,
      speed: monster.speed,
      energy: 0,
      takeTurn: () => monster.takeTurn(),
    });
  });

  console.log(`Spawned ${activeMonsters.length} entities.`);
}
