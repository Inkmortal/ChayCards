import ExamplePlugin from './index';

describe('Example Plugin', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should have correct metadata', () => {
    expect(ExamplePlugin.id).toBe('com.chaycards.example');
    expect(ExamplePlugin.name).toBe('Example Plugin');
    expect(ExamplePlugin.version).toBe('1.0.0');
  });

  it('should call console.log on load', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    await ExamplePlugin.onLoad?.();
    expect(consoleSpy).toHaveBeenCalledWith('Example plugin loaded');
  });

  it('should call console.log on unload', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    await ExamplePlugin.onUnload?.();
    expect(consoleSpy).toHaveBeenCalledWith('Example plugin unloaded');
  });
});
