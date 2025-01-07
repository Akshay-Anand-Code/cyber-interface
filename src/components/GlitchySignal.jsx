import React from 'react';

const GlitchySignal = () => {
  return (
    <div className="w-full h-32 relative overflow-hidden">
      <svg
        className="w-full h-full"
        viewBox="0 0 400 100"
        preserveAspectRatio="none"
      >
        {/* Background noise pattern */}
        <defs>
          <pattern id="noise" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="rgba(0,255,255,0.03)">
              <animate
                attributeName="opacity"
                values="0.03;0.06;0.03"
                dur="2s"
                repeatCount="indefinite"
              />
            </rect>
            {[...Array(50)].map((_, i) => (
              <circle
                key={i}
                cx={Math.random() * 100}
                cy={Math.random() * 100}
                r="0.5"
                fill="cyan"
                opacity="0.1"
              >
                <animate
                  attributeName="opacity"
                  values="0.1;0.3;0.1"
                  dur={`${1 + Math.random()}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </pattern>
        </defs>

        {/* Background with noise */}
        <rect width="400" height="100" fill="url(#noise)" />

        {/* Main signal path */}
        <path
          d="M0,50 Q100,20 200,50 T400,50"
          fill="none"
          stroke="cyan"
          strokeWidth="1"
          opacity="0.4"
        >
          <animate
            attributeName="d"
            values="
              M0,50 Q100,20 200,50 T400,50;
              M0,50 Q100,80 200,50 T400,50;
              M0,50 Q100,20 200,50 T400,50
            "
            dur="4s"
            repeatCount="indefinite"
          />
        </path>

        {/* Glitch effects */}
        {[...Array(3)].map((_, i) => (
          <g key={i}>
            <path
              d={`M${i * 150},50 h30`}
              stroke="cyan"
              strokeWidth="2"
              opacity="0.3"
            >
              <animate
                attributeName="transform"
                values="translate(0,0); translate(5,-5); translate(0,0)"
                dur={`${0.5 + Math.random()}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.3;0.8;0.3"
                dur={`${0.2 + Math.random()}s`}
                repeatCount="indefinite"
              />
            </path>
          </g>
        ))}

        {/* Vertical scanning line */}
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="100"
          stroke="cyan"
          strokeWidth="2"
          opacity="0.5"
        >
          <animate
            attributeName="x1"
            values="0;400;0"
            dur="3s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="x2"
            values="0;400;0"
            dur="3s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.5;0.8;0.5"
            dur="3s"
            repeatCount="indefinite"
          />
        </line>

        {/* Digital noise bursts */}
        {[...Array(5)].map((_, i) => (
          <rect
            key={i}
            width="20"
            height="2"
            fill="cyan"
            opacity="0.2"
          >
            <animate
              attributeName="x"
              values={`${i * 100};${i * 100 + 50};${i * 100}`}
              dur={`${0.5 + Math.random()}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="y"
              values={`${20 + i * 15};${40 + i * 15};${20 + i * 15}`}
              dur={`${0.3 + Math.random()}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.2;0.5;0.2"
              dur={`${0.2 + Math.random()}s`}
              repeatCount="indefinite"
            />
          </rect>
        ))}
      </svg>
    </div>
  );
};

export default GlitchySignal;