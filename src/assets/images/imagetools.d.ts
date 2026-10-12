/**
 * Ambient declaration for `vite-imagetools` transformed image imports.
 *
 * TypeScript permits at most one `*` per ambient module pattern, and the query
 * string is fixed-length at every call site (see `./index.ts`), so the pattern
 * is anchored on the trailing directive instead of a mid-query wildcard.
 * Anything imported with these directives is a `<picture>` description, never a
 * bare URL string.
 */
declare module '*&withoutEnlargement' {
  import type { Picture } from 'vite-imagetools';

  const picture: Picture;
  export default picture;
}
