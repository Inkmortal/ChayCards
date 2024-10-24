import React from 'react';
import { BaseDocument } from '../../../core/types/document';

interface DocumentCardProps {
  document: BaseDocument;
  onView: (doc: BaseDocument) => void;
  onEdit: (doc: BaseDocument) => void;
  onDelete: (doc: BaseDocument) => void;
  pluginDisplayName: string;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onView,
  onEdit,
  onDelete,
  pluginDisplayName
}) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500">{pluginDisplayName}</span>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(document);
            }}
            className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(document);
            }}
            className="px-2 py-1 text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
          >
            Delete
          </button>
        </div>
      </div>

      <div
        onClick={() => onView(document)}
        className="cursor-pointer"
      >
        <h3 className="text-lg font-medium mb-2 dark:text-white">
          {document.title}
        </h3>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Last modified {formatDate(document.updatedAt)}
        </div>
      </div>
    </div>
  );
};
