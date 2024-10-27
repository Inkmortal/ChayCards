import {
  Item,
  ItemData,
  ItemConflict,
  ConflictResolution,
  ItemEventHandler,
  QueryOptions,
  OperationResult,
  ValidationResult,
  ItemStore,
  MemoryItemStore,
  EventEmitter,
  ILibraryService
} from './index';
import { BaseOperations } from './BaseOperations';
import { QueryOperations } from './QueryOperations';
import { ConflictHandler } from './ConflictHandler';

export class LibraryService implements ILibraryService {
  private baseOps: BaseOperations;
  private queryOps: QueryOperations;
  private conflictHandler: ConflictHandler;
  private events: EventEmitter;
  private store: ItemStore;

  constructor(store?: ItemStore) {
    this.store = store || new MemoryItemStore();
    this.events = new EventEmitter();
    this.baseOps = new BaseOperations(this.store, this.events);
    this.queryOps = new QueryOperations(this.store);
    this.conflictHandler = new ConflictHandler(this.store, this.baseOps);
  }

  // Item Operations
  createItem(data: ItemData): Promise<OperationResult<Item>> {
    return this.baseOps.createItem(data);
  }

  updateItem(id: string, data: Partial<ItemData>): Promise<OperationResult<Item>> {
    return this.baseOps.updateItem(id, data);
  }

  deleteItem(id: string): Promise<OperationResult> {
    return this.baseOps.deleteItem(id);
  }

  moveItem(id: string, targetId: string | null): Promise<OperationResult> {
    return this.baseOps.moveItem(id, targetId);
  }

  // Queries
  getItem(id: string): Promise<Item | null> {
    return this.queryOps.getItem(id);
  }

  getItems(options?: QueryOptions): Promise<Item[]> {
    return this.queryOps.getItems(options);
  }

  findItems(query: string, options?: QueryOptions): Promise<Item[]> {
    return this.queryOps.findItems(query, options);
  }

  // Conflict Management
  resolveConflict(
    conflict: ItemConflict,
    resolution: ConflictResolution
  ): Promise<OperationResult> {
    return this.conflictHandler.resolveConflict(conflict, resolution);
  }

  validateOperation(
    operation: 'create' | 'move' | 'rename',
    data: any
  ): Promise<ValidationResult> {
    return this.conflictHandler.validateOperation(operation, data);
  }

  // Event Management
  addEventListener(handler: ItemEventHandler): () => void {
    return this.events.addEventListener(handler);
  }

  removeEventListener(handler: ItemEventHandler): void {
    this.events.removeEventListener(handler);
  }
}
