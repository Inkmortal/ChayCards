# State Management Analysis

## Current State Structure

### 1. Core State (FolderStateManager)

```typescript
interface FolderState {
  folders: Folder[];
  currentFolderId: string | null;
  isLoading: boolean;
  currentOperation: QueuedOperation | null;
}

class FolderStateManager {
  private state: FolderState;
  private listeners: Set<StateListener>;
  private operations: FolderOperations;
  private storage: StorageInterface;
  private operationQueue: OperationQueue;
}
```

Issues:
- Mixed concerns (data, UI, operations)
- Direct storage access
- Complex subscription system

### 2. UI State (useFolderState)

```typescript
interface UIFolderState {
  // Core Data (duplicated)
  folders: Folder[];
  currentFolder: Folder | null;
  currentFolders: Folder[];
  isLoading: boolean;
  currentOperation: QueuedOperation | null;

  // Operation State
  isProcessing: boolean;
  hasConflict: boolean;

  // Modal State
  itemToRename: FolderItem | null;
  pendingMove: { sourceId: string; targetId: string | null } | null;
  isCreateModalOpen: boolean;
  newFolderName: string;
  createInFolderId: string | null;
  folderError?: string;
  folderConflict: FolderConflict | null;
}
```

Issues:
- Duplicates core state
- Mixed modal/operation state
- Complex derivations

### 3. State Updates

```typescript
// In FolderStateManager
private setState(newState: Partial<FolderState>) {
  this.state = { ...this.state, ...newState };
  this.notifyListeners();
}

// In useFolderState
const updateUIState = (updates: Partial<UIFolderState>) => {
  setUIState(current => ({ ...current, ...updates }));
};
```

Issues:
- Multiple update paths
- Redundant updates
- Complex synchronization

## Core Problems

### 1. State Duplication
- Core state duplicated in UI
- Derived state recalculated
- Multiple sources of truth

### 2. Mixed Concerns
- Operation state mixed with data
- UI state mixed with core state
- Complex modal management

### 3. Update Patterns
- Inconsistent update methods
- Complex state derivation
- Redundant subscriptions

## Improvement Opportunities

### 1. Clear State Separation

```typescript
// Core state (single source of truth)
interface FolderState {
  items: Folder[];
  currentId: string | null;
}

// Operation state
interface OperationState {
  current: QueuedOperation | null;
  isProcessing: boolean;
  error?: OperationError;
}

// Modal state
interface ModalState {
  type: 'create' | 'rename' | 'conflict' | null;
  data?: {
    itemId?: string;
    parentId?: string;
    name?: string;
    error?: string;
    conflict?: FolderConflict;
  };
}
```

### 2. State Selectors

```typescript
// Type-safe selectors
const selectors = {
  getCurrentFolder: (state: FolderState) => 
    state.currentId ? state.items.find(f => f.id === state.currentId) : null,
  
  getCurrentChildren: (state: FolderState) =>
    state.items.filter(f => f.parentId === state.currentId),
  
  getPath: (state: FolderState, folderId: string) => {
    const path: Folder[] = [];
    let current = state.items.find(f => f.id === folderId);
    while (current) {
      path.unshift(current);
      current = state.items.find(f => f.id === current.parentId);
    }
    return path;
  }
};
```

### 3. Clear Update Patterns

```typescript
class FolderStore {
  private state: FolderState;
  private operations: OperationState;
  private modal: ModalState;

  // Clear update methods
  updateFolders(folders: Folder[]) {
    this.setState({ items: folders });
  }

  setCurrentFolder(id: string | null) {
    this.setState({ currentId: id });
  }

  // Modal management
  openModal(type: ModalState['type'], data?: ModalState['data']) {
    this.setModal({ type, data });
  }

  closeModal() {
    this.setModal({ type: null });
  }

  // Operation handling
  startOperation(operation: QueuedOperation) {
    this.setOperation({
      current: operation,
      isProcessing: true
    });
  }

  completeOperation() {
    this.setOperation({
      current: null,
      isProcessing: false
    });
  }
}
```

## Implementation Benefits

### 1. Better State Organization
- Clear state boundaries
- Single source of truth
- Simpler updates

### 2. Improved Performance
- Less state duplication
- Fewer updates
- Better memoization

### 3. Better Maintainability
- Clear update patterns
- Easier debugging
- Better testing

## Migration Strategy

### Phase 1: State Separation
1. Split core/operation/modal state
2. Implement selectors
3. Update state manager

### Phase 2: Update Patterns
1. Implement clear update methods
2. Convert to new patterns
3. Remove redundant updates

### Phase 3: UI Integration
1. Update hooks
2. Convert components
3. Clean up subscriptions

## Success Metrics

1. State Management
- Clear state structure
- Consistent updates
- Better performance

2. Code Quality
- Less duplication
- Better organization
- Easier testing

3. Developer Experience
- Clearer patterns
- Better debugging
- Easier maintenance

See [Implementation Plan](./05-implementation.md) for detailed steps.
