import React from 'react';
import { cosmicImages } from '../../assets/images';

export const RotatingHeroImages: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Single hero image - Earth & Moon from Episode 01 */}
      <img
        src={cosmicImages.celestialMoon.url}
        alt="Earth & Moon Horizon — Episode 01: The Sol Frontier"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />
    </div>
  );
};