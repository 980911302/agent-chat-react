/**
 * 知识库 API - 通过后台代理访问 RAG 服务器
 */
import { getApiInstance } from '../client.js';
import type { ApiResponse } from '../client.js';
import type { KnowledgeQueryResponse } from '../types/gateway.js';

// 知识库组接口
export interface KnowledgeGroup {
    group_id: string;
    group_name: string;
    description: string;
    workspace: string;
    doc_count: number;
    created_at: string;
}

// 列出知识库组响应
export interface ListKnowledgeGroupsResponse {
    groups: KnowledgeGroup[];
    total: number;
}

/**
 * 知识库 API 对象
 */
export const knowledgeApi = {
    // 获取知识库组列表
    listGroups: () => getApiInstance().get<any, ApiResponse<ListKnowledgeGroupsResponse>>('/knowledges/groups'),

    // 检查 RAG 服务器是否已配置（通过配置接口）
    isConfigured: async () => {
        try {
            const res = await getApiInstance().get<any, ApiResponse<any>>('/config');
            if (res.success && res.data?.knowledgeRagConfig?.powerClawRagServer) {
                const server = res.data.knowledgeRagConfig.powerClawRagServer;
                return !!server.ragServerUrl;
            }
            return false;
        } catch {
            return false;
        }
    },

    // 获取 RAG 服务器 URL
    getRagServerUrl: async (): Promise<string> => {
        try {
            const res = await getApiInstance().get<any, ApiResponse<any>>('/config');
            if (res.success && res.data?.knowledgeRagConfig?.powerClawRagServer) {
                return res.data.knowledgeRagConfig.powerClawRagServer.ragServerUrl || '';
            }
            return '';
        } catch {
            return '';
        }
    },

    /**
     * 查询知识库
     * @param query 查询内容
     * @param knowledgeIds 知识库 ID 列表（可选）
     * @returns 查询结果
     */
    query: (query: string, knowledgeIds?: string[]) =>
        getApiInstance().post<any, ApiResponse<KnowledgeQueryResponse>>('/knowledge/query', {
            query,
            knowledgeIds
        }),

    /**
     * 语义搜索知识库（GET 方式，兼容旧接口）
     * @param query 查询内容
     * @param knowledgeIds 知识库 ID 列表（可选）
     * @returns 搜索结果
     */
    search: (query: string, knowledgeIds?: string[]) =>
        getApiInstance().get<any, ApiResponse<KnowledgeQueryResponse>>('/knowledge/search', {
            params: {
                q: query,
                knowledgeIds: knowledgeIds?.join(',')
            }
        })
};
