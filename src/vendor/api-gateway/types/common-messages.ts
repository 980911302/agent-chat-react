/**
 * 从 @xyxandwxx/common 迁移的消息类型
 */
import { MessageRole, ChannelMessageType, WorkflowAction } from './enums.js';

/**
 * 格式化日期
 */
function formatDate(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export class BaseMessage {
    public id: string = crypto.randomUUID();
    public role: MessageRole;
    public content: string;
    public reasonContent: string;
    public timestamp: number = Date.now();

    constructor(role: MessageRole, content: string, reasonContent?: string) {
        this.role = role;
        this.content = content;
        this.reasonContent = reasonContent || "";
    }
}

export class TimerMessage extends BaseMessage {
    constructor() {
        super(MessageRole.Timer, `当前最新时间: ${formatDate()}`);
    }
}

export interface CallFunction {
    id: string;
    name: string;
    arguments: string;
}

export interface TokensUsage {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    cacheTokens: number;
}

export class AssistantMessage extends BaseMessage {
    toolCalls: CallFunction[] | undefined;
    usage?: TokensUsage;
    useModelId?: string;

    constructor(content: string, reasonContent?: string) {
        super(MessageRole.Assistant, content, reasonContent);
    }
}

/**
 * 文件附件信息
 */
export interface DocumentInfo {
    fileName: string;
    localPath: string;
    url: string;
}

export class UserMessage extends BaseMessage {
    public agent: string;
    public documents?: DocumentInfo[];

    constructor(content: string, agent: string, documents?: DocumentInfo[]) {
        super(MessageRole.User, content);
        this.agent = agent;
        this.documents = documents;
    }
}

export class AskAgentMessage extends BaseMessage {
    public fromAgent: string;
    public toAgent: string;

    constructor(content: string, fromAgent: string, toAgent: string) {
        super(MessageRole.AskAgent, content);
        this.fromAgent = fromAgent;
        this.toAgent = toAgent;
    }
}

export class ToolResultMessage extends BaseMessage {
    public callId: string;
    public success: boolean;

    constructor(callId: string, content: string, success: boolean) {
        super(MessageRole.ToolResult, content);
        this.callId = callId;
        this.success = success;
    }
}

export class AskUserMessage extends BaseMessage {
    agent: string;

    constructor(content: string, agent: string) {
        super(MessageRole.AskUser, content);
        this.agent = agent;
    }
}

export class UserAnswer extends BaseMessage {
    constructor(content: string) {
        super(MessageRole.UserAnswer, content);
    }
}

export class CommandMessage extends BaseMessage {
    constructor(content: string, reasonContent?: string) {
        super(MessageRole.Command, content, reasonContent);
    }
}

export class ErrorMessage extends BaseMessage {
    constructor(content: string) {
        super(MessageRole.Error, content);
    }
}

export class OptionMessage extends BaseMessage {
    constructor(content: string) {
        super(MessageRole.Option, content);
    }
}

/**
 * 运行智能体信息
 */
export interface RunAgentInfo {
    name: string;
    type: RunAgentType;
}

/**
 * 消息会话
 */
export interface MessageSession {
    sessionId: string;
    newMessage: string;
    documents: DocumentInfo[];
    from: MessageFromChannelType;
    runMessageAsType?: MessageRunChannelType;
    messageId: string;
    user: IUser;
    createTime: number;
    /** 知识库ID列表 */
    knowledgeIds?: string[];
}

export interface AgentOrGroupSessionMessage extends MessageSession {
    runAgentInfo: RunAgentInfo;
}

export interface IIssueBoardSessionMessage extends MessageSession {
    runTime: number;
    isHandled?: boolean;
    issueBoardId: string;
}

export interface UserAnswerSessionMessage extends MessageSession {
    toAgent: string;
}

export interface IssureBoardStack {
    runAgentInfo: RunAgentInfo;
    stack: IWorkflowStack[];
}

/**
 * 工作流堆栈消息
 */
export interface WorkflowStackMessage {
    agent: string;
    fromStackIndex: number;
    /** 知识库ID列表 */
    knowledgeIds?: string[];
}

export interface WorkflowActionRunUserMessage extends WorkflowStackMessage {
    message: string;
}

export interface WorkflowActionRunAgentMessage extends WorkflowStackMessage {
    fromAgent: string;
    functionCallId: string;
    message: string;
}

export interface WorkflowActionRunAskUserMessage extends WorkflowStackMessage {
    askMessage: string;
    items?: string[];
    functionCallId: string;
}

export interface WorkflowActionMessageDataType {
    [WorkflowAction.runAgent]: WorkflowActionRunAgentMessage;
    [WorkflowAction.runAskUser]: WorkflowActionRunAskUserMessage;
    [WorkflowAction.runUser]: WorkflowActionRunUserMessage;
}

export interface IWorkflowStack {
    index: number;
    action: WorkflowAction;
    message: WorkflowActionRunAgentMessage | WorkflowActionRunAskUserMessage | WorkflowActionRunUserMessage;
    isStart: boolean;
}

export function createWorkflowStackMessage<T extends WorkflowAction>(index: number, action: T, message: WorkflowActionMessageDataType[T]) {
    return {
        index,
        action,
        message,
        isStart: false
    }
}

export function pushToWorkflowStackMessage<T extends WorkflowAction>(stacks: IWorkflowStack[],
    action: T, message: WorkflowActionMessageDataType[T]) {
    stacks.push(createWorkflowStackMessage(stacks.length, action, message));
}

/**
 * 消息消费位置信息
 */
export interface MessageConsumePosition {
    lastConsumedIndex: number;
    lastConsumeTime: number;
}

/**
 * 通道启动事件数据
 */
export interface ChannelStartEventData {
}

export interface OnceDoneEventData {
    agentName: string;
}

export interface AssistantMessageEventData {
    message: string;
    agentName: string;
}

export interface ErrorEventData {
    error: string;
    agentName: string;
}

export interface DoneEventData {
    sessionId: string;
}

export interface ToolCallBeforeEventData {
    agentName: string;
    toolName: string;
    args: string;
}

export interface ToolCallSuccessEventData {
    agentName: string;
    toolName: string;
    result: string;
}

export interface ToolCallFailedEventData {
    agentName: string;
    toolName: string;
    error: string;
}

export interface AskAgentMessageEventData {
    message: AskAgentMessage;
}

export interface UserAnswerEventData {
    agentName: string;
    userAnswer: string;
}

export interface IssueBoardRelpyMessageEventData {
    issueBoardId: string;
    message: string;
}

export interface UpdateAgentTokensEventData {
    agentName: string;
    tokens: number;
}

export interface ThinkingMessageEventData {
    message: string;
    agentName: string;
}

export interface ThinkingDoneEventData {
    agentName: string;
}

export interface ChannelMessageDataType {
    [ChannelMessageType.ChannelStart]: ChannelStartEventData;
    [ChannelMessageType.OnceDone]: OnceDoneEventData;
    [ChannelMessageType.UserMessage]: UserMessage;
    [ChannelMessageType.AssistantMessage]: AssistantMessageEventData;
    [ChannelMessageType.Error]: ErrorEventData;
    [ChannelMessageType.Done]: DoneEventData;
    [ChannelMessageType.ToolCallBefore]: ToolCallBeforeEventData;
    [ChannelMessageType.ToolCallSuccess]: ToolCallSuccessEventData;
    [ChannelMessageType.ToolCallFailed]: ToolCallFailedEventData;
    [ChannelMessageType.AskUserMessage]: WorkflowActionRunAskUserMessage;
    [ChannelMessageType.AskAgentMessage]: AskAgentMessageEventData;
    [ChannelMessageType.UserAnswer]: UserAnswerEventData;
    [ChannelMessageType.IssueBoardReplyMessage]: IssueBoardRelpyMessageEventData;
    [ChannelMessageType.UpdateAgentTokens]: UpdateAgentTokensEventData;
    [ChannelMessageType.ThinkingMessage]: ThinkingMessageEventData;
    [ChannelMessageType.ThinkingDone]: ThinkingDoneEventData;
}

export interface ChannelMessageEvent {
    sessionId: string;
    type: ChannelMessageType;
    timestamp: number;
    data: | ChannelStartEventData
        | OnceDoneEventData
        | UserMessage
        | AssistantMessageEventData
        | ErrorEventData
        | DoneEventData
        | ToolCallBeforeEventData
        | ToolCallSuccessEventData
        | ToolCallFailedEventData
        | WorkflowActionRunAskUserMessage
        | AskAgentMessageEventData
        | UserAnswerEventData
        | IssueBoardRelpyMessageEventData
        | UpdateAgentTokensEventData
        | ThinkingMessageEventData
        | ThinkingDoneEventData
        ;
}

// 需要导入的类型
import { RunAgentType, MessageFromChannelType, MessageRunChannelType } from './enums.js';
import { IUser } from './common-interfaces.js';
