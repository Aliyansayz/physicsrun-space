import React from 'react';

/**
 * The shape produced by `import img from '...?as=picture'` (vite-imagetools).
 * `sources` is keyed by format, each value being a ready-to-use `srcset` string.
 */
export interface PictureData {
  sources: Record<string, string>;
  img: { src: string; w: number; h: number };
}

/** Formats ordered best-compression-first; the browser picks the first it supports. */
const SOURCE_ORDER: Array<{ format: string; mime: string }> = [
  { format: 'webp', mime: 'image/webp' },
  { format: 'jpg', mime: 'image/jpeg' },
];

interface ResponsiveImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  picture: PictureData;
  /**
   * Media-based width hints. Without this the browser assumes the image is
   * 100vw wide and always downloads the largest candidate, which defeats
   * `srcset` entirely for anything smaller than a full-bleed hero.
   */
  sizes?: string;
  /** Forces eager loading + high fetch priority. Use only for above-the-fold art. */
  priority?: boolean;
}

/**
 * Renders a `<picture>` element with WebP and JPEG sources, letting each
 * browser download the smallest format it understands.
 *
 * Intrinsic `width`/`height` are taken from the encoded image so the browser can
 * reserve the correct box before decoding, which prevents layout shift.
 */
export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  picture,
  sizes,
  priority = false,
  className,
  style,
  ...imgProps
}) => {
  const { sources, img } = picture;

  return (
    <picture>
      {SOURCE_ORDER.map(({ format, mime }) =>
        sources[format] ? <source key={format} srcSet={sources[format]} sizes={sizes} type={mime} /> : null
      )}
      <img
        {...imgProps}
        src={img.src}
        sizes={sizes}
        width={img.w}
        height={img.h}
        loading={priority ? 'eager' : (imgProps.loading ?? 'lazy')}
        fetchPriority={priority ? 'high' : imgProps.fetchPriority}
        decoding={imgProps.decoding ?? 'async'}
        className={className}
        style={style}
      />
    </picture>
  );
};
