/**
 * WebSocket 配置
 */
export interface WebSocketConfig {
    /** 主机地址 */
    host: string;
    /** 端口 */
    port: number;
    /** WebSocket 路径 */
    path: string;
    /** 重连延迟 (ms) */
    reconnectDelay: number;
    /** 健康检查间隔 (ms) */
    healthCheckInterval: number;
}

let _config: WebSocketConfig = {
    host: 'localhost',
    port: 3000,
    path: 'ws',
    reconnectDelay: 5000,
    healthCheckInterval: 10000
};

/**
 * 设置 WebSocket 配置
 * @param config 配置项（部分更新）
 */
export function setWebSocketConfig(config: Partial<WebSocketConfig>) {
    _config = { ..._config, ...config };
}

/**
 * 获取当前 WebSocket 配置
 */
export function getWebSocketConfig(): WebSocketConfig {
    return _config;
}
