# @xyxandwxx/agent-chat-react

Agent Chat UI 组件库（React 版），移植自 Vue 版 `@xyxandwxx/agent-chat`。

完全自包：不依赖任何 `@xyxandwxx/*` 私仓包（`api-gateway`、`transport` 已在构建时打包进 `dist/index.js`），只保留公共 npm 包作为 peer dependency（`react`、`react-dom`、`antd`，可选 `@a2ui/lit`、`@a2ui/web_core`）。

## 安装

直接从本仓库安装（`dist/` 已随仓库提交，无需额外构建步骤）：

```bash
npm install github:980911302/agent-chat-react
# 或
bun add github:980911302/agent-chat-react
```

## 使用

```tsx
import { Provider } from 'react-redux';
import { store, TimelineChatLayout, initAgentChatConfig, setTokenAction } from '@xyxandwxx/agent-chat-react';
import '@xyxandwxx/agent-chat-react/style.css';

initAgentChatConfig({
  api: { baseUrl: 'https://your-backend/api' },
  websocket: { host: 'your-backend', port: 3000, path: '/ws' },
});

// 拿到已有登录态的 token 后直接注入，不走本组件库自带的登录页
store.dispatch(setTokenAction(existingToken));

function App() {
  return (
    <Provider store={store}>
      <TimelineChatLayout theme="light" showAgentInfo />
    </Provider>
  );
}
```

## 本地开发 / 重新构建

```bash
npm install
npm run build   # vite build，产物在 dist/
```

## 目录结构

- `src/` — 源码
- `dist/` — 构建产物（已提交，`main`/`types`/`exports` 均指向这里）
