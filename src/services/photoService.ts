
// src/services/photoService.ts

import { supabase } from './supabase';
import { Photo, PhotoInsert, PhotoUpdate } from '../entities/Photo';
import { RealtimeChannel } from '@supabase/supabase-js';

const TABLE_NAME = 'wedding_photos';
const BUCKET_NAME = 'wedding-photos';

export async function uploadPhoto(
  blob: Blob,
  metadata: {
    capturedBy: string;
    flashUsed: boolean;
    cameraFacing: 'user' | 'environment';
  }
): Promise<Photo> {
  const timestamp = Date.now();
  const filename = `${timestamp}_${Math.random().toString(36).slice(2)}.jpg`;
  const filePath = `photos/${filename}`;

  // 1. Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, blob, {
      contentType: 'image/jpeg',
      cacheControl: '3600',
    });

  if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

  // 2. Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  const imageUrl = urlData.publicUrl;

  // 3. Insert metadata into database
  const photoData: PhotoInsert = {
    image_url: imageUrl,
    thumbnail_url: imageUrl,
    captured_by: metadata.capturedBy,
    captured_at: new Date().toISOString(),
    drive_file_id: null,
    drive_url: null,
    sync_status: 'pending',
    width: 1920,
    height: 1080,
    flash_used: metadata.flashUsed,
    camera_facing: metadata.cameraFacing,
  };

  const { data, error: insertError } = await supabase
    .from(TABLE_NAME)
    .insert(photoData)
    .select()
    .single();

  if (insertError) throw new Error(`Insert failed: ${insertError.message}`);

  return data as Photo;
}

export function subscribeToPhotos(
  callback: (photos: Photo[]) => void
): RealtimeChannel {
  fetchAllPhotos().then(callback);

  const channel = supabase
    .channel('wedding-photos-realtime')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: TABLE_NAME,
      },
      () => {
        fetchAllPhotos().then(callback);
      }
    )
    .subscribe();

  return channel;
}

export function unsubscribeFromPhotos(channel: RealtimeChannel): void {
  supabase.removeChannel(channel);
}

export async function fetchAllPhotos(): Promise<Photo[]> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .order('captured_at', { ascending: false });

  if (error) throw new Error(`Fetch failed: ${error.message}`);
  return (data || []) as Photo[];
}

export async function fetchPhotos(
  page: number = 0,
  pageSize: number = 20
): Promise<{ photos: Photo[]; hasMore: boolean }> {
  const from = page * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from(TABLE_NAME)
    .select('*', { count: 'exact' })
    .order('captured_at', { ascending: false })
    .range(from, to);

  if (error) throw new Error(`Fetch failed: ${error.message}`);

  return {
    photos: (data || []) as Photo[],
    hasMore: (count || 0) > to + 1,
  };
}

export async function updatePhotoWithDriveInfo(
  photoId: string,
  driveFileId: string,
  driveUrl: string
): Promise<void> {
  const { error } = await supabase
    .from(TABLE_NAME)
    .update({
      drive_file_id: driveFileId,
      drive_url: driveUrl,
      sync_status: 'synced',
    } as PhotoUpdate)
    .eq('id', photoId);

  if (error) throw new Error(`Update failed: ${error.message}`);
}

export async function markSyncFailed(photoId: string): Promise<void> {
  const { error } = await supabase
    .from(TABLE_NAME)
    .update({ sync_status: 'failed' } as PhotoUpdate)
    .eq('id', photoId);

  if (error) throw new Error(`Update failed: ${error.message}`);
}

export async function deletePhoto(photoId: string): Promise<void> {
  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('id', photoId);

  if (error) throw new Error(`Delete failed: ${error.message}`);
}

