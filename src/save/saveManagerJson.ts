import { getPlayer, loadSavedPlayer } from "../player/player.ts";
import { updateHUD } from "../ui.ts";

import type { SavedPlayerState } from "../save/save.d.ts";

/**
 * Exports player state to a downloadable JSON file on the player's PC
 */
export function exportPlayerSaveFile(): void {
  const player = getPlayer();
  const saveData = player.toJSON();
  const jsonString = JSON.stringify(saveData, null, 2);

  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${player.name.toLowerCase()}_save.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  console.log("Save file exported successfully!");
}

/**
 * Opens a file picker dialog and loads a player JSON file from the PC
 */
export function importPlayerSaveFile(): Promise<boolean> {
  return new Promise((resolve) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json,application/json";

    fileInput.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];

      console.log("Selected file:", file?.name, file?.size, file?.type);
      console.dir(file);

      if (!file) {
        resolve(false);
        return;
      }

      try {
        const text = await file.text();
        const savedState: SavedPlayerState = JSON.parse(text);

        // Validate basic save schema
        if (!savedState.id || !savedState.classKey) {
          throw new Error("Invalid player save file format.");
        }

        loadSavedPlayer(savedState);
        updateHUD();
        console.log(`Loaded save file: ${file.name}`);
        resolve(true);
      } catch (err) {
        console.error("Failed to load save file:", err);
        alert("Invalid save file!");
        resolve(false);
      }
    };

    fileInput.click();
  });
}
