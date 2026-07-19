import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      // @a2ui/* 是可选 peer 依赖，代码里用的是子路径 import('@a2ui/lit/v0_9')，
      // 精确字符串匹配不到子路径，必须用函数匹配前缀，否则 Rollup 会把整个 A2UI 库误打进 bundle
      external: (id) =>
        [
          'react',
          'react-dom',
          'react/jsx-runtime',
          '@reduxjs/toolkit',
          'react-redux',
          'lucide-react',
          'axios',
          'dompurify',
          'markdown-it',
        ].includes(id) ||
        id.startsWith('@a2ui/lit') ||
        id.startsWith('@a2ui/web_core'),
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    cssCodeSplit: false,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
