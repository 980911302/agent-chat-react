export type NotifyType = 'success' | 'error' | 'warning' | 'info';

export interface NotifyHandler {
    success: (message: string) => void;
    error: (message: string) => void;
    warning: (message: string) => void;
    info: (message: string) => void;
}

let _handler: NotifyHandler | null = null;

/**
 * 设置全局通知处理器
 * @param handler 通知处理器
 */
export function setNotifyHandler(handler: NotifyHandler) {
    _handler = handler;
}

/**
 * 获取当前通知处理器
 */
export function getNotifyHandler(): NotifyHandler | null {
    return _handler;
}

/**
 * 发送通知
 * @param type 通知类型
 * @param message 消息内容
 */
export function notify(type: NotifyType, message: string) {
    _handler?.[type]?.(message);
}
