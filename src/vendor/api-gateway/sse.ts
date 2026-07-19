/**
 * SSE（Server-Sent Events）客户端管理类
 *
 * 支持 GET 和 POST 请求的 SSE 连接，提供类似 axios 的拦截器机制。
 * - GET 请求使用原生 EventSource
 * - POST 等非 GET 请求使用 fetch + ReadableStream 解析 SSE
 */

/** SSE 请求配置 */
export interface SSERequestConfig {
    /** 请求 URL（相对或绝对路径） */
    url: string;
    /** 请求方法，默认 GET */
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    /** 请求头 */
    headers?: Record<string, string>;
    /** 请求体（POST/PUT/PATCH 时使用） */
    body?: BodyInit | null;
    /** 是否自动重连，默认 false */
    autoReconnect?: boolean;
    /** 重连延迟（毫秒），默认 3000 */
    reconnectDelay?: number;
    /** 最大重连次数，默认 5 */
    maxReconnects?: number;
    /** 超时时间（毫秒），0 表示不超时 */
    timeout?: number;
    /** 用于中止请求的 AbortSignal */
    signal?: AbortSignal;
}

/** SSE 事件回调 */
export interface SSEEventHandlers {
    /** 收到消息（解析 data 字段后的值） */
    onMessage?: (data: string, eventType: string, raw: MessageEvent) => void;
    /** 指定事件类型的回调 */
    onEvent?: Record<string, (data: string, raw: MessageEvent) => void>;
    /** 连接建立 */
    onOpen?: (event: Event) => void;
    /** 连接错误 */
    onError?: (event: Event | Error) => void;
    /** 连接关闭（fetch 模式下流结束时触发） */
    onClose?: () => void;
}

/** 请求拦截器：可修改配置或返回拒绝 */
export type SSERequestInterceptor = (
    config: SSERequestConfig
) => SSERequestConfig | Promise<SSERequestConfig>;

/** 响应/错误拦截器 */
export interface SSEResponseInterceptor {
    /** 收到数据时调用，返回 false 可阻止后续处理 */
    onMessage?: (data: string, eventType: string) => boolean | void;
    /** 错误发生时调用 */
    onError?: (error: Error) => Error | void;
}

/** SSE 连接实例 */
export interface SSEConnection {
    /** 关闭连接 */
    close: () => void;
    /** 连接是否活跃 */
    readonly active: boolean;
}

/**
 * SSE 客户端管理器
 *
 * @example
 * ```ts
 * const sse = new SSEClient({ baseURL: '/api' });
 *
 * // 添加请求拦截器（注入 token）
 * sse.addRequestInterceptor((config) => {
 *   config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
 *   return config;
 * });
 *
 * // GET 方式（原生 EventSource）
 * sse.connect({ url: '/events' }, {
 *   onMessage: (data) => console.log(data),
 *   onEvent: { progress: (data) => console.log('progress', data) }
 * });
 *
 * // POST 方式（fetch + SSE 解析）
 * sse.connect({ url: '/import', method: 'POST', body: formData }, {
 *   onEvent: {
 *     progress: (data) => console.log('progress', JSON.parse(data)),
 *     done: (data) => console.log('done', JSON.parse(data)),
 *     error: (data) => console.error(data)
 *   }
 * });
 * ```
 */
export class SSEClient {
    private baseURL: string;
    private timeout: number;
    private requestInterceptors: SSERequestInterceptor[] = [];
    private responseInterceptors: SSEResponseInterceptor[] = [];

    constructor(options?: { baseURL?: string; timeout?: number }) {
        this.baseURL = options?.baseURL || '';
        this.timeout = options?.timeout || 0;
    }

    /** 添加请求拦截器，返回移除函数 */
    addRequestInterceptor(interceptor: SSERequestInterceptor): () => void {
        this.requestInterceptors.push(interceptor);
        return () => {
            const idx = this.requestInterceptors.indexOf(interceptor);
            if (idx !== -1) this.requestInterceptors.splice(idx, 1);
        };
    }

    /** 添加响应拦截器，返回移除函数 */
    addResponseInterceptor(interceptor: SSEResponseInterceptor): () => void {
        this.responseInterceptors.push(interceptor);
        return () => {
            const idx = this.responseInterceptors.indexOf(interceptor);
            if (idx !== -1) this.responseInterceptors.splice(idx, 1);
        };
    }

    /**
     * 建立 SSE 连接
     * - GET 请求使用原生 EventSource
     * - 非 GET 请求使用 fetch + 流式 SSE 解析
     */
    connect(config: SSERequestConfig, handlers: SSEEventHandlers): SSEConnection {
        // 合并默认配置
        const fullConfig: SSERequestConfig = {
            ...config,
            headers: { ...config.headers },
            timeout: config.timeout ?? this.timeout,
        };

        // GET 请求且无自定义 header → 使用原生 EventSource
        const method = (config.method || 'GET').toUpperCase();
        const hasCustomHeaders = config.headers && Object.keys(config.headers).length > 0;

        if (method === 'GET' && !hasCustomHeaders) {
            return this.connectWithEventSource(fullConfig, handlers);
        }

        return this.connectWithFetch(fullConfig, handlers);
    }

    /** 使用原生 EventSource 建立 GET 连接 */
    private connectWithEventSource(config: SSERequestConfig, handlers: SSEEventHandlers): SSEConnection {
        let active = true;
        let es: EventSource | null = null;
        let reconnectCount = 0;
        let closed = false;

        const maxReconnects = config.maxReconnects ?? 5;
        const reconnectDelay = config.reconnectDelay ?? 3000;

        const handleSSEEvent = (data: string, eventType: string, event: MessageEvent) => {
            if (!active) return;

            // 执行响应拦截器
            for (const interceptor of this.responseInterceptors) {
                if (interceptor.onMessage) {
                    const result = interceptor.onMessage(data, eventType);
                    if (result === false) return; // 拦截器阻止
                }
            }

            handlers.onMessage?.(data, eventType, event);
            handlers.onEvent?.[eventType]?.(data, event);
        };

        const doConnect = async () => {
            if (closed) return;

            // 执行请求拦截器
            let intercepted = { ...config };
            for (const interceptor of this.requestInterceptors) {
                try {
                    intercepted = await interceptor(intercepted);
                } catch {
                    return; // 拦截器拒绝
                }
            }

            const url = this.resolveURL(intercepted.url);
            es = new EventSource(url);

            es.onopen = (event) => {
                reconnectCount = 0;
                handlers.onOpen?.(event);
            };

            // 默认 message 事件（无 event: 字段的 SSE 行）
            es.onmessage = (event) => {
                handleSSEEvent(event.data, 'message', event);
            };

            // 为每个自定义事件类型注册监听器
            if (handlers.onEvent) {
                for (const eventType of Object.keys(handlers.onEvent)) {
                    if (eventType === 'message') continue; // 已由 onmessage 处理
                    es.addEventListener(eventType, (event) => {
                        handleSSEEvent((event as MessageEvent).data, eventType, event as MessageEvent);
                    });
                }
            }

            es.onerror = (event) => {
                handlers.onError?.(event);

                // 自动重连
                if (config.autoReconnect && reconnectCount < maxReconnects && !closed) {
                    reconnectCount++;
                    es?.close();
                    setTimeout(doConnect, reconnectDelay);
                } else {
                    active = false;
                    handlers.onClose?.();
                }
            };
        };

        doConnect();

        return {
            close: () => {
                closed = true;
                active = false;
                es?.close();
                handlers.onClose?.();
            },
            get active() { return active; }
        };
    }

    /** 使用 fetch 建立非 GET SSE 连接 */
    private connectWithFetch(config: SSERequestConfig, handlers: SSEEventHandlers): SSEConnection {
        let active = true;
        let controller = new AbortController();
        let reconnectCount = 0;

        const maxReconnects = config.maxReconnects ?? 5;
        const reconnectDelay = config.reconnectDelay ?? 3000;

        // 支持外部 AbortSignal：已中止则不连接，未中止则监听中止事件
        if (config.signal) {
            if (config.signal.aborted) {
                active = false;
                handlers.onError?.(new Error('请求已中止'));
                handlers.onClose?.();
                return { close: () => {}, get active() { return false; } };
            }
            config.signal.addEventListener('abort', () => {
                controller.abort();
            }, { once: true });
        }

        const doConnect = async () => {
            if (!active) return;

            // 执行请求拦截器
            let intercepted = { ...config };
            for (const interceptor of this.requestInterceptors) {
                try {
                    intercepted = await interceptor(intercepted);
                } catch (err) {
                    handlers.onError?.(err instanceof Error ? err : new Error(String(err)));
                    return;
                }
            }

            const url = this.resolveURL(intercepted.url);
            const headers: Record<string, string> = {
                'Accept': 'text/event-stream',
                ...intercepted.headers,
            };

            try {
                // 超时控制
                let timeoutId: ReturnType<typeof setTimeout> | undefined;
                if (intercepted.timeout && intercepted.timeout > 0) {
                    timeoutId = setTimeout(() => controller.abort(), intercepted.timeout);
                }

                const response = await fetch(url, {
                    method: intercepted.method || 'GET',
                    headers,
                    body: intercepted.body,
                    signal: controller.signal,
                });

                if (timeoutId) clearTimeout(timeoutId);

                if (!response.ok) {
                    // 读取错误信息
                    let errorMsg = `SSE 请求失败: ${response.status}`;
                    try {
                        const text = await response.text();
                        const match = text.match(/data:\s*(.*)/);
                        if (match) errorMsg = parseSSEData(match[1].trim());
                    } catch { /* 忽略 */ }

                    let error = new Error(errorMsg);
                    for (const interceptor of this.responseInterceptors) {
                        if (interceptor.onError) {
                            const result = interceptor.onError(error);
                            if (result instanceof Error) error = result;
                        }
                    }
                    handlers.onError?.(error);
                    active = false;
                    handlers.onClose?.();
                    return;
                }

                handlers.onOpen?.(new Event('open'));

                // 流式读取 SSE
                const reader = response.body?.getReader();
                if (!reader) {
                    active = false;
                    handlers.onClose?.();
                    return;
                }

                const decoder = new TextDecoder();
                let buffer = '';
                let eventType = 'message';

                // 处理 SSE 行的辅助函数
                const processLine = (line: string) => {
                    if (line.startsWith('event: ')) {
                        eventType = line.slice(7).trim();
                        return;
                    }

                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);

                        // 执行响应拦截器
                        let interceptedData: string | false = data;
                        for (const interceptor of this.responseInterceptors) {
                            if (interceptor.onMessage) {
                                const result = interceptor.onMessage(data, eventType);
                                if (result === false) {
                                    interceptedData = false;
                                    break;
                                }
                            }
                        }

                        if (interceptedData !== false) {
                            const parsedData = parseSSEData(interceptedData);
                            const mockEvent = new MessageEvent(eventType, { data: parsedData });
                            handlers.onMessage?.(parsedData, eventType, mockEvent);
                            handlers.onEvent?.[eventType]?.(parsedData, mockEvent);
                        }

                        eventType = 'message'; // 重置
                        return;
                    }

                    // SSE 注释行（: 开头）或空行
                    if (line.startsWith(':') || line.trim() === '') {
                        eventType = 'message';
                    }
                };

                while (active) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop() || '';

                    for (const line of lines) {
                        processLine(line);
                    }
                }

                // 处理 buffer 中剩余的数据（流结束时可能还有未处理的事件）
                if (buffer.trim()) {
                    const remainingLines = buffer.split('\n');
                    for (const line of remainingLines) {
                        processLine(line);
                    }
                }

                active = false;
                handlers.onClose?.();

            } catch (err) {
                if (!active) return;

                const error = err instanceof Error ? err : new Error(String(err));

                // AbortError 表示连接被主动关闭
                if (error.name === 'AbortError') {
                    handlers.onClose?.();
                    return;
                }

                handlers.onError?.(error);

                // 自动重连
                if (config.autoReconnect && reconnectCount < maxReconnects && active) {
                    reconnectCount++;
                    controller = new AbortController();
                    setTimeout(doConnect, reconnectDelay);
                } else {
                    active = false;
                    handlers.onClose?.();
                }
            }
        };

        doConnect();

        return {
            close: () => {
                active = false;
                controller.abort();
            },
            get active() { return active; }
        };
    }

    /** 解析完整 URL */
    private resolveURL(url: string): string {
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        const base = this.baseURL.replace(/\/+$/, '');
        const path = url.replace(/^\/+/, '');
        return `${base}/${path}`;
    }
}

/**
 * 尝试解析 SSE data 字段中的 JSON 值
 * gin 的 SSEvent 会将字符串 JSON 编码（如 "错误" → "\"错误\""），
 * 此函数将 JSON 字符串还原为普通字符串，其他类型原样返回。
 */
function parseSSEData(raw: string): string {
    if (raw.length >= 2 && raw.startsWith('"') && raw.endsWith('"')) {
        try {
            const parsed = JSON.parse(raw);
            if (typeof parsed === 'string') return parsed;
        } catch { /* 非合法 JSON，原样返回 */ }
    }
    return raw;
}

/** 全局 SSE 客户端实例 */
let _sseClient: SSEClient | undefined;

/**
 * 设置全局 SSE 客户端实例
 */
export function setSSEClient(client: SSEClient): void {
    _sseClient = client;
}

/**
 * 获取全局 SSE 客户端实例
 */
export function getSSEClient(): SSEClient {
    if (!_sseClient) {
        throw new Error('SSE client not set. Please call setSSEClient() before using SSE methods.');
    }
    return _sseClient;
}
