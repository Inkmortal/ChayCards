import React, { useState } from 'react';
import { 
  LibraryHeader, 
  FolderContext, 
  FolderGrid, 
  CreateFolderModal,
  Sidebar,
  DocumentsSection,
  RenameModal
} from '../components/library';
import { useFolders } from '../hooks/useFolders';
import { Item } from '../components/library/types';

export function Library() {
  const {
    folders,
    currentFolder,
    currentFolders,
    breadcrumbPath,
    isCreateModalOpen,
    newFolderName,
    folderError,
    folderConflict,
    setFolderConflict,
    openCreateModal,
    closeCreateModal,
    handleCreateFolder,
    deleteFolder,
    renameFolder,
    renameAndMoveFolder,
    replaceFolder,
    moveFolder,
    navigateFolder,
    navigateBack,
    navigateToFolder,
    setNewFolderName,
    handleInputKeyDown
  } = useFolders();

  const [itemToRename, setItemToRename] = useState<Item | null>(null);
  const [pendingMove, setPendingMove] = useState<{
    sourceId: string;
    targetId: string | null;
  } | null>(null);
  const [isResolvingConflict, setIsResolvingConflict] = useState(false);

  const handleRename = async (id: string, newName: string) => {
    const success = await renameFolder(id, newName);
    return success;
  };

  const handleMove = async (sourceId: string, targetId: string | null, skipConflictCheck?: boolean) => {
    if (isResolvingConflict) {
      return;
    }
    await moveFolder(sourceId, targetId, skipConflictCheck);
  };

  const handleResolveConflict = async (action: 'rename' | 'replace') => {
    if (!folderConflict) {
      return;
    }

    setIsResolvingConflict(true);
    try {
      if (action === 'replace') {
        const success = await replaceFolder(folderConflict.sourceId, folderConflict.targetId);
        if (success) {
          setFolderConflict(null);
        }
      } else {
        const sourceFolder = folders.find(f => f.id === folderConflict.sourceId);
        if (sourceFolder) {
          setPendingMove({
            sourceId: folderConflict.sourceId,
            targetId: folderConflict.targetId
          });
          setItemToRename({
            id: sourceFolder.id,
            name: folderConflict.suggestedName,
            type: 'folder',
            modifiedAt: sourceFolder.modifiedAt,
            createdAt: sourceFolder.createdAt
          });
        }
        setFolderConflict(null);
      }
    } finally {
      setIsResolvingConflict(false);
    }
  };

  const conflictHandlers = {
    replace: () => handleResolveConflict('replace'),
    rename: () => handleResolveConflict('rename'),
    cancel: () => {
      setFolderConflict(null);
      setIsResolvingConflict(false);
    }
  };

  return (
    <div className="flex h-full">
      <Sidebar
        folders={folders}
        selectedId={currentFolder?.id || null}
        onSelect={navigateToFolder}
        onCreateFolder={openCreateModal}
        onMoveFolder={handleMove}
        onRenameFolder={handleRename}
        folderConflict={folderConflict}
        onConflictResolve={conflictHandlers}
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
              breadcrumbPath={breadcrumbPath}
              onNavigateBack={navigateBack}
              onNavigateToFolder={navigateToFolder}
              onMoveFolder={handleMove}
              onRenameFolder={handleRename}
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
              onRenameFolder={handleRename}
              onMoveFolder={handleMove}
              folderConflict={folderConflict}
              onConflictResolve={conflictHandlers}
              itemToRename={itemToRename}
              setItemToRename={setItemToRename}
              pendingMove={pendingMove}
              setPendingMove={setPendingMove}
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
        onKeyDown={handleInputKeyDown}
        error={folderError}
        onSubmit={handleCreateFolder}
      />

      {itemToRename && (
        <RenameModal
          isOpen={true}
          onClose={() => {
            setItemToRename(null);
            setFolderConflict(null);
            setIsResolvingConflict(false);
          }}
          onRename={async (newName: string) => {
            let success = false;
            if (pendingMove) {
              success = await renameAndMoveFolder(
                itemToRename.id,
                newName,
                pendingMove.targetId
              );
            } else {
              success = await handleRename(itemToRename.id, newName);
            }
            if (success) {
              setItemToRename(null);
              setPendingMove(null);
            }
          }}
          currentName={itemToRename.name}
          folders={folders}
          parentId={pendingMove ? pendingMove.targetId : currentFolder?.id || null}
          itemId={itemToRename.id}
        />
      )}
    </div>
  );
}
