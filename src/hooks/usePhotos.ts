
// src/hooks/usePhotos.ts

import { useState, useEffect, useCallback } from 'react';
import { Photo } from '../entities/Photo';
import {
  subscribeToPhotos,
  unsubscribeFromPhotos,
  uploadPhoto,
} from '../services/photoService';
import { RealtimeChannel } from '@supabase/supabase-js';

interface UsePhotosReturn {
  photos: Photo[];
  loading: boolean;
  error: string | null;
  uploadNewPhoto: (
    blob: Blob,
    metadata: {
      capturedBy: string;
      flashUsed: boolean;
      cameraFacing: 'user' | 'environment';
    }
  ) => Promise<Photo>;
}

export function usePhotos(): UsePhotosReturn {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let channel: RealtimeChannel;

    setLoading(true);
    channel = subscribeToPhotos((updatedPhotos) => {
      setPhotos(updatedPhotos);
      setLoading(false);
    });

    return () => {
      if (channel) {
        unsubscribeFromPhotos(channel);
      }
    };
  }, []);

  const uploadNewPhoto = useCallback(
    async (
      blob: Blob,
      metadata: {
        capturedBy: string;
        flashUsed: boolean;
        cameraFacing: 'user' | 'environment';
      }
    ): Promise<Photo> => {
      try {
        const photo = await uploadPhoto(blob, metadata);
        return photo;
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    },
    []
  );

  return { photos, loading, error, uploadNewPhoto };
}

