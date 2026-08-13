import * as data from "../data.ts";
import type { Container } from "pixi.js";
import { Text } from "pixi.js";
import type { MonsterDefinition } from "../types/types.d.ts";
import { playerDijkstra } from "../math/dijkstra.ts";
import * as isOccupied from "../func/isOccupied.ts";
import type { TurnManager } from "../turnManager.ts";
import { activeMonsters } from "../entity.ts";
import { getPlayer } from "../player/player.ts";

import { wander } from "./func/wander.ts";

export class Monster {
  public id: string;
  public name: string;
  public x: number;
  public y: number;
  public speed: number;

  public hp: number;
  public maxHp: number;

  public strength: number;

  public attackPower: number;

  public actionCost: number;
  public sprite: Text;

  private turnManager: TurnManager;

  private seeingDistance: number;

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

    this.strength = 1;

    this.attackPower = definition.attackPower;

    this.actionCost = 1;

    this.seeingDistance = definition.seeingDistance;

    this.sprite = new Text({
      text: definition.character,
      style: {
        fontFamily: "monospace",
        fontSize: data.TILE_SIZE,
        fontWeight: "bold",
        fill: definition.foreground || 0xffffff,
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

    if (this.isPlayerInRange(this.seeingDistance)) {
      const nextStep = playerDijkstra.getNextStep(this.x, this.y);

      if (this.isPlayerAt(nextStep.x, nextStep.y)) {
        this.attackPlayer();
        return;
      }

      this.tryMoveTo(nextStep.x, nextStep.y);
    } else {
      const target = wander(this.x, this.y);
      this.tryMoveTo(target.x, target.y);
    }
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
    const player = getPlayer();

    player.takeDamage(this.attackPower, this.turnManager);
  }

  private tryMoveTo(targetX: number, targetY: number): void {
    if (
      targetX < 0 ||
      targetX >= data.MAP_WIDTH ||
      targetY < 0 ||
      targetY >= data.MAP_HEIGHT
    ) {
      return;
    }

    const targetTile = data.mapData[targetY][targetX];
    const otherMonster = isOccupied.getMonsterAt(targetX, targetY, this.id);

    if (otherMonster) {
      return;
    }

    if (targetX === getPlayer().x && targetY === getPlayer().y) {
      return;
    }

    if (targetTile && targetTile.walkable) {
      this.x = targetX;
      this.y = targetY;
    }
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
    corpseTile.foreground = "#8B0000";
    corpseTile.walkable = true;

    data.mapData[this.y][this.x] = corpseTile;

    this.sprite.text = corpseTile.character;
    this.sprite.style.fill = corpseTile.foreground;
    this.sprite.zIndex = 1;
  }

  public update(): void {
    const targetX = this.x * data.TILE_SIZE;
    const targetY = this.y * data.TILE_SIZE;

    this.sprite.x += targetX - this.sprite.x;
    this.sprite.y += targetY - this.sprite.y;

    if (Math.abs(targetX - this.sprite.x) < 0.1) this.sprite.x = targetX;
    if (Math.abs(targetY - this.sprite.y) < 0.1) this.sprite.y = targetY;
  }
}
