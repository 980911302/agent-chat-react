import { useCallback, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { WebSocketTransport } from '@xyxandwxx/transport';
import type { Dispatch } from '@reduxjs/toolkit';
import type { RootState, AppDispatch } from '../store';
import {
  setConnected,
  setConnectionError,
  setAuthenticated,
  setAuthErrorCode,
  setLoading,
  setSessionId,
  setCurrentAgent,
  setAgents,
  addMessage,
  addUserMessage as addUserMsg,
  setMessages,
  prependMessages,
  setHasMore,
  setLoadingMore,
  clearMessages,
  appendStreamContent,
  appendStreamReasonContent,
  markStreamDone,
  appendContentById,
  appendReasonContentById,
  markStreamDoneById,
  startAssistantMessage,
  addAgent,
  addToolCallStart,
  addToolCallSuccess,
  addToolCallFailed,
  updateAgentTokens,
  setAgentTokens,
  setSessionOverview,
  setSessionOverviewLoading,
} from '../store/chatSlice';
import { setUser, setTokenAction, setLoading as setUserLoading, clearAuth } from '../store/userSlice';
import { getToken, getConfig, getApiInstance, setTokenExpiredCallback } from '../config';
import type { HistoryMessage, MessagesResponse } from '../types';
import { MessageRoles } from '../constants/events';
import { generateId } from '../utils';

/**
 * WebSocket 传输层管理 Hook
 * 封装 WebSocket 连接、认证、消息收发逻辑
 */

/** transportRef 对外暴露的最小类型，避免公共类型声明依赖 @xyxandwxx/transport 的内部类型 */
interface TransportLike {
  request<T = any>(method: string, params: any[]): Promise<T>;
}

// 流式消息批处理缓冲区
interface StreamBuffer {
  content: string;
  reasonContent: string;
  timer: ReturnType<typeof setTimeout> | null;
  lastFlushTime: number;
}

const BUFFER_INTERVAL = 50; // 50ms 刷新间隔
const BUFFER_MIN_CHARS = 10; // 最少 10 个字符才刷新

// ---- 模块级共享 Transport 状态（多布局/多实例共享一个 transport） ----
const transportRef: { current: WebSocketTransport | null } = { current: null };
const connectionGenerationRef = { current: 0 };
const connectingPromiseRef: { current: Promise<void> | null } = { current: null };
const channelStartedRef = { current: false };
const activeHookCount = { current: 0 };
const streamBuffersRef: { current: Map<string, StreamBuffer> } = { current: new Map() };
const pendingAssistantIdsRef: { current: Map<string, string> } = { current: new Map() };
const onSessionSwitchSubscribersRef: Array<((reason: string) => void)> = [];
const specialEventCallbacksRef: { current: Map<string, ((data: any) => void)[]> } = { current: new Map() };

/** 获取默认智能体名称 —— 与 Vue 版 getDefaultAgent() 对齐 */
function getDefaultAgent(): string {
  if (store) {
    const state = store.getState();
    return state?.user?.user?.agent || 'main';
  }
  return 'main';
}

export function useChatTransport() {
  const dispatch = useDispatch<AppDispatch>();
  const onTokenExpiredRef = useRef<((code: number, message: string) => void) | null>(null);

  /** 获取或创建流式缓冲区 */
  const getStreamBuffer = useCallback((agent: string): StreamBuffer => {
    if (!streamBuffersRef.current.has(agent)) {
      streamBuffersRef.current.set(agent, {
        content: '',
        reasonContent: '',
        timer: null,
        lastFlushTime: 0,
      });
    }
    return streamBuffersRef.current.get(agent)!;
  }, []);

  /** 刷新流式缓冲区 */
  const flushStreamBuffer = useCallback(
    (agent: string, force: boolean = false) => {
      const buffer = streamBuffersRef.current.get(agent);
      if (!buffer) return;

      if (buffer.content || buffer.reasonContent) {
        const pendingId = pendingAssistantIdsRef.current.get(agent);
        if (buffer.content) {
          if (pendingId) {
            dispatch(appendContentById({ agent, id: pendingId, content: buffer.content }));
          } else {
            dispatch(appendStreamContent({ agent, content: buffer.content }));
          }
          buffer.content = '';
        }
        if (buffer.reasonContent) {
          if (pendingId) {
            dispatch(appendReasonContentById({ agent, id: pendingId, content: buffer.reasonContent }));
          } else {
            dispatch(appendStreamReasonContent({ agent, content: buffer.reasonContent }));
          }
          buffer.reasonContent = '';
        }
        buffer.lastFlushTime = Date.now();
      }

      if (force && buffer.timer) {
        clearTimeout(buffer.timer);
        buffer.timer = null;
      }
    },
    [dispatch]
  );

  /** 调度缓冲区刷新 */
  const scheduleFlush = useCallback(
    (agent: string) => {
      const buffer = getStreamBuffer(agent);
      if (buffer.timer) return;

      buffer.timer = setTimeout(() => {
        buffer.timer = null;
        flushStreamBuffer(agent);
      }, BUFFER_INTERVAL);
    },
    [getStreamBuffer, flushStreamBuffer]
  );

  /** 注册特殊事件回调 */
  const onSpecialEvent = useCallback(
    (eventName: string, callback: (data: any) => void) => {
      const callbacks = specialEventCallbacksRef.current.get(eventName) || [];
      callbacks.push(callback);
      specialEventCallbacksRef.current.set(eventName, callbacks);
      return () => {
        const cbs = specialEventCallbacksRef.current.get(eventName) || [];
        const idx = cbs.indexOf(callback);
        if (idx >= 0) cbs.splice(idx, 1);
      };
    },
    []
  );

  /** 注册会话切换回调 */
  const onSessionSwitch = useCallback((callback: (reason: string) => void) => {
    onSessionSwitchSubscribersRef.push(callback);
    return () => {
      const idx = onSessionSwitchSubscribersRef.indexOf(callback);
      if (idx >= 0) onSessionSwitchSubscribersRef.splice(idx, 1);
    };
  }, []);

  /** 注册 Token 过期回调 */
  const setOnTokenExpired = useCallback(
    (callback: (code: number, message: string) => void) => {
      onTokenExpiredRef.current = callback;
      setTokenExpiredCallback(callback);
    },
    []
  );

  /** 加载初始消息历史 */
  const loadInitialHistory = useCallback(
    async (sessionId: string) => {
      try {
        // 直接用 config 注入的 axios 实例，避免 api-gateway 模块解析不一致导致 getApiInstance 找不到实例
        const api = getApiInstance();
        const result: any = await api.get(`/messages/${sessionId}`, {
          params: { limit: 50, offset: 0 },
        });

        const data: MessagesResponse = (result as any).data || result;

        // 按智能体分组消息
        const groupedMessages: Record<string, HistoryMessage[]> = {};
        for (const msg of data.messages) {
          const agent = msg.agent || msg.fromAgent || getDefaultAgent();
          if (!groupedMessages[agent]) {
            groupedMessages[agent] = [];
          }
          groupedMessages[agent].push(msg);
        }

        // 设置消息和智能体列表
        for (const [agent, messages] of Object.entries(groupedMessages)) {
          dispatch(setMessages({ agent, messages }));
          dispatch(setHasMore({ agent, hasMore: data.pagination.hasMore }));
        }
        // 群聊/全局模式下"是否还有更多"的判断 —— 与 Vue 版对齐
        dispatch(setHasMore({ agent: '__global__', hasMore: data.pagination.hasMore }));

        if (data.agents) {
          const historyAgents = data.agents.map((a: any) => ({
            name: a.agent?.name || '',
            description: a.agent?.description || a.agent?.describe || '',
            tokens: a.tokens,
          }));
          dispatch(setAgents(historyAgents));

          // 提取每个 agent 的 tokens
          const tokensMap: Record<string, number> = {};
          for (const a of data.agents) {
            const agentName = a.agent?.name || '';
            if (agentName) {
              tokensMap[agentName] = a.tokens || 0;
            }
          }
          dispatch(setAgentTokens(tokensMap));

          // 校正 currentAgent：若当前 agent 不在历史列表里，切换到第一个历史 agent（对齐 Vue 版）
          if (historyAgents.length > 0) {
            const state = store.getState();
            const cur = state.chat.currentAgent;
            const match = historyAgents.find((a) => a.name === cur);
            if (!match) {
              dispatch(setCurrentAgent(historyAgents[0].name));
            }
          }
        }
      } catch (err) {
        console.error('[agent-chat] 加载消息历史失败:', err);
      }
    },
    [dispatch]
  );

  /** 初始化 WebSocket 传输层 */
  const initTransport = useCallback(
    async (sessionId?: string) => {
      const gen = connectionGenerationRef.current;
      const config = getConfig();
      const wsConfig = config.websocket;
      const token = getToken();

      // 构建 WebSocket 路径：仅 token 作为 query 参数
      let wsPath = wsConfig.path || '/ws';
      if (token) {
        wsPath += `?token=${token}`;
      }

      const transport = new WebSocketTransport(
        'fromWeb',
        wsConfig.host || 'localhost',
        wsConfig.port || 3000,
        wsPath,
        wsConfig.reconnectDelay || 3000
      );

      transport.showLog = false;
      transport.timeout = -1;

      // 连接事件
      transport.onConnectedEvent = () => {
        if (gen !== connectionGenerationRef.current) return;
        dispatch(setConnectionError(null));
      };

      transport.onDisconnectedEvent = () => {
        if (gen !== connectionGenerationRef.current) return;
        dispatch(setConnected(false));
        dispatch(setAuthenticated(false));
      };

      transport.onReconnectedEvent = () => {
        if (gen !== connectionGenerationRef.current) return;
        dispatch(setAuthenticated(false));
        // 重新认证
        authenticate(transport, token, sessionId);
      };

      // 注册消息处理器
      registerHandlers(transport, gen);

      transportRef.current = transport;
      await transport.start();
    },
    [dispatch]
  );

  /** 认证 —— 与 Vue 版完全对齐 */
  const authenticate = useCallback(
    async (transport: WebSocketTransport, token: string, sessionId?: string, skipHistory?: boolean) => {
      const gen = connectionGenerationRef.current;

      try {
        const sessionIdParam = sessionId || '';
        const result: any = await transport.request('messageChannel/handleAuth', [
          token,
          sessionIdParam,
        ]);

        if (gen !== connectionGenerationRef.current) return;

        if (result?.success && result?.sessionId) {
          // 从 store 读取用户绑定的智能体名称，设置为当前智能体
          // 这样后续收发消息的 agent key 保持一致，消息能正确显示
          const userState = store.getState();
          const userAgent = userState?.user?.user?.agent || getDefaultAgent();
          dispatch(setCurrentAgent(userAgent));
          dispatch(setAuthenticated(true));
          dispatch(setSessionId(result.sessionId));
          dispatch(setConnectionError(null));

          if (!skipHistory) {
            // 加载历史消息
            await loadInitialHistory(result.sessionId);

            // 启动消息通道
            await transport.request('messageChannel/startChannel', []);
            channelStartedRef.current = true;

            // 触发会话切换回调
            for (const cb of onSessionSwitchSubscribersRef) {
              try { cb('init'); } catch {}
            }
          }
          dispatch(setConnected(true));
          dispatch(setLoading(false));
        } else {
          // 认证失败
          const errorCode = result?.code || 'AUTH_FAILED';
          dispatch(setAuthErrorCode(errorCode));
          dispatch(setConnectionError(result?.message || '认证失败'));
          dispatch(setLoading(false));

          // 认证相关错误时触发 token 过期回调
          const authErrorCodes = ['TOKEN_EXPIRED', 'TOKEN_INVALID', 'TOKEN_MISSING', 'AUTH_FAILED', 'USER_NOT_FOUND'];
          if (authErrorCodes.includes(errorCode)) {
            onTokenExpiredRef.current?.(401, result?.message || '认证失败');
          }
        }
      } catch (err: any) {
        if (gen !== connectionGenerationRef.current) return;
        // 与 Vue 版一致: 遇到 "还未开始" 错误时重试
        const errorMessage = err?.message || '';
        if (errorMessage.includes('还未开始')) {
          await new Promise((r) => setTimeout(r, 200));
          await authenticate(transport, token, sessionId, skipHistory);
          return;
        }
        console.error('[agent-chat] 认证失败:', err);
        dispatch(setAuthErrorCode('AUTH_FAILED'));
        dispatch(setConnectionError('认证失败'));
        dispatch(setLoading(false));
      }
    },
    [dispatch, loadInitialHistory]
  );

  /** 注册所有 WebSocket 消息处理器 */
  const registerHandlers = useCallback(
    (transport: WebSocketTransport, gen: number) => {
      // 助手消息（流式）—— 与 Vue 版对齐: agentName || currentAgent.value
      transport.registerHandleMethod('onWeb/assistantMessage', (data: any) => {
        if (gen !== connectionGenerationRef.current) return;
        const { message, agentName } = data;
        const agent = agentName || getDefaultAgent();

        // 若无 pending assistant 消息则先创建
        if (!pendingAssistantIdsRef.current.has(agent)) {
          const id = generateId();
          pendingAssistantIdsRef.current.set(agent, id);
          dispatch(startAssistantMessage({ agent, id }));
        }
        dispatch(addAgent({ name: agent, description: '' }));

        const buffer = getStreamBuffer(agent);
        buffer.content += message || '';
        scheduleFlush(agent);
      });

      // 思考消息（流式）
      transport.registerHandleMethod('onWeb/thinkingMessage', (data: any) => {
        if (gen !== connectionGenerationRef.current) return;
        const { message, agentName } = data;
        const agent = agentName || getDefaultAgent();

        // 若无 pending assistant 消息则先创建（思考内容也挂到同一 assistant 消息）
        if (!pendingAssistantIdsRef.current.has(agent)) {
          const id = generateId();
          pendingAssistantIdsRef.current.set(agent, id);
          dispatch(startAssistantMessage({ agent, id }));
        }

        const buffer = getStreamBuffer(agent);
        buffer.reasonContent += message || '';
        scheduleFlush(agent);
      });

      // 思考完成
      transport.registerHandleMethod('onWeb/thinkingDone', (data: any) => {
        if (gen !== connectionGenerationRef.current) return;
        const agent = data.agentName || getDefaultAgent();
        flushStreamBuffer(agent, true);
      });

      // 全部完成
      transport.registerHandleMethod('onWeb/done', (_data: any) => {
        if (gen !== connectionGenerationRef.current) return;
        // 刷新所有缓冲区
        for (const agent of streamBuffersRef.current.keys()) {
          flushStreamBuffer(agent, true);
        }
        // 精准标记所有 pending 消息完成并清理
        for (const [agent, id] of pendingAssistantIdsRef.current.entries()) {
          dispatch(markStreamDoneById({ agent, id }));
        }
        pendingAssistantIdsRef.current.clear();
        dispatch(markStreamDone({}));
      });

      // 单个智能体完成
      transport.registerHandleMethod('onWeb/agentDone', (data: any) => {
        if (gen !== connectionGenerationRef.current) return;
        const agent = data.agentName || getDefaultAgent();
        flushStreamBuffer(agent, true);
        const pendingId = pendingAssistantIdsRef.current.get(agent);
        if (pendingId) {
          dispatch(markStreamDoneById({ agent, id: pendingId }));
          pendingAssistantIdsRef.current.delete(agent);
        }
        dispatch(markStreamDone({ agent }));
        dispatch(addAgent({ name: agent, description: '' }));
      });

      // 错误消息
      transport.registerHandleMethod('onWeb/error', (data: any) => {
        if (gen !== connectionGenerationRef.current) return;
        const agent = data.agentName || getDefaultAgent();
        dispatch(setLoading(false));
        if (pendingAssistantIdsRef.current.has(agent)) {
          pendingAssistantIdsRef.current.delete(agent);
        }
        dispatch(
          addMessage({
            agent,
            message: {
              id: generateId(),
              role: MessageRoles.ERROR,
              content: data.content || data.message || '发生错误',
              timestamp: Date.now(),
            },
          })
        );
      });

      // 智能体间消息 —— 与 Vue 版对齐: data.message 是嵌套对象
      transport.registerHandleMethod('onWeb/askAgentMessage', (data: any) => {
        if (gen !== connectionGenerationRef.current) return;
        const { content, fromAgent, toAgent } = data.message || {};
        const agent = toAgent || getDefaultAgent();
        dispatch(
          addMessage({
            agent,
            message: {
              id: generateId(),
              role: MessageRoles.ASK_AGENT,
              content: content || '',
              timestamp: Date.now(),
              agent: toAgent,
              fromAgent,
            },
          })
        );
        dispatch(addAgent({ name: agent, description: '' }));
      });

      // 智能体询问用户 —— 与 Vue 版对齐
      transport.registerHandleMethod('onWeb/askUserMessage', (data: any) => {
        if (gen !== connectionGenerationRef.current) return;
        const agent = data.agent || getDefaultAgent();
        const content = (data.askMessage || '') + (data.items ? '\n\n' + data.items.join('\n\n') : '');
        dispatch(
          addMessage({
            agent,
            message: {
              id: generateId(),
              role: MessageRoles.ASK_USER,
              content,
              timestamp: Date.now(),
              agent,
            },
          })
        );
      });

      // 用户回答智能体 —— 与 Vue 版对齐
      transport.registerHandleMethod('onWeb/userAnswer', (data: any) => {
        if (gen !== connectionGenerationRef.current) return;
        const agent = data.agentName || getDefaultAgent();
        dispatch(
          addMessage({
            agent,
            message: {
              id: generateId(),
              role: MessageRoles.USER_ANSWER,
              content: data.userAnswer || '',
              timestamp: Date.now(),
            },
          })
        );
      });

      // 工具调用开始 —— 与 Vue 版对齐: data.agentName
      transport.registerHandleMethod('onWeb/toolCallBefore', (data: any) => {
        if (gen !== connectionGenerationRef.current) return;
        const agent = data.agentName || getDefaultAgent();
        dispatch(
          addToolCallStart({
            agent,
            toolName: data.toolName || '',
            args: typeof data.args === 'string' ? data.args : JSON.stringify(data.args || ''),
          })
        );
        dispatch(addAgent({ name: agent, description: '' }));
      });

      // 工具调用成功
      transport.registerHandleMethod('onWeb/toolCallSuccess', (data: any) => {
        if (gen !== connectionGenerationRef.current) return;
        const agent = data.agentName || getDefaultAgent();
        dispatch(
          addToolCallSuccess({
            agent,
            toolName: data.toolName || '',
            result: data.result,
          })
        );
      });

      // 工具调用失败
      transport.registerHandleMethod('onWeb/toolCallFailed', (data: any) => {
        if (gen !== connectionGenerationRef.current) return;
        const agent = data.agentName || getDefaultAgent();
        dispatch(
          addToolCallFailed({
            agent,
            toolName: data.toolName || '',
            error: data.error,
          })
        );
      });

      // 更新智能体 token 数量
      transport.registerHandleMethod('onWeb/updateAgentTokens', (data: any) => {
        if (gen !== connectionGenerationRef.current) return;
        dispatch(
          updateAgentTokens({
            agent: data.agentName || getDefaultAgent(),
            tokens: data.tokens || 0,
          })
        );
      });

      // 特殊事件（A2UI 等）
      transport.registerHandleMethod('onWeb/specialEvent', (data: any) => {
        if (gen !== connectionGenerationRef.current) return;
        const eventName = data.name || data.event;
        if (eventName) {
          const callbacks = specialEventCallbacksRef.current.get(eventName) || [];
          for (const cb of callbacks) {
            try {
              cb(data.data || data);
            } catch (err) {
              console.error('[agent-chat] 特殊事件回调出错:', err);
            }
          }
        }
      });
    },
    [dispatch, getStreamBuffer, scheduleFlush, flushStreamBuffer]
  );

  /** 连接 WebSocket */
  const connect = useCallback(
    async (sessionId?: string, options?: { skipHistory?: boolean }) => {
      // 幂等性：已连接且已认证则直接返回
      if (transportRef.current && (transportRef.current as any).isConnected()) {
        return;
      }

      // 防止并发连接：若已有连接在进行且 transport 仍存在，复用该 Promise
      if (connectingPromiseRef.current && transportRef.current) {
        return connectingPromiseRef.current;
      }

      connectionGenerationRef.current++;
      const gen = connectionGenerationRef.current;

      const connectPromise = (async () => {
        try {
          dispatch(setConnectionError(null));
          dispatch(setLoading(true));

          // 清理旧传输层
          if (transportRef.current) {
            try {
              transportRef.current.dispose();
            } catch {}
            transportRef.current = null;
          }

          // 检查是否已被取消
          if (gen !== connectionGenerationRef.current) return;

          await initTransport(sessionId);

          if (gen !== connectionGenerationRef.current) return;

          // 等待连接
          const transport = transportRef.current;
          if (transport) {
            const connected = await (transport as any).waitForConnect?.(5000);
            if (!connected && gen === connectionGenerationRef.current) {
              dispatch(setConnectionError('连接超时'));
              dispatch(setLoading(false));
              return;
            }
          }

          if (gen !== connectionGenerationRef.current) return;

          // 与 Vue 版对齐：WS 连接建立后立即标记已连接，再认证
          dispatch(setConnected(true));

          // 认证（skipHistory 时跳过加载历史和启动通道）
          const token = getToken();
          if (token && transportRef.current) {
            await authenticate(transportRef.current, token, sessionId, options?.skipHistory);
          } else {
            dispatch(setConnectionError('未找到认证 Token'));
            dispatch(setLoading(false));
          }

          activeHookCount.current++;
        } catch (err: any) {
          if (gen !== connectionGenerationRef.current) return;
          console.error('[agent-chat] 连接失败:', err);
          dispatch(setConnectionError(err?.message || '连接失败'));
          dispatch(setLoading(false));
        } finally {
          // 仅当当前代数仍为本 Promise 的代数时才清理，避免清掉更新的连接 Promise
          if (gen === connectionGenerationRef.current) {
            connectingPromiseRef.current = null;
          }
        }
      })();

      connectingPromiseRef.current = connectPromise;
      return connectPromise;
    },
    [dispatch, initTransport, authenticate]
  );

  /** 断开连接 */
  const disconnect = useCallback(() => {
    connectionGenerationRef.current++;

    // 清理流式缓冲区
    for (const buffer of streamBuffersRef.current.values()) {
      if (buffer.timer) {
        clearTimeout(buffer.timer);
      }
    }
    streamBuffersRef.current.clear();

    // 清理 pending assistant ids
    pendingAssistantIdsRef.current.clear();

    if (transportRef.current) {
      try {
        transportRef.current.dispose();
      } catch {}
      transportRef.current = null;
    }

    connectingPromiseRef.current = null;
    channelStartedRef.current = false;
    activeHookCount.current = 0;
    dispatch(setConnected(false));
    dispatch(setAuthenticated(false));
  }, [dispatch]);

  /** 发送消息 —— 与 Vue 版完全对齐 */
  const sendMessage = useCallback(
    async (
      content: string,
      documents?: any[],
      targetAgent?: { name: string; type?: string },
      knowledgeIds?: string[]
    ) => {
      const transport = transportRef.current;
      if (!transport) {
        console.warn('[agent-chat] 未连接，无法发送消息');
        return;
      }

      if (!content.trim()) return;

      // 与 Vue 版对齐: targetAgent?.name || getDefaultAgent()
      const agentName = targetAgent?.name || getDefaultAgent();

      // 与 Vue 版对齐: 发送消息时更新 currentAgent
      dispatch(setCurrentAgent(agentName));

      // 本地添加用户消息
      dispatch(addUserMsg({ content, documents, agent: agentName }));
      dispatch(setLoading(true));

      try {
        // 与 Vue 版一致: 发送 [content, RunAgentInfo, documents, knowledgeIds]
        await transport.request('messageChannel/fromWebUserMessage', [
          content.trim(),
          targetAgent || { name: getDefaultAgent(), type: 'agent' },
          documents || [],
          knowledgeIds || [],
        ]);
      } catch (err) {
        console.error('[agent-chat] 发送消息失败:', err);
        dispatch(setLoading(false));
        // 添加错误消息
        dispatch(
          addMessage({
            agent: agentName,
            message: {
              id: generateId(),
              role: MessageRoles.ERROR,
              content: '发送消息失败: ' + (err as Error).message,
              timestamp: Date.now(),
            },
          })
        );
      }
    },
    [dispatch]
  );

  /** 新建会话 */
  const newSession = useCallback(async () => {
    const transport = transportRef.current;
    if (!transport) return;

    try {
      // 如果消息通道尚未启动（skipHistory 连接模式），先启动
      if (!channelStartedRef.current) {
        await transport.request('messageChannel/startChannel', []);
        channelStartedRef.current = true;
      }

      const result: any = await transport.request('messageChannel/startNewSession', []);
      dispatch(clearMessages());
      dispatch(setSessionId(result?.sessionId || null));
      for (const cb of onSessionSwitchSubscribersRef) {
        try { cb('new'); } catch {}
      }
    } catch (err) {
      console.error('[agent-chat] 新建会话失败:', err);
    }
  }, [dispatch]);

  /** 切换会话 */
  const changeSession = useCallback(
    async (sessionId: string) => {
      const transport = transportRef.current;
      if (!transport) {
        console.error('[agent-chat] changeSession: transport 不存在');
        return;
      }

      try {
        console.log('[agent-chat] changeSession 开始, sessionId:', sessionId);
        // 如果消息通道尚未启动（skipHistory 连接模式），先启动
        if (!channelStartedRef.current) {
          console.log('[agent-chat] 启动消息通道 startChannel');
          await transport.request('messageChannel/startChannel', []);
          channelStartedRef.current = true;
        }

        console.log('[agent-chat] switchToHistory');
        const result: any = await transport.request('messageChannel/switchToHistory', [sessionId]);
        const newSessionId = result?.sessionId || sessionId;
        console.log('[agent-chat] switchToHistory 完成, newSessionId:', newSessionId);
        dispatch(clearMessages());
        dispatch(setSessionId(newSessionId));

        // 重新加载历史
        console.log('[agent-chat] 开始加载历史消息');
        await loadInitialHistory(newSessionId);
        console.log('[agent-chat] 历史消息加载完成');
        for (const cb of onSessionSwitchSubscribersRef) {
          try { cb('switch'); } catch {}
        }
      } catch (err) {
        console.error('[agent-chat] 切换会话失败:', err);
      }
    },
    [dispatch, loadInitialHistory]
  );

  /** 终止当前会话 */
  const terminateSession = useCallback(async () => {
    const transport = transportRef.current;
    if (!transport) return;

    try {
      await transport.request('onWeb/terminateSession', []);
      dispatch(setLoading(false));
    } catch (err) {
      console.error('[agent-chat] 终止会话失败:', err);
    }
  }, [dispatch]);

  /**
   * 加载更多消息
   * 与 Vue 版对齐：传入 agent 时只翻这一个智能体的历史；不传（群聊/全局模式）时
   * 取所有已加载智能体中最早的消息时间戳，一次性向前翻页，并把结果按 agent 分组回填，
   * "是否还有更多"记录在 hasMoreMessages['__global__']。
   */
  const loadMoreMessages = useCallback(
    async (agent?: string) => {
      const state = store.getState();
      const sessionId = state.chat.sessionId;
      if (!sessionId) return;

      let earliestTimestamp: number | undefined;
      if (agent) {
        const agentMessages = state.chat.messages[agent] || [];
        if (agentMessages.length === 0) return;
        earliestTimestamp = agentMessages[0].timestamp;
      } else {
        for (const agentName of Object.keys(state.chat.messages)) {
          const agentMessages = state.chat.messages[agentName];
          if (agentMessages && agentMessages.length > 0) {
            const firstTimestamp = agentMessages[0].timestamp;
            if (earliestTimestamp === undefined || firstTimestamp < earliestTimestamp) {
              earliestTimestamp = firstTimestamp;
            }
          }
        }
        if (earliestTimestamp === undefined) return;
      }

      dispatch(setLoadingMore(true));
      try {
        const api = getApiInstance();
        const response: any = await api.get(`/messages/${sessionId}`, {
          params: {
            limit: 50,
            beforeTimestamp: earliestTimestamp,
          },
        });

        const data: MessagesResponse = response.data || response;
        const hasMoreKey = agent || '__global__';

        if (data.messages.length > 0) {
          const groupedMessages: Record<string, HistoryMessage[]> = {};
          for (const msg of data.messages) {
            const agentName = msg.agent || msg.fromAgent || agent || getDefaultAgent();
            if (!groupedMessages[agentName]) groupedMessages[agentName] = [];
            groupedMessages[agentName].push(msg);
          }
          for (const [agentName, msgs] of Object.entries(groupedMessages)) {
            dispatch(
              prependMessages({
                agent: agentName,
                messages: msgs,
                hasMore: data.pagination.hasMore,
              })
            );
          }
          dispatch(setHasMore({ agent: hasMoreKey, hasMore: data.pagination.hasMore }));
        } else {
          dispatch(setHasMore({ agent: hasMoreKey, hasMore: false }));
        }
      } catch (err) {
        console.error('[agent-chat] 加载更多消息失败:', err);
      } finally {
        dispatch(setLoadingMore(false));
      }
    },
    [dispatch]
  );

  /** 获取会话概览 */
  const fetchSessionOverview = useCallback(
    async (sessionId: string) => {
      if (!sessionId) return;
      dispatch(setSessionOverviewLoading(true));
      try {
        const api = getApiInstance();
        const result: any = await api.get(`/messages/${sessionId}/overview`);
        const data = result?.data || result;
        dispatch(setSessionOverview(data));
      } catch (err) {
        console.error('[agent-chat] 获取会话概览失败:', err);
        dispatch(setSessionOverview(null));
      } finally {
        dispatch(setSessionOverviewLoading(false));
      }
    },
    [dispatch]
  );

  // 追踪活跃组件计数：mount 时+1，unmount 时-1
  useEffect(() => {
    activeHookCount.current++;
    return () => {
      activeHookCount.current = Math.max(0, activeHookCount.current - 1);
    };
  }, []);

  return {
    connect,
    disconnect,
    sendMessage,
    newSession,
    changeSession,
    terminateSession,
    loadMoreMessages,
    fetchSessionOverview,
    onSpecialEvent,
    onSessionSwitch,
    setOnTokenExpired,
    transportRef: transportRef as { current: TransportLike | null },
  };
}

// 为了在 hook 内部访问 store
let store: any;
export function setTransportStore(s: any) {
  store = s;
}
