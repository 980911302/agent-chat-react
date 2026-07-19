import { getApiInstance } from '../client.js';
import type { ApiResponse } from '../client.js';

/**
 * 日志流连接选项
 */
export interface LogStreamOptions {
    /** 接收到新日志时的回调 */
    onMessage: (message: string) => void;
    /** 连接错误时的回调 */
    onError?: (error: Error) => void;
    /** 连接关闭时的回调 */
    onClose?: () => void;
    /** 获取 token 的函数，用于认证 */
    getToken?: () => string | null;
}

/**
 * 日志流连接控制器
 */
export interface LogStreamController {
    /** 中断连接 */
    abort: () => void;
}

/**
 * 日志缓冲区数据
 */
export interface LogBuffer {
    logs: string[];
    count: number;
}

/**
 * 日志 API 模块
 */
export const logsApi = {
    /**
     * 获取日志缓冲区内容
     */
    getBuffer: () =>
        getApiInstance().get<any, ApiResponse<LogBuffer>>('/logs/buffer'),

    /**
     * 连接到日志流
     * 使用原生 fetch 实现流式读取，自动附加认证 token
     * @param options 连接选项
     * @returns 控制器，可用于中断连接
     */
    stream: (options: LogStreamOptions): LogStreamController => {
        const controller = new AbortController();
        const { signal } = controller;

        // 获取 base URL 和 token
        const instance = getApiInstance();
        const baseURL = instance.defaults.baseURL || '';
        const url = `${baseURL}/logs/stream`;

        // 获取 token：优先使用传入的函数，其次从 axios 拦截器获取
        const token = options.getToken?.() || null;

        // 发起流式请求
        (async () => {
            try {
                const headers: Record<string, string> = {};
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                const response = await fetch(url, {
                    signal,
                    headers
                });

                if (!response.ok) {
                    const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
                    options.onError?.(error);
                    return;
                }

                const reader = response.body?.getReader();
                if (!reader) {
                    const error = new Error('Response body is not readable');
                    options.onError?.(error);
                    return;
                }

                const decoder = new TextDecoder();
                let buffer = '';

                // 持续读取流数据
                while (true) {
                    const { done, value } = await reader.read();

                    if (done) {
                        break;
                    }

                    // 解码数据块
                    buffer += decoder.decode(value, { stream: true });

                    // 按行处理
                    const lines = buffer.split('\n');
                    buffer = lines.pop() || ''; // 保留不完整的行

                    for (const line of lines) {
                        const message = line.trimEnd();
                        if (message) {
                            options.onMessage(message);
                        }
                    }
                }

                options.onClose?.();
            } catch (error: any) {
                if (error.name === 'AbortError') {
                    // 用户主动中断，触发关闭回调
                    options.onClose?.();
                } else {
                    options.onError?.(error);
                }
            }
        })();

        return {
            abort: () => controller.abort()
        };
    }
};
