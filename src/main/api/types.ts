// Core Plugin Types
export interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  dependencies?: string[];
  
  onLoad?: () => Promise<void>;
  onUnload?: () => Promise<void>;
  
  extends?: {
    documentTypes?: DocumentTypeExtension[];
    views?: ViewExtension[];
    components?: ComponentExtension[];
  };
  
  api?: Record<string, unknown>;
}

export interface DocumentTypeExtension {
  target: string;
  components?: ComponentExtension[];
  api?: Record<string, unknown>;
}

export interface ViewExtension {
  target: string;
  component: React.ComponentType<any>;
}

export interface ComponentExtension {
  type: 'toolbar' | 'sidebar' | 'menu';
  component: React.ComponentType<any>;
}

// Plugin API Types
export interface PluginAPI {
  registerPlugin: (plugin: Plugin) => Promise<void>;
  getPlugin: (id: string) => Promise<Plugin | null>;
  events: EventAPI;
}

export interface EventAPI {
  emit: (event: string, data?: any) => void;
  on: (event: string, callback: (data?: any) => void) => void;
  off: (event: string, callback: (data?: any) => void) => void;
}

// Declare global for test environment
declare global {
  var pluginAPI: PluginAPI;
}
