# Implementation Plan

## Refactoring Sequence

### Phase 1: Type System Cleanup
See [Type System Analysis](./02-type-system.md) for full details.

#### Step 1: Core Types
1. Update src/core/storage/folders/models.ts:
   - Remove FolderBase/FolderItem
   - Consolidate into single Folder interface
   - Remove conversion utilities

2. Update src/core/operations/types.ts:
   - Create unified OperationResult
   - Remove redundant result types
   - Add proper error types

3. Update src/core/operations/folders/conflicts.ts:
   - Consolidate conflict types
   - Improve conflict details
   - Better type safety

#### Impact:
- Fewer type definitions
- Clearer type relationships
- Better type safety

### Phase 2: Operation System Improvements
See [Operation System Analysis](./03-operation-system.md) for full details.

#### Step 1: Operation Structure
1. Update src/core/operations/types.ts:
   - Add operation lifecycle interfaces
   - Improve error handling
   - Clear operation phases

2. Update src/core/state/operation-queue.ts:
   - Remove polling
   - Add event-based updates
   - Better queue management

3. Convert Operations:
   - Start with move operation
   - Update other operations
   - Improve error handling

#### Impact:
- Clear operation flow
- Better error handling
- Improved reliability

### Phase 3: State Management
See [State Management Analysis](./04-state-management.md) for full details.

#### Step 1: State Organization
1. Update src/core/state/folders.ts:
   - Separate core/operation/modal state
   - Add proper selectors
   - Clear update patterns

2. Update src/renderer/hooks/folders/useFolderState.ts:
   - Remove state duplication
   - Improve state access
   - Better state updates

#### Impact:
- Better state organization
- Improved performance
- Clearer patterns

## Detailed Steps

### Week 1: Type System

#### Day 1-2: Core Types
```typescript
// 1. Update Folder type
interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  modifiedAt: string;
  createdAt: string;
}

// 2. Update operation types
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

#### Day 3-4: Conflict System
```typescript
// Update conflict handling
interface FolderConflict {
  type: 'name' | 'circular' | 'path';
  sourceId: string;
  targetId: string | null;
  message: string;
  details?: any;
}
```

#### Day 5: Testing & Validation
- Add type tests
- Verify type safety
- Update documentation

### Week 2: Operation System

#### Day 1-2: Operation Structure
```typescript
// Add operation lifecycle
interface OperationLifecycle<TData, TResult> {
  validate(data: TData): ValidationResult;
  checkConflicts?(data: TData): ConflictResult;
  execute(data: TData): Promise<OperationResult<TResult>>;
}
```

#### Day 3-4: Queue System
```typescript
// Update queue system
class OperationQueue {
  enqueue<T>(operation: Operation<T>): Promise<OperationResult<T>>;
  on(event: string, handler: Function): void;
  // ... other methods
}
```

#### Day 5: Convert Operations
- Update move operation
- Convert other operations
- Add tests

### Week 3: State Management

#### Day 1-2: State Structure
```typescript
// Update state organization
interface FolderState {
  items: Folder[];
  currentId: string | null;
}

interface OperationState {
  current: QueuedOperation | null;
  isProcessing: boolean;
}

interface ModalState {
  type: 'create' | 'rename' | 'conflict' | null;
  data?: any;
}
```

#### Day 3-4: State Updates
- Implement selectors
- Update state manager
- Improve updates

#### Day 5: UI Integration
- Update hooks
- Convert components
- Add tests

## Testing Strategy

### 1. Type Tests
- Verify type safety
- Check type inference
- Test edge cases

### 2. Unit Tests
- Test operations
- Verify state updates
- Check error handling

### 3. Integration Tests
- Test operation flow
- Verify state sync
- Check UI updates

## Rollback Plan

### For Each Phase:
1. Keep old implementations alongside new ones
2. Add feature flags for new code
3. Monitor for issues
4. Roll back if needed

## Success Validation

### 1. Code Metrics
- Reduced type count
- Fewer lines of code
- Better test coverage

### 2. Runtime Metrics
- Fewer re-renders
- Better performance
- Less memory usage

### 3. Developer Experience
- Clearer patterns
- Better debugging
- Easier maintenance

## Next Steps

After implementation:
1. Monitor performance
2. Gather feedback
3. Plan next improvements

See individual analysis documents for detailed context on each phase.
