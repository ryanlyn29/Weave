'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api, ExtractedEntity, ApiError } from '@/lib/api-client';
import { useAuth } from '@/components/auth/AuthProvider';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { EntityBreadcrumbs } from '@/components/weave/thread/EntityBreadcrumbs';
import { ActionChips } from '@/components/weave/thread/ActionChips';
import { EntityRelations } from '@/components/weave/entity/EntityRelations';
import { ArrowLeft } from 'lucide-react';

export default function EntityPage() {
  const { authReady, user } = useAuth();
  const isAuthenticated = !!user;
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [entity, setEntity] = useState<ExtractedEntity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEntity = async () => {
      if (!id) return;

      // Wait for auth to be ready
      if (!authReady) {
        return;
      }

      // Only load if authenticated
      if (!isAuthenticated) {
        setError(null);
        setEntity(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const entityData = await api.getEntity(id);
        
        // Handle null response
        if (!entityData) {
          setEntity(null);
          setError('Entity not found');
        } else {
          setEntity(entityData);
        }
      } catch (err) {
        console.error('Error loading entity:', err);
        if (err instanceof ApiError && err.status === 404) {
          setError('Entity not found');
        } else {
          setError('Failed to load entity');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id && typeof window !== 'undefined') {
      loadEntity();
    }
  }, [id, authReady, isAuthenticated]);

  if (loading || !authReady) {
    return (
      <div className="h-full overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <LoadingSkeleton lines={10} />
        </div>
      </div>
    );
  }

  if (error || !entity) {
    return (
      <div className="h-full overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <ErrorState
            message={error || 'Entity not found'}
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.push(`/app/thread/${entity.threadId}`)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Thread
          </button>
          <EntityBreadcrumbs entityId={entity.id} entity={entity} />
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-2xl text-xs font-medium">
                  {entity.type}
                </span>
                <span className="px-2 py-1 bg-gray-50 text-gray-700 rounded-2xl text-xs font-medium">
                  {entity.status}
                </span>
              </div>
              <h1 className="text-2xl font-medium text-gray-900 mb-2">{entity.title}</h1>
              {entity.description && (
                <p className="text-gray-600">{entity.description}</p>
              )}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Created:</span>
                <span className="ml-2 text-gray-900">
                  {new Date(entity.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Updated:</span>
                <span className="ml-2 text-gray-900">
                  {new Date(entity.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Importance:</span>
                <span className="ml-2 text-gray-900">
                  {(entity.importanceScore * 100).toFixed(0)}%
                </span>
              </div>
              <div>
                <span className="text-gray-500">Thread:</span>
                <button
                  onClick={() => router.push(`/app/thread/${entity.threadId}`)}
                  className="ml-2 text-blue-600 hover:text-blue-700"
                >
                  View Thread
                </button>
              </div>
            </div>
          </div>

          {entity.messageId && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <ActionChips entityId={entity.id} messageId={entity.messageId} />
            </div>
          )}
        </div>

        <div className="mt-6">
          <EntityRelations entityId={entity.id} />
        </div>
      </div>
    </div>
  );
}
