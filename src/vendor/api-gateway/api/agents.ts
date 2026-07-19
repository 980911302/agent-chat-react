import type { IAgent, AgentGroup } from '../types/common-interfaces.js';
import { getApiInstance } from '../client.js';
import type { ApiResponse } from '../client.js';
import { getSSEClient } from '../sse.js';

/** 导入进度信息 */
export interface ImportProgress {
    /** 当前步骤: extracting | importing_mcps | importing_skills | importing_agents | done | error */
    step: string;
    /** 当前进度 */
    current: number;
    /** 总数 */
    total: number;
    /** 进度消息 */
    message: string;
    /** 百分比 0-100 */
    percent: number;
}

/** 导出结果 */
export interface ExportResult {
    /** 生成的 ZIP 文件路径 */
    zipPath: string;
    /** 文件大小（字节） */
    size: number;
}

/** 导入结果 */
export interface ImportResult {
    /** 导入的智能体名称列表 */
    importedAgents: string[];
    /** 导入的技能名称列表 */
    importedSkills: string[];
    /** 导入的 MCP 服务名称列表 */
    importedMcps: string[];
    /** 跳过的资源名称列表 */
    skippedItems: string[];
}

/** 资源冲突信息 */
export interface ResourceConflict {
    /** 资源名称 */
    name: string;
    /** 资源类型: agent | skill | mcp */
    type: string;
    /** 是否已存在 */
    exists: boolean;
}

/** 冲突报告 */
export interface ConflictReport {
    /** 是否存在冲突 */
    hasConflict: boolean;
    /** 智能体冲突列表 */
    agentConflicts: ResourceConflict[];
    /** 技能冲突列表 */
    skillConflicts: ResourceConflict[];
    /** MCP 服务冲突列表 */
    mcpConflicts: ResourceConflict[];
}

export const agentsApi = {
    // 获取所有智能体
    getAll: () => getApiInstance().get<any, ApiResponse<IAgent[]>>('/agents'),

    // 获取单个智能体
    getOne: (name: string) => getApiInstance().get<any, ApiResponse<IAgent>>(`/agents/${name}`),

    // 创建智能体
    create: (agent: IAgent) => getApiInstance().post<any, ApiResponse<IAgent>>('/agents', agent),

    // 更新智能体
    update: (name: string, agent: Partial<IAgent>) =>
        getApiInstance().put<any, ApiResponse<IAgent>>(`/agents/${name}`, agent),

    // 删除智能体
    delete: (name: string) => getApiInstance().delete<any, ApiResponse>(`/agents/${name}`),

    // 禁用/启用智能体
    disable: (name: string, disabled: boolean) =>
        getApiInstance().post<any, ApiResponse>(`/agents/${name}/disable`, { disabled }),

    // 批量禁用/启用智能体
    batchDisable: (names: string[], disabled: boolean) =>
        getApiInstance().post<any, ApiResponse>('/agents/batch/disable', { names, disabled }),

    // 批量删除智能体
    batchDelete: (names: string[]) =>
        getApiInstance().post<any, ApiResponse>('/agents/batch/delete', { names }),

    // 克隆智能体
    clone: (name: string, newName: string) =>
        getApiInstance().post<any, ApiResponse<IAgent>>(`/agents/${name}/clone`, { newName }),

    // 导出单个智能体
    exportAgent: (name: string) =>
        getApiInstance().get(`/agents/${encodeURIComponent(name)}/export`, {
            responseType: 'blob'
        }),

    // 检查导入冲突
    checkImport: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return getApiInstance().post<any, ApiResponse<ConflictReport>>('/agents/import/check', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    // 导入智能体/组（返回 Promise，需要通过 onProgress 回调获取进度）
    import: (file: File, overwrite: boolean, onProgress?: (progress: ImportProgress) => void, signal?: AbortSignal): Promise<ApiResponse<ImportResult>> => {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('overwrite', String(overwrite));

            const sse = getSSEClient();
            let result: ImportResult | null = null;

            sse.connect(
                {
                    url: '/agents/import',
                    method: 'POST',
                    // 不要手动设置 Content-Type，浏览器会自动设置 multipart/form-data 和 boundary
                    body: formData,
                    signal,
                },
                {
                    onEvent: {
                        progress: (data) => {
                            try {
                                onProgress?.(JSON.parse(data) as ImportProgress);
                            } catch { /* 忽略非 JSON */ }
                        },
                        done: (data) => {
                            try {
                                result = JSON.parse(data) as ImportResult;
                            } catch { /* 忽略 */ }
                        },
                        error: (data) => {
                            reject({ success: false, error: data || '导入失败' });
                        },
                    },
                    onClose: () => {
                        resolve({ success: true, data: result || undefined });
                    },
                    onError: (event) => {
                        reject(event instanceof Error ? event : new Error('导入连接失败'));
                    },
                }
            );
        });
    }
};

// 智能体组相关 API
export const agentGroupsApi = {
    // 获取所有组
    getAll: () => getApiInstance().get<any, ApiResponse<AgentGroup[]>>('/agents/groups/list'),

    // 创建组
    create: (name: string, describe?: string, entryAgent?: string) =>
        getApiInstance().post<any, ApiResponse<AgentGroup>>('/agents/groups/create', { name, describe, entryAgent }),

    // 更新组信息（全量更新）
    update: (name: string, data: Partial<Pick<AgentGroup, 'name' | 'describe' | 'entryAgent'>>) =>
        getApiInstance().put<any, ApiResponse<AgentGroup>>(`/agents/groups/${encodeURIComponent(name)}`, data),

    // 更新组描述
    updateDescription: (name: string, describe: string) =>
        getApiInstance().patch<any, ApiResponse<AgentGroup>>(`/agents/groups/${encodeURIComponent(name)}/description`, { describe }),

    // 更新入口智能体
    updateEntryAgent: (name: string, entryAgent: string) =>
        getApiInstance().patch<any, ApiResponse<AgentGroup>>(`/agents/groups/${encodeURIComponent(name)}/entry-agent`, { entryAgent }),

    // 删除组
    delete: (name: string) => getApiInstance().delete<any, ApiResponse>(`/agents/groups/${encodeURIComponent(name)}`),

    // 批量删除组
    batchDelete: (names: string[]) =>
        getApiInstance().post<any, ApiResponse>('/agents/groups/batch/delete', { names }),

    // 重命名组
    rename: (name: string, newName: string) =>
        getApiInstance().put<any, ApiResponse<AgentGroup>>(`/agents/groups/${encodeURIComponent(name)}/rename`, { newName }),

    // 获取组成员
    getMembers: (name: string) =>
        getApiInstance().get<any, ApiResponse<string[]>>(`/agents/groups/${encodeURIComponent(name)}/members`),

    // 添加成员到组
    addMember: (groupName: string, agentName: string) =>
        getApiInstance().post<any, ApiResponse<AgentGroup>>(`/agents/groups/${encodeURIComponent(groupName)}/members`, { agentName }),

    // 从组移除成员
    removeMember: (groupName: string, agentName: string) =>
        getApiInstance().delete<any, ApiResponse<AgentGroup>>(`/agents/groups/${encodeURIComponent(groupName)}/members/${encodeURIComponent(agentName)}`),

    // 导出组
    export: (groupName: string) =>
        getApiInstance().get(`/agents/groups/${encodeURIComponent(groupName)}/export`, {
            responseType: 'blob'
        })
};
