import * as data from "../data.ts";
import { Container, Text } from "pixi.js";
import type { MonsterDefinition } from "../types/types.d.ts";
import { playerDijkstra } from "../math/dijkstra.ts";
import * as isOccupied from "../func/isOccupied.ts";
import type { TurnManager } from "../turnManager.ts";
import { activeMonsters } from "../entity.ts";

export class Monster {
  public id: string;
  public name: string;
  public x: number;
  public y: number;
  public speed: number;

  public hp: number;
  public maxHp: number;

  public actionCost: number;
  public sprite: Text;

  private _turnManager: TurnManager;

  constructor(
    id: string,
    definition: MonsterDefinition,
    x: number,
    y: number,
    stage: Container,
    _turnManager: TurnManager,
  ) {
    this.id = id;
    this.name = definition.name;
    this.x = x;
    this.y = y;
    this.speed = definition.speed;
    this.hp = definition.hp;
    this.maxHp = definition.hp;

    this.actionCost = 1;

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
    this.sprite.zIndex = 2;

    this.sprite.x = x * data.TILE_SIZE;
    this.sprite.y = y * data.TILE_SIZE;
    stage.addChild(this.sprite);
  }

  public takeTurn(): void {
    if (this.hp <= 0) {
      console.log(`${this.name} has been defeated!`);
      return;
    }

    const playerDistance =
      Math.abs(this.x - data.playerState.x) +
      Math.abs(this.y - data.playerState.y);

    if (playerDistance > 10) {
      console.debug(`${this.name} is too far from the player and does nothing`);
      return;
    }

    const nextStep = playerDijkstra.getNextStep(this.x, this.y);

    if (
      nextStep.x === data.playerState.x &&
      nextStep.y === data.playerState.y
    ) {
      console.log(`${this.name} attacks the player!`);
      return;
    }

    const otherMonster = isOccupied.getMonsterAt(
      nextStep.x,
      nextStep.y,
      this.id,
    );

    if (otherMonster) {
      console.log(`${this.name} is blocked by ${otherMonster.name}.`);
      return;
    }

    this.x = nextStep.x;
    this.y = nextStep.y;

    this.sprite.x = this.x * data.TILE_SIZE;
    this.sprite.y = this.y * data.TILE_SIZE;
  }

  public takeDamage(amount: number, turnManager: TurnManager): void {
    this.hp -= amount;
    console.log(
      `${this.name} took ${amount} damage (${this.hp}/${this.maxHp} HP left)`,
    );

    if (this.hp <= 0) {
      this.die(turnManager);
    }
  }

  public die(turnManager: TurnManager): void {
    console.log(`${this.name} has been slain!`);

    // if (this.sprite) {
    //   this.sprite.destroy();
    // }

    const index = activeMonsters.indexOf(this);
    if (index !== -1) {
      activeMonsters.splice(index, 1);
    }

    turnManager.removeEntity(this.id);

    const corpseTile = data.mapData[this.y][this.x];
    corpseTile.character = "%";
    corpseTile.tint = "#8B0000";
    corpseTile.walkable = true;

    data.mapData[this.y][this.x] = corpseTile;

    this.sprite.text = corpseTile.character;
    this.sprite.style.fill = corpseTile.tint;
    this.sprite.zIndex = 1;
  }
}
