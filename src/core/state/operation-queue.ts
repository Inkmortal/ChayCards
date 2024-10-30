import { OperationResult } from '../operations/types';

export type OperationStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'conflict';

export type QueuedOperation = {
  id: string;
  type: 'create' | 'move' | 'rename' | 'delete' | 'replace';
  execute: () => Promise<OperationResult<any>>;
  status: OperationStatus;
  error?: string;
};

export class OperationQueue {
  private queue: QueuedOperation[] = [];
  private isProcessing: boolean = false;
  private currentOperation: QueuedOperation | null = null;

  // Add operation to queue
  async queueOperation(operation: Omit<QueuedOperation, 'id' | 'status'>): Promise<OperationResult<any>> {
    const id = crypto.randomUUID();
    const queuedOp: QueuedOperation = {
      ...operation,
      id,
      status: 'pending'
    };

    this.queue.push(queuedOp);
    
    // Start processing if not already processing
    if (!this.isProcessing) {
      this.processQueue();
    }

    // Return promise that resolves when this specific operation completes
    return new Promise((resolve) => {
      const checkCompletion = setInterval(() => {
        const op = this.queue.find(op => op.id === id);
        if (!op) {
          // Operation completed and removed from queue
          clearInterval(checkCompletion);
          resolve({ success: true });
        } else if (op.status === 'failed') {
          clearInterval(checkCompletion);
          resolve({ success: false, error: op.error });
        } else if (op.status === 'conflict') {
          clearInterval(checkCompletion);
          resolve({ success: false, error: 'Conflict detected' });
        }
      }, 100);
    });
  }

  // Get current operation status
  getCurrentOperation(): QueuedOperation | null {
    return this.currentOperation;
  }

  // Process queue
  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const operation = this.queue[0];
      this.currentOperation = operation;
      operation.status = 'processing';

      try {
        const result = await operation.execute();
        
        if (!result.success) {
          if (result.data?.type === 'conflict') {
            operation.status = 'conflict';
            operation.error = result.error;
            this.isProcessing = false;
            return;
          } else {
            operation.status = 'failed';
            operation.error = result.error;
            this.queue.shift();
          }
        } else {
          operation.status = 'completed';
          this.queue.shift();
        }
      } catch (error) {
        operation.status = 'failed';
        operation.error = error instanceof Error ? error.message : 'Unknown error';
        this.queue.shift();
      }
    }

    this.isProcessing = false;
    this.currentOperation = null;
  }

  // Resume queue processing after conflict resolution
  resumeQueue() {
    if (this.currentOperation?.status === 'conflict') {
      this.queue.shift(); // Remove the conflicted operation
      this.currentOperation = null;
      this.isProcessing = false;
      this.processQueue();
    }
  }

  // Clear the queue
  clearQueue() {
    this.queue = [];
    this.currentOperation = null;
    this.isProcessing = false;
  }
}
