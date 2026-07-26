
// src/components/PhotoPreview.tsx

import React from 'react';

interface PhotoPreviewProps {
  imageBlob: Blob | null;
  isSaving: boolean;
  isDriveSyncing: boolean;
  driveSynced: boolean;
  onRetake: () => void;
  onSave: () => void;
  onDownload: () => void;
}

export function PhotoPreview({
  imageBlob,
  isSaving,
  isDriveSyncing,
  driveSynced,
  onRetake,
  onSave,
  onDownload,
}: PhotoPreviewProps) {
  const imageUrl = imageBlob ? URL.createObjectURL(imageBlob) : '';

  return (
    <div className="preview-view">
      <div className="preview-header">
        <h2>Beautiful!</h2>
        <p>Review your captured moment</p>
      </div>

      <div className="preview-image">
        {imageUrl && (
          <img src={imageUrl} alt="Captured moment" />
        )}
      </div>

      <div className="preview-bottom">
        <div className="preview-actions">
          <button className="action-btn btn-retake" onClick={onRetake} disabled={isSaving}>
            ↺ Retake
          </button>
          <button className="action-btn btn-save" onClick={onSave} disabled={isSaving}>
            {isSaving ? '⏳ Saving...' : '✓ Save'}
          </button>
          <button className="action-btn btn-download" onClick={onDownload}>
            ↓ Download
          </button>
        </div>

        <div className="drive-status">
          {isDriveSyncing && <span>⏳ Uploading to Google Drive...</span>}
          {driveSynced && <span>✓ Saved to Google Drive • Wedding Photos</span>}
          {!isDriveSyncing && !driveSynced && <span>Photos saved to Supabase</span>}
        </div>
      </div>
    </div>
  );
}

