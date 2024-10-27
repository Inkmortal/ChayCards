import { 
  Item,
  ItemConflict, 
  ConflictResolution, 
  OperationResult, 
  LibraryError,
  ValidationResult,
  ItemStore,
  validateMove,
  validateName
} from './index';
import { BaseOperations } from './BaseOperations';

export class ConflictHandler {
  constructor(
    private store: ItemStore,
    private baseOps: BaseOperations
  ) {}

  async resolveConflict(
    conflict: ItemConflict,
    resolution: ConflictResolution
  ): Promise<OperationResult> {
    try {
      const item = await this.store.getItem(conflict.sourceId);
      if (!item) {
        return {
          success: false,
          error: new LibraryError('Item not found', 'ITEM_NOT_FOUND')
        };
      }

      if (resolution.action === 'rename' && resolution.newName) {
        const result = await this.baseOps.updateItem(conflict.sourceId, {
          name: resolution.newName,
          parentId: conflict.targetId
        });
        return {
          success: result.success,
          error: result.error
        };
      } 
      
      if (resolution.action === 'replace') {
        const conflictingItem = (await this.store.getItems()).find(
          (item: Item) => 
            item.parentId === conflict.targetId &&
            item.name.toLowerCase() === conflict.sourceName.toLowerCase()
        );

        if (conflictingItem) {
          await this.baseOps.deleteItem(conflictingItem.id);
        }

        const result = await this.baseOps.updateItem(conflict.sourceId, {
          parentId: conflict.targetId
        });
        return {
          success: result.success,
          error: result.error
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: new LibraryError('Failed to resolve conflict', 'STORAGE_ERROR')
      };
    }
  }

  async validateOperation(
    operation: 'create' | 'move' | 'rename',
    data: any
  ): Promise<ValidationResult> {
    const items = this.store.getItems();
    
    switch (operation) {
      case 'create':
      case 'rename':
        return validateName(items, data.name, data.parentId);
      case 'move':
        return validateMove(items, data.itemId, data.targetId);
      default:
        return { isValid: false, errors: ['Invalid operation'] };
    }
  }
}
