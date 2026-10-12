import React, { useState } from 'react';
import { PlanetData } from '../../types';
import { 
  Scale, 
  Rocket, 
  Plane, 
  Zap, 
  Wind, 
  Thermometer, 
  ShieldAlert, 
  Sparkles,
  ChevronDown,
  Info
} from 'lucide-react';

interface HumanScaleAnchorsProps {
  planet: PlanetData;
}

export const HumanScaleAnchors: React.FC<HumanScaleAnchorsProps> = ({ planet }) => {
  const [earthWeightKg, setEarthWeightKg] = useState<number>(70);
  const [activeTab, setActiveTab] = useState<'weight' | 'travel' | 'sensory' | 'pocket-scale'>('weight');

  // Surface gravity calculation
  const gravityMatch = planet.surfaceGravity.match(/[\d.]+/);
  const gravityVal = gravityMatch ? parseFloat(gravityMatch[0]) : 9.81;
  const weightRatio = gravityVal / 9.81;
  const planetWeightKg = Math.round(earthWeightKg * weightRatio * 10) / 10;
  const planetWeightLbs = Math.round(planetWeightKg * 2.20462 * 10) / 10;

  // Travel time calculations
  // Distance from Earth in km (approximate average distance)
  const distanceAUFromEarth = planet.id === 'moon' ? 0.00257 : Math.abs(planet.distanceFromSunAU - 1.0);
  const distanceKm = distanceAUFromEarth * 149597870.7;

  const jetSpeedKmh = 900;
  const rocketSpeedKmh = 40000; // Apollo translunar injection speed
  const lightSpeedKms = 300000;

  const jetHours = distanceKm / jetSpeedKmh;
  const rocketHours = distanceKm / rocketSpeedKmh;
  const lightSeconds = distanceKm / lightSpeedKms;

  const formatHours = (hours: number): string => {
    if (hours < 48) return `${Math.round(hours)} hours`;
    const days = hours / 24;
    if (days < 365) return `${Math.round(days)} days`;
    const years = (days / 365.25).toFixed(1);
    return `${years} years`;
  };

  const formatLightTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds.toFixed(1)} light-seconds`;
    const minutes = seconds / 60;
    if (minutes < 60) return `${minutes.toFixed(1)} light-minutes`;
    return `${(minutes / 60).toFixed(1)} light-hours`;
  };

  // Pocket Solar System Scale Analogy
  const getPocketScale = (p: PlanetData) => {
    switch (p.id) {
      case 'mercury':
        return { object: 'a tiny pinhead (0.8 mm)', distance: '10 meters away from the basketball' };
      case 'venus':
        return { object: 'a peppercorn (2.1 mm)', distance: '19 meters away' };
      case 'earth':
        return { object: 'a small peppercorn (2.2 mm)', distance: '26 meters away' };
      case 'moon':
        return { object: 'a speck of dust (0.6 mm)', distance: '6.5 cm from the Earth peppercorn' };
      case 'mars':
        return { object: 'a sesame seed (1.2 mm)', distance: '39 meters away' };
      case 'jupiter':
        return { object: 'a golf ball (2.4 cm)', distance: '135 meters (down the football field)' };
      case 'saturn':
        return { object: 'a large acorn (2.0 cm) with a 4 cm paper ring', distance: '250 meters away' };
      case 'neptune':
        return { object: 'a small blueberry (0.85 cm)', distance: '780 meters away (nearly a kilometer)' };
      default:
        return { object: 'a tiny seed', distance: '100 meters away' };
    }
  };

  // Sensory First-Person Grounding ("What Would You Experience?")
  const getSensoryExperience = (p: PlanetData) => {
    switch (p.id) {
      case 'mercury':
        return {
          sky: 'Jet-black sky even at midday; the Sun appears 3 times larger and blindingly incandescent. No stars twinkle because there is zero atmospheric scattering.',
          sound: 'Absolute, dead silence. With no atmosphere to carry pressure waves, an exploding meteorite meters away would make zero sound.',
          survival: 'Without a specialized thermal pressure suit: instantaneous boiling of body fluids in the vacuum, followed by baking at +430°C or flash-freezing to -180°C in the shade.',
        };
      case 'venus':
        return {
          sky: 'Perpetual gloomy sulfur-yellow twilight. Cloud decks absorb 97% of sunlight; looking at the horizon feels like peering through murky lemonade with visible heat mirages.',
          sound: 'A deep, muffled, oceanic hum. Dense supercritical carbon dioxide carries low bass frequencies with immense acoustic resonance.',
          survival: 'Within seconds: crushed by 92 atmospheres of pressure (equivalent to 900 meters underwater on Earth) while being roasted at +464°C in sulfuric acid vapor.',
        };
      case 'earth':
        return {
          sky: 'Vibrant sapphire blue sky created by Rayleigh scattering of sunlight through nitrogen and oxygen molecules, transitioning to warm crimson and golden sunsets.',
          sound: 'A rich polyphonic acoustic landscape: rustling leaves, crashing ocean surf, wind turbulence, and living bio-acoustics.',
          survival: 'Our biological home. Temperate temperatures, liquid water oceans, 21% breathable oxygen, and a magnetic dynamo shielding against cosmic rays.',
        };
      case 'moon':
        return {
          sky: 'Pitch-black sky studded with sharp, untwinkling stars, with the radiant blue-and-white marble of Earth hanging perpetually suspended overhead.',
          sound: 'Total eerie stillness. You only hear the mechanical hum of your suit’s life-support pumps and your own breathing inside your helmet.',
          survival: 'Sudden loss of consciousness in 10-15 seconds due to lack of atmospheric pressure, severe cosmic radiation, and micro-meteorite bombardment.',
        };
      case 'mars':
        return {
          sky: 'Pale butterscotch-tinted sky at midday. Sunsets glow an ethereal sapphire blue because fine iron-oxide dust particles forward-scatter red wavelengths away from your eyes.',
          sound: 'Muffled, thin winds whistling at low decibels. Cold, low-pressure CO₂ atmosphere dampens high frequencies, making human voices sound muffled and distant.',
          survival: 'Hypoxia within seconds (95% CO₂ atmosphere), blood ebullism at the Armstrong Limit (pressure is only 0.6% of Earth), and hypothermia.',
        };
      case 'jupiter':
        return {
          sky: 'Towering ammonia cirrus clouds striped in ochre and cream, torn apart by supersonic jet streams and colossal lightning discharges 10,000 times more powerful than Earth’s.',
          sound: 'Deafening roaring thunder from planetary lightning, howling jet streams exceeding 500 km/h, and deep atmospheric rumble.',
          survival: 'No solid ground to stand on. Sinking thousands of kilometers into liquid molecular hydrogen, where temperatures exceed thousands of degrees and pressures liquefy metal.',
        };
      case 'saturn':
        return {
          sky: 'Gently banded golden-amber clouds with the colossal arches of the rings spanning the entire sky like an ethereal white highway overhead.',
          sound: 'Continuous rushing wind noise and radio static crackle generated by ring-atmosphere electrodynamic lightning storms.',
          survival: 'Similar to Jupiter: sinking through thousands of kilometers of cooling hydrogen-helium fog into supercritical metallic fluid.',
        };
      case 'neptune':
        return {
          sky: 'Deep cyan-blue abyss illuminated by a Sun that appears as a piercingly bright point of light, 900 times dimmer than on Earth.',
          sound: 'The screaming screech of 2,100 km/h supersonic methane winds—the fastest recorded in the Solar System.',
          survival: 'Flash-freezing at -200°C followed by crushing pressures that compress carbon into falling diamonds in the superheated water-ammonia mantle.',
        };
      default:
        return {
          sky: 'Dark vacuum sky with brilliant starfields.',
          sound: 'Silence of deep space.',
          survival: 'Vacuum exposure requires pressurized environmental suits.',
        };
    }
  };

  const pocketScale = getPocketScale(planet);
  const sensory = getSensoryExperience(planet);

  return (
    <div className="bg-[#090e22]/90 border border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-xl text-slate-200">
      
      {/* Header with Title and Mode Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider font-mono">
            Human-Scale Intuition & Sensory Grounding
          </h3>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 bg-[#10172c] border border-slate-800 rounded-lg text-xs font-mono">
          <button
            onClick={() => setActiveTab('weight')}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === 'weight' ? 'bg-cyan-950 text-cyan-300 font-medium' : 'text-slate-400 hover:text-white'
            }`}
          >
            Weight
          </button>
          <button
            onClick={() => setActiveTab('travel')}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === 'travel' ? 'bg-cyan-950 text-cyan-300 font-medium' : 'text-slate-400 hover:text-white'
            }`}
          >
            Travel Clocks
          </button>
          <button
            onClick={() => setActiveTab('sensory')}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === 'sensory' ? 'bg-cyan-950 text-cyan-300 font-medium' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sensory Reality
          </button>
          <button
            onClick={() => setActiveTab('pocket-scale')}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === 'pocket-scale' ? 'bg-cyan-950 text-cyan-300 font-medium' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pocket Scale
          </button>
        </div>
      </div>

      {/* 1. PERSONAL WEIGHT CONVERTER */}
      {activeTab === 'weight' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">
                Your Earth Weight Reference
              </span>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="30"
                  max="140"
                  value={earthWeightKg}
                  onChange={(e) => setEarthWeightKg(Number(e.target.value))}
                  className="w-44 accent-cyan-400"
                />
                <span className="text-sm font-mono text-cyan-300 font-medium">
                  {earthWeightKg} kg / {Math.round(earthWeightKg * 2.20462)} lbs
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block mb-1">
                Weight on {planet.name}
              </span>
              <div className="text-2xl font-mono font-bold text-slate-100 tabular-nums">
                {planetWeightKg} kg <span className="text-xs text-slate-400 font-normal">({planetWeightLbs} lbs)</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {weightRatio === 1 ? '100% of Earth weight' : `${(weightRatio * 100).toFixed(0)}% of Earth gravity`}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400 font-light leading-relaxed">
            <strong className="text-slate-200 font-medium mr-1.5">Biomechanical Impact:</strong>
            {weightRatio < 0.5 
              ? `Walking on ${planet.name} would feel like bouncing on a trampoline. A 1-meter high jump on Earth would propel you ${(1 / weightRatio).toFixed(1)} meters into the air here.`
              : weightRatio > 1.5
              ? `Standing on ${planet.name}'s cloud layer would feel like carrying a heavy adult on your shoulders; walking would rapidly exhaust human muscles.`
              : `Gravity on ${planet.name} is comfortably close to Earth's familiar gravitational field.`
            }
          </p>
        </div>
      )}

      {/* 2. TRAVEL TIME CALCULATOR */}
      {activeTab === 'travel' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
                <Plane className="w-3.5 h-3.5 text-sky-400" />
                <span>Commercial Jet (900 km/h)</span>
              </div>
              <div className="text-lg font-mono font-semibold text-slate-100">
                {formatHours(jetHours)}
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Continuous nonstop cruising</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
                <Rocket className="w-3.5 h-3.5 text-amber-400" />
                <span>Apollo Rocket (40,000 km/h)</span>
              </div>
              <div className="text-lg font-mono font-semibold text-slate-100">
                {formatHours(rocketHours)}
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Chemical translunar injection speed</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Speed of Light (c)</span>
              </div>
              <div className="text-lg font-mono font-semibold text-cyan-300">
                {formatLightTime(lightSeconds)}
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Radio communications latency</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 font-light leading-relaxed">
            Sending a radio message from Earth to {planet.name} takes <strong className="text-slate-200">{formatLightTime(lightSeconds)}</strong> each way. An interactive back-and-forth dialogue would have a round-trip latency of {(lightSeconds * 2 > 60 ? `${(lightSeconds * 2 / 60).toFixed(1)} minutes` : `${(lightSeconds * 2).toFixed(1)} seconds`)}.
          </p>
        </div>
      )}

      {/* 3. SENSORY REALITY ("WHAT WOULD YOU EXPERIENCE?") */}
      {activeTab === 'sensory' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
              <Thermometer className="w-3.5 h-3.5" />
              <span>Sky & Illumination</span>
            </div>
            <p className="text-xs text-slate-300 font-light leading-relaxed">
              {sensory.sky}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono text-sky-400 mb-2">
              <Wind className="w-3.5 h-3.5" />
              <span>Acoustic Landscape</span>
            </div>
            <p className="text-xs text-slate-300 font-light leading-relaxed">
              {sensory.sound}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono text-rose-400 mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Without a Spacesuit</span>
            </div>
            <p className="text-xs text-slate-300 font-light leading-relaxed">
              {sensory.survival}
            </p>
          </div>
        </div>
      )}

      {/* 4. POCKET SCALE ANALOGY */}
      {activeTab === 'pocket-scale' && (
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">
            The Pocket Solar System Model
          </span>
          <p className="text-sm text-slate-200 font-light leading-relaxed">
            Imagine shrinking our entire Solar System down so the colossal <strong className="text-amber-400">Sun</strong> is scaled to the size of a standard basketball (24 cm diameter).
          </p>
          <div className="p-3 rounded-lg bg-[#070b19] border border-cyan-900/50 text-xs font-mono text-cyan-200">
            On this scale, <strong className="text-white">{planet.name}</strong> would be <strong className="text-cyan-300">{pocketScale.object}</strong>, positioned <strong className="text-cyan-300">{pocketScale.distance}</strong>.
          </div>
          <p className="text-xs text-slate-400 font-light leading-relaxed">
            Space is overwhelmingly empty: almost all representations in school textbooks compress interplanetary distances by a factor of 1,000 to fit worlds on a single page. In true reality, the cosmos is a staggering void of pristine distance.
          </p>
        </div>
      )}

    </div>
  );
};
