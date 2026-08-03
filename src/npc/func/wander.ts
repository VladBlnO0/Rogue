export function wander(x: number, y: number): { x: number; y: number } {
  const directions = [
    { x: 0, y: -1 },
    { x: 0, y: 1 },

    { x: -1, y: 0 },
    { x: 1, y: 0 },

    { x: -1, y: -1 },
    { x: 1, y: -1 },
    { x: -1, y: 1 },
    { x: 1, y: 1 },
  ];

  const randomDir = directions[Math.floor(Math.random() * directions.length)];

  const targetX = x + randomDir.x;
  const targetY = y + randomDir.y;

  return { x: targetX, y: targetY };
}
