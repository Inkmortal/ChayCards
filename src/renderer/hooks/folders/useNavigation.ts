import { Folder } from './types';

interface UseNavigationProps {
  folders: Folder[];
  currentFolderId: string | null;
  setCurrentFolderId: (id: string | null) => void;
}

interface UseNavigationReturn {
  currentFolder: Folder | null;
  currentFolders: Folder[];
  breadcrumbPath: Folder[];
  navigateFolder: (id: string) => void;
  navigateBack: () => void;
  navigateToFolder: (folderId: string | null) => void;
}

export function useNavigation({
  folders,
  currentFolderId,
  setCurrentFolderId
}: UseNavigationProps): UseNavigationReturn {
  const currentFolder = folders.find((folder: Folder) => folder.id === currentFolderId) || null;
  const currentFolders = folders.filter((folder: Folder) => folder.parentId === currentFolderId);

  const getBreadcrumbPath = () => {
    const path = [];
    let current = currentFolder;
    while (current) {
      path.unshift(current);
      current = folders.find((folder: Folder) => folder.id === current?.parentId) || null;
    }
    return path;
  };

  const navigateFolder = (id: string) => setCurrentFolderId(id);
  
  const navigateBack = () => {
    const currentFolder = folders.find((folder: Folder) => folder.id === currentFolderId);
    setCurrentFolderId(currentFolder?.parentId || null);
  };
  
  const navigateToFolder = (folderId: string | null) => setCurrentFolderId(folderId);

  return {
    currentFolder,
    currentFolders,
    breadcrumbPath: getBreadcrumbPath(),
    navigateFolder,
    navigateBack,
    navigateToFolder
  };
}
