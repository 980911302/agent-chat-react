import { ITransport } from "../interfaces/Transport.js";
import { TransportMiddler } from "../interfaces/TransportMiddler.js";
/**
 * websocket 通道
 */
export declare class WebSocketTransport extends ITransport {
    private reconnectDelay;
    /**
     * websocket 通信
     */
    private ws;
    /**
     * 连接字符串
     */
    private linkStr;
    /**
     * 消息处理
     */
    private wsMessageHandle;
    /**
     * 重连事件
     */
    onReconnectedEvent: (t: WebSocketTransport) => void;
    /**
     * 已连接事件
     */
    onConnectedEvent: (t: WebSocketTransport) => void;
    /**
     * 断开连接事件
     */
    onDisconnectedEvent: (t: WebSocketTransport) => void;
    /**
     * 构造函数
     * @param transportName 通道名称
     * @param host 主机地址
     * @param port 端口
     * @param wsPath 路径
     * @param reconnectDelay 重连超时
     */
    constructor(transportName: string, host: string, port: number, wsPath: string, reconnectDelay?: number);
    /**
     * 清理旧的 WebSocket 连接，防止事件处理器泄漏和连接风暴
     */
    private cleanupWs;
    /**
     * 重连
     */
    protected connect(): Promise<boolean>;
    /**
     * 重新连接
     */
    protected reconnect(): void;
    /**
     * 是否已经连接了
     */
    isConnected(): boolean;
    /**
     * 等待固定时间
     * @param timeout 等待时间
     */
    sleep(timeout: number): Promise<void>;
    /**
     * 等待连接
     * @param timeout 超时时间（毫秒）
     */
    waitForConnect(timeout: number): Promise<boolean>;
    /**
     * 创建通信中间件
     */
    protected createMiddler(): Promise<TransportMiddler>;
    /**
     * 释放事件
     */
    protected onDisposed(): Promise<void>;
}
//# sourceMappingURL=WebSocketTransport.d.ts.map