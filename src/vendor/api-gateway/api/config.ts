import type { IPowerClawConfig } from '../types/common-interfaces.js';
import { getApiInstance } from '../client.js';
import type { ApiResponse } from '../client.js';

export const configApi = {
    /**
     * 获取配置
     * @returns 配置
     */
    get: () => getApiInstance().get<any, ApiResponse<IPowerClawConfig>>('/config'),

    /**
     * 更新配置
     * @param config 配置
     * @returns 配置
     */
    update: (config: Partial<IPowerClawConfig>) =>
        getApiInstance().put<any, ApiResponse<IPowerClawConfig>>('/config', config)
};
