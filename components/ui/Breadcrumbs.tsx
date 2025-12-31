'use client';

import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export interface BreadcrumbItem {
  label: string;
  href: string;
  onClick?: () => void;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

/**
 * Navigable breadcrumb component
 */
export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const pathname = usePathname();
  const router = useRouter();

  if (items.length === 0) return null;

  const handleClick = (item: BreadcrumbItem, e: React.MouseEvent) => {
    if (item.onClick) {
      e.preventDefault();
      item.onClick();
    }
  };

  return (
    <nav className="flex items-center gap-2 text-sm text-gray-600" aria-label="Breadcrumb">
      <Link
        href="/app/inbox"
        className="hover:text-gray-900 transition-colors flex items-center gap-1"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Inbox</span>
      </Link>
      
      {items.map((item, index) => (
        <div key={item.href || index} className="flex items-center gap-2">
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          {index === items.length - 1 ? (
            <span className="text-gray-900 font-medium">{item.label}</span>
          ) : (
            <Link
              href={item.href}
              onClick={(e) => handleClick(item, e)}
              className="hover:text-gray-900 transition-colors truncate max-w-[200px]"
              title={item.label}
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
