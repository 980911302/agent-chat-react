import React, { useRef, useEffect, useLayoutEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import {
  BrainCircuit,
  Check,
  ChevronDown,
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
import type { HistoryMessage, AgentGroup, Theme, Turn, InternalStep, DocumentInfo } from '../../../types';
import { useTurns } from '../../../hooks/useMessageList';
import { AgentAvatar } from '../../avatars/AgentAvatar';
import { renderMarkdown } from '../../../utils/markdown';
import { formatTime, formatTimeShort } from '../../../utils';
import { MessageRoles } from '../../../constants/events';

/**
 * Sample 消息列表组件
 * 精简版布局：流式时显示可折叠活动卡片（思考中...），完成后只显示正文
 * 完全对齐 Vue 版 MessageList.vue 的 HTML 结构和 CSS 类名
 */

export interface SampleMessageListProps {
  /** 按智能体分组的消息记录 */
  messages: Record<string, HistoryMessage[]>;
  /** 当前选中的智能体名称 */
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
  /** 主题模式 */
  theme?: Theme;
  /** 思考中...区域最大显示条数 */
  activityMaxEntries?: number;
  /** 默认查询列表（消息为空时显示） */
  defaultQuerys?: string[];
  /** 用户是否使用默认头像（true 时显示通用图标，false 时显示用户名前2字符） */
  isUserDefaultAvatar?: boolean;
  /** 用户显示名称（头像非默认时显示前2字符） */
  userDisplayName?: string;
  /** 选择默认查询回调 */
  onSelectQuery?: (query: string) => void;
  /** 加载更多回调 */
  onLoadMore?: () => void;
  /** 是否有更多消息 */
  hasMore?: boolean;
  /** 是否正在加载更多 */
  isLoadingMore?: boolean;
  /** Sticky Header 插槽内容 */
  children?: React.ReactNode;
}

export interface SampleMessageListRef {
  scrollToBottom: () => void;
}

/** 思考中...条目 */
interface ActivityEntry {
  text: string;
  timestamp: number;
  icon: React.ReactNode;
  iconClass: string;
  status?: 'pending' | 'success' | 'failed';
}

export const SampleMessageList = forwardRef<SampleMessageListRef, SampleMessageListProps>(
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
      activityMaxEntries = 5,
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

    // ==================== 暴露方法 ====================

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

    // ==================== 滚动加载 ====================

    // 滚动到顶部时加载更多（触发前记录滚动位置）
    const handleScroll = useCallback(() => {
      const el = scrollRef.current;
      if (!el || !hasMore || isLoadingMore) return;
      if (el.scrollTop <= 50 && onLoadMore) {
        loadMoreScrollRef.current = { scrollHeight: el.scrollHeight, scrollTop: el.scrollTop };
        onLoadMore();
      }
    }, [hasMore, isLoadingMore, onLoadMore]);

    const themeClass = theme === 'light' ? 'sml-theme-light' : '';

    // ==================== 辅助函数 ====================

    /** 获取文档名称 */
    const getDocName = useCallback((doc: DocumentInfo): string => {
      if (typeof doc === 'string') {
        return (doc as string).split('/').pop() || (doc as string).split('\\').pop() || (doc as string);
      }
      return doc.fileName || '';
    }, []);

    /** 获取 Turn 的主智能体名称 */
    const getMainAgentName = useCallback((turn: Turn): string => {
      const contentStep = turn.steps.find(s => s.type === 'content');
      if (contentStep) return contentStep.msg.agent || 'AI';
      const stepAgent = turn.steps.find(s => s.msg.agent && s.type !== 'ask');
      return stepAgent?.msg.agent || 'AI';
    }, []);

    /** 获取 Turn 的时间（取最后一步的时间） */
    const getTurnTime = useCallback((turn: Turn): string => {
      if (turn.steps.length > 0) {
        return formatTime(turn.steps[turn.steps.length - 1].msg.timestamp);
      }
      return '';
    }, []);

    /** 判断 Turn 是否正在流式接收 */
    const isTurnStreaming = useCallback((turn: Turn): boolean => {
      for (let i = turn.steps.length - 1; i >= 0; i--) {
        if (turn.steps[i].type === 'content') {
          return turn.steps[i].msg.isStreaming === true;
        }
      }
      return turn.steps.length > 0;
    }, []);

    /** 判断 Turn 是否为错误消息 */
    const isTurnError = useCallback((turn: Turn): boolean => {
      const lastContent = getLastContentMsg(turn);
      return lastContent ? lastContent.role === MessageRoles.ERROR : false;
    }, []);

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

    // ==================== 思考中...条目（完全对齐 Vue 版 getActivityEntries） ====================

    /**
     * 获取思考中...条目（保留最后 N 条，FIFO 队列）
     * 完整实现 Vue 版的所有分支逻辑：ask、reason、tool、content、step
     */
    const getActivityEntries = useCallback(
      (turn: Turn): ActivityEntry[] => {
        const entries: ActivityEntry[] = [];

        for (const step of turn.steps) {
          if (step.type === 'ask') {
            // 智能体调度
            entries.push({
              text: `${step.msg.fromAgent} → 唤起 ${step.msg.toAgent || step.msg.agent}`,
              timestamp: step.msg.timestamp,
              icon: <ArrowRight size={11} />,
              iconClass: 'sml-icon-blue',
            });
          } else if (step.type === 'reason') {
            // 智能体思考
            entries.push({
              text: `智能体思考 · ${step.msg.agent}`,
              timestamp: step.msg.timestamp,
              icon: <BrainCircuit size={11} />,
              iconClass: 'sml-icon-emerald',
            });
          } else if (step.type === 'tool' && step.tool) {
            // 工具调用
            let label = `执行 ${step.tool.toolName}`;
            if (step.tool.toolName === 'runAgent') {
              try {
                const parsed = JSON.parse(step.tool.args);
                label = `智能体调度: ${parsed.agentName || parsed.agent || 'Unknown'}`;
              } catch { /* 保持默认 */ }
            } else if (step.tool.toolName === 'loadSkill') {
              try {
                const parsed = JSON.parse(step.tool.args);
                label = `加载技能: ${parsed.skillName || parsed.skill || 'Unknown'}`;
              } catch { /* 保持默认 */ }
            }
            const isRunAgent = step.tool.toolName === 'runAgent';
            const isLoadSkill = step.tool.toolName === 'loadSkill';
            entries.push({
              text: label,
              timestamp: step.tool.timestamp || step.msg.timestamp,
              icon: isRunAgent
                ? <Cpu size={11} />
                : isLoadSkill
                  ? <BookOpen size={11} />
                  : <Wrench size={11} />,
              iconClass: isRunAgent
                ? 'sml-icon-purple'
                : isLoadSkill
                  ? 'sml-icon-amber'
                  : 'sml-icon-yellow',
              status: step.tool.status,
            });
          } else if (step.type === 'content' && step.msg.content) {
            // 内容消息 — 按行拆分
            const lines = step.msg.content.split('\n').filter(line => line.trim() !== '');
            for (const line of lines) {
              entries.push({
                text: line.length > 60 ? line.slice(0, 60) + '...' : line,
                timestamp: step.msg.timestamp,
                icon: <FileText size={11} />,
                iconClass: 'sml-icon-dim',
              });
            }
          } else if (step.type === 'step') {
            // 其他内部步骤
            let label = step.msg.agent || '处理中...';
            if (step.msg.role === MessageRoles.TOOL_RESULT) label = '工具返回结果';
            else if (step.msg.role === MessageRoles.COMMAND) label = '执行命令';
            entries.push({
              text: label,
              timestamp: step.msg.timestamp,
              icon: <Cpu size={11} />,
              iconClass: 'sml-icon-dim',
            });
          }
        }

        return entries.slice(-activityMaxEntries);
      },
      [activityMaxEntries]
    );

    // ==================== 空状态 ====================

    if (turns.length === 0 && !isLoading) {
      return (
        <div className={`sml-container ${themeClass}`} ref={scrollRef}>
          {/* Sticky Header 插槽 */}
          <div className="sml-sticky-header">
            {children}
          </div>
          <div className="sml-empty">
            {/* 默认查询卡片 */}
            {defaultQuerys.length > 0 ? (
              <div className="sml-default-queries">
                <div className="sml-default-queries__title">有什么可以帮您的？</div>
                <div className="sml-default-queries__list">
                  {defaultQuerys.map((query, index) => (
                    <div
                      key={index}
                      className="sml-default-query-card"
                      onClick={() => onSelectQuery?.(query)}
                    >
                      <MessageSquare size={16} className="sml-default-query-icon" />
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
        </div>
      );
    }

    // ==================== 消息列表 ====================

    return (
      <div className={`sml-container ${themeClass}`} ref={scrollRef} onScroll={handleScroll}>
        {/* Sticky Header 插槽 */}
        <div className="sml-sticky-header">
          {children}
        </div>

        <div className="sml-turns">
          {turns.map((turn, tIdx) => (
            <div key={tIdx} className="sml-turn">

              {/* ====== 用户提问（右侧） ====== */}
              {turn.userMsg && (
                <div className="sml-user-block">
                  <div className="sml-body-row sml-body-row--user">
                    <div className="sml-user-bubble">
                      {/* 附件 */}
                      {turn.userMsg.documents && turn.userMsg.documents.length > 0 && (
                        <div className="sml-user-docs">
                          {turn.userMsg.documents.map((doc, i) => (
                            <div key={i} className="sml-doc-item">
                              <FileText size={12} className="text-blue-400" />
                              <span className="sml-doc-name">{getDocName(doc)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="sml-user-text">{turn.userMsg.content}</div>
                      <div className="sml-user-time">{formatTime(turn.userMsg.timestamp)}</div>
                    </div>
                    <div className="sml-user-avatar">
                      {isUserDefaultAvatar ? <User size={14} /> : <>{userDisplayName}</>}
                    </div>
                  </div>
                </div>
              )}

              {/* ====== AI 消息（左侧） ====== */}
              {turn.steps.length > 0 && (
                <div className="sml-ai-block">
                  {/* 头像 + 智能体名称 + 时间 */}
                  <div className="sml-header-row sml-header-row--ai">
                    <div className="sml-header-left">
                      <AgentAvatar
                        agentName={getMainAgentName(turn)}
                        size="small"
                      />
                      <span className="sml-header-name">{getMainAgentName(turn)}</span>
                    </div>
                    <span className="sml-header-time">{getTurnTime(turn)}</span>
                  </div>

                  {/* 内容区域 */}
                  <div className="sml-body-row sml-body-row--ai">

                    {/* 模式 A：流式接收中 — 思考中... */}
                    {isTurnStreaming(turn) ? (
                      <div className="sml-activity-card">
                        <details open className="sml-activity-details">
                          <summary className="sml-activity-summary">
                            <div className="sml-activity-summary-left">
                              <Loader2 size={12} className="sml-activity-spinner" />
                              <span className="sml-activity-label">思考中...</span>
                              <span className="sml-activity-count">({getActivityEntries(turn).length})</span>
                            </div>
                            <ChevronDown size={12} className="sml-chevron" />
                          </summary>
                          <div className="sml-activity-body">
                            {getActivityEntries(turn).map((entry, eIdx) => (
                              <div key={`act-${eIdx}`} className="sml-activity-entry">
                                <span className="sml-activity-time">{formatTimeShort(entry.timestamp)}</span>
                                <span className={`sml-activity-icon ${entry.iconClass}`}>
                                  {entry.icon}
                                </span>
                                <span className="sml-activity-text">{entry.text}</span>
                                {/* 工具状态 */}
                                {entry.status === 'pending' && (
                                  <Loader2 size={10} className="text-blue-500 animate-spin" />
                                )}
                                {entry.status === 'success' && (
                                  <Check size={10} className="text-green-500" />
                                )}
                                {entry.status === 'failed' && (
                                  <XCircle size={10} className="text-red-500" />
                                )}
                              </div>
                            ))}
                            {/* 无活动条目时的加载动画 */}
                            {getActivityEntries(turn).length === 0 && (
                              <div className="sml-activity-loading">
                                <span className="sml-dot sml-dot-1" />
                                <span className="sml-dot sml-dot-2" />
                                <span className="sml-dot sml-dot-3" />
                              </div>
                            )}
                          </div>
                        </details>
                      </div>
                    ) : (
                      /* 模式 B：完成/历史 — 完整消息 */
                      <div className="sml-final-block">
                        {/* 错误消息 */}
                        {isTurnError(turn) ? (
                          <div className="sml-error-body">
                            <div className="sml-error-inline">
                              <AlertCircle size={14} />
                              <span>{getLastContentMsg(turn)?.content}</span>
                            </div>
                            <span className="sml-final-time">
                              {getLastStepMsg(turn) ? formatTime(getLastStepMsg(turn)!.timestamp) : ''}
                            </span>
                          </div>
                        ) : getLastContentMsg(turn) ? (
                          /* 正常内容消息 */
                          <div className="sml-final-body">
                            <div
                              className="sml-final-text"
                              dangerouslySetInnerHTML={{
                                __html: renderMarkdown(getLastContentMsg(turn)?.content || ''),
                              }}
                            />
                            <span className="sml-final-time">
                              {getLastStepMsg(turn) ? formatTime(getLastStepMsg(turn)!.timestamp) : ''}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    )}

                  </div>
                </div>
              )}
            </div>
          ))}

          {/* 全局加载占位 */}
          {isLoading && turns.length === 0 && (
            <div className="sml-ai-block">
              <div className="sml-header-row sml-header-row--ai">
                <div className="sml-header-left">
                  <div className="sml-ai-avatar-icon">
                    <Loader2 size={14} className="text-white animate-spin" />
                  </div>
                  <span className="sml-header-name">AI</span>
                </div>
              </div>
              <div className="sml-body-row sml-body-row--ai">
                <div className="sml-loading-dots">
                  <span className="sml-dot sml-dot-1" />
                  <span className="sml-dot sml-dot-2" />
                  <span className="sml-dot sml-dot-3" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 加载更多指示器 */}
        {isLoadingMore && (
          <div className="sml-loading-more">
            <div style={{ color: 'var(--ml-text-secondary, #8b949e)', fontSize: 12, textAlign: 'center' }}>
              加载中...
            </div>
          </div>
        )}
      </div>
    );
  }
);

SampleMessageList.displayName = 'SampleMessageList';
