import React from 'react';
import { Icon } from '../ui';
import { CardViewProps } from './types';
import { BaseFolderView, formatDate } from './base/BaseFolderView';

// Card-specific styles
const cardStyles = `
  @keyframes folder-shake {
    0%, 100% { transform: scale(1.02) rotate(0deg); }
    25% { transform: scale(1.02) rotate(-1deg); }
    75% { transform: scale(1.02) rotate(1deg); }
  }
  @keyframes folder-glow {
    0%, 100% { box-shadow: 0 0 10px var(--chay-primary-light); }
    50% { box-shadow: 0 0 20px var(--chay-primary); }
  }
  .folder-receiving {
    animation: folder-shake 0.5s ease-in-out infinite, folder-glow 1.5s ease-in-out infinite;
  }
  .card-hover-rise {
    transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
  }
  .card-hover-rise:hover {
    transform: translateY(-2px);
    box-shadow: var(--chay-primary-light) 0px 2px 8px -2px;
  }
`;

export function CardView(props: CardViewProps) {
  return (
    <BaseFolderView
      {...props}
      renderContent={({ dragState, dragHandlers, containerProps }) => (
        <>
          <style>{cardStyles}</style>
          <div 
            className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5 p-4"
            {...containerProps}
          >
            {props.items.map((item) => (
              <div
                key={item.id}
                className={`group relative bg-surface hover:bg-surface rounded-lg border border-border card-hover-rise transition-colors duration-300 cursor-pointer h-40
                  ${dragState.dragOverItem === item.id ? 'ring-2 ring-secondary/50 bg-secondary/10 folder-receiving' : ''}
                  ${dragState.draggedItem === item.id ? 'opacity-50' : ''}`}
                onClick={() => props.onSelect(item.id)}
                draggable={item.type === 'folder'}
                onDragStart={(e) => dragHandlers.handleDragStart(e, item.id)}
                onDragOver={(e) => dragHandlers.handleDragOver(e, item.id)}
                onDragLeave={dragHandlers.handleDragLeave}
                onDrop={(e) => dragHandlers.handleDrop(e, item.id)}
                onDragEnd={dragHandlers.handleDragEnd}
              >
                <div className="flex h-full">
                  <div className="w-40 flex items-center justify-center">
                    {item.type === 'folder' ? (
                      <Icon name="folder" className="w-16 h-16 text-primary transition-transform duration-300 group-hover:scale-110" />
                    ) : (
                      <Icon name="document" className="w-16 h-16 text-text-lighter transition-colors duration-300" />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-center pr-12">
                    <div>
                      <h3 
                        className="text-2xl font-medium text-text group-hover:text-secondary truncate transition-colors duration-300" 
                        title={item.name}
                      >
                        {item.name}
                      </h3>
                      <p className="text-sm text-text-light group-hover:text-secondary-light transition-colors duration-300 mt-2">
                        Modified {formatDate(item.modifiedAt)}
                      </p>
                    </div>
                  </div>
                  <div 
                    className="absolute top-3 right-3 flex items-center gap-1"
                    onClick={e => e.stopPropagation()}
                  >
                    <button
                      onClick={() => props.setItemToRename(item)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-surface-hover rounded-md transition-all duration-300 z-10"
                      title="Rename folder"
                    >
                      <Icon name="pencil" className="w-4 h-4 text-text-light hover:text-secondary transition-colors duration-300" />
                    </button>
                    <button
                      onClick={() => props.onDelete(item.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-surface-hover rounded-md transition-all duration-300 z-10"
                      title="Delete folder"
                    >
                      <Icon name="trash" className="w-4 h-4 text-text-light hover:text-error transition-colors duration-300" />
                    </button>
                  </div>
                  {/* Drop indicator */}
                  {dragState.dragOverItem === item.id && dragState.draggedItem !== item.id && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-secondary/20 text-secondary font-medium px-2 py-1 rounded shadow-sm text-sm z-20">
                      Move into folder
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    />
  );
}
