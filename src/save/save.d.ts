export interface SavedPlayerState {
  id: string;
  name: string;
  className: string;
  classKey: "warrior" | "mage" | "rogue";
  level: number;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  stamina: number;
  maxStamina: number;
  speed: number;
  attackPower: number;
  defense: number;
  skillKeys: string[];
  spellKeys: string[];
}
