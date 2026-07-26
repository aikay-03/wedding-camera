
// src/components/GalleryGrid.tsx

import React from 'react';
import { Photo } from '../entities/Photo';

interface GalleryGridProps {
  photos: Photo[];
  loading: boolean;
  onPhotoClick: (photo: Photo) => void;
}

export function GalleryGrid({ photos, loading, onPhotoClick }: GalleryGridProps) {
  if (loading) {
    return <div className="gallery-loading"><p>Loading moments...</p></div>;
  }

  if (photos.length === 0) {
    return <div className="gallery-empty"><p>No photos yet — be the first to capture a moment! 📸</p></div>;
  }

  return (
    <div className="gallery-grid">
      {photos.map((photo) => (
        <div key={photo.id} className="gallery-item" onClick={() => onPhotoClick(photo)}>
          <img
            src={photo.thumbnail_url}
            alt={`Photo by ${photo.captured_by}`}
            loading="lazy"
          />
          <span className="gallery-item-time">
            {new Date(photo.captured_at).toLocaleTimeString('en-US', {
              hour: 'numeric', minute: '2-digit',
            })}
          </span>
          {photo.sync_status === 'synced' && (
            <div className="gallery-item-drive" title="Backed up to Google Drive">
              <svg viewBox="0 0 24 24" fill="#34a853" width="10" height="10">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

