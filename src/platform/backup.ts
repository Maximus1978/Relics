import { invoke } from '@tauri-apps/api/core';

export type BackupSummary = { exportedAt: string; habits: number; archivedHabits: number; activities: number; formatVersion: number; databaseSchemaVersion: number; targetSchemaVersion:number; userEntries:number; defaultEntries:number; legacyEntries:number };
export type BackupPreview = { token: string; summary: BackupSummary };
export type BackupReceipt = { summary: BackupSummary; safetyFile: string };

export const nativeBackup = {
  export: () => invoke<BackupSummary | null>('export_backup'),
  preview: () => invoke<BackupPreview | null>('preview_backup'),
  cancel: () => invoke<void>('cancel_backup'),
  restore: (token: string) => invoke<BackupReceipt>('restore_backup', { token }),
};
