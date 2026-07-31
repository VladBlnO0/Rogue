import tileDefs from "../data/tile/tiles.json" with { type: "json" };
import monsterDefs from "../data/entities/monsters.json" with { type: "json" };
import * as data from "./data.ts";
import type * as types from "./types/types.d.ts";

export const TILES: Record<string, types.TileDefinition> = tileDefs;
export const MONSTERS: Record<string, types.MonsterDefinition> = monsterDefs;

export function loadLevel(level: types.LevelJSON): void {
  if (!level || !level.layout) {
    console.error("Invalid level data passed to loadLevel:", level);
    return;
  }

  data.setMapWidth(level.width);
  data.setMapHeight(level.height);

  if (level.playerStart) {
    data.playerState.x = level.playerStart.x;
    data.playerState.y = level.playerStart.y;
  }

  data.mapData.length = 0;

  for (let y = 0; y < level.height; y++) {
    const row: types.TileDefinition[] = [];
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
