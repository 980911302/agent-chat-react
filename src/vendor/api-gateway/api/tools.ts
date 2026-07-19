import type { ITools } from '../types/common-interfaces.js';
import { getApiInstance } from '../client.js';
import type { ApiResponse } from '../client.js';

export const toolsApi = {
    // 获取所有工具
    getAll: () => getApiInstance().get<any, ApiResponse<ITools[]>>('/tools'),

    // 获取单个工具
    getOne: (name: string) => getApiInstance().get<any, ApiResponse<ITools>>(`/tools/${name}`),

    // 测试工具
    test: (toolName: string, params: any) =>
        getApiInstance().post<any, ApiResponse>(`/tools/${toolName}/test`, params),

};
