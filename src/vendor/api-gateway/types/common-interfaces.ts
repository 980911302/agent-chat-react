/**
 * 从 @xyxandwxx/common 迁移的接口类型
 */
import { ContextCompactStrategy, ToolsLibraryType, MCPTransportType } from './enums.js';

/**
 * 模型能力
 */
export type ModelAbility = 'text' | 'image' | 'document';

/**
 * 模型信息
 */
export interface ModelInfo {
    id: string;
    companyName: string;
    vendor: string;
    modelName: string;
    description: string;
    baseUrl: string;
    supports: ModelAbility[];
    reasoning: boolean;
    maxContextTokenLength: number;
}

/**
 * 使用的模型上下文
 */
export interface UseModelContext {
    id: string;
    apiKeys: string[];
    temperature: number;
    tokenUsage: TokensUsage;
    isEnable?: boolean;
}

/**
 * 运行时信息
 */
export interface RuntimeInfo {
    host: string;
    platform: string;
    arch: string;
}

/**
 * 智能体接口
 */
export interface IAgent {
    isFake?: boolean;
    isEnabled?: boolean;
    icon?: string;
    name: string;
    describe: string;
    systemPrompt: string;
    tools?: string[];
    skills?: string[];
    models?: string[];
    subAgents?: string[];
    temperature?: number;
    allowAllAgents?: boolean;
    allowAllTools?: boolean;
    allowAllSkills?: boolean;
    /** 是否允许加载本地智能体文档（agents.md） */
    isEnableLoadAgentDoc?: boolean;
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
 * 技能接口
 */
export interface ISkill {
    isEnabled?: boolean;
    global: boolean;
    name: string;
    describe: string;
    prompt: string;
    rootDir: string;
    loadResource(path: string): Promise<string>;
    loadScript(path: string): Promise<string>;
    loadData(path: string): Promise<string>;
}

/**
 * 工具参数信息
 */
export interface IParamInfo {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'array' | 'object';
    description: string;
    required: boolean;
    default?: any;
    enum?: string[];
}

/**
 * 智能体使用模型信息
 */
export interface AgentUseModel {
    id: string;
    temperature?: number;
}

/**
 * 调用使用情况
 */
export class CallUsage {
    public totals: number = 0;
    public success: Map<string, number> = new Map();
    public fail: Map<string, number> = new Map();

    public addSuccess(callName: string) {
        this.success.set(callName, (this.success.get(callName) || 0) + 1);
        this.totals++;
    }

    public addFail(callName: string) {
        this.fail.set(callName, (this.fail.get(callName) || 0) + 1);
        this.totals++;
    }
}

/**
 * 工具调用上下文
 */
export interface ToolCallContext {
    toolName: string;
    toolCallId: string;
    context: IAgentBuildMessageContext;
    stacks: IWorkflowStack[];
}

/**
 * 工作流上下文历史记录头
 */
export interface WorkflowContextHistoryHeader {
    sessionId: string;
    username: string;
    timestamp: number;
    title?: string;
}

/**
 * 工具库接口
 */
export interface IToolsLibrary {
    name: string;
    describe: string;
    tools: ITools[];
    toolsLibraryType: ToolsLibraryType;
}

/**
 * 工具接口
 */
export interface ITools {
    name: string;
    describe: string;
    params: any | IParamInfo[];
    toolLibrary: IToolsLibrary;
    execute(context: ToolCallContext, args: Record<string, any>): Promise<any>;
}

/**
 * 任务接口
 */
export interface ITask {
    id: string;
    name: string;
    describe: string;
    type: TaskType;
    content: string;
    isEnabled: boolean;
    username: string;
    runAgentInfo: RunAgentInfo;
    cron: string;
    once: boolean;
}

export interface ITaskResult {
    id: string;
    name: string;
    type: TaskType;
    params: Record<string, any>;
    success: boolean;
}

/**
 * 问题看板
 */
export interface IIssueBoard {
    issueBoardId: string;
    title: string;
    createTime: number;
    describe: string;
    messages: IIssueBoardSessionMessage[];
    subscribes: RunAgentInfo[];
}

/**
 * 用户接口
 */
export interface IUser {
    id: string;
    username: string;
    passwordHash: string;
    role: 'admin' | 'user' | 'tenant';
    createdAt: number;
    updatedAt: number;
    isEnabled: boolean;
    lastLoginAt?: number;
    agent?: string;
}

/**
 * JWT Payload 结构
 */
export interface IJwtPayload {
    userId: string;
    username: string;
    role: 'admin' | 'user' | 'tenant';
    tokenId?: string;
    iat: number;
    exp: number;
}

/**
 * Token 响应结构
 */
export interface ITokenResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

/**
 * 上下文压缩策略配置
 */
export interface ContextCompactStrategyConfig {
    enabled: boolean;
    percentageThreshold: number;
    targetPercentage: number;
    strategy: ContextCompactStrategy;
    reserveRecentMessages?: number;
}

export const defaultContextCompactStrategyConfig: ContextCompactStrategyConfig = {
    enabled: true,
    percentageThreshold: 0.85,
    targetPercentage: 0.2,
    strategy: ContextCompactStrategy.Summarize,
    reserveRecentMessages: 4,
};

/**
 * 工具调用配置
 */
export interface ToolCallConfig {
    enablePersistResults?: boolean;
    persistResultSizeChars?: number;
}

export const defaultToolCallConfig: ToolCallConfig = {
    enablePersistResults: false,
    persistResultSizeChars: 200
};

/**
 * 聊天设置配置
 */
export interface ChatSettings {
    showThinking: boolean;
    showToolCallLog: boolean;
    toolCallEventMaxChars: number;
    defaultMessageLimit?: number;
    imageStrategy?: 'latest-only' | 'all' | 'recent-n';
    imageRecentCount?: number;
    llmTtitle: boolean;
}

export const defaultChatSettings: ChatSettings = {
    showThinking: true,
    showToolCallLog: true,
    toolCallEventMaxChars: 200,
    defaultMessageLimit: 50,
    imageStrategy: 'latest-only',
    imageRecentCount: 3,
    llmTtitle: false
};

/**
 * MCP 客户端配置
 */
export interface MCPClientConfig {
    /** 唯一标识（必填） */
    id: string;
    version?: string;
    dependency?: 'python' | 'node';
    transportType: MCPTransportType;
    command?: string;
    args?: string[];
    url?: string;
    timeout?: number;
    shell?: boolean;
    name: string;
    describe: string;
    /** 环境变量（对 HTTP/SSE/WS/StreamableHTTP 同时作为 HTTP 请求头注入） */
    env?: Record<string, string>;
}

/**
 * PowerClaw RAG 服务器配置
 */
export interface PowerClawRagServer {
    ragServerUrl: string;
}

/**
 * 知识检索配置
 */
export interface KnowledgeRagConfig {
    powerClawRagServer: PowerClawRagServer;
}

/**
 * PowerClaw 配置
 */
export interface IPowerClawConfig {
    port: number;
    host: string;
    rootDir: string;
    useModelContext: UseModelContext[];
    systemRuntimeInfo: RuntimeInfo;
    version: string;
    isLoaded: boolean;
    knowledgeRagConfig: KnowledgeRagConfig;
    contextCompactStrategyConfig: ContextCompactStrategyConfig;
    toolCallConfig: ToolCallConfig;
    chatSettings: ChatSettings;
}

/**
 * 询问用户结构
 */
export interface AskUserData {
    functionCallId?: string;
    askMessage: string;
}

/**
 * 智能体构建消息上下文接口
 */
export interface IAgentBuildMessageContext {
    agent?: IAgent;
    messages: BaseMessage[];
    toolUsage?: CallUsage;
    skillUsage?: CallUsage;
    tokens?: number;
    tokensUsage?: TokensUsage;
    startTime?: number;
    workspaceDir?: string;
    skill?: ISkill;
    currentRunStackIndex: number;
    userSessionContext?: IUserWorkflowSessionContext;
}

/**
 * 用户工作流会话上下文接口
 */
export interface IUserWorkflowSessionContext {
    sessionId: string;
    tokens?: number;
    title?: string;
    username?: string;
    startTime: number;
    usedModels: Map<string, TokensUsage>;
    workspaceDir?: string;
    agentGroups: string[];
    agentContexts: IAgentBuildMessageContext[];
    issureBoards: IIssueBoard[];
    issureBoardMessageQueue: Record<string, IIssueBoardSessionMessage[]>;
    issureBoardExecuteStack: Record<string, IssureBoardStack[]>;
    runAgentOrGroupMessageQueue: AgentOrGroupSessionMessage[];
    runAgentOrGroupMessageStack: IWorkflowStack[];
}

/**
 * 用户表结构
 */
export interface UserTable {
    id?: number;
    username: string;
    email: string;
    password: string;
    created_at?: string;
    updated_at?: string;
    role: string;
}

// 导入依赖的类型
import { TaskType, RunAgentType } from './enums.js';
import { RunAgentInfo, TokensUsage, BaseMessage, IWorkflowStack, IIssueBoardSessionMessage, IssureBoardStack, AgentOrGroupSessionMessage } from './common-messages.js';
