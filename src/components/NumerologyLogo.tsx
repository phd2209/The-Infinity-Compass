import React from 'react';

export const NumerologyLogo: React.FC<{ size?: number }> = ({ size = 200 }) => {
  // Calculate positions
  const compassRadius = size * 0.38;
  const centerX = size / 2;
  const centerY = size / 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="numerology-logo"
      style={{
        filter: 'drop-shadow(0 0 25px rgba(155, 141, 227, 0.5))',
      }}
    >
      <defs>
        {/* Indigo to Coral gradient */}
        <linearGradient id="celestialGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9B8DE3" />
          <stop offset="100%" stopColor="#FF6F61" />
        </linearGradient>

        {/* Glow filter */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Strong glow for infinity */}
        <filter id="infinityGlow">
          <feGaussianBlur stdDeviation="6" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer compass circle */}
      <circle
        cx={centerX}
        cy={centerY}
        r={compassRadius}
        fill="none"
        stroke="url(#celestialGradient)"
        strokeWidth="2"
        filter="url(#glow)"
      />

      {/* Compass cardinal points (4 main directions) */}
      {[0, 90, 180, 270].map((angle, i) => {
        const rad = (angle - 90) * (Math.PI / 180);
        const x1 = centerX + (compassRadius - 8) * Math.cos(rad);
        const y1 = centerY + (compassRadius - 8) * Math.sin(rad);
        const x2 = centerX + (compassRadius + 8) * Math.cos(rad);
        const y2 = centerY + (compassRadius + 8) * Math.sin(rad);

        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="url(#celestialGradient)"
            strokeWidth="2"
            opacity="0.8"
          />
        );
      })}

      {/* Compass intermediate points (8 directions total) */}
      {[45, 135, 225, 315].map((angle, i) => {
        const rad = (angle - 90) * (Math.PI / 180);
        const x1 = centerX + (compassRadius - 5) * Math.cos(rad);
        const y1 = centerY + (compassRadius - 5) * Math.sin(rad);
        const x2 = centerX + (compassRadius + 5) * Math.cos(rad);
        const y2 = centerY + (compassRadius + 5) * Math.sin(rad);

        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="url(#celestialGradient)"
            strokeWidth="1.5"
            opacity="0.5"
          />
        );
      })}

      {/* Inner decorative circle */}
      <circle
        cx={centerX}
        cy={centerY}
        r={compassRadius * 0.3}
        fill="none"
        stroke="url(#celestialGradient)"
        strokeWidth="1"
        opacity="0.3"
      />

      {/* Infinity symbol in center - made bigger */}
      <path
        d={`M ${centerX - 30} ${centerY}
            C ${centerX - 30} ${centerY - 15}, ${centerX - 15} ${centerY - 15}, ${centerX} ${centerY}
            C ${centerX + 15} ${centerY + 15}, ${centerX + 30} ${centerY + 15}, ${centerX + 30} ${centerY}
            C ${centerX + 30} ${centerY - 15}, ${centerX + 15} ${centerY - 15}, ${centerX} ${centerY}
            C ${centerX - 15} ${centerY + 15}, ${centerX - 30} ${centerY + 15}, ${centerX - 30} ${centerY}`}
        fill="none"
        stroke="url(#celestialGradient)"
        strokeWidth="4"
        filter="url(#infinityGlow)"
        opacity="0.9"
      />
    </svg>
  );
};
