/**
 * A2UI 工具函数
 */
import type { ToolCallInfo } from '../../../../types';
import type { A2UIMessage } from '../../../../constants/events';
import { SpecialEventNames } from '../../../../constants/events';

/**
 * 从工具调用信息中提取 A2UI 事件
 *
 * 历史数据格式：toolCalls 中存储的是工具参数，需要根据 toolName 构建 A2UI 消息
 * 例如：
 * {
 *   toolName: "updateComponents",
 *   args: "{\"surfaceId\": \"main\", \"components\": [...]}"
 * }
 *
 * 需要转换为：
 * {
 *   version: "v0.9",
 *   updateComponents: { surfaceId: "main", components: [...] }
 * }
 */
export const extractA2UIEvents = (toolCalls: ToolCallInfo[]): A2UIMessage[] => {
  const events: A2UIMessage[] = [];

  for (const tc of toolCalls) {
    try {
      const args = JSON.parse(tc.args || '{}');

      if (tc.toolName === SpecialEventNames.CREATE_SURFACE && args.surfaceId) {
        events.push({
          version: 'v0.9',
          createSurface: {
            surfaceId: args.surfaceId,
            catalogId: args.catalogId || 'https://a2ui.org/specification/v0_9/basic_catalog.json',
            timestamp: tc.timestamp,
          } as any,
        });
      } else if (tc.toolName === SpecialEventNames.UPDATE_COMPONENTS && args.surfaceId && args.components) {
        // 确保 components 是数组
        const components = Array.isArray(args.components) ? args.components : [];
        if (components.length > 0) {
          events.push({
            version: 'v0.9',
            updateComponents: {
              surfaceId: args.surfaceId,
              components,
              timestamp: tc.timestamp,
            } as any,
          });
        }
      } else if (tc.toolName === SpecialEventNames.UPDATE_DATA_MODEL && args.surfaceId) {
        events.push({
          version: 'v0.9',
          updateDataModel: {
            surfaceId: args.surfaceId,
            path: args.path || '/',
            value: args.value,
            timestamp: tc.timestamp,
          } as any,
        });
      } else if (tc.toolName === SpecialEventNames.DELETE_SURFACE && args.surfaceId) {
        events.push({
          version: 'v0.9',
          deleteSurface: {
            surfaceId: args.surfaceId,
            timestamp: tc.timestamp,
          } as any,
        });
      }
    } catch {
      // 解析失败，跳过
    }
  }

  // 排序：确保 createSurface 在最前面
  events.sort((a, b) => {
    const getOrder = (event: A2UIMessage): number => {
      if (event.createSurface) return 0;
      if (event.updateComponents) return 1;
      if (event.updateDataModel) return 2;
      if (event.deleteSurface) return 3;
      return 4;
    };
    return getOrder(a) - getOrder(b);
  });

  return events;
};

/**
 * A2UI 事件名称集合
 */
export const A2UI_EVENT_NAMES = new Set<string>([
  SpecialEventNames.CREATE_SURFACE,
  SpecialEventNames.UPDATE_COMPONENTS,
  SpecialEventNames.UPDATE_DATA_MODEL,
  SpecialEventNames.DELETE_SURFACE,
]);
