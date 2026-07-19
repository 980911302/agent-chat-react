import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

let _api: AxiosInstance | undefined;

/**
 * 设置全局 axios 实例
 * @param instance axios 实例
 */
export function setApiInstance(instance: AxiosInstance) {
    _api = instance;
}

/**
 * 获取全局 axios 实例
 * @returns axios 实例
 */
export function getApiInstance(): AxiosInstance {
    if (!_api) {
        throw new Error(
            'API instance not set. Please call setApiInstance() before using API methods.'
        );
    }
    return _api;
}

/**
 * 创建带标准拦截器的 axios 实例
 * @param baseURL 基础 URL
 * @param getToken 获取 token 的函数
 * @param onUnauthorized 401 时的回调
 * @returns axios 实例
 */
export async function createStandardInstance(
    baseURL: string,
    options?: {
        getToken?: () => string | null;
        onUnauthorized?: () => void;
    }
): Promise<AxiosInstance> {
    // 动态导入 axios 以支持浏览器环境
    const axios = (await import('axios')).default;

    const instance: AxiosInstance = axios.create({
        baseURL,
        timeout: 30000,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    // 请求拦截器：自动附加 Token
    instance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            const token = options?.getToken?.();
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // 响应拦截器：提取 data 并统一处理 401
    instance.interceptors.response.use(
        (response: AxiosResponse) => response.data,
        (error) => {
            if (error.response?.status === 401) {
                options?.onUnauthorized?.();
            }
            const message = error.response?.data?.error || error.message || '请求失败';
            return Promise.reject(new Error(message));
        }
    );

    return instance;
}

// 响应类型定义
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    warning?: string;
}
