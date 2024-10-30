# Type System Analysis

## Current Type Structure

### 1. Folder Types

```typescript
// Current implementation
interface FolderBase {
  id: string;
  name: string;
  modifiedAt: string;
  createdAt: string;
}

interface Folder extends FolderBase {
  parentId: string | null;
}

interface FolderItem extends FolderBase {
  type: 'folder';
  parentId: string | null;
}
```

Issues:
- Unnecessary inheritance chain
- Duplicate parentId property
- Redundant type field
- Unnecessary conversion utilities

### 2. Operation Types

```typescript
// Multiple result types
interface OperationResult<T = void> {
  success: boolean;
  error?: string;
  data?: T;
}

type CreateFolderResult = OperationResult<Folder>;
type MoveFolderResult = OperationResult<FolderConflictResult>;
type RenameFolderResult = OperationResult;
```

Issues:
- Redundant result type wrappers
- Inconsistent error handling
- Mixed conflict handling

### 3. Conflict Types

```typescript
interface FolderConflictResult {
  hasConflict: boolean;
  type?: 'name' | 'circular' | 'path';
  conflictingId?: string;
  message?: string;
}

interface NameConflictResult extends FolderConflictResult {
  type: 'name';
  originalName: string;
  suggestedName: string;
}

interface FolderConflict {
  sourceId: string;
  targetId: string | null;
  originalName: string;
  suggestedName: string;
}
```

Issues:
- Multiple conflict representations
- Redundant properties
- Mixed concerns

## Type Usage Analysis

### 1. Component Props

```typescript
// Redundant prop interfaces
interface FolderViewProps {
  items: FolderItem[];
  onSelect: (id: string) => void;
  // ... more props
}

interface TreeViewProps {
  items: Folder[];
  onSelect: (id: string | null) => void;
  // ... similar props
}

// Empty extensions
interface CardViewProps extends FolderViewProps {}
interface SimpleViewProps extends FolderViewProps {}
```

Issues:
- Duplicate prop definitions
- Inconsistent callback signatures
- Unnecessary type extensions

### 2. State Types

```typescript
interface UIFolderState {
  // Core data duplicated
  folders: Folder[];
  currentFolder: Folder | null;
  currentFolders: Folder[];
  
  // Operation state mixed
  isProcessing: boolean;
  hasConflict: boolean;
  
  // Modal state scattered
  isCreateModalOpen: boolean;
  itemToRename: FolderItem | null;
  folderConflict: FolderConflict | null;
}
```

Issues:
- Duplicated core state
- Mixed concerns
- Complex state updates

## Improvement Opportunities

### 1. Type Consolidation

```typescript
// Single folder type
interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  modifiedAt: string;
  createdAt: string;
}

// Single conflict type
interface FolderConflict {
  type: 'name' | 'circular' | 'path';
  sourceId: string;
  targetId: string | null;
  message: string;
  details?: any;
}

// Generic operation result
interface OperationResult<T = void> {
  success: boolean;
  error?: {
    type: string;
    message: string;
    details?: any;
  };
  data?: T;
}
```

### 2. Better Type Organization

```typescript
// Operation types
type OperationType = 'create' | 'move' | 'rename' | 'delete';

interface Operation<TData, TResult> {
  type: OperationType;
  validate(data: TData): ValidationResult;
  execute(data: TData): Promise<OperationResult<TResult>>;
}

// Component types
interface BaseFolderViewProps {
  onSelect: (id: string | null) => void;
  // ... common props
}

interface GridViewProps extends BaseFolderViewProps {
  layout: 'grid';
  // ... grid-specific props
}
```

## Implementation Impact

### Benefits
1. Clearer type relationships
2. Less code to maintain
3. Better type safety
4. Easier to understand

### Risks
1. Breaking changes to components
2. Migration effort needed
3. Potential performance impacts

## Next Steps

See [Implementation Plan](./05-implementation.md) for detailed steps on:
1. Type consolidation order
2. Migration strategy
3. Testing approach
