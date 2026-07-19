# @xyxandwxx/agent-chat-react

Agent Chat UI 组件库（React 版），移植自 Vue 版 `@xyxandwxx/agent-chat`。

完全自包：`@xyxandwxx/api-gateway`、`@xyxandwxx/transport` 的源码/编译产物直接 vendor 在 `src/vendor/` 下（不是构建时从私仓拉取再打包），源码里的 import 也都指向本地相对路径。从零 clone 这个仓库、`npm install`、`npm run build` 全程只会用到公共 npm 包（react、antd、redux、axios、uuid 等），不需要任何私仓权限——已经用一次真正干净的环境（删掉 node_modules 重装）验证过。

`@a2ui/lit`、`@a2ui/web_core` 是可选 peer dependency，不装也能正常构建/使用，只是 A2UI 布局功能不可用（会在控制台给出提示，不影响其他布局）。

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
- `src/vendor/api-gateway/` — vendor 进来的 API 客户端源码（原 `@xyxandwxx/api-gateway`）
- `src/vendor/transport/` — vendor 进来的 WebSocket 传输层编译产物（原 `@xyxandwxx/transport`，上游只发布编译后的 JS，没有可 vendor 的 TS 源码）
- `dist/` — 构建产物（已提交，`main`/`types`/`exports` 均指向这里）
