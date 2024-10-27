import {
  Item,
  ItemData,
  ItemConflict,
  ConflictResolution,
  ItemEventHandler,
  QueryOptions,
  OperationResult,
  ValidationResult
} from './types';

/**
 * Core interface for library operations
 */
export interface ILibraryService {
  // Item Operations
  createItem(data: ItemData): Promise<OperationResult<Item>>;
  updateItem(id: string, data: Partial<ItemData>): Promise<OperationResult<Item>>;
  deleteItem(id: string): Promise<OperationResult>;
  moveItem(id: string, targetId: string | null): Promise<OperationResult>;
  
  // Queries
  getItem(id: string): Promise<Item | null>;
  getItems(options?: QueryOptions): Promise<Item[]>;
  findItems(query: string, options?: QueryOptions): Promise<Item[]>;
  
  // Conflict Management
  resolveConflict(conflict: ItemConflict, resolution: ConflictResolution): Promise<OperationResult>;
  validateOperation(operation: 'create' | 'move' | 'rename', data: any): Promise<ValidationResult>;
  
  // Event Management
  addEventListener(handler: ItemEventHandler): () => void;
  removeEventListener(handler: ItemEventHandler): void;
}
