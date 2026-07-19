import React from 'react';

/**
 * Token 使用量进度条组件
 * 显示智能体的上下文窗口使用情况
 * HTML 结构和样式完全对齐 Vue 版 TokensBar.vue
 */

export interface TokensBarProps {
  /** 智能体名称 */
  agentName: string;
  /** 当前 token 数量 */
  tokens: number;
  /** 最大 token 数量 */
  maxTokens?: number;
}

/** 格式化 token 数值，对齐 Vue 版 formatTokens */
function formatTokens(tokens: number): string {
  if (tokens >= 1024 * 1024) return `${(tokens / (1024 * 1024)).toFixed(1)}M`;
  if (tokens >= 1024) return `${(tokens / 1024).toFixed(1)}K`;
  return tokens.toString();
}

/** 根据 token 数量确定颜色 class */
function getColorClass(tokens: number): string {
  if (tokens >= 256 * 1024) return 'tokens-bar__fill--red';
  if (tokens >= 128 * 1024) return 'tokens-bar__fill--amber';
  return 'tokens-bar__fill--emerald';
}

export const TokensBar: React.FC<TokensBarProps> = ({
  agentName,
  tokens,
  maxTokens = 1024 * 1024,
}) => {
  if (!agentName) return null;

  const fillPercent = Math.min((tokens / maxTokens) * 100, 100);
  const colorClass = getColorClass(tokens);

  return (
    <div className="tokens-bar">
      <span className="tokens-bar__name">{agentName}</span>
      <span className="tokens-bar__value">{formatTokens(tokens)}</span>
      <div className="tokens-bar__track-wrapper">
        <div className="tokens-bar__track">
          <div
            className={`tokens-bar__fill ${colorClass}`}
            style={{ width: `${fillPercent}%` }}
          />
          {/* 刻度线 */}
          <div className="tokens-bar__tick tokens-bar__tick--32k" />
          <div className="tokens-bar__tick tokens-bar__tick--64k" />
          <div className="tokens-bar__tick tokens-bar__tick--128k" />
          <div className="tokens-bar__tick tokens-bar__tick--256k" />
          <div className="tokens-bar__tick tokens-bar__tick--512k" />
        </div>
        {/* 刻度标签 */}
        <div className="tokens-bar__labels">
          <span>0</span>
          <span>128K</span>
          <span>256K</span>
          <span>512K</span>
          <span>1M</span>
        </div>
      </div>
    </div>
  );
};
