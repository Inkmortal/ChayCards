import { 
  Item, 
  ItemData, 
  OperationResult, 
  LibraryError, 
  ValidationResult,
  ItemStore,
  EventEmitter,
  validateName
} from './index';

export class BaseOperations {
  constructor(
    private store: ItemStore,
    private events: EventEmitter
  ) {}

  async createItem(data: ItemData): Promise<OperationResult<Item>> {
    try {
      const validation = validateName(this.store.getItems(), data.name, data.parentId);
      if (!validation.isValid) {
        return {
          success: false,
          error: new LibraryError(
            validation.errors?.[0] || 'Invalid item data',
            'NAME_CONFLICT'
          )
        };
      }

      const item: Item = {
        id: crypto.randomUUID(),
        name: data.name,
        type: data.type,
        parentId: data.parentId,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
        metadata: data.metadata
      };

      await this.store.addItem(item);
      await this.events.emit({ type: 'created', item });

      return { success: true, data: item };
    } catch (error) {
      return {
        success: false,
        error: new LibraryError('Failed to create item', 'STORAGE_ERROR')
      };
    }
  }

  async updateItem(id: string, data: Partial<ItemData>): Promise<OperationResult<Item>> {
    try {
      const item = await this.store.getItem(id);
      if (!item) {
        return {
          success: false,
          error: new LibraryError('Item not found', 'ITEM_NOT_FOUND')
        };
      }

      if (data.name && data.name !== item.name) {
        const validation = validateName(this.store.getItems(), data.name, item.parentId);
        if (!validation.isValid) {
          return {
            success: false,
            error: new LibraryError(validation.errors?.[0] || 'Invalid name', 'NAME_CONFLICT')
          };
        }
      }

      const updatedItem: Item = {
        ...item,
        ...data,
        modifiedAt: new Date().toISOString()
      };

      await this.store.updateItem(updatedItem);
      await this.events.emit({ type: 'updated', item: updatedItem });

      return { success: true, data: updatedItem };
    } catch (error) {
      return {
        success: false,
        error: new LibraryError('Failed to update item', 'STORAGE_ERROR')
      };
    }
  }

  async deleteItem(id: string): Promise<OperationResult> {
    try {
      const itemsToDelete = await this.store.getItemsToDelete(id);
      if (itemsToDelete.length === 0) {
        return {
          success: false,
          error: new LibraryError('Item not found', 'ITEM_NOT_FOUND')
        };
      }

      for (const item of itemsToDelete) {
        await this.store.deleteItem(item.id);
        await this.events.emit({ type: 'deleted', item });
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: new LibraryError('Failed to delete item', 'STORAGE_ERROR')
      };
    }
  }

  async moveItem(id: string, targetId: string | null): Promise<OperationResult> {
    return this.updateItem(id, { parentId: targetId }).then(result => ({
      success: result.success,
      error: result.error
    }));
  }
}
