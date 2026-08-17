// src/saveManager.ts
import { getPlayer, loadSavedPlayer } from "../player/player.ts";
import type { SavedPlayerState } from "../save/save.d.ts";

const SAVE_KEY = "roguelike_player_save";

/**
 * Saves current player state to localStorage
 */
export function savePlayerGame(): void {
  const player = getPlayer();
  const state = player.toJSON();
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  console.log("Game Saved:", state);
}

/**
 * Loads player state from localStorage if available
 */
export function loadPlayerGame(): boolean {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return false;

  try {
    const savedState: SavedPlayerState = JSON.parse(raw);
    loadSavedPlayer(savedState);
    console.log("Game Loaded Successfully!");
    return true;
  } catch (err) {
    console.error("Failed to parse save data:", err);
    return false;
  }
}
