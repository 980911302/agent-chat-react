import type { MCPClientConfig } from '../types/common-interfaces.js';
import { getApiInstance } from '../client.js';
import type { ApiResponse } from '../client.js';

export interface McpService {
    name: string;
    config: MCPClientConfig;
    status: {
        connected: boolean;
        error?: string;
    };
}

export const mcpsApi = {
    /**
     * 获取所有MCP服务列表
     */
    getAll: () => getApiInstance().get<any, ApiResponse<McpService[]>>('/mcps'),

    /**
     * 添加新的MCP服务
     * @param config 服务配置（id 和 name 为必填）
     */
    create: (config: MCPClientConfig) =>
        getApiInstance().post<any, ApiResponse>('/mcps', config),

    /**
     * 更新MCP服务配置
     * @param name 服务名称
     * @param config 新的配置
     */
    update: (name: string, config: MCPClientConfig) =>
        getApiInstance().put<any, ApiResponse>(`/mcps/${name}`, config),

    /**
     * 删除MCP服务
     * @param name 服务名称
     */
    delete: (name: string) =>
        getApiInstance().delete<any, ApiResponse>(`/mcps/${name}`),

    /**
     * 重新加载指定MCP服务
     * @param name 服务名称
     */
    reload: (name: string) =>
        getApiInstance().post<any, ApiResponse>(`/mcps/${name}/reload`)
};
