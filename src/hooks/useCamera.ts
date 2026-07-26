
// src/hooks/useCamera.ts

import { useState, useRef, useCallback, useEffect } from 'react';

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  stream: MediaStream | null;
  isReady: boolean;
  error: string | null;
  facing: 'user' | 'environment';
  flashMode: 'off' | 'auto' | 'on';
  flashSupported: boolean;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  flipCamera: () => void;
  capturePhoto: () => Blob | null;
  setFlashMode: (mode: 'off' | 'auto' | 'on') => void;
  toggleFlash: () => void;
}

export function useCamera(initialFacing: 'user' | 'environment' = 'environment'): UseCameraReturn {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facing, setFacing] = useState<'user' | 'environment'>(initialFacing);
  const [flashMode, setFlashMode] = useState<'off' | 'auto' | 'on'>('auto');
  const [flashSupported, setFlashSupported] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      setError(null);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      streamRef.current = mediaStream;
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
        setIsReady(true);
      }

      const track = mediaStream.getVideoTracks()[0];
      const capabilities = track.getCapabilities?.() as any;
      setFlashSupported(capabilities?.torch === true);
    } catch (err: any) {
      setError(err.message || 'Failed to access camera');
      setIsReady(false);
    }
  }, [facing]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setStream(null);
      setIsReady(false);
    }
  }, []);

  const flipCamera = useCallback(() => {
    setFacing((prev) => (prev === 'user' ? 'environment' : 'user'));
  }, []);

  useEffect(() => {
    if (streamRef.current) {
      startCamera();
    }
  }, [facing]);

  useEffect(() => {
    if (!streamRef.current || !flashSupported) return;
    const track = streamRef.current.getVideoTracks()[0];
    track.applyConstraints({
      advanced: [{ torch: flashMode === 'on' } as any],
    }).catch(() => {});
  }, [flashMode, flashSupported, stream]);

  const capturePhoto = useCallback((): Blob | null => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    if (facing === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    const byteString = atob(dataUrl.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
  }, [facing]);

  const toggleFlash = useCallback(() => {
    setFlashMode((prev) => {
      if (prev === 'off') return 'auto';
      if (prev === 'auto') return 'on';
      return 'off';
    });
  }, []);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return {
    videoRef, canvasRef, stream, isReady, error, facing,
    flashMode, flashSupported, startCamera, stopCamera,
    flipCamera, capturePhoto, setFlashMode, toggleFlash,
  };
}

