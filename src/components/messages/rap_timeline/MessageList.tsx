import React, {
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
  useMemo,
} from 'react';
import {
  BrainCircuit,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Cpu,
  FileText,
  Loader2,
  Wrench,
  XCircle,
  BookOpen,
  ArrowRight,
  AlertCircle,
  MessageSquare,
  User,
} from 'lucide-react';
import type {
  HistoryMessage,
  AgentGroup,
  Theme,
  InternalStep,
  Turn,
  ToolCallInfo,
  DocumentInfo,
} from '../../../types';
import { MessageRoles } from '../../../constants/events';
import { useTurns } from '../../../hooks/useMessageList';
import { AgentAvatar } from '../../avatars/AgentAvatar';
import { renderMarkdown } from '../../../utils/markdown';
import { formatTime } from '../../../utils';

/**
 * RapTimeline 消息列表组件（React 版）
 * 完全对齐 Vue 版 UI 结构，使用 rml- 前缀 CSS 类
 * 混合布局：流式时显示折叠面板 + 实时消息预览，展开后显示完整时间线
 */

// ==================== 工具状态图标组件 ====================

/** 工具调用状态图标 */
const ToolStatusIcon: React.FC<{ status: 'pending' | 'success' | 'failed' }> = ({ status }) => {
  if (status === 'success') return <Check size={12} className="text-green-500" />;
  if (status === 'failed') return <XCircle size={12} className="text-red-500" />;
  return <Loader2 size={12} className="text-blue-500 rml-spin" />;
};

// ==================== 辅助函数 ====================

/** 获取 Turn 的主智能体名称 */
function getMainAgentName(turn: Turn): string {
  const contentStep = turn.steps.find((s) => s.type === 'content');
  if (contentStep) return contentStep.msg.agent || 'AI';
  const stepAgent = turn.steps.find((s) => s.msg.agent && s.type !== 'ask');
  return stepAgent?.msg.agent || 'AI';
}

/** 获取步骤标签文本 */
function getStepLabel(step: InternalStep): string {
  if (step.type === 'ask') {
    return `${step.msg.fromAgent} → ${step.msg.toAgent || step.msg.agent}`;
  }
  if (step.type === 'reason') {
    return `${step.msg.agent} 正在思考分析...`;
  }
  if (step.type === 'tool' && step.tool) {
    return `执行 ${step.tool.toolName}`;
  }
  if (step.msg.role === MessageRoles.TOOL_RESULT) {
    return '工具返回结果';
  }
  if (step.msg.role === MessageRoles.COMMAND) {
    return '执行命令';
  }
  if (step.msg.role === MessageRoles.OPTION) {
    return '选项';
  }
  return step.msg.agent || '处理中...';
}

/** 判断是否为错误消息 */
function isErrorMsg(msg: HistoryMessage): boolean {
  return msg.role === MessageRoles.ERROR;
}

/** 解析工具参数 */
function parseToolArg(tool: ToolCallInfo, key: string): string {
  try {
    const parsed = JSON.parse(tool.args);
    return parsed[key] || '';
  } catch {
    return '';
  }
}

/** 获取文档名称 */
function getDocName(doc: DocumentInfo | string): string {
  if (typeof doc === 'string') {
    return doc.split('/').pop() || doc.split('\\').pop() || doc;
  }
  return doc.fileName || '';
}

/** 获取 Turn 的时间（取最后一步） */
function getTurnTime(turn: Turn): string {
  if (turn.steps.length > 0) {
    return formatTime(turn.steps[turn.steps.length - 1].msg.timestamp);
  }
  return '';
}

/** 判断 Turn 是否正在流式接收 */
function isTurnStreaming(
  turn: Turn,
  turnIndex: number,
  turns: Turn[],
  isLoading: boolean
): boolean {
  // 如果是最后一个 Turn 且正在加载，始终认为是流式状态
  const isLast = turnIndex === turns.length - 1;
  if (isLast && isLoading) {
    return true;
  }
  // 否则检查最后一个 content 步骤的 isStreaming 状态
  for (let i = turn.steps.length - 1; i >= 0; i--) {
    if (turn.steps[i].type === 'content') {
      return turn.steps[i].msg.isStreaming === true;
    }
  }
  return false;
}

/** 获取实时消息显示文本 */
function getRealtimeText(
  turn: Turn,
  turnIndex: number,
  turns: Turn[],
  isLoading: boolean
): string {
  if (isTurnStreaming(turn, turnIndex, turns, isLoading)) {
    // 从后往前遍历，找最新的有意义步骤
    for (let i = turn.steps.length - 1; i >= 0; i--) {
      const step = turn.steps[i];

      // 内容步骤（流式接收中）
      if (step.type === 'content' && step.msg.isStreaming && step.msg.content) {
        const text = step.msg.content.trim();
        return text.length > 10 ? text.slice(0, 10) + '...' : text;
      }

      // 工具调用（待处理中）
      if (step.type === 'tool' && step.tool) {
        if (step.tool.status === 'pending') {
          return `执行操作 : ${step.tool.toolName}`;
        }
      }

      // 推理步骤
      if (step.type === 'reason') {
        if (step.msg.reasonContent) {
          const text = step.msg.reasonContent.trim();
          const preview = text.length > 10 ? text.slice(0, 10) + '...' : text;
          return `思考中 : ${preview}`;
        }
        return '思考中...';
      }
    }
    return '思考中...';
  }

  // 错误消息
  if (isTurnError(turn)) {
    const lastContent = getLastContentMsg(turn);
    if (lastContent?.content) {
      const text = lastContent.content.trim();
      return text.length > 10 ? text.slice(0, 10) + '...' : text;
    }
    return '发生错误';
  }

  // 完成状态
  const lastContent = getLastContentMsg(turn);
  if (lastContent?.content) {
    const text = lastContent.content.trim();
    return text.length > 10 ? text.slice(0, 10) + '...' : text;
  }

  return '处理中...';
}

/** 判断智能体思考是否正在进行中 */
function isReasonPending(
  step: InternalStep,
  turnIndex: number,
  stepIndex: number,
  turns: Turn[],
  isLoading: boolean
): boolean {
  if (step.msg.isStreaming) return true;
  if (turnIndex === turns.length - 1 && isLoading) {
    const currentTurn = turns[turnIndex];
    const hasContentAfter = currentTurn.steps.slice(stepIndex + 1).some((s) => s.type === 'content');
    return !hasContentAfter;
  }
  return false;
}

/** 获取 Turn 中最后一条 content 消息 */
function getLastContentMsg(turn: Turn): HistoryMessage | null {
  for (let i = turn.steps.length - 1; i >= 0; i--) {
    if (turn.steps[i].type === 'content') {
      return turn.steps[i].msg;
    }
  }
  return null;
}

/** 获取 Turn 中最后一步的消息（用于时间戳显示） */
function getLastStepMsg(turn: Turn): HistoryMessage | null {
  if (turn.steps.length === 0) return null;
  return turn.steps[turn.steps.length - 1].msg;
}

/** 判断 Turn 是否为错误消息 */
function isTurnError(turn: Turn): boolean {
  const lastContent = getLastContentMsg(turn);
  return lastContent ? lastContent.role === MessageRoles.ERROR : false;
}

// ==================== 组件接口定义 ====================

export interface RapTimelineMessageListProps {
  messages: Record<string, HistoryMessage[]>;
  currentAgent: string;
  isGroupChat: boolean;
  showToolCallLog: boolean;
  isLoading: boolean;
  entryAgent?: string;
  groups?: AgentGroup[];
  theme?: Theme;
  defaultQuerys?: string[];
  isUserDefaultAvatar?: boolean;
  /** 用户显示名（用于头像，取前2个字符） */
  userDisplayName?: string;
  onSelectQuery?: (query: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  children?: React.ReactNode;
}

export interface RapTimelineMessageListRef {
  scrollToBottom: () => void;
}

// ==================== 主组件 ====================

export const RapTimelineMessageList = forwardRef<
  RapTimelineMessageListRef,
  RapTimelineMessageListProps
>(
  (
    {
      messages,
      currentAgent,
      isGroupChat,
      showToolCallLog,
      isLoading,
      entryAgent,
      groups,
      theme = 'dark',
      defaultQuerys = [],
      isUserDefaultAvatar = true,
      userDisplayName = '',
      onSelectQuery,
      onLoadMore,
      hasMore = false,
      isLoadingMore = false,
      children,
    },
    ref
  ) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    // 加载更多前记录的滚动位置（prepend 后用于保持视口位置）
    const loadMoreScrollRef = useRef<{ scrollHeight: number; scrollTop: number } | null>(null);
    const prevIsLoadingMoreRef = useRef(isLoadingMore);

    // 聚合 Turn 回合（传入 entryAgent / groups 以对齐 Vue 版消息收集逻辑）
    const turns = useTurns(messages, currentAgent, isGroupChat, { entryAgent, groups });

    // 暴露 scrollToBottom 方法
    useImperativeHandle(ref, () => ({
      scrollToBottom: () => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      },
    }));

    // 加载更多完成（isLoadingMore true→false）后恢复滚动位置（对齐 Vue 版 handleLoadMore）
    useLayoutEffect(() => {
      const wasLoadingMore = prevIsLoadingMoreRef.current;
      prevIsLoadingMoreRef.current = isLoadingMore;
      const el = scrollRef.current;
      if (wasLoadingMore && !isLoadingMore && loadMoreScrollRef.current && el) {
        const { scrollHeight: heightBefore, scrollTop: topBefore } = loadMoreScrollRef.current;
        el.scrollTop = topBefore + (el.scrollHeight - heightBefore);
      }
    }, [isLoadingMore]);

    // turns 变化时自动滚动到底部（对齐 Vue 版 watch sortedMessages → scrollToBottom）
    // 正在加载更多或刚完成保位恢复时跳过，避免覆盖恢复后的位置
    useEffect(() => {
      if (isLoadingMore) return;
      if (loadMoreScrollRef.current) {
        // 本次变化来自"加载更多"的 prepend，跳过一次到底滚动
        loadMoreScrollRef.current = null;
        return;
      }
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, [turns, isLoadingMore]);

    // 滚动到顶部时加载更多（触发前记录滚动位置）
    const handleScroll = useCallback(() => {
      const el = scrollRef.current;
      if (!el || !hasMore || isLoadingMore) return;
      if (el.scrollTop <= 50 && onLoadMore) {
        loadMoreScrollRef.current = { scrollHeight: el.scrollHeight, scrollTop: el.scrollTop };
        onLoadMore();
      }
    }, [hasMore, isLoadingMore, onLoadMore]);

    // 主题 class
    const themeClass = theme === 'light' ? 'rml-theme-light' : '';

    // 用户显示名（前2个字符）
    const userAvatarContent = useMemo(
      () => (userDisplayName ? userDisplayName.slice(0, 2) : ''),
      [userDisplayName]
    );

    return (
      <div
        className={`rml-container ${themeClass}`}
        ref={scrollRef}
        onScroll={handleScroll}
      >
        {/* Sticky Header */}
        <div className="rml-sticky-header">{children}</div>

        {/* 空状态 */}
        {turns.length === 0 && !isLoading && (
          <div className="rml-empty">
            {defaultQuerys.length > 0 ? (
              <div className="rml-default-queries">
                <div className="rml-default-queries__title">有什么可以帮您的？</div>
                <div className="rml-default-queries__list">
                  {defaultQuerys.map((query, index) => (
                    <div
                      key={index}
                      className="rml-default-query-card"
                      onClick={() => onSelectQuery?.(query)}
                    >
                      <MessageSquare size={16} className="rml-default-query-icon" />
                      <span>{query}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rml-empty-placeholder">开始一段新的对话吧</div>
            )}
          </div>
        )}

        {/* Turns 容器 */}
        <div className="rml-turns">
          {turns.map((turn, tIdx) => (
            <div key={tIdx} className="rml-turn">
              {/* ====== 用户提问（右侧） ====== */}
              {turn.userMsg && (
                <div className="rml-user-block">
                  <div className="rml-body-row rml-body-row--user">
                    <div className="rml-user-bubble">
                      {/* 附件 */}
                      {turn.userMsg.documents && turn.userMsg.documents.length > 0 && (
                        <div className="rml-user-docs">
                          {turn.userMsg.documents.map((doc, i) => (
                            <div key={i} className="rml-doc-item">
                              <FileText size={12} className="text-blue-400" />
                              <span className="rml-doc-name">{getDocName(doc)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="rml-user-text">{turn.userMsg.content}</div>
                      <div className="rml-user-time">{formatTime(turn.userMsg.timestamp)}</div>
                    </div>
                    <div className="rml-user-avatar">
                      {isUserDefaultAvatar ? (
                        <User size={14} />
                      ) : (
                        <>{userAvatarContent}</>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ====== AI 消息（左侧）—— 折叠式实时消息面板 ====== */}
              {turn.steps.length > 0 && (
                <div className="rml-ai-block">
                  {/* 头部：头像 + 智能体名称 + 时间 */}
                  <div className="rml-header-row rml-header-row--ai">
                    <div className="rml-header-left">
                      <AgentAvatar agentName={getMainAgentName(turn)} size="small" />
                      <span className="rml-header-name">{getMainAgentName(turn)}</span>
                    </div>
                    <span className="rml-header-time">{getTurnTime(turn)}</span>
                  </div>

                  {/* 消息展示区 */}
                  <div className="rml-body-row rml-body-row--ai">
                    {isTurnStreaming(turn, tIdx, turns, isLoading) ? (
                      /* 模式 A：流式接收中 — 折叠面板显示实时消息和时间线 */
                      <details className="rml-collapse-card">
                        {/* 折叠摘要：实时消息 */}
                        <summary className="rml-collapse-summary">
                          <div className="rml-summary-left">
                            <Loader2 size={12} className="rml-summary-spinner" />
                            <span className="rml-summary-text rml-summary-text--animating">
                              {getRealtimeText(turn, tIdx, turns, isLoading)}
                            </span>
                            <span className="rml-typing-cursor" />
                          </div>
                          <div className="rml-summary-right">
                            <span className="rml-pulse-dot" />
                            <ChevronDown size={12} className="rml-chevron" />
                          </div>
                        </summary>

                        {/* 展开内容：完整时间线 */}
                        <div className="rml-collapse-body">
                          <div className="rml-timeline">
                            {turn.steps.map((step, i) => (
                              <div key={`step-${i}`} className="rml-step">
                                <div
                                  className={
                                    step.type === 'content' ? 'rml-final-dot' : 'rml-step-dot'
                                  }
                                />
                                <div className="rml-step-inner">
                                  {/* AskAgent：智能体调度 */}
                                  {step.type === 'ask' && (
                                    <div className="rml-step-simple">
                                      <Cpu size={12} className="rml-icon-dim" />
                                      <span className="rml-step-mono">{step.msg.fromAgent}</span>
                                      <ArrowRight size={10} className="rml-icon-dim mx-0_5" />
                                      <span className="rml-step-mono-light">
                                        唤起 {step.msg.toAgent || step.msg.agent}
                                      </span>
                                    </div>
                                  )}

                                  {/* 推理过程：智能体思考 */}
                                  {step.type === 'reason' && (
                                    <details className="rml-tool-card rml-tool-think">
                                      <summary className="rml-tool-summary-card">
                                        <div className="rml-tool-card-inner">
                                          <div className="rml-tool-icon-wrap rml-tool-icon-emerald">
                                            <BrainCircuit size={12} className="text-emerald-400" />
                                          </div>
                                          <span className="rml-tool-label">
                                            智能体思考{' '}
                                            <span className="text-emerald-400_60">
                                              · {step.msg.agent}
                                            </span>
                                          </span>
                                        </div>
                                        <div className="rml-tool-card-right">
                                          {isReasonPending(step, tIdx, i, turns, isLoading) ? (
                                            <Loader2
                                              size={12}
                                              className="text-emerald-400 rml-spin"
                                            />
                                          ) : (
                                            <Check size={12} className="text-green-500" />
                                          )}
                                          <ChevronRight size={12} className="rml-chevron-right" />
                                        </div>
                                      </summary>
                                      <div className="rml-tool-detail-body">
                                        {step.msg.reasonContent}
                                      </div>
                                    </details>
                                  )}

                                  {/* 工具调用 */}
                                  {step.type === 'tool' && step.tool && (
                                    <>
                                      {/* 智能体调度 runAgent */}
                                      {step.tool.toolName === 'runAgent' ? (
                                        <div className="rml-tool-card rml-tool-dispatch">
                                          <div className="rml-tool-card-inner">
                                            <div className="rml-tool-icon-wrap rml-tool-icon-purple">
                                              <Cpu size={12} className="text-purple-400" />
                                            </div>
                                            <span className="rml-tool-label">
                                              智能体调度:{' '}
                                              <span className="rml-tool-highlight-purple">
                                                {parseToolArg(step.tool, 'agentName') ||
                                                  parseToolArg(step.tool, 'agent') ||
                                                  'Unknown'}
                                              </span>
                                            </span>
                                          </div>
                                          <ToolStatusIcon status={step.tool.status} />
                                        </div>
                                      ) : step.tool.toolName === 'loadSkill' ? (
                                        /* 加载技能 loadSkill */
                                        <div className="rml-tool-card rml-tool-skill">
                                          <div className="rml-tool-card-inner">
                                            <div className="rml-tool-icon-wrap rml-tool-icon-amber">
                                              <BookOpen size={12} className="text-amber-400" />
                                            </div>
                                            <span className="rml-tool-label">
                                              加载技能:{' '}
                                              <span className="rml-tool-highlight-amber">
                                                {parseToolArg(step.tool, 'skillName') ||
                                                  parseToolArg(step.tool, 'skill') ||
                                                  'Unknown'}
                                              </span>
                                            </span>
                                          </div>
                                          <ToolStatusIcon status={step.tool.status} />
                                        </div>
                                      ) : (
                                        /* 通用工具调用 */
                                        <details className="rml-tool-card rml-tool-generic">
                                          <summary className="rml-tool-summary-card">
                                            <div className="rml-tool-card-inner">
                                              <div className="rml-tool-icon-wrap rml-tool-icon-yellow">
                                                <Wrench size={12} className="text-yellow-400" />
                                              </div>
                                              <span className="rml-tool-label">
                                                工具调用:{' '}
                                                <span className="rml-tool-highlight-yellow">
                                                  {step.tool.toolName}
                                                </span>
                                              </span>
                                            </div>
                                            <div className="rml-tool-card-right">
                                              <ToolStatusIcon status={step.tool.status} />
                                              <ChevronRight
                                                size={12}
                                                className="rml-chevron-right"
                                              />
                                            </div>
                                          </summary>
                                          <div className="rml-tool-detail-body">
                                            {step.tool.args && (
                                              <div className="rml-tool-section">
                                                <span className="text-purple-400_80">Args:</span>{' '}
                                                {step.tool.args}
                                              </div>
                                            )}
                                            {step.tool.status === 'success' &&
                                              step.tool.result && (
                                                <div>
                                                  <span className="text-green-400_80">
                                                    Result:
                                                  </span>{' '}
                                                  {step.tool.result}
                                                </div>
                                              )}
                                            {step.tool.status === 'failed' && step.tool.error && (
                                              <div className="text-red-400_80">
                                                Error: {step.tool.error}
                                              </div>
                                            )}
                                          </div>
                                        </details>
                                      )}
                                    </>
                                  )}

                                  {/* 正文内容 */}
                                  {step.type === 'content' && (
                                    <div className="rml-final-body">
                                      <div
                                        className={`rml-final-text${
                                          isErrorMsg(step.msg) ? ' rml-final-error' : ''
                                        }`}
                                      >
                                        {isErrorMsg(step.msg) ? (
                                          <div className="rml-error-inline">
                                            <AlertCircle size={14} />
                                            <span>{step.msg.content}</span>
                                          </div>
                                        ) : (
                                          <div
                                            dangerouslySetInnerHTML={{
                                              __html: renderMarkdown(step.msg.content || ''),
                                            }}
                                          />
                                        )}
                                        {step.msg.isStreaming && <span className="rml-cursor" />}
                                      </div>
                                    </div>
                                  )}

                                  {/* AskUser：智能体询问用户 */}
                                  {step.type === 'askUser' && (
                                    <>
                                      <div className="rml-tool-card rml-tool-askuser">
                                        <div className="rml-tool-card-inner">
                                          <div className="rml-tool-icon-wrap rml-tool-icon-amber">
                                            <CircleHelp size={12} className="text-amber-400" />
                                          </div>
                                          <span className="rml-tool-label">
                                            智能体询问:{' '}
                                            <span className="rml-tool-highlight-amber">
                                              {step.msg.agent}
                                            </span>
                                          </span>
                                        </div>
                                      </div>
                                      {step.msg.content && (
                                        <div className="rml-askuser-body">
                                          <div
                                            className="rml-askuser-text"
                                            dangerouslySetInnerHTML={{
                                              __html: renderMarkdown(step.msg.content || ''),
                                            }}
                                          />
                                        </div>
                                      )}
                                    </>
                                  )}

                                  {/* 其他内部步骤 */}
                                  {step.type !== 'ask' &&
                                    step.type !== 'reason' &&
                                    step.type !== 'tool' &&
                                    step.type !== 'content' &&
                                    step.type !== 'askUser' && (
                                      <div className="rml-step-simple">
                                        <Cpu size={12} className="rml-icon-dim" />
                                        <span className="rml-step-mono">{getStepLabel(step)}</span>
                                      </div>
                                    )}

                                  {/* 步骤时间 */}
                                  {step.msg.timestamp > 0 && (
                                    <span className="rml-step-time">
                                      {formatTime(step.msg.timestamp)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}

                            {/* 加载中占位 */}
                            {tIdx === turns.length - 1 &&
                              isLoading &&
                              turn.steps.length === 0 && (
                                <div className="rml-loading-step">
                                  <div className="rml-step-dot-sm" />
                                  <div className="rml-loading-dots">
                                    <span className="rml-dot rml-dot-1" />
                                    <span className="rml-dot rml-dot-2" />
                                    <span className="rml-dot rml-dot-3" />
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                      </details>
                    ) : (
                      /* 模式 B：完成/历史 — 直接显示最后一条消息 */
                      <>
                        {/* 错误消息 */}
                        {isTurnError(turn) ? (
                          <div className="rml-error-body">
                            <div className="rml-error-inline">
                              <AlertCircle size={14} />
                              <span>{getLastContentMsg(turn)?.content}</span>
                            </div>
                            <span className="rml-final-time">
                              {getLastStepMsg(turn)
                                ? formatTime(getLastStepMsg(turn)!.timestamp)
                                : ''}
                            </span>
                          </div>
                        ) : getLastContentMsg(turn) ? (
                          /* 正常内容消息 */
                          <div className="rml-completed-text">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: renderMarkdown(
                                  getLastContentMsg(turn)?.content || ''
                                ),
                              }}
                            />
                            <span className="rml-final-time">
                              {getLastStepMsg(turn)
                                ? formatTime(getLastStepMsg(turn)!.timestamp)
                                : ''}
                            </span>
                          </div>
                        ) : null}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* 全局加载占位 */}
          {isLoading && turns.length === 0 && (
            <div className="rml-ai-block">
              <div className="rml-header-row rml-header-row--ai">
                <div className="rml-header-left">
                  <div className="rml-ai-avatar-icon">
                    <Loader2 size={14} className="text-white rml-spin" />
                  </div>
                  <span className="rml-header-name">AI</span>
                </div>
              </div>
              <div className="rml-body-row rml-body-row--ai">
                <div className="rml-loading-dots">
                  <span className="rml-dot rml-dot-1" />
                  <span className="rml-dot rml-dot-2" />
                  <span className="rml-dot rml-dot-3" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 加载更多指示器 */}
        {isLoadingMore && (
          <div className="rml-loading-more">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                color: 'var(--ml-text-secondary, #8b949e)',
                fontSize: 12,
              }}
            >
              <Loader2 size={12} className="rml-spin" />
              <span>加载中...</span>
            </div>
          </div>
        )}
      </div>
    );
  }
);

RapTimelineMessageList.displayName = 'RapTimelineMessageList';
