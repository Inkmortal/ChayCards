import { DocumentTypePlugin } from '../types/document';
import { database } from '../database/service';
import path from 'path';
import fs from 'fs/promises';
import { app } from 'electron';
import { pathToFileURL } from 'url';

export class PluginLoader {
  private pluginsDir: string;

  constructor() {
    // Use the user data directory for plugins
    this.pluginsDir = path.join(app.getPath('userData'), 'plugins');
    console.log('Plugins directory:', this.pluginsDir);
  }

  async initialize(): Promise<void> {
    try {
      // Ensure plugins directory exists
      await fs.mkdir(this.pluginsDir, { recursive: true });

      // Copy built plugins on first run
      // Use the correct built plugins directory based on environment
      const isProduction = process.env.NODE_ENV === 'production';
      const builtPluginsDir = path.join(
        app.getAppPath(),
        isProduction ? 'dist' : 'out',
        'main',
        'plugins'
      );

      console.log('Looking for built plugins in:', builtPluginsDir);

      if (await this.exists(builtPluginsDir)) {
        const entries = await fs.readdir(builtPluginsDir);
        for (const entry of entries) {
          const src = path.join(builtPluginsDir, entry);
          const dest = path.join(this.pluginsDir, entry);
          if (!(await this.exists(dest))) {
            console.log(`Copying plugin from ${src} to ${dest}`);
            await fs.cp(src, dest, { recursive: true });
          }
        }
      } else {
        console.warn('Built plugins directory not found:', builtPluginsDir);
      }
    } catch (error) {
      console.error('Error initializing plugin directory:', error);
    }
  }

  async loadPlugins(): Promise<DocumentTypePlugin<any>[]> {
    const plugins: DocumentTypePlugin<any>[] = [];

    try {
      // Ensure plugins directory exists
      await this.initialize();

      // Read all directories in the plugins folder
      const entries = await fs.readdir(this.pluginsDir, { withFileTypes: true });
      const pluginDirs = entries.filter(entry => entry.isDirectory());

      // Load each plugin
      for (const dir of pluginDirs) {
        try {
          const pluginName = dir.name;
          console.log(`Loading plugin: ${pluginName}`);

          // Look for plugin.js file
          const pluginPath = path.join(this.pluginsDir, pluginName, 'plugin.js');

          if (await this.exists(pluginPath)) {
            // Convert the file path to a file URL for import
            const fileUrl = pathToFileURL(pluginPath).href;
            console.log(`Loading plugin from: ${fileUrl}`);

            try {
              // Import the plugin module
              const pluginModule = await import(fileUrl);

              // Get the plugin class (either default export or named export)
              const PluginClass = pluginModule.default ||
                Object.values(pluginModule).find(exp =>
                  typeof exp === 'function' &&
                  exp.name &&
                  exp.name.endsWith('Plugin')
                );

              if (PluginClass && typeof PluginClass === 'function') {
                try {
                  const plugin = new PluginClass(database);
                  if (this.isValidPlugin(plugin)) {
                    plugins.push(plugin);
                    console.log(`Successfully loaded plugin: ${plugin.displayName}`);
                  }
                } catch (error) {
                  console.error(`Error initializing plugin ${pluginName}:`, error);
                }
              } else {
                console.warn(`No valid plugin class found in ${pluginName}`);
              }
            } catch (error) {
              console.error(`Error importing plugin ${pluginName}:`, error);
              if (error instanceof Error) {
                console.error('Error details:', error.message);
                console.error('Stack trace:', error.stack);
              }
            }
          } else {
            console.warn(`No plugin.js found in ${pluginName}`);
          }
        } catch (error) {
          console.error(`Error loading plugin from directory ${dir.name}:`, error);
          if (error instanceof Error) {
            console.error('Error details:', error.message);
            console.error('Stack trace:', error.stack);
          }
        }
      }

      if (plugins.length === 0) {
        console.warn('No plugins were loaded successfully');
      } else {
        console.log(`Successfully loaded ${plugins.length} plugins`);
      }

    } catch (error) {
      console.error('Error loading plugins:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        console.error('Stack trace:', error.stack);
      }
    }

    return plugins;
  }

  private async exists(path: string): Promise<boolean> {
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  }

  private isValidPlugin(plugin: any): plugin is DocumentTypePlugin<any> {
    const required = [
      'type',
      'displayName',
      'initialize',
      'validateDocument',
      'createDocument',
      'updateDocument',
      'deleteDocument',
      'getAllDocuments',
      'EditorComponent',
      'schema'
    ];

    const missing = required.filter(prop => {
      const value = plugin[prop];
      return value === undefined ||
        (typeof value !== 'function' && prop !== 'type' && prop !== 'displayName' && prop !== 'schema' && prop !== 'EditorComponent');
    });

    if (missing.length > 0) {
      console.warn('Plugin is missing required properties:', missing);
      return false;
    }

    return true;
  }
}
