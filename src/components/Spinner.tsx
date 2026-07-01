import React from 'react';

// Spinner component (intended to be moved to src/assets/svg/Spinner.tsx)
const Spinner: React.FC<{ size?: number; className?: string }> = ({
  size = 40,
  className = '',
}) => {
  const stroke = size * 0.1;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;

  return (
    <div className={`animate-spin ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
        className={``}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-[rgba(0,0,0,0.08)]"
          strokeLinecap="round"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-current"
          strokeDasharray={circ}
          strokeDashoffset={circ * 0.25}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default React.memo(Spinner);
