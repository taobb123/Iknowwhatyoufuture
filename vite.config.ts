import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 添加自定义加载器处理 markdown 文件
  assetsInclude: ['**/*.md'],
  // 添加对 markdown 文件的处理
  optimizeDeps: {
    include: ['react', 'react-dom']
  },
  // 确保能正确解析 markdown 文件
  resolve: {
    extensions: ['.md', '.ts', '.tsx', '.js']
  }
});
