import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';
import fs from 'fs-extra';
import path from 'path';
import { build } from 'esbuild';

// Custom plugin to compile and copy plugins
const compilePluginsPlugin = () => ({
  name: 'compile-plugins',
  closeBundle: async () => {
    const srcPluginsDir = resolve('src/plugins');
    const outPluginsDir = resolve('out/main/plugins');

    try {
      // Clean and ensure the output directory exists
      await fs.emptyDir(outPluginsDir);

      // Process each plugin
      const plugins = await fs.readdir(srcPluginsDir);
      for (const plugin of plugins) {
        const srcPath = path.join(srcPluginsDir, plugin);
        const destPath = path.join(outPluginsDir, plugin);

        if ((await fs.stat(srcPath)).isDirectory()) {
          // Create plugin directory
          await fs.ensureDir(destPath);

          // Find all TypeScript files
          const files = await fs.readdir(srcPath);
          const tsFiles = files.filter(file =>
            (file.endsWith('.ts') || file.endsWith('.tsx')) &&
            !file.endsWith('.d.ts')
          );

          // First compile plugin.ts/tsx
          const pluginFile = tsFiles.find(f => f === 'plugin.ts' || f === 'plugin.tsx');
          if (pluginFile) {
            const srcFile = path.join(srcPath, pluginFile);
            const destFile = path.join(destPath, 'plugin.js');

            await build({
              entryPoints: [srcFile],
              outfile: destFile,
              format: 'cjs',
              platform: 'node',
              target: 'node16',
              bundle: true,
              external: ['electron', 'react', 'react-dom', '@core/*', 'uuid'],
              sourcemap: true,
              define: {
                'process.env.NODE_ENV': '"production"'
              },
              jsx: 'transform',
              loader: {
                '.ts': 'ts',
                '.tsx': 'tsx'
              }
            });
          }

          // Then compile index.ts
          const indexFile = tsFiles.find(f => f === 'index.ts' || f === 'index.tsx');
          if (indexFile) {
            const srcFile = path.join(srcPath, indexFile);
            const destFile = path.join(destPath, 'index.js');

            await build({
              entryPoints: [srcFile],
              outfile: destFile,
              format: 'cjs',
              platform: 'node',
              target: 'node16',
              bundle: true,
              external: ['electron', 'react', 'react-dom', '@core/*', 'uuid'],
              sourcemap: true,
              define: {
                'process.env.NODE_ENV': '"production"'
              },
              jsx: 'transform',
              loader: {
                '.ts': 'ts',
                '.tsx': 'tsx'
              }
            });
          }

          // Then compile remaining TypeScript files
          const remainingFiles = tsFiles.filter(f =>
            f !== 'plugin.ts' &&
            f !== 'plugin.tsx' &&
            f !== 'index.ts' &&
            f !== 'index.tsx'
          );

          for (const file of remainingFiles) {
            const srcFile = path.join(srcPath, file);
            const destFile = path.join(
              destPath,
              file.replace(/\.tsx?$/, '.js')
            );

            await build({
              entryPoints: [srcFile],
              outfile: destFile,
              format: 'cjs',
              platform: 'node',
              target: 'node16',
              bundle: true,
              external: ['electron', 'react', 'react-dom', '@core/*', 'uuid'],
              sourcemap: true,
              define: {
                'process.env.NODE_ENV': '"production"'
              },
              jsx: 'transform',
              loader: {
                '.ts': 'ts',
                '.tsx': 'tsx'
              }
            });
          }

          // Copy non-TypeScript files
          await fs.copy(srcPath, destPath, {
            filter: (src) => {
              const filename = path.basename(src);
              return !filename.endsWith('.ts') &&
                     !filename.endsWith('.tsx') &&
                     !filename.endsWith('.d.ts');
            }
          });
        }
      }

      console.log('Successfully compiled and copied plugins to output directory');
    } catch (error) {
      console.error('Error processing plugins:', error);
      throw error;
    }
  }
});

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin(), compilePluginsPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve('src/main/index.ts')
        }
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@core': resolve('src/core')
      }
    },
    plugins: [react()]
  }
});
