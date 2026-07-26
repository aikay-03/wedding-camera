
// src/components/CameraViewfinder.tsx

import React from 'react';

interface CameraViewfinderProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isReady: boolean;
  facing: 'user' | 'environment';
}

export function CameraViewfinder({ videoRef, isReady, facing }: CameraViewfinderProps) {
  return (
    <div className="viewfinder">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: facing === 'user' ? 'scaleX(-1)' : 'none',
          display: isReady ? 'block' : 'none',
        }}
      />
      {!isReady && (
        <div className="viewfinder-loading">
          <p>Starting camera...</p>
        </div>
      )}
      <div className="viewfinder-grid">
        <span /><span /><span />
        <span /><span /><span />
        <span /><span /><span />
      </div>
      <div className="viewfinder-focus" />
    </div>
  );
}

