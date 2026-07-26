
// src/routes/AppRouter.tsx

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CameraPage } from '../pages/CameraPage';
import { PreviewPage } from '../pages/PreviewPage';
import { GalleryPage } from '../pages/GalleryPage';
import { BottomNav } from '../components/BottomNav';

export function AppRouter() {
  return (
    <BrowserRouter basename="/wedding-camera">
      <div className="app-container">
        <Routes>
          <Route path="/" element={<CameraPage />} />
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

