import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/** Serve static wealth-tool HTML at clean URLs (no React iframe shell). */
function staticWealthToolPaths() {
  const rewrites: Record<string, string> = {
    '/wealth-tools/swiss-tax-locator': '/wealth-tools/swiss-tax-locator.html',
    '/wealth-tools/swiss-tax-locator/': '/wealth-tools/swiss-tax-locator.html',
  };
  return {
    name: 'static-wealth-tool-paths',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const path = req.url?.split('?')[0] ?? '';
        if (rewrites[path]) {
          req.url = rewrites[path] + (req.url?.includes('?') ? '?' + req.url.split('?')[1] : '');
        }
        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), staticWealthToolPaths()],
  build: {
    outDir: 'dist',
  },
});
