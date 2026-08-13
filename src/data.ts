import type * as types from "./types/types.d.ts";

const TILE_SIZE: number = 32;

const playerState: { x: number; y: number } = {
  x: 0,
  y: 0,
};

let MAP_WIDTH: number = 0;
export function setMapWidth(width: number): void {
  MAP_WIDTH = width;
}

let MAP_HEIGHT: number = 0;
export function setMapHeight(height: number): void {
  MAP_HEIGHT = height;
}

const mapData: types.TileDefinition[][] = [];

export { TILE_SIZE, playerState, MAP_WIDTH, MAP_HEIGHT, mapData };
