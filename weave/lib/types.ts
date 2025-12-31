// WEAVE Data Model Types

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  voiceEnabled: boolean
  createdAt: string
}

export interface Group {
  id: string
  name: string
  members: string[] // User IDs
  createdAt: string
}

export interface Thread {
  id: string
  groupId: string
  participants: string[] // User IDs
  title?: string
  lastActivity: string
  unreadCount: number
  importanceScore: number
  mlSummary?: string
  unresolvedCount: number
}

export type MessageType = 'text' | 'voice'

export interface Message {
  id: string
  threadId: string
  senderId: string
  type: MessageType
  content: string
  audioUrl?: string
  waveform?: number[]
  timestamp: string
  entities?: string[] // Entity IDs extracted from this message
}

export type EntityType = 'plan' | 'decision' | 'recommendation' | 'promise' | 'memory'

export type EntityStatus = 
  | 'proposed' 
  | 'confirmed' 
  | 'changed' 
  | 'cancelled' 
  | 'done' 
  | 'pending' 
  | 'resolved'

export interface ExtractedEntity {
  id: string
  type: EntityType
  title: string
  description?: string
  status: EntityStatus
  ownerId: string
  threadId: string
  messageId: string
  createdAt: string
  updatedAt: string
  lastTouchedBy?: string
  metadata?: {
    date?: string
    time?: string
    participants?: string[]
    location?: string
    priority?: 'low' | 'medium' | 'high'
    tags?: string[]
  }
  importanceScore: number
  voiceSummaryUrl?: string
}

export interface SearchResult {
  id: string
  type: 'entity' | 'message' | 'voice'
  title: string
  snippet: string
  confidence: number
  whyReturned: string
  sourceThreadId: string
  sourceMessageId?: string
  entityId?: string
  timestamp: string
}

export interface ActivityItem {
  id: string
  type: 'decision_made' | 'item_resolved' | 'memory_resurfaced' | 'nudge_sent'
  entityId?: string
  threadId: string
  messageId?: string
  userId: string
  description: string
  timestamp: string
  importance: number
}

export interface LibraryFilter {
  type?: EntityType[]
  status?: EntityStatus[]
  ownerId?: string
  timeframe?: 'day' | 'week' | 'month' | 'all'
}

