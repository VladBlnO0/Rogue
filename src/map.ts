import tileDefs from "../data/tile/tiles.json" with { type: "json" };
import monsterDefs from "../data/entities/monsters.json" with { type: "json" };
import * as data from "./data.ts";
import type { TileDefinition, MonsterDefinition } from "./types/types.d.ts";

export const TILES: Record<string, TileDefinition> = tileDefs;
export const MONSTERS: Record<string, MonsterDefinition> = monsterDefs;

export interface LevelJSON {
  name: string;
  width: number;
  height: number;
  layout: string[];
  legend: Record<string, string>;
  entities?: { type: string; x: number; y: number }[];
}

export function loadLevel(level: LevelJSON): void {
  if (!level || !level.layout) {
    console.error("Invalid level data passed to loadLevel:", level);
    return;
  }

  data.setMapWidth(level.width);
  data.setMapHeight(level.height);

  data.mapData.length = 0;

  for (let y = 0; y < level.height; y++) {
    const row: TileDefinition[] = [];
    const rowString = level.layout[y];

    for (let x = 0; x < level.width; x++) {
      const char: string = rowString[x];
      const tileKey = level.legend[char] || "floor";
      const tileData = TILES[tileKey];

      if (!tileData) {
        console.warn(
          `Missing tile definition for key: "${tileKey}" (char: "${char}")`,
        );
      }

      row.push(tileData);
    }
    data.mapData.push(row);
  }

  console.log(`Successfully loaded level: ${level.name}`);
}
