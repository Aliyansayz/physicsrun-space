import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { imagetools } from 'vite-imagetools';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      // Generates WebP + PNG variants at each requested width from a single
      // '?as=picture&w=...' import. Transformed images are cached so repeat builds stay fast.
      //
      // `include` is deliberately narrow: left at its default the plugin picks up
      // every image-ish import in the graph, and handing `favicon.ico` through
      // sharp crashes the Rolldown native allocator mid-render.
      imagetools({
        include: [/src[/\\]assets[/\\]images[/\\].*\.png\?/],
        exclude: [/favicon\.ico$/],
        cache: { enabled: true },
      }),
    ],
    build: {
      // `three` is only pulled in by the 3D planet/star-map views, which sit far
      // below the landing page. Splitting it out keeps the landing bundle small
      // and lets the browser fetch the 3D code in parallel only when needed.
      rollupOptions: {
        output: {
          // Vite 8 requires the function form; the object form is not assignable.
          manualChunks(id) {
            if (id.includes('node_modules/three/')) return 'three';
            return undefined;
          },
        },
      },
    },
  };
});
