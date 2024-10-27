export interface TreeItem {
  id: string;
  name: string;
  parentId: string | null;
}

export interface TreeViewProps {
  items: TreeItem[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onCreateFolder: (parentId: string | null) => void;
  onRename?: (id: string, newName: string) => void;
  onMove?: (sourceId: string, targetId: string | null) => void;
}

export interface TreeNodeProps {
  item: TreeItem;
  items: TreeItem[];
  level: number;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onCreateFolder: (parentId: string | null) => void;
  onRename?: (id: string, newName: string) => void;
  onMove?: (sourceId: string, targetId: string | null) => void;
}
