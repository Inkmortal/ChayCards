/// <reference types="jest" />
import { PluginAPI } from '../src/types';

// Test environment setup
process.env.NODE_ENV = 'test';

// Mock plugin API interfaces
const mockPluginAPI: PluginAPI = {
  registerPlugin: jest.fn().mockResolvedValue(undefined),
  getPlugin: jest.fn().mockResolvedValue(null),
  events: {
    emit: jest.fn(),
    on: jest.fn(),
    off: jest.fn()
  }
};

global.pluginAPI = mockPluginAPI;
