import * as uuid from 'uuid';
import { extractParamNames } from '../core/RequestAtts.js';
/**
 * 通信接口
 */
export class ITransport {
    transportName;
    /**
     * 请求的数据缓存
     */
    requestMap = new Map();
    /**
     * 中间件
     */
    // @ts-ignore
    middler;
    /**
     * 控制器数组
     */
    controllers = [];
    /**
     * 控制器函数列表
     */
    controllerMethods = new Map();
    /**
     * 超时时间
     */
    timeout = 30000;
    /**
     * 是否已经启动了
     */
    isStarting = false;
    /**
     * 启动中的 Promise，防止并发调用 start() 创建多个 middler
     */
    _startingPromise = null;
    /**
     * 是否已经被释放了
     */
    isDisposed = false;
    /**
     * 是否打印交流日志
     */
    showLog = false;
    /**
     * 构造函数
     * @param middler 通信中间件
     */
    constructor(transportName) {
        this.transportName = transportName;
    }
    /**
     * 启动
     */
    async start() {
        if (this.isStarting)
            return;
        if (this._startingPromise)
            return this._startingPromise;
        this._startingPromise = this._doStart();
        return this._startingPromise;
    }
    /**
     * 实际启动逻辑
     */
    async _doStart() {
        this.middler = await this.createMiddler();
        this.middler.addListener((buffer) => {
            const data = JSON.parse(buffer);
            if (this.showLog)
                console.log(`[${this.transportName}] <--- `, data);
            // 如果是回复
            if (data.type === 'response' || data.result) {
                if (this.requestMap.has(data.id)) {
                    const item = this.requestMap.get(data.id);
                    if (item) {
                        if (data.error) {
                            item.er(data.error.message);
                        }
                        else {
                            item.su(data.result);
                        }
                    }
                }
            }
            // 否则是处理请求
            else {
                this.handleRequest(data).then(res => {
                    this.middler.postMessage(JSON.stringify(res));
                });
            }
        });
        this.isStarting = true;
    }
    /**
     * 请求
     * @param method 请求路径
     * @param data 数据
     */
    request(method, data) {
        return this.requestWithParam(method, {}, data);
    }
    /**
     *
     * @param method 方法
     * @param spParams 特殊参数
     * @param data 数据
     */
    requestWithParam(method, spParams, data) {
        if (this.isDisposed)
            throw new Error(`当前 : ${this.transportName} 已经被释放，无法进行请求!`);
        if (!this.isStarting)
            throw new Error(`当前 : ${this.transportName} 还未开始，无法进行请求!`);
        const request = {
            id: uuid.v4().toString(),
            type: 'request',
            method,
            params: data,
            ...spParams
        };
        if (this.showLog)
            console.log(`[${this.transportName}] ---> `, request);
        return new Promise((s, e) => {
            let checkId = 0;
            if (this.timeout > 0) {
                checkId = setTimeout(() => {
                    const option = this.requestMap.get(request.id);
                    if (option) {
                        this.requestMap.delete(request.id);
                        option?.er('执行超时!');
                    }
                }, this.timeout);
            }
            this.requestMap.set(request.id, {
                su: (d) => {
                    if (this.timeout > 0)
                        clearTimeout(checkId);
                    s(d);
                },
                er: (d) => {
                    if (this.timeout > 0)
                        clearTimeout(checkId);
                    if (this.showLog)
                        console.warn(`[${this.transportName}] : receive error -> ${d}`);
                    e(new Error(d));
                },
            });
            // 发送请求
            this.middler.postMessage(JSON.stringify(request));
        });
    }
    /**
     * 转换字典参数到数组
     * @param params 字典参数（JSON 反序列化后始终为普通对象）
     * @param defineParams 定义的参数
     */
    convertMapParams(params, defineParams) {
        const targetParams = [];
        // 定义参数
        for (var i = 0; i < defineParams.length; i++) {
            const paramData = defineParams[i];
            if (!paramData) {
                throw new Error(`异常参数....`);
            }
            if (!(paramData.name in params)) {
                throw new Error(`未找到参数 : ${paramData.name}`);
            }
            targetParams.push(params[paramData.name]);
        }
        return targetParams;
    }
    /**
     * 处理请求
     * @param request  请求数据
     */
    async handleRequest(request) {
        try {
            // 获取处理函数
            const funcData = this.controllerMethods.get(request.method);
            if (!funcData) {
                throw new Error(`未找到请求方法 : ${request.method}`);
            }
            // 调用处理方法
            let res;
            if (Array.isArray(request.params)) {
                // 如果参数是数组，直接展开
                res = funcData.method.call(funcData._this, ...request.params);
            }
            else {
                const targetParams = this.convertMapParams(request.params, funcData.params);
                res = funcData.method.call(funcData._this, ...targetParams);
            }
            // 结果
            if (res instanceof Promise) {
                res = await res;
            }
            return this.createSuccessResponse(request, res);
        }
        catch (e) {
            return this.createErrorResponse(request, e);
        }
    }
    /**
     * 处理成异常返回
     * @param request 请求来源
     * @param error 错误消息
     * @returns 结果
     */
    createErrorResponse(request, error) {
        return {
            id: request.id,
            method: request.method,
            type: 'response',
            error: {
                code: -500,
                message: this.errorToString(error)
            }
        };
    }
    /**
     * 创建成功的返回值
     * @param request 请求数据
     * @param result 结果
     */
    createSuccessResponse(request, result) {
        return {
            id: request.id,
            method: request.method,
            result,
            type: 'response'
        };
    }
    /**
     * 注册控制器
     * @param controller 控制器
     */
    registerController(controller) {
        this.controllers.push(controller);
        for (const func of controller.getAllHandleFunctions()) {
            this.controllerMethods.set(func[0], func[1]);
        }
    }
    /**
     * 注册处理函数
     * @param path 函数路径
     * @param func 函数数据
     */
    registerHandleMethod(path, func) {
        this.registerHandleMethodWithThis(path, func, null);
    }
    /**
     * 注册处理函数
     * @param path 函数路径
     * @param func 函数数据
     */
    registerHandleMethodWithThis(path, func, thaz) {
        const funcData = {
            _this: thaz,
            method: func,
            path: path,
            params: extractParamNames(func)
        };
        this.registerHandleByFuncData(funcData);
    }
    /**
     * 注册函数数据
     * @param funcData 函数数据
     */
    registerHandleByFuncData(funcData) {
        if (!this.controllerMethods.has(funcData.path))
            this.controllerMethods.set(funcData.path, funcData);
        // else
        // console.warn(`[${this.transportName}] : 重复注册 : ${funcData.path}`);
    }
    /**
     * 转换异常到字符串
     * @param e 异常
     * @returns
     */
    errorToString(e) {
        if (typeof e === 'string') {
            return e;
        }
        else if (e instanceof Error) {
            return e.message;
        }
        else {
            return JSON.stringify(e);
        }
    }
    /**
     * 释放资源
     */
    async dispose() {
        if (this.disposed)
            return;
        // 先标记为已释放，阻止新的请求
        this.isDisposed = true;
        // 清理所有 pending 请求及其超时计时器
        for (const [, item] of this.requestMap) {
            item.er(new Error(`通道 [${this.transportName}] 已释放，请求被取消`));
        }
        this.requestMap.clear();
        // 清理控制器引用
        this.controllerMethods.clear();
        this.controllers.length = 0;
        await this.onDisposed();
    }
    /**
     * 是否已经释放了
     */
    get disposed() {
        return this.isDisposed;
    }
}
//# sourceMappingURL=Transport.js.map