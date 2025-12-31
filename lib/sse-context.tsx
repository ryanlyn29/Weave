'use client'

import { createContext, useContext, useEffect, useState, useCallback, useRef, ReactNode } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { config } from './config'

/**
 * SSE Event types
 */
export type SSEEventType = 'connected' | 'message_created' | 'entity_extracted' | 'thread_updated'

/**
 * SSE Event handler function type
 */
export type SSEEventHandler = (event: SSEEventType, data: any) => void

/**
 * SSE Context for real-time updates
 */
interface SSEContextType {
  isConnected: boolean
  subscribe: (eventType: SSEEventType, handler: SSEEventHandler) => () => void
  unsubscribe: (eventType: SSEEventType, handler: SSEEventHandler) => void
}

const SSEContext = createContext<SSEContextType | undefined>(undefined)

/**
 * Hook to access SSE context
 */
export function useSSE() {
  const context = useContext(SSEContext)
  if (!context) {
    throw new Error('useSSE must be used within SSEProvider')
  }
  return context
}

/**
 * SSE Provider component
 * Manages the SSE connection and event subscriptions
 */
export function SSEProvider({ children }: { children: ReactNode }) {
  const { authReady, user } = useAuth()
  const [isConnected, setIsConnected] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const sseDisabledRef = useRef(false) // Track if SSE was disabled due to 404
  
  // Map of eventType -> Set of handlers (use ref to avoid re-renders)
  const handlersRef = useRef<Map<SSEEventType, Set<SSEEventHandler>>>(new Map())

  /**
   * Subscribe to an event type
   */
  const subscribe = useCallback((eventType: SSEEventType, handler: SSEEventHandler) => {
    if (!handlersRef.current.has(eventType)) {
      handlersRef.current.set(eventType, new Set())
    }
    handlersRef.current.get(eventType)!.add(handler)

    // Return unsubscribe function
    return () => {
      const handlersForType = handlersRef.current.get(eventType)
      if (handlersForType) {
        handlersForType.delete(handler)
        if (handlersForType.size === 0) {
          handlersRef.current.delete(eventType)
        }
      }
    }
  }, [])

  /**
   * Unsubscribe from an event type
   */
  const unsubscribe = useCallback((eventType: SSEEventType, handler: SSEEventHandler) => {
    const handlersForType = handlersRef.current.get(eventType)
    if (handlersForType) {
      handlersForType.delete(handler)
      if (handlersForType.size === 0) {
        handlersRef.current.delete(eventType)
      }
    }
  }, [])

  /**
   * Connect to SSE endpoint
   */
  useEffect(() => {
    // Check if SSE is enabled via feature flag
    if (!config.sse.enabled) {
      if (process.env.NODE_ENV === 'development') {
        console.info('[SSE] Disabled via feature flag — skipping connection')
      }
      return
    }

    // If SSE was disabled due to 404, don't retry
    if (sseDisabledRef.current) {
      return
    }

    // Only connect if auth is ready and user is authenticated
    if (!authReady || !user) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
        abortControllerRef.current = null
        setIsConnected(false)
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
        reconnectTimeoutRef.current = null
      }
      return
    }

    // Get auth token for SSE connection
    const connect = async () => {
      // Abort existing connection if any
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      
      const controller = new AbortController()
      abortControllerRef.current = controller
      
      try {
        // Get Firebase ID token
        const { getFirebaseIdToken } = await import('./firebase-auth')
        const token = await getFirebaseIdToken()
        
        if (!token) {
          console.warn('[SSE] No auth token, cannot connect')
          return
        }

        // Use fetch + ReadableStream for SSE with auth headers
        const response = await fetch(`${config.api.baseUrl}/v1/stream`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'text/event-stream',
            'Cache-Control': 'no-cache',
          },
          credentials: 'include',
          signal: controller.signal,
        })

        if (!response.ok) {
          // Handle 404 specifically - endpoint not available
          if (response.status === 404) {
            console.warn('[SSE] Endpoint not available (404) — disabling SSE for this session')
            sseDisabledRef.current = true
            setIsConnected(false)
            return
          }
          throw new Error(`SSE connection failed: ${response.status}`)
        }

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        if (!reader) {
          throw new Error('No response body reader available')
        }

        setIsConnected(true)

        // Read SSE stream
        let buffer = ''
        
        while (true) {
          const { done, value } = await reader.read()
          
          if (done) {
            setIsConnected(false)
            break
          }

          buffer += decoder.decode(value, { stream: true })
          const events = buffer.split('\n\n') // SSE events are separated by double newline
          
          // Keep last incomplete event in buffer
          buffer = events.pop() || ''

          for (const eventText of events) {
            if (!eventText.trim()) continue
            
            let eventType: string = 'message'
            let data: string = ''
            
            const lines = eventText.split('\n')
            for (const line of lines) {
              if (line.startsWith('event: ')) {
                eventType = line.substring(7).trim()
              } else if (line.startsWith('data: ')) {
                // Support multi-line data
                if (data) data += '\n'
                data += line.substring(6)
              }
            }
            
            const dataStr = data.trim()
            if (dataStr) {
              try {
                const parsedData = JSON.parse(dataStr)
                const handlersForType = handlersRef.current.get(eventType as SSEEventType)
                if (handlersForType) {
                  handlersForType.forEach(handler => {
                    try {
                      handler(eventType as SSEEventType, parsedData)
                    } catch (err) {
                      console.error('[SSE] Error in event handler:', err)
                    }
                  })
                }
              } catch (err) {
                console.error('[SSE] Failed to parse event data:', err, dataStr)
              }
            }
          }
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          // Connection was aborted intentionally
          return
        }
        
        // Check if it's a 404 error from fetch
        if (error instanceof TypeError && error.message.includes('fetch')) {
          // Network error - could be backend offline, but don't disable SSE
          console.warn('[SSE] Network error — backend may be offline')
        } else {
          console.error('[SSE] Connection error:', error)
        }
        
        setIsConnected(false)
        
        // Don't retry if SSE was disabled (e.g., due to 404)
        if (sseDisabledRef.current) {
          return
        }
        
        // Retry connection after 5 seconds (if not aborted and not disabled)
        if (!controller.signal.aborted && authReady && user && !sseDisabledRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            if (authReady && user && !controller.signal.aborted && !sseDisabledRef.current) {
              connect()
            }
          }, 5000)
        }
      }
    }

    connect()

    // Cleanup on unmount or when auth changes
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
        abortControllerRef.current = null
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
        reconnectTimeoutRef.current = null
      }
      setIsConnected(false)
    }
  }, [authReady, user, config.sse.enabled])

  return (
    <SSEContext.Provider value={{ isConnected, subscribe, unsubscribe }}>
      {children}
    </SSEContext.Provider>
  )
}
