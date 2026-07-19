import { getApiInstance } from '../client.js';
import type { ApiResponse } from '../client.js';
import type { SessionOverview, CreateSessionResponse } from '../types/gateway.js';
import type { WorkflowContextHistoryHeader } from '../types/common-interfaces.js';

export const sessionApi = {
    /**
     * 创建新会话
     * 注意：后端已移除 username 参数，用户信息从 Token 中获取
     * @returns 新创建的会话 ID 和工作目录
     */
    createSession: () =>
        getApiInstance().post<any, ApiResponse<CreateSessionResponse>>('/session/create'),

    /**
     * 获取当前用户的会话历史列表
     * 注意：后端已移除 username 查询参数，用户信息从 Token 中获取
     * @returns 会话历史列表
     */
    getHistorySessions: () =>
        getApiInstance().get<any, ApiResponse<WorkflowContextHistoryHeader[]>>('/session/history'),

    /**
     * 获取当前用户的最新会话
     * 注意：后端已移除 username 查询参数，用户信息从 Token 中获取
     * @returns 最新会话 ID
     */
    getLatestSession: () =>
        getApiInstance().get<any, ApiResponse<{ sessionId: string }>>('/session/latest'),

    /**
     * 删除指定会话（同时删除本地文件）
     * @param sessionId 会话ID
     */
    deleteSession: (sessionId: string) =>
        getApiInstance().delete<any, ApiResponse<null>>(`/session/${sessionId}`),

    /**
     * 修改会话标题
     * @param sessionId 会话ID
     * @param title 新标题
     */
    updateSessionTitle: (sessionId: string, title: string) =>
        getApiInstance().put<any, ApiResponse<null>>(`/session/${sessionId}/title`, { title })
};
