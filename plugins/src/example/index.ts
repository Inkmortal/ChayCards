import { Plugin } from '../types';

const ExamplePlugin: Plugin = {
  id: 'com.chaycards.example',
  name: 'Example Plugin',
  version: '1.0.0',
  description: 'Example plugin demonstrating the plugin API',
  author: 'ChayCards',

  async onLoad() {
    console.log('Example plugin loaded');
  },

  async onUnload() {
    console.log('Example plugin unloaded');
  }
};

export default ExamplePlugin;
