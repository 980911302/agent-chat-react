import { createSlice, type PayloadAction, type Draft } from '@reduxjs/toolkit';
import type { HistoryMessage, Agent, ToolCallInfo, SessionOverview } from '../types';
import { MessageRoles } from '../constants/events';
import { generateId } from '../utils';

/**
 * 聊天状态管理
 * 负责 WebSocket 消息收发、会话管理、流式消息处理
 */

/** 认证错误码 —— 与 Vue 版对齐 */
export type AuthErrorCode = 'TOKEN_EXPIRED' | 'TOKEN_INVALID' | 'TOKEN_MISSING' | 'AUTH_FAILED' | 'USER_NOT_FOUND' | 'SESSION_ERROR' | 'SERVICE_ERROR';

export interface ChatState {
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

const initialState: ChatState = {
  messages: { main: [] },
  isConnected: false,
  isLoading: false,
  connectionError: null,
  authErrorCode: null,
  currentAgent: 'main',
  sessionId: null,
  agents: [],
  agentTokens: {},
  showToolCallLog: true,
  hasMoreMessages: { main: false },
  isLoadingMore: false,
  isAuthenticated: false,
  sessionOverview: null,
  sessionOverviewLoading: false,
};

// ---- 辅助函数 ----

/** 确保消息分组存在 */
function ensureGroup(state: Draft<ChatState>, agent: string) {
  if (!state.messages[agent]) {
    state.messages[agent] = [];
  }
  if (!(agent in state.hasMoreMessages)) {
    state.hasMoreMessages[agent] = false;
  }
}

/** 获取指定智能体的最后一条助手消息 */
function getLastAssistantMessage(
  messages: Record<string, HistoryMessage[]>,
  agent: string
): HistoryMessage | undefined {
  const group = messages[agent];
  if (!group) return undefined;
  for (let i = group.length - 1; i >= 0; i--) {
    if (group[i].role === MessageRoles.ASSISTANT) {
      return group[i];
    }
  }
  return undefined;
}

/** 按消息 id 查找指定智能体的消息（从后往前找，流式消息通常在末尾） */
function getMessageById(
  messages: Record<string, HistoryMessage[]>,
  agent: string,
  id: string
): HistoryMessage | undefined {
  const group = messages[agent];
  if (!group) return undefined;
  for (let i = group.length - 1; i >= 0; i--) {
    if (group[i].id === id) {
      return group[i];
    }
  }
  return undefined;
}

/** 可挂载工具调用的消息角色 —— 与 Vue 版 toolCallBefore 的查找范围对齐 */
const TOOL_CALL_HOST_ROLES: string[] = [
  MessageRoles.ASSISTANT,
  MessageRoles.TOOL_RESULT,
  MessageRoles.COMMAND,
  MessageRoles.OPTION,
];

/** 从后往前查找可挂载工具调用的消息 */
function getLastToolCallHostMessage(
  messages: Record<string, HistoryMessage[]>,
  agent: string
): HistoryMessage | undefined {
  const group = messages[agent];
  if (!group) return undefined;
  for (let i = group.length - 1; i >= 0; i--) {
    if (TOOL_CALL_HOST_ROLES.includes(group[i].role)) {
      return group[i];
    }
  }
  return undefined;
}

/** 从后往前查找匹配的 pending 工具调用 */
function findPendingToolCall(
  messages: Record<string, HistoryMessage[]>,
  agent: string,
  toolName: string
): Draft<ToolCallInfo> | undefined {
  const group = messages[agent];
  if (!group) return undefined;
  for (let i = group.length - 1; i >= 0; i--) {
    const msg = group[i];
    if (TOOL_CALL_HOST_ROLES.includes(msg.role) && msg.toolCalls) {
      const toolCall = msg.toolCalls.find(
        (tc) => tc.toolName === toolName && tc.status === 'pending'
      );
      if (toolCall) return toolCall as Draft<ToolCallInfo>;
    }
  }
  return undefined;
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // ---- 连接状态 ----
    setConnected(state, action: PayloadAction<boolean>) {
      state.isConnected = action.payload;
    },
    setConnectionError(state, action: PayloadAction<string | null>) {
      state.connectionError = action.payload;
    },
    setAuthenticated(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
    },
    setAuthErrorCode(state, action: PayloadAction<AuthErrorCode | null>) {
      state.authErrorCode = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },

    // ---- 会话管理 ----
    setSessionId(state, action: PayloadAction<string | null>) {
      state.sessionId = action.payload;
    },
    setCurrentAgent(state, action: PayloadAction<string>) {
      state.currentAgent = action.payload;
    },
    setAgents(state, action: PayloadAction<Agent[]>) {
      state.agents = action.payload;
    },
    /** 添加新的智能体（按 name 去重）—— 与 Vue 版 addAgent 对齐 */
    addAgent(state, action: PayloadAction<Agent>) {
      if (!state.agents.find((a) => a.name === action.payload.name)) {
        state.agents.push(action.payload);
      }
    },
    /** 批量设置智能体 token 数量（加载历史时初始化） */
    setAgentTokens(state, action: PayloadAction<Record<string, number>>) {
      state.agentTokens = action.payload;
    },
    setShowToolCallLog(state, action: PayloadAction<boolean>) {
      state.showToolCallLog = action.payload;
    },

    // ---- 消息管理 ----

    /** 添加消息到指定分组 */
    addMessage(state, action: PayloadAction<{ agent: string; message: HistoryMessage }>) {
      const { agent, message } = action.payload;
      ensureGroup(state, agent);
      state.messages[agent].push(message);
    },

    /** 添加用户消息（自动创建 ID 和时间戳） */
    addUserMessage(state, action: PayloadAction<{ content: string; documents?: any[]; agent?: string }>) {
      const agent = action.payload.agent || state.currentAgent;
      ensureGroup(state, agent);
      state.messages[agent].push({
        id: generateId(),
        role: MessageRoles.USER,
        content: action.payload.content,
        timestamp: Date.now(),
        documents: action.payload.documents,
      });
    },

    /** 设置整个消息列表（用于加载历史） */
    setMessages(state, action: PayloadAction<{ agent: string; messages: HistoryMessage[] }>) {
      const { agent, messages } = action.payload;
      ensureGroup(state, agent);
      state.messages[agent] = messages as Draft<HistoryMessage>[];
    },

    /** 追加历史消息到列表头部（分页加载） */
    prependMessages(state, action: PayloadAction<{ agent: string; messages: HistoryMessage[]; hasMore: boolean }>) {
      const { agent, messages, hasMore } = action.payload;
      ensureGroup(state, agent);
      state.messages[agent] = [...(messages as Draft<HistoryMessage>[]), ...state.messages[agent]];
      state.hasMoreMessages[agent] = hasMore;
    },

    /** 设置是否有更多消息 */
    setHasMore(state, action: PayloadAction<{ agent: string; hasMore: boolean }>) {
      state.hasMoreMessages[action.payload.agent] = action.payload.hasMore;
    },

    /** 设置加载更多状态 */
    setLoadingMore(state, action: PayloadAction<boolean>) {
      state.isLoadingMore = action.payload;
    },

    /** 清空所有消息 */
    clearMessages(state) {
      state.messages = { main: [] };
      state.hasMoreMessages = { main: false };
      state.agentTokens = {};
      state.agents = [];
    },

    // ---- 流式消息处理 ----

    /**
     * 创建流式 assistant 消息（content 为空，isStreaming=true）
     * 用于流开始时提前占位，后续通过 appendContentById 追加内容
     */
    startAssistantMessage(state, action: PayloadAction<{ agent: string; id: string }>) {
      const { agent, id } = action.payload;
      ensureGroup(state, agent);
      state.messages[agent].push({
        id,
        role: MessageRoles.ASSISTANT,
        content: '',
        agent,
        timestamp: Date.now(),
        isStreaming: true,
      });
    },

    /**
     * 按消息 id 追加流式内容
     * 思考消息和内容消息是两条独立消息，必须按 id 定位，避免互相污染
     */
    appendContentById(state, action: PayloadAction<{ agent: string; id: string; content: string }>) {
      const { agent, id, content } = action.payload;
      const msg = getMessageById(state.messages, agent, id);
      if (msg) {
        msg.content += content;
      }
    },

    /** 按消息 id 追加流式推理内容 */
    appendReasonContentById(state, action: PayloadAction<{ agent: string; id: string; content: string }>) {
      const { agent, id, content } = action.payload;
      const msg = getMessageById(state.messages, agent, id);
      if (msg) {
        msg.reasonContent = (msg.reasonContent || '') + content;
      }
    },

    /** 按消息 id 结束流式状态 */
    markStreamDoneById(state, action: PayloadAction<{ agent: string; id: string }>) {
      const { agent, id } = action.payload;
      const msg = getMessageById(state.messages, agent, id);
      if (msg) {
        msg.isStreaming = false;
      }
    },

    /** 追加流式内容到最后一条助手消息（向后兼容，推荐使用 appendContentById） */
    appendStreamContent(state, action: PayloadAction<{ agent: string; content: string }>) {
      const { agent, content } = action.payload;
      const lastMsg = getLastAssistantMessage(state.messages, agent);
      if (lastMsg) {
        lastMsg.content += content;
        lastMsg.isStreaming = true;
      }
    },

    /** 追加流式推理内容 */
    appendStreamReasonContent(state, action: PayloadAction<{ agent: string; content: string }>) {
      const { agent, content } = action.payload;
      const lastMsg = getLastAssistantMessage(state.messages, agent);
      if (lastMsg) {
        lastMsg.reasonContent = (lastMsg.reasonContent || '') + content;
        lastMsg.isStreaming = true;
      }
    },

    /** 标记流式消息完成 */
    markStreamDone(state, action: PayloadAction<{ agent?: string }>) {
      if (action.payload.agent) {
        const lastMsg = getLastAssistantMessage(state.messages, action.payload.agent);
        if (lastMsg) {
          lastMsg.isStreaming = false;
        }
      } else {
        // 全部完成
        for (const agent of Object.keys(state.messages)) {
          const lastMsg = getLastAssistantMessage(state.messages, agent);
          if (lastMsg) {
            lastMsg.isStreaming = false;
          }
        }
        state.isLoading = false;
      }
    },

    // ---- 工具调用 ----

    /**
     * 添加工具调用开始 —— 与 Vue 版 toolCallBefore 对齐
     * 从后往前找最后一条 assistant/tool_result/command/option 消息挂载；
     * 找不到时新建一条 content 为空的 assistant 消息承载工具调用
     */
    addToolCallStart(state, action: PayloadAction<{ agent: string; toolName: string; args: string }>) {
      const { agent, toolName, args } = action.payload;
      ensureGroup(state, agent);
      const toolCall: ToolCallInfo = {
        toolName,
        args,
        status: 'pending',
        timestamp: Date.now(),
      };
      const hostMsg = getLastToolCallHostMessage(state.messages, agent);
      if (hostMsg) {
        if (!hostMsg.toolCalls) {
          hostMsg.toolCalls = [];
        }
        hostMsg.toolCalls.push(toolCall);
      } else {
        // 没有可挂载的消息时，新建一条 assistant 消息承载工具调用
        state.messages[agent].push({
          id: generateId(),
          role: MessageRoles.ASSISTANT,
          content: '',
          agent,
          timestamp: Date.now(),
          isStreaming: false,
          toolCalls: [toolCall],
        });
      }
    },

    /** 工具调用成功（从后往前查找匹配的 pending 调用） */
    addToolCallSuccess(state, action: PayloadAction<{ agent: string; toolName: string; result?: string }>) {
      const { agent, toolName, result } = action.payload;
      const pending = findPendingToolCall(state.messages, agent, toolName);
      if (pending) {
        pending.status = 'success';
        pending.result = result;
      }
    },

    /** 工具调用失败（从后往前查找匹配的 pending 调用） */
    addToolCallFailed(state, action: PayloadAction<{ agent: string; toolName: string; error?: string }>) {
      const { agent, toolName, error } = action.payload;
      const pending = findPendingToolCall(state.messages, agent, toolName);
      if (pending) {
        pending.status = 'failed';
        pending.error = error;
      }
    },

    // ---- 智能体 Token ----

    /** 更新智能体 token 数量 */
    updateAgentTokens(state, action: PayloadAction<{ agent: string; tokens: number }>) {
      state.agentTokens[action.payload.agent] = action.payload.tokens;
    },

    // ---- 会话概览 ----

    /** 设置会话概览数据（传 null 表示清空） */
    setSessionOverview(state, action: PayloadAction<SessionOverview | null>) {
      state.sessionOverview = action.payload as Draft<SessionOverview> | null;
    },

    /** 设置会话概览加载状态 */
    setSessionOverviewLoading(state, action: PayloadAction<boolean>) {
      state.sessionOverviewLoading = action.payload;
    },

    // ---- 完整重置 ----
    resetChat() {
      return initialState;
    },
  },
});

export const {
  setConnected,
  setConnectionError,
  setAuthenticated,
  setAuthErrorCode,
  setLoading,
  setSessionId,
  setCurrentAgent,
  setAgents,
  addAgent,
  setAgentTokens,
  setShowToolCallLog,
  addMessage,
  addUserMessage,
  setMessages,
  prependMessages,
  setHasMore,
  setLoadingMore,
  clearMessages,
  startAssistantMessage,
  appendContentById,
  appendReasonContentById,
  markStreamDoneById,
  appendStreamContent,
  appendStreamReasonContent,
  markStreamDone,
  addToolCallStart,
  addToolCallSuccess,
  addToolCallFailed,
  updateAgentTokens,
  setSessionOverview,
  setSessionOverviewLoading,
  resetChat,
} = chatSlice.actions;

export default chatSlice.reducer;

// ---- 选择器 ----

export const selectMessages = (state: { chat: ChatState }) => state.chat.messages;
export const selectIsConnected = (state: { chat: ChatState }) => state.chat.isConnected;
export const selectIsChatLoading = (state: { chat: ChatState }) => state.chat.isLoading;
export const selectConnectionError = (state: { chat: ChatState }) => state.chat.connectionError;
export const selectCurrentAgent = (state: { chat: ChatState }) => state.chat.currentAgent;
export const selectSessionId = (state: { chat: ChatState }) => state.chat.sessionId;
export const selectAgents = (state: { chat: ChatState }) => state.chat.agents;
export const selectAgentTokens = (state: { chat: ChatState }) => state.chat.agentTokens;
export const selectShowToolCallLog = (state: { chat: ChatState }) => state.chat.showToolCallLog;
export const selectHasMoreMessages = (state: { chat: ChatState }) => state.chat.hasMoreMessages;
export const selectIsLoadingMore = (state: { chat: ChatState }) => state.chat.isLoadingMore;
export const selectIsAuthenticated = (state: { chat: ChatState }) => state.chat.isAuthenticated;
export const selectAuthErrorCode = (state: { chat: ChatState }) => state.chat.authErrorCode;
export const selectSessionOverview = (state: { chat: ChatState }) => state.chat.sessionOverview;
export const selectSessionOverviewLoading = (state: { chat: ChatState }) => state.chat.sessionOverviewLoading;
