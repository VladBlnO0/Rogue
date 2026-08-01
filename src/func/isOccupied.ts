import * as data from "../data.ts";
import { activeMonsters } from "../entity.ts";
import type { Monster } from "../npc/monster.ts";
import { getPlayer } from "../player/player.ts";

export function getMonsterAt(
  x: number,
  y: number,
  excludeId?: string,
): Monster | undefined {
  return activeMonsters.find(
    (m) => m.x === x && m.y === y && m.id !== excludeId,
  );
}

export function isTileOccupied(x: number, y: number): boolean {
  if (getPlayer().x === x && getPlayer().y === y) return true;
  return getMonsterAt(x, y) !== undefined;
}
