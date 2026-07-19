/**
 * 通信中间件
 */
export interface TransportMiddler {
    /**
     * 发送数据
     * @param data 数据
     */
    postMessage(data: string): void;
    /**
     * 添加监听
     * @param event 回调事件
     */
    addListener(event: (data: string) => void): void;
    /**
     * 删除监听
     * @param path 路径
     */
    removeListener(event: (data: string) => void): void;
}
//# sourceMappingURL=TransportMiddler.d.ts.map