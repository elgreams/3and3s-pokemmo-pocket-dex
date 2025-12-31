import React from 'react';

const CORE_FEATURES = [
  { key: 'pokemon', label: 'Pokémon Search' },
  { key: 'areas', label: 'Area Search' },
  { key: 'horde', label: 'Horde Search' },
  { key: 'tm', label: 'TM Locations' },
  { key: 'items', label: 'Items' },
  { key: 'breeding', label: 'Breeding' },
  { key: 'market', label: 'Market' },
  { key: 'team', label: 'Team Builder' }
];

export default function HomeScreen({ setMode }) {
  return (
    <div className="home-screen">
      <h1 className="home-title">3&3s Pocket Dex</h1>
      <div className="home-grid">
        {CORE_FEATURES.map(f => (
          <button
            key={f.key}
            className="home-tile"
            onClick={() => setMode(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
