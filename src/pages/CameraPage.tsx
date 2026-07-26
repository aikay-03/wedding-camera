
// src/pages/CameraPage.tsx

import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCamera } from '../hooks/useCamera';
import { CameraViewfinder } from '../components/CameraViewfinder';
import { CameraControls } from '../components/CameraControls';

export function CameraPage() {
  const navigate = useNavigate();
  const {
    videoRef, canvasRef, isReady, error, facing,
    flashMode, flashSupported, startCamera,
    flipCamera, capturePhoto, toggleFlash,
  } = useCamera('environment');

  useEffect(() => {
    startCamera();
  }, []);

  const handleCapture = useCallback(() => {
    const blob = capturePhoto();
    if (blob) {
      (window as any).__capturedPhoto = blob;
      (window as any).__capturedMeta = {
        flashUsed: flashMode === 'on',
        cameraFacing: facing,
      };
      navigate('/preview');
    }
  }, [capturePhoto, flashMode, facing, navigate]);

  return (
    <div className="camera-page">
      <div className="camera-header">
        <h1>BloomLens 💕</h1>
        <p>Nikah Ceremony Izzati X Afif</p>
      </div>

      <div className="viewfinder-wrapper">
        <CameraViewfinder videoRef={videoRef} isReady={isReady} facing={facing} />
        <CameraControls
          flashMode={flashMode}
          flashSupported={flashSupported}
          onToggleFlash={toggleFlash}
          onFlipCamera={flipCamera}
          onCapture={handleCapture}
          onOpenGallery={() => navigate('/gallery')}
        />
      </div>

      {error && (
        <div className="camera-error">
          <p>📷 {error}</p>
          <button onClick={startCamera}>Try Again</button>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}

