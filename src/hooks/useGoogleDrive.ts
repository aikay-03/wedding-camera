// src/hooks/useGoogleDrive.ts

import { useState, useCallback } from 'react';

interface UseGoogleDriveReturn {
  isUploading: boolean;
  error: string | null;
  backupPhoto: (photoId: string, blob: Blob) => Promise<void>;
}

export function useGoogleDrive(): UseGoogleDriveReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const backupPhoto = useCallback(async (photoId: string, blob: Blob) => {
    // Skipped for now
    console.log('Google Drive backup skipped');
  }, []);

  return { isUploading, error, backupPhoto };
}
