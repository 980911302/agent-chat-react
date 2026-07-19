/**
 * 新增一个工具函数来提取参数名
 * @param func 函数
 * @returns 参数数据
 */
function extractParamNames(func) {
    const funcString = func.toString();
    // 先尝试匹配带括号的参数 (param1, param2, ...)，再匹配不带括号的单参数箭头函数 param =>
    const paramsMatch = funcString.match(/\(([^)]*)\)/) ?? // 带括号: (a, b) 或 (Se)
        funcString.match(/^([a-zA-Z_$][\w$]*)\s*=>/); // 无括号单参数: Se =>
    if (!paramsMatch) {
        console.log(`1.异常的参数信息 : ${funcString}`);
        throw new Error('读取参数异常...');
    }
    const paramsString = paramsMatch[1];
    if (!paramsString) {
        // console.log(`2.异常的参数信息 : ${funcString}`, ', paramsString : ', paramsString, ', paramsMatch : ', paramsMatch);
        // throw new Error('读取参数异常...');
        return [];
    }
    var index = 0;
    return paramsString
        .split(',')
        .map((param) => {
        var data = {
            name: param,
            index: index++
        };
        return data;
    });
}
/**
 * 方法注解
 * @param key 函数所在控制器的key
 * @param path 方法所在的路径
 * @returns
 */
function RequestAttribute(key, path) {
    return (target, propertyKey, descriptor) => {
        const constructor = Object.getPrototypeOf(target).constructor;
        // 得是有 __un_handle_methods 静态属性的类
        if (constructor && constructor.__un_handle_methods) {
            // 未处理函数
            const unhandles = constructor.__un_handle_methods;
            var funcs = null;
            if (!unhandles.has(key)) {
                funcs = [];
                unhandles.set(key, funcs);
            }
            else {
                funcs = unhandles.get(key);
            }
            // 推送一个函数
            funcs.push((_this) => {
                const funcData = {
                    _this: _this,
                    method: descriptor.value,
                    path: key + '/' + path,
                    params: extractParamNames(descriptor.value)
                };
                _this.setHandleFunction(funcData);
            });
        }
        return descriptor;
    };
}
export { RequestAttribute, extractParamNames };
//# sourceMappingURL=RequestAtts.js.map