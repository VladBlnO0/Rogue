import { getPlayer } from "./player/player.ts";
import { time } from "./time.ts";

export function updateHUD(): void {
  const player = getPlayer();

  const nameEl = document.getElementById("ui-name");
  const classEl = document.getElementById("ui-class");
  const timeEl = document.getElementById("ui-time");

  const hpEl = document.getElementById("ui-hp");
  const hpFill = document.getElementById("bar-hp-fill");

  const staminaEl = document.getElementById("ui-stamina");
  const staminaFill = document.getElementById("bar-stamina-fill");

  const manaEl = document.getElementById("ui-mana");
  const manaFill = document.getElementById("bar-mana-fill");

  if (nameEl) nameEl.textContent = player.name;
  if (classEl) classEl.textContent = player.className;
  if (timeEl) timeEl.textContent = time.join(":");

  if (hpEl) hpEl.textContent = `${player.hp}/${player.maxHp}`;
  if (hpFill) {
    const hpPercent = Math.max(0, (player.hp / player.maxHp) * 100);
    hpFill.style.width = `${hpPercent}%`;
  }

  if (staminaEl)
    staminaEl.textContent = `${player.stamina}/${player.maxStamina}`;
  if (staminaFill) {
    const staminaPercent = Math.max(
      0,
      (player.stamina / player.maxStamina) * 100,
    );
    staminaFill.style.width = `${staminaPercent}%`;
  }

  if (manaEl) manaEl.textContent = `${player.mana}/${player.maxMana}`;
  if (manaFill) {
    const manaPercent = Math.max(0, (player.mana / player.maxMana) * 100);
    manaFill.style.width = `${manaPercent}%`;
  }
}

export function showGameOver(): void {
  const overlay = document.getElementById("game-over-overlay");
  if (overlay) {
    overlay.classList.remove("hidden");
  }
}
