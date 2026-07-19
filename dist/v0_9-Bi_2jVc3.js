//#region \0rolldown/runtime.js
var e = Object.defineProperty, t = (t, n) => {
	let r = {};
	for (var i in t) e(r, i, {
		get: t[i],
		enumerable: !0
	});
	return n || e(r, Symbol.toStringTag, { value: "Module" }), r;
}, n;
(function(e) {
	e.assertEqual = (e) => {};
	function t(e) {}
	e.assertIs = t;
	function n(e) {
		throw Error();
	}
	e.assertNever = n, e.arrayToEnum = (e) => {
		let t = {};
		for (let n of e) t[n] = n;
		return t;
	}, e.getValidEnumValues = (t) => {
		let n = e.objectKeys(t).filter((e) => typeof t[t[e]] != "number"), r = {};
		for (let e of n) r[e] = t[e];
		return e.objectValues(r);
	}, e.objectValues = (t) => e.objectKeys(t).map(function(e) {
		return t[e];
	}), e.objectKeys = typeof Object.keys == "function" ? (e) => Object.keys(e) : (e) => {
		let t = [];
		for (let n in e) Object.prototype.hasOwnProperty.call(e, n) && t.push(n);
		return t;
	}, e.find = (e, t) => {
		for (let n of e) if (t(n)) return n;
	}, e.isInteger = typeof Number.isInteger == "function" ? (e) => Number.isInteger(e) : (e) => typeof e == "number" && Number.isFinite(e) && Math.floor(e) === e;
	function r(e, t = " | ") {
		return e.map((e) => typeof e == "string" ? `'${e}'` : e).join(t);
	}
	e.joinValues = r, e.jsonStringifyReplacer = (e, t) => typeof t == "bigint" ? t.toString() : t;
})(n ||= {});
var r;
(function(e) {
	e.mergeShapes = (e, t) => ({
		...e,
		...t
	});
})(r ||= {});
var i = n.arrayToEnum([
	"string",
	"nan",
	"number",
	"integer",
	"float",
	"boolean",
	"date",
	"bigint",
	"symbol",
	"function",
	"undefined",
	"null",
	"array",
	"object",
	"unknown",
	"promise",
	"void",
	"never",
	"map",
	"set"
]), a = (e) => {
	switch (typeof e) {
		case "undefined": return i.undefined;
		case "string": return i.string;
		case "number": return Number.isNaN(e) ? i.nan : i.number;
		case "boolean": return i.boolean;
		case "function": return i.function;
		case "bigint": return i.bigint;
		case "symbol": return i.symbol;
		case "object": return Array.isArray(e) ? i.array : e === null ? i.null : e.then && typeof e.then == "function" && e.catch && typeof e.catch == "function" ? i.promise : typeof Map < "u" && e instanceof Map ? i.map : typeof Set < "u" && e instanceof Set ? i.set : typeof Date < "u" && e instanceof Date ? i.date : i.object;
		default: return i.unknown;
	}
}, o = n.arrayToEnum([
	"invalid_type",
	"invalid_literal",
	"custom",
	"invalid_union",
	"invalid_union_discriminator",
	"invalid_enum_value",
	"unrecognized_keys",
	"invalid_arguments",
	"invalid_return_type",
	"invalid_date",
	"invalid_string",
	"too_small",
	"too_big",
	"invalid_intersection_types",
	"not_multiple_of",
	"not_finite"
]), s = class e extends Error {
	get errors() {
		return this.issues;
	}
	constructor(e) {
		super(), this.issues = [], this.addIssue = (e) => {
			this.issues = [...this.issues, e];
		}, this.addIssues = (e = []) => {
			this.issues = [...this.issues, ...e];
		};
		let t = new.target.prototype;
		Object.setPrototypeOf ? Object.setPrototypeOf(this, t) : this.__proto__ = t, this.name = "ZodError", this.issues = e;
	}
	format(e) {
		let t = e || function(e) {
			return e.message;
		}, n = { _errors: [] }, r = (e) => {
			for (let i of e.issues) if (i.code === "invalid_union") i.unionErrors.map(r);
			else if (i.code === "invalid_return_type") r(i.returnTypeError);
			else if (i.code === "invalid_arguments") r(i.argumentsError);
			else if (i.path.length === 0) n._errors.push(t(i));
			else {
				let e = n, r = 0;
				for (; r < i.path.length;) {
					let n = i.path[r];
					r === i.path.length - 1 ? (e[n] = e[n] || { _errors: [] }, e[n]._errors.push(t(i))) : e[n] = e[n] || { _errors: [] }, e = e[n], r++;
				}
			}
		};
		return r(this), n;
	}
	static assert(t) {
		if (!(t instanceof e)) throw Error(`Not a ZodError: ${t}`);
	}
	toString() {
		return this.message;
	}
	get message() {
		return JSON.stringify(this.issues, n.jsonStringifyReplacer, 2);
	}
	get isEmpty() {
		return this.issues.length === 0;
	}
	flatten(e = (e) => e.message) {
		let t = {}, n = [];
		for (let r of this.issues) if (r.path.length > 0) {
			let n = r.path[0];
			t[n] = t[n] || [], t[n].push(e(r));
		} else n.push(e(r));
		return {
			formErrors: n,
			fieldErrors: t
		};
	}
	get formErrors() {
		return this.flatten();
	}
};
s.create = (e) => new s(e);
//#endregion
//#region ../../node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/locales/en.js
var c = (e, t) => {
	let r;
	switch (e.code) {
		case o.invalid_type:
			r = e.received === i.undefined ? "Required" : `Expected ${e.expected}, received ${e.received}`;
			break;
		case o.invalid_literal:
			r = `Invalid literal value, expected ${JSON.stringify(e.expected, n.jsonStringifyReplacer)}`;
			break;
		case o.unrecognized_keys:
			r = `Unrecognized key(s) in object: ${n.joinValues(e.keys, ", ")}`;
			break;
		case o.invalid_union:
			r = "Invalid input";
			break;
		case o.invalid_union_discriminator:
			r = `Invalid discriminator value. Expected ${n.joinValues(e.options)}`;
			break;
		case o.invalid_enum_value:
			r = `Invalid enum value. Expected ${n.joinValues(e.options)}, received '${e.received}'`;
			break;
		case o.invalid_arguments:
			r = "Invalid function arguments";
			break;
		case o.invalid_return_type:
			r = "Invalid function return type";
			break;
		case o.invalid_date:
			r = "Invalid date";
			break;
		case o.invalid_string:
			typeof e.validation == "object" ? "includes" in e.validation ? (r = `Invalid input: must include "${e.validation.includes}"`, typeof e.validation.position == "number" && (r = `${r} at one or more positions greater than or equal to ${e.validation.position}`)) : "startsWith" in e.validation ? r = `Invalid input: must start with "${e.validation.startsWith}"` : "endsWith" in e.validation ? r = `Invalid input: must end with "${e.validation.endsWith}"` : n.assertNever(e.validation) : r = e.validation === "regex" ? "Invalid" : `Invalid ${e.validation}`;
			break;
		case o.too_small:
			r = e.type === "array" ? `Array must contain ${e.exact ? "exactly" : e.inclusive ? "at least" : "more than"} ${e.minimum} element(s)` : e.type === "string" ? `String must contain ${e.exact ? "exactly" : e.inclusive ? "at least" : "over"} ${e.minimum} character(s)` : e.type === "number" || e.type === "bigint" ? `Number must be ${e.exact ? "exactly equal to " : e.inclusive ? "greater than or equal to " : "greater than "}${e.minimum}` : e.type === "date" ? `Date must be ${e.exact ? "exactly equal to " : e.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(e.minimum))}` : "Invalid input";
			break;
		case o.too_big:
			r = e.type === "array" ? `Array must contain ${e.exact ? "exactly" : e.inclusive ? "at most" : "less than"} ${e.maximum} element(s)` : e.type === "string" ? `String must contain ${e.exact ? "exactly" : e.inclusive ? "at most" : "under"} ${e.maximum} character(s)` : e.type === "number" ? `Number must be ${e.exact ? "exactly" : e.inclusive ? "less than or equal to" : "less than"} ${e.maximum}` : e.type === "bigint" ? `BigInt must be ${e.exact ? "exactly" : e.inclusive ? "less than or equal to" : "less than"} ${e.maximum}` : e.type === "date" ? `Date must be ${e.exact ? "exactly" : e.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(e.maximum))}` : "Invalid input";
			break;
		case o.custom:
			r = "Invalid input";
			break;
		case o.invalid_intersection_types:
			r = "Intersection results could not be merged";
			break;
		case o.not_multiple_of:
			r = `Number must be a multiple of ${e.multipleOf}`;
			break;
		case o.not_finite:
			r = "Number must be finite";
			break;
		default: r = t.defaultError, n.assertNever(e);
	}
	return { message: r };
}, ee = c;
function te() {
	return ee;
}
//#endregion
//#region ../../node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/helpers/parseUtil.js
var ne = (e) => {
	let { data: t, path: n, errorMaps: r, issueData: i } = e, a = [...n, ...i.path || []], o = {
		...i,
		path: a
	};
	if (i.message !== void 0) return {
		...i,
		path: a,
		message: i.message
	};
	let s = "", c = r.filter((e) => !!e).slice().reverse();
	for (let e of c) s = e(o, {
		data: t,
		defaultError: s
	}).message;
	return {
		...i,
		path: a,
		message: s
	};
};
function l(e, t) {
	let n = te(), r = ne({
		issueData: t,
		data: e.data,
		path: e.path,
		errorMaps: [
			e.common.contextualErrorMap,
			e.schemaErrorMap,
			n,
			n === c ? void 0 : c
		].filter((e) => !!e)
	});
	e.common.issues.push(r);
}
var u = class e {
	constructor() {
		this.value = "valid";
	}
	dirty() {
		this.value === "valid" && (this.value = "dirty");
	}
	abort() {
		this.value !== "aborted" && (this.value = "aborted");
	}
	static mergeArray(e, t) {
		let n = [];
		for (let r of t) {
			if (r.status === "aborted") return d;
			r.status === "dirty" && e.dirty(), n.push(r.value);
		}
		return {
			status: e.value,
			value: n
		};
	}
	static async mergeObjectAsync(t, n) {
		let r = [];
		for (let e of n) {
			let t = await e.key, n = await e.value;
			r.push({
				key: t,
				value: n
			});
		}
		return e.mergeObjectSync(t, r);
	}
	static mergeObjectSync(e, t) {
		let n = {};
		for (let r of t) {
			let { key: t, value: i } = r;
			if (t.status === "aborted" || i.status === "aborted") return d;
			t.status === "dirty" && e.dirty(), i.status === "dirty" && e.dirty(), t.value !== "__proto__" && (i.value !== void 0 || r.alwaysSet) && (n[t.value] = i.value);
		}
		return {
			status: e.value,
			value: n
		};
	}
}, d = Object.freeze({ status: "aborted" }), re = (e) => ({
	status: "dirty",
	value: e
}), f = (e) => ({
	status: "valid",
	value: e
}), ie = (e) => e.status === "aborted", ae = (e) => e.status === "dirty", p = (e) => e.status === "valid", oe = (e) => typeof Promise < "u" && e instanceof Promise, m;
(function(e) {
	e.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, e.toString = (e) => typeof e == "string" ? e : e?.message;
})(m ||= {});
//#endregion
//#region ../../node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/types.js
var h = class {
	constructor(e, t, n, r) {
		this._cachedPath = [], this.parent = e, this.data = t, this._path = n, this._key = r;
	}
	get path() {
		return this._cachedPath.length || (Array.isArray(this._key) ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
	}
}, se = (e, t) => {
	if (p(t)) return {
		success: !0,
		data: t.value
	};
	if (!e.common.issues.length) throw Error("Validation failed but no issues detected.");
	return {
		success: !1,
		get error() {
			if (this._error) return this._error;
			let t = new s(e.common.issues);
			return this._error = t, this._error;
		}
	};
};
function g(e) {
	if (!e) return {};
	let { errorMap: t, invalid_type_error: n, required_error: r, description: i } = e;
	if (t && (n || r)) throw Error("Can't use \"invalid_type_error\" or \"required_error\" in conjunction with custom error map.");
	return t ? {
		errorMap: t,
		description: i
	} : {
		errorMap: (t, i) => {
			let { message: a } = e;
			return t.code === "invalid_enum_value" ? { message: a ?? i.defaultError } : i.data === void 0 ? { message: a ?? r ?? i.defaultError } : t.code === "invalid_type" ? { message: a ?? n ?? i.defaultError } : { message: i.defaultError };
		},
		description: i
	};
}
var _ = class {
	get description() {
		return this._def.description;
	}
	_getType(e) {
		return a(e.data);
	}
	_getOrReturnCtx(e, t) {
		return t || {
			common: e.parent.common,
			data: e.data,
			parsedType: a(e.data),
			schemaErrorMap: this._def.errorMap,
			path: e.path,
			parent: e.parent
		};
	}
	_processInputParams(e) {
		return {
			status: new u(),
			ctx: {
				common: e.parent.common,
				data: e.data,
				parsedType: a(e.data),
				schemaErrorMap: this._def.errorMap,
				path: e.path,
				parent: e.parent
			}
		};
	}
	_parseSync(e) {
		let t = this._parse(e);
		if (oe(t)) throw Error("Synchronous parse encountered promise.");
		return t;
	}
	_parseAsync(e) {
		let t = this._parse(e);
		return Promise.resolve(t);
	}
	parse(e, t) {
		let n = this.safeParse(e, t);
		if (n.success) return n.data;
		throw n.error;
	}
	safeParse(e, t) {
		let n = {
			common: {
				issues: [],
				async: t?.async ?? !1,
				contextualErrorMap: t?.errorMap
			},
			path: t?.path || [],
			schemaErrorMap: this._def.errorMap,
			parent: null,
			data: e,
			parsedType: a(e)
		};
		return se(n, this._parseSync({
			data: e,
			path: n.path,
			parent: n
		}));
	}
	"~validate"(e) {
		let t = {
			common: {
				issues: [],
				async: !!this["~standard"].async
			},
			path: [],
			schemaErrorMap: this._def.errorMap,
			parent: null,
			data: e,
			parsedType: a(e)
		};
		if (!this["~standard"].async) try {
			let n = this._parseSync({
				data: e,
				path: [],
				parent: t
			});
			return p(n) ? { value: n.value } : { issues: t.common.issues };
		} catch (e) {
			e?.message?.toLowerCase()?.includes("encountered") && (this["~standard"].async = !0), t.common = {
				issues: [],
				async: !0
			};
		}
		return this._parseAsync({
			data: e,
			path: [],
			parent: t
		}).then((e) => p(e) ? { value: e.value } : { issues: t.common.issues });
	}
	async parseAsync(e, t) {
		let n = await this.safeParseAsync(e, t);
		if (n.success) return n.data;
		throw n.error;
	}
	async safeParseAsync(e, t) {
		let n = {
			common: {
				issues: [],
				contextualErrorMap: t?.errorMap,
				async: !0
			},
			path: t?.path || [],
			schemaErrorMap: this._def.errorMap,
			parent: null,
			data: e,
			parsedType: a(e)
		}, r = this._parse({
			data: e,
			path: n.path,
			parent: n
		});
		return se(n, await (oe(r) ? r : Promise.resolve(r)));
	}
	refine(e, t) {
		let n = (e) => typeof t == "string" || t === void 0 ? { message: t } : typeof t == "function" ? t(e) : t;
		return this._refinement((t, r) => {
			let i = e(t), a = () => r.addIssue({
				code: o.custom,
				...n(t)
			});
			return typeof Promise < "u" && i instanceof Promise ? i.then((e) => e ? !0 : (a(), !1)) : i ? !0 : (a(), !1);
		});
	}
	refinement(e, t) {
		return this._refinement((n, r) => e(n) ? !0 : (r.addIssue(typeof t == "function" ? t(n, r) : t), !1));
	}
	_refinement(e) {
		return new T({
			schema: this,
			typeName: O.ZodEffects,
			effect: {
				type: "refinement",
				refinement: e
			}
		});
	}
	superRefine(e) {
		return this._refinement(e);
	}
	constructor(e) {
		this.spa = this.safeParseAsync, this._def = e, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.readonly = this.readonly.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this), this["~standard"] = {
			version: 1,
			vendor: "zod",
			validate: (e) => this["~validate"](e)
		};
	}
	optional() {
		return E.create(this, this._def);
	}
	nullable() {
		return D.create(this, this._def);
	}
	nullish() {
		return this.nullable().optional();
	}
	array() {
		return b.create(this);
	}
	promise() {
		return nt.create(this, this._def);
	}
	or(e) {
		return Ue.create([this, e], this._def);
	}
	and(e) {
		return Ke.create(this, e, this._def);
	}
	transform(e) {
		return new T({
			...g(this._def),
			schema: this,
			typeName: O.ZodEffects,
			effect: {
				type: "transform",
				transform: e
			}
		});
	}
	default(e) {
		let t = typeof e == "function" ? e : () => e;
		return new rt({
			...g(this._def),
			innerType: this,
			defaultValue: t,
			typeName: O.ZodDefault
		});
	}
	brand() {
		return new ot({
			typeName: O.ZodBranded,
			type: this,
			...g(this._def)
		});
	}
	catch(e) {
		let t = typeof e == "function" ? e : () => e;
		return new it({
			...g(this._def),
			innerType: this,
			catchValue: t,
			typeName: O.ZodCatch
		});
	}
	describe(e) {
		let t = this.constructor;
		return new t({
			...this._def,
			description: e
		});
	}
	pipe(e) {
		return st.create(this, e);
	}
	readonly() {
		return ct.create(this);
	}
	isOptional() {
		return this.safeParse(void 0).success;
	}
	isNullable() {
		return this.safeParse(null).success;
	}
}, ce = /^c[^\s-]{8,}$/i, le = /^[0-9a-z]+$/, ue = /^[0-9A-HJKMNP-TV-Z]{26}$/i, de = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, fe = /^[a-z0-9_-]{21}$/i, pe = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, me = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, he = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, ge = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$", _e, ve = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, ye = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, be = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, xe = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, Se = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, Ce = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, we = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", Te = RegExp(`^${we}$`);
function Ee(e) {
	let t = "[0-5]\\d";
	e.precision ? t = `${t}\\.\\d{${e.precision}}` : e.precision ?? (t = `${t}(\\.\\d+)?`);
	let n = e.precision ? "+" : "?";
	return `([01]\\d|2[0-3]):[0-5]\\d(:${t})${n}`;
}
function De(e) {
	return RegExp(`^${Ee(e)}$`);
}
function Oe(e) {
	let t = `${we}T${Ee(e)}`, n = [];
	return n.push(e.local ? "Z?" : "Z"), e.offset && n.push("([+-]\\d{2}:?\\d{2})"), t = `${t}(${n.join("|")})`, RegExp(`^${t}$`);
}
function ke(e, t) {
	return !!((t === "v4" || !t) && ve.test(e) || (t === "v6" || !t) && be.test(e));
}
function Ae(e, t) {
	if (!pe.test(e)) return !1;
	try {
		let [n] = e.split(".");
		if (!n) return !1;
		let r = n.replace(/-/g, "+").replace(/_/g, "/").padEnd(n.length + (4 - n.length % 4) % 4, "="), i = JSON.parse(atob(r));
		return !(typeof i != "object" || !i || "typ" in i && i?.typ !== "JWT" || !i.alg || t && i.alg !== t);
	} catch {
		return !1;
	}
}
function je(e, t) {
	return !!((t === "v4" || !t) && ye.test(e) || (t === "v6" || !t) && xe.test(e));
}
var Me = class e extends _ {
	_parse(e) {
		if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== i.string) {
			let t = this._getOrReturnCtx(e);
			return l(t, {
				code: o.invalid_type,
				expected: i.string,
				received: t.parsedType
			}), d;
		}
		let t = new u(), r;
		for (let i of this._def.checks) if (i.kind === "min") e.data.length < i.value && (r = this._getOrReturnCtx(e, r), l(r, {
			code: o.too_small,
			minimum: i.value,
			type: "string",
			inclusive: !0,
			exact: !1,
			message: i.message
		}), t.dirty());
		else if (i.kind === "max") e.data.length > i.value && (r = this._getOrReturnCtx(e, r), l(r, {
			code: o.too_big,
			maximum: i.value,
			type: "string",
			inclusive: !0,
			exact: !1,
			message: i.message
		}), t.dirty());
		else if (i.kind === "length") {
			let n = e.data.length > i.value, a = e.data.length < i.value;
			(n || a) && (r = this._getOrReturnCtx(e, r), n ? l(r, {
				code: o.too_big,
				maximum: i.value,
				type: "string",
				inclusive: !0,
				exact: !0,
				message: i.message
			}) : a && l(r, {
				code: o.too_small,
				minimum: i.value,
				type: "string",
				inclusive: !0,
				exact: !0,
				message: i.message
			}), t.dirty());
		} else if (i.kind === "email") he.test(e.data) || (r = this._getOrReturnCtx(e, r), l(r, {
			validation: "email",
			code: o.invalid_string,
			message: i.message
		}), t.dirty());
		else if (i.kind === "emoji") _e ||= new RegExp(ge, "u"), _e.test(e.data) || (r = this._getOrReturnCtx(e, r), l(r, {
			validation: "emoji",
			code: o.invalid_string,
			message: i.message
		}), t.dirty());
		else if (i.kind === "uuid") de.test(e.data) || (r = this._getOrReturnCtx(e, r), l(r, {
			validation: "uuid",
			code: o.invalid_string,
			message: i.message
		}), t.dirty());
		else if (i.kind === "nanoid") fe.test(e.data) || (r = this._getOrReturnCtx(e, r), l(r, {
			validation: "nanoid",
			code: o.invalid_string,
			message: i.message
		}), t.dirty());
		else if (i.kind === "cuid") ce.test(e.data) || (r = this._getOrReturnCtx(e, r), l(r, {
			validation: "cuid",
			code: o.invalid_string,
			message: i.message
		}), t.dirty());
		else if (i.kind === "cuid2") le.test(e.data) || (r = this._getOrReturnCtx(e, r), l(r, {
			validation: "cuid2",
			code: o.invalid_string,
			message: i.message
		}), t.dirty());
		else if (i.kind === "ulid") ue.test(e.data) || (r = this._getOrReturnCtx(e, r), l(r, {
			validation: "ulid",
			code: o.invalid_string,
			message: i.message
		}), t.dirty());
		else if (i.kind === "url") try {
			new URL(e.data);
		} catch {
			r = this._getOrReturnCtx(e, r), l(r, {
				validation: "url",
				code: o.invalid_string,
				message: i.message
			}), t.dirty();
		}
		else i.kind === "regex" ? (i.regex.lastIndex = 0, i.regex.test(e.data) || (r = this._getOrReturnCtx(e, r), l(r, {
			validation: "regex",
			code: o.invalid_string,
			message: i.message
		}), t.dirty())) : i.kind === "trim" ? e.data = e.data.trim() : i.kind === "includes" ? e.data.includes(i.value, i.position) || (r = this._getOrReturnCtx(e, r), l(r, {
			code: o.invalid_string,
			validation: {
				includes: i.value,
				position: i.position
			},
			message: i.message
		}), t.dirty()) : i.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : i.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : i.kind === "startsWith" ? e.data.startsWith(i.value) || (r = this._getOrReturnCtx(e, r), l(r, {
			code: o.invalid_string,
			validation: { startsWith: i.value },
			message: i.message
		}), t.dirty()) : i.kind === "endsWith" ? e.data.endsWith(i.value) || (r = this._getOrReturnCtx(e, r), l(r, {
			code: o.invalid_string,
			validation: { endsWith: i.value },
			message: i.message
		}), t.dirty()) : i.kind === "datetime" ? Oe(i).test(e.data) || (r = this._getOrReturnCtx(e, r), l(r, {
			code: o.invalid_string,
			validation: "datetime",
			message: i.message
		}), t.dirty()) : i.kind === "date" ? Te.test(e.data) || (r = this._getOrReturnCtx(e, r), l(r, {
			code: o.invalid_string,
			validation: "date",
			message: i.message
		}), t.dirty()) : i.kind === "time" ? De(i).test(e.data) || (r = this._getOrReturnCtx(e, r), l(r, {
			code: o.invalid_string,
			validation: "time",
			message: i.message
		}), t.dirty()) : i.kind === "duration" ? me.test(e.data) || (r = this._getOrReturnCtx(e, r), l(r, {
			validation: "duration",
			code: o.invalid_string,
			message: i.message
		}), t.dirty()) : i.kind === "ip" ? ke(e.data, i.version) || (r = this._getOrReturnCtx(e, r), l(r, {
			validation: "ip",
			code: o.invalid_string,
			message: i.message
		}), t.dirty()) : i.kind === "jwt" ? Ae(e.data, i.alg) || (r = this._getOrReturnCtx(e, r), l(r, {
			validation: "jwt",
			code: o.invalid_string,
			message: i.message
		}), t.dirty()) : i.kind === "cidr" ? je(e.data, i.version) || (r = this._getOrReturnCtx(e, r), l(r, {
			validation: "cidr",
			code: o.invalid_string,
			message: i.message
		}), t.dirty()) : i.kind === "base64" ? Se.test(e.data) || (r = this._getOrReturnCtx(e, r), l(r, {
			validation: "base64",
			code: o.invalid_string,
			message: i.message
		}), t.dirty()) : i.kind === "base64url" ? Ce.test(e.data) || (r = this._getOrReturnCtx(e, r), l(r, {
			validation: "base64url",
			code: o.invalid_string,
			message: i.message
		}), t.dirty()) : n.assertNever(i);
		return {
			status: t.value,
			value: e.data
		};
	}
	_regex(e, t, n) {
		return this.refinement((t) => e.test(t), {
			validation: t,
			code: o.invalid_string,
			...m.errToObj(n)
		});
	}
	_addCheck(t) {
		return new e({
			...this._def,
			checks: [...this._def.checks, t]
		});
	}
	email(e) {
		return this._addCheck({
			kind: "email",
			...m.errToObj(e)
		});
	}
	url(e) {
		return this._addCheck({
			kind: "url",
			...m.errToObj(e)
		});
	}
	emoji(e) {
		return this._addCheck({
			kind: "emoji",
			...m.errToObj(e)
		});
	}
	uuid(e) {
		return this._addCheck({
			kind: "uuid",
			...m.errToObj(e)
		});
	}
	nanoid(e) {
		return this._addCheck({
			kind: "nanoid",
			...m.errToObj(e)
		});
	}
	cuid(e) {
		return this._addCheck({
			kind: "cuid",
			...m.errToObj(e)
		});
	}
	cuid2(e) {
		return this._addCheck({
			kind: "cuid2",
			...m.errToObj(e)
		});
	}
	ulid(e) {
		return this._addCheck({
			kind: "ulid",
			...m.errToObj(e)
		});
	}
	base64(e) {
		return this._addCheck({
			kind: "base64",
			...m.errToObj(e)
		});
	}
	base64url(e) {
		return this._addCheck({
			kind: "base64url",
			...m.errToObj(e)
		});
	}
	jwt(e) {
		return this._addCheck({
			kind: "jwt",
			...m.errToObj(e)
		});
	}
	ip(e) {
		return this._addCheck({
			kind: "ip",
			...m.errToObj(e)
		});
	}
	cidr(e) {
		return this._addCheck({
			kind: "cidr",
			...m.errToObj(e)
		});
	}
	datetime(e) {
		return typeof e == "string" ? this._addCheck({
			kind: "datetime",
			precision: null,
			offset: !1,
			local: !1,
			message: e
		}) : this._addCheck({
			kind: "datetime",
			precision: e?.precision === void 0 ? null : e?.precision,
			offset: e?.offset ?? !1,
			local: e?.local ?? !1,
			...m.errToObj(e?.message)
		});
	}
	date(e) {
		return this._addCheck({
			kind: "date",
			message: e
		});
	}
	time(e) {
		return typeof e == "string" ? this._addCheck({
			kind: "time",
			precision: null,
			message: e
		}) : this._addCheck({
			kind: "time",
			precision: e?.precision === void 0 ? null : e?.precision,
			...m.errToObj(e?.message)
		});
	}
	duration(e) {
		return this._addCheck({
			kind: "duration",
			...m.errToObj(e)
		});
	}
	regex(e, t) {
		return this._addCheck({
			kind: "regex",
			regex: e,
			...m.errToObj(t)
		});
	}
	includes(e, t) {
		return this._addCheck({
			kind: "includes",
			value: e,
			position: t?.position,
			...m.errToObj(t?.message)
		});
	}
	startsWith(e, t) {
		return this._addCheck({
			kind: "startsWith",
			value: e,
			...m.errToObj(t)
		});
	}
	endsWith(e, t) {
		return this._addCheck({
			kind: "endsWith",
			value: e,
			...m.errToObj(t)
		});
	}
	min(e, t) {
		return this._addCheck({
			kind: "min",
			value: e,
			...m.errToObj(t)
		});
	}
	max(e, t) {
		return this._addCheck({
			kind: "max",
			value: e,
			...m.errToObj(t)
		});
	}
	length(e, t) {
		return this._addCheck({
			kind: "length",
			value: e,
			...m.errToObj(t)
		});
	}
	nonempty(e) {
		return this.min(1, m.errToObj(e));
	}
	trim() {
		return new e({
			...this._def,
			checks: [...this._def.checks, { kind: "trim" }]
		});
	}
	toLowerCase() {
		return new e({
			...this._def,
			checks: [...this._def.checks, { kind: "toLowerCase" }]
		});
	}
	toUpperCase() {
		return new e({
			...this._def,
			checks: [...this._def.checks, { kind: "toUpperCase" }]
		});
	}
	get isDatetime() {
		return !!this._def.checks.find((e) => e.kind === "datetime");
	}
	get isDate() {
		return !!this._def.checks.find((e) => e.kind === "date");
	}
	get isTime() {
		return !!this._def.checks.find((e) => e.kind === "time");
	}
	get isDuration() {
		return !!this._def.checks.find((e) => e.kind === "duration");
	}
	get isEmail() {
		return !!this._def.checks.find((e) => e.kind === "email");
	}
	get isURL() {
		return !!this._def.checks.find((e) => e.kind === "url");
	}
	get isEmoji() {
		return !!this._def.checks.find((e) => e.kind === "emoji");
	}
	get isUUID() {
		return !!this._def.checks.find((e) => e.kind === "uuid");
	}
	get isNANOID() {
		return !!this._def.checks.find((e) => e.kind === "nanoid");
	}
	get isCUID() {
		return !!this._def.checks.find((e) => e.kind === "cuid");
	}
	get isCUID2() {
		return !!this._def.checks.find((e) => e.kind === "cuid2");
	}
	get isULID() {
		return !!this._def.checks.find((e) => e.kind === "ulid");
	}
	get isIP() {
		return !!this._def.checks.find((e) => e.kind === "ip");
	}
	get isCIDR() {
		return !!this._def.checks.find((e) => e.kind === "cidr");
	}
	get isBase64() {
		return !!this._def.checks.find((e) => e.kind === "base64");
	}
	get isBase64url() {
		return !!this._def.checks.find((e) => e.kind === "base64url");
	}
	get minLength() {
		let e = null;
		for (let t of this._def.checks) t.kind === "min" && (e === null || t.value > e) && (e = t.value);
		return e;
	}
	get maxLength() {
		let e = null;
		for (let t of this._def.checks) t.kind === "max" && (e === null || t.value < e) && (e = t.value);
		return e;
	}
};
Me.create = (e) => new Me({
	checks: [],
	typeName: O.ZodString,
	coerce: e?.coerce ?? !1,
	...g(e)
});
function Ne(e, t) {
	let n = (e.toString().split(".")[1] || "").length, r = (t.toString().split(".")[1] || "").length, i = n > r ? n : r;
	return Number.parseInt(e.toFixed(i).replace(".", "")) % Number.parseInt(t.toFixed(i).replace(".", "")) / 10 ** i;
}
var Pe = class e extends _ {
	constructor() {
		super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
	}
	_parse(e) {
		if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== i.number) {
			let t = this._getOrReturnCtx(e);
			return l(t, {
				code: o.invalid_type,
				expected: i.number,
				received: t.parsedType
			}), d;
		}
		let t, r = new u();
		for (let i of this._def.checks) i.kind === "int" ? n.isInteger(e.data) || (t = this._getOrReturnCtx(e, t), l(t, {
			code: o.invalid_type,
			expected: "integer",
			received: "float",
			message: i.message
		}), r.dirty()) : i.kind === "min" ? (i.inclusive ? e.data < i.value : e.data <= i.value) && (t = this._getOrReturnCtx(e, t), l(t, {
			code: o.too_small,
			minimum: i.value,
			type: "number",
			inclusive: i.inclusive,
			exact: !1,
			message: i.message
		}), r.dirty()) : i.kind === "max" ? (i.inclusive ? e.data > i.value : e.data >= i.value) && (t = this._getOrReturnCtx(e, t), l(t, {
			code: o.too_big,
			maximum: i.value,
			type: "number",
			inclusive: i.inclusive,
			exact: !1,
			message: i.message
		}), r.dirty()) : i.kind === "multipleOf" ? Ne(e.data, i.value) !== 0 && (t = this._getOrReturnCtx(e, t), l(t, {
			code: o.not_multiple_of,
			multipleOf: i.value,
			message: i.message
		}), r.dirty()) : i.kind === "finite" ? Number.isFinite(e.data) || (t = this._getOrReturnCtx(e, t), l(t, {
			code: o.not_finite,
			message: i.message
		}), r.dirty()) : n.assertNever(i);
		return {
			status: r.value,
			value: e.data
		};
	}
	gte(e, t) {
		return this.setLimit("min", e, !0, m.toString(t));
	}
	gt(e, t) {
		return this.setLimit("min", e, !1, m.toString(t));
	}
	lte(e, t) {
		return this.setLimit("max", e, !0, m.toString(t));
	}
	lt(e, t) {
		return this.setLimit("max", e, !1, m.toString(t));
	}
	setLimit(t, n, r, i) {
		return new e({
			...this._def,
			checks: [...this._def.checks, {
				kind: t,
				value: n,
				inclusive: r,
				message: m.toString(i)
			}]
		});
	}
	_addCheck(t) {
		return new e({
			...this._def,
			checks: [...this._def.checks, t]
		});
	}
	int(e) {
		return this._addCheck({
			kind: "int",
			message: m.toString(e)
		});
	}
	positive(e) {
		return this._addCheck({
			kind: "min",
			value: 0,
			inclusive: !1,
			message: m.toString(e)
		});
	}
	negative(e) {
		return this._addCheck({
			kind: "max",
			value: 0,
			inclusive: !1,
			message: m.toString(e)
		});
	}
	nonpositive(e) {
		return this._addCheck({
			kind: "max",
			value: 0,
			inclusive: !0,
			message: m.toString(e)
		});
	}
	nonnegative(e) {
		return this._addCheck({
			kind: "min",
			value: 0,
			inclusive: !0,
			message: m.toString(e)
		});
	}
	multipleOf(e, t) {
		return this._addCheck({
			kind: "multipleOf",
			value: e,
			message: m.toString(t)
		});
	}
	finite(e) {
		return this._addCheck({
			kind: "finite",
			message: m.toString(e)
		});
	}
	safe(e) {
		return this._addCheck({
			kind: "min",
			inclusive: !0,
			value: -(2 ** 53 - 1),
			message: m.toString(e)
		})._addCheck({
			kind: "max",
			inclusive: !0,
			value: 2 ** 53 - 1,
			message: m.toString(e)
		});
	}
	get minValue() {
		let e = null;
		for (let t of this._def.checks) t.kind === "min" && (e === null || t.value > e) && (e = t.value);
		return e;
	}
	get maxValue() {
		let e = null;
		for (let t of this._def.checks) t.kind === "max" && (e === null || t.value < e) && (e = t.value);
		return e;
	}
	get isInt() {
		return !!this._def.checks.find((e) => e.kind === "int" || e.kind === "multipleOf" && n.isInteger(e.value));
	}
	get isFinite() {
		let e = null, t = null;
		for (let n of this._def.checks) if (n.kind === "finite" || n.kind === "int" || n.kind === "multipleOf") return !0;
		else n.kind === "min" ? (t === null || n.value > t) && (t = n.value) : n.kind === "max" && (e === null || n.value < e) && (e = n.value);
		return Number.isFinite(t) && Number.isFinite(e);
	}
};
Pe.create = (e) => new Pe({
	checks: [],
	typeName: O.ZodNumber,
	coerce: e?.coerce || !1,
	...g(e)
});
var Fe = class e extends _ {
	constructor() {
		super(...arguments), this.min = this.gte, this.max = this.lte;
	}
	_parse(e) {
		if (this._def.coerce) try {
			e.data = BigInt(e.data);
		} catch {
			return this._getInvalidInput(e);
		}
		if (this._getType(e) !== i.bigint) return this._getInvalidInput(e);
		let t, r = new u();
		for (let i of this._def.checks) i.kind === "min" ? (i.inclusive ? e.data < i.value : e.data <= i.value) && (t = this._getOrReturnCtx(e, t), l(t, {
			code: o.too_small,
			type: "bigint",
			minimum: i.value,
			inclusive: i.inclusive,
			message: i.message
		}), r.dirty()) : i.kind === "max" ? (i.inclusive ? e.data > i.value : e.data >= i.value) && (t = this._getOrReturnCtx(e, t), l(t, {
			code: o.too_big,
			type: "bigint",
			maximum: i.value,
			inclusive: i.inclusive,
			message: i.message
		}), r.dirty()) : i.kind === "multipleOf" ? e.data % i.value !== BigInt(0) && (t = this._getOrReturnCtx(e, t), l(t, {
			code: o.not_multiple_of,
			multipleOf: i.value,
			message: i.message
		}), r.dirty()) : n.assertNever(i);
		return {
			status: r.value,
			value: e.data
		};
	}
	_getInvalidInput(e) {
		let t = this._getOrReturnCtx(e);
		return l(t, {
			code: o.invalid_type,
			expected: i.bigint,
			received: t.parsedType
		}), d;
	}
	gte(e, t) {
		return this.setLimit("min", e, !0, m.toString(t));
	}
	gt(e, t) {
		return this.setLimit("min", e, !1, m.toString(t));
	}
	lte(e, t) {
		return this.setLimit("max", e, !0, m.toString(t));
	}
	lt(e, t) {
		return this.setLimit("max", e, !1, m.toString(t));
	}
	setLimit(t, n, r, i) {
		return new e({
			...this._def,
			checks: [...this._def.checks, {
				kind: t,
				value: n,
				inclusive: r,
				message: m.toString(i)
			}]
		});
	}
	_addCheck(t) {
		return new e({
			...this._def,
			checks: [...this._def.checks, t]
		});
	}
	positive(e) {
		return this._addCheck({
			kind: "min",
			value: BigInt(0),
			inclusive: !1,
			message: m.toString(e)
		});
	}
	negative(e) {
		return this._addCheck({
			kind: "max",
			value: BigInt(0),
			inclusive: !1,
			message: m.toString(e)
		});
	}
	nonpositive(e) {
		return this._addCheck({
			kind: "max",
			value: BigInt(0),
			inclusive: !0,
			message: m.toString(e)
		});
	}
	nonnegative(e) {
		return this._addCheck({
			kind: "min",
			value: BigInt(0),
			inclusive: !0,
			message: m.toString(e)
		});
	}
	multipleOf(e, t) {
		return this._addCheck({
			kind: "multipleOf",
			value: e,
			message: m.toString(t)
		});
	}
	get minValue() {
		let e = null;
		for (let t of this._def.checks) t.kind === "min" && (e === null || t.value > e) && (e = t.value);
		return e;
	}
	get maxValue() {
		let e = null;
		for (let t of this._def.checks) t.kind === "max" && (e === null || t.value < e) && (e = t.value);
		return e;
	}
};
Fe.create = (e) => new Fe({
	checks: [],
	typeName: O.ZodBigInt,
	coerce: e?.coerce ?? !1,
	...g(e)
});
var Ie = class extends _ {
	_parse(e) {
		if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== i.boolean) {
			let t = this._getOrReturnCtx(e);
			return l(t, {
				code: o.invalid_type,
				expected: i.boolean,
				received: t.parsedType
			}), d;
		}
		return f(e.data);
	}
};
Ie.create = (e) => new Ie({
	typeName: O.ZodBoolean,
	coerce: e?.coerce || !1,
	...g(e)
});
var Le = class e extends _ {
	_parse(e) {
		if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== i.date) {
			let t = this._getOrReturnCtx(e);
			return l(t, {
				code: o.invalid_type,
				expected: i.date,
				received: t.parsedType
			}), d;
		}
		if (Number.isNaN(e.data.getTime())) return l(this._getOrReturnCtx(e), { code: o.invalid_date }), d;
		let t = new u(), r;
		for (let i of this._def.checks) i.kind === "min" ? e.data.getTime() < i.value && (r = this._getOrReturnCtx(e, r), l(r, {
			code: o.too_small,
			message: i.message,
			inclusive: !0,
			exact: !1,
			minimum: i.value,
			type: "date"
		}), t.dirty()) : i.kind === "max" ? e.data.getTime() > i.value && (r = this._getOrReturnCtx(e, r), l(r, {
			code: o.too_big,
			message: i.message,
			inclusive: !0,
			exact: !1,
			maximum: i.value,
			type: "date"
		}), t.dirty()) : n.assertNever(i);
		return {
			status: t.value,
			value: new Date(e.data.getTime())
		};
	}
	_addCheck(t) {
		return new e({
			...this._def,
			checks: [...this._def.checks, t]
		});
	}
	min(e, t) {
		return this._addCheck({
			kind: "min",
			value: e.getTime(),
			message: m.toString(t)
		});
	}
	max(e, t) {
		return this._addCheck({
			kind: "max",
			value: e.getTime(),
			message: m.toString(t)
		});
	}
	get minDate() {
		let e = null;
		for (let t of this._def.checks) t.kind === "min" && (e === null || t.value > e) && (e = t.value);
		return e == null ? null : new Date(e);
	}
	get maxDate() {
		let e = null;
		for (let t of this._def.checks) t.kind === "max" && (e === null || t.value < e) && (e = t.value);
		return e == null ? null : new Date(e);
	}
};
Le.create = (e) => new Le({
	checks: [],
	coerce: e?.coerce || !1,
	typeName: O.ZodDate,
	...g(e)
});
var Re = class extends _ {
	_parse(e) {
		if (this._getType(e) !== i.symbol) {
			let t = this._getOrReturnCtx(e);
			return l(t, {
				code: o.invalid_type,
				expected: i.symbol,
				received: t.parsedType
			}), d;
		}
		return f(e.data);
	}
};
Re.create = (e) => new Re({
	typeName: O.ZodSymbol,
	...g(e)
});
var ze = class extends _ {
	_parse(e) {
		if (this._getType(e) !== i.undefined) {
			let t = this._getOrReturnCtx(e);
			return l(t, {
				code: o.invalid_type,
				expected: i.undefined,
				received: t.parsedType
			}), d;
		}
		return f(e.data);
	}
};
ze.create = (e) => new ze({
	typeName: O.ZodUndefined,
	...g(e)
});
var Be = class extends _ {
	_parse(e) {
		if (this._getType(e) !== i.null) {
			let t = this._getOrReturnCtx(e);
			return l(t, {
				code: o.invalid_type,
				expected: i.null,
				received: t.parsedType
			}), d;
		}
		return f(e.data);
	}
};
Be.create = (e) => new Be({
	typeName: O.ZodNull,
	...g(e)
});
var Ve = class extends _ {
	constructor() {
		super(...arguments), this._any = !0;
	}
	_parse(e) {
		return f(e.data);
	}
};
Ve.create = (e) => new Ve({
	typeName: O.ZodAny,
	...g(e)
});
var v = class extends _ {
	constructor() {
		super(...arguments), this._unknown = !0;
	}
	_parse(e) {
		return f(e.data);
	}
};
v.create = (e) => new v({
	typeName: O.ZodUnknown,
	...g(e)
});
var y = class extends _ {
	_parse(e) {
		let t = this._getOrReturnCtx(e);
		return l(t, {
			code: o.invalid_type,
			expected: i.never,
			received: t.parsedType
		}), d;
	}
};
y.create = (e) => new y({
	typeName: O.ZodNever,
	...g(e)
});
var He = class extends _ {
	_parse(e) {
		if (this._getType(e) !== i.undefined) {
			let t = this._getOrReturnCtx(e);
			return l(t, {
				code: o.invalid_type,
				expected: i.void,
				received: t.parsedType
			}), d;
		}
		return f(e.data);
	}
};
He.create = (e) => new He({
	typeName: O.ZodVoid,
	...g(e)
});
var b = class e extends _ {
	_parse(e) {
		let { ctx: t, status: n } = this._processInputParams(e), r = this._def;
		if (t.parsedType !== i.array) return l(t, {
			code: o.invalid_type,
			expected: i.array,
			received: t.parsedType
		}), d;
		if (r.exactLength !== null) {
			let e = t.data.length > r.exactLength.value, i = t.data.length < r.exactLength.value;
			(e || i) && (l(t, {
				code: e ? o.too_big : o.too_small,
				minimum: i ? r.exactLength.value : void 0,
				maximum: e ? r.exactLength.value : void 0,
				type: "array",
				inclusive: !0,
				exact: !0,
				message: r.exactLength.message
			}), n.dirty());
		}
		if (r.minLength !== null && t.data.length < r.minLength.value && (l(t, {
			code: o.too_small,
			minimum: r.minLength.value,
			type: "array",
			inclusive: !0,
			exact: !1,
			message: r.minLength.message
		}), n.dirty()), r.maxLength !== null && t.data.length > r.maxLength.value && (l(t, {
			code: o.too_big,
			maximum: r.maxLength.value,
			type: "array",
			inclusive: !0,
			exact: !1,
			message: r.maxLength.message
		}), n.dirty()), t.common.async) return Promise.all([...t.data].map((e, n) => r.type._parseAsync(new h(t, e, t.path, n)))).then((e) => u.mergeArray(n, e));
		let a = [...t.data].map((e, n) => r.type._parseSync(new h(t, e, t.path, n)));
		return u.mergeArray(n, a);
	}
	get element() {
		return this._def.type;
	}
	min(t, n) {
		return new e({
			...this._def,
			minLength: {
				value: t,
				message: m.toString(n)
			}
		});
	}
	max(t, n) {
		return new e({
			...this._def,
			maxLength: {
				value: t,
				message: m.toString(n)
			}
		});
	}
	length(t, n) {
		return new e({
			...this._def,
			exactLength: {
				value: t,
				message: m.toString(n)
			}
		});
	}
	nonempty(e) {
		return this.min(1, e);
	}
};
b.create = (e, t) => new b({
	type: e,
	minLength: null,
	maxLength: null,
	exactLength: null,
	typeName: O.ZodArray,
	...g(t)
});
function x(e) {
	if (e instanceof S) {
		let t = {};
		for (let n in e.shape) {
			let r = e.shape[n];
			t[n] = E.create(x(r));
		}
		return new S({
			...e._def,
			shape: () => t
		});
	} else if (e instanceof b) return new b({
		...e._def,
		type: x(e.element)
	});
	else if (e instanceof E) return E.create(x(e.unwrap()));
	else if (e instanceof D) return D.create(x(e.unwrap()));
	else if (e instanceof w) return w.create(e.items.map((e) => x(e)));
	else return e;
}
var S = class e extends _ {
	constructor() {
		super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
	}
	_getCached() {
		if (this._cached !== null) return this._cached;
		let e = this._def.shape(), t = n.objectKeys(e);
		return this._cached = {
			shape: e,
			keys: t
		}, this._cached;
	}
	_parse(e) {
		if (this._getType(e) !== i.object) {
			let t = this._getOrReturnCtx(e);
			return l(t, {
				code: o.invalid_type,
				expected: i.object,
				received: t.parsedType
			}), d;
		}
		let { status: t, ctx: n } = this._processInputParams(e), { shape: r, keys: a } = this._getCached(), s = [];
		if (!(this._def.catchall instanceof y && this._def.unknownKeys === "strip")) for (let e in n.data) a.includes(e) || s.push(e);
		let c = [];
		for (let e of a) {
			let t = r[e], i = n.data[e];
			c.push({
				key: {
					status: "valid",
					value: e
				},
				value: t._parse(new h(n, i, n.path, e)),
				alwaysSet: e in n.data
			});
		}
		if (this._def.catchall instanceof y) {
			let e = this._def.unknownKeys;
			if (e === "passthrough") for (let e of s) c.push({
				key: {
					status: "valid",
					value: e
				},
				value: {
					status: "valid",
					value: n.data[e]
				}
			});
			else if (e === "strict") s.length > 0 && (l(n, {
				code: o.unrecognized_keys,
				keys: s
			}), t.dirty());
			else if (e !== "strip") throw Error("Internal ZodObject error: invalid unknownKeys value.");
		} else {
			let e = this._def.catchall;
			for (let t of s) {
				let r = n.data[t];
				c.push({
					key: {
						status: "valid",
						value: t
					},
					value: e._parse(new h(n, r, n.path, t)),
					alwaysSet: t in n.data
				});
			}
		}
		return n.common.async ? Promise.resolve().then(async () => {
			let e = [];
			for (let t of c) {
				let n = await t.key, r = await t.value;
				e.push({
					key: n,
					value: r,
					alwaysSet: t.alwaysSet
				});
			}
			return e;
		}).then((e) => u.mergeObjectSync(t, e)) : u.mergeObjectSync(t, c);
	}
	get shape() {
		return this._def.shape();
	}
	strict(t) {
		return m.errToObj, new e({
			...this._def,
			unknownKeys: "strict",
			...t === void 0 ? {} : { errorMap: (e, n) => {
				let r = this._def.errorMap?.(e, n).message ?? n.defaultError;
				return e.code === "unrecognized_keys" ? { message: m.errToObj(t).message ?? r } : { message: r };
			} }
		});
	}
	strip() {
		return new e({
			...this._def,
			unknownKeys: "strip"
		});
	}
	passthrough() {
		return new e({
			...this._def,
			unknownKeys: "passthrough"
		});
	}
	extend(t) {
		return new e({
			...this._def,
			shape: () => ({
				...this._def.shape(),
				...t
			})
		});
	}
	merge(t) {
		return new e({
			unknownKeys: t._def.unknownKeys,
			catchall: t._def.catchall,
			shape: () => ({
				...this._def.shape(),
				...t._def.shape()
			}),
			typeName: O.ZodObject
		});
	}
	setKey(e, t) {
		return this.augment({ [e]: t });
	}
	catchall(t) {
		return new e({
			...this._def,
			catchall: t
		});
	}
	pick(t) {
		let r = {};
		for (let e of n.objectKeys(t)) t[e] && this.shape[e] && (r[e] = this.shape[e]);
		return new e({
			...this._def,
			shape: () => r
		});
	}
	omit(t) {
		let r = {};
		for (let e of n.objectKeys(this.shape)) t[e] || (r[e] = this.shape[e]);
		return new e({
			...this._def,
			shape: () => r
		});
	}
	deepPartial() {
		return x(this);
	}
	partial(t) {
		let r = {};
		for (let e of n.objectKeys(this.shape)) {
			let n = this.shape[e];
			t && !t[e] ? r[e] = n : r[e] = n.optional();
		}
		return new e({
			...this._def,
			shape: () => r
		});
	}
	required(t) {
		let r = {};
		for (let e of n.objectKeys(this.shape)) if (t && !t[e]) r[e] = this.shape[e];
		else {
			let t = this.shape[e];
			for (; t instanceof E;) t = t._def.innerType;
			r[e] = t;
		}
		return new e({
			...this._def,
			shape: () => r
		});
	}
	keyof() {
		return $e(n.objectKeys(this.shape));
	}
};
S.create = (e, t) => new S({
	shape: () => e,
	unknownKeys: "strip",
	catchall: y.create(),
	typeName: O.ZodObject,
	...g(t)
}), S.strictCreate = (e, t) => new S({
	shape: () => e,
	unknownKeys: "strict",
	catchall: y.create(),
	typeName: O.ZodObject,
	...g(t)
}), S.lazycreate = (e, t) => new S({
	shape: e,
	unknownKeys: "strip",
	catchall: y.create(),
	typeName: O.ZodObject,
	...g(t)
});
var Ue = class extends _ {
	_parse(e) {
		let { ctx: t } = this._processInputParams(e), n = this._def.options;
		function r(e) {
			for (let t of e) if (t.result.status === "valid") return t.result;
			for (let n of e) if (n.result.status === "dirty") return t.common.issues.push(...n.ctx.common.issues), n.result;
			let n = e.map((e) => new s(e.ctx.common.issues));
			return l(t, {
				code: o.invalid_union,
				unionErrors: n
			}), d;
		}
		if (t.common.async) return Promise.all(n.map(async (e) => {
			let n = {
				...t,
				common: {
					...t.common,
					issues: []
				},
				parent: null
			};
			return {
				result: await e._parseAsync({
					data: t.data,
					path: t.path,
					parent: n
				}),
				ctx: n
			};
		})).then(r);
		{
			let e, r = [];
			for (let i of n) {
				let n = {
					...t,
					common: {
						...t.common,
						issues: []
					},
					parent: null
				}, a = i._parseSync({
					data: t.data,
					path: t.path,
					parent: n
				});
				if (a.status === "valid") return a;
				a.status === "dirty" && !e && (e = {
					result: a,
					ctx: n
				}), n.common.issues.length && r.push(n.common.issues);
			}
			if (e) return t.common.issues.push(...e.ctx.common.issues), e.result;
			let i = r.map((e) => new s(e));
			return l(t, {
				code: o.invalid_union,
				unionErrors: i
			}), d;
		}
	}
	get options() {
		return this._def.options;
	}
};
Ue.create = (e, t) => new Ue({
	options: e,
	typeName: O.ZodUnion,
	...g(t)
});
var C = (e) => e instanceof Ze ? C(e.schema) : e instanceof T ? C(e.innerType()) : e instanceof Qe ? [e.value] : e instanceof et ? e.options : e instanceof tt ? n.objectValues(e.enum) : e instanceof rt ? C(e._def.innerType) : e instanceof ze ? [void 0] : e instanceof Be ? [null] : e instanceof E ? [void 0, ...C(e.unwrap())] : e instanceof D ? [null, ...C(e.unwrap())] : e instanceof ot || e instanceof ct ? C(e.unwrap()) : e instanceof it ? C(e._def.innerType) : [], We = class e extends _ {
	_parse(e) {
		let { ctx: t } = this._processInputParams(e);
		if (t.parsedType !== i.object) return l(t, {
			code: o.invalid_type,
			expected: i.object,
			received: t.parsedType
		}), d;
		let n = this.discriminator, r = t.data[n], a = this.optionsMap.get(r);
		return a ? t.common.async ? a._parseAsync({
			data: t.data,
			path: t.path,
			parent: t
		}) : a._parseSync({
			data: t.data,
			path: t.path,
			parent: t
		}) : (l(t, {
			code: o.invalid_union_discriminator,
			options: Array.from(this.optionsMap.keys()),
			path: [n]
		}), d);
	}
	get discriminator() {
		return this._def.discriminator;
	}
	get options() {
		return this._def.options;
	}
	get optionsMap() {
		return this._def.optionsMap;
	}
	static create(t, n, r) {
		let i = /* @__PURE__ */ new Map();
		for (let e of n) {
			let n = C(e.shape[t]);
			if (!n.length) throw Error(`A discriminator value for key \`${t}\` could not be extracted from all schema options`);
			for (let r of n) {
				if (i.has(r)) throw Error(`Discriminator property ${String(t)} has duplicate value ${String(r)}`);
				i.set(r, e);
			}
		}
		return new e({
			typeName: O.ZodDiscriminatedUnion,
			discriminator: t,
			options: n,
			optionsMap: i,
			...g(r)
		});
	}
};
function Ge(e, t) {
	let r = a(e), o = a(t);
	if (e === t) return {
		valid: !0,
		data: e
	};
	if (r === i.object && o === i.object) {
		let r = n.objectKeys(t), i = n.objectKeys(e).filter((e) => r.indexOf(e) !== -1), a = {
			...e,
			...t
		};
		for (let n of i) {
			let r = Ge(e[n], t[n]);
			if (!r.valid) return { valid: !1 };
			a[n] = r.data;
		}
		return {
			valid: !0,
			data: a
		};
	} else if (r === i.array && o === i.array) {
		if (e.length !== t.length) return { valid: !1 };
		let n = [];
		for (let r = 0; r < e.length; r++) {
			let i = e[r], a = t[r], o = Ge(i, a);
			if (!o.valid) return { valid: !1 };
			n.push(o.data);
		}
		return {
			valid: !0,
			data: n
		};
	} else if (r === i.date && o === i.date && +e == +t) return {
		valid: !0,
		data: e
	};
	else return { valid: !1 };
}
var Ke = class extends _ {
	_parse(e) {
		let { status: t, ctx: n } = this._processInputParams(e), r = (e, r) => {
			if (ie(e) || ie(r)) return d;
			let i = Ge(e.value, r.value);
			return i.valid ? ((ae(e) || ae(r)) && t.dirty(), {
				status: t.value,
				value: i.data
			}) : (l(n, { code: o.invalid_intersection_types }), d);
		};
		return n.common.async ? Promise.all([this._def.left._parseAsync({
			data: n.data,
			path: n.path,
			parent: n
		}), this._def.right._parseAsync({
			data: n.data,
			path: n.path,
			parent: n
		})]).then(([e, t]) => r(e, t)) : r(this._def.left._parseSync({
			data: n.data,
			path: n.path,
			parent: n
		}), this._def.right._parseSync({
			data: n.data,
			path: n.path,
			parent: n
		}));
	}
};
Ke.create = (e, t, n) => new Ke({
	left: e,
	right: t,
	typeName: O.ZodIntersection,
	...g(n)
});
var w = class e extends _ {
	_parse(e) {
		let { status: t, ctx: n } = this._processInputParams(e);
		if (n.parsedType !== i.array) return l(n, {
			code: o.invalid_type,
			expected: i.array,
			received: n.parsedType
		}), d;
		if (n.data.length < this._def.items.length) return l(n, {
			code: o.too_small,
			minimum: this._def.items.length,
			inclusive: !0,
			exact: !1,
			type: "array"
		}), d;
		!this._def.rest && n.data.length > this._def.items.length && (l(n, {
			code: o.too_big,
			maximum: this._def.items.length,
			inclusive: !0,
			exact: !1,
			type: "array"
		}), t.dirty());
		let r = [...n.data].map((e, t) => {
			let r = this._def.items[t] || this._def.rest;
			return r ? r._parse(new h(n, e, n.path, t)) : null;
		}).filter((e) => !!e);
		return n.common.async ? Promise.all(r).then((e) => u.mergeArray(t, e)) : u.mergeArray(t, r);
	}
	get items() {
		return this._def.items;
	}
	rest(t) {
		return new e({
			...this._def,
			rest: t
		});
	}
};
w.create = (e, t) => {
	if (!Array.isArray(e)) throw Error("You must pass an array of schemas to z.tuple([ ... ])");
	return new w({
		items: e,
		typeName: O.ZodTuple,
		rest: null,
		...g(t)
	});
};
var qe = class e extends _ {
	get keySchema() {
		return this._def.keyType;
	}
	get valueSchema() {
		return this._def.valueType;
	}
	_parse(e) {
		let { status: t, ctx: n } = this._processInputParams(e);
		if (n.parsedType !== i.object) return l(n, {
			code: o.invalid_type,
			expected: i.object,
			received: n.parsedType
		}), d;
		let r = [], a = this._def.keyType, s = this._def.valueType;
		for (let e in n.data) r.push({
			key: a._parse(new h(n, e, n.path, e)),
			value: s._parse(new h(n, n.data[e], n.path, e)),
			alwaysSet: e in n.data
		});
		return n.common.async ? u.mergeObjectAsync(t, r) : u.mergeObjectSync(t, r);
	}
	get element() {
		return this._def.valueType;
	}
	static create(t, n, r) {
		return n instanceof _ ? new e({
			keyType: t,
			valueType: n,
			typeName: O.ZodRecord,
			...g(r)
		}) : new e({
			keyType: Me.create(),
			valueType: t,
			typeName: O.ZodRecord,
			...g(n)
		});
	}
}, Je = class extends _ {
	get keySchema() {
		return this._def.keyType;
	}
	get valueSchema() {
		return this._def.valueType;
	}
	_parse(e) {
		let { status: t, ctx: n } = this._processInputParams(e);
		if (n.parsedType !== i.map) return l(n, {
			code: o.invalid_type,
			expected: i.map,
			received: n.parsedType
		}), d;
		let r = this._def.keyType, a = this._def.valueType, s = [...n.data.entries()].map(([e, t], i) => ({
			key: r._parse(new h(n, e, n.path, [i, "key"])),
			value: a._parse(new h(n, t, n.path, [i, "value"]))
		}));
		if (n.common.async) {
			let e = /* @__PURE__ */ new Map();
			return Promise.resolve().then(async () => {
				for (let n of s) {
					let r = await n.key, i = await n.value;
					if (r.status === "aborted" || i.status === "aborted") return d;
					(r.status === "dirty" || i.status === "dirty") && t.dirty(), e.set(r.value, i.value);
				}
				return {
					status: t.value,
					value: e
				};
			});
		} else {
			let e = /* @__PURE__ */ new Map();
			for (let n of s) {
				let r = n.key, i = n.value;
				if (r.status === "aborted" || i.status === "aborted") return d;
				(r.status === "dirty" || i.status === "dirty") && t.dirty(), e.set(r.value, i.value);
			}
			return {
				status: t.value,
				value: e
			};
		}
	}
};
Je.create = (e, t, n) => new Je({
	valueType: t,
	keyType: e,
	typeName: O.ZodMap,
	...g(n)
});
var Ye = class e extends _ {
	_parse(e) {
		let { status: t, ctx: n } = this._processInputParams(e);
		if (n.parsedType !== i.set) return l(n, {
			code: o.invalid_type,
			expected: i.set,
			received: n.parsedType
		}), d;
		let r = this._def;
		r.minSize !== null && n.data.size < r.minSize.value && (l(n, {
			code: o.too_small,
			minimum: r.minSize.value,
			type: "set",
			inclusive: !0,
			exact: !1,
			message: r.minSize.message
		}), t.dirty()), r.maxSize !== null && n.data.size > r.maxSize.value && (l(n, {
			code: o.too_big,
			maximum: r.maxSize.value,
			type: "set",
			inclusive: !0,
			exact: !1,
			message: r.maxSize.message
		}), t.dirty());
		let a = this._def.valueType;
		function s(e) {
			let n = /* @__PURE__ */ new Set();
			for (let r of e) {
				if (r.status === "aborted") return d;
				r.status === "dirty" && t.dirty(), n.add(r.value);
			}
			return {
				status: t.value,
				value: n
			};
		}
		let c = [...n.data.values()].map((e, t) => a._parse(new h(n, e, n.path, t)));
		return n.common.async ? Promise.all(c).then((e) => s(e)) : s(c);
	}
	min(t, n) {
		return new e({
			...this._def,
			minSize: {
				value: t,
				message: m.toString(n)
			}
		});
	}
	max(t, n) {
		return new e({
			...this._def,
			maxSize: {
				value: t,
				message: m.toString(n)
			}
		});
	}
	size(e, t) {
		return this.min(e, t).max(e, t);
	}
	nonempty(e) {
		return this.min(1, e);
	}
};
Ye.create = (e, t) => new Ye({
	valueType: e,
	minSize: null,
	maxSize: null,
	typeName: O.ZodSet,
	...g(t)
});
var Xe = class e extends _ {
	constructor() {
		super(...arguments), this.validate = this.implement;
	}
	_parse(e) {
		let { ctx: t } = this._processInputParams(e);
		if (t.parsedType !== i.function) return l(t, {
			code: o.invalid_type,
			expected: i.function,
			received: t.parsedType
		}), d;
		function n(e, n) {
			return ne({
				data: e,
				path: t.path,
				errorMaps: [
					t.common.contextualErrorMap,
					t.schemaErrorMap,
					te(),
					c
				].filter((e) => !!e),
				issueData: {
					code: o.invalid_arguments,
					argumentsError: n
				}
			});
		}
		function r(e, n) {
			return ne({
				data: e,
				path: t.path,
				errorMaps: [
					t.common.contextualErrorMap,
					t.schemaErrorMap,
					te(),
					c
				].filter((e) => !!e),
				issueData: {
					code: o.invalid_return_type,
					returnTypeError: n
				}
			});
		}
		let a = { errorMap: t.common.contextualErrorMap }, ee = t.data;
		if (this._def.returns instanceof nt) {
			let e = this;
			return f(async function(...t) {
				let i = new s([]), o = await e._def.args.parseAsync(t, a).catch((e) => {
					throw i.addIssue(n(t, e)), i;
				}), c = await Reflect.apply(ee, this, o);
				return await e._def.returns._def.type.parseAsync(c, a).catch((e) => {
					throw i.addIssue(r(c, e)), i;
				});
			});
		} else {
			let e = this;
			return f(function(...t) {
				let i = e._def.args.safeParse(t, a);
				if (!i.success) throw new s([n(t, i.error)]);
				let o = Reflect.apply(ee, this, i.data), c = e._def.returns.safeParse(o, a);
				if (!c.success) throw new s([r(o, c.error)]);
				return c.data;
			});
		}
	}
	parameters() {
		return this._def.args;
	}
	returnType() {
		return this._def.returns;
	}
	args(...t) {
		return new e({
			...this._def,
			args: w.create(t).rest(v.create())
		});
	}
	returns(t) {
		return new e({
			...this._def,
			returns: t
		});
	}
	implement(e) {
		return this.parse(e);
	}
	strictImplement(e) {
		return this.parse(e);
	}
	static create(t, n, r) {
		return new e({
			args: t || w.create([]).rest(v.create()),
			returns: n || v.create(),
			typeName: O.ZodFunction,
			...g(r)
		});
	}
}, Ze = class extends _ {
	get schema() {
		return this._def.getter();
	}
	_parse(e) {
		let { ctx: t } = this._processInputParams(e);
		return this._def.getter()._parse({
			data: t.data,
			path: t.path,
			parent: t
		});
	}
};
Ze.create = (e, t) => new Ze({
	getter: e,
	typeName: O.ZodLazy,
	...g(t)
});
var Qe = class extends _ {
	_parse(e) {
		if (e.data !== this._def.value) {
			let t = this._getOrReturnCtx(e);
			return l(t, {
				received: t.data,
				code: o.invalid_literal,
				expected: this._def.value
			}), d;
		}
		return {
			status: "valid",
			value: e.data
		};
	}
	get value() {
		return this._def.value;
	}
};
Qe.create = (e, t) => new Qe({
	value: e,
	typeName: O.ZodLiteral,
	...g(t)
});
function $e(e, t) {
	return new et({
		values: e,
		typeName: O.ZodEnum,
		...g(t)
	});
}
var et = class e extends _ {
	_parse(e) {
		if (typeof e.data != "string") {
			let t = this._getOrReturnCtx(e), r = this._def.values;
			return l(t, {
				expected: n.joinValues(r),
				received: t.parsedType,
				code: o.invalid_type
			}), d;
		}
		if (this._cache ||= new Set(this._def.values), !this._cache.has(e.data)) {
			let t = this._getOrReturnCtx(e), n = this._def.values;
			return l(t, {
				received: t.data,
				code: o.invalid_enum_value,
				options: n
			}), d;
		}
		return f(e.data);
	}
	get options() {
		return this._def.values;
	}
	get enum() {
		let e = {};
		for (let t of this._def.values) e[t] = t;
		return e;
	}
	get Values() {
		let e = {};
		for (let t of this._def.values) e[t] = t;
		return e;
	}
	get Enum() {
		let e = {};
		for (let t of this._def.values) e[t] = t;
		return e;
	}
	extract(t, n = this._def) {
		return e.create(t, {
			...this._def,
			...n
		});
	}
	exclude(t, n = this._def) {
		return e.create(this.options.filter((e) => !t.includes(e)), {
			...this._def,
			...n
		});
	}
};
et.create = $e;
var tt = class extends _ {
	_parse(e) {
		let t = n.getValidEnumValues(this._def.values), r = this._getOrReturnCtx(e);
		if (r.parsedType !== i.string && r.parsedType !== i.number) {
			let e = n.objectValues(t);
			return l(r, {
				expected: n.joinValues(e),
				received: r.parsedType,
				code: o.invalid_type
			}), d;
		}
		if (this._cache ||= new Set(n.getValidEnumValues(this._def.values)), !this._cache.has(e.data)) {
			let e = n.objectValues(t);
			return l(r, {
				received: r.data,
				code: o.invalid_enum_value,
				options: e
			}), d;
		}
		return f(e.data);
	}
	get enum() {
		return this._def.values;
	}
};
tt.create = (e, t) => new tt({
	values: e,
	typeName: O.ZodNativeEnum,
	...g(t)
});
var nt = class extends _ {
	unwrap() {
		return this._def.type;
	}
	_parse(e) {
		let { ctx: t } = this._processInputParams(e);
		return t.parsedType !== i.promise && t.common.async === !1 ? (l(t, {
			code: o.invalid_type,
			expected: i.promise,
			received: t.parsedType
		}), d) : f((t.parsedType === i.promise ? t.data : Promise.resolve(t.data)).then((e) => this._def.type.parseAsync(e, {
			path: t.path,
			errorMap: t.common.contextualErrorMap
		})));
	}
};
nt.create = (e, t) => new nt({
	type: e,
	typeName: O.ZodPromise,
	...g(t)
});
var T = class extends _ {
	innerType() {
		return this._def.schema;
	}
	sourceType() {
		return this._def.schema._def.typeName === O.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
	}
	_parse(e) {
		let { status: t, ctx: r } = this._processInputParams(e), i = this._def.effect || null, a = {
			addIssue: (e) => {
				l(r, e), e.fatal ? t.abort() : t.dirty();
			},
			get path() {
				return r.path;
			}
		};
		if (a.addIssue = a.addIssue.bind(a), i.type === "preprocess") {
			let e = i.transform(r.data, a);
			if (r.common.async) return Promise.resolve(e).then(async (e) => {
				if (t.value === "aborted") return d;
				let n = await this._def.schema._parseAsync({
					data: e,
					path: r.path,
					parent: r
				});
				return n.status === "aborted" ? d : n.status === "dirty" || t.value === "dirty" ? re(n.value) : n;
			});
			{
				if (t.value === "aborted") return d;
				let n = this._def.schema._parseSync({
					data: e,
					path: r.path,
					parent: r
				});
				return n.status === "aborted" ? d : n.status === "dirty" || t.value === "dirty" ? re(n.value) : n;
			}
		}
		if (i.type === "refinement") {
			let e = (e) => {
				let t = i.refinement(e, a);
				if (r.common.async) return Promise.resolve(t);
				if (t instanceof Promise) throw Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
				return e;
			};
			if (r.common.async === !1) {
				let n = this._def.schema._parseSync({
					data: r.data,
					path: r.path,
					parent: r
				});
				return n.status === "aborted" ? d : (n.status === "dirty" && t.dirty(), e(n.value), {
					status: t.value,
					value: n.value
				});
			} else return this._def.schema._parseAsync({
				data: r.data,
				path: r.path,
				parent: r
			}).then((n) => n.status === "aborted" ? d : (n.status === "dirty" && t.dirty(), e(n.value).then(() => ({
				status: t.value,
				value: n.value
			}))));
		}
		if (i.type === "transform") if (r.common.async === !1) {
			let e = this._def.schema._parseSync({
				data: r.data,
				path: r.path,
				parent: r
			});
			if (!p(e)) return d;
			let n = i.transform(e.value, a);
			if (n instanceof Promise) throw Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
			return {
				status: t.value,
				value: n
			};
		} else return this._def.schema._parseAsync({
			data: r.data,
			path: r.path,
			parent: r
		}).then((e) => p(e) ? Promise.resolve(i.transform(e.value, a)).then((e) => ({
			status: t.value,
			value: e
		})) : d);
		n.assertNever(i);
	}
};
T.create = (e, t, n) => new T({
	schema: e,
	typeName: O.ZodEffects,
	effect: t,
	...g(n)
}), T.createWithPreprocess = (e, t, n) => new T({
	schema: t,
	effect: {
		type: "preprocess",
		transform: e
	},
	typeName: O.ZodEffects,
	...g(n)
});
var E = class extends _ {
	_parse(e) {
		return this._getType(e) === i.undefined ? f(void 0) : this._def.innerType._parse(e);
	}
	unwrap() {
		return this._def.innerType;
	}
};
E.create = (e, t) => new E({
	innerType: e,
	typeName: O.ZodOptional,
	...g(t)
});
var D = class extends _ {
	_parse(e) {
		return this._getType(e) === i.null ? f(null) : this._def.innerType._parse(e);
	}
	unwrap() {
		return this._def.innerType;
	}
};
D.create = (e, t) => new D({
	innerType: e,
	typeName: O.ZodNullable,
	...g(t)
});
var rt = class extends _ {
	_parse(e) {
		let { ctx: t } = this._processInputParams(e), n = t.data;
		return t.parsedType === i.undefined && (n = this._def.defaultValue()), this._def.innerType._parse({
			data: n,
			path: t.path,
			parent: t
		});
	}
	removeDefault() {
		return this._def.innerType;
	}
};
rt.create = (e, t) => new rt({
	innerType: e,
	typeName: O.ZodDefault,
	defaultValue: typeof t.default == "function" ? t.default : () => t.default,
	...g(t)
});
var it = class extends _ {
	_parse(e) {
		let { ctx: t } = this._processInputParams(e), n = {
			...t,
			common: {
				...t.common,
				issues: []
			}
		}, r = this._def.innerType._parse({
			data: n.data,
			path: n.path,
			parent: { ...n }
		});
		return oe(r) ? r.then((e) => ({
			status: "valid",
			value: e.status === "valid" ? e.value : this._def.catchValue({
				get error() {
					return new s(n.common.issues);
				},
				input: n.data
			})
		})) : {
			status: "valid",
			value: r.status === "valid" ? r.value : this._def.catchValue({
				get error() {
					return new s(n.common.issues);
				},
				input: n.data
			})
		};
	}
	removeCatch() {
		return this._def.innerType;
	}
};
it.create = (e, t) => new it({
	innerType: e,
	typeName: O.ZodCatch,
	catchValue: typeof t.catch == "function" ? t.catch : () => t.catch,
	...g(t)
});
var at = class extends _ {
	_parse(e) {
		if (this._getType(e) !== i.nan) {
			let t = this._getOrReturnCtx(e);
			return l(t, {
				code: o.invalid_type,
				expected: i.nan,
				received: t.parsedType
			}), d;
		}
		return {
			status: "valid",
			value: e.data
		};
	}
};
at.create = (e) => new at({
	typeName: O.ZodNaN,
	...g(e)
});
var ot = class extends _ {
	_parse(e) {
		let { ctx: t } = this._processInputParams(e), n = t.data;
		return this._def.type._parse({
			data: n,
			path: t.path,
			parent: t
		});
	}
	unwrap() {
		return this._def.type;
	}
}, st = class e extends _ {
	_parse(e) {
		let { status: t, ctx: n } = this._processInputParams(e);
		if (n.common.async) return (async () => {
			let e = await this._def.in._parseAsync({
				data: n.data,
				path: n.path,
				parent: n
			});
			return e.status === "aborted" ? d : e.status === "dirty" ? (t.dirty(), re(e.value)) : this._def.out._parseAsync({
				data: e.value,
				path: n.path,
				parent: n
			});
		})();
		{
			let e = this._def.in._parseSync({
				data: n.data,
				path: n.path,
				parent: n
			});
			return e.status === "aborted" ? d : e.status === "dirty" ? (t.dirty(), {
				status: "dirty",
				value: e.value
			}) : this._def.out._parseSync({
				data: e.value,
				path: n.path,
				parent: n
			});
		}
	}
	static create(t, n) {
		return new e({
			in: t,
			out: n,
			typeName: O.ZodPipeline
		});
	}
}, ct = class extends _ {
	_parse(e) {
		let t = this._def.innerType._parse(e), n = (e) => (p(e) && (e.value = Object.freeze(e.value)), e);
		return oe(t) ? t.then((e) => n(e)) : n(t);
	}
	unwrap() {
		return this._def.innerType;
	}
};
ct.create = (e, t) => new ct({
	innerType: e,
	typeName: O.ZodReadonly,
	...g(t)
}), S.lazycreate;
var O;
(function(e) {
	e.ZodString = "ZodString", e.ZodNumber = "ZodNumber", e.ZodNaN = "ZodNaN", e.ZodBigInt = "ZodBigInt", e.ZodBoolean = "ZodBoolean", e.ZodDate = "ZodDate", e.ZodSymbol = "ZodSymbol", e.ZodUndefined = "ZodUndefined", e.ZodNull = "ZodNull", e.ZodAny = "ZodAny", e.ZodUnknown = "ZodUnknown", e.ZodNever = "ZodNever", e.ZodVoid = "ZodVoid", e.ZodArray = "ZodArray", e.ZodObject = "ZodObject", e.ZodUnion = "ZodUnion", e.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", e.ZodIntersection = "ZodIntersection", e.ZodTuple = "ZodTuple", e.ZodRecord = "ZodRecord", e.ZodMap = "ZodMap", e.ZodSet = "ZodSet", e.ZodFunction = "ZodFunction", e.ZodLazy = "ZodLazy", e.ZodLiteral = "ZodLiteral", e.ZodEnum = "ZodEnum", e.ZodEffects = "ZodEffects", e.ZodNativeEnum = "ZodNativeEnum", e.ZodOptional = "ZodOptional", e.ZodNullable = "ZodNullable", e.ZodDefault = "ZodDefault", e.ZodCatch = "ZodCatch", e.ZodPromise = "ZodPromise", e.ZodBranded = "ZodBranded", e.ZodPipeline = "ZodPipeline", e.ZodReadonly = "ZodReadonly";
})(O ||= {});
var k = Me.create, lt = Pe.create;
at.create, Fe.create;
var ut = Ie.create;
Le.create, Re.create, ze.create, Be.create;
var A = Ve.create;
v.create, y.create, He.create;
var j = b.create, M = S.create;
S.strictCreate;
var N = Ue.create;
We.create, Ke.create, w.create;
var dt = qe.create;
Je.create, Ye.create, Xe.create, Ze.create;
var P = Qe.create, ft = et.create;
tt.create, nt.create, T.create, E.create, D.create;
var pt = T.createWithPreprocess;
st.create;
var mt = {
	string: ((e) => Me.create({
		...e,
		coerce: !0
	})),
	number: ((e) => Pe.create({
		...e,
		coerce: !0
	})),
	boolean: ((e) => Ie.create({
		...e,
		coerce: !0
	})),
	bigint: ((e) => Fe.create({
		...e,
		coerce: !0
	})),
	date: ((e) => Le.create({
		...e,
		coerce: !0
	}))
}, ht = class extends Error {
	constructor(e, t = "UNKNOWN_ERROR") {
		super(e), this.name = this.constructor.name, this.code = t, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
	}
}, gt = class extends ht {
	constructor(e, t) {
		super(e, "VALIDATION_ERROR"), this.details = t;
	}
}, F = class extends ht {
	constructor(e, t) {
		super(e, "DATA_ERROR"), this.path = t;
	}
}, I = class extends ht {
	constructor(e, t, n) {
		super(e, "EXPRESSION_ERROR"), this.expression = t, this.details = n;
	}
}, L = class extends ht {
	constructor(e) {
		super(e, "STATE_ERROR");
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@a2ui+web_core@0.9.2/node_modules/@a2ui/web_core/src/v0_9/catalog/types.js
function _t(e) {
	return e && typeof e == "object" && "value" in e && "peek" in e;
}
function vt(e, t) {
	return {
		name: e.name,
		returnType: e.returnType,
		schema: e.schema,
		execute: t
	};
}
var yt = class {
	constructor(e, t, n = [], r) {
		this.id = e;
		let i = /* @__PURE__ */ new Map();
		for (let e of t) i.set(e.name, e);
		this.components = i;
		let a = /* @__PURE__ */ new Map();
		for (let e of n) a.set(e.name, e);
		this.functions = a, this.themeSchema = r, this.invoker = (e, t, n, r) => {
			let i = this.functions.get(e);
			if (!i) throw new I(`Function not found in catalog '${this.id}': ${e}`, e);
			try {
				let e = i.schema.parse(t);
				return i.execute(e, n, r);
			} catch (t) {
				throw t?.name === "ZodError" || t instanceof s ? new I(`Validation failed for function '${e}': ${t.message}`, e, t.errors ?? t.issues) : t;
			}
		};
	}
}, R = class {
	constructor() {
		this.listeners = /* @__PURE__ */ new Set();
	}
	subscribe(e) {
		return this.listeners.add(e), { unsubscribe: () => this.listeners.delete(e) };
	}
	async emit(e) {
		for (let t of this.listeners) try {
			await t(e);
		} catch (e) {
			console.error("EventEmitter error:", e);
		}
	}
	dispose() {
		this.listeners.clear();
	}
}, bt = Symbol.for("preact-signals");
function xt() {
	if (B > 1) B--;
	else {
		var e, t = !1;
		for ((function() {
			var e = kt;
			for (kt = void 0; e !== void 0;) e.S.v === e.v && (e.S.i = e.i), e = e.o;
		})(); Tt !== void 0;) {
			var n = Tt;
			for (Tt = void 0, Et++; n !== void 0;) {
				var r = n.u;
				if (n.u = void 0, n.f &= -3, !(8 & n.f) && Mt(n)) try {
					n.c();
				} catch (n) {
					t ||= (e = n, !0);
				}
				n = r;
			}
		}
		if (Et = 0, B--, t) throw e;
	}
}
function St(e) {
	if (B > 0) return e();
	Ot = ++Dt, B++;
	try {
		return e();
	} finally {
		xt();
	}
}
var z = void 0;
function Ct(e) {
	var t = z;
	z = void 0;
	try {
		return e();
	} finally {
		z = t;
	}
}
var wt, Tt = void 0, B = 0, Et = 0, Dt = 0, Ot = 0, kt = void 0, At = 0;
function jt(e) {
	if (z !== void 0) {
		var t = e.n;
		if (t === void 0 || t.t !== z) return t = {
			i: 0,
			S: e,
			p: z.s,
			n: void 0,
			t: z,
			e: void 0,
			x: void 0,
			r: t
		}, z.s !== void 0 && (z.s.n = t), z.s = t, e.n = t, 32 & z.f && e.S(t), t;
		if (t.i === -1) return t.i = 0, t.n !== void 0 && (t.n.p = t.p, t.p !== void 0 && (t.p.n = t.n), t.p = z.s, t.n = void 0, z.s.n = t, z.s = t), t;
	}
}
function V(e, t) {
	this.v = e, this.i = 0, this.n = void 0, this.t = void 0, this.l = 0, this.W = t?.watched, this.Z = t?.unwatched, this.name = t?.name;
}
V.prototype.brand = bt, V.prototype.h = function() {
	return !0;
}, V.prototype.S = function(e) {
	var t = this, n = this.t;
	n !== e && e.e === void 0 && (e.x = n, this.t = e, n === void 0 ? Ct(function() {
		var e;
		(e = t.W) == null || e.call(t);
	}) : n.e = e);
}, V.prototype.U = function(e) {
	var t = this;
	if (this.t !== void 0) {
		var n = e.e, r = e.x;
		n !== void 0 && (n.x = r, e.e = void 0), r !== void 0 && (r.e = n, e.x = void 0), e === this.t && (this.t = r, r === void 0 && Ct(function() {
			var e;
			(e = t.Z) == null || e.call(t);
		}));
	}
}, V.prototype.subscribe = function(e) {
	var t = this;
	return G(function() {
		var n = t.value;
		Ct(function() {
			return e(n);
		});
	}, { name: "sub" });
}, V.prototype.valueOf = function() {
	return this.value;
}, V.prototype.toString = function() {
	return this.value + "";
}, V.prototype.toJSON = function() {
	return this.value;
}, V.prototype.peek = function() {
	var e = this;
	return Ct(function() {
		return e.value;
	});
}, Object.defineProperty(V.prototype, "value", {
	get: function() {
		var e = jt(this);
		return e !== void 0 && (e.i = this.i), this.v;
	},
	set: function(e) {
		if (e !== this.v) {
			if (Et > 100) throw Error("Cycle detected");
			(function(e) {
				B !== 0 && Et === 0 && e.l !== Ot && (e.l = Ot, kt = {
					S: e,
					v: e.v,
					i: e.i,
					o: kt
				});
			})(this), this.v = e, this.i++, At++, B++;
			try {
				for (var t = this.t; t !== void 0; t = t.x) t.t.N();
			} finally {
				xt();
			}
		}
	}
});
function H(e, t) {
	return new V(e, t);
}
function Mt(e) {
	for (var t = e.s; t !== void 0; t = t.n) if (t.S.i !== t.i || !t.S.h() || t.S.i !== t.i) return !0;
	return !1;
}
function Nt(e) {
	for (var t = e.s; t !== void 0; t = t.n) {
		var n = t.S.n;
		if (n !== void 0 && (t.r = n), t.S.n = t, t.i = -1, t.n === void 0) {
			e.s = t;
			break;
		}
	}
}
function Pt(e) {
	for (var t = e.s, n = void 0; t !== void 0;) {
		var r = t.p;
		t.i === -1 ? (t.S.U(t), r !== void 0 && (r.n = t.n), t.n !== void 0 && (t.n.p = r)) : n = t, t.S.n = t.r, t.r !== void 0 && (t.r = void 0), t = r;
	}
	e.s = n;
}
function U(e, t) {
	V.call(this, void 0, t), this.x = e, this.s = void 0, this.g = At - 1, this.f = 4;
}
U.prototype = new V(), U.prototype.h = function() {
	if (this.f &= -3, 1 & this.f) return !1;
	if ((36 & this.f) == 32 || (this.f &= -5, this.g === At)) return !0;
	if (this.g = At, this.f |= 1, this.i > 0 && !Mt(this)) return this.f &= -2, !0;
	var e = z;
	try {
		Nt(this), z = this;
		var t = this.x();
		(16 & this.f || this.v !== t || this.i === 0) && (this.v = t, this.f &= -17, this.i++);
	} catch (e) {
		this.v = e, this.f |= 16, this.i++;
	}
	return z = e, Pt(this), this.f &= -2, !0;
}, U.prototype.S = function(e) {
	if (this.t === void 0) {
		this.f |= 36;
		for (var t = this.s; t !== void 0; t = t.n) t.S.S(t);
	}
	V.prototype.S.call(this, e);
}, U.prototype.U = function(e) {
	if (this.t !== void 0 && (V.prototype.U.call(this, e), this.t === void 0)) {
		this.f &= -33;
		for (var t = this.s; t !== void 0; t = t.n) t.S.U(t);
	}
}, U.prototype.N = function() {
	if (!(2 & this.f)) {
		this.f |= 6;
		for (var e = this.t; e !== void 0; e = e.x) e.t.N();
	}
}, Object.defineProperty(U.prototype, "value", { get: function() {
	if (1 & this.f) throw Error("Cycle detected");
	var e = jt(this);
	if (this.h(), e !== void 0 && (e.i = this.i), 16 & this.f) throw this.v;
	return this.v;
} });
function Ft(e, t) {
	return new U(e, t);
}
function It(e) {
	var t = e.m;
	if (e.m = void 0, typeof t == "function") {
		B++;
		var n = z;
		z = void 0;
		try {
			t();
		} catch (t) {
			throw e.f &= -2, e.f |= 8, Lt(e), t;
		} finally {
			z = n, xt();
		}
	}
}
function Lt(e) {
	for (var t = e.s; t !== void 0; t = t.n) t.S.U(t);
	e.x = void 0, e.s = void 0, It(e);
}
function Rt(e) {
	if (z !== this) throw Error("Out-of-order effect");
	Pt(this), z = e, this.f &= -2, 8 & this.f && Lt(this), xt();
}
function W(e, t) {
	this.x = e, this.m = void 0, this.s = void 0, this.u = void 0, this.f = 32, this.name = t?.name, wt && wt.push(this);
}
W.prototype.c = function() {
	var e = this.S();
	try {
		if (8 & this.f || this.x === void 0) return;
		var t = this.x();
		typeof t == "function" && (this.m = t);
	} finally {
		e();
	}
}, W.prototype.S = function() {
	if (1 & this.f) throw Error("Cycle detected");
	this.f |= 1, this.f &= -9, It(this), Nt(this), B++;
	var e = z;
	return z = this, Rt.bind(this, e);
}, W.prototype.N = function() {
	2 & this.f || (this.f |= 2, this.u = Tt, Tt = this);
}, W.prototype.d = function() {
	this.f |= 8, 1 & this.f || Lt(this);
}, W.prototype.dispose = function() {
	this.d();
};
function G(e, t) {
	var n = new W(e, t);
	try {
		n.c();
	} catch (e) {
		throw n.d(), e;
	}
	var r = n.d.bind(n);
	return r[Symbol.dispose] = r, r;
}
//#endregion
//#region ../../node_modules/.pnpm/@a2ui+web_core@0.9.2/node_modules/@a2ui/web_core/src/v0_9/state/data-model.js
function zt(e) {
	return /^\d+$/.test(e);
}
var Bt = class {
	constructor(e = {}) {
		this.data = {}, this.signals = /* @__PURE__ */ new Map(), this.subscriptions = /* @__PURE__ */ new Set(), this.data = e;
	}
	getSignal(e) {
		let t = this.normalizePath(e);
		return this.signals.has(t) || this.signals.set(t, H(this.get(t))), this.signals.get(t);
	}
	set(e, t) {
		if (e == null) throw new F("Path cannot be null or undefined.");
		if (e === "/" || e === "") return this.data = t, this.notifyAllSignals(), this;
		let n = this.parsePath(e), r = n.pop();
		this.data ||= {};
		let i = this.data;
		for (let t = 0; t < n.length; t++) {
			let a = n[t];
			if (Array.isArray(i) && !zt(a)) throw new F(`Cannot use non-numeric segment '${a}' on an array in path '${e}'.`, e);
			if (i[a] !== void 0 && i[a] !== null && typeof i[a] != "object") throw new F(`Cannot set path '${e}': segment '${a}' is a primitive value.`, e);
			if (i[a] === void 0 || i[a] === null) {
				let e = t < n.length - 1 ? n[t + 1] : r;
				i[a] = zt(e) ? [] : {};
			}
			i = i[a];
		}
		if (Array.isArray(i) && !zt(r)) throw new F(`Cannot use non-numeric segment '${r}' on an array in path '${e}'.`, e);
		return t === void 0 ? Array.isArray(i) ? i[parseInt(r, 10)] = void 0 : delete i[r] : i[r] = t, this.notifySignals(e), this;
	}
	get(e) {
		if (e == null) throw new F("Path cannot be null or undefined.");
		if (e === "/" || e === "") return this.data;
		let t = this.parsePath(e), n = this.data;
		for (let e of t) {
			if (n == null) return;
			n = n[e];
		}
		return n;
	}
	subscribe(e, t) {
		let n = this.getSignal(e), r = !0, i = n.peek(), a = G(() => {
			let e = n.value;
			i = e, r || t(e);
		});
		return r = !1, this.subscriptions.add(a), {
			get value() {
				return i;
			},
			unsubscribe: () => {
				a(), this.subscriptions.delete(a);
			}
		};
	}
	dispose() {
		for (let e of this.subscriptions) e();
		this.subscriptions.clear(), this.signals.clear();
	}
	normalizePath(e) {
		return e.length > 1 && e.endsWith("/") ? e.slice(0, -1) : e || "/";
	}
	parsePath(e) {
		return e.split("/").filter((e) => e.length > 0);
	}
	notifySignals(e) {
		let t = this.normalizePath(e);
		St(() => {
			this.updateSignal(t);
			let e = t;
			for (; e !== "/" && e !== "";) e = e.substring(0, e.lastIndexOf("/")) || "/", this.updateSignal(e);
			for (let e of this.signals.keys()) this.isDescendant(e, t) && this.updateSignal(e);
		});
	}
	updateSignal(e) {
		let t = this.signals.get(e);
		if (t) {
			let n = this.get(e);
			Array.isArray(n) ? t.value = [...n] : typeof n == "object" && n ? t.value = { ...n } : t.value = n;
		}
	}
	notifyAllSignals() {
		St(() => {
			for (let e of this.signals.keys()) this.updateSignal(e);
		});
	}
	isDescendant(e, t) {
		return t === "/" || t === "" ? e !== "/" : e.startsWith(t + "/");
	}
}, Vt = class {
	constructor() {
		this.components = /* @__PURE__ */ new Map(), this._onCreated = new R(), this._onDeleted = new R(), this.onCreated = this._onCreated, this.onDeleted = this._onDeleted;
	}
	get(e) {
		return this.components.get(e);
	}
	get entries() {
		return this.components.entries();
	}
	addComponent(e) {
		if (this.components.has(e.id)) throw new L(`Component with id '${e.id}' already exists.`);
		this.components.set(e.id, e), this._onCreated.emit(e);
	}
	removeComponent(e) {
		let t = this.components.get(e);
		t && (this.components.delete(e), t.dispose(), this._onDeleted.emit(e));
	}
	dispose() {
		for (let e of this.components.values()) e.dispose();
		this.components.clear(), this._onCreated.dispose(), this._onDeleted.dispose();
	}
}, Ht = M({
	name: k().describe("The name of the action, taken from the component's action.event.name property."),
	surfaceId: k().describe("The id of the surface where the event originated."),
	sourceComponentId: k().describe("The id of the component that triggered the event."),
	timestamp: k().datetime().describe("An ISO 8601 timestamp of when the event occurred."),
	context: dt(A()).describe("A JSON object containing the key-value pairs from the component's action.event.context, after resolving all data bindings.")
}).strict(), Ut = M({
	code: P("VALIDATION_FAILED"),
	surfaceId: k().describe("The id of the surface where the error occurred."),
	path: k().describe("The JSON pointer to the field that failed validation (e.g. '/components/0/text')."),
	message: k().describe("A short one or two sentence description of why validation failed.")
}).strict(), Wt = M({
	code: k().refine((e) => e !== "VALIDATION_FAILED"),
	message: k().describe("A short one or two sentence description of why the error occurred."),
	surfaceId: k().describe("The id of the surface where the error occurred.")
}).passthrough(), Gt = N([Ut, Wt]), Kt = M({ version: P("v0.9") }).and(N([M({ action: Ht }), M({ error: Gt })])), qt = M({
	version: P("v0.9"),
	surfaces: dt(M({}).passthrough()).describe("A map of surface IDs to their current data models.")
}).strict(), Jt = j(Kt).describe("A list of client messages."), Yt = M({ messages: Jt }).strict().describe("An object wrapping a list of client messages."), Xt = class {
	constructor(e, t, n = {}, r = !1) {
		this.id = e, this.catalog = t, this.theme = n, this.sendDataModel = r, this._onAction = new R(), this._onError = new R(), this.onAction = this._onAction, this.onError = this._onError, this.dataModel = new Bt({}), this.componentsModel = new Vt();
	}
	async dispatchAction(e, t) {
		if (e && typeof e == "object" && "event" in e && e.event) {
			let n = {
				name: e.event.name,
				surfaceId: this.id,
				sourceComponentId: t,
				timestamp: (/* @__PURE__ */ new Date()).toISOString(),
				context: e.event.context || {}
			}, r = Ht.safeParse(n);
			r.success ? await this._onAction.emit(r.data) : console.error("A2UI: Invalid action payload dispatched.", r.error.format());
		}
	}
	async dispatchError(e) {
		await this._onError.emit({
			...e,
			surfaceId: this.id
		});
	}
	dispose() {
		this.dataModel.dispose(), this.componentsModel.dispose(), this._onAction.dispose(), this._onError.dispose();
	}
}, Zt = class {
	constructor() {
		this.surfaces = /* @__PURE__ */ new Map(), this.surfaceUnsubscribers = /* @__PURE__ */ new Map(), this._onSurfaceCreated = new R(), this._onSurfaceDeleted = new R(), this._onAction = new R(), this.onSurfaceCreated = this._onSurfaceCreated, this.onSurfaceDeleted = this._onSurfaceDeleted, this.onAction = this._onAction;
	}
	addSurface(e) {
		if (this.surfaces.has(e.id)) {
			console.warn(`Surface ${e.id} already exists. Ignoring.`);
			return;
		}
		this.surfaces.set(e.id, e);
		let t = e.onAction.subscribe((e) => this._onAction.emit(e));
		this.surfaceUnsubscribers.set(e.id, t), this._onSurfaceCreated.emit(e);
	}
	deleteSurface(e) {
		let t = this.surfaces.get(e);
		if (t) {
			let n = this.surfaceUnsubscribers.get(e);
			n && (n.unsubscribe(), this.surfaceUnsubscribers.delete(e)), this.surfaces.delete(e), t.dispose(), this._onSurfaceDeleted.emit(e);
		}
	}
	getSurface(e) {
		return this.surfaces.get(e);
	}
	get surfacesMap() {
		return this.surfaces;
	}
	dispose() {
		for (let e of Array.from(this.surfaces.keys())) this.deleteSurface(e);
		this._onSurfaceCreated.dispose(), this._onSurfaceDeleted.dispose(), this._onAction.dispose();
	}
}, Qt = class {
	constructor(e, t, n) {
		this.id = e, this.type = t, this._onUpdated = new R(), this.onUpdated = this._onUpdated, this._properties = n;
	}
	get properties() {
		return this._properties;
	}
	set properties(e) {
		this._properties = e, this._onUpdated.emit(this);
	}
	dispose() {
		this._onUpdated.dispose();
	}
	get componentTree() {
		return {
			id: this.id,
			type: this.type,
			...this._properties
		};
	}
}, $t = Symbol("Let zodToJsonSchema decide on which parser to use"), en = {
	name: void 0,
	$refStrategy: "root",
	basePath: ["#"],
	effectStrategy: "input",
	pipeStrategy: "all",
	dateStrategy: "format:date-time",
	mapStrategy: "entries",
	removeAdditionalStrategy: "passthrough",
	allowedAdditionalProperties: !0,
	rejectedAdditionalProperties: !1,
	definitionPath: "definitions",
	target: "jsonSchema7",
	strictUnions: !1,
	definitions: {},
	errorMessages: !1,
	markdownDescription: !1,
	patternStrategy: "escape",
	applyRegexFlags: !1,
	emailStrategy: "format:email",
	base64Strategy: "contentEncoding:base64",
	nameStrategy: "ref",
	openAiAnyTypeName: "OpenAiAnyType"
}, tn = (e) => typeof e == "string" ? {
	...en,
	name: e
} : {
	...en,
	...e
}, nn = (e) => {
	let t = tn(e), n = t.name === void 0 ? t.basePath : [
		...t.basePath,
		t.definitionPath,
		t.name
	];
	return {
		...t,
		flags: { hasReferencedOpenAiAnyType: !1 },
		currentPath: n,
		propertyPath: void 0,
		seen: new Map(Object.entries(t.definitions).map(([e, n]) => [n._def, {
			def: n._def,
			path: [
				...t.basePath,
				t.definitionPath,
				e
			],
			jsonSchema: void 0
		}]))
	};
};
//#endregion
//#region ../../node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/errorMessages.js
function rn(e, t, n, r) {
	r?.errorMessages && n && (e.errorMessage = {
		...e.errorMessage,
		[t]: n
	});
}
function K(e, t, n, r, i) {
	e[t] = n, rn(e, t, r, i);
}
//#endregion
//#region ../../node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/getRelativePath.js
var an = (e, t) => {
	let n = 0;
	for (; n < e.length && n < t.length && e[n] === t[n]; n++);
	return [(e.length - n).toString(), ...t.slice(n)].join("/");
};
//#endregion
//#region ../../node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/any.js
function q(e) {
	if (e.target !== "openAi") return {};
	let t = [
		...e.basePath,
		e.definitionPath,
		e.openAiAnyTypeName
	];
	return e.flags.hasReferencedOpenAiAnyType = !0, { $ref: e.$refStrategy === "relative" ? an(t, e.currentPath) : t.join("/") };
}
//#endregion
//#region ../../node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/array.js
function on(e, t) {
	let n = { type: "array" };
	return e.type?._def && e.type?._def?.typeName !== O.ZodAny && (n.items = Z(e.type._def, {
		...t,
		currentPath: [...t.currentPath, "items"]
	})), e.minLength && K(n, "minItems", e.minLength.value, e.minLength.message, t), e.maxLength && K(n, "maxItems", e.maxLength.value, e.maxLength.message, t), e.exactLength && (K(n, "minItems", e.exactLength.value, e.exactLength.message, t), K(n, "maxItems", e.exactLength.value, e.exactLength.message, t)), n;
}
//#endregion
//#region ../../node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/bigint.js
function sn(e, t) {
	let n = {
		type: "integer",
		format: "int64"
	};
	if (!e.checks) return n;
	for (let r of e.checks) switch (r.kind) {
		case "min":
			t.target === "jsonSchema7" ? r.inclusive ? K(n, "minimum", r.value, r.message, t) : K(n, "exclusiveMinimum", r.value, r.message, t) : (r.inclusive || (n.exclusiveMinimum = !0), K(n, "minimum", r.value, r.message, t));
			break;
		case "max":
			t.target === "jsonSchema7" ? r.inclusive ? K(n, "maximum", r.value, r.message, t) : K(n, "exclusiveMaximum", r.value, r.message, t) : (r.inclusive || (n.exclusiveMaximum = !0), K(n, "maximum", r.value, r.message, t));
			break;
		case "multipleOf":
			K(n, "multipleOf", r.value, r.message, t);
			break;
	}
	return n;
}
//#endregion
//#region ../../node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/boolean.js
function cn() {
	return { type: "boolean" };
}
//#endregion
//#region ../../node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/branded.js
function ln(e, t) {
	return Z(e.type._def, t);
}
//#endregion
//#region ../../node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/catch.js
var un = (e, t) => Z(e.innerType._def, t);
//#endregion
//#region ../../node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/date.js
function dn(e, t, n) {
	let r = n ?? t.dateStrategy;
	if (Array.isArray(r)) return { anyOf: r.map((n, r) => dn(e, t, n)) };
	switch (r) {
		case "string":
		case "format:date-time": return {
			type: "string",
			format: "date-time"
		};
		case "format:date": return {
			type: "string",
			format: "date"
		};
		case "integer": return fn(e, t);
	}
}
var fn = (e, t) => {
	let n = {
		type: "integer",
		format: "unix-time"
	};
	if (t.target === "openApi3") return n;
	for (let r of e.checks) switch (r.kind) {
		case "min":
			K(n, "minimum", r.value, r.message, t);
			break;
		case "max":
			K(n, "maximum", r.value, r.message, t);
			break;
	}
	return n;
};
//#endregion
//#region ../../node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/default.js
function pn(e, t) {
	return {
		...Z(e.innerType._def, t),
		default: e.defaultValue()
	};
}
//#endregion
//#region ../../node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/effects.js
function mn(e, t) {
	return t.effectStrategy === "input" ? Z(e.schema._def, t) : q(t);
}
//#endregion
//#region ../../node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/enum.js
function hn(e) {
	return {
		type: "string",
		enum: Array.from(e.values)
	};
}
//#endregion
//#region ../../node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/intersection.js
var gn = (e) => "type" in e && e.type === "string" ? !1 : "allOf" in e;
function _n(e, t) {
	let n = [Z(e.left._def, {
		...t,
		currentPath: [
			...t.currentPath,
			"allOf",
			"0"
		]
	}), Z(e.right._def, {
		...t,
		currentPath: [
			...t.currentPath,
			"allOf",
			"1"
		]
	})].filter((e) => !!e), r = t.target === "jsonSchema2019-09" ? { unevaluatedProperties: !1 } : void 0, i = [];
	return n.forEach((e) => {
		if (gn(e)) i.push(...e.allOf), e.unevaluatedProperties === void 0 && (r = void 0);
		else {
			let t = e;
			if ("additionalProperties" in e && e.additionalProperties === !1) {
				let { additionalProperties: n, ...r } = e;
				t = r;
			} else r = void 0;
			i.push(t);
		}
	}), i.length ? {
		allOf: i,
		...r
	} : void 0;
}
//#endregion
//#region ../../node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/literal.js
function vn(e, t) {
	let n = typeof e.value;
	return n !== "bigint" && n !== "number" && n !== "boolean" && n !== "string" ? { type: Array.isArray(e.value) ? "array" : "object" } : t.target === "openApi3" ? {
		type: n === "bigint" ? "integer" : n,
		enum: [e.value]
	} : {
		type: n === "bigint" ? "integer" : n,
		const: e.value
	};
}
//#endregion
//#region ../../node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/string.js
var yn = void 0, J = {
	cuid: /^[cC][^\s-]{8,}$/,
	cuid2: /^[0-9a-z]+$/,
	ulid: /^[0-9A-HJKMNP-TV-Z]{26}$/,
	email: /^(?!\.)(?!.*\.\.)([a-zA-Z0-9_'+\-\.]*)[a-zA-Z0-9_+-]@([a-zA-Z0-9][a-zA-Z0-9\-]*\.)+[a-zA-Z]{2,}$/,
	emoji: () => (yn === void 0 && (yn = RegExp("^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$", "u")), yn),
	uuid: /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
	ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
	ipv4Cidr: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/,
	ipv6: /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/,
	ipv6Cidr: /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,
	base64: /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,
	base64url: /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/,
	nanoid: /^[a-zA-Z0-9_-]{21}$/,
	jwt: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/
};
function bn(e, t) {
	let n = { type: "string" };
	if (e.checks) for (let r of e.checks) switch (r.kind) {
		case "min":
			K(n, "minLength", typeof n.minLength == "number" ? Math.max(n.minLength, r.value) : r.value, r.message, t);
			break;
		case "max":
			K(n, "maxLength", typeof n.maxLength == "number" ? Math.min(n.maxLength, r.value) : r.value, r.message, t);
			break;
		case "email":
			switch (t.emailStrategy) {
				case "format:email":
					Y(n, "email", r.message, t);
					break;
				case "format:idn-email":
					Y(n, "idn-email", r.message, t);
					break;
				case "pattern:zod":
					X(n, J.email, r.message, t);
					break;
			}
			break;
		case "url":
			Y(n, "uri", r.message, t);
			break;
		case "uuid":
			Y(n, "uuid", r.message, t);
			break;
		case "regex":
			X(n, r.regex, r.message, t);
			break;
		case "cuid":
			X(n, J.cuid, r.message, t);
			break;
		case "cuid2":
			X(n, J.cuid2, r.message, t);
			break;
		case "startsWith":
			X(n, RegExp(`^${xn(r.value, t)}`), r.message, t);
			break;
		case "endsWith":
			X(n, RegExp(`${xn(r.value, t)}$`), r.message, t);
			break;
		case "datetime":
			Y(n, "date-time", r.message, t);
			break;
		case "date":
			Y(n, "date", r.message, t);
			break;
		case "time":
			Y(n, "time", r.message, t);
			break;
		case "duration":
			Y(n, "duration", r.message, t);
			break;
		case "length":
			K(n, "minLength", typeof n.minLength == "number" ? Math.max(n.minLength, r.value) : r.value, r.message, t), K(n, "maxLength", typeof n.maxLength == "number" ? Math.min(n.maxLength, r.value) : r.value, r.message, t);
			break;
		case "includes":
			X(n, RegExp(xn(r.value, t)), r.message, t);
			break;
		case "ip":
			r.version !== "v6" && Y(n, "ipv4", r.message, t), r.version !== "v4" && Y(n, "ipv6", r.message, t);
			break;
		case "base64url":
			X(n, J.base64url, r.message, t);
			break;
		case "jwt":
			X(n, J.jwt, r.message, t);
			break;
		case "cidr":
			r.version !== "v6" && X(n, J.ipv4Cidr, r.message, t), r.version !== "v4" && X(n, J.ipv6Cidr, r.message, t);
			break;
		case "emoji":
			X(n, J.emoji(), r.message, t);
			break;
		case "ulid":
			X(n, J.ulid, r.message, t);
			break;
		case "base64":
			switch (t.base64Strategy) {
				case "format:binary":
					Y(n, "binary", r.message, t);
					break;
				case "contentEncoding:base64":
					K(n, "contentEncoding", "base64", r.message, t);
					break;
				case "pattern:zod":
					X(n, J.base64, r.message, t);
					break;
			}
			break;
		case "nanoid": X(n, J.nanoid, r.message, t);
		case "toLowerCase":
		case "toUpperCase":
		case "trim": break;
		default:
	}
	return n;
}
function xn(e, t) {
	return t.patternStrategy === "escape" ? Cn(e) : e;
}
var Sn = /* @__PURE__ */ new Set("ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz0123456789");
function Cn(e) {
	let t = "";
	for (let n = 0; n < e.length; n++) Sn.has(e[n]) || (t += "\\"), t += e[n];
	return t;
}
function Y(e, t, n, r) {
	e.format || e.anyOf?.some((e) => e.format) ? (e.anyOf ||= [], e.format && (e.anyOf.push({
		format: e.format,
		...e.errorMessage && r.errorMessages && { errorMessage: { format: e.errorMessage.format } }
	}), delete e.format, e.errorMessage && (delete e.errorMessage.format, Object.keys(e.errorMessage).length === 0 && delete e.errorMessage)), e.anyOf.push({
		format: t,
		...n && r.errorMessages && { errorMessage: { format: n } }
	})) : K(e, "format", t, n, r);
}
function X(e, t, n, r) {
	e.pattern || e.allOf?.some((e) => e.pattern) ? (e.allOf ||= [], e.pattern && (e.allOf.push({
		pattern: e.pattern,
		...e.errorMessage && r.errorMessages && { errorMessage: { pattern: e.errorMessage.pattern } }
	}), delete e.pattern, e.errorMessage && (delete e.errorMessage.pattern, Object.keys(e.errorMessage).length === 0 && delete e.errorMessage)), e.allOf.push({
		pattern: wn(t, r),
		...n && r.errorMessages && { errorMessage: { pattern: n } }
	})) : K(e, "pattern", wn(t, r), n, r);
}
function wn(e, t) {
	if (!t.applyRegexFlags || !e.flags) return e.source;
	let n = {
		i: e.flags.includes("i"),
		m: e.flags.includes("m"),
		s: e.flags.includes("s")
	}, r = n.i ? e.source.toLowerCase() : e.source, i = "", a = !1, o = !1, s = !1;
	for (let e = 0; e < r.length; e++) {
		if (a) {
			i += r[e], a = !1;
			continue;
		}
		if (n.i) {
			if (o) {
				if (r[e].match(/[a-z]/)) {
					s ? (i += r[e], i += `${r[e - 2]}-${r[e]}`.toUpperCase(), s = !1) : r[e + 1] === "-" && r[e + 2]?.match(/[a-z]/) ? (i += r[e], s = !0) : i += `${r[e]}${r[e].toUpperCase()}`;
					continue;
				}
			} else if (r[e].match(/[a-z]/)) {
				i += `[${r[e]}${r[e].toUpperCase()}]`;
				continue;
			}
		}
		if (n.m) {
			if (r[e] === "^") {
				i += "(^|(?<=[\r\n]))";
				continue;
			} else if (r[e] === "$") {
				i += "($|(?=[\r\n]))";
				continue;
			}
		}
		if (n.s && r[e] === ".") {
			i += o ? `${r[e]}\r\n` : `[${r[e]}\r\n]`;
			continue;
		}
		i += r[e], r[e] === "\\" ? a = !0 : o && r[e] === "]" ? o = !1 : !o && r[e] === "[" && (o = !0);
	}
	try {
		new RegExp(i);
	} catch {
		return console.warn(`Could not convert regex pattern at ${t.currentPath.join("/")} to a flag-independent form! Falling back to the flag-ignorant source`), e.source;
	}
	return i;
}
//#endregion
//#region ../../node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/record.js
function Tn(e, t) {
	if (t.target === "openAi" && console.warn("Warning: OpenAI may not support records in schemas! Try an array of key-value pairs instead."), t.target === "openApi3" && e.keyType?._def.typeName === O.ZodEnum) return {
		type: "object",
		required: e.keyType._def.values,
		properties: e.keyType._def.values.reduce((n, r) => ({
			...n,
			[r]: Z(e.valueType._def, {
				...t,
				currentPath: [
					...t.currentPath,
					"properties",
					r
				]
			}) ?? q(t)
		}), {}),
		additionalProperties: t.rejectedAdditionalProperties
	};
	let n = {
		type: "object",
		additionalProperties: Z(e.valueType._def, {
			...t,
			currentPath: [...t.currentPath, "additionalProperties"]
		}) ?? t.allowedAdditionalProperties
	};
	if (t.target === "openApi3") return n;
	if (e.keyType?._def.typeName === O.ZodString && e.keyType._def.checks?.length) {
		let { type: r, ...i } = bn(e.keyType._def, t);
		return {
			...n,
			propertyNames: i
		};
	} else if (e.keyType?._def.typeName === O.ZodEnum) return {
		...n,
		propertyNames: { enum: e.keyType._def.values }
	};
	else if (e.keyType?._def.typeName === O.ZodBranded && e.keyType._def.type._def.typeName === O.ZodString && e.keyType._def.type._def.checks?.length) {
		let { type: r, ...i } = ln(e.keyType._def, t);
		return {
			...n,
			propertyNames: i
		};
	}
	return n;
}
//#endregion
//#region ../../node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/map.js
function En(e, t) {
	return t.mapStrategy === "record" ? Tn(e, t) : {
		type: "array",
		maxItems: 125,
		items: {
			type: "array",
			items: [Z(e.keyType._def, {
				...t,
				currentPath: [
					...t.currentPath,
					"items",
					"items",
					"0"
				]
			}) || q(t), Z(e.valueType._def, {
				...t,
				currentPath: [
					...t.currentPath,
					"items",
					"items",
					"1"
				]
			}) || q(t)],
			minItems: 2,
			maxItems: 2
		}
	};
}
//#endregion
//#region ../../node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/nativeEnum.js
function Dn(e) {
	let t = e.values, n = Object.keys(e.values).filter((e) => typeof t[t[e]] != "number").map((e) => t[e]), r = Array.from(new Set(n.map((e) => typeof e)));
	return {
		type: r.length === 1 ? r[0] === "string" ? "string" : "number" : ["string", "number"],
		enum: n
	};
}
//#endregion
//#region ../../node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/never.js
function On(e) {
	return e.target === "openAi" ? void 0 : { not: q({
		...e,
		currentPath: [...e.currentPath, "not"]
	}) };
}
//#endregion
//#region ../../node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/null.js
function kn(e) {
	return e.target === "openApi3" ? {
		enum: ["null"],
		nullable: !0
	} : { type: "null" };
}
//#endregion
//#region ../../node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/union.js
var An = {
	ZodString: "string",
	ZodNumber: "number",
	ZodBigInt: "integer",
	ZodBoolean: "boolean",
	ZodNull: "null"
};
function jn(e, t) {
	if (t.target === "openApi3") return Mn(e, t);
	let n = e.options instanceof Map ? Array.from(e.options.values()) : e.options;
	if (n.every((e) => e._def.typeName in An && (!e._def.checks || !e._def.checks.length))) {
		let e = n.reduce((e, t) => {
			let n = An[t._def.typeName];
			return n && !e.includes(n) ? [...e, n] : e;
		}, []);
		return { type: e.length > 1 ? e : e[0] };
	} else if (n.every((e) => e._def.typeName === "ZodLiteral" && !e.description)) {
		let e = n.reduce((e, t) => {
			let n = typeof t._def.value;
			switch (n) {
				case "string":
				case "number":
				case "boolean": return [...e, n];
				case "bigint": return [...e, "integer"];
				case "object": if (t._def.value === null) return [...e, "null"];
				default: return e;
			}
		}, []);
		if (e.length === n.length) {
			let t = e.filter((e, t, n) => n.indexOf(e) === t);
			return {
				type: t.length > 1 ? t : t[0],
				enum: n.reduce((e, t) => e.includes(t._def.value) ? e : [...e, t._def.value], [])
			};
		}
	} else if (n.every((e) => e._def.typeName === "ZodEnum")) return {
		type: "string",
		enum: n.reduce((e, t) => [...e, ...t._def.values.filter((t) => !e.includes(t))], [])
	};
	return Mn(e, t);
}
var Mn = (e, t) => {
	let n = (e.options instanceof Map ? Array.from(e.options.values()) : e.options).map((e, n) => Z(e._def, {
		...t,
		currentPath: [
			...t.currentPath,
			"anyOf",
			`${n}`
		]
	})).filter((e) => !!e && (!t.strictUnions || typeof e == "object" && Object.keys(e).length > 0));
	return n.length ? { anyOf: n } : void 0;
};
//#endregion
//#region ../../node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/nullable.js
function Nn(e, t) {
	if ([
		"ZodString",
		"ZodNumber",
		"ZodBigInt",
		"ZodBoolean",
		"ZodNull"
	].includes(e.innerType._def.typeName) && (!e.innerType._def.checks || !e.innerType._def.checks.length)) return t.target === "openApi3" ? {
		type: An[e.innerType._def.typeName],
		nullable: !0
	} : { type: [An[e.innerType._def.typeName], "null"] };
	if (t.target === "openApi3") {
		let n = Z(e.innerType._def, {
			...t,
			currentPath: [...t.currentPath]
		});
		return n && "$ref" in n ? {
			allOf: [n],
			nullable: !0
		} : n && {
			...n,
			nullable: !0
		};
	}
	let n = Z(e.innerType._def, {
		...t,
		currentPath: [
			...t.currentPath,
			"anyOf",
			"0"
		]
	});
	return n && { anyOf: [n, { type: "null" }] };
}
//#endregion
//#region ../../node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/number.js
function Pn(e, t) {
	let n = { type: "number" };
	if (!e.checks) return n;
	for (let r of e.checks) switch (r.kind) {
		case "int":
			n.type = "integer", rn(n, "type", r.message, t);
			break;
		case "min":
			t.target === "jsonSchema7" ? r.inclusive ? K(n, "minimum", r.value, r.message, t) : K(n, "exclusiveMinimum", r.value, r.message, t) : (r.inclusive || (n.exclusiveMinimum = !0), K(n, "minimum", r.value, r.message, t));
			break;
		case "max":
			t.target === "jsonSchema7" ? r.inclusive ? K(n, "maximum", r.value, r.message, t) : K(n, "exclusiveMaximum", r.value, r.message, t) : (r.inclusive || (n.exclusiveMaximum = !0), K(n, "maximum", r.value, r.message, t));
			break;
		case "multipleOf":
			K(n, "multipleOf", r.value, r.message, t);
			break;
	}
	return n;
}
//#endregion
//#region ../../node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/object.js
function Fn(e, t) {
	let n = t.target === "openAi", r = {
		type: "object",
		properties: {}
	}, i = [], a = e.shape();
	for (let e in a) {
		let o = a[e];
		if (o === void 0 || o._def === void 0) continue;
		let s = Ln(o);
		s && n && (o._def.typeName === "ZodOptional" && (o = o._def.innerType), o.isNullable() || (o = o.nullable()), s = !1);
		let c = Z(o._def, {
			...t,
			currentPath: [
				...t.currentPath,
				"properties",
				e
			],
			propertyPath: [
				...t.currentPath,
				"properties",
				e
			]
		});
		c !== void 0 && (r.properties[e] = c, s || i.push(e));
	}
	i.length && (r.required = i);
	let o = In(e, t);
	return o !== void 0 && (r.additionalProperties = o), r;
}
function In(e, t) {
	if (e.catchall._def.typeName !== "ZodNever") return Z(e.catchall._def, {
		...t,
		currentPath: [...t.currentPath, "additionalProperties"]
	});
	switch (e.unknownKeys) {
		case "passthrough": return t.allowedAdditionalProperties;
		case "strict": return t.rejectedAdditionalProperties;
		case "strip": return t.removeAdditionalStrategy === "strict" ? t.allowedAdditionalProperties : t.rejectedAdditionalProperties;
	}
}
function Ln(e) {
	try {
		return e.isOptional();
	} catch {
		return !0;
	}
}
//#endregion
//#region ../../node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/optional.js
var Rn = (e, t) => {
	if (t.currentPath.toString() === t.propertyPath?.toString()) return Z(e.innerType._def, t);
	let n = Z(e.innerType._def, {
		...t,
		currentPath: [
			...t.currentPath,
			"anyOf",
			"1"
		]
	});
	return n ? { anyOf: [{ not: q(t) }, n] } : q(t);
}, zn = (e, t) => {
	if (t.pipeStrategy === "input") return Z(e.in._def, t);
	if (t.pipeStrategy === "output") return Z(e.out._def, t);
	let n = Z(e.in._def, {
		...t,
		currentPath: [
			...t.currentPath,
			"allOf",
			"0"
		]
	});
	return { allOf: [n, Z(e.out._def, {
		...t,
		currentPath: [
			...t.currentPath,
			"allOf",
			n ? "1" : "0"
		]
	})].filter((e) => e !== void 0) };
};
//#endregion
//#region ../../node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/promise.js
function Bn(e, t) {
	return Z(e.type._def, t);
}
//#endregion
//#region ../../node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/set.js
function Vn(e, t) {
	let n = {
		type: "array",
		uniqueItems: !0,
		items: Z(e.valueType._def, {
			...t,
			currentPath: [...t.currentPath, "items"]
		})
	};
	return e.minSize && K(n, "minItems", e.minSize.value, e.minSize.message, t), e.maxSize && K(n, "maxItems", e.maxSize.value, e.maxSize.message, t), n;
}
//#endregion
//#region ../../node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/tuple.js
function Hn(e, t) {
	return e.rest ? {
		type: "array",
		minItems: e.items.length,
		items: e.items.map((e, n) => Z(e._def, {
			...t,
			currentPath: [
				...t.currentPath,
				"items",
				`${n}`
			]
		})).reduce((e, t) => t === void 0 ? e : [...e, t], []),
		additionalItems: Z(e.rest._def, {
			...t,
			currentPath: [...t.currentPath, "additionalItems"]
		})
	} : {
		type: "array",
		minItems: e.items.length,
		maxItems: e.items.length,
		items: e.items.map((e, n) => Z(e._def, {
			...t,
			currentPath: [
				...t.currentPath,
				"items",
				`${n}`
			]
		})).reduce((e, t) => t === void 0 ? e : [...e, t], [])
	};
}
//#endregion
//#region ../../node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/undefined.js
function Un(e) {
	return { not: q(e) };
}
//#endregion
//#region ../../node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/unknown.js
function Wn(e) {
	return q(e);
}
//#endregion
//#region ../../node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parsers/readonly.js
var Gn = (e, t) => Z(e.innerType._def, t), Kn = (e, t, n) => {
	switch (t) {
		case O.ZodString: return bn(e, n);
		case O.ZodNumber: return Pn(e, n);
		case O.ZodObject: return Fn(e, n);
		case O.ZodBigInt: return sn(e, n);
		case O.ZodBoolean: return cn();
		case O.ZodDate: return dn(e, n);
		case O.ZodUndefined: return Un(n);
		case O.ZodNull: return kn(n);
		case O.ZodArray: return on(e, n);
		case O.ZodUnion:
		case O.ZodDiscriminatedUnion: return jn(e, n);
		case O.ZodIntersection: return _n(e, n);
		case O.ZodTuple: return Hn(e, n);
		case O.ZodRecord: return Tn(e, n);
		case O.ZodLiteral: return vn(e, n);
		case O.ZodEnum: return hn(e);
		case O.ZodNativeEnum: return Dn(e);
		case O.ZodNullable: return Nn(e, n);
		case O.ZodOptional: return Rn(e, n);
		case O.ZodMap: return En(e, n);
		case O.ZodSet: return Vn(e, n);
		case O.ZodLazy: return () => e.getter()._def;
		case O.ZodPromise: return Bn(e, n);
		case O.ZodNaN:
		case O.ZodNever: return On(n);
		case O.ZodEffects: return mn(e, n);
		case O.ZodAny: return q(n);
		case O.ZodUnknown: return Wn(n);
		case O.ZodDefault: return pn(e, n);
		case O.ZodBranded: return ln(e, n);
		case O.ZodReadonly: return Gn(e, n);
		case O.ZodCatch: return un(e, n);
		case O.ZodPipeline: return zn(e, n);
		case O.ZodFunction:
		case O.ZodVoid:
		case O.ZodSymbol: return;
		default: return ((e) => void 0)(t);
	}
};
//#endregion
//#region ../../node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/parseDef.js
function Z(e, t, n = !1) {
	let r = t.seen.get(e);
	if (t.override) {
		let i = t.override?.(e, t, r, n);
		if (i !== $t) return i;
	}
	if (r && !n) {
		let e = qn(r, t);
		if (e !== void 0) return e;
	}
	let i = {
		def: e,
		path: t.currentPath,
		jsonSchema: void 0
	};
	t.seen.set(e, i);
	let a = Kn(e, e.typeName, t), o = typeof a == "function" ? Z(a(), t) : a;
	if (o && Jn(e, t, o), t.postProcess) {
		let n = t.postProcess(o, e, t);
		return i.jsonSchema = o, n;
	}
	return i.jsonSchema = o, o;
}
var qn = (e, t) => {
	switch (t.$refStrategy) {
		case "root": return { $ref: e.path.join("/") };
		case "relative": return { $ref: an(t.currentPath, e.path) };
		case "none":
		case "seen": return e.path.length < t.currentPath.length && e.path.every((e, n) => t.currentPath[n] === e) ? (console.warn(`Recursive reference detected at ${t.currentPath.join("/")}! Defaulting to any`), q(t)) : t.$refStrategy === "seen" ? q(t) : void 0;
	}
}, Jn = (e, t, n) => (e.description && (n.description = e.description, t.markdownDescription && (n.markdownDescription = e.description)), n), Yn = (e, t) => {
	let n = nn(t), r = typeof t == "object" && t.definitions ? Object.entries(t.definitions).reduce((e, [t, r]) => ({
		...e,
		[t]: Z(r._def, {
			...n,
			currentPath: [
				...n.basePath,
				n.definitionPath,
				t
			]
		}, !0) ?? q(n)
	}), {}) : void 0, i = typeof t == "string" ? t : t?.nameStrategy === "title" ? void 0 : t?.name, a = Z(e._def, i === void 0 ? n : {
		...n,
		currentPath: [
			...n.basePath,
			n.definitionPath,
			i
		]
	}, !1) ?? q(n), o = typeof t == "object" && t.name !== void 0 && t.nameStrategy === "title" ? t.name : void 0;
	o !== void 0 && (a.title = o), n.flags.hasReferencedOpenAiAnyType && (r ||= {}, r[n.openAiAnyTypeName] || (r[n.openAiAnyTypeName] = {
		type: [
			"string",
			"number",
			"integer",
			"boolean",
			"array",
			"null"
		],
		items: { $ref: n.$refStrategy === "relative" ? "1" : [
			...n.basePath,
			n.definitionPath,
			n.openAiAnyTypeName
		].join("/") }
	}));
	let s = i === void 0 ? r ? {
		...a,
		[n.definitionPath]: r
	} : a : {
		$ref: [
			...n.$refStrategy === "relative" ? [] : n.basePath,
			n.definitionPath,
			i
		].join("/"),
		[n.definitionPath]: {
			...r,
			[i]: a
		}
	};
	return n.target === "jsonSchema7" ? s.$schema = "http://json-schema.org/draft-07/schema#" : (n.target === "jsonSchema2019-09" || n.target === "openAi") && (s.$schema = "https://json-schema.org/draft/2019-09/schema#"), n.target === "openAi" && ("anyOf" in s || "oneOf" in s || "allOf" in s || "type" in s && Array.isArray(s.type)) && console.warn("Warning: OpenAI may not support schemas with unions as roots! Try wrapping it in an object property."), s;
}, Xn = class {
	constructor(e, t) {
		this.catalogs = e, this.actionHandler = t, this.model = new Zt(), this.actionHandler && this.model.onAction.subscribe(this.actionHandler);
	}
	getClientCapabilities(e) {
		let t = { "v0.9": { supportedCatalogIds: this.catalogs.map((e) => e.id) } };
		return e?.includeInlineCatalogs && (t["v0.9"].inlineCatalogs = this.catalogs.map((e) => this.generateInlineCatalog(e))), t;
	}
	generateInlineCatalog(e) {
		let t = {};
		for (let [n, r] of e.components.entries()) {
			let e = Yn(r.schema, { target: "jsonSchema2019-09" });
			this.processRefs(e), t[n] = { allOf: [{ $ref: "common_types.json#/$defs/ComponentCommon" }, {
				properties: {
					component: { const: n },
					...e.properties
				},
				required: ["component", ...e.required || []]
			}] };
		}
		let n = [];
		for (let t of e.functions.values()) {
			let e = Yn(t.schema, { target: "jsonSchema2019-09" });
			this.processRefs(e), n.push({
				name: t.name,
				description: t.schema.description,
				returnType: t.returnType,
				parameters: e
			});
		}
		let r;
		if (e.themeSchema) {
			let t = Yn(e.themeSchema, { target: "jsonSchema2019-09" });
			this.processRefs(t), r = t.properties;
		}
		return {
			catalogId: e.id,
			components: t,
			functions: n.length > 0 ? n : void 0,
			theme: r
		};
	}
	processRefs(e) {
		if (!(typeof e != "object" || !e)) {
			if (typeof e.description == "string" && e.description.startsWith("REF:")) {
				let t = e.description.substring(4).split("|"), n = t[0], r = t[1] || "";
				for (let t of Object.keys(e)) delete e[t];
				e.$ref = n, r && (e.description = r);
				return;
			}
			if (Array.isArray(e)) for (let t of e) this.processRefs(t);
			else for (let t of Object.keys(e)) this.processRefs(e[t]);
		}
	}
	getClientDataModel() {
		let e = {};
		for (let t of this.model.surfacesMap.values()) t.sendDataModel && (e[t.id] = t.dataModel.get("/"));
		if (Object.keys(e).length !== 0) return {
			version: "v0.9",
			surfaces: e
		};
	}
	onSurfaceCreated(e) {
		return this.model.onSurfaceCreated.subscribe(e);
	}
	onSurfaceDeleted(e) {
		return this.model.onSurfaceDeleted.subscribe(e);
	}
	processMessages(e) {
		let t = Array.isArray(e) ? e : e.messages;
		for (let e of t) this.processMessage(e);
	}
	processMessage(e) {
		let t = [
			"createSurface",
			"updateComponents",
			"updateDataModel",
			"deleteSurface"
		].filter((t) => t in e);
		if (t.length > 1) throw new gt(`Message contains multiple update types: ${t.join(", ")}.`);
		if ("createSurface" in e) {
			this.processCreateSurfaceMessage(e);
			return;
		}
		if ("deleteSurface" in e) {
			this.processDeleteSurfaceMessage(e);
			return;
		}
		if ("updateComponents" in e) {
			this.processUpdateComponentsMessage(e);
			return;
		}
		if ("updateDataModel" in e) {
			this.processUpdateDataModelMessage(e);
			return;
		}
	}
	processCreateSurfaceMessage(e) {
		let { surfaceId: t, catalogId: n, theme: r, sendDataModel: i } = e.createSurface, a = this.catalogs.find((e) => e.id === n);
		if (!a) throw new L(`Catalog not found: ${n}`);
		if (this.model.getSurface(t)) throw new L(`Surface ${t} already exists.`);
		let o = new Xt(t, a, r, i ?? !1);
		this.model.addSurface(o);
	}
	processDeleteSurfaceMessage(e) {
		let t = e.deleteSurface;
		t.surfaceId && this.model.deleteSurface(t.surfaceId);
	}
	processUpdateComponentsMessage(e) {
		let t = e.updateComponents;
		if (!t.surfaceId) return;
		let n = this.model.getSurface(t.surfaceId);
		if (!n) throw new L(`Surface not found for message: ${t.surfaceId}`);
		for (let e of t.components) {
			let { id: t, component: r, ...i } = e;
			if (!t) throw new gt(`Component '${r}' is missing an 'id'.`);
			let a = n.componentsModel.get(t);
			if (a) if (r && r !== a.type) {
				n.componentsModel.removeComponent(t);
				let e = new Qt(t, r, i);
				n.componentsModel.addComponent(e);
			} else a.properties = i;
			else {
				if (!r) throw new gt(`Cannot create component ${t} without a type.`);
				let e = new Qt(t, r, i);
				n.componentsModel.addComponent(e);
			}
		}
	}
	processUpdateDataModelMessage(e) {
		let t = e.updateDataModel;
		if (!t.surfaceId) return;
		let n = this.model.getSurface(t.surfaceId);
		if (!n) throw new L(`Surface not found for message: ${t.surfaceId}`);
		let r = t.path || "/", i = t.value;
		n.dataModel.set(r, i);
	}
	resolvePath(e, t) {
		return e.startsWith("/") ? e : t ? `${t.endsWith("/") ? t : `${t}/`}${e}` : `/${e}`;
	}
}, Zn = class e {
	constructor(e, t) {
		this.surface = e, this.path = t, this.dataModel = e.dataModel, this.functionInvoker = e.catalog.invoker;
	}
	set(e, t) {
		let n = this.resolvePath(e);
		this.dataModel.set(n, t);
	}
	resolveDynamicValue(e) {
		if (typeof e != "object" || !e || Array.isArray(e)) return e;
		if ("path" in e) {
			let t = this.resolvePath(e.path);
			return this.dataModel.get(t);
		}
		if ("call" in e) {
			let t = e, n = {};
			for (let [e, r] of Object.entries(t.args)) n[e] = this.resolveDynamicValue(r);
			let r = new AbortController(), i = this.evaluateFunctionReactive(t.call, n, r.signal);
			return i === void 0 ? void 0 : _t(i) ? i.peek() : i;
		}
		return e;
	}
	subscribeDynamicValue(e, t) {
		let n = this.resolveSignal(e), r = !0, i = n.peek(), a = G(() => {
			let e = n.value;
			i = e, r || t(e);
		});
		return r = !1, {
			get value() {
				return i;
			},
			unsubscribe: () => {
				a(), n.unsubscribe && n.unsubscribe();
			}
		};
	}
	resolveSignal(e) {
		if (typeof e != "object" || !e || Array.isArray(e)) return H(e);
		if ("path" in e) {
			let t = this.resolvePath(e.path);
			return this.dataModel.getSignal(t);
		}
		if ("call" in e) {
			let t = e, n = {};
			for (let [e, r] of Object.entries(t.args)) n[e] = this.resolveSignal(r);
			if (Object.keys(n).length === 0) {
				let e = new AbortController(), n = this.evaluateFunctionReactive(t.call, {}, e.signal), r = n instanceof V ? n : H(n);
				return r.unsubscribe = () => e.abort(), r;
			}
			let r = Object.keys(n), i = H(void 0), a, o, s = Ft(() => {
				let e = {};
				for (let t = 0; t < r.length; t++) e[r[t]] = n[r[t]].value;
				return e;
			}), c = G(() => {
				try {
					let e = s.value;
					a && a.abort(), o &&= (o(), void 0), a = new AbortController();
					let n = this.evaluateFunctionReactive(t.call, e, a.signal);
					_t(n) ? o = G(() => {
						i.value = n.value;
					}) : i.value = n;
				} catch (e) {
					this.dispatchExpressionError(e, t.call), i.value = void 0;
				}
			});
			return i.unsubscribe = () => {
				c(), o && o(), a && a.abort();
				for (let e = 0; e < r.length; e++) {
					let t = n[r[e]];
					t.unsubscribe && t.unsubscribe();
				}
			}, i;
		}
		return H(e);
	}
	resolveAction(e) {
		if ("event" in e) {
			let t = {};
			if (e.event.context) for (let [n, r] of Object.entries(e.event.context)) t[n] = this.resolveDynamicValue(r);
			return { event: {
				...e.event,
				context: t
			} };
		}
		return "functionCall" in e ? this.resolveDynamicValue(e.functionCall) : e;
	}
	evaluateFunctionReactive(e, t, n) {
		try {
			return this.functionInvoker(e, t, this, n);
		} catch (t) {
			this.dispatchExpressionError(t, e);
			return;
		}
	}
	dispatchExpressionError(e, t) {
		if (e?.name === "ZodError" || e instanceof s) {
			let n = new I(`Validation failed for function '${t}': ${e.message}`, t, e.errors ?? e.issues);
			this.surface.dispatchError({
				code: "EXPRESSION_ERROR",
				message: n.message,
				expression: t,
				details: n.details
			});
		} else e instanceof I ? this.surface.dispatchError({
			code: "EXPRESSION_ERROR",
			message: e.message,
			expression: e.expression,
			details: e.details
		}) : this.surface.dispatchError({
			code: "EXPRESSION_ERROR",
			message: e.message ?? `An unexpected error occurred in function ${t}.`,
			expression: t,
			details: { stack: e.stack }
		});
	}
	nested(t) {
		let n = this.resolvePath(t);
		return new e(this.surface, n);
	}
	resolvePath(e) {
		if (e.startsWith("/")) return e;
		if (e === "" || e === ".") return this.path;
		let t = this.path;
		return t.endsWith("/") && t.length > 1 && (t = t.slice(0, -1)), t === "/" && (t = ""), `${t}/${e}`;
	}
}, Qn = class {
	constructor(e, t, n = "/") {
		let r = e.componentsModel.get(t);
		if (!r) throw new L(`Component not found: ${t}`);
		this.componentModel = r, this.surfaceComponents = e.componentsModel, this.theme = e.theme, this.dataContext = new Zn(e, n), this._actionDispatcher = (t) => e.dispatchAction(t, this.componentModel.id);
	}
	dispatchAction(e) {
		return this._actionDispatcher(e);
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@a2ui+web_core@0.9.2/node_modules/@a2ui/web_core/src/v0_9/rendering/generic-binder.js
function $n(e) {
	return er(e);
}
function er(e, t) {
	let n = e;
	for (; n._def.typeName === "ZodOptional" || n._def.typeName === "ZodNullable" || n._def.typeName === "ZodDefault";) n = n._def.innerType;
	if (t === "checks") return { type: "CHECKABLE" };
	if (n._def.typeName === "ZodUnion") {
		let e = n._def.options;
		if (e.some((e) => e._def.typeName === "ZodObject" && e._def.shape().event)) return { type: "ACTION" };
		if (e.some((e) => e._def.typeName === "ZodObject" && e._def.shape().path && !e._def.shape().componentId)) return { type: "DYNAMIC" };
		if (e.some((e) => e._def.typeName === "ZodObject" && e._def.shape().componentId && e._def.shape().path)) return { type: "STRUCTURAL" };
	} else n._def.typeName;
	if (n._def.typeName === "ZodArray") return {
		type: "ARRAY",
		element: er(n._def.type)
	};
	if (n._def.typeName === "ZodObject") {
		let e = {}, t = n._def.shape();
		for (let [n, r] of Object.entries(t)) e[n] = er(r, n);
		return {
			type: "OBJECT",
			shape: e
		};
	}
	return { type: "STATIC" };
}
var tr = class {
	constructor(e, t) {
		this.dataListeners = [], this.propsListeners = [], this.currentProps = {}, this.isConnected = !1, this.context = e, this.behaviorTree = $n(t), this.behaviorTree.type !== "OBJECT" && (this.behaviorTree = {
			type: "OBJECT",
			shape: {}
		}), this.resolveInitialProps();
	}
	resolveInitialProps() {
		let e = this.context.componentModel.properties, t = this.resolveAndBind(e, this.behaviorTree, [], !0);
		this.currentProps = {
			...this.currentProps,
			...t
		};
	}
	connect() {
		if (this.isConnected) return;
		this.isConnected = !0;
		let e = this.context.componentModel.onUpdated.subscribe(() => {
			this.rebuildAllBindings();
		});
		this.compUnsub = () => e.unsubscribe(), this.rebuildAllBindings();
	}
	rebuildAllBindings() {
		this.dataListeners.forEach((e) => e()), this.dataListeners = [];
		let e = this.context.componentModel.properties, t = this.resolveAndBind(e, this.behaviorTree, [], !1);
		this.currentProps = {
			...this.currentProps,
			...t
		}, this.notify();
	}
	resolveAndBind(e, t, n, r) {
		if (e == null) return e;
		switch (t.type) {
			case "DYNAMIC": {
				let t = this.context.dataContext.subscribeDynamicValue(e, (e) => {
					this.updateDeepValue(n, e), this.notify();
				});
				return r ? t.unsubscribe() : this.dataListeners.push(() => t.unsubscribe()), t.value;
			}
			case "ACTION": return () => {
				let t = (e) => {
					if (typeof e != "object" || !e) return e;
					if ("path" in e || "call" in e) return this.context.dataContext.resolveDynamicValue(e);
					if (Array.isArray(e)) return e.map(t);
					let n = {};
					for (let [r, i] of Object.entries(e)) n[r] = t(i);
					return n;
				};
				this.context.dispatchAction(t(e));
			};
			case "STRUCTURAL":
				if (e && typeof e == "object" && e.path && e.componentId) {
					let t = this.context.dataContext.subscribeDynamicValue({ path: e.path }, (t) => {
						let r = Array.isArray(t) ? t : [], i = this.context.dataContext.nested(e.path), a = r.map((t, n) => ({
							id: e.componentId,
							basePath: i.nested(String(n)).path
						}));
						this.updateDeepValue(n, a), this.notify();
					});
					r ? t.unsubscribe() : this.dataListeners.push(() => t.unsubscribe());
					let i = Array.isArray(t.value) ? t.value : [], a = this.context.dataContext.nested(e.path);
					return i.map((t, n) => ({
						id: e.componentId,
						basePath: a.nested(String(n)).path
					}));
				}
				return e;
			case "CHECKABLE": {
				let t = Array.isArray(e) ? e : [], i = t.map(() => ({
					valid: !0,
					message: ""
				})), a = n.slice(0, -1), o = () => {
					let e = i.filter((e) => !e.valid).map((e) => e.message);
					this.updateDeepValue([...a, "isValid"], e.length === 0), this.updateDeepValue([...a, "validationErrors"], e), this.notify();
				};
				t.forEach((e, t) => {
					let n = e.condition || e, a = e.message || "Validation failed";
					i[t].message = a;
					let s = this.context.dataContext.subscribeDynamicValue(n, (e) => {
						i[t].valid = !!e, o();
					});
					r ? s.unsubscribe() : this.dataListeners.push(() => s.unsubscribe()), i[t].valid = !!s.value;
				});
				let s = i.filter((e) => !e.valid).map((e) => e.message);
				return this.updateDeepValue([...a, "isValid"], s.length === 0), this.updateDeepValue([...a, "validationErrors"], s), e;
			}
			case "STATIC": return e;
			case "ARRAY": return Array.isArray(e) ? e.map((e, i) => this.resolveAndBind(e, t.element, [...n, i.toString()], r)) : e;
			case "OBJECT": {
				if (typeof e != "object") return e;
				let i = {};
				for (let [a, o] of Object.entries(e)) {
					let e = t.shape[a] || { type: "STATIC" };
					i[a] = this.resolveAndBind(o, e, [...n, a], r);
				}
				for (let [n, r] of Object.entries(t.shape)) if (r.type === "DYNAMIC") {
					let t = `set${n.charAt(0).toUpperCase() + n.slice(1)}`, r = e[n];
					i[t] = (e) => {
						r && typeof r == "object" && "path" in r && this.context.dataContext.set(r.path, e);
					};
				}
				return i;
			}
		}
	}
	updateDeepValue(e, t) {
		this.currentProps = this.cloneAndUpdate(this.currentProps, e, t);
	}
	cloneAndUpdate(e, t, n) {
		if (t.length === 0) return n;
		let [r, ...i] = t;
		if (Array.isArray(e)) {
			let t = [...e];
			return t[Number(r)] = this.cloneAndUpdate(t[Number(r)], i, n), t;
		} else return {
			...e || {},
			[r]: this.cloneAndUpdate((e || {})[r], i, n)
		};
	}
	dispose() {
		this.isConnected && (this.isConnected = !1, this.dataListeners.forEach((e) => e()), this.dataListeners = [], this.compUnsub &&= (this.compUnsub(), void 0));
	}
	notify() {
		this.propsListeners.forEach((e) => e(this.currentProps));
	}
	subscribe(e) {
		return this.propsListeners.length === 0 && this.connect(), this.propsListeners.push(e), { unsubscribe: () => {
			this.propsListeners = this.propsListeners.filter((t) => t !== e), this.propsListeners.length === 0 && this.dispose();
		} };
	}
	get snapshot() {
		return this.currentProps;
	}
}, Q = M({ path: k().describe("A JSON Pointer path to a value in the data model.") }).describe("REF:common_types.json#/$defs/DataBinding|A JSON Pointer path to a value in the data model."), $ = M({
	call: k().describe("The name of the function to call."),
	args: dt(A()).describe("Arguments passed to the function."),
	returnType: ft([
		"string",
		"number",
		"boolean",
		"array",
		"object",
		"any",
		"void"
	]).default("boolean")
}).describe("REF:common_types.json#/$defs/FunctionCall|Invokes a named function on the client."), nr = N([
	ut(),
	Q,
	$
]).describe("REF:common_types.json#/$defs/DynamicBoolean|A boolean value that can be a literal, a path, or a function call returning a boolean."), rr = N([
	k(),
	Q,
	$
]).describe("REF:common_types.json#/$defs/DynamicString|Represents a string"), ir = N([
	lt(),
	Q,
	$
]).describe("REF:common_types.json#/$defs/DynamicNumber|Represents a value that can be either a literal number, a path to a number in the data model, or a function call returning a number."), ar = N([
	j(k()),
	Q,
	$
]).describe("REF:common_types.json#/$defs/DynamicStringList|Represents a value that can be either a literal array of strings, a path to a string array in the data model, or a function call returning a string array."), or = N([
	k(),
	lt(),
	ut(),
	j(A()),
	Q,
	$
]).describe("REF:common_types.json#/$defs/DynamicValue|A value that can be a literal, a path, or a function call returning any type."), sr = k().describe("REF:common_types.json#/$defs/ComponentId|The unique identifier for a component."), cr = N([j(sr).describe("A static list of child component IDs."), M({
	componentId: sr,
	path: k().describe("The path to the list of component property objects in the data model.")
}).describe("A template for generating a dynamic list of children.")]).describe("REF:common_types.json#/$defs/ChildList"), lr = N([M({ event: M({
	name: k(),
	context: dt(or).optional()
}) }).describe("Triggers a server-side event."), M({ functionCall: $ }).describe("Executes a local client-side function.")]).describe("REF:common_types.json#/$defs/Action"), ur = M({
	condition: nr,
	message: k().describe("The error message to display if the check fails.")
}).describe("REF:common_types.json#/$defs/CheckRule|A check rule consisting of a condition and an error message."), dr = M({ checks: j(ur).optional().describe("A list of checks to perform.") }).describe("REF:common_types.json#/$defs/Checkable|Properties for components that support client-side checks."), fr = M({
	label: rr.optional().describe("REF:common_types.json#/$defs/DynamicString|A short string used by assistive technologies to convey the purpose of an element."),
	description: rr.optional().describe("REF:common_types.json#/$defs/DynamicString|Additional information provided by assistive technologies about an element.")
}).describe("REF:common_types.json#/$defs/AccessibilityAttributes|Attributes to enhance accessibility."), pr = M({
	component: k().describe("The type name of the component."),
	id: sr.optional(),
	weight: lt().optional()
}).passthrough().describe("A generic A2UI component definition."), mr = {
	ComponentId: sr,
	ChildList: cr,
	DataBinding: Q,
	DynamicValue: or,
	DynamicString: rr,
	DynamicNumber: ir,
	DynamicBoolean: nr,
	DynamicStringList: ar,
	FunctionCall: $,
	CheckRule: ur,
	Checkable: dr,
	Action: lr,
	AccessibilityAttributes: fr,
	AnyComponent: pr
}, hr = M({
	version: P("v0.9"),
	createSurface: M({
		surfaceId: k().describe("The unique identifier for the UI surface to be rendered."),
		catalogId: k().describe("A string that uniquely identifies this catalog."),
		theme: A().optional().describe("Theme parameters for the surface."),
		sendDataModel: ut().optional().describe("If true, the client will send the full data model.")
	}).strict()
}).strict(), gr = M({
	version: P("v0.9"),
	updateComponents: M({
		surfaceId: k().describe("The unique identifier for the UI surface to be updated."),
		components: j(pr).min(1).describe("A list containing all UI components for the surface.")
	}).strict()
}).strict(), _r = M({
	version: P("v0.9"),
	updateDataModel: M({
		surfaceId: k().describe("The unique identifier for the UI surface this data model update applies to."),
		path: k().optional().describe("An optional path to a location within the data model."),
		value: A().optional().describe("The data to be updated in the data model.")
	}).strict()
}).strict(), vr = M({
	version: P("v0.9"),
	deleteSurface: M({ surfaceId: k().describe("The unique identifier for the UI surface to be deleted.") }).strict()
}).strict(), yr = N([
	hr,
	gr,
	_r,
	vr
]), br = j(yr).describe("A list of messages."), xr = M({ messages: br }).strict().describe("An object wrapping a list of messages."), Sr = {
	$schema: "https://json-schema.org/draft/2020-12/schema",
	$id: "https://a2ui.org/specification/v0_9/server_to_client.json",
	title: "A2UI Message Schema",
	description: "Describes a JSON payload for an A2UI (Agent to UI) message, which is used to dynamically construct and update user interfaces.",
	type: "object",
	oneOf: [
		{ $ref: "#/$defs/CreateSurfaceMessage" },
		{ $ref: "#/$defs/UpdateComponentsMessage" },
		{ $ref: "#/$defs/UpdateDataModelMessage" },
		{ $ref: "#/$defs/DeleteSurfaceMessage" }
	],
	$defs: {
		CreateSurfaceMessage: {
			type: "object",
			properties: {
				version: { const: "v0.9" },
				createSurface: {
					type: "object",
					description: "Signals the client to create a new surface and begin rendering it. When this message is sent, the client will expect 'updateComponents' and/or 'updateDataModel' messages for the same surfaceId that define the component tree.",
					properties: {
						surfaceId: {
							type: "string",
							description: "The unique identifier for the UI surface to be rendered."
						},
						catalogId: {
							description: "A string that uniquely identifies this catalog. It is recommended to prefix this with an internet domain that you own, to avoid conflicts e.g. mycompany.com:somecatalog'.",
							type: "string"
						},
						theme: {
							$ref: "catalog.json#/$defs/theme",
							description: "Theme parameters for the surface (e.g., {'primaryColor': '#FF0000'}). These must validate against the 'theme' schema defined in the catalog."
						},
						sendDataModel: {
							type: "boolean",
							description: "If true, the client will send the full data model of this surface in the metadata of every A2A message sent to the server that created the surface. Defaults to false."
						}
					},
					required: ["surfaceId", "catalogId"],
					additionalProperties: !1
				}
			},
			required: ["createSurface", "version"],
			additionalProperties: !1
		},
		UpdateComponentsMessage: {
			type: "object",
			properties: {
				version: { const: "v0.9" },
				updateComponents: {
					type: "object",
					description: "Updates a surface with a new set of components. This message can be sent multiple times to update the component tree of an existing surface. One of the components in one of the components lists MUST have an 'id' of 'root' to serve as the root of the component tree. The createSurface message MUST have been previously sent with the 'catalogId' that is in this message.",
					properties: {
						surfaceId: {
							type: "string",
							description: "The unique identifier for the UI surface to be updated."
						},
						components: {
							type: "array",
							description: "A list containing all UI components for the surface.",
							minItems: 1,
							items: { $ref: "catalog.json#/$defs/anyComponent" }
						}
					},
					required: ["surfaceId", "components"],
					additionalProperties: !1
				}
			},
			required: ["updateComponents", "version"],
			additionalProperties: !1
		},
		UpdateDataModelMessage: {
			type: "object",
			properties: {
				version: { const: "v0.9" },
				updateDataModel: {
					type: "object",
					description: "Updates the data model for an existing surface. This message can be sent multiple times to update the data model. The createSurface message MUST have been previously sent with the 'catalogId' that is in this message.",
					properties: {
						surfaceId: {
							type: "string",
							description: "The unique identifier for the UI surface this data model update applies to."
						},
						path: {
							type: "string",
							description: "An optional path to a location within the data model (e.g., '/user/name'). If omitted, or set to '/', refers to the entire data model."
						},
						value: {
							description: "The data to be updated in the data model. If present, the value at 'path' is replaced (or created). If omitted, the key at 'path' is removed.",
							additionalProperties: !0
						}
					},
					required: ["surfaceId"],
					additionalProperties: !1
				}
			},
			required: ["updateDataModel", "version"],
			additionalProperties: !1
		},
		DeleteSurfaceMessage: {
			type: "object",
			properties: {
				version: { const: "v0.9" },
				deleteSurface: {
					type: "object",
					description: "Signals the client to delete the surface identified by 'surfaceId'. The createSurface message MUST have been previously sent with the 'catalogId' that is in this message.",
					properties: { surfaceId: {
						type: "string",
						description: "The unique identifier for the UI surface to be deleted."
					} },
					required: ["surfaceId"],
					additionalProperties: !1
				}
			},
			required: ["deleteSurface", "version"],
			additionalProperties: !1
		}
	}
}, Cr = /* @__PURE__ */ t({
	A2uiClientActionSchema: () => Ht,
	A2uiClientDataModelSchema: () => qt,
	A2uiClientErrorSchema: () => Gt,
	A2uiClientMessageListSchema: () => Jt,
	A2uiClientMessageListWrapperSchema: () => Yt,
	A2uiClientMessageSchema: () => Kt,
	A2uiDataError: () => F,
	A2uiError: () => ht,
	A2uiExpressionError: () => I,
	A2uiGenericErrorSchema: () => Wt,
	A2uiMessageListSchema: () => br,
	A2uiMessageListWrapperSchema: () => xr,
	A2uiMessageSchema: () => yr,
	A2uiStateError: () => L,
	A2uiValidationError: () => gt,
	A2uiValidationErrorSchema: () => Ut,
	AccessibilityAttributesSchema: () => fr,
	ActionSchema: () => lr,
	AnyComponentSchema: () => pr,
	Catalog: () => yt,
	CheckRuleSchema: () => ur,
	CheckableSchema: () => dr,
	ChildListSchema: () => cr,
	CommonSchemas: () => mr,
	ComponentContext: () => Qn,
	ComponentIdSchema: () => sr,
	ComponentModel: () => Qt,
	CreateSurfaceMessageSchema: () => hr,
	DataBindingSchema: () => Q,
	DataContext: () => Zn,
	DataModel: () => Bt,
	DeleteSurfaceMessageSchema: () => vr,
	DynamicBooleanSchema: () => nr,
	DynamicNumberSchema: () => ir,
	DynamicStringListSchema: () => ar,
	DynamicStringSchema: () => rr,
	DynamicValueSchema: () => or,
	EventEmitter: () => R,
	FunctionCallSchema: () => $,
	GenericBinder: () => tr,
	MessageProcessor: () => Xn,
	Schemas: () => wr,
	Signal: () => V,
	SurfaceComponentsModel: () => Vt,
	SurfaceGroupModel: () => Zt,
	SurfaceModel: () => Xt,
	UpdateComponentsMessageSchema: () => gr,
	UpdateDataModelMessageSchema: () => _r,
	computed: () => Ft,
	createFunctionImplementation: () => vt,
	effect: () => G,
	isSignal: () => _t,
	scrapeSchemaBehavior: () => $n,
	signal: () => H
}), wr = { A2uiMessageSchemaRaw: Sr };
//#endregion
export { lt as C, N as D, k as E, ft as S, pt as T, I as _, cr as a, ut as b, ir as c, tr as d, Qn as f, _t as g, vt as h, dr as i, ar as l, yt as m, fr as n, sr as o, Ft as p, lr as r, nr as s, Cr as t, rr as u, A as v, M as w, mt as x, j as y };
