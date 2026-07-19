import { DocumentInfo } from '../types/common-messages.js';
import { getApiInstance } from '../client.js';

/**
 * 文件上传结果（已废弃，使用 DocumentInfo）
 * @deprecated 使用 DocumentInfo 替代
 */
export interface UploadFileResult {
    filename: string;
    dateFolder: string;
    size: number;
    path: string;
}

/**
 * 文件上传 API
 */
export const uploadApi = {
    /**
     * 上传单个文件
     * @param file 文件对象
     * @returns 上传结果
     */
    async uploadFile(file: File): Promise<{
        success: boolean;
        data?: DocumentInfo;
        message?: string;
    }> {
        const api = getApiInstance();

        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response as any;
    },

    /**
     * 上传多个文件
     * @param files 文件对象数组
     * @returns 上传结果
     */
    async uploadFiles(files: File[]): Promise<{
        success: boolean;
        data?: DocumentInfo[];
        message?: string;
    }> {
        const api = getApiInstance();

        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });

        const response = await api.post('/upload/multiple', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response as any;
    }
};
