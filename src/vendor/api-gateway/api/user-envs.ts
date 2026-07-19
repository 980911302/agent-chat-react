import { getApiInstance } from '../client.js';
import type { ApiResponse } from '../client.js';

/**
 * 用户环境变量 Map 类型
 */
export type UserEnvs = Record<string, string>;

/**
 * 用户环境变量 API
 */
export const userEnvsApi = {
    /**
     * 获取当前用户的所有环境变量
     * @returns 环境变量键值对
     */
    getEnvs: () =>
        getApiInstance().get<any, ApiResponse<UserEnvs>>('/user-envs'),

    /**
     * 添加或更新单个环境变量
     * @param key 环境变量名
     * @param value 环境变量值
     * @returns 操作结果
     */
    putEnv: (key: string, value: string) =>
        getApiInstance().put<any, ApiResponse<{ message: string }>>('/user-envs', { key, value }),

    /**
     * 批量添加或更新环境变量
     * @param envs 环境变量键值对
     * @returns 操作结果
     */
    batchPutEnvs: (envs: UserEnvs) =>
        getApiInstance().put<any, ApiResponse<{ message: string }>>('/user-envs/batch', { envs }),

    /**
     * 删除指定环境变量
     * @param key 环境变量名
     * @returns 操作结果
     */
    deleteEnv: (key: string) =>
        getApiInstance().delete<any, ApiResponse<{ message: string }>>(`/user-envs/${key}`),

    /**
     * 管理员获取指定用户的环境变量
     * @param userId 用户ID
     * @returns 环境变量键值对
     */
    adminGetEnvs: (userId: string) =>
        getApiInstance().get<any, ApiResponse<UserEnvs>>(`/user-envs/admin/${userId}`),
};
