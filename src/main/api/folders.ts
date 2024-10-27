import { app } from 'electron';
import fs from 'fs/promises';
import path from 'path';

// Types
export type Folder = {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
  modifiedAt: string;
}

export type FolderData = {
  folders: Folder[];
  version: number;
  lastBackup: string;
}

// Constants
const DATA_VERSION = 1;
const MAX_BACKUPS = 5;

// Paths
const getDataPath = () => path.join(app.getPath('userData'), 'data');
const getFoldersPath = () => path.join(getDataPath(), 'folders.json');
const getBackupsPath = () => path.join(getDataPath(), 'backups');

// Ensure directories exist
async function ensureDirectories() {
  try {
    const dataPath = getDataPath();
    const backupsPath = getBackupsPath();
    
    console.log('Creating directories:', { dataPath, backupsPath });
    await fs.mkdir(dataPath, { recursive: true });
    await fs.mkdir(backupsPath, { recursive: true });
    console.log('Directories created successfully');
  } catch (error) {
    console.error('Error creating directories:', error);
    throw error;
  }
}

// Create backup
async function createBackup(data: FolderData) {
  try {
    const backupsPath = getBackupsPath();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupsPath, `folders-${timestamp}.json`);
    
    console.log('Creating backup:', backupPath);
    await fs.writeFile(backupPath, JSON.stringify(data, null, 2));
    
    // Clean old backups
    const backups = await fs.readdir(backupsPath);
    if (backups.length > MAX_BACKUPS) {
      const oldestBackup = backups.sort()[0];
      await fs.unlink(path.join(backupsPath, oldestBackup));
    }
    console.log('Backup created successfully');
  } catch (error) {
    console.error('Error creating backup:', error);
    throw error;
  }
}

// Load folders
export async function loadFolders(): Promise<FolderData> {
  try {
    const foldersPath = getFoldersPath();
    console.log('Loading folders from:', foldersPath);
    
    try {
      const content = await fs.readFile(foldersPath, 'utf-8');
      const data = JSON.parse(content);
      console.log('Folders loaded successfully');
      return data;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        console.log('No existing folders file, creating initial state');
        const initialState = {
          folders: [],
          version: DATA_VERSION,
          lastBackup: new Date().toISOString()
        };
        await saveFolders(initialState);
        return initialState;
      }
      throw error;
    }
  } catch (error) {
    console.error('Error loading folders:', error);
    throw error;
  }
}

// Save folders
export async function saveFolders(data: FolderData): Promise<FolderData> {
  try {
    console.log('Saving folders:', data);
    await ensureDirectories();
    
    // Validate data
    if (!Array.isArray(data.folders)) {
      throw new Error('Invalid folder data structure');
    }
    
    // Update metadata
    const updatedData = {
      ...data,
      version: DATA_VERSION,
      lastBackup: new Date().toISOString()
    };
    
    // Save data
    const foldersPath = getFoldersPath();
    await fs.writeFile(foldersPath, JSON.stringify(updatedData, null, 2));
    console.log('Folders saved successfully');
    
    // Create backup
    await createBackup(updatedData);

    // Return the saved data
    return updatedData;
  } catch (error) {
    console.error('Error saving folders:', error);
    throw error;
  }
}

// Restore from backup
export async function restoreFromBackup(backupFile?: string): Promise<FolderData> {
  try {
    const backupsPath = getBackupsPath();
    console.log('Restoring from backup path:', backupsPath);
    
    // If no specific backup file provided, use latest
    if (!backupFile) {
      const backups = await fs.readdir(backupsPath);
      if (backups.length === 0) throw new Error('No backups available');
      backupFile = backups.sort().pop()!;
    }
    
    const backupPath = path.join(backupsPath, backupFile);
    console.log('Using backup file:', backupPath);
    
    const content = await fs.readFile(backupPath, 'utf-8');
    const data = JSON.parse(content);
    
    // Validate backup data
    if (!Array.isArray(data.folders)) {
      throw new Error('Invalid backup data structure');
    }
    
    console.log('Backup restored successfully');
    return data;
  } catch (error) {
    console.error('Error restoring from backup:', error);
    throw error;
  }
}
