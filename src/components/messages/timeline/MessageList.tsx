import React, { useRef, useEffect, useLayoutEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import {
  BrainCircuit,
  Cpu,
  BookOpen,
  Wrench,
  ChevronRight,
  User,
  FileText,
  ArrowRight,
  AlertCircle,
  Check,
  Loader2,
  HelpCircle,
  MessageSquare,
} from 'lucide-react';
import type { HistoryMessage, InternalStep, AgentGroup, Theme, Turn, ToolCallInfo, DocumentInfo } from '../../../types';
import { useTurns } from '../../../hooks/useMessageList';
import { AgentAvatar } from '../../avatars/AgentAvatar';
import { renderMarkdown } from '../../../utils/markdown';
import { formatTime } from '../../../utils';
import { MessageRoles } from '../../../constants/events';

/**
 * 时间线消息列表组件
 * 完整的 Turn-based 时间线布局，支持工具调用卡片和思考过程展示
 * HTML 结构和 CSS 类名与 Vue 版完全一致
 */

export interface TimelineMessageListProps {
  /** 按智能体分组的消息 */
  messages: Record<string, HistoryMessage[]>;
  /** 当前智能体名称 */
  currentAgent: string;
  /** 是否为群聊模式 */
  isGroupChat: boolean;
  /** 是否展示工具调用日志 */
  showToolCallLog: boolean;
  /** 是否正在等待 AI 回复 */
  isLoading: boolean;
  /** 入口智能体名称 */
  entryAgent?: string;
  /** 智能体分组列表 */
  groups?: AgentGroup[];
  /** 主题 */
  theme?: Theme;
  /** 默认查询卡片（空消息时显示） */
  defaultQuerys?: string[];
  /** 是否使用默认用户头像 */
  isUserDefaultAvatar?: boolean;
  /** 用户显示名称（头像区域显示，建议取用户名前2字符） */
  userDisplayName?: string;
  /** 选择默认查询 */
  onSelectQuery?: (query: string) => void;
  /** 加载更多消息 */
  onLoadMore?: () => void;
  /** 是否有更多消息 */
  hasMore?: boolean;
  /** 是否正在加载更多 */
  isLoadingMore?: boolean;
  /** 顶部吸顶区域 */
  children?: React.ReactNode;
}

export interface TimelineMessageListRef {
  scrollToBottom: () => void;
}

// ==================== 辅助函数 ====================

/** 获取 Turn 的主智能体名称：优先取 content 步骤的 agent，否则取首个非 ask 且有 agent 的步骤（对齐 Vue 版） */
const getMainAgentName = (turn: Turn): string => {
  const contentStep = turn.steps.find((s) => s.type === 'content');
  if (contentStep) return contentStep.msg.agent || 'AI';
  const stepAgent = turn.steps.find((s) => s.msg.agent && s.type !== 'ask');
  return stepAgent?.msg.agent || 'AI';
};

/** 获取 Turn 的时间：返回最后一步的格式化时间（对齐 Vue 版） */
const getTurnTime = (turn: Turn): string => {
  if (turn.steps.length > 0) {
    return formatTime(turn.steps[turn.steps.length - 1].msg.timestamp);
  }
  return '';
};

/** 获取文档名称：返回 fileName 或从路径中提取 */
const getDocName = (doc: DocumentInfo | string): string => {
  if (typeof doc === 'string') {
    return doc.split('/').pop() || doc.split('\\').pop() || doc;
  }
  return doc.fileName || '';
};

/** 获取步骤的描述标签 */
const getStepLabel = (step: InternalStep): string => {
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
};

/** 判断是否为错误消息 */
const isErrorMsg = (msg: HistoryMessage): boolean => {
  return msg.role === MessageRoles.ERROR;
};

/** 判断智能体思考是否正在进行中 */
const isReasonPending = (
  step: InternalStep,
  tIdx: number,
  stepIdx: number,
  turns: Turn[],
  isLoading: boolean
): boolean => {
  // 如果消息正在流式传输，说明思考中
  if (step.msg.isStreaming) return true;
  // 如果是最后一个 turn，且正在加载，检查后面是否还有 content 步骤
  if (tIdx === turns.length - 1 && isLoading) {
    const currentTurn = turns[tIdx];
    const hasContentAfter = currentTurn.steps.slice(stepIdx + 1).some(s => s.type === 'content');
    return !hasContentAfter;
  }
  return false;
};

/** 从 tool.args JSON 中解析指定 key 的值 */
const parseToolArg = (tool: ToolCallInfo, key: string): string => {
  try {
    const parsed = JSON.parse(tool.args);
    return parsed[key] || '';
  } catch {
    return '';
  }
};

// ==================== 子组件 ====================

/** 工具调用状态图标 */
const ToolStatusIcon: React.FC<{ status: string }> = ({ status }) => {
  switch (status) {
    case 'pending':
      return (
        <span
          style={{
            display: 'inline-block',
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#f59e0b',
            animation: 'agent-chat-pulse 1.5s infinite',
          }}
        />
      );
    case 'success':
      return <span style={{ color: '#10b981', fontSize: 12, fontWeight: 'bold' }}>✓</span>;
    case 'failed':
      return <span style={{ color: '#ef4444', fontSize: 12, fontWeight: 'bold' }}>✗</span>;
    default:
      return null;
  }
};

// ==================== 主组件 ====================

export const TimelineMessageList = forwardRef<TimelineMessageListRef, TimelineMessageListProps>(
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

    const themeClass = theme === 'light' ? 'msglist-theme-light' : '';

    return (
      <div
        className={['msglist-container', themeClass].filter(Boolean).join(' ')}
        ref={scrollRef}
        onScroll={handleScroll}
      >
        {/* 吸顶头部 */}
        <div className="msglist-sticky-header">
          {children}
        </div>

        {/* 空状态 */}
        {turns.length === 0 && !isLoading && (
          <div className="msglist-empty">
            {defaultQuerys.length > 0 ? (
              <div className="msglist-default-queries">
                <div className="msglist-default-queries__title">有什么可以帮你的？</div>
                <div className="msglist-default-queries__list">
                  {defaultQuerys.map((query, index) => (
                    <div
                      key={index}
                      className="msglist-default-query-card"
                      onClick={() => onSelectQuery?.(query)}
                    >
                      <MessageSquare size={16} className="msglist-default-query-icon" />
                      <span>{query}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ color: 'var(--ml-text-secondary, #8b949e)', fontSize: 14 }}>
                开始一段新的对话吧
              </div>
            )}
          </div>
        )}

        {/* Turn 列表 */}
        <div className="msglist-turns">
          {turns.map((turn, tIdx) => (
            <div key={tIdx} className="msglist-turn">
              {/* 用户消息 */}
              {turn.userMsg && (
                <div className="msglist-user-block">
                  <div className="msglist-body-row msglist-body-row--user">
                    <div className="msglist-user-bubble">
                      {/* 附件 */}
                      {turn.userMsg.documents && turn.userMsg.documents.length > 0 && (
                        <div className="msglist-user-docs">
                          {turn.userMsg.documents.map((doc, i) => (
                            <div key={i} className="msglist-doc-item">
                              <FileText size={12} className="text-blue-400" />
                              <span className="msglist-doc-name">{getDocName(doc)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="msglist-user-text">{turn.userMsg.content}</div>
                      <div className="msglist-user-time">{formatTime(turn.userMsg.timestamp)}</div>
                    </div>
                    <div className="msglist-user-avatar">
                      {isUserDefaultAvatar ? <User size={14} /> : userDisplayName}
                    </div>
                  </div>
                </div>
              )}

              {/* AI 消息 */}
              {turn.steps.length > 0 && (
                <div className="msglist-ai-block">
                  <div className="msglist-header-row msglist-header-row--ai">
                    <div className="msglist-header-left">
                      <AgentAvatar agentName={getMainAgentName(turn)} size="small" />
                      <span className="msglist-header-name">{getMainAgentName(turn)}</span>
                    </div>
                    <span className="msglist-header-time">{getTurnTime(turn)}</span>
                  </div>
                  <div className="msglist-body-row msglist-body-row--ai">
                    <div className="msglist-timeline">
                      {turn.steps.map((step, i) => (
                        <div key={'step-' + i} className="msglist-step">
                          <div className={step.type === 'content' ? 'msglist-final-dot' : 'msglist-step-dot'} />
                          <div className="msglist-step-inner">
                            {/* AskAgent */}
                            {step.type === 'ask' && (
                              <div className="msglist-step-simple">
                                <Cpu size={12} className="msglist-icon-dim" />
                                <span className="msglist-step-mono">{step.msg.fromAgent}</span>
                                <ArrowRight size={10} className="msglist-icon-dim mx-0.5" />
                                <span className="msglist-step-mono-light">唤起 {step.msg.toAgent || step.msg.agent}</span>
                              </div>
                            )}

                            {/* Reason */}
                            {step.type === 'reason' && (
                              <details className="msglist-tool-card msglist-tool-think">
                                <summary className="msglist-tool-summary-card">
                                  <div className="msglist-tool-card-inner">
                                    <div className="msglist-tool-icon-wrap msglist-tool-icon-emerald">
                                      <BrainCircuit size={12} className="text-emerald-400" />
                                    </div>
                                    <span className="msglist-tool-label">
                                      智能体思考 <span className="text-emerald-400/60">· {step.msg.agent}</span>
                                    </span>
                                  </div>
                                  <div className="msglist-tool-card-right">
                                    {isReasonPending(step, tIdx, i, turns, isLoading) ? (
                                      <Loader2 size={12} className="text-emerald-400 msglist-spin" />
                                    ) : (
                                      <Check size={12} className="text-green-500" />
                                    )}
                                    <ChevronRight size={12} className="msglist-chevron" />
                                  </div>
                                </summary>
                                <div className="msglist-tool-detail-body">{step.msg.reasonContent}</div>
                              </details>
                            )}

                            {/* Tool call */}
                            {step.type === 'tool' && step.tool && (
                              <>
                                {/* runAgent */}
                                {step.tool.toolName === 'runAgent' && (
                                  <div className="msglist-tool-card msglist-tool-dispatch">
                                    <div className="msglist-tool-card-inner">
                                      <div className="msglist-tool-icon-wrap msglist-tool-icon-purple">
                                        <Cpu size={12} className="text-purple-400" />
                                      </div>
                                      <span className="msglist-tool-label">
                                        智能体调度: <span className="msglist-tool-highlight-purple">{parseToolArg(step.tool, 'agentName') || parseToolArg(step.tool, 'agent') || 'Unknown'}</span>
                                      </span>
                                    </div>
                                    <ToolStatusIcon status={step.tool.status} />
                                  </div>
                                )}
                                {/* loadSkill */}
                                {step.tool.toolName === 'loadSkill' && (
                                  <div className="msglist-tool-card msglist-tool-skill">
                                    <div className="msglist-tool-card-inner">
                                      <div className="msglist-tool-icon-wrap msglist-tool-icon-amber">
                                        <BookOpen size={12} className="text-amber-400" />
                                      </div>
                                      <span className="msglist-tool-label">
                                        加载技能: <span className="msglist-tool-highlight-amber">{parseToolArg(step.tool, 'skillName') || parseToolArg(step.tool, 'skill') || 'Unknown'}</span>
                                      </span>
                                    </div>
                                    <ToolStatusIcon status={step.tool.status} />
                                  </div>
                                )}
                                {/* Generic tool */}
                                {step.tool.toolName !== 'runAgent' && step.tool.toolName !== 'loadSkill' && (
                                  <details className="msglist-tool-card msglist-tool-generic">
                                    <summary className="msglist-tool-summary-card">
                                      <div className="msglist-tool-card-inner">
                                        <div className="msglist-tool-icon-wrap msglist-tool-icon-yellow">
                                          <Wrench size={12} className="text-yellow-400" />
                                        </div>
                                        <span className="msglist-tool-label">
                                          工具调用: <span className="msglist-tool-highlight-yellow">{step.tool.toolName}</span>
                                        </span>
                                      </div>
                                      <div className="msglist-tool-card-right">
                                        <ToolStatusIcon status={step.tool.status} />
                                        <ChevronRight size={12} className="msglist-chevron" />
                                      </div>
                                    </summary>
                                    <div className="msglist-tool-detail-body">
                                      {step.tool.args && <div><span className="text-purple-400/80">Args:</span> {step.tool.args}</div>}
                                      {step.tool.status === 'success' && step.tool.result && <div><span className="text-green-400/80">Result:</span> {step.tool.result}</div>}
                                      {step.tool.status === 'failed' && step.tool.error && <div className="text-red-400/80">Error: {step.tool.error}</div>}
                                    </div>
                                  </details>
                                )}
                              </>
                            )}

                            {/* Content */}
                            {step.type === 'content' && (
                              <div className="msglist-final-body">
                                <div className={['msglist-final-text', isErrorMsg(step.msg) ? 'msglist-final-error' : ''].filter(Boolean).join(' ')}>
                                  {isErrorMsg(step.msg) ? (
                                    <div className="msglist-error-inline">
                                      <AlertCircle size={14} />
                                      <span>{step.msg.content}</span>
                                    </div>
                                  ) : (
                                    <div dangerouslySetInnerHTML={{ __html: renderMarkdown(step.msg.content || '') }} />
                                  )}
                                  {step.msg.isStreaming && <span className="msglist-cursor" />}
                                </div>
                              </div>
                            )}

                            {/* AskUser */}
                            {step.type === 'askUser' && (
                              <>
                                <div className="msglist-tool-card msglist-tool-askuser">
                                  <div className="msglist-tool-card-inner">
                                    <div className="msglist-tool-icon-wrap msglist-tool-icon-amber">
                                      <HelpCircle size={12} className="text-amber-400" />
                                    </div>
                                    <span className="msglist-tool-label">
                                      智能体询问: <span className="msglist-tool-highlight-amber">{step.msg.agent}</span>
                                    </span>
                                  </div>
                                </div>
                                {step.msg.content && (
                                  <div className="msglist-askuser-body">
                                    <div
                                      className="msglist-askuser-text"
                                      dangerouslySetInnerHTML={{ __html: renderMarkdown(step.msg.content || '') }}
                                    />
                                  </div>
                                )}
                              </>
                            )}

                            {/* Other steps */}
                            {step.type !== 'ask' && step.type !== 'reason' && step.type !== 'tool' && step.type !== 'content' && step.type !== 'askUser' && (
                              <div className="msglist-step-simple">
                                <Cpu size={12} className="msglist-icon-dim" />
                                <span className="msglist-step-mono">{getStepLabel(step)}</span>
                              </div>
                            )}

                            {step.msg.timestamp && (
                              <span className="msglist-step-time">{formatTime(step.msg.timestamp)}</span>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Loading placeholder（当前 turn 无步骤时显示） */}
                      {tIdx === turns.length - 1 && isLoading && turn.steps.length === 0 && (
                        <div className="msglist-loading-step">
                          <div className="msglist-step-dot-sm" />
                          <div className="msglist-loading-dots">
                            <span className="msglist-dot msglist-dot-1" />
                            <span className="msglist-dot msglist-dot-2" />
                            <span className="msglist-dot msglist-dot-3" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Global loading（无 turn 时显示） */}
          {isLoading && turns.length === 0 && (
            <div className="msglist-ai-block">
              <div className="msglist-header-row msglist-header-row--ai">
                <div className="msglist-header-left">
                  <div className="msglist-ai-avatar-icon">
                    <Loader2 size={14} className="text-white msglist-spin" />
                  </div>
                  <span className="msglist-header-name">AI</span>
                </div>
              </div>
              <div className="msglist-body-row msglist-body-row--ai">
                <div className="msglist-loading-dots">
                  <span className="msglist-dot msglist-dot-1" />
                  <span className="msglist-dot msglist-dot-2" />
                  <span className="msglist-dot msglist-dot-3" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Load more */}
        {isLoadingMore && (
          <div className="msglist-loading-more">
            <span>加载中...</span>
          </div>
        )}
      </div>
    );
  }
);

TimelineMessageList.displayName = 'TimelineMessageList';
