import { getApiInstance } from '../client.js';
import type { ApiResponse } from '../client.js';
import type { RunAgentInfo } from '../types/common-messages.js';

/**
 * 问题看板摘要
 */
export interface IssueBoardSummary {
    issueBoardId: string;
    title: string;
    describe: string;
    createTime: number;
    subscribes: RunAgentInfo[];
    messageCount: number;
}

/**
 * 问题看板完整数据（含消息）
 */
export interface IssueBoardDetail {
    board: {
        issueBoardId: string;
        title: string;
        describe: string;
        subscribes: RunAgentInfo[];
    };
    messages: any[];
}

export const issuesApi = {
    // ==================== 看板 CRUD ====================

    /**
     * 获取当前会话的所有问题看板
     * @param sessionId 会话ID
     */
    getBoards: (sessionId: string) =>
        getApiInstance().get<any, ApiResponse<IssueBoardSummary[]>>('/issues/boards', {
            params: { sessionId }
        }),

    /**
     * 获取单个问题看板详情
     * @param sessionId 会话ID
     * @param boardId 看板ID
     */
    getBoard: (sessionId: string, boardId: string) =>
        getApiInstance().get<any, ApiResponse<IssueBoardSummary>>(`/issues/boards/${boardId}`, {
            params: { sessionId }
        }),

    /**
     * 创建问题看板
     * @param sessionId 会话ID
     * @param title 看板标题
     * @param describe 看板描述（可选）
     */
    createBoard: (sessionId: string, title: string, describe?: string) =>
        getApiInstance().post<any, ApiResponse<IssueBoardSummary>>('/issues/boards', {
            sessionId, title, describe
        }),

    /**
     * 更新问题看板
     * @param sessionId 会话ID
     * @param boardId 看板ID
     * @param data 要更新的字段
     */
    updateBoard: (sessionId: string, boardId: string, data: { title?: string; describe?: string }) =>
        getApiInstance().put<any, ApiResponse<IssueBoardSummary>>(`/issues/boards/${boardId}`, {
            sessionId, ...data
        }),

    /**
     * 删除问题看板
     * @param sessionId 会话ID
     * @param boardId 看板ID
     */
    deleteBoard: (sessionId: string, boardId: string) =>
        getApiInstance().delete<any, ApiResponse<void>>(`/issues/boards/${boardId}`, {
            params: { sessionId }
        }),

    // ==================== 订阅管理 ====================

    /**
     * 获取看板的订阅者列表
     * @param sessionId 会话ID
     * @param boardId 看板ID
     */
    getSubscribes: (sessionId: string, boardId: string) =>
        getApiInstance().get<any, ApiResponse<RunAgentInfo[]>>(`/issues/boards/${boardId}/subscribes`, {
            params: { sessionId }
        }),

    /**
     * 添加订阅者到看板
     * @param sessionId 会话ID
     * @param boardId 看板ID
     * @param name 智能体名称
     * @param type 智能体类型 'agent' | 'group'
     */
    addSubscribe: (sessionId: string, boardId: string, name: string, type: 'agent' | 'group') =>
        getApiInstance().post<any, ApiResponse<RunAgentInfo>>(`/issues/boards/${boardId}/subscribes`, {
            sessionId, name, type
        }),

    /**
     * 移除看板的订阅者
     * @param sessionId 会话ID
     * @param boardId 看板ID
     * @param subscriberName 订阅者名称
     * @param type 智能体类型 'agent' | 'group'
     */
    removeSubscribe: (sessionId: string, boardId: string, subscriberName: string, type: 'agent' | 'group') =>
        getApiInstance().delete<any, ApiResponse<void>>(`/issues/boards/${boardId}/subscribes/${subscriberName}`, {
            params: { sessionId, type }
        }),

    // ==================== 消息 ====================

    /**
     * 获取指定问题看板的消息列表
     * @param sessionId 会话ID
     * @param boardId 看板ID
     * @param subscriber 按订阅者名称过滤（可选）
     */
    getBoardMessages: (sessionId: string, boardId: string, subscriber?: string) =>
        getApiInstance().get<any, ApiResponse<IssueBoardDetail>>(`/issues/boards/${boardId}/messages`, {
            params: { sessionId, subscriber }
        })
};
