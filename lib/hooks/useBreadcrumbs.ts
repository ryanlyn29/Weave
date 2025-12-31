'use client';

import { usePathname, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BreadcrumbItem } from '@/components/ui/Breadcrumbs';
import { api, Thread, Message, ExtractedEntity } from '@/lib/api-client';

/**
 * Hook to generate breadcrumbs based on current route and data
 */
export function useBreadcrumbs() {
  const pathname = usePathname();
  const params = useParams();
  const [items, setItems] = useState<BreadcrumbItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const generateBreadcrumbs = async () => {
      if (!pathname) return;

      setLoading(true);
      try {
        const newItems: BreadcrumbItem[] = [];

        // Thread page: Inbox → Thread
        if (pathname.startsWith('/app/thread/')) {
          const threadId = params?.id as string;
          if (threadId) {
            try {
              const thread = await api.getThread(threadId);
              newItems.push({
                label: thread.title || `Thread ${threadId.substring(0, 8)}`,
                href: `/app/thread/${threadId}`,
              });
            } catch (error) {
              newItems.push({
                label: 'Thread',
                href: `/app/thread/${threadId}`,
              });
            }
          }
        }

        // Entity detail page: Inbox → Thread → Entity
        // (We'll handle this when entity detail page exists)
        if (pathname.startsWith('/app/entity/')) {
          const entityId = params?.id as string;
          if (entityId) {
            try {
              const entity = await api.getEntity(entityId);
              
              // Get thread
              const thread = await api.getThread(entity.threadId);
              newItems.push({
                label: thread.title || 'Thread',
                href: `/app/thread/${entity.threadId}`,
              });

              newItems.push({
                label: entity.title,
                href: `/app/entity/${entityId}`,
              });
            } catch (error) {
              newItems.push({
                label: 'Entity',
                href: `/app/entity/${entityId}`,
              });
            }
          }
        }

        // Library page: Inbox → Library (or Thread → Entity → Library if viewing from entity)
        if (pathname.startsWith('/app/library')) {
          // If we came from entity context, we'll handle that separately
          newItems.push({
            label: 'Library',
            href: '/app/library',
          });
        }

        setItems(newItems);
      } catch (error) {
        console.error('Error generating breadcrumbs:', error);
      } finally {
        setLoading(false);
      }
    };

    generateBreadcrumbs();
  }, [pathname, params]);

  return { items, loading };
}

/**
 * Generate breadcrumbs for thread page with entity context
 */
export function useThreadBreadcrumbs(thread: Thread | null, entityId?: string) {
  const [items, setItems] = useState<BreadcrumbItem[]>([]);

  useEffect(() => {
    if (!thread) return;

    const generateBreadcrumbs = async () => {
      const newItems: BreadcrumbItem[] = [
        {
          label: thread.title || 'Thread',
          href: `/app/thread/${thread.id}`,
        },
      ];

      if (entityId) {
        try {
          const entity = await api.getEntity(entityId);
          newItems.push({
            label: entity.title,
            href: `/app/entity/${entityId}`,
          });
        } catch (error) {
          console.error('Error loading entity for breadcrumb:', error);
        }
      }

      setItems(newItems);
    };

    generateBreadcrumbs();
  }, [thread, entityId]);

  return items;
}

/**
 * Generate breadcrumbs from thread/message/entity context
 */
export function generateBreadcrumbsForEntity(
  thread: Thread | null,
  message: Message | null,
  entity: ExtractedEntity | null
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [];

  if (thread) {
    items.push({
      label: thread.title || 'Thread',
      href: `/app/thread/${thread.id}`,
    });
  }

  if (message && thread) {
    // Message is within thread, we can link to it
    items.push({
      label: `Message ${message.id.substring(0, 8)}`,
      href: `/app/thread/${thread.id}#message-${message.id}`,
    });
  }

  if (entity) {
    items.push({
      label: entity.title,
      href: `/app/entity/${entity.id}`,
    });
  }

  return items;
}
