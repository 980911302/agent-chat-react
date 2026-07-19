import { getApiInstance } from '../client.js';
import type { ApiResponse } from '../client.js';
import type { ITask } from '../types/common-interfaces.js';

export const tasksApi = {
    /**
     * 获取当前用户的任务列表
     */
    getTasks: () =>
        getApiInstance().get<any, ApiResponse<ITask[]>>('/tasks'),

    /**
     * 获取单个任务详情
     * @param taskId 任务ID
     */
    getTask: (taskId: string) =>
        getApiInstance().get<any, ApiResponse<ITask>>(`/tasks/${taskId}`)
};
