import React, { useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { message } from 'antd';
import type { Theme, ExtraAgentData, HorizontalAlignment, DocumentInfo, AgentGroup } from '../types';
import type { RootState, AppDispatch } from '../store';
import {
  selectMessages,
  selectIsConnected,
  selectIsChatLoading,
  selectConnectionError,
  selectCurrentAgent,
  selectAgents,
  selectAgentTokens,
  selectShowToolCallLog,
  selectHasMoreMessages,
  selectIsLoadingMore,
} from '../store/chatSlice';
import { selectIsLoggedIn, selectToken, selectUser } from '../store/userSlice';
import { RapTimelineMessageList, type RapTimelineMessageListRef } from '../components/messages/rap_timeline/MessageList';
import { InputArea } from '../components/inputs/InputArea';
import { useChatTransport } from '../hooks/useChatTransport';

/**
 * RapTimeline 聊天布局
 * 混合布局：流式时动态文字预览 + 折叠卡片，展开后完整时间线
 */

export interface RapTimelineChatLayoutProps {
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

export interface RapTimelineChatLayoutRef {
  newSession: () => Promise<void>;
  changeSession: (sessionId: string) => Promise<void>;
  /** 手动连接 WebSocket，支持指定会话 ID 和跳过历史加载 */
  connect: (sessionId?: string, options?: { skipHistory?: boolean }) => Promise<void>;
  /** 手动断开 WebSocket 连接 */
  disconnect: () => void;
}

export const RapTimelineChatLayout = forwardRef<RapTimelineChatLayoutRef, RapTimelineChatLayoutProps>(
  (
    {
      theme = 'dark',
      showAgentInfo = false,
      isEnableFile = true,
      input_isEnableKnowledge = true,
      placeholder,
      defaultQuerys = [],
      showTokensBar = false,
      isUserDefaultAvatar = true,
      inputAreaHorizontalAlignment = 'Full',
      inputAreaMargin = '10px',
      inputWidth,
      inputAgentsData = [],
      groups = [],
      autoConnect = true,
    },
    ref
  ) => {
    const dispatch = useDispatch<AppDispatch>();
    const messageListRef = useRef<RapTimelineMessageListRef>(null);
    const transport = useChatTransport();

    const messages = useSelector(selectMessages);
    const isConnected = useSelector(selectIsConnected);
    const isLoading = useSelector(selectIsChatLoading);
    const connectionError = useSelector(selectConnectionError);
    const currentAgent = useSelector(selectCurrentAgent);
    const agents = useSelector(selectAgents);
    const agentTokens = useSelector(selectAgentTokens);
    const showToolCallLog = useSelector(selectShowToolCallLog);
    const hasMoreMessages = useSelector(selectHasMoreMessages);
    const isLoadingMore = useSelector(selectIsLoadingMore);
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const token = useSelector(selectToken);
    const user = useSelector(selectUser);

    useEffect(() => {
      if (autoConnect && isLoggedIn && token && !isConnected) {
        transport.connect();
      }
    }, [autoConnect, isLoggedIn, token, isConnected, transport]);

    useEffect(() => {
      const unsub = transport.onSessionSwitch((_reason) => {
        setTimeout(() => messageListRef.current?.scrollToBottom?.(), 100);
      });
      return unsub;
    }, [transport]);

    // 连接错误提示 —— 与 Vue 版 watch(connectionError) 对齐
    useEffect(() => {
      if (connectionError) {
        message.error(connectionError);
      }
    }, [connectionError]);

    // 登出时断开连接 —— 与 Vue 版 watch(isLoggedIn) 对齐
    useEffect(() => {
      if (!isLoggedIn) {
        transport.disconnect();
      }
    }, [isLoggedIn, transport]);

    const handleSend = useCallback(
      (
        content: string,
        documents: DocumentInfo[],
        mention?: { type: 'agent' | 'group'; name: string },
        knowledgeIds?: string[]
      ) => {
        if (!isConnected) {
          message.warning('未连接到服务器');
          return;
        }

        let targetAgent: { name: string; type: string };
        if (mention) {
          targetAgent = {
            name: mention.name,
            type: mention.type === 'group' ? 'group' : 'agent',
          };
        } else {
          // 无 @ 指定时，使用入口智能体，根据 groups 列表判断真实类型（与 Vue 版对齐）
          const agentName = user?.agent || 'main';
          const isGroup = groups.some((g) => g.name === agentName);
          targetAgent = {
            name: agentName,
            type: isGroup ? 'group' : 'agent',
          };
        }
        transport.sendMessage(content, documents, targetAgent, knowledgeIds);
        setTimeout(() => messageListRef.current?.scrollToBottom?.(), 100);
      },
      [transport, isConnected, user, groups]
    );

    // 终止对话 —— 与 Vue 版对齐：连接中且加载中才允许终止，并给出结果提示
    const handleTerminate = useCallback(async () => {
      if (!isConnected || !isLoading) return;
      try {
        await transport.terminateSession();
        message.info('已终止当前对话');
      } catch (err) {
        message.error(err instanceof Error ? err.message : '终止失败');
      }
    }, [isConnected, isLoading, transport]);

    useImperativeHandle(ref, () => ({
      newSession: transport.newSession,
      changeSession: transport.changeSession,
      connect: transport.connect,
      disconnect: transport.disconnect,
    }));

    return (
      <div
        className={`chat-layout ${theme === 'light' ? 'chat-layout--light' : ''}`}
        style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      >
        <RapTimelineMessageList
          ref={messageListRef}
          messages={messages}
          currentAgent={currentAgent}
          isGroupChat={agents.length > 1}
          showToolCallLog={showToolCallLog}
          isLoading={isLoading}
          theme={theme}
          entryAgent={user?.agent}
          groups={groups}
          defaultQuerys={defaultQuerys}
          isUserDefaultAvatar={isUserDefaultAvatar}
          hasMore={agents.length > 1 ? hasMoreMessages['__global__'] !== false : hasMoreMessages[currentAgent] !== false}
          isLoadingMore={isLoadingMore}
          onLoadMore={() => transport.loadMoreMessages(agents.length > 1 ? undefined : currentAgent)}
          onSelectQuery={(query) => handleSend(query, [])}
        />
        <InputArea
          isConnected={isConnected}
          isLoading={isLoading}
          connectionError={connectionError}
          theme={theme}
          showAgentInfo={showAgentInfo}
          isEnableFile={isEnableFile}
          input_isEnableKnowledge={input_isEnableKnowledge}
          placeholder={placeholder}
          showTokensBar={showTokensBar}
          currentAgentName={currentAgent}
          agentTokens={agentTokens}
          horizontalAlignment={inputAreaHorizontalAlignment}
          margin={inputAreaMargin}
          inputWidth={inputWidth}
          inputAgentsData={inputAgentsData}
          boundAgent={user?.agent || null}
          boundAgentType={user?.agentType || 'agent'}
          onSend={handleSend}
          onTerminate={handleTerminate}
        />
      </div>
    );
  }
);

RapTimelineChatLayout.displayName = 'RapTimelineChatLayout';
