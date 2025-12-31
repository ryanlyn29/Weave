'use client';

import { Download, File } from 'lucide-react';
import { FileAttachment } from '@/lib/api-client';

interface FileAttachmentDisplayProps {
  attachments: FileAttachment[];
}

/**
 * Component to display file attachments in messages
 */
export function FileAttachmentDisplay({ attachments }: FileAttachmentDisplayProps) {
  if (!attachments || attachments.length === 0) return null;

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleDownload = (attachment: FileAttachment) => {
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-2 mt-2">
      {attachments.map((attachment, index) => (
        <div
          key={index}
          className="flex items-center gap-3 px-3 py-2 bg-gray-50 border border-gray-200 rounded-2xl hover:bg-gray-100 transition-colors"
        >
          <File className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-sm text-gray-900 truncate">{attachment.filename}</div>
            <div className="text-xs text-gray-500">{formatFileSize(attachment.size)}</div>
          </div>
          <button
            onClick={() => handleDownload(attachment)}
            className="p-1.5 hover:bg-gray-200 rounded text-gray-600 hover:text-gray-900 flex-shrink-0"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
