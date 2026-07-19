import { getApiInstance } from '../client.js';
import type { ApiResponse } from '../client.js';

export interface FileItem {
    name: string;
    isDirectory: boolean;
    size: number;
    mtime: number;
}

export const workspaceApi = {
    /**
     * 获取当前 session 的工作目录路径
     * @param sessionId 会话ID（可选，不传则尝试获取最近活跃会话）
     */
    getWorkspaceDir: (sessionId?: string) =>
        getApiInstance().get<any, ApiResponse<string | null>>('/workspace/dir', {
            params: { sessionId }
        }),

    /**
     * 列出工作目录下的文件/目录
     * @param relativePath 相对路径
     * @param sessionId 会话ID（可选）
     */
    listFiles: (relativePath?: string, sessionId?: string) =>
        getApiInstance().get<any, ApiResponse<FileItem[]>>('/workspace/files', {
            params: { relativePath, sessionId }
        }),

    /**
     * 读取文本文件内容
     * @param relativePath 相对路径
     * @param sessionId 会话ID（可选）
     */
    readFile: (relativePath: string, sessionId?: string) =>
        getApiInstance().get<any, ApiResponse<string>>('/workspace/file-content', {
            params: { relativePath, sessionId }
        }),

    /**
     * 下载文件
     * @param relativePath 相对路径
     * @param sessionId 会话ID（可选）
     */
    downloadFile: (relativePath: string, sessionId?: string) =>
        getApiInstance().get('/workspace/download', {
            params: { relativePath, sessionId },
            responseType: 'blob'
        })
};
