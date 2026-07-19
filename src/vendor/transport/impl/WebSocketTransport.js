import { ITransport } from "../interfaces/Transport.js";
/**
 * websocket 通道
 */
export class WebSocketTransport extends ITransport {
    reconnectDelay;
    /**
     * websocket 通信
     */
    // @ts-ignore
    ws;
    /**
     * 连接字符串
     */
    linkStr;
    /**
     * 消息处理
     */
    wsMessageHandle = (m) => { console.log(`[receive] <--- ${m}`); };
    /**
     * 重连事件
     */
    onReconnectedEvent = (t) => console.log(`${t.transportName} 重新连接成功!`);
    /**
     * 已连接事件
     */
    onConnectedEvent = (t) => console.log(`${t.transportName} 已连接!`);
    /**
     * 断开连接事件
     */
    onDisconnectedEvent = (t) => console.log(`${t.transportName} 断开连接!`);
    /**
     * 构造函数
     * @param transportName 通道名称
     * @param host 主机地址
     * @param port 端口
     * @param wsPath 路径
     * @param reconnectDelay 重连超时
     */
    constructor(transportName, host, port, wsPath, reconnectDelay = 1000) {
        super(transportName);
        this.reconnectDelay = reconnectDelay;
        this.linkStr = `ws://${host}:${port}/${wsPath.startsWith('/') ? wsPath.substring(1) : wsPath}`;
    }
    /**
     * 清理旧的 WebSocket 连接，防止事件处理器泄漏和连接风暴
     */
    cleanupWs() {
        if (this.ws) {
            this.ws.onopen = null;
            this.ws.onerror = null;
            this.ws.onclose = null;
            this.ws.onmessage = null;
            if (this.ws.readyState !== WebSocket.CLOSED) {
                this.ws.close();
            }
            // @ts-ignore
            this.ws = null;
        }
    }
    /**
     * 重连
     */
    connect() {
        // 清理旧连接，移除事件处理器，避免连接风暴
        this.cleanupWs();
        return new Promise((su, er) => {
            this.ws = new WebSocket(this.linkStr);
            this.ws.onopen = () => {
                if (this.isStarting)
                    this.onReconnectedEvent(this);
                if (this.showLog) {
                    console.log(`[${this.transportName}] : 连接成功!`);
                }
                su(true);
                this.onConnectedEvent(this);
            };
            this.ws.onerror = (e) => {
                er(e);
            };
            this.ws.onclose = () => {
                this.onDisconnectedEvent(this);
                if (this.isStarting) {
                    if (this.showLog)
                        console.log(`[${this.transportName}] : 断开连接!`);
                    // 重连逻辑
                    setTimeout(() => this.reconnect(), this.reconnectDelay);
                }
                else {
                    er(`[${this.transportName}] : 连接失败!`);
                }
            };
            this.ws.onmessage = (data) => {
                if (this.wsMessageHandle)
                    this.wsMessageHandle(data.data);
            };
        });
    }
    /**
     * 重新连接
     */
    reconnect() {
        if (!this.isConnected() && !this.disposed) {
            this.connect().catch(() => {
                setTimeout(() => this.reconnect(), this.reconnectDelay);
            });
        }
    }
    /**
     * 是否已经连接了
     */
    isConnected() {
        return this.ws?.readyState === WebSocket.OPEN;
    }
    /**
     * 等待固定时间
     * @param timeout 等待时间
     */
    sleep(timeout) {
        return new Promise((su, er) => {
            setTimeout(su, timeout);
        });
    }
    /**
     * 等待连接
     * @param timeout 超时时间（毫秒）
     */
    async waitForConnect(timeout) {
        const deadline = Date.now() + timeout;
        while ((!this.isConnected() || !this.isStarting) && Date.now() < deadline) {
            await this.sleep(500);
        }
        return this.isConnected();
    }
    /**
     * 创建通信中间件
     */
    async createMiddler() {
        while (true) {
            try {
                await this.connect();
                break;
            }
            catch (e) {
                console.log('尝试重新连接...');
                await this.sleep(this.reconnectDelay);
            }
        }
        // if(!res) 
        //     throw new Error('连接失败!');
        return {
            postMessage: (message) => {
                if (!this.isConnected()) {
                    throw new Error(`连接 : ${this.linkStr} 已经断开...`);
                }
                this.ws.send(message);
            },
            addListener: (event) => {
                this.wsMessageHandle = event;
            },
            removeListener: (event) => {
                this.wsMessageHandle = (m) => { console.log(`[receive] <--- ${m}`); };
            }
        };
    }
    /**
     * 释放事件
     */
    async onDisposed() {
        if (this.ws) {
            this.ws.close(1000, `客户端[${this.transportName}]主动断开连接`);
        }
        this.cleanupWs();
    }
}
//# sourceMappingURL=WebSocketTransport.js.map