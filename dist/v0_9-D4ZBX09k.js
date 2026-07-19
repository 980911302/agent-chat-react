import { C as e, D as t, E as n, S as r, T as i, _ as a, a as o, b as s, c, d as l, f as u, g as d, h as f, i as p, l as m, m as h, n as g, o as _, p as ee, r as te, s as ne, u as v, v as y, w as b, x, y as re } from "./v0_9-Bi_2jVc3.js";
//#region ../../node_modules/.pnpm/@a2ui+lit@0.9.3_signal-polyfill@0.2.2/node_modules/@a2ui/lit/src/v0_9/a2ui-controller.js
var S = class {
	constructor(e, t) {
		this.host = e, this.binder = new l(this.host.context, t.schema), this.props = this.binder.snapshot, this.host.addController(this), this.host.isConnected && this.hostConnected();
	}
	hostConnected() {
		this.subscription ||= this.binder.subscribe((e) => {
			this.props = e, this.host.requestUpdate();
		});
	}
	hostDisconnected() {
		this.subscription?.unsubscribe(), this.subscription = void 0;
	}
	dispose() {
		this.binder.dispose();
	}
}, ie = globalThis, ae = ie.ShadowRoot && (ie.ShadyCSS === void 0 || ie.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, oe = Symbol(), se = /* @__PURE__ */ new WeakMap(), ce = class {
	constructor(e, t, n) {
		if (this._$cssResult$ = !0, n !== oe) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = e, this.t = t;
	}
	get styleSheet() {
		let e = this.o, t = this.t;
		if (ae && e === void 0) {
			let n = t !== void 0 && t.length === 1;
			n && (e = se.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && se.set(t, e));
		}
		return e;
	}
	toString() {
		return this.cssText;
	}
}, le = (e) => new ce(typeof e == "string" ? e : e + "", void 0, oe), C = (e, ...t) => new ce(e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
	if (!0 === e._$cssResult$) return e.cssText;
	if (typeof e == "number") return e;
	throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
})(n) + e[r + 1], e[0]), e, oe), ue = (e, t) => {
	if (ae) e.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let n of t) {
		let t = document.createElement("style"), r = ie.litNonce;
		r !== void 0 && t.setAttribute("nonce", r), t.textContent = n.cssText, e.appendChild(t);
	}
}, de = ae ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return le(t);
})(e) : e, { is: fe, defineProperty: pe, getOwnPropertyDescriptor: me, getOwnPropertyNames: he, getOwnPropertySymbols: ge, getPrototypeOf: _e } = Object, ve = globalThis, ye = ve.trustedTypes, be = ye ? ye.emptyScript : "", xe = ve.reactiveElementPolyfillSupport, w = (e, t) => e, Se = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? be : null;
				break;
			case Object:
			case Array: e = e == null ? e : JSON.stringify(e);
		}
		return e;
	},
	fromAttribute(e, t) {
		let n = e;
		switch (t) {
			case Boolean:
				n = e !== null;
				break;
			case Number:
				n = e === null ? null : Number(e);
				break;
			case Object:
			case Array: try {
				n = JSON.parse(e);
			} catch {
				n = null;
			}
		}
		return n;
	}
}, Ce = (e, t) => !fe(e, t), we = {
	attribute: !0,
	type: String,
	converter: Se,
	reflect: !1,
	useDefault: !1,
	hasChanged: Ce
};
Symbol.metadata ??= Symbol("metadata"), ve.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var T = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = we) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && pe(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = me(this.prototype, e) ?? {
			get() {
				return this[t];
			},
			set(e) {
				this[t] = e;
			}
		};
		return {
			get: r,
			set(t) {
				let a = r?.call(this);
				i?.call(this, t), this.requestUpdate(e, a, n);
			},
			configurable: !0,
			enumerable: !0
		};
	}
	static getPropertyOptions(e) {
		return this.elementProperties.get(e) ?? we;
	}
	static _$Ei() {
		if (this.hasOwnProperty(w("elementProperties"))) return;
		let e = _e(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(w("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(w("properties"))) {
			let e = this.properties, t = [...he(e), ...ge(e)];
			for (let n of t) this.createProperty(n, e[n]);
		}
		let e = this[Symbol.metadata];
		if (e !== null) {
			let t = litPropertyMetadata.get(e);
			if (t !== void 0) for (let [e, n] of t) this.elementProperties.set(e, n);
		}
		this._$Eh = /* @__PURE__ */ new Map();
		for (let [e, t] of this.elementProperties) {
			let n = this._$Eu(e, t);
			n !== void 0 && this._$Eh.set(n, e);
		}
		this.elementStyles = this.finalizeStyles(this.styles);
	}
	static finalizeStyles(e) {
		let t = [];
		if (Array.isArray(e)) {
			let n = new Set(e.flat(Infinity).reverse());
			for (let e of n) t.unshift(de(e));
		} else e !== void 0 && t.push(de(e));
		return t;
	}
	static _$Eu(e, t) {
		let n = t.attribute;
		return !1 === n ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
	}
	constructor() {
		super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
	}
	_$Ev() {
		this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
	}
	addController(e) {
		(this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
	}
	removeController(e) {
		this._$EO?.delete(e);
	}
	_$E_() {
		let e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
		for (let n of t.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
		e.size > 0 && (this._$Ep = e);
	}
	createRenderRoot() {
		let e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
		return ue(e, this.constructor.elementStyles), e;
	}
	connectedCallback() {
		this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
	}
	enableUpdating(e) {}
	disconnectedCallback() {
		this._$EO?.forEach((e) => e.hostDisconnected?.());
	}
	attributeChangedCallback(e, t, n) {
		this._$AK(e, n);
	}
	_$ET(e, t) {
		let n = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, n);
		if (r !== void 0 && !0 === n.reflect) {
			let i = (n.converter?.toAttribute === void 0 ? Se : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? Se : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? Ce)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
			this.C(e, t, n);
		}
		!1 === this.isUpdatePending && (this._$ES = this._$EP());
	}
	C(e, t, { useDefault: n, reflect: r, wrapped: i }, a) {
		n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), !0 !== i || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)), !0 === r && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
	}
	async _$EP() {
		this.isUpdatePending = !0;
		try {
			await this._$ES;
		} catch (e) {
			Promise.reject(e);
		}
		let e = this.scheduleUpdate();
		return e != null && await e, !this.isUpdatePending;
	}
	scheduleUpdate() {
		return this.performUpdate();
	}
	performUpdate() {
		if (!this.isUpdatePending) return;
		if (!this.hasUpdated) {
			if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
				for (let [e, t] of this._$Ep) this[e] = t;
				this._$Ep = void 0;
			}
			let e = this.constructor.elementProperties;
			if (e.size > 0) for (let [t, n] of e) {
				let { wrapped: e } = n, r = this[t];
				!0 !== e || this._$AL.has(t) || r === void 0 || this.C(t, void 0, n, r);
			}
		}
		let e = !1, t = this._$AL;
		try {
			e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((e) => e.hostUpdate?.()), this.update(t)) : this._$EM();
		} catch (t) {
			throw e = !1, this._$EM(), t;
		}
		e && this._$AE(t);
	}
	willUpdate(e) {}
	_$AE(e) {
		this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
	}
	_$EM() {
		this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
	}
	get updateComplete() {
		return this.getUpdateComplete();
	}
	getUpdateComplete() {
		return this._$ES;
	}
	shouldUpdate(e) {
		return !0;
	}
	update(e) {
		this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
	}
	updated(e) {}
	firstUpdated(e) {}
};
T.elementStyles = [], T.shadowRootOptions = { mode: "open" }, T[w("elementProperties")] = /* @__PURE__ */ new Map(), T[w("finalized")] = /* @__PURE__ */ new Map(), xe?.({ ReactiveElement: T }), (ve.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region ../../node_modules/.pnpm/lit-html@3.3.3/node_modules/lit-html/lit-html.js
var Te = globalThis, Ee = (e) => e, De = Te.trustedTypes, Oe = De ? De.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, ke = "$lit$", E = `lit$${Math.random().toFixed(9).slice(2)}$`, Ae = "?" + E, je = `<${Ae}>`, D = document, O = () => D.createComment(""), k = (e) => e === null || typeof e != "object" && typeof e != "function", Me = Array.isArray, Ne = (e) => Me(e) || typeof e?.[Symbol.iterator] == "function", Pe = "[ 	\n\f\r]", Fe = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ie = /-->/g, Le = />/g, A = RegExp(`>|${Pe}(?:([^\\s"'>=/]+)(${Pe}*=${Pe}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), Re = /'/g, ze = /"/g, Be = /^(?:script|style|textarea|title)$/i, j = ((e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}))(1), M = Symbol.for("lit-noChange"), N = Symbol.for("lit-nothing"), Ve = /* @__PURE__ */ new WeakMap(), P = D.createTreeWalker(D, 129);
function He(e, t) {
	if (!Me(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return Oe === void 0 ? t : Oe.createHTML(t);
}
var Ue = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = Fe;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === Fe ? c[1] === "!--" ? o = Ie : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = A) : (Be.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = A) : o = Le : o === A ? c[0] === ">" ? (o = i ?? Fe, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? A : c[3] === "\"" ? ze : Re) : o === ze || o === Re ? o = A : o === Ie || o === Le ? o = Fe : (o = A, i = void 0);
		let d = o === A && e[t + 1].startsWith("/>") ? " " : "";
		a += o === Fe ? n + je : l >= 0 ? (r.push(s), n.slice(0, l) + ke + n.slice(l) + E + d) : n + E + (l === -2 ? t : d);
	}
	return [He(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, We = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = Ue(t, n);
		if (this.el = e.createElement(l, r), P.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = P.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(ke)) {
					let t = u[o++], n = i.getAttribute(e).split(E), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? qe : r[1] === "?" ? Je : r[1] === "@" ? Ye : I
					}), i.removeAttribute(e);
				} else e.startsWith(E) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (Be.test(i.tagName)) {
					let e = i.textContent.split(E), t = e.length - 1;
					if (t > 0) {
						i.textContent = De ? De.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], O()), P.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], O());
					}
				}
			} else if (i.nodeType === 8) if (i.data === Ae) c.push({
				type: 2,
				index: a
			});
			else {
				let e = -1;
				for (; (e = i.data.indexOf(E, e + 1)) !== -1;) c.push({
					type: 7,
					index: a
				}), e += E.length - 1;
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = D.createElement("template");
		return n.innerHTML = e, n;
	}
};
function F(e, t, n = e, r) {
	if (t === M) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = k(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = F(e, i._$AS(e, t.values), i, r)), t;
}
var Ge = class {
	constructor(e, t) {
		this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
	}
	get parentNode() {
		return this._$AM.parentNode;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	u(e) {
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? D).importNode(t, !0);
		P.currentNode = r;
		let i = P.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new Ke(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Xe(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = P.nextNode(), a++);
		}
		return P.currentNode = D, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, Ke = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = N, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
	}
	get parentNode() {
		let e = this._$AA.parentNode, t = this._$AM;
		return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
	}
	get startNode() {
		return this._$AA;
	}
	get endNode() {
		return this._$AB;
	}
	_$AI(e, t = this) {
		e = F(this, e, t), k(e) ? e === N || e == null || e === "" ? (this._$AH !== N && this._$AR(), this._$AH = N) : e !== this._$AH && e !== M && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? Ne(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== N && k(this._$AH) ? this._$AA.nextSibling.data = e : this.T(D.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = We.createElement(He(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new Ge(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = Ve.get(e.strings);
		return t === void 0 && Ve.set(e.strings, t = new We(e)), t;
	}
	k(t) {
		Me(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(O()), this.O(O()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = Ee(e).nextSibling;
			Ee(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, I = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = N, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = N;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = F(this, e, t, 0), a = !k(e) || e !== this._$AH && e !== M, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = F(this, r[n + o], t, o), s === M && (s = this._$AH[o]), a ||= !k(s) || s !== this._$AH[o], s === N ? e = N : e !== N && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === N ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, qe = class extends I {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === N ? void 0 : e;
	}
}, Je = class extends I {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== N);
	}
}, Ye = class extends I {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = F(this, e, t, 0) ?? N) === M) return;
		let n = this._$AH, r = e === N && n !== N || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== N && (n === N || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, Xe = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		F(this, e);
	}
}, Ze = {
	M: ke,
	P: E,
	A: Ae,
	C: 1,
	L: Ue,
	R: Ge,
	D: Ne,
	V: F,
	I: Ke,
	H: I,
	N: Je,
	U: Ye,
	B: qe,
	F: Xe
}, Qe = Te.litHtmlPolyfillSupport;
Qe?.(We, Ke), (Te.litHtmlVersions ??= []).push("3.3.3");
var $e = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new Ke(t.insertBefore(O(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, et = globalThis, L = class extends T {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = $e(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return M;
	}
};
L._$litElement$ = !0, L.finalized = !0, et.litElementHydrateSupport?.({ LitElement: L });
var tt = et.litElementPolyfillSupport;
tt?.({ LitElement: L }), (et.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region ../../node_modules/.pnpm/@lit+reactive-element@2.1.2/node_modules/@lit/reactive-element/decorators/custom-element.js
var R = (e) => (t, n) => {
	n === void 0 ? customElements.define(e, t) : n.addInitializer(() => {
		customElements.define(e, t);
	});
}, nt = {
	attribute: !0,
	type: String,
	converter: Se,
	reflect: !1,
	hasChanged: Ce
}, rt = (e = nt, t, n) => {
	let { kind: r, metadata: i } = n, a = globalThis.litPropertyMetadata.get(i);
	if (a === void 0 && globalThis.litPropertyMetadata.set(i, a = /* @__PURE__ */ new Map()), r === "setter" && ((e = Object.create(e)).wrapped = !0), a.set(n.name, e), r === "accessor") {
		let { name: r } = n;
		return {
			set(n) {
				let i = t.get.call(this);
				t.set.call(this, n), this.requestUpdate(r, i, e, !0, n);
			},
			init(t) {
				return t !== void 0 && this.C(r, void 0, e, t), t;
			}
		};
	}
	if (r === "setter") {
		let { name: r } = n;
		return function(n) {
			let i = this[r];
			t.call(this, n), this.requestUpdate(r, i, e, !0, n);
		};
	}
	throw Error("Unsupported decorator location: " + r);
};
function it(e) {
	return (t, n) => typeof n == "object" ? rt(e, t, n) : ((e, t, n) => {
		let r = t.hasOwnProperty(n);
		return t.constructor.createProperty(n, e), r ? Object.getOwnPropertyDescriptor(t, n) : void 0;
	})(e, t, n);
}
//#endregion
//#region ../../node_modules/.pnpm/@lit+reactive-element@2.1.2/node_modules/@lit/reactive-element/decorators/state.js
function at(e) {
	return it({
		...e,
		state: !0,
		attribute: !1
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@lit+reactive-element@2.1.2/node_modules/@lit/reactive-element/decorators/base.js
var ot = (e, t, n) => (n.configurable = !0, n.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(e, t, n), n);
//#endregion
//#region ../../node_modules/.pnpm/@lit+reactive-element@2.1.2/node_modules/@lit/reactive-element/decorators/query.js
function st(e, t) {
	return (n, r, i) => {
		let a = (t) => t.renderRoot?.querySelector(e) ?? null;
		if (t) {
			let { get: e, set: t } = typeof r == "object" ? n : i ?? (() => {
				let e = Symbol();
				return {
					get() {
						return this[e];
					},
					set(t) {
						this[e] = t;
					}
				};
			})();
			return ot(n, r, { get() {
				let n = e.call(this);
				return n === void 0 && (n = a(this), (n !== null || this.hasUpdated) && t.call(this, n)), n;
			} });
		}
		return ot(n, r, { get() {
			return a(this);
		} });
	};
}
//#endregion
//#region ../../node_modules/.pnpm/lit-html@3.3.3/node_modules/lit-html/static.js
var ct = Symbol.for(""), lt = (e) => {
	if (e?.r === ct) return e?._$litStatic$;
}, ut = (e) => ({
	_$litStatic$: e,
	r: ct
}), dt = /* @__PURE__ */ new Map(), ft = ((e) => (t, ...n) => {
	let r = n.length, i, a, o = [], s = [], c, l = 0, u = !1;
	for (; l < r;) {
		for (c = t[l]; l < r && (a = n[l], i = lt(a)) !== void 0;) c += i + t[++l], u = !0;
		l !== r && s.push(a), o.push(c), l++;
	}
	if (l === r && o.push(t[r]), u) {
		let e = o.join("$$lit$$");
		(t = dt.get(e)) === void 0 && (o.raw = o, dt.set(e, t = o)), n = s;
	}
	return e(t, ...n);
})(j);
//#endregion
//#region ../../node_modules/.pnpm/@a2ui+lit@0.9.3_signal-polyfill@0.2.2/node_modules/@a2ui/lit/src/v0_9/surface/render-a2ui-node.js
function pt(e, t) {
	let n = e.componentModel.type, r = t.components.get(n);
	if (!r) return console.warn(`Component implementation not found for type: ${n}`), N;
	let i = ut(r.tagName);
	return ft`<${i} .context=${e}></${i}>`;
}
//#endregion
//#region ../../node_modules/.pnpm/@a2ui+lit@0.9.3_signal-polyfill@0.2.2/node_modules/@a2ui/lit/src/v0_9/surface/a2ui-surface.js
var mt = function(e, t, n, r, i, a) {
	function o(e) {
		if (e !== void 0 && typeof e != "function") throw TypeError("Function expected");
		return e;
	}
	for (var s = r.kind, c = s === "getter" ? "get" : s === "setter" ? "set" : "value", l = !t && e ? r.static ? e : e.prototype : null, u = t || (l ? Object.getOwnPropertyDescriptor(l, r.name) : {}), d, f = !1, p = n.length - 1; p >= 0; p--) {
		var m = {};
		for (var h in r) m[h] = h === "access" ? {} : r[h];
		for (var h in r.access) m.access[h] = r.access[h];
		m.addInitializer = function(e) {
			if (f) throw TypeError("Cannot add initializers after decoration has completed");
			a.push(o(e || null));
		};
		var g = (0, n[p])(s === "accessor" ? {
			get: u.get,
			set: u.set
		} : u[c], m);
		if (s === "accessor") {
			if (g === void 0) continue;
			if (typeof g != "object" || !g) throw TypeError("Object expected");
			(d = o(g.get)) && (u.get = d), (d = o(g.set)) && (u.set = d), (d = o(g.init)) && i.unshift(d);
		} else (d = o(g)) && (s === "field" ? i.unshift(d) : u[c] = d);
	}
	l && Object.defineProperty(l, r.name, u), f = !0;
}, z = function(e, t, n) {
	for (var r = arguments.length > 2, i = 0; i < t.length; i++) n = r ? t[i].call(e, n) : t[i].call(e);
	return r ? n : void 0;
}, ht = (() => {
	let e = [R("a2ui-surface")], t, n = [], r, i = L, a, o = [], s = [], c, l = [], d = [];
	var f = class extends i {
		static {
			r = this;
		}
		constructor() {
			super(...arguments), this.#e = z(this, o, void 0), this.#t = (z(this, s), z(this, l, !1)), this.unsubscribe = z(this, d);
		}
		static {
			let u = typeof Symbol == "function" && Symbol.metadata ? Object.create(i[Symbol.metadata] ?? null) : void 0;
			a = [it({ type: Object })], c = [at()], mt(this, null, a, {
				kind: "accessor",
				name: "surface",
				static: !1,
				private: !1,
				access: {
					has: (e) => "surface" in e,
					get: (e) => e.surface,
					set: (e, t) => {
						e.surface = t;
					}
				},
				metadata: u
			}, o, s), mt(this, null, c, {
				kind: "accessor",
				name: "_hasRoot",
				static: !1,
				private: !1,
				access: {
					has: (e) => "_hasRoot" in e,
					get: (e) => e._hasRoot,
					set: (e, t) => {
						e._hasRoot = t;
					}
				},
				metadata: u
			}, l, d), mt(null, t = { value: r }, e, {
				kind: "class",
				name: r.name,
				metadata: u
			}, null, n), f = r = t.value, u && Object.defineProperty(r, Symbol.metadata, {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: u
			}), z(r, n);
		}
		#e;
		get surface() {
			return this.#e;
		}
		set surface(e) {
			this.#e = e;
		}
		#t;
		get _hasRoot() {
			return this.#t;
		}
		set _hasRoot(e) {
			this.#t = e;
		}
		willUpdate(e) {
			if (e.has("surface") && (this.unsubscribe &&= (this.unsubscribe(), void 0), this._hasRoot = !!this.surface?.componentsModel.get("root"), this.surface && !this._hasRoot)) {
				let e = this.surface.componentsModel.onCreated.subscribe((e) => {
					e.id === "root" && (this._hasRoot = !0, this.requestUpdate(), this.unsubscribe?.(), this.unsubscribe = void 0);
				});
				this.unsubscribe = () => e.unsubscribe();
			}
		}
		disconnectedCallback() {
			super.disconnectedCallback(), this.unsubscribe &&= (this.unsubscribe(), void 0);
		}
		render() {
			if (!this.surface) return N;
			if (!this._hasRoot) return j`<slot name="loading"><div>Loading surface...</div></slot>`;
			try {
				return j`${pt(new u(this.surface, "root", "/"), this.surface.catalog)}`;
			} catch (e) {
				return console.error("Error creating root context:", e), j`<div>Error rendering surface</div>`;
			}
		}
	};
	return r;
})(), gt = function(e, t, n, r, i, a) {
	function o(e) {
		if (e !== void 0 && typeof e != "function") throw TypeError("Function expected");
		return e;
	}
	for (var s = r.kind, c = s === "getter" ? "get" : s === "setter" ? "set" : "value", l = !t && e ? r.static ? e : e.prototype : null, u = t || (l ? Object.getOwnPropertyDescriptor(l, r.name) : {}), d, f = !1, p = n.length - 1; p >= 0; p--) {
		var m = {};
		for (var h in r) m[h] = h === "access" ? {} : r[h];
		for (var h in r.access) m.access[h] = r.access[h];
		m.addInitializer = function(e) {
			if (f) throw TypeError("Cannot add initializers after decoration has completed");
			a.push(o(e || null));
		};
		var g = (0, n[p])(s === "accessor" ? {
			get: u.get,
			set: u.set
		} : u[c], m);
		if (s === "accessor") {
			if (g === void 0) continue;
			if (typeof g != "object" || !g) throw TypeError("Object expected");
			(d = o(g.get)) && (u.get = d), (d = o(g.set)) && (u.set = d), (d = o(g.init)) && i.unshift(d);
		} else (d = o(g)) && (s === "field" ? i.unshift(d) : u[c] = d);
	}
	l && Object.defineProperty(l, r.name, u), f = !0;
}, _t = function(e, t, n) {
	for (var r = arguments.length > 2, i = 0; i < t.length; i++) n = r ? t[i].call(e, n) : t[i].call(e);
	return r ? n : void 0;
}, vt = (() => {
	let e = L, t, n = [], r = [];
	return class extends e {
		constructor() {
			super(...arguments), this.#e = _t(this, n, void 0), this.controller = _t(this, r);
		}
		static {
			let i = typeof Symbol == "function" && Symbol.metadata ? Object.create(e[Symbol.metadata] ?? null) : void 0;
			t = [it({ type: Object })], gt(this, null, t, {
				kind: "accessor",
				name: "context",
				static: !1,
				private: !1,
				access: {
					has: (e) => "context" in e,
					get: (e) => e.context,
					set: (e, t) => {
						e.context = t;
					}
				},
				metadata: i
			}, n, r), i && Object.defineProperty(this, Symbol.metadata, {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: i
			});
		}
		#e;
		get context() {
			return this.#e;
		}
		set context(e) {
			this.#e = e;
		}
		renderNode(e, t) {
			if (!e) return N;
			let n = e, { surface: r, path: i } = this.context.dataContext, a = t;
			return typeof e == "object" && e && e.id && !e.type && (n = e.id, a ??= e.basePath), a ??= i, pt(new u(r, n, a), r.catalog);
		}
		willUpdate(e) {
			super.willUpdate(e), e.has("context") && this.context && (this.controller && (this.removeController(this.controller), this.controller.dispose()), this.controller = this.createController());
		}
	};
})(), yt = class extends Event {
	constructor(e, t, n, r) {
		super("context-request", {
			bubbles: !0,
			composed: !0
		}), this.context = e, this.contextTarget = t, this.callback = n, this.subscribe = r ?? !1;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@lit+context@1.1.6/node_modules/@lit/context/lib/create-context.js
function bt(e) {
	return e;
}
//#endregion
//#region ../../node_modules/.pnpm/@lit+context@1.1.6/node_modules/@lit/context/lib/controllers/context-consumer.js
var xt = class {
	constructor(e, t, n, r) {
		if (this.subscribe = !1, this.provided = !1, this.value = void 0, this.t = (e, t) => {
			this.unsubscribe && (this.unsubscribe !== t && (this.provided = !1, this.unsubscribe()), this.subscribe || this.unsubscribe()), this.value = e, this.host.requestUpdate(), this.provided && !this.subscribe || (this.provided = !0, this.callback && this.callback(e, t)), this.unsubscribe = t;
		}, this.host = e, t.context !== void 0) {
			let e = t;
			this.context = e.context, this.callback = e.callback, this.subscribe = e.subscribe ?? !1;
		} else this.context = t, this.callback = n, this.subscribe = r ?? !1;
		this.host.addController(this);
	}
	hostConnected() {
		this.dispatchRequest();
	}
	hostDisconnected() {
		this.unsubscribe &&= (this.unsubscribe(), void 0);
	}
	dispatchRequest() {
		this.host.dispatchEvent(new yt(this.context, this.host, this.t, this.subscribe));
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@lit+context@1.1.6/node_modules/@lit/context/lib/decorators/consume.js
function St({ context: e, subscribe: t }) {
	return (n, r) => {
		typeof r == "object" ? r.addInitializer((function() {
			new xt(this, {
				context: e,
				callback: (e) => {
					n.set.call(this, e);
				},
				subscribe: t
			});
		})) : n.constructor.addInitializer(((n) => {
			new xt(n, {
				context: e,
				callback: (e) => {
					n[r] = e;
				},
				subscribe: t
			});
		}));
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@a2ui+lit@0.9.3_signal-polyfill@0.2.2/node_modules/@a2ui/lit/src/v0_9/context/context.js
var Ct = { markdown: bt(Symbol("A2UIMarkdown")) }, wt = class e {
	static {
		this.MAX_DEPTH = 10;
	}
	parse(t, n = 0) {
		if (n > e.MAX_DEPTH) throw new a("Max recursion depth reached in parse");
		if (!t || !t.includes("${")) return [t];
		let r = [], i = new Tt(t);
		for (; !i.isAtEnd();) if (i.matches("${")) {
			i.advance(2);
			let e = this.extractInterpolationContent(i), t = this.parseExpression(e, n + 1);
			t !== null && r.push(t);
		} else if (i.peek() === "\\" && i.peek(1) === "$" && i.peek(2) === "{") i.advance(), r.push("${"), i.advance(2);
		else {
			let e = i.pos;
			for (; !i.isAtEnd() && !(i.matches("${") || i.peek() === "\\" && i.peek(1) === "$" && i.peek(2) === "{");) i.advance();
			r.push(i.input.substring(e, i.pos));
		}
		return r.filter((e) => e !== null && e !== "");
	}
	extractInterpolationContent(e) {
		let t = e.pos, n = 1;
		for (; !e.isAtEnd() && n > 0;) {
			let t = e.advance();
			if (t === "{") n++;
			else if (t === "}") n--;
			else if (t === "'" || t === "\"") {
				let n = t;
				for (; !e.isAtEnd();) {
					let t = e.advance();
					if (t === "\\") e.advance();
					else if (t === n) break;
				}
			}
		}
		if (n > 0) throw new a("Unclosed interpolation: missing '}'");
		return e.input.substring(t, e.pos - 1);
	}
	parseExpression(e, t = 0) {
		if (e = e.trim(), !e) return "";
		let n = new Tt(e), r = this.parseExpressionInternal(n, t);
		if (!n.isAtEnd()) throw new a(`Unexpected characters at end of expression: '${n.input.substring(n.pos)}'`);
		return r;
	}
	parseExpressionInternal(e, t) {
		if (e.skipWhitespace(), e.isAtEnd()) return "";
		if (e.matches("${")) {
			e.advance(2);
			let n = this.extractInterpolationContent(e);
			return this.parseExpression(n, t + 1);
		}
		if (e.matchesString("'") || e.matchesString("\"")) return this.parseStringLiteral(e);
		if (this.isDigit(e.peek())) return this.parseNumberLiteral(e);
		if (e.matchesKeyword("true")) return !0;
		if (e.matchesKeyword("false")) return !1;
		if (e.matchesKeyword("null")) return "";
		let n = this.scanPathOrIdentifier(e);
		return e.skipWhitespace(), e.peek() === "(" ? this.parseFunctionCall(n, e, t) : n ? { path: n } : "";
	}
	scanPathOrIdentifier(e) {
		let t = e.pos;
		for (; !e.isAtEnd();) {
			let t = e.peek();
			if (this.isAlnum(t) || t === "/" || t === "." || t === "_" || t === "-") e.advance();
			else break;
		}
		return e.input.substring(t, e.pos);
	}
	parseFunctionCall(e, t, n) {
		t.match("("), t.skipWhitespace();
		let r = {};
		for (; !t.isAtEnd() && t.peek() !== ")";) {
			let i = this.scanIdentifier(t);
			if (t.skipWhitespace(), !t.match(":")) throw new a(`Expected ':' after argument name '${i}' in function '${e}'`);
			t.skipWhitespace(), r[i] = this.parseExpressionInternal(t, n), t.skipWhitespace(), t.peek() === "," && (t.advance(), t.skipWhitespace());
		}
		if (!t.match(")")) throw new a(`Expected ')' after function arguments for '${e}'`);
		return {
			call: e,
			args: r,
			returnType: "any"
		};
	}
	scanIdentifier(e) {
		let t = e.pos;
		for (; !e.isAtEnd() && (this.isAlnum(e.peek()) || e.peek() === "_");) e.advance();
		return e.input.substring(t, e.pos);
	}
	parseStringLiteral(e) {
		let t = e.advance(), n = "";
		for (; !e.isAtEnd();) {
			let r = e.advance();
			if (r === "\\") {
				let t = e.advance();
				t === "n" ? n += "\n" : t === "t" ? n += "	" : t === "r" ? n += "\r" : n += t;
			} else if (r === t) break;
			else n += r;
		}
		return n;
	}
	parseNumberLiteral(e) {
		let t = e.pos;
		for (; !e.isAtEnd() && (this.isDigit(e.peek()) || e.peek() === ".");) e.advance();
		return Number(e.input.substring(t, e.pos));
	}
	isAlnum(e) {
		return e >= "a" && e <= "z" || e >= "A" && e <= "Z" || e >= "0" && e <= "9";
	}
	isDigit(e) {
		return e >= "0" && e <= "9";
	}
}, Tt = class {
	constructor(e) {
		this.input = e, this.pos = 0;
	}
	isAtEnd() {
		return this.pos >= this.input.length;
	}
	peek(e = 0) {
		return this.pos + e >= this.input.length ? "\0" : this.input[this.pos + e];
	}
	advance(e = 1) {
		let t = this.input.substring(this.pos, this.pos + e);
		return this.pos += e, t;
	}
	match(e) {
		return this.peek() === e ? (this.advance(), !0) : !1;
	}
	matches(e) {
		return !!this.input.startsWith(e, this.pos);
	}
	matchesString(e) {
		return this.peek() === e;
	}
	matchesKeyword(e) {
		if (this.input.startsWith(e, this.pos)) {
			let t = this.peek(e.length);
			if (!/[a-zA-Z0-9_]/.test(t)) return this.advance(e.length), !0;
		}
		return !1;
	}
	skipWhitespace() {
		for (; !this.isAtEnd() && /\s/.test(this.peek());) this.advance();
	}
}, Et = 365.2425, Dt = 6048e5, Ot = 864e5, kt = 3600 * 24;
kt * 7, kt * Et / 12 * 3;
var At = Symbol.for("constructDateFrom");
//#endregion
//#region ../../node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/constructFrom.js
function B(e, t) {
	return typeof e == "function" ? e(t) : e && typeof e == "object" && At in e ? e[At](t) : e instanceof Date ? new e.constructor(t) : new Date(t);
}
//#endregion
//#region ../../node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/toDate.js
function V(e, t) {
	return B(t || e, e);
}
//#endregion
//#region ../../node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/_lib/defaultOptions.js
var jt = {};
function Mt() {
	return jt;
}
//#endregion
//#region ../../node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/startOfWeek.js
function H(e, t) {
	let n = Mt(), r = t?.weekStartsOn ?? t?.locale?.options?.weekStartsOn ?? n.weekStartsOn ?? n.locale?.options?.weekStartsOn ?? 0, i = V(e, t?.in), a = i.getDay(), o = (a < r ? 7 : 0) + a - r;
	return i.setDate(i.getDate() - o), i.setHours(0, 0, 0, 0), i;
}
//#endregion
//#region ../../node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/startOfISOWeek.js
function Nt(e, t) {
	return H(e, {
		...t,
		weekStartsOn: 1
	});
}
//#endregion
//#region ../../node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/getISOWeekYear.js
function Pt(e, t) {
	let n = V(e, t?.in), r = n.getFullYear(), i = B(n, 0);
	i.setFullYear(r + 1, 0, 4), i.setHours(0, 0, 0, 0);
	let a = Nt(i), o = B(n, 0);
	o.setFullYear(r, 0, 4), o.setHours(0, 0, 0, 0);
	let s = Nt(o);
	return n.getTime() >= a.getTime() ? r + 1 : n.getTime() >= s.getTime() ? r : r - 1;
}
//#endregion
//#region ../../node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/_lib/getTimezoneOffsetInMilliseconds.js
function Ft(e) {
	let t = V(e), n = new Date(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate(), t.getHours(), t.getMinutes(), t.getSeconds(), t.getMilliseconds()));
	return n.setUTCFullYear(t.getFullYear()), e - +n;
}
//#endregion
//#region ../../node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/_lib/normalizeDates.js
function It(e, ...t) {
	let n = B.bind(null, e || t.find((e) => typeof e == "object"));
	return t.map(n);
}
//#endregion
//#region ../../node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/startOfDay.js
function Lt(e, t) {
	let n = V(e, t?.in);
	return n.setHours(0, 0, 0, 0), n;
}
//#endregion
//#region ../../node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/differenceInCalendarDays.js
function Rt(e, t, n) {
	let [r, i] = It(n?.in, e, t), a = Lt(r), o = Lt(i), s = +a - Ft(a), c = +o - Ft(o);
	return Math.round((s - c) / Ot);
}
//#endregion
//#region ../../node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/startOfISOWeekYear.js
function zt(e, t) {
	let n = Pt(e, t), r = B(t?.in || e, 0);
	return r.setFullYear(n, 0, 4), r.setHours(0, 0, 0, 0), Nt(r);
}
//#endregion
//#region ../../node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/isDate.js
function Bt(e) {
	return e instanceof Date || typeof e == "object" && Object.prototype.toString.call(e) === "[object Date]";
}
//#endregion
//#region ../../node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/isValid.js
function Vt(e) {
	return !(!Bt(e) && typeof e != "number" || isNaN(+V(e)));
}
//#endregion
//#region ../../node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/startOfYear.js
function Ht(e, t) {
	let n = V(e, t?.in);
	return n.setFullYear(n.getFullYear(), 0, 1), n.setHours(0, 0, 0, 0), n;
}
//#endregion
//#region ../../node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/locale/en-US/_lib/formatDistance.js
var Ut = {
	lessThanXSeconds: {
		one: "less than a second",
		other: "less than {{count}} seconds"
	},
	xSeconds: {
		one: "1 second",
		other: "{{count}} seconds"
	},
	halfAMinute: "half a minute",
	lessThanXMinutes: {
		one: "less than a minute",
		other: "less than {{count}} minutes"
	},
	xMinutes: {
		one: "1 minute",
		other: "{{count}} minutes"
	},
	aboutXHours: {
		one: "about 1 hour",
		other: "about {{count}} hours"
	},
	xHours: {
		one: "1 hour",
		other: "{{count}} hours"
	},
	xDays: {
		one: "1 day",
		other: "{{count}} days"
	},
	aboutXWeeks: {
		one: "about 1 week",
		other: "about {{count}} weeks"
	},
	xWeeks: {
		one: "1 week",
		other: "{{count}} weeks"
	},
	aboutXMonths: {
		one: "about 1 month",
		other: "about {{count}} months"
	},
	xMonths: {
		one: "1 month",
		other: "{{count}} months"
	},
	aboutXYears: {
		one: "about 1 year",
		other: "about {{count}} years"
	},
	xYears: {
		one: "1 year",
		other: "{{count}} years"
	},
	overXYears: {
		one: "over 1 year",
		other: "over {{count}} years"
	},
	almostXYears: {
		one: "almost 1 year",
		other: "almost {{count}} years"
	}
}, Wt = (e, t, n) => {
	let r, i = Ut[e];
	return r = typeof i == "string" ? i : t === 1 ? i.one : i.other.replace("{{count}}", t.toString()), n?.addSuffix ? n.comparison && n.comparison > 0 ? "in " + r : r + " ago" : r;
};
//#endregion
//#region ../../node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/locale/_lib/buildFormatLongFn.js
function Gt(e) {
	return (t = {}) => {
		let n = t.width ? String(t.width) : e.defaultWidth;
		return e.formats[n] || e.formats[e.defaultWidth];
	};
}
var Kt = {
	date: Gt({
		formats: {
			full: "EEEE, MMMM do, y",
			long: "MMMM do, y",
			medium: "MMM d, y",
			short: "MM/dd/yyyy"
		},
		defaultWidth: "full"
	}),
	time: Gt({
		formats: {
			full: "h:mm:ss a zzzz",
			long: "h:mm:ss a z",
			medium: "h:mm:ss a",
			short: "h:mm a"
		},
		defaultWidth: "full"
	}),
	dateTime: Gt({
		formats: {
			full: "{{date}} 'at' {{time}}",
			long: "{{date}} 'at' {{time}}",
			medium: "{{date}}, {{time}}",
			short: "{{date}}, {{time}}"
		},
		defaultWidth: "full"
	})
}, qt = {
	lastWeek: "'last' eeee 'at' p",
	yesterday: "'yesterday at' p",
	today: "'today at' p",
	tomorrow: "'tomorrow at' p",
	nextWeek: "eeee 'at' p",
	other: "P"
}, Jt = (e, t, n, r) => qt[e];
//#endregion
//#region ../../node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/locale/_lib/buildLocalizeFn.js
function U(e) {
	return (t, n) => {
		let r = n?.context ? String(n.context) : "standalone", i;
		if (r === "formatting" && e.formattingValues) {
			let t = e.defaultFormattingWidth || e.defaultWidth, r = n?.width ? String(n.width) : t;
			i = e.formattingValues[r] || e.formattingValues[t];
		} else {
			let t = e.defaultWidth, r = n?.width ? String(n.width) : e.defaultWidth;
			i = e.values[r] || e.values[t];
		}
		let a = e.argumentCallback ? e.argumentCallback(t) : t;
		return i[a];
	};
}
var Yt = {
	ordinalNumber: (e, t) => {
		let n = Number(e), r = n % 100;
		if (r > 20 || r < 10) switch (r % 10) {
			case 1: return n + "st";
			case 2: return n + "nd";
			case 3: return n + "rd";
		}
		return n + "th";
	},
	era: U({
		values: {
			narrow: ["B", "A"],
			abbreviated: ["BC", "AD"],
			wide: ["Before Christ", "Anno Domini"]
		},
		defaultWidth: "wide"
	}),
	quarter: U({
		values: {
			narrow: [
				"1",
				"2",
				"3",
				"4"
			],
			abbreviated: [
				"Q1",
				"Q2",
				"Q3",
				"Q4"
			],
			wide: [
				"1st quarter",
				"2nd quarter",
				"3rd quarter",
				"4th quarter"
			]
		},
		defaultWidth: "wide",
		argumentCallback: (e) => e - 1
	}),
	month: U({
		values: {
			narrow: [
				"J",
				"F",
				"M",
				"A",
				"M",
				"J",
				"J",
				"A",
				"S",
				"O",
				"N",
				"D"
			],
			abbreviated: [
				"Jan",
				"Feb",
				"Mar",
				"Apr",
				"May",
				"Jun",
				"Jul",
				"Aug",
				"Sep",
				"Oct",
				"Nov",
				"Dec"
			],
			wide: [
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September",
				"October",
				"November",
				"December"
			]
		},
		defaultWidth: "wide"
	}),
	day: U({
		values: {
			narrow: [
				"S",
				"M",
				"T",
				"W",
				"T",
				"F",
				"S"
			],
			short: [
				"Su",
				"Mo",
				"Tu",
				"We",
				"Th",
				"Fr",
				"Sa"
			],
			abbreviated: [
				"Sun",
				"Mon",
				"Tue",
				"Wed",
				"Thu",
				"Fri",
				"Sat"
			],
			wide: [
				"Sunday",
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday"
			]
		},
		defaultWidth: "wide"
	}),
	dayPeriod: U({
		values: {
			narrow: {
				am: "a",
				pm: "p",
				midnight: "mi",
				noon: "n",
				morning: "morning",
				afternoon: "afternoon",
				evening: "evening",
				night: "night"
			},
			abbreviated: {
				am: "AM",
				pm: "PM",
				midnight: "midnight",
				noon: "noon",
				morning: "morning",
				afternoon: "afternoon",
				evening: "evening",
				night: "night"
			},
			wide: {
				am: "a.m.",
				pm: "p.m.",
				midnight: "midnight",
				noon: "noon",
				morning: "morning",
				afternoon: "afternoon",
				evening: "evening",
				night: "night"
			}
		},
		defaultWidth: "wide",
		formattingValues: {
			narrow: {
				am: "a",
				pm: "p",
				midnight: "mi",
				noon: "n",
				morning: "in the morning",
				afternoon: "in the afternoon",
				evening: "in the evening",
				night: "at night"
			},
			abbreviated: {
				am: "AM",
				pm: "PM",
				midnight: "midnight",
				noon: "noon",
				morning: "in the morning",
				afternoon: "in the afternoon",
				evening: "in the evening",
				night: "at night"
			},
			wide: {
				am: "a.m.",
				pm: "p.m.",
				midnight: "midnight",
				noon: "noon",
				morning: "in the morning",
				afternoon: "in the afternoon",
				evening: "in the evening",
				night: "at night"
			}
		},
		defaultFormattingWidth: "wide"
	})
};
//#endregion
//#region ../../node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/locale/_lib/buildMatchFn.js
function W(e) {
	return (t, n = {}) => {
		let r = n.width, i = r && e.matchPatterns[r] || e.matchPatterns[e.defaultMatchWidth], a = t.match(i);
		if (!a) return null;
		let o = a[0], s = r && e.parsePatterns[r] || e.parsePatterns[e.defaultParseWidth], c = Array.isArray(s) ? Zt(s, (e) => e.test(o)) : Xt(s, (e) => e.test(o)), l;
		l = e.valueCallback ? e.valueCallback(c) : c, l = n.valueCallback ? n.valueCallback(l) : l;
		let u = t.slice(o.length);
		return {
			value: l,
			rest: u
		};
	};
}
function Xt(e, t) {
	for (let n in e) if (Object.prototype.hasOwnProperty.call(e, n) && t(e[n])) return n;
}
function Zt(e, t) {
	for (let n = 0; n < e.length; n++) if (t(e[n])) return n;
}
//#endregion
//#region ../../node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/locale/_lib/buildMatchPatternFn.js
function Qt(e) {
	return (t, n = {}) => {
		let r = t.match(e.matchPattern);
		if (!r) return null;
		let i = r[0], a = t.match(e.parsePattern);
		if (!a) return null;
		let o = e.valueCallback ? e.valueCallback(a[0]) : a[0];
		o = n.valueCallback ? n.valueCallback(o) : o;
		let s = t.slice(i.length);
		return {
			value: o,
			rest: s
		};
	};
}
//#endregion
//#region ../../node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/locale/en-US.js
var $t = {
	code: "en-US",
	formatDistance: Wt,
	formatLong: Kt,
	formatRelative: Jt,
	localize: Yt,
	match: {
		ordinalNumber: Qt({
			matchPattern: /^(\d+)(th|st|nd|rd)?/i,
			parsePattern: /\d+/i,
			valueCallback: (e) => parseInt(e, 10)
		}),
		era: W({
			matchPatterns: {
				narrow: /^(b|a)/i,
				abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
				wide: /^(before christ|before common era|anno domini|common era)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: { any: [/^b/i, /^(a|c)/i] },
			defaultParseWidth: "any"
		}),
		quarter: W({
			matchPatterns: {
				narrow: /^[1234]/i,
				abbreviated: /^q[1234]/i,
				wide: /^[1234](th|st|nd|rd)? quarter/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: { any: [
				/1/i,
				/2/i,
				/3/i,
				/4/i
			] },
			defaultParseWidth: "any",
			valueCallback: (e) => e + 1
		}),
		month: W({
			matchPatterns: {
				narrow: /^[jfmasond]/i,
				abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
				wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [
					/^j/i,
					/^f/i,
					/^m/i,
					/^a/i,
					/^m/i,
					/^j/i,
					/^j/i,
					/^a/i,
					/^s/i,
					/^o/i,
					/^n/i,
					/^d/i
				],
				any: [
					/^ja/i,
					/^f/i,
					/^mar/i,
					/^ap/i,
					/^may/i,
					/^jun/i,
					/^jul/i,
					/^au/i,
					/^s/i,
					/^o/i,
					/^n/i,
					/^d/i
				]
			},
			defaultParseWidth: "any"
		}),
		day: W({
			matchPatterns: {
				narrow: /^[smtwf]/i,
				short: /^(su|mo|tu|we|th|fr|sa)/i,
				abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
				wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [
					/^s/i,
					/^m/i,
					/^t/i,
					/^w/i,
					/^t/i,
					/^f/i,
					/^s/i
				],
				any: [
					/^su/i,
					/^m/i,
					/^tu/i,
					/^w/i,
					/^th/i,
					/^f/i,
					/^sa/i
				]
			},
			defaultParseWidth: "any"
		}),
		dayPeriod: W({
			matchPatterns: {
				narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
				any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
			},
			defaultMatchWidth: "any",
			parsePatterns: { any: {
				am: /^a/i,
				pm: /^p/i,
				midnight: /^mi/i,
				noon: /^no/i,
				morning: /morning/i,
				afternoon: /afternoon/i,
				evening: /evening/i,
				night: /night/i
			} },
			defaultParseWidth: "any"
		})
	},
	options: {
		weekStartsOn: 0,
		firstWeekContainsDate: 1
	}
};
//#endregion
//#region ../../node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/getDayOfYear.js
function en(e, t) {
	let n = V(e, t?.in);
	return Rt(n, Ht(n)) + 1;
}
//#endregion
//#region ../../node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/getISOWeek.js
function tn(e, t) {
	let n = V(e, t?.in), r = Nt(n) - +zt(n);
	return Math.round(r / Dt) + 1;
}
//#endregion
//#region ../../node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/getWeekYear.js
function nn(e, t) {
	let n = V(e, t?.in), r = n.getFullYear(), i = Mt(), a = t?.firstWeekContainsDate ?? t?.locale?.options?.firstWeekContainsDate ?? i.firstWeekContainsDate ?? i.locale?.options?.firstWeekContainsDate ?? 1, o = B(t?.in || e, 0);
	o.setFullYear(r + 1, 0, a), o.setHours(0, 0, 0, 0);
	let s = H(o, t), c = B(t?.in || e, 0);
	c.setFullYear(r, 0, a), c.setHours(0, 0, 0, 0);
	let l = H(c, t);
	return +n >= +s ? r + 1 : +n >= +l ? r : r - 1;
}
//#endregion
//#region ../../node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/startOfWeekYear.js
function rn(e, t) {
	let n = Mt(), r = t?.firstWeekContainsDate ?? t?.locale?.options?.firstWeekContainsDate ?? n.firstWeekContainsDate ?? n.locale?.options?.firstWeekContainsDate ?? 1, i = nn(e, t), a = B(t?.in || e, 0);
	return a.setFullYear(i, 0, r), a.setHours(0, 0, 0, 0), H(a, t);
}
//#endregion
//#region ../../node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/getWeek.js
function an(e, t) {
	let n = V(e, t?.in), r = H(n, t) - +rn(n, t);
	return Math.round(r / Dt) + 1;
}
//#endregion
//#region ../../node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/_lib/addLeadingZeros.js
function G(e, t) {
	return (e < 0 ? "-" : "") + Math.abs(e).toString().padStart(t, "0");
}
//#endregion
//#region ../../node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/_lib/format/lightFormatters.js
var K = {
	y(e, t) {
		let n = e.getFullYear(), r = n > 0 ? n : 1 - n;
		return G(t === "yy" ? r % 100 : r, t.length);
	},
	M(e, t) {
		let n = e.getMonth();
		return t === "M" ? String(n + 1) : G(n + 1, 2);
	},
	d(e, t) {
		return G(e.getDate(), t.length);
	},
	a(e, t) {
		let n = e.getHours() / 12 >= 1 ? "pm" : "am";
		switch (t) {
			case "a":
			case "aa": return n.toUpperCase();
			case "aaa": return n;
			case "aaaaa": return n[0];
			default: return n === "am" ? "a.m." : "p.m.";
		}
	},
	h(e, t) {
		return G(e.getHours() % 12 || 12, t.length);
	},
	H(e, t) {
		return G(e.getHours(), t.length);
	},
	m(e, t) {
		return G(e.getMinutes(), t.length);
	},
	s(e, t) {
		return G(e.getSeconds(), t.length);
	},
	S(e, t) {
		let n = t.length, r = e.getMilliseconds();
		return G(Math.trunc(r * 10 ** (n - 3)), t.length);
	}
}, q = {
	am: "am",
	pm: "pm",
	midnight: "midnight",
	noon: "noon",
	morning: "morning",
	afternoon: "afternoon",
	evening: "evening",
	night: "night"
}, on = {
	G: function(e, t, n) {
		let r = +(e.getFullYear() > 0);
		switch (t) {
			case "G":
			case "GG":
			case "GGG": return n.era(r, { width: "abbreviated" });
			case "GGGGG": return n.era(r, { width: "narrow" });
			default: return n.era(r, { width: "wide" });
		}
	},
	y: function(e, t, n) {
		if (t === "yo") {
			let t = e.getFullYear(), r = t > 0 ? t : 1 - t;
			return n.ordinalNumber(r, { unit: "year" });
		}
		return K.y(e, t);
	},
	Y: function(e, t, n, r) {
		let i = nn(e, r), a = i > 0 ? i : 1 - i;
		return t === "YY" ? G(a % 100, 2) : t === "Yo" ? n.ordinalNumber(a, { unit: "year" }) : G(a, t.length);
	},
	R: function(e, t) {
		return G(Pt(e), t.length);
	},
	u: function(e, t) {
		return G(e.getFullYear(), t.length);
	},
	Q: function(e, t, n) {
		let r = Math.ceil((e.getMonth() + 1) / 3);
		switch (t) {
			case "Q": return String(r);
			case "QQ": return G(r, 2);
			case "Qo": return n.ordinalNumber(r, { unit: "quarter" });
			case "QQQ": return n.quarter(r, {
				width: "abbreviated",
				context: "formatting"
			});
			case "QQQQQ": return n.quarter(r, {
				width: "narrow",
				context: "formatting"
			});
			default: return n.quarter(r, {
				width: "wide",
				context: "formatting"
			});
		}
	},
	q: function(e, t, n) {
		let r = Math.ceil((e.getMonth() + 1) / 3);
		switch (t) {
			case "q": return String(r);
			case "qq": return G(r, 2);
			case "qo": return n.ordinalNumber(r, { unit: "quarter" });
			case "qqq": return n.quarter(r, {
				width: "abbreviated",
				context: "standalone"
			});
			case "qqqqq": return n.quarter(r, {
				width: "narrow",
				context: "standalone"
			});
			default: return n.quarter(r, {
				width: "wide",
				context: "standalone"
			});
		}
	},
	M: function(e, t, n) {
		let r = e.getMonth();
		switch (t) {
			case "M":
			case "MM": return K.M(e, t);
			case "Mo": return n.ordinalNumber(r + 1, { unit: "month" });
			case "MMM": return n.month(r, {
				width: "abbreviated",
				context: "formatting"
			});
			case "MMMMM": return n.month(r, {
				width: "narrow",
				context: "formatting"
			});
			default: return n.month(r, {
				width: "wide",
				context: "formatting"
			});
		}
	},
	L: function(e, t, n) {
		let r = e.getMonth();
		switch (t) {
			case "L": return String(r + 1);
			case "LL": return G(r + 1, 2);
			case "Lo": return n.ordinalNumber(r + 1, { unit: "month" });
			case "LLL": return n.month(r, {
				width: "abbreviated",
				context: "standalone"
			});
			case "LLLLL": return n.month(r, {
				width: "narrow",
				context: "standalone"
			});
			default: return n.month(r, {
				width: "wide",
				context: "standalone"
			});
		}
	},
	w: function(e, t, n, r) {
		let i = an(e, r);
		return t === "wo" ? n.ordinalNumber(i, { unit: "week" }) : G(i, t.length);
	},
	I: function(e, t, n) {
		let r = tn(e);
		return t === "Io" ? n.ordinalNumber(r, { unit: "week" }) : G(r, t.length);
	},
	d: function(e, t, n) {
		return t === "do" ? n.ordinalNumber(e.getDate(), { unit: "date" }) : K.d(e, t);
	},
	D: function(e, t, n) {
		let r = en(e);
		return t === "Do" ? n.ordinalNumber(r, { unit: "dayOfYear" }) : G(r, t.length);
	},
	E: function(e, t, n) {
		let r = e.getDay();
		switch (t) {
			case "E":
			case "EE":
			case "EEE": return n.day(r, {
				width: "abbreviated",
				context: "formatting"
			});
			case "EEEEE": return n.day(r, {
				width: "narrow",
				context: "formatting"
			});
			case "EEEEEE": return n.day(r, {
				width: "short",
				context: "formatting"
			});
			default: return n.day(r, {
				width: "wide",
				context: "formatting"
			});
		}
	},
	e: function(e, t, n, r) {
		let i = e.getDay(), a = (i - r.weekStartsOn + 8) % 7 || 7;
		switch (t) {
			case "e": return String(a);
			case "ee": return G(a, 2);
			case "eo": return n.ordinalNumber(a, { unit: "day" });
			case "eee": return n.day(i, {
				width: "abbreviated",
				context: "formatting"
			});
			case "eeeee": return n.day(i, {
				width: "narrow",
				context: "formatting"
			});
			case "eeeeee": return n.day(i, {
				width: "short",
				context: "formatting"
			});
			default: return n.day(i, {
				width: "wide",
				context: "formatting"
			});
		}
	},
	c: function(e, t, n, r) {
		let i = e.getDay(), a = (i - r.weekStartsOn + 8) % 7 || 7;
		switch (t) {
			case "c": return String(a);
			case "cc": return G(a, t.length);
			case "co": return n.ordinalNumber(a, { unit: "day" });
			case "ccc": return n.day(i, {
				width: "abbreviated",
				context: "standalone"
			});
			case "ccccc": return n.day(i, {
				width: "narrow",
				context: "standalone"
			});
			case "cccccc": return n.day(i, {
				width: "short",
				context: "standalone"
			});
			default: return n.day(i, {
				width: "wide",
				context: "standalone"
			});
		}
	},
	i: function(e, t, n) {
		let r = e.getDay(), i = r === 0 ? 7 : r;
		switch (t) {
			case "i": return String(i);
			case "ii": return G(i, t.length);
			case "io": return n.ordinalNumber(i, { unit: "day" });
			case "iii": return n.day(r, {
				width: "abbreviated",
				context: "formatting"
			});
			case "iiiii": return n.day(r, {
				width: "narrow",
				context: "formatting"
			});
			case "iiiiii": return n.day(r, {
				width: "short",
				context: "formatting"
			});
			default: return n.day(r, {
				width: "wide",
				context: "formatting"
			});
		}
	},
	a: function(e, t, n) {
		let r = e.getHours() / 12 >= 1 ? "pm" : "am";
		switch (t) {
			case "a":
			case "aa": return n.dayPeriod(r, {
				width: "abbreviated",
				context: "formatting"
			});
			case "aaa": return n.dayPeriod(r, {
				width: "abbreviated",
				context: "formatting"
			}).toLowerCase();
			case "aaaaa": return n.dayPeriod(r, {
				width: "narrow",
				context: "formatting"
			});
			default: return n.dayPeriod(r, {
				width: "wide",
				context: "formatting"
			});
		}
	},
	b: function(e, t, n) {
		let r = e.getHours(), i;
		switch (i = r === 12 ? q.noon : r === 0 ? q.midnight : r / 12 >= 1 ? "pm" : "am", t) {
			case "b":
			case "bb": return n.dayPeriod(i, {
				width: "abbreviated",
				context: "formatting"
			});
			case "bbb": return n.dayPeriod(i, {
				width: "abbreviated",
				context: "formatting"
			}).toLowerCase();
			case "bbbbb": return n.dayPeriod(i, {
				width: "narrow",
				context: "formatting"
			});
			default: return n.dayPeriod(i, {
				width: "wide",
				context: "formatting"
			});
		}
	},
	B: function(e, t, n) {
		let r = e.getHours(), i;
		switch (i = r >= 17 ? q.evening : r >= 12 ? q.afternoon : r >= 4 ? q.morning : q.night, t) {
			case "B":
			case "BB":
			case "BBB": return n.dayPeriod(i, {
				width: "abbreviated",
				context: "formatting"
			});
			case "BBBBB": return n.dayPeriod(i, {
				width: "narrow",
				context: "formatting"
			});
			default: return n.dayPeriod(i, {
				width: "wide",
				context: "formatting"
			});
		}
	},
	h: function(e, t, n) {
		if (t === "ho") {
			let t = e.getHours() % 12;
			return t === 0 && (t = 12), n.ordinalNumber(t, { unit: "hour" });
		}
		return K.h(e, t);
	},
	H: function(e, t, n) {
		return t === "Ho" ? n.ordinalNumber(e.getHours(), { unit: "hour" }) : K.H(e, t);
	},
	K: function(e, t, n) {
		let r = e.getHours() % 12;
		return t === "Ko" ? n.ordinalNumber(r, { unit: "hour" }) : G(r, t.length);
	},
	k: function(e, t, n) {
		let r = e.getHours();
		return r === 0 && (r = 24), t === "ko" ? n.ordinalNumber(r, { unit: "hour" }) : G(r, t.length);
	},
	m: function(e, t, n) {
		return t === "mo" ? n.ordinalNumber(e.getMinutes(), { unit: "minute" }) : K.m(e, t);
	},
	s: function(e, t, n) {
		return t === "so" ? n.ordinalNumber(e.getSeconds(), { unit: "second" }) : K.s(e, t);
	},
	S: function(e, t) {
		return K.S(e, t);
	},
	X: function(e, t, n) {
		let r = e.getTimezoneOffset();
		if (r === 0) return "Z";
		switch (t) {
			case "X": return cn(r);
			case "XXXX":
			case "XX": return J(r);
			default: return J(r, ":");
		}
	},
	x: function(e, t, n) {
		let r = e.getTimezoneOffset();
		switch (t) {
			case "x": return cn(r);
			case "xxxx":
			case "xx": return J(r);
			default: return J(r, ":");
		}
	},
	O: function(e, t, n) {
		let r = e.getTimezoneOffset();
		switch (t) {
			case "O":
			case "OO":
			case "OOO": return "GMT" + sn(r, ":");
			default: return "GMT" + J(r, ":");
		}
	},
	z: function(e, t, n) {
		let r = e.getTimezoneOffset();
		switch (t) {
			case "z":
			case "zz":
			case "zzz": return "GMT" + sn(r, ":");
			default: return "GMT" + J(r, ":");
		}
	},
	t: function(e, t, n) {
		return G(Math.trunc(e / 1e3), t.length);
	},
	T: function(e, t, n) {
		return G(+e, t.length);
	}
};
function sn(e, t = "") {
	let n = e > 0 ? "-" : "+", r = Math.abs(e), i = Math.trunc(r / 60), a = r % 60;
	return a === 0 ? n + String(i) : n + String(i) + t + G(a, 2);
}
function cn(e, t) {
	return e % 60 == 0 ? (e > 0 ? "-" : "+") + G(Math.abs(e) / 60, 2) : J(e, t);
}
function J(e, t = "") {
	let n = e > 0 ? "-" : "+", r = Math.abs(e), i = G(Math.trunc(r / 60), 2), a = G(r % 60, 2);
	return n + i + t + a;
}
//#endregion
//#region ../../node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/_lib/format/longFormatters.js
var ln = (e, t) => {
	switch (e) {
		case "P": return t.date({ width: "short" });
		case "PP": return t.date({ width: "medium" });
		case "PPP": return t.date({ width: "long" });
		default: return t.date({ width: "full" });
	}
}, un = (e, t) => {
	switch (e) {
		case "p": return t.time({ width: "short" });
		case "pp": return t.time({ width: "medium" });
		case "ppp": return t.time({ width: "long" });
		default: return t.time({ width: "full" });
	}
}, dn = {
	p: un,
	P: (e, t) => {
		let n = e.match(/(P+)(p+)?/) || [], r = n[1], i = n[2];
		if (!i) return ln(e, t);
		let a;
		switch (r) {
			case "P":
				a = t.dateTime({ width: "short" });
				break;
			case "PP":
				a = t.dateTime({ width: "medium" });
				break;
			case "PPP":
				a = t.dateTime({ width: "long" });
				break;
			default:
				a = t.dateTime({ width: "full" });
				break;
		}
		return a.replace("{{date}}", ln(r, t)).replace("{{time}}", un(i, t));
	}
}, fn = /^D+$/, pn = /^Y+$/, mn = [
	"D",
	"DD",
	"YY",
	"YYYY"
];
function hn(e) {
	return fn.test(e);
}
function gn(e) {
	return pn.test(e);
}
function _n(e, t, n) {
	let r = vn(e, t, n);
	if (console.warn(r), mn.includes(e)) throw RangeError(r);
}
function vn(e, t, n) {
	let r = e[0] === "Y" ? "years" : "days of the month";
	return `Use \`${e.toLowerCase()}\` instead of \`${e}\` (in \`${t}\`) for formatting ${r} to the input \`${n}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}
//#endregion
//#region ../../node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/format.js
var yn = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g, bn = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g, xn = /^'([^]*?)'?$/, Sn = /''/g, Cn = /[a-zA-Z]/;
function wn(e, t, n) {
	let r = Mt(), i = n?.locale ?? r.locale ?? $t, a = n?.firstWeekContainsDate ?? n?.locale?.options?.firstWeekContainsDate ?? r.firstWeekContainsDate ?? r.locale?.options?.firstWeekContainsDate ?? 1, o = n?.weekStartsOn ?? n?.locale?.options?.weekStartsOn ?? r.weekStartsOn ?? r.locale?.options?.weekStartsOn ?? 0, s = V(e, n?.in);
	if (!Vt(s)) throw RangeError("Invalid time value");
	let c = t.match(bn).map((e) => {
		let t = e[0];
		if (t === "p" || t === "P") {
			let n = dn[t];
			return n(e, i.formatLong);
		}
		return e;
	}).join("").match(yn).map((e) => {
		if (e === "''") return {
			isToken: !1,
			value: "'"
		};
		let t = e[0];
		if (t === "'") return {
			isToken: !1,
			value: Tn(e)
		};
		if (on[t]) return {
			isToken: !0,
			value: e
		};
		if (t.match(Cn)) throw RangeError("Format string contains an unescaped latin alphabet character `" + t + "`");
		return {
			isToken: !1,
			value: e
		};
	});
	i.localize.preprocessor && (c = i.localize.preprocessor(s, c));
	let l = {
		firstWeekContainsDate: a,
		weekStartsOn: o,
		locale: i
	};
	return c.map((r) => {
		if (!r.isToken) return r.value;
		let a = r.value;
		(!n?.useAdditionalWeekYearTokens && gn(a) || !n?.useAdditionalDayOfYearTokens && hn(a)) && _n(a, t, String(e));
		let o = on[a[0]];
		return o(s, a, i.localize, l);
	}).join("");
}
function Tn(e) {
	let t = e.match(xn);
	return t ? t[1].replace(Sn, "'") : e;
}
//#endregion
//#region ../../node_modules/.pnpm/@a2ui+web_core@0.9.2/node_modules/@a2ui/web_core/src/v0_9/basic_catalog/functions/basic_functions_api.js
var En = {
	name: "add",
	returnType: "number",
	schema: b({
		a: i((e) => e === null ? void 0 : e, x.number()),
		b: i((e) => e === null ? void 0 : e, x.number())
	})
}, Dn = {
	name: "subtract",
	returnType: "number",
	schema: b({
		a: i((e) => e === null ? void 0 : e, x.number()),
		b: i((e) => e === null ? void 0 : e, x.number())
	})
}, On = {
	name: "multiply",
	returnType: "number",
	schema: b({
		a: i((e) => e === null ? void 0 : e, x.number()),
		b: i((e) => e === null ? void 0 : e, x.number())
	})
}, kn = {
	name: "divide",
	returnType: "number",
	schema: b({
		a: i((e) => e === null ? void 0 : e, x.number()),
		b: i((e) => e === null ? void 0 : e, x.number())
	})
}, An = {
	name: "equals",
	returnType: "boolean",
	schema: b({
		a: y().refine((e) => e !== void 0, "Required"),
		b: y().refine((e) => e !== void 0, "Required")
	})
}, jn = {
	name: "not_equals",
	returnType: "boolean",
	schema: b({
		a: y().refine((e) => e !== void 0, "Required"),
		b: y().refine((e) => e !== void 0, "Required")
	})
}, Mn = {
	name: "greater_than",
	returnType: "boolean",
	schema: b({
		a: i((e) => e === null ? void 0 : e, x.number()),
		b: i((e) => e === null ? void 0 : e, x.number())
	})
}, Nn = {
	name: "less_than",
	returnType: "boolean",
	schema: b({
		a: i((e) => e === null ? void 0 : e, x.number()),
		b: i((e) => e === null ? void 0 : e, x.number())
	})
}, Pn = {
	name: "and",
	returnType: "boolean",
	schema: b({ values: re(y()).min(2) })
}, Fn = {
	name: "or",
	returnType: "boolean",
	schema: b({ values: re(y()).min(2) })
}, In = {
	name: "not",
	returnType: "boolean",
	schema: b({ value: y().refine((e) => e !== void 0, "Required") })
}, Ln = {
	name: "contains",
	returnType: "boolean",
	schema: b({
		string: i((e) => e === void 0 ? void 0 : String(e), n()),
		substring: i((e) => e === void 0 ? void 0 : String(e), n())
	})
}, Rn = {
	name: "starts_with",
	returnType: "boolean",
	schema: b({
		string: i((e) => e === void 0 ? void 0 : String(e), n()),
		prefix: i((e) => e === void 0 ? void 0 : String(e), n())
	})
}, zn = {
	name: "ends_with",
	returnType: "boolean",
	schema: b({
		string: i((e) => e === void 0 ? void 0 : String(e), n()),
		suffix: i((e) => e === void 0 ? void 0 : String(e), n())
	})
}, Bn = {
	name: "required",
	returnType: "boolean",
	schema: b({ value: y().refine((e) => e !== void 0, "Required") })
}, Vn = {
	name: "regex",
	returnType: "boolean",
	schema: b({
		value: i((e) => e === void 0 ? void 0 : String(e), n()),
		pattern: i((e) => e === void 0 ? void 0 : String(e), n())
	})
}, Hn = {
	name: "length",
	returnType: "boolean",
	schema: b({
		value: y().refine((e) => e !== void 0, "Required"),
		min: x.number().optional(),
		max: x.number().optional()
	}).refine((e) => e.min !== void 0 || e.max !== void 0, { message: "Must provide either 'min' or 'max'" })
}, Un = {
	name: "numeric",
	returnType: "boolean",
	schema: b({
		value: x.number(),
		min: x.number().optional(),
		max: x.number().optional()
	}).refine((e) => e.min !== void 0 || e.max !== void 0, { message: "Must provide either 'min' or 'max'" })
}, Wn = {
	name: "email",
	returnType: "boolean",
	schema: b({ value: i((e) => e === void 0 ? void 0 : String(e), n()) })
}, Gn = {
	name: "formatString",
	returnType: "any",
	schema: b({ value: x.string() })
}, Kn = {
	name: "formatNumber",
	returnType: "string",
	schema: b({
		value: x.number(),
		decimals: x.number().optional(),
		grouping: s().default(!0)
	})
}, qn = {
	name: "formatCurrency",
	returnType: "string",
	schema: b({
		value: x.number(),
		currency: x.string(),
		decimals: x.number().optional(),
		grouping: s().default(!0)
	})
}, Jn = {
	name: "formatDate",
	returnType: "string",
	schema: b({
		value: y().refine((e) => e !== void 0, "Required"),
		format: x.string()
	})
}, Yn = {
	name: "pluralize",
	returnType: "string",
	schema: b({
		value: x.number(),
		zero: x.string().optional(),
		one: x.string().optional(),
		two: x.string().optional(),
		few: x.string().optional(),
		many: x.string().optional(),
		other: x.string()
	}).passthrough()
}, Xn = {
	name: "openUrl",
	returnType: "void",
	schema: b({ url: i((e) => e === void 0 ? void 0 : String(e), n()) })
}, Zn = [
	f(En, (e) => e.a + e.b),
	f(Dn, (e) => e.a - e.b),
	f(On, (e) => e.a * e.b),
	f(kn, (e) => {
		let t = e.a, n = e.b;
		if (t == null || n == null) return NaN;
		let r = Number(t), i = Number(n);
		return Number.isNaN(r) || Number.isNaN(i) ? NaN : i === 0 ? Infinity : r / i;
	}),
	f(An, (e) => e.a === e.b),
	f(jn, (e) => e.a !== e.b),
	f(Mn, (e) => e.a > e.b),
	f(Nn, (e) => e.a < e.b),
	f(Pn, (e) => e.values.every((e) => !!e)),
	f(Fn, (e) => e.values.some((e) => !!e)),
	f(In, (e) => !e.value),
	f(Ln, (e) => e.string.includes(e.substring)),
	f(Rn, (e) => e.string.startsWith(e.prefix)),
	f(zn, (e) => e.string.endsWith(e.suffix)),
	f(Bn, (e) => {
		let t = e.value;
		return !(t == null || typeof t == "string" && t === "" || Array.isArray(t) && t.length === 0);
	}),
	f(Vn, (e) => {
		try {
			return new RegExp(e.pattern).test(e.value);
		} catch (t) {
			throw new a(`Invalid regex pattern: ${e.pattern}`, "regex", t);
		}
	}),
	f(Hn, (e) => {
		let t = e.value, n = 0;
		return (typeof t == "string" || Array.isArray(t)) && (n = t.length), !(e.min !== void 0 && !isNaN(e.min) && n < e.min || e.max !== void 0 && !isNaN(e.max) && n > e.max);
	}),
	f(Un, (e) => !(isNaN(e.value) || e.min !== void 0 && !isNaN(e.min) && e.value < e.min || e.max !== void 0 && !isNaN(e.max) && e.value > e.max)),
	f(Wn, (e) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(e.value)),
	f(Gn, (e, t) => {
		let n = e.value, r = new wt().parse(n);
		if (r.length === 0) return "";
		let i = r.map((e) => typeof e != "object" || !e || Array.isArray(e) ? e : t.resolveSignal(e));
		return ee(() => i.map((e) => d(e) ? e.value : e).join(""));
	}),
	f(Kn, (e) => isNaN(e.value) ? "" : new Intl.NumberFormat("en-US", {
		minimumFractionDigits: e.decimals,
		maximumFractionDigits: e.decimals,
		useGrouping: e.grouping
	}).format(e.value)),
	f(qn, (e) => {
		if (isNaN(e.value)) return "";
		try {
			return new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: e.currency,
				minimumFractionDigits: e.decimals,
				maximumFractionDigits: e.decimals,
				useGrouping: e.grouping
			}).format(e.value);
		} catch {
			return e.value.toFixed(e.decimals || 2);
		}
	}),
	f(Jn, (e) => {
		if (!e.value) return "";
		let t = new Date(e.value);
		if (isNaN(t.getTime())) return "";
		try {
			return e.format === "ISO" ? t.toISOString() : wn(t, e.format);
		} catch (e) {
			return console.warn("Error formatting date:", e), t.toISOString();
		}
	}),
	f(Yn, (e) => {
		let t = new Intl.PluralRules("en-US").select(e.value);
		return String(e[t] ?? e.other ?? "");
	}),
	f(Xn, (e) => {
		e.url && typeof window < "u" && window.open && window.open(e.url, "_blank");
	})
], Y = {
	accessibility: g.optional(),
	weight: e().describe("The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column.").optional()
}, Qn = {
	name: "Text",
	schema: b({
		...Y,
		text: v.describe("The text content to display. While simple Markdown formatting is supported (i.e. without HTML, images, or links), utilizing dedicated UI components is generally preferred for a richer and more structured presentation."),
		variant: r([
			"h1",
			"h2",
			"h3",
			"h4",
			"h5",
			"caption",
			"body"
		]).default("body").describe("A hint for the base text style.").optional()
	}).strict()
}, $n = {
	name: "Image",
	schema: b({
		...Y,
		url: v.describe("The URL of the image to display."),
		description: v.describe("The accessibility description of the image.").optional(),
		fit: r([
			"contain",
			"cover",
			"fill",
			"none",
			"scaleDown"
		]).default("fill").describe("Specifies how the image should be resized to fit its container. This corresponds to the CSS 'object-fit' property.").optional(),
		variant: r([
			"icon",
			"avatar",
			"smallFeature",
			"mediumFeature",
			"largeFeature",
			"header"
		]).default("mediumFeature").describe("A hint for the image size and style.").optional()
	}).strict()
}, er = /* @__PURE__ */ "accountCircle.add.arrowBack.arrowForward.attachFile.calendarToday.call.camera.check.close.delete.download.edit.event.error.fastForward.favorite.favoriteOff.folder.help.home.info.locationOn.lock.lockOpen.mail.menu.moreVert.moreHoriz.notificationsOff.notifications.pause.payment.person.phone.photo.play.print.refresh.rewind.search.send.settings.share.shoppingCart.skipNext.skipPrevious.star.starHalf.starOff.stop.upload.visibility.visibilityOff.volumeDown.volumeMute.volumeOff.volumeUp.warning".split("."), tr = {
	name: "Icon",
	schema: b({
		...Y,
		name: t([r(er), b({ path: n() }).strict()]).describe("The name of the icon to display.")
	}).strict()
}, nr = {
	name: "Video",
	schema: b({
		...Y,
		url: v.describe("The URL of the video to display.")
	}).strict()
}, rr = {
	name: "AudioPlayer",
	schema: b({
		...Y,
		url: v.describe("The URL of the audio to be played."),
		description: v.describe("A description of the audio, such as a title or summary.").optional()
	}).strict()
}, ir = {
	name: "Row",
	schema: b({
		...Y,
		children: o.describe("Defines the children. Use an array of strings for a fixed set of children, or a template object to generate children from a data list. Children cannot be defined inline, they must be referred to by ID."),
		justify: r([
			"center",
			"end",
			"spaceAround",
			"spaceBetween",
			"spaceEvenly",
			"start",
			"stretch"
		]).default("start").describe("Defines the arrangement of children along the main axis (horizontally). Use 'spaceBetween' to push items to the edges, or 'start'/'end'/'center' to pack them together.").optional(),
		align: r([
			"start",
			"center",
			"end",
			"stretch"
		]).default("stretch").describe("Defines the alignment of children along the cross axis (vertically). This is similar to the CSS 'align-items' property, but uses camelCase values (e.g., 'start').").optional()
	}).strict().describe("A layout component that arranges its children horizontally. To create a grid layout, nest Columns within this Row.")
}, ar = {
	name: "Column",
	schema: b({
		...Y,
		children: o.describe("Defines the children. Use an array of strings for a fixed set of children, or a template object to generate children from a data list. Children cannot be defined inline, they must be referred to by ID."),
		justify: r([
			"start",
			"center",
			"end",
			"spaceBetween",
			"spaceAround",
			"spaceEvenly",
			"stretch"
		]).default("start").describe("Defines the arrangement of children along the main axis (vertically). Use 'spaceBetween' to push items to the edges (e.g. header at top, footer at bottom), or 'start'/'end'/'center' to pack them together.").optional(),
		align: r([
			"center",
			"end",
			"start",
			"stretch"
		]).default("stretch").describe("Defines the alignment of children along the cross axis (horizontally). This is similar to the CSS 'align-items' property.").optional()
	}).strict().describe("A layout component that arranges its children vertically. To create a grid layout, nest Rows within this Column.")
}, or = {
	name: "List",
	schema: b({
		...Y,
		children: o.describe("Defines the children. Use an array of strings for a fixed set of children, or a template object to generate children from a data list."),
		direction: r(["vertical", "horizontal"]).default("vertical").describe("The direction in which the list items are laid out.").optional(),
		align: r([
			"start",
			"center",
			"end",
			"stretch"
		]).default("stretch").describe("Defines the alignment of children along the cross axis.").optional()
	}).strict()
}, sr = {
	name: "Card",
	schema: b({
		...Y,
		child: _.describe("The ID of the single child component to be rendered inside the card. To display multiple elements, you MUST wrap them in a layout component (like Column or Row) and pass that container's ID here. Do NOT pass multiple IDs or a non-existent ID. Do NOT define the child component inline.")
	}).strict()
}, cr = {
	name: "Tabs",
	schema: b({
		...Y,
		tabs: re(b({
			title: v.describe("The tab title."),
			child: _.describe("The ID of the child component. Do NOT define the component inline.")
		}).strict()).min(1).describe("An array of objects, where each object defines a tab with a title and a child component.")
	}).strict()
}, lr = {
	name: "Modal",
	schema: b({
		...Y,
		trigger: _.describe("The ID of the component that opens the modal when interacted with (e.g., a button). Do NOT define the component inline."),
		content: _.describe("The ID of the component to be displayed inside the modal. Do NOT define the component inline.")
	}).strict()
}, ur = {
	name: "Divider",
	schema: b({
		...Y,
		axis: r(["horizontal", "vertical"]).default("horizontal").describe("The orientation of the divider.").optional()
	}).strict()
}, dr = {
	name: "Button",
	schema: b({
		...Y,
		child: _.describe("The ID of the child component. Use a 'Text' component for a labeled button. Only use an 'Icon' if the requirements explicitly ask for an icon-only button. Do NOT define the child component inline."),
		variant: r([
			"default",
			"primary",
			"borderless"
		]).default("default").describe("A hint for the button style. If omitted, a default button style is used. 'primary' indicates this is the main call-to-action button. 'borderless' means the button has no visual border or background, making its child content appear like a clickable link.").optional(),
		action: te,
		checks: p.shape.checks
	}).strict()
}, fr = {
	name: "TextField",
	schema: b({
		...Y,
		label: v.describe("The text label for the input field."),
		value: v.describe("The value of the text field.").optional(),
		variant: r([
			"longText",
			"number",
			"shortText",
			"obscured"
		]).default("shortText").describe("The type of input field to display.").optional(),
		validationRegexp: n().describe("A regular expression used for client-side validation of the input.").optional(),
		checks: p.shape.checks
	}).strict()
}, pr = {
	name: "CheckBox",
	schema: b({
		...Y,
		label: v.describe("The text to display next to the checkbox."),
		value: ne.describe("The current state of the checkbox (true for checked, false for unchecked)."),
		checks: p.shape.checks
	}).strict()
}, mr = {
	name: "ChoicePicker",
	schema: b({
		...Y,
		label: v.describe("The label for the group of options.").optional(),
		variant: r(["multipleSelection", "mutuallyExclusive"]).default("mutuallyExclusive").describe("A hint for how the choice picker should be displayed and behave.").optional(),
		options: re(b({
			label: v.describe("The text to display for this option."),
			value: n().describe("The stable value associated with this option.")
		}).strict()).describe("The list of available options to choose from."),
		value: m.describe("The list of currently selected values. This should be bound to a string array in the data model."),
		displayStyle: r(["checkbox", "chips"]).default("checkbox").describe("The display style of the component.").optional(),
		filterable: s().default(!1).describe("If true, displays a search input to filter the options.").optional(),
		checks: p.shape.checks
	}).strict().describe("A component that allows selecting one or more options from a list.")
}, hr = {
	name: "Slider",
	schema: b({
		...Y,
		label: v.describe("The label for the slider.").optional(),
		min: e().default(0).describe("The minimum value of the slider.").optional(),
		max: e().describe("The maximum value of the slider."),
		value: c.describe("The current value of the slider."),
		checks: p.shape.checks
	}).strict()
}, gr = {
	name: "DateTimeInput",
	schema: b({
		...Y,
		value: v.describe("The selected date and/or time value in ISO 8601 format. If not yet set, initialize with an empty string."),
		enableDate: s().default(!1).describe("If true, allows the user to select a date.").optional(),
		enableTime: s().default(!1).describe("If true, allows the user to select a time.").optional(),
		min: t([
			v,
			n().date(),
			n().time(),
			n().datetime()
		]).describe("The minimum allowed date/time in ISO 8601 format.").optional(),
		max: t([
			v,
			n().date(),
			n().time(),
			n().datetime()
		]).describe("The maximum allowed date/time in ISO 8601 format.").optional(),
		label: v.describe("The text label for the input field.").optional(),
		checks: p.shape.checks
	}).strict()
}, _r = "\n  :where(:root) {\n    color-scheme: light dark;\n  }\n\n  :where(.a2ui-dark) {\n    color-scheme: dark;\n  }\n\n  :where(.a2ui-light) {\n    color-scheme: light;\n  }\n\n  :where(:root), :where(.a2ui-dark), :where(.a2ui-light) {\n    --a2ui-color-background: light-dark(#eee, #111);\n    --a2ui-color-on-background: light-dark(#333, #eee);\n\n    --a2ui-color-surface: light-dark(\n      color-mix(in oklab, var(--a2ui-color-background) 85%, white),\n      color-mix(in oklab, var(--a2ui-color-background) 95%, white)\n    );\n    --a2ui-color-on-surface: light-dark(#333, #eee);\n\n    --a2ui-color-primary: #17e;\n    --a2ui-color-primary-light: color-mix(in oklab, var(--a2ui-color-primary) 85%, white);\n    --a2ui-color-primary-dark: color-mix(in oklab, var(--a2ui-color-primary) 85%, black);\n    --a2ui-color-primary-hover: light-dark(var(--a2ui-color-primary-dark), var(--a2ui-color-primary-light));\n    --a2ui-color-on-primary: #fff;\n\n    --a2ui-color-secondary: light-dark(#ddd, #333);\n    --a2ui-color-secondary-light: color-mix(in oklab, var(--a2ui-color-secondary) 85%, white);\n    --a2ui-color-secondary-dark: color-mix(in oklab, var(--a2ui-color-secondary) 95%, black);\n    --a2ui-color-secondary-hover: light-dark(var(--a2ui-color-secondary-dark), var(--a2ui-color-secondary-light));\n    --a2ui-color-on-secondary: light-dark(#333, #eee);\n\n    --a2ui-border-radius: 0.25rem;\n    --a2ui-color-border: light-dark(#ccc, #444);\n    --a2ui-border-width: 1px;\n    --a2ui-border: 1px solid var(--a2ui-color-border, #ccc);\n\n    --a2ui-font-family-title: inherit;\n    --a2ui-font-family-monospace: monospace;\n    --a2ui-color-input: light-dark(#fff, #2a2a2a);\n    --a2ui-color-on-input: light-dark(#333, #eee);\n\n    --a2ui-grid-base: 0.5rem;\n    --a2ui-spacing-xs: calc(var(--a2ui-spacing-s) / 2);\n    --a2ui-spacing-s: calc(var(--a2ui-spacing-m) / 2);\n    --a2ui-spacing-m: var(--a2ui-grid-base);\n    --a2ui-spacing-l: calc(var(--a2ui-spacing-m) * 2);\n    --a2ui-spacing-xl: calc(var(--a2ui-spacing-l) * 2);\n\n    --a2ui-font-size: 1rem;\n    --a2ui-font-scale: 1.2;\n    --a2ui-font-size-xs: calc(var(--a2ui-font-size-s) / var(--a2ui-font-scale));\n    --a2ui-font-size-s: calc(var(--a2ui-font-size-m) / var(--a2ui-font-scale));\n    --a2ui-font-size-m: var(--a2ui-font-size);\n    --a2ui-font-size-l: calc(var(--a2ui-font-size-m) * var(--a2ui-font-scale));\n    --a2ui-font-size-xl: calc(var(--a2ui-font-size-l) * var(--a2ui-font-scale));\n    --a2ui-font-size-2xl: calc(var(--a2ui-font-size-xl) * var(--a2ui-font-scale));\n\n    --a2ui-line-height-headings: 1.2;\n    --a2ui-line-height-body: 1.5;\n  }\n", vr;
function yr() {
	return vr || (vr = new CSSStyleSheet(), vr.replaceSync(_r)), vr;
}
function br() {
	if (typeof document > "u") return;
	let e = yr();
	document.adoptedStyleSheets.includes(e) || (document.adoptedStyleSheets = [...document.adoptedStyleSheets, e]);
}
//#endregion
//#region ../../node_modules/.pnpm/@a2ui+lit@0.9.3_signal-polyfill@0.2.2/node_modules/@a2ui/lit/src/v0_9/catalogs/basic/basic-catalog-a2ui-lit-element.js
var X = class extends vt {
	connectedCallback() {
		super.connectedCallback(), br();
	}
	updated(e) {
		super.updated(e);
		let t = this.controller?.props;
		t && t.weight !== void 0 ? this.style.flex = String(t.weight) : this.style.removeProperty("flex");
	}
}, xr = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, Z = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), Sr = class {
	constructor(e) {}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AT(e, t, n) {
		this._$Ct = e, this._$AM = t, this._$Ci = n;
	}
	_$AS(e, t) {
		return this.update(e, t);
	}
	update(e, t) {
		return this.render(...t);
	}
}, Cr = class extends Sr {
	constructor(e) {
		if (super(e), this.it = N, e.type !== xr.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
	}
	render(e) {
		if (e === N || e == null) return this._t = void 0, this.it = e;
		if (e === M) return e;
		if (typeof e != "string") throw Error(this.constructor.directiveName + "() called with a non-string value");
		if (e === this.it) return this._t;
		this.it = e;
		let t = [e];
		return t.raw = t, this._t = {
			_$litType$: this.constructor.resultType,
			strings: t,
			values: []
		};
	}
};
Cr.directiveName = "unsafeHTML", Cr.resultType = 1;
var wr = Z(Cr), { I: Tr } = Ze, Er = (e) => e === null || typeof e != "object" && typeof e != "function", Dr = (e) => e.strings === void 0, Q = (e, t) => {
	let n = e._$AN;
	if (n === void 0) return !1;
	for (let e of n) e._$AO?.(t, !1), Q(e, t);
	return !0;
}, Or = (e) => {
	let t, n;
	do {
		if ((t = e._$AM) === void 0) break;
		n = t._$AN, n.delete(e), e = t;
	} while (n?.size === 0);
}, kr = (e) => {
	for (let t; t = e._$AM; e = t) {
		let n = t._$AN;
		if (n === void 0) t._$AN = n = /* @__PURE__ */ new Set();
		else if (n.has(e)) break;
		n.add(e), Mr(t);
	}
};
function Ar(e) {
	this._$AN === void 0 ? this._$AM = e : (Or(this), this._$AM = e, kr(this));
}
function jr(e, t = !1, n = 0) {
	let r = this._$AH, i = this._$AN;
	if (i !== void 0 && i.size !== 0) if (t) if (Array.isArray(r)) for (let e = n; e < r.length; e++) Q(r[e], !1), Or(r[e]);
	else r != null && (Q(r, !1), Or(r));
	else Q(this, e);
}
var Mr = (e) => {
	e.type == xr.CHILD && (e._$AP ??= jr, e._$AQ ??= Ar);
}, Nr = class extends Sr {
	constructor() {
		super(...arguments), this._$AN = void 0;
	}
	_$AT(e, t, n) {
		super._$AT(e, t, n), kr(this), this.isConnected = e._$AU;
	}
	_$AO(e, t = !0) {
		e !== this.isConnected && (this.isConnected = e, e ? this.reconnected?.() : this.disconnected?.()), t && (Q(this, e), Or(this));
	}
	setValue(e) {
		if (Dr(this._$Ct)) this._$Ct._$AI(e, this);
		else {
			let t = [...this._$Ct._$AH];
			t[this._$Ci] = e, this._$Ct._$AI(t, this, 0);
		}
	}
	disconnected() {}
	reconnected() {}
}, Pr = class {
	constructor(e) {
		this.G = e;
	}
	disconnect() {
		this.G = void 0;
	}
	reconnect(e) {
		this.G = e;
	}
	deref() {
		return this.G;
	}
}, Fr = class {
	constructor() {
		this.Y = void 0, this.Z = void 0;
	}
	get() {
		return this.Y;
	}
	pause() {
		this.Y ??= new Promise((e) => this.Z = e);
	}
	resume() {
		this.Z?.(), this.Y = this.Z = void 0;
	}
}, Ir = (e) => !Er(e) && typeof e.then == "function", Lr = 1073741823, Rr = Z(class extends Nr {
	constructor() {
		super(...arguments), this._$Cwt = Lr, this._$Cbt = [], this._$CK = new Pr(this), this._$CX = new Fr();
	}
	render(...e) {
		return e.find((e) => !Ir(e)) ?? M;
	}
	update(e, t) {
		let n = this._$Cbt, r = n.length;
		this._$Cbt = t;
		let i = this._$CK, a = this._$CX;
		this.isConnected || this.disconnected();
		for (let e = 0; e < t.length && !(e > this._$Cwt); e++) {
			let o = t[e];
			if (!Ir(o)) return this._$Cwt = e, o;
			e < r && o === n[e] || (this._$Cwt = Lr, r = 0, Promise.resolve(o).then(async (e) => {
				for (; a.get();) await a.get();
				let t = i.deref();
				if (t !== void 0) {
					let n = t._$Cbt.indexOf(o);
					n > -1 && n < t._$Cwt && (t._$Cwt = n, t.setValue(e));
				}
			}));
		}
		return M;
	}
	disconnected() {
		this._$CK.disconnect(), this._$CX.pause();
	}
	reconnected() {
		this._$CK.reconnect(this), this._$CX.resume();
	}
}), zr = Z(class e extends Sr {
	constructor() {
		super(...arguments), this.lastValue = null, this.lastTagClassMap = null;
	}
	update(e, [t, n, r]) {
		let i = JSON.stringify(r?.tagClassMap);
		return this.lastValue === t && i === this.lastTagClassMap ? M : (this.lastValue = t, this.lastTagClassMap = i, this.render(t, n, r));
	}
	static {
		this.defaultMarkdownWarningLogged = !1;
	}
	render(t, n, r) {
		return n ? Rr(n(t, r).then((e) => wr(e)), j`<span class="no-markdown-renderer">${t}</span>`) : (e.defaultMarkdownWarningLogged ||= (console.warn("[MarkdownDirective]", "can't render markdown because no markdown renderer is configured.\n", "Use `@a2ui/markdown-it`, or your own markdown renderer."), !0), j`<span class="no-markdown-renderer">${t}</span>`);
	}
}), Br = function(e, t, n, r, i, a) {
	function o(e) {
		if (e !== void 0 && typeof e != "function") throw TypeError("Function expected");
		return e;
	}
	for (var s = r.kind, c = s === "getter" ? "get" : s === "setter" ? "set" : "value", l = !t && e ? r.static ? e : e.prototype : null, u = t || (l ? Object.getOwnPropertyDescriptor(l, r.name) : {}), d, f = !1, p = n.length - 1; p >= 0; p--) {
		var m = {};
		for (var h in r) m[h] = h === "access" ? {} : r[h];
		for (var h in r.access) m.access[h] = r.access[h];
		m.addInitializer = function(e) {
			if (f) throw TypeError("Cannot add initializers after decoration has completed");
			a.push(o(e || null));
		};
		var g = (0, n[p])(s === "accessor" ? {
			get: u.get,
			set: u.set
		} : u[c], m);
		if (s === "accessor") {
			if (g === void 0) continue;
			if (typeof g != "object" || !g) throw TypeError("Object expected");
			(d = o(g.get)) && (u.get = d), (d = o(g.set)) && (u.set = d), (d = o(g.init)) && i.unshift(d);
		} else (d = o(g)) && (s === "field" ? i.unshift(d) : u[c] = d);
	}
	l && Object.defineProperty(l, r.name, u), f = !0;
}, Vr = function(e, t, n) {
	for (var r = arguments.length > 2, i = 0; i < t.length; i++) n = r ? t[i].call(e, n) : t[i].call(e);
	return r ? n : void 0;
};
(() => {
	let e = [R("a2ui-basic-text")], t, n = [], r, i = X, a, o = [], s = [];
	var c = class extends i {
		static {
			r = this;
		}
		static {
			let l = typeof Symbol == "function" && Symbol.metadata ? Object.create(i[Symbol.metadata] ?? null) : void 0;
			a = [St({
				context: Ct.markdown,
				subscribe: !0
			})], Br(this, null, a, {
				kind: "accessor",
				name: "markdownRenderer",
				static: !1,
				private: !1,
				access: {
					has: (e) => "markdownRenderer" in e,
					get: (e) => e.markdownRenderer,
					set: (e, t) => {
						e.markdownRenderer = t;
					}
				},
				metadata: l
			}, o, s), Br(null, t = { value: r }, e, {
				kind: "class",
				name: r.name,
				metadata: l
			}, null, n), c = r = t.value, l && Object.defineProperty(r, Symbol.metadata, {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: l
			});
		}
		static {
			this.styles = C`
    :host {
      display: inline-block;
      color: var(--_a2ui-text-color, var(--a2ui-text-color-text, var(--a2ui-color-on-background)));
    }
    p, h1, h2, h3, h4, h5, h6, ol, ul, li, blockquote, pre {
      margin: var(--_a2ui-text-margin, 0);
    }
    h1, h2, h3, h4, h5 {
      font-family: var(--a2ui-font-family-title, inherit);
      line-height: var(--a2ui-line-height-headings, 1.2);
    }
    h1 { font-size: var(--a2ui-font-size-2xl); }
    h2 { font-size: var(--a2ui-font-size-xl); }
    h3 { font-size: var(--a2ui-font-size-l); }
    p, h4 { font-size: var(--a2ui-font-size-m); }
    h5 { font-size: var(--a2ui-font-size-s); }
    p, ol, ul, li, blockquote, .a2ui-caption {
      line-height: var(--a2ui-line-height-body, 1.5);
    }
    .a2ui-caption, .a2ui-caption > *, .a2ui-caption ::slotted(*) {
      font-size: var(--a2ui-font-size-xs);
      color: var(--a2ui-text-caption-color, light-dark(#666, #aaa));
    }
    a {
      color: var(--a2ui-text-a-color, inherit);
      font-weight: var(--a2ui-text-a-font-weight, inherit);
    }
  `;
		}
		#e = Vr(this, o, void 0);
		get markdownRenderer() {
			return this.#e;
		}
		set markdownRenderer(e) {
			this.#e = e;
		}
		createController() {
			return new S(this, Qn);
		}
		render() {
			let e = this.controller.props;
			if (!e) return N;
			let t = typeof e.text == "string" ? e.text : String(e.text ?? "");
			switch (e.variant) {
				case "h1":
					t = `# ${t}`;
					break;
				case "h2":
					t = `## ${t}`;
					break;
				case "h3":
					t = `### ${t}`;
					break;
				case "h4":
					t = `#### ${t}`;
					break;
				case "h5":
					t = `##### ${t}`;
					break;
				default: break;
			}
			let n = zr(t, this.markdownRenderer);
			return e.variant === "caption" ? j`<span class="a2ui-caption">${n}</span>` : j`${n}`;
		}
		constructor() {
			super(...arguments), Vr(this, s);
		}
		static {
			Vr(r, n);
		}
	};
	return r;
})();
var Hr = {
	...Qn,
	tagName: "a2ui-basic-text"
}, $ = Z(class extends Sr {
	constructor(e) {
		if (super(e), e.type !== xr.ATTRIBUTE || e.name !== "class" || e.strings?.length > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
	}
	render(e) {
		return " " + Object.keys(e).filter((t) => e[t]).join(" ") + " ";
	}
	update(e, [t]) {
		if (this.st === void 0) {
			this.st = /* @__PURE__ */ new Set(), e.strings !== void 0 && (this.nt = new Set(e.strings.join(" ").split(/\s/).filter((e) => e !== "")));
			for (let e in t) t[e] && !this.nt?.has(e) && this.st.add(e);
			return this.render(t);
		}
		let n = e.element.classList;
		for (let e of this.st) e in t || (n.remove(e), this.st.delete(e));
		for (let e in t) {
			let r = !!t[e];
			r === this.st.has(e) || this.nt?.has(e) || (r ? (n.add(e), this.st.add(e)) : (n.remove(e), this.st.delete(e)));
		}
		return M;
	}
}), Ur = function(e, t, n, r, i, a) {
	function o(e) {
		if (e !== void 0 && typeof e != "function") throw TypeError("Function expected");
		return e;
	}
	for (var s = r.kind, c = s === "getter" ? "get" : s === "setter" ? "set" : "value", l = !t && e ? r.static ? e : e.prototype : null, u = t || (l ? Object.getOwnPropertyDescriptor(l, r.name) : {}), d, f = !1, p = n.length - 1; p >= 0; p--) {
		var m = {};
		for (var h in r) m[h] = h === "access" ? {} : r[h];
		for (var h in r.access) m.access[h] = r.access[h];
		m.addInitializer = function(e) {
			if (f) throw TypeError("Cannot add initializers after decoration has completed");
			a.push(o(e || null));
		};
		var g = (0, n[p])(s === "accessor" ? {
			get: u.get,
			set: u.set
		} : u[c], m);
		if (s === "accessor") {
			if (g === void 0) continue;
			if (typeof g != "object" || !g) throw TypeError("Object expected");
			(d = o(g.get)) && (u.get = d), (d = o(g.set)) && (u.set = d), (d = o(g.init)) && i.unshift(d);
		} else (d = o(g)) && (s === "field" ? i.unshift(d) : u[c] = d);
	}
	l && Object.defineProperty(l, r.name, u), f = !0;
}, Wr = function(e, t, n) {
	for (var r = arguments.length > 2, i = 0; i < t.length; i++) n = r ? t[i].call(e, n) : t[i].call(e);
	return r ? n : void 0;
};
(() => {
	let e = [R("a2ui-basic-button")], t, n = [], r, i = X;
	var a = class extends i {
		static {
			r = this;
		}
		static {
			let o = typeof Symbol == "function" && Symbol.metadata ? Object.create(i[Symbol.metadata] ?? null) : void 0;
			Ur(null, t = { value: r }, e, {
				kind: "class",
				name: r.name,
				metadata: o
			}, null, n), a = r = t.value, o && Object.defineProperty(r, Symbol.metadata, {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: o
			});
		}
		static {
			this.styles = C`
    :host {
      display: inline-block;
      margin: var(--a2ui-button-margin, var(--a2ui-spacing-m));
    }
    :where(:host) {
      --_color-primary: var(--a2ui-color-primary, #17e);
      --_button-border-radius: var(
        --a2ui-button-border-radius,
        var(--a2ui-spacing-s, 0.25rem)
      );
      --_button-padding: var(
        --a2ui-button-padding,
        var(--a2ui-spacing-m, 0.5rem) var(--a2ui-spacing-l, 1rem)
      );
      --_button-border: var(
        --a2ui-button-border,
        var(--a2ui-border-width, 1px) solid var(--a2ui-color-border, #ccc)
      );
    }
    .a2ui-button {
      --_a2ui-text-margin: 0;
      --_a2ui-text-color: var(--a2ui-color-on-secondary, #333);
      padding: var(--_button-padding);
      background: var(--a2ui-button-background, var(--a2ui-color-surface, #fff));
      box-shadow: var(--a2ui-button-box-shadow, none);
      font-weight: var(--a2ui-button-font-weight, normal);
      color: var(--_a2ui-text-color);
      border: var(--_button-border);
      border-radius: var(--_button-border-radius);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .a2ui-button.a2ui-button-primary {
      --_a2ui-text-color: var(--a2ui-color-on-primary, #fff);
      background-color: var(--_color-primary);
      color: var(--_a2ui-text-color);
    }
    .a2ui-button:hover {
      background-color: var(--a2ui-color-secondary-hover, #ddd);
    }
    .a2ui-button.a2ui-button-primary:hover {
      background-color: var(--a2ui-color-primary-hover, #fbd);
    }
    .a2ui-button.a2ui-button-borderless {
      background: none;
      padding: 0;
      color: var(--_color-primary);
    }
  `;
		}
		createController() {
			return new S(this, dr);
		}
		render() {
			let e = this.controller.props;
			if (!e) return N;
			let t = e.isValid === !1;
			return j`
      <button
        class=${$({
				"a2ui-button": !0,
				["a2ui-button-" + (e.variant || "default")]: !0
			})}
        @click=${() => !t && e.action && e.action()}
        ?disabled=${t}
      >
        ${e.child ? j`${this.renderNode(e.child)}` : N}
      </button>
    `;
		}
		static {
			Wr(r, n);
		}
	};
	return r;
})();
var Gr = {
	...dr,
	tagName: "a2ui-basic-button"
}, Kr = function(e, t, n, r, i, a) {
	function o(e) {
		if (e !== void 0 && typeof e != "function") throw TypeError("Function expected");
		return e;
	}
	for (var s = r.kind, c = s === "getter" ? "get" : s === "setter" ? "set" : "value", l = !t && e ? r.static ? e : e.prototype : null, u = t || (l ? Object.getOwnPropertyDescriptor(l, r.name) : {}), d, f = !1, p = n.length - 1; p >= 0; p--) {
		var m = {};
		for (var h in r) m[h] = h === "access" ? {} : r[h];
		for (var h in r.access) m.access[h] = r.access[h];
		m.addInitializer = function(e) {
			if (f) throw TypeError("Cannot add initializers after decoration has completed");
			a.push(o(e || null));
		};
		var g = (0, n[p])(s === "accessor" ? {
			get: u.get,
			set: u.set
		} : u[c], m);
		if (s === "accessor") {
			if (g === void 0) continue;
			if (typeof g != "object" || !g) throw TypeError("Object expected");
			(d = o(g.get)) && (u.get = d), (d = o(g.set)) && (u.set = d), (d = o(g.init)) && i.unshift(d);
		} else (d = o(g)) && (s === "field" ? i.unshift(d) : u[c] = d);
	}
	l && Object.defineProperty(l, r.name, u), f = !0;
}, qr = function(e, t, n) {
	for (var r = arguments.length > 2, i = 0; i < t.length; i++) n = r ? t[i].call(e, n) : t[i].call(e);
	return r ? n : void 0;
};
(() => {
	let e = [R("a2ui-basic-textfield")], t, n = [], r, i = X;
	var a = class extends i {
		static {
			r = this;
		}
		static {
			let o = typeof Symbol == "function" && Symbol.metadata ? Object.create(i[Symbol.metadata] ?? null) : void 0;
			Kr(null, t = { value: r }, e, {
				kind: "class",
				name: r.name,
				metadata: o
			}, null, n), a = r = t.value, o && Object.defineProperty(r, Symbol.metadata, {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: o
			});
		}
		static {
			this.styles = C`
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--a2ui-spacing-xs, 0.25rem);
    }
    .a2ui-textfield {
      background-color: var(--a2ui-color-input, #fff);
      color: var(--a2ui-color-on-input, #333);
      border: var(--a2ui-textfield-border, var(--a2ui-border));
      border-radius: var(--a2ui-textfield-border-radius, var(--a2ui-spacing-m));
      padding: var(--a2ui-textfield-padding, var(--a2ui-spacing-m));
      font-family: inherit;
    }
    .a2ui-textfield:focus {
      outline: none;
      border-color: var(--a2ui-textfield-color-border-focus, var(--a2ui-color-primary, #17e));
    }
    .a2ui-textfield.invalid {
      border-color: var(--a2ui-textfield-color-error, red);
    }
    label {
      font-size: var(--a2ui-textfield-label-font-size, var(--a2ui-label-font-size, var(--a2ui-font-size-s)));
      font-weight: var(--a2ui-textfield-label-font-weight, var(--a2ui-label-font-weight, bold));
    }
    .error {
      color: var(--a2ui-textfield-color-error, red);
      font-size: var(--a2ui-font-size-xs, 0.75rem);
    }
  `;
		}
		createController() {
			return new S(this, fr);
		}
		render() {
			let e = this.controller.props;
			if (!e) return N;
			let t = e.isValid === !1, n = (t) => e.setValue?.(t.target.value), r = "text";
			e.variant === "number" && (r = "number"), e.variant === "obscured" && (r = "password");
			let i = {
				"a2ui-textfield": !0,
				invalid: t
			};
			return j`
      ${e.label ? j`<label>${e.label}</label>` : N}
        ${e.variant === "longText" ? j`<textarea
              class=${$(i)}
              .value=${e.value || ""}
              @input=${n}
            ></textarea>` : j`<input
              type=${r}
              class=${$(i)}
              .value=${e.value || ""}
              @input=${n}
            />`}
        ${t && e.validationErrors?.length ? j`<div class="error">${e.validationErrors[0]}</div>` : N}
    `;
		}
		static {
			qr(r, n);
		}
	};
	return r;
})();
var Jr = {
	...fr,
	tagName: "a2ui-basic-textfield"
};
//#endregion
//#region ../../node_modules/.pnpm/lit-html@3.3.3/node_modules/lit-html/directives/map.js
function* Yr(e, t) {
	if (e !== void 0) {
		let n = 0;
		for (let r of e) yield t(r, n++);
	}
}
//#endregion
//#region ../../node_modules/.pnpm/@a2ui+lit@0.9.3_signal-polyfill@0.2.2/node_modules/@a2ui/lit/src/v0_9/catalogs/basic/components/Row.js
var Xr = function(e, t, n, r, i, a) {
	function o(e) {
		if (e !== void 0 && typeof e != "function") throw TypeError("Function expected");
		return e;
	}
	for (var s = r.kind, c = s === "getter" ? "get" : s === "setter" ? "set" : "value", l = !t && e ? r.static ? e : e.prototype : null, u = t || (l ? Object.getOwnPropertyDescriptor(l, r.name) : {}), d, f = !1, p = n.length - 1; p >= 0; p--) {
		var m = {};
		for (var h in r) m[h] = h === "access" ? {} : r[h];
		for (var h in r.access) m.access[h] = r.access[h];
		m.addInitializer = function(e) {
			if (f) throw TypeError("Cannot add initializers after decoration has completed");
			a.push(o(e || null));
		};
		var g = (0, n[p])(s === "accessor" ? {
			get: u.get,
			set: u.set
		} : u[c], m);
		if (s === "accessor") {
			if (g === void 0) continue;
			if (typeof g != "object" || !g) throw TypeError("Object expected");
			(d = o(g.get)) && (u.get = d), (d = o(g.set)) && (u.set = d), (d = o(g.init)) && i.unshift(d);
		} else (d = o(g)) && (s === "field" ? i.unshift(d) : u[c] = d);
	}
	l && Object.defineProperty(l, r.name, u), f = !0;
}, Zr = function(e, t, n) {
	for (var r = arguments.length > 2, i = 0; i < t.length; i++) n = r ? t[i].call(e, n) : t[i].call(e);
	return r ? n : void 0;
}, Qr = {
	start: "flex-start",
	center: "center",
	end: "flex-end",
	spaceBetween: "space-between",
	spaceAround: "space-around",
	spaceEvenly: "space-evenly",
	stretch: "stretch"
}, $r = {
	start: "flex-start",
	center: "center",
	end: "flex-end",
	stretch: "stretch"
};
(() => {
	let e = [R("a2ui-basic-row")], t, n = [], r, i = X;
	var a = class extends i {
		static {
			r = this;
		}
		static {
			let o = typeof Symbol == "function" && Symbol.metadata ? Object.create(i[Symbol.metadata] ?? null) : void 0;
			Xr(null, t = { value: r }, e, {
				kind: "class",
				name: r.name,
				metadata: o
			}, null, n), a = r = t.value, o && Object.defineProperty(r, Symbol.metadata, {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: o
			});
		}
		static {
			this.styles = C`
    :host {
      display: flex;
      flex-direction: row;
      gap: var(--a2ui-row-gap, var(--a2ui-spacing-m));
    }
  `;
		}
		createController() {
			return new S(this, ir);
		}
		updated(e) {
			super.updated(e);
			let t = this.controller.props;
			t && (this.style.justifyContent = Qr[t.justify ?? ""] ?? "flex-start", this.style.alignItems = $r[t.align ?? ""] ?? "stretch");
		}
		render() {
			let e = this.controller.props;
			return e ? j`
      ${Yr(Array.isArray(e.children) ? e.children : [], (e) => j`${this.renderNode(e)}`)}
    ` : N;
		}
		static {
			Zr(r, n);
		}
	};
	return r;
})();
var ei = {
	...ir,
	tagName: "a2ui-basic-row"
}, ti = function(e, t, n, r, i, a) {
	function o(e) {
		if (e !== void 0 && typeof e != "function") throw TypeError("Function expected");
		return e;
	}
	for (var s = r.kind, c = s === "getter" ? "get" : s === "setter" ? "set" : "value", l = !t && e ? r.static ? e : e.prototype : null, u = t || (l ? Object.getOwnPropertyDescriptor(l, r.name) : {}), d, f = !1, p = n.length - 1; p >= 0; p--) {
		var m = {};
		for (var h in r) m[h] = h === "access" ? {} : r[h];
		for (var h in r.access) m.access[h] = r.access[h];
		m.addInitializer = function(e) {
			if (f) throw TypeError("Cannot add initializers after decoration has completed");
			a.push(o(e || null));
		};
		var g = (0, n[p])(s === "accessor" ? {
			get: u.get,
			set: u.set
		} : u[c], m);
		if (s === "accessor") {
			if (g === void 0) continue;
			if (typeof g != "object" || !g) throw TypeError("Object expected");
			(d = o(g.get)) && (u.get = d), (d = o(g.set)) && (u.set = d), (d = o(g.init)) && i.unshift(d);
		} else (d = o(g)) && (s === "field" ? i.unshift(d) : u[c] = d);
	}
	l && Object.defineProperty(l, r.name, u), f = !0;
}, ni = function(e, t, n) {
	for (var r = arguments.length > 2, i = 0; i < t.length; i++) n = r ? t[i].call(e, n) : t[i].call(e);
	return r ? n : void 0;
}, ri = {
	start: "flex-start",
	center: "center",
	end: "flex-end",
	spaceBetween: "space-between",
	spaceAround: "space-around",
	spaceEvenly: "space-evenly",
	stretch: "stretch"
}, ii = {
	start: "flex-start",
	center: "center",
	end: "flex-end",
	stretch: "stretch"
};
(() => {
	let e = [R("a2ui-basic-column")], t, n = [], r, i = X;
	var a = class extends i {
		static {
			r = this;
		}
		static {
			let o = typeof Symbol == "function" && Symbol.metadata ? Object.create(i[Symbol.metadata] ?? null) : void 0;
			ti(null, t = { value: r }, e, {
				kind: "class",
				name: r.name,
				metadata: o
			}, null, n), a = r = t.value, o && Object.defineProperty(r, Symbol.metadata, {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: o
			});
		}
		static {
			this.styles = C`
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--a2ui-column-gap, var(--a2ui-spacing-m));
    }
  `;
		}
		createController() {
			return new S(this, ar);
		}
		updated(e) {
			super.updated(e);
			let t = this.controller.props;
			t && (this.style.justifyContent = ri[t.justify ?? ""] ?? "flex-start", this.style.alignItems = ii[t.align ?? ""] ?? "stretch");
		}
		render() {
			let e = this.controller.props;
			return e ? j`
      ${Yr(Array.isArray(e.children) ? e.children : [], (e) => j`${this.renderNode(e)}`)}
    ` : N;
		}
		static {
			ni(r, n);
		}
	};
	return r;
})();
var ai = {
	...ar,
	tagName: "a2ui-basic-column"
}, oi = function(e, t, n, r, i, a) {
	function o(e) {
		if (e !== void 0 && typeof e != "function") throw TypeError("Function expected");
		return e;
	}
	for (var s = r.kind, c = s === "getter" ? "get" : s === "setter" ? "set" : "value", l = !t && e ? r.static ? e : e.prototype : null, u = t || (l ? Object.getOwnPropertyDescriptor(l, r.name) : {}), d, f = !1, p = n.length - 1; p >= 0; p--) {
		var m = {};
		for (var h in r) m[h] = h === "access" ? {} : r[h];
		for (var h in r.access) m.access[h] = r.access[h];
		m.addInitializer = function(e) {
			if (f) throw TypeError("Cannot add initializers after decoration has completed");
			a.push(o(e || null));
		};
		var g = (0, n[p])(s === "accessor" ? {
			get: u.get,
			set: u.set
		} : u[c], m);
		if (s === "accessor") {
			if (g === void 0) continue;
			if (typeof g != "object" || !g) throw TypeError("Object expected");
			(d = o(g.get)) && (u.get = d), (d = o(g.set)) && (u.set = d), (d = o(g.init)) && i.unshift(d);
		} else (d = o(g)) && (s === "field" ? i.unshift(d) : u[c] = d);
	}
	l && Object.defineProperty(l, r.name, u), f = !0;
}, si = function(e, t, n) {
	for (var r = arguments.length > 2, i = 0; i < t.length; i++) n = r ? t[i].call(e, n) : t[i].call(e);
	return r ? n : void 0;
};
(() => {
	let e = [R("a2ui-list")], t, n = [], r, i = X;
	var a = class extends i {
		static {
			r = this;
		}
		static {
			let o = typeof Symbol == "function" && Symbol.metadata ? Object.create(i[Symbol.metadata] ?? null) : void 0;
			oi(null, t = { value: r }, e, {
				kind: "class",
				name: r.name,
				metadata: o
			}, null, n), a = r = t.value, o && Object.defineProperty(r, Symbol.metadata, {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: o
			});
		}
		static {
			this.styles = C`
    :host {
      display: flex;
      overflow: auto;
      gap: var(--a2ui-list-gap, var(--a2ui-spacing-m, 0.5rem));
      padding: var(--a2ui-list-padding, 0);
    }
  `;
		}
		createController() {
			return new S(this, or);
		}
		updated(e) {
			super.updated(e);
			let t = this.controller.props;
			t && (this.style.flexDirection = t.direction === "horizontal" ? "row" : "column");
		}
		render() {
			let e = this.controller.props;
			return e ? j`${Yr(Array.isArray(e.children) ? e.children : [], (e) => j`${this.renderNode(e)}`)}` : N;
		}
		static {
			si(r, n);
		}
	};
	return r;
})();
var ci = {
	...or,
	tagName: "a2ui-list"
}, li = "important", ui = " !important", di = Z(class extends Sr {
	constructor(e) {
		if (super(e), e.type !== xr.ATTRIBUTE || e.name !== "style" || e.strings?.length > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
	}
	render(e) {
		return Object.keys(e).reduce((t, n) => {
			let r = e[n];
			return r == null ? t : t + `${n = n.includes("-") ? n : n.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${r};`;
		}, "");
	}
	update(e, [t]) {
		let { style: n } = e.element;
		if (this.ft === void 0) return this.ft = new Set(Object.keys(t)), this.render(t);
		for (let e of this.ft) t[e] ?? (this.ft.delete(e), e.includes("-") ? n.removeProperty(e) : n[e] = null);
		for (let e in t) {
			let r = t[e];
			if (r != null) {
				this.ft.add(e);
				let t = typeof r == "string" && r.endsWith(ui);
				e.includes("-") || t ? n.setProperty(e, t ? r.slice(0, -11) : r, t ? li : "") : n[e] = r;
			}
		}
		return M;
	}
}), fi = function(e, t, n, r, i, a) {
	function o(e) {
		if (e !== void 0 && typeof e != "function") throw TypeError("Function expected");
		return e;
	}
	for (var s = r.kind, c = s === "getter" ? "get" : s === "setter" ? "set" : "value", l = !t && e ? r.static ? e : e.prototype : null, u = t || (l ? Object.getOwnPropertyDescriptor(l, r.name) : {}), d, f = !1, p = n.length - 1; p >= 0; p--) {
		var m = {};
		for (var h in r) m[h] = h === "access" ? {} : r[h];
		for (var h in r.access) m.access[h] = r.access[h];
		m.addInitializer = function(e) {
			if (f) throw TypeError("Cannot add initializers after decoration has completed");
			a.push(o(e || null));
		};
		var g = (0, n[p])(s === "accessor" ? {
			get: u.get,
			set: u.set
		} : u[c], m);
		if (s === "accessor") {
			if (g === void 0) continue;
			if (typeof g != "object" || !g) throw TypeError("Object expected");
			(d = o(g.get)) && (u.get = d), (d = o(g.set)) && (u.set = d), (d = o(g.init)) && i.unshift(d);
		} else (d = o(g)) && (s === "field" ? i.unshift(d) : u[c] = d);
	}
	l && Object.defineProperty(l, r.name, u), f = !0;
}, pi = function(e, t, n) {
	for (var r = arguments.length > 2, i = 0; i < t.length; i++) n = r ? t[i].call(e, n) : t[i].call(e);
	return r ? n : void 0;
};
(() => {
	let e = [R("a2ui-image")], t, n = [], r, i = X;
	var a = class extends i {
		static {
			r = this;
		}
		static {
			let o = typeof Symbol == "function" && Symbol.metadata ? Object.create(i[Symbol.metadata] ?? null) : void 0;
			fi(null, t = { value: r }, e, {
				kind: "class",
				name: r.name,
				metadata: o
			}, null, n), a = r = t.value, o && Object.defineProperty(r, Symbol.metadata, {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: o
			});
		}
		static {
			this.styles = C`
    img {
      display: block;
      width: 100%;
      height: auto;
      border-radius: var(--a2ui-image-border-radius, 0);
    }
    :host(.icon),
    img.icon {
      width: var(--a2ui-image-icon-size, 24px);
      height: var(--a2ui-image-icon-size, 24px);
    }
    img.avatar {
      width: var(--a2ui-image-avatar-size, 40px);
      height: var(--a2ui-image-avatar-size, 40px);
      border-radius: 50%;
    }
    :host(.smallFeature),
    img.smallFeature {
      max-width: var(--a2ui-image-small-feature-size, 100px);
    }
    :host(.largeFeature),
    img.largeFeature {
      max-height: var(--a2ui-image-large-feature-size, 400px);
    }
    :host(.header),
    img.header {
      height: var(--a2ui-image-header-size, 200px);
      object-fit: cover;
    }
  `;
		}
		createController() {
			return new S(this, $n);
		}
		render() {
			let e = this.controller.props;
			if (!e) return N;
			let t = {
				"a2ui-image": !0,
				[e.variant || ""]: !!e.variant
			}, n = { objectFit: e.fit || "fill" };
			return j`<img
      src=${e.url}
      alt=${e.description || ""}
      class=${$(t)}
      style=${di(n)}
    />`;
		}
		static {
			pi(r, n);
		}
	};
	return r;
})();
var mi = {
	...$n,
	tagName: "a2ui-image"
}, hi = function(e, t, n, r, i, a) {
	function o(e) {
		if (e !== void 0 && typeof e != "function") throw TypeError("Function expected");
		return e;
	}
	for (var s = r.kind, c = s === "getter" ? "get" : s === "setter" ? "set" : "value", l = !t && e ? r.static ? e : e.prototype : null, u = t || (l ? Object.getOwnPropertyDescriptor(l, r.name) : {}), d, f = !1, p = n.length - 1; p >= 0; p--) {
		var m = {};
		for (var h in r) m[h] = h === "access" ? {} : r[h];
		for (var h in r.access) m.access[h] = r.access[h];
		m.addInitializer = function(e) {
			if (f) throw TypeError("Cannot add initializers after decoration has completed");
			a.push(o(e || null));
		};
		var g = (0, n[p])(s === "accessor" ? {
			get: u.get,
			set: u.set
		} : u[c], m);
		if (s === "accessor") {
			if (g === void 0) continue;
			if (typeof g != "object" || !g) throw TypeError("Object expected");
			(d = o(g.get)) && (u.get = d), (d = o(g.set)) && (u.set = d), (d = o(g.init)) && i.unshift(d);
		} else (d = o(g)) && (s === "field" ? i.unshift(d) : u[c] = d);
	}
	l && Object.defineProperty(l, r.name, u), f = !0;
}, gi = function(e, t, n) {
	for (var r = arguments.length > 2, i = 0; i < t.length; i++) n = r ? t[i].call(e, n) : t[i].call(e);
	return r ? n : void 0;
}, _i = {
	play: "play_arrow",
	rewind: "fast_rewind",
	favoriteOff: "favorite_border",
	starOff: "star_border"
};
function vi(e) {
	return _i[e] ? _i[e] : e.replace(/[A-Z]/g, (e) => "_" + e.toLowerCase());
}
(() => {
	let e = [R("a2ui-icon")], t, n = [], r, i = X;
	var a = class extends i {
		static {
			r = this;
		}
		static {
			let o = typeof Symbol == "function" && Symbol.metadata ? Object.create(i[Symbol.metadata] ?? null) : void 0;
			hi(null, t = { value: r }, e, {
				kind: "class",
				name: r.name,
				metadata: o
			}, null, n), a = r = t.value, o && Object.defineProperty(r, Symbol.metadata, {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: o
			});
		}
		static {
			this.styles = C`
    :where(:host) {
      --_icon-size: var(--a2ui-icon-size, var(--a2ui-font-size-xl, 24px));
    }
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .material-symbol {
      font-family: var(--a2ui-icon-font-family, "Material Symbols Outlined", sans-serif);
      font-size: var(--_icon-size);
      font-weight: normal;
      font-style: normal;
      line-height: 1;
      letter-spacing: normal;
      text-transform: none;
      color: var(--a2ui-icon-color, inherit);
      font-variation-settings: var(--a2ui-icon-font-variation-settings, "FILL" 1);
    }
  `;
		}
		createController() {
			return new S(this, tr);
		}
		render() {
			let e = this.controller.props;
			return e ? j`<span class="material-symbol">${typeof e.name == "string" ? vi(e.name) : e.name?.path}</span>` : N;
		}
		static {
			gi(r, n);
		}
	};
	return r;
})();
var yi = {
	...tr,
	tagName: "a2ui-icon"
}, bi = function(e, t, n, r, i, a) {
	function o(e) {
		if (e !== void 0 && typeof e != "function") throw TypeError("Function expected");
		return e;
	}
	for (var s = r.kind, c = s === "getter" ? "get" : s === "setter" ? "set" : "value", l = !t && e ? r.static ? e : e.prototype : null, u = t || (l ? Object.getOwnPropertyDescriptor(l, r.name) : {}), d, f = !1, p = n.length - 1; p >= 0; p--) {
		var m = {};
		for (var h in r) m[h] = h === "access" ? {} : r[h];
		for (var h in r.access) m.access[h] = r.access[h];
		m.addInitializer = function(e) {
			if (f) throw TypeError("Cannot add initializers after decoration has completed");
			a.push(o(e || null));
		};
		var g = (0, n[p])(s === "accessor" ? {
			get: u.get,
			set: u.set
		} : u[c], m);
		if (s === "accessor") {
			if (g === void 0) continue;
			if (typeof g != "object" || !g) throw TypeError("Object expected");
			(d = o(g.get)) && (u.get = d), (d = o(g.set)) && (u.set = d), (d = o(g.init)) && i.unshift(d);
		} else (d = o(g)) && (s === "field" ? i.unshift(d) : u[c] = d);
	}
	l && Object.defineProperty(l, r.name, u), f = !0;
}, xi = function(e, t, n) {
	for (var r = arguments.length > 2, i = 0; i < t.length; i++) n = r ? t[i].call(e, n) : t[i].call(e);
	return r ? n : void 0;
};
(() => {
	let e = [R("a2ui-video")], t, n = [], r, i = X;
	var a = class extends i {
		static {
			r = this;
		}
		static {
			let o = typeof Symbol == "function" && Symbol.metadata ? Object.create(i[Symbol.metadata] ?? null) : void 0;
			bi(null, t = { value: r }, e, {
				kind: "class",
				name: r.name,
				metadata: o
			}, null, n), a = r = t.value, o && Object.defineProperty(r, Symbol.metadata, {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: o
			});
		}
		static {
			this.styles = C`
    :host {
      display: block;
      width: 100%;
    }
    video {
      display: block;
      width: 100%;
      height: auto;
      border-radius: var(--a2ui-video-border-radius, 0);
    }
  `;
		}
		createController() {
			return new S(this, nr);
		}
		render() {
			let e = this.controller.props;
			return e ? j`<video src=${e.url} controls class="a2ui-video"></video>` : N;
		}
		static {
			xi(r, n);
		}
	};
	return r;
})();
var Si = {
	...nr,
	tagName: "a2ui-video"
}, Ci = function(e, t, n, r, i, a) {
	function o(e) {
		if (e !== void 0 && typeof e != "function") throw TypeError("Function expected");
		return e;
	}
	for (var s = r.kind, c = s === "getter" ? "get" : s === "setter" ? "set" : "value", l = !t && e ? r.static ? e : e.prototype : null, u = t || (l ? Object.getOwnPropertyDescriptor(l, r.name) : {}), d, f = !1, p = n.length - 1; p >= 0; p--) {
		var m = {};
		for (var h in r) m[h] = h === "access" ? {} : r[h];
		for (var h in r.access) m.access[h] = r.access[h];
		m.addInitializer = function(e) {
			if (f) throw TypeError("Cannot add initializers after decoration has completed");
			a.push(o(e || null));
		};
		var g = (0, n[p])(s === "accessor" ? {
			get: u.get,
			set: u.set
		} : u[c], m);
		if (s === "accessor") {
			if (g === void 0) continue;
			if (typeof g != "object" || !g) throw TypeError("Object expected");
			(d = o(g.get)) && (u.get = d), (d = o(g.set)) && (u.set = d), (d = o(g.init)) && i.unshift(d);
		} else (d = o(g)) && (s === "field" ? i.unshift(d) : u[c] = d);
	}
	l && Object.defineProperty(l, r.name, u), f = !0;
}, wi = function(e, t, n) {
	for (var r = arguments.length > 2, i = 0; i < t.length; i++) n = r ? t[i].call(e, n) : t[i].call(e);
	return r ? n : void 0;
};
(() => {
	let e = [R("a2ui-audioplayer")], t, n = [], r, i = X;
	var a = class extends i {
		static {
			r = this;
		}
		static {
			let o = typeof Symbol == "function" && Symbol.metadata ? Object.create(i[Symbol.metadata] ?? null) : void 0;
			Ci(null, t = { value: r }, e, {
				kind: "class",
				name: r.name,
				metadata: o
			}, null, n), a = r = t.value, o && Object.defineProperty(r, Symbol.metadata, {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: o
			});
		}
		static {
			this.styles = C`
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--a2ui-spacing-xs, 0.25rem);
      background: var(--a2ui-audioplayer-background, transparent);
      border-radius: var(--a2ui-audioplayer-border-radius, 0);
      padding: var(--a2ui-audioplayer-padding, 0);
    }
  `;
		}
		createController() {
			return new S(this, rr);
		}
		render() {
			let e = this.controller.props;
			return e ? j`
      ${e.description ? j`<p>${e.description}</p>` : N}
      <audio src=${e.url} controls></audio>
    ` : N;
		}
		static {
			wi(r, n);
		}
	};
	return r;
})();
var Ti = {
	...rr,
	tagName: "a2ui-audioplayer"
}, Ei = function(e, t, n, r, i, a) {
	function o(e) {
		if (e !== void 0 && typeof e != "function") throw TypeError("Function expected");
		return e;
	}
	for (var s = r.kind, c = s === "getter" ? "get" : s === "setter" ? "set" : "value", l = !t && e ? r.static ? e : e.prototype : null, u = t || (l ? Object.getOwnPropertyDescriptor(l, r.name) : {}), d, f = !1, p = n.length - 1; p >= 0; p--) {
		var m = {};
		for (var h in r) m[h] = h === "access" ? {} : r[h];
		for (var h in r.access) m.access[h] = r.access[h];
		m.addInitializer = function(e) {
			if (f) throw TypeError("Cannot add initializers after decoration has completed");
			a.push(o(e || null));
		};
		var g = (0, n[p])(s === "accessor" ? {
			get: u.get,
			set: u.set
		} : u[c], m);
		if (s === "accessor") {
			if (g === void 0) continue;
			if (typeof g != "object" || !g) throw TypeError("Object expected");
			(d = o(g.get)) && (u.get = d), (d = o(g.set)) && (u.set = d), (d = o(g.init)) && i.unshift(d);
		} else (d = o(g)) && (s === "field" ? i.unshift(d) : u[c] = d);
	}
	l && Object.defineProperty(l, r.name, u), f = !0;
}, Di = function(e, t, n) {
	for (var r = arguments.length > 2, i = 0; i < t.length; i++) n = r ? t[i].call(e, n) : t[i].call(e);
	return r ? n : void 0;
};
(() => {
	let e = [R("a2ui-card")], t, n = [], r, i = X;
	var a = class extends i {
		static {
			r = this;
		}
		static {
			let o = typeof Symbol == "function" && Symbol.metadata ? Object.create(i[Symbol.metadata] ?? null) : void 0;
			Ei(null, t = { value: r }, e, {
				kind: "class",
				name: r.name,
				metadata: o
			}, null, n), a = r = t.value, o && Object.defineProperty(r, Symbol.metadata, {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: o
			});
		}
		static {
			this.styles = C`
    :host {
      display: block;
      border: var(--a2ui-card-border, var(--a2ui-border-width, 1px) solid var(--a2ui-color-border, #ccc));
      border-radius: var(--a2ui-card-border-radius, var(--a2ui-border-radius, 8px));
      padding: var(--a2ui-card-padding, var(--a2ui-spacing-m, 16px));
      background: var(--a2ui-card-background, var(--a2ui-color-surface, #fff));
      color: var(--a2ui-color-on-surface, #333);
      box-shadow: var(--a2ui-card-box-shadow, 0 2px 4px rgba(0,0,0,0.1));
      margin: var(--a2ui-card-margin, var(--a2ui-spacing-m));
    }
  `;
		}
		createController() {
			return new S(this, sr);
		}
		render() {
			let e = this.controller.props;
			return e ? j`
      ${e.child ? j`${this.renderNode(e.child)}` : N}
    ` : N;
		}
		static {
			Di(r, n);
		}
	};
	return r;
})();
var Oi = {
	...sr,
	tagName: "a2ui-card"
}, ki = function(e, t, n, r, i, a) {
	function o(e) {
		if (e !== void 0 && typeof e != "function") throw TypeError("Function expected");
		return e;
	}
	for (var s = r.kind, c = s === "getter" ? "get" : s === "setter" ? "set" : "value", l = !t && e ? r.static ? e : e.prototype : null, u = t || (l ? Object.getOwnPropertyDescriptor(l, r.name) : {}), d, f = !1, p = n.length - 1; p >= 0; p--) {
		var m = {};
		for (var h in r) m[h] = h === "access" ? {} : r[h];
		for (var h in r.access) m.access[h] = r.access[h];
		m.addInitializer = function(e) {
			if (f) throw TypeError("Cannot add initializers after decoration has completed");
			a.push(o(e || null));
		};
		var g = (0, n[p])(s === "accessor" ? {
			get: u.get,
			set: u.set
		} : u[c], m);
		if (s === "accessor") {
			if (g === void 0) continue;
			if (typeof g != "object" || !g) throw TypeError("Object expected");
			(d = o(g.get)) && (u.get = d), (d = o(g.set)) && (u.set = d), (d = o(g.init)) && i.unshift(d);
		} else (d = o(g)) && (s === "field" ? i.unshift(d) : u[c] = d);
	}
	l && Object.defineProperty(l, r.name, u), f = !0;
}, Ai = function(e, t, n) {
	for (var r = arguments.length > 2, i = 0; i < t.length; i++) n = r ? t[i].call(e, n) : t[i].call(e);
	return r ? n : void 0;
};
(() => {
	let e = [R("a2ui-divider")], t, n = [], r, i = X;
	var a = class extends i {
		static {
			r = this;
		}
		static {
			let o = typeof Symbol == "function" && Symbol.metadata ? Object.create(i[Symbol.metadata] ?? null) : void 0;
			ki(null, t = { value: r }, e, {
				kind: "class",
				name: r.name,
				metadata: o
			}, null, n), a = r = t.value, o && Object.defineProperty(r, Symbol.metadata, {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: o
			});
		}
		static {
			this.styles = C`
    :host {
      display: block;
      align-self: stretch;
    }
    .a2ui-divider.horizontal {
      height: 0;
      overflow: hidden;
      font-size: 0.1px;
      line-height: 0;
      border: 0;
      border-top: var(
        --a2ui-divider-border,
        var(--a2ui-border-width, 1px) solid var(--a2ui-color-border, #ccc)
      );
      margin: var(--a2ui-divider-spacing, var(--a2ui-spacing-m, 0.5rem)) 0;
      width: 100%;
    }
    .a2ui-divider.vertical {
      width: var(--a2ui-border-width, 1px);
      background-color: var(--a2ui-color-border, #ccc);
      height: 100%;
      margin: 0 var(--a2ui-divider-spacing, var(--a2ui-spacing-m, 0.5rem));
    }
  `;
		}
		createController() {
			return new S(this, ur);
		}
		render() {
			let e = this.controller.props;
			if (!e) return N;
			let t = {
				"a2ui-divider": !0,
				vertical: e.axis === "vertical",
				horizontal: e.axis !== "vertical"
			};
			return e.axis === "vertical" ? j`<div class=${$(t)}></div>` : j`<hr class=${$(t)} />`;
		}
		static {
			Ai(r, n);
		}
	};
	return r;
})();
var ji = {
	...ur,
	tagName: "a2ui-divider"
}, Mi = function(e, t, n, r, i, a) {
	function o(e) {
		if (e !== void 0 && typeof e != "function") throw TypeError("Function expected");
		return e;
	}
	for (var s = r.kind, c = s === "getter" ? "get" : s === "setter" ? "set" : "value", l = !t && e ? r.static ? e : e.prototype : null, u = t || (l ? Object.getOwnPropertyDescriptor(l, r.name) : {}), d, f = !1, p = n.length - 1; p >= 0; p--) {
		var m = {};
		for (var h in r) m[h] = h === "access" ? {} : r[h];
		for (var h in r.access) m.access[h] = r.access[h];
		m.addInitializer = function(e) {
			if (f) throw TypeError("Cannot add initializers after decoration has completed");
			a.push(o(e || null));
		};
		var g = (0, n[p])(s === "accessor" ? {
			get: u.get,
			set: u.set
		} : u[c], m);
		if (s === "accessor") {
			if (g === void 0) continue;
			if (typeof g != "object" || !g) throw TypeError("Object expected");
			(d = o(g.get)) && (u.get = d), (d = o(g.set)) && (u.set = d), (d = o(g.init)) && i.unshift(d);
		} else (d = o(g)) && (s === "field" ? i.unshift(d) : u[c] = d);
	}
	l && Object.defineProperty(l, r.name, u), f = !0;
}, Ni = function(e, t, n) {
	for (var r = arguments.length > 2, i = 0; i < t.length; i++) n = r ? t[i].call(e, n) : t[i].call(e);
	return r ? n : void 0;
};
(() => {
	let e = [R("a2ui-checkbox")], t, n = [], r, i = X;
	var a = class extends i {
		static {
			r = this;
		}
		static {
			let o = typeof Symbol == "function" && Symbol.metadata ? Object.create(i[Symbol.metadata] ?? null) : void 0;
			Mi(null, t = { value: r }, e, {
				kind: "class",
				name: r.name,
				metadata: o
			}, null, n), a = r = t.value, o && Object.defineProperty(r, Symbol.metadata, {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: o
			});
		}
		static {
			this.styles = C`
    :host {
      display: block;
    }
    .container {
      display: flex;
      flex-direction: column;
      margin: var(--a2ui-checkbox-margin, var(--a2ui-spacing-m));
    }
    label.a2ui-checkbox {
      display: inline-flex;
      align-items: center;
      gap: var(--a2ui-checkbox-gap, var(--a2ui-spacing-s, 0.5rem));
      font-size: var(--a2ui-checkbox-label-font-size, var(--a2ui-label-font-size, var(--a2ui-font-size-s)));
      font-weight: var(--a2ui-checkbox-label-font-weight, var(--a2ui-label-font-weight, bold));
      cursor: pointer;
    }
    label.invalid {
      color: var(--a2ui-checkbox-color-error, red);
    }
    input {
      width: var(--a2ui-checkbox-size, 1rem);
      height: var(--a2ui-checkbox-size, 1rem);
      background: var(--a2ui-checkbox-background, inherit);
      border: var(--a2ui-checkbox-border, var(--a2ui-border));
      border-radius: var(--a2ui-checkbox-border-radius, 4px);
    }
    input.invalid {
      outline: 1px solid var(--a2ui-checkbox-color-error, red);
    }
    .error {
      color: var(--a2ui-checkbox-color-error, red);
      font-size: var(--a2ui-font-size-xs, 0.75rem);
      margin-top: 4px;
    }
  `;
		}
		createController() {
			return new S(this, pr);
		}
		render() {
			let e = this.controller.props;
			if (!e) return N;
			let t = e.isValid === !1, n = {
				"a2ui-checkbox": !0,
				invalid: t
			}, r = { invalid: t };
			return j`
      <div class="container">
        <label class=${$(n)}>
          <input
            type="checkbox"
            class=${$(r)}
            .checked=${e.value || !1}
            @change=${(t) => e.setValue?.(t.target.checked)}
          />
          ${e.label}
        </label>
        ${t && e.validationErrors?.length ? j`<div class="error">${e.validationErrors[0]}</div>` : N}
      </div>
    `;
		}
		static {
			Ni(r, n);
		}
	};
	return r;
})();
var Pi = {
	...pr,
	tagName: "a2ui-checkbox"
}, Fi = function(e, t, n, r, i, a) {
	function o(e) {
		if (e !== void 0 && typeof e != "function") throw TypeError("Function expected");
		return e;
	}
	for (var s = r.kind, c = s === "getter" ? "get" : s === "setter" ? "set" : "value", l = !t && e ? r.static ? e : e.prototype : null, u = t || (l ? Object.getOwnPropertyDescriptor(l, r.name) : {}), d, f = !1, p = n.length - 1; p >= 0; p--) {
		var m = {};
		for (var h in r) m[h] = h === "access" ? {} : r[h];
		for (var h in r.access) m.access[h] = r.access[h];
		m.addInitializer = function(e) {
			if (f) throw TypeError("Cannot add initializers after decoration has completed");
			a.push(o(e || null));
		};
		var g = (0, n[p])(s === "accessor" ? {
			get: u.get,
			set: u.set
		} : u[c], m);
		if (s === "accessor") {
			if (g === void 0) continue;
			if (typeof g != "object" || !g) throw TypeError("Object expected");
			(d = o(g.get)) && (u.get = d), (d = o(g.set)) && (u.set = d), (d = o(g.init)) && i.unshift(d);
		} else (d = o(g)) && (s === "field" ? i.unshift(d) : u[c] = d);
	}
	l && Object.defineProperty(l, r.name, u), f = !0;
}, Ii = function(e, t, n) {
	for (var r = arguments.length > 2, i = 0; i < t.length; i++) n = r ? t[i].call(e, n) : t[i].call(e);
	return r ? n : void 0;
};
(() => {
	let e = [R("a2ui-slider")], t, n = [], r, i = X;
	var a = class extends i {
		static {
			r = this;
		}
		static {
			let o = typeof Symbol == "function" && Symbol.metadata ? Object.create(i[Symbol.metadata] ?? null) : void 0;
			Fi(null, t = { value: r }, e, {
				kind: "class",
				name: r.name,
				metadata: o
			}, null, n), a = r = t.value, o && Object.defineProperty(r, Symbol.metadata, {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: o
			});
		}
		static {
			this.styles = C`
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--a2ui-spacing-xs, 0.25rem);
      margin: var(--a2ui-slider-margin, var(--a2ui-spacing-m));
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header label {
      font-size: var(--a2ui-slider-label-font-size, var(--a2ui-label-font-size, var(--a2ui-font-size-s)));
      font-weight: var(--a2ui-slider-label-font-weight, var(--a2ui-label-font-weight, bold));
    }
    input[type="range"] {
      width: 100%;
      accent-color: var(--a2ui-slider-thumb-color, var(--a2ui-color-primary, #007bff));
      background: var(--a2ui-slider-track-color, var(--a2ui-color-secondary, #e9ecef));
    }
  `;
		}
		createController() {
			return new S(this, hr);
		}
		render() {
			let e = this.controller.props;
			return e ? j`
      <div class="header">
        ${e.label ? j`<label>${e.label}</label>` : N}
        <span>${e.value}</span>
      </div>
      <input
        type="range"
        min=${e.min ?? 0}
        max=${e.max ?? 100}
        .value=${e.value?.toString() || "0"}
        @input=${(t) => e.setValue?.(Number(t.target.value))}
      />
    ` : N;
		}
		static {
			Ii(r, n);
		}
	};
	return r;
})();
var Li = {
	...hr,
	tagName: "a2ui-slider"
}, Ri = function(e, t, n, r, i, a) {
	function o(e) {
		if (e !== void 0 && typeof e != "function") throw TypeError("Function expected");
		return e;
	}
	for (var s = r.kind, c = s === "getter" ? "get" : s === "setter" ? "set" : "value", l = !t && e ? r.static ? e : e.prototype : null, u = t || (l ? Object.getOwnPropertyDescriptor(l, r.name) : {}), d, f = !1, p = n.length - 1; p >= 0; p--) {
		var m = {};
		for (var h in r) m[h] = h === "access" ? {} : r[h];
		for (var h in r.access) m.access[h] = r.access[h];
		m.addInitializer = function(e) {
			if (f) throw TypeError("Cannot add initializers after decoration has completed");
			a.push(o(e || null));
		};
		var g = (0, n[p])(s === "accessor" ? {
			get: u.get,
			set: u.set
		} : u[c], m);
		if (s === "accessor") {
			if (g === void 0) continue;
			if (typeof g != "object" || !g) throw TypeError("Object expected");
			(d = o(g.get)) && (u.get = d), (d = o(g.set)) && (u.set = d), (d = o(g.init)) && i.unshift(d);
		} else (d = o(g)) && (s === "field" ? i.unshift(d) : u[c] = d);
	}
	l && Object.defineProperty(l, r.name, u), f = !0;
}, zi = function(e, t, n) {
	for (var r = arguments.length > 2, i = 0; i < t.length; i++) n = r ? t[i].call(e, n) : t[i].call(e);
	return r ? n : void 0;
};
(() => {
	let e = [R("a2ui-datetimeinput")], t, n = [], r, i = X;
	var a = class extends i {
		static {
			r = this;
		}
		static {
			let o = typeof Symbol == "function" && Symbol.metadata ? Object.create(i[Symbol.metadata] ?? null) : void 0;
			Ri(null, t = { value: r }, e, {
				kind: "class",
				name: r.name,
				metadata: o
			}, null, n), a = r = t.value, o && Object.defineProperty(r, Symbol.metadata, {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: o
			});
		}
		static {
			this.styles = C`
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--a2ui-spacing-xs, 0.25rem);
    }
    input {
      background-color: var(--a2ui-datetimeinput-background, var(--a2ui-color-input, #fff));
      color: var(--a2ui-datetimeinput-color, var(--a2ui-color-on-input, #333));
      border: var(--a2ui-datetimeinput-border, var(--a2ui-border));
      border-radius: var(--a2ui-datetimeinput-border-radius, var(--a2ui-border-radius));
      padding: var(--a2ui-datetimeinput-padding, var(--a2ui-spacing-s));
    }
    label {
      font-size: var(--a2ui-datetimeinput-label-font-size, var(--a2ui-label-font-size, var(--a2ui-font-size-s)));
      font-weight: var(--a2ui-datetimeinput-label-font-weight, var(--a2ui-label-font-weight, bold));
    }
  `;
		}
		createController() {
			return new S(this, gr);
		}
		render() {
			let e = this.controller.props;
			if (!e) return N;
			let t = e.enableDate && e.enableTime ? "datetime-local" : e.enableDate ? "date" : "time";
			return j`
      ${e.label ? j`<label>${e.label}</label>` : N}
      <input
        type=${t}
        .value=${e.value || ""}
        @input=${(t) => e.setValue?.(t.target.value)}
      />
    `;
		}
		static {
			zi(r, n);
		}
	};
	return r;
})();
var Bi = {
	...gr,
	tagName: "a2ui-datetimeinput"
}, Vi = function(e, t, n, r, i, a) {
	function o(e) {
		if (e !== void 0 && typeof e != "function") throw TypeError("Function expected");
		return e;
	}
	for (var s = r.kind, c = s === "getter" ? "get" : s === "setter" ? "set" : "value", l = !t && e ? r.static ? e : e.prototype : null, u = t || (l ? Object.getOwnPropertyDescriptor(l, r.name) : {}), d, f = !1, p = n.length - 1; p >= 0; p--) {
		var m = {};
		for (var h in r) m[h] = h === "access" ? {} : r[h];
		for (var h in r.access) m.access[h] = r.access[h];
		m.addInitializer = function(e) {
			if (f) throw TypeError("Cannot add initializers after decoration has completed");
			a.push(o(e || null));
		};
		var g = (0, n[p])(s === "accessor" ? {
			get: u.get,
			set: u.set
		} : u[c], m);
		if (s === "accessor") {
			if (g === void 0) continue;
			if (typeof g != "object" || !g) throw TypeError("Object expected");
			(d = o(g.get)) && (u.get = d), (d = o(g.set)) && (u.set = d), (d = o(g.init)) && i.unshift(d);
		} else (d = o(g)) && (s === "field" ? i.unshift(d) : u[c] = d);
	}
	l && Object.defineProperty(l, r.name, u), f = !0;
}, Hi = function(e, t, n) {
	for (var r = arguments.length > 2, i = 0; i < t.length; i++) n = r ? t[i].call(e, n) : t[i].call(e);
	return r ? n : void 0;
};
(() => {
	let e = [R("a2ui-choicepicker")], t, n = [], r, i = X, a, o = [], s = [];
	var c = class extends i {
		static {
			r = this;
		}
		static {
			let l = typeof Symbol == "function" && Symbol.metadata ? Object.create(i[Symbol.metadata] ?? null) : void 0;
			a = [at()], Vi(this, null, a, {
				kind: "accessor",
				name: "filter",
				static: !1,
				private: !1,
				access: {
					has: (e) => "filter" in e,
					get: (e) => e.filter,
					set: (e, t) => {
						e.filter = t;
					}
				},
				metadata: l
			}, o, s), Vi(null, t = { value: r }, e, {
				kind: "class",
				name: r.name,
				metadata: l
			}, null, n), c = r = t.value, l && Object.defineProperty(r, Symbol.metadata, {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: l
			});
		}
		static {
			this.styles = C`
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--a2ui-choicepicker-gap, var(--a2ui-spacing-xs, 0.25rem));
      padding: var(--a2ui-choicepicker-padding, 0);
    }
    .options {
      display: flex;
      flex-direction: column;
      gap: var(--a2ui-choicepicker-gap, var(--a2ui-spacing-xs, 0.25rem));
    }
    label {
      color: var(--a2ui-choicepicker-label-color, inherit);
      font-size: var(--a2ui-choicepicker-label-font-size, inherit);
    }
    :host > label {
      font-size: var(--a2ui-choicepicker-label-font-size, var(--a2ui-label-font-size, var(--a2ui-font-size-s)));
      font-weight: var(--a2ui-choicepicker-label-font-weight, var(--a2ui-label-font-weight, bold));
    }
    .filter-input {
      background-color: var(--a2ui-color-input, #fff);
      color: var(--a2ui-color-on-input, #333);
      border: var(--a2ui-textfield-border, var(--a2ui-border));
      border-radius: var(--a2ui-textfield-border-radius, var(--a2ui-spacing-m));
      padding: var(--a2ui-choicepicker-filter-padding, var(--a2ui-spacing-xs, 4px) var(--a2ui-spacing-s, 8px));
      font-family: inherit;
    }
    .filter-input:focus {
      outline: none;
      border-color: var(--a2ui-textfield-color-border-focus, var(--a2ui-color-primary, #17e));
    }
    .chips {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: var(--a2ui-choicepicker-gap, var(--a2ui-spacing-xs, 0.25rem));
    }
    .chip {
      padding: var(--a2ui-choicepicker-chip-padding, var(--a2ui-spacing-s, 4px) var(--a2ui-spacing-m, 8px));
      border-radius: var(--a2ui-choicepicker-chip-border-radius, 999px);
      border: 1px solid var(--a2ui-color-border, #ccc);
      background-color: var(--a2ui-color-surface, #fff);
      color: var(--a2ui-color-on-surface, inherit);
      cursor: pointer;
      font-size: var(--a2ui-font-size-xs, 0.75rem);
      font-family: inherit;
    }
    .chip.selected {
      background-color: var(--a2ui-color-primary, #007bff);
      color: var(--a2ui-color-on-primary, #fff);
      border-color: var(--a2ui-color-primary, #007bff);
    }
  `;
		}
		#e = Hi(this, o, "");
		get filter() {
			return this.#e;
		}
		set filter(e) {
			this.#e = e;
		}
		createController() {
			return new S(this, mr);
		}
		render() {
			let e = this.controller.props;
			if (!e) return N;
			let t = Array.isArray(e.value) ? e.value : [], n = e.variant === "multipleSelection", r = e.displayStyle === "chips", i = (r) => {
				e.setValue && (n ? t.includes(r) ? e.setValue(t.filter((e) => e !== r)) : e.setValue([...t, r]) : e.setValue([r]));
			}, a = (e.options || []).filter((t) => !e.filterable || this.filter === "" || String(t.label).toLowerCase().includes(this.filter.toLowerCase()));
			return j`
      ${e.label ? j`<label>${e.label}</label>` : N}
      ${e.filterable ? j`
            <input
              type="text"
              class="filter-input"
              placeholder="Filter options..."
              aria-label="Filter options"
              .value=${this.filter}
              @input=${(e) => this.filter = e.target.value}
            />
          ` : N}
      <div class=${$({
				options: !0,
				chips: r
			})}>
        ${a.map((e) => r ? j`
                <button
                  class=${$({
				chip: !0,
				selected: t.includes(e.value)
			})}
                  aria-pressed=${t.includes(e.value)}
                  @click=${() => i(e.value)}
                >
                  ${e.label}
                </button>
              ` : j`
                <label>
                  <input
                    type=${n ? "checkbox" : "radio"}
                    .checked=${t.includes(e.value)}
                    @change=${() => i(e.value)}
                  />
                  ${e.label}
                </label>
              `)}
      </div>
    `;
		}
		constructor() {
			super(...arguments), Hi(this, s);
		}
		static {
			Hi(r, n);
		}
	};
	return r;
})();
var Ui = {
	...mr,
	tagName: "a2ui-choicepicker"
}, Wi = function(e, t, n, r, i, a) {
	function o(e) {
		if (e !== void 0 && typeof e != "function") throw TypeError("Function expected");
		return e;
	}
	for (var s = r.kind, c = s === "getter" ? "get" : s === "setter" ? "set" : "value", l = !t && e ? r.static ? e : e.prototype : null, u = t || (l ? Object.getOwnPropertyDescriptor(l, r.name) : {}), d, f = !1, p = n.length - 1; p >= 0; p--) {
		var m = {};
		for (var h in r) m[h] = h === "access" ? {} : r[h];
		for (var h in r.access) m.access[h] = r.access[h];
		m.addInitializer = function(e) {
			if (f) throw TypeError("Cannot add initializers after decoration has completed");
			a.push(o(e || null));
		};
		var g = (0, n[p])(s === "accessor" ? {
			get: u.get,
			set: u.set
		} : u[c], m);
		if (s === "accessor") {
			if (g === void 0) continue;
			if (typeof g != "object" || !g) throw TypeError("Object expected");
			(d = o(g.get)) && (u.get = d), (d = o(g.set)) && (u.set = d), (d = o(g.init)) && i.unshift(d);
		} else (d = o(g)) && (s === "field" ? i.unshift(d) : u[c] = d);
	}
	l && Object.defineProperty(l, r.name, u), f = !0;
}, Gi = function(e, t, n) {
	for (var r = arguments.length > 2, i = 0; i < t.length; i++) n = r ? t[i].call(e, n) : t[i].call(e);
	return r ? n : void 0;
};
(() => {
	let e = [R("a2ui-tabs")], t, n = [], r, i = X, a, o = [], s = [];
	var c = class extends i {
		static {
			r = this;
		}
		static {
			let l = typeof Symbol == "function" && Symbol.metadata ? Object.create(i[Symbol.metadata] ?? null) : void 0;
			a = [at()], Wi(this, null, a, {
				kind: "accessor",
				name: "activeIndex",
				static: !1,
				private: !1,
				access: {
					has: (e) => "activeIndex" in e,
					get: (e) => e.activeIndex,
					set: (e, t) => {
						e.activeIndex = t;
					}
				},
				metadata: l
			}, o, s), Wi(null, t = { value: r }, e, {
				kind: "class",
				name: r.name,
				metadata: l
			}, null, n), c = r = t.value, l && Object.defineProperty(r, Symbol.metadata, {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: l
			});
		}
		static {
			this.styles = C`
    :host {
      display: block;
    }
    .a2ui-tabs-headers {
      display: flex;
      gap: var(--a2ui-spacing-xs, 0.25rem);
      border-bottom: var(--a2ui-tabs-border, var(--a2ui-border-width, 1px) solid var(--a2ui-color-border, #ccc));
      margin-bottom: var(--a2ui-spacing-m, 0.5rem);
    }
    .a2ui-tabs-header {
      padding: var(--a2ui-spacing-m, 0.5rem) var(--a2ui-spacing-l, 1rem);
      background: var(--a2ui-tabs-header-background, transparent);
      color: var(--a2ui-tabs-header-color, var(--a2ui-color-on-surface));
      border: none;
      border-radius: var(--a2ui-border-radius, 0.25rem) var(--a2ui-border-radius, 0.25rem) 0 0;
      cursor: pointer;
      font-family: inherit;
    }
    .a2ui-tabs-header.active {
      background: var(--a2ui-tabs-header-background-active, var(--a2ui-color-secondary, #eee));
      color: var(--a2ui-tabs-header-color-active, var(--a2ui-color-on-secondary, #333));
    }
    .a2ui-tabs-content {
      padding: var(--a2ui-tabs-content-padding, 0 var(--a2ui-spacing-m, 0.5rem));
    }
  `;
		}
		createController() {
			return new S(this, cr);
		}
		#e = Gi(this, o, 0);
		get activeIndex() {
			return this.#e;
		}
		set activeIndex(e) {
			this.#e = e;
		}
		render() {
			let e = this.controller.props;
			return !e || !e.tabs ? N : j`
      <div class="a2ui-tabs-headers">
        ${e.tabs.map((e, t) => j`
            <button
              class=${$({
				"a2ui-tabs-header": !0,
				active: t === this.activeIndex
			})}
              @click=${() => this.activeIndex = t}
            >
              ${e.title}
            </button>
          `)}
      </div>
      <div class="a2ui-tabs-content">
        ${e.tabs[this.activeIndex] ? j`${this.renderNode(e.tabs[this.activeIndex].child)}` : N}
      </div>
    `;
		}
		constructor() {
			super(...arguments), Gi(this, s);
		}
		static {
			Gi(r, n);
		}
	};
	return r;
})();
var Ki = {
	...cr,
	tagName: "a2ui-tabs"
}, qi = function(e, t, n, r, i, a) {
	function o(e) {
		if (e !== void 0 && typeof e != "function") throw TypeError("Function expected");
		return e;
	}
	for (var s = r.kind, c = s === "getter" ? "get" : s === "setter" ? "set" : "value", l = !t && e ? r.static ? e : e.prototype : null, u = t || (l ? Object.getOwnPropertyDescriptor(l, r.name) : {}), d, f = !1, p = n.length - 1; p >= 0; p--) {
		var m = {};
		for (var h in r) m[h] = h === "access" ? {} : r[h];
		for (var h in r.access) m.access[h] = r.access[h];
		m.addInitializer = function(e) {
			if (f) throw TypeError("Cannot add initializers after decoration has completed");
			a.push(o(e || null));
		};
		var g = (0, n[p])(s === "accessor" ? {
			get: u.get,
			set: u.set
		} : u[c], m);
		if (s === "accessor") {
			if (g === void 0) continue;
			if (typeof g != "object" || !g) throw TypeError("Object expected");
			(d = o(g.get)) && (u.get = d), (d = o(g.set)) && (u.set = d), (d = o(g.init)) && i.unshift(d);
		} else (d = o(g)) && (s === "field" ? i.unshift(d) : u[c] = d);
	}
	l && Object.defineProperty(l, r.name, u), f = !0;
}, Ji = function(e, t, n) {
	for (var r = arguments.length > 2, i = 0; i < t.length; i++) n = r ? t[i].call(e, n) : t[i].call(e);
	return r ? n : void 0;
};
(() => {
	let e = [R("a2ui-modal")], t, n = [], r, i = X, a, o = [], s = [];
	var c = class extends i {
		static {
			r = this;
		}
		static {
			let l = typeof Symbol == "function" && Symbol.metadata ? Object.create(i[Symbol.metadata] ?? null) : void 0;
			a = [st("dialog")], qi(this, null, a, {
				kind: "accessor",
				name: "dialog",
				static: !1,
				private: !1,
				access: {
					has: (e) => "dialog" in e,
					get: (e) => e.dialog,
					set: (e, t) => {
						e.dialog = t;
					}
				},
				metadata: l
			}, o, s), qi(null, t = { value: r }, e, {
				kind: "class",
				name: r.name,
				metadata: l
			}, null, n), c = r = t.value, l && Object.defineProperty(r, Symbol.metadata, {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: l
			});
		}
		static {
			this.styles = C`
    :host {
      display: inline-block;
    }
    dialog {
      border: 1px solid var(--a2ui-color-border, #ccc);
      border-radius: var(--a2ui-modal-border-radius, 8px);
      padding: var(--a2ui-modal-padding, 24px);
      min-width: 300px;
      background: var(--a2ui-color-surface, #fff);
    }
    dialog::backdrop {
      background: var(--a2ui-modal-backdrop-bg, rgba(0, 0, 0, 0.5));
    }
  `;
		}
		createController() {
			return new S(this, lr);
		}
		#e = Ji(this, o, void 0);
		get dialog() {
			return this.#e;
		}
		set dialog(e) {
			this.#e = e;
		}
		render() {
			let e = this.controller.props;
			return e ? j`
      <div @click=${() => this.dialog?.showModal()} style="display: contents;">
        ${e.trigger ? j`${this.renderNode(e.trigger)}` : N}
      </div>
      <dialog class="a2ui-modal">
        <form method="dialog" style="text-align: right;">
          <button>×</button>
        </form>
        ${e.content ? j`${this.renderNode(e.content)}` : N}
      </dialog>
    ` : N;
		}
		constructor() {
			super(...arguments), Ji(this, s);
		}
		static {
			Ji(r, n);
		}
	};
	return r;
})();
//#endregion
//#region ../../node_modules/.pnpm/@a2ui+lit@0.9.3_signal-polyfill@0.2.2/node_modules/@a2ui/lit/src/v0_9/catalogs/basic/index.js
var Yi = new h("https://a2ui.org/specification/v0_9/basic_catalog.json", [
	Hr,
	Gr,
	Jr,
	ei,
	ai,
	ci,
	mi,
	yi,
	Si,
	Ti,
	Oi,
	ji,
	Pi,
	Li,
	Bi,
	Ui,
	Ki,
	{
		...lr,
		tagName: "a2ui-modal"
	}
], Zn);
//#endregion
export { S as A2uiController, vt as A2uiLitElement, ht as A2uiSurface, Ct as Context, Yi as basicCatalog };
