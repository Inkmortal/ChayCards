import React, { useState } from 'react';
import { 
  LibraryHeader, 
  FolderContext, 
  FolderGrid, 
  CreateFolderModal,
  Sidebar,
  DocumentsSection,
  FolderConflictModal,
  RenameModal
} from '../components/library';
import { useFolders } from '../hooks/useFolders';

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

  const [itemToRename, setItemToRename] = useState<{
    id: string;
    name: string;
    moveAfter?: { targetId: string | null };
  } | null>(null);

  const [isResolvingConflict, setIsResolvingConflict] = useState(false);

  const handleRename = async (id: string, newName: string) => {
    console.log('handleRename called:', { id, newName });
    const success = await renameFolder(id, newName);
    console.log('Rename result:', { success });
    return success;
  };

  const handleMove = async (sourceId: string, targetId: string | null, skipConflictCheck?: boolean) => {
    if (isResolvingConflict) {
      console.log('Conflict resolution in progress, skipping move');
      return;
    }
    console.log('handleMove called:', { sourceId, targetId, skipConflictCheck });
    await moveFolder(sourceId, targetId, skipConflictCheck);
  };

  const handleResolveConflict = async (action: 'rename' | 'replace') => {
    console.log('handleResolveConflict called:', { action, folderConflict });
    if (!folderConflict) {
      console.log('No folder conflict to resolve');
      return;
    }

    setIsResolvingConflict(true);
    try {
      if (action === 'replace') {
        console.log('Executing replace action');
        const success = await replaceFolder(folderConflict.sourceId, folderConflict.targetId);
        if (success) {
          console.log('Replace completed successfully');
          setFolderConflict(null);
        } else {
          console.error('Replace operation failed');
        }
      } else {
        console.log('Executing rename action');
        const sourceFolder = folders.find(f => f.id === folderConflict.sourceId);
        if (sourceFolder) {
          console.log('Setting up rename with move:', { sourceFolder, targetId: folderConflict.targetId });
          // Use the suggested name from the conflict
          setItemToRename({
            id: sourceFolder.id,
            name: folderConflict.suggestedName,
            moveAfter: { targetId: folderConflict.targetId }
          });
        }
        setFolderConflict(null);
      }
    } finally {
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

      <FolderConflictModal
        isOpen={folderConflict !== null}
        onClose={() => {
          setFolderConflict(null);
          setIsResolvingConflict(false);
        }}
        onReplace={() => handleResolveConflict('replace')}
        onRename={() => handleResolveConflict('rename')}
        folderName={folderConflict?.originalName || ''}
      />

      {itemToRename && (
        <RenameModal
          isOpen={true}
          onClose={() => {
            console.log('Closing rename modal');
            setItemToRename(null);
            setFolderConflict(null);
            setIsResolvingConflict(false);
          }}
          onRename={async (newName: string) => {
            console.log('Rename modal submit:', { newName, itemToRename });
            let success = false;
            if (itemToRename.moveAfter) {
              success = await renameAndMoveFolder(
                itemToRename.id,
                newName,
                itemToRename.moveAfter.targetId
              );
            } else {
              success = await handleRename(itemToRename.id, newName);
            }
            if (success) {
              setItemToRename(null);
            }
          }}
          currentName={itemToRename.name}
          folders={folders}
          parentId={itemToRename.moveAfter?.targetId || currentFolder?.id || null}
          itemId={itemToRename.id}
        />
      )}
    </div>
  );
}
