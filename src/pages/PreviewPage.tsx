
// src/pages/PreviewPage.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhotoPreview } from '../components/PhotoPreview';
import { usePhotos } from '../hooks/usePhotos';
import { useGoogleDrive } from '../hooks/useGoogleDrive';

export function PreviewPage() {
  const navigate = useNavigate();
  const { uploadNewPhoto } = usePhotos();
  const { backupPhoto, isUploading: isDriveSyncing } = useGoogleDrive();

  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [driveSynced, setDriveSynced] = useState(false);
  const [capturedMeta, setCapturedMeta] = useState<any>(null);

  useEffect(() => {
    const blob = (window as any).__capturedPhoto;
    const meta = (window as any).__capturedMeta;
    if (!blob) {
      navigate('/');
      return;
    }
    setImageBlob(blob);
    setCapturedMeta(meta);
  }, [navigate]);

  const handleSave = async () => {
    if (!imageBlob || !capturedMeta) return;
    setIsSaving(true);

    try {
      const photo = await uploadNewPhoto(imageBlob, {
        capturedBy: 'Guest',
        flashUsed: capturedMeta.flashUsed,
        cameraFacing: capturedMeta.cameraFacing,
      });

      delete (window as any).__capturedPhoto;
      delete (window as any).__capturedMeta;

      setTimeout(() => navigate('/gallery'), 1500);
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    if (!imageBlob) return;
    const url = URL.createObjectURL(imageBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nor-partner-${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRetake = () => {
    delete (window as any).__capturedPhoto;
    delete (window as any).__capturedMeta;
    navigate('/');
  };

  return (
    <PhotoPreview
      imageBlob={imageBlob}
      isSaving={isSaving}
      isDriveSyncing={isDriveSyncing}
      driveSynced={driveSynced}
      onRetake={handleRetake}
      onSave={handleSave}
      onDownload={handleDownload}
    />
  );
}

