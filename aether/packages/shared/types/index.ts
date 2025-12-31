// Shared types for AETHER
export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface ChunkID {
  chunkX: number;
  chunkY: number;
  chunkZ: number;
}

export interface User {
  id: string;
  position: Position;
  chunkID: ChunkID;
  username?: string;
}

export interface Asset {
  id: string;
  type: string;
  position: Position;
  scale: Position;
  color?: string;
  meshData?: string; // Base64 or reference to mesh
  createdAt: number;
  createdBy: string;
}

export interface WorldState {
  users: Map<string, User>;
  assets: Map<string, Asset>;
  chunks: Map<string, Set<string>>; // ChunkID -> Set of user IDs
}

export interface WebSocketMessage {
  type: 'position_update' | 'asset_spawn' | 'user_join' | 'user_leave' | 'chunk_change';
  payload: any;
  timestamp: number;
  userId: string;
}

export interface GenerateAssetRequest {
  prompt: string;
  position: Position;
  userId: string;
  chunkID: ChunkID;
}

export interface GenerateAssetResponse {
  assetId: string;
  asset: Asset;
  audioUrl?: string;
}

export interface OpenAIResponse {
  type: string;
  scale: { x: number; y: number; z: number };
  color: string;
  description: string;
}

export const CHUNK_SIZE = 100; // Units per chunk
export const SPATIAL_HASH_PRECISION = 1; // Round positions to this precision


