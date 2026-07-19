import React, { useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { notify, type NotifyType } from '../utils';
import type { Theme, ExtraAgentData, HorizontalAlignment, DocumentInfo, AgentGroup } from '../types';
import type { RootState, AppDispatch } from '../store';
import {
  selectIsConnected,
  selectIsChatLoading,
  selectConnectionError,
  selectCurrentAgent,
  selectAgentTokens,
} from '../store/chatSlice';
import { selectIsLoggedIn, selectToken, selectUser } from '../store/userSlice';
import { A2UIMessageList, type A2UIMessageListRef } from '../components/messages/a2ui/MessageList';
import { InputArea } from '../components/inputs/InputArea';
import { useChatTransport } from '../hooks/useChatTransport';
import { SpecialEventNames } from '../constants/events';

/**
 * A2UI 聊天布局
 * 使用 @a2ui/lit Web Component 渲染交互式 UI Surface
 */

export interface A2UIChatLayoutProps {
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
  /** 提示消息回调（连接错误/终止对话结果等），不传则输出到 console */
  onNotify?: (type: NotifyType, message: string) => void;
}

export interface A2UIChatLayoutRef {
  newSession: () => Promise<void>;
  changeSession: (sessionId: string) => Promise<void>;
  a2uiMessageListRef: React.RefObject<A2UIMessageListRef | null>;
  /** 手动连接 WebSocket，支持指定会话 ID 和跳过历史加载 */
  connect: (sessionId?: string, options?: { skipHistory?: boolean }) => Promise<void>;
  /** 手动断开 WebSocket 连接 */
  disconnect: () => void;
}

export const A2UIChatLayout = forwardRef<A2UIChatLayoutRef, A2UIChatLayoutProps>(
  (
    {
      theme = 'dark',
      showAgentInfo = false,
      isEnableFile = true,
      input_isEnableKnowledge = true,
      placeholder,
      showTokensBar = false,
      inputAreaHorizontalAlignment = 'Full',
      inputAreaMargin = '10px',
      inputWidth,
      inputAgentsData = [],
      groups = [],
      onA2UIAction,
      onSurfaceCreated,
      onComponentsUpdated,
      onDataModelUpdated,
      onSurfaceDeleted,
      autoConnect = true,
      onNotify,
    },
    ref
  ) => {
    const dispatch = useDispatch<AppDispatch>();
    const a2uiRef = useRef<A2UIMessageListRef>(null);
    const transport = useChatTransport();

    const isConnected = useSelector(selectIsConnected);
    const isLoading = useSelector(selectIsChatLoading);
    const connectionError = useSelector(selectConnectionError);
    const currentAgent = useSelector(selectCurrentAgent);
    const agentTokens = useSelector(selectAgentTokens);
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
        setTimeout(() => a2uiRef.current?.scrollToBottom?.(), 100);
      });
      return unsub;
    }, [transport]);

    // 连接错误提示 —— 与 Vue 版 watch(connectionError) 对齐
    useEffect(() => {
      if (connectionError) {
        notify(onNotify, 'error', connectionError);
      }
    }, [connectionError, onNotify]);

    // 登出时断开连接 —— 与 Vue 版 watch(isLoggedIn) 对齐
    useEffect(() => {
      if (!isLoggedIn) {
        transport.disconnect();
      }
    }, [isLoggedIn, transport]);

    // 把 Surface 创建/组件更新/数据模型更新/Surface 删除事件转发给外部回调
    // —— 与 Vue 版 A2UIMessageList 的 @surface-created 等事件转发对齐
    useEffect(() => {
      const unsubs: Array<() => void> = [];
      if (onSurfaceCreated) {
        unsubs.push(
          transport.onSpecialEvent(SpecialEventNames.CREATE_SURFACE, (data: any) =>
            onSurfaceCreated(data?.surfaceId)
          )
        );
      }
      if (onComponentsUpdated) {
        unsubs.push(
          transport.onSpecialEvent(SpecialEventNames.UPDATE_COMPONENTS, (data: any) =>
            onComponentsUpdated(data)
          )
        );
      }
      if (onDataModelUpdated) {
        unsubs.push(
          transport.onSpecialEvent(SpecialEventNames.UPDATE_DATA_MODEL, (data: any) =>
            onDataModelUpdated(data)
          )
        );
      }
      if (onSurfaceDeleted) {
        unsubs.push(
          transport.onSpecialEvent(SpecialEventNames.DELETE_SURFACE, (data: any) =>
            onSurfaceDeleted(data?.surfaceId)
          )
        );
      }
      return () => unsubs.forEach((unsub) => unsub());
    }, [transport, onSurfaceCreated, onComponentsUpdated, onDataModelUpdated, onSurfaceDeleted]);

    const handleSend = useCallback(
      (
        content: string,
        documents: DocumentInfo[],
        mention?: { type: 'agent' | 'group'; name: string },
        knowledgeIds?: string[]
      ) => {
        if (!isConnected) {
          notify(onNotify, 'warning', '未连接到服务器');
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
        a2uiRef.current?.addUserMessage(content);
        transport.sendMessage(content, documents, targetAgent, knowledgeIds);
      },
      [transport, isConnected, user, groups, onNotify]
    );

    // 终止对话 —— 与 Vue 版对齐：连接中且加载中才允许终止，并给出结果提示
    const handleTerminate = useCallback(async () => {
      if (!isConnected || !isLoading) return;
      try {
        await transport.terminateSession();
        notify(onNotify, 'info', '已终止当前对话');
      } catch (err) {
        notify(onNotify, 'error', err instanceof Error ? err.message : '终止失败');
      }
    }, [isConnected, isLoading, transport, onNotify]);

    /** A2UI 用户操作回传给后端 */
    const handleA2UIAction = useCallback(
      (surfaceId: string, action: any) => {
        onA2UIAction?.(action);

        if (transport.transportRef.current) {
          transport.transportRef.current
            .request('messageChannel/sendA2UIUserAction', [surfaceId, action])
            .catch((err: any) => {
              console.error('[A2UIChatLayout] sendA2UIUserAction failed:', err);
            });
        }
      },
      [transport, onA2UIAction]
    );

    useImperativeHandle(ref, () => ({
      newSession: async () => {
        await transport.newSession();
        a2uiRef.current?.loadLatest();
      },
      changeSession: async (sessionId: string) => {
        await transport.changeSession(sessionId);
        a2uiRef.current?.loadLatest();
      },
      a2uiMessageListRef: a2uiRef,
      connect: transport.connect,
      disconnect: transport.disconnect,
    }));

    return (
      <div
        className={`chat-layout ${theme === 'light' ? 'chat-layout--light' : ''}`}
        style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      >
        <A2UIMessageList
          ref={a2uiRef}
          theme={theme}
          onSpecialEvent={transport.onSpecialEvent}
          onSessionSwitch={transport.onSessionSwitch}
          onA2UIAction={handleA2UIAction}
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
          onNotify={onNotify}
        />
      </div>
    );
  }
);

A2UIChatLayout.displayName = 'A2UIChatLayout';
