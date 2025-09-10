import React from 'react';

const SemiCircleGauge = ({ ppm }) => {
  const percent = Math.min(ppm / 1000, 1) * 100;
  const angle = (percent / 100) * 180;

  let color = 'green';
  if (ppm >= 600 && ppm <= 1000) color = 'orange';
  if (ppm > 1000) color = 'red';

  return (
    <div style={{ position: 'relative', width: '200px', height: '100px' }}>
      <svg width="200" height="100">
        <path
          d="M10,100 A90,90 0 0,1 190,100"
          fill="none"
          stroke="#eee"
          strokeWidth="20"
        />
        <path
          d="M10,100 A90,90 0 0,1 190,100"
          fill="none"
          stroke={color}
          strokeWidth="20"
          strokeDasharray={`${angle * 2.83}, 999`}
          strokeLinecap="round"
        />
      </svg>
      <div style={{
        position: 'absolute',
        top: '35px',
        left: 0,
        width: '100%',
        textAlign: 'center',
        fontSize: '18px',
        fontWeight: 'bold'
      }}>
        {ppm} PPM
      </div>
    </div>
  );
};

export default SemiCircleGauge;