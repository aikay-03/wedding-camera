
// src/components/LiveFeed.tsx

import React, { useEffect, useState } from 'react';
import { Photo } from '../entities/Photo';
import { subscribeToPhotos, unsubscribeFromPhotos } from '../services/photoService';
import { RealtimeChannel } from '@supabase/supabase-js';

interface LiveFeedProps {
  maxDisplay?: number;
}

export function LiveFeed({ maxDisplay = 50 }: LiveFeedProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [newPhotoId, setNewPhotoId] = useState<string | null>(null);

  useEffect(() => {
    let prevCount = 0;

    const channel: RealtimeChannel = subscribeToPhotos((updatedPhotos) => {
      if (updatedPhotos.length > prevCount && updatedPhotos[0]) {
        setNewPhotoId(updatedPhotos[0].id);
        setTimeout(() => setNewPhotoId(null), 2000);
      }
      prevCount = updatedPhotos.length;
      setPhotos(updatedPhotos.slice(0, maxDisplay));
    });

    return () => unsubscribeFromPhotos(channel);
  }, [maxDisplay]);

  return (
    <div className="live-feed">
      <div className="live-feed-header">
        <div className="live-indicator">
          <span className="live-dot" />
          LIVE
        </div>
        <span className="live-count">{photos.length} moments captured</span>
      </div>

      <div className="live-feed-grid">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className={`live-feed-item ${photo.id === newPhotoId ? 'new-photo' : ''}`}
          >
            <img src={photo.thumbnail_url} alt={`By ${photo.captured_by}`} loading="lazy" />
            <div className="live-feed-item-info">
              <span>{photo.captured_by}</span>
              <span>
                {new Date(photo.captured_at).toLocaleTimeString('en-US', {
                  hour: 'numeric', minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

