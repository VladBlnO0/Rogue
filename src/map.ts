import tileDefs from "../data/tile/tiles.json" with { type: "json" };
import * as data from "./data.ts";
import type * as types from "./types/types.d.ts";

export const TILES: Record<string, types.TileDefinition> = tileDefs;
export const TILES_BY_ID: Map<number, types.TileDefinition> = new Map(
  Object.values(TILES).map((tile) => [tile.id, tile]),
);

export function loadLevel(level: types.LevelJSON): void {
  data.setMapWidth(level.width);
  data.setMapHeight(level.height);
  data.mapData.length = 0;

  for (let y = 0; y < level.height; y++) {
    const row: types.TileDefinition[] = [];
    const rowString = level.layout[y];

    for (let x = 0; x < level.width; x++) {
      const char = rowString[x];
      const tileId: number = level.legend[char] ?? 1;
      const tileData = TILES_BY_ID.get(tileId) || TILES_BY_ID.get(1)!;

      row.push(tileData);
    }
    data.mapData.push(row);
  }
}
