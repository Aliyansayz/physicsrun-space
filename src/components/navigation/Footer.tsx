import React from 'react';
import { ActiveView } from '../../types';
import { cosmicImages } from '../../assets/images';
import { ResponsiveImage } from '../common/ResponsiveImage';

interface FooterProps {
  setActiveView: (view: ActiveView) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveView }) => {
  return (
    <footer className="relative overflow-hidden py-6 px-6 text-center border-y border-white/10">
      {/* Starry Galactic View Image Background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <ResponsiveImage
          picture={cosmicImages.galaxyClusterDeepfield.picture}
          alt="Starry Galactic Deep Field"
          className="w-full h-96 object-center opacity-40"
          sizes="100vw"
        />
        {/* Deep starry space gradient scrims */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070e] via-[#05070e]/70 to-[#05070e]/85" />
      </div>

      {/* Content Layout without boxed container */}
      <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center justify-center space-y-6">
        {/* Navigation links floating over starry galactic backdrop */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-slate-300 font-light">
          <button 
            onClick={() => { setActiveView('landing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
            className="hover:text-cyan-300 transition-colors cursor-pointer"
          >
            Home Catalog
          </button>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <button 
            onClick={() => { setActiveView('ebook'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
            className="hover:text-cyan-300 transition-colors cursor-pointer"
          >
            Ebook Library
          </button>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <button 
            onClick={() => { setActiveView('astrolens'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
            className="hover:text-cyan-300 transition-colors cursor-pointer"
          >
            AstroLens Observatory
          </button>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <button 
            onClick={() => { setActiveView('planets'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
            className="hover:text-cyan-300 transition-colors cursor-pointer"
          >
            3D Planets
          </button>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <button 
            onClick={() => { setActiveView('starmap'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
            className="hover:text-cyan-300 transition-colors cursor-pointer"
          >
            Star Map
          </button>
        </div>

        {/* Handwritten 'The Universe is Calling' with celestial typography */}
        <div className="flex flex-col items-center justify-center space-y-2 select-none pt-2">
          <p className="font-handwriting text-3xl sm:text-4xl md:text-5xl text-cyan-200 tracking-wide drop-shadow-[0_2px_16px_rgba(34,211,238,0.45)] hover:text-white transition-all duration-300">
            The Universe is Calling
          </p>
          <p className="text-[11px] text-slate-400 font-mono tracking-widest uppercase">
            AstroLens · Celestial Exploration & 3D Interactive Atlas
          </p>
        </div>
      </div>
    </footer>
  );
};
