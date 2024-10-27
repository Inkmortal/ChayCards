import { Item, QueryOptions, ItemStore } from './index';

export class QueryOperations {
  constructor(private store: ItemStore) {}

  async getItem(id: string): Promise<Item | null> {
    return this.store.getItem(id);
  }

  async getItems(options: QueryOptions = {}): Promise<Item[]> {
    let items = this.store.getItems();

    // Filter by parent
    if (options.parentId !== undefined) {
      items = items.filter((item: Item) => item.parentId === options.parentId);
    }

    // Filter by type
    if (options.type) {
      items = items.filter((item: Item) => item.type === options.type);
    }

    // Handle recursive option
    if (options.recursive && options.parentId !== undefined) {
      const allItems = new Set<Item>();
      const addChildren = (parentId: string | null) => {
        const children = items.filter((item: Item) => item.parentId === parentId);
        children.forEach((child: Item) => {
          allItems.add(child);
          addChildren(child.id);
        });
      };
      addChildren(options.parentId);
      items = Array.from(allItems);
    }

    // Sort items
    if (options.sortBy) {
      items.sort((a: Item, b: Item) => {
        const aValue = String(a[options.sortBy!] || '');
        const bValue = String(b[options.sortBy!] || '');
        const modifier = options.sortDirection === 'desc' ? -1 : 1;
        return aValue.localeCompare(bValue) * modifier;
      });
    }

    return items;
  }

  async findItems(query: string, options?: QueryOptions): Promise<Item[]> {
    const items = await this.getItems(options);
    const searchQuery = query.toLowerCase();
    
    return items.filter((item: Item) => 
      item.name.toLowerCase().includes(searchQuery)
    );
  }
}
