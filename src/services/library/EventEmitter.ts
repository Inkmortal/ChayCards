import { ItemEvent, ItemEventHandler } from './types';

export class EventEmitter {
  private handlers: Set<ItemEventHandler> = new Set();

  async emit(event: ItemEvent): Promise<void> {
    const promises = Array.from(this.handlers).map(handler => 
      Promise.resolve(handler(event))
    );
    await Promise.all(promises);
  }

  addEventListener(handler: ItemEventHandler): () => void {
    this.handlers.add(handler);
    return () => this.removeEventListener(handler);
  }

  removeEventListener(handler: ItemEventHandler): void {
    this.handlers.delete(handler);
  }
}
