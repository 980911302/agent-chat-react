/**
 * 通用工具函数
 */

/**
 * 延迟指定毫秒
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 格式化时间戳为完整日期时间格式（对齐 Vue 版）
 * @param timestamp 时间戳（数字或字符串）
 * @returns 格式化后的时间字符串，格式：YYYY-MM-DD HH:mm:ss
 */
export function formatTime(timestamp: number | string): string {
  if (!timestamp) return '';
  const d = new Date(timestamp);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/**
 * 格式化时间戳为短时间格式（仅时:分:秒）
 * @param timestamp 时间戳
 * @returns 格式化后的时间字符串，格式：HH:mm:ss
 */
export function formatTimeShort(timestamp: number): string {
  if (!timestamp) return '';
  const d = new Date(timestamp);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/**
 * 从文本生成确定性哈希颜色
 */
const COLOR_PALETTE = [
  '#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399',
  '#9254de', '#36cfc9', '#ff9c6e', '#ff7875', '#a0d911',
  '#13c2c2', '#1890ff', '#722ed1', '#eb2f96', '#fa541c',
];

export function hashColor(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  return COLOR_PALETTE[Math.abs(hash) % COLOR_PALETTE.length];
}

/**
 * 生成 UUID
 */
export function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** 提示消息类型 */
export type NotifyType = 'error' | 'warning' | 'info';

/**
 * 触发提示消息 —— 不内置任何 UI 库，由外部通过 onNotify 接入自己的 toast/message 组件
 * 未传 onNotify 时退化为 console 输出，避免消息被静默吞掉
 */
export function notify(
  onNotify: ((type: NotifyType, message: string) => void) | undefined,
  type: NotifyType,
  message: string
): void {
  if (onNotify) {
    onNotify(type, message);
    return;
  }
  const log = type === 'error' ? console.error : type === 'warning' ? console.warn : console.info;
  log(`[agent-chat] ${message}`);
}
