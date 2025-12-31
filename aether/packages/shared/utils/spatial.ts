import { Position, ChunkID, CHUNK_SIZE } from '../types';

/**
 * Convert world position to ChunkID
 * Uses spatial hashing to group nearby users
 */
export function positionToChunkID(position: Position): ChunkID {
  return {
    chunkX: Math.floor(position.x / CHUNK_SIZE),
    chunkY: Math.floor(position.y / CHUNK_SIZE),
    chunkZ: Math.floor(position.z / CHUNK_SIZE),
  };
}

/**
 * Convert ChunkID to string key for Map lookup
 */
export function chunkIDToString(chunkID: ChunkID): string {
  return `${chunkID.chunkX},${chunkID.chunkY},${chunkID.chunkZ}`;
}

/**
 * Get all neighboring chunks (for broadcasting to nearby chunks)
 */
export function getNeighboringChunks(chunkID: ChunkID): ChunkID[] {
  const neighbors: ChunkID[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dz = -1; dz <= 1; dz++) {
        neighbors.push({
          chunkX: chunkID.chunkX + dx,
          chunkY: chunkID.chunkY + dy,
          chunkZ: chunkID.chunkZ + dz,
        });
      }
    }
  }
  return neighbors;
}

/**
 * Check if two positions are in the same chunk
 */
export function areInSameChunk(pos1: Position, pos2: Position): boolean {
  const chunk1 = positionToChunkID(pos1);
  const chunk2 = positionToChunkID(pos2);
  return (
    chunk1.chunkX === chunk2.chunkX &&
    chunk1.chunkY === chunk2.chunkY &&
    chunk1.chunkZ === chunk2.chunkZ
  );
}


