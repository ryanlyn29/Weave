import { getFirebaseIdToken } from './firebase-auth';
import { getFirebaseAuth } from './firebase';
import { config } from './config';

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message?: string
  ) {
    super(message || `API Error: ${status} ${statusText}`);
    this.name = 'ApiError';
  }
}

export class BackendOfflineError extends Error {
  constructor() {
    super('Backend is offline or unreachable');
    this.name = 'BackendOfflineError';
  }
}

export class AuthNotReadyError extends Error {
  constructor() {
    super('Auth is not ready yet');
    this.name = 'AuthNotReadyError';
  }
}

let backendHealthCache: { isHealthy: boolean; timestamp: number } | null = null;
const HEALTH_CACHE_TTL = 5000;

async function checkBackendHealth(): Promise<boolean> {
  if (backendHealthCache && Date.now() - backendHealthCache.timestamp < HEALTH_CACHE_TTL) {
    return backendHealthCache.isHealthy;
  }

  try {
    const response = await fetch(`${config.api.baseUrl}/v1/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(2000),
    });

    const isHealthy = response.ok;
    backendHealthCache = { isHealthy, timestamp: Date.now() };
    return isHealthy;
  } catch (error) {
    backendHealthCache = { isHealthy: false, timestamp: Date.now() };
    return false;
  }
}

async function getAuthToken(): Promise<string | null> {
  try {
    return await getFirebaseIdToken();
  } catch (error) {
    return null;
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  requireAuth: boolean = true
): Promise<T | null> {
  const url = `${config.api.baseUrl}${endpoint}`;

  if (requireAuth) {
    const token = await getAuthToken();
    if (!token) {
      return null;
    }
  }

  const isHealthy = await checkBackendHealth();
  if (!isHealthy) {
    console.warn('[API] Backend offline, skipping request:', endpoint);
    throw new BackendOfflineError();
  }

  let token: string | null = null;
  if (requireAuth) {
    token = await getAuthToken();
    if (!token) {
      console.info('[API] Skipping API request: user not authenticated:', endpoint);
      return null;
    }
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    if (process.env.NODE_ENV === 'development') {
      console.log('[API] Request with auth token:', endpoint);
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        console.warn('[API] Unauthorized (401):', endpoint);
        throw new ApiError(response.status, response.statusText, 'Authentication required');
      }
      if (response.status === 403) {
        console.warn('[API] Forbidden (403):', endpoint);
        throw new ApiError(response.status, response.statusText, 'Access denied');
      }
      if (response.status === 503 || response.status === 502) {
        console.warn('[API] Backend unavailable:', endpoint);
        backendHealthCache = { isHealthy: false, timestamp: Date.now() };
        throw new BackendOfflineError();
      }

      const errorText = await response.text().catch(() => '');
      throw new ApiError(
        response.status,
        response.statusText,
        errorText || undefined
      );
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const json = await response.json();
      return json;
    }

    return {} as T;
  } catch (error) {
    if (error instanceof ApiError || error instanceof BackendOfflineError) {
      throw error;
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('[API] Network error:', endpoint, error);
      backendHealthCache = { isHealthy: false, timestamp: Date.now() };
      throw new BackendOfflineError();
    }

    console.error('[API] Unknown error:', endpoint, error);
    throw error;
  }
}

export const api = {
  async checkHealth() {
    return apiRequest<{ status: string; timestamp: string; version: string }>('/v1/health', {}, false);
  },

  async getCurrentUser() {
    return apiRequest<User>('/v1/users/me');
  },

  async getThreads(sort?: string): Promise<Thread[] | null> {
    const params = sort ? `?sort=${sort}` : '';
    return apiRequest<Thread[]>(`/v1/threads${params}`);
  },

  async getThread(id: string): Promise<ThreadDTO | null> {
    return apiRequest<ThreadDTO>(`/v1/threads/${id}`);
  },

  async createThread(request: CreateThreadRequest): Promise<SendMessageResponse | null> {
    return apiRequest<SendMessageResponse>('/v1/threads', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse | null> {
    return apiRequest<SendMessageResponse>('/v1/messages/send', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  async getMessages(threadId: string): Promise<MessageDTO[] | null> {
    return apiRequest<MessageDTO[]>(`/v1/messages?threadId=${threadId}`);
  },

  async extractEntities(messageId: string, content: string): Promise<ExtractEntitiesResponse | null> {
    return apiRequest<ExtractEntitiesResponse>('/v1/entities/extract', {
      method: 'POST',
      body: JSON.stringify({ messageId, content }),
    });
  },

  async getLibrary(timeframe?: string, type?: string, status?: string): Promise<LibraryResponse | null> {
    const params = new URLSearchParams();
    if (timeframe) params.append('timeframe', timeframe);
    if (type) params.append('type', type);
    if (status) params.append('status', status);
    const query = params.toString();
    return apiRequest<LibraryResponse>(`/v1/library${query ? '?' + query : ''}`);
  },

  async search(query: string): Promise<SearchResultDTO[] | null> {
    return apiRequest<SearchResultDTO[]>(`/v1/search?q=${encodeURIComponent(query)}`);
  },

  async getActivity(timeframe?: string): Promise<ActivityItemDTO[] | null> {
    const params = timeframe ? `?timeframe=${timeframe}` : '';
    return apiRequest<ActivityItemDTO[]>(`/v1/activity${params}`);
  },

  async getNotifications(): Promise<NotificationDTO[] | null> {
    return apiRequest<NotificationDTO[]>('/v1/notifications');
  },

  async markNotificationRead(notificationId: string): Promise<void | null> {
    return apiRequest<void>(`/v1/notifications/${notificationId}/read`, {
      method: 'POST',
    });
  },

  async markThreadRead(threadId: string): Promise<void | null> {
    return apiRequest<void>(`/v1/threads/${threadId}/read`, {
      method: 'POST',
    });
  },

  async updateThreadStatus(threadId: string, status: string): Promise<ThreadDTO | null> {
    return apiRequest<ThreadDTO>(`/v1/threads/${threadId}/status?status=${status}`, {
      method: 'PUT',
    });
  },

  async generateVoice(text: string): Promise<{ audioUrl: string } | null> {
    return apiRequest<{ audioUrl: string }>('/v1/voice/generate', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },

  async completeOnboarding(data: OnboardingData): Promise<void | null> {
    return apiRequest<void>('/v1/onboarding/complete', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async createEntityLink(request: CreateEntityLinkRequest): Promise<EntityRelationshipDTO | null> {
    return apiRequest<EntityRelationshipDTO>('/v1/entities/link', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  async deleteEntityLink(linkId: string): Promise<void | null> {
    return apiRequest<void>(`/v1/entities/link/${linkId}`, {
      method: 'DELETE',
    });
  },

  async getEntityRelationships(entityId: string): Promise<EntityRelationshipDTO[] | null> {
    return apiRequest<EntityRelationshipDTO[]>(`/v1/entities/${entityId}/graph`);
  },

  async getOutgoingRelationships(entityId: string): Promise<EntityRelationshipDTO[] | null> {
    return apiRequest<EntityRelationshipDTO[]>(`/v1/entities/${entityId}/graph?direction=outgoing`);
  },

  async getIncomingRelationships(entityId: string): Promise<EntityRelationshipDTO[] | null> {
    return apiRequest<EntityRelationshipDTO[]>(`/v1/entities/${entityId}/graph?direction=incoming`);
  },

  async uploadAudio(file: File): Promise<{ url: string } | null> {
    const formData = new FormData();
    formData.append('audio', file);

    try {
      const token = await getAuthToken();
      if (!token) {
        return null;
      }

      const isHealthy = await checkBackendHealth();
      if (!isHealthy) {
        throw new BackendOfflineError();
      }

      const response = await fetch(`${config.api.baseUrl}/v1/files/upload-audio`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new ApiError(response.status, response.statusText);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError || error instanceof BackendOfflineError) {
        throw error;
      }
      console.error('[API] Error uploading audio:', error);
      throw error;
    }
  },

  async uploadFile(file: File): Promise<FileAttachment | null> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = await getAuthToken();
      if (!token) {
        return null;
      }

      const isHealthy = await checkBackendHealth();
      if (!isHealthy) {
        throw new BackendOfflineError();
      }

      const response = await fetch(`${config.api.baseUrl}/v1/files/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new ApiError(response.status, response.statusText);
      }

      const result = await response.json();
      return {
        url: result.url,
        filename: result.filename,
        size: result.size,
        type: result.type,
      };
    } catch (error) {
      if (error instanceof ApiError || error instanceof BackendOfflineError) {
        throw error;
      }
      console.error('[API] Error uploading file:', error);
      throw error;
    }
  },
};

export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}

export interface Thread {
  id: string;
  groupId: string;
  participants: string[];
  title?: string;
  lastActivity: string;
  unreadCount: number;
  importanceScore: number;
  mlSummary?: string;
  unresolvedCount: number;
  status?: string;
}

export interface ThreadDTO {
  id: string;
  groupId: string;
  participants: string[];
  title?: string;
  lastActivity: string;
  unreadCount: number;
  importanceScore: number;
  mlSummary?: string;
  unresolvedCount: number;
  status?: string;
}

export interface CreateThreadRequest {
  title?: string;
  content?: string;
  isGroupChat?: boolean;
  participantIds?: string[];
}

export interface SendMessageRequest {
  threadId: string;
  type: string;
  content?: string;
  audioUrl?: string;
  fileAttachments?: FileAttachment[];
  tags?: string[];
  context?: string;
  commentary?: string;
  calendarEvent?: CalendarEvent;
}

export interface SendMessageResponse {
  message: MessageDTO;
  extractedEntities: ExtractedEntityDTO[];
  thread: ThreadDTO;
}

export interface MessageDTO {
  id: string;
  threadId: string;
  senderId: string;
  type: string;
  content?: string;
  audioUrl?: string;
  fileAttachments?: FileAttachment[];
  timestamp: string;
}

export interface FileAttachment {
  url: string;
  filename: string;
  size: number;
  type: string;
}

export interface CalendarEvent {
  title: string;
  startTime: string;
  endTime: string;
  location?: string;
}

export interface ExtractEntitiesResponse {
  entities: ExtractedEntityDTO[];
}

export interface ExtractedEntityDTO {
  id: string;
  title: string;
  description?: string;
  type: string;
  status?: string;
  metadata?: EntityMetadataDTO;
}

export interface EntityMetadataDTO {
  sourceMessageId?: string;
  sourceThreadId?: string;
  confidence?: number;
  extractedAt?: string;
}

export interface LibraryResponse {
  entities: ExtractedEntityDTO[];
  total: number;
}

export interface SearchResultDTO {
  id: string;
  type: 'thread' | 'message' | 'entity';
  title: string;
  snippet?: string;
  relevanceScore?: number;
}

export interface ActivityItemDTO {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  threadId?: string;
  entityId?: string;
}

export interface NotificationDTO {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  threadId?: string;
  entityId?: string;
}

export interface OnboardingData {
  name?: string;
  preferences?: Record<string, any>;
}

export interface CreateEntityLinkRequest {
  sourceEntityId: string;
  targetEntityId: string;
  linkType: string;
}

export interface EntityRelationshipDTO {
  id: string;
  sourceEntityId: string;
  targetEntityId: string;
  linkType: string;
  createdAt: string;
}
