import type { AxiosInstance } from 'axios';

/**
 * 调用使用统计
 */
export interface CallUsageData {
  totals: number;
  success: Record<string, number>;
  fail: Record<string, number>;
}

/**
 * 智能体组
 */
export interface AgentGroup {
  name: string;
  members: string[];
  entryAgent: string;
  describe?: string;
}

/**
 * 用户信息
 */
export interface User {
  id: string;
  username: string;
  role: 'admin' | 'user' | 'tenant';
  agent?: string;
  agentType?: 'agent' | 'group';
  isEnabled?: boolean;
  createdAt?: number;
  updatedAt?: number;
  lastLoginAt?: number;
  tenantId?: string;
}

/**
 * 登录请求
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * 租户登录请求
 */
export interface TenantLoginRequest {
  tenantId?: string;
  agent?: string;
  agentType?: 'agent' | 'group';
}

/**
 * 登录响应
 */
export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

/**
 * 额外智能体数据（外部传入，跳过 API 请求）
 */
export interface ExtraAgentData {
  agent: string;
  agentType: 'agent' | 'group';
  describe?: string;
}

/**
 * Token 存储配置
 */
export interface TokenStorageConfig {
  /** Token 值（非 key） */
  token?: string;
  /** localStorage 中 token 的 key */
  tokenKey?: string;
  /** localStorage 中用户信息的 key */
  userInfoKey?: string;
}

/**
 * API 配置
 */
export interface ApiConfig {
  /** REST API 基础 URL */
  baseUrl?: string;
  /** 自定义 axios 实例 */
  instance?: AxiosInstance;
}

/**
 * WebSocket 配置
 */
export interface WebSocketConfig {
  /** WebSocket 主机地址 */
  host?: string;
  /** WebSocket 端口 */
  port?: number;
  /** WebSocket 路径 */
  path?: string;
  /** 重连延迟（毫秒） */
  reconnectDelay?: number;
}

/**
 * Agent Chat 全局配置
 */
export interface AgentChatConfig {
  /** Token 存储配置 */
  tokenStorage?: TokenStorageConfig;
  /** API 配置 */
  api?: ApiConfig;
  /** WebSocket 配置 */
  websocket?: WebSocketConfig;
}

/**
 * 消息发送参数
 */
export interface SendMessagePayload {
  /** 消息内容 */
  message: string;
  /** 附件文档 */
  documents?: DocumentInfo[];
  /** @ 提及目标 */
  mention?: {
    type: 'agent' | 'group';
    name: string;
  };
  /** 引用的知识库 ID 列表 */
  knowledgeIds?: string[];
}

/**
 * 文档信息（文件上传结果）
 */
export interface DocumentInfo {
  fileName: string;
  localPath?: string;
  url?: string;
}

/**
 * 工具调用信息
 */
export interface ToolCallInfo {
  toolName: string;
  args: string;
  status: 'pending' | 'success' | 'failed';
  result?: string;
  error?: string;
  timestamp?: number;
}

/**
 * 历史消息
 */
export interface HistoryMessage {
  role: string;
  content: string;
  reasonContent?: string;
  timestamp: number;
  documents?: DocumentInfo[];
  id: string;
  fromAgent?: string;
  toAgent?: string;
  toolCalls?: ToolCallInfo[];
  agent?: string;
  isStreaming?: boolean;
}

/**
 * 智能体信息
 */
export interface Agent {
  name: string;
  description: string;
  avatar?: string;
  type?: string;
  tokens?: number;
}

/**
 * 知识库组
 */
export interface KnowledgeGroup {
  group_id: string;
  group_name: string;
  description?: string;
  workspace?: string;
  doc_count?: number;
  created_at?: string;
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
    agent: { name: string; describe: string } | null;
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
 * 消息分页响应
 */
export interface MessagesResponse {
  messages: HistoryMessage[];
  agents: Array<{
    agent: { name: string; description: string };
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
 * 主题类型
 */
export type Theme = 'dark' | 'light';

/**
 * 输入区域水平对齐方式
 */
export type HorizontalAlignment = 'Left' | 'Center' | 'Right' | 'Full';

/**
 * Turn 回合中的步骤类型
 */
export type StepType = 'ask' | 'askUser' | 'reason' | 'tool' | 'step' | 'content';

/**
 * Turn 回合中的步骤
 */
export interface InternalStep {
  type: StepType;
  msg: HistoryMessage;
  tool?: ToolCallInfo;
}

/**
 * Turn 对话回合
 */
export interface Turn {
  /** 用户消息 */
  userMsg: HistoryMessage | null;
  /** 所有步骤（按时间顺序） */
  steps: InternalStep[];
}
