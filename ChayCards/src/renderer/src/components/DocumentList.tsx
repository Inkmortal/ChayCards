import React, { useEffect, useState } from 'react';
import { BaseDocument } from '../../../core/types/document';
import { DocumentCard } from './DocumentCard';
import { CreateDocumentButton } from './CreateDocumentButton';

interface DocumentListProps {
  onDocumentView: (doc: BaseDocument) => void;
  onDocumentEdit: (doc: BaseDocument) => void;
  onDocumentDelete: (doc: BaseDocument) => void;
  onCreateDocument: (type: string) => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  onDocumentView,
  onDocumentEdit,
  onDocumentDelete,
  onCreateDocument
}) => {
  const [documents, setDocuments] = useState<BaseDocument[]>([]);
  const [plugins, setPlugins] = useState<Array<{ type: string; displayName: string }>>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const pluginsData = await window.electron.ipcRenderer.invoke('get-plugins');
        setPlugins(pluginsData);

        const documentsData = await window.electron.ipcRenderer.invoke('get-all-documents');
        setDocuments(documentsData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      }
    };

    loadData();
  }, []);

  if (error) {
    return (
      <div className="p-6 text-red-600">
        <h2 className="text-xl font-bold">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">My Documents</h1>
        <CreateDocumentButton onCreateDocument={onCreateDocument} />
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {documents
          .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
          .map((doc) => {
            const plugin = plugins.find(p => p.type === doc.type);
            return (
              <DocumentCard
                key={doc.id}
                document={doc}
                onView={onDocumentView}
                onEdit={onDocumentEdit}
                onDelete={onDocumentDelete}
                pluginDisplayName={plugin?.displayName || doc.type}
              />
            );
          })}
      </div>

      {documents.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No documents yet. Create one using the button above!
        </div>
      )}
    </div>
  );
};
