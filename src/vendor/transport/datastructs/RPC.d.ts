/**
 * 通信协议
 */
export interface JSONRPC {
    /**
     * 通信id
     */
    id: string;
    /**
     * 请求路径
     */
    method: string;
    /**
     * 数据
     */
    params?: Array<any> | Record<string, any>;
    /**
     * 请求类型
     */
    type: 'request' | 'response';
    /**
     * 元数据
     */
    metadata?: {
        auth: string;
        version: string;
    };
    /**
     * 请求返回结果
     */
    result?: any;
    /**
     * 错误信息
     */
    error?: {
        code: number;
        message: string;
        data?: any;
    };
}
//# sourceMappingURL=RPC.d.ts.map