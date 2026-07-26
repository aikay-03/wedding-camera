
// src/pages/GalleryPage.tsx

import { useState } from 'react';
import { usePhotos } from '../hooks/usePhotos';
import { GalleryGrid } from '../components/GalleryGrid';
import { Photo } from '../entities/Photo';

export function GalleryPage() {
  const { photos, loading } = usePhotos();
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  return (
    <div className="gallery-page">
      <div className="gallery-header">
        <h2>Our Moments</h2>
        <div className="gallery-controls">
          <span className="gallery-count">{photos.length} photos</span>
        </div>
      </div>

      <GalleryGrid
        photos={photos}
        loading={loading}
        onPhotoClick={(photo) => setSelectedPhoto(photo)}
      />

      {selectedPhoto && (
        <div className="photo-viewer" onClick={() => setSelectedPhoto(null)}>
          <div className="photo-viewer-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedPhoto.image_url} alt="Full view" />
            <div className="photo-viewer-info">
              <span>{selectedPhoto.captured_by}</span>
              <span>{new Date(selectedPhoto.captured_at).toLocaleString()}</span>
            </div>
            <button className="photo-viewer-close" onClick={() => setSelectedPhoto(null)}>
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

