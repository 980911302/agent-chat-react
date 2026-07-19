import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { usersApi } from '../vendor/api-gateway/index';
import type { User, LoginRequest, LoginResponse } from '../types';
import { getToken, setToken, clearToken, setTokenExpiredCallback } from '../config';
import type { AuthErrorCode } from './chatSlice';

/**
 * 用户状态管理
 * 负责认证、Token、登录/登出
 */

/** Token 异常回调类型（code 可能是 HTTP 状态码或 WebSocket 认证错误码） */
export type TokenExpiredCallback = (code: AuthErrorCode | number, message: string) => void;

export interface UserState {
  /** 当前用户信息 */
  user: User | null;
  /** 访问令牌 */
  token: string | null;
  /** 是否加载中 */
  isLoading: boolean;
}

const initialState: UserState = {
  user: null,
  token: null,
  isLoading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    /** 设置用户信息 */
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    /** 设置 Token */
    setTokenAction(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
      if (action.payload) {
        setToken(action.payload);
      } else {
        clearToken();
      }
    },
    /** 设置加载状态 */
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    /** 清除认证状态 */
    clearAuth(state) {
      state.user = null;
      state.token = null;
      clearToken();
    },
  },
});

export const { setUser, setTokenAction, setLoading, clearAuth } = userSlice.actions;
export default userSlice.reducer;

// ==================== Token 异常处理（模块级，与 Vue 版 userStore 对齐） ====================

/** token 异常回调（登录过期时通知宿主） */
let onTokenExpiredCallback: TokenExpiredCallback | null = null;

/**
 * 注册 token 异常回调
 * 当 HTTP 拦截器捕获 401/403 或 WebSocket 认证失败时触发
 * @param callback 回调函数，接收错误码和错误信息
 */
export const setOnTokenExpiredCallback = (callback: TokenExpiredCallback) => {
  onTokenExpiredCallback = callback;
};

/**
 * 触发 token 异常处理（thunk）
 * 清除本地认证状态并通知宿主注册的回调
 * 供 config 层 401/403 拦截器和 transport 认证失败路径调用
 */
export const triggerTokenExpired =
  (code: AuthErrorCode | number, message: string) =>
  (dispatch: any) => {
    dispatch(clearAuth());
    onTokenExpiredCallback?.(code, message);
  };

// ==================== 异步 Thunk（对齐 Vue 版 user store） ====================

/**
 * 初始化用户（thunk）—— 对齐 Vue 版 init()
 * 1. 注册 config 层的 token 异常处理器（axios/SSE 拦截器 401/403 时触发）
 * 2. 从参数或本地存储恢复 token
 * 3. 有 token 时调用 /users/me 拉取用户信息写入 state
 */
export const initUser =
  (params?: { token?: string }) =>
  async (dispatch: any, getState: () => { user: UserState }) => {
    // 已登录则跳过
    if (getState().user.user) {
      return;
    }

    // 注册 config 层的 token 异常处理器
    setTokenExpiredCallback((code, message) => {
      dispatch(triggerTokenExpired(code, message));
    });

    // 1. 确定 token 来源（参数优先，其次本地存储）
    const resolvedToken = params?.token || getToken();
    if (!resolvedToken) {
      // 无 token，保持未登录状态
      return;
    }

    // 2. 有 token，写入 state 和 config（setTokenAction 内部会同步到 config）
    dispatch(setTokenAction(resolvedToken));

    // 3. 从后端获取当前用户信息
    try {
      const currentUser = await usersApi.getCurrentUser();
      if (currentUser.data) {
        dispatch(setUser(currentUser.data as User));
      }
    } catch (err) {
      console.error('[agent-chat] 获取当前用户信息失败:', err);
    }
  };

/**
 * 用户登录（thunk）—— 对齐 Vue 版 login()
 * 成功后保存 user + token
 */
export const loginUser =
  (data: LoginRequest) =>
  async (dispatch: any): Promise<LoginResponse> => {
    dispatch(setLoading(true));
    try {
      const response = await usersApi.login(data);
      if (response.success && response.data) {
        dispatch(setUser(response.data.user as User));
        dispatch(setTokenAction(response.data.accessToken));
        return response.data as LoginResponse;
      }
      throw new Error(response.error || '登录失败');
    } finally {
      dispatch(setLoading(false));
    }
  };

/**
 * 用户登出（thunk）—— 对齐 Vue 版 logout()
 * 先清除本地状态，再尽力通知后端（后端失败不影响本地清除）
 */
export const logoutUser = () => async (dispatch: any) => {
  dispatch(clearAuth());
  try {
    await usersApi.logout();
  } catch {
    // 忽略后端错误
  }
};

// ---- 选择器 ----

export const selectIsLoggedIn = (state: { user: UserState }) =>
  state.user.user !== null && state.user.token !== null;

export const selectIsAdmin = (state: { user: UserState }) =>
  state.user.user?.role === 'admin';

export const selectIsTenant = (state: { user: UserState }) =>
  state.user.user?.role === 'tenant';

export const selectUser = (state: { user: UserState }) => state.user.user;
export const selectToken = (state: { user: UserState }) => state.user.token;
export const selectUserLoading = (state: { user: UserState }) => state.user.isLoading;
