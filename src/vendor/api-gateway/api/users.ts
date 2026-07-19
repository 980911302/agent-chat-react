import { getApiInstance } from '../client.js';
import type { ApiResponse } from '../client.js';
import type {
    LoginRequest,
    LoginResponse,
    RefreshTokenRequest,
    RefreshTokenResponse,
    RegisterRequest,
    RegisterResponse,
    TenantLoginRequest,
    UpdateUserAgentRequest,
    User,
    UserListItem,
    ChangePasswordRequest
} from '../types/users.js';

export const usersApi = {
    /**
     * 用户注册
     * @param data 注册信息
     * @returns 用户信息
     */
    register: (data: RegisterRequest) =>
        getApiInstance().post<any, ApiResponse<RegisterResponse>>('/users/register', data),

    /**
     * 用户登录
     * @param data 登录信息
     * @returns 用户信息和token
     */
    login: (data: LoginRequest) =>
        getApiInstance().post<any, ApiResponse<LoginResponse>>('/users/login', data),

    /**
     * 用户登出
     * @returns 成功消息
     */
    logout: () => getApiInstance().post<any, ApiResponse<{ message: string }>>('/users/logout'),

    /**
     * 刷新访问令牌
     * @param data 刷新token
     * @returns 新的token
     */
    refreshToken: (data: RefreshTokenRequest) =>
        getApiInstance().post<any, ApiResponse<RefreshTokenResponse>>('/users/refresh', data),

    /**
     * 获取当前用户信息
     * @returns 用户信息
     */
    getCurrentUser: () => getApiInstance().get<any, ApiResponse<User>>('/users/me'),

    /**
     * 租户登录
     * token 通过请求头 Authorization 传递，请求体只需 tenantId
     * @param data 租户登录信息 { tenantId }
     * @returns 登录结果消息
     */
    tenantLogin: (data: TenantLoginRequest) =>
        getApiInstance().post<any, ApiResponse<User>>('/users/tenant-login', data),

    /**
     * 获取所有用户（管理员权限）
     * @returns 用户列表
     */
    getAllUsers: () =>
        getApiInstance().get<any, ApiResponse<UserListItem[]>>('/users'),

    /**
     * 更新用户Agent绑定（管理员权限）
     * @param userId 用户ID
     * @param data Agent信息
     * @returns 更新后的用户信息
     */
    updateUserAgent: (userId: string, data: UpdateUserAgentRequest) =>
        getApiInstance().put<any, ApiResponse<UserListItem>>(`/users/${userId}/agent`, data),

    /**
     * 更新当前用户的默认智能体
     * @param data Agent信息
     * @returns 更新后的用户信息
     */
    updateMyAgent: (data: UpdateUserAgentRequest) =>
        getApiInstance().put<any, ApiResponse<User>>(`/users/me/agent`, data),

    /**
     * 修改当前用户密码
     * @param data 密码信息
     * @returns 成功消息
     */
    changePassword: (data: ChangePasswordRequest) =>
        getApiInstance().post<any, ApiResponse<{ message: string }>>('/users/change-password', data)
};
