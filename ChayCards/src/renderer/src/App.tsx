import { useState } from 'react';
import { BaseDocument } from '../../core/types/document';
import { DocumentList } from './components/DocumentList';
import { NoteEditor } from '../../plugins/notes/components/NoteEditor';

function App(): JSX.Element {
  const [selectedDocument, setSelectedDocument] = useState<BaseDocument | null>(null);
  const [currentPlugin, setCurrentPlugin] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleDocumentSelect = async (doc: BaseDocument) => {
    try {
      const plugin = await window.electron.ipcRenderer.invoke('get-plugin', doc.type);
      setCurrentPlugin(plugin);
      setSelectedDocument(doc);
      setIsEditing(false);
    } catch (error) {
      console.error('Error loading plugin:', error);
    }
  };

  const handleDocumentEdit = async (doc: BaseDocument) => {
    try {
      const plugin = await window.electron.ipcRenderer.invoke('get-plugin', doc.type);
      setCurrentPlugin(plugin);
      setSelectedDocument(doc);
      setIsEditing(true);
    } catch (error) {
      console.error('Error loading plugin:', error);
    }
  };

  const handleCreateDocument = async (type: string) => {
    try {
      const plugin = await window.electron.ipcRenderer.invoke('get-plugin', type);
      setCurrentPlugin(plugin);
      setSelectedDocument(null);
      setIsEditing(true);
    } catch (error) {
      console.error('Error loading plugin:', error);
    }
  };

  const handleDocumentDelete = async (doc: BaseDocument) => {
    try {
      await window.electron.ipcRenderer.invoke('delete-document', doc.type, doc.id);
      setSelectedDocument(null);
      setCurrentPlugin(null);
      setIsEditing(false);
      // Refresh the document list
      window.location.reload();
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const handleBack = () => {
    setSelectedDocument(null);
    setCurrentPlugin(null);
    setIsEditing(false);
  };

  const handleSave = async (doc: Partial<BaseDocument>) => {
    try {
      if (!currentPlugin) return;

      const savedDoc = await window.electron.ipcRenderer.invoke(
        'save-document',
        currentPlugin.type,
        doc
      );

      setSelectedDocument(savedDoc);
      handleBack(); // Return to document list after saving
    } catch (error) {
      console.error('Error saving document:', error);
    }
  };

  // Show editor when creating or editing a note
  if (currentPlugin?.type === 'note') {
    return (
      <NoteEditor
        document={selectedDocument as any}
        onSave={handleSave}
        onBack={handleBack}
        isEditing={isEditing}
      />
    );
  }

  // Show document list by default
  return (
    <DocumentList
      onDocumentView={handleDocumentSelect}
      onDocumentEdit={handleDocumentEdit}
      onDocumentDelete={handleDocumentDelete}
      onCreateDocument={handleCreateDocument}
    />
  );
}

export default App;
