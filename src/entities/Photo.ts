
// src/entities/Photo.ts

export interface Photo {
  id: string;
  image_url: string;
  thumbnail_url: string;
  captured_by: string;
  captured_at: string;
  drive_file_id: string | null;
  drive_url: string | null;
  sync_status: 'pending' | 'uploading' | 'synced' | 'failed';
  width: number;
  height: number;
  flash_used: boolean;
  camera_facing: 'user' | 'environment';
  created_at: string;
}

export type PhotoInsert = Omit<Photo, 'id' | 'created_at'>;
export type PhotoUpdate = Partial<Pick<Photo, 'drive_file_id' | 'drive_url' | 'sync_status'>>;

