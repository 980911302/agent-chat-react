/**
 * A2UI 协议相关常量
 */

/** A2UI 特殊事件名称 */
export const SpecialEventNames = {
  CREATE_SURFACE: 'createSurface',
  UPDATE_COMPONENTS: 'updateComponents',
  UPDATE_DATA_MODEL: 'updateDataModel',
  DELETE_SURFACE: 'deleteSurface',
} as const;

/** 特殊事件数据 */
export interface SpecialEventData {
  name: string;
  data: any;
}

/** A2UI 消息 */
export interface A2UIMessage {
  version?: string;
  createSurface?: A2UICreateSurfaceEvent;
  updateComponents?: A2UIUpdateComponentsEvent;
  updateDataModel?: A2UIUpdateDataModelEvent;
  deleteSurface?: A2UIDeleteSurfaceEvent;
}

export interface A2UICreateSurfaceEvent {
  surfaceId: string;
  catalogId?: string;
  catalog?: any;
  options?: any;
  timestamp?: number;
}

export interface A2UIUpdateComponentsEvent {
  surfaceId: string;
  components: any[];
  timestamp?: number;
}

export interface A2UIUpdateDataModelEvent {
  surfaceId: string;
  path?: string;
  value?: any;
  timestamp?: number;
}

export interface A2UIDeleteSurfaceEvent {
  surfaceId: string;
  timestamp?: number;
}

/** 消息角色枚举 */
export const MessageRoles = {
  SYSTEM: 'system',
  USER: 'user',
  ASSISTANT: 'assistant',
  TOOL_RESULT: 'tool_result',
  COMMAND: 'command',
  ERROR: 'error',
  OPTION: 'option',
  ASK_USER: 'AskUser',
  USER_ANSWER: 'UserAnswer',
  ASK_AGENT: 'AskAgent',
  TIMER: 'timer',
} as const;

/** 运行智能体类型 */
export const RunAgentTypes = {
  AGENT: 'agent',
  GROUP: 'group',
} as const;
