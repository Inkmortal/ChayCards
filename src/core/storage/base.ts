/**
 * Base interface for data persistence operations
 */
export interface DataStorage<T> {
  /**
   * Load data from storage
   */
  load(): Promise<T>;

  /**
   * Save data to storage
   */
  save(data: T): Promise<T>;
}

/**
 * Event types that can be emitted by storage operations
 */
export enum StorageAction {
  CREATED = 'created',
  UPDATED = 'updated',
  DELETED = 'deleted',
  MOVED = 'moved',
  BACKUP_CREATED = 'backup_created',
  ERROR = 'error'
}

/**
 * Structure of events emitted during storage operations
 */
export interface StorageChangeEvent<T = any> {
  type: StorageAction;
  data?: T;
  timestamp: number;
  metadata?: {
    source?: string;
    operation?: string;
    [key: string]: any;
  };
}

/**
 * Interface for subscribing to storage changes
 */
export interface StorageEventEmitter {
  /**
   * Subscribe to specific storage actions
   * @param action Action type to subscribe to
   * @param callback Function to call when action occurs
   * @returns Function to unsubscribe
   */
  subscribe<T>(
    action: StorageAction,
    callback: (event: StorageChangeEvent<T>) => void
  ): () => void;

  /**
   * Subscribe to all storage changes
   * @param callback Function to call when any change occurs
   * @returns Function to unsubscribe
   */
  subscribeToUpdates(callback: () => void): () => void;
}

/**
 * Error codes for storage operations
 */
export enum StorageErrorCode {
  NOT_FOUND = 'NOT_FOUND',
  INVALID_DATA = 'INVALID_DATA',
  STORAGE_ERROR = 'STORAGE_ERROR',
  BACKUP_ERROR = 'BACKUP_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  OPERATION_FAILED = 'OPERATION_FAILED',
  CONCURRENT_MODIFICATION = 'CONCURRENT_MODIFICATION'
}

/**
 * Enhanced error class for storage operations
 */
export class StorageError extends Error {
  public timestamp: number;
  public context?: any;

  constructor(
    message: string,
    public code: StorageErrorCode,
    context?: any
  ) {
    super(message);
    this.name = 'StorageError';
    this.timestamp = Date.now();
    this.context = context;
  }

  /**
   * Check if error is retryable based on error code
   */
  isRetryable(): boolean {
    return [
      StorageErrorCode.STORAGE_ERROR,
      StorageErrorCode.OPERATION_FAILED,
      StorageErrorCode.CONCURRENT_MODIFICATION
    ].includes(this.code);
  }

  /**
   * Create change event from this error
   */
  toEvent(): StorageChangeEvent {
    return {
      type: StorageAction.ERROR,
      data: {
        code: this.code,
        message: this.message,
        context: this.context
      },
      timestamp: this.timestamp
    };
  }
}
