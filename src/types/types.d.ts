export interface TileDefinition {
  id: number;
  name: string;
  character: string;
  tint: string;
  walkable: boolean;
  transparent: boolean;
  description: string;
}

export interface MonsterDefinition {
  id: string;
  name: string;
  character: string;
  tint: string;
  hp: number;
  speed: number;
  attackPower: number;
  ai: string;
}

export interface LevelJSON {
  name: string;
  width: number;
  height: number;
  layout: string[];
  legend: Record<string, string>;
  entities?: { type: string; x: number; y: number }[];
}

export interface Entity {
  id: string;
  isPlayer: boolean;
  speed: number;
  energy: number;
  takeTurn: () => void;
}
