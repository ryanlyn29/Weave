'use client';

import { X, File } from 'lucide-react';

interface FileAttachmentListProps {
  files: File[];
  onRemove: (index: number) => void;
}

/**
 * Component to display list of attached files before sending
 */
export function FileAttachmentList({ files, onRemove }: FileAttachmentListProps) {
  if (files.length === 0) return null;

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-2">
      {files.map((file, index) => (
        <div
          key={index}
          className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-sm"
        >
          <File className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-gray-900 truncate">{file.name}</div>
            <div className="text-xs text-gray-500">{formatFileSize(file.size)}</div>
          </div>
          <button
            onClick={() => onRemove(index)}
            className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-gray-700 flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
