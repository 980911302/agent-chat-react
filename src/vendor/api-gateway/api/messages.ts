import type { WorkflowContextHistoryHeader } from '../types/common-interfaces.js';
import { getApiInstance } from '../client.js';
import type { ApiResponse } from '../client.js';
import type { SessionOverview, HistoryMessage } from '../types/gateway.js';

/**
 * 消息列表响应
 */
export interface MessagesResponse {
    messages: HistoryMessage[];
    agents: Array<{
        agent: {
            name: string;
            description: string;
        };
        tokens: number;
    }>;
    title?: string;
    agentGroups?: string[];
    pagination: {
        total: number;
        limit: number;
        offset: number;
        hasMore: boolean;
    };
}

/**
 * 工具调用精简信息
 */
export interface ToolCallInfo {
    /** 工具调用ID */
    id: string;
    /** 工具名称 */
    toolName: string;
    /** 工具参数 */
    args: string;
    /** 执行结果 */
    result?: string;
    /** 是否成功 */
    success: boolean;
    /** 时间戳 */
    timestamp: number;
}

/**
 * 工具调用分组
 */
export interface ToolCallGroup {
    /** 用户消息 */
    userMessage: HistoryMessage;
    /** 工具调用信息列表（精简版） */
    toolCalls: ToolCallInfo[];
    /** 智能体名称 */
    agent: string;
    /** 会话ID */
    sessionId: string;
}

/**
 * 工具调用分页响应
 */
export interface ToolCallGroupsResponse {
    /** 工具调用分组列表 */
    groups: ToolCallGroup[];
    /** 分页信息 */
    pagination: {
        total: number;
        pageSize: number;
        pageIndex: number;
        hasMore: boolean;
    };
}

export const messagesApi = {
    /**
     * 获取会话历史消息（分页）
     * @param sessionId 会话ID
     * @param params 查询参数
     * @returns 消息列表
     */
    getMessages: (sessionId: string, params?: {
        limit?: number;
        offset?: number;
        beforeTimestamp?: number;
    }) => getApiInstance().get<any, ApiResponse<MessagesResponse>>(`/messages/${sessionId}`, { params }),

    /**
     * 获取会话概览数据
     * @param sessionId 会话ID
     * @returns 会话概览
     */
    getSessionOverview: (sessionId: string) =>
        getApiInstance().get<any, ApiResponse<SessionOverview>>(`/messages/${sessionId}/overview`),

    /**
     * 获取用户的会话历史列表
     * @returns 会话历史列表
     */
    getHistorySessions: () =>
        getApiInstance().get<any, ApiResponse<WorkflowContextHistoryHeader[]>>('/messages/history/sessions'),

    /**
     * 删除指定会话中的某条消息
     * @param sessionId 会话ID
     * @param messageId 消息ID
     * @param agentName 消息所属智能体名称
     * @returns 删除结果
     */
    deleteMessage: (sessionId: string, messageId: string, agentName: string) =>
        getApiInstance().delete<any, ApiResponse<{ messageId: string }>>(`/messages/${sessionId}/${messageId}`, { params: { agentName } }),

    /**
     * 获取工具调用记录（分页）
     * @param sessionId 会话ID
     * @param params 查询参数
     * @returns 工具调用分组列表
     */
    getToolCalls: (sessionId: string, params?: {
        toolNames?: string[];
        isLike?: boolean;
        pageSize?: number;
        pageIndex?: number;
    }) => {
        // 构建查询参数，toolNames 需要转换为多个 toolName 参数
        const queryParams: Record<string, any> = {
            isLike: params?.isLike,
            pageSize: params?.pageSize,
            pageIndex: params?.pageIndex
        };
        // toolNames 数组需要特殊处理，每个值作为一个独立的 toolName 参数
        if (params?.toolNames && params.toolNames.length > 0) {
            queryParams.toolName = params.toolNames;
        }
        return getApiInstance().get<any, ApiResponse<ToolCallGroupsResponse>>(`/messages/${sessionId}/tool-calls`, { params: queryParams });
    }
};
