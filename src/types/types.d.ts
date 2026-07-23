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
