
// src/components/CameraControls.tsx

import React from 'react';

interface CameraControlsProps {
  flashMode: 'off' | 'auto' | 'on';
  flashSupported: boolean;
  onToggleFlash: () => void;
  onFlipCamera: () => void;
  onCapture: () => void;
  onOpenGallery: () => void;
}

export function CameraControls({
  flashMode,
  flashSupported,
  onToggleFlash,
  onFlipCamera,
  onCapture,
  onOpenGallery,
}: CameraControlsProps) {
  return (
    <>
      <div className="camera-top-bar">
        <button
          className="flash-toggle"
          onClick={onToggleFlash}
          disabled={!flashSupported}
          aria-label={`Flash ${flashMode}`}
        >
          {flashMode === 'off' && <span>⚡</span>}
          {flashMode === 'auto' && <span>⚡A</span>}
          {flashMode === 'on' && <span style={{ color: '#ffd700' }}>⚡</span>}
        </button>

        <button className="flip-toggle" onClick={onFlipCamera} aria-label="Flip camera">
          <svg viewBox="0 0 24 24" fill="#fff" width="18" height="18">
            <path d="M20 5h-3.17L15 3H9L7.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-8 13c-2.76 0-5-2.24-5-5h1.5c0 1.93 1.57 3.5 3.5 3.5s3.5-1.57 3.5-3.5H17c0 2.76-2.24 5-5 5zm-3.5-5c0-1.93 1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5H14c0-.83-.67-1.5-1.5-1.5S11 12.17 11 13H8.5z" />
          </svg>
        </button>
      </div>

      <div className="camera-controls">
        <div className="ctrl-group">
          <button className="ctrl-btn" onClick={onOpenGallery} aria-label="Gallery">
            <svg viewBox="0 0 24 24" fill="#5a4a4a" width="20" height="20">
              <path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z" />
            </svg>
          </button>
          <span className="ctrl-label">Gallery</span>
        </div>

        <button className="shutter-btn" onClick={onCapture} aria-label="Take photo" />

        <div className="ctrl-group">
          <button className="ctrl-btn" onClick={onFlipCamera} aria-label="Flip camera">
            <svg viewBox="0 0 24 24" fill="#5a4a4a" width="20" height="20">
              <path d="M20 5h-3.17L15 3H9L7.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-8 13c-2.76 0-5-2.24-5-5h1.5c0 1.93 1.57 3.5 3.5 3.5s3.5-1.57 3.5-3.5H17c0 2.76-2.24 5-5 5zm-3.5-5c0-1.93 1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5H14c0-.83-.67-1.5-1.5-1.5S11 12.17 11 13H8.5z" />
            </svg>
          </button>
          <span className="ctrl-label">Flip</span>
        </div>
      </div>
    </>
  );
}

