import React, { useState } from 'react';
import { 
  LibraryHeader, 
  FolderContext, 
  FolderGrid, 
  CreateFolderModal,
  Sidebar,
  DocumentsSection
} from '../components/library';
import { useFolders } from '../hooks/folders';
import { Item } from '../components/library/types';
import { FolderConflict } from '../../core/operations/folders/conflicts';
import { Folder } from '../../core/storage/folders/models';

export function Library() {
  const {
    // Core state
    folders,
    currentFolder,
    currentFolders,
    isLoading,

    // UI state
    isCreateModalOpen,
    newFolderName,
    folderError,

    // Create folder
    openCreateModal,
    closeCreateModal,
    setNewFolderName,
    createFolder,

    // Operations
    moveFolder,
    replaceFolder,
    renameFolder,
    deleteFolder,

    // Navigation
    setCurrentFolder
  } = useFolders();

  // Shared rename state
  const [itemToRename, setItemToRename] = useState<Item | null>(null);
  const [pendingMove, setPendingMove] = useState<{
    sourceId: string;
    targetId: string | null;
  } | null>(null);
  const [folderConflict, setFolderConflict] = useState<FolderConflict | null>(null);

  // Conflict resolution handlers
  const handleConflictResolve = {
    replace: async () => {
      if (!folderConflict) return;
      const result = await replaceFolder(folderConflict.sourceId, folderConflict.targetId);
      if (result.success) {
        setFolderConflict(null);
      }
    },
    rename: () => {
      if (!folderConflict) return;
      setPendingMove({
        sourceId: folderConflict.sourceId,
        targetId: folderConflict.targetId
      });
      const sourceItem = folders.find(f => f.id === folderConflict.sourceId);
      if (sourceItem) {
        setItemToRename({
          id: sourceItem.id,
          name: folderConflict.suggestedName,
          type: 'folder',
          modifiedAt: sourceItem.modifiedAt,
          createdAt: sourceItem.createdAt
        });
      }
      setFolderConflict(null);
    },
    cancel: () => {
      setFolderConflict(null);
      setPendingMove(null);
      setItemToRename(null);
    }
  };

  // Handle folder creation
  const handleCreateFolder = async () => {
    if (!folderError && newFolderName.trim()) {
      const result = await createFolder({
        name: newFolderName.trim(),
        parentId: currentFolder?.id ?? null
      });
      if (result.success) {
        closeCreateModal();
      }
    }
  };

  // Move handler that manages conflicts
  const handleMove = async (sourceId: string, targetId: string | null) => {
    const result = await moveFolder(sourceId, targetId);
    if (!result.success && result.conflict) {
      setFolderConflict(result.conflict);
    }
    return result;
  };

  // Navigation handlers
  const navigateFolder = (id: string) => setCurrentFolder(id);
  const navigateBack = () => currentFolder?.parentId !== undefined && setCurrentFolder(currentFolder.parentId);
  const navigateToFolder = (id: string | null) => setCurrentFolder(id);

  // Build breadcrumb path
  const getBreadcrumbPath = (folder: Folder): Folder[] => {
    const path: Folder[] = [];
    let current: Folder | undefined = folder;
    
    while (current) {
      path.unshift(current);
      current = folders.find(f => f.id === current?.parentId);
    }

    return path;
  };

  return (
    <div className="flex h-full">
      <Sidebar
        folders={folders}
        selectedId={currentFolder?.id || null}
        onSelect={navigateToFolder}
        onCreateFolder={openCreateModal}
        onMoveFolder={handleMove}
        onRenameFolder={renameFolder}
        folderConflict={folderConflict}
        onConflictResolve={handleConflictResolve}
        itemToRename={itemToRename}
        setItemToRename={setItemToRename}
        pendingMove={pendingMove}
        setPendingMove={setPendingMove}
      />

      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-8">
          <LibraryHeader onCreateFolder={() => openCreateModal(currentFolder?.id || null)} />

          {currentFolder && (
            <FolderContext
              currentFolder={currentFolder}
              breadcrumbPath={getBreadcrumbPath(currentFolder)}
              onNavigateBack={navigateBack}
              onNavigateToFolder={navigateToFolder}
              onMoveFolder={handleMove}
              onRenameFolder={renameFolder}
              itemToRename={itemToRename}
              setItemToRename={setItemToRename}
            />
          )}

          <div className="space-y-8">
            <FolderGrid
              folders={currentFolders}
              currentFolder={currentFolder}
              allFolders={folders}
              onCreateFolder={() => openCreateModal(currentFolder?.id || null)}
              onNavigateFolder={navigateFolder}
              onDeleteFolder={deleteFolder}
              onRenameFolder={renameFolder}
              onMoveFolder={handleMove}
              onReplaceFolder={async (sourceId, targetId) => {
                const result = await replaceFolder(sourceId, targetId);
                if (result.success) {
                  setFolderConflict(null);
                }
                return result;
              }}
              itemToRename={itemToRename}
              setItemToRename={setItemToRename}
              pendingMove={pendingMove}
              setPendingMove={setPendingMove}
              folderConflict={folderConflict}
              onConflictResolve={handleConflictResolve}
            />

            <DocumentsSection />
          </div>
        </div>
      </div>

      <CreateFolderModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        folderName={newFolderName}
        onFolderNameChange={(e) => setNewFolderName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !folderError && newFolderName.trim()) {
            handleCreateFolder();
          } else if (e.key === 'Escape') {
            closeCreateModal();
          }
        }}
        error={folderError}
        onSubmit={handleCreateFolder}
      />
    </div>
  );
}
