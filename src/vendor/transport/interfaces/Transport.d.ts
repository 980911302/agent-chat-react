import { BaseController, FuncData } from '../core/BaseController.js';
import { TransportMiddler } from './TransportMiddler.js';
/**
 * 通信接口
 */
export declare abstract class ITransport {
    protected transportName: string;
    /**
     * 请求的数据缓存
     */
    protected requestMap: Map<string, {
        su: (data: any) => void;
        er: (data: any) => void;
    }>;
    /**
     * 中间件
     */
    protected middler: TransportMiddler;
    /**
     * 控制器数组
     */
    protected controllers: BaseController[];
    /**
     * 控制器函数列表
     */
    protected controllerMethods: Map<string, FuncData>;
    /**
     * 超时时间
     */
    timeout: number;
    /**
     * 是否已经启动了
     */
    protected isStarting: boolean;
    /**
     * 启动中的 Promise，防止并发调用 start() 创建多个 middler
     */
    private _startingPromise;
    /**
     * 是否已经被释放了
     */
    protected isDisposed: boolean;
    /**
     * 是否打印交流日志
     */
    showLog: boolean;
    /**
     * 构造函数
     * @param middler 通信中间件
     */
    constructor(transportName: string);
    /**
     * 创建中间件
     */
    protected abstract createMiddler(): Promise<TransportMiddler>;
    /**
     * 启动
     */
    start(): Promise<void>;
    /**
     * 实际启动逻辑
     */
    private _doStart;
    /**
     * 请求
     * @param method 请求路径
     * @param data 数据
     */
    request<T>(method: string, data: any[] | Record<string, any>): Promise<T>;
    /**
     *
     * @param method 方法
     * @param spParams 特殊参数
     * @param data 数据
     */
    requestWithParam<T>(method: string, spParams: {
        [key: string]: any;
    }, data: any[] | Record<string, any>): Promise<T>;
    /**
     * 转换字典参数到数组
     * @param params 字典参数（JSON 反序列化后始终为普通对象）
     * @param defineParams 定义的参数
     */
    private convertMapParams;
    /**
     * 处理请求
     * @param request  请求数据
     */
    private handleRequest;
    /**
     * 处理成异常返回
     * @param request 请求来源
     * @param error 错误消息
     * @returns 结果
     */
    private createErrorResponse;
    /**
     * 创建成功的返回值
     * @param request 请求数据
     * @param result 结果
     */
    private createSuccessResponse;
    /**
     * 注册控制器
     * @param controller 控制器
     */
    registerController(controller: BaseController): void;
    /**
     * 注册处理函数
     * @param path 函数路径
     * @param func 函数数据
     */
    registerHandleMethod(path: string, func: Function): void;
    /**
     * 注册处理函数
     * @param path 函数路径
     * @param func 函数数据
     */
    registerHandleMethodWithThis(path: string, func: Function, thaz: any): void;
    /**
     * 注册函数数据
     * @param funcData 函数数据
     */
    registerHandleByFuncData(funcData: FuncData): void;
    /**
     * 转换异常到字符串
     * @param e 异常
     * @returns
     */
    errorToString(e: unknown): string;
    /**
     * 释放资源 事件
     */
    protected abstract onDisposed(): Promise<void>;
    /**
     * 释放资源
     */
    dispose(): Promise<void>;
    /**
     * 是否已经释放了
     */
    get disposed(): boolean;
}
//# sourceMappingURL=Transport.d.ts.map