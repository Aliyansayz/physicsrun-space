import React, { useState, useEffect } from 'react';
import { ActiveView } from '../../types';
import { ambientAudio } from '../../services/ambientAudio';
import { Search, Volume2, VolumeX, Menu, X, Orbit, ArrowLeft, BookOpen, Eye, Moon } from 'lucide-react';

interface HeaderProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  onOpenSearch: () => void;
  isAmbientPlaying: boolean;
  setIsAmbientPlaying: (playing: boolean) => void;
  isReaderActive?: boolean;
  onExitReader?: () => void;
  readerChapterTitle?: string;
  isRedLightMode?: boolean;
  setIsRedLightMode?: (mode: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  onOpenSearch,
  isAmbientPlaying,
  setIsAmbientPlaying,
  isReaderActive = false,
  onExitReader,
  readerChapterTitle,
  isRedLightMode = false,
  setIsRedLightMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on Escape key
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [mobileMenuOpen]);

  const handleToggleAmbient = () => {
    const isNowPlaying = ambientAudio.toggle();
    setIsAmbientPlaying(isNowPlaying);
  };

  const handleExploreClick = () => {
    if (activeView === 'landing') {
      const exploreElem = document.getElementById('explore-section');
      if (exploreElem) {
        exploreElem.scrollIntoView({ behavior: 'smooth' });
      } else {
        setActiveView('ebook');
      }
    } else {
      setActiveView('ebook');
    }
    setMobileMenuOpen(false);
  };

  const handleAboutClick = () => {
    if (activeView === 'landing') {
      const featuredElem = document.getElementById('featured-section');
      if (featuredElem) {
        featuredElem.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      setActiveView('landing');
      requestAnimationFrame(() => {
        setTimeout(() => {
          const featuredElem = document.getElementById('featured-section');
          if (featuredElem) featuredElem.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent border-none shadow-none"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between relative z-10">
        
        {/* Left Side: Brand Wordmark + Optional Reader Back Button */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button 
            onClick={() => { 
              setActiveView('landing'); 
              window.scrollTo({ top: 0, behavior: 'smooth' }); 
            }}
            className="flex items-center space-x-2.5 text-left group select-none cursor-pointer"
          >
            <Orbit className="w-5 h-5 text-white/90 group-hover:text-white transition-colors stroke-[1.6]" />
            <span className="font-light tracking-tight text-lg text-white group-hover:text-slate-200 transition-colors">
              PhysicsRun
            </span>
          </button>

          {isReaderActive && onExitReader && (
            <button
              onClick={onExitReader}
              title="Return to Ebook Overview"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/70 border border-cyan-800/70 hover:border-cyan-500/80 text-xs font-mono text-cyan-300 hover:text-white transition-all cursor-pointer shadow-sm animate-in fade-in"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
              <span>Back to Overview</span>
            </button>
          )}

          {isReaderActive && readerChapterTitle && (
            <div className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-400">
              <span className="text-cyan-400">Reading:</span>
              <span className="text-slate-200 truncate max-w-[200px]">{readerChapterTitle}</span>
            </div>
          )}
        </div>

        {/* Desktop Nav Links & Search: Home, Ebook, AstroLens, Planets, Star Map */}
        <div className="hidden md:flex items-center space-x-7 text-sm font-light">
          <button 
            onClick={() => { 
              setActiveView('landing'); 
              window.scrollTo({ top: 0, behavior: 'smooth' }); 
            }}
            className={`transition-colors cursor-pointer py-1 ${
              activeView === 'landing' ? 'text-cyan-300 font-medium' : 'text-slate-300 hover:text-white'
            }`}
          >
            Home
          </button>

          <button 
            onClick={() => { 
              if (isReaderActive && onExitReader) {
                onExitReader();
              } else {
                setActiveView('ebook'); 
              }
              window.scrollTo({ top: 0, behavior: 'smooth' }); 
            }}
            className={`transition-colors cursor-pointer py-1 ${
              activeView === 'ebook' ? 'text-cyan-300 font-medium' : 'text-slate-300 hover:text-white'
            }`}
          >
            Ebook
          </button>

          <button 
            onClick={() => { 
              setActiveView('astrolens'); 
              window.scrollTo({ top: 0, behavior: 'smooth' }); 
            }}
            className={`transition-colors cursor-pointer py-1 flex items-center space-x-1.5 ${
              activeView === 'astrolens' ? 'text-cyan-300 font-medium' : 'text-slate-300 hover:text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>AstroLens</span>
          </button>

          <button 
            onClick={() => { 
              setActiveView('planets'); 
              window.scrollTo({ top: 0, behavior: 'smooth' }); 
            }}
            className={`transition-colors cursor-pointer py-1 ${
              activeView === 'planets' ? 'text-white font-normal' : 'text-slate-300 hover:text-white'
            }`}
          >
            Solar System
          </button>

          <button 
            onClick={() => { 
              setActiveView('starmap'); 
              window.scrollTo({ top: 0, behavior: 'smooth' }); 
            }}
            className={`transition-colors cursor-pointer py-1 ${
              activeView === 'starmap' ? 'text-white font-normal' : 'text-slate-300 hover:text-white'
            }`}
          >
            Star Map
          </button>

          <button 
            onClick={() => { 
              setActiveView('glossary'); 
              window.scrollTo({ top: 0, behavior: 'smooth' }); 
            }}
            className={`transition-colors cursor-pointer py-1 ${
              activeView === 'glossary' ? (isRedLightMode ? 'text-red-400 font-semibold' : 'text-cyan-300 font-medium') : 'text-slate-300 hover:text-white'
            }`}
          >
            Glossary
          </button>

          {/* Astrophotography Dark Sky Status Badge */}
          <div className="hidden lg:inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-950/70 border border-white/10 text-[11px] font-mono text-slate-300 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>🌑 Moon 4%</span>
            <span className="text-slate-600">·</span>
            <span>Bortle 1</span>
            <span className="text-slate-600">·</span>
            <span>0.8″ FWHM</span>
          </div>

          {/* Astrophotographer Night Vision Red-Light Mode Toggle */}
          {setIsRedLightMode && (
            <button
              onClick={() => setIsRedLightMode(!isRedLightMode)}
              title={isRedLightMode ? 'Disable Red-Light Mode (Return to Normal Spectrum)' : 'Enable Red-Light Safe Mode (Preserves Dark-Adapted Vision)'}
              aria-label="Toggle astrophotography red-light safe mode"
              className={`p-1.5 rounded-xl border text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                isRedLightMode
                  ? 'bg-red-950/90 border-red-500 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                  : 'bg-slate-900/40 hover:bg-slate-800 border-white/10 text-slate-400 hover:text-red-400'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden xl:inline">{isRedLightMode ? 'Red Safe' : 'Night Vision'}</span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={handleToggleAmbient}
            title={isAmbientPlaying ? 'Mute ambient soundscape' : 'Play ambient cosmic soundscape'}
            aria-label="Toggle ambient audio"
            className="text-slate-400 hover:text-white transition-colors p-1 cursor-pointer flex items-center"
          >
            {isAmbientPlaying ? (
              <Volume2 className={`w-4 h-4 animate-pulse ${isRedLightMode ? 'text-red-400' : 'text-cyan-400'}`} />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Search Button */}
          <button
            onClick={onOpenSearch}
            title="Search the cosmos"
            aria-label="Search"
            className="text-slate-300 hover:text-white transition-colors p-1 cursor-pointer flex items-center"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Hamburger Controls */}
        <div className="flex md:hidden items-center space-x-2">
          {setIsRedLightMode && (
            <button
              onClick={() => setIsRedLightMode(!isRedLightMode)}
              aria-label="Toggle red light mode"
              className={`p-1.5 rounded-lg border text-xs ${
                isRedLightMode ? 'bg-red-950 border-red-500 text-red-400' : 'border-white/10 text-slate-400'
              }`}
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleToggleAmbient}
            aria-label="Toggle sound"
            className="text-slate-300 hover:text-white p-1"
          >
            {isAmbientPlaying ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={onOpenSearch}
            aria-label="Search"
            className="text-slate-300 hover:text-white p-1"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
            className="text-slate-300 hover:text-white p-1"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div role="dialog" aria-label="Navigation menu" className="md:hidden bg-[#060913]/98 backdrop-blur-xl border-b border-slate-900 px-6 py-6 space-y-4 animate-in fade-in duration-200">
          <button
            onClick={() => { 
              setActiveView('landing'); 
              setMobileMenuOpen(false); 
              window.scrollTo({ top: 0, behavior: 'smooth' }); 
            }}
            className={`block text-left w-full text-sm py-1.5 ${
              activeView === 'landing' ? 'text-cyan-300 font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Home Landing
          </button>
          <button
            onClick={() => { 
              setActiveView('ebook'); 
              setMobileMenuOpen(false); 
              window.scrollTo({ top: 0, behavior: 'smooth' }); 
            }}
            className={`block text-left w-full text-sm py-1.5 ${
              activeView === 'ebook' ? 'text-cyan-300 font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Cinematic Ebook Reader
          </button>
          <button
            onClick={() => { 
              setActiveView('astrolens'); 
              setMobileMenuOpen(false); 
              window.scrollTo({ top: 0, behavior: 'smooth' }); 
            }}
            className={`block text-left w-full text-sm py-1.5 flex items-center space-x-2 ${
              activeView === 'astrolens' ? 'text-cyan-300 font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>AstroLens Observatory</span>
          </button>
          <button
            onClick={() => { 
              setActiveView('glossary'); 
              setMobileMenuOpen(false); 
              window.scrollTo({ top: 0, behavior: 'smooth' }); 
            }}
            className={`block text-left w-full text-sm py-1.5 ${
              activeView === 'glossary' ? 'text-cyan-300 font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Cosmic Phenomena Glossary
          </button>
          <div className="pt-2 border-t border-slate-900 flex flex-col gap-2">
            <button
              onClick={() => { setActiveView('planets'); setMobileMenuOpen(false); }}
              className="text-left text-sm text-slate-300 hover:text-white py-1"
            >
              Solar System (3D Planets)
            </button>
            <button
              onClick={() => { setActiveView('starmap'); setMobileMenuOpen(false); }}
              className="text-left text-sm text-slate-300 hover:text-white py-1"
            >
              Star Map (3D Celestial Atlas)
            </button>
          </div>
          <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-xs">
            <span className="text-slate-400">Ambient Soundscape</span>
            <button
              onClick={handleToggleAmbient}
              className="text-cyan-400 font-mono hover:underline"
            >
              {isAmbientPlaying ? 'Sound Active' : 'Sound Muted'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
