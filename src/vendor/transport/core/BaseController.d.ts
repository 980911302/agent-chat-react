export interface ParamData {
    /**
     * 参数名称
     */
    name: string;
    /**
     * 参数索引
     */
    index: number;
}
/**
 * 函数数据
 */
export interface FuncData {
    /**
     * 函数指针
     */
    method: Function;
    /**
     * 对象this 指针
     */
    _this: BaseController | any;
    /**
     * 路径
     */
    path: string;
    /**
     * 参数列表
     */
    params: ParamData[];
}
/**
 * 基础controller
 */
export declare class BaseController {
    /**
     * 未处理的映射函数
     */
    static __un_handle_methods: Map<string, Function[]>;
    /**
     * 处理后的映射函数
     */
    private __handled_methods;
    /**
     * controller的key
     */
    key: string;
    constructor(key: string);
    /**
     * 设置处理函数
     * @param funcData 处理函数
     */
    setHandleFunction(funcData: FuncData): void;
    /**
     * 获取处理函数
     * @param path 路径
     */
    getHandleFunction(path: string): FuncData | undefined;
    /**
     * 获取所有的处理函数
     * @returns 函数列表
     */
    getAllHandleFunctions(): Map<string, FuncData>;
}
//# sourceMappingURL=BaseController.d.ts.map