import { getPlayer } from "./player/player.ts";
import { time } from "./time.ts";

export function updateHUD(): void {
  const player = getPlayer();

  const nameEl = document.getElementById("ui-name");
  const classEl = document.getElementById("ui-class");
  const timeEl = document.getElementById("ui-time");

  const hpEl = document.getElementById("ui-hp");
  const hpFill = document.getElementById("bar-hp-fill");

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

  if (manaEl) manaEl.textContent = `${player.mana}/${player.maxMana}`;
  if (manaFill) {
    const manaPercent = Math.max(0, (player.mana / player.maxMana) * 100);
    manaFill.style.width = `${manaPercent}%`;
  }
}

export function logMessage(message: string): void {
  const logEl = document.getElementById("message-log");
  if (!logEl) return;

  const msgDiv = document.createElement("div");
  msgDiv.textContent = `> ${message}`;
  logEl.appendChild(msgDiv);

  logEl.scrollTop = logEl.scrollHeight;
}

export function showGameOver(): void {
  const overlay = document.getElementById("game-over-overlay");
  if (overlay) {
    overlay.classList.remove("hidden");
  }
}
