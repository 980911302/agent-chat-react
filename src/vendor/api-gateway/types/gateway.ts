import { MessageRole, RunAgentType } from "./enums.js";
import type { DocumentInfo } from "./common-messages.js";

/**
 * 智能体信息
 */
export interface Agent {
    name: string;
    description: string;
    avatar?: string;
    type?: RunAgentType; // 智能体类型：普通智能体或智能体组
    tokens?: number; // 上下文窗口 token 数量
}

/**
 * 调用使用统计
 */
export interface CallUsageData {
    totals: number;
    success: Record<string, number>;
    fail: Record<string, number>;
}

/**
 * 会话概览
 */
export interface SessionOverview {
    tokens?: number;
    startTime: number;
    endTime: number;
    usedModels?: Array<{
        modelId: string;
        tokensUsage: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
            cacheTokens: number;
        };
    }>;
    workspaceDir?: string;
    agentContexts: Array<{
        agent: {
            name: string;
            describe: string;
        } | null;
        tokens?: number;
        tokensUsage?: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
            cacheTokens: number;
        };
        startTime?: number;
        endTime?: number;
        messagesCount: number;
        toolUsage?: CallUsageData;
        skillUsage?: CallUsageData;
    }>;
}

/**
 * 历史消息/通用消息结构
 */
export interface HistoryMessage {
    /**
     * 消息角色
     */
    role: MessageRole;
    /**
     * 消息内容
     */
    content: string;
    /**
     * 推理的消息内容
     */
    reasonContent?: string;
    /**
     * 消息时间戳
     */
    timestamp: number;
    /**
     * 文件附件列表
     */
    documents?: DocumentInfo[];
    /**
     * 消息ID
     */
    id: string;
    /**
     * 当 role = MessageRole.AskAgent 时，该字段是`询问智能体`
     */
    fromAgent?: string;
    /**
     * 当 role = MessageRole.AskAgent 时，该字段是`被询问智能体`
     */
    toAgent?: string;
    /**
     * 工具调用列表, 当 role = MessageRole.Assistant 时，该字段是工具调用列表
     */
    toolCalls?: Array<{
        /**
         * 工具名称
         */
        toolName: string;
        /**
         * 工具参数
         */
        args: string;
        /**
         * 执行状态
         */
        status: 'pending' | 'success' | 'failed';
        /**
         * 执行结果
         */
        result?: string;
        /**
         * 错误信息
         */
        error?: string;
        /**
         * 时间戳
         */
        timestamp?: number;
    }>;
    /**
     * 当 role = MessageRole.Assistant 时，该字段是`智能体的名称`, 如果是 AskUser 则是表示哪个`智能体` 来询问用户的
     */
    agent?: string;
    /**
     * 仅用作前端判断使用
     */
    isStreaming?: boolean;
}

/**
 * 创建会话响应
 */
export interface CreateSessionResponse {
    /** 会话 ID */
    sessionId: string;
    /** 工作目录路径 */
    workspaceDir?: string;
}

/**
 * 知识库查询响应
 */
export interface KnowledgeQueryResponse {
    /** 查询是否成功 */
    success: boolean;
    /** 查询结果内容 */
    content: string;
}
