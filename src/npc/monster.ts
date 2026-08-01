import * as data from "../data.ts";
import type { Container } from "pixi.js";
import { Text } from "pixi.js";
import type { MonsterDefinition } from "../types/types.d.ts";
import { playerDijkstra } from "../math/dijkstra.ts";
import * as isOccupied from "../func/isOccupied.ts";
import type { TurnManager } from "../turnManager.ts";
import { activeMonsters } from "../entity.ts";
import { getPlayer } from "../player/player.ts";

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

  private turnManager: TurnManager;

  constructor(
    id: string,
    definition: MonsterDefinition,
    x: number,
    y: number,
    stage: Container,
    turnManager: TurnManager,
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

    this.turnManager = turnManager;
  }

  public takeTurn(): void {
    if (!this.isAlive()) return;

    if (!this.isPlayerInRange(10)) return;

    const nextStep = playerDijkstra.getNextStep(this.x, this.y);

    console.log(getPlayer().x, getPlayer().y);
    
    if (this.isPlayerAt(nextStep.x, nextStep.y)) {
      this.attackPlayer();
      return;
    }

    this.tryMoveTo(nextStep.x, nextStep.y);
  }

  private isAlive(): boolean {
    return this.hp > 0;
  }

  private isPlayerInRange(maxDistance: number): boolean {
    const player = getPlayer();
    const distance = Math.abs(this.x - player.x) + Math.abs(this.y - player.y);

    if (distance > maxDistance) {
      console.debug(
        `${this.name} is too far from the player and does nothing.`,
      );
      return false;
    }

    return true;
  }

  private isPlayerAt(targetX: number, targetY: number): boolean {
    const player = getPlayer();
    return player.x === targetX && player.y === targetY;
  }

  private attackPlayer(): void {
    console.log(`${this.name} attacks the player!`);
    const player = getPlayer();
    player.takeDamage(10, this.turnManager);
  }

  private tryMoveTo(targetX: number, targetY: number): void {
    const otherMonster = isOccupied.getMonsterAt(targetX, targetY, this.id);

    if (otherMonster) {
      console.log(`${this.name} is blocked by ${otherMonster.name}.`);
      return;
    }

    if (targetX === getPlayer().x && targetY === getPlayer().y) {
      console.log(`${this.name} is blocked by player.`);
      return;
    }

    this.x = targetX;
    this.y = targetY;
    this.updateSpritePosition();
  }

  private updateSpritePosition(): void {
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
