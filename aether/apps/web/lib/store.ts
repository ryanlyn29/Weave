import { create } from 'zustand'
import { Position, User, Asset, ChunkID } from '../../../packages/shared/types'

interface AetherState {
  // Current user
  currentUser: User | null
  userId: string | null
  
  // World state
  users: Map<string, User>
  assets: Map<string, Asset>
  
  // Connection
  isConnected: boolean
  currentChunk: ChunkID | null
  
  // Actions
  setCurrentUser: (user: User) => void
  setUserId: (id: string) => void
  updateUser: (userId: string, position: Position) => void
  addUser: (user: User) => void
  removeUser: (userId: string) => void
  addAsset: (asset: Asset) => void
  setConnected: (connected: boolean) => void
  setCurrentChunk: (chunk: ChunkID) => void
}

export const useAetherStore = create<AetherState>((set) => ({
  currentUser: null,
  userId: null,
  users: new Map(),
  assets: new Map(),
  isConnected: false,
  currentChunk: null,
  
  setCurrentUser: (user) => set({ currentUser: user }),
  setUserId: (id) => set({ userId: id }),
  
  updateUser: (userId, position) =>
    set((state) => {
      const newUsers = new Map(state.users)
      const user = newUsers.get(userId)
      if (user) {
        newUsers.set(userId, { ...user, position })
      }
      return { users: newUsers }
    }),
  
  addUser: (user) =>
    set((state) => {
      const newUsers = new Map(state.users)
      newUsers.set(user.id, user)
      return { users: newUsers }
    }),
  
  removeUser: (userId) =>
    set((state) => {
      const newUsers = new Map(state.users)
      newUsers.delete(userId)
      return { users: newUsers }
    }),
  
  addAsset: (asset) =>
    set((state) => {
      const newAssets = new Map(state.assets)
      newAssets.set(asset.id, asset)
      return { assets: newAssets }
    }),
  
  setConnected: (connected) => set({ isConnected: connected }),
  setCurrentChunk: (chunk) => set({ currentChunk: chunk }),
}))


