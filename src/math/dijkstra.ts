import * as data from "../data.ts";

export class DijkstraMap {
  public grid: number[][] = [];

  /**
   * Recalculates the distance map originating from targetX, targetY (usually player pos)
   */
  public update(targetX: number, targetY: number): void {
    const width = data.MAP_WIDTH;
    const height = data.MAP_HEIGHT;

    // Initialize map with Infinity
    this.grid = Array.from({ length: height }, () =>
      Array(width).fill(Infinity),
    );

    // Queue for Breadth-First Search (BFS)
    const queue: Array<{ x: number; y: number; dist: number }> = [];

    // Target (Player position) starts at 0 distance
    if (targetX >= 0 && targetX < width && targetY >= 0 && targetY < height) {
      this.grid[targetY][targetX] = 0;
      queue.push({ x: targetX, y: targetY, dist: 0 });
    }

    // Standard 8-directional movement offsets
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

    while (queue.length > 0) {
      const { x, y, dist } = queue.shift()!;

      for (const dir of directions) {
        const nx = x + dir.x;
        const ny = y + dir.y;

        // Ensure within map boundaries
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const tile = data.mapData[ny][nx];

          // Only propagate through walkable tiles
          if (tile && tile.walkable) {
            const newDist = dist + 1;

            if (newDist < this.grid[ny][nx]) {
              this.grid[ny][nx] = newDist;
              queue.push({ x: nx, y: ny, dist: newDist });
            }
          }
        }
      }
    }
  }

  /**
   * Given an entity's current position, returns the best adjacent (x, y) move
   * toward the target (lowest distance value).
   */
  public getNextStep(
    currentX: number,
    currentY: number,
  ): { x: number; y: number } {
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

    let bestX = currentX;
    let bestY = currentY;
    let lowestDistance = this.grid[currentY]?.[currentX] ?? Infinity;

    for (const dir of directions) {
      const nx = currentX + dir.x;
      const ny = currentY + dir.y;

      if (nx >= 0 && nx < data.MAP_WIDTH && ny >= 0 && ny < data.MAP_HEIGHT) {
        const tile = data.mapData[ny][nx];
        const dist = this.grid[ny][nx];

        // Check if tile is walkable and closer to player
        if (tile && tile.walkable && dist < lowestDistance) {
          lowestDistance = dist;
          bestX = nx;
          bestY = ny;
        }
      }
    }

    return { x: bestX, y: bestY };
  }
}

export const playerDijkstra = new DijkstraMap();
