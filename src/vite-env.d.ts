/// <reference types="vite/client" />

import type { Picture, Img } from 'vite-imagetools';

declare module '*?as=picture*' {
  const picture: Picture;
  export default picture;
}

declare module '*?as=img*' {
  const img: Img;
  export default img;
}

declare module '*?as=srcset*' {
  const srcset: string;
  export default srcset;
}

declare module '*?as=url*' {
  const url: string;
  export default url;
}

import type { PictureData } from './components/common/ResponsiveImage';

/**
 * Teaches TypeScript the shape returned by `vite-imagetools` query directives.
 * Vite's own '*.png' declaration types asset imports as a plain URL string, which
 * does not match the object emitted by `?as=picture`. A single `*` is required
 * because TypeScript only supports one wildcard per ambient module pattern.
 */
declare module '*?as=picture&w=640;1440&format=webp;png&withoutEnlargement' {
  const picture: PictureData;
  export default picture;
}
