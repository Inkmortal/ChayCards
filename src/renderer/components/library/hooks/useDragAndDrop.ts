import { useState, DragEvent } from 'react';
import { DragState } from '../types';

interface UseDragAndDropProps {
  onMove?: (sourceId: string, targetId: string | null) => void;
}

export function useDragAndDrop({ onMove }: UseDragAndDropProps) {
  const [dragState, setDragState] = useState<DragState>({
    draggedItem: null,
    dragOverItem: null
  });
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: DragEvent<HTMLDivElement>, id: string) => {
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
    e.preventDefault();
    e.stopPropagation();

    if (!isDragging) {
      return;
    }

    const sourceId = e.dataTransfer.getData('text/plain');
    
    if (sourceId === targetId) {
      setDragState({ draggedItem: null, dragOverItem: null });
      setIsDragging(false);
      return;
    }

    if (onMove) {
      await onMove(sourceId, targetId);
    }

    setDragState({ draggedItem: null, dragOverItem: null });
    setIsDragging(false);
  };

  const handleDragEnd = () => {
    setDragState({ draggedItem: null, dragOverItem: null });
    setIsDragging(false);
  };

  return {
    dragState,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd
  };
}
