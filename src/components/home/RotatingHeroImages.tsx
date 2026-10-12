import React from 'react';
import { cosmicImages } from '../../assets/images';

export const RotatingHeroImages: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Hero image - Pandora's Cluster (Abell 2744) with speed blur on hover */}
      <img
        src={cosmicImages.pandoraClusterSharp.url}
        alt="Pandora's Cluster (Abell 2744) Deep Field — JWST View"
        className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out hover:scale-105 hover:blur-sm cursor-pointer"
        loading="eager"
      />
    </div>
  );
};