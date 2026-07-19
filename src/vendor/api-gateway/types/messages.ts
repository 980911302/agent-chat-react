import type { HistoryMessage } from "./gateway.js";

/**
 * 消息列表响应
 */
export interface MessagesResponse {
    messages: HistoryMessage[];
    agents: Array<{
        agent: {
            name: string;
            description: string;
        };
        tokens: number;
    }>;
    title?: string;
    agentGroups?: string[];
    pagination: {
        total: number;
        limit: number;
        offset: number;
        hasMore: boolean;
    };
}
