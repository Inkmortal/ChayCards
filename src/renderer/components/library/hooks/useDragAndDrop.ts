import { useState, DragEvent } from 'react';
import { DragState, Item, FolderConflictInfo } from '../types';
import { getUniqueFolderName } from '../../../hooks/folders/folderUtils';

interface DragAndDropProps {
  items: Item[];
  onMove?: (sourceId: string, targetId: string | null, skipConflictCheck?: boolean) => void;
}

export function useDragAndDrop({ items, onMove }: DragAndDropProps) {
  const [dragState, setDragState] = useState<DragState>({
    draggedItem: null,
    dragOverItem: null
  });
  const [folderConflict, setFolderConflict] = useState<FolderConflictInfo | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: DragEvent<HTMLDivElement>, id: string) => {
    console.log('Drag started:', { id });
    e.stopPropagation();
    setIsDragging(true);
    setDragState(prev => ({ ...prev, draggedItem: id }));
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, id: string | null) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragState.draggedItem !== id) {
      setDragState(prev => ({ ...prev, dragOverItem: id }));
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragState(prev => ({ ...prev, dragOverItem: null }));
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>, targetId: string | null) => {
    console.log('Drop event:', { targetId });
    e.preventDefault();
    e.stopPropagation();

    if (!isDragging) {
      console.log('Drop ignored: No active drag operation');
      return;
    }

    const sourceId = e.dataTransfer.getData('text/plain');
    
    if (sourceId === targetId) {
      console.log('Drop cancelled: Source and target are the same');
      setDragState({ draggedItem: null, dragOverItem: null });
      setIsDragging(false);
      return;
    }

    // Check for naming conflict
    const sourceItem = items.find(item => item.id === sourceId);
    if (!sourceItem) {
      console.log('Drop cancelled: Source item not found');
      setIsDragging(false);
      return;
    }

    console.log('Source item:', sourceItem);

    // Get all items in target location
    const targetItems = items.filter(item => {
      const currentParentId = items.find(i => i.id === item.id && i.type === 'folder')?.id;
      return targetId === null ? !currentParentId : currentParentId === targetId;
    });

    // Check for naming conflict
    const hasDuplicate = targetItems.some(item => 
      item.id !== sourceId && 
      item.name.toLowerCase() === sourceItem.name.toLowerCase()
    );

    if (hasDuplicate) {
      console.log('Conflict detected');
      // Generate a unique name suggestion
      const suggestedName = getUniqueFolderName(
        targetItems.map(item => ({
          id: item.id,
          name: item.name,
          parentId: targetId,
          createdAt: item.createdAt,
          modifiedAt: item.modifiedAt
        })),
        sourceItem.name,
        targetId
      );

      setFolderConflict({
        sourceId,
        targetId,
        sourceName: suggestedName
      });
    } else if (onMove) {
      console.log('No conflict, proceeding with move');
      await onMove(sourceId, targetId, false);
    }

    setDragState({ draggedItem: null, dragOverItem: null });
    setIsDragging(false);
  };

  const handleDragEnd = () => {
    console.log('Drag ended');
    setDragState({ draggedItem: null, dragOverItem: null });
    setIsDragging(false);
  };

  const handleConflictReplace = async () => {
    console.log('Handling conflict replace');
    if (folderConflict && onMove) {
      console.log('Executing replace move:', { 
        sourceId: folderConflict.sourceId, 
        targetId: folderConflict.targetId 
      });
      await onMove(folderConflict.sourceId, folderConflict.targetId, true);
      setFolderConflict(null);
    }
  };

  return {
    dragState,
    folderConflict,
    setFolderConflict,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    handleConflictReplace
  };
}
