'use client'

import { ExtractedEntity, mockUsers, mockThreads } from '@/lib/mockData'

function formatDistanceToNow(date: Date, options?: { addSuffix?: boolean }): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  return date.toLocaleDateString()
}
import Link from 'next/link'

interface LibraryTableProps {
  entities: ExtractedEntity[]
}

export function LibraryTable({ entities }: LibraryTableProps) {
  const getOwnerName = (ownerId: string) => {
    return mockUsers.find(u => u.id === ownerId)?.name || 'Unknown'
  }

  const getThreadTitle = (threadId: string) => {
    return mockThreads.find(t => t.id === threadId)?.title || 'Thread'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'done':
        return 'bg-success/20 text-success'
      case 'pending':
        return 'bg-warning/20 text-warning'
      case 'cancelled':
        return 'bg-gray-100 text-gray-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  if (entities.length === 0) {
    return (
      <div className="text-center py-12 text-sm text-gray-500">
        No items found
      </div>
    )
  }

  return (
    <div className="bg-white rounded-bubble-lg border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Title</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Type</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Owner</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Status</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Last Touched</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Source</th>
          </tr>
        </thead>
        <tbody>
          {entities.map((entity) => (
            <tr key={entity.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="text-sm font-medium text-gray-900">{entity.title}</div>
                {entity.description && (
                  <div className="text-xs text-gray-500 mt-0.5">{entity.description}</div>
                )}
              </td>
              <td className="px-4 py-3">
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded capitalize">
                  {entity.type}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {getOwnerName(entity.ownerId)}
              </td>
              <td className="px-4 py-3">
                <span className={`text-xs px-2 py-1 rounded ${getStatusColor(entity.status)}`}>
                  {entity.status}
                </span>
              </td>
              <td className="px-4 py-3 text-xs text-gray-500">
                {formatDistanceToNow(new Date(entity.updatedAt), { addSuffix: true })}
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/app/thread/${entity.threadId}?entity=${entity.id}`}
                  className="text-xs text-primary-600 hover:text-primary-700"
                >
                  {getThreadTitle(entity.threadId)}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

