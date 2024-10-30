import React from 'react';
import { ListItem } from './ListItem';
import { SimpleViewProps } from './types';
import { BaseFolderView } from './base/BaseFolderView';

export function SimpleView(props: SimpleViewProps) {
  return (
    <BaseFolderView
      {...props}
      renderContent={({ dragState, dragHandlers, containerProps }) => (
        <div 
          className="w-full overflow-hidden"
          {...containerProps}
        >
          <div className="grid grid-cols-[1fr,200px,100px] gap-4 px-4 py-2 text-sm text-text-light border-b border-border">
            <div>Name</div>
            <div>Modified</div>
            <div>Actions</div>
          </div>
          <div className="divide-y divide-border">
            {props.items.map((item) => (
              <ListItem
                key={item.id}
                item={item}
                dragState={dragState}
                onSelect={props.onSelect}
                onDelete={props.onDelete}
                onStartRename={props.setItemToRename}
                onDragStart={dragHandlers.handleDragStart}
                onDragOver={dragHandlers.handleDragOver}
                onDragLeave={dragHandlers.handleDragLeave}
                onDrop={dragHandlers.handleDrop}
                onDragEnd={dragHandlers.handleDragEnd}
              />
            ))}
          </div>
        </div>
      )}
    />
  );
}
