import { forwardRef as e, useCallback as t, useEffect as n, useImperativeHandle as r, useLayoutEffect as i, useMemo as a, useRef as o, useState as s } from "react";
import { useDispatch as c, useSelector as l } from "react-redux";
import { Upload as u, message as d } from "antd";
import { configureStore as f, createSlice as p } from "@reduxjs/toolkit";
import m from "axios";
import { AlertCircle as h, Archive as g, ArrowRight as _, ArrowUp as v, BookOpen as y, BrainCircuit as b, Check as x, ChevronDown as S, ChevronRight as C, CircleHelp as w, Cpu as T, File as E, FileText as D, HelpCircle as O, Image as k, Loader2 as A, MessageSquare as j, MoreHorizontal as M, Music as N, Paperclip as P, Plus as F, User as I, Users as L, Video as R, Wrench as z, X as ee, XCircle as te } from "lucide-react";
import { Fragment as ne, jsx as B, jsxs as V } from "react/jsx-runtime";
import re from "markdown-it";
import ie from "dompurify";
//#region src/constants/events.ts
var H = {
	CREATE_SURFACE: "createSurface",
	UPDATE_COMPONENTS: "updateComponents",
	UPDATE_DATA_MODEL: "updateDataModel",
	DELETE_SURFACE: "deleteSurface"
}, U = {
	SYSTEM: "system",
	USER: "user",
	ASSISTANT: "assistant",
	TOOL_RESULT: "tool_result",
	COMMAND: "command",
	ERROR: "error",
	OPTION: "option",
	ASK_USER: "AskUser",
	USER_ANSWER: "UserAnswer",
	ASK_AGENT: "AskAgent",
	TIMER: "timer"
}, ae = {
	AGENT: "agent",
	GROUP: "group"
};
//#endregion
//#region src/utils/index.ts
function oe(e) {
	return new Promise((t) => setTimeout(t, e));
}
function W(e) {
	if (!e) return "";
	let t = new Date(e), n = (e) => String(e).padStart(2, "0");
	return `${t.getFullYear()}-${n(t.getMonth() + 1)}-${n(t.getDate())} ${n(t.getHours())}:${n(t.getMinutes())}:${n(t.getSeconds())}`;
}
function se(e) {
	if (!e) return "";
	let t = new Date(e), n = (e) => String(e).padStart(2, "0");
	return `${n(t.getHours())}:${n(t.getMinutes())}:${n(t.getSeconds())}`;
}
var ce = [
	"#409eff",
	"#67c23a",
	"#e6a23c",
	"#f56c6c",
	"#909399",
	"#9254de",
	"#36cfc9",
	"#ff9c6e",
	"#ff7875",
	"#a0d911",
	"#13c2c2",
	"#1890ff",
	"#722ed1",
	"#eb2f96",
	"#fa541c"
];
function G(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) t = e.charCodeAt(n) + ((t << 5) - t), t &= t;
	return ce[Math.abs(t) % ce.length];
}
function K() {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
		let t = Math.random() * 16 | 0;
		return (e === "x" ? t : t & 3 | 8).toString(16);
	});
}
//#endregion
//#region src/store/chatSlice.ts
var le = {
	messages: { main: [] },
	isConnected: !1,
	isLoading: !1,
	connectionError: null,
	authErrorCode: null,
	currentAgent: "main",
	sessionId: null,
	agents: [],
	agentTokens: {},
	showToolCallLog: !0,
	hasMoreMessages: { main: !1 },
	isLoadingMore: !1,
	isAuthenticated: !1,
	sessionOverview: null,
	sessionOverviewLoading: !1
};
function ue(e, t) {
	e.messages[t] || (e.messages[t] = []), t in e.hasMoreMessages || (e.hasMoreMessages[t] = !1);
}
function q(e, t) {
	let n = e[t];
	if (n) {
		for (let e = n.length - 1; e >= 0; e--) if (n[e].role === U.ASSISTANT) return n[e];
	}
}
function de(e, t, n) {
	let r = e[t];
	if (r) {
		for (let e = r.length - 1; e >= 0; e--) if (r[e].id === n) return r[e];
	}
}
var fe = [
	U.ASSISTANT,
	U.TOOL_RESULT,
	U.COMMAND,
	U.OPTION
];
function pe(e, t) {
	let n = e[t];
	if (n) {
		for (let e = n.length - 1; e >= 0; e--) if (fe.includes(n[e].role)) return n[e];
	}
}
function me(e, t, n) {
	let r = e[t];
	if (r) for (let e = r.length - 1; e >= 0; e--) {
		let t = r[e];
		if (fe.includes(t.role) && t.toolCalls) {
			let e = t.toolCalls.find((e) => e.toolName === n && e.status === "pending");
			if (e) return e;
		}
	}
}
var he = p({
	name: "chat",
	initialState: le,
	reducers: {
		setConnected(e, t) {
			e.isConnected = t.payload;
		},
		setConnectionError(e, t) {
			e.connectionError = t.payload;
		},
		setAuthenticated(e, t) {
			e.isAuthenticated = t.payload;
		},
		setAuthErrorCode(e, t) {
			e.authErrorCode = t.payload;
		},
		setLoading(e, t) {
			e.isLoading = t.payload;
		},
		setSessionId(e, t) {
			e.sessionId = t.payload;
		},
		setCurrentAgent(e, t) {
			e.currentAgent = t.payload;
		},
		setAgents(e, t) {
			e.agents = t.payload;
		},
		addAgent(e, t) {
			e.agents.find((e) => e.name === t.payload.name) || e.agents.push(t.payload);
		},
		setAgentTokens(e, t) {
			e.agentTokens = t.payload;
		},
		setShowToolCallLog(e, t) {
			e.showToolCallLog = t.payload;
		},
		addMessage(e, t) {
			let { agent: n, message: r } = t.payload;
			ue(e, n), e.messages[n].push(r);
		},
		addUserMessage(e, t) {
			let n = t.payload.agent || e.currentAgent;
			ue(e, n), e.messages[n].push({
				id: K(),
				role: U.USER,
				content: t.payload.content,
				timestamp: Date.now(),
				documents: t.payload.documents
			});
		},
		setMessages(e, t) {
			let { agent: n, messages: r } = t.payload;
			ue(e, n), e.messages[n] = r;
		},
		prependMessages(e, t) {
			let { agent: n, messages: r, hasMore: i } = t.payload;
			ue(e, n), e.messages[n] = [...r, ...e.messages[n]], e.hasMoreMessages[n] = i;
		},
		setHasMore(e, t) {
			e.hasMoreMessages[t.payload.agent] = t.payload.hasMore;
		},
		setLoadingMore(e, t) {
			e.isLoadingMore = t.payload;
		},
		clearMessages(e) {
			e.messages = { main: [] }, e.hasMoreMessages = { main: !1 }, e.agentTokens = {}, e.agents = [];
		},
		startAssistantMessage(e, t) {
			let { agent: n, id: r } = t.payload;
			ue(e, n), e.messages[n].push({
				id: r,
				role: U.ASSISTANT,
				content: "",
				agent: n,
				timestamp: Date.now(),
				isStreaming: !0
			});
		},
		appendContentById(e, t) {
			let { agent: n, id: r, content: i } = t.payload, a = de(e.messages, n, r);
			a && (a.content += i);
		},
		appendReasonContentById(e, t) {
			let { agent: n, id: r, content: i } = t.payload, a = de(e.messages, n, r);
			a && (a.reasonContent = (a.reasonContent || "") + i);
		},
		markStreamDoneById(e, t) {
			let { agent: n, id: r } = t.payload, i = de(e.messages, n, r);
			i && (i.isStreaming = !1);
		},
		appendStreamContent(e, t) {
			let { agent: n, content: r } = t.payload, i = q(e.messages, n);
			i && (i.content += r, i.isStreaming = !0);
		},
		appendStreamReasonContent(e, t) {
			let { agent: n, content: r } = t.payload, i = q(e.messages, n);
			i && (i.reasonContent = (i.reasonContent || "") + r, i.isStreaming = !0);
		},
		markStreamDone(e, t) {
			if (t.payload.agent) {
				let n = q(e.messages, t.payload.agent);
				n && (n.isStreaming = !1);
			} else {
				for (let t of Object.keys(e.messages)) {
					let n = q(e.messages, t);
					n && (n.isStreaming = !1);
				}
				e.isLoading = !1;
			}
		},
		addToolCallStart(e, t) {
			let { agent: n, toolName: r, args: i } = t.payload;
			ue(e, n);
			let a = {
				toolName: r,
				args: i,
				status: "pending",
				timestamp: Date.now()
			}, o = pe(e.messages, n);
			o ? (o.toolCalls ||= [], o.toolCalls.push(a)) : e.messages[n].push({
				id: K(),
				role: U.ASSISTANT,
				content: "",
				agent: n,
				timestamp: Date.now(),
				isStreaming: !1,
				toolCalls: [a]
			});
		},
		addToolCallSuccess(e, t) {
			let { agent: n, toolName: r, result: i } = t.payload, a = me(e.messages, n, r);
			a && (a.status = "success", a.result = i);
		},
		addToolCallFailed(e, t) {
			let { agent: n, toolName: r, error: i } = t.payload, a = me(e.messages, n, r);
			a && (a.status = "failed", a.error = i);
		},
		updateAgentTokens(e, t) {
			e.agentTokens[t.payload.agent] = t.payload.tokens;
		},
		setSessionOverview(e, t) {
			e.sessionOverview = t.payload;
		},
		setSessionOverviewLoading(e, t) {
			e.sessionOverviewLoading = t.payload;
		},
		resetChat() {
			return le;
		}
	}
}), { setConnected: ge, setConnectionError: _e, setAuthenticated: ve, setAuthErrorCode: ye, setLoading: be, setSessionId: xe, setCurrentAgent: Se, setAgents: Ce, addAgent: we, setAgentTokens: Te, setShowToolCallLog: Ee, addMessage: De, addUserMessage: Oe, setMessages: ke, prependMessages: Ae, setHasMore: je, setLoadingMore: Me, clearMessages: Ne, startAssistantMessage: Pe, appendContentById: Fe, appendReasonContentById: Ie, markStreamDoneById: Le, appendStreamContent: Re, appendStreamReasonContent: ze, markStreamDone: Be, addToolCallStart: Ve, addToolCallSuccess: He, addToolCallFailed: Ue, updateAgentTokens: We, setSessionOverview: Ge, setSessionOverviewLoading: Ke, resetChat: qe } = he.actions, Je = he.reducer, Ye = (e) => e.chat.messages, Xe = (e) => e.chat.isConnected, Ze = (e) => e.chat.isLoading, Qe = (e) => e.chat.connectionError, $e = (e) => e.chat.currentAgent, et = (e) => e.chat.sessionId, tt = (e) => e.chat.agents, nt = (e) => e.chat.agentTokens, rt = (e) => e.chat.showToolCallLog, it = (e) => e.chat.hasMoreMessages, at = (e) => e.chat.isLoadingMore, ot = (e) => e.chat.isAuthenticated, st = (e) => e.chat.authErrorCode, ct;
function lt(e) {
	ct = e;
}
function J() {
	if (!ct) throw Error("API instance not set. Please call setApiInstance() before using API methods.");
	return ct;
}
//#endregion
//#region ../api-gateway/dist/sse.js
var ut = class {
	baseURL;
	timeout;
	requestInterceptors = [];
	responseInterceptors = [];
	constructor(e) {
		this.baseURL = e?.baseURL || "", this.timeout = e?.timeout || 0;
	}
	addRequestInterceptor(e) {
		return this.requestInterceptors.push(e), () => {
			let t = this.requestInterceptors.indexOf(e);
			t !== -1 && this.requestInterceptors.splice(t, 1);
		};
	}
	addResponseInterceptor(e) {
		return this.responseInterceptors.push(e), () => {
			let t = this.responseInterceptors.indexOf(e);
			t !== -1 && this.responseInterceptors.splice(t, 1);
		};
	}
	connect(e, t) {
		let n = {
			...e,
			headers: { ...e.headers },
			timeout: e.timeout ?? this.timeout
		}, r = (e.method || "GET").toUpperCase(), i = e.headers && Object.keys(e.headers).length > 0;
		return r === "GET" && !i ? this.connectWithEventSource(n, t) : this.connectWithFetch(n, t);
	}
	connectWithEventSource(e, t) {
		let n = !0, r = null, i = 0, a = !1, o = e.maxReconnects ?? 5, s = e.reconnectDelay ?? 3e3, c = (e, r, i) => {
			if (n) {
				for (let t of this.responseInterceptors) if (t.onMessage && t.onMessage(e, r) === !1) return;
				t.onMessage?.(e, r, i), t.onEvent?.[r]?.(e, i);
			}
		}, l = async () => {
			if (a) return;
			let u = { ...e };
			for (let e of this.requestInterceptors) try {
				u = await e(u);
			} catch {
				return;
			}
			let d = this.resolveURL(u.url);
			if (r = new EventSource(d), r.onopen = (e) => {
				i = 0, t.onOpen?.(e);
			}, r.onmessage = (e) => {
				c(e.data, "message", e);
			}, t.onEvent) for (let e of Object.keys(t.onEvent)) e !== "message" && r.addEventListener(e, (t) => {
				c(t.data, e, t);
			});
			r.onerror = (c) => {
				t.onError?.(c), e.autoReconnect && i < o && !a ? (i++, r?.close(), setTimeout(l, s)) : (n = !1, t.onClose?.());
			};
		};
		return l(), {
			close: () => {
				a = !0, n = !1, r?.close(), t.onClose?.();
			},
			get active() {
				return n;
			}
		};
	}
	connectWithFetch(e, t) {
		let n = !0, r = new AbortController(), i = 0, a = e.maxReconnects ?? 5, o = e.reconnectDelay ?? 3e3;
		if (e.signal) {
			if (e.signal.aborted) return n = !1, t.onError?.(/* @__PURE__ */ Error("请求已中止")), t.onClose?.(), {
				close: () => {},
				get active() {
					return !1;
				}
			};
			e.signal.addEventListener("abort", () => {
				r.abort();
			}, { once: !0 });
		}
		let s = async () => {
			if (!n) return;
			let c = { ...e };
			for (let e of this.requestInterceptors) try {
				c = await e(c);
			} catch (e) {
				t.onError?.(e instanceof Error ? e : Error(String(e)));
				return;
			}
			let l = this.resolveURL(c.url), u = {
				Accept: "text/event-stream",
				...c.headers
			};
			try {
				let e;
				c.timeout && c.timeout > 0 && (e = setTimeout(() => r.abort(), c.timeout));
				let i = await fetch(l, {
					method: c.method || "GET",
					headers: u,
					body: c.body,
					signal: r.signal
				});
				if (e && clearTimeout(e), !i.ok) {
					let e = `SSE 请求失败: ${i.status}`;
					try {
						let t = (await i.text()).match(/data:\s*(.*)/);
						t && (e = dt(t[1].trim()));
					} catch {}
					let r = Error(e);
					for (let e of this.responseInterceptors) if (e.onError) {
						let t = e.onError(r);
						t instanceof Error && (r = t);
					}
					t.onError?.(r), n = !1, t.onClose?.();
					return;
				}
				t.onOpen?.(new Event("open"));
				let a = i.body?.getReader();
				if (!a) {
					n = !1, t.onClose?.();
					return;
				}
				let o = new TextDecoder(), s = "", d = "message", f = (e) => {
					if (e.startsWith("event: ")) {
						d = e.slice(7).trim();
						return;
					}
					if (e.startsWith("data: ")) {
						let n = e.slice(6), r = n;
						for (let e of this.responseInterceptors) if (e.onMessage && e.onMessage(n, d) === !1) {
							r = !1;
							break;
						}
						if (r !== !1) {
							let e = dt(r), n = new MessageEvent(d, { data: e });
							t.onMessage?.(e, d, n), t.onEvent?.[d]?.(e, n);
						}
						d = "message";
						return;
					}
					(e.startsWith(":") || e.trim() === "") && (d = "message");
				};
				for (; n;) {
					let { done: e, value: t } = await a.read();
					if (e) break;
					s += o.decode(t, { stream: !0 });
					let n = s.split("\n");
					s = n.pop() || "";
					for (let e of n) f(e);
				}
				if (s.trim()) {
					let e = s.split("\n");
					for (let t of e) f(t);
				}
				n = !1, t.onClose?.();
			} catch (c) {
				if (!n) return;
				let l = c instanceof Error ? c : Error(String(c));
				if (l.name === "AbortError") {
					t.onClose?.();
					return;
				}
				t.onError?.(l), e.autoReconnect && i < a && n ? (i++, r = new AbortController(), setTimeout(s, o)) : (n = !1, t.onClose?.());
			}
		};
		return s(), {
			close: () => {
				n = !1, r.abort();
			},
			get active() {
				return n;
			}
		};
	}
	resolveURL(e) {
		return e.startsWith("http://") || e.startsWith("https://") ? e : `${this.baseURL.replace(/\/+$/, "")}/${e.replace(/^\/+/, "")}`;
	}
};
function dt(e) {
	if (e.length >= 2 && e.startsWith("\"") && e.endsWith("\"")) try {
		let t = JSON.parse(e);
		if (typeof t == "string") return t;
	} catch {}
	return e;
}
var ft;
function pt(e) {
	ft = e;
}
function mt() {
	if (!ft) throw Error("SSE client not set. Please call setSSEClient() before using SSE methods.");
	return ft;
}
//#endregion
//#region ../api-gateway/dist/api/agents.js
var ht = {
	getAll: () => J().get("/agents"),
	getOne: (e) => J().get(`/agents/${e}`),
	create: (e) => J().post("/agents", e),
	update: (e, t) => J().put(`/agents/${e}`, t),
	delete: (e) => J().delete(`/agents/${e}`),
	disable: (e, t) => J().post(`/agents/${e}/disable`, { disabled: t }),
	batchDisable: (e, t) => J().post("/agents/batch/disable", {
		names: e,
		disabled: t
	}),
	batchDelete: (e) => J().post("/agents/batch/delete", { names: e }),
	clone: (e, t) => J().post(`/agents/${e}/clone`, { newName: t }),
	exportAgent: (e) => J().get(`/agents/${encodeURIComponent(e)}/export`, { responseType: "blob" }),
	checkImport: (e) => {
		let t = new FormData();
		return t.append("file", e), J().post("/agents/import/check", t, { headers: { "Content-Type": "multipart/form-data" } });
	},
	import: (e, t, n, r) => new Promise((i, a) => {
		let o = new FormData();
		o.append("file", e), o.append("overwrite", String(t));
		let s = mt(), c = null;
		s.connect({
			url: "/agents/import",
			method: "POST",
			body: o,
			signal: r
		}, {
			onEvent: {
				progress: (e) => {
					try {
						n?.(JSON.parse(e));
					} catch {}
				},
				done: (e) => {
					try {
						c = JSON.parse(e);
					} catch {}
				},
				error: (e) => {
					a({
						success: !1,
						error: e || "导入失败"
					});
				}
			},
			onClose: () => {
				i({
					success: !0,
					data: c || void 0
				});
			},
			onError: (e) => {
				a(e instanceof Error ? e : /* @__PURE__ */ Error("导入连接失败"));
			}
		});
	})
}, gt = {
	getAll: () => J().get("/agents/groups/list"),
	create: (e, t, n) => J().post("/agents/groups/create", {
		name: e,
		describe: t,
		entryAgent: n
	}),
	update: (e, t) => J().put(`/agents/groups/${encodeURIComponent(e)}`, t),
	updateDescription: (e, t) => J().patch(`/agents/groups/${encodeURIComponent(e)}/description`, { describe: t }),
	updateEntryAgent: (e, t) => J().patch(`/agents/groups/${encodeURIComponent(e)}/entry-agent`, { entryAgent: t }),
	delete: (e) => J().delete(`/agents/groups/${encodeURIComponent(e)}`),
	batchDelete: (e) => J().post("/agents/groups/batch/delete", { names: e }),
	rename: (e, t) => J().put(`/agents/groups/${encodeURIComponent(e)}/rename`, { newName: t }),
	getMembers: (e) => J().get(`/agents/groups/${encodeURIComponent(e)}/members`),
	addMember: (e, t) => J().post(`/agents/groups/${encodeURIComponent(e)}/members`, { agentName: t }),
	removeMember: (e, t) => J().delete(`/agents/groups/${encodeURIComponent(e)}/members/${encodeURIComponent(t)}`),
	export: (e) => J().get(`/agents/groups/${encodeURIComponent(e)}/export`, { responseType: "blob" })
}, _t = {
	async uploadFile(e) {
		let t = J(), n = new FormData();
		return n.append("file", e), await t.post("/upload", n, { headers: { "Content-Type": "multipart/form-data" } });
	},
	async uploadFiles(e) {
		let t = J(), n = new FormData();
		return e.forEach((e) => {
			n.append("files", e);
		}), await t.post("/upload/multiple", n, { headers: { "Content-Type": "multipart/form-data" } });
	}
}, vt = {
	listGroups: () => J().get("/knowledges/groups"),
	isConfigured: async () => {
		try {
			let e = await J().get("/config");
			return e.success && e.data?.knowledgeRagConfig?.powerClawRagServer ? !!e.data.knowledgeRagConfig.powerClawRagServer.ragServerUrl : !1;
		} catch {
			return !1;
		}
	},
	getRagServerUrl: async () => {
		try {
			let e = await J().get("/config");
			return e.success && e.data?.knowledgeRagConfig?.powerClawRagServer && e.data.knowledgeRagConfig.powerClawRagServer.ragServerUrl || "";
		} catch {
			return "";
		}
	},
	query: (e, t) => J().post("/knowledge/query", {
		query: e,
		knowledgeIds: t
	}),
	search: (e, t) => J().get("/knowledge/search", { params: {
		q: e,
		knowledgeIds: t?.join(",")
	} })
}, yt;
(function(e) {
	e.System = "system", e.User = "user", e.Assistant = "assistant", e.ToolResult = "tool_result", e.Command = "command", e.Error = "error", e.Option = "option", e.AskUser = "AskUser", e.UserAnswer = "UserAnswer", e.AskAgent = "AskAgent", e.Timer = "timer";
})(yt ||= {});
var bt;
(function(e) {
	e[e.Debug = 0] = "Debug", e[e.Info = 1] = "Info", e[e.Warn = 2] = "Warn", e[e.Error = 3] = "Error";
})(bt ||= {});
var xt;
(function(e) {
	e[e.Allow = 0] = "Allow", e[e.Deny = 1] = "Deny";
})(xt ||= {});
var St;
(function(e) {
	e[e.Running = 0] = "Running", e[e.Terminated = 1] = "Terminated", e[e.Finished = 3] = "Finished";
})(St ||= {});
var Ct;
(function(e) {
	e.ChannelStart = "channel_start", e.OnceDone = "once_done", e.UserMessage = "user_message", e.AssistantMessage = "assistant_message", e.Error = "error", e.Done = "done", e.ToolCallBefore = "tool_call_before", e.ToolCallSuccess = "tool_call_success", e.ToolCallFailed = "tool_call_failed", e.AskAgentMessage = "ask_agent_message", e.AskUserMessage = "ask_user_message", e.UserAnswer = "user_answer", e.IssueBoardReplyMessage = "issue_board_reply_message", e.UpdateAgentTokens = "update_agent_tokens", e.ThinkingMessage = "thinking_message", e.ThinkingDone = "thinking_done";
})(Ct ||= {});
var wt;
(function(e) {
	e.runUser = "run_user", e.runAgent = "run_agent", e.runAskUser = "run_ask_user";
})(wt ||= {});
var Tt;
(function(e) {
	e.Agent = "agent", e.Group = "group";
})(Tt ||= {});
var Et;
(function(e) {
	e.runAgentOrGroup = "runAgentOrGroup", e.publishIssureBoardMessage = "publishIssureBoardMessage", e.userAnswerMessage = "userAnswerMessage";
})(Et ||= {});
var Dt;
(function(e) {
	e.Web = "web", e.Desktop = "desktop", e.Tasks = "tasks", e.MessageBoard = "messageBoard";
})(Dt ||= {});
var Ot;
(function(e) {
	e.Normal = "normal", e.Cron = "cron";
})(Ot ||= {});
var kt;
(function(e) {
	e.system = "system", e.mcp = "mcp";
})(kt ||= {});
var At;
(function(e) {
	e.STDIO = "stdio", e.HTTP = "http", e.SSE = "sse", e.WEBSOCKET = "websocket", e.STREAMABLE_HTTP = "streamable_http";
})(At ||= {});
var jt;
(function(e) {
	e.Summarize = "summarize", e.Truncate = "truncate", e.SlidingWindow = "slidingWindow";
})(jt ||= {}), jt.Summarize;
//#endregion
//#region src/config.ts
var Y = {
	tokenStorage: {
		token: "",
		tokenKey: "power_claw_token",
		userInfoKey: "power_claw_user_info"
	},
	api: { baseUrl: "http://localhost:3000/api" },
	websocket: {
		host: "localhost",
		port: 3e3,
		path: "/ws",
		reconnectDelay: 3e3
	}
}, Mt = null, Nt = null;
function Pt(e) {
	Y.tokenStorage.token = e;
	let t = Y.tokenStorage.tokenKey || "power_claw_token";
	try {
		localStorage.setItem(t, e);
	} catch {}
}
function Ft() {
	if (Y.tokenStorage.token) return Y.tokenStorage.token;
	let e = Y.tokenStorage.tokenKey || "power_claw_token";
	try {
		return localStorage.getItem(e) || "";
	} catch {
		return "";
	}
}
function It() {
	Y.tokenStorage.token = "";
	let e = Y.tokenStorage.tokenKey || "power_claw_token";
	try {
		localStorage.removeItem(e);
	} catch {}
}
function Lt() {
	return { ...Y.tokenStorage };
}
function Rt() {
	if (!Mt) throw Error("API 实例未初始化，请先调用 initAgentChatConfig()");
	return Mt;
}
function zt(e) {
	if (e.instance) return e.instance;
	let t = m.create({
		baseURL: e.baseUrl || "http://localhost:3000/api",
		timeout: 3e4,
		headers: { "Content-Type": "application/json" }
	});
	return t.interceptors.request.use((e) => {
		let t = Ft();
		return t && e.headers && (e.headers.Authorization = `Bearer ${t}`), e;
	}), t.interceptors.response.use((e) => e.data, (e) => {
		if (e.response) {
			let t = e.response.status;
			t === 401 ? Nt?.(401, "登录已过期，请重新登录") : t === 403 && Nt?.(403, "没有权限访问该资源");
		}
		return Promise.reject(e);
	}), t;
}
function Bt(e) {
	Nt = e;
}
function Vt(e = {}) {
	Y = {
		tokenStorage: {
			...Y.tokenStorage,
			...e.tokenStorage
		},
		api: {
			...Y.api,
			...e.api
		},
		websocket: {
			...Y.websocket,
			...e.websocket
		}
	}, e.tokenStorage?.token && Pt(e.tokenStorage.token), Mt = zt(Y.api), lt(Mt);
	let t = new ut({
		baseURL: Y.api.baseUrl,
		timeout: 3e4
	});
	t.addRequestInterceptor((e) => {
		let t = Ft();
		return t && (e.headers = {
			...e.headers,
			Authorization: `Bearer ${t}`
		}), e;
	}), t.addResponseInterceptor({ onError: (e) => (e.message.includes("401") ? (console.error("[SSE] Token 异常:", e.message), Nt?.(401, "登录已过期，请重新登录")) : e.message.includes("403") && (console.error("[SSE] Token 异常:", e.message), Nt?.(403, "没有权限访问该资源")), e) }), pt(t);
}
function Ht() {
	return { ...Y };
}
function Ut() {
	return { ...Y.websocket };
}
//#endregion
//#region src/store/userSlice.ts
var Wt = p({
	name: "user",
	initialState: {
		user: null,
		token: null,
		isLoading: !1
	},
	reducers: {
		setUser(e, t) {
			e.user = t.payload;
		},
		setTokenAction(e, t) {
			e.token = t.payload, t.payload ? Pt(t.payload) : It();
		},
		setLoading(e, t) {
			e.isLoading = t.payload;
		},
		clearAuth(e) {
			e.user = null, e.token = null, It();
		}
	}
}), { setUser: Gt, setTokenAction: Kt, setLoading: qt, clearAuth: Jt } = Wt.actions, Yt = Wt.reducer, Xt = (e) => e.user.user !== null && e.user.token !== null, Zt = (e) => e.user.user?.role === "admin", Qt = (e) => e.user.user?.role === "tenant", $t = (e) => e.user.user, en = (e) => e.user.token, tn = (e) => e.user.isLoading, nn = new Set([
	U.ASSISTANT,
	U.USER,
	U.ASK_AGENT,
	U.ASK_USER,
	U.USER_ANSWER,
	U.TOOL_RESULT,
	U.COMMAND,
	U.OPTION,
	U.ERROR
]);
function rn(e, t) {
	return e === "entry-agent" && t ? t : e;
}
function an(e) {
	return e.role === U.USER || e.role === U.USER_ANSWER;
}
function on(e, t, n, r, i) {
	let a = [];
	if (n) for (let t in e) for (let n of e[t]) nn.has(n.role) && n.content !== void 0 && a.push(n);
	else {
		let n = i?.find((e) => e.name === t);
		if (n) {
			let r = [t, ...n.members];
			for (let t of r) {
				let n = e[t] || [];
				for (let e of n) nn.has(e.role) && e.content !== void 0 && a.push(e);
			}
		} else {
			let n = e[rn(t, r)] || [];
			for (let e of n) nn.has(e.role) && e.content !== void 0 && a.push(e);
		}
	}
	let o = /* @__PURE__ */ new Set(), s = [];
	for (let e of a) o.has(e.id) || (o.add(e.id), s.push(e));
	return s.sort((e, t) => e.timestamp - t.timestamp), s;
}
function sn(e, t, n, r = {}) {
	let { entryAgent: i, groups: o } = r;
	return a(() => {
		let r = on(e, t, n, i, o);
		if (r.length === 0) return [];
		let a = [], s = null;
		for (let e of r) {
			if (an(e)) {
				s && a.push(s), s = {
					userMsg: e,
					steps: []
				};
				continue;
			}
			if (s ||= {
				userMsg: null,
				steps: []
			}, e.role === U.ASK_USER) s.steps.push({
				type: "askUser",
				msg: e
			});
			else if (e.role === U.ASK_AGENT) s.steps.push({
				type: "ask",
				msg: e
			});
			else if (e.role === U.ASSISTANT) {
				if (e.reasonContent && s.steps.push({
					type: "reason",
					msg: e
				}), e.toolCalls && e.toolCalls.length > 0) for (let t of e.toolCalls) s.steps.push({
					type: "tool",
					msg: e,
					tool: t
				});
				(e.content || e.isStreaming) && s.steps.push({
					type: "content",
					msg: e
				});
			} else e.role === U.ERROR ? s.steps.push({
				type: "content",
				msg: e
			}) : s.steps.push({
				type: "step",
				msg: e
			});
		}
		return s && a.push(s), a;
	}, [
		e,
		t,
		n,
		i,
		o
	]);
}
//#endregion
//#region src/components/avatars/AgentAvatar.tsx
var cn = {
	small: 24,
	medium: 32,
	large: 48
}, ln = {
	small: 10,
	medium: 13,
	large: 18
}, un = ({ src: e = "", emoji: t = "", svg: n = "", text: r = "", agentName: i = "", size: a = "medium", color: o = "", isGroup: s = !1 }) => {
	let c = r || i, l = cn[a], u = {
		width: l,
		height: l,
		minWidth: l,
		borderRadius: "50%",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		overflow: "hidden",
		fontSize: ln[a],
		fontWeight: 600,
		color: "#fff",
		background: s ? "linear-gradient(135deg, #f59e0b, #ea580c)" : o || G(c || "agent"),
		...s ? { boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2), 0 0 0 3px #f59e0b" } : {}
	}, d;
	return d = e ? /* @__PURE__ */ B("img", {
		src: e,
		alt: c,
		style: {
			width: "100%",
			height: "100%",
			objectFit: "cover"
		}
	}) : t ? /* @__PURE__ */ B("span", {
		style: { fontSize: l * .6 },
		children: t
	}) : n ? /* @__PURE__ */ B("div", {
		dangerouslySetInnerHTML: { __html: n },
		style: {
			width: "70%",
			height: "70%"
		}
	}) : c ? /* @__PURE__ */ B("span", { children: c.slice(0, 2) }) : /* @__PURE__ */ B(I, { size: l * .5 }), /* @__PURE__ */ B("div", {
		style: u,
		className: "agent-avatar",
		children: d
	});
}, dn = new re({
	html: !0,
	linkify: !0,
	typographer: !0,
	breaks: !0
}), fn = dn.renderer.rules.link_open || function(e, t, n, r, i) {
	return i.renderToken(e, t, n);
};
dn.renderer.rules.link_open = function(e, t, n, r, i) {
	let a = e[t];
	return a.attrIndex("href") >= 0 && (a.attrPush(["target", "_blank"]), a.attrPush(["rel", "noopener noreferrer"])), fn(e, t, n, r, i);
}, dn.options.highlight = function(e, t) {
	let n = dn.utils.escapeHtml(e);
	return t ? `<pre class="code-block"><code class="language-${t}">${n}</code></pre>` : `<pre class="code-block"><code>${n}</code></pre>`;
};
function pn(e) {
	if (!e) return "";
	let t = dn.render(e);
	return ie.sanitize(t, {
		ADD_ATTR: ["target", "rel"],
		ADD_TAGS: ["iframe"]
	});
}
//#endregion
//#region src/components/messages/timeline/MessageList.tsx
var mn = (e) => {
	let t = e.steps.find((e) => e.type === "content");
	return t ? t.msg.agent || "AI" : e.steps.find((e) => e.msg.agent && e.type !== "ask")?.msg.agent || "AI";
}, hn = (e) => e.steps.length > 0 ? W(e.steps[e.steps.length - 1].msg.timestamp) : "", gn = (e) => typeof e == "string" ? e.split("/").pop() || e.split("\\").pop() || e : e.fileName || "", _n = (e) => e.type === "ask" ? `${e.msg.fromAgent} → ${e.msg.toAgent || e.msg.agent}` : e.type === "reason" ? `${e.msg.agent} 正在思考分析...` : e.type === "tool" && e.tool ? `执行 ${e.tool.toolName}` : e.msg.role === U.TOOL_RESULT ? "工具返回结果" : e.msg.role === U.COMMAND ? "执行命令" : e.msg.role === U.OPTION ? "选项" : e.msg.agent || "处理中...", vn = (e) => e.role === U.ERROR, yn = (e, t, n, r, i) => e.msg.isStreaming ? !0 : t === r.length - 1 && i ? !r[t].steps.slice(n + 1).some((e) => e.type === "content") : !1, bn = (e, t) => {
	try {
		return JSON.parse(e.args)[t] || "";
	} catch {
		return "";
	}
}, xn = ({ status: e }) => {
	switch (e) {
		case "pending": return /* @__PURE__ */ B("span", { style: {
			display: "inline-block",
			width: 8,
			height: 8,
			borderRadius: "50%",
			background: "#f59e0b",
			animation: "agent-chat-pulse 1.5s infinite"
		} });
		case "success": return /* @__PURE__ */ B("span", {
			style: {
				color: "#10b981",
				fontSize: 12,
				fontWeight: "bold"
			},
			children: "✓"
		});
		case "failed": return /* @__PURE__ */ B("span", {
			style: {
				color: "#ef4444",
				fontSize: 12,
				fontWeight: "bold"
			},
			children: "✗"
		});
		default: return null;
	}
}, Sn = e(({ messages: e, currentAgent: a, isGroupChat: s, showToolCallLog: c, isLoading: l, entryAgent: u, groups: d, theme: f = "dark", defaultQuerys: p = [], isUserDefaultAvatar: m = !0, userDisplayName: g = "", onSelectQuery: v, onLoadMore: S, hasMore: w = !1, isLoadingMore: E = !1, children: k }, M) => {
	let N = o(null), P = o(null), F = o(E), L = sn(e, a, s, {
		entryAgent: u,
		groups: d
	});
	r(M, () => ({ scrollToBottom: () => {
		N.current && (N.current.scrollTop = N.current.scrollHeight);
	} })), i(() => {
		let e = F.current;
		F.current = E;
		let t = N.current;
		if (e && !E && P.current && t) {
			let { scrollHeight: e, scrollTop: n } = P.current;
			t.scrollTop = n + (t.scrollHeight - e);
		}
	}, [E]), n(() => {
		if (!E) {
			if (P.current) {
				P.current = null;
				return;
			}
			N.current && (N.current.scrollTop = N.current.scrollHeight);
		}
	}, [L, E]);
	let R = t(() => {
		let e = N.current;
		!e || !w || E || e.scrollTop <= 50 && S && (P.current = {
			scrollHeight: e.scrollHeight,
			scrollTop: e.scrollTop
		}, S());
	}, [
		w,
		E,
		S
	]);
	return /* @__PURE__ */ V("div", {
		className: ["msglist-container", f === "light" ? "msglist-theme-light" : ""].filter(Boolean).join(" "),
		ref: N,
		onScroll: R,
		children: [
			/* @__PURE__ */ B("div", {
				className: "msglist-sticky-header",
				children: k
			}),
			L.length === 0 && !l && /* @__PURE__ */ B("div", {
				className: "msglist-empty",
				children: p.length > 0 ? /* @__PURE__ */ V("div", {
					className: "msglist-default-queries",
					children: [/* @__PURE__ */ B("div", {
						className: "msglist-default-queries__title",
						children: "有什么可以帮你的？"
					}), /* @__PURE__ */ B("div", {
						className: "msglist-default-queries__list",
						children: p.map((e, t) => /* @__PURE__ */ V("div", {
							className: "msglist-default-query-card",
							onClick: () => v?.(e),
							children: [/* @__PURE__ */ B(j, {
								size: 16,
								className: "msglist-default-query-icon"
							}), /* @__PURE__ */ B("span", { children: e })]
						}, t))
					})]
				}) : /* @__PURE__ */ B("div", {
					style: {
						color: "var(--ml-text-secondary, #8b949e)",
						fontSize: 14
					},
					children: "开始一段新的对话吧"
				})
			}),
			/* @__PURE__ */ V("div", {
				className: "msglist-turns",
				children: [L.map((e, t) => /* @__PURE__ */ V("div", {
					className: "msglist-turn",
					children: [e.userMsg && /* @__PURE__ */ B("div", {
						className: "msglist-user-block",
						children: /* @__PURE__ */ V("div", {
							className: "msglist-body-row msglist-body-row--user",
							children: [/* @__PURE__ */ V("div", {
								className: "msglist-user-bubble",
								children: [
									e.userMsg.documents && e.userMsg.documents.length > 0 && /* @__PURE__ */ B("div", {
										className: "msglist-user-docs",
										children: e.userMsg.documents.map((e, t) => /* @__PURE__ */ V("div", {
											className: "msglist-doc-item",
											children: [/* @__PURE__ */ B(D, {
												size: 12,
												className: "text-blue-400"
											}), /* @__PURE__ */ B("span", {
												className: "msglist-doc-name",
												children: gn(e)
											})]
										}, t))
									}),
									/* @__PURE__ */ B("div", {
										className: "msglist-user-text",
										children: e.userMsg.content
									}),
									/* @__PURE__ */ B("div", {
										className: "msglist-user-time",
										children: W(e.userMsg.timestamp)
									})
								]
							}), /* @__PURE__ */ B("div", {
								className: "msglist-user-avatar",
								children: m ? /* @__PURE__ */ B(I, { size: 14 }) : g
							})]
						})
					}), e.steps.length > 0 && /* @__PURE__ */ V("div", {
						className: "msglist-ai-block",
						children: [/* @__PURE__ */ V("div", {
							className: "msglist-header-row msglist-header-row--ai",
							children: [/* @__PURE__ */ V("div", {
								className: "msglist-header-left",
								children: [/* @__PURE__ */ B(un, {
									agentName: mn(e),
									size: "small"
								}), /* @__PURE__ */ B("span", {
									className: "msglist-header-name",
									children: mn(e)
								})]
							}), /* @__PURE__ */ B("span", {
								className: "msglist-header-time",
								children: hn(e)
							})]
						}), /* @__PURE__ */ B("div", {
							className: "msglist-body-row msglist-body-row--ai",
							children: /* @__PURE__ */ V("div", {
								className: "msglist-timeline",
								children: [e.steps.map((e, n) => /* @__PURE__ */ V("div", {
									className: "msglist-step",
									children: [/* @__PURE__ */ B("div", { className: e.type === "content" ? "msglist-final-dot" : "msglist-step-dot" }), /* @__PURE__ */ V("div", {
										className: "msglist-step-inner",
										children: [
											e.type === "ask" && /* @__PURE__ */ V("div", {
												className: "msglist-step-simple",
												children: [
													/* @__PURE__ */ B(T, {
														size: 12,
														className: "msglist-icon-dim"
													}),
													/* @__PURE__ */ B("span", {
														className: "msglist-step-mono",
														children: e.msg.fromAgent
													}),
													/* @__PURE__ */ B(_, {
														size: 10,
														className: "msglist-icon-dim mx-0.5"
													}),
													/* @__PURE__ */ V("span", {
														className: "msglist-step-mono-light",
														children: ["唤起 ", e.msg.toAgent || e.msg.agent]
													})
												]
											}),
											e.type === "reason" && /* @__PURE__ */ V("details", {
												className: "msglist-tool-card msglist-tool-think",
												children: [/* @__PURE__ */ V("summary", {
													className: "msglist-tool-summary-card",
													children: [/* @__PURE__ */ V("div", {
														className: "msglist-tool-card-inner",
														children: [/* @__PURE__ */ B("div", {
															className: "msglist-tool-icon-wrap msglist-tool-icon-emerald",
															children: /* @__PURE__ */ B(b, {
																size: 12,
																className: "text-emerald-400"
															})
														}), /* @__PURE__ */ V("span", {
															className: "msglist-tool-label",
															children: ["智能体思考 ", /* @__PURE__ */ V("span", {
																className: "text-emerald-400/60",
																children: ["· ", e.msg.agent]
															})]
														})]
													}), /* @__PURE__ */ V("div", {
														className: "msglist-tool-card-right",
														children: [yn(e, t, n, L, l) ? /* @__PURE__ */ B(A, {
															size: 12,
															className: "text-emerald-400 msglist-spin"
														}) : /* @__PURE__ */ B(x, {
															size: 12,
															className: "text-green-500"
														}), /* @__PURE__ */ B(C, {
															size: 12,
															className: "msglist-chevron"
														})]
													})]
												}), /* @__PURE__ */ B("div", {
													className: "msglist-tool-detail-body",
													children: e.msg.reasonContent
												})]
											}),
											e.type === "tool" && e.tool && /* @__PURE__ */ V(ne, { children: [
												e.tool.toolName === "runAgent" && /* @__PURE__ */ V("div", {
													className: "msglist-tool-card msglist-tool-dispatch",
													children: [/* @__PURE__ */ V("div", {
														className: "msglist-tool-card-inner",
														children: [/* @__PURE__ */ B("div", {
															className: "msglist-tool-icon-wrap msglist-tool-icon-purple",
															children: /* @__PURE__ */ B(T, {
																size: 12,
																className: "text-purple-400"
															})
														}), /* @__PURE__ */ V("span", {
															className: "msglist-tool-label",
															children: ["智能体调度: ", /* @__PURE__ */ B("span", {
																className: "msglist-tool-highlight-purple",
																children: bn(e.tool, "agentName") || bn(e.tool, "agent") || "Unknown"
															})]
														})]
													}), /* @__PURE__ */ B(xn, { status: e.tool.status })]
												}),
												e.tool.toolName === "loadSkill" && /* @__PURE__ */ V("div", {
													className: "msglist-tool-card msglist-tool-skill",
													children: [/* @__PURE__ */ V("div", {
														className: "msglist-tool-card-inner",
														children: [/* @__PURE__ */ B("div", {
															className: "msglist-tool-icon-wrap msglist-tool-icon-amber",
															children: /* @__PURE__ */ B(y, {
																size: 12,
																className: "text-amber-400"
															})
														}), /* @__PURE__ */ V("span", {
															className: "msglist-tool-label",
															children: ["加载技能: ", /* @__PURE__ */ B("span", {
																className: "msglist-tool-highlight-amber",
																children: bn(e.tool, "skillName") || bn(e.tool, "skill") || "Unknown"
															})]
														})]
													}), /* @__PURE__ */ B(xn, { status: e.tool.status })]
												}),
												e.tool.toolName !== "runAgent" && e.tool.toolName !== "loadSkill" && /* @__PURE__ */ V("details", {
													className: "msglist-tool-card msglist-tool-generic",
													children: [/* @__PURE__ */ V("summary", {
														className: "msglist-tool-summary-card",
														children: [/* @__PURE__ */ V("div", {
															className: "msglist-tool-card-inner",
															children: [/* @__PURE__ */ B("div", {
																className: "msglist-tool-icon-wrap msglist-tool-icon-yellow",
																children: /* @__PURE__ */ B(z, {
																	size: 12,
																	className: "text-yellow-400"
																})
															}), /* @__PURE__ */ V("span", {
																className: "msglist-tool-label",
																children: ["工具调用: ", /* @__PURE__ */ B("span", {
																	className: "msglist-tool-highlight-yellow",
																	children: e.tool.toolName
																})]
															})]
														}), /* @__PURE__ */ V("div", {
															className: "msglist-tool-card-right",
															children: [/* @__PURE__ */ B(xn, { status: e.tool.status }), /* @__PURE__ */ B(C, {
																size: 12,
																className: "msglist-chevron"
															})]
														})]
													}), /* @__PURE__ */ V("div", {
														className: "msglist-tool-detail-body",
														children: [
															e.tool.args && /* @__PURE__ */ V("div", { children: [
																/* @__PURE__ */ B("span", {
																	className: "text-purple-400/80",
																	children: "Args:"
																}),
																" ",
																e.tool.args
															] }),
															e.tool.status === "success" && e.tool.result && /* @__PURE__ */ V("div", { children: [
																/* @__PURE__ */ B("span", {
																	className: "text-green-400/80",
																	children: "Result:"
																}),
																" ",
																e.tool.result
															] }),
															e.tool.status === "failed" && e.tool.error && /* @__PURE__ */ V("div", {
																className: "text-red-400/80",
																children: ["Error: ", e.tool.error]
															})
														]
													})]
												})
											] }),
											e.type === "content" && /* @__PURE__ */ B("div", {
												className: "msglist-final-body",
												children: /* @__PURE__ */ V("div", {
													className: ["msglist-final-text", vn(e.msg) ? "msglist-final-error" : ""].filter(Boolean).join(" "),
													children: [vn(e.msg) ? /* @__PURE__ */ V("div", {
														className: "msglist-error-inline",
														children: [/* @__PURE__ */ B(h, { size: 14 }), /* @__PURE__ */ B("span", { children: e.msg.content })]
													}) : /* @__PURE__ */ B("div", { dangerouslySetInnerHTML: { __html: pn(e.msg.content || "") } }), e.msg.isStreaming && /* @__PURE__ */ B("span", { className: "msglist-cursor" })]
												})
											}),
											e.type === "askUser" && /* @__PURE__ */ V(ne, { children: [/* @__PURE__ */ B("div", {
												className: "msglist-tool-card msglist-tool-askuser",
												children: /* @__PURE__ */ V("div", {
													className: "msglist-tool-card-inner",
													children: [/* @__PURE__ */ B("div", {
														className: "msglist-tool-icon-wrap msglist-tool-icon-amber",
														children: /* @__PURE__ */ B(O, {
															size: 12,
															className: "text-amber-400"
														})
													}), /* @__PURE__ */ V("span", {
														className: "msglist-tool-label",
														children: ["智能体询问: ", /* @__PURE__ */ B("span", {
															className: "msglist-tool-highlight-amber",
															children: e.msg.agent
														})]
													})]
												})
											}), e.msg.content && /* @__PURE__ */ B("div", {
												className: "msglist-askuser-body",
												children: /* @__PURE__ */ B("div", {
													className: "msglist-askuser-text",
													dangerouslySetInnerHTML: { __html: pn(e.msg.content || "") }
												})
											})] }),
											e.type !== "ask" && e.type !== "reason" && e.type !== "tool" && e.type !== "content" && e.type !== "askUser" && /* @__PURE__ */ V("div", {
												className: "msglist-step-simple",
												children: [/* @__PURE__ */ B(T, {
													size: 12,
													className: "msglist-icon-dim"
												}), /* @__PURE__ */ B("span", {
													className: "msglist-step-mono",
													children: _n(e)
												})]
											}),
											e.msg.timestamp && /* @__PURE__ */ B("span", {
												className: "msglist-step-time",
												children: W(e.msg.timestamp)
											})
										]
									})]
								}, "step-" + n)), t === L.length - 1 && l && e.steps.length === 0 && /* @__PURE__ */ V("div", {
									className: "msglist-loading-step",
									children: [/* @__PURE__ */ B("div", { className: "msglist-step-dot-sm" }), /* @__PURE__ */ V("div", {
										className: "msglist-loading-dots",
										children: [
											/* @__PURE__ */ B("span", { className: "msglist-dot msglist-dot-1" }),
											/* @__PURE__ */ B("span", { className: "msglist-dot msglist-dot-2" }),
											/* @__PURE__ */ B("span", { className: "msglist-dot msglist-dot-3" })
										]
									})]
								})]
							})
						})]
					})]
				}, t)), l && L.length === 0 && /* @__PURE__ */ V("div", {
					className: "msglist-ai-block",
					children: [/* @__PURE__ */ B("div", {
						className: "msglist-header-row msglist-header-row--ai",
						children: /* @__PURE__ */ V("div", {
							className: "msglist-header-left",
							children: [/* @__PURE__ */ B("div", {
								className: "msglist-ai-avatar-icon",
								children: /* @__PURE__ */ B(A, {
									size: 14,
									className: "text-white msglist-spin"
								})
							}), /* @__PURE__ */ B("span", {
								className: "msglist-header-name",
								children: "AI"
							})]
						})
					}), /* @__PURE__ */ B("div", {
						className: "msglist-body-row msglist-body-row--ai",
						children: /* @__PURE__ */ V("div", {
							className: "msglist-loading-dots",
							children: [
								/* @__PURE__ */ B("span", { className: "msglist-dot msglist-dot-1" }),
								/* @__PURE__ */ B("span", { className: "msglist-dot msglist-dot-2" }),
								/* @__PURE__ */ B("span", { className: "msglist-dot msglist-dot-3" })
							]
						})
					})]
				})]
			}),
			E && /* @__PURE__ */ B("div", {
				className: "msglist-loading-more",
				children: /* @__PURE__ */ B("span", { children: "加载中..." })
			})
		]
	});
});
Sn.displayName = "TimelineMessageList";
//#endregion
//#region src/components/common/TokensBar.tsx
function Cn(e) {
	return e >= 1024 * 1024 ? `${(e / (1024 * 1024)).toFixed(1)}M` : e >= 1024 ? `${(e / 1024).toFixed(1)}K` : e.toString();
}
function wn(e) {
	return e >= 256 * 1024 ? "tokens-bar__fill--red" : e >= 128 * 1024 ? "tokens-bar__fill--amber" : "tokens-bar__fill--emerald";
}
var Tn = ({ agentName: e, tokens: t, maxTokens: n = 1024 * 1024 }) => {
	if (!e) return null;
	let r = Math.min(t / n * 100, 100), i = wn(t);
	return /* @__PURE__ */ V("div", {
		className: "tokens-bar",
		children: [
			/* @__PURE__ */ B("span", {
				className: "tokens-bar__name",
				children: e
			}),
			/* @__PURE__ */ B("span", {
				className: "tokens-bar__value",
				children: Cn(t)
			}),
			/* @__PURE__ */ V("div", {
				className: "tokens-bar__track-wrapper",
				children: [/* @__PURE__ */ V("div", {
					className: "tokens-bar__track",
					children: [
						/* @__PURE__ */ B("div", {
							className: `tokens-bar__fill ${i}`,
							style: { width: `${r}%` }
						}),
						/* @__PURE__ */ B("div", { className: "tokens-bar__tick tokens-bar__tick--32k" }),
						/* @__PURE__ */ B("div", { className: "tokens-bar__tick tokens-bar__tick--64k" }),
						/* @__PURE__ */ B("div", { className: "tokens-bar__tick tokens-bar__tick--128k" }),
						/* @__PURE__ */ B("div", { className: "tokens-bar__tick tokens-bar__tick--256k" }),
						/* @__PURE__ */ B("div", { className: "tokens-bar__tick tokens-bar__tick--512k" })
					]
				}), /* @__PURE__ */ V("div", {
					className: "tokens-bar__labels",
					children: [
						/* @__PURE__ */ B("span", { children: "0" }),
						/* @__PURE__ */ B("span", { children: "128K" }),
						/* @__PURE__ */ B("span", { children: "256K" }),
						/* @__PURE__ */ B("span", { children: "512K" }),
						/* @__PURE__ */ B("span", { children: "1M" })
					]
				})]
			})
		]
	});
}, En = 10 * 1024 * 1024, Dn = ({ isConnected: e, isLoading: r, connectionError: i = null, theme: c = "dark", showAgentInfo: l = !1, isEnableFile: f = !0, input_isEnableKnowledge: p = !0, placeholder: m = "", showTokensBar: h = !1, currentAgentName: g = "", agentTokens: _ = {}, horizontalAlignment: b = "Full", margin: x = "", inputWidth: S = "", inputAgentsData: C = [], boundAgent: w = null, boundAgentType: T = "agent", onSend: E, onTerminate: O }) => {
	let [k, A] = s(""), [j, N] = s([]), [P, R] = s(!1), [z, re] = s([]), [ie, H] = s(!1), [U, ae] = s(""), [oe, W] = s(-1), [se, ce] = s(0), [G, K] = s(null), [le, ue] = s([]), [q, de] = s([]), [fe, pe] = s(!1), [me, he] = s(""), [ge, _e] = s(-1), [ve, ye] = s(0), [be, xe] = s(!1), [Se, Ce] = s(!1), we = o(!1), Te = o(!1), Ee = o(null), De = o(null), Oe = o(null), ke = o(null), Ae = o(null), je = o(null), Me = o(null), Ne = o(null), Pe = a(() => z.length === 1, [z]), Fe = a(() => {
		let e = U.toLowerCase();
		return z.filter((t) => t.name.toLowerCase().includes(e) || t.description && t.description.toLowerCase().includes(e));
	}, [z, U]), Ie = a(() => {
		let e = me.toLowerCase();
		return le.filter((t) => t.group_name.toLowerCase().includes(e) || t.description && t.description.toLowerCase().includes(e));
	}, [le, me]), Le = a(() => G ? G.name : Pe && z.length > 0 ? z[0].name : g || w || "", [
		G,
		Pe,
		z,
		g,
		w
	]), Re = a(() => Le ? _[Le] ?? 0 : 0, [Le, _]), ze = a(() => m || (e ? w ? `输入消息... (默认发送给${T === "group" ? "智能体组" : "智能体"}: ${w})` : "输入消息... (请使用 @ 指定智能体)" : "未连接"), [
		m,
		e,
		w,
		T
	]), Be = a(() => {
		let e = x.trim().split(/\s+/), t = e[0] || "", n = e[1] || e[0] || "", r = S;
		switch (b) {
			case "Left": return {
				alignSelf: "flex-start",
				...t ? { marginLeft: t } : {},
				...r ? { width: r } : {}
			};
			case "Center": return {
				alignSelf: "center",
				...r ? { width: r } : {}
			};
			case "Right": return {
				alignSelf: "flex-end",
				...n ? { marginRight: n } : {},
				...r ? { width: r } : {}
			};
			default: return {
				...t ? { marginLeft: t } : {},
				...n ? { marginRight: n } : {}
			};
		}
	}, [
		b,
		x,
		S
	]), Ve = t(async () => {
		if (Ft() && !we.current) {
			we.current = !0;
			try {
				let [e, t] = await Promise.all([ht.getAll().catch(() => ({ data: [] })), gt.getAll().catch(() => ({ data: [] }))]), n = (e.data || []).map((e) => ({
					name: e.name,
					type: "agent",
					description: e.describe || e.description
				})), r = (t.data || []).map((e) => ({
					name: e.name,
					type: "group",
					description: e.describe
				}));
				re([...n, ...r]);
			} catch (e) {
				console.error("[InputArea] 加载智能体列表失败:", e);
			}
		}
	}, []), He = t(async () => {
		if (p && Ft() && !Te.current) {
			Te.current = !0;
			try {
				let e = await vt.listGroups().catch(() => ({ data: { groups: [] } }));
				ue(e.data?.groups || e.groups || []);
			} catch (e) {
				console.error("[InputArea] 加载知识库列表失败:", e);
			}
		}
	}, [p]);
	n(() => {
		C.length > 0 ? (re(C.map((e) => ({
			name: e.agent,
			type: e.agentType,
			description: e.describe
		}))), we.current = !0) : Ve();
	}, [C, Ve]), n(() => {
		p && He();
	}, [p, He]);
	let Ue = t((e) => {
		if (!De.current) return;
		let t = e.clientWidth, n = De.current.children, r = 0;
		for (let e = 0; e < n.length; e++) {
			let t = n[e];
			r += t.offsetWidth;
		}
		let i = t * .8, a = r > i;
		xe((e) => (e !== a && Ce(!1), a));
	}, []);
	n(() => {
		let e = Oe.current;
		if (!e) return;
		let t = new ResizeObserver((e) => {
			for (let t of e) Ue(t.target);
		});
		return t.observe(e), () => {
			t.disconnect();
		};
	}, [Ue]), n(() => {
		let e = (e) => {
			let t = e.target;
			!(ke.current && ke.current.contains(t) || Ae.current && Ae.current.contains(t)) && Ee.current !== t && H(!1), !(Ne.current && Ne.current.contains(t) || je.current && je.current.contains(t)) && Ee.current !== t && pe(!1), !(Me.current && Me.current.contains(t)) && Ee.current !== t && Ce(!1);
		};
		return document.addEventListener("mousedown", e), () => document.removeEventListener("mousedown", e);
	}, []);
	let We = t((e) => {
		let t = e.target.value, n = e.target.selectionStart || 0;
		A(t);
		let r = t.slice(0, n);
		if (p) {
			let e = r.lastIndexOf("#");
			if (e !== -1) {
				let t = r.slice(e + 1);
				if (!t.includes(" ") && !t.includes("\n")) {
					he(t), _e(e), pe(!0), ye(0), H(!1);
					return;
				}
			}
		}
		if (!Pe) {
			let e = r.lastIndexOf("@");
			if (e !== -1) {
				let t = r.slice(e + 1);
				if (!t.includes(" ") && !t.includes("\n")) {
					ae(t), W(e), H(!0), ce(0), pe(!1);
					return;
				}
			}
		}
		H(!1), ae(""), W(-1), pe(!1), he(""), _e(-1);
	}, [p, Pe]), Ge = t((e, t = !1) => {
		if (t) {
			K({
				type: e.type,
				name: e.name
			}), H(!1), ae(""), W(-1), Ee.current?.focus();
			return;
		}
		if (oe === -1) return;
		let n = k.slice(0, oe);
		A(n + k.slice(oe + 1 + U.length)), K({
			type: e.type,
			name: e.name
		}), H(!1), ae(""), W(-1), requestAnimationFrame(() => {
			let e = Ee.current;
			if (e) {
				let t = n.length;
				e.setSelectionRange(t, t), e.focus();
			}
		});
	}, [
		k,
		oe,
		U
	]), Ke = t(() => {
		K(null);
	}, []), qe = t(() => {
		H((e) => (e || Ve(), !e));
	}, [Ve]), Je = t(() => {
		pe((e) => (e || He(), !e));
	}, [He]), Ye = t(() => {
		Ce((e) => (e || (H(!1), pe(!1)), !e));
	}, []), Xe = t((e) => {
		de((t) => t.includes(e.group_id) ? t : [...t, e.group_id]), ge !== -1 && A(k.slice(0, ge) + k.slice(ge + 1 + me.length)), pe(!1), he(""), _e(-1), requestAnimationFrame(() => {
			Ee.current?.focus();
		});
	}, [
		k,
		ge,
		me
	]), Ze = t((e) => {
		de((t) => t.filter((t) => t !== e));
	}, []), Qe = t((e) => {
		if (fe && Ie.length > 0) {
			if (e.key === "ArrowDown") {
				e.preventDefault(), ye((e) => (e + 1) % Ie.length);
				return;
			}
			if (e.key === "ArrowUp") {
				e.preventDefault(), ye((e) => (e - 1 + Ie.length) % Ie.length);
				return;
			}
			if (e.key === "Enter") {
				e.preventDefault(), Xe(Ie[ve]);
				return;
			}
			if (e.key === "Escape") {
				pe(!1);
				return;
			}
		}
		if (ie && Fe.length > 0) {
			if (e.key === "ArrowDown") {
				e.preventDefault(), ce((e) => (e + 1) % Fe.length);
				return;
			}
			if (e.key === "ArrowUp") {
				e.preventDefault(), ce((e) => (e - 1 + Fe.length) % Fe.length);
				return;
			}
			if (e.key === "Enter" || e.key === "Tab") {
				e.preventDefault(), Ge(Fe[se]);
				return;
			}
			if (e.key === "Escape") {
				H(!1);
				return;
			}
		}
		e.key === "Enter" && !e.shiftKey && (e.preventDefault(), nt());
	}, [
		fe,
		Ie,
		ve,
		Xe,
		ie,
		Fe,
		se,
		Ge
	]), $e = (e) => e < 1024 ? e + " B" : e < 1024 * 1024 ? (e / 1024).toFixed(2) + " KB" : (e / (1024 * 1024)).toFixed(2) + " MB", et = t((e) => e.size > En ? (d.error(`文件 ${e.name} 大小超过 10MB 限制`), !1) : (N((t) => [...t, {
		name: e.name,
		size: e.size,
		file: e
	}]), !1), []), tt = t((e) => {
		N((t) => t.filter((t, n) => n !== e));
	}, []), nt = t(async () => {
		if (!k.trim() && j.length === 0 || !e) return;
		let t;
		if (G) t = {
			type: G.type,
			name: G.name
		};
		else if (Pe && z.length > 0) {
			let e = z[0];
			t = {
				type: e.type,
				name: e.name
			};
		} else w && (t = {
			type: T,
			name: w
		});
		if (!t) {
			d.warning("请使用 @ 指定目标智能体");
			return;
		}
		let n = [];
		if (j.length > 0) {
			R(!0);
			try {
				let e = await _t.uploadFiles(j.map((e) => e.file));
				if (!e.success || !e.data) {
					d.error("文件上传失败: " + (e.message || "操作失败")), R(!1);
					return;
				}
				let t = e.data;
				n = Array.isArray(t) ? t : [t];
			} catch (e) {
				console.error("[InputArea] 文件上传失败:", e), d.error("文件上传失败，请重试"), R(!1);
				return;
			} finally {
				R(!1);
			}
		}
		let r = q.length > 0 ? [...q] : void 0;
		E?.(k, n, t, r), A(""), N([]);
	}, [
		k,
		j,
		e,
		G,
		Pe,
		z,
		w,
		T,
		q,
		E
	]);
	return /* @__PURE__ */ V("div", {
		className: `input-area ${c === "light" ? "input-area--light" : "input-area--dark"}`,
		children: [
			i && /* @__PURE__ */ B("div", {
				className: "error-banner",
				children: /* @__PURE__ */ B("div", {
					className: "ia-error-alert",
					children: i
				})
			}),
			p && q.length > 0 && /* @__PURE__ */ B("div", {
				className: "knowledge-tag-wrapper",
				children: q.map((e) => /* @__PURE__ */ V("span", {
					className: "knowledge-tag",
					children: [
						/* @__PURE__ */ B(y, {
							size: 14,
							className: "knowledge-tag__icon"
						}),
						/* @__PURE__ */ B("span", { children: le.find((t) => t.group_id === e)?.group_name || e }),
						/* @__PURE__ */ B("button", {
							className: "knowledge-tag__close",
							onClick: () => Ze(e),
							children: /* @__PURE__ */ B(te, { size: 14 })
						})
					]
				}, e))
			}),
			j.length > 0 && /* @__PURE__ */ B("div", {
				className: "uploaded-files",
				children: j.map((e, t) => /* @__PURE__ */ V("span", {
					className: "file-tag",
					children: [
						/* @__PURE__ */ B(D, { size: 14 }),
						/* @__PURE__ */ B("span", { children: e.name }),
						/* @__PURE__ */ V("span", {
							className: "file-size",
							children: [
								"(",
								$e(e.size),
								")"
							]
						}),
						/* @__PURE__ */ B("button", {
							className: "file-tag__close",
							onClick: () => tt(t),
							children: /* @__PURE__ */ B(te, { size: 14 })
						})
					]
				}, t))
			}),
			/* @__PURE__ */ V("div", {
				className: "input-container",
				ref: Oe,
				style: Be,
				children: [
					/* @__PURE__ */ B("textarea", {
						ref: Ee,
						value: k,
						onChange: We,
						onKeyDown: Qe,
						className: "input-textarea",
						placeholder: ze,
						disabled: !e,
						rows: 1
					}),
					/* @__PURE__ */ V("div", {
						className: "input-toolbar",
						ref: De,
						children: [
							l && /* @__PURE__ */ B("div", {
								className: "toolbar-agent-selector",
								ref: Ae,
								children: Pe ? /* @__PURE__ */ V("button", {
									className: "toolbar-agent-btn toolbar-agent-btn--single",
									children: [z[0]?.type === "agent" ? /* @__PURE__ */ B(I, { size: 12 }) : /* @__PURE__ */ B(L, { size: 12 }), /* @__PURE__ */ B("span", {
										className: "toolbar-agent-name",
										children: z[0]?.name
									})]
								}) : /* @__PURE__ */ B(ne, { children: G ? /* @__PURE__ */ V("button", {
									className: "toolbar-agent-btn toolbar-agent-btn--selected",
									onClick: qe,
									children: [
										G.type === "agent" ? /* @__PURE__ */ B(I, { size: 12 }) : /* @__PURE__ */ B(L, { size: 12 }),
										/* @__PURE__ */ B("span", {
											className: "toolbar-agent-name",
											children: G.name
										}),
										/* @__PURE__ */ B("button", {
											className: "toolbar-agent-remove",
											onClick: (e) => {
												e.stopPropagation(), Ke();
											},
											title: "移除",
											children: /* @__PURE__ */ B(te, { size: 10 })
										})
									]
								}) : w ? /* @__PURE__ */ V("button", {
									className: "toolbar-agent-btn toolbar-agent-btn--bound",
									onClick: qe,
									children: [B(T === "agent" ? I : L, { size: 12 }), /* @__PURE__ */ B("span", {
										className: "toolbar-agent-name",
										children: w
									})]
								}) : /* @__PURE__ */ V("button", {
									className: "toolbar-agent-btn toolbar-agent-btn--empty",
									onClick: qe,
									children: [/* @__PURE__ */ B(L, { size: 12 }), /* @__PURE__ */ B("span", {
										className: "toolbar-agent-name",
										children: "选择智能体"
									})]
								}) })
							}),
							be ? /* @__PURE__ */ V("div", {
								className: "toolbar-more-selector",
								ref: Me,
								children: [/* @__PURE__ */ B("button", {
									className: "toolbar-btn toolbar-btn--more",
									onClick: Ye,
									title: "更多工具",
									children: /* @__PURE__ */ B(M, { size: 16 })
								}), Se && /* @__PURE__ */ V("div", {
									className: "more-panel",
									children: [f && /* @__PURE__ */ B(u, {
										beforeUpload: et,
										showUploadList: !1,
										multiple: !0,
										className: "more-panel__item",
										children: /* @__PURE__ */ V("button", {
											className: "more-panel__btn",
											disabled: !e || P,
											children: [/* @__PURE__ */ B(F, { size: 14 }), /* @__PURE__ */ B("span", { children: "添加附件" })]
										})
									}), p && /* @__PURE__ */ V("button", {
										className: "more-panel__btn",
										onClick: () => {
											Ce(!1), Je();
										},
										children: [/* @__PURE__ */ B(y, { size: 14 }), /* @__PURE__ */ V("span", { children: ["知识库", q.length > 0 ? ` (${q.length})` : ""] })]
									})]
								})]
							}) : /* @__PURE__ */ V(ne, { children: [f && /* @__PURE__ */ B(u, {
								beforeUpload: et,
								showUploadList: !1,
								multiple: !0,
								className: "upload-trigger",
								children: /* @__PURE__ */ B("button", {
									className: "toolbar-btn toolbar-btn--attach",
									disabled: !e || P,
									title: "添加附件",
									children: /* @__PURE__ */ B(F, { size: 16 })
								})
							}), p && /* @__PURE__ */ B("div", {
								className: "toolbar-knowledge-selector",
								ref: je,
								children: q.length > 0 ? /* @__PURE__ */ V("button", {
									className: "toolbar-knowledge-btn toolbar-knowledge-btn--selected",
									onClick: Je,
									children: [/* @__PURE__ */ B(y, { size: 12 }), /* @__PURE__ */ B("span", {
										className: "toolbar-knowledge-count",
										children: q.length
									})]
								}) : /* @__PURE__ */ B("button", {
									className: "toolbar-knowledge-btn toolbar-knowledge-btn--empty",
									onClick: Je,
									children: /* @__PURE__ */ B(y, { size: 12 })
								})
							})] }),
							r ? /* @__PURE__ */ B("button", {
								className: "toolbar-btn toolbar-btn--stop",
								onClick: O,
								title: "终止对话",
								children: /* @__PURE__ */ B(ee, { size: 16 })
							}) : /* @__PURE__ */ B("button", {
								className: "toolbar-btn toolbar-btn--send",
								disabled: !e || !k.trim() && j.length === 0 || P,
								onClick: nt,
								title: "发送",
								children: /* @__PURE__ */ B(v, { size: 14 })
							})
						]
					}),
					ie && /* @__PURE__ */ B("div", {
						ref: ke,
						className: "mention-panel mention-panel--toolbar",
						children: Fe.length === 0 ? /* @__PURE__ */ B("div", {
							className: "mention-empty",
							children: "搜索..."
						}) : /* @__PURE__ */ B("div", {
							className: "mention-list",
							children: Fe.map((e, t) => /* @__PURE__ */ V("div", {
								className: `mention-item ${t === se ? "mention-item--active" : ""}`,
								onClick: () => Ge(e, oe === -1),
								onMouseEnter: () => ce(t),
								children: [
									e.type === "agent" ? /* @__PURE__ */ B(I, {
										size: 18,
										className: "mention-item__icon"
									}) : /* @__PURE__ */ B(L, {
										size: 18,
										className: "mention-item__icon"
									}),
									/* @__PURE__ */ V("div", {
										className: "mention-item__info",
										children: [/* @__PURE__ */ B("div", {
											className: "mention-item__name",
											children: e.name
										}), e.description && /* @__PURE__ */ B("div", {
											className: "mention-item__desc",
											children: e.description
										})]
									}),
									/* @__PURE__ */ B("span", {
										className: `mention-type-badge ${e.type === "agent" ? "mention-type-badge--agent" : "mention-type-badge--group"}`,
										children: e.type === "agent" ? "Agent" : "Group"
									})
								]
							}, `${e.type}-${e.name}`))
						})
					}),
					fe && /* @__PURE__ */ V("div", {
						ref: Ne,
						className: "knowledge-panel knowledge-panel--toolbar",
						children: [/* @__PURE__ */ V("div", {
							className: "knowledge-panel__header",
							children: [/* @__PURE__ */ B("span", { children: "选择知识库" }), q.length > 0 && /* @__PURE__ */ V("span", {
								className: "knowledge-panel__count",
								children: [
									"已选择 ",
									q.length,
									" 个知识库"
								]
							})]
						}), Ie.length === 0 ? /* @__PURE__ */ B("div", {
							className: "knowledge-panel__empty",
							children: "暂无可用知识库"
						}) : /* @__PURE__ */ B("div", {
							className: "knowledge-panel__list",
							children: Ie.map((e, t) => /* @__PURE__ */ V("div", {
								className: `knowledge-panel__item ${t === ve ? "knowledge-panel__item--active" : ""}`,
								onClick: () => Xe(e),
								onMouseEnter: () => ye(t),
								children: [
									/* @__PURE__ */ B(y, {
										size: 18,
										className: "knowledge-panel__item-icon"
									}),
									/* @__PURE__ */ V("div", {
										className: "knowledge-panel__item-info",
										children: [/* @__PURE__ */ B("div", {
											className: "knowledge-panel__item-name",
											children: e.group_name
										}), e.description && /* @__PURE__ */ B("div", {
											className: "knowledge-panel__item-desc",
											children: e.description
										})]
									}),
									/* @__PURE__ */ B("span", {
										className: "knowledge-panel__item-count",
										children: e.doc_count
									})
								]
							}, e.group_id))
						})]
					})
				]
			}),
			h && Le ? /* @__PURE__ */ B(Tn, {
				agentName: Le,
				tokens: Re
			}) : h ? /* @__PURE__ */ B("div", {
				className: "ia-no-agent-tip",
				children: /* @__PURE__ */ B("span", { children: "暂无配置智能体" })
			}) : null
		]
	});
};
//#endregion
//#region ../../node_modules/.pnpm/@xyxandwxx+transport@0.1.13/node_modules/@xyxandwxx/transport/core/RequestAtts.js
function On(e) {
	let t = e.toString(), n = t.match(/\(([^)]*)\)/) ?? t.match(/^([a-zA-Z_$][\w$]*)\s*=>/);
	if (!n) throw console.log(`1.异常的参数信息 : ${t}`), Error("读取参数异常...");
	let r = n[1];
	if (!r) return [];
	var i = 0;
	return r.split(",").map((e) => ({
		name: e,
		index: i++
	}));
}
//#endregion
//#region ../../node_modules/.pnpm/uuid@13.0.2/node_modules/uuid/dist/stringify.js
var X = [];
for (let e = 0; e < 256; ++e) X.push((e + 256).toString(16).slice(1));
function kn(e, t = 0) {
	return (X[e[t + 0]] + X[e[t + 1]] + X[e[t + 2]] + X[e[t + 3]] + "-" + X[e[t + 4]] + X[e[t + 5]] + "-" + X[e[t + 6]] + X[e[t + 7]] + "-" + X[e[t + 8]] + X[e[t + 9]] + "-" + X[e[t + 10]] + X[e[t + 11]] + X[e[t + 12]] + X[e[t + 13]] + X[e[t + 14]] + X[e[t + 15]]).toLowerCase();
}
//#endregion
//#region ../../node_modules/.pnpm/uuid@13.0.2/node_modules/uuid/dist/rng.js
var An, jn = new Uint8Array(16);
function Mn() {
	if (!An) {
		if (typeof crypto > "u" || !crypto.getRandomValues) throw Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
		An = crypto.getRandomValues.bind(crypto);
	}
	return An(jn);
}
var Nn = { randomUUID: typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto) };
//#endregion
//#region ../../node_modules/.pnpm/uuid@13.0.2/node_modules/uuid/dist/v4.js
function Pn(e, t, n) {
	e ||= {};
	let r = e.random ?? e.rng?.() ?? Mn();
	if (r.length < 16) throw Error("Random bytes length must be >= 16");
	if (r[6] = r[6] & 15 | 64, r[8] = r[8] & 63 | 128, t) {
		if (n ||= 0, n < 0 || n + 16 > t.length) throw RangeError(`UUID byte range ${n}:${n + 15} is out of buffer bounds`);
		for (let e = 0; e < 16; ++e) t[n + e] = r[e];
		return t;
	}
	return kn(r);
}
function Fn(e, t, n) {
	return Nn.randomUUID && !t && !e ? Nn.randomUUID() : Pn(e, t, n);
}
//#endregion
//#region ../../node_modules/.pnpm/@xyxandwxx+transport@0.1.13/node_modules/@xyxandwxx/transport/interfaces/Transport.js
var In = class {
	transportName;
	requestMap = /* @__PURE__ */ new Map();
	middler;
	controllers = [];
	controllerMethods = /* @__PURE__ */ new Map();
	timeout = 3e4;
	isStarting = !1;
	_startingPromise = null;
	isDisposed = !1;
	showLog = !1;
	constructor(e) {
		this.transportName = e;
	}
	async start() {
		if (!this.isStarting) return this._startingPromise ||= this._doStart(), this._startingPromise;
	}
	async _doStart() {
		this.middler = await this.createMiddler(), this.middler.addListener((e) => {
			let t = JSON.parse(e);
			if (this.showLog && console.log(`[${this.transportName}] <--- `, t), t.type === "response" || t.result) {
				if (this.requestMap.has(t.id)) {
					let e = this.requestMap.get(t.id);
					e && (t.error ? e.er(t.error.message) : e.su(t.result));
				}
			} else this.handleRequest(t).then((e) => {
				this.middler.postMessage(JSON.stringify(e));
			});
		}), this.isStarting = !0;
	}
	request(e, t) {
		return this.requestWithParam(e, {}, t);
	}
	requestWithParam(e, t, n) {
		if (this.isDisposed) throw Error(`当前 : ${this.transportName} 已经被释放，无法进行请求!`);
		if (!this.isStarting) throw Error(`当前 : ${this.transportName} 还未开始，无法进行请求!`);
		let r = {
			id: Fn().toString(),
			type: "request",
			method: e,
			params: n,
			...t
		};
		return this.showLog && console.log(`[${this.transportName}] ---> `, r), new Promise((e, t) => {
			let n = 0;
			this.timeout > 0 && (n = setTimeout(() => {
				let e = this.requestMap.get(r.id);
				e && (this.requestMap.delete(r.id), e?.er("执行超时!"));
			}, this.timeout)), this.requestMap.set(r.id, {
				su: (t) => {
					this.timeout > 0 && clearTimeout(n), e(t);
				},
				er: (e) => {
					this.timeout > 0 && clearTimeout(n), this.showLog && console.warn(`[${this.transportName}] : receive error -> ${e}`), t(Error(e));
				}
			}), this.middler.postMessage(JSON.stringify(r));
		});
	}
	convertMapParams(e, t) {
		let n = [];
		for (var r = 0; r < t.length; r++) {
			let i = t[r];
			if (!i) throw Error("异常参数....");
			if (!(i.name in e)) throw Error(`未找到参数 : ${i.name}`);
			n.push(e[i.name]);
		}
		return n;
	}
	async handleRequest(e) {
		try {
			let t = this.controllerMethods.get(e.method);
			if (!t) throw Error(`未找到请求方法 : ${e.method}`);
			let n;
			if (Array.isArray(e.params)) n = t.method.call(t._this, ...e.params);
			else {
				let r = this.convertMapParams(e.params, t.params);
				n = t.method.call(t._this, ...r);
			}
			return n instanceof Promise && (n = await n), this.createSuccessResponse(e, n);
		} catch (t) {
			return this.createErrorResponse(e, t);
		}
	}
	createErrorResponse(e, t) {
		return {
			id: e.id,
			method: e.method,
			type: "response",
			error: {
				code: -500,
				message: this.errorToString(t)
			}
		};
	}
	createSuccessResponse(e, t) {
		return {
			id: e.id,
			method: e.method,
			result: t,
			type: "response"
		};
	}
	registerController(e) {
		this.controllers.push(e);
		for (let t of e.getAllHandleFunctions()) this.controllerMethods.set(t[0], t[1]);
	}
	registerHandleMethod(e, t) {
		this.registerHandleMethodWithThis(e, t, null);
	}
	registerHandleMethodWithThis(e, t, n) {
		let r = {
			_this: n,
			method: t,
			path: e,
			params: On(t)
		};
		this.registerHandleByFuncData(r);
	}
	registerHandleByFuncData(e) {
		this.controllerMethods.has(e.path) || this.controllerMethods.set(e.path, e);
	}
	errorToString(e) {
		return typeof e == "string" ? e : e instanceof Error ? e.message : JSON.stringify(e);
	}
	async dispose() {
		if (!this.disposed) {
			this.isDisposed = !0;
			for (let [, e] of this.requestMap) e.er(/* @__PURE__ */ Error(`通道 [${this.transportName}] 已释放，请求被取消`));
			this.requestMap.clear(), this.controllerMethods.clear(), this.controllers.length = 0, await this.onDisposed();
		}
	}
	get disposed() {
		return this.isDisposed;
	}
}, Ln = class extends In {
	reconnectDelay;
	ws;
	linkStr;
	wsMessageHandle = (e) => {
		console.log(`[receive] <--- ${e}`);
	};
	onReconnectedEvent = (e) => console.log(`${e.transportName} 重新连接成功!`);
	onConnectedEvent = (e) => console.log(`${e.transportName} 已连接!`);
	onDisconnectedEvent = (e) => console.log(`${e.transportName} 断开连接!`);
	constructor(e, t, n, r, i = 1e3) {
		super(e), this.reconnectDelay = i, this.linkStr = `ws://${t}:${n}/${r.startsWith("/") ? r.substring(1) : r}`;
	}
	cleanupWs() {
		this.ws &&= (this.ws.onopen = null, this.ws.onerror = null, this.ws.onclose = null, this.ws.onmessage = null, this.ws.readyState !== WebSocket.CLOSED && this.ws.close(), null);
	}
	connect() {
		return this.cleanupWs(), new Promise((e, t) => {
			this.ws = new WebSocket(this.linkStr), this.ws.onopen = () => {
				this.isStarting && this.onReconnectedEvent(this), this.showLog && console.log(`[${this.transportName}] : 连接成功!`), e(!0), this.onConnectedEvent(this);
			}, this.ws.onerror = (e) => {
				t(e);
			}, this.ws.onclose = () => {
				this.onDisconnectedEvent(this), this.isStarting ? (this.showLog && console.log(`[${this.transportName}] : 断开连接!`), setTimeout(() => this.reconnect(), this.reconnectDelay)) : t(`[${this.transportName}] : 连接失败!`);
			}, this.ws.onmessage = (e) => {
				this.wsMessageHandle && this.wsMessageHandle(e.data);
			};
		});
	}
	reconnect() {
		!this.isConnected() && !this.disposed && this.connect().catch(() => {
			setTimeout(() => this.reconnect(), this.reconnectDelay);
		});
	}
	isConnected() {
		return this.ws?.readyState === WebSocket.OPEN;
	}
	sleep(e) {
		return new Promise((t, n) => {
			setTimeout(t, e);
		});
	}
	async waitForConnect(e) {
		let t = Date.now() + e;
		for (; (!this.isConnected() || !this.isStarting) && Date.now() < t;) await this.sleep(500);
		return this.isConnected();
	}
	async createMiddler() {
		for (;;) try {
			await this.connect();
			break;
		} catch {
			console.log("尝试重新连接..."), await this.sleep(this.reconnectDelay);
		}
		return {
			postMessage: (e) => {
				if (!this.isConnected()) throw Error(`连接 : ${this.linkStr} 已经断开...`);
				this.ws.send(e);
			},
			addListener: (e) => {
				this.wsMessageHandle = e;
			},
			removeListener: (e) => {
				this.wsMessageHandle = (e) => {
					console.log(`[receive] <--- ${e}`);
				};
			}
		};
	}
	async onDisposed() {
		this.ws && this.ws.close(1e3, `客户端[${this.transportName}]主动断开连接`), this.cleanupWs();
	}
}, Rn = 50, Z = { current: null }, Q = { current: 0 }, zn = { current: null }, Bn = { current: !1 }, Vn = { current: 0 }, Hn = { current: /* @__PURE__ */ new Map() }, Un = { current: /* @__PURE__ */ new Map() }, Wn = [], Gn = { current: /* @__PURE__ */ new Map() };
function $() {
	return qn && qn.getState()?.user?.user?.agent || "main";
}
function Kn() {
	let e = c(), r = o(null), i = t((e) => (Hn.current.has(e) || Hn.current.set(e, {
		content: "",
		reasonContent: "",
		timer: null,
		lastFlushTime: 0
	}), Hn.current.get(e)), []), a = t((t, n = !1) => {
		let r = Hn.current.get(t);
		if (r) {
			if (r.content || r.reasonContent) {
				let n = Un.current.get(t);
				r.content &&= (e(n ? Fe({
					agent: t,
					id: n,
					content: r.content
				}) : Re({
					agent: t,
					content: r.content
				})), ""), r.reasonContent &&= (e(n ? Ie({
					agent: t,
					id: n,
					content: r.reasonContent
				}) : ze({
					agent: t,
					content: r.reasonContent
				})), ""), r.lastFlushTime = Date.now();
			}
			n && r.timer && (clearTimeout(r.timer), r.timer = null);
		}
	}, [e]), s = t((e) => {
		let t = i(e);
		t.timer ||= setTimeout(() => {
			t.timer = null, a(e);
		}, Rn);
	}, [i, a]), l = t((e, t) => {
		let n = Gn.current.get(e) || [];
		return n.push(t), Gn.current.set(e, n), () => {
			let n = Gn.current.get(e) || [], r = n.indexOf(t);
			r >= 0 && n.splice(r, 1);
		};
	}, []), u = t((e) => (Wn.push(e), () => {
		let t = Wn.indexOf(e);
		t >= 0 && Wn.splice(t, 1);
	}), []), d = t((e) => {
		r.current = e, Bt(e);
	}, []), f = t(async (t) => {
		try {
			let n = await Rt().get(`/messages/${t}`, { params: {
				limit: 50,
				offset: 0
			} }), r = n.data || n, i = {};
			for (let e of r.messages) {
				let t = e.agent || e.fromAgent || $();
				i[t] || (i[t] = []), i[t].push(e);
			}
			for (let [t, n] of Object.entries(i)) e(ke({
				agent: t,
				messages: n
			})), e(je({
				agent: t,
				hasMore: r.pagination.hasMore
			}));
			if (e(je({
				agent: "__global__",
				hasMore: r.pagination.hasMore
			})), r.agents) {
				let t = r.agents.map((e) => ({
					name: e.agent?.name || "",
					description: e.agent?.description || e.agent?.describe || "",
					tokens: e.tokens
				}));
				e(Ce(t));
				let n = {};
				for (let e of r.agents) {
					let t = e.agent?.name || "";
					t && (n[t] = e.tokens || 0);
				}
				if (e(Te(n)), t.length > 0) {
					let n = qn.getState().chat.currentAgent;
					t.find((e) => e.name === n) || e(Se(t[0].name));
				}
			}
		} catch (e) {
			console.error("[agent-chat] 加载消息历史失败:", e);
		}
	}, [e]), p = t(async (t) => {
		let n = Q.current, r = Ht().websocket, i = Ft(), a = r.path || "/ws";
		i && (a += `?token=${i}`);
		let o = new Ln("fromWeb", r.host || "localhost", r.port || 3e3, a, r.reconnectDelay || 3e3);
		o.showLog = !1, o.timeout = -1, o.onConnectedEvent = () => {
			n === Q.current && e(_e(null));
		}, o.onDisconnectedEvent = () => {
			n === Q.current && (e(ge(!1)), e(ve(!1)));
		}, o.onReconnectedEvent = () => {
			n === Q.current && (e(ve(!1)), m(o, i, t));
		}, h(o, n), Z.current = o, await o.start();
	}, [e]), m = t(async (t, n, i, a) => {
		let o = Q.current;
		try {
			let s = i || "", c = await t.request("messageChannel/handleAuth", [n, s]);
			if (o !== Q.current) return;
			if (c?.success && c?.sessionId) {
				if (e(Se(qn.getState()?.user?.user?.agent || $())), e(ve(!0)), e(xe(c.sessionId)), e(_e(null)), !a) {
					await f(c.sessionId), await t.request("messageChannel/startChannel", []), Bn.current = !0;
					for (let e of Wn) try {
						e("init");
					} catch {}
				}
				e(ge(!0)), e(be(!1));
			} else {
				let t = c?.code || "AUTH_FAILED";
				e(ye(t)), e(_e(c?.message || "认证失败")), e(be(!1)), [
					"TOKEN_EXPIRED",
					"TOKEN_INVALID",
					"TOKEN_MISSING",
					"AUTH_FAILED",
					"USER_NOT_FOUND"
				].includes(t) && r.current?.(401, c?.message || "认证失败");
			}
		} catch (r) {
			if (o !== Q.current) return;
			if ((r?.message || "").includes("还未开始")) {
				await new Promise((e) => setTimeout(e, 200)), await m(t, n, i, a);
				return;
			}
			console.error("[agent-chat] 认证失败:", r), e(ye("AUTH_FAILED")), e(_e("认证失败")), e(be(!1));
		}
	}, [e, f]), h = t((t, n) => {
		t.registerHandleMethod("onWeb/assistantMessage", (t) => {
			if (n !== Q.current) return;
			let { message: r, agentName: a } = t, o = a || $();
			if (!Un.current.has(o)) {
				let t = K();
				Un.current.set(o, t), e(Pe({
					agent: o,
					id: t
				}));
			}
			e(we({
				name: o,
				description: ""
			}));
			let c = i(o);
			c.content += r || "", s(o);
		}), t.registerHandleMethod("onWeb/thinkingMessage", (t) => {
			if (n !== Q.current) return;
			let { message: r, agentName: a } = t, o = a || $();
			if (!Un.current.has(o)) {
				let t = K();
				Un.current.set(o, t), e(Pe({
					agent: o,
					id: t
				}));
			}
			let c = i(o);
			c.reasonContent += r || "", s(o);
		}), t.registerHandleMethod("onWeb/thinkingDone", (e) => {
			n === Q.current && a(e.agentName || $(), !0);
		}), t.registerHandleMethod("onWeb/done", (t) => {
			if (n === Q.current) {
				for (let e of Hn.current.keys()) a(e, !0);
				for (let [t, n] of Un.current.entries()) e(Le({
					agent: t,
					id: n
				}));
				Un.current.clear(), e(Be({}));
			}
		}), t.registerHandleMethod("onWeb/agentDone", (t) => {
			if (n !== Q.current) return;
			let r = t.agentName || $();
			a(r, !0);
			let i = Un.current.get(r);
			i && (e(Le({
				agent: r,
				id: i
			})), Un.current.delete(r)), e(Be({ agent: r })), e(we({
				name: r,
				description: ""
			}));
		}), t.registerHandleMethod("onWeb/error", (t) => {
			if (n !== Q.current) return;
			let r = t.agentName || $();
			e(be(!1)), Un.current.has(r) && Un.current.delete(r), e(De({
				agent: r,
				message: {
					id: K(),
					role: U.ERROR,
					content: t.content || t.message || "发生错误",
					timestamp: Date.now()
				}
			}));
		}), t.registerHandleMethod("onWeb/askAgentMessage", (t) => {
			if (n !== Q.current) return;
			let { content: r, fromAgent: i, toAgent: a } = t.message || {}, o = a || $();
			e(De({
				agent: o,
				message: {
					id: K(),
					role: U.ASK_AGENT,
					content: r || "",
					timestamp: Date.now(),
					agent: a,
					fromAgent: i
				}
			})), e(we({
				name: o,
				description: ""
			}));
		}), t.registerHandleMethod("onWeb/askUserMessage", (t) => {
			if (n !== Q.current) return;
			let r = t.agent || $(), i = (t.askMessage || "") + (t.items ? "\n\n" + t.items.join("\n\n") : "");
			e(De({
				agent: r,
				message: {
					id: K(),
					role: U.ASK_USER,
					content: i,
					timestamp: Date.now(),
					agent: r
				}
			}));
		}), t.registerHandleMethod("onWeb/userAnswer", (t) => {
			n === Q.current && e(De({
				agent: t.agentName || $(),
				message: {
					id: K(),
					role: U.USER_ANSWER,
					content: t.userAnswer || "",
					timestamp: Date.now()
				}
			}));
		}), t.registerHandleMethod("onWeb/toolCallBefore", (t) => {
			if (n !== Q.current) return;
			let r = t.agentName || $();
			e(Ve({
				agent: r,
				toolName: t.toolName || "",
				args: typeof t.args == "string" ? t.args : JSON.stringify(t.args || "")
			})), e(we({
				name: r,
				description: ""
			}));
		}), t.registerHandleMethod("onWeb/toolCallSuccess", (t) => {
			n === Q.current && e(He({
				agent: t.agentName || $(),
				toolName: t.toolName || "",
				result: t.result
			}));
		}), t.registerHandleMethod("onWeb/toolCallFailed", (t) => {
			n === Q.current && e(Ue({
				agent: t.agentName || $(),
				toolName: t.toolName || "",
				error: t.error
			}));
		}), t.registerHandleMethod("onWeb/updateAgentTokens", (t) => {
			n === Q.current && e(We({
				agent: t.agentName || $(),
				tokens: t.tokens || 0
			}));
		}), t.registerHandleMethod("onWeb/specialEvent", (e) => {
			if (n !== Q.current) return;
			let t = e.name || e.event;
			if (t) {
				let n = Gn.current.get(t) || [];
				for (let t of n) try {
					t(e.data || e);
				} catch (e) {
					console.error("[agent-chat] 特殊事件回调出错:", e);
				}
			}
		});
	}, [
		e,
		i,
		s,
		a
	]), g = t(async (t, n) => {
		if (Z.current && Z.current.isConnected()) return;
		if (zn.current && Z.current) return zn.current;
		Q.current++;
		let r = Q.current, i = (async () => {
			try {
				if (e(_e(null)), e(be(!0)), Z.current) {
					try {
						Z.current.dispose();
					} catch {}
					Z.current = null;
				}
				if (r !== Q.current || (await p(t), r !== Q.current)) return;
				let i = Z.current;
				if (i && !await i.waitForConnect?.(5e3) && r === Q.current) {
					e(_e("连接超时")), e(be(!1));
					return;
				}
				if (r !== Q.current) return;
				e(ge(!0));
				let a = Ft();
				a && Z.current ? await m(Z.current, a, t, n?.skipHistory) : (e(_e("未找到认证 Token")), e(be(!1))), Vn.current++;
			} catch (t) {
				if (r !== Q.current) return;
				console.error("[agent-chat] 连接失败:", t), e(_e(t?.message || "连接失败")), e(be(!1));
			} finally {
				r === Q.current && (zn.current = null);
			}
		})();
		return zn.current = i, i;
	}, [
		e,
		p,
		m
	]), _ = t(() => {
		Q.current++;
		for (let e of Hn.current.values()) e.timer && clearTimeout(e.timer);
		if (Hn.current.clear(), Un.current.clear(), Z.current) {
			try {
				Z.current.dispose();
			} catch {}
			Z.current = null;
		}
		zn.current = null, Bn.current = !1, Vn.current = 0, e(ge(!1)), e(ve(!1));
	}, [e]), v = t(async (t, n, r, i) => {
		let a = Z.current;
		if (!a) {
			console.warn("[agent-chat] 未连接，无法发送消息");
			return;
		}
		if (!t.trim()) return;
		let o = r?.name || $();
		e(Se(o)), e(Oe({
			content: t,
			documents: n,
			agent: o
		})), e(be(!0));
		try {
			await a.request("messageChannel/fromWebUserMessage", [
				t.trim(),
				r || {
					name: $(),
					type: "agent"
				},
				n || [],
				i || []
			]);
		} catch (t) {
			console.error("[agent-chat] 发送消息失败:", t), e(be(!1)), e(De({
				agent: o,
				message: {
					id: K(),
					role: U.ERROR,
					content: "发送消息失败: " + t.message,
					timestamp: Date.now()
				}
			}));
		}
	}, [e]), y = t(async () => {
		let t = Z.current;
		if (t) try {
			Bn.current ||= (await t.request("messageChannel/startChannel", []), !0);
			let n = await t.request("messageChannel/startNewSession", []);
			e(Ne()), e(xe(n?.sessionId || null));
			for (let e of Wn) try {
				e("new");
			} catch {}
		} catch (e) {
			console.error("[agent-chat] 新建会话失败:", e);
		}
	}, [e]), b = t(async (t) => {
		let n = Z.current;
		if (!n) {
			console.error("[agent-chat] changeSession: transport 不存在");
			return;
		}
		try {
			console.log("[agent-chat] changeSession 开始, sessionId:", t), Bn.current ||= (console.log("[agent-chat] 启动消息通道 startChannel"), await n.request("messageChannel/startChannel", []), !0), console.log("[agent-chat] switchToHistory");
			let r = (await n.request("messageChannel/switchToHistory", [t]))?.sessionId || t;
			console.log("[agent-chat] switchToHistory 完成, newSessionId:", r), e(Ne()), e(xe(r)), console.log("[agent-chat] 开始加载历史消息"), await f(r), console.log("[agent-chat] 历史消息加载完成");
			for (let e of Wn) try {
				e("switch");
			} catch {}
		} catch (e) {
			console.error("[agent-chat] 切换会话失败:", e);
		}
	}, [e, f]), x = t(async () => {
		let t = Z.current;
		if (t) try {
			await t.request("onWeb/terminateSession", []), e(be(!1));
		} catch (e) {
			console.error("[agent-chat] 终止会话失败:", e);
		}
	}, [e]), S = t(async (t) => {
		let n = qn.getState(), r = n.chat.sessionId;
		if (!r) return;
		let i;
		if (t) {
			let e = n.chat.messages[t] || [];
			if (e.length === 0) return;
			i = e[0].timestamp;
		} else {
			for (let e of Object.keys(n.chat.messages)) {
				let t = n.chat.messages[e];
				if (t && t.length > 0) {
					let e = t[0].timestamp;
					(i === void 0 || e < i) && (i = e);
				}
			}
			if (i === void 0) return;
		}
		e(Me(!0));
		try {
			let n = await Rt().get(`/messages/${r}`, { params: {
				limit: 50,
				beforeTimestamp: i
			} }), a = n.data || n, o = t || "__global__";
			if (a.messages.length > 0) {
				let n = {};
				for (let e of a.messages) {
					let r = e.agent || e.fromAgent || t || $();
					n[r] || (n[r] = []), n[r].push(e);
				}
				for (let [t, r] of Object.entries(n)) e(Ae({
					agent: t,
					messages: r,
					hasMore: a.pagination.hasMore
				}));
				e(je({
					agent: o,
					hasMore: a.pagination.hasMore
				}));
			} else e(je({
				agent: o,
				hasMore: !1
			}));
		} catch (e) {
			console.error("[agent-chat] 加载更多消息失败:", e);
		} finally {
			e(Me(!1));
		}
	}, [e]), C = t(async (t) => {
		if (t) {
			e(Ke(!0));
			try {
				let n = await Rt().get(`/messages/${t}/overview`);
				e(Ge(n?.data || n));
			} catch (t) {
				console.error("[agent-chat] 获取会话概览失败:", t), e(Ge(null));
			} finally {
				e(Ke(!1));
			}
		}
	}, [e]);
	return n(() => (Vn.current++, () => {
		Vn.current = Math.max(0, Vn.current - 1);
	}), []), {
		connect: g,
		disconnect: _,
		sendMessage: v,
		newSession: y,
		changeSession: b,
		terminateSession: x,
		loadMoreMessages: S,
		fetchSessionOverview: C,
		onSpecialEvent: l,
		onSessionSwitch: u,
		setOnTokenExpired: d,
		transportRef: Z
	};
}
var qn;
function Jn(e) {
	qn = e;
}
//#endregion
//#region src/layout/TimelineChatLayout.tsx
var Yn = e(({ theme: e = "dark", showAgentInfo: i = !1, isEnableFile: a = !0, input_isEnableKnowledge: s = !0, placeholder: u, defaultQuerys: f = [], showTokensBar: p = !1, isUserDefaultAvatar: m = !0, inputAreaHorizontalAlignment: h = "Full", inputAreaMargin: g = "10px", inputWidth: _, inputAgentsData: v = [], groups: y = [], autoConnect: b = !0 }, x) => {
	c();
	let S = o(null), C = Kn(), w = l(Ye), T = l(Xe), E = l(Ze), D = l(Qe), O = l($e), k = l(tt), A = l(nt), j = l(rt), M = l(it), N = l(at), P = l(Xt), F = l(en), I = l($t);
	n(() => {
		b && P && F && !T && C.connect();
	}, [
		b,
		P,
		F,
		T,
		C
	]), n(() => C.onSessionSwitch((e) => {
		setTimeout(() => S.current?.scrollToBottom?.(), 100);
	}), [C]), n(() => {
		D && d.error(D);
	}, [D]), n(() => {
		P || C.disconnect();
	}, [P, C]);
	let L = t((e, t, n, r) => {
		if (!T) {
			d.warning("未连接到服务器");
			return;
		}
		let i;
		if (n) i = {
			name: n.name,
			type: n.type === "group" ? "group" : "agent"
		};
		else {
			let e = I?.agent || "main";
			i = {
				name: e,
				type: y.some((t) => t.name === e) ? "group" : "agent"
			};
		}
		C.sendMessage(e, t, i, r), setTimeout(() => S.current?.scrollToBottom?.(), 100);
	}, [
		C,
		T,
		I,
		y
	]), R = t(async () => {
		if (!(!T || !E)) try {
			await C.terminateSession(), d.info("已终止当前对话");
		} catch (e) {
			d.error(e instanceof Error ? e.message : "终止失败");
		}
	}, [
		T,
		E,
		C
	]), z = t(() => {
		C.loadMoreMessages(k.length > 1 ? void 0 : O);
	}, [
		C,
		k.length,
		O
	]);
	return r(x, () => ({
		newSession: C.newSession,
		changeSession: C.changeSession,
		connect: C.connect,
		disconnect: C.disconnect
	})), /* @__PURE__ */ V("div", {
		className: `chat-layout ${e === "light" ? "chat-layout--light" : ""}`,
		style: {
			display: "flex",
			flexDirection: "column",
			height: "100%"
		},
		children: [/* @__PURE__ */ B(Sn, {
			ref: S,
			messages: w,
			currentAgent: O,
			isGroupChat: k.length > 1,
			showToolCallLog: j,
			isLoading: E,
			theme: e,
			entryAgent: I?.agent,
			groups: y,
			defaultQuerys: f,
			isUserDefaultAvatar: m,
			hasMore: k.length > 1 ? M.__global__ !== !1 : M[O] !== !1,
			isLoadingMore: N,
			onLoadMore: z,
			onSelectQuery: (e) => L(e, [])
		}), /* @__PURE__ */ B(Dn, {
			isConnected: T,
			isLoading: E,
			connectionError: D,
			theme: e,
			showAgentInfo: i,
			isEnableFile: a,
			input_isEnableKnowledge: s,
			placeholder: u,
			showTokensBar: p,
			currentAgentName: O,
			agentTokens: A,
			horizontalAlignment: h,
			margin: g,
			inputWidth: _,
			inputAgentsData: v,
			boundAgent: I?.agent || null,
			boundAgentType: I?.agentType || "agent",
			onSend: L,
			onTerminate: R
		})]
	});
});
Yn.displayName = "TimelineChatLayout";
//#endregion
//#region src/components/messages/sample/MessageList.tsx
var Xn = e(({ messages: e, currentAgent: a, isGroupChat: s, showToolCallLog: c, isLoading: l, entryAgent: u, groups: d, theme: f = "dark", defaultQuerys: p = [], isUserDefaultAvatar: m = !0, userDisplayName: g = "", activityMaxEntries: v = 5, onSelectQuery: C, onLoadMore: w, hasMore: E = !1, isLoadingMore: O = !1, children: k }, M) => {
	let N = o(null), P = o(null), F = o(O), L = sn(e, a, s, {
		entryAgent: u,
		groups: d
	});
	r(M, () => ({ scrollToBottom: () => {
		N.current && (N.current.scrollTop = N.current.scrollHeight);
	} })), i(() => {
		let e = F.current;
		F.current = O;
		let t = N.current;
		if (e && !O && P.current && t) {
			let { scrollHeight: e, scrollTop: n } = P.current;
			t.scrollTop = n + (t.scrollHeight - e);
		}
	}, [O]), n(() => {
		if (!O) {
			if (P.current) {
				P.current = null;
				return;
			}
			N.current && (N.current.scrollTop = N.current.scrollHeight);
		}
	}, [L, O]);
	let R = t(() => {
		let e = N.current;
		!e || !E || O || e.scrollTop <= 50 && w && (P.current = {
			scrollHeight: e.scrollHeight,
			scrollTop: e.scrollTop
		}, w());
	}, [
		E,
		O,
		w
	]), ee = f === "light" ? "sml-theme-light" : "", re = t((e) => typeof e == "string" ? e.split("/").pop() || e.split("\\").pop() || e : e.fileName || "", []), ie = t((e) => {
		let t = e.steps.find((e) => e.type === "content");
		return t ? t.msg.agent || "AI" : e.steps.find((e) => e.msg.agent && e.type !== "ask")?.msg.agent || "AI";
	}, []), H = t((e) => e.steps.length > 0 ? W(e.steps[e.steps.length - 1].msg.timestamp) : "", []), ae = t((e) => {
		for (let t = e.steps.length - 1; t >= 0; t--) if (e.steps[t].type === "content") return e.steps[t].msg.isStreaming === !0;
		return e.steps.length > 0;
	}, []), oe = t((e) => {
		let t = ce(e);
		return t ? t.role === U.ERROR : !1;
	}, []);
	function ce(e) {
		for (let t = e.steps.length - 1; t >= 0; t--) if (e.steps[t].type === "content") return e.steps[t].msg;
		return null;
	}
	function G(e) {
		return e.steps.length === 0 ? null : e.steps[e.steps.length - 1].msg;
	}
	let K = t((e) => {
		let t = [];
		for (let n of e.steps) if (n.type === "ask") t.push({
			text: `${n.msg.fromAgent} → 唤起 ${n.msg.toAgent || n.msg.agent}`,
			timestamp: n.msg.timestamp,
			icon: /* @__PURE__ */ B(_, { size: 11 }),
			iconClass: "sml-icon-blue"
		});
		else if (n.type === "reason") t.push({
			text: `智能体思考 · ${n.msg.agent}`,
			timestamp: n.msg.timestamp,
			icon: /* @__PURE__ */ B(b, { size: 11 }),
			iconClass: "sml-icon-emerald"
		});
		else if (n.type === "tool" && n.tool) {
			let e = `执行 ${n.tool.toolName}`;
			if (n.tool.toolName === "runAgent") try {
				let t = JSON.parse(n.tool.args);
				e = `智能体调度: ${t.agentName || t.agent || "Unknown"}`;
			} catch {}
			else if (n.tool.toolName === "loadSkill") try {
				let t = JSON.parse(n.tool.args);
				e = `加载技能: ${t.skillName || t.skill || "Unknown"}`;
			} catch {}
			let r = n.tool.toolName === "runAgent", i = n.tool.toolName === "loadSkill";
			t.push({
				text: e,
				timestamp: n.tool.timestamp || n.msg.timestamp,
				icon: B(r ? T : i ? y : z, { size: 11 }),
				iconClass: r ? "sml-icon-purple" : i ? "sml-icon-amber" : "sml-icon-yellow",
				status: n.tool.status
			});
		} else if (n.type === "content" && n.msg.content) {
			let e = n.msg.content.split("\n").filter((e) => e.trim() !== "");
			for (let r of e) t.push({
				text: r.length > 60 ? r.slice(0, 60) + "..." : r,
				timestamp: n.msg.timestamp,
				icon: /* @__PURE__ */ B(D, { size: 11 }),
				iconClass: "sml-icon-dim"
			});
		} else if (n.type === "step") {
			let e = n.msg.agent || "处理中...";
			n.msg.role === U.TOOL_RESULT ? e = "工具返回结果" : n.msg.role === U.COMMAND && (e = "执行命令"), t.push({
				text: e,
				timestamp: n.msg.timestamp,
				icon: /* @__PURE__ */ B(T, { size: 11 }),
				iconClass: "sml-icon-dim"
			});
		}
		return t.slice(-v);
	}, [v]);
	return L.length === 0 && !l ? /* @__PURE__ */ V("div", {
		className: `sml-container ${ee}`,
		ref: N,
		children: [/* @__PURE__ */ B("div", {
			className: "sml-sticky-header",
			children: k
		}), /* @__PURE__ */ B("div", {
			className: "sml-empty",
			children: p.length > 0 ? /* @__PURE__ */ V("div", {
				className: "sml-default-queries",
				children: [/* @__PURE__ */ B("div", {
					className: "sml-default-queries__title",
					children: "有什么可以帮您的？"
				}), /* @__PURE__ */ B("div", {
					className: "sml-default-queries__list",
					children: p.map((e, t) => /* @__PURE__ */ V("div", {
						className: "sml-default-query-card",
						onClick: () => C?.(e),
						children: [/* @__PURE__ */ B(j, {
							size: 16,
							className: "sml-default-query-icon"
						}), /* @__PURE__ */ B("span", { children: e })]
					}, t))
				})]
			}) : /* @__PURE__ */ B("div", {
				style: {
					color: "var(--ml-text-secondary, #8b949e)",
					fontSize: 14
				},
				children: "开始一段新的对话吧"
			})
		})]
	}) : /* @__PURE__ */ V("div", {
		className: `sml-container ${ee}`,
		ref: N,
		onScroll: R,
		children: [
			/* @__PURE__ */ B("div", {
				className: "sml-sticky-header",
				children: k
			}),
			/* @__PURE__ */ V("div", {
				className: "sml-turns",
				children: [L.map((e, t) => /* @__PURE__ */ V("div", {
					className: "sml-turn",
					children: [e.userMsg && /* @__PURE__ */ B("div", {
						className: "sml-user-block",
						children: /* @__PURE__ */ V("div", {
							className: "sml-body-row sml-body-row--user",
							children: [/* @__PURE__ */ V("div", {
								className: "sml-user-bubble",
								children: [
									e.userMsg.documents && e.userMsg.documents.length > 0 && /* @__PURE__ */ B("div", {
										className: "sml-user-docs",
										children: e.userMsg.documents.map((e, t) => /* @__PURE__ */ V("div", {
											className: "sml-doc-item",
											children: [/* @__PURE__ */ B(D, {
												size: 12,
												className: "text-blue-400"
											}), /* @__PURE__ */ B("span", {
												className: "sml-doc-name",
												children: re(e)
											})]
										}, t))
									}),
									/* @__PURE__ */ B("div", {
										className: "sml-user-text",
										children: e.userMsg.content
									}),
									/* @__PURE__ */ B("div", {
										className: "sml-user-time",
										children: W(e.userMsg.timestamp)
									})
								]
							}), /* @__PURE__ */ B("div", {
								className: "sml-user-avatar",
								children: m ? /* @__PURE__ */ B(I, { size: 14 }) : /* @__PURE__ */ B(ne, { children: g })
							})]
						})
					}), e.steps.length > 0 && /* @__PURE__ */ V("div", {
						className: "sml-ai-block",
						children: [/* @__PURE__ */ V("div", {
							className: "sml-header-row sml-header-row--ai",
							children: [/* @__PURE__ */ V("div", {
								className: "sml-header-left",
								children: [/* @__PURE__ */ B(un, {
									agentName: ie(e),
									size: "small"
								}), /* @__PURE__ */ B("span", {
									className: "sml-header-name",
									children: ie(e)
								})]
							}), /* @__PURE__ */ B("span", {
								className: "sml-header-time",
								children: H(e)
							})]
						}), /* @__PURE__ */ B("div", {
							className: "sml-body-row sml-body-row--ai",
							children: ae(e) ? /* @__PURE__ */ B("div", {
								className: "sml-activity-card",
								children: /* @__PURE__ */ V("details", {
									open: !0,
									className: "sml-activity-details",
									children: [/* @__PURE__ */ V("summary", {
										className: "sml-activity-summary",
										children: [/* @__PURE__ */ V("div", {
											className: "sml-activity-summary-left",
											children: [
												/* @__PURE__ */ B(A, {
													size: 12,
													className: "sml-activity-spinner"
												}),
												/* @__PURE__ */ B("span", {
													className: "sml-activity-label",
													children: "思考中..."
												}),
												/* @__PURE__ */ V("span", {
													className: "sml-activity-count",
													children: [
														"(",
														K(e).length,
														")"
													]
												})
											]
										}), /* @__PURE__ */ B(S, {
											size: 12,
											className: "sml-chevron"
										})]
									}), /* @__PURE__ */ V("div", {
										className: "sml-activity-body",
										children: [K(e).map((e, t) => /* @__PURE__ */ V("div", {
											className: "sml-activity-entry",
											children: [
												/* @__PURE__ */ B("span", {
													className: "sml-activity-time",
													children: se(e.timestamp)
												}),
												/* @__PURE__ */ B("span", {
													className: `sml-activity-icon ${e.iconClass}`,
													children: e.icon
												}),
												/* @__PURE__ */ B("span", {
													className: "sml-activity-text",
													children: e.text
												}),
												e.status === "pending" && /* @__PURE__ */ B(A, {
													size: 10,
													className: "text-blue-500 animate-spin"
												}),
												e.status === "success" && /* @__PURE__ */ B(x, {
													size: 10,
													className: "text-green-500"
												}),
												e.status === "failed" && /* @__PURE__ */ B(te, {
													size: 10,
													className: "text-red-500"
												})
											]
										}, `act-${t}`)), K(e).length === 0 && /* @__PURE__ */ V("div", {
											className: "sml-activity-loading",
											children: [
												/* @__PURE__ */ B("span", { className: "sml-dot sml-dot-1" }),
												/* @__PURE__ */ B("span", { className: "sml-dot sml-dot-2" }),
												/* @__PURE__ */ B("span", { className: "sml-dot sml-dot-3" })
											]
										})]
									})]
								})
							}) : /* @__PURE__ */ B("div", {
								className: "sml-final-block",
								children: oe(e) ? /* @__PURE__ */ V("div", {
									className: "sml-error-body",
									children: [/* @__PURE__ */ V("div", {
										className: "sml-error-inline",
										children: [/* @__PURE__ */ B(h, { size: 14 }), /* @__PURE__ */ B("span", { children: ce(e)?.content })]
									}), /* @__PURE__ */ B("span", {
										className: "sml-final-time",
										children: G(e) ? W(G(e).timestamp) : ""
									})]
								}) : ce(e) ? /* @__PURE__ */ V("div", {
									className: "sml-final-body",
									children: [/* @__PURE__ */ B("div", {
										className: "sml-final-text",
										dangerouslySetInnerHTML: { __html: pn(ce(e)?.content || "") }
									}), /* @__PURE__ */ B("span", {
										className: "sml-final-time",
										children: G(e) ? W(G(e).timestamp) : ""
									})]
								}) : null
							})
						})]
					})]
				}, t)), l && L.length === 0 && /* @__PURE__ */ V("div", {
					className: "sml-ai-block",
					children: [/* @__PURE__ */ B("div", {
						className: "sml-header-row sml-header-row--ai",
						children: /* @__PURE__ */ V("div", {
							className: "sml-header-left",
							children: [/* @__PURE__ */ B("div", {
								className: "sml-ai-avatar-icon",
								children: /* @__PURE__ */ B(A, {
									size: 14,
									className: "text-white animate-spin"
								})
							}), /* @__PURE__ */ B("span", {
								className: "sml-header-name",
								children: "AI"
							})]
						})
					}), /* @__PURE__ */ B("div", {
						className: "sml-body-row sml-body-row--ai",
						children: /* @__PURE__ */ V("div", {
							className: "sml-loading-dots",
							children: [
								/* @__PURE__ */ B("span", { className: "sml-dot sml-dot-1" }),
								/* @__PURE__ */ B("span", { className: "sml-dot sml-dot-2" }),
								/* @__PURE__ */ B("span", { className: "sml-dot sml-dot-3" })
							]
						})
					})]
				})]
			}),
			O && /* @__PURE__ */ B("div", {
				className: "sml-loading-more",
				children: /* @__PURE__ */ B("div", {
					style: {
						color: "var(--ml-text-secondary, #8b949e)",
						fontSize: 12,
						textAlign: "center"
					},
					children: "加载中..."
				})
			})
		]
	});
});
Xn.displayName = "SampleMessageList";
//#endregion
//#region src/layout/SampleChatLayout.tsx
var Zn = e(({ theme: e = "dark", showAgentInfo: i = !1, isEnableFile: a = !0, input_isEnableKnowledge: s = !0, placeholder: u, defaultQuerys: f = [], showTokensBar: p = !1, isUserDefaultAvatar: m = !0, activityMaxEntries: h = 5, inputAreaHorizontalAlignment: g = "Full", inputAreaMargin: _ = "10px", inputWidth: v, inputAgentsData: y = [], groups: b = [], autoConnect: x = !0 }, S) => {
	c();
	let C = o(null), w = Kn(), T = l(Ye), E = l(Xe), D = l(Ze), O = l(Qe), k = l($e), A = l(tt), j = l(nt), M = l(rt), N = l(it), P = l(at), F = l(Xt), I = l(en), L = l($t);
	n(() => {
		x && F && I && !E && w.connect();
	}, [
		x,
		F,
		I,
		E,
		w
	]), n(() => w.onSessionSwitch((e) => {
		setTimeout(() => C.current?.scrollToBottom?.(), 100);
	}), [w]), n(() => {
		O && d.error(O);
	}, [O]), n(() => {
		F || w.disconnect();
	}, [F, w]);
	let R = t((e, t, n, r) => {
		if (!E) {
			d.warning("未连接到服务器");
			return;
		}
		let i;
		if (n) i = {
			name: n.name,
			type: n.type === "group" ? "group" : "agent"
		};
		else {
			let e = L?.agent || "main";
			i = {
				name: e,
				type: b.some((t) => t.name === e) ? "group" : "agent"
			};
		}
		w.sendMessage(e, t, i, r), setTimeout(() => C.current?.scrollToBottom?.(), 100);
	}, [
		w,
		E,
		L,
		b
	]), z = t(async () => {
		if (!(!E || !D)) try {
			await w.terminateSession(), d.info("已终止当前对话");
		} catch (e) {
			d.error(e instanceof Error ? e.message : "终止失败");
		}
	}, [
		E,
		D,
		w
	]);
	return r(S, () => ({
		newSession: w.newSession,
		changeSession: w.changeSession,
		connect: w.connect,
		disconnect: w.disconnect
	})), /* @__PURE__ */ V("div", {
		className: `chat-layout ${e === "light" ? "chat-layout--light" : ""}`,
		style: {
			display: "flex",
			flexDirection: "column",
			height: "100%"
		},
		children: [/* @__PURE__ */ B(Xn, {
			ref: C,
			messages: T,
			currentAgent: k,
			isGroupChat: A.length > 1,
			showToolCallLog: M,
			isLoading: D,
			theme: e,
			entryAgent: L?.agent,
			groups: b,
			defaultQuerys: f,
			isUserDefaultAvatar: m,
			activityMaxEntries: h,
			hasMore: A.length > 1 ? N.__global__ !== !1 : N[k] !== !1,
			isLoadingMore: P,
			onLoadMore: () => w.loadMoreMessages(A.length > 1 ? void 0 : k),
			onSelectQuery: (e) => R(e, [])
		}), /* @__PURE__ */ B(Dn, {
			isConnected: E,
			isLoading: D,
			connectionError: O,
			theme: e,
			showAgentInfo: i,
			isEnableFile: a,
			input_isEnableKnowledge: s,
			placeholder: u,
			showTokensBar: p,
			currentAgentName: k,
			agentTokens: j,
			horizontalAlignment: g,
			margin: _,
			inputWidth: v,
			inputAgentsData: y,
			boundAgent: L?.agent || null,
			boundAgentType: L?.agentType || "agent",
			onSend: R,
			onTerminate: z
		})]
	});
});
Zn.displayName = "SampleChatLayout";
//#endregion
//#region src/components/messages/rap_timeline/MessageList.tsx
var Qn = ({ status: e }) => e === "success" ? /* @__PURE__ */ B(x, {
	size: 12,
	className: "text-green-500"
}) : e === "failed" ? /* @__PURE__ */ B(te, {
	size: 12,
	className: "text-red-500"
}) : /* @__PURE__ */ B(A, {
	size: 12,
	className: "text-blue-500 rml-spin"
});
function $n(e) {
	let t = e.steps.find((e) => e.type === "content");
	return t ? t.msg.agent || "AI" : e.steps.find((e) => e.msg.agent && e.type !== "ask")?.msg.agent || "AI";
}
function er(e) {
	return e.type === "ask" ? `${e.msg.fromAgent} → ${e.msg.toAgent || e.msg.agent}` : e.type === "reason" ? `${e.msg.agent} 正在思考分析...` : e.type === "tool" && e.tool ? `执行 ${e.tool.toolName}` : e.msg.role === U.TOOL_RESULT ? "工具返回结果" : e.msg.role === U.COMMAND ? "执行命令" : e.msg.role === U.OPTION ? "选项" : e.msg.agent || "处理中...";
}
function tr(e) {
	return e.role === U.ERROR;
}
function nr(e, t) {
	try {
		return JSON.parse(e.args)[t] || "";
	} catch {
		return "";
	}
}
function rr(e) {
	return typeof e == "string" ? e.split("/").pop() || e.split("\\").pop() || e : e.fileName || "";
}
function ir(e) {
	return e.steps.length > 0 ? W(e.steps[e.steps.length - 1].msg.timestamp) : "";
}
function ar(e, t, n, r) {
	if (t === n.length - 1 && r) return !0;
	for (let t = e.steps.length - 1; t >= 0; t--) if (e.steps[t].type === "content") return e.steps[t].msg.isStreaming === !0;
	return !1;
}
function or(e, t, n, r) {
	if (ar(e, t, n, r)) {
		for (let t = e.steps.length - 1; t >= 0; t--) {
			let n = e.steps[t];
			if (n.type === "content" && n.msg.isStreaming && n.msg.content) {
				let e = n.msg.content.trim();
				return e.length > 10 ? e.slice(0, 10) + "..." : e;
			}
			if (n.type === "tool" && n.tool && n.tool.status === "pending") return `执行操作 : ${n.tool.toolName}`;
			if (n.type === "reason") {
				if (n.msg.reasonContent) {
					let e = n.msg.reasonContent.trim();
					return `思考中 : ${e.length > 10 ? e.slice(0, 10) + "..." : e}`;
				}
				return "思考中...";
			}
		}
		return "思考中...";
	}
	if (ur(e)) {
		let t = cr(e);
		if (t?.content) {
			let e = t.content.trim();
			return e.length > 10 ? e.slice(0, 10) + "..." : e;
		}
		return "发生错误";
	}
	let i = cr(e);
	if (i?.content) {
		let e = i.content.trim();
		return e.length > 10 ? e.slice(0, 10) + "..." : e;
	}
	return "处理中...";
}
function sr(e, t, n, r, i) {
	return e.msg.isStreaming ? !0 : t === r.length - 1 && i ? !r[t].steps.slice(n + 1).some((e) => e.type === "content") : !1;
}
function cr(e) {
	for (let t = e.steps.length - 1; t >= 0; t--) if (e.steps[t].type === "content") return e.steps[t].msg;
	return null;
}
function lr(e) {
	return e.steps.length === 0 ? null : e.steps[e.steps.length - 1].msg;
}
function ur(e) {
	let t = cr(e);
	return t ? t.role === U.ERROR : !1;
}
var dr = e(({ messages: e, currentAgent: s, isGroupChat: c, showToolCallLog: l, isLoading: u, entryAgent: d, groups: f, theme: p = "dark", defaultQuerys: m = [], isUserDefaultAvatar: g = !0, userDisplayName: v = "", onSelectQuery: E, onLoadMore: O, hasMore: k = !1, isLoadingMore: M = !1, children: N }, P) => {
	let F = o(null), L = o(null), R = o(M), ee = sn(e, s, c, {
		entryAgent: d,
		groups: f
	});
	r(P, () => ({ scrollToBottom: () => {
		F.current && (F.current.scrollTop = F.current.scrollHeight);
	} })), i(() => {
		let e = R.current;
		R.current = M;
		let t = F.current;
		if (e && !M && L.current && t) {
			let { scrollHeight: e, scrollTop: n } = L.current;
			t.scrollTop = n + (t.scrollHeight - e);
		}
	}, [M]), n(() => {
		if (!M) {
			if (L.current) {
				L.current = null;
				return;
			}
			F.current && (F.current.scrollTop = F.current.scrollHeight);
		}
	}, [ee, M]);
	let te = t(() => {
		let e = F.current;
		!e || !k || M || e.scrollTop <= 50 && O && (L.current = {
			scrollHeight: e.scrollHeight,
			scrollTop: e.scrollTop
		}, O());
	}, [
		k,
		M,
		O
	]), re = p === "light" ? "rml-theme-light" : "", ie = a(() => v ? v.slice(0, 2) : "", [v]);
	return /* @__PURE__ */ V("div", {
		className: `rml-container ${re}`,
		ref: F,
		onScroll: te,
		children: [
			/* @__PURE__ */ B("div", {
				className: "rml-sticky-header",
				children: N
			}),
			ee.length === 0 && !u && /* @__PURE__ */ B("div", {
				className: "rml-empty",
				children: m.length > 0 ? /* @__PURE__ */ V("div", {
					className: "rml-default-queries",
					children: [/* @__PURE__ */ B("div", {
						className: "rml-default-queries__title",
						children: "有什么可以帮您的？"
					}), /* @__PURE__ */ B("div", {
						className: "rml-default-queries__list",
						children: m.map((e, t) => /* @__PURE__ */ V("div", {
							className: "rml-default-query-card",
							onClick: () => E?.(e),
							children: [/* @__PURE__ */ B(j, {
								size: 16,
								className: "rml-default-query-icon"
							}), /* @__PURE__ */ B("span", { children: e })]
						}, t))
					})]
				}) : /* @__PURE__ */ B("div", {
					className: "rml-empty-placeholder",
					children: "开始一段新的对话吧"
				})
			}),
			/* @__PURE__ */ V("div", {
				className: "rml-turns",
				children: [ee.map((e, t) => /* @__PURE__ */ V("div", {
					className: "rml-turn",
					children: [e.userMsg && /* @__PURE__ */ B("div", {
						className: "rml-user-block",
						children: /* @__PURE__ */ V("div", {
							className: "rml-body-row rml-body-row--user",
							children: [/* @__PURE__ */ V("div", {
								className: "rml-user-bubble",
								children: [
									e.userMsg.documents && e.userMsg.documents.length > 0 && /* @__PURE__ */ B("div", {
										className: "rml-user-docs",
										children: e.userMsg.documents.map((e, t) => /* @__PURE__ */ V("div", {
											className: "rml-doc-item",
											children: [/* @__PURE__ */ B(D, {
												size: 12,
												className: "text-blue-400"
											}), /* @__PURE__ */ B("span", {
												className: "rml-doc-name",
												children: rr(e)
											})]
										}, t))
									}),
									/* @__PURE__ */ B("div", {
										className: "rml-user-text",
										children: e.userMsg.content
									}),
									/* @__PURE__ */ B("div", {
										className: "rml-user-time",
										children: W(e.userMsg.timestamp)
									})
								]
							}), /* @__PURE__ */ B("div", {
								className: "rml-user-avatar",
								children: g ? /* @__PURE__ */ B(I, { size: 14 }) : /* @__PURE__ */ B(ne, { children: ie })
							})]
						})
					}), e.steps.length > 0 && /* @__PURE__ */ V("div", {
						className: "rml-ai-block",
						children: [/* @__PURE__ */ V("div", {
							className: "rml-header-row rml-header-row--ai",
							children: [/* @__PURE__ */ V("div", {
								className: "rml-header-left",
								children: [/* @__PURE__ */ B(un, {
									agentName: $n(e),
									size: "small"
								}), /* @__PURE__ */ B("span", {
									className: "rml-header-name",
									children: $n(e)
								})]
							}), /* @__PURE__ */ B("span", {
								className: "rml-header-time",
								children: ir(e)
							})]
						}), /* @__PURE__ */ B("div", {
							className: "rml-body-row rml-body-row--ai",
							children: ar(e, t, ee, u) ? /* @__PURE__ */ V("details", {
								className: "rml-collapse-card",
								children: [/* @__PURE__ */ V("summary", {
									className: "rml-collapse-summary",
									children: [/* @__PURE__ */ V("div", {
										className: "rml-summary-left",
										children: [
											/* @__PURE__ */ B(A, {
												size: 12,
												className: "rml-summary-spinner"
											}),
											/* @__PURE__ */ B("span", {
												className: "rml-summary-text rml-summary-text--animating",
												children: or(e, t, ee, u)
											}),
											/* @__PURE__ */ B("span", { className: "rml-typing-cursor" })
										]
									}), /* @__PURE__ */ V("div", {
										className: "rml-summary-right",
										children: [/* @__PURE__ */ B("span", { className: "rml-pulse-dot" }), /* @__PURE__ */ B(S, {
											size: 12,
											className: "rml-chevron"
										})]
									})]
								}), /* @__PURE__ */ B("div", {
									className: "rml-collapse-body",
									children: /* @__PURE__ */ V("div", {
										className: "rml-timeline",
										children: [e.steps.map((e, n) => /* @__PURE__ */ V("div", {
											className: "rml-step",
											children: [/* @__PURE__ */ B("div", { className: e.type === "content" ? "rml-final-dot" : "rml-step-dot" }), /* @__PURE__ */ V("div", {
												className: "rml-step-inner",
												children: [
													e.type === "ask" && /* @__PURE__ */ V("div", {
														className: "rml-step-simple",
														children: [
															/* @__PURE__ */ B(T, {
																size: 12,
																className: "rml-icon-dim"
															}),
															/* @__PURE__ */ B("span", {
																className: "rml-step-mono",
																children: e.msg.fromAgent
															}),
															/* @__PURE__ */ B(_, {
																size: 10,
																className: "rml-icon-dim mx-0_5"
															}),
															/* @__PURE__ */ V("span", {
																className: "rml-step-mono-light",
																children: ["唤起 ", e.msg.toAgent || e.msg.agent]
															})
														]
													}),
													e.type === "reason" && /* @__PURE__ */ V("details", {
														className: "rml-tool-card rml-tool-think",
														children: [/* @__PURE__ */ V("summary", {
															className: "rml-tool-summary-card",
															children: [/* @__PURE__ */ V("div", {
																className: "rml-tool-card-inner",
																children: [/* @__PURE__ */ B("div", {
																	className: "rml-tool-icon-wrap rml-tool-icon-emerald",
																	children: /* @__PURE__ */ B(b, {
																		size: 12,
																		className: "text-emerald-400"
																	})
																}), /* @__PURE__ */ V("span", {
																	className: "rml-tool-label",
																	children: [
																		"智能体思考",
																		" ",
																		/* @__PURE__ */ V("span", {
																			className: "text-emerald-400_60",
																			children: ["· ", e.msg.agent]
																		})
																	]
																})]
															}), /* @__PURE__ */ V("div", {
																className: "rml-tool-card-right",
																children: [sr(e, t, n, ee, u) ? /* @__PURE__ */ B(A, {
																	size: 12,
																	className: "text-emerald-400 rml-spin"
																}) : /* @__PURE__ */ B(x, {
																	size: 12,
																	className: "text-green-500"
																}), /* @__PURE__ */ B(C, {
																	size: 12,
																	className: "rml-chevron-right"
																})]
															})]
														}), /* @__PURE__ */ B("div", {
															className: "rml-tool-detail-body",
															children: e.msg.reasonContent
														})]
													}),
													e.type === "tool" && e.tool && /* @__PURE__ */ B(ne, { children: e.tool.toolName === "runAgent" ? /* @__PURE__ */ V("div", {
														className: "rml-tool-card rml-tool-dispatch",
														children: [/* @__PURE__ */ V("div", {
															className: "rml-tool-card-inner",
															children: [/* @__PURE__ */ B("div", {
																className: "rml-tool-icon-wrap rml-tool-icon-purple",
																children: /* @__PURE__ */ B(T, {
																	size: 12,
																	className: "text-purple-400"
																})
															}), /* @__PURE__ */ V("span", {
																className: "rml-tool-label",
																children: [
																	"智能体调度:",
																	" ",
																	/* @__PURE__ */ B("span", {
																		className: "rml-tool-highlight-purple",
																		children: nr(e.tool, "agentName") || nr(e.tool, "agent") || "Unknown"
																	})
																]
															})]
														}), /* @__PURE__ */ B(Qn, { status: e.tool.status })]
													}) : e.tool.toolName === "loadSkill" ? /* @__PURE__ */ V("div", {
														className: "rml-tool-card rml-tool-skill",
														children: [/* @__PURE__ */ V("div", {
															className: "rml-tool-card-inner",
															children: [/* @__PURE__ */ B("div", {
																className: "rml-tool-icon-wrap rml-tool-icon-amber",
																children: /* @__PURE__ */ B(y, {
																	size: 12,
																	className: "text-amber-400"
																})
															}), /* @__PURE__ */ V("span", {
																className: "rml-tool-label",
																children: [
																	"加载技能:",
																	" ",
																	/* @__PURE__ */ B("span", {
																		className: "rml-tool-highlight-amber",
																		children: nr(e.tool, "skillName") || nr(e.tool, "skill") || "Unknown"
																	})
																]
															})]
														}), /* @__PURE__ */ B(Qn, { status: e.tool.status })]
													}) : /* @__PURE__ */ V("details", {
														className: "rml-tool-card rml-tool-generic",
														children: [/* @__PURE__ */ V("summary", {
															className: "rml-tool-summary-card",
															children: [/* @__PURE__ */ V("div", {
																className: "rml-tool-card-inner",
																children: [/* @__PURE__ */ B("div", {
																	className: "rml-tool-icon-wrap rml-tool-icon-yellow",
																	children: /* @__PURE__ */ B(z, {
																		size: 12,
																		className: "text-yellow-400"
																	})
																}), /* @__PURE__ */ V("span", {
																	className: "rml-tool-label",
																	children: [
																		"工具调用:",
																		" ",
																		/* @__PURE__ */ B("span", {
																			className: "rml-tool-highlight-yellow",
																			children: e.tool.toolName
																		})
																	]
																})]
															}), /* @__PURE__ */ V("div", {
																className: "rml-tool-card-right",
																children: [/* @__PURE__ */ B(Qn, { status: e.tool.status }), /* @__PURE__ */ B(C, {
																	size: 12,
																	className: "rml-chevron-right"
																})]
															})]
														}), /* @__PURE__ */ V("div", {
															className: "rml-tool-detail-body",
															children: [
																e.tool.args && /* @__PURE__ */ V("div", {
																	className: "rml-tool-section",
																	children: [
																		/* @__PURE__ */ B("span", {
																			className: "text-purple-400_80",
																			children: "Args:"
																		}),
																		" ",
																		e.tool.args
																	]
																}),
																e.tool.status === "success" && e.tool.result && /* @__PURE__ */ V("div", { children: [
																	/* @__PURE__ */ B("span", {
																		className: "text-green-400_80",
																		children: "Result:"
																	}),
																	" ",
																	e.tool.result
																] }),
																e.tool.status === "failed" && e.tool.error && /* @__PURE__ */ V("div", {
																	className: "text-red-400_80",
																	children: ["Error: ", e.tool.error]
																})
															]
														})]
													}) }),
													e.type === "content" && /* @__PURE__ */ B("div", {
														className: "rml-final-body",
														children: /* @__PURE__ */ V("div", {
															className: `rml-final-text${tr(e.msg) ? " rml-final-error" : ""}`,
															children: [tr(e.msg) ? /* @__PURE__ */ V("div", {
																className: "rml-error-inline",
																children: [/* @__PURE__ */ B(h, { size: 14 }), /* @__PURE__ */ B("span", { children: e.msg.content })]
															}) : /* @__PURE__ */ B("div", { dangerouslySetInnerHTML: { __html: pn(e.msg.content || "") } }), e.msg.isStreaming && /* @__PURE__ */ B("span", { className: "rml-cursor" })]
														})
													}),
													e.type === "askUser" && /* @__PURE__ */ V(ne, { children: [/* @__PURE__ */ B("div", {
														className: "rml-tool-card rml-tool-askuser",
														children: /* @__PURE__ */ V("div", {
															className: "rml-tool-card-inner",
															children: [/* @__PURE__ */ B("div", {
																className: "rml-tool-icon-wrap rml-tool-icon-amber",
																children: /* @__PURE__ */ B(w, {
																	size: 12,
																	className: "text-amber-400"
																})
															}), /* @__PURE__ */ V("span", {
																className: "rml-tool-label",
																children: [
																	"智能体询问:",
																	" ",
																	/* @__PURE__ */ B("span", {
																		className: "rml-tool-highlight-amber",
																		children: e.msg.agent
																	})
																]
															})]
														})
													}), e.msg.content && /* @__PURE__ */ B("div", {
														className: "rml-askuser-body",
														children: /* @__PURE__ */ B("div", {
															className: "rml-askuser-text",
															dangerouslySetInnerHTML: { __html: pn(e.msg.content || "") }
														})
													})] }),
													e.type !== "ask" && e.type !== "reason" && e.type !== "tool" && e.type !== "content" && e.type !== "askUser" && /* @__PURE__ */ V("div", {
														className: "rml-step-simple",
														children: [/* @__PURE__ */ B(T, {
															size: 12,
															className: "rml-icon-dim"
														}), /* @__PURE__ */ B("span", {
															className: "rml-step-mono",
															children: er(e)
														})]
													}),
													e.msg.timestamp > 0 && /* @__PURE__ */ B("span", {
														className: "rml-step-time",
														children: W(e.msg.timestamp)
													})
												]
											})]
										}, `step-${n}`)), t === ee.length - 1 && u && e.steps.length === 0 && /* @__PURE__ */ V("div", {
											className: "rml-loading-step",
											children: [/* @__PURE__ */ B("div", { className: "rml-step-dot-sm" }), /* @__PURE__ */ V("div", {
												className: "rml-loading-dots",
												children: [
													/* @__PURE__ */ B("span", { className: "rml-dot rml-dot-1" }),
													/* @__PURE__ */ B("span", { className: "rml-dot rml-dot-2" }),
													/* @__PURE__ */ B("span", { className: "rml-dot rml-dot-3" })
												]
											})]
										})]
									})
								})]
							}) : /* @__PURE__ */ B(ne, { children: ur(e) ? /* @__PURE__ */ V("div", {
								className: "rml-error-body",
								children: [/* @__PURE__ */ V("div", {
									className: "rml-error-inline",
									children: [/* @__PURE__ */ B(h, { size: 14 }), /* @__PURE__ */ B("span", { children: cr(e)?.content })]
								}), /* @__PURE__ */ B("span", {
									className: "rml-final-time",
									children: lr(e) ? W(lr(e).timestamp) : ""
								})]
							}) : cr(e) ? /* @__PURE__ */ V("div", {
								className: "rml-completed-text",
								children: [/* @__PURE__ */ B("div", { dangerouslySetInnerHTML: { __html: pn(cr(e)?.content || "") } }), /* @__PURE__ */ B("span", {
									className: "rml-final-time",
									children: lr(e) ? W(lr(e).timestamp) : ""
								})]
							}) : null })
						})]
					})]
				}, t)), u && ee.length === 0 && /* @__PURE__ */ V("div", {
					className: "rml-ai-block",
					children: [/* @__PURE__ */ B("div", {
						className: "rml-header-row rml-header-row--ai",
						children: /* @__PURE__ */ V("div", {
							className: "rml-header-left",
							children: [/* @__PURE__ */ B("div", {
								className: "rml-ai-avatar-icon",
								children: /* @__PURE__ */ B(A, {
									size: 14,
									className: "text-white rml-spin"
								})
							}), /* @__PURE__ */ B("span", {
								className: "rml-header-name",
								children: "AI"
							})]
						})
					}), /* @__PURE__ */ B("div", {
						className: "rml-body-row rml-body-row--ai",
						children: /* @__PURE__ */ V("div", {
							className: "rml-loading-dots",
							children: [
								/* @__PURE__ */ B("span", { className: "rml-dot rml-dot-1" }),
								/* @__PURE__ */ B("span", { className: "rml-dot rml-dot-2" }),
								/* @__PURE__ */ B("span", { className: "rml-dot rml-dot-3" })
							]
						})
					})]
				})]
			}),
			M && /* @__PURE__ */ B("div", {
				className: "rml-loading-more",
				children: /* @__PURE__ */ V("div", {
					style: {
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						gap: 6,
						color: "var(--ml-text-secondary, #8b949e)",
						fontSize: 12
					},
					children: [/* @__PURE__ */ B(A, {
						size: 12,
						className: "rml-spin"
					}), /* @__PURE__ */ B("span", { children: "加载中..." })]
				})
			})
		]
	});
});
dr.displayName = "RapTimelineMessageList";
//#endregion
//#region src/layout/RapTimelineChatLayout.tsx
var fr = e(({ theme: e = "dark", showAgentInfo: i = !1, isEnableFile: a = !0, input_isEnableKnowledge: s = !0, placeholder: u, defaultQuerys: f = [], showTokensBar: p = !1, isUserDefaultAvatar: m = !0, inputAreaHorizontalAlignment: h = "Full", inputAreaMargin: g = "10px", inputWidth: _, inputAgentsData: v = [], groups: y = [], autoConnect: b = !0 }, x) => {
	c();
	let S = o(null), C = Kn(), w = l(Ye), T = l(Xe), E = l(Ze), D = l(Qe), O = l($e), k = l(tt), A = l(nt), j = l(rt), M = l(it), N = l(at), P = l(Xt), F = l(en), I = l($t);
	n(() => {
		b && P && F && !T && C.connect();
	}, [
		b,
		P,
		F,
		T,
		C
	]), n(() => C.onSessionSwitch((e) => {
		setTimeout(() => S.current?.scrollToBottom?.(), 100);
	}), [C]), n(() => {
		D && d.error(D);
	}, [D]), n(() => {
		P || C.disconnect();
	}, [P, C]);
	let L = t((e, t, n, r) => {
		if (!T) {
			d.warning("未连接到服务器");
			return;
		}
		let i;
		if (n) i = {
			name: n.name,
			type: n.type === "group" ? "group" : "agent"
		};
		else {
			let e = I?.agent || "main";
			i = {
				name: e,
				type: y.some((t) => t.name === e) ? "group" : "agent"
			};
		}
		C.sendMessage(e, t, i, r), setTimeout(() => S.current?.scrollToBottom?.(), 100);
	}, [
		C,
		T,
		I,
		y
	]), R = t(async () => {
		if (!(!T || !E)) try {
			await C.terminateSession(), d.info("已终止当前对话");
		} catch (e) {
			d.error(e instanceof Error ? e.message : "终止失败");
		}
	}, [
		T,
		E,
		C
	]);
	return r(x, () => ({
		newSession: C.newSession,
		changeSession: C.changeSession,
		connect: C.connect,
		disconnect: C.disconnect
	})), /* @__PURE__ */ V("div", {
		className: `chat-layout ${e === "light" ? "chat-layout--light" : ""}`,
		style: {
			display: "flex",
			flexDirection: "column",
			height: "100%"
		},
		children: [/* @__PURE__ */ B(dr, {
			ref: S,
			messages: w,
			currentAgent: O,
			isGroupChat: k.length > 1,
			showToolCallLog: j,
			isLoading: E,
			theme: e,
			entryAgent: I?.agent,
			groups: y,
			defaultQuerys: f,
			isUserDefaultAvatar: m,
			hasMore: k.length > 1 ? M.__global__ !== !1 : M[O] !== !1,
			isLoadingMore: N,
			onLoadMore: () => C.loadMoreMessages(k.length > 1 ? void 0 : O),
			onSelectQuery: (e) => L(e, [])
		}), /* @__PURE__ */ B(Dn, {
			isConnected: T,
			isLoading: E,
			connectionError: D,
			theme: e,
			showAgentInfo: i,
			isEnableFile: a,
			input_isEnableKnowledge: s,
			placeholder: u,
			showTokensBar: p,
			currentAgentName: O,
			agentTokens: A,
			horizontalAlignment: h,
			margin: g,
			inputWidth: _,
			inputAgentsData: v,
			boundAgent: I?.agent || null,
			boundAgentType: I?.agentType || "agent",
			onSend: L,
			onTerminate: R
		})]
	});
});
fr.displayName = "RapTimelineChatLayout";
//#endregion
//#region src/components/messages/a2ui/utils/extractEvents.ts
var pr = (e) => {
	let t = [];
	for (let n of e) try {
		let e = JSON.parse(n.args || "{}");
		if (n.toolName === H.CREATE_SURFACE && e.surfaceId) t.push({
			version: "v0.9",
			createSurface: {
				surfaceId: e.surfaceId,
				catalogId: e.catalogId || "https://a2ui.org/specification/v0_9/basic_catalog.json",
				timestamp: n.timestamp
			}
		});
		else if (n.toolName === H.UPDATE_COMPONENTS && e.surfaceId && e.components) {
			let r = Array.isArray(e.components) ? e.components : [];
			r.length > 0 && t.push({
				version: "v0.9",
				updateComponents: {
					surfaceId: e.surfaceId,
					components: r,
					timestamp: n.timestamp
				}
			});
		} else n.toolName === H.UPDATE_DATA_MODEL && e.surfaceId ? t.push({
			version: "v0.9",
			updateDataModel: {
				surfaceId: e.surfaceId,
				path: e.path || "/",
				value: e.value,
				timestamp: n.timestamp
			}
		}) : n.toolName === H.DELETE_SURFACE && e.surfaceId && t.push({
			version: "v0.9",
			deleteSurface: {
				surfaceId: e.surfaceId,
				timestamp: n.timestamp
			}
		});
	} catch {}
	return t.sort((e, t) => {
		let n = (e) => e.createSurface ? 0 : e.updateComponents ? 1 : e.updateDataModel ? 2 : e.deleteSurface ? 3 : 4;
		return n(e) - n(t);
	}), t;
}, mr = new Set([
	H.CREATE_SURFACE,
	H.UPDATE_COMPONENTS,
	H.UPDATE_DATA_MODEL,
	H.DELETE_SURFACE
]), hr = 5, gr = 10, _r = e(({ theme: e = "dark", onSpecialEvent: i, onSessionSwitch: a, onA2UIAction: c }, u) => {
	let d = o(null), [f, p] = s([]), [m, h] = s(!1), [g, _] = s(!1), [v, y] = s(!0), b = o(0), x = o(/* @__PURE__ */ new Map()), S = o(/* @__PURE__ */ new Map()), C = o(/* @__PURE__ */ new Map()), w = o(null), T = o(null), E = o(null), D = o(null), [O, k] = s(!1), A = l(et);
	n(() => {
		D.current = A;
	}, [A]);
	let j = t(() => {
		d.current && (d.current.scrollTop = d.current.scrollHeight);
	}, []);
	n(() => {
		j();
	}, [f, j]), n(() => {
		let e = !1;
		return Promise.all([import("./v0_9-D4ZBX09k.js"), import("./v0_9-Bi_2jVc3.js").then((e) => e.t)]).then(([t, n]) => {
			if (e) return;
			let { basicCatalog: r } = t, { MessageProcessor: i } = n;
			T.current = {
				lit: t,
				core: n,
				basicCatalog: r
			};
			let a = new i([r]);
			w.current = a, a.onSurfaceCreated((e) => {
				let t = e.surfaceId || e.id;
				if (!t) return;
				let n = S.current.get(t) || {};
				n.surfaceInstance = e, n.surfaceCreated = !0, S.current.set(t, n);
				let r = x.current.get(t);
				r && (r.surface = e);
				let i = C.current.get(t);
				if (i && i.length > 0) {
					let e = [];
					for (let n of i) if (n.type === H.UPDATE_COMPONENTS && n.data) {
						let r = Array.isArray(n.data) ? n.data : n.data.components;
						r && r.length > 0 && e.push({ updateComponents: {
							surfaceId: t,
							components: r
						} });
					} else if (n.type === H.UPDATE_DATA_MODEL && n.data) {
						let { surfaceId: r, timestamp: i, ...a } = n.data;
						e.push({ updateDataModel: {
							surfaceId: t,
							...a
						} });
					}
					C.current.delete(t), e.length > 0 && a.processMessages(e.map((e) => ({
						version: "v0.9",
						...e
					})));
				}
				M();
			}), k(!0);
		}).catch((e) => {
			console.warn("[agent-chat] @a2ui/lit 或 @a2ui/web_core 未安装，A2UI 功能不可用", e);
		}), () => {
			e = !0;
		};
	}, []);
	let M = t(() => {
		let e = w.current;
		if (!e) return;
		let t = Array.from(x.current.keys());
		if (t.length <= gr) return;
		let n = t.slice(0, t.length - gr);
		for (let t of n) {
			try {
				e.processMessages([{
					version: "v0.9",
					deleteSurface: { surfaceId: t }
				}]);
			} catch {}
			S.current.delete(t), x.current.delete(t);
		}
		p((e) => e.filter((e) => e.surfaceId && !n.includes(e.surfaceId)));
	}, []), N = t((e, t, n) => {
		let r = w.current;
		if (!r) return;
		let i = S.current.get(e);
		if (t === H.CREATE_SURFACE) {
			let t = n.catalogId || n.catalog?.id || "basic";
			r.processMessages([{
				version: "v0.9",
				createSurface: {
					surfaceId: e,
					catalogId: t
				}
			}]);
			let a = i || {};
			a.surfaceCreated = !0, S.current.set(e, a);
			return;
		}
		if (t === H.UPDATE_COMPONENTS) {
			if (!i?.surfaceCreated) {
				let r = C.current.get(e) || [];
				r.push({
					type: t,
					data: n
				}), C.current.set(e, r);
				return;
			}
			let a = Array.isArray(n) ? n : n?.components;
			if (!a || a.length === 0) return;
			r.processMessages([{
				version: "v0.9",
				updateComponents: {
					surfaceId: e,
					components: a
				}
			}]);
			let o = i || {};
			o.components = a, S.current.set(e, o), o.data && r.processMessages([{
				version: "v0.9",
				updateDataModel: {
					surfaceId: e,
					...o.data
				}
			}]);
		}
		if (t === H.UPDATE_DATA_MODEL) {
			if (!i?.surfaceCreated) {
				let r = C.current.get(e) || [];
				r.push({
					type: t,
					data: n
				}), C.current.set(e, r);
				return;
			}
			let { surfaceId: a, timestamp: o, ...s } = n || {}, c = i || {};
			c.data = s, c.components && r.processMessages([{
				version: "v0.9",
				updateDataModel: {
					surfaceId: e,
					...s
				}
			}]), S.current.set(e, c);
		}
		t === H.DELETE_SURFACE && (r.processMessages([{
			version: "v0.9",
			deleteSurface: { surfaceId: e }
		}]), S.current.delete(e), x.current.delete(e), C.current.delete(e), p((t) => t.filter((t) => t.surfaceId !== e)));
	}, []), P = t((e) => {
		if (!E.current) return;
		let t = `surface-${E.current}`;
		e.createSurface && N(t, H.CREATE_SURFACE, e.createSurface), e.updateComponents && N(t, H.UPDATE_COMPONENTS, e.updateComponents), e.updateDataModel && N(t, H.UPDATE_DATA_MODEL, e.updateDataModel), setTimeout(() => j(), 0);
	}, [N, j]);
	n(() => {
		if (!O || !i) return;
		let e = [], t = Array.from(mr);
		for (let n of t) {
			let t = i(n, (e) => {
				P(e);
			});
			e.push(t);
		}
		return () => {
			for (let t of e) t();
		};
	}, [
		O,
		i,
		P
	]);
	let F = o();
	F.current = t(async (e, t = !1) => {
		let n = [];
		for (let t of e) {
			if (!t.userMessage) continue;
			let e = t.userMessage.id, r = `surface-${e}`;
			n.push({
				id: e,
				type: "user",
				timestamp: t.userMessage.timestamp,
				content: t.userMessage.content
			}), pr(t.toolCalls || []).length > 0 && n.push({
				id: `${e}-a2ui`,
				type: "a2ui",
				timestamp: t.toolCalls?.[0]?.timestamp || t.userMessage.timestamp,
				surfaceId: r
			});
		}
		n.sort((e, t) => e.timestamp - t.timestamp), p((e) => t ? [...n, ...e] : n), await new Promise((e) => setTimeout(e, 50));
		for (let t of e) {
			if (!t.userMessage) continue;
			let e = `surface-${t.userMessage.id}`, n = pr(t.toolCalls || []);
			for (let t of n) t.createSurface ? N(e, H.CREATE_SURFACE, t.createSurface) : t.updateComponents ? N(e, H.UPDATE_COMPONENTS, {
				...t.updateComponents,
				surfaceId: e
			}) : t.updateDataModel ? N(e, H.UPDATE_DATA_MODEL, {
				...t.updateDataModel,
				surfaceId: e
			}) : t.deleteSurface && N(e, H.DELETE_SURFACE, t.deleteSurface);
		}
	}, [N]);
	let L = o();
	L.current = t(async () => {
		let e = D.current;
		if (e) {
			h(!0), b.current = 0;
			try {
				let t = await Rt().get(`/messages/${e}/toolCalls`, { params: {
					toolNames: Array.from(mr).join(","),
					isLike: !0,
					pageSize: hr,
					pageIndex: 0
				} }), n = t.data || t;
				if (n.success && n.data) {
					let { groups: e, pagination: t } = n.data;
					await F.current(e, !1), y(t?.hasMore ?? !1), b.current = 1;
				}
			} catch (e) {
				console.error("[A2UI] loadLatest failed:", e);
			} finally {
				h(!1);
			}
		}
	}, []);
	let R = t(() => {
		L.current?.();
	}, []), z = t(async () => {
		let e = D.current;
		if (!(!e || g || !v)) {
			_(!0);
			try {
				let t = await Rt().get(`/messages/${e}/toolCalls`, { params: {
					toolNames: Array.from(mr).join(","),
					isLike: !0,
					pageSize: hr,
					pageIndex: b.current
				} }), n = t.data || t;
				if (n.success && n.data) {
					let { groups: e, pagination: t } = n.data;
					await F.current(e, !0), y(t?.hasMore ?? !1), b.current++;
				}
			} catch (e) {
				console.error("[A2UI] loadMore failed:", e);
			} finally {
				_(!1);
			}
		}
	}, [g, v]);
	n(() => {
		if (a) return a(async (e) => {
			if (w.current = null, x.current.clear(), S.current.clear(), C.current.clear(), E.current = null, p([]), b.current = 0, y(!0), T.current) {
				let { basicCatalog: e } = T.current, { MessageProcessor: t } = T.current.core, n = new t([e]);
				w.current = n, n.onSurfaceCreated((e) => {
					let t = e.surfaceId || e.id;
					if (!t) return;
					let r = S.current.get(t) || {};
					r.surfaceInstance = e, r.surfaceCreated = !0, S.current.set(t, r);
					let i = x.current.get(t);
					i && (i.surface = e);
					let a = C.current.get(t);
					if (a && a.length > 0) {
						let e = [];
						for (let n of a) if (n.type === H.UPDATE_COMPONENTS && n.data) {
							let r = Array.isArray(n.data) ? n.data : n.data.components;
							r && r.length > 0 && e.push({ updateComponents: {
								surfaceId: t,
								components: r
							} });
						} else if (n.type === H.UPDATE_DATA_MODEL && n.data) {
							let { surfaceId: r, timestamp: i, ...a } = n.data;
							e.push({ updateDataModel: {
								surfaceId: t,
								...a
							} });
						}
						C.current.delete(t), e.length > 0 && n.processMessages(e.map((e) => ({
							version: "v0.9",
							...e
						})));
					}
				});
			}
			L.current?.();
		});
	}, [a]);
	let ee = t(() => {
		let e = d.current;
		!e || g || !v || e.scrollTop < 50 && z();
	}, [
		g,
		v,
		z
	]);
	r(u, () => ({
		addUserMessage: (e) => {
			let t = `${D.current || "session"}-${Date.now()}`, n = `surface-${t}`;
			E.current = t, p((r) => [
				...r,
				{
					id: t,
					type: "user",
					content: e,
					timestamp: Date.now()
				},
				{
					id: `${t}-a2ui`,
					type: "a2ui",
					surfaceId: n,
					timestamp: Date.now() + 1
				}
			]);
		},
		loadLatest: R,
		loadMore: z,
		scrollToBottom: j
	})), n(() => {
		O && A && L.current?.();
	}, [O, A]);
	let te = e === "light" ? "a2ui-theme-light" : "", ne = t((e) => (t) => {
		if (t) {
			x.current.set(e, t);
			let n = S.current.get(e);
			n?.surfaceInstance && (t.surface = n.surfaceInstance);
		} else x.current.delete(e);
	}, []);
	return /* @__PURE__ */ V("div", {
		className: `message-list a2ui-list ${te}`,
		ref: d,
		onScroll: ee,
		children: [
			g && /* @__PURE__ */ B("div", {
				style: {
					textAlign: "center",
					padding: 12,
					color: "var(--ml-text-secondary, #8b949e)",
					fontSize: 13,
					position: "sticky",
					top: 0,
					zIndex: 10,
					backgroundColor: e === "light" ? "#fff" : "#0E1117"
				},
				children: "加载更多..."
			}),
			!g && v && f.length > 0 && /* @__PURE__ */ B("div", {
				style: {
					textAlign: "center",
					padding: 12,
					color: "var(--ml-text-secondary, #8b949e)",
					fontSize: 13,
					position: "sticky",
					top: 0,
					zIndex: 10,
					backgroundColor: e === "light" ? "#fff" : "#0E1117"
				},
				children: "滚动加载更多"
			}),
			m && /* @__PURE__ */ B("div", {
				style: {
					textAlign: "center",
					padding: 40,
					color: "var(--ml-text-secondary, #8b949e)"
				},
				children: "加载中..."
			}),
			!m && O && f.map((t) => /* @__PURE__ */ B("div", {
				className: "a2ui-timeline-item",
				children: t.type === "user" ? /* @__PURE__ */ B("div", {
					className: "a2ui-user-block",
					children: /* @__PURE__ */ V("div", {
						className: "a2ui-body-row a2ui-body-row--user",
						children: [/* @__PURE__ */ V("div", {
							className: "a2ui-user-bubble",
							children: [/* @__PURE__ */ B("div", {
								className: "a2ui-user-text",
								children: t.content
							}), /* @__PURE__ */ B("div", {
								className: "a2ui-user-time",
								children: W(t.timestamp)
							})]
						}), /* @__PURE__ */ B("div", {
							className: "a2ui-user-avatar",
							children: /* @__PURE__ */ B(I, { size: 14 })
						})]
					})
				}) : /* @__PURE__ */ B("div", {
					className: "a2ui-surface-wrapper",
					style: {
						backgroundColor: e === "light" ? "#ffffff" : "#0D1117",
						border: "1px solid var(--ml-border, #30363d)",
						borderRadius: 12,
						overflow: "hidden",
						minHeight: 100
					},
					children: /* @__PURE__ */ B("a2ui-surface", {
						ref: ne(t.surfaceId),
						"data-surface-id": t.surfaceId
					})
				})
			}, t.id)),
			!m && O && f.length === 0 && /* @__PURE__ */ V("div", {
				style: {
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					flex: 1,
					padding: 40
				},
				children: [/* @__PURE__ */ B("div", {
					style: {
						fontSize: 40,
						marginBottom: 16,
						opacity: .3
					},
					children: "🎨"
				}), /* @__PURE__ */ B("div", {
					style: { color: "var(--ml-text-secondary, #8b949e)" },
					children: "A2UI 交互模式"
				})]
			}),
			!O && /* @__PURE__ */ B("div", {
				style: {
					textAlign: "center",
					padding: 40,
					color: "var(--ml-text-secondary, #8b949e)"
				},
				children: "A2UI 组件库加载中..."
			})
		]
	});
});
_r.displayName = "A2UIMessageList";
//#endregion
//#region src/layout/A2UIChatLayout.tsx
var vr = e(({ theme: e = "dark", showAgentInfo: i = !1, isEnableFile: a = !0, input_isEnableKnowledge: s = !0, placeholder: u, showTokensBar: f = !1, inputAreaHorizontalAlignment: p = "Full", inputAreaMargin: m = "10px", inputWidth: h, inputAgentsData: g = [], groups: _ = [], onA2UIAction: v, onSurfaceCreated: y, onComponentsUpdated: b, onDataModelUpdated: x, onSurfaceDeleted: S, autoConnect: C = !0 }, w) => {
	c();
	let T = o(null), E = Kn(), D = l(Xe), O = l(Ze), k = l(Qe), A = l($e), j = l(nt), M = l(Xt), N = l(en), P = l($t);
	n(() => {
		C && M && N && !D && E.connect();
	}, [
		C,
		M,
		N,
		D,
		E
	]), n(() => E.onSessionSwitch((e) => {
		setTimeout(() => T.current?.scrollToBottom?.(), 100);
	}), [E]), n(() => {
		k && d.error(k);
	}, [k]), n(() => {
		M || E.disconnect();
	}, [M, E]), n(() => {
		let e = [];
		return y && e.push(E.onSpecialEvent(H.CREATE_SURFACE, (e) => y(e?.surfaceId))), b && e.push(E.onSpecialEvent(H.UPDATE_COMPONENTS, (e) => b(e))), x && e.push(E.onSpecialEvent(H.UPDATE_DATA_MODEL, (e) => x(e))), S && e.push(E.onSpecialEvent(H.DELETE_SURFACE, (e) => S(e?.surfaceId))), () => e.forEach((e) => e());
	}, [
		E,
		y,
		b,
		x,
		S
	]);
	let F = t((e, t, n, r) => {
		if (!D) {
			d.warning("未连接到服务器");
			return;
		}
		let i;
		if (n) i = {
			name: n.name,
			type: n.type === "group" ? "group" : "agent"
		};
		else {
			let e = P?.agent || "main";
			i = {
				name: e,
				type: _.some((t) => t.name === e) ? "group" : "agent"
			};
		}
		T.current?.addUserMessage(e), E.sendMessage(e, t, i, r);
	}, [
		E,
		D,
		P,
		_
	]), I = t(async () => {
		if (!(!D || !O)) try {
			await E.terminateSession(), d.info("已终止当前对话");
		} catch (e) {
			d.error(e instanceof Error ? e.message : "终止失败");
		}
	}, [
		D,
		O,
		E
	]), L = t((e, t) => {
		v?.(t), E.transportRef.current && E.transportRef.current.request("messageChannel/sendA2UIUserAction", [e, t]).catch((e) => {
			console.error("[A2UIChatLayout] sendA2UIUserAction failed:", e);
		});
	}, [E, v]);
	return r(w, () => ({
		newSession: async () => {
			await E.newSession(), T.current?.loadLatest();
		},
		changeSession: async (e) => {
			await E.changeSession(e), T.current?.loadLatest();
		},
		a2uiMessageListRef: T,
		connect: E.connect,
		disconnect: E.disconnect
	})), /* @__PURE__ */ V("div", {
		className: `chat-layout ${e === "light" ? "chat-layout--light" : ""}`,
		style: {
			display: "flex",
			flexDirection: "column",
			height: "100%"
		},
		children: [/* @__PURE__ */ B(_r, {
			ref: T,
			theme: e,
			onSpecialEvent: E.onSpecialEvent,
			onSessionSwitch: E.onSessionSwitch,
			onA2UIAction: L
		}), /* @__PURE__ */ B(Dn, {
			isConnected: D,
			isLoading: O,
			connectionError: k,
			theme: e,
			showAgentInfo: i,
			isEnableFile: a,
			input_isEnableKnowledge: s,
			placeholder: u,
			showTokensBar: f,
			currentAgentName: A,
			agentTokens: j,
			horizontalAlignment: p,
			margin: m,
			inputWidth: h,
			inputAgentsData: g,
			boundAgent: P?.agent || null,
			boundAgentType: P?.agentType || "agent",
			onSend: F,
			onTerminate: I
		})]
	});
});
vr.displayName = "A2UIChatLayout";
//#endregion
//#region src/components/messages/timeline/MessageBubble.tsx
function yr(e) {
	let t = e.split(".").pop()?.toLowerCase() || "", n = { size: 14 };
	return [
		"jpg",
		"jpeg",
		"png",
		"gif",
		"webp",
		"svg",
		"bmp"
	].includes(t) ? /* @__PURE__ */ B(k, { ...n }) : [
		"mp4",
		"avi",
		"mov",
		"mkv",
		"webm"
	].includes(t) ? /* @__PURE__ */ B(R, { ...n }) : [
		"mp3",
		"wav",
		"ogg",
		"flac",
		"aac"
	].includes(t) ? /* @__PURE__ */ B(N, { ...n }) : [
		"zip",
		"tar",
		"gz",
		"rar",
		"7z"
	].includes(t) ? /* @__PURE__ */ B(g, { ...n }) : [
		"pdf",
		"doc",
		"docx",
		"txt",
		"md",
		"rtf"
	].includes(t) ? /* @__PURE__ */ B(D, { ...n }) : /* @__PURE__ */ B(E, { ...n });
}
var br = ({ status: e }) => {
	switch (e) {
		case "pending": return /* @__PURE__ */ B("span", { style: {
			display: "inline-block",
			width: 8,
			height: 8,
			borderRadius: "50%",
			background: "#f59e0b",
			animation: "pulse 1.5s infinite"
		} });
		case "success": return /* @__PURE__ */ B("span", {
			style: {
				color: "#10b981",
				fontSize: 12
			},
			children: "✓"
		});
		case "failed": return /* @__PURE__ */ B("span", {
			style: {
				color: "#ef4444",
				fontSize: 12
			},
			children: "✗"
		});
		default: return null;
	}
}, xr = ({ documents: e }) => /* @__PURE__ */ B("div", {
	style: {
		marginTop: 8,
		display: "flex",
		flexWrap: "wrap",
		gap: 6
	},
	children: e.map((e, t) => /* @__PURE__ */ V("a", {
		href: e.url || e.localPath,
		target: "_blank",
		rel: "noopener noreferrer",
		style: {
			display: "inline-flex",
			alignItems: "center",
			gap: 4,
			padding: "3px 8px",
			borderRadius: 6,
			background: "var(--ml-bg-secondary, #161b22)",
			border: "1px solid var(--ml-border, #30363d)",
			color: "var(--ml-text-primary, #c9d1d9)",
			fontSize: 12,
			textDecoration: "none"
		},
		children: [
			/* @__PURE__ */ B(P, { size: 12 }),
			yr(e.fileName),
			/* @__PURE__ */ B("span", { children: e.fileName })
		]
	}, t))
}), Sr = {
	background: "rgba(0, 0, 0, 0.3)",
	padding: 8,
	borderRadius: 6,
	fontSize: 11,
	fontFamily: "'SF Mono', 'Fira Code', monospace",
	overflowX: "auto",
	whiteSpace: "pre-wrap",
	margin: 0
}, Cr = ({ toolCalls: e }) => /* @__PURE__ */ B("div", {
	style: {
		marginTop: 8,
		borderTop: "1px solid var(--ml-border, #30363d)",
		paddingTop: 8
	},
	children: e.map((e, t) => /* @__PURE__ */ V("details", {
		style: {
			marginBottom: 4,
			borderRadius: 8,
			border: "1px solid var(--ml-border, #30363d)",
			background: "var(--ml-bg-secondary, #161b22)",
			padding: 8
		},
		children: [/* @__PURE__ */ V("summary", {
			style: {
				cursor: "pointer",
				display: "flex",
				alignItems: "center",
				gap: 6,
				fontSize: 12,
				listStyle: "none"
			},
			children: [
				/* @__PURE__ */ B(br, { status: e.status }),
				/* @__PURE__ */ B("span", {
					style: {
						fontFamily: "'SF Mono', monospace",
						color: "var(--ml-accent, #58a6ff)"
					},
					children: e.toolName
				}),
				e.timestamp && /* @__PURE__ */ B("span", {
					style: {
						marginLeft: "auto",
						fontSize: 11,
						color: "var(--ml-text-secondary, #8b949e)"
					},
					children: W(e.timestamp)
				})
			]
		}), /* @__PURE__ */ V("div", {
			style: {
				marginTop: 8,
				borderTop: "1px solid var(--ml-border, #30363d)",
				paddingTop: 8
			},
			children: [
				e.args && /* @__PURE__ */ V("div", {
					style: { marginBottom: 8 },
					children: [/* @__PURE__ */ B("div", {
						style: {
							fontSize: 11,
							fontWeight: 600,
							opacity: .7,
							marginBottom: 4
						},
						children: "参数:"
					}), /* @__PURE__ */ B("pre", {
						style: Sr,
						children: e.args
					})]
				}),
				e.status === "success" && e.result && /* @__PURE__ */ V("div", {
					style: { marginBottom: 8 },
					children: [/* @__PURE__ */ B("div", {
						style: {
							fontSize: 11,
							fontWeight: 600,
							opacity: .7,
							marginBottom: 4
						},
						children: "结果:"
					}), /* @__PURE__ */ B("pre", {
						style: Sr,
						children: e.result
					})]
				}),
				e.status === "failed" && e.error && /* @__PURE__ */ V("div", {
					style: { marginBottom: 8 },
					children: [/* @__PURE__ */ B("div", {
						style: {
							fontSize: 11,
							fontWeight: 600,
							opacity: .7,
							marginBottom: 4
						},
						children: "错误:"
					}), /* @__PURE__ */ B("pre", {
						style: {
							...Sr,
							color: "#fca5a5",
							background: "rgba(239, 68, 68, 0.1)"
						},
						children: e.error
					})]
				})
			]
		})]
	}, t))
}), wr = ({ message: e, showToolCalls: n, selected: r = !1, senderName: i, onSelect: a }) => {
	let o = e.role === U.USER || e.role === U.USER_ANSWER, s = e.role === U.ERROR, c = e.role === U.ASK_USER, l = e.role === U.USER_ANSWER, u = e.role === U.ASK_AGENT, d, f;
	o ? (d = "linear-gradient(135deg, #1a5fb4, #1c71d8)", f = "flex-end") : s ? (d = "rgba(239, 68, 68, 0.15)", f = "flex-start") : c ? (d = "rgba(245, 158, 11, 0.15)", f = "flex-start") : (d = "var(--ml-bg-primary, #0E1117)", f = "flex-start");
	let p = t(() => {
		a?.();
	}, [a]);
	return /* @__PURE__ */ V("div", {
		style: {
			display: "flex",
			flexDirection: "column",
			alignItems: f,
			maxWidth: "100%",
			marginBottom: 8
		},
		onClick: p,
		children: [
			u && e.fromAgent && /* @__PURE__ */ V("div", {
				style: {
					display: "flex",
					alignItems: "center",
					gap: 6,
					marginBottom: 2,
					paddingLeft: 4,
					fontSize: 11
				},
				children: [
					/* @__PURE__ */ B("span", {
						style: {
							display: "inline-flex",
							alignItems: "center",
							padding: "2px 8px",
							borderRadius: 12,
							fontWeight: 600,
							fontSize: 11,
							background: "linear-gradient(135deg, #667eea, #764ba2)",
							color: "#ffffff"
						},
						children: e.fromAgent
					}),
					/* @__PURE__ */ B(_, {
						size: 12,
						style: { color: "#3b82f6" }
					}),
					/* @__PURE__ */ B("span", {
						style: {
							display: "inline-flex",
							alignItems: "center",
							padding: "2px 8px",
							borderRadius: 12,
							fontWeight: 600,
							fontSize: 11,
							background: "linear-gradient(135deg, #f093fb, #f5576c)",
							color: "#ffffff"
						},
						children: e.agent
					})
				]
			}),
			(l || !o) && /* @__PURE__ */ B("div", {
				style: {
					display: "flex",
					alignItems: "center",
					gap: 6,
					fontSize: 11,
					color: "var(--ml-text-secondary, #8b949e)",
					marginBottom: 2,
					paddingLeft: 4
				},
				children: c ? /* @__PURE__ */ V(ne, { children: [/* @__PURE__ */ B(w, {
					size: 14,
					style: { color: "#f59e0b" }
				}), /* @__PURE__ */ V("span", { children: [i, " 询问"] })] }) : l ? /* @__PURE__ */ V(ne, { children: [/* @__PURE__ */ B(x, {
					size: 14,
					style: { color: "#10b981" }
				}), /* @__PURE__ */ V("span", { children: ["用户回答 → ", e.agent] })] }) : i
			}),
			/* @__PURE__ */ V("div", {
				className: `message-bubble ${r ? "selected" : ""}`,
				style: {
					background: d,
					borderRadius: o ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
					padding: "10px 14px",
					maxWidth: "80%",
					border: r ? "2px solid var(--ml-accent, #58a6ff)" : "1px solid var(--ml-border, #30363d)",
					cursor: a ? "pointer" : "default",
					wordBreak: "break-word"
				},
				children: [
					o && /* @__PURE__ */ B("div", {
						style: {
							fontSize: 10,
							color: "rgba(255,255,255,0.5)",
							textAlign: "right",
							marginBottom: 4,
							fontFamily: "'SF Mono', monospace"
						},
						children: W(e.timestamp)
					}),
					e.content ? /* @__PURE__ */ B("div", {
						className: "message-content",
						dangerouslySetInnerHTML: { __html: pn(e.content) }
					}) : e.isStreaming ? /* @__PURE__ */ V("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: 4
						},
						children: [
							/* @__PURE__ */ B("span", {
								className: "typing-dot",
								children: "●"
							}),
							/* @__PURE__ */ B("span", {
								className: "typing-dot",
								style: { animationDelay: "0.2s" },
								children: "●"
							}),
							/* @__PURE__ */ B("span", {
								className: "typing-dot",
								style: { animationDelay: "0.4s" },
								children: "●"
							})
						]
					}) : null,
					e.documents && e.documents.length > 0 && /* @__PURE__ */ B(xr, { documents: e.documents }),
					n && e.toolCalls && e.toolCalls.length > 0 && /* @__PURE__ */ B(Cr, { toolCalls: e.toolCalls })
				]
			}),
			!o && /* @__PURE__ */ B("div", {
				style: {
					fontSize: 10,
					color: "var(--ml-text-tertiary, #6e7681)",
					marginTop: 2,
					paddingLeft: 4,
					fontFamily: "'SF Mono', monospace"
				},
				children: W(e.timestamp)
			})
		]
	});
};
//#endregion
//#region src/store/index.ts
function Tr(e) {
	return f({
		reducer: {
			chat: Je,
			user: Yt
		},
		preloadedState: e,
		middleware: (e) => e({ serializableCheck: { ignoredPaths: ["chat.messages"] } })
	});
}
var Er = Tr();
Jn(Er);
//#endregion
export { vr as A2UIChatLayout, _r as A2UIMessageList, un as AgentAvatar, Dn as InputArea, wr as MessageBubble, U as MessageRoles, fr as RapTimelineChatLayout, dr as RapTimelineMessageList, ae as RunAgentTypes, Zn as SampleChatLayout, Xn as SampleMessageList, H as SpecialEventNames, Yn as TimelineChatLayout, Sn as TimelineMessageList, Tn as TokensBar, De as addMessage, Ue as addToolCallFailed, Ve as addToolCallStart, He as addToolCallSuccess, Oe as addUserMessage, Re as appendStreamContent, ze as appendStreamReasonContent, Jt as clearAuth, Ne as clearMessages, It as clearToken, Tr as createAgentChatStore, W as formatTime, se as formatTimeShort, K as generateId, Rt as getApiInstance, Ht as getConfig, Ft as getToken, Lt as getTokenStorageConfig, Ut as getWebSocketConfig, G as hashColor, Vt as initAgentChatConfig, Be as markStreamDone, Ae as prependMessages, pn as renderMarkdown, qe as resetChat, nt as selectAgentTokens, tt as selectAgents, st as selectAuthErrorCode, Qe as selectConnectionError, $e as selectCurrentAgent, it as selectHasMoreMessages, Zt as selectIsAdmin, ot as selectIsAuthenticated, Ze as selectIsChatLoading, Xe as selectIsConnected, at as selectIsLoadingMore, Xt as selectIsLoggedIn, Qt as selectIsTenant, Ye as selectMessages, et as selectSessionId, rt as selectShowToolCallLog, en as selectToken, $t as selectUser, tn as selectUserLoading, Ce as setAgents, ye as setAuthErrorCode, ve as setAuthenticated, ge as setConnected, _e as setConnectionError, Se as setCurrentAgent, je as setHasMore, be as setLoading, Me as setLoadingMore, ke as setMessages, xe as setSessionId, Ee as setShowToolCallLog, Pt as setToken, Kt as setTokenAction, Bt as setTokenExpiredCallback, Jn as setTransportStore, Gt as setUser, oe as sleep, Er as store, We as updateAgentTokens, Kn as useChatTransport, sn as useTurns };
