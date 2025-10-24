import React, { useState, useEffect } from 'react';
import { Skull, AlertTriangle, Zap, Crosshair, Radar, Map, Search, Lock } from 'lucide-react';

const ENTITY_TYPES = [
  { type: 'Warlord', icon: '⚔️', defenseBoost: 30, desc: 'Military genius', threat: 'EXTREME' },
  { type: 'Psion', icon: '🧠', defenseBoost: 20, desc: 'Mind controller', threat: 'HIGH' },
  { type: 'AI Overmind', icon: '🤖', defenseBoost: 35, desc: 'Sentient machine', threat: 'CRITICAL' },
  { type: 'Ancient Guardian', icon: '🛡️', defenseBoost: 40, desc: 'Immortal defender', threat: 'LETHAL' },
  { type: 'Hive Queen', icon: '👑', defenseBoost: 25, desc: 'Swarm controller', threat: 'SEVERE' },
  { type: 'Corporate Titan', icon: '💼', defenseBoost: 15, desc: 'Economic warlord', threat: 'MODERATE' },
  { type: 'Rebel Leader', icon: '🔥', defenseBoost: 28, desc: 'Guerrilla master', threat: 'HIGH' }
];

const NAMES = ['Zar\'thax', 'Xe\'nor', 'Kalthos', 'Vex\'ira', 'Qo\'rath', 'Thal\'zun', 'Mor\'dak', 'Lyx\'ara', 'Drak\'zul', 'Vor\'keth'];
const TITLES = ['the Immortal', 'Deathbringer', 'the Destroyer', 'Soul Reaver', 'the Feared', 'Blood King', 'the Merciless', 'Doom Herald'];
const ABILITIES = [
  'Planetary Annihilation', 'Mass Mind Control', 'Time Freeze',
  'Quantum Black Hole', 'Neural Virus', 'Reality Breach', 'Void Storm', 'EMP Nova'
];
const WEAKNESSES = ['Nano-virus', 'Psychic Overload', 'Quantum Instability', 'Ancient Curse', 'Solar Flare', 'Dark Matter'];

const SECTOR_NAMES = [
  'Kepler', 'Proxima', 'TRAPPIST', 'Gliese', 'Tau Ceti', 'Wolf', 'Ross', 'Luyten',
  'Kapteyn', 'Lacaille', 'Epsilon', 'Sirius', 'Vega', 'Altair', 'Betelgeuse'
];

const generatePlanet = (id, sectorX, sectorY) => {
  const military = Math.floor(Math.random() * 100);
  const technology = Math.floor(Math.random() * 100);
  const defense = Math.floor(Math.random() * 100);
  const population = Math.floor(Math.random() * 50) + 1;
  const hostility = Math.floor(Math.random() * 100);
  const resources = Math.floor(Math.random() * 100);
  const habitability = Math.floor(Math.random() * 100);
  const distance = Math.floor(Math.random() * 500) + 50;
  
  const entityType = ENTITY_TYPES[Math.floor(Math.random() * ENTITY_TYPES.length)];
  const powerLevel = Math.floor(Math.random() * 50) + 50;
  const influence = Math.floor(Math.random() * 80) + 20;
  
  const threatLevel = Math.min(100, Math.floor(
    (military * 0.35) + 
    (technology * 0.25) + 
    (defense * 0.20) + 
    (population * 0.10) + 
    (hostility * 0.10) -
    (distance / 100 * 5)
  ));
  
  const ppi = Math.floor(
    (resources * 0.3) +
    (threatLevel * 0.25) +
    (habitability * 0.2) +
    ((100 - distance / 5) * 0.15) +
    (hostility * 0.10)
  );
  
  const sectorName = SECTOR_NAMES[Math.floor(Math.random() * SECTOR_NAMES.length)];
  const planetLetter = String.fromCharCode(98 + Math.floor(Math.random() * 6)); // b-g
  
  return {
    id,
    name: `${sectorName}-${Math.floor(Math.random() * 999)}${planetLetter}`,
    sectorX,
    sectorY,
    military,
    technology,
    defense,
    population,
    hostility,
    resources,
    habitability,
    distance,
    threatLevel,
    ppi,
    status: 'unknown',
    scanned: false,
    entity: {
      name: `${NAMES[Math.floor(Math.random() * NAMES.length)]} ${TITLES[Math.floor(Math.random() * TITLES.length)]}`,
      type: entityType.type,
      icon: entityType.icon,
      powerLevel,
      influence,
      defenseBoost: entityType.defenseBoost,
      ability: ABILITIES[Math.floor(Math.random() * ABILITIES.length)],
      weakness: WEAKNESSES[Math.floor(Math.random() * WEAKNESSES.length)],
      loyalty: ['Fanatic', 'Loyal', 'Mercenary'][Math.floor(Math.random() * 3)],
      desc: entityType.desc,
      threatLevel: entityType.threat,
      kills: Math.floor(Math.random() * 10000) + 1000
    }
  };
};

const AlienConsole = () => {
  const [galaxy, setGalaxy] = useState([]);
  const [discoveredPlanets, setDiscoveredPlanets] = useState([]);
  const [empire, setEmpire] = useState({
    resources: 15000,
    fleetPower: 80,
    morale: 100,
    planets: 0,
    reputation: 50,
    kills: 0,
    explorationRange: 3
  });
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [logs, setLogs] = useState(['🌌 Galactic Scanner Online...', '📡 Ready to explore unknown sectors']);
  const [view, setView] = useState('map'); // 'map' or 'planets'
  const [scanningPlanet, setScanningPlanet] = useState(null);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    // Generate 15x15 galaxy grid
    const newGalaxy = [];
    let planetId = 0;
    for (let y = 0; y < 15; y++) {
      for (let x = 0; x < 15; x++) {
        if (Math.random() > 0.5) { // 50% chance of planet in sector
          newGalaxy.push(generatePlanet(planetId++, x, y));
        }
      }
    }
    setGalaxy(newGalaxy);
    
    // Discover nearby planets at start (center area)
    const nearbyPlanets = newGalaxy.filter(p => {
      const distFromCenter = Math.sqrt(Math.pow(p.sectorX - 7, 2) + Math.pow(p.sectorY - 7, 2));
      return distFromCenter <= empire.explorationRange;
    });
    setDiscoveredPlanets(nearbyPlanets);
  }, []);

  const addLog = (msg) => {
    setLogs(prev => [`${new Date().toLocaleTimeString()} - ${msg}`, ...prev.slice(0, 14)]);
  };

  const exploreSector = (x, y) => {
    if (empire.resources < 500) {
      addLog('⚠️ INSUFFICIENT RESOURCES for exploration!');
      return;
    }

    const planetsInSector = galaxy.filter(p => 
      Math.abs(p.sectorX - x) <= 1 && Math.abs(p.sectorY - y) <= 1 && 
      !discoveredPlanets.find(dp => dp.id === p.id)
    );

    if (planetsInSector.length === 0) {
      addLog(`🔍 Sector [${x},${y}] scanned - No planets detected`);
      setEmpire(e => ({ ...e, resources: e.resources - 500 }));
      return;
    }

    setEmpire(e => ({ ...e, resources: e.resources - 500 }));
    setDiscoveredPlanets(prev => [...prev, ...planetsInSector]);
    addLog(`🌟 DISCOVERED ${planetsInSector.length} new planet(s) in sector [${x},${y}]!`);
  };

  const scanPlanet = (planet) => {
    if (planet.scanned) {
      addLog('⚠️ Planet already scanned!');
      return;
    }
    if (empire.resources < 300) {
      addLog('⚠️ INSUFFICIENT RESOURCES for deep scan!');
      return;
    }

    setScanningPlanet(planet.id);
    setEmpire(e => ({ ...e, resources: e.resources - 300 }));
    
    setTimeout(() => {
      setGalaxy(prev => prev.map(p => 
        p.id === planet.id ? { ...p, scanned: true, status: 'hostile' } : p
      ));
      setDiscoveredPlanets(prev => prev.map(p => 
        p.id === planet.id ? { ...p, scanned: true, status: 'hostile' } : p
      ));
      setScanningPlanet(null);
      addLog(`📊 SCAN COMPLETE: ${planet.name} - Threat Level ${planet.threatLevel} - ${planet.entity.name} detected!`);
    }, 2000);
  };

  const executeAction = (planet, action) => {
    if (animating) return;
    setAnimating(true);
    
    const successChance = empire.fleetPower - (planet.defense + planet.entity.powerLevel * 0.4);
    const success = Math.random() * 100 < Math.max(15, Math.min(90, 50 + successChance));
    
    let newEmpire = { ...empire };
    let newStatus = planet.status;
    
    setTimeout(() => {
      if (action === 'destroy') {
        if (success) {
          newEmpire.resources -= 3000;
          newEmpire.morale += Math.floor(Math.random() * 10);
          newEmpire.reputation -= 20;
          newEmpire.kills += 1;
          newStatus = 'obliterated';
          addLog(`💀 ${planet.name} OBLITERATED! ${planet.entity.name} ELIMINATED. ${planet.entity.kills.toLocaleString()} souls consumed.`);
        } else {
          newEmpire.resources -= 2000;
          newEmpire.fleetPower -= 15;
          newEmpire.morale -= 15;
          addLog(`⚠️ CRITICAL FAILURE! ${planet.entity.name} used ${planet.entity.ability}! Heavy losses!`);
        }
      } else if (action === 'capture') {
        if (success) {
          newEmpire.resources += planet.resources * 70 - 2000;
          newEmpire.planets += 1;
          newEmpire.morale += 10;
          newEmpire.reputation += 10;
          newStatus = 'conquered';
          
          if (planet.entity.loyalty === 'Mercenary' && Math.random() > 0.4) {
            newEmpire.fleetPower += Math.floor(planet.entity.powerLevel / 4);
            addLog(`🔥 ${planet.name} CONQUERED! ${planet.entity.name} DEFECTED! Fleet power increased!`);
          } else {
            addLog(`⚡ ${planet.name} CONQUERED! Seized ${planet.resources * 70} resources!`);
          }
        } else {
          newEmpire.resources -= 2500;
          newEmpire.fleetPower -= 12;
          newEmpire.morale -= 20;
          addLog(`💥 INVASION FAILED! ${planet.entity.name} repelled invasion! Catastrophic casualties!`);
        }
      } else if (action === 'terraform') {
        if (planet.habitability > 30) {
          newEmpire.resources -= 4000;
          newEmpire.planets += 1;
          newEmpire.morale += 20;
          newEmpire.reputation += 15;
          newStatus = 'assimilated';
          addLog(`🌐 ${planet.name} ASSIMILATED! Colony operational.`);
        } else {
          newEmpire.resources -= 2000;
          addLog(`⚠️ TERRAFORM FAILURE! Hostile environment!`);
        }
      }
      
      setGalaxy(prev => prev.map(p => 
        p.id === planet.id ? { ...p, status: newStatus } : p
      ));
      setDiscoveredPlanets(prev => prev.map(p => 
        p.id === planet.id ? { ...p, status: newStatus } : p
      ));
      
      setEmpire(newEmpire);
      setSelectedPlanet(null);
      setAnimating(false);
      
      if (Math.random() > 0.6) {
        setTimeout(() => {
          const events = [
            '🌌 ANOMALY: Wormhole detected! New sectors accessible!',
            '☠️ ALERT: Enemy fleet movement detected!',
            '⚡ DISCOVERY: Ancient alien artifacts found!',
            '💎 BONUS: Resource asteroid field discovered!',
            '🔴 WARNING: Nearby civilization becoming hostile!'
          ];
          addLog(events[Math.floor(Math.random() * events.length)]);
        }, 2000);
      }
    }, 1500);
  };

  const getThreatBadge = (threat) => {
    if (threat < 30) return { text: 'LOW', color: 'bg-yellow-600', icon: '⚠️' };
    if (threat < 60) return { text: 'HIGH', color: 'bg-orange-600', icon: '🔥' };
    if (threat < 85) return { text: 'EXTREME', color: 'bg-red-600', icon: '💀' };
    return { text: 'LETHAL', color: 'bg-red-900 animate-pulse', icon: '☠️' };
  };

  const getPowerBar = (value) => {
    const percentage = (value / 100) * 100;
    return (
      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all ${value > 70 ? 'bg-red-600' : value > 40 ? 'bg-orange-600' : 'bg-yellow-600'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };

  const scannedPlanets = discoveredPlanets.filter(p => p.scanned);
  const unscannedPlanets = discoveredPlanets.filter(p => !p.scanned);

  return (
    <div className="min-h-screen bg-black text-white p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-950 via-black to-purple-950 opacity-50"></div>
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-red-600 rounded-full opacity-20"
            style={{
              width: Math.random() * 3 + 'px',
              height: Math.random() * 3 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animation: `twinkle ${Math.random() * 3 + 2}s infinite`
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }
        @keyframes pulse-red {
          0%, 100% { box-shadow: 0 0 20px rgba(220, 38, 38, 0.5); }
          50% { box-shadow: 0 0 40px rgba(220, 38, 38, 0.8); }
        }
      `}</style>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-6 relative">
          <div className="flex items-center justify-center gap-4 mb-3">
            <Skull className="w-12 h-12 text-red-600 animate-pulse" />
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-red-400 to-red-600">
              ☠️ GALACTIC EXPLORATION & CONQUEST
            </h1>
            <Skull className="w-12 h-12 text-red-600 animate-pulse" />
          </div>
          <p className="text-red-400 text-sm font-bold">SCAN • EXPLORE • DOMINATE</p>
        </div>

        {/* Empire Stats */}
        <div className="grid grid-cols-6 gap-3 mb-6">
          {[
            { label: 'WAR FUNDS', value: empire.resources, icon: '💎', color: 'from-green-700 to-green-900', critical: empire.resources < 3000 },
            { label: 'ARMADA', value: empire.fleetPower, icon: '🚀', color: 'from-red-700 to-red-900', critical: empire.fleetPower < 40 },
            { label: 'MORALE', value: empire.morale, icon: '😈', color: 'from-purple-700 to-purple-900', critical: empire.morale < 30 },
            { label: 'CONQUERED', value: empire.planets, icon: '🌍', color: 'from-orange-700 to-orange-900', critical: false },
            { label: 'FEAR LEVEL', value: empire.reputation, icon: '💀', color: 'from-red-800 to-black', critical: false },
            { label: 'KILLS', value: empire.kills, icon: '☠️', color: 'from-red-900 to-black', critical: false }
          ].map(stat => (
            <div 
              key={stat.label} 
              className={`bg-gradient-to-br ${stat.color} p-3 rounded-lg border-2 ${stat.critical ? 'border-red-600 animate-pulse' : 'border-slate-800'}`}
              style={stat.critical ? { animation: 'pulse-red 2s infinite' } : {}}
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className={`text-2xl font-bold ${stat.critical ? 'text-red-400' : ''}`}>{stat.value}</div>
              <div className="text-xs opacity-80">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setView('map')}
            className={`px-6 py-3 rounded-lg font-bold transition border-2 flex items-center gap-2 ${
              view === 'map' 
                ? 'bg-red-600 text-white border-red-400' 
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border-slate-800'
            }`}
          >
            <Map className="w-5 h-5" />
            GALAXY MAP
          </button>
          <button
            onClick={() => setView('planets')}
            className={`px-6 py-3 rounded-lg font-bold transition border-2 flex items-center gap-2 ${
              view === 'planets' 
                ? 'bg-red-600 text-white border-red-400' 
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border-slate-800'
            }`}
          >
            <Radar className="w-5 h-5" />
            PLANET LIST ({scannedPlanets.length})
          </button>
          <div className="flex-1"></div>
          <div className="bg-slate-900 px-4 py-3 rounded-lg border-2 border-slate-800 text-sm">
            <span className="text-slate-400">Discovered:</span>
            <span className="font-bold text-green-400 ml-2">{discoveredPlanets.length}</span>
            <span className="text-slate-400 mx-2">|</span>
            <span className="text-slate-400">Scanned:</span>
            <span className="font-bold text-blue-400 ml-2">{scannedPlanets.length}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Map or Planet List */}
          <div className="lg:col-span-2">
            {view === 'map' ? (
              <div className="bg-slate-900 rounded-lg p-5 border-2 border-red-900">
                <h3 className="text-xl font-bold mb-4 text-red-400 flex items-center gap-2">
                  <Map className="w-6 h-6" />
                  GALAXY MAP
                  <span className="text-sm text-slate-400 ml-2">(Click sectors to explore)</span>
                </h3>
                <div className="grid grid-cols-15 gap-1 bg-black p-4 rounded">
                  {[...Array(15)].map((_, y) => (
                    [...Array(15)].map((_, x) => {
                      const planetsHere = discoveredPlanets.filter(p => p.sectorX === x && p.sectorY === y);
                      const isCenter = x === 7 && y === 7;
                      return (
                        <button
                          key={`${x}-${y}`}
                          onClick={() => exploreSector(x, y)}
                          className={`w-8 h-8 rounded text-xs font-bold transition border ${
                            isCenter ? 'bg-green-900 border-green-600' :
                            planetsHere.length > 0 ? 'bg-red-900 border-red-600 hover:bg-red-800' :
                            'bg-slate-800 border-slate-700 hover:bg-slate-700'
                          }`}
                          title={`Sector [${x},${y}]`}
                        >
                          {isCenter ? '🏠' : planetsHere.length > 0 ? planetsHere.length : ''}
                        </button>
                      );
                    })
                  ))}
                </div>
                <div className="mt-4 flex gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-900 border border-green-600 rounded"></div>
                    <span>Home Base</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-900 border border-red-600 rounded"></div>
                    <span>Discovered Planets</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-slate-800 border border-slate-700 rounded"></div>
                    <span>Unknown Sector</span>
                  </div>
                  <div className="ml-auto text-yellow-400 font-bold">
                    💎 Exploration Cost: 500 per sector
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Unscanned Planets */}
                {unscannedPlanets.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold mb-3 text-yellow-400 flex items-center gap-2">
                      <Search className="w-5 h-5" />
                      UNSCANNED PLANETS ({unscannedPlanets.length})
                    </h3>
                    <div className="space-y-3">
                      {unscannedPlanets.map(planet => (
                        <div
                          key={planet.id}
                          className="bg-slate-900 rounded-lg p-4 border-2 border-yellow-700"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
                                <Lock className="w-5 h-5" />
                                {planet.name}
                              </h4>
                              <p className="text-sm text-slate-400">Sector [{planet.sectorX}, {planet.sectorY}] • {planet.distance} LY</p>
                            </div>
                            <button
                              onClick={() => scanPlanet(planet)}
                              disabled={empire.resources < 300 || scanningPlanet === planet.id}
                              className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold transition flex items-center gap-2"
                            >
                              {scanningPlanet === planet.id ? (
                                <>
                                  <Radar className="w-5 h-5 animate-spin" />
                                  SCANNING...
                                </>
                              ) : (
                                <>
                                  <Search className="w-5 h-5" />
                                  SCAN (-300 💎)
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Scanned Planets */}
                {scannedPlanets.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold mb-3 text-red-400 flex items-center gap-2">
                      <Radar className="w-5 h-5" />
                      SCANNED PLANETS ({scannedPlanets.length})
                    </h3>
                    <div className="space-y-3">
                      {scannedPlanets.map(planet => {
                        if (planet.status !== 'hostile') return null;
                        const threatBadge = getThreatBadge(planet.threatLevel);
                        return (
                          <div
                            key={planet.id}
                            className={`bg-slate-800 rounded-lg p-4 border-2 transition cursor-pointer ${
                              selectedPlanet?.id === planet.id ? 'border-red-500' : 'border-red-900'
                            } hover:border-red-400`}
                            onClick={() => setSelectedPlanet(planet)}
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-3">
                                  <h3 className="text-xl font-bold text-red-400">{planet.name}</h3>
                                  <span className={`px-3 py-1 rounded text-xs font-bold ${threatBadge.color}`}>
                                    {threatBadge.icon} {threatBadge.text}
                                  </span>
                                </div>
                                <div className="flex gap-3 mt-1 text-xs">
                                  <span className="text-red-400 font-bold">⚔️ THREAT: {planet.threatLevel}</span>
                                  <span className="text-yellow-400">📡 {planet.distance} LY</span>
                                  <span className="text-green-400">💎 RES: {planet.resources}</span>
                                </div>
                              </div>
                            </div>

                            {/* Entity Card */}
                            <div className="bg-black rounded-lg p-3 border-2 border-red-900">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-2xl">{planet.entity.icon}</span>
                                    <div>
                                      <div className="text-lg font-bold text-red-400">
                                        {planet.entity.name}
                                      </div>
                                      <div className="text-xs text-slate-400">{planet.entity.type} • {planet.entity.desc}</div>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-1 items-end">
                                  <span className={`text-xs px-2 py-1 rounded font-bold ${
                                    planet.entity.loyalty === 'Fanatic' ? 'bg-red-900 text-red-300' :
                                    planet.entity.loyalty === 'Loyal' ? 'bg-orange-900 text-orange-300' :
                                    'bg-yellow-900 text-yellow-300'
                                  }`}>
                                    {planet.entity.loyalty}
                                  </span>
                                  <span className="text-xs text-red-400 font-bold">
                                    💀 {planet.entity.kills.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                                <div>
                                  <div className="text-slate-500 mb-1">POWER</div>
                                  {getPowerBar(planet.entity.powerLevel)}
                                  <div className="text-red-400 font-bold mt-1">{planet.entity.powerLevel}/100</div>
                                </div>
                                <div>
                                  <div className="text-slate-500 mb-1">INFLUENCE</div>
                                  {getPowerBar(planet.entity.influence)}
                                  <div className="text-purple-400 font-bold mt-1">{planet.entity.influence}/100</div>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950 p-2 rounded">
                                <div>
                                  <div className="text-red-500 font-bold">⚡ ABILITY</div>
                                  <div className="text-red-300">{planet.entity.ability}</div>
                                </div>
                                <div>
                                  <div className="text-yellow-500 font-bold">🎯 WEAKNESS</div>
                                  <div className="text-yellow-300">{planet.entity.weakness}</div>
                                </div>
                              </div>
                            </div>

                            {/* Mini Stats */}
                            <div className="grid grid-cols-4 gap-2 mt-2 text-xs">
                              <div className="bg-black p-2 rounded border border-red-900">
                                <div className="text-slate-500">MILITARY</div>
                                <div className="font-bold text-red-400">{planet.military}</div>
                              </div>
                              <div className="bg-black p-2 rounded border border-blue-900">
                                <div className="text-slate-500">DEFENSE</div>
                                <div className="font-bold text-blue-400">{planet.defense}</div>
                              </div>
                              <div className="bg-black p-2 rounded border border-green-900">
                                <div className="text-slate-500">TECH</div>
                                <div className="font-bold text-green-400">{planet.technology}</div>
                              </div>
                              <div className="bg-black p-2 rounded border border-purple-900">
                                <div className="text-slate-500">HABITAT</div>
                                <div className="font-bold text-purple-400">{planet.habitability}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {scannedPlanets.length === 0 && unscannedPlanets.length === 0 && (
                  <div className="bg-slate-900 rounded-lg p-10 border-2 border-slate-800 text-center">
                    <Radar className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                    <p className="text-slate-400 text-lg">No planets discovered yet</p>
                    <p className="text-slate-500 text-sm mt-2">Use the Galaxy Map to explore sectors</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Side - Action Panel */}
          <div className="space-y-4">
            {selectedPlanet ? (
              <div className="bg-slate-900 rounded-lg p-5 border-2 border-red-600" style={{ animation: 'pulse-red 2s infinite' }}>
                <div className="flex items-center gap-2 mb-4">
                  <Crosshair className="w-6 h-6 text-red-500" />
                  <h3 className="text-xl font-bold text-red-400">TARGET LOCKED</h3>
                </div>
                <p className="text-sm text-slate-400 mb-4 font-bold">ENGAGING: {selectedPlanet.name}</p>
                
                <div className="space-y-3">
                  <button
                    onClick={() => executeAction(selectedPlanet, 'destroy')}
                    disabled={empire.resources < 3000 || animating}
                    className="w-full bg-gradient-to-r from-red-700 to-red-900 hover:from-red-800 hover:to-black disabled:opacity-30 disabled:cursor-not-allowed p-4 rounded-lg font-bold transition border-2 border-red-600 text-lg"
                  >
                    💀 OBLITERATE (-3000 💎)
                    <div className="text-xs font-normal mt-1">Total annihilation • No survivors</div>
                  </button>
                  
                  <button
                    onClick={() => executeAction(selectedPlanet, 'capture')}
                    disabled={empire.resources < 2000 || animating}
                    className="w-full bg-gradient-to-r from-orange-700 to-orange-900 hover:from-orange-800 hover:to-black disabled:opacity-30 disabled:cursor-not-allowed p-4 rounded-lg font-bold transition border-2 border-orange-600 text-lg"
                  >
                    ⚔️ INVADE & ENSLAVE (-2000 💎)
                    <div className="text-xs font-normal mt-1">Conquer • Extract resources • High risk</div>
                  </button>
                  
                  <button
                    onClick={() => executeAction(selectedPlanet, 'terraform')}
                    disabled={empire.resources < 4000 || selectedPlanet.habitability < 30 || animating}
                    className="w-full bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-black disabled:opacity-30 disabled:cursor-not-allowed p-4 rounded-lg font-bold transition border-2 border-blue-600 text-lg"
                  >
                    🌐 ASSIMILATE (-4000 💎)
                    <div className="text-xs font-normal mt-1">Peaceful conquest • Requires habitat {'>'}30</div>
                  </button>
                  
                  <button
                    onClick={() => setSelectedPlanet(null)}
                    className="w-full bg-slate-800 hover:bg-slate-700 p-2 rounded-lg transition text-sm border border-slate-700"
                  >
                    ABORT MISSION
                  </button>
                </div>

                <div className="mt-4 p-4 bg-black rounded border-2 border-yellow-700 text-xs">
                  <div className="font-bold text-yellow-400 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    TACTICAL ANALYSIS
                  </div>
                  <div className="space-y-2 text-slate-300">
                    <div className="flex justify-between">
                      <span>Success Probability:</span>
                      <span className={`font-bold ${
                        Math.max(15, Math.min(90, 50 + empire.fleetPower - (selectedPlanet.defense + selectedPlanet.entity.powerLevel * 0.4))) > 60 ? 'text-green-400' :
                        Math.max(15, Math.min(90, 50 + empire.fleetPower - (selectedPlanet.defense + selectedPlanet.entity.powerLevel * 0.4))) > 40 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {Math.floor(Math.max(15, Math.min(90, 50 + empire.fleetPower - (selectedPlanet.defense + selectedPlanet.entity.powerLevel * 0.4))))}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expected Casualties:</span>
                      <span className="font-bold text-red-400">
                        {selectedPlanet.entity.powerLevel > 80 ? 'CATASTROPHIC' : 
                         selectedPlanet.entity.powerLevel > 60 ? 'SEVERE' : 
                         selectedPlanet.entity.powerLevel > 40 ? 'MODERATE' : 'MINIMAL'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Entity Resistance:</span>
                      <span className="font-bold text-red-400">
                        {selectedPlanet.entity.loyalty === 'Fanatic' ? 'FIGHT TO DEATH' : 
                         selectedPlanet.entity.loyalty === 'Loyal' ? 'EXTREME' : 'MAY SURRENDER'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Counter-Attack Risk:</span>
                      <span className="font-bold text-orange-400">
                        {selectedPlanet.entity.powerLevel > 70 ? 'IMMINENT' : 'POSSIBLE'}
                      </span>
                    </div>
                  </div>
                  
                  {selectedPlanet.entity.powerLevel > 80 && (
                    <div className="mt-3 p-2 bg-red-950 border border-red-700 rounded">
                      <div className="text-red-400 font-bold text-center animate-pulse">
                        ⚠️ EXTREME DANGER: LEGENDARY ENTITY
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 rounded-lg p-5 border-2 border-slate-800 text-center text-slate-500">
                <Crosshair className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-bold">NO TARGET SELECTED</p>
                <p className="text-xs mt-2">Scan and select a planet to engage</p>
              </div>
            )}

            {/* Activity Log */}
            <div className="bg-slate-900 rounded-lg p-4 border-2 border-red-900">
              <h3 className="text-lg font-bold mb-3 text-red-400 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                ACTIVITY LOG
              </h3>
              <div className="space-y-1 text-xs font-mono max-h-96 overflow-y-auto">
                {logs.map((log, i) => (
                  <div 
                    key={i} 
                    className={`border-l-2 pl-2 py-1 ${
                      log.includes('OBLITERATED') || log.includes('ELIMINATED') ? 'border-red-600 text-red-400' :
                      log.includes('CONQUERED') || log.includes('ASSIMILATED') ? 'border-green-600 text-green-400' :
                      log.includes('DISCOVERED') ? 'border-blue-600 text-blue-400' :
                      log.includes('SCAN') ? 'border-yellow-600 text-yellow-400' :
                      log.includes('FAILED') || log.includes('CRITICAL') ? 'border-orange-600 text-orange-400' :
                      'border-slate-600 text-slate-400'
                    }`}
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>

            {/* Mission Costs */}
            <div className="bg-slate-900 rounded-lg p-4 border-2 border-blue-900">
              <h3 className="text-sm font-bold mb-3 text-blue-400">💎 OPERATION COSTS</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Sector Exploration:</span>
                  <span className="font-bold text-green-400">500 💎</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Deep Planet Scan:</span>
                  <span className="font-bold text-yellow-400">300 💎</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Obliterate Planet:</span>
                  <span className="font-bold text-red-400">3000 💎</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Invade & Capture:</span>
                  <span className="font-bold text-orange-400">2000 💎</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Assimilate (Terraform):</span>
                  <span className="font-bold text-blue-400">4000 💎</span>
                </div>
              </div>
            </div>

            {/* Warnings */}
            {(empire.resources < 5000 || empire.fleetPower < 50 || empire.morale < 40) && (
              <div className="bg-red-950 rounded-lg p-4 border-2 border-red-700">
                <h3 className="text-sm font-bold mb-2 text-red-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  CRITICAL WARNINGS
                </h3>
                <div className="space-y-2 text-xs">
                  {empire.resources < 5000 && (
                    <div className="bg-red-900 p-2 rounded text-red-200 font-bold animate-pulse">
                      ⚠️ LOW RESOURCES: {empire.resources} remaining
                    </div>
                  )}
                  {empire.fleetPower < 50 && (
                    <div className="bg-orange-900 p-2 rounded text-orange-200 font-bold animate-pulse">
                      ⚠️ WEAKENED ARMADA: {empire.fleetPower} power
                    </div>
                  )}
                  {empire.morale < 40 && (
                    <div className="bg-purple-900 p-2 rounded text-purple-200 font-bold animate-pulse">
                      ⚠️ LOW MORALE: Rebellion imminent
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlienConsole;