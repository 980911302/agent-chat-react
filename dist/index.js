import { forwardRef as e, useCallback as t, useEffect as n, useImperativeHandle as r, useLayoutEffect as i, useMemo as a, useRef as o, useState as s } from "react";
import { useDispatch as c, useSelector as l } from "react-redux";
import { Upload as u, message as d } from "antd";
import { configureStore as f, createSlice as p } from "@reduxjs/toolkit";
import m from "axios";
import { AlertCircle as ee, Archive as h, ArrowRight as g, ArrowUp as _, BookOpen as v, BrainCircuit as y, Check as b, ChevronDown as x, ChevronRight as S, CircleHelp as C, Cpu as w, File as T, FileText as E, HelpCircle as D, Image as O, Loader2 as k, MessageSquare as A, MoreHorizontal as j, Music as M, Paperclip as N, Plus as P, User as F, Users as I, Video as L, Wrench as R, X as te, XCircle as ne } from "lucide-react";
import { Fragment as re, jsx as z, jsxs as B } from "react/jsx-runtime";
import ie from "markdown-it";
import ae from "dompurify";
//#region src/constants/events.ts
var V = {
	CREATE_SURFACE: "createSurface",
	UPDATE_COMPONENTS: "updateComponents",
	UPDATE_DATA_MODEL: "updateDataModel",
	DELETE_SURFACE: "deleteSurface"
}, H = {
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
}, oe = {
	AGENT: "agent",
	GROUP: "group"
};
//#endregion
//#region src/utils/index.ts
function se(e) {
	return new Promise((t) => setTimeout(t, e));
}
function U(e) {
	if (!e) return "";
	let t = new Date(e), n = (e) => String(e).padStart(2, "0");
	return `${t.getFullYear()}-${n(t.getMonth() + 1)}-${n(t.getDate())} ${n(t.getHours())}:${n(t.getMinutes())}:${n(t.getSeconds())}`;
}
function ce(e) {
	if (!e) return "";
	let t = new Date(e), n = (e) => String(e).padStart(2, "0");
	return `${n(t.getHours())}:${n(t.getMinutes())}:${n(t.getSeconds())}`;
}
var le = [
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
function W(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) t = e.charCodeAt(n) + ((t << 5) - t), t &= t;
	return le[Math.abs(t) % le.length];
}
function G() {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
		let t = Math.random() * 16 | 0;
		return (e === "x" ? t : t & 3 | 8).toString(16);
	});
}
//#endregion
//#region src/store/chatSlice.ts
var ue = {
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
function de(e, t) {
	e.messages[t] || (e.messages[t] = []), t in e.hasMoreMessages || (e.hasMoreMessages[t] = !1);
}
function K(e, t) {
	let n = e[t];
	if (n) {
		for (let e = n.length - 1; e >= 0; e--) if (n[e].role === H.ASSISTANT) return n[e];
	}
}
function fe(e, t, n) {
	let r = e[t];
	if (r) {
		for (let e = r.length - 1; e >= 0; e--) if (r[e].id === n) return r[e];
	}
}
var pe = [
	H.ASSISTANT,
	H.TOOL_RESULT,
	H.COMMAND,
	H.OPTION
];
function me(e, t) {
	let n = e[t];
	if (n) {
		for (let e = n.length - 1; e >= 0; e--) if (pe.includes(n[e].role)) return n[e];
	}
}
function he(e, t, n) {
	let r = e[t];
	if (r) for (let e = r.length - 1; e >= 0; e--) {
		let t = r[e];
		if (pe.includes(t.role) && t.toolCalls) {
			let e = t.toolCalls.find((e) => e.toolName === n && e.status === "pending");
			if (e) return e;
		}
	}
}
var ge = p({
	name: "chat",
	initialState: ue,
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
			de(e, n), e.messages[n].push(r);
		},
		addUserMessage(e, t) {
			let n = t.payload.agent || e.currentAgent;
			de(e, n), e.messages[n].push({
				id: G(),
				role: H.USER,
				content: t.payload.content,
				timestamp: Date.now(),
				documents: t.payload.documents
			});
		},
		setMessages(e, t) {
			let { agent: n, messages: r } = t.payload;
			de(e, n), e.messages[n] = r;
		},
		prependMessages(e, t) {
			let { agent: n, messages: r, hasMore: i } = t.payload;
			de(e, n), e.messages[n] = [...r, ...e.messages[n]], e.hasMoreMessages[n] = i;
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
			de(e, n), e.messages[n].push({
				id: r,
				role: H.ASSISTANT,
				content: "",
				agent: n,
				timestamp: Date.now(),
				isStreaming: !0
			});
		},
		appendContentById(e, t) {
			let { agent: n, id: r, content: i } = t.payload, a = fe(e.messages, n, r);
			a && (a.content += i);
		},
		appendReasonContentById(e, t) {
			let { agent: n, id: r, content: i } = t.payload, a = fe(e.messages, n, r);
			a && (a.reasonContent = (a.reasonContent || "") + i);
		},
		markStreamDoneById(e, t) {
			let { agent: n, id: r } = t.payload, i = fe(e.messages, n, r);
			i && (i.isStreaming = !1);
		},
		appendStreamContent(e, t) {
			let { agent: n, content: r } = t.payload, i = K(e.messages, n);
			i && (i.content += r, i.isStreaming = !0);
		},
		appendStreamReasonContent(e, t) {
			let { agent: n, content: r } = t.payload, i = K(e.messages, n);
			i && (i.reasonContent = (i.reasonContent || "") + r, i.isStreaming = !0);
		},
		markStreamDone(e, t) {
			if (t.payload.agent) {
				let n = K(e.messages, t.payload.agent);
				n && (n.isStreaming = !1);
			} else {
				for (let t of Object.keys(e.messages)) {
					let n = K(e.messages, t);
					n && (n.isStreaming = !1);
				}
				e.isLoading = !1;
			}
		},
		addToolCallStart(e, t) {
			let { agent: n, toolName: r, args: i } = t.payload;
			de(e, n);
			let a = {
				toolName: r,
				args: i,
				status: "pending",
				timestamp: Date.now()
			}, o = me(e.messages, n);
			o ? (o.toolCalls ||= [], o.toolCalls.push(a)) : e.messages[n].push({
				id: G(),
				role: H.ASSISTANT,
				content: "",
				agent: n,
				timestamp: Date.now(),
				isStreaming: !1,
				toolCalls: [a]
			});
		},
		addToolCallSuccess(e, t) {
			let { agent: n, toolName: r, result: i } = t.payload, a = he(e.messages, n, r);
			a && (a.status = "success", a.result = i);
		},
		addToolCallFailed(e, t) {
			let { agent: n, toolName: r, error: i } = t.payload, a = he(e.messages, n, r);
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
			return ue;
		}
	}
}), { setConnected: _e, setConnectionError: ve, setAuthenticated: ye, setAuthErrorCode: be, setLoading: q, setSessionId: xe, setCurrentAgent: Se, setAgents: Ce, addAgent: we, setAgentTokens: Te, setShowToolCallLog: Ee, addMessage: De, addUserMessage: Oe, setMessages: ke, prependMessages: Ae, setHasMore: je, setLoadingMore: Me, clearMessages: Ne, startAssistantMessage: Pe, appendContentById: Fe, appendReasonContentById: Ie, markStreamDoneById: Le, appendStreamContent: Re, appendStreamReasonContent: ze, markStreamDone: Be, addToolCallStart: Ve, addToolCallSuccess: He, addToolCallFailed: Ue, updateAgentTokens: We, setSessionOverview: Ge, setSessionOverviewLoading: Ke, resetChat: qe } = ge.actions, Je = ge.reducer, Ye = (e) => e.chat.messages, Xe = (e) => e.chat.isConnected, Ze = (e) => e.chat.isLoading, Qe = (e) => e.chat.connectionError, $e = (e) => e.chat.currentAgent, et = (e) => e.chat.sessionId, tt = (e) => e.chat.agents, nt = (e) => e.chat.agentTokens, rt = (e) => e.chat.showToolCallLog, it = (e) => e.chat.hasMoreMessages, at = (e) => e.chat.isLoadingMore, ot = (e) => e.chat.isAuthenticated, st = (e) => e.chat.authErrorCode, ct;
function lt(e) {
	ct = e;
}
function J() {
	if (!ct) throw Error("API instance not set. Please call setApiInstance() before using API methods.");
	return ct;
}
//#endregion
//#region src/vendor/api-gateway/sse.ts
var ut = class {
	constructor(e) {
		this.requestInterceptors = [], this.responseInterceptors = [], this.baseURL = e?.baseURL || "", this.timeout = e?.timeout || 0;
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
//#region src/vendor/api-gateway/api/agents.ts
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
};
(/* @__PURE__ */ (function(e) {
	return e.Summarize = "summarize", e.Truncate = "truncate", e.SlidingWindow = "slidingWindow", e;
})({})).Summarize;
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
}, yt = null, bt = null;
function xt(e) {
	Y.tokenStorage.token = e;
	let t = Y.tokenStorage.tokenKey || "power_claw_token";
	try {
		localStorage.setItem(t, e);
	} catch {}
}
function St() {
	if (Y.tokenStorage.token) return Y.tokenStorage.token;
	let e = Y.tokenStorage.tokenKey || "power_claw_token";
	try {
		return localStorage.getItem(e) || "";
	} catch {
		return "";
	}
}
function Ct() {
	Y.tokenStorage.token = "";
	let e = Y.tokenStorage.tokenKey || "power_claw_token";
	try {
		localStorage.removeItem(e);
	} catch {}
}
function wt() {
	return { ...Y.tokenStorage };
}
function Tt() {
	if (!yt) throw Error("API 实例未初始化，请先调用 initAgentChatConfig()");
	return yt;
}
function Et(e) {
	if (e.instance) return e.instance;
	let t = m.create({
		baseURL: e.baseUrl || "http://localhost:3000/api",
		timeout: 3e4,
		headers: { "Content-Type": "application/json" }
	});
	return t.interceptors.request.use((e) => {
		let t = St();
		return t && e.headers && (e.headers.Authorization = `Bearer ${t}`), e;
	}), t.interceptors.response.use((e) => e.data, (e) => {
		if (e.response) {
			let t = e.response.status;
			t === 401 ? bt?.(401, "登录已过期，请重新登录") : t === 403 && bt?.(403, "没有权限访问该资源");
		}
		return Promise.reject(e);
	}), t;
}
function Dt(e) {
	bt = e;
}
function Ot(e = {}) {
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
	}, e.tokenStorage?.token && xt(e.tokenStorage.token), yt = Et(Y.api), lt(yt);
	let t = new ut({
		baseURL: Y.api.baseUrl,
		timeout: 3e4
	});
	t.addRequestInterceptor((e) => {
		let t = St();
		return t && (e.headers = {
			...e.headers,
			Authorization: `Bearer ${t}`
		}), e;
	}), t.addResponseInterceptor({ onError: (e) => (e.message.includes("401") ? (console.error("[SSE] Token 异常:", e.message), bt?.(401, "登录已过期，请重新登录")) : e.message.includes("403") && (console.error("[SSE] Token 异常:", e.message), bt?.(403, "没有权限访问该资源")), e) }), pt(t);
}
function kt() {
	return { ...Y };
}
function At() {
	return { ...Y.websocket };
}
//#endregion
//#region src/store/userSlice.ts
var jt = p({
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
			e.token = t.payload, t.payload ? xt(t.payload) : Ct();
		},
		setLoading(e, t) {
			e.isLoading = t.payload;
		},
		clearAuth(e) {
			e.user = null, e.token = null, Ct();
		}
	}
}), { setUser: Mt, setTokenAction: Nt, setLoading: Pt, clearAuth: Ft } = jt.actions, It = jt.reducer, Lt = (e) => e.user.user !== null && e.user.token !== null, Rt = (e) => e.user.user?.role === "admin", zt = (e) => e.user.user?.role === "tenant", Bt = (e) => e.user.user, Vt = (e) => e.user.token, Ht = (e) => e.user.isLoading, Ut = /* @__PURE__ */ new Set([
	H.ASSISTANT,
	H.USER,
	H.ASK_AGENT,
	H.ASK_USER,
	H.USER_ANSWER,
	H.TOOL_RESULT,
	H.COMMAND,
	H.OPTION,
	H.ERROR
]);
function Wt(e, t) {
	return e === "entry-agent" && t ? t : e;
}
function Gt(e) {
	return e.role === H.USER || e.role === H.USER_ANSWER;
}
function Kt(e, t, n, r, i) {
	let a = [];
	if (n) for (let t in e) for (let n of e[t]) Ut.has(n.role) && n.content !== void 0 && a.push(n);
	else {
		let n = i?.find((e) => e.name === t);
		if (n) {
			let r = [t, ...n.members];
			for (let t of r) {
				let n = e[t] || [];
				for (let e of n) Ut.has(e.role) && e.content !== void 0 && a.push(e);
			}
		} else {
			let n = e[Wt(t, r)] || [];
			for (let e of n) Ut.has(e.role) && e.content !== void 0 && a.push(e);
		}
	}
	let o = /* @__PURE__ */ new Set(), s = [];
	for (let e of a) o.has(e.id) || (o.add(e.id), s.push(e));
	return s.sort((e, t) => e.timestamp - t.timestamp), s;
}
function qt(e, t, n, r = {}) {
	let { entryAgent: i, groups: o } = r;
	return a(() => {
		let r = Kt(e, t, n, i, o);
		if (r.length === 0) return [];
		let a = [], s = null;
		for (let e of r) {
			if (Gt(e)) {
				s && a.push(s), s = {
					userMsg: e,
					steps: []
				};
				continue;
			}
			if (s ||= {
				userMsg: null,
				steps: []
			}, e.role === H.ASK_USER) s.steps.push({
				type: "askUser",
				msg: e
			});
			else if (e.role === H.ASK_AGENT) s.steps.push({
				type: "ask",
				msg: e
			});
			else if (e.role === H.ASSISTANT) {
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
			} else e.role === H.ERROR ? s.steps.push({
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
var Jt = {
	small: 24,
	medium: 32,
	large: 48
}, Yt = {
	small: 10,
	medium: 13,
	large: 18
}, Xt = ({ src: e = "", emoji: t = "", svg: n = "", text: r = "", agentName: i = "", size: a = "medium", color: o = "", isGroup: s = !1 }) => {
	let c = r || i, l = Jt[a], u = {
		width: l,
		height: l,
		minWidth: l,
		borderRadius: "50%",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		overflow: "hidden",
		fontSize: Yt[a],
		fontWeight: 600,
		color: "#fff",
		background: s ? "linear-gradient(135deg, #f59e0b, #ea580c)" : o || W(c || "agent"),
		...s ? { boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2), 0 0 0 3px #f59e0b" } : {}
	}, d;
	return d = e ? /* @__PURE__ */ z("img", {
		src: e,
		alt: c,
		style: {
			width: "100%",
			height: "100%",
			objectFit: "cover"
		}
	}) : t ? /* @__PURE__ */ z("span", {
		style: { fontSize: l * .6 },
		children: t
	}) : n ? /* @__PURE__ */ z("div", {
		dangerouslySetInnerHTML: { __html: n },
		style: {
			width: "70%",
			height: "70%"
		}
	}) : c ? /* @__PURE__ */ z("span", { children: c.slice(0, 2) }) : /* @__PURE__ */ z(F, { size: l * .5 }), /* @__PURE__ */ z("div", {
		style: u,
		className: "agent-avatar",
		children: d
	});
}, Zt = new ie({
	html: !0,
	linkify: !0,
	typographer: !0,
	breaks: !0
}), Qt = Zt.renderer.rules.link_open || function(e, t, n, r, i) {
	return i.renderToken(e, t, n);
};
Zt.renderer.rules.link_open = function(e, t, n, r, i) {
	let a = e[t];
	return a.attrIndex("href") >= 0 && (a.attrPush(["target", "_blank"]), a.attrPush(["rel", "noopener noreferrer"])), Qt(e, t, n, r, i);
}, Zt.options.highlight = function(e, t) {
	let n = Zt.utils.escapeHtml(e);
	return t ? `<pre class="code-block"><code class="language-${t}">${n}</code></pre>` : `<pre class="code-block"><code>${n}</code></pre>`;
};
function $t(e) {
	if (!e) return "";
	let t = Zt.render(e);
	return ae.sanitize(t, {
		ADD_ATTR: ["target", "rel"],
		ADD_TAGS: ["iframe"]
	});
}
//#endregion
//#region src/components/messages/timeline/MessageList.tsx
var en = (e) => {
	let t = e.steps.find((e) => e.type === "content");
	return t ? t.msg.agent || "AI" : e.steps.find((e) => e.msg.agent && e.type !== "ask")?.msg.agent || "AI";
}, tn = (e) => e.steps.length > 0 ? U(e.steps[e.steps.length - 1].msg.timestamp) : "", nn = (e) => typeof e == "string" ? e.split("/").pop() || e.split("\\").pop() || e : e.fileName || "", rn = (e) => e.type === "ask" ? `${e.msg.fromAgent} → ${e.msg.toAgent || e.msg.agent}` : e.type === "reason" ? `${e.msg.agent} 正在思考分析...` : e.type === "tool" && e.tool ? `执行 ${e.tool.toolName}` : e.msg.role === H.TOOL_RESULT ? "工具返回结果" : e.msg.role === H.COMMAND ? "执行命令" : e.msg.role === H.OPTION ? "选项" : e.msg.agent || "处理中...", an = (e) => e.role === H.ERROR, on = (e, t, n, r, i) => e.msg.isStreaming ? !0 : t === r.length - 1 && i ? !r[t].steps.slice(n + 1).some((e) => e.type === "content") : !1, sn = (e, t) => {
	try {
		return JSON.parse(e.args)[t] || "";
	} catch {
		return "";
	}
}, cn = ({ status: e }) => {
	switch (e) {
		case "pending": return /* @__PURE__ */ z("span", { style: {
			display: "inline-block",
			width: 8,
			height: 8,
			borderRadius: "50%",
			background: "#f59e0b",
			animation: "agent-chat-pulse 1.5s infinite"
		} });
		case "success": return /* @__PURE__ */ z("span", {
			style: {
				color: "#10b981",
				fontSize: 12,
				fontWeight: "bold"
			},
			children: "✓"
		});
		case "failed": return /* @__PURE__ */ z("span", {
			style: {
				color: "#ef4444",
				fontSize: 12,
				fontWeight: "bold"
			},
			children: "✗"
		});
		default: return null;
	}
}, ln = e(({ messages: e, currentAgent: a, isGroupChat: s, showToolCallLog: c, isLoading: l, entryAgent: u, groups: d, theme: f = "dark", defaultQuerys: p = [], isUserDefaultAvatar: m = !0, userDisplayName: h = "", onSelectQuery: _, onLoadMore: x, hasMore: C = !1, isLoadingMore: T = !1, children: O }, j) => {
	let M = o(null), N = o(null), P = o(T), I = qt(e, a, s, {
		entryAgent: u,
		groups: d
	});
	r(j, () => ({ scrollToBottom: () => {
		M.current && (M.current.scrollTop = M.current.scrollHeight);
	} })), i(() => {
		let e = P.current;
		P.current = T;
		let t = M.current;
		if (e && !T && N.current && t) {
			let { scrollHeight: e, scrollTop: n } = N.current;
			t.scrollTop = n + (t.scrollHeight - e);
		}
	}, [T]), n(() => {
		if (!T) {
			if (N.current) {
				N.current = null;
				return;
			}
			M.current && (M.current.scrollTop = M.current.scrollHeight);
		}
	}, [I, T]);
	let L = t(() => {
		let e = M.current;
		!e || !C || T || e.scrollTop <= 50 && x && (N.current = {
			scrollHeight: e.scrollHeight,
			scrollTop: e.scrollTop
		}, x());
	}, [
		C,
		T,
		x
	]);
	return /* @__PURE__ */ B("div", {
		className: ["msglist-container", f === "light" ? "msglist-theme-light" : ""].filter(Boolean).join(" "),
		ref: M,
		onScroll: L,
		children: [
			/* @__PURE__ */ z("div", {
				className: "msglist-sticky-header",
				children: O
			}),
			I.length === 0 && !l && /* @__PURE__ */ z("div", {
				className: "msglist-empty",
				children: p.length > 0 ? /* @__PURE__ */ B("div", {
					className: "msglist-default-queries",
					children: [/* @__PURE__ */ z("div", {
						className: "msglist-default-queries__title",
						children: "有什么可以帮你的？"
					}), /* @__PURE__ */ z("div", {
						className: "msglist-default-queries__list",
						children: p.map((e, t) => /* @__PURE__ */ B("div", {
							className: "msglist-default-query-card",
							onClick: () => _?.(e),
							children: [/* @__PURE__ */ z(A, {
								size: 16,
								className: "msglist-default-query-icon"
							}), /* @__PURE__ */ z("span", { children: e })]
						}, t))
					})]
				}) : /* @__PURE__ */ z("div", {
					style: {
						color: "var(--ml-text-secondary, #8b949e)",
						fontSize: 14
					},
					children: "开始一段新的对话吧"
				})
			}),
			/* @__PURE__ */ B("div", {
				className: "msglist-turns",
				children: [I.map((e, t) => /* @__PURE__ */ B("div", {
					className: "msglist-turn",
					children: [e.userMsg && /* @__PURE__ */ z("div", {
						className: "msglist-user-block",
						children: /* @__PURE__ */ B("div", {
							className: "msglist-body-row msglist-body-row--user",
							children: [/* @__PURE__ */ B("div", {
								className: "msglist-user-bubble",
								children: [
									e.userMsg.documents && e.userMsg.documents.length > 0 && /* @__PURE__ */ z("div", {
										className: "msglist-user-docs",
										children: e.userMsg.documents.map((e, t) => /* @__PURE__ */ B("div", {
											className: "msglist-doc-item",
											children: [/* @__PURE__ */ z(E, {
												size: 12,
												className: "text-blue-400"
											}), /* @__PURE__ */ z("span", {
												className: "msglist-doc-name",
												children: nn(e)
											})]
										}, t))
									}),
									/* @__PURE__ */ z("div", {
										className: "msglist-user-text",
										children: e.userMsg.content
									}),
									/* @__PURE__ */ z("div", {
										className: "msglist-user-time",
										children: U(e.userMsg.timestamp)
									})
								]
							}), /* @__PURE__ */ z("div", {
								className: "msglist-user-avatar",
								children: m ? /* @__PURE__ */ z(F, { size: 14 }) : h
							})]
						})
					}), e.steps.length > 0 && /* @__PURE__ */ B("div", {
						className: "msglist-ai-block",
						children: [/* @__PURE__ */ B("div", {
							className: "msglist-header-row msglist-header-row--ai",
							children: [/* @__PURE__ */ B("div", {
								className: "msglist-header-left",
								children: [/* @__PURE__ */ z(Xt, {
									agentName: en(e),
									size: "small"
								}), /* @__PURE__ */ z("span", {
									className: "msglist-header-name",
									children: en(e)
								})]
							}), /* @__PURE__ */ z("span", {
								className: "msglist-header-time",
								children: tn(e)
							})]
						}), /* @__PURE__ */ z("div", {
							className: "msglist-body-row msglist-body-row--ai",
							children: /* @__PURE__ */ B("div", {
								className: "msglist-timeline",
								children: [e.steps.map((e, n) => /* @__PURE__ */ B("div", {
									className: "msglist-step",
									children: [/* @__PURE__ */ z("div", { className: e.type === "content" ? "msglist-final-dot" : "msglist-step-dot" }), /* @__PURE__ */ B("div", {
										className: "msglist-step-inner",
										children: [
											e.type === "ask" && /* @__PURE__ */ B("div", {
												className: "msglist-step-simple",
												children: [
													/* @__PURE__ */ z(w, {
														size: 12,
														className: "msglist-icon-dim"
													}),
													/* @__PURE__ */ z("span", {
														className: "msglist-step-mono",
														children: e.msg.fromAgent
													}),
													/* @__PURE__ */ z(g, {
														size: 10,
														className: "msglist-icon-dim mx-0.5"
													}),
													/* @__PURE__ */ B("span", {
														className: "msglist-step-mono-light",
														children: ["唤起 ", e.msg.toAgent || e.msg.agent]
													})
												]
											}),
											e.type === "reason" && /* @__PURE__ */ B("details", {
												className: "msglist-tool-card msglist-tool-think",
												children: [/* @__PURE__ */ B("summary", {
													className: "msglist-tool-summary-card",
													children: [/* @__PURE__ */ B("div", {
														className: "msglist-tool-card-inner",
														children: [/* @__PURE__ */ z("div", {
															className: "msglist-tool-icon-wrap msglist-tool-icon-emerald",
															children: /* @__PURE__ */ z(y, {
																size: 12,
																className: "text-emerald-400"
															})
														}), /* @__PURE__ */ B("span", {
															className: "msglist-tool-label",
															children: ["智能体思考 ", /* @__PURE__ */ B("span", {
																className: "text-emerald-400/60",
																children: ["· ", e.msg.agent]
															})]
														})]
													}), /* @__PURE__ */ B("div", {
														className: "msglist-tool-card-right",
														children: [on(e, t, n, I, l) ? /* @__PURE__ */ z(k, {
															size: 12,
															className: "text-emerald-400 msglist-spin"
														}) : /* @__PURE__ */ z(b, {
															size: 12,
															className: "text-green-500"
														}), /* @__PURE__ */ z(S, {
															size: 12,
															className: "msglist-chevron"
														})]
													})]
												}), /* @__PURE__ */ z("div", {
													className: "msglist-tool-detail-body",
													children: e.msg.reasonContent
												})]
											}),
											e.type === "tool" && e.tool && /* @__PURE__ */ B(re, { children: [
												e.tool.toolName === "runAgent" && /* @__PURE__ */ B("div", {
													className: "msglist-tool-card msglist-tool-dispatch",
													children: [/* @__PURE__ */ B("div", {
														className: "msglist-tool-card-inner",
														children: [/* @__PURE__ */ z("div", {
															className: "msglist-tool-icon-wrap msglist-tool-icon-purple",
															children: /* @__PURE__ */ z(w, {
																size: 12,
																className: "text-purple-400"
															})
														}), /* @__PURE__ */ B("span", {
															className: "msglist-tool-label",
															children: ["智能体调度: ", /* @__PURE__ */ z("span", {
																className: "msglist-tool-highlight-purple",
																children: sn(e.tool, "agentName") || sn(e.tool, "agent") || "Unknown"
															})]
														})]
													}), /* @__PURE__ */ z(cn, { status: e.tool.status })]
												}),
												e.tool.toolName === "loadSkill" && /* @__PURE__ */ B("div", {
													className: "msglist-tool-card msglist-tool-skill",
													children: [/* @__PURE__ */ B("div", {
														className: "msglist-tool-card-inner",
														children: [/* @__PURE__ */ z("div", {
															className: "msglist-tool-icon-wrap msglist-tool-icon-amber",
															children: /* @__PURE__ */ z(v, {
																size: 12,
																className: "text-amber-400"
															})
														}), /* @__PURE__ */ B("span", {
															className: "msglist-tool-label",
															children: ["加载技能: ", /* @__PURE__ */ z("span", {
																className: "msglist-tool-highlight-amber",
																children: sn(e.tool, "skillName") || sn(e.tool, "skill") || "Unknown"
															})]
														})]
													}), /* @__PURE__ */ z(cn, { status: e.tool.status })]
												}),
												e.tool.toolName !== "runAgent" && e.tool.toolName !== "loadSkill" && /* @__PURE__ */ B("details", {
													className: "msglist-tool-card msglist-tool-generic",
													children: [/* @__PURE__ */ B("summary", {
														className: "msglist-tool-summary-card",
														children: [/* @__PURE__ */ B("div", {
															className: "msglist-tool-card-inner",
															children: [/* @__PURE__ */ z("div", {
																className: "msglist-tool-icon-wrap msglist-tool-icon-yellow",
																children: /* @__PURE__ */ z(R, {
																	size: 12,
																	className: "text-yellow-400"
																})
															}), /* @__PURE__ */ B("span", {
																className: "msglist-tool-label",
																children: ["工具调用: ", /* @__PURE__ */ z("span", {
																	className: "msglist-tool-highlight-yellow",
																	children: e.tool.toolName
																})]
															})]
														}), /* @__PURE__ */ B("div", {
															className: "msglist-tool-card-right",
															children: [/* @__PURE__ */ z(cn, { status: e.tool.status }), /* @__PURE__ */ z(S, {
																size: 12,
																className: "msglist-chevron"
															})]
														})]
													}), /* @__PURE__ */ B("div", {
														className: "msglist-tool-detail-body",
														children: [
															e.tool.args && /* @__PURE__ */ B("div", { children: [
																/* @__PURE__ */ z("span", {
																	className: "text-purple-400/80",
																	children: "Args:"
																}),
																" ",
																e.tool.args
															] }),
															e.tool.status === "success" && e.tool.result && /* @__PURE__ */ B("div", { children: [
																/* @__PURE__ */ z("span", {
																	className: "text-green-400/80",
																	children: "Result:"
																}),
																" ",
																e.tool.result
															] }),
															e.tool.status === "failed" && e.tool.error && /* @__PURE__ */ B("div", {
																className: "text-red-400/80",
																children: ["Error: ", e.tool.error]
															})
														]
													})]
												})
											] }),
											e.type === "content" && /* @__PURE__ */ z("div", {
												className: "msglist-final-body",
												children: /* @__PURE__ */ B("div", {
													className: ["msglist-final-text", an(e.msg) ? "msglist-final-error" : ""].filter(Boolean).join(" "),
													children: [an(e.msg) ? /* @__PURE__ */ B("div", {
														className: "msglist-error-inline",
														children: [/* @__PURE__ */ z(ee, { size: 14 }), /* @__PURE__ */ z("span", { children: e.msg.content })]
													}) : /* @__PURE__ */ z("div", { dangerouslySetInnerHTML: { __html: $t(e.msg.content || "") } }), e.msg.isStreaming && /* @__PURE__ */ z("span", { className: "msglist-cursor" })]
												})
											}),
											e.type === "askUser" && /* @__PURE__ */ B(re, { children: [/* @__PURE__ */ z("div", {
												className: "msglist-tool-card msglist-tool-askuser",
												children: /* @__PURE__ */ B("div", {
													className: "msglist-tool-card-inner",
													children: [/* @__PURE__ */ z("div", {
														className: "msglist-tool-icon-wrap msglist-tool-icon-amber",
														children: /* @__PURE__ */ z(D, {
															size: 12,
															className: "text-amber-400"
														})
													}), /* @__PURE__ */ B("span", {
														className: "msglist-tool-label",
														children: ["智能体询问: ", /* @__PURE__ */ z("span", {
															className: "msglist-tool-highlight-amber",
															children: e.msg.agent
														})]
													})]
												})
											}), e.msg.content && /* @__PURE__ */ z("div", {
												className: "msglist-askuser-body",
												children: /* @__PURE__ */ z("div", {
													className: "msglist-askuser-text",
													dangerouslySetInnerHTML: { __html: $t(e.msg.content || "") }
												})
											})] }),
											e.type !== "ask" && e.type !== "reason" && e.type !== "tool" && e.type !== "content" && e.type !== "askUser" && /* @__PURE__ */ B("div", {
												className: "msglist-step-simple",
												children: [/* @__PURE__ */ z(w, {
													size: 12,
													className: "msglist-icon-dim"
												}), /* @__PURE__ */ z("span", {
													className: "msglist-step-mono",
													children: rn(e)
												})]
											}),
											e.msg.timestamp && /* @__PURE__ */ z("span", {
												className: "msglist-step-time",
												children: U(e.msg.timestamp)
											})
										]
									})]
								}, "step-" + n)), t === I.length - 1 && l && e.steps.length === 0 && /* @__PURE__ */ B("div", {
									className: "msglist-loading-step",
									children: [/* @__PURE__ */ z("div", { className: "msglist-step-dot-sm" }), /* @__PURE__ */ B("div", {
										className: "msglist-loading-dots",
										children: [
											/* @__PURE__ */ z("span", { className: "msglist-dot msglist-dot-1" }),
											/* @__PURE__ */ z("span", { className: "msglist-dot msglist-dot-2" }),
											/* @__PURE__ */ z("span", { className: "msglist-dot msglist-dot-3" })
										]
									})]
								})]
							})
						})]
					})]
				}, t)), l && I.length === 0 && /* @__PURE__ */ B("div", {
					className: "msglist-ai-block",
					children: [/* @__PURE__ */ z("div", {
						className: "msglist-header-row msglist-header-row--ai",
						children: /* @__PURE__ */ B("div", {
							className: "msglist-header-left",
							children: [/* @__PURE__ */ z("div", {
								className: "msglist-ai-avatar-icon",
								children: /* @__PURE__ */ z(k, {
									size: 14,
									className: "text-white msglist-spin"
								})
							}), /* @__PURE__ */ z("span", {
								className: "msglist-header-name",
								children: "AI"
							})]
						})
					}), /* @__PURE__ */ z("div", {
						className: "msglist-body-row msglist-body-row--ai",
						children: /* @__PURE__ */ B("div", {
							className: "msglist-loading-dots",
							children: [
								/* @__PURE__ */ z("span", { className: "msglist-dot msglist-dot-1" }),
								/* @__PURE__ */ z("span", { className: "msglist-dot msglist-dot-2" }),
								/* @__PURE__ */ z("span", { className: "msglist-dot msglist-dot-3" })
							]
						})
					})]
				})]
			}),
			T && /* @__PURE__ */ z("div", {
				className: "msglist-loading-more",
				children: /* @__PURE__ */ z("span", { children: "加载中..." })
			})
		]
	});
});
ln.displayName = "TimelineMessageList";
//#endregion
//#region src/components/common/TokensBar.tsx
function un(e) {
	return e >= 1024 * 1024 ? `${(e / (1024 * 1024)).toFixed(1)}M` : e >= 1024 ? `${(e / 1024).toFixed(1)}K` : e.toString();
}
function dn(e) {
	return e >= 256 * 1024 ? "tokens-bar__fill--red" : e >= 128 * 1024 ? "tokens-bar__fill--amber" : "tokens-bar__fill--emerald";
}
var fn = ({ agentName: e, tokens: t, maxTokens: n = 1024 * 1024 }) => {
	if (!e) return null;
	let r = Math.min(t / n * 100, 100), i = dn(t);
	return /* @__PURE__ */ B("div", {
		className: "tokens-bar",
		children: [
			/* @__PURE__ */ z("span", {
				className: "tokens-bar__name",
				children: e
			}),
			/* @__PURE__ */ z("span", {
				className: "tokens-bar__value",
				children: un(t)
			}),
			/* @__PURE__ */ B("div", {
				className: "tokens-bar__track-wrapper",
				children: [/* @__PURE__ */ B("div", {
					className: "tokens-bar__track",
					children: [
						/* @__PURE__ */ z("div", {
							className: `tokens-bar__fill ${i}`,
							style: { width: `${r}%` }
						}),
						/* @__PURE__ */ z("div", { className: "tokens-bar__tick tokens-bar__tick--32k" }),
						/* @__PURE__ */ z("div", { className: "tokens-bar__tick tokens-bar__tick--64k" }),
						/* @__PURE__ */ z("div", { className: "tokens-bar__tick tokens-bar__tick--128k" }),
						/* @__PURE__ */ z("div", { className: "tokens-bar__tick tokens-bar__tick--256k" }),
						/* @__PURE__ */ z("div", { className: "tokens-bar__tick tokens-bar__tick--512k" })
					]
				}), /* @__PURE__ */ B("div", {
					className: "tokens-bar__labels",
					children: [
						/* @__PURE__ */ z("span", { children: "0" }),
						/* @__PURE__ */ z("span", { children: "128K" }),
						/* @__PURE__ */ z("span", { children: "256K" }),
						/* @__PURE__ */ z("span", { children: "512K" }),
						/* @__PURE__ */ z("span", { children: "1M" })
					]
				})]
			})
		]
	});
}, pn = 10 * 1024 * 1024, mn = ({ isConnected: e, isLoading: r, connectionError: i = null, theme: c = "dark", showAgentInfo: l = !1, isEnableFile: f = !0, input_isEnableKnowledge: p = !0, placeholder: m = "", showTokensBar: ee = !1, currentAgentName: h = "", agentTokens: g = {}, horizontalAlignment: y = "Full", margin: b = "", inputWidth: x = "", inputAgentsData: S = [], boundAgent: C = null, boundAgentType: w = "agent", onSend: T, onTerminate: D }) => {
	let [O, k] = s(""), [A, M] = s([]), [N, L] = s(!1), [R, ie] = s([]), [ae, V] = s(!1), [H, oe] = s(""), [se, U] = s(-1), [ce, le] = s(0), [W, G] = s(null), [ue, de] = s([]), [K, fe] = s([]), [pe, me] = s(!1), [he, ge] = s(""), [_e, ve] = s(-1), [ye, be] = s(0), [q, xe] = s(!1), [Se, Ce] = s(!1), we = o(!1), Te = o(!1), Ee = o(null), De = o(null), Oe = o(null), ke = o(null), Ae = o(null), je = o(null), Me = o(null), Ne = o(null), Pe = a(() => R.length === 1, [R]), Fe = a(() => {
		let e = H.toLowerCase();
		return R.filter((t) => t.name.toLowerCase().includes(e) || t.description && t.description.toLowerCase().includes(e));
	}, [R, H]), Ie = a(() => {
		let e = he.toLowerCase();
		return ue.filter((t) => t.group_name.toLowerCase().includes(e) || t.description && t.description.toLowerCase().includes(e));
	}, [ue, he]), Le = a(() => W ? W.name : Pe && R.length > 0 ? R[0].name : h || C || "", [
		W,
		Pe,
		R,
		h,
		C
	]), Re = a(() => Le ? g[Le] ?? 0 : 0, [Le, g]), ze = a(() => m || (e ? C ? `输入消息... (默认发送给${w === "group" ? "智能体组" : "智能体"}: ${C})` : "输入消息... (请使用 @ 指定智能体)" : "未连接"), [
		m,
		e,
		C,
		w
	]), Be = a(() => {
		let e = b.trim().split(/\s+/), t = e[0] || "", n = e[1] || e[0] || "", r = x;
		switch (y) {
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
		y,
		b,
		x
	]), Ve = t(async () => {
		if (St() && !we.current) {
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
				ie([...n, ...r]);
			} catch (e) {
				console.error("[InputArea] 加载智能体列表失败:", e);
			}
		}
	}, []), He = t(async () => {
		if (p && St() && !Te.current) {
			Te.current = !0;
			try {
				let e = await vt.listGroups().catch(() => ({ data: { groups: [] } })), t = e.data?.groups || e.groups || [];
				de(t);
			} catch (e) {
				console.error("[InputArea] 加载知识库列表失败:", e);
			}
		}
	}, [p]);
	n(() => {
		S.length > 0 ? (ie(S.map((e) => ({
			name: e.agent,
			type: e.agentType,
			description: e.describe
		}))), we.current = !0) : Ve();
	}, [S, Ve]), n(() => {
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
			!(ke.current && ke.current.contains(t) || Ae.current && Ae.current.contains(t)) && Ee.current !== t && V(!1), !(Ne.current && Ne.current.contains(t) || je.current && je.current.contains(t)) && Ee.current !== t && me(!1), !(Me.current && Me.current.contains(t)) && Ee.current !== t && Ce(!1);
		};
		return document.addEventListener("mousedown", e), () => document.removeEventListener("mousedown", e);
	}, []);
	let We = t((e) => {
		let t = e.target.value, n = e.target.selectionStart || 0;
		k(t);
		let r = t.slice(0, n);
		if (p) {
			let e = r.lastIndexOf("#");
			if (e !== -1) {
				let t = r.slice(e + 1);
				if (!t.includes(" ") && !t.includes("\n")) {
					ge(t), ve(e), me(!0), be(0), V(!1);
					return;
				}
			}
		}
		if (!Pe) {
			let e = r.lastIndexOf("@");
			if (e !== -1) {
				let t = r.slice(e + 1);
				if (!t.includes(" ") && !t.includes("\n")) {
					oe(t), U(e), V(!0), le(0), me(!1);
					return;
				}
			}
		}
		V(!1), oe(""), U(-1), me(!1), ge(""), ve(-1);
	}, [p, Pe]), Ge = t((e, t = !1) => {
		if (t) {
			G({
				type: e.type,
				name: e.name
			}), V(!1), oe(""), U(-1), Ee.current?.focus();
			return;
		}
		if (se === -1) return;
		let n = O.slice(0, se), r = O.slice(se + 1 + H.length);
		k(n + r), G({
			type: e.type,
			name: e.name
		}), V(!1), oe(""), U(-1), requestAnimationFrame(() => {
			let e = Ee.current;
			if (e) {
				let t = n.length;
				e.setSelectionRange(t, t), e.focus();
			}
		});
	}, [
		O,
		se,
		H
	]), Ke = t(() => {
		G(null);
	}, []), qe = t(() => {
		V((e) => (e || Ve(), !e));
	}, [Ve]), Je = t(() => {
		me((e) => (e || He(), !e));
	}, [He]), Ye = t(() => {
		Ce((e) => (e || (V(!1), me(!1)), !e));
	}, []), Xe = t((e) => {
		if (fe((t) => t.includes(e.group_id) ? t : [...t, e.group_id]), _e !== -1) {
			let e = O.slice(0, _e), t = O.slice(_e + 1 + he.length);
			k(e + t);
		}
		me(!1), ge(""), ve(-1), requestAnimationFrame(() => {
			Ee.current?.focus();
		});
	}, [
		O,
		_e,
		he
	]), Ze = t((e) => {
		fe((t) => t.filter((t) => t !== e));
	}, []), Qe = t((e) => {
		if (pe && Ie.length > 0) {
			if (e.key === "ArrowDown") {
				e.preventDefault(), be((e) => (e + 1) % Ie.length);
				return;
			}
			if (e.key === "ArrowUp") {
				e.preventDefault(), be((e) => (e - 1 + Ie.length) % Ie.length);
				return;
			}
			if (e.key === "Enter") {
				e.preventDefault(), Xe(Ie[ye]);
				return;
			}
			if (e.key === "Escape") {
				me(!1);
				return;
			}
		}
		if (ae && Fe.length > 0) {
			if (e.key === "ArrowDown") {
				e.preventDefault(), le((e) => (e + 1) % Fe.length);
				return;
			}
			if (e.key === "ArrowUp") {
				e.preventDefault(), le((e) => (e - 1 + Fe.length) % Fe.length);
				return;
			}
			if (e.key === "Enter" || e.key === "Tab") {
				e.preventDefault(), Ge(Fe[ce]);
				return;
			}
			if (e.key === "Escape") {
				V(!1);
				return;
			}
		}
		e.key === "Enter" && !e.shiftKey && (e.preventDefault(), nt());
	}, [
		pe,
		Ie,
		ye,
		Xe,
		ae,
		Fe,
		ce,
		Ge
	]), $e = (e) => e < 1024 ? e + " B" : e < 1024 * 1024 ? (e / 1024).toFixed(2) + " KB" : (e / (1024 * 1024)).toFixed(2) + " MB", et = t((e) => e.size > pn ? (d.error(`文件 ${e.name} 大小超过 10MB 限制`), !1) : (M((t) => [...t, {
		name: e.name,
		size: e.size,
		file: e
	}]), !1), []), tt = t((e) => {
		M((t) => t.filter((t, n) => n !== e));
	}, []), nt = t(async () => {
		if (!O.trim() && A.length === 0 || !e) return;
		let t;
		if (W) t = {
			type: W.type,
			name: W.name
		};
		else if (Pe && R.length > 0) {
			let e = R[0];
			t = {
				type: e.type,
				name: e.name
			};
		} else C && (t = {
			type: w,
			name: C
		});
		if (!t) {
			d.warning("请使用 @ 指定目标智能体");
			return;
		}
		let n = [];
		if (A.length > 0) {
			L(!0);
			try {
				let e = await _t.uploadFiles(A.map((e) => e.file));
				if (!e.success || !e.data) {
					d.error("文件上传失败: " + (e.message || "操作失败")), L(!1);
					return;
				}
				let t = e.data;
				n = Array.isArray(t) ? t : [t];
			} catch (e) {
				console.error("[InputArea] 文件上传失败:", e), d.error("文件上传失败，请重试"), L(!1);
				return;
			} finally {
				L(!1);
			}
		}
		let r = K.length > 0 ? [...K] : void 0;
		T?.(O, n, t, r), k(""), M([]);
	}, [
		O,
		A,
		e,
		W,
		Pe,
		R,
		C,
		w,
		K,
		T
	]);
	return /* @__PURE__ */ B("div", {
		className: `input-area ${c === "light" ? "input-area--light" : "input-area--dark"}`,
		children: [
			i && /* @__PURE__ */ z("div", {
				className: "error-banner",
				children: /* @__PURE__ */ z("div", {
					className: "ia-error-alert",
					children: i
				})
			}),
			p && K.length > 0 && /* @__PURE__ */ z("div", {
				className: "knowledge-tag-wrapper",
				children: K.map((e) => /* @__PURE__ */ B("span", {
					className: "knowledge-tag",
					children: [
						/* @__PURE__ */ z(v, {
							size: 14,
							className: "knowledge-tag__icon"
						}),
						/* @__PURE__ */ z("span", { children: ue.find((t) => t.group_id === e)?.group_name || e }),
						/* @__PURE__ */ z("button", {
							className: "knowledge-tag__close",
							onClick: () => Ze(e),
							children: /* @__PURE__ */ z(ne, { size: 14 })
						})
					]
				}, e))
			}),
			A.length > 0 && /* @__PURE__ */ z("div", {
				className: "uploaded-files",
				children: A.map((e, t) => /* @__PURE__ */ B("span", {
					className: "file-tag",
					children: [
						/* @__PURE__ */ z(E, { size: 14 }),
						/* @__PURE__ */ z("span", { children: e.name }),
						/* @__PURE__ */ B("span", {
							className: "file-size",
							children: [
								"(",
								$e(e.size),
								")"
							]
						}),
						/* @__PURE__ */ z("button", {
							className: "file-tag__close",
							onClick: () => tt(t),
							children: /* @__PURE__ */ z(ne, { size: 14 })
						})
					]
				}, t))
			}),
			/* @__PURE__ */ B("div", {
				className: "input-container",
				ref: Oe,
				style: Be,
				children: [
					/* @__PURE__ */ z("textarea", {
						ref: Ee,
						value: O,
						onChange: We,
						onKeyDown: Qe,
						className: "input-textarea",
						placeholder: ze,
						disabled: !e,
						rows: 1
					}),
					/* @__PURE__ */ B("div", {
						className: "input-toolbar",
						ref: De,
						children: [
							l && /* @__PURE__ */ z("div", {
								className: "toolbar-agent-selector",
								ref: Ae,
								children: Pe ? /* @__PURE__ */ B("button", {
									className: "toolbar-agent-btn toolbar-agent-btn--single",
									children: [R[0]?.type === "agent" ? /* @__PURE__ */ z(F, { size: 12 }) : /* @__PURE__ */ z(I, { size: 12 }), /* @__PURE__ */ z("span", {
										className: "toolbar-agent-name",
										children: R[0]?.name
									})]
								}) : /* @__PURE__ */ z(re, { children: W ? /* @__PURE__ */ B("button", {
									className: "toolbar-agent-btn toolbar-agent-btn--selected",
									onClick: qe,
									children: [
										W.type === "agent" ? /* @__PURE__ */ z(F, { size: 12 }) : /* @__PURE__ */ z(I, { size: 12 }),
										/* @__PURE__ */ z("span", {
											className: "toolbar-agent-name",
											children: W.name
										}),
										/* @__PURE__ */ z("button", {
											className: "toolbar-agent-remove",
											onClick: (e) => {
												e.stopPropagation(), Ke();
											},
											title: "移除",
											children: /* @__PURE__ */ z(ne, { size: 10 })
										})
									]
								}) : C ? /* @__PURE__ */ B("button", {
									className: "toolbar-agent-btn toolbar-agent-btn--bound",
									onClick: qe,
									children: [z(w === "agent" ? F : I, { size: 12 }), /* @__PURE__ */ z("span", {
										className: "toolbar-agent-name",
										children: C
									})]
								}) : /* @__PURE__ */ B("button", {
									className: "toolbar-agent-btn toolbar-agent-btn--empty",
									onClick: qe,
									children: [/* @__PURE__ */ z(I, { size: 12 }), /* @__PURE__ */ z("span", {
										className: "toolbar-agent-name",
										children: "选择智能体"
									})]
								}) })
							}),
							q ? /* @__PURE__ */ B("div", {
								className: "toolbar-more-selector",
								ref: Me,
								children: [/* @__PURE__ */ z("button", {
									className: "toolbar-btn toolbar-btn--more",
									onClick: Ye,
									title: "更多工具",
									children: /* @__PURE__ */ z(j, { size: 16 })
								}), Se && /* @__PURE__ */ B("div", {
									className: "more-panel",
									children: [f && /* @__PURE__ */ z(u, {
										beforeUpload: et,
										showUploadList: !1,
										multiple: !0,
										className: "more-panel__item",
										children: /* @__PURE__ */ B("button", {
											className: "more-panel__btn",
											disabled: !e || N,
											children: [/* @__PURE__ */ z(P, { size: 14 }), /* @__PURE__ */ z("span", { children: "添加附件" })]
										})
									}), p && /* @__PURE__ */ B("button", {
										className: "more-panel__btn",
										onClick: () => {
											Ce(!1), Je();
										},
										children: [/* @__PURE__ */ z(v, { size: 14 }), /* @__PURE__ */ B("span", { children: ["知识库", K.length > 0 ? ` (${K.length})` : ""] })]
									})]
								})]
							}) : /* @__PURE__ */ B(re, { children: [f && /* @__PURE__ */ z(u, {
								beforeUpload: et,
								showUploadList: !1,
								multiple: !0,
								className: "upload-trigger",
								children: /* @__PURE__ */ z("button", {
									className: "toolbar-btn toolbar-btn--attach",
									disabled: !e || N,
									title: "添加附件",
									children: /* @__PURE__ */ z(P, { size: 16 })
								})
							}), p && /* @__PURE__ */ z("div", {
								className: "toolbar-knowledge-selector",
								ref: je,
								children: K.length > 0 ? /* @__PURE__ */ B("button", {
									className: "toolbar-knowledge-btn toolbar-knowledge-btn--selected",
									onClick: Je,
									children: [/* @__PURE__ */ z(v, { size: 12 }), /* @__PURE__ */ z("span", {
										className: "toolbar-knowledge-count",
										children: K.length
									})]
								}) : /* @__PURE__ */ z("button", {
									className: "toolbar-knowledge-btn toolbar-knowledge-btn--empty",
									onClick: Je,
									children: /* @__PURE__ */ z(v, { size: 12 })
								})
							})] }),
							r ? /* @__PURE__ */ z("button", {
								className: "toolbar-btn toolbar-btn--stop",
								onClick: D,
								title: "终止对话",
								children: /* @__PURE__ */ z(te, { size: 16 })
							}) : /* @__PURE__ */ z("button", {
								className: "toolbar-btn toolbar-btn--send",
								disabled: !e || !O.trim() && A.length === 0 || N,
								onClick: nt,
								title: "发送",
								children: /* @__PURE__ */ z(_, { size: 14 })
							})
						]
					}),
					ae && /* @__PURE__ */ z("div", {
						ref: ke,
						className: "mention-panel mention-panel--toolbar",
						children: Fe.length === 0 ? /* @__PURE__ */ z("div", {
							className: "mention-empty",
							children: "搜索..."
						}) : /* @__PURE__ */ z("div", {
							className: "mention-list",
							children: Fe.map((e, t) => /* @__PURE__ */ B("div", {
								className: `mention-item ${t === ce ? "mention-item--active" : ""}`,
								onClick: () => Ge(e, se === -1),
								onMouseEnter: () => le(t),
								children: [
									e.type === "agent" ? /* @__PURE__ */ z(F, {
										size: 18,
										className: "mention-item__icon"
									}) : /* @__PURE__ */ z(I, {
										size: 18,
										className: "mention-item__icon"
									}),
									/* @__PURE__ */ B("div", {
										className: "mention-item__info",
										children: [/* @__PURE__ */ z("div", {
											className: "mention-item__name",
											children: e.name
										}), e.description && /* @__PURE__ */ z("div", {
											className: "mention-item__desc",
											children: e.description
										})]
									}),
									/* @__PURE__ */ z("span", {
										className: `mention-type-badge ${e.type === "agent" ? "mention-type-badge--agent" : "mention-type-badge--group"}`,
										children: e.type === "agent" ? "Agent" : "Group"
									})
								]
							}, `${e.type}-${e.name}`))
						})
					}),
					pe && /* @__PURE__ */ B("div", {
						ref: Ne,
						className: "knowledge-panel knowledge-panel--toolbar",
						children: [/* @__PURE__ */ B("div", {
							className: "knowledge-panel__header",
							children: [/* @__PURE__ */ z("span", { children: "选择知识库" }), K.length > 0 && /* @__PURE__ */ B("span", {
								className: "knowledge-panel__count",
								children: [
									"已选择 ",
									K.length,
									" 个知识库"
								]
							})]
						}), Ie.length === 0 ? /* @__PURE__ */ z("div", {
							className: "knowledge-panel__empty",
							children: "暂无可用知识库"
						}) : /* @__PURE__ */ z("div", {
							className: "knowledge-panel__list",
							children: Ie.map((e, t) => /* @__PURE__ */ B("div", {
								className: `knowledge-panel__item ${t === ye ? "knowledge-panel__item--active" : ""}`,
								onClick: () => Xe(e),
								onMouseEnter: () => be(t),
								children: [
									/* @__PURE__ */ z(v, {
										size: 18,
										className: "knowledge-panel__item-icon"
									}),
									/* @__PURE__ */ B("div", {
										className: "knowledge-panel__item-info",
										children: [/* @__PURE__ */ z("div", {
											className: "knowledge-panel__item-name",
											children: e.group_name
										}), e.description && /* @__PURE__ */ z("div", {
											className: "knowledge-panel__item-desc",
											children: e.description
										})]
									}),
									/* @__PURE__ */ z("span", {
										className: "knowledge-panel__item-count",
										children: e.doc_count
									})
								]
							}, e.group_id))
						})]
					})
				]
			}),
			ee && Le ? /* @__PURE__ */ z(fn, {
				agentName: Le,
				tokens: Re
			}) : ee ? /* @__PURE__ */ z("div", {
				className: "ia-no-agent-tip",
				children: /* @__PURE__ */ z("span", { children: "暂无配置智能体" })
			}) : null
		]
	});
};
//#endregion
//#region src/vendor/transport/core/RequestAtts.js
function hn(e) {
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
//#region node_modules/uuid/dist/stringify.js
var X = [];
for (let e = 0; e < 256; ++e) X.push((e + 256).toString(16).slice(1));
function gn(e, t = 0) {
	return (X[e[t + 0]] + X[e[t + 1]] + X[e[t + 2]] + X[e[t + 3]] + "-" + X[e[t + 4]] + X[e[t + 5]] + "-" + X[e[t + 6]] + X[e[t + 7]] + "-" + X[e[t + 8]] + X[e[t + 9]] + "-" + X[e[t + 10]] + X[e[t + 11]] + X[e[t + 12]] + X[e[t + 13]] + X[e[t + 14]] + X[e[t + 15]]).toLowerCase();
}
//#endregion
//#region node_modules/uuid/dist/rng.js
var _n, vn = /* @__PURE__ */ new Uint8Array(16);
function yn() {
	if (!_n) {
		if (typeof crypto > "u" || !crypto.getRandomValues) throw Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
		_n = crypto.getRandomValues.bind(crypto);
	}
	return _n(vn);
}
var bn = { randomUUID: typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto) };
//#endregion
//#region node_modules/uuid/dist/v4.js
function xn(e, t, n) {
	e ||= {};
	let r = e.random ?? e.rng?.() ?? yn();
	if (r.length < 16) throw Error("Random bytes length must be >= 16");
	if (r[6] = r[6] & 15 | 64, r[8] = r[8] & 63 | 128, t) {
		if (n ||= 0, n < 0 || n + 16 > t.length) throw RangeError(`UUID byte range ${n}:${n + 15} is out of buffer bounds`);
		for (let e = 0; e < 16; ++e) t[n + e] = r[e];
		return t;
	}
	return gn(r);
}
function Sn(e, t, n) {
	return bn.randomUUID && !t && !e ? bn.randomUUID() : xn(e, t, n);
}
//#endregion
//#region src/vendor/transport/interfaces/Transport.js
var Cn = class {
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
			id: Sn().toString(),
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
			params: hn(t)
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
}, wn = class extends Cn {
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
}, Tn = 50, Z = { current: null }, Q = { current: 0 }, En = { current: null }, Dn = { current: !1 }, On = { current: 0 }, kn = { current: /* @__PURE__ */ new Map() }, An = { current: /* @__PURE__ */ new Map() }, jn = [], Mn = { current: /* @__PURE__ */ new Map() };
function $() {
	return Pn && Pn.getState()?.user?.user?.agent || "main";
}
function Nn() {
	let e = c(), r = o(null), i = t((e) => (kn.current.has(e) || kn.current.set(e, {
		content: "",
		reasonContent: "",
		timer: null,
		lastFlushTime: 0
	}), kn.current.get(e)), []), a = t((t, n = !1) => {
		let r = kn.current.get(t);
		if (r) {
			if (r.content || r.reasonContent) {
				let n = An.current.get(t);
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
		}, Tn);
	}, [i, a]), l = t((e, t) => {
		let n = Mn.current.get(e) || [];
		return n.push(t), Mn.current.set(e, n), () => {
			let n = Mn.current.get(e) || [], r = n.indexOf(t);
			r >= 0 && n.splice(r, 1);
		};
	}, []), u = t((e) => (jn.push(e), () => {
		let t = jn.indexOf(e);
		t >= 0 && jn.splice(t, 1);
	}), []), d = t((e) => {
		r.current = e, Dt(e);
	}, []), f = t(async (t) => {
		try {
			let n = await Tt().get(`/messages/${t}`, { params: {
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
					let n = Pn.getState().chat.currentAgent;
					t.find((e) => e.name === n) || e(Se(t[0].name));
				}
			}
		} catch (e) {
			console.error("[agent-chat] 加载消息历史失败:", e);
		}
	}, [e]), p = t(async (t) => {
		let n = Q.current, r = kt().websocket, i = St(), a = r.path || "/ws";
		i && (a += `?token=${i}`);
		let o = new wn("fromWeb", r.host || "localhost", r.port || 3e3, a, r.reconnectDelay || 3e3);
		o.showLog = !1, o.timeout = -1, o.onConnectedEvent = () => {
			n === Q.current && e(ve(null));
		}, o.onDisconnectedEvent = () => {
			n === Q.current && (e(_e(!1)), e(ye(!1)));
		}, o.onReconnectedEvent = () => {
			n === Q.current && (e(ye(!1)), m(o, i, t));
		}, ee(o, n), Z.current = o, await o.start();
	}, [e]), m = t(async (t, n, i, a) => {
		let o = Q.current;
		try {
			let s = i || "", c = await t.request("messageChannel/handleAuth", [n, s]);
			if (o !== Q.current) return;
			if (c?.success && c?.sessionId) {
				let n = Pn.getState()?.user?.user?.agent || $();
				if (e(Se(n)), e(ye(!0)), e(xe(c.sessionId)), e(ve(null)), !a) {
					await f(c.sessionId), await t.request("messageChannel/startChannel", []), Dn.current = !0;
					for (let e of jn) try {
						e("init");
					} catch {}
				}
				e(_e(!0)), e(q(!1));
			} else {
				let t = c?.code || "AUTH_FAILED";
				e(be(t)), e(ve(c?.message || "认证失败")), e(q(!1)), [
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
			console.error("[agent-chat] 认证失败:", r), e(be("AUTH_FAILED")), e(ve("认证失败")), e(q(!1));
		}
	}, [e, f]), ee = t((t, n) => {
		t.registerHandleMethod("onWeb/assistantMessage", (t) => {
			if (n !== Q.current) return;
			let { message: r, agentName: a } = t, o = a || $();
			if (!An.current.has(o)) {
				let t = G();
				An.current.set(o, t), e(Pe({
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
			if (!An.current.has(o)) {
				let t = G();
				An.current.set(o, t), e(Pe({
					agent: o,
					id: t
				}));
			}
			let c = i(o);
			c.reasonContent += r || "", s(o);
		}), t.registerHandleMethod("onWeb/thinkingDone", (e) => {
			if (n !== Q.current) return;
			let t = e.agentName || $();
			a(t, !0);
		}), t.registerHandleMethod("onWeb/done", (t) => {
			if (n === Q.current) {
				for (let e of kn.current.keys()) a(e, !0);
				for (let [t, n] of An.current.entries()) e(Le({
					agent: t,
					id: n
				}));
				An.current.clear(), e(Be({}));
			}
		}), t.registerHandleMethod("onWeb/agentDone", (t) => {
			if (n !== Q.current) return;
			let r = t.agentName || $();
			a(r, !0);
			let i = An.current.get(r);
			i && (e(Le({
				agent: r,
				id: i
			})), An.current.delete(r)), e(Be({ agent: r })), e(we({
				name: r,
				description: ""
			}));
		}), t.registerHandleMethod("onWeb/error", (t) => {
			if (n !== Q.current) return;
			let r = t.agentName || $();
			e(q(!1)), An.current.has(r) && An.current.delete(r), e(De({
				agent: r,
				message: {
					id: G(),
					role: H.ERROR,
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
					id: G(),
					role: H.ASK_AGENT,
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
					id: G(),
					role: H.ASK_USER,
					content: i,
					timestamp: Date.now(),
					agent: r
				}
			}));
		}), t.registerHandleMethod("onWeb/userAnswer", (t) => {
			if (n !== Q.current) return;
			let r = t.agentName || $();
			e(De({
				agent: r,
				message: {
					id: G(),
					role: H.USER_ANSWER,
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
			if (n !== Q.current) return;
			let r = t.agentName || $();
			e(He({
				agent: r,
				toolName: t.toolName || "",
				result: t.result
			}));
		}), t.registerHandleMethod("onWeb/toolCallFailed", (t) => {
			if (n !== Q.current) return;
			let r = t.agentName || $();
			e(Ue({
				agent: r,
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
				let n = Mn.current.get(t) || [];
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
	]), h = t(async (t, n) => {
		if (Z.current && Z.current.isConnected()) return;
		if (En.current && Z.current) return En.current;
		Q.current++;
		let r = Q.current, i = (async () => {
			try {
				if (e(ve(null)), e(q(!0)), Z.current) {
					try {
						Z.current.dispose();
					} catch {}
					Z.current = null;
				}
				if (r !== Q.current || (await p(t), r !== Q.current)) return;
				let i = Z.current;
				if (i && !await i.waitForConnect?.(5e3) && r === Q.current) {
					e(ve("连接超时")), e(q(!1));
					return;
				}
				if (r !== Q.current) return;
				e(_e(!0));
				let a = St();
				a && Z.current ? await m(Z.current, a, t, n?.skipHistory) : (e(ve("未找到认证 Token")), e(q(!1))), On.current++;
			} catch (t) {
				if (r !== Q.current) return;
				console.error("[agent-chat] 连接失败:", t), e(ve(t?.message || "连接失败")), e(q(!1));
			} finally {
				r === Q.current && (En.current = null);
			}
		})();
		return En.current = i, i;
	}, [
		e,
		p,
		m
	]), g = t(() => {
		Q.current++;
		for (let e of kn.current.values()) e.timer && clearTimeout(e.timer);
		if (kn.current.clear(), An.current.clear(), Z.current) {
			try {
				Z.current.dispose();
			} catch {}
			Z.current = null;
		}
		En.current = null, Dn.current = !1, On.current = 0, e(_e(!1)), e(ye(!1));
	}, [e]), _ = t(async (t, n, r, i) => {
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
		})), e(q(!0));
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
			console.error("[agent-chat] 发送消息失败:", t), e(q(!1)), e(De({
				agent: o,
				message: {
					id: G(),
					role: H.ERROR,
					content: "发送消息失败: " + t.message,
					timestamp: Date.now()
				}
			}));
		}
	}, [e]), v = t(async () => {
		let t = Z.current;
		if (t) try {
			Dn.current ||= (await t.request("messageChannel/startChannel", []), !0);
			let n = await t.request("messageChannel/startNewSession", []);
			e(Ne()), e(xe(n?.sessionId || null));
			for (let e of jn) try {
				e("new");
			} catch {}
		} catch (e) {
			console.error("[agent-chat] 新建会话失败:", e);
		}
	}, [e]), y = t(async (t) => {
		let n = Z.current;
		if (!n) {
			console.error("[agent-chat] changeSession: transport 不存在");
			return;
		}
		try {
			console.log("[agent-chat] changeSession 开始, sessionId:", t), Dn.current ||= (console.log("[agent-chat] 启动消息通道 startChannel"), await n.request("messageChannel/startChannel", []), !0), console.log("[agent-chat] switchToHistory");
			let r = (await n.request("messageChannel/switchToHistory", [t]))?.sessionId || t;
			console.log("[agent-chat] switchToHistory 完成, newSessionId:", r), e(Ne()), e(xe(r)), console.log("[agent-chat] 开始加载历史消息"), await f(r), console.log("[agent-chat] 历史消息加载完成");
			for (let e of jn) try {
				e("switch");
			} catch {}
		} catch (e) {
			console.error("[agent-chat] 切换会话失败:", e);
		}
	}, [e, f]), b = t(async () => {
		let t = Z.current;
		if (t) try {
			await t.request("onWeb/terminateSession", []), e(q(!1));
		} catch (e) {
			console.error("[agent-chat] 终止会话失败:", e);
		}
	}, [e]), x = t(async (t) => {
		let n = Pn.getState(), r = n.chat.sessionId;
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
			let n = await Tt().get(`/messages/${r}`, { params: {
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
	}, [e]), S = t(async (t) => {
		if (t) {
			e(Ke(!0));
			try {
				let n = await Tt().get(`/messages/${t}/overview`), r = n?.data || n;
				e(Ge(r));
			} catch (t) {
				console.error("[agent-chat] 获取会话概览失败:", t), e(Ge(null));
			} finally {
				e(Ke(!1));
			}
		}
	}, [e]);
	return n(() => (On.current++, () => {
		On.current = Math.max(0, On.current - 1);
	}), []), {
		connect: h,
		disconnect: g,
		sendMessage: _,
		newSession: v,
		changeSession: y,
		terminateSession: b,
		loadMoreMessages: x,
		fetchSessionOverview: S,
		onSpecialEvent: l,
		onSessionSwitch: u,
		setOnTokenExpired: d,
		transportRef: Z
	};
}
var Pn;
function Fn(e) {
	Pn = e;
}
//#endregion
//#region src/layout/TimelineChatLayout.tsx
var In = e(({ theme: e = "dark", showAgentInfo: i = !1, isEnableFile: a = !0, input_isEnableKnowledge: s = !0, placeholder: u, defaultQuerys: f = [], showTokensBar: p = !1, isUserDefaultAvatar: m = !0, inputAreaHorizontalAlignment: ee = "Full", inputAreaMargin: h = "10px", inputWidth: g, inputAgentsData: _ = [], groups: v = [], autoConnect: y = !0 }, b) => {
	c();
	let x = o(null), S = Nn(), C = l(Ye), w = l(Xe), T = l(Ze), E = l(Qe), D = l($e), O = l(tt), k = l(nt), A = l(rt), j = l(it), M = l(at), N = l(Lt), P = l(Vt), F = l(Bt);
	n(() => {
		y && N && P && !w && S.connect();
	}, [
		y,
		N,
		P,
		w,
		S
	]), n(() => S.onSessionSwitch((e) => {
		setTimeout(() => x.current?.scrollToBottom?.(), 100);
	}), [S]), n(() => {
		E && d.error(E);
	}, [E]), n(() => {
		N || S.disconnect();
	}, [N, S]);
	let I = t((e, t, n, r) => {
		if (!w) {
			d.warning("未连接到服务器");
			return;
		}
		let i;
		if (n) i = {
			name: n.name,
			type: n.type === "group" ? "group" : "agent"
		};
		else {
			let e = F?.agent || "main";
			i = {
				name: e,
				type: v.some((t) => t.name === e) ? "group" : "agent"
			};
		}
		S.sendMessage(e, t, i, r), setTimeout(() => x.current?.scrollToBottom?.(), 100);
	}, [
		S,
		w,
		F,
		v
	]), L = t(async () => {
		if (!(!w || !T)) try {
			await S.terminateSession(), d.info("已终止当前对话");
		} catch (e) {
			d.error(e instanceof Error ? e.message : "终止失败");
		}
	}, [
		w,
		T,
		S
	]), R = t(() => {
		S.loadMoreMessages(O.length > 1 ? void 0 : D);
	}, [
		S,
		O.length,
		D
	]);
	return r(b, () => ({
		newSession: S.newSession,
		changeSession: S.changeSession,
		connect: S.connect,
		disconnect: S.disconnect
	})), /* @__PURE__ */ B("div", {
		className: `chat-layout ${e === "light" ? "chat-layout--light" : ""}`,
		style: {
			display: "flex",
			flexDirection: "column",
			height: "100%"
		},
		children: [/* @__PURE__ */ z(ln, {
			ref: x,
			messages: C,
			currentAgent: D,
			isGroupChat: O.length > 1,
			showToolCallLog: A,
			isLoading: T,
			theme: e,
			entryAgent: F?.agent,
			groups: v,
			defaultQuerys: f,
			isUserDefaultAvatar: m,
			hasMore: O.length > 1 ? j.__global__ !== !1 : j[D] !== !1,
			isLoadingMore: M,
			onLoadMore: R,
			onSelectQuery: (e) => I(e, [])
		}), /* @__PURE__ */ z(mn, {
			isConnected: w,
			isLoading: T,
			connectionError: E,
			theme: e,
			showAgentInfo: i,
			isEnableFile: a,
			input_isEnableKnowledge: s,
			placeholder: u,
			showTokensBar: p,
			currentAgentName: D,
			agentTokens: k,
			horizontalAlignment: ee,
			margin: h,
			inputWidth: g,
			inputAgentsData: _,
			boundAgent: F?.agent || null,
			boundAgentType: F?.agentType || "agent",
			onSend: I,
			onTerminate: L
		})]
	});
});
In.displayName = "TimelineChatLayout";
//#endregion
//#region src/components/messages/sample/MessageList.tsx
var Ln = e(({ messages: e, currentAgent: a, isGroupChat: s, showToolCallLog: c, isLoading: l, entryAgent: u, groups: d, theme: f = "dark", defaultQuerys: p = [], isUserDefaultAvatar: m = !0, userDisplayName: h = "", activityMaxEntries: _ = 5, onSelectQuery: S, onLoadMore: C, hasMore: T = !1, isLoadingMore: D = !1, children: O }, j) => {
	let M = o(null), N = o(null), P = o(D), I = qt(e, a, s, {
		entryAgent: u,
		groups: d
	});
	r(j, () => ({ scrollToBottom: () => {
		M.current && (M.current.scrollTop = M.current.scrollHeight);
	} })), i(() => {
		let e = P.current;
		P.current = D;
		let t = M.current;
		if (e && !D && N.current && t) {
			let { scrollHeight: e, scrollTop: n } = N.current;
			t.scrollTop = n + (t.scrollHeight - e);
		}
	}, [D]), n(() => {
		if (!D) {
			if (N.current) {
				N.current = null;
				return;
			}
			M.current && (M.current.scrollTop = M.current.scrollHeight);
		}
	}, [I, D]);
	let L = t(() => {
		let e = M.current;
		!e || !T || D || e.scrollTop <= 50 && C && (N.current = {
			scrollHeight: e.scrollHeight,
			scrollTop: e.scrollTop
		}, C());
	}, [
		T,
		D,
		C
	]), te = f === "light" ? "sml-theme-light" : "", ie = t((e) => typeof e == "string" ? e.split("/").pop() || e.split("\\").pop() || e : e.fileName || "", []), ae = t((e) => {
		let t = e.steps.find((e) => e.type === "content");
		return t ? t.msg.agent || "AI" : e.steps.find((e) => e.msg.agent && e.type !== "ask")?.msg.agent || "AI";
	}, []), V = t((e) => e.steps.length > 0 ? U(e.steps[e.steps.length - 1].msg.timestamp) : "", []), oe = t((e) => {
		for (let t = e.steps.length - 1; t >= 0; t--) if (e.steps[t].type === "content") return e.steps[t].msg.isStreaming === !0;
		return e.steps.length > 0;
	}, []), se = t((e) => {
		let t = le(e);
		return t ? t.role === H.ERROR : !1;
	}, []);
	function le(e) {
		for (let t = e.steps.length - 1; t >= 0; t--) if (e.steps[t].type === "content") return e.steps[t].msg;
		return null;
	}
	function W(e) {
		return e.steps.length === 0 ? null : e.steps[e.steps.length - 1].msg;
	}
	let G = t((e) => {
		let t = [];
		for (let n of e.steps) if (n.type === "ask") t.push({
			text: `${n.msg.fromAgent} → 唤起 ${n.msg.toAgent || n.msg.agent}`,
			timestamp: n.msg.timestamp,
			icon: /* @__PURE__ */ z(g, { size: 11 }),
			iconClass: "sml-icon-blue"
		});
		else if (n.type === "reason") t.push({
			text: `智能体思考 · ${n.msg.agent}`,
			timestamp: n.msg.timestamp,
			icon: /* @__PURE__ */ z(y, { size: 11 }),
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
				icon: z(r ? w : i ? v : R, { size: 11 }),
				iconClass: r ? "sml-icon-purple" : i ? "sml-icon-amber" : "sml-icon-yellow",
				status: n.tool.status
			});
		} else if (n.type === "content" && n.msg.content) {
			let e = n.msg.content.split("\n").filter((e) => e.trim() !== "");
			for (let r of e) t.push({
				text: r.length > 60 ? r.slice(0, 60) + "..." : r,
				timestamp: n.msg.timestamp,
				icon: /* @__PURE__ */ z(E, { size: 11 }),
				iconClass: "sml-icon-dim"
			});
		} else if (n.type === "step") {
			let e = n.msg.agent || "处理中...";
			n.msg.role === H.TOOL_RESULT ? e = "工具返回结果" : n.msg.role === H.COMMAND && (e = "执行命令"), t.push({
				text: e,
				timestamp: n.msg.timestamp,
				icon: /* @__PURE__ */ z(w, { size: 11 }),
				iconClass: "sml-icon-dim"
			});
		}
		return t.slice(-_);
	}, [_]);
	return I.length === 0 && !l ? /* @__PURE__ */ B("div", {
		className: `sml-container ${te}`,
		ref: M,
		children: [/* @__PURE__ */ z("div", {
			className: "sml-sticky-header",
			children: O
		}), /* @__PURE__ */ z("div", {
			className: "sml-empty",
			children: p.length > 0 ? /* @__PURE__ */ B("div", {
				className: "sml-default-queries",
				children: [/* @__PURE__ */ z("div", {
					className: "sml-default-queries__title",
					children: "有什么可以帮您的？"
				}), /* @__PURE__ */ z("div", {
					className: "sml-default-queries__list",
					children: p.map((e, t) => /* @__PURE__ */ B("div", {
						className: "sml-default-query-card",
						onClick: () => S?.(e),
						children: [/* @__PURE__ */ z(A, {
							size: 16,
							className: "sml-default-query-icon"
						}), /* @__PURE__ */ z("span", { children: e })]
					}, t))
				})]
			}) : /* @__PURE__ */ z("div", {
				style: {
					color: "var(--ml-text-secondary, #8b949e)",
					fontSize: 14
				},
				children: "开始一段新的对话吧"
			})
		})]
	}) : /* @__PURE__ */ B("div", {
		className: `sml-container ${te}`,
		ref: M,
		onScroll: L,
		children: [
			/* @__PURE__ */ z("div", {
				className: "sml-sticky-header",
				children: O
			}),
			/* @__PURE__ */ B("div", {
				className: "sml-turns",
				children: [I.map((e, t) => /* @__PURE__ */ B("div", {
					className: "sml-turn",
					children: [e.userMsg && /* @__PURE__ */ z("div", {
						className: "sml-user-block",
						children: /* @__PURE__ */ B("div", {
							className: "sml-body-row sml-body-row--user",
							children: [/* @__PURE__ */ B("div", {
								className: "sml-user-bubble",
								children: [
									e.userMsg.documents && e.userMsg.documents.length > 0 && /* @__PURE__ */ z("div", {
										className: "sml-user-docs",
										children: e.userMsg.documents.map((e, t) => /* @__PURE__ */ B("div", {
											className: "sml-doc-item",
											children: [/* @__PURE__ */ z(E, {
												size: 12,
												className: "text-blue-400"
											}), /* @__PURE__ */ z("span", {
												className: "sml-doc-name",
												children: ie(e)
											})]
										}, t))
									}),
									/* @__PURE__ */ z("div", {
										className: "sml-user-text",
										children: e.userMsg.content
									}),
									/* @__PURE__ */ z("div", {
										className: "sml-user-time",
										children: U(e.userMsg.timestamp)
									})
								]
							}), /* @__PURE__ */ z("div", {
								className: "sml-user-avatar",
								children: m ? /* @__PURE__ */ z(F, { size: 14 }) : /* @__PURE__ */ z(re, { children: h })
							})]
						})
					}), e.steps.length > 0 && /* @__PURE__ */ B("div", {
						className: "sml-ai-block",
						children: [/* @__PURE__ */ B("div", {
							className: "sml-header-row sml-header-row--ai",
							children: [/* @__PURE__ */ B("div", {
								className: "sml-header-left",
								children: [/* @__PURE__ */ z(Xt, {
									agentName: ae(e),
									size: "small"
								}), /* @__PURE__ */ z("span", {
									className: "sml-header-name",
									children: ae(e)
								})]
							}), /* @__PURE__ */ z("span", {
								className: "sml-header-time",
								children: V(e)
							})]
						}), /* @__PURE__ */ z("div", {
							className: "sml-body-row sml-body-row--ai",
							children: oe(e) ? /* @__PURE__ */ z("div", {
								className: "sml-activity-card",
								children: /* @__PURE__ */ B("details", {
									open: !0,
									className: "sml-activity-details",
									children: [/* @__PURE__ */ B("summary", {
										className: "sml-activity-summary",
										children: [/* @__PURE__ */ B("div", {
											className: "sml-activity-summary-left",
											children: [
												/* @__PURE__ */ z(k, {
													size: 12,
													className: "sml-activity-spinner"
												}),
												/* @__PURE__ */ z("span", {
													className: "sml-activity-label",
													children: "思考中..."
												}),
												/* @__PURE__ */ B("span", {
													className: "sml-activity-count",
													children: [
														"(",
														G(e).length,
														")"
													]
												})
											]
										}), /* @__PURE__ */ z(x, {
											size: 12,
											className: "sml-chevron"
										})]
									}), /* @__PURE__ */ B("div", {
										className: "sml-activity-body",
										children: [G(e).map((e, t) => /* @__PURE__ */ B("div", {
											className: "sml-activity-entry",
											children: [
												/* @__PURE__ */ z("span", {
													className: "sml-activity-time",
													children: ce(e.timestamp)
												}),
												/* @__PURE__ */ z("span", {
													className: `sml-activity-icon ${e.iconClass}`,
													children: e.icon
												}),
												/* @__PURE__ */ z("span", {
													className: "sml-activity-text",
													children: e.text
												}),
												e.status === "pending" && /* @__PURE__ */ z(k, {
													size: 10,
													className: "text-blue-500 animate-spin"
												}),
												e.status === "success" && /* @__PURE__ */ z(b, {
													size: 10,
													className: "text-green-500"
												}),
												e.status === "failed" && /* @__PURE__ */ z(ne, {
													size: 10,
													className: "text-red-500"
												})
											]
										}, `act-${t}`)), G(e).length === 0 && /* @__PURE__ */ B("div", {
											className: "sml-activity-loading",
											children: [
												/* @__PURE__ */ z("span", { className: "sml-dot sml-dot-1" }),
												/* @__PURE__ */ z("span", { className: "sml-dot sml-dot-2" }),
												/* @__PURE__ */ z("span", { className: "sml-dot sml-dot-3" })
											]
										})]
									})]
								})
							}) : /* @__PURE__ */ z("div", {
								className: "sml-final-block",
								children: se(e) ? /* @__PURE__ */ B("div", {
									className: "sml-error-body",
									children: [/* @__PURE__ */ B("div", {
										className: "sml-error-inline",
										children: [/* @__PURE__ */ z(ee, { size: 14 }), /* @__PURE__ */ z("span", { children: le(e)?.content })]
									}), /* @__PURE__ */ z("span", {
										className: "sml-final-time",
										children: W(e) ? U(W(e).timestamp) : ""
									})]
								}) : le(e) ? /* @__PURE__ */ B("div", {
									className: "sml-final-body",
									children: [/* @__PURE__ */ z("div", {
										className: "sml-final-text",
										dangerouslySetInnerHTML: { __html: $t(le(e)?.content || "") }
									}), /* @__PURE__ */ z("span", {
										className: "sml-final-time",
										children: W(e) ? U(W(e).timestamp) : ""
									})]
								}) : null
							})
						})]
					})]
				}, t)), l && I.length === 0 && /* @__PURE__ */ B("div", {
					className: "sml-ai-block",
					children: [/* @__PURE__ */ z("div", {
						className: "sml-header-row sml-header-row--ai",
						children: /* @__PURE__ */ B("div", {
							className: "sml-header-left",
							children: [/* @__PURE__ */ z("div", {
								className: "sml-ai-avatar-icon",
								children: /* @__PURE__ */ z(k, {
									size: 14,
									className: "text-white animate-spin"
								})
							}), /* @__PURE__ */ z("span", {
								className: "sml-header-name",
								children: "AI"
							})]
						})
					}), /* @__PURE__ */ z("div", {
						className: "sml-body-row sml-body-row--ai",
						children: /* @__PURE__ */ B("div", {
							className: "sml-loading-dots",
							children: [
								/* @__PURE__ */ z("span", { className: "sml-dot sml-dot-1" }),
								/* @__PURE__ */ z("span", { className: "sml-dot sml-dot-2" }),
								/* @__PURE__ */ z("span", { className: "sml-dot sml-dot-3" })
							]
						})
					})]
				})]
			}),
			D && /* @__PURE__ */ z("div", {
				className: "sml-loading-more",
				children: /* @__PURE__ */ z("div", {
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
Ln.displayName = "SampleMessageList";
//#endregion
//#region src/layout/SampleChatLayout.tsx
var Rn = e(({ theme: e = "dark", showAgentInfo: i = !1, isEnableFile: a = !0, input_isEnableKnowledge: s = !0, placeholder: u, defaultQuerys: f = [], showTokensBar: p = !1, isUserDefaultAvatar: m = !0, activityMaxEntries: ee = 5, inputAreaHorizontalAlignment: h = "Full", inputAreaMargin: g = "10px", inputWidth: _, inputAgentsData: v = [], groups: y = [], autoConnect: b = !0 }, x) => {
	c();
	let S = o(null), C = Nn(), w = l(Ye), T = l(Xe), E = l(Ze), D = l(Qe), O = l($e), k = l(tt), A = l(nt), j = l(rt), M = l(it), N = l(at), P = l(Lt), F = l(Vt), I = l(Bt);
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
	})), /* @__PURE__ */ B("div", {
		className: `chat-layout ${e === "light" ? "chat-layout--light" : ""}`,
		style: {
			display: "flex",
			flexDirection: "column",
			height: "100%"
		},
		children: [/* @__PURE__ */ z(Ln, {
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
			activityMaxEntries: ee,
			hasMore: k.length > 1 ? M.__global__ !== !1 : M[O] !== !1,
			isLoadingMore: N,
			onLoadMore: () => C.loadMoreMessages(k.length > 1 ? void 0 : O),
			onSelectQuery: (e) => L(e, [])
		}), /* @__PURE__ */ z(mn, {
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
Rn.displayName = "SampleChatLayout";
//#endregion
//#region src/components/messages/rap_timeline/MessageList.tsx
var zn = ({ status: e }) => e === "success" ? /* @__PURE__ */ z(b, {
	size: 12,
	className: "text-green-500"
}) : e === "failed" ? /* @__PURE__ */ z(ne, {
	size: 12,
	className: "text-red-500"
}) : /* @__PURE__ */ z(k, {
	size: 12,
	className: "text-blue-500 rml-spin"
});
function Bn(e) {
	let t = e.steps.find((e) => e.type === "content");
	return t ? t.msg.agent || "AI" : e.steps.find((e) => e.msg.agent && e.type !== "ask")?.msg.agent || "AI";
}
function Vn(e) {
	return e.type === "ask" ? `${e.msg.fromAgent} → ${e.msg.toAgent || e.msg.agent}` : e.type === "reason" ? `${e.msg.agent} 正在思考分析...` : e.type === "tool" && e.tool ? `执行 ${e.tool.toolName}` : e.msg.role === H.TOOL_RESULT ? "工具返回结果" : e.msg.role === H.COMMAND ? "执行命令" : e.msg.role === H.OPTION ? "选项" : e.msg.agent || "处理中...";
}
function Hn(e) {
	return e.role === H.ERROR;
}
function Un(e, t) {
	try {
		return JSON.parse(e.args)[t] || "";
	} catch {
		return "";
	}
}
function Wn(e) {
	return typeof e == "string" ? e.split("/").pop() || e.split("\\").pop() || e : e.fileName || "";
}
function Gn(e) {
	return e.steps.length > 0 ? U(e.steps[e.steps.length - 1].msg.timestamp) : "";
}
function Kn(e, t, n, r) {
	if (t === n.length - 1 && r) return !0;
	for (let t = e.steps.length - 1; t >= 0; t--) if (e.steps[t].type === "content") return e.steps[t].msg.isStreaming === !0;
	return !1;
}
function qn(e, t, n, r) {
	if (Kn(e, t, n, r)) {
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
	if (Zn(e)) {
		let t = Yn(e);
		if (t?.content) {
			let e = t.content.trim();
			return e.length > 10 ? e.slice(0, 10) + "..." : e;
		}
		return "发生错误";
	}
	let i = Yn(e);
	if (i?.content) {
		let e = i.content.trim();
		return e.length > 10 ? e.slice(0, 10) + "..." : e;
	}
	return "处理中...";
}
function Jn(e, t, n, r, i) {
	return e.msg.isStreaming ? !0 : t === r.length - 1 && i ? !r[t].steps.slice(n + 1).some((e) => e.type === "content") : !1;
}
function Yn(e) {
	for (let t = e.steps.length - 1; t >= 0; t--) if (e.steps[t].type === "content") return e.steps[t].msg;
	return null;
}
function Xn(e) {
	return e.steps.length === 0 ? null : e.steps[e.steps.length - 1].msg;
}
function Zn(e) {
	let t = Yn(e);
	return t ? t.role === H.ERROR : !1;
}
var Qn = e(({ messages: e, currentAgent: s, isGroupChat: c, showToolCallLog: l, isLoading: u, entryAgent: d, groups: f, theme: p = "dark", defaultQuerys: m = [], isUserDefaultAvatar: h = !0, userDisplayName: _ = "", onSelectQuery: T, onLoadMore: D, hasMore: O = !1, isLoadingMore: j = !1, children: M }, N) => {
	let P = o(null), I = o(null), L = o(j), te = qt(e, s, c, {
		entryAgent: d,
		groups: f
	});
	r(N, () => ({ scrollToBottom: () => {
		P.current && (P.current.scrollTop = P.current.scrollHeight);
	} })), i(() => {
		let e = L.current;
		L.current = j;
		let t = P.current;
		if (e && !j && I.current && t) {
			let { scrollHeight: e, scrollTop: n } = I.current;
			t.scrollTop = n + (t.scrollHeight - e);
		}
	}, [j]), n(() => {
		if (!j) {
			if (I.current) {
				I.current = null;
				return;
			}
			P.current && (P.current.scrollTop = P.current.scrollHeight);
		}
	}, [te, j]);
	let ne = t(() => {
		let e = P.current;
		!e || !O || j || e.scrollTop <= 50 && D && (I.current = {
			scrollHeight: e.scrollHeight,
			scrollTop: e.scrollTop
		}, D());
	}, [
		O,
		j,
		D
	]), ie = p === "light" ? "rml-theme-light" : "", ae = a(() => _ ? _.slice(0, 2) : "", [_]);
	return /* @__PURE__ */ B("div", {
		className: `rml-container ${ie}`,
		ref: P,
		onScroll: ne,
		children: [
			/* @__PURE__ */ z("div", {
				className: "rml-sticky-header",
				children: M
			}),
			te.length === 0 && !u && /* @__PURE__ */ z("div", {
				className: "rml-empty",
				children: m.length > 0 ? /* @__PURE__ */ B("div", {
					className: "rml-default-queries",
					children: [/* @__PURE__ */ z("div", {
						className: "rml-default-queries__title",
						children: "有什么可以帮您的？"
					}), /* @__PURE__ */ z("div", {
						className: "rml-default-queries__list",
						children: m.map((e, t) => /* @__PURE__ */ B("div", {
							className: "rml-default-query-card",
							onClick: () => T?.(e),
							children: [/* @__PURE__ */ z(A, {
								size: 16,
								className: "rml-default-query-icon"
							}), /* @__PURE__ */ z("span", { children: e })]
						}, t))
					})]
				}) : /* @__PURE__ */ z("div", {
					className: "rml-empty-placeholder",
					children: "开始一段新的对话吧"
				})
			}),
			/* @__PURE__ */ B("div", {
				className: "rml-turns",
				children: [te.map((e, t) => /* @__PURE__ */ B("div", {
					className: "rml-turn",
					children: [e.userMsg && /* @__PURE__ */ z("div", {
						className: "rml-user-block",
						children: /* @__PURE__ */ B("div", {
							className: "rml-body-row rml-body-row--user",
							children: [/* @__PURE__ */ B("div", {
								className: "rml-user-bubble",
								children: [
									e.userMsg.documents && e.userMsg.documents.length > 0 && /* @__PURE__ */ z("div", {
										className: "rml-user-docs",
										children: e.userMsg.documents.map((e, t) => /* @__PURE__ */ B("div", {
											className: "rml-doc-item",
											children: [/* @__PURE__ */ z(E, {
												size: 12,
												className: "text-blue-400"
											}), /* @__PURE__ */ z("span", {
												className: "rml-doc-name",
												children: Wn(e)
											})]
										}, t))
									}),
									/* @__PURE__ */ z("div", {
										className: "rml-user-text",
										children: e.userMsg.content
									}),
									/* @__PURE__ */ z("div", {
										className: "rml-user-time",
										children: U(e.userMsg.timestamp)
									})
								]
							}), /* @__PURE__ */ z("div", {
								className: "rml-user-avatar",
								children: h ? /* @__PURE__ */ z(F, { size: 14 }) : /* @__PURE__ */ z(re, { children: ae })
							})]
						})
					}), e.steps.length > 0 && /* @__PURE__ */ B("div", {
						className: "rml-ai-block",
						children: [/* @__PURE__ */ B("div", {
							className: "rml-header-row rml-header-row--ai",
							children: [/* @__PURE__ */ B("div", {
								className: "rml-header-left",
								children: [/* @__PURE__ */ z(Xt, {
									agentName: Bn(e),
									size: "small"
								}), /* @__PURE__ */ z("span", {
									className: "rml-header-name",
									children: Bn(e)
								})]
							}), /* @__PURE__ */ z("span", {
								className: "rml-header-time",
								children: Gn(e)
							})]
						}), /* @__PURE__ */ z("div", {
							className: "rml-body-row rml-body-row--ai",
							children: Kn(e, t, te, u) ? /* @__PURE__ */ B("details", {
								className: "rml-collapse-card",
								children: [/* @__PURE__ */ B("summary", {
									className: "rml-collapse-summary",
									children: [/* @__PURE__ */ B("div", {
										className: "rml-summary-left",
										children: [
											/* @__PURE__ */ z(k, {
												size: 12,
												className: "rml-summary-spinner"
											}),
											/* @__PURE__ */ z("span", {
												className: "rml-summary-text rml-summary-text--animating",
												children: qn(e, t, te, u)
											}),
											/* @__PURE__ */ z("span", { className: "rml-typing-cursor" })
										]
									}), /* @__PURE__ */ B("div", {
										className: "rml-summary-right",
										children: [/* @__PURE__ */ z("span", { className: "rml-pulse-dot" }), /* @__PURE__ */ z(x, {
											size: 12,
											className: "rml-chevron"
										})]
									})]
								}), /* @__PURE__ */ z("div", {
									className: "rml-collapse-body",
									children: /* @__PURE__ */ B("div", {
										className: "rml-timeline",
										children: [e.steps.map((e, n) => /* @__PURE__ */ B("div", {
											className: "rml-step",
											children: [/* @__PURE__ */ z("div", { className: e.type === "content" ? "rml-final-dot" : "rml-step-dot" }), /* @__PURE__ */ B("div", {
												className: "rml-step-inner",
												children: [
													e.type === "ask" && /* @__PURE__ */ B("div", {
														className: "rml-step-simple",
														children: [
															/* @__PURE__ */ z(w, {
																size: 12,
																className: "rml-icon-dim"
															}),
															/* @__PURE__ */ z("span", {
																className: "rml-step-mono",
																children: e.msg.fromAgent
															}),
															/* @__PURE__ */ z(g, {
																size: 10,
																className: "rml-icon-dim mx-0_5"
															}),
															/* @__PURE__ */ B("span", {
																className: "rml-step-mono-light",
																children: ["唤起 ", e.msg.toAgent || e.msg.agent]
															})
														]
													}),
													e.type === "reason" && /* @__PURE__ */ B("details", {
														className: "rml-tool-card rml-tool-think",
														children: [/* @__PURE__ */ B("summary", {
															className: "rml-tool-summary-card",
															children: [/* @__PURE__ */ B("div", {
																className: "rml-tool-card-inner",
																children: [/* @__PURE__ */ z("div", {
																	className: "rml-tool-icon-wrap rml-tool-icon-emerald",
																	children: /* @__PURE__ */ z(y, {
																		size: 12,
																		className: "text-emerald-400"
																	})
																}), /* @__PURE__ */ B("span", {
																	className: "rml-tool-label",
																	children: [
																		"智能体思考",
																		" ",
																		/* @__PURE__ */ B("span", {
																			className: "text-emerald-400_60",
																			children: ["· ", e.msg.agent]
																		})
																	]
																})]
															}), /* @__PURE__ */ B("div", {
																className: "rml-tool-card-right",
																children: [Jn(e, t, n, te, u) ? /* @__PURE__ */ z(k, {
																	size: 12,
																	className: "text-emerald-400 rml-spin"
																}) : /* @__PURE__ */ z(b, {
																	size: 12,
																	className: "text-green-500"
																}), /* @__PURE__ */ z(S, {
																	size: 12,
																	className: "rml-chevron-right"
																})]
															})]
														}), /* @__PURE__ */ z("div", {
															className: "rml-tool-detail-body",
															children: e.msg.reasonContent
														})]
													}),
													e.type === "tool" && e.tool && /* @__PURE__ */ z(re, { children: e.tool.toolName === "runAgent" ? /* @__PURE__ */ B("div", {
														className: "rml-tool-card rml-tool-dispatch",
														children: [/* @__PURE__ */ B("div", {
															className: "rml-tool-card-inner",
															children: [/* @__PURE__ */ z("div", {
																className: "rml-tool-icon-wrap rml-tool-icon-purple",
																children: /* @__PURE__ */ z(w, {
																	size: 12,
																	className: "text-purple-400"
																})
															}), /* @__PURE__ */ B("span", {
																className: "rml-tool-label",
																children: [
																	"智能体调度:",
																	" ",
																	/* @__PURE__ */ z("span", {
																		className: "rml-tool-highlight-purple",
																		children: Un(e.tool, "agentName") || Un(e.tool, "agent") || "Unknown"
																	})
																]
															})]
														}), /* @__PURE__ */ z(zn, { status: e.tool.status })]
													}) : e.tool.toolName === "loadSkill" ? /* @__PURE__ */ B("div", {
														className: "rml-tool-card rml-tool-skill",
														children: [/* @__PURE__ */ B("div", {
															className: "rml-tool-card-inner",
															children: [/* @__PURE__ */ z("div", {
																className: "rml-tool-icon-wrap rml-tool-icon-amber",
																children: /* @__PURE__ */ z(v, {
																	size: 12,
																	className: "text-amber-400"
																})
															}), /* @__PURE__ */ B("span", {
																className: "rml-tool-label",
																children: [
																	"加载技能:",
																	" ",
																	/* @__PURE__ */ z("span", {
																		className: "rml-tool-highlight-amber",
																		children: Un(e.tool, "skillName") || Un(e.tool, "skill") || "Unknown"
																	})
																]
															})]
														}), /* @__PURE__ */ z(zn, { status: e.tool.status })]
													}) : /* @__PURE__ */ B("details", {
														className: "rml-tool-card rml-tool-generic",
														children: [/* @__PURE__ */ B("summary", {
															className: "rml-tool-summary-card",
															children: [/* @__PURE__ */ B("div", {
																className: "rml-tool-card-inner",
																children: [/* @__PURE__ */ z("div", {
																	className: "rml-tool-icon-wrap rml-tool-icon-yellow",
																	children: /* @__PURE__ */ z(R, {
																		size: 12,
																		className: "text-yellow-400"
																	})
																}), /* @__PURE__ */ B("span", {
																	className: "rml-tool-label",
																	children: [
																		"工具调用:",
																		" ",
																		/* @__PURE__ */ z("span", {
																			className: "rml-tool-highlight-yellow",
																			children: e.tool.toolName
																		})
																	]
																})]
															}), /* @__PURE__ */ B("div", {
																className: "rml-tool-card-right",
																children: [/* @__PURE__ */ z(zn, { status: e.tool.status }), /* @__PURE__ */ z(S, {
																	size: 12,
																	className: "rml-chevron-right"
																})]
															})]
														}), /* @__PURE__ */ B("div", {
															className: "rml-tool-detail-body",
															children: [
																e.tool.args && /* @__PURE__ */ B("div", {
																	className: "rml-tool-section",
																	children: [
																		/* @__PURE__ */ z("span", {
																			className: "text-purple-400_80",
																			children: "Args:"
																		}),
																		" ",
																		e.tool.args
																	]
																}),
																e.tool.status === "success" && e.tool.result && /* @__PURE__ */ B("div", { children: [
																	/* @__PURE__ */ z("span", {
																		className: "text-green-400_80",
																		children: "Result:"
																	}),
																	" ",
																	e.tool.result
																] }),
																e.tool.status === "failed" && e.tool.error && /* @__PURE__ */ B("div", {
																	className: "text-red-400_80",
																	children: ["Error: ", e.tool.error]
																})
															]
														})]
													}) }),
													e.type === "content" && /* @__PURE__ */ z("div", {
														className: "rml-final-body",
														children: /* @__PURE__ */ B("div", {
															className: `rml-final-text${Hn(e.msg) ? " rml-final-error" : ""}`,
															children: [Hn(e.msg) ? /* @__PURE__ */ B("div", {
																className: "rml-error-inline",
																children: [/* @__PURE__ */ z(ee, { size: 14 }), /* @__PURE__ */ z("span", { children: e.msg.content })]
															}) : /* @__PURE__ */ z("div", { dangerouslySetInnerHTML: { __html: $t(e.msg.content || "") } }), e.msg.isStreaming && /* @__PURE__ */ z("span", { className: "rml-cursor" })]
														})
													}),
													e.type === "askUser" && /* @__PURE__ */ B(re, { children: [/* @__PURE__ */ z("div", {
														className: "rml-tool-card rml-tool-askuser",
														children: /* @__PURE__ */ B("div", {
															className: "rml-tool-card-inner",
															children: [/* @__PURE__ */ z("div", {
																className: "rml-tool-icon-wrap rml-tool-icon-amber",
																children: /* @__PURE__ */ z(C, {
																	size: 12,
																	className: "text-amber-400"
																})
															}), /* @__PURE__ */ B("span", {
																className: "rml-tool-label",
																children: [
																	"智能体询问:",
																	" ",
																	/* @__PURE__ */ z("span", {
																		className: "rml-tool-highlight-amber",
																		children: e.msg.agent
																	})
																]
															})]
														})
													}), e.msg.content && /* @__PURE__ */ z("div", {
														className: "rml-askuser-body",
														children: /* @__PURE__ */ z("div", {
															className: "rml-askuser-text",
															dangerouslySetInnerHTML: { __html: $t(e.msg.content || "") }
														})
													})] }),
													e.type !== "ask" && e.type !== "reason" && e.type !== "tool" && e.type !== "content" && e.type !== "askUser" && /* @__PURE__ */ B("div", {
														className: "rml-step-simple",
														children: [/* @__PURE__ */ z(w, {
															size: 12,
															className: "rml-icon-dim"
														}), /* @__PURE__ */ z("span", {
															className: "rml-step-mono",
															children: Vn(e)
														})]
													}),
													e.msg.timestamp > 0 && /* @__PURE__ */ z("span", {
														className: "rml-step-time",
														children: U(e.msg.timestamp)
													})
												]
											})]
										}, `step-${n}`)), t === te.length - 1 && u && e.steps.length === 0 && /* @__PURE__ */ B("div", {
											className: "rml-loading-step",
											children: [/* @__PURE__ */ z("div", { className: "rml-step-dot-sm" }), /* @__PURE__ */ B("div", {
												className: "rml-loading-dots",
												children: [
													/* @__PURE__ */ z("span", { className: "rml-dot rml-dot-1" }),
													/* @__PURE__ */ z("span", { className: "rml-dot rml-dot-2" }),
													/* @__PURE__ */ z("span", { className: "rml-dot rml-dot-3" })
												]
											})]
										})]
									})
								})]
							}) : /* @__PURE__ */ z(re, { children: Zn(e) ? /* @__PURE__ */ B("div", {
								className: "rml-error-body",
								children: [/* @__PURE__ */ B("div", {
									className: "rml-error-inline",
									children: [/* @__PURE__ */ z(ee, { size: 14 }), /* @__PURE__ */ z("span", { children: Yn(e)?.content })]
								}), /* @__PURE__ */ z("span", {
									className: "rml-final-time",
									children: Xn(e) ? U(Xn(e).timestamp) : ""
								})]
							}) : Yn(e) ? /* @__PURE__ */ B("div", {
								className: "rml-completed-text",
								children: [/* @__PURE__ */ z("div", { dangerouslySetInnerHTML: { __html: $t(Yn(e)?.content || "") } }), /* @__PURE__ */ z("span", {
									className: "rml-final-time",
									children: Xn(e) ? U(Xn(e).timestamp) : ""
								})]
							}) : null })
						})]
					})]
				}, t)), u && te.length === 0 && /* @__PURE__ */ B("div", {
					className: "rml-ai-block",
					children: [/* @__PURE__ */ z("div", {
						className: "rml-header-row rml-header-row--ai",
						children: /* @__PURE__ */ B("div", {
							className: "rml-header-left",
							children: [/* @__PURE__ */ z("div", {
								className: "rml-ai-avatar-icon",
								children: /* @__PURE__ */ z(k, {
									size: 14,
									className: "text-white rml-spin"
								})
							}), /* @__PURE__ */ z("span", {
								className: "rml-header-name",
								children: "AI"
							})]
						})
					}), /* @__PURE__ */ z("div", {
						className: "rml-body-row rml-body-row--ai",
						children: /* @__PURE__ */ B("div", {
							className: "rml-loading-dots",
							children: [
								/* @__PURE__ */ z("span", { className: "rml-dot rml-dot-1" }),
								/* @__PURE__ */ z("span", { className: "rml-dot rml-dot-2" }),
								/* @__PURE__ */ z("span", { className: "rml-dot rml-dot-3" })
							]
						})
					})]
				})]
			}),
			j && /* @__PURE__ */ z("div", {
				className: "rml-loading-more",
				children: /* @__PURE__ */ B("div", {
					style: {
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						gap: 6,
						color: "var(--ml-text-secondary, #8b949e)",
						fontSize: 12
					},
					children: [/* @__PURE__ */ z(k, {
						size: 12,
						className: "rml-spin"
					}), /* @__PURE__ */ z("span", { children: "加载中..." })]
				})
			})
		]
	});
});
Qn.displayName = "RapTimelineMessageList";
//#endregion
//#region src/layout/RapTimelineChatLayout.tsx
var $n = e(({ theme: e = "dark", showAgentInfo: i = !1, isEnableFile: a = !0, input_isEnableKnowledge: s = !0, placeholder: u, defaultQuerys: f = [], showTokensBar: p = !1, isUserDefaultAvatar: m = !0, inputAreaHorizontalAlignment: ee = "Full", inputAreaMargin: h = "10px", inputWidth: g, inputAgentsData: _ = [], groups: v = [], autoConnect: y = !0 }, b) => {
	c();
	let x = o(null), S = Nn(), C = l(Ye), w = l(Xe), T = l(Ze), E = l(Qe), D = l($e), O = l(tt), k = l(nt), A = l(rt), j = l(it), M = l(at), N = l(Lt), P = l(Vt), F = l(Bt);
	n(() => {
		y && N && P && !w && S.connect();
	}, [
		y,
		N,
		P,
		w,
		S
	]), n(() => S.onSessionSwitch((e) => {
		setTimeout(() => x.current?.scrollToBottom?.(), 100);
	}), [S]), n(() => {
		E && d.error(E);
	}, [E]), n(() => {
		N || S.disconnect();
	}, [N, S]);
	let I = t((e, t, n, r) => {
		if (!w) {
			d.warning("未连接到服务器");
			return;
		}
		let i;
		if (n) i = {
			name: n.name,
			type: n.type === "group" ? "group" : "agent"
		};
		else {
			let e = F?.agent || "main";
			i = {
				name: e,
				type: v.some((t) => t.name === e) ? "group" : "agent"
			};
		}
		S.sendMessage(e, t, i, r), setTimeout(() => x.current?.scrollToBottom?.(), 100);
	}, [
		S,
		w,
		F,
		v
	]), L = t(async () => {
		if (!(!w || !T)) try {
			await S.terminateSession(), d.info("已终止当前对话");
		} catch (e) {
			d.error(e instanceof Error ? e.message : "终止失败");
		}
	}, [
		w,
		T,
		S
	]);
	return r(b, () => ({
		newSession: S.newSession,
		changeSession: S.changeSession,
		connect: S.connect,
		disconnect: S.disconnect
	})), /* @__PURE__ */ B("div", {
		className: `chat-layout ${e === "light" ? "chat-layout--light" : ""}`,
		style: {
			display: "flex",
			flexDirection: "column",
			height: "100%"
		},
		children: [/* @__PURE__ */ z(Qn, {
			ref: x,
			messages: C,
			currentAgent: D,
			isGroupChat: O.length > 1,
			showToolCallLog: A,
			isLoading: T,
			theme: e,
			entryAgent: F?.agent,
			groups: v,
			defaultQuerys: f,
			isUserDefaultAvatar: m,
			hasMore: O.length > 1 ? j.__global__ !== !1 : j[D] !== !1,
			isLoadingMore: M,
			onLoadMore: () => S.loadMoreMessages(O.length > 1 ? void 0 : D),
			onSelectQuery: (e) => I(e, [])
		}), /* @__PURE__ */ z(mn, {
			isConnected: w,
			isLoading: T,
			connectionError: E,
			theme: e,
			showAgentInfo: i,
			isEnableFile: a,
			input_isEnableKnowledge: s,
			placeholder: u,
			showTokensBar: p,
			currentAgentName: D,
			agentTokens: k,
			horizontalAlignment: ee,
			margin: h,
			inputWidth: g,
			inputAgentsData: _,
			boundAgent: F?.agent || null,
			boundAgentType: F?.agentType || "agent",
			onSend: I,
			onTerminate: L
		})]
	});
});
$n.displayName = "RapTimelineChatLayout";
//#endregion
//#region src/components/messages/a2ui/utils/extractEvents.ts
var er = (e) => {
	let t = [];
	for (let n of e) try {
		let e = JSON.parse(n.args || "{}");
		if (n.toolName === V.CREATE_SURFACE && e.surfaceId) t.push({
			version: "v0.9",
			createSurface: {
				surfaceId: e.surfaceId,
				catalogId: e.catalogId || "https://a2ui.org/specification/v0_9/basic_catalog.json",
				timestamp: n.timestamp
			}
		});
		else if (n.toolName === V.UPDATE_COMPONENTS && e.surfaceId && e.components) {
			let r = Array.isArray(e.components) ? e.components : [];
			r.length > 0 && t.push({
				version: "v0.9",
				updateComponents: {
					surfaceId: e.surfaceId,
					components: r,
					timestamp: n.timestamp
				}
			});
		} else n.toolName === V.UPDATE_DATA_MODEL && e.surfaceId ? t.push({
			version: "v0.9",
			updateDataModel: {
				surfaceId: e.surfaceId,
				path: e.path || "/",
				value: e.value,
				timestamp: n.timestamp
			}
		}) : n.toolName === V.DELETE_SURFACE && e.surfaceId && t.push({
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
}, tr = /* @__PURE__ */ new Set([
	V.CREATE_SURFACE,
	V.UPDATE_COMPONENTS,
	V.UPDATE_DATA_MODEL,
	V.DELETE_SURFACE
]), nr = 5, rr = 10, ir = e(({ theme: e = "dark", onSpecialEvent: i, onSessionSwitch: a, onA2UIAction: c }, u) => {
	let d = o(null), [f, p] = s([]), [m, ee] = s(!1), [h, g] = s(!1), [_, v] = s(!0), y = o(0), b = o(/* @__PURE__ */ new Map()), x = o(/* @__PURE__ */ new Map()), S = o(/* @__PURE__ */ new Map()), C = o(null), w = o(null), T = o(null), E = o(null), [D, O] = s(!1), k = l(et);
	n(() => {
		E.current = k;
	}, [k]);
	let A = t(() => {
		d.current && (d.current.scrollTop = d.current.scrollHeight);
	}, []);
	n(() => {
		A();
	}, [f, A]), n(() => {
		let e = !1;
		return Promise.all([import("@a2ui/lit/v0_9"), import("@a2ui/web_core/v0_9")]).then(([t, n]) => {
			if (e) return;
			let { basicCatalog: r } = t, { MessageProcessor: i } = n;
			w.current = {
				lit: t,
				core: n,
				basicCatalog: r
			};
			let a = new i([r]);
			C.current = a, a.onSurfaceCreated((e) => {
				let t = e.surfaceId || e.id;
				if (!t) return;
				let n = x.current.get(t) || {};
				n.surfaceInstance = e, n.surfaceCreated = !0, x.current.set(t, n);
				let r = b.current.get(t);
				r && (r.surface = e);
				let i = S.current.get(t);
				if (i && i.length > 0) {
					let e = [];
					for (let n of i) if (n.type === V.UPDATE_COMPONENTS && n.data) {
						let r = Array.isArray(n.data) ? n.data : n.data.components;
						r && r.length > 0 && e.push({ updateComponents: {
							surfaceId: t,
							components: r
						} });
					} else if (n.type === V.UPDATE_DATA_MODEL && n.data) {
						let { surfaceId: r, timestamp: i, ...a } = n.data;
						e.push({ updateDataModel: {
							surfaceId: t,
							...a
						} });
					}
					S.current.delete(t), e.length > 0 && a.processMessages(e.map((e) => ({
						version: "v0.9",
						...e
					})));
				}
				j();
			}), O(!0);
		}).catch((e) => {
			console.warn("[agent-chat] @a2ui/lit 或 @a2ui/web_core 未安装，A2UI 功能不可用", e);
		}), () => {
			e = !0;
		};
	}, []);
	let j = t(() => {
		let e = C.current;
		if (!e) return;
		let t = Array.from(b.current.keys());
		if (t.length <= rr) return;
		let n = t.slice(0, t.length - rr);
		for (let t of n) {
			try {
				e.processMessages([{
					version: "v0.9",
					deleteSurface: { surfaceId: t }
				}]);
			} catch {}
			x.current.delete(t), b.current.delete(t);
		}
		p((e) => e.filter((e) => e.surfaceId && !n.includes(e.surfaceId)));
	}, []), M = t((e, t, n) => {
		let r = C.current;
		if (!r) return;
		let i = x.current.get(e);
		if (t === V.CREATE_SURFACE) {
			let t = n.catalogId || n.catalog?.id || "basic";
			r.processMessages([{
				version: "v0.9",
				createSurface: {
					surfaceId: e,
					catalogId: t
				}
			}]);
			let a = i || {};
			a.surfaceCreated = !0, x.current.set(e, a);
			return;
		}
		if (t === V.UPDATE_COMPONENTS) {
			if (!i?.surfaceCreated) {
				let r = S.current.get(e) || [];
				r.push({
					type: t,
					data: n
				}), S.current.set(e, r);
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
			o.components = a, x.current.set(e, o), o.data && r.processMessages([{
				version: "v0.9",
				updateDataModel: {
					surfaceId: e,
					...o.data
				}
			}]);
		}
		if (t === V.UPDATE_DATA_MODEL) {
			if (!i?.surfaceCreated) {
				let r = S.current.get(e) || [];
				r.push({
					type: t,
					data: n
				}), S.current.set(e, r);
				return;
			}
			let { surfaceId: a, timestamp: o, ...s } = n || {}, c = i || {};
			c.data = s, c.components && r.processMessages([{
				version: "v0.9",
				updateDataModel: {
					surfaceId: e,
					...s
				}
			}]), x.current.set(e, c);
		}
		t === V.DELETE_SURFACE && (r.processMessages([{
			version: "v0.9",
			deleteSurface: { surfaceId: e }
		}]), x.current.delete(e), b.current.delete(e), S.current.delete(e), p((t) => t.filter((t) => t.surfaceId !== e)));
	}, []), N = t((e) => {
		if (!T.current) return;
		let t = `surface-${T.current}`;
		e.createSurface && M(t, V.CREATE_SURFACE, e.createSurface), e.updateComponents && M(t, V.UPDATE_COMPONENTS, e.updateComponents), e.updateDataModel && M(t, V.UPDATE_DATA_MODEL, e.updateDataModel), setTimeout(() => A(), 0);
	}, [M, A]);
	n(() => {
		if (!D || !i) return;
		let e = [], t = Array.from(tr);
		for (let n of t) {
			let t = i(n, (e) => {
				N(e);
			});
			e.push(t);
		}
		return () => {
			for (let t of e) t();
		};
	}, [
		D,
		i,
		N
	]);
	let P = o();
	P.current = t(async (e, t = !1) => {
		let n = [];
		for (let t of e) {
			if (!t.userMessage) continue;
			let e = t.userMessage.id, r = `surface-${e}`;
			n.push({
				id: e,
				type: "user",
				timestamp: t.userMessage.timestamp,
				content: t.userMessage.content
			}), er(t.toolCalls || []).length > 0 && n.push({
				id: `${e}-a2ui`,
				type: "a2ui",
				timestamp: t.toolCalls?.[0]?.timestamp || t.userMessage.timestamp,
				surfaceId: r
			});
		}
		n.sort((e, t) => e.timestamp - t.timestamp), p((e) => t ? [...n, ...e] : n), await new Promise((e) => setTimeout(e, 50));
		for (let t of e) {
			if (!t.userMessage) continue;
			let e = `surface-${t.userMessage.id}`, n = er(t.toolCalls || []);
			for (let t of n) t.createSurface ? M(e, V.CREATE_SURFACE, t.createSurface) : t.updateComponents ? M(e, V.UPDATE_COMPONENTS, {
				...t.updateComponents,
				surfaceId: e
			}) : t.updateDataModel ? M(e, V.UPDATE_DATA_MODEL, {
				...t.updateDataModel,
				surfaceId: e
			}) : t.deleteSurface && M(e, V.DELETE_SURFACE, t.deleteSurface);
		}
	}, [M]);
	let I = o();
	I.current = t(async () => {
		let e = E.current;
		if (e) {
			ee(!0), y.current = 0;
			try {
				let t = await Tt().get(`/messages/${e}/toolCalls`, { params: {
					toolNames: Array.from(tr).join(","),
					isLike: !0,
					pageSize: nr,
					pageIndex: 0
				} }), n = t.data || t;
				if (n.success && n.data) {
					let { groups: e, pagination: t } = n.data;
					await P.current(e, !1), v(t?.hasMore ?? !1), y.current = 1;
				}
			} catch (e) {
				console.error("[A2UI] loadLatest failed:", e);
			} finally {
				ee(!1);
			}
		}
	}, []);
	let L = t(() => {
		I.current?.();
	}, []), R = t(async () => {
		let e = E.current;
		if (!(!e || h || !_)) {
			g(!0);
			try {
				let t = await Tt().get(`/messages/${e}/toolCalls`, { params: {
					toolNames: Array.from(tr).join(","),
					isLike: !0,
					pageSize: nr,
					pageIndex: y.current
				} }), n = t.data || t;
				if (n.success && n.data) {
					let { groups: e, pagination: t } = n.data;
					await P.current(e, !0), v(t?.hasMore ?? !1), y.current++;
				}
			} catch (e) {
				console.error("[A2UI] loadMore failed:", e);
			} finally {
				g(!1);
			}
		}
	}, [h, _]);
	n(() => {
		if (a) return a(async (e) => {
			if (C.current = null, b.current.clear(), x.current.clear(), S.current.clear(), T.current = null, p([]), y.current = 0, v(!0), w.current) {
				let { basicCatalog: e } = w.current, { MessageProcessor: t } = w.current.core, n = new t([e]);
				C.current = n, n.onSurfaceCreated((e) => {
					let t = e.surfaceId || e.id;
					if (!t) return;
					let r = x.current.get(t) || {};
					r.surfaceInstance = e, r.surfaceCreated = !0, x.current.set(t, r);
					let i = b.current.get(t);
					i && (i.surface = e);
					let a = S.current.get(t);
					if (a && a.length > 0) {
						let e = [];
						for (let n of a) if (n.type === V.UPDATE_COMPONENTS && n.data) {
							let r = Array.isArray(n.data) ? n.data : n.data.components;
							r && r.length > 0 && e.push({ updateComponents: {
								surfaceId: t,
								components: r
							} });
						} else if (n.type === V.UPDATE_DATA_MODEL && n.data) {
							let { surfaceId: r, timestamp: i, ...a } = n.data;
							e.push({ updateDataModel: {
								surfaceId: t,
								...a
							} });
						}
						S.current.delete(t), e.length > 0 && n.processMessages(e.map((e) => ({
							version: "v0.9",
							...e
						})));
					}
				});
			}
			I.current?.();
		});
	}, [a]);
	let te = t(() => {
		let e = d.current;
		!e || h || !_ || e.scrollTop < 50 && R();
	}, [
		h,
		_,
		R
	]);
	r(u, () => ({
		addUserMessage: (e) => {
			let t = `${E.current || "session"}-${Date.now()}`, n = `surface-${t}`;
			T.current = t, p((r) => [
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
		loadLatest: L,
		loadMore: R,
		scrollToBottom: A
	})), n(() => {
		D && k && I.current?.();
	}, [D, k]);
	let ne = e === "light" ? "a2ui-theme-light" : "", re = t((e) => (t) => {
		if (t) {
			b.current.set(e, t);
			let n = x.current.get(e);
			n?.surfaceInstance && (t.surface = n.surfaceInstance);
		} else b.current.delete(e);
	}, []);
	return /* @__PURE__ */ B("div", {
		className: `message-list a2ui-list ${ne}`,
		ref: d,
		onScroll: te,
		children: [
			h && /* @__PURE__ */ z("div", {
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
			!h && _ && f.length > 0 && /* @__PURE__ */ z("div", {
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
			m && /* @__PURE__ */ z("div", {
				style: {
					textAlign: "center",
					padding: 40,
					color: "var(--ml-text-secondary, #8b949e)"
				},
				children: "加载中..."
			}),
			!m && D && f.map((t) => /* @__PURE__ */ z("div", {
				className: "a2ui-timeline-item",
				children: t.type === "user" ? /* @__PURE__ */ z("div", {
					className: "a2ui-user-block",
					children: /* @__PURE__ */ B("div", {
						className: "a2ui-body-row a2ui-body-row--user",
						children: [/* @__PURE__ */ B("div", {
							className: "a2ui-user-bubble",
							children: [/* @__PURE__ */ z("div", {
								className: "a2ui-user-text",
								children: t.content
							}), /* @__PURE__ */ z("div", {
								className: "a2ui-user-time",
								children: U(t.timestamp)
							})]
						}), /* @__PURE__ */ z("div", {
							className: "a2ui-user-avatar",
							children: /* @__PURE__ */ z(F, { size: 14 })
						})]
					})
				}) : /* @__PURE__ */ z("div", {
					className: "a2ui-surface-wrapper",
					style: {
						backgroundColor: e === "light" ? "#ffffff" : "#0D1117",
						border: "1px solid var(--ml-border, #30363d)",
						borderRadius: 12,
						overflow: "hidden",
						minHeight: 100
					},
					children: /* @__PURE__ */ z("a2ui-surface", {
						ref: re(t.surfaceId),
						"data-surface-id": t.surfaceId
					})
				})
			}, t.id)),
			!m && D && f.length === 0 && /* @__PURE__ */ B("div", {
				style: {
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					flex: 1,
					padding: 40
				},
				children: [/* @__PURE__ */ z("div", {
					style: {
						fontSize: 40,
						marginBottom: 16,
						opacity: .3
					},
					children: "🎨"
				}), /* @__PURE__ */ z("div", {
					style: { color: "var(--ml-text-secondary, #8b949e)" },
					children: "A2UI 交互模式"
				})]
			}),
			!D && /* @__PURE__ */ z("div", {
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
ir.displayName = "A2UIMessageList";
//#endregion
//#region src/layout/A2UIChatLayout.tsx
var ar = e(({ theme: e = "dark", showAgentInfo: i = !1, isEnableFile: a = !0, input_isEnableKnowledge: s = !0, placeholder: u, showTokensBar: f = !1, inputAreaHorizontalAlignment: p = "Full", inputAreaMargin: m = "10px", inputWidth: ee, inputAgentsData: h = [], groups: g = [], onA2UIAction: _, onSurfaceCreated: v, onComponentsUpdated: y, onDataModelUpdated: b, onSurfaceDeleted: x, autoConnect: S = !0 }, C) => {
	c();
	let w = o(null), T = Nn(), E = l(Xe), D = l(Ze), O = l(Qe), k = l($e), A = l(nt), j = l(Lt), M = l(Vt), N = l(Bt);
	n(() => {
		S && j && M && !E && T.connect();
	}, [
		S,
		j,
		M,
		E,
		T
	]), n(() => T.onSessionSwitch((e) => {
		setTimeout(() => w.current?.scrollToBottom?.(), 100);
	}), [T]), n(() => {
		O && d.error(O);
	}, [O]), n(() => {
		j || T.disconnect();
	}, [j, T]), n(() => {
		let e = [];
		return v && e.push(T.onSpecialEvent(V.CREATE_SURFACE, (e) => v(e?.surfaceId))), y && e.push(T.onSpecialEvent(V.UPDATE_COMPONENTS, (e) => y(e))), b && e.push(T.onSpecialEvent(V.UPDATE_DATA_MODEL, (e) => b(e))), x && e.push(T.onSpecialEvent(V.DELETE_SURFACE, (e) => x(e?.surfaceId))), () => e.forEach((e) => e());
	}, [
		T,
		v,
		y,
		b,
		x
	]);
	let P = t((e, t, n, r) => {
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
			let e = N?.agent || "main";
			i = {
				name: e,
				type: g.some((t) => t.name === e) ? "group" : "agent"
			};
		}
		w.current?.addUserMessage(e), T.sendMessage(e, t, i, r);
	}, [
		T,
		E,
		N,
		g
	]), F = t(async () => {
		if (!(!E || !D)) try {
			await T.terminateSession(), d.info("已终止当前对话");
		} catch (e) {
			d.error(e instanceof Error ? e.message : "终止失败");
		}
	}, [
		E,
		D,
		T
	]), I = t((e, t) => {
		_?.(t), T.transportRef.current && T.transportRef.current.request("messageChannel/sendA2UIUserAction", [e, t]).catch((e) => {
			console.error("[A2UIChatLayout] sendA2UIUserAction failed:", e);
		});
	}, [T, _]);
	return r(C, () => ({
		newSession: async () => {
			await T.newSession(), w.current?.loadLatest();
		},
		changeSession: async (e) => {
			await T.changeSession(e), w.current?.loadLatest();
		},
		a2uiMessageListRef: w,
		connect: T.connect,
		disconnect: T.disconnect
	})), /* @__PURE__ */ B("div", {
		className: `chat-layout ${e === "light" ? "chat-layout--light" : ""}`,
		style: {
			display: "flex",
			flexDirection: "column",
			height: "100%"
		},
		children: [/* @__PURE__ */ z(ir, {
			ref: w,
			theme: e,
			onSpecialEvent: T.onSpecialEvent,
			onSessionSwitch: T.onSessionSwitch,
			onA2UIAction: I
		}), /* @__PURE__ */ z(mn, {
			isConnected: E,
			isLoading: D,
			connectionError: O,
			theme: e,
			showAgentInfo: i,
			isEnableFile: a,
			input_isEnableKnowledge: s,
			placeholder: u,
			showTokensBar: f,
			currentAgentName: k,
			agentTokens: A,
			horizontalAlignment: p,
			margin: m,
			inputWidth: ee,
			inputAgentsData: h,
			boundAgent: N?.agent || null,
			boundAgentType: N?.agentType || "agent",
			onSend: P,
			onTerminate: F
		})]
	});
});
ar.displayName = "A2UIChatLayout";
//#endregion
//#region src/components/messages/timeline/MessageBubble.tsx
function or(e) {
	let t = e.split(".").pop()?.toLowerCase() || "", n = { size: 14 };
	return [
		"jpg",
		"jpeg",
		"png",
		"gif",
		"webp",
		"svg",
		"bmp"
	].includes(t) ? /* @__PURE__ */ z(O, { ...n }) : [
		"mp4",
		"avi",
		"mov",
		"mkv",
		"webm"
	].includes(t) ? /* @__PURE__ */ z(L, { ...n }) : [
		"mp3",
		"wav",
		"ogg",
		"flac",
		"aac"
	].includes(t) ? /* @__PURE__ */ z(M, { ...n }) : [
		"zip",
		"tar",
		"gz",
		"rar",
		"7z"
	].includes(t) ? /* @__PURE__ */ z(h, { ...n }) : [
		"pdf",
		"doc",
		"docx",
		"txt",
		"md",
		"rtf"
	].includes(t) ? /* @__PURE__ */ z(E, { ...n }) : /* @__PURE__ */ z(T, { ...n });
}
var sr = ({ status: e }) => {
	switch (e) {
		case "pending": return /* @__PURE__ */ z("span", { style: {
			display: "inline-block",
			width: 8,
			height: 8,
			borderRadius: "50%",
			background: "#f59e0b",
			animation: "pulse 1.5s infinite"
		} });
		case "success": return /* @__PURE__ */ z("span", {
			style: {
				color: "#10b981",
				fontSize: 12
			},
			children: "✓"
		});
		case "failed": return /* @__PURE__ */ z("span", {
			style: {
				color: "#ef4444",
				fontSize: 12
			},
			children: "✗"
		});
		default: return null;
	}
}, cr = ({ documents: e }) => /* @__PURE__ */ z("div", {
	style: {
		marginTop: 8,
		display: "flex",
		flexWrap: "wrap",
		gap: 6
	},
	children: e.map((e, t) => /* @__PURE__ */ B("a", {
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
			/* @__PURE__ */ z(N, { size: 12 }),
			or(e.fileName),
			/* @__PURE__ */ z("span", { children: e.fileName })
		]
	}, t))
}), lr = {
	background: "rgba(0, 0, 0, 0.3)",
	padding: 8,
	borderRadius: 6,
	fontSize: 11,
	fontFamily: "'SF Mono', 'Fira Code', monospace",
	overflowX: "auto",
	whiteSpace: "pre-wrap",
	margin: 0
}, ur = ({ toolCalls: e }) => /* @__PURE__ */ z("div", {
	style: {
		marginTop: 8,
		borderTop: "1px solid var(--ml-border, #30363d)",
		paddingTop: 8
	},
	children: e.map((e, t) => /* @__PURE__ */ B("details", {
		style: {
			marginBottom: 4,
			borderRadius: 8,
			border: "1px solid var(--ml-border, #30363d)",
			background: "var(--ml-bg-secondary, #161b22)",
			padding: 8
		},
		children: [/* @__PURE__ */ B("summary", {
			style: {
				cursor: "pointer",
				display: "flex",
				alignItems: "center",
				gap: 6,
				fontSize: 12,
				listStyle: "none"
			},
			children: [
				/* @__PURE__ */ z(sr, { status: e.status }),
				/* @__PURE__ */ z("span", {
					style: {
						fontFamily: "'SF Mono', monospace",
						color: "var(--ml-accent, #58a6ff)"
					},
					children: e.toolName
				}),
				e.timestamp && /* @__PURE__ */ z("span", {
					style: {
						marginLeft: "auto",
						fontSize: 11,
						color: "var(--ml-text-secondary, #8b949e)"
					},
					children: U(e.timestamp)
				})
			]
		}), /* @__PURE__ */ B("div", {
			style: {
				marginTop: 8,
				borderTop: "1px solid var(--ml-border, #30363d)",
				paddingTop: 8
			},
			children: [
				e.args && /* @__PURE__ */ B("div", {
					style: { marginBottom: 8 },
					children: [/* @__PURE__ */ z("div", {
						style: {
							fontSize: 11,
							fontWeight: 600,
							opacity: .7,
							marginBottom: 4
						},
						children: "参数:"
					}), /* @__PURE__ */ z("pre", {
						style: lr,
						children: e.args
					})]
				}),
				e.status === "success" && e.result && /* @__PURE__ */ B("div", {
					style: { marginBottom: 8 },
					children: [/* @__PURE__ */ z("div", {
						style: {
							fontSize: 11,
							fontWeight: 600,
							opacity: .7,
							marginBottom: 4
						},
						children: "结果:"
					}), /* @__PURE__ */ z("pre", {
						style: lr,
						children: e.result
					})]
				}),
				e.status === "failed" && e.error && /* @__PURE__ */ B("div", {
					style: { marginBottom: 8 },
					children: [/* @__PURE__ */ z("div", {
						style: {
							fontSize: 11,
							fontWeight: 600,
							opacity: .7,
							marginBottom: 4
						},
						children: "错误:"
					}), /* @__PURE__ */ z("pre", {
						style: {
							...lr,
							color: "#fca5a5",
							background: "rgba(239, 68, 68, 0.1)"
						},
						children: e.error
					})]
				})
			]
		})]
	}, t))
}), dr = ({ message: e, showToolCalls: n, selected: r = !1, senderName: i, onSelect: a }) => {
	let o = e.role === H.USER || e.role === H.USER_ANSWER, s = e.role === H.ERROR, c = e.role === H.ASK_USER, l = e.role === H.USER_ANSWER, u = e.role === H.ASK_AGENT, d, f;
	o ? (d = "linear-gradient(135deg, #1a5fb4, #1c71d8)", f = "flex-end") : s ? (d = "rgba(239, 68, 68, 0.15)", f = "flex-start") : c ? (d = "rgba(245, 158, 11, 0.15)", f = "flex-start") : (d = "var(--ml-bg-primary, #0E1117)", f = "flex-start");
	let p = t(() => {
		a?.();
	}, [a]);
	return /* @__PURE__ */ B("div", {
		style: {
			display: "flex",
			flexDirection: "column",
			alignItems: f,
			maxWidth: "100%",
			marginBottom: 8
		},
		onClick: p,
		children: [
			u && e.fromAgent && /* @__PURE__ */ B("div", {
				style: {
					display: "flex",
					alignItems: "center",
					gap: 6,
					marginBottom: 2,
					paddingLeft: 4,
					fontSize: 11
				},
				children: [
					/* @__PURE__ */ z("span", {
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
					/* @__PURE__ */ z(g, {
						size: 12,
						style: { color: "#3b82f6" }
					}),
					/* @__PURE__ */ z("span", {
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
			(l || !o) && /* @__PURE__ */ z("div", {
				style: {
					display: "flex",
					alignItems: "center",
					gap: 6,
					fontSize: 11,
					color: "var(--ml-text-secondary, #8b949e)",
					marginBottom: 2,
					paddingLeft: 4
				},
				children: c ? /* @__PURE__ */ B(re, { children: [/* @__PURE__ */ z(C, {
					size: 14,
					style: { color: "#f59e0b" }
				}), /* @__PURE__ */ B("span", { children: [i, " 询问"] })] }) : l ? /* @__PURE__ */ B(re, { children: [/* @__PURE__ */ z(b, {
					size: 14,
					style: { color: "#10b981" }
				}), /* @__PURE__ */ B("span", { children: ["用户回答 → ", e.agent] })] }) : i
			}),
			/* @__PURE__ */ B("div", {
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
					o && /* @__PURE__ */ z("div", {
						style: {
							fontSize: 10,
							color: "rgba(255,255,255,0.5)",
							textAlign: "right",
							marginBottom: 4,
							fontFamily: "'SF Mono', monospace"
						},
						children: U(e.timestamp)
					}),
					e.content ? /* @__PURE__ */ z("div", {
						className: "message-content",
						dangerouslySetInnerHTML: { __html: $t(e.content) }
					}) : e.isStreaming ? /* @__PURE__ */ B("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: 4
						},
						children: [
							/* @__PURE__ */ z("span", {
								className: "typing-dot",
								children: "●"
							}),
							/* @__PURE__ */ z("span", {
								className: "typing-dot",
								style: { animationDelay: "0.2s" },
								children: "●"
							}),
							/* @__PURE__ */ z("span", {
								className: "typing-dot",
								style: { animationDelay: "0.4s" },
								children: "●"
							})
						]
					}) : null,
					e.documents && e.documents.length > 0 && /* @__PURE__ */ z(cr, { documents: e.documents }),
					n && e.toolCalls && e.toolCalls.length > 0 && /* @__PURE__ */ z(ur, { toolCalls: e.toolCalls })
				]
			}),
			!o && /* @__PURE__ */ z("div", {
				style: {
					fontSize: 10,
					color: "var(--ml-text-tertiary, #6e7681)",
					marginTop: 2,
					paddingLeft: 4,
					fontFamily: "'SF Mono', monospace"
				},
				children: U(e.timestamp)
			})
		]
	});
};
//#endregion
//#region src/store/index.ts
function fr(e) {
	return f({
		reducer: {
			chat: Je,
			user: It
		},
		preloadedState: e,
		middleware: (e) => e({ serializableCheck: { ignoredPaths: ["chat.messages"] } })
	});
}
var pr = fr();
Fn(pr);
//#endregion
export { ar as A2UIChatLayout, ir as A2UIMessageList, Xt as AgentAvatar, mn as InputArea, dr as MessageBubble, H as MessageRoles, $n as RapTimelineChatLayout, Qn as RapTimelineMessageList, oe as RunAgentTypes, Rn as SampleChatLayout, Ln as SampleMessageList, V as SpecialEventNames, In as TimelineChatLayout, ln as TimelineMessageList, fn as TokensBar, De as addMessage, Ue as addToolCallFailed, Ve as addToolCallStart, He as addToolCallSuccess, Oe as addUserMessage, Re as appendStreamContent, ze as appendStreamReasonContent, Ft as clearAuth, Ne as clearMessages, Ct as clearToken, fr as createAgentChatStore, U as formatTime, ce as formatTimeShort, G as generateId, Tt as getApiInstance, kt as getConfig, St as getToken, wt as getTokenStorageConfig, At as getWebSocketConfig, W as hashColor, Ot as initAgentChatConfig, Be as markStreamDone, Ae as prependMessages, $t as renderMarkdown, qe as resetChat, nt as selectAgentTokens, tt as selectAgents, st as selectAuthErrorCode, Qe as selectConnectionError, $e as selectCurrentAgent, it as selectHasMoreMessages, Rt as selectIsAdmin, ot as selectIsAuthenticated, Ze as selectIsChatLoading, Xe as selectIsConnected, at as selectIsLoadingMore, Lt as selectIsLoggedIn, zt as selectIsTenant, Ye as selectMessages, et as selectSessionId, rt as selectShowToolCallLog, Vt as selectToken, Bt as selectUser, Ht as selectUserLoading, Ce as setAgents, be as setAuthErrorCode, ye as setAuthenticated, _e as setConnected, ve as setConnectionError, Se as setCurrentAgent, je as setHasMore, q as setLoading, Me as setLoadingMore, ke as setMessages, xe as setSessionId, Ee as setShowToolCallLog, xt as setToken, Nt as setTokenAction, Dt as setTokenExpiredCallback, Fn as setTransportStore, Mt as setUser, se as sleep, pr as store, We as updateAgentTokens, Nn as useChatTransport, qt as useTurns };
