'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';

interface CollapsibleSidebarProps {
  children: React.ReactNode;
  defaultCollapsed?: boolean;
  storageKey: string;
  position?: 'left' | 'right';
  width?: number;
}

/**
 * Collapsible sidebar component with persistent state
 */
export function CollapsibleSidebar({
  children,
  defaultCollapsed = false,
  storageKey,
  position = 'right',
  width = 320,
}: CollapsibleSidebarProps) {
  const [collapsed, setCollapsed] = useLocalStorage<boolean>(storageKey, defaultCollapsed);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
      <div
        className={`border-${position === 'left' ? 'r' : 'l'} border-gray-200 bg-white transition-all duration-200 ${
          collapsed ? 'w-0 overflow-hidden' : `w-[${width}px]`
        }`}
        style={{ width: collapsed ? 0 : `${width}px` }}
      >
        <div className="h-full overflow-y-auto">
          {children}
        </div>
      </div>
      <button
        onClick={toggle}
        className={`absolute ${position === 'left' ? 'left-0' : 'right-0'} top-1/2 -translate-y-1/2 -translate-x-${position === 'left' ? 'full' : 'full'} z-10 p-1 bg-white border border-gray-200 rounded-l-2xl hover:bg-gray-50 transition-colors`}
        style={{
          [position === 'left' ? 'left' : 'right']: collapsed ? 0 : `${width}px`,
        }}
      >
        {collapsed ? (
          position === 'left' ? (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          )
        ) : (
          position === 'left' ? (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          )
        )}
      </button>
    </>
  );
}
