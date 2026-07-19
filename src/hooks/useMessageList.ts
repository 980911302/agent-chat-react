import { useMemo } from 'react';
import type { HistoryMessage, Turn, AgentGroup } from '../types';
import { MessageRoles } from '../constants/events';

/**
 * 消息列表逻辑 Hook
 * 将消息按 Turn（对话回合）聚合，支持时间线展示
 * 聚合逻辑完全对齐 Vue 版 composables/useMessageList.ts
 */

/** 允许显示的消息角色（模块级常量，避免重复创建） */
const ALLOWED_ROLES = new Set<string>([
  MessageRoles.ASSISTANT,
  MessageRoles.USER,
  MessageRoles.ASK_AGENT,
  MessageRoles.ASK_USER,
  MessageRoles.USER_ANSWER,
  MessageRoles.TOOL_RESULT,
  MessageRoles.COMMAND,
  MessageRoles.OPTION,
  MessageRoles.ERROR,
]);

/** useTurns 额外选项 */
export interface UseTurnsOptions {
  /** 入口智能体名称（currentAgent 为 'entry-agent' 时解析为实际名称） */
  entryAgent?: string;
  /** 智能体分组列表（currentAgent 命中组名时合并组员消息） */
  groups?: AgentGroup[];
}

/** 解析实际的智能体名称（entry-agent → 实际入口智能体） */
function getActualAgentName(agentName: string, entryAgent?: string): string {
  if (agentName === 'entry-agent' && entryAgent) {
    return entryAgent;
  }
  return agentName;
}

/** 是否为用户消息（标记新 Turn 开始，User 与 UserAnswer 均开启新 Turn） */
function isUserLike(msg: HistoryMessage): boolean {
  return msg.role === MessageRoles.USER || msg.role === MessageRoles.USER_ANSWER;
}

/**
 * 收集当前视图的消息：角色过滤 + 按 id 去重 + 按时间排序
 * 对齐 Vue 版 collectAllMessages
 */
function collectAllMessages(
  messages: Record<string, HistoryMessage[]>,
  currentAgent: string,
  isGroupChat: boolean,
  entryAgent?: string,
  groups?: AgentGroup[]
): HistoryMessage[] {
  const allMsgs: HistoryMessage[] = [];

  if (isGroupChat) {
    // 群聊模式：合并所有智能体的消息
    for (const agentName in messages) {
      for (const msg of messages[agentName]) {
        if (ALLOWED_ROLES.has(msg.role) && msg.content !== undefined) {
          allMsgs.push(msg);
        }
      }
    }
  } else {
    // 非群聊：若当前智能体命中分组，合并组名 + 组员的消息
    const group = groups?.find((g) => g.name === currentAgent);
    if (group) {
      const keys = [currentAgent, ...group.members];
      for (const key of keys) {
        const agentMessages = messages[key] || [];
        for (const msg of agentMessages) {
          if (ALLOWED_ROLES.has(msg.role) && msg.content !== undefined) {
            allMsgs.push(msg);
          }
        }
      }
    } else {
      const actualAgent = getActualAgentName(currentAgent, entryAgent);
      const agentMessages = messages[actualAgent] || [];
      for (const msg of agentMessages) {
        if (ALLOWED_ROLES.has(msg.role) && msg.content !== undefined) {
          allMsgs.push(msg);
        }
      }
    }
  }

  // 按 id 去重（群聊合并时同一条消息可能出现在多个 agent 分组）
  const seenIds = new Set<string>();
  const uniqueMsgs: HistoryMessage[] = [];
  for (const msg of allMsgs) {
    if (!seenIds.has(msg.id)) {
      seenIds.add(msg.id);
      uniqueMsgs.push(msg);
    }
  }

  // 按时间排序
  uniqueMsgs.sort((a, b) => a.timestamp - b.timestamp);
  return uniqueMsgs;
}

/**
 * 将消息分组为 Turn 回合
 * 每个 Turn 包含一条用户消息和后续的 AI 步骤
 * @param messages 按智能体分组的消息
 * @param currentAgent 当前智能体名称
 * @param isGroupChat 是否为群聊模式
 * @param options 额外选项（entryAgent / groups）
 */
export function useTurns(
  messages: Record<string, HistoryMessage[]>,
  currentAgent: string,
  isGroupChat: boolean,
  options: UseTurnsOptions = {}
): Turn[] {
  const { entryAgent, groups } = options;

  return useMemo(() => {
    // 收集、过滤、去重、排序当前视图的消息
    const msgs = collectAllMessages(messages, currentAgent, isGroupChat, entryAgent, groups);
    if (msgs.length === 0) return [];

    const turns: Turn[] = [];
    let currentTurn: Turn | null = null;

    for (const msg of msgs) {
      if (isUserLike(msg)) {
        // 用户消息（User / UserAnswer）→ 开始新 Turn
        if (currentTurn) {
          turns.push(currentTurn);
        }
        currentTurn = { userMsg: msg, steps: [] };
        continue;
      }

      if (!currentTurn) {
        currentTurn = { userMsg: null, steps: [] };
      }

      if (msg.role === MessageRoles.ASK_USER) {
        // 智能体询问用户
        currentTurn.steps.push({ type: 'askUser', msg });
      } else if (msg.role === MessageRoles.ASK_AGENT) {
        // 智能体间调度
        currentTurn.steps.push({ type: 'ask', msg });
      } else if (msg.role === MessageRoles.ASSISTANT) {
        // 如果有推理内容，添加思考步骤
        if (msg.reasonContent) {
          currentTurn.steps.push({ type: 'reason', msg });
        }
        // 如果有工具调用，添加工具步骤
        if (msg.toolCalls && msg.toolCalls.length > 0) {
          for (const tool of msg.toolCalls) {
            currentTurn.steps.push({ type: 'tool', msg, tool });
          }
        }
        // 有正文或正在流式时添加正文内容步骤（对齐 Vue 版）
        if (msg.content || msg.isStreaming) {
          currentTurn.steps.push({ type: 'content', msg });
        }
      } else if (msg.role === MessageRoles.ERROR) {
        // 错误消息作为 content 步骤展示
        currentTurn.steps.push({ type: 'content', msg });
      } else {
        // 其他内部步骤（ToolResult / Command / Option）
        currentTurn.steps.push({ type: 'step', msg });
      }
    }

    // 推入最后一个 Turn
    if (currentTurn) {
      turns.push(currentTurn);
    }

    return turns;
  }, [messages, currentAgent, isGroupChat, entryAgent, groups]);
}
