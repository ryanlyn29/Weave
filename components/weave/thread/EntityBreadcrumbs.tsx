'use client';

import { useEffect, useState } from 'react';
import { Breadcrumbs, BreadcrumbItem } from '@/components/ui/Breadcrumbs';
import { api, Thread, Message, ExtractedEntity } from '@/lib/api-client';
import { useRouter } from 'next/navigation';

interface EntityBreadcrumbsProps {
  entityId: string;
  thread?: Thread | null;
  message?: Message | null;
  entity?: ExtractedEntity | null;
}

/**
 * Breadcrumbs component for entity context
 * Shows: Inbox → Thread → Message → Entity → Library
 */
export function EntityBreadcrumbs({ entityId, thread: propThread, message: propMessage, entity: propEntity }: EntityBreadcrumbsProps) {
  const router = useRouter();
  const [items, setItems] = useState<BreadcrumbItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBreadcrumbs = async () => {
      try {
        setLoading(true);
        const breadcrumbItems: BreadcrumbItem[] = [];

        // Load entity if not provided
        const entity = propEntity || await api.getEntity(entityId);

        // Load thread if not provided
        const thread = propThread || await api.getThread(entity.threadId);

        // Thread breadcrumb
        breadcrumbItems.push({
          label: thread.title || 'Thread',
          href: `/app/thread/${thread.id}`,
        });

        // Message breadcrumb (if we have message context)
        if (propMessage) {
          breadcrumbItems.push({
            label: `Message`,
            href: `/app/thread/${thread.id}#message-${propMessage.id}`,
            onClick: () => {
              router.push(`/app/thread/${thread.id}#message-${propMessage.id}`);
            },
          });
        } else if (entity.messageId) {
          // Try to get message context
          try {
            const messages = await api.getMessages(entity.threadId);
            const msg = messages.find(m => m.id === entity.messageId);
            if (msg) {
              breadcrumbItems.push({
                label: `Message`,
                href: `/app/thread/${thread.id}#message-${msg.id}`,
                onClick: () => {
                  router.push(`/app/thread/${thread.id}#message-${msg.id}`);
                },
              });
            }
          } catch (error) {
            console.error('Error loading message for breadcrumb:', error);
          }
        }

        // Entity breadcrumb
        breadcrumbItems.push({
          label: entity.title,
          href: `/app/entity/${entity.id}`,
        });

        // Library breadcrumb (always show if entity is in library)
        breadcrumbItems.push({
          label: 'Library',
          href: `/app/library?entity=${entity.id}`,
        });

        setItems(breadcrumbItems);
      } catch (error) {
        console.error('Error loading breadcrumbs:', error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    if (entityId) {
      loadBreadcrumbs();
    }
  }, [entityId, propThread, propMessage, propEntity, router]);

  if (loading || items.length === 0) return null;

  return (
    <div className="mb-4">
      <Breadcrumbs items={items} />
    </div>
  );
}
