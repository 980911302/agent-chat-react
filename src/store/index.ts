import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './chatSlice';
import userReducer from './userSlice';
import { setTransportStore } from '../hooks/useChatTransport';

/**
 * Redux Store 配置
 * 使用 Redux Toolkit 管理聊天和用户状态
 */

export function createAgentChatStore(preloadedState?: any) {
  return configureStore({
    reducer: {
      chat: chatReducer,
      user: userReducer,
    } as any,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // 忽略 messages 中的非序列化字段
          ignoredPaths: ['chat.messages'],
        },
      }),
  });
}

/** 默认 Store 实例 */
export const store = createAgentChatStore();

// 将 store 注入到 useChatTransport hook 中，用于读取 currentAgent 等状态
setTransportStore(store);

export type RootState = {
  chat: ReturnType<typeof chatReducer>;
  user: ReturnType<typeof userReducer>;
};
export type AppDispatch = typeof store.dispatch;
export type AgentChatStore = ReturnType<typeof createAgentChatStore>;
