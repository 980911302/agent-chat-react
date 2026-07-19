/**
 * 用户信息
 */
export interface User {
    id: string;
    username: string;
    role: 'admin' | 'user' | 'tenant';
    agent?: string;
    /** 绑定类型：agent（智能体）或 group（智能体组） */
    agentType?: 'agent' | 'group';
    /** 是否启用 */
    isEnabled?: boolean;
    createdAt?: number;
    updatedAt?: number;
    lastLoginAt?: number;
    /** 租户ID（仅当角色为 tenant 时使用） */
    tenantId?: string;
}

/**
 * 登录请求
 */
export interface LoginRequest {
    username: string;
    password: string;
}

/**
 * 登录响应
 */
export interface LoginResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

/**
 * 注册请求
 */
export interface RegisterRequest {
    username: string;
    password: string;
    role?: 'admin' | 'user' | 'tenant';
}

/**
 * 注册响应
 */
export interface RegisterResponse {
    id: string;
    username: string;
    role: string;
    createdAt: number;
}

/**
 * 刷新token请求
 */
export interface RefreshTokenRequest {
    refreshToken: string;
}

/**
 * 刷新token响应
 */
export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
}

/**
 * 租户登录请求
 * token 通过请求头 Authorization 传递
 */
export interface TenantLoginRequest {
    /** 租户ID */
    tenantId?: string;
    /** 绑定的智能体名称（可选，与 agentType 同时提供时验证并更新） */
    agent?: string;
    /** 绑定类型：agent 或 group（可选，与 agent 同时提供时验证并更新） */
    agentType?: 'agent' | 'group';
}

/**
 * 用户列表项
 */
export interface UserListItem {
    id: string;
    username: string;
    role: 'admin' | 'user' | 'tenant';
    isEnabled: boolean;
    agent?: string;
    /** 绑定类型：agent（智能体）或 group（智能体组） */
    agentType?: 'agent' | 'group';
    createdAt: number;
    lastLoginAt?: number;
    /** 租户ID（仅当角色为 tenant 时使用） */
    tenantId?: string;
}

/**
 * 更新用户Agent请求
 */
export interface UpdateUserAgentRequest {
    agent?: string;
    /** 绑定类型：agent（智能体）或 group（智能体组） */
    agentType?: 'agent' | 'group';
}

/**
 * 修改密码请求
 */
export interface ChangePasswordRequest {
    /** 当前密码 */
    oldPassword: string;
    /** 新密码 */
    newPassword: string;
}
