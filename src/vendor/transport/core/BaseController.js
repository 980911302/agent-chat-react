/**
 * 基础controller
 */
export class BaseController {
    /**
     * 未处理的映射函数
     */
    static __un_handle_methods = new Map();
    /**
     * 处理后的映射函数
     */
    __handled_methods = new Map();
    /**
     * controller的key
     */
    key = "";
    constructor(key) {
        this.key = key;
        if (BaseController.__un_handle_methods.has(this.key)) {
            const data = BaseController.__un_handle_methods.get(this.key);
            let func = undefined;
            while ((func = data?.pop()) !== undefined) {
                func.call(this, this);
            }
            // BaseController.__un_handle_methods.delete(this.key)
        }
        else
            throw Error('不能重复注册， 或者未添加处理函数!');
        // console.log('注册 : ', this.key)
    }
    /**
     * 设置处理函数
     * @param funcData 处理函数
     */
    setHandleFunction(funcData) {
        this.__handled_methods.set(funcData.path, funcData);
    }
    /**
     * 获取处理函数
     * @param path 路径
     */
    getHandleFunction(path) {
        return this.__handled_methods.get(path);
    }
    /**
     * 获取所有的处理函数
     * @returns 函数列表
     */
    getAllHandleFunctions() {
        return this.__handled_methods;
    }
}
//# sourceMappingURL=BaseController.js.map