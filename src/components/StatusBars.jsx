import React, { useState, useEffect } from 'react';

const StatusBars = () => {
  const [bars, setBars] = useState([
    { id: 1, label: 'TWEET SCAN', status: 'LIVE', progress: 45 },
    { id: 2, label: 'SHORT MEMORY', status: 'UPDATING MEMORY', progress: 65 },
    { id: 3, label: 'VOICE SYNTHESIS', status: 'AUDIO CREATION', progress: 30 },
    { id: 4, label: 'SM AUTOMATION', status: 'ACTIVE', progress: 80 },
  ]);

  // Animate the progress bars
  useEffect(() => {
    const interval = setInterval(() => {
      setBars(prevBars => 
        prevBars.map(bar => ({
          ...bar,
          progress: Math.floor(Math.random() * 100)
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-64 p-4">
      {/* Animated status bars */}
      {bars.map(bar => (
        <div key={bar.id} className="mb-6 p-4 bg-[#001a1a] border border-cyan-400/20 rounded">
          <div className="flex justify-between text-cyan-400 mb-2">
            <span>{bar.label}</span>
            <span className="text-cyan-400/50">{bar.status}</span>
          </div>
          <div className="h-2 bg-[#002a2a] rounded overflow-hidden">
            <div 
              className="h-full bg-cyan-400/50 transition-all duration-1000"
              style={{ width: `${bar.progress}%` }}
            />
          </div>
        </div>
      ))}

      {/* Links box */}
      <div className="p-4 bg-[#001a1a] border border-cyan-400/20 rounded">
        <div className="grid grid-cols-2 gap-4">
          <a 
            href="https://pump.fun" 
            className="text-cyan-400 hover:text-cyan-300 transition-colors text-center"
          >
            pump.fun
          </a>
          <a 
            href="https://dexscreener.com" 
            className="text-cyan-400 hover:text-cyan-300 transition-colors text-center"
          >
            dexscreener
          </a>
          <a 
            href="https://t.me/aetherAiportal" 
            className="text-cyan-400 hover:text-cyan-300 transition-colors text-center"
          >
            telegram
          </a>
          <a 
            href="https://x.com/AetherOnSol" 
            className="text-cyan-400 hover:text-cyan-300 transition-colors text-center"
          >
            x/twitter
          </a>
        </div>
      </div>

      <div className="mt-4 text-cyan-400/50 text-sm text-center">
        
      </div>
    </div>
  );
};

export default StatusBars; 