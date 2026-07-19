import { BaseController, ParamData } from "./BaseController.js";
/**
 * 新增一个工具函数来提取参数名
 * @param func 函数
 * @returns 参数数据
 */
declare function extractParamNames(func: Function): ParamData[];
/**
 * 方法注解
 * @param key 函数所在控制器的key
 * @param path 方法所在的路径
 * @returns
 */
declare function RequestAttribute<T>(key: string, path: string): (target: BaseController, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T>;
export { RequestAttribute, extractParamNames };
//# sourceMappingURL=RequestAtts.d.ts.map