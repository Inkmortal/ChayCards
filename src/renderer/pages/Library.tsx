import React from 'react';
import { 
  LibraryHeader, 
  FolderContext, 
  FolderGrid, 
  CreateFolderModal,
  Sidebar,
  DocumentsSection
} from '../components/library';
import { useFolders } from '../hooks/folders';

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
    itemToRename,
    setItemToRename,
    pendingMove,
    setPendingMove,
    folderConflict,
    setFolderConflict,

    // Modal actions
    openCreateModal,
    closeCreateModal,
    setNewFolderName,
    handleCreateFolder,

    // Operations
    moveFolder,
    replaceFolder,
    renameFolder,
    deleteFolder,

    // Navigation
    setCurrentFolder,
    navigateBack,
    navigateToFolder,
    getBreadcrumbPath,

    // Conflict resolution
    handleConflictResolve
  } = useFolders();

  // Move handler with conflict management
  const handleMove = async (sourceId: string, targetId: string | null) => {
    const result = await moveFolder(sourceId, targetId);
    if (!result.success && result.conflict) {
      setFolderConflict(result.conflict);
    }
    return result;
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

          <FolderContext
            currentFolder={currentFolder}
            breadcrumbPath={currentFolder ? getBreadcrumbPath(currentFolder) : []}
            onNavigateBack={navigateBack}
            onNavigateToFolder={navigateToFolder}
            onMoveFolder={handleMove}
            onRenameFolder={renameFolder}
            itemToRename={itemToRename}
            setItemToRename={setItemToRename}
          />

          <div className="space-y-8">
            <FolderGrid
              folders={currentFolders}
              currentFolder={currentFolder}
              allFolders={folders}
              onCreateFolder={() => openCreateModal(currentFolder?.id || null)}
              onNavigateFolder={(id) => setCurrentFolder(id)}
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
