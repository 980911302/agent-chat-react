import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';

/**
 * Markdown 渲染工具
 * 使用 markdown-it 解析 + DOMPurify 过滤 XSS
 */

// 单例 markdown-it 实例
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
});

// 自定义链接渲染：在新窗口打开
const defaultRender =
  md.renderer.rules.link_open ||
  function (tokens: any[], idx: number, options: any, _env: any, self: any) {
    return self.renderToken(tokens, idx, options);
  };

md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  const token = tokens[idx];
  const hrefIndex = token.attrIndex('href');
  if (hrefIndex >= 0) {
    token.attrPush(['target', '_blank']);
    token.attrPush(['rel', 'noopener noreferrer']);
  }
  return defaultRender(tokens, idx, options, env, self);
};

// 代码块高亮占位（可选接入 highlight.js 等）
md.options.highlight = function (str: string, lang: string) {
  const escapedStr = md.utils.escapeHtml(str);
  if (lang) {
    return `<pre class="code-block"><code class="language-${lang}">${escapedStr}</code></pre>`;
  }
  return `<pre class="code-block"><code>${escapedStr}</code></pre>`;
};

/**
 * 将 Markdown 文本渲染为安全的 HTML 字符串
 */
export function renderMarkdown(text: string): string {
  if (!text) return '';
  const rawHtml = md.render(text);
  return DOMPurify.sanitize(rawHtml, {
    ADD_ATTR: ['target', 'rel'],
    ADD_TAGS: ['iframe'],
  });
}
