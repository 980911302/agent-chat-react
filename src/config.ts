import axios, { type AxiosInstance } from 'axios';
import { setApiInstance, SSEClient, setSSEClient } from '@xyxandwxx/api-gateway';
import type { AgentChatConfig, TokenStorageConfig, ApiConfig, WebSocketConfig } from './types';

/**
 * 全局配置模块
 * 管理 API、WebSocket、Token 存储等配置
 */

// ---- 内部状态 ----
let globalConfig: Required<AgentChatConfig> = {
  tokenStorage: {
    token: '',
    tokenKey: 'power_claw_token',
    userInfoKey: 'power_claw_user_info',
  },
  api: {
    baseUrl: 'http://localhost:3000/api',
  },
  websocket: {
    host: 'localhost',
    port: 3000,
    path: '/ws',
    reconnectDelay: 3000,
  },
};

let axiosInstance: AxiosInstance | null = null;
let tokenExpiredCallback: ((code: number, message: string) => void) | null = null;

// ---- Token 管理 ----

/** 设置 Token */
export function setToken(token: string): void {
  globalConfig.tokenStorage.token = token;
  const key = globalConfig.tokenStorage.tokenKey || 'power_claw_token';
  try {
    localStorage.setItem(key, token);
  } catch {
    // 忽略 localStorage 不可用的情况
  }
}

/** 获取 Token */
export function getToken(): string {
  if (globalConfig.tokenStorage.token) {
    return globalConfig.tokenStorage.token;
  }
  const key = globalConfig.tokenStorage.tokenKey || 'power_claw_token';
  try {
    return localStorage.getItem(key) || '';
  } catch {
    return '';
  }
}

/** 清除 Token */
export function clearToken(): void {
  globalConfig.tokenStorage.token = '';
  const key = globalConfig.tokenStorage.tokenKey || 'power_claw_token';
  try {
    localStorage.removeItem(key);
  } catch {
    // 忽略
  }
}

/** 获取 Token 存储配置 */
export function getTokenStorageConfig(): TokenStorageConfig {
  return { ...globalConfig.tokenStorage };
}

// ---- API 实例管理 ----

/** 获取 axios 实例 */
export function getApiInstance(): AxiosInstance {
  if (!axiosInstance) {
    throw new Error('API 实例未初始化，请先调用 initAgentChatConfig()');
  }
  return axiosInstance;
}

/** 创建 axios 实例（带认证拦截器） */
function createApiInstance(config: ApiConfig): AxiosInstance {
  if (config.instance) {
    return config.instance;
  }

  const instance = axios.create({
    baseURL: config.baseUrl || 'http://localhost:3000/api',
    timeout: 30000,
    headers: { 'Content-Type': 'application/json' },
  });

  // 请求拦截器：添加 Token
  instance.interceptors.request.use((reqConfig) => {
    const token = getToken();
    if (token && reqConfig.headers) {
      reqConfig.headers.Authorization = `Bearer ${token}`;
    }
    return reqConfig;
  });

  // 响应拦截器：处理认证错误
  instance.interceptors.response.use(
    (response) => response.data,
    (error) => {
      if (error.response) {
        const status = error.response.status;
        if (status === 401) {
          tokenExpiredCallback?.(401, '登录已过期，请重新登录');
        } else if (status === 403) {
          tokenExpiredCallback?.(403, '没有权限访问该资源');
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

/** 设置 Token 过期回调 */
export function setTokenExpiredCallback(cb: (code: number, message: string) => void): void {
  tokenExpiredCallback = cb;
}

// ---- 初始化 ----

/**
 * 初始化 Agent Chat 配置
 * 在应用入口处调用
 */
export function initAgentChatConfig(config: AgentChatConfig = {}): void {
  // 合并配置
  globalConfig = {
    tokenStorage: {
      ...globalConfig.tokenStorage,
      ...config.tokenStorage,
    },
    api: {
      ...globalConfig.api,
      ...config.api,
    },
    websocket: {
      ...globalConfig.websocket,
      ...config.websocket,
    },
  };

  // 如果提供了初始 token，立即设置
  if (config.tokenStorage?.token) {
    setToken(config.tokenStorage.token);
  }

  // 创建 axios 实例
  axiosInstance = createApiInstance(globalConfig.api);

  // 将实例注入到 api-gateway，统一全局实例管理（messagesApi/usersApi 等依赖该实例）
  setApiInstance(axiosInstance);

  // 创建并配置 SSE 客户端，与 axios 共享相同的认证逻辑
  const sseClient = new SSEClient({
    baseURL: globalConfig.api.baseUrl,
    timeout: 30000,
  });

  // 请求拦截器：自动注入 token（与 axios 拦截器逻辑一致）
  sseClient.addRequestInterceptor((reqConfig) => {
    const token = getToken();
    if (token) {
      reqConfig.headers = {
        ...reqConfig.headers,
        'Authorization': `Bearer ${token}`,
      };
    }
    return reqConfig;
  });

  // 响应拦截器：处理 token 异常（401/403 触发过期回调）
  sseClient.addResponseInterceptor({
    onError: (error) => {
      if (error.message.includes('401')) {
        console.error('[SSE] Token 异常:', error.message);
        tokenExpiredCallback?.(401, '登录已过期，请重新登录');
      } else if (error.message.includes('403')) {
        console.error('[SSE] Token 异常:', error.message);
        tokenExpiredCallback?.(403, '没有权限访问该资源');
      }
      return error;
    },
  });

  setSSEClient(sseClient);
}

/** 获取当前完整配置 */
export function getConfig(): Required<AgentChatConfig> {
  return { ...globalConfig };
}

/** 获取 WebSocket 配置 */
export function getWebSocketConfig(): WebSocketConfig {
  return { ...globalConfig.websocket };
}
