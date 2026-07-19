import type { ISkill } from '../types/common-interfaces.js';
import { getApiInstance } from '../client.js';
import type { ApiResponse } from '../client.js';

export const skillsApi = {
    // 获取所有技能
    getAll: () => getApiInstance().get<any, ApiResponse<ISkill[]>>('/skills'),

    // 获取单个技能
    getOne: (name: string) => getApiInstance().get<any, ApiResponse<ISkill>>(`/skills/${name}`),

    // 创建技能
    create: (skill: ISkill) => getApiInstance().post<any, ApiResponse<ISkill>>('/skills', skill),

    // 更新技能
    update: (name: string, skill: Partial<ISkill>) =>
        getApiInstance().put<any, ApiResponse<ISkill>>(`/skills/${name}`, skill),

    // 删除技能
    delete: (name: string) => getApiInstance().delete<any, ApiResponse>(`/skills/${name}`),

    // 禁用/启用技能
    disable: (name: string, disabled: boolean) =>
        getApiInstance().post<any, ApiResponse>(`/skills/${name}/disable`, { disabled }),

    // 导入技能（上传 zip 压缩包）
    upload: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return getApiInstance().post<any, ApiResponse>('/skills/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
};
