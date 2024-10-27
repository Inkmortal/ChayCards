/**
 * Base item interface for both folders and documents
 */
export interface Item {
  id: string;
  name: string;
  type: ItemType;
  parentId: string | null;
  createdAt: string;
  modifiedAt: string;
  metadata?: Record<string, unknown>;
}

export type ItemType = 'folder' | 'document';

/**
 * Data required to create a new item
 */
export interface ItemData {
  name: string;
  parentId: string | null;
  type: ItemType;
  metadata?: Record<string, unknown>;
}

/**
 * Conflict information when items clash
 */
export interface ItemConflict {
  sourceId: string;
  targetId: string | null;
  sourceName: string;
  type: 'name' | 'move' | 'delete';
}

/**
 * How to resolve an item conflict
 */
export type ConflictResolution = {
  action: 'rename' | 'replace' | 'skip';
  newName?: string;
};

/**
 * Events that can occur on items
 */
export type ItemEvent = {
  type: 'created' | 'updated' | 'deleted' | 'moved';
  item: Item;
  previousParentId?: string | null;
};

/**
 * Service event handler type
 */
export type ItemEventHandler = (event: ItemEvent) => void;

/**
 * Query options for fetching items
 */
export interface QueryOptions {
  parentId?: string | null;
  type?: ItemType;
  recursive?: boolean;
  sortBy?: 'name' | 'createdAt' | 'modifiedAt';
  sortDirection?: 'asc' | 'desc';
}

/**
 * Error types specific to library operations
 */
export class LibraryError extends Error {
  constructor(
    message: string,
    public code: 
      | 'ITEM_NOT_FOUND'
      | 'NAME_CONFLICT'
      | 'INVALID_OPERATION'
      | 'CIRCULAR_REFERENCE'
      | 'STORAGE_ERROR'
  ) {
    super(message);
    this.name = 'LibraryError';
  }
}

/**
 * Validation result type
 */
export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
}

/**
 * Operation result with detailed status
 */
export interface OperationResult<T = void> {
  success: boolean;
  data?: T;
  error?: LibraryError;
}
