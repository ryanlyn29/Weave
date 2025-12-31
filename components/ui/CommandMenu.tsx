'use client'

import { useEffect, useState } from 'react'
import { Command } from 'cmdk'
import { useRouter } from 'next/navigation'
import { api, Thread, ExtractedEntity } from '@/lib/api-client'
import { useAuth } from '@/components/auth/AuthProvider'
import { Search, MessageSquare, Library, ArrowRight } from 'lucide-react'

interface CommandMenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  const router = useRouter()
  const { user, authReady } = useAuth()
  const [search, setSearch] = useState('')
  const [threads, setThreads] = useState<Thread[]>([])
  const [entities, setEntities] = useState<ExtractedEntity[]>([])
  const [loading, setLoading] = useState(false)

  // Load threads and entities when menu opens
  useEffect(() => {
    if (open && authReady && user) {
      setLoading(true)
      Promise.all([
        api.getThreads('recent').catch(() => []),
        api.getLibrary({ timeframe: 'all' }).then(res => res?.entities || []).catch(() => []),
      ]).then(([threadsData, libraryData]) => {
        setThreads(threadsData || [])
        setEntities((libraryData as any).entities || [])
        setLoading(false)
      }).catch(() => {
        setLoading(false)
      })
    }
  }, [open, authReady, user])

  const filteredThreads = threads.filter(thread =>
    thread.title?.toLowerCase().includes(search.toLowerCase()) ||
    thread.id.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 5)

  const filteredEntities = entities.filter(entity =>
    entity.title.toLowerCase().includes(search.toLowerCase()) ||
    entity.description?.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 5)

  const handleSelectThread = (threadId: string) => {
    router.push(`/app/thread/${threadId}`)
    onOpenChange(false)
  }

  const handleSelectEntity = (entityId: string) => {
    router.push(`/app/entity/${entityId}`)
    onOpenChange(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50" onClick={() => onOpenChange(false)}>
      <Command className="w-full max-w-2xl bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center border-b border-gray-200 px-4">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <Command.Input
            placeholder="Search threads, entities, or navigate..."
            value={search}
            onValueChange={setSearch}
            className="flex-1 py-3 text-sm outline-none"
            autoFocus
          />
        </div>
        <Command.List className="max-h-[400px] overflow-y-auto p-2">
          {loading ? (
            <Command.Loading>Loading...</Command.Loading>
          ) : (
            <>
              {search.length === 0 && (
                <>
                  <Command.Group heading="Quick Navigation">
                    <Command.Item
                      onSelect={() => {
                        router.push('/app/inbox')
                        onOpenChange(false)
                      }}
                      className="flex items-center gap-2 px-3 py-2 rounded cursor-pointer hover:bg-gray-100"
                    >
                      <MessageSquare className="w-4 h-4 text-gray-500" />
                      <span>Go to Inbox</span>
                    </Command.Item>
                    <Command.Item
                      onSelect={() => {
                        router.push('/app/library')
                        onOpenChange(false)
                      }}
                      className="flex items-center gap-2 px-3 py-2 rounded cursor-pointer hover:bg-gray-100"
                    >
                      <Library className="w-4 h-4 text-gray-500" />
                      <span>Go to Library</span>
                    </Command.Item>
                  </Command.Group>
                </>
              )}

              {filteredThreads.length > 0 && (
                <Command.Group heading="Threads">
                  {filteredThreads.map((thread) => (
                    <Command.Item
                      key={thread.id}
                      onSelect={() => handleSelectThread(thread.id)}
                      className="flex items-center gap-3 px-3 py-2 rounded cursor-pointer hover:bg-gray-100"
                    >
                      <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {thread.title || `Thread ${thread.id.slice(0, 8)}`}
                        </div>
                        {thread.mlSummary && (
                          <div className="text-xs text-gray-500 truncate">{thread.mlSummary}</div>
                        )}
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </Command.Item>
                  ))}
                </Command.Group>
              )}

              {filteredEntities.length > 0 && (
                <Command.Group heading="Entities">
                  {filteredEntities.map((entity) => (
                    <Command.Item
                      key={entity.id}
                      onSelect={() => handleSelectEntity(entity.id)}
                      className="flex items-center gap-3 px-3 py-2 rounded cursor-pointer hover:bg-gray-100"
                    >
                      <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                        <div className={`w-2 h-2 rounded-full ${
                          entity.type === 'decision' ? 'bg-blue-500' :
                          entity.type === 'plan' ? 'bg-green-500' :
                          entity.type === 'promise' ? 'bg-yellow-500' :
                          'bg-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {entity.title}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {entity.type} • {entity.status}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </Command.Item>
                  ))}
                </Command.Group>
              )}

              {search.length > 0 && filteredThreads.length === 0 && filteredEntities.length === 0 && !loading && (
                <Command.Empty className="py-8 text-center text-sm text-gray-500">
                  No results found for "{search}"
                </Command.Empty>
              )}
            </>
          )}
        </Command.List>
      </Command>
    </div>
  )
}
