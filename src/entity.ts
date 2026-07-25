import { Container, Text } from "pixi.js";
import * as data from "./data.ts";
import monsterDefs from "../data/entities/monsters.json" with { type: "json" };
import type { MonsterDefinition } from "./types/types.d.ts";
import { playerDijkstra } from "./math/dijkstra.ts";
import type { TurnManager } from "./turnManager.ts";

export const MONSTER_TYPES: Record<string, MonsterDefinition> = monsterDefs;

export class Monster {
  public id: string;
  public name: string;
  public x: number;
  public y: number;
  public speed: number;
  public hp: number;
  public actionCost: number;
  public sprite: Text;

  constructor(
    id: string,
    definition: MonsterDefinition,
    x: number,
    y: number,
    stage: Container,
  ) {
    this.id = id;
    this.name = definition.name;
    this.x = x;
    this.y = y;
    this.speed = definition.speed;
    this.hp = definition.hp;
    this.actionCost = 1; // 1 second turn cost

    this.sprite = new Text({
      text: definition.character,
      style: {
        fontFamily: "monospace",
        fontSize: data.TILE_SIZE,
        fontWeight: "bold",
        fill: definition.tint,
      },
      roundPixels: true,
    });

    this.sprite.x = x * data.TILE_SIZE;
    this.sprite.y = y * data.TILE_SIZE;
    stage.addChild(this.sprite);
  }

  public takeTurn(): void {
    const nextStep = playerDijkstra.getNextStep(this.x, this.y);

    if (
      nextStep.x === data.playerState.x &&
      nextStep.y === data.playerState.y
    ) {
      console.log(`${this.name} attacks the player!`);
      return;
    }

    this.x = nextStep.x;
    this.y = nextStep.y;

    this.sprite.x = this.x * data.TILE_SIZE;
    this.sprite.y = this.y * data.TILE_SIZE;
  }
}

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
    const monster = new Monster(monsterId, definition, spawn.x, spawn.y, stage);
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
