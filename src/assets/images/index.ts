import andromedaGalaxyM31 from './andromeda_galaxy_m31_1791847894303.png?as=picture&w=640;1440&format=webp;jpg&quality=88&withoutEnlargement';
import celestialMoon from './celestial_moon_surface_1791661072908.png?as=picture&w=640;1440&format=webp;jpg&quality=88&withoutEnlargement';
import cosmicStellarNebula from './cosmic_stellar_nebula_1791661085694.png?as=picture&w=640;1440&format=webp;jpg&quality=88&withoutEnlargement';
import galaxyClusterCollision from './galaxy_cluster_collision_1791711722403.png?as=picture&w=640;1440&format=webp;jpg&quality=88&withoutEnlargement';
import galaxyClusterDeepfield from './galaxy_cluster_deepfield_1791711670367.png?as=picture&w=640;1440&format=webp;jpg&quality=88&withoutEnlargement';
import pandoraClusterSharp from './pandora_cluster_sharp_1791737058239.png?as=picture&w=640;1440&format=webp;jpg&quality=88&withoutEnlargement';
import spiralGalaxyCore from './spiral_galaxy_core_1791661096182.png?as=picture&w=640;1440&format=webp;jpg&quality=88&withoutEnlargement';
import supermassiveBlackHole from './supermassive_black_hole_1791661107412.png?as=picture&w=640;1440&format=webp;jpg&quality=88&withoutEnlargement';
import supernovaCosmicExplosion from './supernova_cosmic_explosion_1791711683777.png?as=picture&w=640;1440&format=webp;jpg&quality=88&withoutEnlargement';
import supernovaRemnantVeil from './supernova_remnant_veil_1791711709434.png?as=picture&w=640;1440&format=webp;jpg&quality=88&withoutEnlargement';

/**
 * Central registry of the cosmic imagery.
 *
 * Each entry is processed by `vite-imagetools`, which emits WebP and JPEG
 * variants at 640/1440 width (`withoutEnlargement` keeps the 1200px sources
 * from being upscaled). Consumers that render markup should use the `picture`
 * object with `<ResponsiveImage>` so the browser can pick the smallest format
 * it supports; consumers that only need a plain URL string (data records
 * consumed by legacy `<img src>` call sites) use `url`.
 *
 * IMPORTANT: the width/format counts below are load-bearing. Emitting three
 * widths across two formats (54 assets) reliably crashes the Rolldown
 * allocator during `rendering chunks` with "out of memory" — an upstream
 * `oxc_allocator` bug triggered by the volume of emitted binary assets, not by
 * anything in this repo. 2 widths x 2 formats (36 assets) builds reproducibly.
 * If you add a width or format here, re-run `npm run build` to confirm it still
 * succeeds, and keep `src/vite-env.d.ts` in sync with the query string.
 */
export const cosmicImages = {
  andromedaGalaxyM31: {
    picture: andromedaGalaxyM31,
    url: andromedaGalaxyM31.img.src,
  },
  celestialMoon: {
    picture: celestialMoon,
    url: celestialMoon.img.src,
  },
  cosmicStellarNebula: {
    picture: cosmicStellarNebula,
    url: cosmicStellarNebula.img.src,
  },
  galaxyClusterCollision: {
    picture: galaxyClusterCollision,
    url: galaxyClusterCollision.img.src,
  },
  galaxyClusterDeepfield: {
    picture: galaxyClusterDeepfield,
    url: galaxyClusterDeepfield.img.src,
  },
  pandoraClusterSharp: {
    picture: pandoraClusterSharp,
    url: pandoraClusterSharp.img.src,
  },
  spiralGalaxyCore: {
    picture: spiralGalaxyCore,
    url: spiralGalaxyCore.img.src,
  },
  supermassiveBlackHole: {
    picture: supermassiveBlackHole,
    url: supermassiveBlackHole.img.src,
  },
  supernovaCosmicExplosion: {
    picture: supernovaCosmicExplosion,
    url: supernovaCosmicExplosion.img.src,
  },
  supernovaRemnantVeil: {
    picture: supernovaRemnantVeil,
    url: supernovaRemnantVeil.img.src,
  },
} as const;

export type CosmicImageKey = keyof typeof cosmicImages;
