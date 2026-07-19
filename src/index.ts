/**
 * @xyxandwxx/agent-chat — React 版 Agent Chat UI 组件库
 * 
 * 入口文件：导出所有组件、配置、Store、工具函数
 */

import './styles/global.css';

// ---- 布局组件 ----
export { TimelineChatLayout } from './layout/TimelineChatLayout';
export type { TimelineChatLayoutProps, TimelineChatLayoutRef } from './layout/TimelineChatLayout';

export { SampleChatLayout } from './layout/SampleChatLayout';
export type { SampleChatLayoutProps, SampleChatLayoutRef } from './layout/SampleChatLayout';

export { RapTimelineChatLayout } from './layout/RapTimelineChatLayout';
export type { RapTimelineChatLayoutProps, RapTimelineChatLayoutRef } from './layout/RapTimelineChatLayout';

export { A2UIChatLayout } from './layout/A2UIChatLayout';
export type { A2UIChatLayoutProps, A2UIChatLayoutRef } from './layout/A2UIChatLayout';

// ---- 基础组件 ----
export { AgentAvatar } from './components/avatars/AgentAvatar';
export type { AgentAvatarProps } from './components/avatars/AgentAvatar';

export { TokensBar } from './components/common/TokensBar';
export type { TokensBarProps } from './components/common/TokensBar';

export { InputArea } from './components/inputs/InputArea';
export type { InputAreaProps } from './components/inputs/InputArea';

export { MessageBubble } from './components/messages/timeline/MessageBubble';
export type { MessageBubbleProps } from './components/messages/timeline/MessageBubble';

// ---- MessageList 组件 ----
export { TimelineMessageList } from './components/messages/timeline/MessageList';
export type { TimelineMessageListProps, TimelineMessageListRef } from './components/messages/timeline/MessageList';

export { SampleMessageList } from './components/messages/sample/MessageList';
export type { SampleMessageListProps, SampleMessageListRef } from './components/messages/sample/MessageList';

export { RapTimelineMessageList } from './components/messages/rap_timeline/MessageList';
export type { RapTimelineMessageListProps, RapTimelineMessageListRef } from './components/messages/rap_timeline/MessageList';

export { A2UIMessageList } from './components/messages/a2ui/MessageList';
export type { A2UIMessageListProps, A2UIMessageListRef } from './components/messages/a2ui/MessageList';

// ---- 配置 ----
export {
  initAgentChatConfig,
  getConfig,
  getWebSocketConfig,
  getTokenStorageConfig,
  setToken,
  clearToken,
  getToken,
  getApiInstance,
  setTokenExpiredCallback,
} from './config';

// ---- Store ----
export { store, createAgentChatStore } from './store';
export type { RootState, AppDispatch, AgentChatStore } from './store';

export {
  // Chat Slice
  setConnected,
  setConnectionError,
  setAuthenticated,
  setAuthErrorCode,
  setLoading,
  setSessionId,
  setCurrentAgent,
  setAgents,
  setShowToolCallLog,
  addMessage,
  addUserMessage,
  setMessages,
  prependMessages,
  setHasMore,
  setLoadingMore,
  clearMessages,
  appendStreamContent,
  appendStreamReasonContent,
  markStreamDone,
  addToolCallStart,
  addToolCallSuccess,
  addToolCallFailed,
  updateAgentTokens,
  resetChat,
  // Chat 选择器
  selectMessages,
  selectIsConnected,
  selectIsChatLoading,
  selectConnectionError,
  selectCurrentAgent,
  selectSessionId,
  selectAgents,
  selectAgentTokens,
  selectShowToolCallLog,
  selectHasMoreMessages,
  selectIsLoadingMore,
  selectIsAuthenticated,
  selectAuthErrorCode,
} from './store/chatSlice';
export type { ChatState, AuthErrorCode } from './store/chatSlice';

export {
  // User Slice
  setUser,
  setTokenAction,
  clearAuth,
  selectIsLoggedIn,
  selectIsAdmin,
  selectIsTenant,
  selectUser,
  selectToken,
  selectUserLoading,
} from './store/userSlice';
export type { UserState } from './store/userSlice';

// ---- Hooks ----
export { useChatTransport, setTransportStore } from './hooks/useChatTransport';
export { useTurns } from './hooks/useMessageList';

// ---- 工具函数 ----
export { sleep, formatTime, formatTimeShort, hashColor, generateId } from './utils';
export { renderMarkdown } from './utils/markdown';

// ---- 常量 ----
export { SpecialEventNames, MessageRoles, RunAgentTypes } from './constants/events';
export type {
  SpecialEventData,
  A2UIMessage,
  A2UICreateSurfaceEvent,
  A2UIUpdateComponentsEvent,
  A2UIUpdateDataModelEvent,
  A2UIDeleteSurfaceEvent,
} from './constants/events';

// ---- 类型 ----
export type {
  AgentChatConfig,
  TokenStorageConfig,
  ApiConfig,
  WebSocketConfig,
  ExtraAgentData,
  SendMessagePayload,
  DocumentInfo,
  ToolCallInfo,
  HistoryMessage,
  Agent,
  AgentGroup,
  KnowledgeGroup,
  User,
  LoginRequest,
  TenantLoginRequest,
  LoginResponse,
  SessionOverview,
  MessagesResponse,
  Theme,
  HorizontalAlignment,
  StepType,
  InternalStep,
  Turn,
} from './types';
