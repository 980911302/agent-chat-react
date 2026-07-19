import React, { useCallback } from 'react';
import { FileText, Image, Video, Music, Archive, File, Paperclip, ArrowRight, CircleHelp, Check } from 'lucide-react';
import type { HistoryMessage, ToolCallInfo, DocumentInfo } from '../../../types';
import { MessageRoles } from '../../../constants/events';
import { renderMarkdown } from '../../../utils/markdown';
import { formatTime } from '../../../utils';

/**
 * 单条消息气泡组件
 * 用于独立展示单条消息（备用组件）
 */

export interface MessageBubbleProps {
  /** 消息对象 */
  message: HistoryMessage;
  /** 是否展示工具调用 */
  showToolCalls: boolean;
  /** 是否选中 */
  selected?: boolean;
  /** 发送者名称 */
  senderName: string;
  /** 点击事件 */
  onSelect?: () => void;
}

/** 获取文件类型图标 */
function getFileIcon(fileName: string): React.ReactNode {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  const iconProps = { size: 14 };

  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext)) {
    return <Image {...iconProps} />;
  }
  if (['mp4', 'avi', 'mov', 'mkv', 'webm'].includes(ext)) {
    return <Video {...iconProps} />;
  }
  if (['mp3', 'wav', 'ogg', 'flac', 'aac'].includes(ext)) {
    return <Music {...iconProps} />;
  }
  if (['zip', 'tar', 'gz', 'rar', '7z'].includes(ext)) {
    return <Archive {...iconProps} />;
  }
  if (['pdf', 'doc', 'docx', 'txt', 'md', 'rtf'].includes(ext)) {
    return <FileText {...iconProps} />;
  }
  return <File {...iconProps} />;
}

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
            animation: 'pulse 1.5s infinite',
          }}
        />
      );
    case 'success':
      return <span style={{ color: '#10b981', fontSize: 12 }}>✓</span>;
    case 'failed':
      return <span style={{ color: '#ef4444', fontSize: 12 }}>✗</span>;
    default:
      return null;
  }
};

/** 渲染文档附件 */
const DocumentList: React.FC<{ documents: DocumentInfo[] }> = ({ documents }) => (
  <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
    {documents.map((doc, i) => (
      <a
        key={i}
        href={doc.url || doc.localPath}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: '3px 8px',
          borderRadius: 6,
          background: 'var(--ml-bg-secondary, #161b22)',
          border: '1px solid var(--ml-border, #30363d)',
          color: 'var(--ml-text-primary, #c9d1d9)',
          fontSize: 12,
          textDecoration: 'none',
        }}
      >
        <Paperclip size={12} />
        {getFileIcon(doc.fileName)}
        <span>{doc.fileName}</span>
      </a>
    ))}
  </div>
);

/** 工具调用 参数/结果/错误 文本展示样式 */
const toolDataStyle: React.CSSProperties = {
  background: 'rgba(0, 0, 0, 0.3)',
  padding: 8,
  borderRadius: 6,
  fontSize: 11,
  fontFamily: "'SF Mono', 'Fira Code', monospace",
  overflowX: 'auto',
  whiteSpace: 'pre-wrap',
  margin: 0,
};

/** 渲染工具调用列表（每个工具调用独立可展开，展示 参数/结果/错误） */
const ToolCallList: React.FC<{ toolCalls: ToolCallInfo[] }> = ({ toolCalls }) => (
  <div
    style={{
      marginTop: 8,
      borderTop: '1px solid var(--ml-border, #30363d)',
      paddingTop: 8,
    }}
  >
    {toolCalls.map((tc, i) => (
      <details
        key={i}
        style={{
          marginBottom: 4,
          borderRadius: 8,
          border: '1px solid var(--ml-border, #30363d)',
          background: 'var(--ml-bg-secondary, #161b22)',
          padding: 8,
        }}
      >
        <summary
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12,
            listStyle: 'none',
          }}
        >
          <ToolStatusIcon status={tc.status} />
          <span style={{ fontFamily: "'SF Mono', monospace", color: 'var(--ml-accent, #58a6ff)' }}>
            {tc.toolName}
          </span>
          {tc.timestamp && (
            <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--ml-text-secondary, #8b949e)' }}>
              {formatTime(tc.timestamp)}
            </span>
          )}
        </summary>
        <div
          style={{
            marginTop: 8,
            borderTop: '1px solid var(--ml-border, #30363d)',
            paddingTop: 8,
          }}
        >
          {tc.args && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.7, marginBottom: 4 }}>参数:</div>
              <pre style={toolDataStyle}>{tc.args}</pre>
            </div>
          )}
          {tc.status === 'success' && tc.result && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.7, marginBottom: 4 }}>结果:</div>
              <pre style={toolDataStyle}>{tc.result}</pre>
            </div>
          )}
          {tc.status === 'failed' && tc.error && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.7, marginBottom: 4 }}>错误:</div>
              <pre style={{ ...toolDataStyle, color: '#fca5a5', background: 'rgba(239, 68, 68, 0.1)' }}>
                {tc.error}
              </pre>
            </div>
          )}
        </div>
      </details>
    ))}
  </div>
);

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  showToolCalls,
  selected = false,
  senderName,
  onSelect,
}) => {
  const isUser = message.role === MessageRoles.USER || message.role === MessageRoles.USER_ANSWER;
  const isError = message.role === MessageRoles.ERROR;
  const isAskUser = message.role === MessageRoles.ASK_USER;
  const isUserAnswer = message.role === MessageRoles.USER_ANSWER;
  const isAskAgent = message.role === MessageRoles.ASK_AGENT;

  // 确定气泡样式
  let bgStyle: string;
  let align: string;

  if (isUser) {
    bgStyle = 'linear-gradient(135deg, #1a5fb4, #1c71d8)';
    align = 'flex-end';
  } else if (isError) {
    bgStyle = 'rgba(239, 68, 68, 0.15)';
    align = 'flex-start';
  } else if (isAskUser) {
    bgStyle = 'rgba(245, 158, 11, 0.15)';
    align = 'flex-start';
  } else {
    bgStyle = 'var(--ml-bg-primary, #0E1117)';
    align = 'flex-start';
  }

  const handleClick = useCallback(() => {
    onSelect?.();
  }, [onSelect]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: align as any,
        maxWidth: '100%',
        marginBottom: 8,
      }}
      onClick={handleClick}
    >
      {/* Agent2Agent 徽章：智能体A -> 智能体B */}
      {isAskAgent && message.fromAgent && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 2,
            paddingLeft: 4,
            fontSize: 11,
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '2px 8px',
              borderRadius: 12,
              fontWeight: 600,
              fontSize: 11,
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: '#ffffff',
            }}
          >
            {message.fromAgent}
          </span>
          <ArrowRight size={12} style={{ color: '#3b82f6' }} />
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '2px 8px',
              borderRadius: 12,
              fontWeight: 600,
              fontSize: 11,
              background: 'linear-gradient(135deg, #f093fb, #f5576c)',
              color: '#ffffff',
            }}
          >
            {message.agent}
          </span>
        </div>
      )}

      {/* 发送者名称 / AskUser 询问头部 / UserAnswer 回答头部 */}
      {(isUserAnswer || !isUser) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 11,
            color: 'var(--ml-text-secondary, #8b949e)',
            marginBottom: 2,
            paddingLeft: 4,
          }}
        >
          {isAskUser ? (
            <>
              <CircleHelp size={14} style={{ color: '#f59e0b' }} />
              <span>{senderName} 询问</span>
            </>
          ) : isUserAnswer ? (
            <>
              <Check size={14} style={{ color: '#10b981' }} />
              <span>用户回答 → {message.agent}</span>
            </>
          ) : (
            senderName
          )}
        </div>
      )}

      {/* 消息气泡 */}
      <div
        className={`message-bubble ${selected ? 'selected' : ''}`}
        style={{
          background: bgStyle,
          borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          padding: '10px 14px',
          maxWidth: '80%',
          border: selected ? '2px solid var(--ml-accent, #58a6ff)' : '1px solid var(--ml-border, #30363d)',
          cursor: onSelect ? 'pointer' : 'default',
          wordBreak: 'break-word',
        }}
      >
        {/* 时间戳（用户消息在气泡内） */}
        {isUser && (
          <div
            style={{
              fontSize: 10,
              color: 'rgba(255,255,255,0.5)',
              textAlign: 'right',
              marginBottom: 4,
              fontFamily: "'SF Mono', monospace",
            }}
          >
            {formatTime(message.timestamp)}
          </div>
        )}

        {/* 消息内容 */}
        {message.content ? (
          <div
            className="message-content"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
          />
        ) : message.isStreaming ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span className="typing-dot">●</span>
            <span className="typing-dot" style={{ animationDelay: '0.2s' }}>●</span>
            <span className="typing-dot" style={{ animationDelay: '0.4s' }}>●</span>
          </div>
        ) : null}

        {/* 文档附件 */}
        {message.documents && message.documents.length > 0 && (
          <DocumentList documents={message.documents} />
        )}

        {/* 工具调用 */}
        {showToolCalls && message.toolCalls && message.toolCalls.length > 0 && (
          <ToolCallList toolCalls={message.toolCalls} />
        )}
      </div>

      {/* 时间戳（非用户消息在气泡下方） */}
      {!isUser && (
        <div
          style={{
            fontSize: 10,
            color: 'var(--ml-text-tertiary, #6e7681)',
            marginTop: 2,
            paddingLeft: 4,
            fontFamily: "'SF Mono', monospace",
          }}
        >
          {formatTime(message.timestamp)}
        </div>
      )}
    </div>
  );
};
