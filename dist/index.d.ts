import { ActionCreatorWithoutPayload } from '@reduxjs/toolkit';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import { default as default_2 } from 'react';
import { EnhancedStore } from '@reduxjs/toolkit';
import { Reducer } from 'redux';
import { StoreEnhancer } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { Tuple } from '@reduxjs/toolkit';
import { UnknownAction } from 'redux';

export declare const A2UIChatLayout: default_2.ForwardRefExoticComponent<A2UIChatLayoutProps & default_2.RefAttributes<A2UIChatLayoutRef>>;

/**
 * A2UI 聊天布局
 * 使用 @a2ui/lit Web Component 渲染交互式 UI Surface
 */
export declare interface A2UIChatLayoutProps {
    theme?: Theme;
    showAgentInfo?: boolean;
    isEnableFile?: boolean;
    input_isEnableKnowledge?: boolean;
    placeholder?: string;
    showTokensBar?: boolean;
    inputAreaHorizontalAlignment?: HorizontalAlignment;
    inputAreaMargin?: string;
    inputWidth?: string;
    inputAgentsData?: ExtraAgentData[];
    /** 智能体分组列表，用于判断 agent/group 类型 */
    groups?: AgentGroup[];
    /** 是否自动连接 WebSocket，设为 false 时需要手动调用 ref.connect() 连接 */
    autoConnect?: boolean;
    /** A2UI 事件回调 */
    onA2UIAction?: (action: any) => void;
    onSurfaceCreated?: (surfaceId: string) => void;
    onComponentsUpdated?: (data: any) => void;
    onDataModelUpdated?: (data: any) => void;
    onSurfaceDeleted?: (surfaceId: string) => void;
}

export declare interface A2UIChatLayoutRef {
    newSession: () => Promise<void>;
    changeSession: (sessionId: string) => Promise<void>;
    a2uiMessageListRef: default_2.RefObject<A2UIMessageListRef | null>;
    /** 手动连接 WebSocket，支持指定会话 ID 和跳过历史加载 */
    connect: (sessionId?: string, options?: {
        skipHistory?: boolean;
    }) => Promise<void>;
    /** 手动断开 WebSocket 连接 */
    disconnect: () => void;
}

export declare interface A2UICreateSurfaceEvent {
    surfaceId: string;
    catalogId?: string;
    catalog?: any;
    options?: any;
    timestamp?: number;
}

export declare interface A2UIDeleteSurfaceEvent {
    surfaceId: string;
    timestamp?: number;
}

/** A2UI 消息 */
export declare interface A2UIMessage {
    version?: string;
    createSurface?: A2UICreateSurfaceEvent;
    updateComponents?: A2UIUpdateComponentsEvent;
    updateDataModel?: A2UIUpdateDataModelEvent;
    deleteSurface?: A2UIDeleteSurfaceEvent;
}

export declare const A2UIMessageList: default_2.ForwardRefExoticComponent<A2UIMessageListProps & default_2.RefAttributes<A2UIMessageListRef>>;

/**
 * A2UI 消息列表组件
 * 使用 @a2ui/lit 和 @a2ui/web_core 渲染交互式 UI Surface
 *
 * 注意：此组件需要 @a2ui/lit 和 @a2ui/web_core 作为可选依赖
 */
export declare interface A2UIMessageListProps {
    /** 主题 */
    theme?: Theme;
    /** A2UI 特殊事件订阅函数 */
    onSpecialEvent?: (eventName: string, callback: (data: any) => void) => () => void;
    /** 会话切换回调 */
    onSessionSwitch?: (callback: (reason: string) => void) => () => void;
    /** A2UI 用户操作回调（回传给后端） */
    onA2UIAction?: (surfaceId: string, action: any) => void;
}

export declare interface A2UIMessageListRef {
    addUserMessage: (msg: string) => void;
    loadLatest: () => void;
    loadMore: () => void;
    scrollToBottom: () => void;
}

export declare interface A2UIUpdateComponentsEvent {
    surfaceId: string;
    components: any[];
    timestamp?: number;
}

export declare interface A2UIUpdateDataModelEvent {
    surfaceId: string;
    path?: string;
    value?: any;
    timestamp?: number;
}

export declare const addMessage: ActionCreatorWithPayload<    {
agent: string;
message: HistoryMessage;
}, "chat/addMessage">;

export declare const addToolCallFailed: ActionCreatorWithPayload<    {
agent: string;
toolName: string;
error?: string;
}, "chat/addToolCallFailed">;

export declare const addToolCallStart: ActionCreatorWithPayload<    {
agent: string;
toolName: string;
args: string;
}, "chat/addToolCallStart">;

export declare const addToolCallSuccess: ActionCreatorWithPayload<    {
agent: string;
toolName: string;
result?: string;
}, "chat/addToolCallSuccess">;

export declare const addUserMessage: ActionCreatorWithPayload<    {
content: string;
documents?: any[];
agent?: string;
}, "chat/addUserMessage">;

/**
 * 智能体信息
 */
export declare interface Agent {
    name: string;
    description: string;
    avatar?: string;
    type?: string;
    tokens?: number;
}

export declare const AgentAvatar: default_2.FC<AgentAvatarProps>;

/**
 * 智能体头像组件
 * 支持图片、Emoji、SVG、文字头像等多种模式
 */
export declare interface AgentAvatarProps {
    /** 图片 URL */
    src?: string;
    /** Emoji 字符 */
    emoji?: string;
    /** 原始 SVG HTML */
    svg?: string;
    /** 文字头像内容 */
    text?: string;
    /** 智能体名称（作为 text 的别名） */
    agentName?: string;
    /** 尺寸 */
    size?: 'small' | 'medium' | 'large';
    /** 自定义背景色 */
    color?: string;
    /** 是否为群组 */
    isGroup?: boolean;
}

/**
 * Agent Chat 全局配置
 */
export declare interface AgentChatConfig {
    /** Token 存储配置 */
    tokenStorage?: TokenStorageConfig;
    /** API 配置 */
    api?: ApiConfig;
    /** WebSocket 配置 */
    websocket?: WebSocketConfig;
}

export declare type AgentChatStore = ReturnType<typeof createAgentChatStore>;

/**
 * 智能体组
 */
export declare interface AgentGroup {
    name: string;
    members: string[];
    entryAgent: string;
    describe?: string;
}

/**
 * API 配置
 */
export declare interface ApiConfig {
    /** REST API 基础 URL */
    baseUrl?: string;
    /** 自定义 axios 实例 */
    instance?: AxiosInstance;
}

export declare type AppDispatch = typeof store.dispatch;

export declare const appendStreamContent: ActionCreatorWithPayload<    {
agent: string;
content: string;
}, "chat/appendStreamContent">;

export declare const appendStreamReasonContent: ActionCreatorWithPayload<    {
agent: string;
content: string;
}, "chat/appendStreamReasonContent">;

/**
 * 聊天状态管理
 * 负责 WebSocket 消息收发、会话管理、流式消息处理
 */
/** 认证错误码 —— 与 Vue 版对齐 */
export declare type AuthErrorCode = 'TOKEN_EXPIRED' | 'TOKEN_INVALID' | 'TOKEN_MISSING' | 'AUTH_FAILED' | 'USER_NOT_FOUND' | 'SESSION_ERROR' | 'SERVICE_ERROR';

/**
 * 调用使用统计
 */
declare interface CallUsageData {
    totals: number;
    success: Record<string, number>;
    fail: Record<string, number>;
}

export declare interface ChatState {
    /** 按智能体分组的消息记录 */
    messages: Record<string, HistoryMessage[]>;
    /** WebSocket 是否已连接 */
    isConnected: boolean;
    /** 是否正在等待 AI 回复 */
    isLoading: boolean;
    /** 连接错误信息 */
    connectionError: string | null;
    /** 认证错误码 */
    authErrorCode: AuthErrorCode | null;
    /** 当前智能体 */
    currentAgent: string;
    /** 当前会话 ID */
    sessionId: string | null;
    /** 当前会话的智能体列表 */
    agents: Agent[];
    /** 每个智能体的 token 数量 */
    agentTokens: Record<string, number>;
    /** 是否展示工具调用日志 */
    showToolCallLog: boolean;
    /** 是否有更多消息（按智能体） */
    hasMoreMessages: Record<string, boolean>;
    /** 是否正在加载更多 */
    isLoadingMore: boolean;
    /** 是否已认证 */
    isAuthenticated: boolean;
    /** 当前会话概览数据 */
    sessionOverview: SessionOverview | null;
    /** 会话概览加载状态 */
    sessionOverviewLoading: boolean;
}

export declare const clearAuth: ActionCreatorWithoutPayload<"user/clearAuth">;

export declare const clearMessages: ActionCreatorWithoutPayload<"chat/clearMessages">;

/** 清除 Token */
export declare function clearToken(): void;

/**
 * Redux Store 配置
 * 使用 Redux Toolkit 管理聊天和用户状态
 */
export declare function createAgentChatStore(preloadedState?: any): EnhancedStore<any, UnknownAction, Tuple<[StoreEnhancer<    {
dispatch: ThunkDispatch<any, undefined, UnknownAction>;
}>, StoreEnhancer]>>;

declare const _default: Reducer<ChatState>;

declare const _default_2: Reducer<UserState>;

/**
 * 文档信息（文件上传结果）
 */
export declare interface DocumentInfo {
    fileName: string;
    localPath?: string;
    url?: string;
}

/**
 * 额外智能体数据（外部传入，跳过 API 请求）
 */
export declare interface ExtraAgentData {
    agent: string;
    agentType: 'agent' | 'group';
    describe?: string;
}

/**
 * 格式化时间戳为完整日期时间格式（对齐 Vue 版）
 * @param timestamp 时间戳（数字或字符串）
 * @returns 格式化后的时间字符串，格式：YYYY-MM-DD HH:mm:ss
 */
export declare function formatTime(timestamp: number | string): string;

/**
 * 格式化时间戳为短时间格式（仅时:分:秒）
 * @param timestamp 时间戳
 * @returns 格式化后的时间字符串，格式：HH:mm:ss
 */
export declare function formatTimeShort(timestamp: number): string;

/**
 * 生成 UUID
 */
export declare function generateId(): string;

/** 获取 axios 实例 */
export declare function getApiInstance(): AxiosInstance;

/** 获取当前完整配置 */
export declare function getConfig(): Required<AgentChatConfig>;

/** 获取 Token */
export declare function getToken(): string;

/** 获取 Token 存储配置 */
export declare function getTokenStorageConfig(): TokenStorageConfig;

/** 获取 WebSocket 配置 */
export declare function getWebSocketConfig(): WebSocketConfig;

export declare function hashColor(text: string): string;

/**
 * 历史消息
 */
export declare interface HistoryMessage {
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
 * 输入区域水平对齐方式
 */
export declare type HorizontalAlignment = 'Left' | 'Center' | 'Right' | 'Full';

/**
 * 初始化 Agent Chat 配置
 * 在应用入口处调用
 */
export declare function initAgentChatConfig(config?: AgentChatConfig): void;

export declare const InputArea: default_2.FC<InputAreaProps>;

/**
 * 消息输入区域组件
 * 支持 @ 智能体选择、# 知识库引用、文件上传
 * HTML 结构和 class 命名完全对齐 Vue 版 InputArea.vue
 */
export declare interface InputAreaProps {
    /** WebSocket 是否已连接 */
    isConnected: boolean;
    /** 是否正在等待 AI 回复 */
    isLoading: boolean;
    /** 连接错误信息 */
    connectionError?: string | null;
    /** 主题 */
    theme?: Theme;
    /** 是否显示智能体信息 */
    showAgentInfo?: boolean;
    /** 是否启用文件上传 */
    isEnableFile?: boolean;
    /** 是否启用知识库选择 */
    input_isEnableKnowledge?: boolean;
    /** 自定义占位符 */
    placeholder?: string;
    /** 是否显示 Token 进度条 */
    showTokensBar?: boolean;
    /** 当前智能体名称（用于 TokensBar） */
    currentAgentName?: string;
    /** 各智能体的 token 数量 */
    agentTokens?: Record<string, number>;
    /** 输入容器水平对齐 */
    horizontalAlignment?: HorizontalAlignment;
    /** 输入区域边距 */
    margin?: string;
    /** 输入框宽度 */
    inputWidth?: string;
    /** 外部传入的智能体数据（跳过 API 请求） */
    inputAgentsData?: ExtraAgentData[];
    /** 用户绑定的默认智能体名称 */
    boundAgent?: string | null;
    /** 用户绑定的默认智能体类型 */
    boundAgentType?: 'agent' | 'group';
    /** 发送消息事件 */
    onSend?: (message: string, documents: DocumentInfo[], mention?: {
        type: 'agent' | 'group';
        name: string;
    }, knowledgeIds?: string[]) => void;
    /** 终止事件 */
    onTerminate?: () => void;
}

/**
 * Turn 回合中的步骤
 */
export declare interface InternalStep {
    type: StepType;
    msg: HistoryMessage;
    tool?: ToolCallInfo;
}

/**
 * 知识库组
 */
export declare interface KnowledgeGroup {
    group_id: string;
    group_name: string;
    description?: string;
    workspace?: string;
    doc_count?: number;
    created_at?: string;
}

/**
 * 登录请求
 */
export declare interface LoginRequest {
    username: string;
    password: string;
}

/**
 * 登录响应
 */
export declare interface LoginResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export declare const markStreamDone: ActionCreatorWithPayload<    {
agent?: string;
}, "chat/markStreamDone">;

export declare const MessageBubble: default_2.FC<MessageBubbleProps>;

/**
 * 单条消息气泡组件
 * 用于独立展示单条消息（备用组件）
 */
export declare interface MessageBubbleProps {
    /** 消息对象 */
    message: HistoryMessage;
    /** 是否展示工具调用 */
    showToolCalls: boolean;
    /** 是否选中 */
    selected?: boolean;
    /** 发送者名称 */
    senderName: string;
    /** 点击事件 */
    onSelect?: () => void;
}

/** 消息角色枚举 */
export declare const MessageRoles: {
    readonly SYSTEM: "system";
    readonly USER: "user";
    readonly ASSISTANT: "assistant";
    readonly TOOL_RESULT: "tool_result";
    readonly COMMAND: "command";
    readonly ERROR: "error";
    readonly OPTION: "option";
    readonly ASK_USER: "AskUser";
    readonly USER_ANSWER: "UserAnswer";
    readonly ASK_AGENT: "AskAgent";
    readonly TIMER: "timer";
};

/**
 * 消息分页响应
 */
export declare interface MessagesResponse {
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

export declare const prependMessages: ActionCreatorWithPayload<    {
agent: string;
messages: HistoryMessage[];
hasMore: boolean;
}, "chat/prependMessages">;

export declare const RapTimelineChatLayout: default_2.ForwardRefExoticComponent<RapTimelineChatLayoutProps & default_2.RefAttributes<RapTimelineChatLayoutRef>>;

/**
 * RapTimeline 聊天布局
 * 混合布局：流式时动态文字预览 + 折叠卡片，展开后完整时间线
 */
export declare interface RapTimelineChatLayoutProps {
    theme?: Theme;
    showAgentInfo?: boolean;
    isEnableFile?: boolean;
    input_isEnableKnowledge?: boolean;
    placeholder?: string;
    defaultQuerys?: string[];
    showTokensBar?: boolean;
    isUserDefaultAvatar?: boolean;
    inputAreaHorizontalAlignment?: HorizontalAlignment;
    inputAreaMargin?: string;
    inputWidth?: string;
    inputAgentsData?: ExtraAgentData[];
    /** 智能体分组列表，用于判断 agent/group 类型 */
    groups?: AgentGroup[];
    /** 是否自动连接 WebSocket，设为 false 时需要手动调用 ref.connect() 连接 */
    autoConnect?: boolean;
}

export declare interface RapTimelineChatLayoutRef {
    newSession: () => Promise<void>;
    changeSession: (sessionId: string) => Promise<void>;
    /** 手动连接 WebSocket，支持指定会话 ID 和跳过历史加载 */
    connect: (sessionId?: string, options?: {
        skipHistory?: boolean;
    }) => Promise<void>;
    /** 手动断开 WebSocket 连接 */
    disconnect: () => void;
}

export declare const RapTimelineMessageList: default_2.ForwardRefExoticComponent<RapTimelineMessageListProps & default_2.RefAttributes<RapTimelineMessageListRef>>;

export declare interface RapTimelineMessageListProps {
    messages: Record<string, HistoryMessage[]>;
    currentAgent: string;
    isGroupChat: boolean;
    showToolCallLog: boolean;
    isLoading: boolean;
    entryAgent?: string;
    groups?: AgentGroup[];
    theme?: Theme;
    defaultQuerys?: string[];
    isUserDefaultAvatar?: boolean;
    /** 用户显示名（用于头像，取前2个字符） */
    userDisplayName?: string;
    onSelectQuery?: (query: string) => void;
    onLoadMore?: () => void;
    hasMore?: boolean;
    isLoadingMore?: boolean;
    children?: default_2.ReactNode;
}

export declare interface RapTimelineMessageListRef {
    scrollToBottom: () => void;
}

/**
 * 将 Markdown 文本渲染为安全的 HTML 字符串
 */
export declare function renderMarkdown(text: string): string;

export declare const resetChat: ActionCreatorWithoutPayload<"chat/resetChat">;

export declare type RootState = {
    chat: ReturnType<typeof _default>;
    user: ReturnType<typeof _default_2>;
};

/** 运行智能体类型 */
export declare const RunAgentTypes: {
    readonly AGENT: "agent";
    readonly GROUP: "group";
};

export declare const SampleChatLayout: default_2.ForwardRefExoticComponent<SampleChatLayoutProps & default_2.RefAttributes<SampleChatLayoutRef>>;

/**
 * Sample 聊天布局
 * 精简版布局：流式时显示思考活动卡片
 */
export declare interface SampleChatLayoutProps {
    theme?: Theme;
    showAgentInfo?: boolean;
    isEnableFile?: boolean;
    input_isEnableKnowledge?: boolean;
    placeholder?: string;
    defaultQuerys?: string[];
    showTokensBar?: boolean;
    isUserDefaultAvatar?: boolean;
    activityMaxEntries?: number;
    inputAreaHorizontalAlignment?: HorizontalAlignment;
    inputAreaMargin?: string;
    inputWidth?: string;
    inputAgentsData?: ExtraAgentData[];
    /** 智能体分组列表，用于判断 agent/group 类型 */
    groups?: AgentGroup[];
    /** 是否自动连接 WebSocket，设为 false 时需要手动调用 ref.connect() 连接 */
    autoConnect?: boolean;
}

export declare interface SampleChatLayoutRef {
    newSession: () => Promise<void>;
    changeSession: (sessionId: string) => Promise<void>;
    /** 手动连接 WebSocket，支持指定会话 ID 和跳过历史加载 */
    connect: (sessionId?: string, options?: {
        skipHistory?: boolean;
    }) => Promise<void>;
    /** 手动断开 WebSocket 连接 */
    disconnect: () => void;
}

export declare const SampleMessageList: default_2.ForwardRefExoticComponent<SampleMessageListProps & default_2.RefAttributes<SampleMessageListRef>>;

/**
 * Sample 消息列表组件
 * 精简版布局：流式时显示可折叠活动卡片（思考中...），完成后只显示正文
 * 完全对齐 Vue 版 MessageList.vue 的 HTML 结构和 CSS 类名
 */
export declare interface SampleMessageListProps {
    /** 按智能体分组的消息记录 */
    messages: Record<string, HistoryMessage[]>;
    /** 当前选中的智能体名称 */
    currentAgent: string;
    /** 是否为群聊模式 */
    isGroupChat: boolean;
    /** 是否展示工具调用日志 */
    showToolCallLog: boolean;
    /** 是否正在等待 AI 回复 */
    isLoading: boolean;
    /** 入口智能体名称 */
    entryAgent?: string;
    /** 智能体分组列表 */
    groups?: AgentGroup[];
    /** 主题模式 */
    theme?: Theme;
    /** 思考中...区域最大显示条数 */
    activityMaxEntries?: number;
    /** 默认查询列表（消息为空时显示） */
    defaultQuerys?: string[];
    /** 用户是否使用默认头像（true 时显示通用图标，false 时显示用户名前2字符） */
    isUserDefaultAvatar?: boolean;
    /** 用户显示名称（头像非默认时显示前2字符） */
    userDisplayName?: string;
    /** 选择默认查询回调 */
    onSelectQuery?: (query: string) => void;
    /** 加载更多回调 */
    onLoadMore?: () => void;
    /** 是否有更多消息 */
    hasMore?: boolean;
    /** 是否正在加载更多 */
    isLoadingMore?: boolean;
    /** Sticky Header 插槽内容 */
    children?: default_2.ReactNode;
}

export declare interface SampleMessageListRef {
    scrollToBottom: () => void;
}

export declare const selectAgents: (state: {
    chat: ChatState;
}) => Agent[];

export declare const selectAgentTokens: (state: {
    chat: ChatState;
}) => Record<string, number>;

export declare const selectAuthErrorCode: (state: {
    chat: ChatState;
}) => AuthErrorCode | null;

export declare const selectConnectionError: (state: {
    chat: ChatState;
}) => string | null;

export declare const selectCurrentAgent: (state: {
    chat: ChatState;
}) => string;

export declare const selectHasMoreMessages: (state: {
    chat: ChatState;
}) => Record<string, boolean>;

export declare const selectIsAdmin: (state: {
    user: UserState;
}) => boolean;

export declare const selectIsAuthenticated: (state: {
    chat: ChatState;
}) => boolean;

export declare const selectIsChatLoading: (state: {
    chat: ChatState;
}) => boolean;

export declare const selectIsConnected: (state: {
    chat: ChatState;
}) => boolean;

export declare const selectIsLoadingMore: (state: {
    chat: ChatState;
}) => boolean;

export declare const selectIsLoggedIn: (state: {
    user: UserState;
}) => boolean;

export declare const selectIsTenant: (state: {
    user: UserState;
}) => boolean;

export declare const selectMessages: (state: {
    chat: ChatState;
}) => Record<string, HistoryMessage[]>;

export declare const selectSessionId: (state: {
    chat: ChatState;
}) => string | null;

export declare const selectShowToolCallLog: (state: {
    chat: ChatState;
}) => boolean;

export declare const selectToken: (state: {
    user: UserState;
}) => string | null;

export declare const selectUser: (state: {
    user: UserState;
}) => User | null;

export declare const selectUserLoading: (state: {
    user: UserState;
}) => boolean;

/**
 * 消息发送参数
 */
export declare interface SendMessagePayload {
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
 * 会话概览
 */
export declare interface SessionOverview {
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

export declare const setAgents: ActionCreatorWithPayload<Agent[], "chat/setAgents">;

export declare const setAuthenticated: ActionCreatorWithPayload<boolean, "chat/setAuthenticated">;

export declare const setAuthErrorCode: ActionCreatorWithPayload<AuthErrorCode | null, "chat/setAuthErrorCode">;

export declare const setConnected: ActionCreatorWithPayload<boolean, "chat/setConnected">;

export declare const setConnectionError: ActionCreatorWithPayload<string | null, "chat/setConnectionError">;

export declare const setCurrentAgent: ActionCreatorWithPayload<string, "chat/setCurrentAgent">;

export declare const setHasMore: ActionCreatorWithPayload<    {
agent: string;
hasMore: boolean;
}, "chat/setHasMore">;

export declare const setLoading: ActionCreatorWithPayload<boolean, "chat/setLoading">;

export declare const setLoadingMore: ActionCreatorWithPayload<boolean, "chat/setLoadingMore">;

export declare const setMessages: ActionCreatorWithPayload<    {
agent: string;
messages: HistoryMessage[];
}, "chat/setMessages">;

export declare const setSessionId: ActionCreatorWithPayload<string | null, "chat/setSessionId">;

export declare const setShowToolCallLog: ActionCreatorWithPayload<boolean, "chat/setShowToolCallLog">;

/** 设置 Token */
export declare function setToken(token: string): void;

export declare const setTokenAction: ActionCreatorWithPayload<string | null, "user/setTokenAction">;

/** 设置 Token 过期回调 */
export declare function setTokenExpiredCallback(cb: (code: number, message: string) => void): void;

export declare function setTransportStore(s: any): void;

export declare const setUser: ActionCreatorWithPayload<User | null, "user/setUser">;

/**
 * 通用工具函数
 */
/**
 * 延迟指定毫秒
 */
export declare function sleep(ms: number): Promise<void>;

/** 特殊事件数据 */
export declare interface SpecialEventData {
    name: string;
    data: any;
}

/** A2UI 特殊事件名称 */
export declare const SpecialEventNames: {
    readonly CREATE_SURFACE: "createSurface";
    readonly UPDATE_COMPONENTS: "updateComponents";
    readonly UPDATE_DATA_MODEL: "updateDataModel";
    readonly DELETE_SURFACE: "deleteSurface";
};

/**
 * Turn 回合中的步骤类型
 */
export declare type StepType = 'ask' | 'askUser' | 'reason' | 'tool' | 'step' | 'content';

/** 默认 Store 实例 */
export declare const store: EnhancedStore<any, UnknownAction, Tuple<[StoreEnhancer<    {
dispatch: ThunkDispatch<any, undefined, UnknownAction>;
}>, StoreEnhancer]>>;

/**
 * 租户登录请求
 */
export declare interface TenantLoginRequest {
    tenantId?: string;
    agent?: string;
    agentType?: 'agent' | 'group';
}

/**
 * 主题类型
 */
export declare type Theme = 'dark' | 'light';

export declare const TimelineChatLayout: default_2.ForwardRefExoticComponent<TimelineChatLayoutProps & default_2.RefAttributes<TimelineChatLayoutRef>>;

/**
 * 时间线聊天布局
 * 使用完整时间线 MessageList + InputArea
 */
export declare interface TimelineChatLayoutProps {
    theme?: Theme;
    showAgentInfo?: boolean;
    isEnableFile?: boolean;
    input_isEnableKnowledge?: boolean;
    placeholder?: string;
    defaultQuerys?: string[];
    showTokensBar?: boolean;
    isUserDefaultAvatar?: boolean;
    inputAreaHorizontalAlignment?: HorizontalAlignment;
    inputAreaMargin?: string;
    inputWidth?: string;
    inputAgentsData?: ExtraAgentData[];
    /** 智能体分组列表，用于判断 agent/group 类型 */
    groups?: AgentGroup[];
    /** 是否自动连接 WebSocket，设为 false 时需要手动调用 ref.connect() 连接 */
    autoConnect?: boolean;
}

export declare interface TimelineChatLayoutRef {
    newSession: () => Promise<void>;
    changeSession: (sessionId: string) => Promise<void>;
    /** 手动连接 WebSocket，支持指定会话 ID 和跳过历史加载 */
    connect: (sessionId?: string, options?: {
        skipHistory?: boolean;
    }) => Promise<void>;
    /** 手动断开 WebSocket 连接 */
    disconnect: () => void;
}

export declare const TimelineMessageList: default_2.ForwardRefExoticComponent<TimelineMessageListProps & default_2.RefAttributes<TimelineMessageListRef>>;

/**
 * 时间线消息列表组件
 * 完整的 Turn-based 时间线布局，支持工具调用卡片和思考过程展示
 * HTML 结构和 CSS 类名与 Vue 版完全一致
 */
export declare interface TimelineMessageListProps {
    /** 按智能体分组的消息 */
    messages: Record<string, HistoryMessage[]>;
    /** 当前智能体名称 */
    currentAgent: string;
    /** 是否为群聊模式 */
    isGroupChat: boolean;
    /** 是否展示工具调用日志 */
    showToolCallLog: boolean;
    /** 是否正在等待 AI 回复 */
    isLoading: boolean;
    /** 入口智能体名称 */
    entryAgent?: string;
    /** 智能体分组列表 */
    groups?: AgentGroup[];
    /** 主题 */
    theme?: Theme;
    /** 默认查询卡片（空消息时显示） */
    defaultQuerys?: string[];
    /** 是否使用默认用户头像 */
    isUserDefaultAvatar?: boolean;
    /** 用户显示名称（头像区域显示，建议取用户名前2字符） */
    userDisplayName?: string;
    /** 选择默认查询 */
    onSelectQuery?: (query: string) => void;
    /** 加载更多消息 */
    onLoadMore?: () => void;
    /** 是否有更多消息 */
    hasMore?: boolean;
    /** 是否正在加载更多 */
    isLoadingMore?: boolean;
    /** 顶部吸顶区域 */
    children?: default_2.ReactNode;
}

export declare interface TimelineMessageListRef {
    scrollToBottom: () => void;
}

export declare const TokensBar: default_2.FC<TokensBarProps>;

/**
 * Token 使用量进度条组件
 * 显示智能体的上下文窗口使用情况
 * HTML 结构和样式完全对齐 Vue 版 TokensBar.vue
 */
export declare interface TokensBarProps {
    /** 智能体名称 */
    agentName: string;
    /** 当前 token 数量 */
    tokens: number;
    /** 最大 token 数量 */
    maxTokens?: number;
}

/**
 * Token 存储配置
 */
export declare interface TokenStorageConfig {
    /** Token 值（非 key） */
    token?: string;
    /** localStorage 中 token 的 key */
    tokenKey?: string;
    /** localStorage 中用户信息的 key */
    userInfoKey?: string;
}

/**
 * 工具调用信息
 */
export declare interface ToolCallInfo {
    toolName: string;
    args: string;
    status: 'pending' | 'success' | 'failed';
    result?: string;
    error?: string;
    timestamp?: number;
}

/**
 * WebSocket 传输层管理 Hook
 * 封装 WebSocket 连接、认证、消息收发逻辑
 */
/** transportRef 对外暴露的最小类型，避免公共类型声明依赖 @xyxandwxx/transport 的内部类型 */
declare interface TransportLike {
    request<T = any>(method: string, params: any[]): Promise<T>;
}

/**
 * Turn 对话回合
 */
export declare interface Turn {
    /** 用户消息 */
    userMsg: HistoryMessage | null;
    /** 所有步骤（按时间顺序） */
    steps: InternalStep[];
}

export declare const updateAgentTokens: ActionCreatorWithPayload<    {
agent: string;
tokens: number;
}, "chat/updateAgentTokens">;

export declare function useChatTransport(): {
    connect: (sessionId?: string, options?: {
        skipHistory?: boolean;
    }) => Promise<void>;
    disconnect: () => void;
    sendMessage: (content: string, documents?: any[], targetAgent?: {
        name: string;
        type?: string;
    }, knowledgeIds?: string[]) => Promise<void>;
    newSession: () => Promise<void>;
    changeSession: (sessionId: string) => Promise<void>;
    terminateSession: () => Promise<void>;
    loadMoreMessages: (agent?: string) => Promise<void>;
    fetchSessionOverview: (sessionId: string) => Promise<void>;
    onSpecialEvent: (eventName: string, callback: (data: any) => void) => () => void;
    onSessionSwitch: (callback: (reason: string) => void) => () => void;
    setOnTokenExpired: (callback: (code: number, message: string) => void) => void;
    transportRef: {
        current: TransportLike | null;
    };
};

/**
 * 用户信息
 */
export declare interface User {
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

export declare interface UserState {
    /** 当前用户信息 */
    user: User | null;
    /** 访问令牌 */
    token: string | null;
    /** 是否加载中 */
    isLoading: boolean;
}

/**
 * 将消息分组为 Turn 回合
 * 每个 Turn 包含一条用户消息和后续的 AI 步骤
 * @param messages 按智能体分组的消息
 * @param currentAgent 当前智能体名称
 * @param isGroupChat 是否为群聊模式
 * @param options 额外选项（entryAgent / groups）
 */
export declare function useTurns(messages: Record<string, HistoryMessage[]>, currentAgent: string, isGroupChat: boolean, options?: UseTurnsOptions): Turn[];

/** useTurns 额外选项 */
declare interface UseTurnsOptions {
    /** 入口智能体名称（currentAgent 为 'entry-agent' 时解析为实际名称） */
    entryAgent?: string;
    /** 智能体分组列表（currentAgent 命中组名时合并组员消息） */
    groups?: AgentGroup[];
}

/**
 * WebSocket 配置
 */
export declare interface WebSocketConfig {
    /** WebSocket 主机地址 */
    host?: string;
    /** WebSocket 端口 */
    port?: number;
    /** WebSocket 路径 */
    path?: string;
    /** 重连延迟（毫秒） */
    reconnectDelay?: number;
}

export { }
