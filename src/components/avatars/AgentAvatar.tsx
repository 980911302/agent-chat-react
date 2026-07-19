import React from 'react';
import { User } from 'lucide-react';
import { hashColor } from '../../utils';

/**
 * 智能体头像组件
 * 支持图片、Emoji、SVG、文字头像等多种模式
 */

export interface AgentAvatarProps {
  /** 图片 URL */
  src?: string;
  /** Emoji 字符 */
  emoji?: string;
  /** 原始 SVG HTML */
  svg?: string;
  /** 文字头像内容 */
  text?: string;
  /** 智能体名称（作为 text 的别名） */
  agentName?: string;
  /** 尺寸 */
  size?: 'small' | 'medium' | 'large';
  /** 自定义背景色 */
  color?: string;
  /** 是否为群组 */
  isGroup?: boolean;
}

const SIZE_MAP = {
  small: 24,
  medium: 32,
  large: 48,
};

const FONT_SIZE_MAP = {
  small: 10,
  medium: 13,
  large: 18,
};

export const AgentAvatar: React.FC<AgentAvatarProps> = ({
  src = '',
  emoji = '',
  svg = '',
  text = '',
  agentName = '',
  size = 'medium',
  color = '',
  isGroup = false,
}) => {
  const displayText = text || agentName;
  const dimension = SIZE_MAP[size];
  const fontSize = FONT_SIZE_MAP[size];

  // 计算背景色：isGroup 为真时无条件使用群组渐变色，忽略自定义 color
  const bgColor = isGroup
    ? 'linear-gradient(135deg, #f59e0b, #ea580c)'
    : color || hashColor(displayText || 'agent');

  const baseStyle: React.CSSProperties = {
    width: dimension,
    height: dimension,
    minWidth: dimension,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    fontSize,
    fontWeight: 600,
    color: '#fff',
    background: bgColor,
    ...(isGroup
      ? { boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.2), 0 0 0 3px #f59e0b' }
      : {}),
  };

  // 优先级: src > emoji > svg > text > fallback
  let content: React.ReactNode;

  if (src) {
    content = (
      <img
        src={src}
        alt={displayText}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    );
  } else if (emoji) {
    content = <span style={{ fontSize: dimension * 0.6 }}>{emoji}</span>;
  } else if (svg) {
    content = <div dangerouslySetInnerHTML={{ __html: svg }} style={{ width: '70%', height: '70%' }} />;
  } else if (displayText) {
    content = <span>{displayText.slice(0, 2)}</span>;
  } else {
    content = <User size={dimension * 0.5} />;
  }

  return <div style={baseStyle} className="agent-avatar">{content}</div>;
};
