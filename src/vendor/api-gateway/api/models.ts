import type { ModelInfo, UseModelContext } from '../types/common-interfaces.js';
import { getApiInstance } from '../client.js';
import type { ApiResponse } from '../client.js';

export const modelsApi = {
    // 获取所有支持的模型
    getAll: () => getApiInstance().get<any, ApiResponse<ModelInfo[]>>('/models'),

    // 获取当前使用的模型配置
    getContext: () => getApiInstance().get<any, ApiResponse<UseModelContext[]>>('/models/context'),

    // 更新模型配置（整体更新）
    updateContext: (context: UseModelContext[]) =>
        getApiInstance().put<any, ApiResponse<UseModelContext[]>>('/models/context', context),

    // 新增单个模型配置
    addContext: (context: UseModelContext) =>
        getApiInstance().post<any, ApiResponse<UseModelContext>>('/models/context', context),

    // 更新单个模型配置（不更新 APIKeys）
    updateContextById: (modelId: string, context: Partial<UseModelContext>) =>
        getApiInstance().put<any, ApiResponse<void>>(`/models/context/${modelId}`, context),

    // 删除单个模型配置
    removeContext: (modelId: string) =>
        getApiInstance().delete<any, ApiResponse<void>>(`/models/context/${modelId}`),

    // 新增自定义模型
    create: (model: Partial<ModelInfo>) =>
        getApiInstance().post<any, ApiResponse<ModelInfo>>('/models', model),

    // 更新模型信息
    update: (modelId: string, updates: Partial<ModelInfo>) =>
        getApiInstance().put<any, ApiResponse<ModelInfo>>(`/models/${modelId}`, updates),

    // 删除模型
    delete: (modelId: string) =>
        getApiInstance().delete<any, ApiResponse<void>>(`/models/${modelId}`),

    // 为指定模型添加 API Key
    addApiKey: (modelId: string, apiKey: string) =>
        getApiInstance().post<any, ApiResponse<void>>(`/models/context/${modelId}/apikeys`, { apiKey }),

    // 按序号删除指定模型的 API Key
    removeApiKey: (modelId: string, index: number) =>
        getApiInstance().delete<any, ApiResponse<void>>(`/models/context/${modelId}/apikeys`, { params: { index } })
};
