import { get, post, del } from '@/adapter/httpAdapter';
import { WebEnvConst } from '@/app/webEnvConst';

export interface FileUploadResponse {
  message: string;
  id: string;
}

export interface FileStorageItem {
  id: string;
  name: string;
  type: string;
  url: string;
}

export const FileStorageService = {
  /**
   * Upload a file to the server
   * @param file The file to upload
   * @returns A promise that resolves to the upload response containing the file ID
   */
  uploadFile: async (file: File): Promise<string> => {
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', file);

    // Make the POST request to upload the file
    const response = await post<FileUploadResponse>(WebEnvConst.fileStorage.upload, formData);

    // Extract the file ID from the response message
    // Example message: "File successfully uploaded id: 68516ade9bb7777f53f01945"
    const idMatch = response.message.match(/id: ([a-f0-9]+)/);
    if (idMatch && idMatch[1]) {
      return idMatch[1];
    }

    // If we can't extract the ID from the message, use the id field directly
    return response.id;
  },

  /**
   * Get a file by its ID
   * @param id The ID of the file to retrieve
   * @returns The URL to the file
   */
  getFileUrl: (id: string): string => {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}${WebEnvConst.fileStorage.getOne(id)}`;
  },

  /**
   * Delete a file by its ID
   * @param id The ID of the file to delete
   * @returns A promise that resolves when the file is deleted
   */
  deleteFile: async (id: string): Promise<void> => {
    return await del<void>(WebEnvConst.fileStorage.delete(id));
  },

  /**
   * Upload multiple files to the server
   * @param files The files to upload
   * @returns A promise that resolves to an array of file IDs
   */
  uploadFiles: async (files: File[]): Promise<string[]> => {
    // Upload each file and collect the promises
    const uploadPromises = files.map(file => FileStorageService.uploadFile(file));

    // Wait for all uploads to complete
    return await Promise.all(uploadPromises);
  },

  /**
   * Create a FileStorageItem from a file ID
   * @param id The file ID
   * @param name Optional name for the file
   * @param type Optional MIME type for the file
   * @returns A FileStorageItem object
   */
  createFileItem: (id: string, name?: string, type?: string): FileStorageItem => {
    return {
      id,
      name: name || id,
      type: type || 'application/octet-stream',
      url: FileStorageService.getFileUrl(id)
    };
  }
};
