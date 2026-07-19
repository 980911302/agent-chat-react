/**
 * 从 @xyxandwxx/common 迁移的枚举类型
 */

/**
 * 消息角色
 */
export enum MessageRole {
    /** 系统消息 */
    System = "system",
    /** 用户消息 */
    User = "user",
    /** 助手消息 */
    Assistant = "assistant",
    /** 工具消息结果 */
    ToolResult = "tool_result",
    /** 命令消息 */
    Command = "command",
    /** 错误消息 */
    Error = "error",
    /** 操作消息 */
    Option = "option",
    /** AI 询问用户的消息 */
    AskUser = "AskUser",
    /** 用户回答的消息 */
    UserAnswer = "UserAnswer",
    /** 智能体询问智能体的消息 */
    AskAgent = "AskAgent",
    /** 定时器消息 */
    Timer = "timer",
}

/**
 * 日志级别枚举
 */
export enum LogLevel {
    Debug = 0,
    Info = 1,
    Warn = 2,
    Error = 3,
}

/**
 * 预处理函数调用状态
 */
export enum PreCallFunctionStatus {
    Allow = 0,
    Deny = 1,
}

/**
 * 工作流状态
 */
export enum WorkflowState {
    /** 运行中 */
    Running = 0,
    /** 本次完整对话结束 */
    Terminated = 1,
    /** 已完成 */
    Finished = 3,
}

/**
 * 消息通道事件类型
 */
export enum ChannelMessageType {
    ChannelStart = "channel_start",
    OnceDone = "once_done",
    UserMessage = "user_message",
    AssistantMessage = "assistant_message",
    Error = "error",
    Done = "done",
    ToolCallBefore = "tool_call_before",
    ToolCallSuccess = "tool_call_success",
    ToolCallFailed = "tool_call_failed",
    AskAgentMessage = "ask_agent_message",
    AskUserMessage = "ask_user_message",
    UserAnswer = "user_answer",
    IssueBoardReplyMessage = "issue_board_reply_message",
    UpdateAgentTokens = "update_agent_tokens",
    ThinkingMessage = "thinking_message",
    ThinkingDone = "thinking_done",
}

/**
 * 工作流堆栈动作类型
 */
export enum WorkflowAction {
    runUser = "run_user",
    runAgent = "run_agent",
    runAskUser = "run_ask_user",
}

/**
 * 运行的智能体类型
 */
export enum RunAgentType {
    Agent = "agent",
    Group = "group",
}

/**
 * 消息运行管道类型
 */
export enum MessageRunChannelType {
    runAgentOrGroup = "runAgentOrGroup",
    publishIssureBoardMessage = "publishIssureBoardMessage",
    userAnswerMessage = "userAnswerMessage",
}

/**
 * 消息来源管道类型
 */
export enum MessageFromChannelType {
    Web = "web",
    Desktop = "desktop",
    Tasks = "tasks",
    MessageBoard = "messageBoard",
}

/**
 * 任务类型
 */
export enum TaskType {
    Normal = 'normal',
    Cron = 'cron',
}

/**
 * 工具库类型
 */
export enum ToolsLibraryType {
    system = "system",
    mcp = "mcp",
}

/**
 * MCP 传输类型
 */
export enum MCPTransportType {
    STDIO = 'stdio',
    HTTP = 'http',
    SSE = 'sse',
    WEBSOCKET = 'websocket',
    STREAMABLE_HTTP = 'streamable_http',
}

/**
 * 上下文压缩策略
 */
export enum ContextCompactStrategy {
    Summarize = "summarize",
    Truncate = "truncate",
    SlidingWindow = "slidingWindow",
}
