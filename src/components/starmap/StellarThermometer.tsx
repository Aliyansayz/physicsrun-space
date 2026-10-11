import React from 'react';
import { SpectralClass } from '../../types';
import { Flame, Info, Sparkles } from 'lucide-react';

interface StellarThermometerProps {
  selectedClass: SpectralClass | 'ALL';
  onSelectClass: (cls: SpectralClass | 'ALL') => void;
}

interface SpectralBenchmark {
  cls: SpectralClass;
  tempK: string;
  colorHex: string;
  colorName: string;
  everydayAnalogy: string;
  exampleStars: string;
}

export const StellarThermometer: React.FC<StellarThermometerProps> = ({
  selectedClass,
  onSelectClass,
}) => {
  const benchmarks: SpectralBenchmark[] = [
    {
      cls: 'O',
      tempK: '> 30,000 K',
      colorHex: '#93c5fd',
      colorName: 'Deep Blue',
      everydayAnalogy: 'Atmospheric lightning bolt / thermonuclear fusion plasma',
      exampleStars: 'Alnitak, Mintaka (Orion’s Belt)',
    },
    {
      cls: 'B',
      tempK: '10,000–30,000 K',
      colorHex: '#bae6fd',
      colorName: 'Sky Cyan',
      everydayAnalogy: 'High-temperature blue oxyacetylene blowtorch flame',
      exampleStars: 'Rigel, Bellatrix, Alkaid',
    },
    {
      cls: 'A',
      tempK: '7,500–10,000 K',
      colorHex: '#ffffff',
      colorName: 'Crisp White',
      everydayAnalogy: 'High-intensity xenon arc lamp / welding spark',
      exampleStars: 'Sirius, Vega, Deneb',
    },
    {
      cls: 'F',
      tempK: '6,000–7,500 K',
      colorHex: '#fef08a',
      colorName: 'Yellow-White',
      everydayAnalogy: 'Tungsten-halogen searchlight beam',
      exampleStars: 'Polaris, Sadr',
    },
    {
      cls: 'G',
      tempK: '5,200–6,000 K',
      colorHex: '#fde047',
      colorName: 'Yellow',
      everydayAnalogy: 'Midday sunlight / classic yellow incandescence',
      exampleStars: 'Our Sun, Alpha Centauri A',
    },
    {
      cls: 'K',
      tempK: '3,700–5,200 K',
      colorHex: '#fb923c',
      colorName: 'Warm Orange',
      everydayAnalogy: 'Glowing electric stove heating coil',
      exampleStars: 'Aldebaran, Arcturus, Dubhe',
    },
    {
      cls: 'M',
      tempK: '2,400–3,700 K',
      colorHex: '#f87171',
      colorName: 'Ruby Red',
      everydayAnalogy: 'Candle flame / glowing wood embers in a fireplace',
      exampleStars: 'Betelgeuse, Antares',
    },
  ];

  return (
    <div className="bg-[#080d1e]/90 border border-slate-800 rounded-2xl p-4 backdrop-blur-md shadow-xl text-slate-200">
      
      {/* Title */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-100 font-semibold">
            Stellar Thermometer & Color Physics
          </h4>
        </div>
        <button
          onClick={() => onSelectClass('ALL')}
          className={`text-[11px] font-mono px-2 py-0.5 rounded transition-colors ${
            selectedClass === 'ALL'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          View All Classes
        </button>
      </div>

      <p className="text-xs text-slate-400 font-light leading-relaxed mb-3">
        In everyday life, red means "hot" and blue means "cold" on water faucets. But in fundamental blackbody physics, the reverse is true: <strong className="text-slate-200">red stars are the coolest</strong>, while <strong className="text-cyan-300">blue stars are the hottest</strong>!
      </p>

      {/* Thermometer Spectrum Chips */}
      <div className="grid grid-cols-7 gap-1.5 mb-3">
        {benchmarks.map(b => {
          const isActive = selectedClass === b.cls;
          return (
            <button
              key={b.cls}
              onClick={() => onSelectClass(isActive ? 'ALL' : b.cls)}
              className={`flex flex-col items-center p-2 rounded-xl border transition-all ${
                isActive
                  ? 'border-cyan-400 bg-cyan-950/70 shadow-md ring-1 ring-cyan-400/30'
                  : 'border-slate-800/80 bg-slate-900/40 hover:border-slate-700'
              }`}
            >
              <div
                className="w-4 h-4 rounded-full border border-white/20 mb-1"
                style={{ backgroundColor: b.colorHex }}
              />
              <span className="text-xs font-mono font-bold text-slate-100">{b.cls}</span>
              <span className="text-[10px] font-mono text-slate-400">{b.tempK.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Class Highlight Card */}
      {selectedClass !== 'ALL' && (
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1 animate-in fade-in">
          {(() => {
            const item = benchmarks.find(b => b.cls === selectedClass)!;
            return (
              <>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-cyan-400 uppercase font-semibold">
                    Class {item.cls} Stars · {item.tempK}
                  </span>
                  <span className="text-slate-400 font-mono">{item.colorName}</span>
                </div>
                <p className="text-slate-300 font-light">
                  <strong className="text-slate-200">Everyday Heat Equivalent:</strong> {item.everydayAnalogy}
                </p>
                <p className="text-slate-400 font-mono text-[11px]">
                  Catalog Examples: {item.exampleStars}
                </p>
              </>
            );
          })()}
        </div>
      )}

    </div>
  );
};
