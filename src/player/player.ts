import * as data from "../data.ts";
import type { TurnManager } from "../turnManager.ts";

import type * as types from "../types/types.d.ts";
import type { SavedPlayerState } from "../save/save.d.ts";

import classDefs from "../../data/player/classes.json" with { type: "json" };
import skillDefs from "../../data/player/skills.json" with { type: "json" };
import spellDefs from "../../data/player/spells.json" with { type: "json" };
import { Class } from "../types/class.ts";
import { updateHUD } from "../ui.ts";

export const CLASSES: Record<string, types.ClassDefinition> = classDefs;
export const SKILLS: Record<string, types.SkillDefinition> = skillDefs;
export const SPELLS: Record<string, types.SpellDefinition> = spellDefs;

export class Player {
  public id: string;
  public name: string;

  public classKey: "warrior" | "mage" | "rogue";
  public className: string;

  public level: number;

  public x: number;
  public y: number;

  public hp: number;
  public maxHp: number;

  public mana: number;
  public maxMana: number;

  public stamina: number;
  public maxStamina: number;

  public speed: number;

  public attackPower: number;
  public defense: number;

  public skills: Map<string, types.SkillDefinition> = new Map();
  public spells: Map<string, types.SpellDefinition> = new Map();

  constructor(
    id: string,
    name: string,
    classKey: "warrior" | "mage" | "rogue",
    startX: number,
    startY: number,
  ) {
    const classData = CLASSES[classKey] as types.ClassDefinition;

    this.id = id;
    this.name = name;
    this.className = classData.name;
    this.level = 1;

    this.x = startX;
    this.y = startY;

    this.hp = classData.hp;
    this.maxHp = classData.hp;

    this.mana = classData.mana;
    this.maxMana = classData.mana;

    this.stamina = classData.stamina;
    this.maxStamina = classData.stamina;

    this.speed = classData.speed;

    this.attackPower = classData.attackPower;
    this.defense = classData.defense;

    for (const skillKey of classData.startingSkills) {
      if (SKILLS[skillKey]) {
        this.skills.set(skillKey, SKILLS[skillKey]);
      } else {
        console.warn(`Skill "${skillKey}" not found in skills.json`);
      }
    }

    if (classData.startingSpells) {
      for (const spellKey of classData.startingSpells) {
        if (SPELLS[spellKey]) {
          this.spells.set(spellKey, SPELLS[spellKey]);
        } else {
          console.warn(`Spell "${spellKey}" not found in spells.json`);
        }
      }
    }

    console.log(
      `Initialized ${this.name} (${this.className}) with ${this.skills.size} skills and ${this.spells.size} spells.`,
    );
  }

  public hasSkill(skillKey: string): boolean {
    return this.skills.has(skillKey);
  }

  public hasSpell(spellKey: string): boolean {
    return this.spells.has(spellKey);
  }

  public takeDamage(amount: number, turnManager: TurnManager): void {
    const actualDamage = amount - this.defense;

    // HP doesn't go below 0
    const damage = (this.hp -= actualDamage);
    if (damage < 0) {
      this.hp = 0;
    }

    console.log(
      `Player took ${actualDamage} damage! (${this.hp}/${this.maxHp} HP left)`,
    );

    updateHUD();

    if (this.hp <= 0) {
      this.die(turnManager);
    }
  }

  public die(turnManager: TurnManager): void {
    console.log("GAME OVER! You have been slain.");
    turnManager.gameOver();

    // if (this.sprite) {
    //   this.sprite.destroy();
    // }

    const corpseTile = data.mapData[this.y][this.x];
    corpseTile.character = "%";
    corpseTile.foreground = "#8B0000";
    corpseTile.walkable = true;

    data.mapData[this.y][this.x] = corpseTile;

    // this.sprite.text = corpseTile.character;
    // this.sprite.style.fill = corpseTile.foreground;
    // this.sprite.zIndex = 1;
  }

  public toJSON(): SavedPlayerState {
    return {
      id: this.id,
      name: this.name,
      className: this.className,
      classKey: this.classKey,
      level: this.level,
      x: this.x,
      y: this.y,
      hp: this.hp,
      maxHp: this.maxHp,
      mana: this.mana,
      maxMana: this.maxMana,
      stamina: this.stamina,
      maxStamina: this.maxStamina,
      speed: this.speed,
      attackPower: this.attackPower,
      defense: this.defense,

      skillKeys: Array.from(this.skills.keys()),
      spellKeys: Array.from(this.spells.keys()),
    };
  }
  public static fromJSON(savedData: SavedPlayerState): Player {
    const player = new Player(
      savedData.id,
      savedData.name,
      savedData.classKey,
      savedData.x,
      savedData.y,
    );

    player.level = savedData.level;
    player.hp = savedData.hp;
    player.maxHp = savedData.maxHp;
    player.mana = savedData.mana;
    player.maxMana = savedData.maxMana;
    player.stamina = savedData.stamina;
    player.maxStamina = savedData.maxStamina;
    player.speed = savedData.speed;
    player.attackPower = savedData.attackPower;
    player.defense = savedData.defense;

    player.skills.clear();
    for (const key of savedData.skillKeys) {
      if (SKILLS[key]) player.skills.set(key, SKILLS[key]);
    }

    player.spells.clear();
    for (const key of savedData.spellKeys) {
      if (SPELLS[key]) player.spells.set(key, SPELLS[key]);
    }

    return player;
  }
}

let activePlayer: Player | null = null;

export function getPlayer(): Player {
  if (!activePlayer) {
    activePlayer = new Player(
      "player",
      "Hero",
      Class.warrior,
      data.playerState.x,
      data.playerState.y,
    );
  }
  return activePlayer;
}

export function createPlayer(
  name: string,
  classKey: "warrior" | "mage" | "rogue",
  startX: number,
  startY: number,
): Player {
  activePlayer = new Player("player", name, classKey, startX, startY);
  data.playerState.x = startX;
  data.playerState.y = startY;
  return activePlayer;
}

export function loadSavedPlayer(savedState: SavedPlayerState): Player {
  activePlayer = Player.fromJSON(savedState);
  data.playerState.x = activePlayer.x;
  data.playerState.y = activePlayer.y;
  return activePlayer;
}
