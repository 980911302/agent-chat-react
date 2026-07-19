import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useState,
  useCallback,
} from 'react';
import { useSelector } from 'react-redux';
import { User } from 'lucide-react';
import type { Theme } from '../../../types';

// Web Component 类型声明
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'a2ui-surface': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { 'data-surface-id'?: string }, HTMLElement>;
    }
  }
}
import type { A2UIMessage } from '../../../constants/events';
import { SpecialEventNames } from '../../../constants/events';
import { formatTime } from '../../../utils';
import type { RootState } from '../../../store';
import { selectSessionId } from '../../../store/chatSlice';
import { getApiInstance } from '../../../config';
import { extractA2UIEvents, A2UI_EVENT_NAMES } from './utils';

/**
 * A2UI 消息列表组件
 * 使用 @a2ui/lit 和 @a2ui/web_core 渲染交互式 UI Surface
 *
 * 注意：此组件需要 @a2ui/lit 和 @a2ui/web_core 作为可选依赖
 */

export interface A2UIMessageListProps {
  /** 主题 */
  theme?: Theme;
  /** A2UI 特殊事件订阅函数 */
  onSpecialEvent?: (eventName: string, callback: (data: any) => void) => () => void;
  /** 会话切换回调 */
  onSessionSwitch?: (callback: (reason: string) => void) => () => void;
  /** A2UI 用户操作回调（回传给后端） */
  onA2UIAction?: (surfaceId: string, action: any) => void;
}

export interface A2UIMessageListRef {
  addUserMessage: (msg: string) => void;
  loadLatest: () => void;
  loadMore: () => void;
  scrollToBottom: () => void;
}

/** 时间线条目类型 */
interface TimelineItem {
  id: string;
  type: 'user' | 'a2ui';
  content?: string;
  surfaceId?: string;
  timestamp: number;
}

interface PendingEvent {
  type: string;
  data: any;
}

interface SurfaceCache {
  components?: any;
  data?: any;
  surfaceCreated?: boolean;
  surfaceInstance?: any;
  pendingComponents?: any;
  pendingData?: any;
}

const DEFAULT_PAGE_SIZE = 5;
const MAX_SURFACES = 10;

export const A2UIMessageList = forwardRef<A2UIMessageListRef, A2UIMessageListProps>(
  ({ theme = 'dark', onSpecialEvent, onSessionSwitch, onA2UIAction }, ref) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const pageIndexRef = useRef(0);
    const surfaceElementRefs = useRef<Map<string, HTMLElement>>(new Map());
    const surfaceCacheRef = useRef<Map<string, SurfaceCache>>(new Map());
    const pendingEventsRef = useRef<Map<string, PendingEvent[]>>(new Map());
    const processorRef = useRef<any>(null);
    const a2uiModulesRef = useRef<any>(null);
    const activeUserMessageIdRef = useRef<string | null>(null);
    const sessionIdRef = useRef<string | null>(null);

    const [a2uiLoaded, setA2uiLoaded] = useState(false);

    const sessionId = useSelector<RootState, string | null>(selectSessionId);

    useEffect(() => {
      sessionIdRef.current = sessionId;
    }, [sessionId]);

    /* ──────────── 滚动 ──────────── */

    const scrollToBottom = useCallback(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, []);

    /* ──────────── 自动滚动 ──────────── */

    useEffect(() => {
      scrollToBottom();
    }, [timelineItems, scrollToBottom]);

    /* ──────────── A2UI 库初始化 ──────────── */

    useEffect(() => {
      let cancelled = false;

      Promise.all([
        import('@a2ui/lit/v0_9'),
        import('@a2ui/web_core/v0_9'),
      ])
        .then(([litModule, coreModule]: [any, any]) => {
          if (cancelled) return;

          const { basicCatalog } = litModule;
          const { MessageProcessor } = coreModule;

          a2uiModulesRef.current = { lit: litModule, core: coreModule, basicCatalog };

          const processor = new MessageProcessor([basicCatalog]);
          processorRef.current = processor;

          processor.onSurfaceCreated((surface: any) => {
            const sid = surface.surfaceId || surface.id;
            if (!sid) return;

            const cache = surfaceCacheRef.current.get(sid) || {};
            cache.surfaceInstance = surface;
            cache.surfaceCreated = true;
            surfaceCacheRef.current.set(sid, cache);

            const el = surfaceElementRefs.current.get(sid);
            if (el) {
              (el as any).surface = surface;
            }

            const pending = pendingEventsRef.current.get(sid);
            if (pending && pending.length > 0) {
              const batch: A2UIMessage[] = [];
              for (const evt of pending) {
                if (evt.type === SpecialEventNames.UPDATE_COMPONENTS && evt.data) {
                  const components = Array.isArray(evt.data)
                    ? evt.data
                    : evt.data.components;
                  if (components && components.length > 0) {
                    batch.push({
                      updateComponents: { surfaceId: sid, components },
                    });
                  }
                } else if (evt.type === SpecialEventNames.UPDATE_DATA_MODEL && evt.data) {
                  const { surfaceId: _, timestamp: __, ...dataModel } = evt.data;
                  batch.push({
                    updateDataModel: { surfaceId: sid, ...dataModel },
                  });
                }
              }
              pendingEventsRef.current.delete(sid);
              if (batch.length > 0) {
                processor.processMessages(
                  batch.map((m: any) => ({ version: 'v0.9', ...m }))
                );
              }
            }

            cleanupOldSurfacesInternal();
          });

          setA2uiLoaded(true);
        })
        .catch((err) => {
          console.warn('[agent-chat] @a2ui/lit 或 @a2ui/web_core 未安装，A2UI 功能不可用', err);
        });

      return () => {
        cancelled = true;
      };
    }, []);

    /* ──────────── 清理旧 Surface ──────────── */

    const cleanupOldSurfacesInternal = useCallback(() => {
      const processor = processorRef.current;
      if (!processor) return;

      const surfaceIds = Array.from(surfaceElementRefs.current.keys());

      if (surfaceIds.length <= MAX_SURFACES) return;

      const toRemove = surfaceIds.slice(0, surfaceIds.length - MAX_SURFACES);
      for (const id of toRemove) {
        try {
          processor.processMessages([
            { version: 'v0.9', deleteSurface: { surfaceId: id } },
          ]);
        } catch {}
        surfaceCacheRef.current.delete(id);
        surfaceElementRefs.current.delete(id);
      }

      setTimelineItems((prev) =>
        prev.filter((item) => item.surfaceId && !toRemove.includes(item.surfaceId))
      );
    }, []);

    /* ──────────── Surface 操作 ──────────── */

    const processSurfaceEvent = useCallback((sid: string, eventName: string, data: any) => {
      const processor = processorRef.current;
      if (!processor) return;

      const cache = surfaceCacheRef.current.get(sid);

      if (eventName === SpecialEventNames.CREATE_SURFACE) {
        const catalogId = data.catalogId || data.catalog?.id || 'basic';
        processor.processMessages([
          {
            version: 'v0.9',
            createSurface: { surfaceId: sid, catalogId },
          },
        ]);
        const newCache: SurfaceCache = cache || {};
        newCache.surfaceCreated = true;
        surfaceCacheRef.current.set(sid, newCache);
        return;
      }

      if (eventName === SpecialEventNames.UPDATE_COMPONENTS) {
        if (!cache?.surfaceCreated) {
          const existing = pendingEventsRef.current.get(sid) || [];
          existing.push({ type: eventName, data });
          pendingEventsRef.current.set(sid, existing);
          return;
        }

        const components = Array.isArray(data) ? data : data?.components;
        if (!components || components.length === 0) return;

        processor.processMessages([
          {
            version: 'v0.9',
            updateComponents: { surfaceId: sid, components },
          },
        ]);

        const updated: SurfaceCache = cache || {};
        updated.components = components;
        surfaceCacheRef.current.set(sid, updated);

        if (updated.data) {
          processor.processMessages([
            { version: 'v0.9', updateDataModel: { surfaceId: sid, ...updated.data } },
          ]);
        }
      }

      if (eventName === SpecialEventNames.UPDATE_DATA_MODEL) {
        if (!cache?.surfaceCreated) {
          const existing = pendingEventsRef.current.get(sid) || [];
          existing.push({ type: eventName, data });
          pendingEventsRef.current.set(sid, existing);
          return;
        }

        const { surfaceId: _, timestamp: __, ...dataModel } = data || {};
        const updated: SurfaceCache = cache || {};
        updated.data = dataModel;

        if (updated.components) {
          processor.processMessages([
            { version: 'v0.9', updateDataModel: { surfaceId: sid, ...dataModel } },
          ]);
        }

        surfaceCacheRef.current.set(sid, updated);
      }

      if (eventName === SpecialEventNames.DELETE_SURFACE) {
        processor.processMessages([
          { version: 'v0.9', deleteSurface: { surfaceId: sid } },
        ]);
        surfaceCacheRef.current.delete(sid);
        surfaceElementRefs.current.delete(sid);
        pendingEventsRef.current.delete(sid);
        setTimelineItems((prev) =>
          prev.filter((item) => item.surfaceId !== sid)
        );
      }
    }, []);

    /* ──────────── 实时 A2UI 事件处理 ──────────── */

    const handleRealtimeA2UIEvent = useCallback(
      (eventData: any) => {
        if (!activeUserMessageIdRef.current) return;

        const sid = `surface-${activeUserMessageIdRef.current}`;

        if (eventData.createSurface) {
          processSurfaceEvent(sid, SpecialEventNames.CREATE_SURFACE, eventData.createSurface);
        }
        if (eventData.updateComponents) {
          processSurfaceEvent(sid, SpecialEventNames.UPDATE_COMPONENTS, eventData.updateComponents);
        }
        if (eventData.updateDataModel) {
          processSurfaceEvent(sid, SpecialEventNames.UPDATE_DATA_MODEL, eventData.updateDataModel);
        }

        // 实时更新已存在 Surface 的内容/数据不会改变 timelineItems，
        // 需要显式触发滚动（与 Vue 版 nextTick(() => scrollToBottom()) 对齐）
        setTimeout(() => scrollToBottom(), 0);
      },
      [processSurfaceEvent, scrollToBottom]
    );

    /* ──────────── 特殊事件订阅 ──────────── */

    useEffect(() => {
      if (!a2uiLoaded || !onSpecialEvent) return;

      const unsubs: (() => void)[] = [];

      const eventNames = Array.from(A2UI_EVENT_NAMES);
      for (const eventName of eventNames) {
        const unsub = onSpecialEvent(eventName, (data: any) => {
          handleRealtimeA2UIEvent(data);
        });
        unsubs.push(unsub);
      }

      return () => {
        for (const unsub of unsubs) {
          unsub();
        }
      };
    }, [a2uiLoaded, onSpecialEvent, handleRealtimeA2UIEvent]);

    /* ──────────── 数据加载 ──────────── */

    const restoreFromHistoryRef = useRef<(groups: any[], prepend: boolean) => Promise<void>>();

    restoreFromHistoryRef.current = useCallback(
      async (groups: any[], prepend: boolean = false) => {
        const newItems: TimelineItem[] = [];

        for (const group of groups) {
          if (!group.userMessage) continue;

          const userMsgId = group.userMessage.id;
          const surfId = `surface-${userMsgId}`;

          newItems.push({
            id: userMsgId,
            type: 'user' as const,
            timestamp: group.userMessage.timestamp,
            content: group.userMessage.content,
          });

          const a2uiEvents = extractA2UIEvents(group.toolCalls || []);

          if (a2uiEvents.length > 0) {
            newItems.push({
              id: `${userMsgId}-a2ui`,
              type: 'a2ui' as const,
              timestamp: group.toolCalls?.[0]?.timestamp || group.userMessage.timestamp,
              surfaceId: surfId,
            });
          }
        }

        newItems.sort((a, b) => a.timestamp - b.timestamp);

        setTimelineItems((prev) =>
          prepend ? [...newItems, ...prev] : newItems
        );

        await new Promise((r) => setTimeout(r, 50));

        for (const group of groups) {
          if (!group.userMessage) continue;

          const userMsgId = group.userMessage.id;
          const surfId = `surface-${userMsgId}`;
          const a2uiEvents = extractA2UIEvents(group.toolCalls || []);

          for (const evt of a2uiEvents) {
            if (evt.createSurface) {
              processSurfaceEvent(surfId, SpecialEventNames.CREATE_SURFACE, evt.createSurface);
            } else if (evt.updateComponents) {
              processSurfaceEvent(
                surfId,
                SpecialEventNames.UPDATE_COMPONENTS,
                { ...evt.updateComponents, surfaceId: surfId }
              );
            } else if (evt.updateDataModel) {
              processSurfaceEvent(
                surfId,
                SpecialEventNames.UPDATE_DATA_MODEL,
                { ...evt.updateDataModel, surfaceId: surfId }
              );
            } else if (evt.deleteSurface) {
              processSurfaceEvent(surfId, SpecialEventNames.DELETE_SURFACE, evt.deleteSurface);
            }
          }
        }
      },
      [processSurfaceEvent]
    );

    const loadLatestInternalRef = useRef<() => Promise<void>>();

    loadLatestInternalRef.current = useCallback(async () => {
      const sid = sessionIdRef.current;
      if (!sid) return;

      setIsLoading(true);
      pageIndexRef.current = 0;

      try {
        const api = getApiInstance();
        const response: any = await api.get(`/messages/${sid}/toolCalls`, {
          params: {
            toolNames: Array.from(A2UI_EVENT_NAMES).join(','),
            isLike: true,
            pageSize: DEFAULT_PAGE_SIZE,
            pageIndex: 0,
          },
        });

        const result = response.data || response;
        if (result.success && result.data) {
          const { groups, pagination } = result.data;
          await restoreFromHistoryRef.current!(groups, false);
          setHasMore(pagination?.hasMore ?? false);
          pageIndexRef.current = 1;
        }
      } catch (err) {
        console.error('[A2UI] loadLatest failed:', err);
      } finally {
        setIsLoading(false);
      }
    }, []);

    const loadLatest = useCallback(() => {
      loadLatestInternalRef.current?.();
    }, []);

    const loadMore = useCallback(async () => {
      const sid = sessionIdRef.current;
      if (!sid || isLoadingMore || !hasMore) return;

      setIsLoadingMore(true);

      try {
        const api = getApiInstance();
        const response: any = await api.get(`/messages/${sid}/toolCalls`, {
          params: {
            toolNames: Array.from(A2UI_EVENT_NAMES).join(','),
            isLike: true,
            pageSize: DEFAULT_PAGE_SIZE,
            pageIndex: pageIndexRef.current,
          },
        });

        const result = response.data || response;
        if (result.success && result.data) {
          const { groups, pagination } = result.data;
          await restoreFromHistoryRef.current!(groups, true);
          setHasMore(pagination?.hasMore ?? false);
          pageIndexRef.current++;
        }
      } catch (err) {
        console.error('[A2UI] loadMore failed:', err);
      } finally {
        setIsLoadingMore(false);
      }
    }, [isLoadingMore, hasMore]);

    /* ──────────── 会话切换 ──────────── */

    useEffect(() => {
      if (!onSessionSwitch) return;

      const unsub = onSessionSwitch(async (_reason: string) => {
        processorRef.current = null;
        surfaceElementRefs.current.clear();
        surfaceCacheRef.current.clear();
        pendingEventsRef.current.clear();
        activeUserMessageIdRef.current = null;
        setTimelineItems([]);
        pageIndexRef.current = 0;
        setHasMore(true);

        if (a2uiModulesRef.current) {
          const { basicCatalog } = a2uiModulesRef.current;
          const { MessageProcessor } = a2uiModulesRef.current.core;
          const processor = new MessageProcessor([basicCatalog]);
          processorRef.current = processor;

          processor.onSurfaceCreated((surface: any) => {
            const sid = surface.surfaceId || surface.id;
            if (!sid) return;

            const cache = surfaceCacheRef.current.get(sid) || {};
            cache.surfaceInstance = surface;
            cache.surfaceCreated = true;
            surfaceCacheRef.current.set(sid, cache);

            const el = surfaceElementRefs.current.get(sid);
            if (el) {
              (el as any).surface = surface;
            }

            const pending = pendingEventsRef.current.get(sid);
            if (pending && pending.length > 0) {
              const batch: A2UIMessage[] = [];
              for (const evt of pending) {
                if (evt.type === SpecialEventNames.UPDATE_COMPONENTS && evt.data) {
                  const components = Array.isArray(evt.data)
                    ? evt.data
                    : evt.data.components;
                  if (components && components.length > 0) {
                    batch.push({
                      updateComponents: { surfaceId: sid, components },
                    });
                  }
                } else if (evt.type === SpecialEventNames.UPDATE_DATA_MODEL && evt.data) {
                  const { surfaceId: _, timestamp: __, ...dataModel } = evt.data;
                  batch.push({
                    updateDataModel: { surfaceId: sid, ...dataModel },
                  });
                }
              }
              pendingEventsRef.current.delete(sid);
              if (batch.length > 0) {
                processor.processMessages(
                  batch.map((m: any) => ({ version: 'v0.9', ...m }))
                );
              }
            }
          });
        }

        loadLatestInternalRef.current?.();
      });

      return unsub;
    }, [onSessionSwitch]);

    /* ──────────── 滚动加载更多 ──────────── */

    const handleScroll = useCallback(() => {
      const list = scrollRef.current;
      if (!list || isLoadingMore || !hasMore) return;
      if (list.scrollTop < 50) {
        loadMore();
      }
    }, [isLoadingMore, hasMore, loadMore]);

    /* ──────────── 暴露方法 ──────────── */

    useImperativeHandle(ref, () => ({
      addUserMessage: (msg: string) => {
        const userMsgId = `${sessionIdRef.current || 'session'}-${Date.now()}`;
        const surfId = `surface-${userMsgId}`;

        activeUserMessageIdRef.current = userMsgId;

        setTimelineItems((prev) => [
          ...prev,
          {
            id: userMsgId,
            type: 'user',
            content: msg,
            timestamp: Date.now(),
          },
          {
            id: `${userMsgId}-a2ui`,
            type: 'a2ui',
            surfaceId: surfId,
            timestamp: Date.now() + 1,
          },
        ]);
      },
      loadLatest,
      loadMore,
      scrollToBottom,
    }));

    /* ──────────── 初始化加载 ──────────── */

    useEffect(() => {
      if (a2uiLoaded && sessionId) {
        loadLatestInternalRef.current?.();
      }
    }, [a2uiLoaded, sessionId]);

    /* ──────────── 渲染 ──────────── */

    const themeClass = theme === 'light' ? 'a2ui-theme-light' : '';

    const getSurfaceRefCallback = useCallback(
      (surfaceId: string) => (el: any) => {
        if (el) {
          surfaceElementRefs.current.set(surfaceId, el);
          const cache = surfaceCacheRef.current.get(surfaceId);
          if (cache?.surfaceInstance) {
            el.surface = cache.surfaceInstance;
          }
        } else {
          surfaceElementRefs.current.delete(surfaceId);
        }
      },
      []
    );

    return (
      <div
        className={`message-list a2ui-list ${themeClass}`}
        ref={scrollRef}
        onScroll={handleScroll}
      >
        {isLoadingMore && (
          <div
            style={{
              textAlign: 'center',
              padding: 12,
              color: 'var(--ml-text-secondary, #8b949e)',
              fontSize: 13,
              position: 'sticky',
              top: 0,
              zIndex: 10,
              backgroundColor: theme === 'light' ? '#fff' : '#0E1117',
            }}
          >
            加载更多...
          </div>
        )}

        {!isLoadingMore && hasMore && timelineItems.length > 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: 12,
              color: 'var(--ml-text-secondary, #8b949e)',
              fontSize: 13,
              position: 'sticky',
              top: 0,
              zIndex: 10,
              backgroundColor: theme === 'light' ? '#fff' : '#0E1117',
            }}
          >
            滚动加载更多
          </div>
        )}

        {isLoading && (
          <div
            style={{
              textAlign: 'center',
              padding: 40,
              color: 'var(--ml-text-secondary, #8b949e)',
            }}
          >
            加载中...
          </div>
        )}

        {!isLoading &&
          a2uiLoaded &&
          timelineItems.map((item) => (
            <div key={item.id} className="a2ui-timeline-item">
              {item.type === 'user' ? (
                <div className="a2ui-user-block">
                  <div className="a2ui-body-row a2ui-body-row--user">
                    <div className="a2ui-user-bubble">
                      <div className="a2ui-user-text">{item.content}</div>
                      <div className="a2ui-user-time">{formatTime(item.timestamp)}</div>
                    </div>
                    <div className="a2ui-user-avatar">
                      <User size={14} />
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="a2ui-surface-wrapper"
                  style={{
                    backgroundColor: theme === 'light' ? '#ffffff' : '#0D1117',
                    border: '1px solid var(--ml-border, #30363d)',
                    borderRadius: 12,
                    overflow: 'hidden',
                    minHeight: 100,
                  }}
                >
                  <a2ui-surface
                    ref={getSurfaceRefCallback(item.surfaceId!)}
                    data-surface-id={item.surfaceId}
                  />
                </div>
              )}
            </div>
          ))}

        {!isLoading && a2uiLoaded && timelineItems.length === 0 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              padding: 40,
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.3 }}>🎨</div>
            <div style={{ color: 'var(--ml-text-secondary, #8b949e)' }}>
              A2UI 交互模式
            </div>
          </div>
        )}

        {!a2uiLoaded && (
          <div
            style={{
              textAlign: 'center',
              padding: 40,
              color: 'var(--ml-text-secondary, #8b949e)',
            }}
          >
            A2UI 组件库加载中...
          </div>
        )}
      </div>
    );
  }
);

A2UIMessageList.displayName = 'A2UIMessageList';
