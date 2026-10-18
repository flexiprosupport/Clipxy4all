import { EnhancementShell, CanvasControl, CaptionPosition, NativeControls, NativePreview, NativeLayer, ProcessingPanel, ReframeBackground } from './enhancements.jsx';
(function () {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  for (const s of document.querySelectorAll('link[rel="modulepreload"]')) r(s);
  new MutationObserver((s) => {
    for (const i of s)
      if (i.type === "childList")
        for (const a of i.addedNodes)
          a.tagName === "LINK" && a.rel === "modulepreload" && r(a);
  }).observe(document, { childList: !0, subtree: !0 });
  function n(s) {
    const i = {};
    return (
      s.integrity && (i.integrity = s.integrity),
      s.referrerPolicy && (i.referrerPolicy = s.referrerPolicy),
      s.crossOrigin === "use-credentials"
        ? (i.credentials = "include")
        : s.crossOrigin === "anonymous"
          ? (i.credentials = "omit")
          : (i.credentials = "same-origin"),
      i
    );
  }
  function r(s) {
    if (s.ep) return;
    s.ep = !0;
    const i = n(s);
    fetch(s.href, i);
  }
})();
var xc = { exports: {} },
  Vs = {},
  yc = { exports: {} },
  q = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var bl = Symbol.for("react.element"),
  Xf = Symbol.for("react.portal"),
  Jf = Symbol.for("react.fragment"),
  qf = Symbol.for("react.strict_mode"),
  Zf = Symbol.for("react.profiler"),
  ep = Symbol.for("react.provider"),
  tp = Symbol.for("react.context"),
  np = Symbol.for("react.forward_ref"),
  rp = Symbol.for("react.suspense"),
  lp = Symbol.for("react.memo"),
  sp = Symbol.for("react.lazy"),
  Qo = Symbol.iterator;
function ip(e) {
  return e === null || typeof e != "object"
    ? null
    : ((e = (Qo && e[Qo]) || e["@@iterator"]),
      typeof e == "function" ? e : null);
}
var jc = {
    isMounted: function () {
      return !1;
    },
    enqueueForceUpdate: function () {},
    enqueueReplaceState: function () {},
    enqueueSetState: function () {},
  },
  wc = Object.assign,
  Nc = {};
function Mr(e, t, n) {
  ((this.props = e),
    (this.context = t),
    (this.refs = Nc),
    (this.updater = n || jc));
}
Mr.prototype.isReactComponent = {};
Mr.prototype.setState = function (e, t) {
  if (typeof e != "object" && typeof e != "function" && e != null)
    throw Error(
      "setState(...): takes an object of state variables to update or a function which returns an object of state variables.",
    );
  this.updater.enqueueSetState(this, e, t, "setState");
};
Mr.prototype.forceUpdate = function (e) {
  this.updater.enqueueForceUpdate(this, e, "forceUpdate");
};
function kc() {}
kc.prototype = Mr.prototype;
function Aa(e, t, n) {
  ((this.props = e),
    (this.context = t),
    (this.refs = Nc),
    (this.updater = n || jc));
}
var Ua = (Aa.prototype = new kc());
Ua.constructor = Aa;
wc(Ua, Mr.prototype);
Ua.isPureReactComponent = !0;
var Go = Array.isArray,
  Sc = Object.prototype.hasOwnProperty,
  Ba = { current: null },
  Cc = { key: !0, ref: !0, __self: !0, __source: !0 };
function _c(e, t, n) {
  var r,
    s = {},
    i = null,
    a = null;
  if (t != null)
    for (r in (t.ref !== void 0 && (a = t.ref),
    t.key !== void 0 && (i = "" + t.key),
    t))
      Sc.call(t, r) && !Cc.hasOwnProperty(r) && (s[r] = t[r]);
  var u = arguments.length - 2;
  if (u === 1) s.children = n;
  else if (1 < u) {
    for (var o = Array(u), d = 0; d < u; d++) o[d] = arguments[d + 2];
    s.children = o;
  }
  if (e && e.defaultProps)
    for (r in ((u = e.defaultProps), u)) s[r] === void 0 && (s[r] = u[r]);
  return {
    $$typeof: bl,
    type: e,
    key: i,
    ref: a,
    props: s,
    _owner: Ba.current,
  };
}
function ap(e, t) {
  return {
    $$typeof: bl,
    type: e.type,
    key: t,
    ref: e.ref,
    props: e.props,
    _owner: e._owner,
  };
}
function Wa(e) {
  return typeof e == "object" && e !== null && e.$$typeof === bl;
}
function op(e) {
  var t = { "=": "=0", ":": "=2" };
  return (
    "$" +
    e.replace(/[=:]/g, function (n) {
      return t[n];
    })
  );
}
var Xo = /\/+/g;
function vi(e, t) {
  return typeof e == "object" && e !== null && e.key != null
    ? op("" + e.key)
    : t.toString(36);
}
function os(e, t, n, r, s) {
  var i = typeof e;
  (i === "undefined" || i === "boolean") && (e = null);
  var a = !1;
  if (e === null) a = !0;
  else
    switch (i) {
      case "string":
      case "number":
        a = !0;
        break;
      case "object":
        switch (e.$$typeof) {
          case bl:
          case Xf:
            a = !0;
        }
    }
  if (a)
    return (
      (a = e),
      (s = s(a)),
      (e = r === "" ? "." + vi(a, 0) : r),
      Go(s)
        ? ((n = ""),
          e != null && (n = e.replace(Xo, "$&/") + "/"),
          os(s, t, n, "", function (d) {
            return d;
          }))
        : s != null &&
          (Wa(s) &&
            (s = ap(
              s,
              n +
                (!s.key || (a && a.key === s.key)
                  ? ""
                  : ("" + s.key).replace(Xo, "$&/") + "/") +
                e,
            )),
          t.push(s)),
      1
    );
  if (((a = 0), (r = r === "" ? "." : r + ":"), Go(e)))
    for (var u = 0; u < e.length; u++) {
      i = e[u];
      var o = r + vi(i, u);
      a += os(i, t, n, o, s);
    }
  else if (((o = ip(e)), typeof o == "function"))
    for (e = o.call(e), u = 0; !(i = e.next()).done;)
      ((i = i.value), (o = r + vi(i, u++)), (a += os(i, t, n, o, s)));
  else if (i === "object")
    throw (
      (t = String(e)),
      Error(
        "Objects are not valid as a React child (found: " +
          (t === "[object Object]"
            ? "object with keys {" + Object.keys(e).join(", ") + "}"
            : t) +
          "). If you meant to render a collection of children, use an array instead.",
      )
    );
  return a;
}
function Wl(e, t, n) {
  if (e == null) return e;
  var r = [],
    s = 0;
  return (
    os(e, r, "", "", function (i) {
      return t.call(n, i, s++);
    }),
    r
  );
}
function up(e) {
  if (e._status === -1) {
    var t = e._result;
    ((t = t()),
      t.then(
        function (n) {
          (e._status === 0 || e._status === -1) &&
            ((e._status = 1), (e._result = n));
        },
        function (n) {
          (e._status === 0 || e._status === -1) &&
            ((e._status = 2), (e._result = n));
        },
      ),
      e._status === -1 && ((e._status = 0), (e._result = t)));
  }
  if (e._status === 1) return e._result.default;
  throw e._result;
}
var Ge = { current: null },
  us = { transition: null },
  cp = {
    ReactCurrentDispatcher: Ge,
    ReactCurrentBatchConfig: us,
    ReactCurrentOwner: Ba,
  };
function bc() {
  throw Error("act(...) is not supported in production builds of React.");
}
q.Children = {
  map: Wl,
  forEach: function (e, t, n) {
    Wl(
      e,
      function () {
        t.apply(this, arguments);
      },
      n,
    );
  },
  count: function (e) {
    var t = 0;
    return (
      Wl(e, function () {
        t++;
      }),
      t
    );
  },
  toArray: function (e) {
    return (
      Wl(e, function (t) {
        return t;
      }) || []
    );
  },
  only: function (e) {
    if (!Wa(e))
      throw Error(
        "React.Children.only expected to receive a single React element child.",
      );
    return e;
  },
};
q.Component = Mr;
q.Fragment = Jf;
q.Profiler = Zf;
q.PureComponent = Aa;
q.StrictMode = qf;
q.Suspense = rp;
q.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = cp;
q.act = bc;
q.cloneElement = function (e, t, n) {
  if (e == null)
    throw Error(
      "React.cloneElement(...): The argument must be a React element, but you passed " +
        e +
        ".",
    );
  var r = wc({}, e.props),
    s = e.key,
    i = e.ref,
    a = e._owner;
  if (t != null) {
    if (
      (t.ref !== void 0 && ((i = t.ref), (a = Ba.current)),
      t.key !== void 0 && (s = "" + t.key),
      e.type && e.type.defaultProps)
    )
      var u = e.type.defaultProps;
    for (o in t)
      Sc.call(t, o) &&
        !Cc.hasOwnProperty(o) &&
        (r[o] = t[o] === void 0 && u !== void 0 ? u[o] : t[o]);
  }
  var o = arguments.length - 2;
  if (o === 1) r.children = n;
  else if (1 < o) {
    u = Array(o);
    for (var d = 0; d < o; d++) u[d] = arguments[d + 2];
    r.children = u;
  }
  return { $$typeof: bl, type: e.type, key: s, ref: i, props: r, _owner: a };
};
q.createContext = function (e) {
  return (
    (e = {
      $$typeof: tp,
      _currentValue: e,
      _currentValue2: e,
      _threadCount: 0,
      Provider: null,
      Consumer: null,
      _defaultValue: null,
      _globalName: null,
    }),
    (e.Provider = { $$typeof: ep, _context: e }),
    (e.Consumer = e)
  );
};
q.createElement = _c;
q.createFactory = function (e) {
  var t = _c.bind(null, e);
  return ((t.type = e), t);
};
q.createRef = function () {
  return { current: null };
};
q.forwardRef = function (e) {
  return { $$typeof: np, render: e };
};
q.isValidElement = Wa;
q.lazy = function (e) {
  return { $$typeof: sp, _payload: { _status: -1, _result: e }, _init: up };
};
q.memo = function (e, t) {
  return { $$typeof: lp, type: e, compare: t === void 0 ? null : t };
};
q.startTransition = function (e) {
  var t = us.transition;
  us.transition = {};
  try {
    e();
  } finally {
    us.transition = t;
  }
};
q.unstable_act = bc;
q.useCallback = function (e, t) {
  return Ge.current.useCallback(e, t);
};
q.useContext = function (e) {
  return Ge.current.useContext(e);
};
q.useDebugValue = function () {};
q.useDeferredValue = function (e) {
  return Ge.current.useDeferredValue(e);
};
q.useEffect = function (e, t) {
  return Ge.current.useEffect(e, t);
};
q.useId = function () {
  return Ge.current.useId();
};
q.useImperativeHandle = function (e, t, n) {
  return Ge.current.useImperativeHandle(e, t, n);
};
q.useInsertionEffect = function (e, t) {
  return Ge.current.useInsertionEffect(e, t);
};
q.useLayoutEffect = function (e, t) {
  return Ge.current.useLayoutEffect(e, t);
};
q.useMemo = function (e, t) {
  return Ge.current.useMemo(e, t);
};
q.useReducer = function (e, t, n) {
  return Ge.current.useReducer(e, t, n);
};
q.useRef = function (e) {
  return Ge.current.useRef(e);
};
q.useState = function (e) {
  return Ge.current.useState(e);
};
q.useSyncExternalStore = function (e, t, n) {
  return Ge.current.useSyncExternalStore(e, t, n);
};
q.useTransition = function () {
  return Ge.current.useTransition();
};
q.version = "18.3.1";
yc.exports = q;
var x = yc.exports;
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var dp = x,
  fp = Symbol.for("react.element"),
  pp = Symbol.for("react.fragment"),
  hp = Object.prototype.hasOwnProperty,
  mp = dp.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
  gp = { key: !0, ref: !0, __self: !0, __source: !0 };
function Ec(e, t, n) {
  var r,
    s = {},
    i = null,
    a = null;
  (n !== void 0 && (i = "" + n),
    t.key !== void 0 && (i = "" + t.key),
    t.ref !== void 0 && (a = t.ref));
  for (r in t) hp.call(t, r) && !gp.hasOwnProperty(r) && (s[r] = t[r]);
  if (e && e.defaultProps)
    for (r in ((t = e.defaultProps), t)) s[r] === void 0 && (s[r] = t[r]);
  return {
    $$typeof: fp,
    type: e,
    key: i,
    ref: a,
    props: s,
    _owner: mp.current,
  };
}
Vs.Fragment = pp;
Vs.jsx = Ec;
Vs.jsxs = Ec;
xc.exports = Vs;
var l = xc.exports,
  zc = { exports: {} },
  dt = {},
  Fc = { exports: {} },
  Tc = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ (function (e) {
  function t(T, O) {
    var D = T.length;
    T.push(O);
    e: for (; 0 < D;) {
      var X = (D - 1) >>> 1,
        z = T[X];
      if (0 < s(z, O)) ((T[X] = O), (T[D] = z), (D = X));
      else break e;
    }
  }
  function n(T) {
    return T.length === 0 ? null : T[0];
  }
  function r(T) {
    if (T.length === 0) return null;
    var O = T[0],
      D = T.pop();
    if (D !== O) {
      T[0] = D;
      e: for (var X = 0, z = T.length, I = z >>> 1; X < I;) {
        var W = 2 * (X + 1) - 1,
          Z = T[W],
          Q = W + 1,
          me = T[Q];
        if (0 > s(Z, D))
          Q < z && 0 > s(me, Z)
            ? ((T[X] = me), (T[Q] = D), (X = Q))
            : ((T[X] = Z), (T[W] = D), (X = W));
        else if (Q < z && 0 > s(me, D)) ((T[X] = me), (T[Q] = D), (X = Q));
        else break e;
      }
    }
    return O;
  }
  function s(T, O) {
    var D = T.sortIndex - O.sortIndex;
    return D !== 0 ? D : T.id - O.id;
  }
  if (typeof performance == "object" && typeof performance.now == "function") {
    var i = performance;
    e.unstable_now = function () {
      return i.now();
    };
  } else {
    var a = Date,
      u = a.now();
    e.unstable_now = function () {
      return a.now() - u;
    };
  }
  var o = [],
    d = [],
    g = 1,
    m = null,
    p = 3,
    w = !1,
    _ = !1,
    N = !1,
    R = typeof setTimeout == "function" ? setTimeout : null,
    h = typeof clearTimeout == "function" ? clearTimeout : null,
    c = typeof setImmediate < "u" ? setImmediate : null;
  typeof navigator < "u" &&
    navigator.scheduling !== void 0 &&
    navigator.scheduling.isInputPending !== void 0 &&
    navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function f(T) {
    for (var O = n(d); O !== null;) {
      if (O.callback === null) r(d);
      else if (O.startTime <= T)
        (r(d), (O.sortIndex = O.expirationTime), t(o, O));
      else break;
      O = n(d);
    }
  }
  function v(T) {
    if (((N = !1), f(T), !_))
      if (n(o) !== null) ((_ = !0), Y(j));
      else {
        var O = n(d);
        O !== null && te(v, O.startTime - T);
      }
  }
  function j(T, O) {
    ((_ = !1), N && ((N = !1), h(C), (C = -1)), (w = !0));
    var D = p;
    try {
      for (
        f(O), m = n(o);
        m !== null && (!(m.expirationTime > O) || (T && !F()));
      ) {
        var X = m.callback;
        if (typeof X == "function") {
          ((m.callback = null), (p = m.priorityLevel));
          var z = X(m.expirationTime <= O);
          ((O = e.unstable_now()),
            typeof z == "function" ? (m.callback = z) : m === n(o) && r(o),
            f(O));
        } else r(o);
        m = n(o);
      }
      if (m !== null) var I = !0;
      else {
        var W = n(d);
        (W !== null && te(v, W.startTime - O), (I = !1));
      }
      return I;
    } finally {
      ((m = null), (p = D), (w = !1));
    }
  }
  var k = !1,
    E = null,
    C = -1,
    H = 5,
    M = -1;
  function F() {
    return !(e.unstable_now() - M < H);
  }
  function L() {
    if (E !== null) {
      var T = e.unstable_now();
      M = T;
      var O = !0;
      try {
        O = E(!0, T);
      } finally {
        O ? y() : ((k = !1), (E = null));
      }
    } else k = !1;
  }
  var y;
  if (typeof c == "function")
    y = function () {
      c(L);
    };
  else if (typeof MessageChannel < "u") {
    var U = new MessageChannel(),
      oe = U.port2;
    ((U.port1.onmessage = L),
      (y = function () {
        oe.postMessage(null);
      }));
  } else
    y = function () {
      R(L, 0);
    };
  function Y(T) {
    ((E = T), k || ((k = !0), y()));
  }
  function te(T, O) {
    C = R(function () {
      T(e.unstable_now());
    }, O);
  }
  ((e.unstable_IdlePriority = 5),
    (e.unstable_ImmediatePriority = 1),
    (e.unstable_LowPriority = 4),
    (e.unstable_NormalPriority = 3),
    (e.unstable_Profiling = null),
    (e.unstable_UserBlockingPriority = 2),
    (e.unstable_cancelCallback = function (T) {
      T.callback = null;
    }),
    (e.unstable_continueExecution = function () {
      _ || w || ((_ = !0), Y(j));
    }),
    (e.unstable_forceFrameRate = function (T) {
      0 > T || 125 < T
        ? console.error(
            "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported",
          )
        : (H = 0 < T ? Math.floor(1e3 / T) : 5);
    }),
    (e.unstable_getCurrentPriorityLevel = function () {
      return p;
    }),
    (e.unstable_getFirstCallbackNode = function () {
      return n(o);
    }),
    (e.unstable_next = function (T) {
      switch (p) {
        case 1:
        case 2:
        case 3:
          var O = 3;
          break;
        default:
          O = p;
      }
      var D = p;
      p = O;
      try {
        return T();
      } finally {
        p = D;
      }
    }),
    (e.unstable_pauseExecution = function () {}),
    (e.unstable_requestPaint = function () {}),
    (e.unstable_runWithPriority = function (T, O) {
      switch (T) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          T = 3;
      }
      var D = p;
      p = T;
      try {
        return O();
      } finally {
        p = D;
      }
    }),
    (e.unstable_scheduleCallback = function (T, O, D) {
      var X = e.unstable_now();
      switch (
        (typeof D == "object" && D !== null
          ? ((D = D.delay), (D = typeof D == "number" && 0 < D ? X + D : X))
          : (D = X),
        T)
      ) {
        case 1:
          var z = -1;
          break;
        case 2:
          z = 250;
          break;
        case 5:
          z = 1073741823;
          break;
        case 4:
          z = 1e4;
          break;
        default:
          z = 5e3;
      }
      return (
        (z = D + z),
        (T = {
          id: g++,
          callback: O,
          priorityLevel: T,
          startTime: D,
          expirationTime: z,
          sortIndex: -1,
        }),
        D > X
          ? ((T.sortIndex = D),
            t(d, T),
            n(o) === null &&
              T === n(d) &&
              (N ? (h(C), (C = -1)) : (N = !0), te(v, D - X)))
          : ((T.sortIndex = z), t(o, T), _ || w || ((_ = !0), Y(j))),
        T
      );
    }),
    (e.unstable_shouldYield = F),
    (e.unstable_wrapCallback = function (T) {
      var O = p;
      return function () {
        var D = p;
        p = O;
        try {
          return T.apply(this, arguments);
        } finally {
          p = D;
        }
      };
    }));
})(Tc);
Fc.exports = Tc;
var vp = Fc.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var xp = x,
  ct = vp;
function P(e) {
  for (
    var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1;
    n < arguments.length;
    n++
  )
    t += "&args[]=" + encodeURIComponent(arguments[n]);
  return (
    "Minified React error #" +
    e +
    "; visit " +
    t +
    " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
  );
}
var Pc = new Set(),
  cl = {};
function qn(e, t) {
  (_r(e, t), _r(e + "Capture", t));
}
function _r(e, t) {
  for (cl[e] = t, e = 0; e < t.length; e++) Pc.add(t[e]);
}
var tn = !(
    typeof window > "u" ||
    typeof window.document > "u" ||
    typeof window.document.createElement > "u"
  ),
  Qi = Object.prototype.hasOwnProperty,
  yp =
    /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
  Jo = {},
  qo = {};
function jp(e) {
  return Qi.call(qo, e)
    ? !0
    : Qi.call(Jo, e)
      ? !1
      : yp.test(e)
        ? (qo[e] = !0)
        : ((Jo[e] = !0), !1);
}
function wp(e, t, n, r) {
  if (n !== null && n.type === 0) return !1;
  switch (typeof t) {
    case "function":
    case "symbol":
      return !0;
    case "boolean":
      return r
        ? !1
        : n !== null
          ? !n.acceptsBooleans
          : ((e = e.toLowerCase().slice(0, 5)), e !== "data-" && e !== "aria-");
    default:
      return !1;
  }
}
function Np(e, t, n, r) {
  if (t === null || typeof t > "u" || wp(e, t, n, r)) return !0;
  if (r) return !1;
  if (n !== null)
    switch (n.type) {
      case 3:
        return !t;
      case 4:
        return t === !1;
      case 5:
        return isNaN(t);
      case 6:
        return isNaN(t) || 1 > t;
    }
  return !1;
}
function Xe(e, t, n, r, s, i, a) {
  ((this.acceptsBooleans = t === 2 || t === 3 || t === 4),
    (this.attributeName = r),
    (this.attributeNamespace = s),
    (this.mustUseProperty = n),
    (this.propertyName = e),
    (this.type = t),
    (this.sanitizeURL = i),
    (this.removeEmptyString = a));
}
var Ae = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style"
  .split(" ")
  .forEach(function (e) {
    Ae[e] = new Xe(e, 0, !1, e, null, !1, !1);
  });
[
  ["acceptCharset", "accept-charset"],
  ["className", "class"],
  ["htmlFor", "for"],
  ["httpEquiv", "http-equiv"],
].forEach(function (e) {
  var t = e[0];
  Ae[t] = new Xe(t, 1, !1, e[1], null, !1, !1);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function (e) {
  Ae[e] = new Xe(e, 2, !1, e.toLowerCase(), null, !1, !1);
});
[
  "autoReverse",
  "externalResourcesRequired",
  "focusable",
  "preserveAlpha",
].forEach(function (e) {
  Ae[e] = new Xe(e, 2, !1, e, null, !1, !1);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope"
  .split(" ")
  .forEach(function (e) {
    Ae[e] = new Xe(e, 3, !1, e.toLowerCase(), null, !1, !1);
  });
["checked", "multiple", "muted", "selected"].forEach(function (e) {
  Ae[e] = new Xe(e, 3, !0, e, null, !1, !1);
});
["capture", "download"].forEach(function (e) {
  Ae[e] = new Xe(e, 4, !1, e, null, !1, !1);
});
["cols", "rows", "size", "span"].forEach(function (e) {
  Ae[e] = new Xe(e, 6, !1, e, null, !1, !1);
});
["rowSpan", "start"].forEach(function (e) {
  Ae[e] = new Xe(e, 5, !1, e.toLowerCase(), null, !1, !1);
});
var Ha = /[\-:]([a-z])/g;
function Va(e) {
  return e[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height"
  .split(" ")
  .forEach(function (e) {
    var t = e.replace(Ha, Va);
    Ae[t] = new Xe(t, 1, !1, e, null, !1, !1);
  });
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type"
  .split(" ")
  .forEach(function (e) {
    var t = e.replace(Ha, Va);
    Ae[t] = new Xe(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  });
["xml:base", "xml:lang", "xml:space"].forEach(function (e) {
  var t = e.replace(Ha, Va);
  Ae[t] = new Xe(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
});
["tabIndex", "crossOrigin"].forEach(function (e) {
  Ae[e] = new Xe(e, 1, !1, e.toLowerCase(), null, !1, !1);
});
Ae.xlinkHref = new Xe(
  "xlinkHref",
  1,
  !1,
  "xlink:href",
  "http://www.w3.org/1999/xlink",
  !0,
  !1,
);
["src", "href", "action", "formAction"].forEach(function (e) {
  Ae[e] = new Xe(e, 1, !1, e.toLowerCase(), null, !0, !0);
});
function Ka(e, t, n, r) {
  var s = Ae.hasOwnProperty(t) ? Ae[t] : null;
  (s !== null
    ? s.type !== 0
    : r ||
      !(2 < t.length) ||
      (t[0] !== "o" && t[0] !== "O") ||
      (t[1] !== "n" && t[1] !== "N")) &&
    (Np(t, n, s, r) && (n = null),
    r || s === null
      ? jp(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n))
      : s.mustUseProperty
        ? (e[s.propertyName] = n === null ? (s.type === 3 ? !1 : "") : n)
        : ((t = s.attributeName),
          (r = s.attributeNamespace),
          n === null
            ? e.removeAttribute(t)
            : ((s = s.type),
              (n = s === 3 || (s === 4 && n === !0) ? "" : "" + n),
              r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
}
var sn = xp.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  Hl = Symbol.for("react.element"),
  or = Symbol.for("react.portal"),
  ur = Symbol.for("react.fragment"),
  Ya = Symbol.for("react.strict_mode"),
  Gi = Symbol.for("react.profiler"),
  Mc = Symbol.for("react.provider"),
  Rc = Symbol.for("react.context"),
  Qa = Symbol.for("react.forward_ref"),
  Xi = Symbol.for("react.suspense"),
  Ji = Symbol.for("react.suspense_list"),
  Ga = Symbol.for("react.memo"),
  gn = Symbol.for("react.lazy"),
  Lc = Symbol.for("react.offscreen"),
  Zo = Symbol.iterator;
function Ur(e) {
  return e === null || typeof e != "object"
    ? null
    : ((e = (Zo && e[Zo]) || e["@@iterator"]),
      typeof e == "function" ? e : null);
}
var ke = Object.assign,
  xi;
function Jr(e) {
  if (xi === void 0)
    try {
      throw Error();
    } catch (n) {
      var t = n.stack.trim().match(/\n( *(at )?)/);
      xi = (t && t[1]) || "";
    }
  return (
    `
` +
    xi +
    e
  );
}
var yi = !1;
function ji(e, t) {
  if (!e || yi) return "";
  yi = !0;
  var n = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (t)
      if (
        ((t = function () {
          throw Error();
        }),
        Object.defineProperty(t.prototype, "props", {
          set: function () {
            throw Error();
          },
        }),
        typeof Reflect == "object" && Reflect.construct)
      ) {
        try {
          Reflect.construct(t, []);
        } catch (d) {
          var r = d;
        }
        Reflect.construct(e, [], t);
      } else {
        try {
          t.call();
        } catch (d) {
          r = d;
        }
        e.call(t.prototype);
      }
    else {
      try {
        throw Error();
      } catch (d) {
        r = d;
      }
      e();
    }
  } catch (d) {
    if (d && r && typeof d.stack == "string") {
      for (
        var s = d.stack.split(`
`),
          i = r.stack.split(`
`),
          a = s.length - 1,
          u = i.length - 1;
        1 <= a && 0 <= u && s[a] !== i[u];
      )
        u--;
      for (; 1 <= a && 0 <= u; a--, u--)
        if (s[a] !== i[u]) {
          if (a !== 1 || u !== 1)
            do
              if ((a--, u--, 0 > u || s[a] !== i[u])) {
                var o =
                  `
` + s[a].replace(" at new ", " at ");
                return (
                  e.displayName &&
                    o.includes("<anonymous>") &&
                    (o = o.replace("<anonymous>", e.displayName)),
                  o
                );
              }
            while (1 <= a && 0 <= u);
          break;
        }
    }
  } finally {
    ((yi = !1), (Error.prepareStackTrace = n));
  }
  return (e = e ? e.displayName || e.name : "") ? Jr(e) : "";
}
function kp(e) {
  switch (e.tag) {
    case 5:
      return Jr(e.type);
    case 16:
      return Jr("Lazy");
    case 13:
      return Jr("Suspense");
    case 19:
      return Jr("SuspenseList");
    case 0:
    case 2:
    case 15:
      return ((e = ji(e.type, !1)), e);
    case 11:
      return ((e = ji(e.type.render, !1)), e);
    case 1:
      return ((e = ji(e.type, !0)), e);
    default:
      return "";
  }
}
function qi(e) {
  if (e == null) return null;
  if (typeof e == "function") return e.displayName || e.name || null;
  if (typeof e == "string") return e;
  switch (e) {
    case ur:
      return "Fragment";
    case or:
      return "Portal";
    case Gi:
      return "Profiler";
    case Ya:
      return "StrictMode";
    case Xi:
      return "Suspense";
    case Ji:
      return "SuspenseList";
  }
  if (typeof e == "object")
    switch (e.$$typeof) {
      case Rc:
        return (e.displayName || "Context") + ".Consumer";
      case Mc:
        return (e._context.displayName || "Context") + ".Provider";
      case Qa:
        var t = e.render;
        return (
          (e = e.displayName),
          e ||
            ((e = t.displayName || t.name || ""),
            (e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")),
          e
        );
      case Ga:
        return (
          (t = e.displayName || null),
          t !== null ? t : qi(e.type) || "Memo"
        );
      case gn:
        ((t = e._payload), (e = e._init));
        try {
          return qi(e(t));
        } catch {}
    }
  return null;
}
function Sp(e) {
  var t = e.type;
  switch (e.tag) {
    case 24:
      return "Cache";
    case 9:
      return (t.displayName || "Context") + ".Consumer";
    case 10:
      return (t._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return (
        (e = t.render),
        (e = e.displayName || e.name || ""),
        t.displayName || (e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")
      );
    case 7:
      return "Fragment";
    case 5:
      return t;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return qi(t);
    case 8:
      return t === Ya ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if (typeof t == "function") return t.displayName || t.name || null;
      if (typeof t == "string") return t;
  }
  return null;
}
function Fn(e) {
  switch (typeof e) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return e;
    case "object":
      return e;
    default:
      return "";
  }
}
function Ic(e) {
  var t = e.type;
  return (
    (e = e.nodeName) &&
    e.toLowerCase() === "input" &&
    (t === "checkbox" || t === "radio")
  );
}
function Cp(e) {
  var t = Ic(e) ? "checked" : "value",
    n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t),
    r = "" + e[t];
  if (
    !e.hasOwnProperty(t) &&
    typeof n < "u" &&
    typeof n.get == "function" &&
    typeof n.set == "function"
  ) {
    var s = n.get,
      i = n.set;
    return (
      Object.defineProperty(e, t, {
        configurable: !0,
        get: function () {
          return s.call(this);
        },
        set: function (a) {
          ((r = "" + a), i.call(this, a));
        },
      }),
      Object.defineProperty(e, t, { enumerable: n.enumerable }),
      {
        getValue: function () {
          return r;
        },
        setValue: function (a) {
          r = "" + a;
        },
        stopTracking: function () {
          ((e._valueTracker = null), delete e[t]);
        },
      }
    );
  }
}
function Vl(e) {
  e._valueTracker || (e._valueTracker = Cp(e));
}
function Dc(e) {
  if (!e) return !1;
  var t = e._valueTracker;
  if (!t) return !0;
  var n = t.getValue(),
    r = "";
  return (
    e && (r = Ic(e) ? (e.checked ? "true" : "false") : e.value),
    (e = r),
    e !== n ? (t.setValue(e), !0) : !1
  );
}
function js(e) {
  if (((e = e || (typeof document < "u" ? document : void 0)), typeof e > "u"))
    return null;
  try {
    return e.activeElement || e.body;
  } catch {
    return e.body;
  }
}
function Zi(e, t) {
  var n = t.checked;
  return ke({}, t, {
    defaultChecked: void 0,
    defaultValue: void 0,
    value: void 0,
    checked: n ?? e._wrapperState.initialChecked,
  });
}
function eu(e, t) {
  var n = t.defaultValue == null ? "" : t.defaultValue,
    r = t.checked != null ? t.checked : t.defaultChecked;
  ((n = Fn(t.value != null ? t.value : n)),
    (e._wrapperState = {
      initialChecked: r,
      initialValue: n,
      controlled:
        t.type === "checkbox" || t.type === "radio"
          ? t.checked != null
          : t.value != null,
    }));
}
function Oc(e, t) {
  ((t = t.checked), t != null && Ka(e, "checked", t, !1));
}
function ea(e, t) {
  Oc(e, t);
  var n = Fn(t.value),
    r = t.type;
  if (n != null)
    r === "number"
      ? ((n === 0 && e.value === "") || e.value != n) && (e.value = "" + n)
      : e.value !== "" + n && (e.value = "" + n);
  else if (r === "submit" || r === "reset") {
    e.removeAttribute("value");
    return;
  }
  (t.hasOwnProperty("value")
    ? ta(e, t.type, n)
    : t.hasOwnProperty("defaultValue") && ta(e, t.type, Fn(t.defaultValue)),
    t.checked == null &&
      t.defaultChecked != null &&
      (e.defaultChecked = !!t.defaultChecked));
}
function tu(e, t, n) {
  if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
    var r = t.type;
    if (!(
      (r !== "submit" && r !== "reset") ||
      (t.value !== void 0 && t.value !== null)
    ))
      return;
    ((t = "" + e._wrapperState.initialValue),
      n || t === e.value || (e.value = t),
      (e.defaultValue = t));
  }
  ((n = e.name),
    n !== "" && (e.name = ""),
    (e.defaultChecked = !!e._wrapperState.initialChecked),
    n !== "" && (e.name = n));
}
function ta(e, t, n) {
  (t !== "number" || js(e.ownerDocument) !== e) &&
    (n == null
      ? (e.defaultValue = "" + e._wrapperState.initialValue)
      : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
}
var qr = Array.isArray;
function jr(e, t, n, r) {
  if (((e = e.options), t)) {
    t = {};
    for (var s = 0; s < n.length; s++) t["$" + n[s]] = !0;
    for (n = 0; n < e.length; n++)
      ((s = t.hasOwnProperty("$" + e[n].value)),
        e[n].selected !== s && (e[n].selected = s),
        s && r && (e[n].defaultSelected = !0));
  } else {
    for (n = "" + Fn(n), t = null, s = 0; s < e.length; s++) {
      if (e[s].value === n) {
        ((e[s].selected = !0), r && (e[s].defaultSelected = !0));
        return;
      }
      t !== null || e[s].disabled || (t = e[s]);
    }
    t !== null && (t.selected = !0);
  }
}
function na(e, t) {
  if (t.dangerouslySetInnerHTML != null) throw Error(P(91));
  return ke({}, t, {
    value: void 0,
    defaultValue: void 0,
    children: "" + e._wrapperState.initialValue,
  });
}
function nu(e, t) {
  var n = t.value;
  if (n == null) {
    if (((n = t.children), (t = t.defaultValue), n != null)) {
      if (t != null) throw Error(P(92));
      if (qr(n)) {
        if (1 < n.length) throw Error(P(93));
        n = n[0];
      }
      t = n;
    }
    (t == null && (t = ""), (n = t));
  }
  e._wrapperState = { initialValue: Fn(n) };
}
function $c(e, t) {
  var n = Fn(t.value),
    r = Fn(t.defaultValue);
  (n != null &&
    ((n = "" + n),
    n !== e.value && (e.value = n),
    t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)),
    r != null && (e.defaultValue = "" + r));
}
function ru(e) {
  var t = e.textContent;
  t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
}
function Ac(e) {
  switch (e) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function ra(e, t) {
  return e == null || e === "http://www.w3.org/1999/xhtml"
    ? Ac(t)
    : e === "http://www.w3.org/2000/svg" && t === "foreignObject"
      ? "http://www.w3.org/1999/xhtml"
      : e;
}
var Kl,
  Uc = (function (e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction
      ? function (t, n, r, s) {
          MSApp.execUnsafeLocalFunction(function () {
            return e(t, n, r, s);
          });
        }
      : e;
  })(function (e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e)
      e.innerHTML = t;
    else {
      for (
        Kl = Kl || document.createElement("div"),
          Kl.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>",
          t = Kl.firstChild;
        e.firstChild;
      )
        e.removeChild(e.firstChild);
      for (; t.firstChild;) e.appendChild(t.firstChild);
    }
  });
function dl(e, t) {
  if (t) {
    var n = e.firstChild;
    if (n && n === e.lastChild && n.nodeType === 3) {
      n.nodeValue = t;
      return;
    }
  }
  e.textContent = t;
}
var tl = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0,
  },
  _p = ["Webkit", "ms", "Moz", "O"];
Object.keys(tl).forEach(function (e) {
  _p.forEach(function (t) {
    ((t = t + e.charAt(0).toUpperCase() + e.substring(1)), (tl[t] = tl[e]));
  });
});
function Bc(e, t, n) {
  return t == null || typeof t == "boolean" || t === ""
    ? ""
    : n || typeof t != "number" || t === 0 || (tl.hasOwnProperty(e) && tl[e])
      ? ("" + t).trim()
      : t + "px";
}
function Wc(e, t) {
  e = e.style;
  for (var n in t)
    if (t.hasOwnProperty(n)) {
      var r = n.indexOf("--") === 0,
        s = Bc(n, t[n], r);
      (n === "float" && (n = "cssFloat"), r ? e.setProperty(n, s) : (e[n] = s));
    }
}
var bp = ke(
  { menuitem: !0 },
  {
    area: !0,
    base: !0,
    br: !0,
    col: !0,
    embed: !0,
    hr: !0,
    img: !0,
    input: !0,
    keygen: !0,
    link: !0,
    meta: !0,
    param: !0,
    source: !0,
    track: !0,
    wbr: !0,
  },
);
function la(e, t) {
  if (t) {
    if (bp[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
      throw Error(P(137, e));
    if (t.dangerouslySetInnerHTML != null) {
      if (t.children != null) throw Error(P(60));
      if (
        typeof t.dangerouslySetInnerHTML != "object" ||
        !("__html" in t.dangerouslySetInnerHTML)
      )
        throw Error(P(61));
    }
    if (t.style != null && typeof t.style != "object") throw Error(P(62));
  }
}
function sa(e, t) {
  if (e.indexOf("-") === -1) return typeof t.is == "string";
  switch (e) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return !1;
    default:
      return !0;
  }
}
var ia = null;
function Xa(e) {
  return (
    (e = e.target || e.srcElement || window),
    e.correspondingUseElement && (e = e.correspondingUseElement),
    e.nodeType === 3 ? e.parentNode : e
  );
}
var aa = null,
  wr = null,
  Nr = null;
function lu(e) {
  if ((e = Fl(e))) {
    if (typeof aa != "function") throw Error(P(280));
    var t = e.stateNode;
    t && ((t = Xs(t)), aa(e.stateNode, e.type, t));
  }
}
function Hc(e) {
  wr ? (Nr ? Nr.push(e) : (Nr = [e])) : (wr = e);
}
function Vc() {
  if (wr) {
    var e = wr,
      t = Nr;
    if (((Nr = wr = null), lu(e), t)) for (e = 0; e < t.length; e++) lu(t[e]);
  }
}
function Kc(e, t) {
  return e(t);
}
function Yc() {}
var wi = !1;
function Qc(e, t, n) {
  if (wi) return e(t, n);
  wi = !0;
  try {
    return Kc(e, t, n);
  } finally {
    ((wi = !1), (wr !== null || Nr !== null) && (Yc(), Vc()));
  }
}
function fl(e, t) {
  var n = e.stateNode;
  if (n === null) return null;
  var r = Xs(n);
  if (r === null) return null;
  n = r[t];
  e: switch (t) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      ((r = !r.disabled) ||
        ((e = e.type),
        (r = !(
          e === "button" ||
          e === "input" ||
          e === "select" ||
          e === "textarea"
        ))),
        (e = !r));
      break e;
    default:
      e = !1;
  }
  if (e) return null;
  if (n && typeof n != "function") throw Error(P(231, t, typeof n));
  return n;
}
var oa = !1;
if (tn)
  try {
    var Br = {};
    (Object.defineProperty(Br, "passive", {
      get: function () {
        oa = !0;
      },
    }),
      window.addEventListener("test", Br, Br),
      window.removeEventListener("test", Br, Br));
  } catch {
    oa = !1;
  }
function Ep(e, t, n, r, s, i, a, u, o) {
  var d = Array.prototype.slice.call(arguments, 3);
  try {
    t.apply(n, d);
  } catch (g) {
    this.onError(g);
  }
}
var nl = !1,
  ws = null,
  Ns = !1,
  ua = null,
  zp = {
    onError: function (e) {
      ((nl = !0), (ws = e));
    },
  };
function Fp(e, t, n, r, s, i, a, u, o) {
  ((nl = !1), (ws = null), Ep.apply(zp, arguments));
}
function Tp(e, t, n, r, s, i, a, u, o) {
  if ((Fp.apply(this, arguments), nl)) {
    if (nl) {
      var d = ws;
      ((nl = !1), (ws = null));
    } else throw Error(P(198));
    Ns || ((Ns = !0), (ua = d));
  }
}
function Zn(e) {
  var t = e,
    n = e;
  if (e.alternate) for (; t.return;) t = t.return;
  else {
    e = t;
    do ((t = e), t.flags & 4098 && (n = t.return), (e = t.return));
    while (e);
  }
  return t.tag === 3 ? n : null;
}
function Gc(e) {
  if (e.tag === 13) {
    var t = e.memoizedState;
    if (
      (t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)),
      t !== null)
    )
      return t.dehydrated;
  }
  return null;
}
function su(e) {
  if (Zn(e) !== e) throw Error(P(188));
}
function Pp(e) {
  var t = e.alternate;
  if (!t) {
    if (((t = Zn(e)), t === null)) throw Error(P(188));
    return t !== e ? null : e;
  }
  for (var n = e, r = t; ;) {
    var s = n.return;
    if (s === null) break;
    var i = s.alternate;
    if (i === null) {
      if (((r = s.return), r !== null)) {
        n = r;
        continue;
      }
      break;
    }
    if (s.child === i.child) {
      for (i = s.child; i;) {
        if (i === n) return (su(s), e);
        if (i === r) return (su(s), t);
        i = i.sibling;
      }
      throw Error(P(188));
    }
    if (n.return !== r.return) ((n = s), (r = i));
    else {
      for (var a = !1, u = s.child; u;) {
        if (u === n) {
          ((a = !0), (n = s), (r = i));
          break;
        }
        if (u === r) {
          ((a = !0), (r = s), (n = i));
          break;
        }
        u = u.sibling;
      }
      if (!a) {
        for (u = i.child; u;) {
          if (u === n) {
            ((a = !0), (n = i), (r = s));
            break;
          }
          if (u === r) {
            ((a = !0), (r = i), (n = s));
            break;
          }
          u = u.sibling;
        }
        if (!a) throw Error(P(189));
      }
    }
    if (n.alternate !== r) throw Error(P(190));
  }
  if (n.tag !== 3) throw Error(P(188));
  return n.stateNode.current === n ? e : t;
}
function Xc(e) {
  return ((e = Pp(e)), e !== null ? Jc(e) : null);
}
function Jc(e) {
  if (e.tag === 5 || e.tag === 6) return e;
  for (e = e.child; e !== null;) {
    var t = Jc(e);
    if (t !== null) return t;
    e = e.sibling;
  }
  return null;
}
var qc = ct.unstable_scheduleCallback,
  iu = ct.unstable_cancelCallback,
  Mp = ct.unstable_shouldYield,
  Rp = ct.unstable_requestPaint,
  ze = ct.unstable_now,
  Lp = ct.unstable_getCurrentPriorityLevel,
  Ja = ct.unstable_ImmediatePriority,
  Zc = ct.unstable_UserBlockingPriority,
  ks = ct.unstable_NormalPriority,
  Ip = ct.unstable_LowPriority,
  ed = ct.unstable_IdlePriority,
  Ks = null,
  Ht = null;
function Dp(e) {
  if (Ht && typeof Ht.onCommitFiberRoot == "function")
    try {
      Ht.onCommitFiberRoot(Ks, e, void 0, (e.current.flags & 128) === 128);
    } catch {}
}
var Tt = Math.clz32 ? Math.clz32 : Ap,
  Op = Math.log,
  $p = Math.LN2;
function Ap(e) {
  return ((e >>>= 0), e === 0 ? 32 : (31 - ((Op(e) / $p) | 0)) | 0);
}
var Yl = 64,
  Ql = 4194304;
function Zr(e) {
  switch (e & -e) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return e & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return e & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return e;
  }
}
function Ss(e, t) {
  var n = e.pendingLanes;
  if (n === 0) return 0;
  var r = 0,
    s = e.suspendedLanes,
    i = e.pingedLanes,
    a = n & 268435455;
  if (a !== 0) {
    var u = a & ~s;
    u !== 0 ? (r = Zr(u)) : ((i &= a), i !== 0 && (r = Zr(i)));
  } else ((a = n & ~s), a !== 0 ? (r = Zr(a)) : i !== 0 && (r = Zr(i)));
  if (r === 0) return 0;
  if (
    t !== 0 &&
    t !== r &&
    !(t & s) &&
    ((s = r & -r), (i = t & -t), s >= i || (s === 16 && (i & 4194240) !== 0))
  )
    return t;
  if ((r & 4 && (r |= n & 16), (t = e.entangledLanes), t !== 0))
    for (e = e.entanglements, t &= r; 0 < t;)
      ((n = 31 - Tt(t)), (s = 1 << n), (r |= e[n]), (t &= ~s));
  return r;
}
function Up(e, t) {
  switch (e) {
    case 1:
    case 2:
    case 4:
      return t + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return t + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function Bp(e, t) {
  for (
    var n = e.suspendedLanes,
      r = e.pingedLanes,
      s = e.expirationTimes,
      i = e.pendingLanes;
    0 < i;
  ) {
    var a = 31 - Tt(i),
      u = 1 << a,
      o = s[a];
    (o === -1
      ? (!(u & n) || u & r) && (s[a] = Up(u, t))
      : o <= t && (e.expiredLanes |= u),
      (i &= ~u));
  }
}
function ca(e) {
  return (
    (e = e.pendingLanes & -1073741825),
    e !== 0 ? e : e & 1073741824 ? 1073741824 : 0
  );
}
function td() {
  var e = Yl;
  return ((Yl <<= 1), !(Yl & 4194240) && (Yl = 64), e);
}
function Ni(e) {
  for (var t = [], n = 0; 31 > n; n++) t.push(e);
  return t;
}
function El(e, t, n) {
  ((e.pendingLanes |= t),
    t !== 536870912 && ((e.suspendedLanes = 0), (e.pingedLanes = 0)),
    (e = e.eventTimes),
    (t = 31 - Tt(t)),
    (e[t] = n));
}
function Wp(e, t) {
  var n = e.pendingLanes & ~t;
  ((e.pendingLanes = t),
    (e.suspendedLanes = 0),
    (e.pingedLanes = 0),
    (e.expiredLanes &= t),
    (e.mutableReadLanes &= t),
    (e.entangledLanes &= t),
    (t = e.entanglements));
  var r = e.eventTimes;
  for (e = e.expirationTimes; 0 < n;) {
    var s = 31 - Tt(n),
      i = 1 << s;
    ((t[s] = 0), (r[s] = -1), (e[s] = -1), (n &= ~i));
  }
}
function qa(e, t) {
  var n = (e.entangledLanes |= t);
  for (e = e.entanglements; n;) {
    var r = 31 - Tt(n),
      s = 1 << r;
    ((s & t) | (e[r] & t) && (e[r] |= t), (n &= ~s));
  }
}
var ce = 0;
function nd(e) {
  return (
    (e &= -e),
    1 < e ? (4 < e ? (e & 268435455 ? 16 : 536870912) : 4) : 1
  );
}
var rd,
  Za,
  ld,
  sd,
  id,
  da = !1,
  Gl = [],
  Nn = null,
  kn = null,
  Sn = null,
  pl = new Map(),
  hl = new Map(),
  xn = [],
  Hp =
    "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(
      " ",
    );
function au(e, t) {
  switch (e) {
    case "focusin":
    case "focusout":
      Nn = null;
      break;
    case "dragenter":
    case "dragleave":
      kn = null;
      break;
    case "mouseover":
    case "mouseout":
      Sn = null;
      break;
    case "pointerover":
    case "pointerout":
      pl.delete(t.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      hl.delete(t.pointerId);
  }
}
function Wr(e, t, n, r, s, i) {
  return e === null || e.nativeEvent !== i
    ? ((e = {
        blockedOn: t,
        domEventName: n,
        eventSystemFlags: r,
        nativeEvent: i,
        targetContainers: [s],
      }),
      t !== null && ((t = Fl(t)), t !== null && Za(t)),
      e)
    : ((e.eventSystemFlags |= r),
      (t = e.targetContainers),
      s !== null && t.indexOf(s) === -1 && t.push(s),
      e);
}
function Vp(e, t, n, r, s) {
  switch (t) {
    case "focusin":
      return ((Nn = Wr(Nn, e, t, n, r, s)), !0);
    case "dragenter":
      return ((kn = Wr(kn, e, t, n, r, s)), !0);
    case "mouseover":
      return ((Sn = Wr(Sn, e, t, n, r, s)), !0);
    case "pointerover":
      var i = s.pointerId;
      return (pl.set(i, Wr(pl.get(i) || null, e, t, n, r, s)), !0);
    case "gotpointercapture":
      return (
        (i = s.pointerId),
        hl.set(i, Wr(hl.get(i) || null, e, t, n, r, s)),
        !0
      );
  }
  return !1;
}
function ad(e) {
  var t = Bn(e.target);
  if (t !== null) {
    var n = Zn(t);
    if (n !== null) {
      if (((t = n.tag), t === 13)) {
        if (((t = Gc(n)), t !== null)) {
          ((e.blockedOn = t),
            id(e.priority, function () {
              ld(n);
            }));
          return;
        }
      } else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
        e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
        return;
      }
    }
  }
  e.blockedOn = null;
}
function cs(e) {
  if (e.blockedOn !== null) return !1;
  for (var t = e.targetContainers; 0 < t.length;) {
    var n = fa(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
    if (n === null) {
      n = e.nativeEvent;
      var r = new n.constructor(n.type, n);
      ((ia = r), n.target.dispatchEvent(r), (ia = null));
    } else return ((t = Fl(n)), t !== null && Za(t), (e.blockedOn = n), !1);
    t.shift();
  }
  return !0;
}
function ou(e, t, n) {
  cs(e) && n.delete(t);
}
function Kp() {
  ((da = !1),
    Nn !== null && cs(Nn) && (Nn = null),
    kn !== null && cs(kn) && (kn = null),
    Sn !== null && cs(Sn) && (Sn = null),
    pl.forEach(ou),
    hl.forEach(ou));
}
function Hr(e, t) {
  e.blockedOn === t &&
    ((e.blockedOn = null),
    da ||
      ((da = !0),
      ct.unstable_scheduleCallback(ct.unstable_NormalPriority, Kp)));
}
function ml(e) {
  function t(s) {
    return Hr(s, e);
  }
  if (0 < Gl.length) {
    Hr(Gl[0], e);
    for (var n = 1; n < Gl.length; n++) {
      var r = Gl[n];
      r.blockedOn === e && (r.blockedOn = null);
    }
  }
  for (
    Nn !== null && Hr(Nn, e),
      kn !== null && Hr(kn, e),
      Sn !== null && Hr(Sn, e),
      pl.forEach(t),
      hl.forEach(t),
      n = 0;
    n < xn.length;
    n++
  )
    ((r = xn[n]), r.blockedOn === e && (r.blockedOn = null));
  for (; 0 < xn.length && ((n = xn[0]), n.blockedOn === null);)
    (ad(n), n.blockedOn === null && xn.shift());
}
var kr = sn.ReactCurrentBatchConfig,
  Cs = !0;
function Yp(e, t, n, r) {
  var s = ce,
    i = kr.transition;
  kr.transition = null;
  try {
    ((ce = 1), eo(e, t, n, r));
  } finally {
    ((ce = s), (kr.transition = i));
  }
}
function Qp(e, t, n, r) {
  var s = ce,
    i = kr.transition;
  kr.transition = null;
  try {
    ((ce = 4), eo(e, t, n, r));
  } finally {
    ((ce = s), (kr.transition = i));
  }
}
function eo(e, t, n, r) {
  if (Cs) {
    var s = fa(e, t, n, r);
    if (s === null) (Pi(e, t, r, _s, n), au(e, r));
    else if (Vp(s, e, t, n, r)) r.stopPropagation();
    else if ((au(e, r), t & 4 && -1 < Hp.indexOf(e))) {
      for (; s !== null;) {
        var i = Fl(s);
        if (
          (i !== null && rd(i),
          (i = fa(e, t, n, r)),
          i === null && Pi(e, t, r, _s, n),
          i === s)
        )
          break;
        s = i;
      }
      s !== null && r.stopPropagation();
    } else Pi(e, t, r, null, n);
  }
}
var _s = null;
function fa(e, t, n, r) {
  if (((_s = null), (e = Xa(r)), (e = Bn(e)), e !== null))
    if (((t = Zn(e)), t === null)) e = null;
    else if (((n = t.tag), n === 13)) {
      if (((e = Gc(t)), e !== null)) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated)
        return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
  return ((_s = e), null);
}
function od(e) {
  switch (e) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (Lp()) {
        case Ja:
          return 1;
        case Zc:
          return 4;
        case ks:
        case Ip:
          return 16;
        case ed:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var jn = null,
  to = null,
  ds = null;
function ud() {
  if (ds) return ds;
  var e,
    t = to,
    n = t.length,
    r,
    s = "value" in jn ? jn.value : jn.textContent,
    i = s.length;
  for (e = 0; e < n && t[e] === s[e]; e++);
  var a = n - e;
  for (r = 1; r <= a && t[n - r] === s[i - r]; r++);
  return (ds = s.slice(e, 1 < r ? 1 - r : void 0));
}
function fs(e) {
  var t = e.keyCode;
  return (
    "charCode" in e
      ? ((e = e.charCode), e === 0 && t === 13 && (e = 13))
      : (e = t),
    e === 10 && (e = 13),
    32 <= e || e === 13 ? e : 0
  );
}
function Xl() {
  return !0;
}
function uu() {
  return !1;
}
function ft(e) {
  function t(n, r, s, i, a) {
    ((this._reactName = n),
      (this._targetInst = s),
      (this.type = r),
      (this.nativeEvent = i),
      (this.target = a),
      (this.currentTarget = null));
    for (var u in e)
      e.hasOwnProperty(u) && ((n = e[u]), (this[u] = n ? n(i) : i[u]));
    return (
      (this.isDefaultPrevented = (
        i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1
      )
        ? Xl
        : uu),
      (this.isPropagationStopped = uu),
      this
    );
  }
  return (
    ke(t.prototype, {
      preventDefault: function () {
        this.defaultPrevented = !0;
        var n = this.nativeEvent;
        n &&
          (n.preventDefault
            ? n.preventDefault()
            : typeof n.returnValue != "unknown" && (n.returnValue = !1),
          (this.isDefaultPrevented = Xl));
      },
      stopPropagation: function () {
        var n = this.nativeEvent;
        n &&
          (n.stopPropagation
            ? n.stopPropagation()
            : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0),
          (this.isPropagationStopped = Xl));
      },
      persist: function () {},
      isPersistent: Xl,
    }),
    t
  );
}
var Rr = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function (e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0,
  },
  no = ft(Rr),
  zl = ke({}, Rr, { view: 0, detail: 0 }),
  Gp = ft(zl),
  ki,
  Si,
  Vr,
  Ys = ke({}, zl, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: ro,
    button: 0,
    buttons: 0,
    relatedTarget: function (e) {
      return e.relatedTarget === void 0
        ? e.fromElement === e.srcElement
          ? e.toElement
          : e.fromElement
        : e.relatedTarget;
    },
    movementX: function (e) {
      return "movementX" in e
        ? e.movementX
        : (e !== Vr &&
            (Vr && e.type === "mousemove"
              ? ((ki = e.screenX - Vr.screenX), (Si = e.screenY - Vr.screenY))
              : (Si = ki = 0),
            (Vr = e)),
          ki);
    },
    movementY: function (e) {
      return "movementY" in e ? e.movementY : Si;
    },
  }),
  cu = ft(Ys),
  Xp = ke({}, Ys, { dataTransfer: 0 }),
  Jp = ft(Xp),
  qp = ke({}, zl, { relatedTarget: 0 }),
  Ci = ft(qp),
  Zp = ke({}, Rr, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
  eh = ft(Zp),
  th = ke({}, Rr, {
    clipboardData: function (e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    },
  }),
  nh = ft(th),
  rh = ke({}, Rr, { data: 0 }),
  du = ft(rh),
  lh = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified",
  },
  sh = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta",
  },
  ih = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey",
  };
function ah(e) {
  var t = this.nativeEvent;
  return t.getModifierState ? t.getModifierState(e) : (e = ih[e]) ? !!t[e] : !1;
}
function ro() {
  return ah;
}
var oh = ke({}, zl, {
    key: function (e) {
      if (e.key) {
        var t = lh[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress"
        ? ((e = fs(e)), e === 13 ? "Enter" : String.fromCharCode(e))
        : e.type === "keydown" || e.type === "keyup"
          ? sh[e.keyCode] || "Unidentified"
          : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: ro,
    charCode: function (e) {
      return e.type === "keypress" ? fs(e) : 0;
    },
    keyCode: function (e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function (e) {
      return e.type === "keypress"
        ? fs(e)
        : e.type === "keydown" || e.type === "keyup"
          ? e.keyCode
          : 0;
    },
  }),
  uh = ft(oh),
  ch = ke({}, Ys, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0,
  }),
  fu = ft(ch),
  dh = ke({}, zl, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: ro,
  }),
  fh = ft(dh),
  ph = ke({}, Rr, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
  hh = ft(ph),
  mh = ke({}, Ys, {
    deltaX: function (e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function (e) {
      return "deltaY" in e
        ? e.deltaY
        : "wheelDeltaY" in e
          ? -e.wheelDeltaY
          : "wheelDelta" in e
            ? -e.wheelDelta
            : 0;
    },
    deltaZ: 0,
    deltaMode: 0,
  }),
  gh = ft(mh),
  vh = [9, 13, 27, 32],
  lo = tn && "CompositionEvent" in window,
  rl = null;
tn && "documentMode" in document && (rl = document.documentMode);
var xh = tn && "TextEvent" in window && !rl,
  cd = tn && (!lo || (rl && 8 < rl && 11 >= rl)),
  pu = " ",
  hu = !1;
function dd(e, t) {
  switch (e) {
    case "keyup":
      return vh.indexOf(t.keyCode) !== -1;
    case "keydown":
      return t.keyCode !== 229;
    case "keypress":
    case "mousedown":
    case "focusout":
      return !0;
    default:
      return !1;
  }
}
function fd(e) {
  return ((e = e.detail), typeof e == "object" && "data" in e ? e.data : null);
}
var cr = !1;
function yh(e, t) {
  switch (e) {
    case "compositionend":
      return fd(t);
    case "keypress":
      return t.which !== 32 ? null : ((hu = !0), pu);
    case "textInput":
      return ((e = t.data), e === pu && hu ? null : e);
    default:
      return null;
  }
}
function jh(e, t) {
  if (cr)
    return e === "compositionend" || (!lo && dd(e, t))
      ? ((e = ud()), (ds = to = jn = null), (cr = !1), e)
      : null;
  switch (e) {
    case "paste":
      return null;
    case "keypress":
      if (!(t.ctrlKey || t.altKey || t.metaKey) || (t.ctrlKey && t.altKey)) {
        if (t.char && 1 < t.char.length) return t.char;
        if (t.which) return String.fromCharCode(t.which);
      }
      return null;
    case "compositionend":
      return cd && t.locale !== "ko" ? null : t.data;
    default:
      return null;
  }
}
var wh = {
  color: !0,
  date: !0,
  datetime: !0,
  "datetime-local": !0,
  email: !0,
  month: !0,
  number: !0,
  password: !0,
  range: !0,
  search: !0,
  tel: !0,
  text: !0,
  time: !0,
  url: !0,
  week: !0,
};
function mu(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return t === "input" ? !!wh[e.type] : t === "textarea";
}
function pd(e, t, n, r) {
  (Hc(r),
    (t = bs(t, "onChange")),
    0 < t.length &&
      ((n = new no("onChange", "change", null, n, r)),
      e.push({ event: n, listeners: t })));
}
var ll = null,
  gl = null;
function Nh(e) {
  Sd(e, 0);
}
function Qs(e) {
  var t = pr(e);
  if (Dc(t)) return e;
}
function kh(e, t) {
  if (e === "change") return t;
}
var hd = !1;
if (tn) {
  var _i;
  if (tn) {
    var bi = "oninput" in document;
    if (!bi) {
      var gu = document.createElement("div");
      (gu.setAttribute("oninput", "return;"),
        (bi = typeof gu.oninput == "function"));
    }
    _i = bi;
  } else _i = !1;
  hd = _i && (!document.documentMode || 9 < document.documentMode);
}
function vu() {
  ll && (ll.detachEvent("onpropertychange", md), (gl = ll = null));
}
function md(e) {
  if (e.propertyName === "value" && Qs(gl)) {
    var t = [];
    (pd(t, gl, e, Xa(e)), Qc(Nh, t));
  }
}
function Sh(e, t, n) {
  e === "focusin"
    ? (vu(), (ll = t), (gl = n), ll.attachEvent("onpropertychange", md))
    : e === "focusout" && vu();
}
function Ch(e) {
  if (e === "selectionchange" || e === "keyup" || e === "keydown")
    return Qs(gl);
}
function _h(e, t) {
  if (e === "click") return Qs(t);
}
function bh(e, t) {
  if (e === "input" || e === "change") return Qs(t);
}
function Eh(e, t) {
  return (e === t && (e !== 0 || 1 / e === 1 / t)) || (e !== e && t !== t);
}
var Mt = typeof Object.is == "function" ? Object.is : Eh;
function vl(e, t) {
  if (Mt(e, t)) return !0;
  if (typeof e != "object" || e === null || typeof t != "object" || t === null)
    return !1;
  var n = Object.keys(e),
    r = Object.keys(t);
  if (n.length !== r.length) return !1;
  for (r = 0; r < n.length; r++) {
    var s = n[r];
    if (!Qi.call(t, s) || !Mt(e[s], t[s])) return !1;
  }
  return !0;
}
function xu(e) {
  for (; e && e.firstChild;) e = e.firstChild;
  return e;
}
function yu(e, t) {
  var n = xu(e);
  e = 0;
  for (var r; n;) {
    if (n.nodeType === 3) {
      if (((r = e + n.textContent.length), e <= t && r >= t))
        return { node: n, offset: t - e };
      e = r;
    }
    e: {
      for (; n;) {
        if (n.nextSibling) {
          n = n.nextSibling;
          break e;
        }
        n = n.parentNode;
      }
      n = void 0;
    }
    n = xu(n);
  }
}
function gd(e, t) {
  return e && t
    ? e === t
      ? !0
      : e && e.nodeType === 3
        ? !1
        : t && t.nodeType === 3
          ? gd(e, t.parentNode)
          : "contains" in e
            ? e.contains(t)
            : e.compareDocumentPosition
              ? !!(e.compareDocumentPosition(t) & 16)
              : !1
    : !1;
}
function vd() {
  for (var e = window, t = js(); t instanceof e.HTMLIFrameElement;) {
    try {
      var n = typeof t.contentWindow.location.href == "string";
    } catch {
      n = !1;
    }
    if (n) e = t.contentWindow;
    else break;
    t = js(e.document);
  }
  return t;
}
function so(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return (
    t &&
    ((t === "input" &&
      (e.type === "text" ||
        e.type === "search" ||
        e.type === "tel" ||
        e.type === "url" ||
        e.type === "password")) ||
      t === "textarea" ||
      e.contentEditable === "true")
  );
}
function zh(e) {
  var t = vd(),
    n = e.focusedElem,
    r = e.selectionRange;
  if (
    t !== n &&
    n &&
    n.ownerDocument &&
    gd(n.ownerDocument.documentElement, n)
  ) {
    if (r !== null && so(n)) {
      if (
        ((t = r.start),
        (e = r.end),
        e === void 0 && (e = t),
        "selectionStart" in n)
      )
        ((n.selectionStart = t),
          (n.selectionEnd = Math.min(e, n.value.length)));
      else if (
        ((e = ((t = n.ownerDocument || document) && t.defaultView) || window),
        e.getSelection)
      ) {
        e = e.getSelection();
        var s = n.textContent.length,
          i = Math.min(r.start, s);
        ((r = r.end === void 0 ? i : Math.min(r.end, s)),
          !e.extend && i > r && ((s = r), (r = i), (i = s)),
          (s = yu(n, i)));
        var a = yu(n, r);
        s &&
          a &&
          (e.rangeCount !== 1 ||
            e.anchorNode !== s.node ||
            e.anchorOffset !== s.offset ||
            e.focusNode !== a.node ||
            e.focusOffset !== a.offset) &&
          ((t = t.createRange()),
          t.setStart(s.node, s.offset),
          e.removeAllRanges(),
          i > r
            ? (e.addRange(t), e.extend(a.node, a.offset))
            : (t.setEnd(a.node, a.offset), e.addRange(t)));
      }
    }
    for (t = [], e = n; (e = e.parentNode);)
      e.nodeType === 1 &&
        t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
    for (typeof n.focus == "function" && n.focus(), n = 0; n < t.length; n++)
      ((e = t[n]),
        (e.element.scrollLeft = e.left),
        (e.element.scrollTop = e.top));
  }
}
var Fh = tn && "documentMode" in document && 11 >= document.documentMode,
  dr = null,
  pa = null,
  sl = null,
  ha = !1;
function ju(e, t, n) {
  var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
  ha ||
    dr == null ||
    dr !== js(r) ||
    ((r = dr),
    "selectionStart" in r && so(r)
      ? (r = { start: r.selectionStart, end: r.selectionEnd })
      : ((r = (
          (r.ownerDocument && r.ownerDocument.defaultView) ||
          window
        ).getSelection()),
        (r = {
          anchorNode: r.anchorNode,
          anchorOffset: r.anchorOffset,
          focusNode: r.focusNode,
          focusOffset: r.focusOffset,
        })),
    (sl && vl(sl, r)) ||
      ((sl = r),
      (r = bs(pa, "onSelect")),
      0 < r.length &&
        ((t = new no("onSelect", "select", null, t, n)),
        e.push({ event: t, listeners: r }),
        (t.target = dr))));
}
function Jl(e, t) {
  var n = {};
  return (
    (n[e.toLowerCase()] = t.toLowerCase()),
    (n["Webkit" + e] = "webkit" + t),
    (n["Moz" + e] = "moz" + t),
    n
  );
}
var fr = {
    animationend: Jl("Animation", "AnimationEnd"),
    animationiteration: Jl("Animation", "AnimationIteration"),
    animationstart: Jl("Animation", "AnimationStart"),
    transitionend: Jl("Transition", "TransitionEnd"),
  },
  Ei = {},
  xd = {};
tn &&
  ((xd = document.createElement("div").style),
  "AnimationEvent" in window ||
    (delete fr.animationend.animation,
    delete fr.animationiteration.animation,
    delete fr.animationstart.animation),
  "TransitionEvent" in window || delete fr.transitionend.transition);
function Gs(e) {
  if (Ei[e]) return Ei[e];
  if (!fr[e]) return e;
  var t = fr[e],
    n;
  for (n in t) if (t.hasOwnProperty(n) && n in xd) return (Ei[e] = t[n]);
  return e;
}
var yd = Gs("animationend"),
  jd = Gs("animationiteration"),
  wd = Gs("animationstart"),
  Nd = Gs("transitionend"),
  kd = new Map(),
  wu =
    "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
      " ",
    );
function Pn(e, t) {
  (kd.set(e, t), qn(t, [e]));
}
for (var zi = 0; zi < wu.length; zi++) {
  var Fi = wu[zi],
    Th = Fi.toLowerCase(),
    Ph = Fi[0].toUpperCase() + Fi.slice(1);
  Pn(Th, "on" + Ph);
}
Pn(yd, "onAnimationEnd");
Pn(jd, "onAnimationIteration");
Pn(wd, "onAnimationStart");
Pn("dblclick", "onDoubleClick");
Pn("focusin", "onFocus");
Pn("focusout", "onBlur");
Pn(Nd, "onTransitionEnd");
_r("onMouseEnter", ["mouseout", "mouseover"]);
_r("onMouseLeave", ["mouseout", "mouseover"]);
_r("onPointerEnter", ["pointerout", "pointerover"]);
_r("onPointerLeave", ["pointerout", "pointerover"]);
qn(
  "onChange",
  "change click focusin focusout input keydown keyup selectionchange".split(
    " ",
  ),
);
qn(
  "onSelect",
  "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
    " ",
  ),
);
qn("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
qn(
  "onCompositionEnd",
  "compositionend focusout keydown keypress keyup mousedown".split(" "),
);
qn(
  "onCompositionStart",
  "compositionstart focusout keydown keypress keyup mousedown".split(" "),
);
qn(
  "onCompositionUpdate",
  "compositionupdate focusout keydown keypress keyup mousedown".split(" "),
);
var el =
    "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
      " ",
    ),
  Mh = new Set("cancel close invalid load scroll toggle".split(" ").concat(el));
function Nu(e, t, n) {
  var r = e.type || "unknown-event";
  ((e.currentTarget = n), Tp(r, t, void 0, e), (e.currentTarget = null));
}
function Sd(e, t) {
  t = (t & 4) !== 0;
  for (var n = 0; n < e.length; n++) {
    var r = e[n],
      s = r.event;
    r = r.listeners;
    e: {
      var i = void 0;
      if (t)
        for (var a = r.length - 1; 0 <= a; a--) {
          var u = r[a],
            o = u.instance,
            d = u.currentTarget;
          if (((u = u.listener), o !== i && s.isPropagationStopped())) break e;
          (Nu(s, u, d), (i = o));
        }
      else
        for (a = 0; a < r.length; a++) {
          if (
            ((u = r[a]),
            (o = u.instance),
            (d = u.currentTarget),
            (u = u.listener),
            o !== i && s.isPropagationStopped())
          )
            break e;
          (Nu(s, u, d), (i = o));
        }
    }
  }
  if (Ns) throw ((e = ua), (Ns = !1), (ua = null), e);
}
function ge(e, t) {
  var n = t[ya];
  n === void 0 && (n = t[ya] = new Set());
  var r = e + "__bubble";
  n.has(r) || (Cd(t, e, 2, !1), n.add(r));
}
function Ti(e, t, n) {
  var r = 0;
  (t && (r |= 4), Cd(n, e, r, t));
}
var ql = "_reactListening" + Math.random().toString(36).slice(2);
function xl(e) {
  if (!e[ql]) {
    ((e[ql] = !0),
      Pc.forEach(function (n) {
        n !== "selectionchange" && (Mh.has(n) || Ti(n, !1, e), Ti(n, !0, e));
      }));
    var t = e.nodeType === 9 ? e : e.ownerDocument;
    t === null || t[ql] || ((t[ql] = !0), Ti("selectionchange", !1, t));
  }
}
function Cd(e, t, n, r) {
  switch (od(t)) {
    case 1:
      var s = Yp;
      break;
    case 4:
      s = Qp;
      break;
    default:
      s = eo;
  }
  ((n = s.bind(null, t, n, e)),
    (s = void 0),
    !oa ||
      (t !== "touchstart" && t !== "touchmove" && t !== "wheel") ||
      (s = !0),
    r
      ? s !== void 0
        ? e.addEventListener(t, n, { capture: !0, passive: s })
        : e.addEventListener(t, n, !0)
      : s !== void 0
        ? e.addEventListener(t, n, { passive: s })
        : e.addEventListener(t, n, !1));
}
function Pi(e, t, n, r, s) {
  var i = r;
  if (!(t & 1) && !(t & 2) && r !== null)
    e: for (;;) {
      if (r === null) return;
      var a = r.tag;
      if (a === 3 || a === 4) {
        var u = r.stateNode.containerInfo;
        if (u === s || (u.nodeType === 8 && u.parentNode === s)) break;
        if (a === 4)
          for (a = r.return; a !== null;) {
            var o = a.tag;
            if (
              (o === 3 || o === 4) &&
              ((o = a.stateNode.containerInfo),
              o === s || (o.nodeType === 8 && o.parentNode === s))
            )
              return;
            a = a.return;
          }
        for (; u !== null;) {
          if (((a = Bn(u)), a === null)) return;
          if (((o = a.tag), o === 5 || o === 6)) {
            r = i = a;
            continue e;
          }
          u = u.parentNode;
        }
      }
      r = r.return;
    }
  Qc(function () {
    var d = i,
      g = Xa(n),
      m = [];
    e: {
      var p = kd.get(e);
      if (p !== void 0) {
        var w = no,
          _ = e;
        switch (e) {
          case "keypress":
            if (fs(n) === 0) break e;
          case "keydown":
          case "keyup":
            w = uh;
            break;
          case "focusin":
            ((_ = "focus"), (w = Ci));
            break;
          case "focusout":
            ((_ = "blur"), (w = Ci));
            break;
          case "beforeblur":
          case "afterblur":
            w = Ci;
            break;
          case "click":
            if (n.button === 2) break e;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            w = cu;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            w = Jp;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            w = fh;
            break;
          case yd:
          case jd:
          case wd:
            w = eh;
            break;
          case Nd:
            w = hh;
            break;
          case "scroll":
            w = Gp;
            break;
          case "wheel":
            w = gh;
            break;
          case "copy":
          case "cut":
          case "paste":
            w = nh;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            w = fu;
        }
        var N = (t & 4) !== 0,
          R = !N && e === "scroll",
          h = N ? (p !== null ? p + "Capture" : null) : p;
        N = [];
        for (var c = d, f; c !== null;) {
          f = c;
          var v = f.stateNode;
          if (
            (f.tag === 5 &&
              v !== null &&
              ((f = v),
              h !== null && ((v = fl(c, h)), v != null && N.push(yl(c, v, f)))),
            R)
          )
            break;
          c = c.return;
        }
        0 < N.length &&
          ((p = new w(p, _, null, n, g)), m.push({ event: p, listeners: N }));
      }
    }
    if (!(t & 7)) {
      e: {
        if (
          ((p = e === "mouseover" || e === "pointerover"),
          (w = e === "mouseout" || e === "pointerout"),
          p &&
            n !== ia &&
            (_ = n.relatedTarget || n.fromElement) &&
            (Bn(_) || _[nn]))
        )
          break e;
        if (
          (w || p) &&
          ((p =
            g.window === g
              ? g
              : (p = g.ownerDocument)
                ? p.defaultView || p.parentWindow
                : window),
          w
            ? ((_ = n.relatedTarget || n.toElement),
              (w = d),
              (_ = _ ? Bn(_) : null),
              _ !== null &&
                ((R = Zn(_)), _ !== R || (_.tag !== 5 && _.tag !== 6)) &&
                (_ = null))
            : ((w = null), (_ = d)),
          w !== _)
        ) {
          if (
            ((N = cu),
            (v = "onMouseLeave"),
            (h = "onMouseEnter"),
            (c = "mouse"),
            (e === "pointerout" || e === "pointerover") &&
              ((N = fu),
              (v = "onPointerLeave"),
              (h = "onPointerEnter"),
              (c = "pointer")),
            (R = w == null ? p : pr(w)),
            (f = _ == null ? p : pr(_)),
            (p = new N(v, c + "leave", w, n, g)),
            (p.target = R),
            (p.relatedTarget = f),
            (v = null),
            Bn(g) === d &&
              ((N = new N(h, c + "enter", _, n, g)),
              (N.target = f),
              (N.relatedTarget = R),
              (v = N)),
            (R = v),
            w && _)
          )
            t: {
              for (N = w, h = _, c = 0, f = N; f; f = ir(f)) c++;
              for (f = 0, v = h; v; v = ir(v)) f++;
              for (; 0 < c - f;) ((N = ir(N)), c--);
              for (; 0 < f - c;) ((h = ir(h)), f--);
              for (; c--;) {
                if (N === h || (h !== null && N === h.alternate)) break t;
                ((N = ir(N)), (h = ir(h)));
              }
              N = null;
            }
          else N = null;
          (w !== null && ku(m, p, w, N, !1),
            _ !== null && R !== null && ku(m, R, _, N, !0));
        }
      }
      e: {
        if (
          ((p = d ? pr(d) : window),
          (w = p.nodeName && p.nodeName.toLowerCase()),
          w === "select" || (w === "input" && p.type === "file"))
        )
          var j = kh;
        else if (mu(p))
          if (hd) j = bh;
          else {
            j = Ch;
            var k = Sh;
          }
        else
          (w = p.nodeName) &&
            w.toLowerCase() === "input" &&
            (p.type === "checkbox" || p.type === "radio") &&
            (j = _h);
        if (j && (j = j(e, d))) {
          pd(m, j, n, g);
          break e;
        }
        (k && k(e, p, d),
          e === "focusout" &&
            (k = p._wrapperState) &&
            k.controlled &&
            p.type === "number" &&
            ta(p, "number", p.value));
      }
      switch (((k = d ? pr(d) : window), e)) {
        case "focusin":
          (mu(k) || k.contentEditable === "true") &&
            ((dr = k), (pa = d), (sl = null));
          break;
        case "focusout":
          sl = pa = dr = null;
          break;
        case "mousedown":
          ha = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          ((ha = !1), ju(m, n, g));
          break;
        case "selectionchange":
          if (Fh) break;
        case "keydown":
        case "keyup":
          ju(m, n, g);
      }
      var E;
      if (lo)
        e: {
          switch (e) {
            case "compositionstart":
              var C = "onCompositionStart";
              break e;
            case "compositionend":
              C = "onCompositionEnd";
              break e;
            case "compositionupdate":
              C = "onCompositionUpdate";
              break e;
          }
          C = void 0;
        }
      else
        cr
          ? dd(e, n) && (C = "onCompositionEnd")
          : e === "keydown" && n.keyCode === 229 && (C = "onCompositionStart");
      (C &&
        (cd &&
          n.locale !== "ko" &&
          (cr || C !== "onCompositionStart"
            ? C === "onCompositionEnd" && cr && (E = ud())
            : ((jn = g),
              (to = "value" in jn ? jn.value : jn.textContent),
              (cr = !0))),
        (k = bs(d, C)),
        0 < k.length &&
          ((C = new du(C, e, null, n, g)),
          m.push({ event: C, listeners: k }),
          E ? (C.data = E) : ((E = fd(n)), E !== null && (C.data = E)))),
        (E = xh ? yh(e, n) : jh(e, n)) &&
          ((d = bs(d, "onBeforeInput")),
          0 < d.length &&
            ((g = new du("onBeforeInput", "beforeinput", null, n, g)),
            m.push({ event: g, listeners: d }),
            (g.data = E))));
    }
    Sd(m, t);
  });
}
function yl(e, t, n) {
  return { instance: e, listener: t, currentTarget: n };
}
function bs(e, t) {
  for (var n = t + "Capture", r = []; e !== null;) {
    var s = e,
      i = s.stateNode;
    (s.tag === 5 &&
      i !== null &&
      ((s = i),
      (i = fl(e, n)),
      i != null && r.unshift(yl(e, i, s)),
      (i = fl(e, t)),
      i != null && r.push(yl(e, i, s))),
      (e = e.return));
  }
  return r;
}
function ir(e) {
  if (e === null) return null;
  do e = e.return;
  while (e && e.tag !== 5);
  return e || null;
}
function ku(e, t, n, r, s) {
  for (var i = t._reactName, a = []; n !== null && n !== r;) {
    var u = n,
      o = u.alternate,
      d = u.stateNode;
    if (o !== null && o === r) break;
    (u.tag === 5 &&
      d !== null &&
      ((u = d),
      s
        ? ((o = fl(n, i)), o != null && a.unshift(yl(n, o, u)))
        : s || ((o = fl(n, i)), o != null && a.push(yl(n, o, u)))),
      (n = n.return));
  }
  a.length !== 0 && e.push({ event: t, listeners: a });
}
var Rh = /\r\n?/g,
  Lh = /\u0000|\uFFFD/g;
function Su(e) {
  return (typeof e == "string" ? e : "" + e)
    .replace(
      Rh,
      `
`,
    )
    .replace(Lh, "");
}
function Zl(e, t, n) {
  if (((t = Su(t)), Su(e) !== t && n)) throw Error(P(425));
}
function Es() {}
var ma = null,
  ga = null;
function va(e, t) {
  return (
    e === "textarea" ||
    e === "noscript" ||
    typeof t.children == "string" ||
    typeof t.children == "number" ||
    (typeof t.dangerouslySetInnerHTML == "object" &&
      t.dangerouslySetInnerHTML !== null &&
      t.dangerouslySetInnerHTML.__html != null)
  );
}
var xa = typeof setTimeout == "function" ? setTimeout : void 0,
  Ih = typeof clearTimeout == "function" ? clearTimeout : void 0,
  Cu = typeof Promise == "function" ? Promise : void 0,
  Dh =
    typeof queueMicrotask == "function"
      ? queueMicrotask
      : typeof Cu < "u"
        ? function (e) {
            return Cu.resolve(null).then(e).catch(Oh);
          }
        : xa;
function Oh(e) {
  setTimeout(function () {
    throw e;
  });
}
function Mi(e, t) {
  var n = t,
    r = 0;
  do {
    var s = n.nextSibling;
    if ((e.removeChild(n), s && s.nodeType === 8))
      if (((n = s.data), n === "/$")) {
        if (r === 0) {
          (e.removeChild(s), ml(t));
          return;
        }
        r--;
      } else (n !== "$" && n !== "$?" && n !== "$!") || r++;
    n = s;
  } while (n);
  ml(t);
}
function Cn(e) {
  for (; e != null; e = e.nextSibling) {
    var t = e.nodeType;
    if (t === 1 || t === 3) break;
    if (t === 8) {
      if (((t = e.data), t === "$" || t === "$!" || t === "$?")) break;
      if (t === "/$") return null;
    }
  }
  return e;
}
function _u(e) {
  e = e.previousSibling;
  for (var t = 0; e;) {
    if (e.nodeType === 8) {
      var n = e.data;
      if (n === "$" || n === "$!" || n === "$?") {
        if (t === 0) return e;
        t--;
      } else n === "/$" && t++;
    }
    e = e.previousSibling;
  }
  return null;
}
var Lr = Math.random().toString(36).slice(2),
  Wt = "__reactFiber$" + Lr,
  jl = "__reactProps$" + Lr,
  nn = "__reactContainer$" + Lr,
  ya = "__reactEvents$" + Lr,
  $h = "__reactListeners$" + Lr,
  Ah = "__reactHandles$" + Lr;
function Bn(e) {
  var t = e[Wt];
  if (t) return t;
  for (var n = e.parentNode; n;) {
    if ((t = n[nn] || n[Wt])) {
      if (
        ((n = t.alternate),
        t.child !== null || (n !== null && n.child !== null))
      )
        for (e = _u(e); e !== null;) {
          if ((n = e[Wt])) return n;
          e = _u(e);
        }
      return t;
    }
    ((e = n), (n = e.parentNode));
  }
  return null;
}
function Fl(e) {
  return (
    (e = e[Wt] || e[nn]),
    !e || (e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3) ? null : e
  );
}
function pr(e) {
  if (e.tag === 5 || e.tag === 6) return e.stateNode;
  throw Error(P(33));
}
function Xs(e) {
  return e[jl] || null;
}
var ja = [],
  hr = -1;
function Mn(e) {
  return { current: e };
}
function ve(e) {
  0 > hr || ((e.current = ja[hr]), (ja[hr] = null), hr--);
}
function he(e, t) {
  (hr++, (ja[hr] = e.current), (e.current = t));
}
var Tn = {},
  He = Mn(Tn),
  et = Mn(!1),
  Yn = Tn;
function br(e, t) {
  var n = e.type.contextTypes;
  if (!n) return Tn;
  var r = e.stateNode;
  if (r && r.__reactInternalMemoizedUnmaskedChildContext === t)
    return r.__reactInternalMemoizedMaskedChildContext;
  var s = {},
    i;
  for (i in n) s[i] = t[i];
  return (
    r &&
      ((e = e.stateNode),
      (e.__reactInternalMemoizedUnmaskedChildContext = t),
      (e.__reactInternalMemoizedMaskedChildContext = s)),
    s
  );
}
function tt(e) {
  return ((e = e.childContextTypes), e != null);
}
function zs() {
  (ve(et), ve(He));
}
function bu(e, t, n) {
  if (He.current !== Tn) throw Error(P(168));
  (he(He, t), he(et, n));
}
function _d(e, t, n) {
  var r = e.stateNode;
  if (((t = t.childContextTypes), typeof r.getChildContext != "function"))
    return n;
  r = r.getChildContext();
  for (var s in r) if (!(s in t)) throw Error(P(108, Sp(e) || "Unknown", s));
  return ke({}, n, r);
}
function Fs(e) {
  return (
    (e =
      ((e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext) || Tn),
    (Yn = He.current),
    he(He, e),
    he(et, et.current),
    !0
  );
}
function Eu(e, t, n) {
  var r = e.stateNode;
  if (!r) throw Error(P(169));
  (n
    ? ((e = _d(e, t, Yn)),
      (r.__reactInternalMemoizedMergedChildContext = e),
      ve(et),
      ve(He),
      he(He, e))
    : ve(et),
    he(et, n));
}
var Jt = null,
  Js = !1,
  Ri = !1;
function bd(e) {
  Jt === null ? (Jt = [e]) : Jt.push(e);
}
function Uh(e) {
  ((Js = !0), bd(e));
}
function Rn() {
  if (!Ri && Jt !== null) {
    Ri = !0;
    var e = 0,
      t = ce;
    try {
      var n = Jt;
      for (ce = 1; e < n.length; e++) {
        var r = n[e];
        do r = r(!0);
        while (r !== null);
      }
      ((Jt = null), (Js = !1));
    } catch (s) {
      throw (Jt !== null && (Jt = Jt.slice(e + 1)), qc(Ja, Rn), s);
    } finally {
      ((ce = t), (Ri = !1));
    }
  }
  return null;
}
var mr = [],
  gr = 0,
  Ts = null,
  Ps = 0,
  vt = [],
  xt = 0,
  Qn = null,
  qt = 1,
  Zt = "";
function An(e, t) {
  ((mr[gr++] = Ps), (mr[gr++] = Ts), (Ts = e), (Ps = t));
}
function Ed(e, t, n) {
  ((vt[xt++] = qt), (vt[xt++] = Zt), (vt[xt++] = Qn), (Qn = e));
  var r = qt;
  e = Zt;
  var s = 32 - Tt(r) - 1;
  ((r &= ~(1 << s)), (n += 1));
  var i = 32 - Tt(t) + s;
  if (30 < i) {
    var a = s - (s % 5);
    ((i = (r & ((1 << a) - 1)).toString(32)),
      (r >>= a),
      (s -= a),
      (qt = (1 << (32 - Tt(t) + s)) | (n << s) | r),
      (Zt = i + e));
  } else ((qt = (1 << i) | (n << s) | r), (Zt = e));
}
function io(e) {
  e.return !== null && (An(e, 1), Ed(e, 1, 0));
}
function ao(e) {
  for (; e === Ts;)
    ((Ts = mr[--gr]), (mr[gr] = null), (Ps = mr[--gr]), (mr[gr] = null));
  for (; e === Qn;)
    ((Qn = vt[--xt]),
      (vt[xt] = null),
      (Zt = vt[--xt]),
      (vt[xt] = null),
      (qt = vt[--xt]),
      (vt[xt] = null));
}
var ut = null,
  ot = null,
  xe = !1,
  Ft = null;
function zd(e, t) {
  var n = yt(5, null, null, 0);
  ((n.elementType = "DELETED"),
    (n.stateNode = t),
    (n.return = e),
    (t = e.deletions),
    t === null ? ((e.deletions = [n]), (e.flags |= 16)) : t.push(n));
}
function zu(e, t) {
  switch (e.tag) {
    case 5:
      var n = e.type;
      return (
        (t =
          t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase()
            ? null
            : t),
        t !== null
          ? ((e.stateNode = t), (ut = e), (ot = Cn(t.firstChild)), !0)
          : !1
      );
    case 6:
      return (
        (t = e.pendingProps === "" || t.nodeType !== 3 ? null : t),
        t !== null ? ((e.stateNode = t), (ut = e), (ot = null), !0) : !1
      );
    case 13:
      return (
        (t = t.nodeType !== 8 ? null : t),
        t !== null
          ? ((n = Qn !== null ? { id: qt, overflow: Zt } : null),
            (e.memoizedState = {
              dehydrated: t,
              treeContext: n,
              retryLane: 1073741824,
            }),
            (n = yt(18, null, null, 0)),
            (n.stateNode = t),
            (n.return = e),
            (e.child = n),
            (ut = e),
            (ot = null),
            !0)
          : !1
      );
    default:
      return !1;
  }
}
function wa(e) {
  return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
}
function Na(e) {
  if (xe) {
    var t = ot;
    if (t) {
      var n = t;
      if (!zu(e, t)) {
        if (wa(e)) throw Error(P(418));
        t = Cn(n.nextSibling);
        var r = ut;
        t && zu(e, t)
          ? zd(r, n)
          : ((e.flags = (e.flags & -4097) | 2), (xe = !1), (ut = e));
      }
    } else {
      if (wa(e)) throw Error(P(418));
      ((e.flags = (e.flags & -4097) | 2), (xe = !1), (ut = e));
    }
  }
}
function Fu(e) {
  for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13;)
    e = e.return;
  ut = e;
}
function es(e) {
  if (e !== ut) return !1;
  if (!xe) return (Fu(e), (xe = !0), !1);
  var t;
  if (
    ((t = e.tag !== 3) &&
      !(t = e.tag !== 5) &&
      ((t = e.type),
      (t = t !== "head" && t !== "body" && !va(e.type, e.memoizedProps))),
    t && (t = ot))
  ) {
    if (wa(e)) throw (Fd(), Error(P(418)));
    for (; t;) (zd(e, t), (t = Cn(t.nextSibling)));
  }
  if ((Fu(e), e.tag === 13)) {
    if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e))
      throw Error(P(317));
    e: {
      for (e = e.nextSibling, t = 0; e;) {
        if (e.nodeType === 8) {
          var n = e.data;
          if (n === "/$") {
            if (t === 0) {
              ot = Cn(e.nextSibling);
              break e;
            }
            t--;
          } else (n !== "$" && n !== "$!" && n !== "$?") || t++;
        }
        e = e.nextSibling;
      }
      ot = null;
    }
  } else ot = ut ? Cn(e.stateNode.nextSibling) : null;
  return !0;
}
function Fd() {
  for (var e = ot; e;) e = Cn(e.nextSibling);
}
function Er() {
  ((ot = ut = null), (xe = !1));
}
function oo(e) {
  Ft === null ? (Ft = [e]) : Ft.push(e);
}
var Bh = sn.ReactCurrentBatchConfig;
function Kr(e, t, n) {
  if (
    ((e = n.ref), e !== null && typeof e != "function" && typeof e != "object")
  ) {
    if (n._owner) {
      if (((n = n._owner), n)) {
        if (n.tag !== 1) throw Error(P(309));
        var r = n.stateNode;
      }
      if (!r) throw Error(P(147, e));
      var s = r,
        i = "" + e;
      return t !== null &&
        t.ref !== null &&
        typeof t.ref == "function" &&
        t.ref._stringRef === i
        ? t.ref
        : ((t = function (a) {
            var u = s.refs;
            a === null ? delete u[i] : (u[i] = a);
          }),
          (t._stringRef = i),
          t);
    }
    if (typeof e != "string") throw Error(P(284));
    if (!n._owner) throw Error(P(290, e));
  }
  return e;
}
function ts(e, t) {
  throw (
    (e = Object.prototype.toString.call(t)),
    Error(
      P(
        31,
        e === "[object Object]"
          ? "object with keys {" + Object.keys(t).join(", ") + "}"
          : e,
      ),
    )
  );
}
function Tu(e) {
  var t = e._init;
  return t(e._payload);
}
function Td(e) {
  function t(h, c) {
    if (e) {
      var f = h.deletions;
      f === null ? ((h.deletions = [c]), (h.flags |= 16)) : f.push(c);
    }
  }
  function n(h, c) {
    if (!e) return null;
    for (; c !== null;) (t(h, c), (c = c.sibling));
    return null;
  }
  function r(h, c) {
    for (h = new Map(); c !== null;)
      (c.key !== null ? h.set(c.key, c) : h.set(c.index, c), (c = c.sibling));
    return h;
  }
  function s(h, c) {
    return ((h = zn(h, c)), (h.index = 0), (h.sibling = null), h);
  }
  function i(h, c, f) {
    return (
      (h.index = f),
      e
        ? ((f = h.alternate),
          f !== null
            ? ((f = f.index), f < c ? ((h.flags |= 2), c) : f)
            : ((h.flags |= 2), c))
        : ((h.flags |= 1048576), c)
    );
  }
  function a(h) {
    return (e && h.alternate === null && (h.flags |= 2), h);
  }
  function u(h, c, f, v) {
    return c === null || c.tag !== 6
      ? ((c = Ui(f, h.mode, v)), (c.return = h), c)
      : ((c = s(c, f)), (c.return = h), c);
  }
  function o(h, c, f, v) {
    var j = f.type;
    return j === ur
      ? g(h, c, f.props.children, v, f.key)
      : c !== null &&
          (c.elementType === j ||
            (typeof j == "object" &&
              j !== null &&
              j.$$typeof === gn &&
              Tu(j) === c.type))
        ? ((v = s(c, f.props)), (v.ref = Kr(h, c, f)), (v.return = h), v)
        : ((v = ys(f.type, f.key, f.props, null, h.mode, v)),
          (v.ref = Kr(h, c, f)),
          (v.return = h),
          v);
  }
  function d(h, c, f, v) {
    return c === null ||
      c.tag !== 4 ||
      c.stateNode.containerInfo !== f.containerInfo ||
      c.stateNode.implementation !== f.implementation
      ? ((c = Bi(f, h.mode, v)), (c.return = h), c)
      : ((c = s(c, f.children || [])), (c.return = h), c);
  }
  function g(h, c, f, v, j) {
    return c === null || c.tag !== 7
      ? ((c = Kn(f, h.mode, v, j)), (c.return = h), c)
      : ((c = s(c, f)), (c.return = h), c);
  }
  function m(h, c, f) {
    if ((typeof c == "string" && c !== "") || typeof c == "number")
      return ((c = Ui("" + c, h.mode, f)), (c.return = h), c);
    if (typeof c == "object" && c !== null) {
      switch (c.$$typeof) {
        case Hl:
          return (
            (f = ys(c.type, c.key, c.props, null, h.mode, f)),
            (f.ref = Kr(h, null, c)),
            (f.return = h),
            f
          );
        case or:
          return ((c = Bi(c, h.mode, f)), (c.return = h), c);
        case gn:
          var v = c._init;
          return m(h, v(c._payload), f);
      }
      if (qr(c) || Ur(c))
        return ((c = Kn(c, h.mode, f, null)), (c.return = h), c);
      ts(h, c);
    }
    return null;
  }
  function p(h, c, f, v) {
    var j = c !== null ? c.key : null;
    if ((typeof f == "string" && f !== "") || typeof f == "number")
      return j !== null ? null : u(h, c, "" + f, v);
    if (typeof f == "object" && f !== null) {
      switch (f.$$typeof) {
        case Hl:
          return f.key === j ? o(h, c, f, v) : null;
        case or:
          return f.key === j ? d(h, c, f, v) : null;
        case gn:
          return ((j = f._init), p(h, c, j(f._payload), v));
      }
      if (qr(f) || Ur(f)) return j !== null ? null : g(h, c, f, v, null);
      ts(h, f);
    }
    return null;
  }
  function w(h, c, f, v, j) {
    if ((typeof v == "string" && v !== "") || typeof v == "number")
      return ((h = h.get(f) || null), u(c, h, "" + v, j));
    if (typeof v == "object" && v !== null) {
      switch (v.$$typeof) {
        case Hl:
          return (
            (h = h.get(v.key === null ? f : v.key) || null),
            o(c, h, v, j)
          );
        case or:
          return (
            (h = h.get(v.key === null ? f : v.key) || null),
            d(c, h, v, j)
          );
        case gn:
          var k = v._init;
          return w(h, c, f, k(v._payload), j);
      }
      if (qr(v) || Ur(v)) return ((h = h.get(f) || null), g(c, h, v, j, null));
      ts(c, v);
    }
    return null;
  }
  function _(h, c, f, v) {
    for (
      var j = null, k = null, E = c, C = (c = 0), H = null;
      E !== null && C < f.length;
      C++
    ) {
      E.index > C ? ((H = E), (E = null)) : (H = E.sibling);
      var M = p(h, E, f[C], v);
      if (M === null) {
        E === null && (E = H);
        break;
      }
      (e && E && M.alternate === null && t(h, E),
        (c = i(M, c, C)),
        k === null ? (j = M) : (k.sibling = M),
        (k = M),
        (E = H));
    }
    if (C === f.length) return (n(h, E), xe && An(h, C), j);
    if (E === null) {
      for (; C < f.length; C++)
        ((E = m(h, f[C], v)),
          E !== null &&
            ((c = i(E, c, C)),
            k === null ? (j = E) : (k.sibling = E),
            (k = E)));
      return (xe && An(h, C), j);
    }
    for (E = r(h, E); C < f.length; C++)
      ((H = w(E, h, C, f[C], v)),
        H !== null &&
          (e && H.alternate !== null && E.delete(H.key === null ? C : H.key),
          (c = i(H, c, C)),
          k === null ? (j = H) : (k.sibling = H),
          (k = H)));
    return (
      e &&
        E.forEach(function (F) {
          return t(h, F);
        }),
      xe && An(h, C),
      j
    );
  }
  function N(h, c, f, v) {
    var j = Ur(f);
    if (typeof j != "function") throw Error(P(150));
    if (((f = j.call(f)), f == null)) throw Error(P(151));
    for (
      var k = (j = null), E = c, C = (c = 0), H = null, M = f.next();
      E !== null && !M.done;
      C++, M = f.next()
    ) {
      E.index > C ? ((H = E), (E = null)) : (H = E.sibling);
      var F = p(h, E, M.value, v);
      if (F === null) {
        E === null && (E = H);
        break;
      }
      (e && E && F.alternate === null && t(h, E),
        (c = i(F, c, C)),
        k === null ? (j = F) : (k.sibling = F),
        (k = F),
        (E = H));
    }
    if (M.done) return (n(h, E), xe && An(h, C), j);
    if (E === null) {
      for (; !M.done; C++, M = f.next())
        ((M = m(h, M.value, v)),
          M !== null &&
            ((c = i(M, c, C)),
            k === null ? (j = M) : (k.sibling = M),
            (k = M)));
      return (xe && An(h, C), j);
    }
    for (E = r(h, E); !M.done; C++, M = f.next())
      ((M = w(E, h, C, M.value, v)),
        M !== null &&
          (e && M.alternate !== null && E.delete(M.key === null ? C : M.key),
          (c = i(M, c, C)),
          k === null ? (j = M) : (k.sibling = M),
          (k = M)));
    return (
      e &&
        E.forEach(function (L) {
          return t(h, L);
        }),
      xe && An(h, C),
      j
    );
  }
  function R(h, c, f, v) {
    if (
      (typeof f == "object" &&
        f !== null &&
        f.type === ur &&
        f.key === null &&
        (f = f.props.children),
      typeof f == "object" && f !== null)
    ) {
      switch (f.$$typeof) {
        case Hl:
          e: {
            for (var j = f.key, k = c; k !== null;) {
              if (k.key === j) {
                if (((j = f.type), j === ur)) {
                  if (k.tag === 7) {
                    (n(h, k.sibling),
                      (c = s(k, f.props.children)),
                      (c.return = h),
                      (h = c));
                    break e;
                  }
                } else if (
                  k.elementType === j ||
                  (typeof j == "object" &&
                    j !== null &&
                    j.$$typeof === gn &&
                    Tu(j) === k.type)
                ) {
                  (n(h, k.sibling),
                    (c = s(k, f.props)),
                    (c.ref = Kr(h, k, f)),
                    (c.return = h),
                    (h = c));
                  break e;
                }
                n(h, k);
                break;
              } else t(h, k);
              k = k.sibling;
            }
            f.type === ur
              ? ((c = Kn(f.props.children, h.mode, v, f.key)),
                (c.return = h),
                (h = c))
              : ((v = ys(f.type, f.key, f.props, null, h.mode, v)),
                (v.ref = Kr(h, c, f)),
                (v.return = h),
                (h = v));
          }
          return a(h);
        case or:
          e: {
            for (k = f.key; c !== null;) {
              if (c.key === k)
                if (
                  c.tag === 4 &&
                  c.stateNode.containerInfo === f.containerInfo &&
                  c.stateNode.implementation === f.implementation
                ) {
                  (n(h, c.sibling),
                    (c = s(c, f.children || [])),
                    (c.return = h),
                    (h = c));
                  break e;
                } else {
                  n(h, c);
                  break;
                }
              else t(h, c);
              c = c.sibling;
            }
            ((c = Bi(f, h.mode, v)), (c.return = h), (h = c));
          }
          return a(h);
        case gn:
          return ((k = f._init), R(h, c, k(f._payload), v));
      }
      if (qr(f)) return _(h, c, f, v);
      if (Ur(f)) return N(h, c, f, v);
      ts(h, f);
    }
    return (typeof f == "string" && f !== "") || typeof f == "number"
      ? ((f = "" + f),
        c !== null && c.tag === 6
          ? (n(h, c.sibling), (c = s(c, f)), (c.return = h), (h = c))
          : (n(h, c), (c = Ui(f, h.mode, v)), (c.return = h), (h = c)),
        a(h))
      : n(h, c);
  }
  return R;
}
var zr = Td(!0),
  Pd = Td(!1),
  Ms = Mn(null),
  Rs = null,
  vr = null,
  uo = null;
function co() {
  uo = vr = Rs = null;
}
function fo(e) {
  var t = Ms.current;
  (ve(Ms), (e._currentValue = t));
}
function ka(e, t, n) {
  for (; e !== null;) {
    var r = e.alternate;
    if (
      ((e.childLanes & t) !== t
        ? ((e.childLanes |= t), r !== null && (r.childLanes |= t))
        : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t),
      e === n)
    )
      break;
    e = e.return;
  }
}
function Sr(e, t) {
  ((Rs = e),
    (uo = vr = null),
    (e = e.dependencies),
    e !== null &&
      e.firstContext !== null &&
      (e.lanes & t && (Ze = !0), (e.firstContext = null)));
}
function wt(e) {
  var t = e._currentValue;
  if (uo !== e)
    if (((e = { context: e, memoizedValue: t, next: null }), vr === null)) {
      if (Rs === null) throw Error(P(308));
      ((vr = e), (Rs.dependencies = { lanes: 0, firstContext: e }));
    } else vr = vr.next = e;
  return t;
}
var Wn = null;
function po(e) {
  Wn === null ? (Wn = [e]) : Wn.push(e);
}
function Md(e, t, n, r) {
  var s = t.interleaved;
  return (
    s === null ? ((n.next = n), po(t)) : ((n.next = s.next), (s.next = n)),
    (t.interleaved = n),
    rn(e, r)
  );
}
function rn(e, t) {
  e.lanes |= t;
  var n = e.alternate;
  for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null;)
    ((e.childLanes |= t),
      (n = e.alternate),
      n !== null && (n.childLanes |= t),
      (n = e),
      (e = e.return));
  return n.tag === 3 ? n.stateNode : null;
}
var vn = !1;
function ho(e) {
  e.updateQueue = {
    baseState: e.memoizedState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: { pending: null, interleaved: null, lanes: 0 },
    effects: null,
  };
}
function Rd(e, t) {
  ((e = e.updateQueue),
    t.updateQueue === e &&
      (t.updateQueue = {
        baseState: e.baseState,
        firstBaseUpdate: e.firstBaseUpdate,
        lastBaseUpdate: e.lastBaseUpdate,
        shared: e.shared,
        effects: e.effects,
      }));
}
function en(e, t) {
  return {
    eventTime: e,
    lane: t,
    tag: 0,
    payload: null,
    callback: null,
    next: null,
  };
}
function _n(e, t, n) {
  var r = e.updateQueue;
  if (r === null) return null;
  if (((r = r.shared), le & 2)) {
    var s = r.pending;
    return (
      s === null ? (t.next = t) : ((t.next = s.next), (s.next = t)),
      (r.pending = t),
      rn(e, n)
    );
  }
  return (
    (s = r.interleaved),
    s === null ? ((t.next = t), po(r)) : ((t.next = s.next), (s.next = t)),
    (r.interleaved = t),
    rn(e, n)
  );
}
function ps(e, t, n) {
  if (
    ((t = t.updateQueue), t !== null && ((t = t.shared), (n & 4194240) !== 0))
  ) {
    var r = t.lanes;
    ((r &= e.pendingLanes), (n |= r), (t.lanes = n), qa(e, n));
  }
}
function Pu(e, t) {
  var n = e.updateQueue,
    r = e.alternate;
  if (r !== null && ((r = r.updateQueue), n === r)) {
    var s = null,
      i = null;
    if (((n = n.firstBaseUpdate), n !== null)) {
      do {
        var a = {
          eventTime: n.eventTime,
          lane: n.lane,
          tag: n.tag,
          payload: n.payload,
          callback: n.callback,
          next: null,
        };
        (i === null ? (s = i = a) : (i = i.next = a), (n = n.next));
      } while (n !== null);
      i === null ? (s = i = t) : (i = i.next = t);
    } else s = i = t;
    ((n = {
      baseState: r.baseState,
      firstBaseUpdate: s,
      lastBaseUpdate: i,
      shared: r.shared,
      effects: r.effects,
    }),
      (e.updateQueue = n));
    return;
  }
  ((e = n.lastBaseUpdate),
    e === null ? (n.firstBaseUpdate = t) : (e.next = t),
    (n.lastBaseUpdate = t));
}
function Ls(e, t, n, r) {
  var s = e.updateQueue;
  vn = !1;
  var i = s.firstBaseUpdate,
    a = s.lastBaseUpdate,
    u = s.shared.pending;
  if (u !== null) {
    s.shared.pending = null;
    var o = u,
      d = o.next;
    ((o.next = null), a === null ? (i = d) : (a.next = d), (a = o));
    var g = e.alternate;
    g !== null &&
      ((g = g.updateQueue),
      (u = g.lastBaseUpdate),
      u !== a &&
        (u === null ? (g.firstBaseUpdate = d) : (u.next = d),
        (g.lastBaseUpdate = o)));
  }
  if (i !== null) {
    var m = s.baseState;
    ((a = 0), (g = d = o = null), (u = i));
    do {
      var p = u.lane,
        w = u.eventTime;
      if ((r & p) === p) {
        g !== null &&
          (g = g.next =
            {
              eventTime: w,
              lane: 0,
              tag: u.tag,
              payload: u.payload,
              callback: u.callback,
              next: null,
            });
        e: {
          var _ = e,
            N = u;
          switch (((p = t), (w = n), N.tag)) {
            case 1:
              if (((_ = N.payload), typeof _ == "function")) {
                m = _.call(w, m, p);
                break e;
              }
              m = _;
              break e;
            case 3:
              _.flags = (_.flags & -65537) | 128;
            case 0:
              if (
                ((_ = N.payload),
                (p = typeof _ == "function" ? _.call(w, m, p) : _),
                p == null)
              )
                break e;
              m = ke({}, m, p);
              break e;
            case 2:
              vn = !0;
          }
        }
        u.callback !== null &&
          u.lane !== 0 &&
          ((e.flags |= 64),
          (p = s.effects),
          p === null ? (s.effects = [u]) : p.push(u));
      } else
        ((w = {
          eventTime: w,
          lane: p,
          tag: u.tag,
          payload: u.payload,
          callback: u.callback,
          next: null,
        }),
          g === null ? ((d = g = w), (o = m)) : (g = g.next = w),
          (a |= p));
      if (((u = u.next), u === null)) {
        if (((u = s.shared.pending), u === null)) break;
        ((p = u),
          (u = p.next),
          (p.next = null),
          (s.lastBaseUpdate = p),
          (s.shared.pending = null));
      }
    } while (!0);
    if (
      (g === null && (o = m),
      (s.baseState = o),
      (s.firstBaseUpdate = d),
      (s.lastBaseUpdate = g),
      (t = s.shared.interleaved),
      t !== null)
    ) {
      s = t;
      do ((a |= s.lane), (s = s.next));
      while (s !== t);
    } else i === null && (s.shared.lanes = 0);
    ((Xn |= a), (e.lanes = a), (e.memoizedState = m));
  }
}
function Mu(e, t, n) {
  if (((e = t.effects), (t.effects = null), e !== null))
    for (t = 0; t < e.length; t++) {
      var r = e[t],
        s = r.callback;
      if (s !== null) {
        if (((r.callback = null), (r = n), typeof s != "function"))
          throw Error(P(191, s));
        s.call(r);
      }
    }
}
var Tl = {},
  Vt = Mn(Tl),
  wl = Mn(Tl),
  Nl = Mn(Tl);
function Hn(e) {
  if (e === Tl) throw Error(P(174));
  return e;
}
function mo(e, t) {
  switch ((he(Nl, t), he(wl, e), he(Vt, Tl), (e = t.nodeType), e)) {
    case 9:
    case 11:
      t = (t = t.documentElement) ? t.namespaceURI : ra(null, "");
      break;
    default:
      ((e = e === 8 ? t.parentNode : t),
        (t = e.namespaceURI || null),
        (e = e.tagName),
        (t = ra(t, e)));
  }
  (ve(Vt), he(Vt, t));
}
function Fr() {
  (ve(Vt), ve(wl), ve(Nl));
}
function Ld(e) {
  Hn(Nl.current);
  var t = Hn(Vt.current),
    n = ra(t, e.type);
  t !== n && (he(wl, e), he(Vt, n));
}
function go(e) {
  wl.current === e && (ve(Vt), ve(wl));
}
var we = Mn(0);
function Is(e) {
  for (var t = e; t !== null;) {
    if (t.tag === 13) {
      var n = t.memoizedState;
      if (
        n !== null &&
        ((n = n.dehydrated), n === null || n.data === "$?" || n.data === "$!")
      )
        return t;
    } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
      if (t.flags & 128) return t;
    } else if (t.child !== null) {
      ((t.child.return = t), (t = t.child));
      continue;
    }
    if (t === e) break;
    for (; t.sibling === null;) {
      if (t.return === null || t.return === e) return null;
      t = t.return;
    }
    ((t.sibling.return = t.return), (t = t.sibling));
  }
  return null;
}
var Li = [];
function vo() {
  for (var e = 0; e < Li.length; e++)
    Li[e]._workInProgressVersionPrimary = null;
  Li.length = 0;
}
var hs = sn.ReactCurrentDispatcher,
  Ii = sn.ReactCurrentBatchConfig,
  Gn = 0,
  Ne = null,
  Me = null,
  Ie = null,
  Ds = !1,
  il = !1,
  kl = 0,
  Wh = 0;
function Ue() {
  throw Error(P(321));
}
function xo(e, t) {
  if (t === null) return !1;
  for (var n = 0; n < t.length && n < e.length; n++)
    if (!Mt(e[n], t[n])) return !1;
  return !0;
}
function yo(e, t, n, r, s, i) {
  if (
    ((Gn = i),
    (Ne = t),
    (t.memoizedState = null),
    (t.updateQueue = null),
    (t.lanes = 0),
    (hs.current = e === null || e.memoizedState === null ? Yh : Qh),
    (e = n(r, s)),
    il)
  ) {
    i = 0;
    do {
      if (((il = !1), (kl = 0), 25 <= i)) throw Error(P(301));
      ((i += 1),
        (Ie = Me = null),
        (t.updateQueue = null),
        (hs.current = Gh),
        (e = n(r, s)));
    } while (il);
  }
  if (
    ((hs.current = Os),
    (t = Me !== null && Me.next !== null),
    (Gn = 0),
    (Ie = Me = Ne = null),
    (Ds = !1),
    t)
  )
    throw Error(P(300));
  return e;
}
function jo() {
  var e = kl !== 0;
  return ((kl = 0), e);
}
function Ut() {
  var e = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null,
  };
  return (Ie === null ? (Ne.memoizedState = Ie = e) : (Ie = Ie.next = e), Ie);
}
function Nt() {
  if (Me === null) {
    var e = Ne.alternate;
    e = e !== null ? e.memoizedState : null;
  } else e = Me.next;
  var t = Ie === null ? Ne.memoizedState : Ie.next;
  if (t !== null) ((Ie = t), (Me = e));
  else {
    if (e === null) throw Error(P(310));
    ((Me = e),
      (e = {
        memoizedState: Me.memoizedState,
        baseState: Me.baseState,
        baseQueue: Me.baseQueue,
        queue: Me.queue,
        next: null,
      }),
      Ie === null ? (Ne.memoizedState = Ie = e) : (Ie = Ie.next = e));
  }
  return Ie;
}
function Sl(e, t) {
  return typeof t == "function" ? t(e) : t;
}
function Di(e) {
  var t = Nt(),
    n = t.queue;
  if (n === null) throw Error(P(311));
  n.lastRenderedReducer = e;
  var r = Me,
    s = r.baseQueue,
    i = n.pending;
  if (i !== null) {
    if (s !== null) {
      var a = s.next;
      ((s.next = i.next), (i.next = a));
    }
    ((r.baseQueue = s = i), (n.pending = null));
  }
  if (s !== null) {
    ((i = s.next), (r = r.baseState));
    var u = (a = null),
      o = null,
      d = i;
    do {
      var g = d.lane;
      if ((Gn & g) === g)
        (o !== null &&
          (o = o.next =
            {
              lane: 0,
              action: d.action,
              hasEagerState: d.hasEagerState,
              eagerState: d.eagerState,
              next: null,
            }),
          (r = d.hasEagerState ? d.eagerState : e(r, d.action)));
      else {
        var m = {
          lane: g,
          action: d.action,
          hasEagerState: d.hasEagerState,
          eagerState: d.eagerState,
          next: null,
        };
        (o === null ? ((u = o = m), (a = r)) : (o = o.next = m),
          (Ne.lanes |= g),
          (Xn |= g));
      }
      d = d.next;
    } while (d !== null && d !== i);
    (o === null ? (a = r) : (o.next = u),
      Mt(r, t.memoizedState) || (Ze = !0),
      (t.memoizedState = r),
      (t.baseState = a),
      (t.baseQueue = o),
      (n.lastRenderedState = r));
  }
  if (((e = n.interleaved), e !== null)) {
    s = e;
    do ((i = s.lane), (Ne.lanes |= i), (Xn |= i), (s = s.next));
    while (s !== e);
  } else s === null && (n.lanes = 0);
  return [t.memoizedState, n.dispatch];
}
function Oi(e) {
  var t = Nt(),
    n = t.queue;
  if (n === null) throw Error(P(311));
  n.lastRenderedReducer = e;
  var r = n.dispatch,
    s = n.pending,
    i = t.memoizedState;
  if (s !== null) {
    n.pending = null;
    var a = (s = s.next);
    do ((i = e(i, a.action)), (a = a.next));
    while (a !== s);
    (Mt(i, t.memoizedState) || (Ze = !0),
      (t.memoizedState = i),
      t.baseQueue === null && (t.baseState = i),
      (n.lastRenderedState = i));
  }
  return [i, r];
}
function Id() {}
function Dd(e, t) {
  var n = Ne,
    r = Nt(),
    s = t(),
    i = !Mt(r.memoizedState, s);
  if (
    (i && ((r.memoizedState = s), (Ze = !0)),
    (r = r.queue),
    wo(Ad.bind(null, n, r, e), [e]),
    r.getSnapshot !== t || i || (Ie !== null && Ie.memoizedState.tag & 1))
  ) {
    if (
      ((n.flags |= 2048),
      Cl(9, $d.bind(null, n, r, s, t), void 0, null),
      De === null)
    )
      throw Error(P(349));
    Gn & 30 || Od(n, t, s);
  }
  return s;
}
function Od(e, t, n) {
  ((e.flags |= 16384),
    (e = { getSnapshot: t, value: n }),
    (t = Ne.updateQueue),
    t === null
      ? ((t = { lastEffect: null, stores: null }),
        (Ne.updateQueue = t),
        (t.stores = [e]))
      : ((n = t.stores), n === null ? (t.stores = [e]) : n.push(e)));
}
function $d(e, t, n, r) {
  ((t.value = n), (t.getSnapshot = r), Ud(t) && Bd(e));
}
function Ad(e, t, n) {
  return n(function () {
    Ud(t) && Bd(e);
  });
}
function Ud(e) {
  var t = e.getSnapshot;
  e = e.value;
  try {
    var n = t();
    return !Mt(e, n);
  } catch {
    return !0;
  }
}
function Bd(e) {
  var t = rn(e, 1);
  t !== null && Pt(t, e, 1, -1);
}
function Ru(e) {
  var t = Ut();
  return (
    typeof e == "function" && (e = e()),
    (t.memoizedState = t.baseState = e),
    (e = {
      pending: null,
      interleaved: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Sl,
      lastRenderedState: e,
    }),
    (t.queue = e),
    (e = e.dispatch = Kh.bind(null, Ne, e)),
    [t.memoizedState, e]
  );
}
function Cl(e, t, n, r) {
  return (
    (e = { tag: e, create: t, destroy: n, deps: r, next: null }),
    (t = Ne.updateQueue),
    t === null
      ? ((t = { lastEffect: null, stores: null }),
        (Ne.updateQueue = t),
        (t.lastEffect = e.next = e))
      : ((n = t.lastEffect),
        n === null
          ? (t.lastEffect = e.next = e)
          : ((r = n.next), (n.next = e), (e.next = r), (t.lastEffect = e))),
    e
  );
}
function Wd() {
  return Nt().memoizedState;
}
function ms(e, t, n, r) {
  var s = Ut();
  ((Ne.flags |= e),
    (s.memoizedState = Cl(1 | t, n, void 0, r === void 0 ? null : r)));
}
function qs(e, t, n, r) {
  var s = Nt();
  r = r === void 0 ? null : r;
  var i = void 0;
  if (Me !== null) {
    var a = Me.memoizedState;
    if (((i = a.destroy), r !== null && xo(r, a.deps))) {
      s.memoizedState = Cl(t, n, i, r);
      return;
    }
  }
  ((Ne.flags |= e), (s.memoizedState = Cl(1 | t, n, i, r)));
}
function Lu(e, t) {
  return ms(8390656, 8, e, t);
}
function wo(e, t) {
  return qs(2048, 8, e, t);
}
function Hd(e, t) {
  return qs(4, 2, e, t);
}
function Vd(e, t) {
  return qs(4, 4, e, t);
}
function Kd(e, t) {
  if (typeof t == "function")
    return (
      (e = e()),
      t(e),
      function () {
        t(null);
      }
    );
  if (t != null)
    return (
      (e = e()),
      (t.current = e),
      function () {
        t.current = null;
      }
    );
}
function Yd(e, t, n) {
  return (
    (n = n != null ? n.concat([e]) : null),
    qs(4, 4, Kd.bind(null, t, e), n)
  );
}
function No() {}
function Qd(e, t) {
  var n = Nt();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && xo(t, r[1])
    ? r[0]
    : ((n.memoizedState = [e, t]), e);
}
function Gd(e, t) {
  var n = Nt();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && xo(t, r[1])
    ? r[0]
    : ((e = e()), (n.memoizedState = [e, t]), e);
}
function Xd(e, t, n) {
  return Gn & 21
    ? (Mt(n, t) || ((n = td()), (Ne.lanes |= n), (Xn |= n), (e.baseState = !0)),
      t)
    : (e.baseState && ((e.baseState = !1), (Ze = !0)), (e.memoizedState = n));
}
function Hh(e, t) {
  var n = ce;
  ((ce = n !== 0 && 4 > n ? n : 4), e(!0));
  var r = Ii.transition;
  Ii.transition = {};
  try {
    (e(!1), t());
  } finally {
    ((ce = n), (Ii.transition = r));
  }
}
function Jd() {
  return Nt().memoizedState;
}
function Vh(e, t, n) {
  var r = En(e);
  if (
    ((n = {
      lane: r,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    }),
    qd(e))
  )
    Zd(t, n);
  else if (((n = Md(e, t, n, r)), n !== null)) {
    var s = Qe();
    (Pt(n, e, r, s), ef(n, t, r));
  }
}
function Kh(e, t, n) {
  var r = En(e),
    s = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
  if (qd(e)) Zd(t, s);
  else {
    var i = e.alternate;
    if (
      e.lanes === 0 &&
      (i === null || i.lanes === 0) &&
      ((i = t.lastRenderedReducer), i !== null)
    )
      try {
        var a = t.lastRenderedState,
          u = i(a, n);
        if (((s.hasEagerState = !0), (s.eagerState = u), Mt(u, a))) {
          var o = t.interleaved;
          (o === null
            ? ((s.next = s), po(t))
            : ((s.next = o.next), (o.next = s)),
            (t.interleaved = s));
          return;
        }
      } catch {
      } finally {
      }
    ((n = Md(e, t, s, r)),
      n !== null && ((s = Qe()), Pt(n, e, r, s), ef(n, t, r)));
  }
}
function qd(e) {
  var t = e.alternate;
  return e === Ne || (t !== null && t === Ne);
}
function Zd(e, t) {
  il = Ds = !0;
  var n = e.pending;
  (n === null ? (t.next = t) : ((t.next = n.next), (n.next = t)),
    (e.pending = t));
}
function ef(e, t, n) {
  if (n & 4194240) {
    var r = t.lanes;
    ((r &= e.pendingLanes), (n |= r), (t.lanes = n), qa(e, n));
  }
}
var Os = {
    readContext: wt,
    useCallback: Ue,
    useContext: Ue,
    useEffect: Ue,
    useImperativeHandle: Ue,
    useInsertionEffect: Ue,
    useLayoutEffect: Ue,
    useMemo: Ue,
    useReducer: Ue,
    useRef: Ue,
    useState: Ue,
    useDebugValue: Ue,
    useDeferredValue: Ue,
    useTransition: Ue,
    useMutableSource: Ue,
    useSyncExternalStore: Ue,
    useId: Ue,
    unstable_isNewReconciler: !1,
  },
  Yh = {
    readContext: wt,
    useCallback: function (e, t) {
      return ((Ut().memoizedState = [e, t === void 0 ? null : t]), e);
    },
    useContext: wt,
    useEffect: Lu,
    useImperativeHandle: function (e, t, n) {
      return (
        (n = n != null ? n.concat([e]) : null),
        ms(4194308, 4, Kd.bind(null, t, e), n)
      );
    },
    useLayoutEffect: function (e, t) {
      return ms(4194308, 4, e, t);
    },
    useInsertionEffect: function (e, t) {
      return ms(4, 2, e, t);
    },
    useMemo: function (e, t) {
      var n = Ut();
      return (
        (t = t === void 0 ? null : t),
        (e = e()),
        (n.memoizedState = [e, t]),
        e
      );
    },
    useReducer: function (e, t, n) {
      var r = Ut();
      return (
        (t = n !== void 0 ? n(t) : t),
        (r.memoizedState = r.baseState = t),
        (e = {
          pending: null,
          interleaved: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: e,
          lastRenderedState: t,
        }),
        (r.queue = e),
        (e = e.dispatch = Vh.bind(null, Ne, e)),
        [r.memoizedState, e]
      );
    },
    useRef: function (e) {
      var t = Ut();
      return ((e = { current: e }), (t.memoizedState = e));
    },
    useState: Ru,
    useDebugValue: No,
    useDeferredValue: function (e) {
      return (Ut().memoizedState = e);
    },
    useTransition: function () {
      var e = Ru(!1),
        t = e[0];
      return ((e = Hh.bind(null, e[1])), (Ut().memoizedState = e), [t, e]);
    },
    useMutableSource: function () {},
    useSyncExternalStore: function (e, t, n) {
      var r = Ne,
        s = Ut();
      if (xe) {
        if (n === void 0) throw Error(P(407));
        n = n();
      } else {
        if (((n = t()), De === null)) throw Error(P(349));
        Gn & 30 || Od(r, t, n);
      }
      s.memoizedState = n;
      var i = { value: n, getSnapshot: t };
      return (
        (s.queue = i),
        Lu(Ad.bind(null, r, i, e), [e]),
        (r.flags |= 2048),
        Cl(9, $d.bind(null, r, i, n, t), void 0, null),
        n
      );
    },
    useId: function () {
      var e = Ut(),
        t = De.identifierPrefix;
      if (xe) {
        var n = Zt,
          r = qt;
        ((n = (r & ~(1 << (32 - Tt(r) - 1))).toString(32) + n),
          (t = ":" + t + "R" + n),
          (n = kl++),
          0 < n && (t += "H" + n.toString(32)),
          (t += ":"));
      } else ((n = Wh++), (t = ":" + t + "r" + n.toString(32) + ":"));
      return (e.memoizedState = t);
    },
    unstable_isNewReconciler: !1,
  },
  Qh = {
    readContext: wt,
    useCallback: Qd,
    useContext: wt,
    useEffect: wo,
    useImperativeHandle: Yd,
    useInsertionEffect: Hd,
    useLayoutEffect: Vd,
    useMemo: Gd,
    useReducer: Di,
    useRef: Wd,
    useState: function () {
      return Di(Sl);
    },
    useDebugValue: No,
    useDeferredValue: function (e) {
      var t = Nt();
      return Xd(t, Me.memoizedState, e);
    },
    useTransition: function () {
      var e = Di(Sl)[0],
        t = Nt().memoizedState;
      return [e, t];
    },
    useMutableSource: Id,
    useSyncExternalStore: Dd,
    useId: Jd,
    unstable_isNewReconciler: !1,
  },
  Gh = {
    readContext: wt,
    useCallback: Qd,
    useContext: wt,
    useEffect: wo,
    useImperativeHandle: Yd,
    useInsertionEffect: Hd,
    useLayoutEffect: Vd,
    useMemo: Gd,
    useReducer: Oi,
    useRef: Wd,
    useState: function () {
      return Oi(Sl);
    },
    useDebugValue: No,
    useDeferredValue: function (e) {
      var t = Nt();
      return Me === null ? (t.memoizedState = e) : Xd(t, Me.memoizedState, e);
    },
    useTransition: function () {
      var e = Oi(Sl)[0],
        t = Nt().memoizedState;
      return [e, t];
    },
    useMutableSource: Id,
    useSyncExternalStore: Dd,
    useId: Jd,
    unstable_isNewReconciler: !1,
  };
function Et(e, t) {
  if (e && e.defaultProps) {
    ((t = ke({}, t)), (e = e.defaultProps));
    for (var n in e) t[n] === void 0 && (t[n] = e[n]);
    return t;
  }
  return t;
}
function Sa(e, t, n, r) {
  ((t = e.memoizedState),
    (n = n(r, t)),
    (n = n == null ? t : ke({}, t, n)),
    (e.memoizedState = n),
    e.lanes === 0 && (e.updateQueue.baseState = n));
}
var Zs = {
  isMounted: function (e) {
    return (e = e._reactInternals) ? Zn(e) === e : !1;
  },
  enqueueSetState: function (e, t, n) {
    e = e._reactInternals;
    var r = Qe(),
      s = En(e),
      i = en(r, s);
    ((i.payload = t),
      n != null && (i.callback = n),
      (t = _n(e, i, s)),
      t !== null && (Pt(t, e, s, r), ps(t, e, s)));
  },
  enqueueReplaceState: function (e, t, n) {
    e = e._reactInternals;
    var r = Qe(),
      s = En(e),
      i = en(r, s);
    ((i.tag = 1),
      (i.payload = t),
      n != null && (i.callback = n),
      (t = _n(e, i, s)),
      t !== null && (Pt(t, e, s, r), ps(t, e, s)));
  },
  enqueueForceUpdate: function (e, t) {
    e = e._reactInternals;
    var n = Qe(),
      r = En(e),
      s = en(n, r);
    ((s.tag = 2),
      t != null && (s.callback = t),
      (t = _n(e, s, r)),
      t !== null && (Pt(t, e, r, n), ps(t, e, r)));
  },
};
function Iu(e, t, n, r, s, i, a) {
  return (
    (e = e.stateNode),
    typeof e.shouldComponentUpdate == "function"
      ? e.shouldComponentUpdate(r, i, a)
      : t.prototype && t.prototype.isPureReactComponent
        ? !vl(n, r) || !vl(s, i)
        : !0
  );
}
function tf(e, t, n) {
  var r = !1,
    s = Tn,
    i = t.contextType;
  return (
    typeof i == "object" && i !== null
      ? (i = wt(i))
      : ((s = tt(t) ? Yn : He.current),
        (r = t.contextTypes),
        (i = (r = r != null) ? br(e, s) : Tn)),
    (t = new t(n, i)),
    (e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null),
    (t.updater = Zs),
    (e.stateNode = t),
    (t._reactInternals = e),
    r &&
      ((e = e.stateNode),
      (e.__reactInternalMemoizedUnmaskedChildContext = s),
      (e.__reactInternalMemoizedMaskedChildContext = i)),
    t
  );
}
function Du(e, t, n, r) {
  ((e = t.state),
    typeof t.componentWillReceiveProps == "function" &&
      t.componentWillReceiveProps(n, r),
    typeof t.UNSAFE_componentWillReceiveProps == "function" &&
      t.UNSAFE_componentWillReceiveProps(n, r),
    t.state !== e && Zs.enqueueReplaceState(t, t.state, null));
}
function Ca(e, t, n, r) {
  var s = e.stateNode;
  ((s.props = n), (s.state = e.memoizedState), (s.refs = {}), ho(e));
  var i = t.contextType;
  (typeof i == "object" && i !== null
    ? (s.context = wt(i))
    : ((i = tt(t) ? Yn : He.current), (s.context = br(e, i))),
    (s.state = e.memoizedState),
    (i = t.getDerivedStateFromProps),
    typeof i == "function" && (Sa(e, t, i, n), (s.state = e.memoizedState)),
    typeof t.getDerivedStateFromProps == "function" ||
      typeof s.getSnapshotBeforeUpdate == "function" ||
      (typeof s.UNSAFE_componentWillMount != "function" &&
        typeof s.componentWillMount != "function") ||
      ((t = s.state),
      typeof s.componentWillMount == "function" && s.componentWillMount(),
      typeof s.UNSAFE_componentWillMount == "function" &&
        s.UNSAFE_componentWillMount(),
      t !== s.state && Zs.enqueueReplaceState(s, s.state, null),
      Ls(e, n, s, r),
      (s.state = e.memoizedState)),
    typeof s.componentDidMount == "function" && (e.flags |= 4194308));
}
function Tr(e, t) {
  try {
    var n = "",
      r = t;
    do ((n += kp(r)), (r = r.return));
    while (r);
    var s = n;
  } catch (i) {
    s =
      `
Error generating stack: ` +
      i.message +
      `
` +
      i.stack;
  }
  return { value: e, source: t, stack: s, digest: null };
}
function $i(e, t, n) {
  return { value: e, source: null, stack: n ?? null, digest: t ?? null };
}
function _a(e, t) {
  try {
    console.error(t.value);
  } catch (n) {
    setTimeout(function () {
      throw n;
    });
  }
}
var Xh = typeof WeakMap == "function" ? WeakMap : Map;
function nf(e, t, n) {
  ((n = en(-1, n)), (n.tag = 3), (n.payload = { element: null }));
  var r = t.value;
  return (
    (n.callback = function () {
      (As || ((As = !0), (Ia = r)), _a(e, t));
    }),
    n
  );
}
function rf(e, t, n) {
  ((n = en(-1, n)), (n.tag = 3));
  var r = e.type.getDerivedStateFromError;
  if (typeof r == "function") {
    var s = t.value;
    ((n.payload = function () {
      return r(s);
    }),
      (n.callback = function () {
        _a(e, t);
      }));
  }
  var i = e.stateNode;
  return (
    i !== null &&
      typeof i.componentDidCatch == "function" &&
      (n.callback = function () {
        (_a(e, t),
          typeof r != "function" &&
            (bn === null ? (bn = new Set([this])) : bn.add(this)));
        var a = t.stack;
        this.componentDidCatch(t.value, {
          componentStack: a !== null ? a : "",
        });
      }),
    n
  );
}
function Ou(e, t, n) {
  var r = e.pingCache;
  if (r === null) {
    r = e.pingCache = new Xh();
    var s = new Set();
    r.set(t, s);
  } else ((s = r.get(t)), s === void 0 && ((s = new Set()), r.set(t, s)));
  s.has(n) || (s.add(n), (e = cm.bind(null, e, t, n)), t.then(e, e));
}
function $u(e) {
  do {
    var t;
    if (
      ((t = e.tag === 13) &&
        ((t = e.memoizedState), (t = t !== null ? t.dehydrated !== null : !0)),
      t)
    )
      return e;
    e = e.return;
  } while (e !== null);
  return null;
}
function Au(e, t, n, r, s) {
  return e.mode & 1
    ? ((e.flags |= 65536), (e.lanes = s), e)
    : (e === t
        ? (e.flags |= 65536)
        : ((e.flags |= 128),
          (n.flags |= 131072),
          (n.flags &= -52805),
          n.tag === 1 &&
            (n.alternate === null
              ? (n.tag = 17)
              : ((t = en(-1, 1)), (t.tag = 2), _n(n, t, 1))),
          (n.lanes |= 1)),
      e);
}
var Jh = sn.ReactCurrentOwner,
  Ze = !1;
function Ye(e, t, n, r) {
  t.child = e === null ? Pd(t, null, n, r) : zr(t, e.child, n, r);
}
function Uu(e, t, n, r, s) {
  n = n.render;
  var i = t.ref;
  return (
    Sr(t, s),
    (r = yo(e, t, n, r, i, s)),
    (n = jo()),
    e !== null && !Ze
      ? ((t.updateQueue = e.updateQueue),
        (t.flags &= -2053),
        (e.lanes &= ~s),
        ln(e, t, s))
      : (xe && n && io(t), (t.flags |= 1), Ye(e, t, r, s), t.child)
  );
}
function Bu(e, t, n, r, s) {
  if (e === null) {
    var i = n.type;
    return typeof i == "function" &&
      !Fo(i) &&
      i.defaultProps === void 0 &&
      n.compare === null &&
      n.defaultProps === void 0
      ? ((t.tag = 15), (t.type = i), lf(e, t, i, r, s))
      : ((e = ys(n.type, null, r, t, t.mode, s)),
        (e.ref = t.ref),
        (e.return = t),
        (t.child = e));
  }
  if (((i = e.child), !(e.lanes & s))) {
    var a = i.memoizedProps;
    if (
      ((n = n.compare), (n = n !== null ? n : vl), n(a, r) && e.ref === t.ref)
    )
      return ln(e, t, s);
  }
  return (
    (t.flags |= 1),
    (e = zn(i, r)),
    (e.ref = t.ref),
    (e.return = t),
    (t.child = e)
  );
}
function lf(e, t, n, r, s) {
  if (e !== null) {
    var i = e.memoizedProps;
    if (vl(i, r) && e.ref === t.ref)
      if (((Ze = !1), (t.pendingProps = r = i), (e.lanes & s) !== 0))
        e.flags & 131072 && (Ze = !0);
      else return ((t.lanes = e.lanes), ln(e, t, s));
  }
  return ba(e, t, n, r, s);
}
function sf(e, t, n) {
  var r = t.pendingProps,
    s = r.children,
    i = e !== null ? e.memoizedState : null;
  if (r.mode === "hidden")
    if (!(t.mode & 1))
      ((t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        he(yr, at),
        (at |= n));
    else {
      if (!(n & 1073741824))
        return (
          (e = i !== null ? i.baseLanes | n : n),
          (t.lanes = t.childLanes = 1073741824),
          (t.memoizedState = {
            baseLanes: e,
            cachePool: null,
            transitions: null,
          }),
          (t.updateQueue = null),
          he(yr, at),
          (at |= e),
          null
        );
      ((t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        (r = i !== null ? i.baseLanes : n),
        he(yr, at),
        (at |= r));
    }
  else
    (i !== null ? ((r = i.baseLanes | n), (t.memoizedState = null)) : (r = n),
      he(yr, at),
      (at |= r));
  return (Ye(e, t, s, n), t.child);
}
function af(e, t) {
  var n = t.ref;
  ((e === null && n !== null) || (e !== null && e.ref !== n)) &&
    ((t.flags |= 512), (t.flags |= 2097152));
}
function ba(e, t, n, r, s) {
  var i = tt(n) ? Yn : He.current;
  return (
    (i = br(t, i)),
    Sr(t, s),
    (n = yo(e, t, n, r, i, s)),
    (r = jo()),
    e !== null && !Ze
      ? ((t.updateQueue = e.updateQueue),
        (t.flags &= -2053),
        (e.lanes &= ~s),
        ln(e, t, s))
      : (xe && r && io(t), (t.flags |= 1), Ye(e, t, n, s), t.child)
  );
}
function Wu(e, t, n, r, s) {
  if (tt(n)) {
    var i = !0;
    Fs(t);
  } else i = !1;
  if ((Sr(t, s), t.stateNode === null))
    (gs(e, t), tf(t, n, r), Ca(t, n, r, s), (r = !0));
  else if (e === null) {
    var a = t.stateNode,
      u = t.memoizedProps;
    a.props = u;
    var o = a.context,
      d = n.contextType;
    typeof d == "object" && d !== null
      ? (d = wt(d))
      : ((d = tt(n) ? Yn : He.current), (d = br(t, d)));
    var g = n.getDerivedStateFromProps,
      m =
        typeof g == "function" ||
        typeof a.getSnapshotBeforeUpdate == "function";
    (m ||
      (typeof a.UNSAFE_componentWillReceiveProps != "function" &&
        typeof a.componentWillReceiveProps != "function") ||
      ((u !== r || o !== d) && Du(t, a, r, d)),
      (vn = !1));
    var p = t.memoizedState;
    ((a.state = p),
      Ls(t, r, a, s),
      (o = t.memoizedState),
      u !== r || p !== o || et.current || vn
        ? (typeof g == "function" && (Sa(t, n, g, r), (o = t.memoizedState)),
          (u = vn || Iu(t, n, u, r, p, o, d))
            ? (m ||
                (typeof a.UNSAFE_componentWillMount != "function" &&
                  typeof a.componentWillMount != "function") ||
                (typeof a.componentWillMount == "function" &&
                  a.componentWillMount(),
                typeof a.UNSAFE_componentWillMount == "function" &&
                  a.UNSAFE_componentWillMount()),
              typeof a.componentDidMount == "function" && (t.flags |= 4194308))
            : (typeof a.componentDidMount == "function" && (t.flags |= 4194308),
              (t.memoizedProps = r),
              (t.memoizedState = o)),
          (a.props = r),
          (a.state = o),
          (a.context = d),
          (r = u))
        : (typeof a.componentDidMount == "function" && (t.flags |= 4194308),
          (r = !1)));
  } else {
    ((a = t.stateNode),
      Rd(e, t),
      (u = t.memoizedProps),
      (d = t.type === t.elementType ? u : Et(t.type, u)),
      (a.props = d),
      (m = t.pendingProps),
      (p = a.context),
      (o = n.contextType),
      typeof o == "object" && o !== null
        ? (o = wt(o))
        : ((o = tt(n) ? Yn : He.current), (o = br(t, o))));
    var w = n.getDerivedStateFromProps;
    ((g =
      typeof w == "function" ||
      typeof a.getSnapshotBeforeUpdate == "function") ||
      (typeof a.UNSAFE_componentWillReceiveProps != "function" &&
        typeof a.componentWillReceiveProps != "function") ||
      ((u !== m || p !== o) && Du(t, a, r, o)),
      (vn = !1),
      (p = t.memoizedState),
      (a.state = p),
      Ls(t, r, a, s));
    var _ = t.memoizedState;
    u !== m || p !== _ || et.current || vn
      ? (typeof w == "function" && (Sa(t, n, w, r), (_ = t.memoizedState)),
        (d = vn || Iu(t, n, d, r, p, _, o) || !1)
          ? (g ||
              (typeof a.UNSAFE_componentWillUpdate != "function" &&
                typeof a.componentWillUpdate != "function") ||
              (typeof a.componentWillUpdate == "function" &&
                a.componentWillUpdate(r, _, o),
              typeof a.UNSAFE_componentWillUpdate == "function" &&
                a.UNSAFE_componentWillUpdate(r, _, o)),
            typeof a.componentDidUpdate == "function" && (t.flags |= 4),
            typeof a.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024))
          : (typeof a.componentDidUpdate != "function" ||
              (u === e.memoizedProps && p === e.memoizedState) ||
              (t.flags |= 4),
            typeof a.getSnapshotBeforeUpdate != "function" ||
              (u === e.memoizedProps && p === e.memoizedState) ||
              (t.flags |= 1024),
            (t.memoizedProps = r),
            (t.memoizedState = _)),
        (a.props = r),
        (a.state = _),
        (a.context = o),
        (r = d))
      : (typeof a.componentDidUpdate != "function" ||
          (u === e.memoizedProps && p === e.memoizedState) ||
          (t.flags |= 4),
        typeof a.getSnapshotBeforeUpdate != "function" ||
          (u === e.memoizedProps && p === e.memoizedState) ||
          (t.flags |= 1024),
        (r = !1));
  }
  return Ea(e, t, n, r, i, s);
}
function Ea(e, t, n, r, s, i) {
  af(e, t);
  var a = (t.flags & 128) !== 0;
  if (!r && !a) return (s && Eu(t, n, !1), ln(e, t, i));
  ((r = t.stateNode), (Jh.current = t));
  var u =
    a && typeof n.getDerivedStateFromError != "function" ? null : r.render();
  return (
    (t.flags |= 1),
    e !== null && a
      ? ((t.child = zr(t, e.child, null, i)), (t.child = zr(t, null, u, i)))
      : Ye(e, t, u, i),
    (t.memoizedState = r.state),
    s && Eu(t, n, !0),
    t.child
  );
}
function of(e) {
  var t = e.stateNode;
  (t.pendingContext
    ? bu(e, t.pendingContext, t.pendingContext !== t.context)
    : t.context && bu(e, t.context, !1),
    mo(e, t.containerInfo));
}
function Hu(e, t, n, r, s) {
  return (Er(), oo(s), (t.flags |= 256), Ye(e, t, n, r), t.child);
}
var za = { dehydrated: null, treeContext: null, retryLane: 0 };
function Fa(e) {
  return { baseLanes: e, cachePool: null, transitions: null };
}
function uf(e, t, n) {
  var r = t.pendingProps,
    s = we.current,
    i = !1,
    a = (t.flags & 128) !== 0,
    u;
  if (
    ((u = a) ||
      (u = e !== null && e.memoizedState === null ? !1 : (s & 2) !== 0),
    u
      ? ((i = !0), (t.flags &= -129))
      : (e === null || e.memoizedState !== null) && (s |= 1),
    he(we, s & 1),
    e === null)
  )
    return (
      Na(t),
      (e = t.memoizedState),
      e !== null && ((e = e.dehydrated), e !== null)
        ? (t.mode & 1
            ? e.data === "$!"
              ? (t.lanes = 8)
              : (t.lanes = 1073741824)
            : (t.lanes = 1),
          null)
        : ((a = r.children),
          (e = r.fallback),
          i
            ? ((r = t.mode),
              (i = t.child),
              (a = { mode: "hidden", children: a }),
              !(r & 1) && i !== null
                ? ((i.childLanes = 0), (i.pendingProps = a))
                : (i = ni(a, r, 0, null)),
              (e = Kn(e, r, n, null)),
              (i.return = t),
              (e.return = t),
              (i.sibling = e),
              (t.child = i),
              (t.child.memoizedState = Fa(n)),
              (t.memoizedState = za),
              e)
            : ko(t, a))
    );
  if (((s = e.memoizedState), s !== null && ((u = s.dehydrated), u !== null)))
    return qh(e, t, a, r, u, s, n);
  if (i) {
    ((i = r.fallback), (a = t.mode), (s = e.child), (u = s.sibling));
    var o = { mode: "hidden", children: r.children };
    return (
      !(a & 1) && t.child !== s
        ? ((r = t.child),
          (r.childLanes = 0),
          (r.pendingProps = o),
          (t.deletions = null))
        : ((r = zn(s, o)), (r.subtreeFlags = s.subtreeFlags & 14680064)),
      u !== null ? (i = zn(u, i)) : ((i = Kn(i, a, n, null)), (i.flags |= 2)),
      (i.return = t),
      (r.return = t),
      (r.sibling = i),
      (t.child = r),
      (r = i),
      (i = t.child),
      (a = e.child.memoizedState),
      (a =
        a === null
          ? Fa(n)
          : {
              baseLanes: a.baseLanes | n,
              cachePool: null,
              transitions: a.transitions,
            }),
      (i.memoizedState = a),
      (i.childLanes = e.childLanes & ~n),
      (t.memoizedState = za),
      r
    );
  }
  return (
    (i = e.child),
    (e = i.sibling),
    (r = zn(i, { mode: "visible", children: r.children })),
    !(t.mode & 1) && (r.lanes = n),
    (r.return = t),
    (r.sibling = null),
    e !== null &&
      ((n = t.deletions),
      n === null ? ((t.deletions = [e]), (t.flags |= 16)) : n.push(e)),
    (t.child = r),
    (t.memoizedState = null),
    r
  );
}
function ko(e, t) {
  return (
    (t = ni({ mode: "visible", children: t }, e.mode, 0, null)),
    (t.return = e),
    (e.child = t)
  );
}
function ns(e, t, n, r) {
  return (
    r !== null && oo(r),
    zr(t, e.child, null, n),
    (e = ko(t, t.pendingProps.children)),
    (e.flags |= 2),
    (t.memoizedState = null),
    e
  );
}
function qh(e, t, n, r, s, i, a) {
  if (n)
    return t.flags & 256
      ? ((t.flags &= -257), (r = $i(Error(P(422)))), ns(e, t, a, r))
      : t.memoizedState !== null
        ? ((t.child = e.child), (t.flags |= 128), null)
        : ((i = r.fallback),
          (s = t.mode),
          (r = ni({ mode: "visible", children: r.children }, s, 0, null)),
          (i = Kn(i, s, a, null)),
          (i.flags |= 2),
          (r.return = t),
          (i.return = t),
          (r.sibling = i),
          (t.child = r),
          t.mode & 1 && zr(t, e.child, null, a),
          (t.child.memoizedState = Fa(a)),
          (t.memoizedState = za),
          i);
  if (!(t.mode & 1)) return ns(e, t, a, null);
  if (s.data === "$!") {
    if (((r = s.nextSibling && s.nextSibling.dataset), r)) var u = r.dgst;
    return (
      (r = u),
      (i = Error(P(419))),
      (r = $i(i, r, void 0)),
      ns(e, t, a, r)
    );
  }
  if (((u = (a & e.childLanes) !== 0), Ze || u)) {
    if (((r = De), r !== null)) {
      switch (a & -a) {
        case 4:
          s = 2;
          break;
        case 16:
          s = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          s = 32;
          break;
        case 536870912:
          s = 268435456;
          break;
        default:
          s = 0;
      }
      ((s = s & (r.suspendedLanes | a) ? 0 : s),
        s !== 0 &&
          s !== i.retryLane &&
          ((i.retryLane = s), rn(e, s), Pt(r, e, s, -1)));
    }
    return (zo(), (r = $i(Error(P(421)))), ns(e, t, a, r));
  }
  return s.data === "$?"
    ? ((t.flags |= 128),
      (t.child = e.child),
      (t = dm.bind(null, e)),
      (s._reactRetry = t),
      null)
    : ((e = i.treeContext),
      (ot = Cn(s.nextSibling)),
      (ut = t),
      (xe = !0),
      (Ft = null),
      e !== null &&
        ((vt[xt++] = qt),
        (vt[xt++] = Zt),
        (vt[xt++] = Qn),
        (qt = e.id),
        (Zt = e.overflow),
        (Qn = t)),
      (t = ko(t, r.children)),
      (t.flags |= 4096),
      t);
}
function Vu(e, t, n) {
  e.lanes |= t;
  var r = e.alternate;
  (r !== null && (r.lanes |= t), ka(e.return, t, n));
}
function Ai(e, t, n, r, s) {
  var i = e.memoizedState;
  i === null
    ? (e.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: r,
        tail: n,
        tailMode: s,
      })
    : ((i.isBackwards = t),
      (i.rendering = null),
      (i.renderingStartTime = 0),
      (i.last = r),
      (i.tail = n),
      (i.tailMode = s));
}
function cf(e, t, n) {
  var r = t.pendingProps,
    s = r.revealOrder,
    i = r.tail;
  if ((Ye(e, t, r.children, n), (r = we.current), r & 2))
    ((r = (r & 1) | 2), (t.flags |= 128));
  else {
    if (e !== null && e.flags & 128)
      e: for (e = t.child; e !== null;) {
        if (e.tag === 13) e.memoizedState !== null && Vu(e, n, t);
        else if (e.tag === 19) Vu(e, n, t);
        else if (e.child !== null) {
          ((e.child.return = e), (e = e.child));
          continue;
        }
        if (e === t) break e;
        for (; e.sibling === null;) {
          if (e.return === null || e.return === t) break e;
          e = e.return;
        }
        ((e.sibling.return = e.return), (e = e.sibling));
      }
    r &= 1;
  }
  if ((he(we, r), !(t.mode & 1))) t.memoizedState = null;
  else
    switch (s) {
      case "forwards":
        for (n = t.child, s = null; n !== null;)
          ((e = n.alternate),
            e !== null && Is(e) === null && (s = n),
            (n = n.sibling));
        ((n = s),
          n === null
            ? ((s = t.child), (t.child = null))
            : ((s = n.sibling), (n.sibling = null)),
          Ai(t, !1, s, n, i));
        break;
      case "backwards":
        for (n = null, s = t.child, t.child = null; s !== null;) {
          if (((e = s.alternate), e !== null && Is(e) === null)) {
            t.child = s;
            break;
          }
          ((e = s.sibling), (s.sibling = n), (n = s), (s = e));
        }
        Ai(t, !0, n, null, i);
        break;
      case "together":
        Ai(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
  return t.child;
}
function gs(e, t) {
  !(t.mode & 1) &&
    e !== null &&
    ((e.alternate = null), (t.alternate = null), (t.flags |= 2));
}
function ln(e, t, n) {
  if (
    (e !== null && (t.dependencies = e.dependencies),
    (Xn |= t.lanes),
    !(n & t.childLanes))
  )
    return null;
  if (e !== null && t.child !== e.child) throw Error(P(153));
  if (t.child !== null) {
    for (
      e = t.child, n = zn(e, e.pendingProps), t.child = n, n.return = t;
      e.sibling !== null;
    )
      ((e = e.sibling),
        (n = n.sibling = zn(e, e.pendingProps)),
        (n.return = t));
    n.sibling = null;
  }
  return t.child;
}
function Zh(e, t, n) {
  switch (t.tag) {
    case 3:
      (of(t), Er());
      break;
    case 5:
      Ld(t);
      break;
    case 1:
      tt(t.type) && Fs(t);
      break;
    case 4:
      mo(t, t.stateNode.containerInfo);
      break;
    case 10:
      var r = t.type._context,
        s = t.memoizedProps.value;
      (he(Ms, r._currentValue), (r._currentValue = s));
      break;
    case 13:
      if (((r = t.memoizedState), r !== null))
        return r.dehydrated !== null
          ? (he(we, we.current & 1), (t.flags |= 128), null)
          : n & t.child.childLanes
            ? uf(e, t, n)
            : (he(we, we.current & 1),
              (e = ln(e, t, n)),
              e !== null ? e.sibling : null);
      he(we, we.current & 1);
      break;
    case 19:
      if (((r = (n & t.childLanes) !== 0), e.flags & 128)) {
        if (r) return cf(e, t, n);
        t.flags |= 128;
      }
      if (
        ((s = t.memoizedState),
        s !== null &&
          ((s.rendering = null), (s.tail = null), (s.lastEffect = null)),
        he(we, we.current),
        r)
      )
        break;
      return null;
    case 22:
    case 23:
      return ((t.lanes = 0), sf(e, t, n));
  }
  return ln(e, t, n);
}
var df, Ta, ff, pf;
df = function (e, t) {
  for (var n = t.child; n !== null;) {
    if (n.tag === 5 || n.tag === 6) e.appendChild(n.stateNode);
    else if (n.tag !== 4 && n.child !== null) {
      ((n.child.return = n), (n = n.child));
      continue;
    }
    if (n === t) break;
    for (; n.sibling === null;) {
      if (n.return === null || n.return === t) return;
      n = n.return;
    }
    ((n.sibling.return = n.return), (n = n.sibling));
  }
};
Ta = function () {};
ff = function (e, t, n, r) {
  var s = e.memoizedProps;
  if (s !== r) {
    ((e = t.stateNode), Hn(Vt.current));
    var i = null;
    switch (n) {
      case "input":
        ((s = Zi(e, s)), (r = Zi(e, r)), (i = []));
        break;
      case "select":
        ((s = ke({}, s, { value: void 0 })),
          (r = ke({}, r, { value: void 0 })),
          (i = []));
        break;
      case "textarea":
        ((s = na(e, s)), (r = na(e, r)), (i = []));
        break;
      default:
        typeof s.onClick != "function" &&
          typeof r.onClick == "function" &&
          (e.onclick = Es);
    }
    la(n, r);
    var a;
    n = null;
    for (d in s)
      if (!r.hasOwnProperty(d) && s.hasOwnProperty(d) && s[d] != null)
        if (d === "style") {
          var u = s[d];
          for (a in u) u.hasOwnProperty(a) && (n || (n = {}), (n[a] = ""));
        } else
          d !== "dangerouslySetInnerHTML" &&
            d !== "children" &&
            d !== "suppressContentEditableWarning" &&
            d !== "suppressHydrationWarning" &&
            d !== "autoFocus" &&
            (cl.hasOwnProperty(d)
              ? i || (i = [])
              : (i = i || []).push(d, null));
    for (d in r) {
      var o = r[d];
      if (
        ((u = s != null ? s[d] : void 0),
        r.hasOwnProperty(d) && o !== u && (o != null || u != null))
      )
        if (d === "style")
          if (u) {
            for (a in u)
              !u.hasOwnProperty(a) ||
                (o && o.hasOwnProperty(a)) ||
                (n || (n = {}), (n[a] = ""));
            for (a in o)
              o.hasOwnProperty(a) &&
                u[a] !== o[a] &&
                (n || (n = {}), (n[a] = o[a]));
          } else (n || (i || (i = []), i.push(d, n)), (n = o));
        else
          d === "dangerouslySetInnerHTML"
            ? ((o = o ? o.__html : void 0),
              (u = u ? u.__html : void 0),
              o != null && u !== o && (i = i || []).push(d, o))
            : d === "children"
              ? (typeof o != "string" && typeof o != "number") ||
                (i = i || []).push(d, "" + o)
              : d !== "suppressContentEditableWarning" &&
                d !== "suppressHydrationWarning" &&
                (cl.hasOwnProperty(d)
                  ? (o != null && d === "onScroll" && ge("scroll", e),
                    i || u === o || (i = []))
                  : (i = i || []).push(d, o));
    }
    n && (i = i || []).push("style", n);
    var d = i;
    (t.updateQueue = d) && (t.flags |= 4);
  }
};
pf = function (e, t, n, r) {
  n !== r && (t.flags |= 4);
};
function Yr(e, t) {
  if (!xe)
    switch (e.tailMode) {
      case "hidden":
        t = e.tail;
        for (var n = null; t !== null;)
          (t.alternate !== null && (n = t), (t = t.sibling));
        n === null ? (e.tail = null) : (n.sibling = null);
        break;
      case "collapsed":
        n = e.tail;
        for (var r = null; n !== null;)
          (n.alternate !== null && (r = n), (n = n.sibling));
        r === null
          ? t || e.tail === null
            ? (e.tail = null)
            : (e.tail.sibling = null)
          : (r.sibling = null);
    }
}
function Be(e) {
  var t = e.alternate !== null && e.alternate.child === e.child,
    n = 0,
    r = 0;
  if (t)
    for (var s = e.child; s !== null;)
      ((n |= s.lanes | s.childLanes),
        (r |= s.subtreeFlags & 14680064),
        (r |= s.flags & 14680064),
        (s.return = e),
        (s = s.sibling));
  else
    for (s = e.child; s !== null;)
      ((n |= s.lanes | s.childLanes),
        (r |= s.subtreeFlags),
        (r |= s.flags),
        (s.return = e),
        (s = s.sibling));
  return ((e.subtreeFlags |= r), (e.childLanes = n), t);
}
function em(e, t, n) {
  var r = t.pendingProps;
  switch ((ao(t), t.tag)) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return (Be(t), null);
    case 1:
      return (tt(t.type) && zs(), Be(t), null);
    case 3:
      return (
        (r = t.stateNode),
        Fr(),
        ve(et),
        ve(He),
        vo(),
        r.pendingContext &&
          ((r.context = r.pendingContext), (r.pendingContext = null)),
        (e === null || e.child === null) &&
          (es(t)
            ? (t.flags |= 4)
            : e === null ||
              (e.memoizedState.isDehydrated && !(t.flags & 256)) ||
              ((t.flags |= 1024), Ft !== null && ($a(Ft), (Ft = null)))),
        Ta(e, t),
        Be(t),
        null
      );
    case 5:
      go(t);
      var s = Hn(Nl.current);
      if (((n = t.type), e !== null && t.stateNode != null))
        (ff(e, t, n, r, s),
          e.ref !== t.ref && ((t.flags |= 512), (t.flags |= 2097152)));
      else {
        if (!r) {
          if (t.stateNode === null) throw Error(P(166));
          return (Be(t), null);
        }
        if (((e = Hn(Vt.current)), es(t))) {
          ((r = t.stateNode), (n = t.type));
          var i = t.memoizedProps;
          switch (((r[Wt] = t), (r[jl] = i), (e = (t.mode & 1) !== 0), n)) {
            case "dialog":
              (ge("cancel", r), ge("close", r));
              break;
            case "iframe":
            case "object":
            case "embed":
              ge("load", r);
              break;
            case "video":
            case "audio":
              for (s = 0; s < el.length; s++) ge(el[s], r);
              break;
            case "source":
              ge("error", r);
              break;
            case "img":
            case "image":
            case "link":
              (ge("error", r), ge("load", r));
              break;
            case "details":
              ge("toggle", r);
              break;
            case "input":
              (eu(r, i), ge("invalid", r));
              break;
            case "select":
              ((r._wrapperState = { wasMultiple: !!i.multiple }),
                ge("invalid", r));
              break;
            case "textarea":
              (nu(r, i), ge("invalid", r));
          }
          (la(n, i), (s = null));
          for (var a in i)
            if (i.hasOwnProperty(a)) {
              var u = i[a];
              a === "children"
                ? typeof u == "string"
                  ? r.textContent !== u &&
                    (i.suppressHydrationWarning !== !0 &&
                      Zl(r.textContent, u, e),
                    (s = ["children", u]))
                  : typeof u == "number" &&
                    r.textContent !== "" + u &&
                    (i.suppressHydrationWarning !== !0 &&
                      Zl(r.textContent, u, e),
                    (s = ["children", "" + u]))
                : cl.hasOwnProperty(a) &&
                  u != null &&
                  a === "onScroll" &&
                  ge("scroll", r);
            }
          switch (n) {
            case "input":
              (Vl(r), tu(r, i, !0));
              break;
            case "textarea":
              (Vl(r), ru(r));
              break;
            case "select":
            case "option":
              break;
            default:
              typeof i.onClick == "function" && (r.onclick = Es);
          }
          ((r = s), (t.updateQueue = r), r !== null && (t.flags |= 4));
        } else {
          ((a = s.nodeType === 9 ? s : s.ownerDocument),
            e === "http://www.w3.org/1999/xhtml" && (e = Ac(n)),
            e === "http://www.w3.org/1999/xhtml"
              ? n === "script"
                ? ((e = a.createElement("div")),
                  (e.innerHTML = "<script><\/script>"),
                  (e = e.removeChild(e.firstChild)))
                : typeof r.is == "string"
                  ? (e = a.createElement(n, { is: r.is }))
                  : ((e = a.createElement(n)),
                    n === "select" &&
                      ((a = e),
                      r.multiple
                        ? (a.multiple = !0)
                        : r.size && (a.size = r.size)))
              : (e = a.createElementNS(e, n)),
            (e[Wt] = t),
            (e[jl] = r),
            df(e, t, !1, !1),
            (t.stateNode = e));
          e: {
            switch (((a = sa(n, r)), n)) {
              case "dialog":
                (ge("cancel", e), ge("close", e), (s = r));
                break;
              case "iframe":
              case "object":
              case "embed":
                (ge("load", e), (s = r));
                break;
              case "video":
              case "audio":
                for (s = 0; s < el.length; s++) ge(el[s], e);
                s = r;
                break;
              case "source":
                (ge("error", e), (s = r));
                break;
              case "img":
              case "image":
              case "link":
                (ge("error", e), ge("load", e), (s = r));
                break;
              case "details":
                (ge("toggle", e), (s = r));
                break;
              case "input":
                (eu(e, r), (s = Zi(e, r)), ge("invalid", e));
                break;
              case "option":
                s = r;
                break;
              case "select":
                ((e._wrapperState = { wasMultiple: !!r.multiple }),
                  (s = ke({}, r, { value: void 0 })),
                  ge("invalid", e));
                break;
              case "textarea":
                (nu(e, r), (s = na(e, r)), ge("invalid", e));
                break;
              default:
                s = r;
            }
            (la(n, s), (u = s));
            for (i in u)
              if (u.hasOwnProperty(i)) {
                var o = u[i];
                i === "style"
                  ? Wc(e, o)
                  : i === "dangerouslySetInnerHTML"
                    ? ((o = o ? o.__html : void 0), o != null && Uc(e, o))
                    : i === "children"
                      ? typeof o == "string"
                        ? (n !== "textarea" || o !== "") && dl(e, o)
                        : typeof o == "number" && dl(e, "" + o)
                      : i !== "suppressContentEditableWarning" &&
                        i !== "suppressHydrationWarning" &&
                        i !== "autoFocus" &&
                        (cl.hasOwnProperty(i)
                          ? o != null && i === "onScroll" && ge("scroll", e)
                          : o != null && Ka(e, i, o, a));
              }
            switch (n) {
              case "input":
                (Vl(e), tu(e, r, !1));
                break;
              case "textarea":
                (Vl(e), ru(e));
                break;
              case "option":
                r.value != null && e.setAttribute("value", "" + Fn(r.value));
                break;
              case "select":
                ((e.multiple = !!r.multiple),
                  (i = r.value),
                  i != null
                    ? jr(e, !!r.multiple, i, !1)
                    : r.defaultValue != null &&
                      jr(e, !!r.multiple, r.defaultValue, !0));
                break;
              default:
                typeof s.onClick == "function" && (e.onclick = Es);
            }
            switch (n) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                r = !!r.autoFocus;
                break e;
              case "img":
                r = !0;
                break e;
              default:
                r = !1;
            }
          }
          r && (t.flags |= 4);
        }
        t.ref !== null && ((t.flags |= 512), (t.flags |= 2097152));
      }
      return (Be(t), null);
    case 6:
      if (e && t.stateNode != null) pf(e, t, e.memoizedProps, r);
      else {
        if (typeof r != "string" && t.stateNode === null) throw Error(P(166));
        if (((n = Hn(Nl.current)), Hn(Vt.current), es(t))) {
          if (
            ((r = t.stateNode),
            (n = t.memoizedProps),
            (r[Wt] = t),
            (i = r.nodeValue !== n) && ((e = ut), e !== null))
          )
            switch (e.tag) {
              case 3:
                Zl(r.nodeValue, n, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 &&
                  Zl(r.nodeValue, n, (e.mode & 1) !== 0);
            }
          i && (t.flags |= 4);
        } else
          ((r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r)),
            (r[Wt] = t),
            (t.stateNode = r));
      }
      return (Be(t), null);
    case 13:
      if (
        (ve(we),
        (r = t.memoizedState),
        e === null ||
          (e.memoizedState !== null && e.memoizedState.dehydrated !== null))
      ) {
        if (xe && ot !== null && t.mode & 1 && !(t.flags & 128))
          (Fd(), Er(), (t.flags |= 98560), (i = !1));
        else if (((i = es(t)), r !== null && r.dehydrated !== null)) {
          if (e === null) {
            if (!i) throw Error(P(318));
            if (
              ((i = t.memoizedState),
              (i = i !== null ? i.dehydrated : null),
              !i)
            )
              throw Error(P(317));
            i[Wt] = t;
          } else
            (Er(),
              !(t.flags & 128) && (t.memoizedState = null),
              (t.flags |= 4));
          (Be(t), (i = !1));
        } else (Ft !== null && ($a(Ft), (Ft = null)), (i = !0));
        if (!i) return t.flags & 65536 ? t : null;
      }
      return t.flags & 128
        ? ((t.lanes = n), t)
        : ((r = r !== null),
          r !== (e !== null && e.memoizedState !== null) &&
            r &&
            ((t.child.flags |= 8192),
            t.mode & 1 &&
              (e === null || we.current & 1 ? Re === 0 && (Re = 3) : zo())),
          t.updateQueue !== null && (t.flags |= 4),
          Be(t),
          null);
    case 4:
      return (
        Fr(),
        Ta(e, t),
        e === null && xl(t.stateNode.containerInfo),
        Be(t),
        null
      );
    case 10:
      return (fo(t.type._context), Be(t), null);
    case 17:
      return (tt(t.type) && zs(), Be(t), null);
    case 19:
      if ((ve(we), (i = t.memoizedState), i === null)) return (Be(t), null);
      if (((r = (t.flags & 128) !== 0), (a = i.rendering), a === null))
        if (r) Yr(i, !1);
        else {
          if (Re !== 0 || (e !== null && e.flags & 128))
            for (e = t.child; e !== null;) {
              if (((a = Is(e)), a !== null)) {
                for (
                  t.flags |= 128,
                    Yr(i, !1),
                    r = a.updateQueue,
                    r !== null && ((t.updateQueue = r), (t.flags |= 4)),
                    t.subtreeFlags = 0,
                    r = n,
                    n = t.child;
                  n !== null;
                )
                  ((i = n),
                    (e = r),
                    (i.flags &= 14680066),
                    (a = i.alternate),
                    a === null
                      ? ((i.childLanes = 0),
                        (i.lanes = e),
                        (i.child = null),
                        (i.subtreeFlags = 0),
                        (i.memoizedProps = null),
                        (i.memoizedState = null),
                        (i.updateQueue = null),
                        (i.dependencies = null),
                        (i.stateNode = null))
                      : ((i.childLanes = a.childLanes),
                        (i.lanes = a.lanes),
                        (i.child = a.child),
                        (i.subtreeFlags = 0),
                        (i.deletions = null),
                        (i.memoizedProps = a.memoizedProps),
                        (i.memoizedState = a.memoizedState),
                        (i.updateQueue = a.updateQueue),
                        (i.type = a.type),
                        (e = a.dependencies),
                        (i.dependencies =
                          e === null
                            ? null
                            : {
                                lanes: e.lanes,
                                firstContext: e.firstContext,
                              })),
                    (n = n.sibling));
                return (he(we, (we.current & 1) | 2), t.child);
              }
              e = e.sibling;
            }
          i.tail !== null &&
            ze() > Pr &&
            ((t.flags |= 128), (r = !0), Yr(i, !1), (t.lanes = 4194304));
        }
      else {
        if (!r)
          if (((e = Is(a)), e !== null)) {
            if (
              ((t.flags |= 128),
              (r = !0),
              (n = e.updateQueue),
              n !== null && ((t.updateQueue = n), (t.flags |= 4)),
              Yr(i, !0),
              i.tail === null && i.tailMode === "hidden" && !a.alternate && !xe)
            )
              return (Be(t), null);
          } else
            2 * ze() - i.renderingStartTime > Pr &&
              n !== 1073741824 &&
              ((t.flags |= 128), (r = !0), Yr(i, !1), (t.lanes = 4194304));
        i.isBackwards
          ? ((a.sibling = t.child), (t.child = a))
          : ((n = i.last),
            n !== null ? (n.sibling = a) : (t.child = a),
            (i.last = a));
      }
      return i.tail !== null
        ? ((t = i.tail),
          (i.rendering = t),
          (i.tail = t.sibling),
          (i.renderingStartTime = ze()),
          (t.sibling = null),
          (n = we.current),
          he(we, r ? (n & 1) | 2 : n & 1),
          t)
        : (Be(t), null);
    case 22:
    case 23:
      return (
        Eo(),
        (r = t.memoizedState !== null),
        e !== null && (e.memoizedState !== null) !== r && (t.flags |= 8192),
        r && t.mode & 1
          ? at & 1073741824 && (Be(t), t.subtreeFlags & 6 && (t.flags |= 8192))
          : Be(t),
        null
      );
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(P(156, t.tag));
}
function tm(e, t) {
  switch ((ao(t), t.tag)) {
    case 1:
      return (
        tt(t.type) && zs(),
        (e = t.flags),
        e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 3:
      return (
        Fr(),
        ve(et),
        ve(He),
        vo(),
        (e = t.flags),
        e & 65536 && !(e & 128) ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 5:
      return (go(t), null);
    case 13:
      if (
        (ve(we), (e = t.memoizedState), e !== null && e.dehydrated !== null)
      ) {
        if (t.alternate === null) throw Error(P(340));
        Er();
      }
      return (
        (e = t.flags),
        e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 19:
      return (ve(we), null);
    case 4:
      return (Fr(), null);
    case 10:
      return (fo(t.type._context), null);
    case 22:
    case 23:
      return (Eo(), null);
    case 24:
      return null;
    default:
      return null;
  }
}
var rs = !1,
  We = !1,
  nm = typeof WeakSet == "function" ? WeakSet : Set,
  $ = null;
function xr(e, t) {
  var n = e.ref;
  if (n !== null)
    if (typeof n == "function")
      try {
        n(null);
      } catch (r) {
        _e(e, t, r);
      }
    else n.current = null;
}
function Pa(e, t, n) {
  try {
    n();
  } catch (r) {
    _e(e, t, r);
  }
}
var Ku = !1;
function rm(e, t) {
  if (((ma = Cs), (e = vd()), so(e))) {
    if ("selectionStart" in e)
      var n = { start: e.selectionStart, end: e.selectionEnd };
    else
      e: {
        n = ((n = e.ownerDocument) && n.defaultView) || window;
        var r = n.getSelection && n.getSelection();
        if (r && r.rangeCount !== 0) {
          n = r.anchorNode;
          var s = r.anchorOffset,
            i = r.focusNode;
          r = r.focusOffset;
          try {
            (n.nodeType, i.nodeType);
          } catch {
            n = null;
            break e;
          }
          var a = 0,
            u = -1,
            o = -1,
            d = 0,
            g = 0,
            m = e,
            p = null;
          t: for (;;) {
            for (
              var w;
              m !== n || (s !== 0 && m.nodeType !== 3) || (u = a + s),
                m !== i || (r !== 0 && m.nodeType !== 3) || (o = a + r),
                m.nodeType === 3 && (a += m.nodeValue.length),
                (w = m.firstChild) !== null;
            )
              ((p = m), (m = w));
            for (;;) {
              if (m === e) break t;
              if (
                (p === n && ++d === s && (u = a),
                p === i && ++g === r && (o = a),
                (w = m.nextSibling) !== null)
              )
                break;
              ((m = p), (p = m.parentNode));
            }
            m = w;
          }
          n = u === -1 || o === -1 ? null : { start: u, end: o };
        } else n = null;
      }
    n = n || { start: 0, end: 0 };
  } else n = null;
  for (ga = { focusedElem: e, selectionRange: n }, Cs = !1, $ = t; $ !== null;)
    if (((t = $), (e = t.child), (t.subtreeFlags & 1028) !== 0 && e !== null))
      ((e.return = t), ($ = e));
    else
      for (; $ !== null;) {
        t = $;
        try {
          var _ = t.alternate;
          if (t.flags & 1024)
            switch (t.tag) {
              case 0:
              case 11:
              case 15:
                break;
              case 1:
                if (_ !== null) {
                  var N = _.memoizedProps,
                    R = _.memoizedState,
                    h = t.stateNode,
                    c = h.getSnapshotBeforeUpdate(
                      t.elementType === t.type ? N : Et(t.type, N),
                      R,
                    );
                  h.__reactInternalSnapshotBeforeUpdate = c;
                }
                break;
              case 3:
                var f = t.stateNode.containerInfo;
                f.nodeType === 1
                  ? (f.textContent = "")
                  : f.nodeType === 9 &&
                    f.documentElement &&
                    f.removeChild(f.documentElement);
                break;
              case 5:
              case 6:
              case 4:
              case 17:
                break;
              default:
                throw Error(P(163));
            }
        } catch (v) {
          _e(t, t.return, v);
        }
        if (((e = t.sibling), e !== null)) {
          ((e.return = t.return), ($ = e));
          break;
        }
        $ = t.return;
      }
  return ((_ = Ku), (Ku = !1), _);
}
function al(e, t, n) {
  var r = t.updateQueue;
  if (((r = r !== null ? r.lastEffect : null), r !== null)) {
    var s = (r = r.next);
    do {
      if ((s.tag & e) === e) {
        var i = s.destroy;
        ((s.destroy = void 0), i !== void 0 && Pa(t, n, i));
      }
      s = s.next;
    } while (s !== r);
  }
}
function ei(e, t) {
  if (
    ((t = t.updateQueue), (t = t !== null ? t.lastEffect : null), t !== null)
  ) {
    var n = (t = t.next);
    do {
      if ((n.tag & e) === e) {
        var r = n.create;
        n.destroy = r();
      }
      n = n.next;
    } while (n !== t);
  }
}
function Ma(e) {
  var t = e.ref;
  if (t !== null) {
    var n = e.stateNode;
    switch (e.tag) {
      case 5:
        e = n;
        break;
      default:
        e = n;
    }
    typeof t == "function" ? t(e) : (t.current = e);
  }
}
function hf(e) {
  var t = e.alternate;
  (t !== null && ((e.alternate = null), hf(t)),
    (e.child = null),
    (e.deletions = null),
    (e.sibling = null),
    e.tag === 5 &&
      ((t = e.stateNode),
      t !== null &&
        (delete t[Wt], delete t[jl], delete t[ya], delete t[$h], delete t[Ah])),
    (e.stateNode = null),
    (e.return = null),
    (e.dependencies = null),
    (e.memoizedProps = null),
    (e.memoizedState = null),
    (e.pendingProps = null),
    (e.stateNode = null),
    (e.updateQueue = null));
}
function mf(e) {
  return e.tag === 5 || e.tag === 3 || e.tag === 4;
}
function Yu(e) {
  e: for (;;) {
    for (; e.sibling === null;) {
      if (e.return === null || mf(e.return)) return null;
      e = e.return;
    }
    for (
      e.sibling.return = e.return, e = e.sibling;
      e.tag !== 5 && e.tag !== 6 && e.tag !== 18;
    ) {
      if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
      ((e.child.return = e), (e = e.child));
    }
    if (!(e.flags & 2)) return e.stateNode;
  }
}
function Ra(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6)
    ((e = e.stateNode),
      t
        ? n.nodeType === 8
          ? n.parentNode.insertBefore(e, t)
          : n.insertBefore(e, t)
        : (n.nodeType === 8
            ? ((t = n.parentNode), t.insertBefore(e, n))
            : ((t = n), t.appendChild(e)),
          (n = n._reactRootContainer),
          n != null || t.onclick !== null || (t.onclick = Es)));
  else if (r !== 4 && ((e = e.child), e !== null))
    for (Ra(e, t, n), e = e.sibling; e !== null;)
      (Ra(e, t, n), (e = e.sibling));
}
function La(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6)
    ((e = e.stateNode), t ? n.insertBefore(e, t) : n.appendChild(e));
  else if (r !== 4 && ((e = e.child), e !== null))
    for (La(e, t, n), e = e.sibling; e !== null;)
      (La(e, t, n), (e = e.sibling));
}
var Oe = null,
  zt = !1;
function pn(e, t, n) {
  for (n = n.child; n !== null;) (gf(e, t, n), (n = n.sibling));
}
function gf(e, t, n) {
  if (Ht && typeof Ht.onCommitFiberUnmount == "function")
    try {
      Ht.onCommitFiberUnmount(Ks, n);
    } catch {}
  switch (n.tag) {
    case 5:
      We || xr(n, t);
    case 6:
      var r = Oe,
        s = zt;
      ((Oe = null),
        pn(e, t, n),
        (Oe = r),
        (zt = s),
        Oe !== null &&
          (zt
            ? ((e = Oe),
              (n = n.stateNode),
              e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n))
            : Oe.removeChild(n.stateNode)));
      break;
    case 18:
      Oe !== null &&
        (zt
          ? ((e = Oe),
            (n = n.stateNode),
            e.nodeType === 8
              ? Mi(e.parentNode, n)
              : e.nodeType === 1 && Mi(e, n),
            ml(e))
          : Mi(Oe, n.stateNode));
      break;
    case 4:
      ((r = Oe),
        (s = zt),
        (Oe = n.stateNode.containerInfo),
        (zt = !0),
        pn(e, t, n),
        (Oe = r),
        (zt = s));
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (
        !We &&
        ((r = n.updateQueue), r !== null && ((r = r.lastEffect), r !== null))
      ) {
        s = r = r.next;
        do {
          var i = s,
            a = i.destroy;
          ((i = i.tag),
            a !== void 0 && (i & 2 || i & 4) && Pa(n, t, a),
            (s = s.next));
        } while (s !== r);
      }
      pn(e, t, n);
      break;
    case 1:
      if (
        !We &&
        (xr(n, t),
        (r = n.stateNode),
        typeof r.componentWillUnmount == "function")
      )
        try {
          ((r.props = n.memoizedProps),
            (r.state = n.memoizedState),
            r.componentWillUnmount());
        } catch (u) {
          _e(n, t, u);
        }
      pn(e, t, n);
      break;
    case 21:
      pn(e, t, n);
      break;
    case 22:
      n.mode & 1
        ? ((We = (r = We) || n.memoizedState !== null), pn(e, t, n), (We = r))
        : pn(e, t, n);
      break;
    default:
      pn(e, t, n);
  }
}
function Qu(e) {
  var t = e.updateQueue;
  if (t !== null) {
    e.updateQueue = null;
    var n = e.stateNode;
    (n === null && (n = e.stateNode = new nm()),
      t.forEach(function (r) {
        var s = fm.bind(null, e, r);
        n.has(r) || (n.add(r), r.then(s, s));
      }));
  }
}
function bt(e, t) {
  var n = t.deletions;
  if (n !== null)
    for (var r = 0; r < n.length; r++) {
      var s = n[r];
      try {
        var i = e,
          a = t,
          u = a;
        e: for (; u !== null;) {
          switch (u.tag) {
            case 5:
              ((Oe = u.stateNode), (zt = !1));
              break e;
            case 3:
              ((Oe = u.stateNode.containerInfo), (zt = !0));
              break e;
            case 4:
              ((Oe = u.stateNode.containerInfo), (zt = !0));
              break e;
          }
          u = u.return;
        }
        if (Oe === null) throw Error(P(160));
        (gf(i, a, s), (Oe = null), (zt = !1));
        var o = s.alternate;
        (o !== null && (o.return = null), (s.return = null));
      } catch (d) {
        _e(s, t, d);
      }
    }
  if (t.subtreeFlags & 12854)
    for (t = t.child; t !== null;) (vf(t, e), (t = t.sibling));
}
function vf(e, t) {
  var n = e.alternate,
    r = e.flags;
  switch (e.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      if ((bt(t, e), Ot(e), r & 4)) {
        try {
          (al(3, e, e.return), ei(3, e));
        } catch (N) {
          _e(e, e.return, N);
        }
        try {
          al(5, e, e.return);
        } catch (N) {
          _e(e, e.return, N);
        }
      }
      break;
    case 1:
      (bt(t, e), Ot(e), r & 512 && n !== null && xr(n, n.return));
      break;
    case 5:
      if (
        (bt(t, e),
        Ot(e),
        r & 512 && n !== null && xr(n, n.return),
        e.flags & 32)
      ) {
        var s = e.stateNode;
        try {
          dl(s, "");
        } catch (N) {
          _e(e, e.return, N);
        }
      }
      if (r & 4 && ((s = e.stateNode), s != null)) {
        var i = e.memoizedProps,
          a = n !== null ? n.memoizedProps : i,
          u = e.type,
          o = e.updateQueue;
        if (((e.updateQueue = null), o !== null))
          try {
            (u === "input" && i.type === "radio" && i.name != null && Oc(s, i),
              sa(u, a));
            var d = sa(u, i);
            for (a = 0; a < o.length; a += 2) {
              var g = o[a],
                m = o[a + 1];
              g === "style"
                ? Wc(s, m)
                : g === "dangerouslySetInnerHTML"
                  ? Uc(s, m)
                  : g === "children"
                    ? dl(s, m)
                    : Ka(s, g, m, d);
            }
            switch (u) {
              case "input":
                ea(s, i);
                break;
              case "textarea":
                $c(s, i);
                break;
              case "select":
                var p = s._wrapperState.wasMultiple;
                s._wrapperState.wasMultiple = !!i.multiple;
                var w = i.value;
                w != null
                  ? jr(s, !!i.multiple, w, !1)
                  : p !== !!i.multiple &&
                    (i.defaultValue != null
                      ? jr(s, !!i.multiple, i.defaultValue, !0)
                      : jr(s, !!i.multiple, i.multiple ? [] : "", !1));
            }
            s[jl] = i;
          } catch (N) {
            _e(e, e.return, N);
          }
      }
      break;
    case 6:
      if ((bt(t, e), Ot(e), r & 4)) {
        if (e.stateNode === null) throw Error(P(162));
        ((s = e.stateNode), (i = e.memoizedProps));
        try {
          s.nodeValue = i;
        } catch (N) {
          _e(e, e.return, N);
        }
      }
      break;
    case 3:
      if (
        (bt(t, e), Ot(e), r & 4 && n !== null && n.memoizedState.isDehydrated)
      )
        try {
          ml(t.containerInfo);
        } catch (N) {
          _e(e, e.return, N);
        }
      break;
    case 4:
      (bt(t, e), Ot(e));
      break;
    case 13:
      (bt(t, e),
        Ot(e),
        (s = e.child),
        s.flags & 8192 &&
          ((i = s.memoizedState !== null),
          (s.stateNode.isHidden = i),
          !i ||
            (s.alternate !== null && s.alternate.memoizedState !== null) ||
            (_o = ze())),
        r & 4 && Qu(e));
      break;
    case 22:
      if (
        ((g = n !== null && n.memoizedState !== null),
        e.mode & 1 ? ((We = (d = We) || g), bt(t, e), (We = d)) : bt(t, e),
        Ot(e),
        r & 8192)
      ) {
        if (
          ((d = e.memoizedState !== null),
          (e.stateNode.isHidden = d) && !g && e.mode & 1)
        )
          for ($ = e, g = e.child; g !== null;) {
            for (m = $ = g; $ !== null;) {
              switch (((p = $), (w = p.child), p.tag)) {
                case 0:
                case 11:
                case 14:
                case 15:
                  al(4, p, p.return);
                  break;
                case 1:
                  xr(p, p.return);
                  var _ = p.stateNode;
                  if (typeof _.componentWillUnmount == "function") {
                    ((r = p), (n = p.return));
                    try {
                      ((t = r),
                        (_.props = t.memoizedProps),
                        (_.state = t.memoizedState),
                        _.componentWillUnmount());
                    } catch (N) {
                      _e(r, n, N);
                    }
                  }
                  break;
                case 5:
                  xr(p, p.return);
                  break;
                case 22:
                  if (p.memoizedState !== null) {
                    Xu(m);
                    continue;
                  }
              }
              w !== null ? ((w.return = p), ($ = w)) : Xu(m);
            }
            g = g.sibling;
          }
        e: for (g = null, m = e; ;) {
          if (m.tag === 5) {
            if (g === null) {
              g = m;
              try {
                ((s = m.stateNode),
                  d
                    ? ((i = s.style),
                      typeof i.setProperty == "function"
                        ? i.setProperty("display", "none", "important")
                        : (i.display = "none"))
                    : ((u = m.stateNode),
                      (o = m.memoizedProps.style),
                      (a =
                        o != null && o.hasOwnProperty("display")
                          ? o.display
                          : null),
                      (u.style.display = Bc("display", a))));
              } catch (N) {
                _e(e, e.return, N);
              }
            }
          } else if (m.tag === 6) {
            if (g === null)
              try {
                m.stateNode.nodeValue = d ? "" : m.memoizedProps;
              } catch (N) {
                _e(e, e.return, N);
              }
          } else if (
            ((m.tag !== 22 && m.tag !== 23) ||
              m.memoizedState === null ||
              m === e) &&
            m.child !== null
          ) {
            ((m.child.return = m), (m = m.child));
            continue;
          }
          if (m === e) break e;
          for (; m.sibling === null;) {
            if (m.return === null || m.return === e) break e;
            (g === m && (g = null), (m = m.return));
          }
          (g === m && (g = null),
            (m.sibling.return = m.return),
            (m = m.sibling));
        }
      }
      break;
    case 19:
      (bt(t, e), Ot(e), r & 4 && Qu(e));
      break;
    case 21:
      break;
    default:
      (bt(t, e), Ot(e));
  }
}
function Ot(e) {
  var t = e.flags;
  if (t & 2) {
    try {
      e: {
        for (var n = e.return; n !== null;) {
          if (mf(n)) {
            var r = n;
            break e;
          }
          n = n.return;
        }
        throw Error(P(160));
      }
      switch (r.tag) {
        case 5:
          var s = r.stateNode;
          r.flags & 32 && (dl(s, ""), (r.flags &= -33));
          var i = Yu(e);
          La(e, i, s);
          break;
        case 3:
        case 4:
          var a = r.stateNode.containerInfo,
            u = Yu(e);
          Ra(e, u, a);
          break;
        default:
          throw Error(P(161));
      }
    } catch (o) {
      _e(e, e.return, o);
    }
    e.flags &= -3;
  }
  t & 4096 && (e.flags &= -4097);
}
function lm(e, t, n) {
  (($ = e), xf(e));
}
function xf(e, t, n) {
  for (var r = (e.mode & 1) !== 0; $ !== null;) {
    var s = $,
      i = s.child;
    if (s.tag === 22 && r) {
      var a = s.memoizedState !== null || rs;
      if (!a) {
        var u = s.alternate,
          o = (u !== null && u.memoizedState !== null) || We;
        u = rs;
        var d = We;
        if (((rs = a), (We = o) && !d))
          for ($ = s; $ !== null;)
            ((a = $),
              (o = a.child),
              a.tag === 22 && a.memoizedState !== null
                ? Ju(s)
                : o !== null
                  ? ((o.return = a), ($ = o))
                  : Ju(s));
        for (; i !== null;) (($ = i), xf(i), (i = i.sibling));
        (($ = s), (rs = u), (We = d));
      }
      Gu(e);
    } else
      s.subtreeFlags & 8772 && i !== null ? ((i.return = s), ($ = i)) : Gu(e);
  }
}
function Gu(e) {
  for (; $ !== null;) {
    var t = $;
    if (t.flags & 8772) {
      var n = t.alternate;
      try {
        if (t.flags & 8772)
          switch (t.tag) {
            case 0:
            case 11:
            case 15:
              We || ei(5, t);
              break;
            case 1:
              var r = t.stateNode;
              if (t.flags & 4 && !We)
                if (n === null) r.componentDidMount();
                else {
                  var s =
                    t.elementType === t.type
                      ? n.memoizedProps
                      : Et(t.type, n.memoizedProps);
                  r.componentDidUpdate(
                    s,
                    n.memoizedState,
                    r.__reactInternalSnapshotBeforeUpdate,
                  );
                }
              var i = t.updateQueue;
              i !== null && Mu(t, i, r);
              break;
            case 3:
              var a = t.updateQueue;
              if (a !== null) {
                if (((n = null), t.child !== null))
                  switch (t.child.tag) {
                    case 5:
                      n = t.child.stateNode;
                      break;
                    case 1:
                      n = t.child.stateNode;
                  }
                Mu(t, a, n);
              }
              break;
            case 5:
              var u = t.stateNode;
              if (n === null && t.flags & 4) {
                n = u;
                var o = t.memoizedProps;
                switch (t.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    o.autoFocus && n.focus();
                    break;
                  case "img":
                    o.src && (n.src = o.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (t.memoizedState === null) {
                var d = t.alternate;
                if (d !== null) {
                  var g = d.memoizedState;
                  if (g !== null) {
                    var m = g.dehydrated;
                    m !== null && ml(m);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(P(163));
          }
        We || (t.flags & 512 && Ma(t));
      } catch (p) {
        _e(t, t.return, p);
      }
    }
    if (t === e) {
      $ = null;
      break;
    }
    if (((n = t.sibling), n !== null)) {
      ((n.return = t.return), ($ = n));
      break;
    }
    $ = t.return;
  }
}
function Xu(e) {
  for (; $ !== null;) {
    var t = $;
    if (t === e) {
      $ = null;
      break;
    }
    var n = t.sibling;
    if (n !== null) {
      ((n.return = t.return), ($ = n));
      break;
    }
    $ = t.return;
  }
}
function Ju(e) {
  for (; $ !== null;) {
    var t = $;
    try {
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          var n = t.return;
          try {
            ei(4, t);
          } catch (o) {
            _e(t, n, o);
          }
          break;
        case 1:
          var r = t.stateNode;
          if (typeof r.componentDidMount == "function") {
            var s = t.return;
            try {
              r.componentDidMount();
            } catch (o) {
              _e(t, s, o);
            }
          }
          var i = t.return;
          try {
            Ma(t);
          } catch (o) {
            _e(t, i, o);
          }
          break;
        case 5:
          var a = t.return;
          try {
            Ma(t);
          } catch (o) {
            _e(t, a, o);
          }
      }
    } catch (o) {
      _e(t, t.return, o);
    }
    if (t === e) {
      $ = null;
      break;
    }
    var u = t.sibling;
    if (u !== null) {
      ((u.return = t.return), ($ = u));
      break;
    }
    $ = t.return;
  }
}
var sm = Math.ceil,
  $s = sn.ReactCurrentDispatcher,
  So = sn.ReactCurrentOwner,
  jt = sn.ReactCurrentBatchConfig,
  le = 0,
  De = null,
  Te = null,
  $e = 0,
  at = 0,
  yr = Mn(0),
  Re = 0,
  _l = null,
  Xn = 0,
  ti = 0,
  Co = 0,
  ol = null,
  qe = null,
  _o = 0,
  Pr = 1 / 0,
  Xt = null,
  As = !1,
  Ia = null,
  bn = null,
  ls = !1,
  wn = null,
  Us = 0,
  ul = 0,
  Da = null,
  vs = -1,
  xs = 0;
function Qe() {
  return le & 6 ? ze() : vs !== -1 ? vs : (vs = ze());
}
function En(e) {
  return e.mode & 1
    ? le & 2 && $e !== 0
      ? $e & -$e
      : Bh.transition !== null
        ? (xs === 0 && (xs = td()), xs)
        : ((e = ce),
          e !== 0 || ((e = window.event), (e = e === void 0 ? 16 : od(e.type))),
          e)
    : 1;
}
function Pt(e, t, n, r) {
  if (50 < ul) throw ((ul = 0), (Da = null), Error(P(185)));
  (El(e, n, r),
    (!(le & 2) || e !== De) &&
      (e === De && (!(le & 2) && (ti |= n), Re === 4 && yn(e, $e)),
      nt(e, r),
      n === 1 && le === 0 && !(t.mode & 1) && ((Pr = ze() + 500), Js && Rn())));
}
function nt(e, t) {
  var n = e.callbackNode;
  Bp(e, t);
  var r = Ss(e, e === De ? $e : 0);
  if (r === 0)
    (n !== null && iu(n), (e.callbackNode = null), (e.callbackPriority = 0));
  else if (((t = r & -r), e.callbackPriority !== t)) {
    if ((n != null && iu(n), t === 1))
      (e.tag === 0 ? Uh(qu.bind(null, e)) : bd(qu.bind(null, e)),
        Dh(function () {
          !(le & 6) && Rn();
        }),
        (n = null));
    else {
      switch (nd(r)) {
        case 1:
          n = Ja;
          break;
        case 4:
          n = Zc;
          break;
        case 16:
          n = ks;
          break;
        case 536870912:
          n = ed;
          break;
        default:
          n = ks;
      }
      n = _f(n, yf.bind(null, e));
    }
    ((e.callbackPriority = t), (e.callbackNode = n));
  }
}
function yf(e, t) {
  if (((vs = -1), (xs = 0), le & 6)) throw Error(P(327));
  var n = e.callbackNode;
  if (Cr() && e.callbackNode !== n) return null;
  var r = Ss(e, e === De ? $e : 0);
  if (r === 0) return null;
  if (r & 30 || r & e.expiredLanes || t) t = Bs(e, r);
  else {
    t = r;
    var s = le;
    le |= 2;
    var i = wf();
    (De !== e || $e !== t) && ((Xt = null), (Pr = ze() + 500), Vn(e, t));
    do
      try {
        om();
        break;
      } catch (u) {
        jf(e, u);
      }
    while (!0);
    (co(),
      ($s.current = i),
      (le = s),
      Te !== null ? (t = 0) : ((De = null), ($e = 0), (t = Re)));
  }
  if (t !== 0) {
    if (
      (t === 2 && ((s = ca(e)), s !== 0 && ((r = s), (t = Oa(e, s)))), t === 1)
    )
      throw ((n = _l), Vn(e, 0), yn(e, r), nt(e, ze()), n);
    if (t === 6) yn(e, r);
    else {
      if (
        ((s = e.current.alternate),
        !(r & 30) &&
          !im(s) &&
          ((t = Bs(e, r)),
          t === 2 && ((i = ca(e)), i !== 0 && ((r = i), (t = Oa(e, i)))),
          t === 1))
      )
        throw ((n = _l), Vn(e, 0), yn(e, r), nt(e, ze()), n);
      switch (((e.finishedWork = s), (e.finishedLanes = r), t)) {
        case 0:
        case 1:
          throw Error(P(345));
        case 2:
          Un(e, qe, Xt);
          break;
        case 3:
          if (
            (yn(e, r), (r & 130023424) === r && ((t = _o + 500 - ze()), 10 < t))
          ) {
            if (Ss(e, 0) !== 0) break;
            if (((s = e.suspendedLanes), (s & r) !== r)) {
              (Qe(), (e.pingedLanes |= e.suspendedLanes & s));
              break;
            }
            e.timeoutHandle = xa(Un.bind(null, e, qe, Xt), t);
            break;
          }
          Un(e, qe, Xt);
          break;
        case 4:
          if ((yn(e, r), (r & 4194240) === r)) break;
          for (t = e.eventTimes, s = -1; 0 < r;) {
            var a = 31 - Tt(r);
            ((i = 1 << a), (a = t[a]), a > s && (s = a), (r &= ~i));
          }
          if (
            ((r = s),
            (r = ze() - r),
            (r =
              (120 > r
                ? 120
                : 480 > r
                  ? 480
                  : 1080 > r
                    ? 1080
                    : 1920 > r
                      ? 1920
                      : 3e3 > r
                        ? 3e3
                        : 4320 > r
                          ? 4320
                          : 1960 * sm(r / 1960)) - r),
            10 < r)
          ) {
            e.timeoutHandle = xa(Un.bind(null, e, qe, Xt), r);
            break;
          }
          Un(e, qe, Xt);
          break;
        case 5:
          Un(e, qe, Xt);
          break;
        default:
          throw Error(P(329));
      }
    }
  }
  return (nt(e, ze()), e.callbackNode === n ? yf.bind(null, e) : null);
}
function Oa(e, t) {
  var n = ol;
  return (
    e.current.memoizedState.isDehydrated && (Vn(e, t).flags |= 256),
    (e = Bs(e, t)),
    e !== 2 && ((t = qe), (qe = n), t !== null && $a(t)),
    e
  );
}
function $a(e) {
  qe === null ? (qe = e) : qe.push.apply(qe, e);
}
function im(e) {
  for (var t = e; ;) {
    if (t.flags & 16384) {
      var n = t.updateQueue;
      if (n !== null && ((n = n.stores), n !== null))
        for (var r = 0; r < n.length; r++) {
          var s = n[r],
            i = s.getSnapshot;
          s = s.value;
          try {
            if (!Mt(i(), s)) return !1;
          } catch {
            return !1;
          }
        }
    }
    if (((n = t.child), t.subtreeFlags & 16384 && n !== null))
      ((n.return = t), (t = n));
    else {
      if (t === e) break;
      for (; t.sibling === null;) {
        if (t.return === null || t.return === e) return !0;
        t = t.return;
      }
      ((t.sibling.return = t.return), (t = t.sibling));
    }
  }
  return !0;
}
function yn(e, t) {
  for (
    t &= ~Co,
      t &= ~ti,
      e.suspendedLanes |= t,
      e.pingedLanes &= ~t,
      e = e.expirationTimes;
    0 < t;
  ) {
    var n = 31 - Tt(t),
      r = 1 << n;
    ((e[n] = -1), (t &= ~r));
  }
}
function qu(e) {
  if (le & 6) throw Error(P(327));
  Cr();
  var t = Ss(e, 0);
  if (!(t & 1)) return (nt(e, ze()), null);
  var n = Bs(e, t);
  if (e.tag !== 0 && n === 2) {
    var r = ca(e);
    r !== 0 && ((t = r), (n = Oa(e, r)));
  }
  if (n === 1) throw ((n = _l), Vn(e, 0), yn(e, t), nt(e, ze()), n);
  if (n === 6) throw Error(P(345));
  return (
    (e.finishedWork = e.current.alternate),
    (e.finishedLanes = t),
    Un(e, qe, Xt),
    nt(e, ze()),
    null
  );
}
function bo(e, t) {
  var n = le;
  le |= 1;
  try {
    return e(t);
  } finally {
    ((le = n), le === 0 && ((Pr = ze() + 500), Js && Rn()));
  }
}
function Jn(e) {
  wn !== null && wn.tag === 0 && !(le & 6) && Cr();
  var t = le;
  le |= 1;
  var n = jt.transition,
    r = ce;
  try {
    if (((jt.transition = null), (ce = 1), e)) return e();
  } finally {
    ((ce = r), (jt.transition = n), (le = t), !(le & 6) && Rn());
  }
}
function Eo() {
  ((at = yr.current), ve(yr));
}
function Vn(e, t) {
  ((e.finishedWork = null), (e.finishedLanes = 0));
  var n = e.timeoutHandle;
  if ((n !== -1 && ((e.timeoutHandle = -1), Ih(n)), Te !== null))
    for (n = Te.return; n !== null;) {
      var r = n;
      switch ((ao(r), r.tag)) {
        case 1:
          ((r = r.type.childContextTypes), r != null && zs());
          break;
        case 3:
          (Fr(), ve(et), ve(He), vo());
          break;
        case 5:
          go(r);
          break;
        case 4:
          Fr();
          break;
        case 13:
          ve(we);
          break;
        case 19:
          ve(we);
          break;
        case 10:
          fo(r.type._context);
          break;
        case 22:
        case 23:
          Eo();
      }
      n = n.return;
    }
  if (
    ((De = e),
    (Te = e = zn(e.current, null)),
    ($e = at = t),
    (Re = 0),
    (_l = null),
    (Co = ti = Xn = 0),
    (qe = ol = null),
    Wn !== null)
  ) {
    for (t = 0; t < Wn.length; t++)
      if (((n = Wn[t]), (r = n.interleaved), r !== null)) {
        n.interleaved = null;
        var s = r.next,
          i = n.pending;
        if (i !== null) {
          var a = i.next;
          ((i.next = s), (r.next = a));
        }
        n.pending = r;
      }
    Wn = null;
  }
  return e;
}
function jf(e, t) {
  do {
    var n = Te;
    try {
      if ((co(), (hs.current = Os), Ds)) {
        for (var r = Ne.memoizedState; r !== null;) {
          var s = r.queue;
          (s !== null && (s.pending = null), (r = r.next));
        }
        Ds = !1;
      }
      if (
        ((Gn = 0),
        (Ie = Me = Ne = null),
        (il = !1),
        (kl = 0),
        (So.current = null),
        n === null || n.return === null)
      ) {
        ((Re = 1), (_l = t), (Te = null));
        break;
      }
      e: {
        var i = e,
          a = n.return,
          u = n,
          o = t;
        if (
          ((t = $e),
          (u.flags |= 32768),
          o !== null && typeof o == "object" && typeof o.then == "function")
        ) {
          var d = o,
            g = u,
            m = g.tag;
          if (!(g.mode & 1) && (m === 0 || m === 11 || m === 15)) {
            var p = g.alternate;
            p
              ? ((g.updateQueue = p.updateQueue),
                (g.memoizedState = p.memoizedState),
                (g.lanes = p.lanes))
              : ((g.updateQueue = null), (g.memoizedState = null));
          }
          var w = $u(a);
          if (w !== null) {
            ((w.flags &= -257),
              Au(w, a, u, i, t),
              w.mode & 1 && Ou(i, d, t),
              (t = w),
              (o = d));
            var _ = t.updateQueue;
            if (_ === null) {
              var N = new Set();
              (N.add(o), (t.updateQueue = N));
            } else _.add(o);
            break e;
          } else {
            if (!(t & 1)) {
              (Ou(i, d, t), zo());
              break e;
            }
            o = Error(P(426));
          }
        } else if (xe && u.mode & 1) {
          var R = $u(a);
          if (R !== null) {
            (!(R.flags & 65536) && (R.flags |= 256),
              Au(R, a, u, i, t),
              oo(Tr(o, u)));
            break e;
          }
        }
        ((i = o = Tr(o, u)),
          Re !== 4 && (Re = 2),
          ol === null ? (ol = [i]) : ol.push(i),
          (i = a));
        do {
          switch (i.tag) {
            case 3:
              ((i.flags |= 65536), (t &= -t), (i.lanes |= t));
              var h = nf(i, o, t);
              Pu(i, h);
              break e;
            case 1:
              u = o;
              var c = i.type,
                f = i.stateNode;
              if (
                !(i.flags & 128) &&
                (typeof c.getDerivedStateFromError == "function" ||
                  (f !== null &&
                    typeof f.componentDidCatch == "function" &&
                    (bn === null || !bn.has(f))))
              ) {
                ((i.flags |= 65536), (t &= -t), (i.lanes |= t));
                var v = rf(i, u, t);
                Pu(i, v);
                break e;
              }
          }
          i = i.return;
        } while (i !== null);
      }
      kf(n);
    } catch (j) {
      ((t = j), Te === n && n !== null && (Te = n = n.return));
      continue;
    }
    break;
  } while (!0);
}
function wf() {
  var e = $s.current;
  return (($s.current = Os), e === null ? Os : e);
}
function zo() {
  ((Re === 0 || Re === 3 || Re === 2) && (Re = 4),
    De === null || (!(Xn & 268435455) && !(ti & 268435455)) || yn(De, $e));
}
function Bs(e, t) {
  var n = le;
  le |= 2;
  var r = wf();
  (De !== e || $e !== t) && ((Xt = null), Vn(e, t));
  do
    try {
      am();
      break;
    } catch (s) {
      jf(e, s);
    }
  while (!0);
  if ((co(), (le = n), ($s.current = r), Te !== null)) throw Error(P(261));
  return ((De = null), ($e = 0), Re);
}
function am() {
  for (; Te !== null;) Nf(Te);
}
function om() {
  for (; Te !== null && !Mp();) Nf(Te);
}
function Nf(e) {
  var t = Cf(e.alternate, e, at);
  ((e.memoizedProps = e.pendingProps),
    t === null ? kf(e) : (Te = t),
    (So.current = null));
}
function kf(e) {
  var t = e;
  do {
    var n = t.alternate;
    if (((e = t.return), t.flags & 32768)) {
      if (((n = tm(n, t)), n !== null)) {
        ((n.flags &= 32767), (Te = n));
        return;
      }
      if (e !== null)
        ((e.flags |= 32768), (e.subtreeFlags = 0), (e.deletions = null));
      else {
        ((Re = 6), (Te = null));
        return;
      }
    } else if (((n = em(n, t, at)), n !== null)) {
      Te = n;
      return;
    }
    if (((t = t.sibling), t !== null)) {
      Te = t;
      return;
    }
    Te = t = e;
  } while (t !== null);
  Re === 0 && (Re = 5);
}
function Un(e, t, n) {
  var r = ce,
    s = jt.transition;
  try {
    ((jt.transition = null), (ce = 1), um(e, t, n, r));
  } finally {
    ((jt.transition = s), (ce = r));
  }
  return null;
}
function um(e, t, n, r) {
  do Cr();
  while (wn !== null);
  if (le & 6) throw Error(P(327));
  n = e.finishedWork;
  var s = e.finishedLanes;
  if (n === null) return null;
  if (((e.finishedWork = null), (e.finishedLanes = 0), n === e.current))
    throw Error(P(177));
  ((e.callbackNode = null), (e.callbackPriority = 0));
  var i = n.lanes | n.childLanes;
  if (
    (Wp(e, i),
    e === De && ((Te = De = null), ($e = 0)),
    (!(n.subtreeFlags & 2064) && !(n.flags & 2064)) ||
      ls ||
      ((ls = !0),
      _f(ks, function () {
        return (Cr(), null);
      })),
    (i = (n.flags & 15990) !== 0),
    n.subtreeFlags & 15990 || i)
  ) {
    ((i = jt.transition), (jt.transition = null));
    var a = ce;
    ce = 1;
    var u = le;
    ((le |= 4),
      (So.current = null),
      rm(e, n),
      vf(n, e),
      zh(ga),
      (Cs = !!ma),
      (ga = ma = null),
      (e.current = n),
      lm(n),
      Rp(),
      (le = u),
      (ce = a),
      (jt.transition = i));
  } else e.current = n;
  if (
    (ls && ((ls = !1), (wn = e), (Us = s)),
    (i = e.pendingLanes),
    i === 0 && (bn = null),
    Dp(n.stateNode),
    nt(e, ze()),
    t !== null)
  )
    for (r = e.onRecoverableError, n = 0; n < t.length; n++)
      ((s = t[n]), r(s.value, { componentStack: s.stack, digest: s.digest }));
  if (As) throw ((As = !1), (e = Ia), (Ia = null), e);
  return (
    Us & 1 && e.tag !== 0 && Cr(),
    (i = e.pendingLanes),
    i & 1 ? (e === Da ? ul++ : ((ul = 0), (Da = e))) : (ul = 0),
    Rn(),
    null
  );
}
function Cr() {
  if (wn !== null) {
    var e = nd(Us),
      t = jt.transition,
      n = ce;
    try {
      if (((jt.transition = null), (ce = 16 > e ? 16 : e), wn === null))
        var r = !1;
      else {
        if (((e = wn), (wn = null), (Us = 0), le & 6)) throw Error(P(331));
        var s = le;
        for (le |= 4, $ = e.current; $ !== null;) {
          var i = $,
            a = i.child;
          if ($.flags & 16) {
            var u = i.deletions;
            if (u !== null) {
              for (var o = 0; o < u.length; o++) {
                var d = u[o];
                for ($ = d; $ !== null;) {
                  var g = $;
                  switch (g.tag) {
                    case 0:
                    case 11:
                    case 15:
                      al(8, g, i);
                  }
                  var m = g.child;
                  if (m !== null) ((m.return = g), ($ = m));
                  else
                    for (; $ !== null;) {
                      g = $;
                      var p = g.sibling,
                        w = g.return;
                      if ((hf(g), g === d)) {
                        $ = null;
                        break;
                      }
                      if (p !== null) {
                        ((p.return = w), ($ = p));
                        break;
                      }
                      $ = w;
                    }
                }
              }
              var _ = i.alternate;
              if (_ !== null) {
                var N = _.child;
                if (N !== null) {
                  _.child = null;
                  do {
                    var R = N.sibling;
                    ((N.sibling = null), (N = R));
                  } while (N !== null);
                }
              }
              $ = i;
            }
          }
          if (i.subtreeFlags & 2064 && a !== null) ((a.return = i), ($ = a));
          else
            e: for (; $ !== null;) {
              if (((i = $), i.flags & 2048))
                switch (i.tag) {
                  case 0:
                  case 11:
                  case 15:
                    al(9, i, i.return);
                }
              var h = i.sibling;
              if (h !== null) {
                ((h.return = i.return), ($ = h));
                break e;
              }
              $ = i.return;
            }
        }
        var c = e.current;
        for ($ = c; $ !== null;) {
          a = $;
          var f = a.child;
          if (a.subtreeFlags & 2064 && f !== null) ((f.return = a), ($ = f));
          else
            e: for (a = c; $ !== null;) {
              if (((u = $), u.flags & 2048))
                try {
                  switch (u.tag) {
                    case 0:
                    case 11:
                    case 15:
                      ei(9, u);
                  }
                } catch (j) {
                  _e(u, u.return, j);
                }
              if (u === a) {
                $ = null;
                break e;
              }
              var v = u.sibling;
              if (v !== null) {
                ((v.return = u.return), ($ = v));
                break e;
              }
              $ = u.return;
            }
        }
        if (
          ((le = s), Rn(), Ht && typeof Ht.onPostCommitFiberRoot == "function")
        )
          try {
            Ht.onPostCommitFiberRoot(Ks, e);
          } catch {}
        r = !0;
      }
      return r;
    } finally {
      ((ce = n), (jt.transition = t));
    }
  }
  return !1;
}
function Zu(e, t, n) {
  ((t = Tr(n, t)),
    (t = nf(e, t, 1)),
    (e = _n(e, t, 1)),
    (t = Qe()),
    e !== null && (El(e, 1, t), nt(e, t)));
}
function _e(e, t, n) {
  if (e.tag === 3) Zu(e, e, n);
  else
    for (; t !== null;) {
      if (t.tag === 3) {
        Zu(t, e, n);
        break;
      } else if (t.tag === 1) {
        var r = t.stateNode;
        if (
          typeof t.type.getDerivedStateFromError == "function" ||
          (typeof r.componentDidCatch == "function" &&
            (bn === null || !bn.has(r)))
        ) {
          ((e = Tr(n, e)),
            (e = rf(t, e, 1)),
            (t = _n(t, e, 1)),
            (e = Qe()),
            t !== null && (El(t, 1, e), nt(t, e)));
          break;
        }
      }
      t = t.return;
    }
}
function cm(e, t, n) {
  var r = e.pingCache;
  (r !== null && r.delete(t),
    (t = Qe()),
    (e.pingedLanes |= e.suspendedLanes & n),
    De === e &&
      ($e & n) === n &&
      (Re === 4 || (Re === 3 && ($e & 130023424) === $e && 500 > ze() - _o)
        ? Vn(e, 0)
        : (Co |= n)),
    nt(e, t));
}
function Sf(e, t) {
  t === 0 &&
    (e.mode & 1
      ? ((t = Ql), (Ql <<= 1), !(Ql & 130023424) && (Ql = 4194304))
      : (t = 1));
  var n = Qe();
  ((e = rn(e, t)), e !== null && (El(e, t, n), nt(e, n)));
}
function dm(e) {
  var t = e.memoizedState,
    n = 0;
  (t !== null && (n = t.retryLane), Sf(e, n));
}
function fm(e, t) {
  var n = 0;
  switch (e.tag) {
    case 13:
      var r = e.stateNode,
        s = e.memoizedState;
      s !== null && (n = s.retryLane);
      break;
    case 19:
      r = e.stateNode;
      break;
    default:
      throw Error(P(314));
  }
  (r !== null && r.delete(t), Sf(e, n));
}
var Cf;
Cf = function (e, t, n) {
  if (e !== null)
    if (e.memoizedProps !== t.pendingProps || et.current) Ze = !0;
    else {
      if (!(e.lanes & n) && !(t.flags & 128)) return ((Ze = !1), Zh(e, t, n));
      Ze = !!(e.flags & 131072);
    }
  else ((Ze = !1), xe && t.flags & 1048576 && Ed(t, Ps, t.index));
  switch (((t.lanes = 0), t.tag)) {
    case 2:
      var r = t.type;
      (gs(e, t), (e = t.pendingProps));
      var s = br(t, He.current);
      (Sr(t, n), (s = yo(null, t, r, e, s, n)));
      var i = jo();
      return (
        (t.flags |= 1),
        typeof s == "object" &&
        s !== null &&
        typeof s.render == "function" &&
        s.$$typeof === void 0
          ? ((t.tag = 1),
            (t.memoizedState = null),
            (t.updateQueue = null),
            tt(r) ? ((i = !0), Fs(t)) : (i = !1),
            (t.memoizedState =
              s.state !== null && s.state !== void 0 ? s.state : null),
            ho(t),
            (s.updater = Zs),
            (t.stateNode = s),
            (s._reactInternals = t),
            Ca(t, r, e, n),
            (t = Ea(null, t, r, !0, i, n)))
          : ((t.tag = 0), xe && i && io(t), Ye(null, t, s, n), (t = t.child)),
        t
      );
    case 16:
      r = t.elementType;
      e: {
        switch (
          (gs(e, t),
          (e = t.pendingProps),
          (s = r._init),
          (r = s(r._payload)),
          (t.type = r),
          (s = t.tag = hm(r)),
          (e = Et(r, e)),
          s)
        ) {
          case 0:
            t = ba(null, t, r, e, n);
            break e;
          case 1:
            t = Wu(null, t, r, e, n);
            break e;
          case 11:
            t = Uu(null, t, r, e, n);
            break e;
          case 14:
            t = Bu(null, t, r, Et(r.type, e), n);
            break e;
        }
        throw Error(P(306, r, ""));
      }
      return t;
    case 0:
      return (
        (r = t.type),
        (s = t.pendingProps),
        (s = t.elementType === r ? s : Et(r, s)),
        ba(e, t, r, s, n)
      );
    case 1:
      return (
        (r = t.type),
        (s = t.pendingProps),
        (s = t.elementType === r ? s : Et(r, s)),
        Wu(e, t, r, s, n)
      );
    case 3:
      e: {
        if ((of(t), e === null)) throw Error(P(387));
        ((r = t.pendingProps),
          (i = t.memoizedState),
          (s = i.element),
          Rd(e, t),
          Ls(t, r, null, n));
        var a = t.memoizedState;
        if (((r = a.element), i.isDehydrated))
          if (
            ((i = {
              element: r,
              isDehydrated: !1,
              cache: a.cache,
              pendingSuspenseBoundaries: a.pendingSuspenseBoundaries,
              transitions: a.transitions,
            }),
            (t.updateQueue.baseState = i),
            (t.memoizedState = i),
            t.flags & 256)
          ) {
            ((s = Tr(Error(P(423)), t)), (t = Hu(e, t, r, n, s)));
            break e;
          } else if (r !== s) {
            ((s = Tr(Error(P(424)), t)), (t = Hu(e, t, r, n, s)));
            break e;
          } else
            for (
              ot = Cn(t.stateNode.containerInfo.firstChild),
                ut = t,
                xe = !0,
                Ft = null,
                n = Pd(t, null, r, n),
                t.child = n;
              n;
            )
              ((n.flags = (n.flags & -3) | 4096), (n = n.sibling));
        else {
          if ((Er(), r === s)) {
            t = ln(e, t, n);
            break e;
          }
          Ye(e, t, r, n);
        }
        t = t.child;
      }
      return t;
    case 5:
      return (
        Ld(t),
        e === null && Na(t),
        (r = t.type),
        (s = t.pendingProps),
        (i = e !== null ? e.memoizedProps : null),
        (a = s.children),
        va(r, s) ? (a = null) : i !== null && va(r, i) && (t.flags |= 32),
        af(e, t),
        Ye(e, t, a, n),
        t.child
      );
    case 6:
      return (e === null && Na(t), null);
    case 13:
      return uf(e, t, n);
    case 4:
      return (
        mo(t, t.stateNode.containerInfo),
        (r = t.pendingProps),
        e === null ? (t.child = zr(t, null, r, n)) : Ye(e, t, r, n),
        t.child
      );
    case 11:
      return (
        (r = t.type),
        (s = t.pendingProps),
        (s = t.elementType === r ? s : Et(r, s)),
        Uu(e, t, r, s, n)
      );
    case 7:
      return (Ye(e, t, t.pendingProps, n), t.child);
    case 8:
      return (Ye(e, t, t.pendingProps.children, n), t.child);
    case 12:
      return (Ye(e, t, t.pendingProps.children, n), t.child);
    case 10:
      e: {
        if (
          ((r = t.type._context),
          (s = t.pendingProps),
          (i = t.memoizedProps),
          (a = s.value),
          he(Ms, r._currentValue),
          (r._currentValue = a),
          i !== null)
        )
          if (Mt(i.value, a)) {
            if (i.children === s.children && !et.current) {
              t = ln(e, t, n);
              break e;
            }
          } else
            for (i = t.child, i !== null && (i.return = t); i !== null;) {
              var u = i.dependencies;
              if (u !== null) {
                a = i.child;
                for (var o = u.firstContext; o !== null;) {
                  if (o.context === r) {
                    if (i.tag === 1) {
                      ((o = en(-1, n & -n)), (o.tag = 2));
                      var d = i.updateQueue;
                      if (d !== null) {
                        d = d.shared;
                        var g = d.pending;
                        (g === null
                          ? (o.next = o)
                          : ((o.next = g.next), (g.next = o)),
                          (d.pending = o));
                      }
                    }
                    ((i.lanes |= n),
                      (o = i.alternate),
                      o !== null && (o.lanes |= n),
                      ka(i.return, n, t),
                      (u.lanes |= n));
                    break;
                  }
                  o = o.next;
                }
              } else if (i.tag === 10) a = i.type === t.type ? null : i.child;
              else if (i.tag === 18) {
                if (((a = i.return), a === null)) throw Error(P(341));
                ((a.lanes |= n),
                  (u = a.alternate),
                  u !== null && (u.lanes |= n),
                  ka(a, n, t),
                  (a = i.sibling));
              } else a = i.child;
              if (a !== null) a.return = i;
              else
                for (a = i; a !== null;) {
                  if (a === t) {
                    a = null;
                    break;
                  }
                  if (((i = a.sibling), i !== null)) {
                    ((i.return = a.return), (a = i));
                    break;
                  }
                  a = a.return;
                }
              i = a;
            }
        (Ye(e, t, s.children, n), (t = t.child));
      }
      return t;
    case 9:
      return (
        (s = t.type),
        (r = t.pendingProps.children),
        Sr(t, n),
        (s = wt(s)),
        (r = r(s)),
        (t.flags |= 1),
        Ye(e, t, r, n),
        t.child
      );
    case 14:
      return (
        (r = t.type),
        (s = Et(r, t.pendingProps)),
        (s = Et(r.type, s)),
        Bu(e, t, r, s, n)
      );
    case 15:
      return lf(e, t, t.type, t.pendingProps, n);
    case 17:
      return (
        (r = t.type),
        (s = t.pendingProps),
        (s = t.elementType === r ? s : Et(r, s)),
        gs(e, t),
        (t.tag = 1),
        tt(r) ? ((e = !0), Fs(t)) : (e = !1),
        Sr(t, n),
        tf(t, r, s),
        Ca(t, r, s, n),
        Ea(null, t, r, !0, e, n)
      );
    case 19:
      return cf(e, t, n);
    case 22:
      return sf(e, t, n);
  }
  throw Error(P(156, t.tag));
};
function _f(e, t) {
  return qc(e, t);
}
function pm(e, t, n, r) {
  ((this.tag = e),
    (this.key = n),
    (this.sibling =
      this.child =
      this.return =
      this.stateNode =
      this.type =
      this.elementType =
        null),
    (this.index = 0),
    (this.ref = null),
    (this.pendingProps = t),
    (this.dependencies =
      this.memoizedState =
      this.updateQueue =
      this.memoizedProps =
        null),
    (this.mode = r),
    (this.subtreeFlags = this.flags = 0),
    (this.deletions = null),
    (this.childLanes = this.lanes = 0),
    (this.alternate = null));
}
function yt(e, t, n, r) {
  return new pm(e, t, n, r);
}
function Fo(e) {
  return ((e = e.prototype), !(!e || !e.isReactComponent));
}
function hm(e) {
  if (typeof e == "function") return Fo(e) ? 1 : 0;
  if (e != null) {
    if (((e = e.$$typeof), e === Qa)) return 11;
    if (e === Ga) return 14;
  }
  return 2;
}
function zn(e, t) {
  var n = e.alternate;
  return (
    n === null
      ? ((n = yt(e.tag, t, e.key, e.mode)),
        (n.elementType = e.elementType),
        (n.type = e.type),
        (n.stateNode = e.stateNode),
        (n.alternate = e),
        (e.alternate = n))
      : ((n.pendingProps = t),
        (n.type = e.type),
        (n.flags = 0),
        (n.subtreeFlags = 0),
        (n.deletions = null)),
    (n.flags = e.flags & 14680064),
    (n.childLanes = e.childLanes),
    (n.lanes = e.lanes),
    (n.child = e.child),
    (n.memoizedProps = e.memoizedProps),
    (n.memoizedState = e.memoizedState),
    (n.updateQueue = e.updateQueue),
    (t = e.dependencies),
    (n.dependencies =
      t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }),
    (n.sibling = e.sibling),
    (n.index = e.index),
    (n.ref = e.ref),
    n
  );
}
function ys(e, t, n, r, s, i) {
  var a = 2;
  if (((r = e), typeof e == "function")) Fo(e) && (a = 1);
  else if (typeof e == "string") a = 5;
  else
    e: switch (e) {
      case ur:
        return Kn(n.children, s, i, t);
      case Ya:
        ((a = 8), (s |= 8));
        break;
      case Gi:
        return (
          (e = yt(12, n, t, s | 2)),
          (e.elementType = Gi),
          (e.lanes = i),
          e
        );
      case Xi:
        return ((e = yt(13, n, t, s)), (e.elementType = Xi), (e.lanes = i), e);
      case Ji:
        return ((e = yt(19, n, t, s)), (e.elementType = Ji), (e.lanes = i), e);
      case Lc:
        return ni(n, s, i, t);
      default:
        if (typeof e == "object" && e !== null)
          switch (e.$$typeof) {
            case Mc:
              a = 10;
              break e;
            case Rc:
              a = 9;
              break e;
            case Qa:
              a = 11;
              break e;
            case Ga:
              a = 14;
              break e;
            case gn:
              ((a = 16), (r = null));
              break e;
          }
        throw Error(P(130, e == null ? e : typeof e, ""));
    }
  return (
    (t = yt(a, n, t, s)),
    (t.elementType = e),
    (t.type = r),
    (t.lanes = i),
    t
  );
}
function Kn(e, t, n, r) {
  return ((e = yt(7, e, r, t)), (e.lanes = n), e);
}
function ni(e, t, n, r) {
  return (
    (e = yt(22, e, r, t)),
    (e.elementType = Lc),
    (e.lanes = n),
    (e.stateNode = { isHidden: !1 }),
    e
  );
}
function Ui(e, t, n) {
  return ((e = yt(6, e, null, t)), (e.lanes = n), e);
}
function Bi(e, t, n) {
  return (
    (t = yt(4, e.children !== null ? e.children : [], e.key, t)),
    (t.lanes = n),
    (t.stateNode = {
      containerInfo: e.containerInfo,
      pendingChildren: null,
      implementation: e.implementation,
    }),
    t
  );
}
function mm(e, t, n, r, s) {
  ((this.tag = t),
    (this.containerInfo = e),
    (this.finishedWork =
      this.pingCache =
      this.current =
      this.pendingChildren =
        null),
    (this.timeoutHandle = -1),
    (this.callbackNode = this.pendingContext = this.context = null),
    (this.callbackPriority = 0),
    (this.eventTimes = Ni(0)),
    (this.expirationTimes = Ni(-1)),
    (this.entangledLanes =
      this.finishedLanes =
      this.mutableReadLanes =
      this.expiredLanes =
      this.pingedLanes =
      this.suspendedLanes =
      this.pendingLanes =
        0),
    (this.entanglements = Ni(0)),
    (this.identifierPrefix = r),
    (this.onRecoverableError = s),
    (this.mutableSourceEagerHydrationData = null));
}
function To(e, t, n, r, s, i, a, u, o) {
  return (
    (e = new mm(e, t, n, u, o)),
    t === 1 ? ((t = 1), i === !0 && (t |= 8)) : (t = 0),
    (i = yt(3, null, null, t)),
    (e.current = i),
    (i.stateNode = e),
    (i.memoizedState = {
      element: r,
      isDehydrated: n,
      cache: null,
      transitions: null,
      pendingSuspenseBoundaries: null,
    }),
    ho(i),
    e
  );
}
function gm(e, t, n) {
  var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return {
    $$typeof: or,
    key: r == null ? null : "" + r,
    children: e,
    containerInfo: t,
    implementation: n,
  };
}
function bf(e) {
  if (!e) return Tn;
  e = e._reactInternals;
  e: {
    if (Zn(e) !== e || e.tag !== 1) throw Error(P(170));
    var t = e;
    do {
      switch (t.tag) {
        case 3:
          t = t.stateNode.context;
          break e;
        case 1:
          if (tt(t.type)) {
            t = t.stateNode.__reactInternalMemoizedMergedChildContext;
            break e;
          }
      }
      t = t.return;
    } while (t !== null);
    throw Error(P(171));
  }
  if (e.tag === 1) {
    var n = e.type;
    if (tt(n)) return _d(e, n, t);
  }
  return t;
}
function Ef(e, t, n, r, s, i, a, u, o) {
  return (
    (e = To(n, r, !0, e, s, i, a, u, o)),
    (e.context = bf(null)),
    (n = e.current),
    (r = Qe()),
    (s = En(n)),
    (i = en(r, s)),
    (i.callback = t ?? null),
    _n(n, i, s),
    (e.current.lanes = s),
    El(e, s, r),
    nt(e, r),
    e
  );
}
function ri(e, t, n, r) {
  var s = t.current,
    i = Qe(),
    a = En(s);
  return (
    (n = bf(n)),
    t.context === null ? (t.context = n) : (t.pendingContext = n),
    (t = en(i, a)),
    (t.payload = { element: e }),
    (r = r === void 0 ? null : r),
    r !== null && (t.callback = r),
    (e = _n(s, t, a)),
    e !== null && (Pt(e, s, a, i), ps(e, s, a)),
    a
  );
}
function Ws(e) {
  if (((e = e.current), !e.child)) return null;
  switch (e.child.tag) {
    case 5:
      return e.child.stateNode;
    default:
      return e.child.stateNode;
  }
}
function ec(e, t) {
  if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
    var n = e.retryLane;
    e.retryLane = n !== 0 && n < t ? n : t;
  }
}
function Po(e, t) {
  (ec(e, t), (e = e.alternate) && ec(e, t));
}
function vm() {
  return null;
}
var zf =
  typeof reportError == "function"
    ? reportError
    : function (e) {
        console.error(e);
      };
function Mo(e) {
  this._internalRoot = e;
}
li.prototype.render = Mo.prototype.render = function (e) {
  var t = this._internalRoot;
  if (t === null) throw Error(P(409));
  ri(e, t, null, null);
};
li.prototype.unmount = Mo.prototype.unmount = function () {
  var e = this._internalRoot;
  if (e !== null) {
    this._internalRoot = null;
    var t = e.containerInfo;
    (Jn(function () {
      ri(null, e, null, null);
    }),
      (t[nn] = null));
  }
};
function li(e) {
  this._internalRoot = e;
}
li.prototype.unstable_scheduleHydration = function (e) {
  if (e) {
    var t = sd();
    e = { blockedOn: null, target: e, priority: t };
    for (var n = 0; n < xn.length && t !== 0 && t < xn[n].priority; n++);
    (xn.splice(n, 0, e), n === 0 && ad(e));
  }
};
function Ro(e) {
  return !(!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11));
}
function si(e) {
  return !(
    !e ||
    (e.nodeType !== 1 &&
      e.nodeType !== 9 &&
      e.nodeType !== 11 &&
      (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "))
  );
}
function tc() {}
function xm(e, t, n, r, s) {
  if (s) {
    if (typeof r == "function") {
      var i = r;
      r = function () {
        var d = Ws(a);
        i.call(d);
      };
    }
    var a = Ef(t, r, e, 0, null, !1, !1, "", tc);
    return (
      (e._reactRootContainer = a),
      (e[nn] = a.current),
      xl(e.nodeType === 8 ? e.parentNode : e),
      Jn(),
      a
    );
  }
  for (; (s = e.lastChild);) e.removeChild(s);
  if (typeof r == "function") {
    var u = r;
    r = function () {
      var d = Ws(o);
      u.call(d);
    };
  }
  var o = To(e, 0, !1, null, null, !1, !1, "", tc);
  return (
    (e._reactRootContainer = o),
    (e[nn] = o.current),
    xl(e.nodeType === 8 ? e.parentNode : e),
    Jn(function () {
      ri(t, o, n, r);
    }),
    o
  );
}
function ii(e, t, n, r, s) {
  var i = n._reactRootContainer;
  if (i) {
    var a = i;
    if (typeof s == "function") {
      var u = s;
      s = function () {
        var o = Ws(a);
        u.call(o);
      };
    }
    ri(t, a, e, s);
  } else a = xm(n, t, e, s, r);
  return Ws(a);
}
rd = function (e) {
  switch (e.tag) {
    case 3:
      var t = e.stateNode;
      if (t.current.memoizedState.isDehydrated) {
        var n = Zr(t.pendingLanes);
        n !== 0 &&
          (qa(t, n | 1), nt(t, ze()), !(le & 6) && ((Pr = ze() + 500), Rn()));
      }
      break;
    case 13:
      (Jn(function () {
        var r = rn(e, 1);
        if (r !== null) {
          var s = Qe();
          Pt(r, e, 1, s);
        }
      }),
        Po(e, 1));
  }
};
Za = function (e) {
  if (e.tag === 13) {
    var t = rn(e, 134217728);
    if (t !== null) {
      var n = Qe();
      Pt(t, e, 134217728, n);
    }
    Po(e, 134217728);
  }
};
ld = function (e) {
  if (e.tag === 13) {
    var t = En(e),
      n = rn(e, t);
    if (n !== null) {
      var r = Qe();
      Pt(n, e, t, r);
    }
    Po(e, t);
  }
};
sd = function () {
  return ce;
};
id = function (e, t) {
  var n = ce;
  try {
    return ((ce = e), t());
  } finally {
    ce = n;
  }
};
aa = function (e, t, n) {
  switch (t) {
    case "input":
      if ((ea(e, n), (t = n.name), n.type === "radio" && t != null)) {
        for (n = e; n.parentNode;) n = n.parentNode;
        for (
          n = n.querySelectorAll(
            "input[name=" + JSON.stringify("" + t) + '][type="radio"]',
          ),
            t = 0;
          t < n.length;
          t++
        ) {
          var r = n[t];
          if (r !== e && r.form === e.form) {
            var s = Xs(r);
            if (!s) throw Error(P(90));
            (Dc(r), ea(r, s));
          }
        }
      }
      break;
    case "textarea":
      $c(e, n);
      break;
    case "select":
      ((t = n.value), t != null && jr(e, !!n.multiple, t, !1));
  }
};
Kc = bo;
Yc = Jn;
var ym = { usingClientEntryPoint: !1, Events: [Fl, pr, Xs, Hc, Vc, bo] },
  Qr = {
    findFiberByHostInstance: Bn,
    bundleType: 0,
    version: "18.3.1",
    rendererPackageName: "react-dom",
  },
  jm = {
    bundleType: Qr.bundleType,
    version: Qr.version,
    rendererPackageName: Qr.rendererPackageName,
    rendererConfig: Qr.rendererConfig,
    overrideHookState: null,
    overrideHookStateDeletePath: null,
    overrideHookStateRenamePath: null,
    overrideProps: null,
    overridePropsDeletePath: null,
    overridePropsRenamePath: null,
    setErrorHandler: null,
    setSuspenseHandler: null,
    scheduleUpdate: null,
    currentDispatcherRef: sn.ReactCurrentDispatcher,
    findHostInstanceByFiber: function (e) {
      return ((e = Xc(e)), e === null ? null : e.stateNode);
    },
    findFiberByHostInstance: Qr.findFiberByHostInstance || vm,
    findHostInstancesForRefresh: null,
    scheduleRefresh: null,
    scheduleRoot: null,
    setRefreshHandler: null,
    getCurrentFiber: null,
    reconcilerVersion: "18.3.1-next-f1338f8080-20240426",
  };
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
  var ss = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!ss.isDisabled && ss.supportsFiber)
    try {
      ((Ks = ss.inject(jm)), (Ht = ss));
    } catch {}
}
dt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ym;
dt.createPortal = function (e, t) {
  var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
  if (!Ro(t)) throw Error(P(200));
  return gm(e, t, null, n);
};
dt.createRoot = function (e, t) {
  if (!Ro(e)) throw Error(P(299));
  var n = !1,
    r = "",
    s = zf;
  return (
    t != null &&
      (t.unstable_strictMode === !0 && (n = !0),
      t.identifierPrefix !== void 0 && (r = t.identifierPrefix),
      t.onRecoverableError !== void 0 && (s = t.onRecoverableError)),
    (t = To(e, 1, !1, null, null, n, !1, r, s)),
    (e[nn] = t.current),
    xl(e.nodeType === 8 ? e.parentNode : e),
    new Mo(t)
  );
};
dt.findDOMNode = function (e) {
  if (e == null) return null;
  if (e.nodeType === 1) return e;
  var t = e._reactInternals;
  if (t === void 0)
    throw typeof e.render == "function"
      ? Error(P(188))
      : ((e = Object.keys(e).join(",")), Error(P(268, e)));
  return ((e = Xc(t)), (e = e === null ? null : e.stateNode), e);
};
dt.flushSync = function (e) {
  return Jn(e);
};
dt.hydrate = function (e, t, n) {
  if (!si(t)) throw Error(P(200));
  return ii(null, e, t, !0, n);
};
dt.hydrateRoot = function (e, t, n) {
  if (!Ro(e)) throw Error(P(405));
  var r = (n != null && n.hydratedSources) || null,
    s = !1,
    i = "",
    a = zf;
  if (
    (n != null &&
      (n.unstable_strictMode === !0 && (s = !0),
      n.identifierPrefix !== void 0 && (i = n.identifierPrefix),
      n.onRecoverableError !== void 0 && (a = n.onRecoverableError)),
    (t = Ef(t, null, e, 1, n ?? null, s, !1, i, a)),
    (e[nn] = t.current),
    xl(e),
    r)
  )
    for (e = 0; e < r.length; e++)
      ((n = r[e]),
        (s = n._getVersion),
        (s = s(n._source)),
        t.mutableSourceEagerHydrationData == null
          ? (t.mutableSourceEagerHydrationData = [n, s])
          : t.mutableSourceEagerHydrationData.push(n, s));
  return new li(t);
};
dt.render = function (e, t, n) {
  if (!si(t)) throw Error(P(200));
  return ii(null, e, t, !1, n);
};
dt.unmountComponentAtNode = function (e) {
  if (!si(e)) throw Error(P(40));
  return e._reactRootContainer
    ? (Jn(function () {
        ii(null, null, e, !1, function () {
          ((e._reactRootContainer = null), (e[nn] = null));
        });
      }),
      !0)
    : !1;
};
dt.unstable_batchedUpdates = bo;
dt.unstable_renderSubtreeIntoContainer = function (e, t, n, r) {
  if (!si(n)) throw Error(P(200));
  if (e == null || e._reactInternals === void 0) throw Error(P(38));
  return ii(e, t, n, !1, r);
};
dt.version = "18.3.1-next-f1338f8080-20240426";
function Ff() {
  if (!(
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
  ))
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Ff);
    } catch (e) {
      console.error(e);
    }
}
(Ff(), (zc.exports = dt));
var wm = zc.exports,
  Tf,
  nc = wm;
((Tf = nc.createRoot), nc.hydrateRoot);
async function Ke(e) {
  const t = await fetch(e);
  if (!t.ok) throw new Error(`${e} → ${t.status}`);
  return t.json();
}
async function $t(e, t) {
  const n = await fetch(e, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(t),
    }),
    r = await n.json().catch(() => ({}));
  if (!n.ok) throw new Error(r.detail || `${e} → ${n.status}`);
  return r;
}
const ee = {
  health: () => Ke("/health"),
  modelStatus: () => Ke("/api/model-status"),
  retryModel: () => $t("/api/model-retry", {}),
  devices: () => Ke("/api/devices"),
  captionStyles: () => Ke("/api/caption-styles"),
  fonts: () => Ke("/api/fonts"),
  history: () => Ke("/api/history"),
  generate: (e) => $t("/api/generate", e),
  cancel: (e) => $t(`/api/cancel/${e}`, {}),
  musicSuggest: (e, t) =>
    Ke(
      `/api/music-suggest/${e}` +
        (t ? `?language=${encodeURIComponent(t)}` : ""),
    ),
  transcript: (e, t) =>
    Ke(
      `/api/transcript/${e}` + (t ? `?language=${encodeURIComponent(t)}` : ""),
    ),
  updateTranscript: (e, t, n) =>
    $t(`/api/transcript/${e}`, { segments: t, language: n }),
  result: (e) => Ke(`/api/result/${e}`),
  prefetch: (e) => $t("/api/prefetch", { video_url: e }),
  prefetchStatus: (e) => Ke(`/api/prefetch/${e}`),
  pretranscribe: (e, t, n) =>
    $t("/api/pretranscribe", { source_id: e, device: t, language: n }),
  pretranscribeStatus: (e) => Ke(`/api/pretranscribe/${e}`),
  deleteClip: async (e, t) => {
    const n = await fetch(`/api/clip/${e}/${t}`, { method: "DELETE" }),
      r = await n.json().catch(() => ({}));
    if (!n.ok) throw new Error(r.detail || "Could not delete this clip.");
    return !!r.deleted;
  },
  clipSourceUrl: (e, t) => `/api/clip/${e}/${t}/source`,
  reframeInfo: (e, t) => Ke(`/api/clip/${e}/${t}/reframe`),
  reframeClip: (e, t, n, color) => $t(`/api/clip/${e}/${t}/reframe`, { keyframes: n, video_background: color }),
  music: () => Ke("/api/music"),
  uploadMusic: async (e) => {
    const t = new FormData();
    t.append("file", e);
    const n = await fetch("/api/music/upload", { method: "POST", body: t }),
      r = await n.json().catch(() => ({}));
    if (!n.ok) throw new Error(r.detail || "Music upload failed.");
    return r;
  },
  uploadFont: async (e) => {
    const t = new FormData();
    t.append("file", e);
    const n = await fetch("/api/fonts/upload", { method: "POST", body: t }),
      r = await n.json().catch(() => ({}));
    if (!n.ok) throw new Error(r.detail || "Font upload failed.");
    return r;
  },
  uploadWatermark: async (e) => {
    const t = new FormData();
    t.append("file", e);
    const n = await fetch("/api/watermark/upload", { method: "POST", body: t }),
      r = await n.json().catch(() => ({}));
    if (!n.ok) throw new Error(r.detail || "Watermark upload failed.");
    return r;
  },
  listWatermarks: () => Ke("/api/watermark/list"),
  upload: async (e, t) =>
    new Promise((n, r) => {
      const s = new FormData();
      s.append("file", e);
      const i = new XMLHttpRequest();
      (i.open("POST", "/api/upload"),
        (i.upload.onprogress = (a) => {
          a.lengthComputable && t && t(Math.round((a.loaded / a.total) * 100));
        }),
        (i.onload = () => {
          let a = {};
          try {
            a = JSON.parse(i.responseText);
          } catch {}
          if (i.status === 200 && a.upload_id) n(a);
          else {
            let u = a.detail || "Upload failed.";
            (u === "There was an error parsing the body" &&
              (u =
                "Could not process upload. Please check the file format or ensure enough free disk space."),
              r(new Error(u)));
          }
        }),
        (i.onerror = () => r(new Error("Upload failed — network error."))),
        i.send(s));
    }),
  cacheInfo: () => Ke("/api/cache-info"),
  clearCache: () => $t("/api/clear-cache", {}),
  shutdown: () => $t("/api/shutdown", {}),
  revealClip: (e, t) => $t("/api/reveal", { clip_id: e, index: t }),
};
function Nm(e, t, n) {
  let r = !1,
    s = null,
    i = 0;
  const a = new EventSource(`/api/progress/${e}`);
  a.onmessage = (o) => {
    try {
      t(JSON.parse(o.data));
    } catch {}
  };
  async function u() {
    if (!r) {
      try {
        const o = await fetch(`/api/result/${e}`);
        if (!o.ok) throw new Error(String(o.status));
        i = 0;
        const d = await o.json();
        if ((t(d), ["done", "error", "cancelled"].includes(d.status))) return;
      } catch {
        if (((i += 1), i >= 5)) {
          n && n();
          return;
        }
      }
      s = setTimeout(u, 1e3);
    }
  }
  return (
    (a.onerror = () => {
      (a.close(), u());
    }),
    () => {
      ((r = !0), a.close(), clearTimeout(s));
    }
  );
}
const Ce = (e, t) => (n) =>
    l.jsxs("svg", {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.9",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      ...n,
      children: [e, t],
    }),
  B = {
    bolt: Ce(
      l.jsx("path", {
        d: "M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12z",
        fill: "currentColor",
        stroke: "none",
      }),
    ),
    create: Ce(
      l.jsxs(l.Fragment, {
        children: [
          l.jsx("path", { d: "M12 5v14" }),
          l.jsx("path", { d: "M5 12h14" }),
        ],
      }),
    ),
    library: Ce(
      l.jsxs(l.Fragment, {
        children: [
          l.jsx("rect", { x: "3", y: "3", width: "7", height: "7", rx: "1.5" }),
          l.jsx("rect", {
            x: "14",
            y: "3",
            width: "7",
            height: "7",
            rx: "1.5",
          }),
          l.jsx("rect", {
            x: "3",
            y: "14",
            width: "7",
            height: "7",
            rx: "1.5",
          }),
          l.jsx("rect", {
            x: "14",
            y: "14",
            width: "7",
            height: "7",
            rx: "1.5",
          }),
        ],
      }),
    ),
    settings: Ce(
      l.jsxs(l.Fragment, {
        children: [
          l.jsx("circle", { cx: "12", cy: "12", r: "3" }),
          l.jsx("path", {
            d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.82 1.17V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15H4.5a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 6 9.4l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 11 7.6V7.5a2 2 0 0 1 4 0v.09A1.65 1.65 0 0 0 18 9.4l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 20.4 15z",
          }),
        ],
      }),
    ),
    download: Ce(
      l.jsxs(l.Fragment, {
        children: [
          l.jsx("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
          l.jsx("polyline", { points: "7 10 12 15 17 10" }),
          l.jsx("line", { x1: "12", y1: "15", x2: "12", y2: "3" }),
        ],
      }),
    ),
    link: Ce(
      l.jsxs(l.Fragment, {
        children: [
          l.jsx("path", {
            d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",
          }),
          l.jsx("path", {
            d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
          }),
        ],
      }),
    ),
    upload: Ce(
      l.jsxs(l.Fragment, {
        children: [
          l.jsx("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
          l.jsx("polyline", { points: "17 8 12 3 7 8" }),
          l.jsx("line", { x1: "12", y1: "3", x2: "12", y2: "15" }),
        ],
      }),
    ),
    trash: Ce(
      l.jsxs(l.Fragment, {
        children: [
          l.jsx("polyline", { points: "3 6 5 6 21 6" }),
          l.jsx("path", {
            d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
          }),
        ],
      }),
    ),
    film: Ce(
      l.jsxs(l.Fragment, {
        children: [
          l.jsx("rect", { x: "2", y: "2", width: "20", height: "20", rx: "3" }),
          l.jsx("path", { d: "M2 7h20M2 17h20M7 2v20M17 2v20" }),
        ],
      }),
    ),
    refresh: Ce(
      l.jsxs(l.Fragment, {
        children: [
          l.jsx("polyline", { points: "23 4 23 10 17 10" }),
          l.jsx("path", {
            d: "M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
          }),
        ],
      }),
    ),
    check: Ce(
      l.jsx("polyline", { points: "20 6 9 17 4 12", strokeWidth: "3" }),
    ),
    crop: Ce(
      l.jsxs(l.Fragment, {
        children: [
          l.jsx("path", { d: "M6 2v14a2 2 0 0 0 2 2h14" }),
          l.jsx("path", { d: "M18 22V8a2 2 0 0 0-2-2H2" }),
        ],
      }),
    ),
    edit: Ce(
      l.jsxs(l.Fragment, {
        children: [
          l.jsx("path", {
            d: "M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z",
          }),
          l.jsx("path", { d: "m15 5 4 4" }),
        ],
      }),
    ),
    close: Ce(
      l.jsxs(l.Fragment, {
        children: [
          l.jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
          l.jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" }),
        ],
      }),
    ),
    clock: Ce(
      l.jsxs(l.Fragment, {
        children: [
          l.jsx("circle", { cx: "12", cy: "12", r: "10" }),
          l.jsx("polyline", { points: "12 6 12 12 16 14" }),
        ],
      }),
    ),
    play: Ce(
      l.jsx("polygon", {
        points: "6 4 20 12 6 20 6 4",
        fill: "currentColor",
        stroke: "none",
      }),
    ),
    pause: Ce(
      l.jsxs(l.Fragment, {
        children: [
          l.jsx("rect", {
            x: "6",
            y: "4",
            width: "4",
            height: "16",
            fill: "currentColor",
            stroke: "none",
            rx: "1",
          }),
          l.jsx("rect", {
            x: "14",
            y: "4",
            width: "4",
            height: "16",
            fill: "currentColor",
            stroke: "none",
            rx: "1",
          }),
        ],
      }),
    ),
    volume: Ce(
      l.jsxs(l.Fragment, {
        children: [
          l.jsx("polygon", {
            points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5",
            fill: "currentColor",
            stroke: "none",
          }),
          l.jsx("path", { d: "M15.54 8.46a5 5 0 0 1 0 7.07" }),
          l.jsx("path", { d: "M19.07 4.93a10 10 0 0 1 0 14.14" }),
        ],
      }),
    ),
    mute: Ce(
      l.jsxs(l.Fragment, {
        children: [
          l.jsx("polygon", {
            points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5",
            fill: "currentColor",
            stroke: "none",
          }),
          l.jsx("line", { x1: "23", y1: "9", x2: "17", y2: "15" }),
          l.jsx("line", { x1: "17", y1: "9", x2: "23", y2: "15" }),
        ],
      }),
    ),
    pin: Ce(
      l.jsxs(l.Fragment, {
        children: [
          l.jsx("path", {
            d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z",
          }),
          l.jsx("circle", { cx: "12", cy: "10", r: "3" }),
        ],
      }),
    ),
    power: Ce(
      l.jsxs(l.Fragment, {
        children: [
          l.jsx("path", { d: "M18.36 6.64a9 9 0 1 1-12.73 0" }),
          l.jsx("line", { x1: "12", y1: "2", x2: "12", y2: "12" }),
        ],
      }),
    ),
    type: Ce(
      l.jsxs(l.Fragment, {
        children: [
          l.jsx("polyline", { points: "4 7 4 4 20 4 20 7" }),
          l.jsx("line", { x1: "9", y1: "20", x2: "15", y2: "20" }),
          l.jsx("line", { x1: "12", y1: "4", x2: "12", y2: "20" }),
        ],
      }),
    ),
  },
  km = [
    ["auto", "Auto-detect"],
    ["en", "English"],
    ["hinglish", "Hinglish — Roman Urdu / Hindi"],
    ["ur", "Urdu — اردو"],
    ["hi", "Hindi — हिन्दी"],
    ["pa", "Punjabi — ਪੰਜਾਬੀ"],
    ["bn", "Bengali — বাংলা"],
    ["as", "Assamese — অসমীয়া"],
    ["mr", "Marathi — मराठी"],
    ["gu", "Gujarati — ગુજરાતી"],
    ["te", "Telugu — తెలుగు"],
    ["ta", "Tamil — தமிழ்"],
    ["kn", "Kannada — ಕನ್ನಡ"],
    ["ml", "Malayalam — മലയാളം"],
    ["ar", "Arabic — العربية"],
    ["fa", "Persian — فارسی"],
    ["es", "Spanish — Español"],
    ["fr", "French — Français"],
    ["de", "German — Deutsch"],
    ["pt", "Portuguese — Português"],
    ["ru", "Russian — Русский"],
    ["tr", "Turkish — Türkçe"],
    ["id", "Indonesian — Bahasa"],
    ["ja", "Japanese — 日本語"],
    ["ko", "Korean — 한국어"],
    ["zh", "Chinese — 中文"],
  ],
  rc = {
    en: { words: ["Make", "it", "go", "viral"], hl: 3 },
    hinglish: { words: ["Caption", "ab", "Hinglish", "mein"], hl: 2 },
    hi: { words: ["कैप्शन", "अब", "हिंदी", "में"], hl: 2 },
    ur: { words: ["کیپشن", "اب", "اردو", "میں"], hl: 2 },
    ar: { words: ["التعليقات", "الآن", "بالعربية"], hl: 2 },
    fa: { words: ["زیرنویس", "به", "فارسی"], hl: 2 },
    pa: { words: ["ਕੈਪਸ਼ਨ", "ਹੁਣ", "ਪੰਜਾਬੀ"], hl: 2 },
    bn: { words: ["ক্যাপশন", "এখন", "বাংলা"], hl: 2 },
    as: { words: ["কেপচন", "এতিয়া", "অসমীয়াত"], hl: 2 },
    mr: { words: ["कॅप्शन", "आता", "मराठीत"], hl: 2 },
    gu: { words: ["કૅપ્શન", "હવે", "ગુજરાતીમાં"], hl: 2 },
    te: { words: ["క్యాప్షన్లు", "ఇప్పుడు", "తెలుగులో"], hl: 2 },
    ta: { words: ["கேப்ஷன்கள்", "இப்போது", "தமிழில்"], hl: 2 },
    kn: { words: ["ಕ್ಯಾಪ್ಷನ್‌ಗಳು", "ಈಗ", "ಕನ್ನಡದಲ್ಲಿ"], hl: 2 },
    ml: { words: ["ക്യാപ്ഷനുകൾ", "ഇപ്പോൾ", "മലയാളത്തിൽ"], hl: 2 },
    es: { words: ["Hazlo", "volverse", "viral"], hl: 2 },
    fr: { words: ["Rends-le", "viral"], hl: 1 },
    de: { words: ["Mach", "es", "viral"], hl: 2 },
    pt: { words: ["Torne-o", "viral"], hl: 1 },
    ru: { words: ["Сделай", "это", "вирусным"], hl: 2 },
    tr: { words: ["Onu", "viral", "yap"], hl: 1 },
    id: { words: ["Buat", "jadi", "viral"], hl: 2 },
    ja: { words: ["バズら", "せよう"], hl: 1 },
    ko: { words: ["떡상", "가자"], hl: 0 },
    zh: { words: ["让它", "爆红"], hl: 1 },
  },
  lc = {
    ur: "Noto Nastaliq Urdu",
    fa: "Noto Naskh Arabic",
    ar: "Noto Sans Arabic",
    hi: "Noto Sans Devanagari",
    mr: "Noto Sans Devanagari",
    ne: "Noto Sans Devanagari",
    te: "Noto Sans Telugu",
    ta: "Noto Sans Tamil",
    kn: "Noto Sans Kannada",
    ml: "Noto Sans Malayalam",
    gu: "Noto Sans Gujarati",
    bn: "Noto Sans Bengali",
    as: "Noto Sans Bengali",
    pa: "Noto Sans Gurmukhi",
  };
function Sm(e) {
  return rc[e] || rc.en;
}
function Cm(e, t) {
  return e.find((n) => n.id === t) || e[0] || {};
}
function Pf(e, t, n) {
  return Object.assign({}, Cm(e, t), n || {});
}
function sc(e, t) {
  ((e = (e || "#000000").replace("#", "")),
    e.length === 3 &&
      (e = e
        .split("")
        .map((i) => i + i)
        .join("")));
  const n = parseInt(e.slice(0, 2), 16) || 0,
    r = parseInt(e.slice(2, 4), 16) || 0,
    s = parseInt(e.slice(4, 6), 16) || 0;
  return `rgba(${n},${r},${s},${t})`;
}
function _m(e, t) {
  if (!e || e < 0.4) return "";
  const n = [];
  for (let r = 0; r < 360; r += 45) {
    const s = (Math.cos((r * Math.PI) / 180) * e).toFixed(1),
      i = (Math.sin((r * Math.PI) / 180) * e).toFixed(1);
    n.push(`${s}px ${i}px 0 ${t}`);
  }
  return n.join(",");
}
function Bt(e, t) {
  return t === "shadow_enabled"
    ? e.shadow_enabled !== void 0
      ? !!e.shadow_enabled
      : (e.shadow || 0) > 0
    : !!e[t];
}
function Lo(e, { fontPx: t = 40, scale: n = 0.2 } = {}) {
  const r = ((e.outline_width != null ? e.outline_width : e.outline) || 0) * n,
    s = !!e.background_enabled,
    i = [];
  if (!s) {
    const u = _m(r, e.outline_color || "#000");
    u && i.push(u);
  }
  if (Bt(e, "glow_enabled")) {
    const u = (e.glow_intensity != null ? e.glow_intensity : 10) * n,
      o = e.glow_color || "#7C4DFF";
    i.push(`0 0 ${u.toFixed(1)}px ${o}`, `0 0 ${(u * 2).toFixed(1)}px ${o}`);
  }
  if (Bt(e, "shadow_enabled")) {
    const u =
        (e.shadow_distance != null ? e.shadow_distance : e.shadow || 6) * n,
      o = (e.shadow_opacity != null ? e.shadow_opacity : 75) / 100;
    i.push(
      `${u.toFixed(1)}px ${u.toFixed(1)}px ${(u * 0.6).toFixed(1)}px ${sc(e.shadow_color || "#000", o)}`,
    );
  }
  const a = {
    fontFamily: `'${(e.font_family || "Roboto").replace(/'/g, "")}', sans-serif`,
    fontWeight: e.bold ? 800 : 600,
    color: e.primary_color || "#fff",
    fontSize: `${t}px`,
    letterSpacing: `${((e.tracking || 0) * n).toFixed(1)}px`,
    textTransform: e.uppercase ? "uppercase" : "none",
    textDecoration:
      (
        (e.underline ? "underline " : "") +
        (e.strikethrough ? "line-through" : "")
      ).trim() || "none",
    transform: e.rotation ? `rotate(${-e.rotation}deg)` : "none",
    textShadow: i.join(",") || "none",
    lineHeight: 1.12,
  };
  if (s) {
    const u = (e.background_opacity != null ? e.background_opacity : 100) / 100;
    ((a.background = sc(e.background_color || "#000", u)),
      (a.padding = ".12em .34em"),
      (a.borderRadius = `${((e.background_radius != null ? e.background_radius : 10) * n).toFixed(1)}px`));
  }
  return a;
}
const bm = {
    none: "",
    warm: "saturate(1.1) sepia(.18) hue-rotate(-8deg) brightness(1.02)",
    cool: "saturate(1.05) hue-rotate(12deg) contrast(1.03)",
    teal_orange: "saturate(1.18) contrast(1.06) sepia(.12) hue-rotate(-6deg)",
    vintage: "sepia(.35) saturate(.85) contrast(.95) brightness(1.03)",
    vibrant: "saturate(1.4) contrast(1.08) brightness(1.01)",
    bw: "grayscale(1) contrast(1.1)",
  },
  Em = [
    ["none", "None"],
    ["warm", "Warm"],
    ["cool", "Cool"],
    ["teal_orange", "Teal & Orange"],
    ["vintage", "Vintage"],
    ["vibrant", "Vibrant"],
    ["bw", "Black & White"],
  ],
  ic = {
    color_grade: "none",
    bottom_gradient: !1,
    bottom_gradient_height: 25,
    bottom_gradient_strength: 70,
    top_gradient: !1,
    top_gradient_height: 20,
    top_gradient_strength: 60,
    vignette: !1,
    vignette_strength: 50,
    glow: !1,
    glow_strength: 50,
    grain: !1,
    grain_strength: 40,
    letterbox: !1,
    letterbox_size: 50,
    sharpen: !1,
    sharpen_strength: 40,
    chroma_shift: !1,
    chroma_shift_strength: 40,
  };
function zm(e) {
  return (
    (e.color_grade && e.color_grade !== "none") ||
    e.bottom_gradient ||
    e.top_gradient ||
    e.vignette ||
    e.glow ||
    e.grain ||
    e.letterbox ||
    e.sharpen ||
    e.chroma_shift
  );
}
function Fm(e) {
  if (!e) return null;
  let t = e.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{11})/,
  );
  return t
    ? { kind: "embed", src: `https://www.youtube.com/embed/${t[1]}` }
    : ((t = e.match(/vimeo\.com\/(\d+)/)),
      t
        ? { kind: "embed", src: `https://player.vimeo.com/video/${t[1]}` }
        : /\.(mp4|webm|mov|m4v)(\?|$)/i.test(e)
          ? { kind: "video", src: e }
          : { kind: "unknown", src: e });
}
const Mf = "clipxy4all_caption_presets_v1",
  Tm = "clipxy4all_caption_presets_v1";
function Pm() {
  try {
    const e = localStorage.getItem(Mf) || localStorage.getItem(Tm);
    return JSON.parse(e) || [];
  } catch {
    return [];
  }
}
function ac(e) {
  try {
    localStorage.setItem(Mf, JSON.stringify(e));
  } catch {}
}
function Mm(e, t, n) {
  const [r, s] = x.useState("bold_white"),
    [i, a] = x.useState("bold_white"),
    [u, o] = x.useState({}),
    [d, g] = x.useState(Pm),
    [m, p] = x.useState("all"),
    [w, _] = x.useState({ ...ic }),
    N = x.useMemo(() => Pf(e, r, u), [e, r, u]),
    R = x.useMemo(() => {
      const F = {};
      return (
        [
          ...(t.user || []),
          ...(t.multilingual || []),
          ...(t.bundled || []),
        ].forEach((L) => (F[L.family] = L.file)),
        F
      );
    }, [t]),
    h = (F, L) => {
      o(
        typeof F == "object" && F !== null
          ? (y) => ({ ...y, ...F })
          : (y) => ({ ...y, [F]: L }),
      );
    },
    c = (F, L) => {
      const y = lc[F];
      return y ? { ...L, font_family: y } : L;
    };
  function f(F) {
    const L = {};
    (u.font_scale != null && (L.font_scale = u.font_scale),
      u.pos_x != null && (L.pos_x = u.pos_x),
      u.pos_y != null && (L.pos_y = u.pos_y),
      s(F),
      a(F),
      o(c(n, L)));
  }
  function v(F) {
    (s(F.base), a(F.id), o(JSON.parse(JSON.stringify(F.overrides || {}))));
  }
  function j() {
    (o(c(n, {})), a(r));
  }
  function k(F) {
    const L = (F || "").trim();
    if (!L) return !1;
    const y = {
        id: "user_" + Date.now().toString(36),
        label: L,
        base: r,
        overrides: JSON.parse(JSON.stringify(u)),
      },
      U = [y, ...d];
    return (g(U), ac(U), a(y.id), !0);
  }
  function E(F) {
    const L = d.filter((y) => y.id !== F);
    (g(L), ac(L), i === F && a(r));
  }
  function C(F) {
    const L = lc[F];
    L && h("font_family", L);
  }
  return {
    presets: e,
    fonts: t,
    fontFiles: R,
    cfg: N,
    styleId: r,
    activeKey: i,
    overrides: u,
    userPresets: d,
    galleryFilter: m,
    cinematic: w,
    setGalleryFilter: p,
    setOverride: h,
    resetOverrides: j,
    selectPreset: f,
    selectUserPreset: v,
    saveCurrentPreset: k,
    removeUserPreset: E,
    onLanguageChange: C,
    setCine: (F, L) => _((y) => ({ ...y, [F]: L })),
    resetCine: () => _({ ...ic }),
  };
}
const Wi = (e) => (e / 1048576).toFixed(e >= 10485760 ? 0 : 1),
  Hi = (e) => {
    const t = Number(e);
    return Number.isFinite(t) && t > 0
      ? Math.min(99, Math.max(1, Math.round(t * 100)))
      : null;
  };
function Rm(e, t) {
  const [n, r] = x.useState({ phase: "idle", message: "", pct: null }),
    [s, i] = x.useState(null),
    [a, u] = x.useState(null),
    o = x.useRef({
      pf: null,
      pt: null,
      sourceId: null,
      urlKey: null,
      generation: 0,
    }),
    d = x.useRef(t),
    g = x.useRef(e);
  ((d.current = t), (g.current = e));
  const m = () => (d.current === "auto" ? null : d.current),
    p = () => {
      (clearTimeout(o.current.pf),
        clearTimeout(o.current.pt),
        (o.current.pf = o.current.pt = null));
    };
  function w() {
    (p(),
      i(null),
      u(null),
      (o.current.generation += 1),
      (o.current.sourceId = null),
      (o.current.urlKey = null),
      r({ phase: "idle", message: "", pct: null }));
  }
  async function _(v, j) {
    if (j === o.current.generation)
      try {
        const k = await ee.prefetchStatus(v);
        if (j !== o.current.generation) return;
        if (k.status === "done")
          (i(k.download_id),
            u(o.current.urlKey),
            r({
              phase: "downloaded",
              message: "Downloaded — preparing transcript…",
              pct: 100,
            }),
            R(k.download_id, m(), j));
        else if (k.status === "error")
          ((o.current.urlKey = null),
            r({
              phase: "error",
              message: k.error || k.message || "Download failed.",
              pct: null,
            }));
        else {
          const E = k.total_bytes || 0,
            C = k.downloaded_bytes || 0;
          (r({
            phase: "downloading",
            pct: E && C > 0 ? Hi(C / E) : null,
            message: E
              ? `Downloading ${Wi(C)} / ${Wi(E)} MB`
              : C
                ? `Downloading ${Wi(C)} MB…`
                : k.message || "Starting download…",
          }),
            (o.current.pf = setTimeout(() => _(v, j), 500)));
        }
      } catch {
        if (j !== o.current.generation) return;
        ((o.current.urlKey = null),
          r((k) => ({
            ...k,
            phase: "error",
            message: "Lost contact with the download.",
          })));
      }
  }
  async function N(v, j) {
    if (j === o.current.generation)
      try {
        const k = await ee.pretranscribeStatus(v);
        if (j !== o.current.generation) return;
        k.status === "done"
          ? r({
              phase: "ready",
              message: "Ready — video & transcript prepared",
              pct: 100,
            })
          : k.status === "error" || k.status === "cancelled"
            ? r({
                phase: "ready",
                message: "Video ready (transcript runs on Generate)",
                pct: 100,
              })
            : (r({
                phase: "transcribing",
                message: k.message || "Transcribing in the background…",
                pct: Hi(k.progress),
              }),
              (o.current.pt = setTimeout(() => N(v, j), 700)));
      } catch {
        if (j !== o.current.generation) return;
        r({
          phase: "ready",
          message: "Video ready (transcript runs on Generate)",
          pct: 100,
        });
      }
  }
  async function R(v, j, k = o.current.generation) {
    (clearTimeout(o.current.pt),
      (o.current.sourceId = v),
      r({
        phase: "transcribing",
        message: "Preparing transcript…",
        pct: null,
      }));
    try {
      const E = await ee.pretranscribe(v, g.current, j);
      if (k !== o.current.generation) return;
      E.status === "running"
        ? (r({
            phase: "transcribing",
            message: E.message || "Transcribing in the background…",
            pct: Hi(E.progress),
          }),
          (o.current.pt = setTimeout(() => N(E.pretranscribe_id, k), 700)))
        : E.status === "done"
          ? r({
              phase: "ready",
              message: "Ready — video & transcript prepared",
              pct: 100,
            })
          : (E.status === "error" || E.status === "cancelled") &&
            r({
              phase: "ready",
              message: "Video ready (transcript runs on Generate)",
              pct: 100,
            });
    } catch {
      if (k !== o.current.generation) return;
      r({
        phase: "ready",
        message: "Video ready (transcript runs on Generate)",
        pct: 100,
      });
    }
  }
  function h(v) {
    if (!v || o.current.urlKey === v) return;
    (w(), (o.current.urlKey = v));
    const j = o.current.generation;
    (r({ phase: "downloading", message: "Starting download…", pct: null }),
      ee
        .prefetch(v)
        .then((k) => {
          j === o.current.generation &&
            (k.status === "done"
              ? (i(k.download_id), u(v), R(k.download_id, m(), j))
              : (o.current.pf = setTimeout(() => _(k.prefetch_id, j), 500)));
        })
        .catch((k) => {
          j === o.current.generation &&
            ((o.current.urlKey = null),
            r({
              phase: "error",
              message: "Could not start download: " + k.message,
              pct: null,
            }));
        }));
  }
  function c(v) {
    v &&
      o.current.sourceId !== v &&
      (p(),
      i(null),
      u(null),
      (o.current.generation += 1),
      (o.current.urlKey = null),
      R(v, m(), o.current.generation));
  }
  function f(v) {
    ((d.current = v),
      o.current.sourceId &&
        ((o.current.generation += 1),
        R(o.current.sourceId, v === "auto" ? null : v, o.current.generation)));
  }
  return (
    x.useEffect(
      () => () => {
        ((o.current.generation += 1), p());
      },
      [],
    ),
    {
      prep: n,
      downloadId: s,
      downloadUrl: a,
      startUrl: h,
      startUpload: c,
      relang: f,
      reset: w,
    }
  );
}
function Lm(e, t) {
  const n = (i) => ({ pos_x: i.pos_x, pos_y: i.pos_y, zoom: i.zoom ?? 100 });
  if (!e.length) return { pos_x: 50, pos_y: 50, zoom: 100 };
  const r = [...e].sort((i, a) => i.time - a.time);
  if (t <= r[0].time) return n(r[0]);
  const s = r[r.length - 1];
  if (t >= s.time) return n(s);
  for (let i = 0; i < r.length - 1; i++) {
    const a = r[i],
      u = r[i + 1];
    if (t >= a.time && t <= u.time) {
      const o = u.time > a.time ? (t - a.time) / (u.time - a.time) : 0,
        d = a.zoom ?? 100,
        g = u.zoom ?? 100;
      return {
        pos_x: a.pos_x + (u.pos_x - a.pos_x) * o,
        pos_y: a.pos_y + (u.pos_y - a.pos_y) * o,
        zoom: d + (g - d) * o,
      };
    }
  }
  return n(s);
}
function Vi(e, t, n) {
  const s = e.findIndex((u) => Math.abs(u.time - t) < 0.05),
    i = {
      time: Math.max(0, +t.toFixed(2)),
      pos_x: Math.round(n.pos_x * 10) / 10,
      pos_y: Math.round(n.pos_y * 10) / 10,
      zoom: Math.round(Math.max(40, Math.min(100, n.zoom ?? 100)) * 10) / 10,
    };
  return (s >= 0 ? e.map((u, o) => (o === s ? i : u)) : [...e, i]).sort(
    (u, o) => u.time - o.time,
  );
}
const is = (e) =>
  `${Math.floor(e / 60)}:${(e % 60).toFixed(1).padStart(4, "0")}`;
function Im({
  clipId: e,
  clip: t,
  targetAspect: n,
  initialKeyframes: r,
  onClose: s,
  onSaved: i,
}) {
  const [canvasColor,setCanvasColor]=x.useState("black");
  const a = x.useRef(null),
    [u, o] = x.useState(
      r && r.length ? r : [{ time: 0, pos_x: 50, pos_y: 50, zoom: 100 }],
    ),
    [d, g] = x.useState(0),
    [m, p] = x.useState(!1),
    [w, _] = x.useState(null),
    [N, R] = x.useState(!1),
    [h, c] = x.useState(""),
    f = x.useRef(null),
    v = x.useRef(null),
    j = x.useRef(null),
    k = Math.max(0.1, t.end - t.start),
    E = ee.clipSourceUrl(e, t.index);
  x.useEffect(() => {
    const z = a.current;
    if (!z) return;
    const I = () => {
        (_({ w: z.videoWidth, h: z.videoHeight }), (z.currentTime = t.start));
      },
      W = () => {
        let Q = z.currentTime - t.start;
        (Q >= k && (z.pause(), p(!1), (Q = k), (z.currentTime = t.start + k)),
          Q < 0 && (Q = 0),
          g(Q));
      },
      Z = () => p(!1);
    return (
      z.addEventListener("loadedmetadata", I),
      z.addEventListener("timeupdate", W),
      z.addEventListener("pause", Z),
      z.readyState >= 1 && I(),
      () => {
        (z.removeEventListener("loadedmetadata", I),
          z.removeEventListener("timeupdate", W),
          z.removeEventListener("pause", Z));
      }
    );
  }, [e, t.index]);
  function C(z) {
    const I = Math.max(0, Math.min(k, z));
    g(I);
    const W = a.current;
    if (W)
      try {
        W.currentTime = t.start + I;
      } catch {}
  }
  function H() {
    const z = a.current;
    z && (m ? (z.pause(), p(!1)) : (d >= k - 0.05 && C(0), z.play(), p(!0)));
  }
  x.useEffect(() => {
    function z(I) {
      I.code === "Space" &&
        I.target.tagName !== "INPUT" &&
        I.target.tagName !== "TEXTAREA" &&
        (I.preventDefault(), H());
    }
    return (
      window.addEventListener("keydown", z),
      () => window.removeEventListener("keydown", z)
    );
  }, [m, d, k]);
  const M = x.useMemo(() => Lm(u, d), [u, d]),
    F = x.useMemo(() => {
      if (!w || !w.w || !w.h) return null;
      const z = w.w / w.h,
        I = Math.max(0.4, Math.min(1, (M.zoom ?? 100) / 100));
      let W, Z;
      n < z
        ? ((W = (n / z) * 100), (Z = 100))
        : ((W = 100), (Z = (z / n) * 100));
      const Q = W * I,
        me = Z * I,
        de = 100 - Q,
        ue = 100 - me,
        be = de > 0.01 ? (M.pos_x / 100) * de : (100 - Q) / 2,
        rt = ue > 0.01 ? (M.pos_y / 100) * ue : (100 - me) / 2;
      return { left: be, top: rt, width: Q, height: me };
    }, [w, n, M]);
  function L(z) {
    if (!F || !j.current) return;
    z.preventDefault();
    const I = j.current.getBoundingClientRect();
    ((f.current = {
      rect: I,
      box: F,
      zoom: M.zoom ?? 100,
      startX: z.clientX,
      startY: z.clientY,
    }),
      window.addEventListener("pointermove", y),
      window.addEventListener("pointerup", U));
  }
  function y(z) {
    const I = f.current;
    if (!I) return;
    const W = ((z.clientX - I.startX) / I.rect.width) * 100,
      Z = ((z.clientY - I.startY) / I.rect.height) * 100,
      Q = 100 - I.box.width,
      me = 100 - I.box.height,
      de = Math.max(0, Math.min(Q, I.box.left + W)),
      ue = Math.max(0, Math.min(me, I.box.top + Z)),
      be = Q > 0.01 ? (de / Q) * 100 : 50,
      rt = me > 0.01 ? (ue / me) * 100 : 50;
    o((A) => Vi(A, d, { pos_x: be, pos_y: rt, zoom: I.zoom }));
  }
  function U() {
    ((f.current = null),
      window.removeEventListener("pointermove", y),
      window.removeEventListener("pointerup", U));
  }
  function oe(z) {
    if (!F || !j.current) return;
    (z.preventDefault(), z.stopPropagation());
    const I = j.current.getBoundingClientRect(),
      W = I.left + ((F.left + F.width / 2) / 100) * I.width,
      Z = I.top + ((F.top + F.height / 2) / 100) * I.height,
      Q = Math.max(1, Math.hypot(z.clientX - W, z.clientY - Z));
    ((v.current = {
      centerX: W,
      centerY: Z,
      startDist: Q,
      startZoom: M.zoom ?? 100,
      pos_x: M.pos_x,
      pos_y: M.pos_y,
    }),
      window.addEventListener("pointermove", Y),
      window.addEventListener("pointerup", te));
  }
  function Y(z) {
    const I = v.current;
    if (!I) return;
    const W = Math.hypot(z.clientX - I.centerX, z.clientY - I.centerY),
      Z = Math.max(40, Math.min(100, I.startZoom * (W / I.startDist)));
    o((Q) => Vi(Q, d, { pos_x: I.pos_x, pos_y: I.pos_y, zoom: Z }));
  }
  function te() {
    ((v.current = null),
      window.removeEventListener("pointermove", Y),
      window.removeEventListener("pointerup", te));
  }
  x.useEffect(
    () => () => {
      (window.removeEventListener("pointermove", y),
        window.removeEventListener("pointerup", U),
        window.removeEventListener("pointermove", Y),
        window.removeEventListener("pointerup", te));
    },
    [],
  );
  function T() {
    o((z) => Vi(z, d, M));
  }
  function O(z) {
    o((I) =>
      I.length > 1 ? I.filter((W) => Math.abs(W.time - z) > 0.001) : I,
    );
  }
  async function D() {
    (R(!0), c(""));
    try {
      const z = await ee.reframeClip(e, t.index, u, canvasColor);
      i(t.index, z.url, u);
    } catch (z) {
      c(z.message);
    } finally {
      R(!1);
    }
  }
  const X = u.some((z) => Math.abs(z.time - d) < 0.05);
  return l.jsxs("div", {
    className: "reframe-editor",
    children: [
      l.jsxs("div", {
        className: "reframe-head",
        children: [
          l.jsxs("h2", {
            children: [l.jsx(B.crop, {}), " Reframe — ", t.title],
          }),
          l.jsx("button", {
            className: "btn btn-ghost",
            onClick: s,
            children: "← Back to review",
          }),
        ],
      }),
      l.jsxs("div", {
        className: "reframe-body",
        children: [
          l.jsxs("div", {
            className: "reframe-stage-wrap",
            children: [
              l.jsxs("div", {
                className: "reframe-stage",
                ref: j,
                style: { aspectRatio: w ? `${w.w} / ${w.h}` : "16 / 9" },
                children: [
                  l.jsx("video", {
                    ref: a,
                    src: E,
                    playsInline: !0,
                    preload: "metadata",
                  }),
                  F &&
                    l.jsxs("div", {
                      className: "reframe-box",
                      style: {
                        left: F.left + "%",
                        top: F.top + "%",
                        width: F.width + "%",
                        height: F.height + "%",
                      },
                      onPointerDown: L,
                      children: [
                        l.jsx("span", {
                          className: "reframe-box-corner tl",
                          onPointerDown: oe,
                        }),
                        l.jsx("span", {
                          className: "reframe-box-corner tr",
                          onPointerDown: oe,
                        }),
                        l.jsx("span", {
                          className: "reframe-box-corner bl",
                          onPointerDown: oe,
                        }),
                        l.jsx("span", {
                          className: "reframe-box-corner br",
                          onPointerDown: oe,
                        }),
                      ],
                    }),
                  !w &&
                    l.jsx("div", {
                      className: "w2-preview-empty",
                      children: "Loading source…",
                    }),
                ],
              }),
              l.jsxs("div", {
                className: "reframe-controls",
                children: [
                  l.jsx("button", {
                    className: "btn btn-ghost",
                    onClick: H,
                    children: m ? "Pause" : "Play",
                  }),
                  l.jsx("input", {
                    type: "range",
                    className: "range",
                    min: 0,
                    max: k,
                    step: 0.05,
                    value: d,
                    onChange: (z) => C(+z.target.value),
                  }),
                  l.jsxs("span", {
                    className: "reframe-time",
                    children: [is(d), " / ", is(k)],
                  }),
                ],
              }),
              l.jsxs("div", {
                className: "reframe-timeline",
                children: [
                  u.map((z) =>
                    l.jsx(
                      "button",
                      {
                        className:
                          "reframe-kf" +
                          (Math.abs(z.time - d) < 0.05 ? " active" : ""),
                        style: { left: (z.time / k) * 100 + "%" },
                        title: `Keyframe @ ${is(z.time)} — click to jump`,
                        onClick: () => C(z.time),
                      },
                      z.time,
                    ),
                  ),
                  l.jsx("div", {
                    className: "reframe-timeline-track",
                    onClick: (z) => {
                      const I = z.currentTarget.getBoundingClientRect();
                      C(((z.clientX - I.left) / I.width) * k);
                    },
                  }),
                ],
              }),
              l.jsxs("div", {
                className: "row",
                style: { gap: 10, marginTop: 10 },
                children: [
                  l.jsx("button", {
                    className: "btn btn-ghost",
                    onClick: T,
                    disabled: X,
                    children: "+ Keyframe here",
                  }),
                  l.jsx("button", {
                    className: "btn btn-ghost",
                    onClick: () => O(d),
                    disabled: !X || u.length <= 1,
                    children: "Delete this keyframe",
                  }),
                ],
              }),
              l.jsx("div", {
                className: "note",
                children:
                  "Drag the crop box to move it, or its corner handles to resize (zoom in/out) — both add/update a keyframe at the current time. Position and size both pan/zoom smoothly between keyframes.",
              }),
            ],
          }),
          l.jsxs("aside", {
            className: "reframe-sidebar card",
            children: [
              l.jsx(ReframeBackground,{clipId:e,index:t.index,source:E,time:d,position:M,color:canvasColor,setColor:setCanvasColor}),
              l.jsx("div", {
                className: "card-h",
                children: l.jsx("h2", { children: "Keyframes" }),
              }),
              u.map((z, I) =>
                l.jsxs(
                  "div",
                  {
                    className: "reframe-kf-row",
                    onClick: () => C(z.time),
                    children: [
                      l.jsx("span", { children: is(z.time) }),
                      l.jsxs("span", {
                        className: "hint",
                        children: [
                          "x ",
                          Math.round(z.pos_x),
                          "% · y ",
                          Math.round(z.pos_y),
                          "% · ",
                          Math.round(z.zoom ?? 100),
                          "%",
                        ],
                      }),
                    ],
                  },
                  I,
                ),
              ),
              h && l.jsx("div", { className: "error", children: h }),
              l.jsx("button", {
                className: "btn btn-primary btn-block",
                style: { marginTop: 16 },
                onClick: D,
                disabled: N,
                children: N
                  ? "Saving & re-rendering…"
                  : "Save & re-render this clip",
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
const Hs = "/assets/logo-icon-8rM3AWVT.png";
function Dm({
  source: e,
  setSource: t,
  url: n,
  setUrl: r,
  upload: s,
  upPct: i,
  drag: a,
  setDrag: u,
  fileRef: o,
  doUpload: d,
  onClear: g,
  sourceReady: m,
  error: p,
  onContinue: w,
  captionsEnabled: _ = !0,
  setCaptionsEnabled: N,
}) {
  const R = e === "upload" && i != null && !s,
    h = e === "upload" && (s || i != null);
  return l.jsxs(l.Fragment, {
    children: [
      l.jsxs("div", {
        className: "landing",
        children: [
          l.jsxs("div", {
            className: "brand-hero",
            children: [
              l.jsx("span", {
                className: "brand-mark",
                children: l.jsx("img", { src: Hs, alt: "Clipxy4all" }),
              }),
              l.jsx("span", {
                className: "brand-word",
                children: "Clipxy4all",
              }),
              l.jsx("span", {
                className: "brand-by-hero",
                children: "Create. Clip. Share.",
              }),
            ],
          }),
          l.jsxs("span", {
            className: "eyebrow",
            children: [
              l.jsx("span", { className: "eyebrow-dot" }),
              "100% local AI pipeline · no API keys required",
            ],
          }),
          l.jsxs("h1", {
            className: "landing-title",
            children: [
              "Turn long videos into ",
              l.jsx("span", {
                className: "grad",
                children: "viral short clips",
              }),
            ],
          }),
          l.jsx("p", {
            className: "landing-sub",
            children:
              "Paste a link or drop a video — Clipxy4all extracts the best hooks, builds viral split-screens, and burns animated captions ready to post in seconds.",
          }),
          l.jsxs("div", {
            className: "cmdbar" + (a ? " drag" : ""),
            onDragOver: (c) => {
              (c.preventDefault(), u(!0));
            },
            onDragLeave: () => u(!1),
            onDrop: (c) => {
              (c.preventDefault(), u(!1), d(c.dataTransfer.files[0]));
            },
            children: [
              l.jsx("input", {
                ref: o,
                type: "file",
                accept: "video/*",
                hidden: !0,
                onChange: (c) => d(c.target.files[0]),
              }),
              l.jsxs("button", {
                className: "cmd-upload",
                onClick: () => {
                  var c;
                  return (c = o.current) == null ? void 0 : c.click();
                },
                title: "Upload a video file",
                children: [
                  l.jsx(B.upload, {}),
                  l.jsx("span", { children: "Upload" }),
                ],
              }),
              h
                ? l.jsxs("div", {
                    className: "cmd-file",
                    children: [
                      l.jsx("span", {
                        className: "cmd-file-name",
                        children: R
                          ? i >= 100
                            ? "Processing upload…"
                            : i > 0
                              ? `Uploading… ${i}%`
                              : "Starting upload…"
                          : `✓ ${s == null ? void 0 : s.filename}`,
                      }),
                      l.jsx("button", {
                        className: "cmd-clear",
                        onClick: g,
                        title: "Remove",
                        children: "✕",
                      }),
                    ],
                  })
                : l.jsxs(l.Fragment, {
                    children: [
                      l.jsx("input", {
                        className: "cmd-input",
                        type: "text",
                        placeholder: "Paste a YouTube or video link…",
                        value: n,
                        onChange: (c) => {
                          (t("url"), r(c.target.value));
                        },
                        onKeyDown: (c) => {
                          c.key === "Enter" && m && w();
                        },
                      }),
                      !n &&
                        l.jsxs("button", {
                          type: "button",
                          className: "btn btn-ghost btn-sm",
                          style: {
                            fontSize: "12.5px",
                            padding: "6px 12px",
                            borderRadius: "8px",
                            background: "rgba(255,255,255,0.06)",
                            color: "var(--text-dim)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            cursor: "pointer",
                            border: "1px solid rgba(255,255,255,0.1)",
                            marginRight: "6px",
                          },
                          onClick: async () => {
                            try {
                              const c = await navigator.clipboard.readText();
                              c && c.trim() && (t("url"), r(c.trim()));
                            } catch {}
                          },
                          title: "Paste link from clipboard",
                          children: [l.jsx(B.link, {}), " Paste"],
                        }),
                    ],
                  }),
              l.jsxs("button", {
                className: "cmd-go",
                disabled: !m || R,
                onClick: w,
                children: [
                  l.jsx(B.bolt, {}),
                  " ",
                  R ? "Uploading…" : "Continue",
                ],
              }),
            ],
          }),
          l.jsxs("div", {
            className: "landing-captions-choice",
            style: {
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              marginTop: 18,
            },
            children: [
              l.jsx("span", {
                style: {
                  fontSize: "13.5px",
                  fontWeight: 600,
                  color: "var(--muted)",
                },
                children: "Captions",
              }),
              l.jsxs("div", {
                className: "toggle",
                children: [
                  l.jsx("button", {
                    type: "button",
                    className: _ ? "active" : "",
                    onClick: () => N && N(!0),
                    children: "With Captions",
                  }),
                  l.jsx("button", {
                    type: "button",
                    className: _ ? "" : "active",
                    onClick: () => N && N(!1),
                    children: "Without Captions",
                  }),
                ],
              }),
            ],
          }),
          p && l.jsx("div", { className: "error landing-error", children: p }),
          l.jsx("div", {
            className: "landing-hints",
            children: [
              "🏄 Split-Screen & Custom B-Roll",
              "⏱️ CapCut Retention Progress Bar",
              "🎨 120+ Caption Styles",
              "🎯 AI Speaker Centering",
              "✂️ Smart Silence Removal",
              "📱 1080p Full HD (9:16, Square Reel, 4:5, 16:9)",
            ].map((c) =>
              l.jsxs(
                "span",
                {
                  className: "hint-chip",
                  children: [
                    l.jsx("span", {
                      className: "hc-check",
                      children: l.jsx(B.check, {}),
                    }),
                    c,
                  ],
                },
                c,
              ),
            ),
          }),
        ],
      }),
      l.jsxs("section", {
        className: "landing-more",
        children: [
          l.jsxs("div", {
            className: "landing-section",
            children: [
              l.jsx("span", { className: "eyebrow", children: "How it works" }),
              l.jsx("h2", {
                className: "landing-h2",
                children: "From link to posted clip in 5 simple steps",
              }),
              l.jsx("div", {
                className: "how-steps",
                children: [
                  [
                    "Paste link or upload video",
                    "YouTube links, podcasts, webinars, or raw video files directly from your computer.",
                  ],
                  [
                    "Choose format & viral layout",
                    "Pick 9:16, Square Reel (a square on a vertical video), 4:5, 16:9, or Split-Screen with custom gameplay uploads, Subway Surfers, or Satisfying footage.",
                  ],
                  [
                    "Style captions, progress bar & audio",
                    "Pick from 120 caption presets, toggle the CapCut retention progress bar, remove dead pauses, and mix ducked background music.",
                  ],
                  [
                    "Review settings & generate",
                    "Inspect your layout, AI speaker tracking, hook titles, and retention bar in real-time, then render with one click.",
                  ],
                  [
                    "Download & publish",
                    "Crystal-clear 1080p master quality clips ready to blow up on TikTok, Instagram Reels, and YouTube Shorts.",
                  ],
                ].map(([c, f], v) =>
                  l.jsxs(
                    "div",
                    {
                      className: "how-step",
                      children: [
                        l.jsx("span", {
                          className: "how-step-n",
                          children: v + 1,
                        }),
                        l.jsxs("div", {
                          children: [
                            l.jsx("h3", { children: c }),
                            l.jsx("p", { children: f }),
                          ],
                        }),
                      ],
                    },
                    c,
                  ),
                ),
              }),
            ],
          }),
          l.jsxs("div", {
            className: "landing-section",
            children: [
              l.jsx("span", {
                className: "eyebrow",
                children: "What you can do",
              }),
              l.jsx("h2", {
                className: "landing-h2",
                children: "Everything a short-form editor needs — 100% local",
              }),
              l.jsx("div", {
                className: "feature-grid",
                children: [
                  [
                    l.jsx(B.film, {}),
                    "Viral Split-Screen & Custom B-Roll",
                    "Stack speaker video on top with Subway Surfers, Oddly Satisfying, or upload your own custom Minecraft / GTA 5 gameplay footage.",
                  ],
                  [
                    l.jsx(B.clock, {}),
                    "CapCut-Style Retention Progress Bar",
                    "Drive audience completion rates with an animated accent progress bar at the top or bottom that fills from 0% to 100% as the clip plays.",
                  ],
                  [
                    l.jsx(B.create, {}),
                    "120+ Caption Styles",
                    "Hormozi, karaoke, neon box, emerald box, word-reveal, and cyber glow styles with custom fonts, strokes, and background boxes.",
                  ],
                  [
                    l.jsx(B.crop, {}),
                    "AI Face Tracking & Smart Reframe",
                    "Automatically detect and center speakers or drag interactive keyframes to pan and zoom across time.",
                  ],
                  [
                    l.jsx(B.bolt, {}),
                    "Smart Silence Removal",
                    "Cuts out silent pauses and dead air for punchy, fast-paced pacing that keeps viewers hooked.",
                  ],
                  [
                    l.jsx(B.settings, {}),
                    "1080p Master Quality · 100% Local",
                    "Locked to crisp 1080p resolution with bicubic scaling and high-fidelity encoding. Runs entirely on your PC with zero API fees.",
                  ],
                ].map(([c, f, v]) =>
                  l.jsxs(
                    "div",
                    {
                      className: "feature-card",
                      children: [
                        l.jsx("span", {
                          className: "feature-ico",
                          children: c,
                        }),
                        l.jsx("h3", { children: f }),
                        l.jsx("p", { children: v }),
                      ],
                    },
                    f,
                  ),
                ),
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function oc(e) {
  return e * e * (3 - 2 * e);
}
function as(e, t) {
  const n = Math.max(0, Math.min(1, (e || 0) / 100));
  return `linear-gradient(to bottom, ${[0, 0.25, 0.5, 0.75, 1]
    .map((s) => {
      const i = t === "top" ? 1 - oc(s) : oc(s);
      return `rgba(0,0,0,${(n * i).toFixed(3)}) ${s * 100}%`;
    })
    .join(", ")})`;
}
function Om(e, t, n, r = "round") {
  const s = r === "square" ? "0px" : "14px";
  return n
    ? {
        box: {
          left: 0,
          right: 0,
          top: "8.97%",
          height: "82.05%",
          borderRadius: "0px",
        },
        top: 8.97,
        height: 82.05,
      }
    : t === "square"
      ? {
          box: {
            left: "2.78%",
            top: "28.2%",
            width: "94.4%",
            height: "43.6%",
            borderRadius: s,
          },
          top: 28.2,
          height: 43.6,
        }
      : e === "4:5"
        ? {
            box: {
              left: "3.5%",
              right: "3.5%",
              top: "16.8%",
              height: "66.4%",
              borderRadius: s,
            },
            top: 16.8,
            height: 66.4,
          }
        : e === "16:9"
          ? {
              box: {
                left: 0,
                right: 0,
                top: "37%",
                height: "26%",
                borderRadius: s,
              },
              top: 37,
              height: 26,
            }
          : {
              box: {
                left: 0,
                right: 0,
                top: "8.97%",
                height: "82.05%",
                borderRadius: s,
              },
              top: 8.97,
              height: 82.05,
            };
}
function $m({ cfg: e, language: t, fontPx: n, scale: r }) {
  const s = Sm(t),
    i = e.karaoke ? "karaoke" : e.animation || "none",
    [a, u] = x.useState(0);
  x.useEffect(() => {
    if (i === "none") {
      u(0);
      return;
    }
    const m = s.words.length,
      p = setInterval(
        () => u((w) => (w + 1) % m),
        i === "one_word" ? 620 : 520,
      );
    return () => clearInterval(p);
  }, [i, s.words.length]);
  const o = e.primary_color || "#fff",
    d = e.highlight_color || "#FFD400",
    g = Lo(e, { fontPx: n, scale: r });
  return l.jsx("span", {
    className: "cap-line",
    style: g,
    children: s.words.map((m, p) => {
      let w,
        _ = 1,
        N = "none",
        R = "inline";
      return (
        i === "highlight"
          ? (w = p === a ? d : o)
          : i === "karaoke"
            ? (w = p <= a ? d : o)
            : i === "word_reveal"
              ? ((_ = p <= a ? 1 : 0), (N = p <= a ? "scale(1)" : "scale(.7)"))
              : i === "one_word"
                ? (R = p === a ? "inline" : "none")
                : e.animation === "highlight" && p === s.hl && (w = d),
        l.jsxs(
          "span",
          {
            style: {
              color: w,
              opacity: _,
              transform: N,
              display: R,
              transition: "color .18s, opacity .25s, transform .25s",
            },
            children: [m, " "],
          },
          p,
        )
      );
    }),
  });
}
function ai({
  cfg: e,
  cinematic: t,
  language: n,
  media: r,
  preparing: s,
  aspect: i,
  fit: a,
  squareCorners: u = "round",
  barText: o,
  barTextColor: d,
  barTextAnim: g,
  signature: m,
  setSig: p,
  setOverride: w,
  videoRef: _,
  captionsEnabled: N = !0,
  splitScreen: R = !1,
  splitDivider: h = "blue",
  splitBroll: c = "subway_surfers",
  customBrollPreviewUrl: f = null,
  progressBar: v = !1,
  progressBarColor: j = "#FACC15",
  progressBarPosition: k = "top",
  progressBarHeight: E = 10,
  imageWatermark: C = null,
  setImageWatermark: H = null,
  onTimeUpdate: M,
  onLoadedMetadata: F,
  onDurationChange: L,
  onPlay: y,
  onPause: U,
  onEnded: oe,
  isMuted: Y = !0,
}) {
  const canvas = x.useContext(CanvasContext);
  const captionRegion = a === "square" || R ? {top:8.97,height:82.05,left:0,width:100} : {top:Om(i,a,R,u).top,height:Om(i,a,R,u).height,left:i==="4:5"?3.5:0,width:i==="4:5"?93:100};
  const te = x.useRef(null),
    T = x.useRef(null),
    [O, D] = x.useState(!1),
    [X, z] = x.useState(!1),
    [I, W] = x.useState(224),
    Z = Om(i, a, R, u),
    Q = (ne) => {
      (T.current && T.current.paused && T.current.play().catch(() => {}),
        y && y(ne));
    },
    me = (ne) => {
      (T.current && !T.current.paused && T.current.pause(), U && U(ne));
    };
  x.useEffect(() => {
    const ne = te.current;
    if (!ne || typeof ResizeObserver > "u") return;
    const J = new ResizeObserver(() => W(ne.clientWidth));
    return (J.observe(ne), W(ne.clientWidth), () => J.disconnect());
  }, []);
  function de(ne) {
    if (!p) return;
    (ne.preventDefault(), ne.stopPropagation());
    const J = te.current.getBoundingClientRect(),
      Ve = ne.touches ? ne.touches[0] : ne,
      Gt = ((Ve.clientX - J.left) / J.width) * 100,
      Je = ((Ve.clientY - J.top) / J.height) * 100,
      mt = m.pos_x != null ? m.pos_x : 50,
      st = m.pos_y != null ? m.pos_y : 92,
      fe = (ye) => {
        const it = ye.touches ? ye.touches[0] : ye,
          Lt = ((it.clientX - J.left) / J.width) * 100,
          pe = ((it.clientY - J.top) / J.height) * 100;
        let Pe = Math.max(4, Math.min(96, mt + (Lt - Gt))),
          Se = Math.max(4, Math.min(96, st + (pe - Je)));
        (Math.abs(Pe - 50) < 1.5 && (Pe = 50),
          p("pos_x", Math.round(Pe)),
          p("pos_y", Math.round(Se)));
      },
      Fe = () => {
        (document.removeEventListener("mousemove", fe),
          document.removeEventListener("mouseup", Fe),
          document.removeEventListener("touchmove", fe),
          document.removeEventListener("touchend", Fe));
      };
    (document.addEventListener("mousemove", fe),
      document.addEventListener("mouseup", Fe),
      document.addEventListener("touchmove", fe, { passive: !1 }),
      document.addEventListener("touchend", Fe));
  }
  const ue = captionRegion.top,
    be = captionRegion.height;
  function rt(ne) {
    if (!H || !C) return;
    (ne.preventDefault(), ne.stopPropagation(), z(!0));
    const J = te.current.getBoundingClientRect(),
      Ve = ne.touches ? ne.touches[0] : ne,
      Gt = ((Ve.clientX - J.left) / J.width) * 100,
      Je = ((((Ve.clientY - J.top) / J.height) * 100 - ue) / be) * 100,
      mt = C.pos_x != null ? C.pos_x : 85,
      st = C.pos_y != null ? C.pos_y : 15,
      fe = (ye) => {
        const it = ye.touches ? ye.touches[0] : ye,
          Lt = ((it.clientX - J.left) / J.width) * 100,
          pe = ((((it.clientY - J.top) / J.height) * 100 - ue) / be) * 100;
        let Pe = mt + (Lt - Gt),
          Se = st + (pe - Je);
        ((Pe = Math.max(2, Math.min(98, Pe))),
          (Se = Math.max(2, Math.min(98, Se))),
          Math.abs(Pe - 50) < 1.5 && (Pe = 50),
          Math.abs(Se - 50) < 1.5 && (Se = 50),
          H("pos_x", Math.round(Pe * 10) / 10),
          H("pos_y", Math.round(Se * 10) / 10));
      },
      Fe = () => {
        (z(!1),
          document.removeEventListener("mousemove", fe),
          document.removeEventListener("mouseup", Fe),
          document.removeEventListener("touchmove", fe),
          document.removeEventListener("touchend", Fe));
      };
    (document.addEventListener("mousemove", fe),
      document.addEventListener("mouseup", Fe),
      document.addEventListener("touchmove", fe, { passive: !1 }),
      document.addEventListener("touchend", Fe));
  }
  const A = t || {},
    se = A.letterbox
      ? 5 + ((A.letterbox_size != null ? A.letterbox_size : 50) / 100) * 9
      : 0,
    Kt = e.pos_x != null && e.pos_y != null,
    Ir = !R && !!(o && o.trim()),
    an = a === "square",
    Yt = an
      ? 0.16
      : Ir
        ? A.letterbox
          ? Math.max(0.22, se / 100 + 0.12)
          : 0.22
        : A.letterbox
          ? Math.max(0.12, se / 100 + 0.04)
          : 0.12,
    pt = an ? 0.81 : A.letterbox ? Math.min(0.82, 1 - se / 100 - 0.04) : 0.82,
    Qt =
      e.position === "top"
        ? A.letterbox
          ? Math.max(0.15, se / 100 + 0.04)
          : 0.15
        : e.position === "center"
          ? 0.65
          : A.letterbox
            ? Math.min(0.8, 1 - se / 100 - 0.04)
            : 0.8,
    Ee = Kt
      ? e.pos_y / 100
      : R
        ? Qt
        : { top: Yt, center: 0.5, bottom: pt }[e.position || "bottom"],
    ht = !Kt && R && Ee >= 0.44 && Ee <= 0.56 ? 0.65 : Ee,
    kt = Kt ? e.pos_x : 50,
    er = ue + ht * be;
  function lt(ne) {
    (ne.preventDefault(), ne.stopPropagation(), D(!0));
    const J = te.current.getBoundingClientRect(),
      Ve = ne.touches ? ne.touches[0] : ne,
      Gt = (((Ve.clientX - J.left) / J.width) * 100 - captionRegion.left) / captionRegion.width * 100,
      Je = ((((Ve.clientY - J.top) / J.height) * 100 - ue) / be) * 100,
      mt = kt,
      st = Kt
        ? e.pos_y
        : R
          ? Qt * 100
          : { top: Yt * 100, center: 50, bottom: pt * 100 }[
              e.position || "bottom"
            ],
      fe = (ye) => {
        const it = ye.touches ? ye.touches[0] : ye,
          Lt = (((it.clientX - J.left) / J.width) * 100 - captionRegion.left) / captionRegion.width * 100,
          pe = ((((it.clientY - J.top) / J.height) * 100 - ue) / be) * 100;
        let Pe = mt + (Lt - Gt),
          Se = st + (pe - Je);
        ((Pe = Math.max(0, Math.min(100, Pe))),
          (Se = Math.max(0, Math.min(100, Se))),
          w({
            pos_x: Math.round(Pe * 10) / 10,
            pos_y: Math.round(Se * 10) / 10,
          }));
      },
      Fe = () => {
        (D(!1),
          document.removeEventListener("mousemove", fe),
          document.removeEventListener("mouseup", Fe),
          document.removeEventListener("touchmove", fe),
          document.removeEventListener("touchend", Fe));
      };
    (document.addEventListener("mousemove", fe),
      document.addEventListener("mouseup", Fe),
      document.addEventListener("touchmove", fe, { passive: !1 }),
      document.addEventListener("touchend", Fe));
  }
  const Ln = (() => {
      let ne = bm[A.color_grade] || "";
      if (A.glow) {
        const J = 1 + ((A.glow_strength || 0) / 100) * 0.12;
        ne += ` brightness(${J.toFixed(3)}) contrast(1.03)`;
      }
      return ne.trim();
    })(),
    Rt =
      i === "16:9" && a !== "square"
        ? 1080 / 1920
        : i === "4:5" && a !== "square"
          ? 1350 / 1920
          : 1,
    In = (I || 240) / 1080,
    on = Math.max(
      10,
      Math.round((e.font_size || 90) * (e.font_scale || 1) * Rt * In),
    ),
    Dn = In * Rt * (e.font_scale || 1);
  return l.jsx("div", {
    className: "phone",
    children: l.jsxs("div", {
      ref: te,
      className: "phone-screen" + (r ? "" : " empty"),
      children: [
        l.jsx("div",{className:"video-canvas-background",style:{position:"absolute",left:captionRegion.left+"%",width:captionRegion.width+"%",top:captionRegion.top+"%",height:captionRegion.height+"%",background:canvas.color}}),
        l.jsx("div", { className: "island" }),
        l.jsxs("div", {
          className: "preview-pill",
          children: [l.jsx("span", { className: "dot" }), "Preview"],
        }),
        (r == null ? void 0 : r.kind) === "embed" &&
          l.jsx("iframe", {
            className: "embed-fill",
            src: r.src,
            allow: "autoplay; encrypted-media; picture-in-picture",
            allowFullScreen: !0,
            referrerPolicy: "strict-origin-when-cross-origin",
          }),
        R
          ? l.jsxs("div", {
              className: "media-box split-media-box",
              style: {
                ...Z.box,
                filter: Ln,
                display: "flex",
                flexDirection: "column",
              },
              children: [
                l.jsxs("div", {
                  className: "split-half split-top",
                  style: {
                    flex: 1,
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                  children: [
                    (r == null ? void 0 : r.kind) === "video" &&
                      l.jsx("video", {
                        ref: _,
                        src: r.src,
                        muted: Y,
                        loop: !0,
                        autoPlay: !0,
                        playsInline: !0,
                        style: {
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        },
                        onTimeUpdate: M,
                        onLoadedMetadata: F,
                        onDurationChange: L,
                        onPlay: Q,
                        onPause: me,
                        onEnded: oe,
                      }),
                    (!r || r.kind === "unknown") &&
                      l.jsx("div", {
                        className: "media-ph",
                        style: { fontSize: "11px" },
                        children: s
                          ? l.jsxs(l.Fragment, {
                              children: [
                                l.jsx("span", { className: "spinner" }),
                                " Preparing…",
                              ],
                            })
                          : "Speaker Video",
                      }),
                    l.jsx("div", {
                      className: "split-badge split-badge-top",
                      children: "👤 Speaker (AI Centered)",
                    }),
                  ],
                }),
                l.jsx("div", {
                  className: `split-divider-line split-divider-${h || "blue"}`,
                }),
                l.jsxs("div", {
                  className: "split-half split-bottom",
                  style: {
                    flex: 1,
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#050b14",
                  },
                  children: [
                    c === "custom" && !f
                      ? l.jsxs("div", {
                          style: {
                            textAlign: "center",
                            padding: "16px 12px",
                            color: "var(--text-dim)",
                            fontSize: "11px",
                          },
                          children: [
                            l.jsx("div", {
                              style: { fontSize: "22px", marginBottom: "4px" },
                              children: "🎮",
                            }),
                            "Custom B-Roll placeholder",
                            l.jsx("br", {}),
                            "Upload video in Settings!",
                          ],
                        })
                      : l.jsx(
                          "video",
                          {
                            ref: T,
                            src:
                              c === "custom"
                                ? f
                                : `/broll/${c === "satisfying" ? "satisfying.mp4" : "subway_surfers.mp4"}`,
                            muted: !0,
                            loop: !0,
                            autoPlay: !0,
                            playsInline: !0,
                            style: {
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            },
                          },
                          c === "custom" ? f : c,
                        ),
                    l.jsx("div", {
                      className: "split-badge split-badge-bot",
                      children:
                        c === "custom"
                          ? "🎮 Custom Gameplay"
                          : c === "satisfying"
                            ? "✨ Oddly Satisfying"
                            : "🏄 Subway Surfers",
                    }),
                  ],
                }),
                A.bottom_gradient &&
                  l.jsx("div", {
                    className: "ov",
                    style: {
                      left: 0,
                      right: 0,
                      bottom: 0,
                      height: (A.bottom_gradient_height || 25) + "%",
                      background: as(A.bottom_gradient_strength, "bottom"),
                    },
                  }),
                A.top_gradient &&
                  l.jsx("div", {
                    className: "ov",
                    style: {
                      left: 0,
                      right: 0,
                      top: 0,
                      height: (A.top_gradient_height || 20) + "%",
                      background: as(A.top_gradient_strength, "top"),
                    },
                  }),
                A.vignette &&
                  l.jsx("div", {
                    className: "ov",
                    style: {
                      inset: 0,
                      background: `radial-gradient(ellipse 75% 75% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,${(((A.vignette_strength || 0) / 100) * 0.9).toFixed(3)}) 115%)`,
                    },
                  }),
                A.letterbox &&
                  l.jsxs(l.Fragment, {
                    children: [
                      l.jsx("div", {
                        className: "ov",
                        style: {
                          left: 0,
                          right: 0,
                          top: 0,
                          height: se + "%",
                          background: "#000",
                          zIndex: 10,
                        },
                      }),
                      l.jsx("div", {
                        className: "ov",
                        style: {
                          left: 0,
                          right: 0,
                          bottom: 0,
                          height: se + "%",
                          background: "#000",
                          zIndex: 10,
                        },
                      }),
                    ],
                  }),
              ],
            })
          : l.jsxs("div", {
              className: "media-box",
              style: { ...Z.box, filter: Ln },
              children: [
                (r == null ? void 0 : r.kind) === "video" &&
                  l.jsx("video", {
                    ref: _,
                    src: r.src,
                    muted: Y,
                    loop: !0,
                    autoPlay: !0,
                    playsInline: !0,
                    onTimeUpdate: M,
                    onLoadedMetadata: F,
                    onDurationChange: L,
                    onPlay: y,
                    onPause: U,
                    onEnded: oe,
                  }),
                (!r || r.kind === "unknown") &&
                  l.jsx("div", {
                    className: "media-ph",
                    children: s
                      ? l.jsxs(l.Fragment, {
                          children: [
                            l.jsx("span", { className: "spinner" }),
                            " Preparing preview…",
                          ],
                        })
                      : (r == null ? void 0 : r.kind) === "unknown"
                        ? "Can't embed this link — it'll still render"
                        : "Add a video to preview",
                  }),
                A.bottom_gradient &&
                  l.jsx("div", {
                    className: "ov",
                    style: {
                      left: 0,
                      right: 0,
                      bottom: 0,
                      height: (A.bottom_gradient_height || 25) + "%",
                      background: as(A.bottom_gradient_strength, "bottom"),
                    },
                  }),
                A.top_gradient &&
                  l.jsx("div", {
                    className: "ov",
                    style: {
                      left: 0,
                      right: 0,
                      top: 0,
                      height: (A.top_gradient_height || 20) + "%",
                      background: as(A.top_gradient_strength, "top"),
                    },
                  }),
                A.vignette &&
                  l.jsx("div", {
                    className: "ov",
                    style: {
                      inset: 0,
                      background: `radial-gradient(ellipse 75% 75% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,${(((A.vignette_strength || 0) / 100) * 0.9).toFixed(3)}) 115%)`,
                    },
                  }),
                A.letterbox &&
                  l.jsxs(l.Fragment, {
                    children: [
                      l.jsx("div", {
                        className: "ov",
                        style: {
                          left: 0,
                          right: 0,
                          top: 0,
                          height: se + "%",
                          background: "#000",
                          zIndex: 10,
                        },
                      }),
                      l.jsx("div", {
                        className: "ov",
                        style: {
                          left: 0,
                          right: 0,
                          bottom: 0,
                          height: se + "%",
                          background: "#000",
                          zIndex: 10,
                        },
                      }),
                    ],
                  }),
              ],
            }),
        !R &&
          o &&
          l.jsx(
            "div",
            {
              className:
                "frame-title" +
                (g === "fade" ? " ft-fade" : g === "slide" ? " ft-slide" : ""),
              style: {
                top:
                  a === "square"
                    ? "22%"
                    : i === "16:9"
                      ? "30.5%"
                      : i === "4:5"
                        ? "11%"
                        : A.letterbox
                          ? Math.max(11.5, se + 2) + "%"
                          : "11.5%",
                whiteSpace: "pre-line",
                color: d || "#fff",
              },
              children: o,
            },
            o + g,
          ),
        N !== !1 && e.engine === "canvas" && l.jsx(NativeLayer,{cfg:e,language:n,aspect:a==="square"||R?"9:16":i,region:captionRegion,setOverride:w}),
        N !== !1 && e.engine !== "canvas" &&
          l.jsx("div", {
            className: "cap-preview" + (O ? " dragging" : ""),
            style: {
              left: (captionRegion.left + kt / 100 * captionRegion.width) + "%",
              top: er + "%",
              transform: "translate(-50%, -50%)",
              right: "auto",
              bottom: "auto",
              maxWidth: "92%",
            },
            children: l.jsx("span", {
              className: "cap-line-wrap",
              onMouseDown: lt,
              onTouchStart: lt,
              children: l.jsx($m, {
                cfg: e,
                language: n,
                fontPx: on,
                scale: Dn,
              }),
            }),
          }),
        (m == null ? void 0 : m.enabled) &&
          (m.text || "").trim() &&
          l.jsx("div", {
            className: "sig-preview",
            onMouseDown: de,
            style: {
              left: (m.pos_x != null ? m.pos_x : 50) + "%",
              top: (m.pos_y != null ? m.pos_y : 92) + "%",
              transform: `translate(${-(m.pos_x != null ? m.pos_x : 50)}%, ${-(m.pos_y != null ? m.pos_y : 92)}%)`,
              color: m.color || "#fff",
              opacity: (m.opacity != null ? m.opacity : 75) / 100,
              fontSize:
                Math.max(7, ((m.size != null ? m.size : 34) * I) / 1080) + "px",
            },
            children: m.text,
          }),
        an &&
          (C == null ? void 0 : C.enabled) &&
          (C == null ? void 0 : C.url) &&
          l.jsxs("div", {
            className: "wm-preview" + (X ? " dragging" : ""),
            onMouseDown: rt,
            onTouchStart: rt,
            style: {
              position: "absolute",
              left: (C.pos_x != null ? C.pos_x : 85) + "%",
              top: ue + ((C.pos_y != null ? C.pos_y : 15) / 100) * be + "%",
              width: (C.scale != null ? C.scale : 18) + "%",
              transform: `translate(-${C.pos_x != null ? C.pos_x : 85}%, -${C.pos_y != null ? C.pos_y : 15}%)`,
              opacity: (C.opacity != null ? C.opacity : 85) / 100,
              zIndex: 35,
            },
            title: "Drag to place anywhere in the preview window",
            children: [
              l.jsx("img", {
                src: C.url,
                alt: "Watermark",
                style: {
                  width: "100%",
                  height: "auto",
                  display: "block",
                  pointerEvents: "none",
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.65))",
                },
              }),
              l.jsx("div", { className: "wm-drag-border" }),
            ],
          }),
        v &&
          l.jsx("div", {
            className: "progress-bar-preview",
            style: {
              position: "absolute",
              left: 0,
              right: 0,
              top: k === "bottom" ? "auto" : 0,
              bottom: k === "bottom" ? 0 : "auto",
              height:
                Math.max(3, Math.round((((E || 10) * I) / 1080) * 2.8)) + "px",
              background: "rgba(0,0,0,0.5)",
              zIndex: 40,
              overflow: "hidden",
            },
            children: l.jsx("div", {
              className: "progress-bar-fill-anim",
              style: {
                height: "100%",
                background: j || "#FACC15",
                boxShadow: `0 0 8px ${j || "#FACC15"}aa`,
                borderRadius: "0 2px 2px 0",
              },
            }),
          }),
      ],
    }),
  });
}
const Am = [
  ["9:16", "9:16 Vertical"],
  ["4:5", "4:5 Portrait"],
  ["16:9", "16:9 Landscape"],
  ["1:1", "Square Reel (9:16 export)"],
];
function ar(e) {
  if (e == null || isNaN(e) || !isFinite(e)) return "0:00";
  const t = Math.max(0, e),
    n = Math.floor(t / 60),
    r = t % 60,
    s = Math.floor(r),
    i = Math.round((r - s) * 10);
  return i > 0 && i < 10
    ? `${n}:${String(s).padStart(2, "0")}.${i}`
    : `${n}:${String(s).padStart(2, "0")}`;
}
function Um(e) {
  if (typeof e == "number") return Math.max(0, e);
  if (!e || typeof e != "string") return 0;
  const t = e.trim();
  if (t.includes(":")) {
    const n = t.split(":");
    if (n.length === 2) {
      const r = parseFloat(n[0]) || 0,
        s = parseFloat(n[1]) || 0;
      return Math.max(0, r * 60 + s);
    }
    if (n.length === 3) {
      const r = parseFloat(n[0]) || 0,
        s = parseFloat(n[1]) || 0,
        i = parseFloat(n[2]) || 0;
      return Math.max(0, r * 3600 + s * 60 + i);
    }
  }
  return Math.max(0, parseFloat(t) || 0);
}
function Bm({
  media: e,
  sourceReady: t,
  prepView: n,
  outputAspect: r,
  setOutputAspect: s,
  squareCorners: i,
  setSquareCorners: a,
  barText: u,
  setBarText: o,
  barTextColor: d,
  setBarTextColor: g,
  barTextAnim: m,
  setBarTextAnim: p,
  language: w,
  changeLanguage: _,
  device: N,
  setDevice: R,
  devices: h,
  numClips: c,
  setNumClips: f,
  clipLen: v,
  setClipLen: j,
  removeEmptyAir: k,
  setRemoveEmptyAir: E,
  faceTracking: C,
  setFaceTracking: H,
  clipMode: M = "auto",
  setClipMode: F,
  customClips: L = [],
  setCustomClips: y,
  curTime: U = 0,
  vidDuration: oe = null,
  seekTo: Y,
  isPlaying: te = !1,
  togglePlay: T,
  isMuted: O = !0,
  toggleMute: D,
  transcript: X,
  onTimeUpdate: z,
  onLoadedMetadata: I,
  onDurationChange: W,
  onPlay: Z,
  onPause: Q,
  onEnded: me,
  studio: de,
  aspect: ue,
  fit: be,
  signature: rt,
  setSig: A,
  videoRef: se,
  onBack: Kt,
  onNext: Ir,
  nextEnabled: an,
  captionsEnabled: Yt = !0,
  splitScreen: pt = !1,
  setSplitScreen: Qt,
  splitBroll: Ee = "subway_surfers",
  setSplitBroll: ht,
  splitDivider: kt = "black",
  setSplitDivider: er,
  splitFaceTracking: lt = !0,
  setSplitFaceTracking: Ln,
  customBrollId: Rt,
  setCustomBrollId: In,
  customBrollName: on,
  setCustomBrollName: Dn,
  customBrollPreviewUrl: ne,
  setCustomBrollPreviewUrl: J,
  imageWatermark: Ve = null,
  setImageWatermark: Gt = null,
}) {
  var Ll, Il;
  const Je = r === "1:1",
    mt = x.useRef(null),
    st = x.useRef(null),
    [fe, Fe] = x.useState(!1),
    [ye, it] = x.useState(0);
  async function Lt(b) {
    var ie;
    const G = (ie = b.target.files) == null ? void 0 : ie[0];
    if (G) {
      ((b.target.value = ""), Fe(!0), it(0));
      try {
        const re = await ee.upload(G, (je) => it(je));
        if (!(re != null && re.upload_id))
          throw new Error("The upload did not return a video reference.");
        (In && In(re.upload_id),
          Dn && Dn(G.name),
          J && J(`/api/download/${encodeURIComponent(re.upload_id)}/video`),
          ht && ht("custom"));
      } catch (re) {
        alert("Failed to upload custom B-Roll: " + (re.message || re));
      } finally {
        Fe(!1);
      }
    }
  }
  const pe =
      oe && isFinite(oe) && oe > 0
        ? oe
        : (X == null ? void 0 : X.duration) ||
          (n == null ? void 0 : n.duration) ||
          0,
    [Pe, Se] = x.useState(null),
    Le = (L && L.find((b) => b.id === Pe)) || (L && L[0]) || null,
    oi =
      M === "custom" &&
      Le != null &&
      Le.header &&
      typeof Le.header == "string" &&
      Le.header.trim() !== ""
        ? Le.header
        : u;
  function un(b, G) {
    y && y((ie) => ie.map((re) => (re.id === b ? { ...re, ...G } : re)));
  }
  function tr(b, G, ie) {
    un(b, { [G]: ie });
  }
  function Pl(b, G) {
    y &&
      y((ie) =>
        ie.map((re) => {
          if (re.id !== b) return re;
          const je = G === "start" ? "startInput" : "endInput",
            Ct = re[je];
          if (Ct == null) return re;
          const It = Um(Ct);
          return { ...re, [G]: It, [je]: void 0 };
        }),
      );
  }
  function Dr(b, G) {
    var je;
    const ie =
        ((je = se == null ? void 0 : se.current) == null
          ? void 0
          : je.currentTime) ??
        U ??
        0,
      re = Math.round(ie * 10) / 10;
    y &&
      y((Ct) =>
        Ct.map((It) => {
          if (It.id !== b) return It;
          const Or = G === "start" ? "startInput" : "endInput";
          return { ...It, [G]: re, [Or]: void 0 };
        }),
      );
  }
  function Ml() {
    y &&
      y((b) => {
        const G = b[b.length - 1],
          ie = G ? Math.round(Number(G.end) * 10) / 10 : 0;
        if (!Number.isFinite(ie) || (pe > 0 && ie >= pe - 0.5)) return b;
        const re = 30,
          je = pe > 0 ? Math.min(pe, ie + re) : ie + re,
          Ct = Date.now() + Math.random();
        return [
          ...b,
          {
            id: Ct,
            start: ie,
            end: je,
            title: `Custom Clip ${b.length + 1}`,
            header: "",
          },
        ];
      });
  }
  function St(b) {
    !y || L.length <= 1 || y((G) => G.filter((ie) => ie.id !== b));
  }
  function Rl(b, G) {
    if (!(se != null && se.current)) return;
    const ie = se.current;
    mt.current && (clearInterval(mt.current), (mt.current = null));
    try {
      ((ie.currentTime = Math.max(0, b)), ie.play().catch(() => {}), Z && Z());
    } catch {}
    const re = setInterval(() => {
      if (!ie || ie.paused) {
        clearInterval(re);
        return;
      }
      ie.currentTime >= G && (ie.pause(), Q && Q(), clearInterval(re));
    }, 100);
    mt.current = re;
  }
  const On = M !== "custom" || L.some((b) => b.end > b.start);
  return l.jsxs("div", {
    className: "wizard-screen",
    children: [
      l.jsxs("div", {
        className: "w3-grid",
        children: [
          l.jsxs("div", {
            className: "card w3-left",
            children: [
              l.jsx("div", {
                className: "card-h",
                children: l.jsx("h2", { children: "Basic settings" }),
              }),
              l.jsx("label", {
                className: "fieldlabel",
                children: "Layout Mode",
              }),
              l.jsxs("div", {
                className: "toggle",
                style: {
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  marginBottom: 14,
                },
                children: [
                  l.jsx("button", {
                    type: "button",
                    className: pt ? "" : "active",
                    disabled: fe,
                    onClick: () => Qt && Qt(!1),
                    children: "📱 Standard Video",
                  }),
                  l.jsx("button", {
                    type: "button",
                    className: pt ? "active" : "",
                    disabled: fe,
                    onClick: () => {
                      (Qt && Qt(!0), s("9:16"));
                    },
                    children: "🏄 Viral Split-Screen",
                  }),
                ],
              }),
              pt
                ? l.jsxs("div", {
                    className: "split-screen-card",
                    style: { marginBottom: 16 },
                    children: [
                      l.jsx("label", {
                        className: "fieldlabel",
                        children: "B-Roll Retention Loop",
                      }),
                      l.jsx("input", {
                        ref: st,
                        type: "file",
                        accept: "video/*",
                        style: { display: "none" },
                        disabled: fe,
                        onChange: Lt,
                      }),
                      l.jsxs("div", {
                        className: "toggle",
                        style: {
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 1fr",
                          marginBottom: 12,
                        },
                        children: [
                          l.jsx("button", {
                            type: "button",
                            className: Ee === "subway_surfers" ? "active" : "",
                            disabled: fe,
                            onClick: () => ht && ht("subway_surfers"),
                            children: "🏄 Subway (4K)",
                          }),
                          l.jsx("button", {
                            type: "button",
                            className: Ee === "satisfying" ? "active" : "",
                            disabled: fe,
                            onClick: () => ht && ht("satisfying"),
                            children: "✨ Satisfying",
                          }),
                          l.jsx("button", {
                            type: "button",
                            className: Ee === "custom" ? "active" : "",
                            disabled: fe,
                            onClick: () => {
                              var b;
                              Rt
                                ? ht && ht("custom")
                                : (b = st.current) == null || b.click();
                            },
                            children: "📁 Custom...",
                          }),
                        ],
                      }),
                      (Ee === "custom" || fe) &&
                        l.jsx("div", {
                          style: {
                            marginBottom: 12,
                            padding: "12px 14px",
                            background: "rgba(56, 189, 248, 0.07)",
                            border: "1px dashed rgba(56, 189, 248, 0.4)",
                            borderRadius: 10,
                          },
                          children: fe
                            ? l.jsxs("div", {
                                style: {
                                  textAlign: "center",
                                  padding: "8px 0",
                                },
                                children: [
                                  l.jsx("div", {
                                    style: {
                                      fontSize: 13,
                                      fontWeight: 600,
                                      color: "var(--accent)",
                                      marginBottom: 6,
                                    },
                                    children:
                                      ye >= 100
                                        ? "Processing B-roll video…"
                                        : ye > 0
                                          ? `Uploading B-roll video… ${ye}%`
                                          : "Starting B-roll upload…",
                                  }),
                                  l.jsx("div", {
                                    style: {
                                      height: 6,
                                      background: "rgba(255,255,255,0.1)",
                                      borderRadius: 3,
                                      overflow: "hidden",
                                    },
                                    children: l.jsx("div", {
                                      className:
                                        "fill" +
                                        (ye <= 0 || ye >= 100
                                          ? " indeterminate"
                                          : ""),
                                      style: {
                                        width:
                                          ye > 0 && ye < 100
                                            ? `${ye}%`
                                            : void 0,
                                      },
                                    }),
                                  }),
                                ],
                              })
                            : Rt
                              ? l.jsxs("div", {
                                  style: {
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                  },
                                  children: [
                                    l.jsxs("div", {
                                      style: {
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 10,
                                      },
                                      children: [
                                        l.jsx("span", {
                                          style: { fontSize: 22 },
                                          children: "🎮",
                                        }),
                                        l.jsxs("div", {
                                          children: [
                                            l.jsx("div", {
                                              style: {
                                                fontWeight: 600,
                                                fontSize: 13,
                                                color: "var(--text)",
                                              },
                                              children:
                                                on || "Custom B-Roll Video",
                                            }),
                                            l.jsx("div", {
                                              style: {
                                                fontSize: 11,
                                                color: "var(--accent)",
                                              },
                                              children:
                                                "✓ Uploaded & active in bottom split",
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                    l.jsx("button", {
                                      type: "button",
                                      className: "btn btn-sm btn-ghost",
                                      style: {
                                        padding: "4px 10px",
                                        fontSize: 12,
                                      },
                                      onClick: () => {
                                        var b;
                                        return (b = st.current) == null
                                          ? void 0
                                          : b.click();
                                      },
                                      children: "Change",
                                    }),
                                  ],
                                })
                              : l.jsxs("div", {
                                  style: {
                                    textAlign: "center",
                                    cursor: "pointer",
                                    padding: "8px 4px",
                                  },
                                  onClick: () => {
                                    var b;
                                    return (b = st.current) == null
                                      ? void 0
                                      : b.click();
                                  },
                                  children: [
                                    l.jsx("div", {
                                      style: { fontSize: 20, marginBottom: 4 },
                                      children: "📤",
                                    }),
                                    l.jsx("div", {
                                      style: {
                                        fontSize: 13,
                                        fontWeight: 600,
                                        color: "var(--accent)",
                                      },
                                      children:
                                        "Click to upload custom gameplay / B-roll",
                                    }),
                                    l.jsx("div", {
                                      style: {
                                        fontSize: 11,
                                        color: "var(--text-dim)",
                                        marginTop: 2,
                                      },
                                      children:
                                        "Supports MP4, MOV, WEBM, MKV (Minecraft, GTA, ASMR, etc.)",
                                    }),
                                  ],
                                }),
                        }),
                      l.jsxs("div", {
                        className: "split-screen-notice",
                        children: [
                          l.jsx("span", {
                            className: "split-badge-icon",
                            children:
                              Ee === "custom"
                                ? "🎮"
                                : Ee === "satisfying"
                                  ? "✨"
                                  : "🏄",
                          }),
                          l.jsxs("div", {
                            children: [
                              l.jsx("div", {
                                style: {
                                  fontWeight: 600,
                                  fontSize: "13px",
                                  color: "var(--accent)",
                                },
                                children:
                                  Ee === "custom"
                                    ? on
                                      ? `Custom B-Roll: ${on}`
                                      : "Custom B-Roll Split Active"
                                    : Ee === "satisfying"
                                      ? "Oddly Satisfying ASMR Split Active"
                                      : "Subway Surfers Viral Split Active",
                              }),
                              l.jsx("div", {
                                style: {
                                  fontSize: "11px",
                                  color: "var(--text-dim)",
                                  marginTop: 2,
                                },
                                children:
                                  Ee === "custom"
                                    ? "Top speaker auto-centered via AI face tracking; bottom uses your custom uploaded video loop (auto-scaled & muted). Formatted for TikTok, Reels & Shorts."
                                    : Ee === "satisfying"
                                      ? "Top speaker auto-centered via AI face tracking; bottom Oddly Satisfying worker & restoration compilation (muted). Formatted for TikTok, Reels & Shorts."
                                      : "Top speaker auto-centered via AI face tracking; bottom Subway Surfers 4K endless run loop (muted). Formatted for TikTok, Reels & Shorts.",
                              }),
                            ],
                          }),
                        ],
                      }),
                      l.jsxs("div", {
                        className: "row",
                        style: { gap: 12, marginTop: 12, flexWrap: "wrap" },
                        children: [
                          l.jsxs("div", {
                            style: { flex: 1, minWidth: 140 },
                            children: [
                              l.jsx("label", {
                                className: "fieldlabel",
                                children: "Divider Style",
                              }),
                              l.jsx("div", {
                                className: "toggle",
                                children: [
                                  ["black", "⬛ Black (Best)"],
                                  ["none", "None"],
                                  ["blue", "⚡ Blue"],
                                ].map(([b, G]) =>
                                  l.jsx(
                                    "button",
                                    {
                                      type: "button",
                                      className: kt === b ? "active" : "",
                                      onClick: () => er && er(b),
                                      children: G,
                                    },
                                    b,
                                  ),
                                ),
                              }),
                            ],
                          }),
                          l.jsxs("div", {
                            style: { flex: 1, minWidth: 140 },
                            children: [
                              l.jsx("label", {
                                className: "fieldlabel",
                                children: "Speaker Tracking",
                              }),
                              l.jsxs("button", {
                                type: "button",
                                className: `btn-toggle-option ${lt ? "active" : ""}`,
                                onClick: () => Ln && Ln(!lt),
                                style: {
                                  width: "100%",
                                  height: 36,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  padding: "0 12px",
                                },
                                children: [
                                  l.jsx("span", { children: "🎯 AI Center" }),
                                  l.jsx("span", {
                                    className: `badge-pill ${lt ? "badge-pill-active" : ""}`,
                                    children: lt ? "ON" : "OFF",
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  })
                : l.jsxs(l.Fragment, {
                    children: [
                      l.jsx("label", {
                        className: "fieldlabel",
                        children: "Output layout",
                      }),
                      l.jsx("div", {
                        className: "toggle",
                        children: Am.map(([b, G]) =>
                          l.jsx(
                            "button",
                            {
                              className: r === b ? "active" : "",
                              onClick: () => s(b),
                              children: G,
                            },
                            b,
                          ),
                        ),
                      }),
                      Je &&
                        l.jsx("div", {
                          className: "hint",
                          children:
                            "Exports a 1080 × 1920 vertical video with a centered square, leaving room for the title and captions.",
                        }),
                      l.jsx("label", {
                        className: "fieldlabel",
                        children: "Corners",
                      }),
                      l.jsx("div", {
                        className: "toggle",
                        children: ["round", "square"].map((b) =>
                          l.jsx(
                            "button",
                            {
                              className: i === b ? "active" : "",
                              onClick: () => a(b),
                              children: b[0].toUpperCase() + b.slice(1),
                            },
                            b,
                          ),
                        ),
                      }),
                      l.jsx("label", {
                        className: "fieldlabel",
                        children:
                          "Title text (top) — Shift+Enter for a new line",
                      }),
                      l.jsx("textarea", {
                        className: "title-area",
                        placeholder: `Title shown over the video…
Second line…`,
                        rows: 2,
                        maxLength: 120,
                        value: u,
                        onChange: (b) => o(b.target.value),
                      }),
                      l.jsxs("div", {
                        className: "row",
                        style: { gap: 12, marginTop: 10, alignItems: "center" },
                        children: [
                          l.jsxs("label", {
                            className: "swatch",
                            children: [
                              "Title colour",
                              l.jsx("input", {
                                type: "color",
                                value: d,
                                onChange: (b) => g(b.target.value),
                              }),
                            ],
                          }),
                          l.jsxs("div", {
                            style: { flex: 1 },
                            children: [
                              l.jsx("label", {
                                className: "fieldlabel",
                                children: "Animation",
                              }),
                              l.jsxs("select", {
                                value: m,
                                onChange: (b) => p(b.target.value),
                                children: [
                                  l.jsx("option", {
                                    value: "none",
                                    children: "None",
                                  }),
                                  l.jsx("option", {
                                    value: "fade",
                                    children: "Fade in",
                                  }),
                                  l.jsx("option", {
                                    value: "slide",
                                    children: "Slide up",
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
              l.jsxs("div", {
                className: "row",
                style: { gap: 16, marginTop: 14, flexWrap: "wrap" },
                children: [
                  l.jsxs("div", {
                    style: { flex: 1, minWidth: 200 },
                    children: [
                      l.jsx("label", {
                        className: "fieldlabel",
                        children: "Processing mode",
                      }),
                      l.jsx("select", {
                        value: N,
                        onChange: (b) => R(b.target.value),
                        children: ["auto", ...h.filter((b) => b !== "auto")]
                          .filter((b, G, ie) => ie.indexOf(b) === G)
                          .map((b) =>
                            l.jsx(
                              "option",
                              {
                                value: b,
                                children:
                                  b === "cuda" ? "GPU (CUDA)" : b.toUpperCase(),
                              },
                              b,
                            ),
                          ),
                      }),
                    ],
                  }),
                  l.jsxs("div", {
                    style: { flex: 1, minWidth: 200, opacity: Yt ? 1 : 0.45 },
                    children: [
                      l.jsxs("label", {
                        className: "fieldlabel",
                        children: [
                          "Caption language ",
                          Yt ? "" : "(Captions Off)",
                        ],
                      }),
                      l.jsx("select", {
                        value: w,
                        disabled: !Yt,
                        onChange: (b) => _(b.target.value),
                        children: km.map(([b, G]) =>
                          l.jsx("option", { value: b, children: G }, b),
                        ),
                      }),
                      l.jsx("div", {
                        className: "hint",
                        children:
                          "Choose the language spoken in the video. Captions are transcribed, not translated.",
                      }),
                    ],
                  }),
                ],
              }),
              l.jsxs("div", {
                style: { marginTop: 18 },
                children: [
                  l.jsx("label", {
                    className: "fieldlabel",
                    children: "Clip Selection Mode",
                  }),
                  l.jsxs("div", {
                    className: "toggle clip-mode-toggle",
                    children: [
                      l.jsx("button", {
                        type: "button",
                        className: M === "auto" ? "active" : "",
                        onClick: () => F && F("auto"),
                        children: l.jsxs("span", {
                          style: {
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                          },
                          children: [
                            l.jsx(B.bolt, {}),
                            " Auto Highlights (AI)",
                          ],
                        }),
                      }),
                      l.jsx("button", {
                        type: "button",
                        className: M === "custom" ? "active" : "",
                        onClick: () => F && F("custom"),
                        children: l.jsxs("span", {
                          style: {
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                          },
                          children: [l.jsx(B.clock, {}), " Custom Timestamps"],
                        }),
                      }),
                    ],
                  }),
                ],
              }),
              l.jsxs("div", {
                style: { marginTop: 16 },
                children: [
                  l.jsx("label", {
                    className: "fieldlabel",
                    children: "Remove Empty Air",
                  }),
                  l.jsxs("div", {
                    className: "toggle",
                    children: [
                      l.jsx("button", {
                        type: "button",
                        className: k ? "" : "active",
                        onClick: () => E(!1),
                        children: "OFF",
                      }),
                      l.jsx("button", {
                        type: "button",
                        className: k ? "active" : "",
                        onClick: () => E(!0),
                        children: "ON",
                      }),
                    ],
                  }),
                  l.jsx("span", {
                    style: {
                      fontSize: "0.82rem",
                      opacity: 0.7,
                      marginTop: 4,
                      display: "block",
                    },
                    children:
                      "Tightens long, unnecessary silence gaps inside clips while preserving natural conversational pacing.",
                  }),
                ],
              }),
              l.jsxs("div", {
                style: { marginTop: 16 },
                children: [
                  l.jsxs("div", {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    },
                    children: [
                      l.jsx("label", {
                        className: "fieldlabel",
                        style: { marginBottom: 0 },
                        children: "Auto Face Tracking",
                      }),
                      l.jsx("span", {
                        style: {
                          fontSize: "0.75rem",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          background: Je
                            ? "rgba(56, 189, 248, 0.15)"
                            : "rgba(156, 163, 175, 0.15)",
                          color: Je ? "var(--accent-hi)" : "#9ca3af",
                          fontWeight: 500,
                        },
                        children: Je
                          ? "Square Reel Only"
                          : "Locked (Square Reel Only)",
                      }),
                    ],
                  }),
                  Je
                    ? l.jsxs(l.Fragment, {
                        children: [
                          l.jsxs("div", {
                            className: "toggle",
                            style: { marginTop: 6 },
                            children: [
                              l.jsx("button", {
                                type: "button",
                                className: C ? "" : "active",
                                onClick: () => H(!1),
                                children: "OFF",
                              }),
                              l.jsx("button", {
                                type: "button",
                                className: C ? "active" : "",
                                onClick: () => H(!0),
                                children: "ON",
                              }),
                            ],
                          }),
                          l.jsx("span", {
                            style: {
                              fontSize: "0.82rem",
                              opacity: 0.7,
                              marginTop: 4,
                              display: "block",
                            },
                            children:
                              "Smoothly follows the speaker's face with cinematic camera panning instead of a static center crop.",
                          }),
                        ],
                      })
                    : l.jsx("div", {
                        style: {
                          marginTop: 6,
                          padding: "8px 12px",
                          borderRadius: "6px",
                          background: "rgba(255, 255, 255, 0.04)",
                          border: "1px dashed rgba(255, 255, 255, 0.15)",
                          fontSize: "0.82rem",
                          opacity: 0.65,
                        },
                        children:
                          "🔒 Available only when Square Reel is selected.",
                      }),
                ],
              }),
              M === "auto" &&
                l.jsx("div", {
                  className: "w2-clip-settings",
                  style: {
                    borderTop: "1px solid var(--line)",
                    marginTop: 18,
                    paddingTop: 14,
                  },
                  children: l.jsxs("div", {
                    className: "row",
                    style: { gap: 16, flexWrap: "wrap" },
                    children: [
                      l.jsxs("div", {
                        children: [
                          l.jsx("label", {
                            className: "fieldlabel",
                            children: "Clips",
                          }),
                          l.jsxs("div", {
                            className: "counter",
                            children: [
                              l.jsx("button", {
                                type: "button",
                                onClick: () => f((b) => Math.max(1, b - 1)),
                                children: "−",
                              }),
                              l.jsx("input", {
                                type: "number",
                                min: "1",
                                max: "100",
                                value: c,
                                onChange: (b) =>
                                  f(
                                    Math.max(
                                      1,
                                      Math.min(100, +b.target.value || 1),
                                    ),
                                  ),
                              }),
                              l.jsx("button", {
                                type: "button",
                                onClick: () => f((b) => Math.min(100, b + 1)),
                                children: "+",
                              }),
                            ],
                          }),
                        ],
                      }),
                      l.jsxs("div", {
                        style: { flex: 1, minWidth: 220 },
                        children: [
                          l.jsx("label", {
                            className: "fieldlabel",
                            children: "Clip length",
                          }),
                          l.jsxs("div", {
                            className: "toggle",
                            children: [
                              [
                                ["Smart Auto", null],
                                ["30s", 30],
                                ["45s", 45],
                                ["60s", 60],
                              ].map(([b, G]) =>
                                l.jsx(
                                  "button",
                                  {
                                    type: "button",
                                    className: v === G ? "active" : "",
                                    onClick: () => j(G),
                                    children: b,
                                  },
                                  b,
                                ),
                              ),
                              l.jsx("button", {
                                type: "button",
                                className:
                                  v != null && ![30, 45, 60].includes(v)
                                    ? "active"
                                    : "",
                                onClick: () =>
                                  j((b) =>
                                    b != null && ![30, 45, 60].includes(b)
                                      ? b
                                      : 90,
                                  ),
                                children: "Custom",
                              }),
                            ],
                          }),
                          v != null &&
                            ![30, 45, 60].includes(v) &&
                            l.jsxs("div", {
                              className: "counter",
                              style: { marginTop: 8, width: "fit-content" },
                              children: [
                                l.jsx("input", {
                                  type: "number",
                                  min: "5",
                                  max: "600",
                                  value: v,
                                  onChange: (b) =>
                                    j(
                                      Math.max(
                                        5,
                                        Math.min(600, +b.target.value || 5),
                                      ),
                                    ),
                                }),
                                l.jsx("span", {
                                  style: { padding: "0 10px", opacity: 0.7 },
                                  children: "sec",
                                }),
                              ],
                            }),
                          v == null &&
                            l.jsx("div", {
                              className: "fieldhint",
                              style: { marginTop: 7 },
                              children:
                                "Chooses each highlight's strongest natural ending, usually 25–55 seconds.",
                            }),
                        ],
                      }),
                    ],
                  }),
                }),
              M === "custom" &&
                l.jsxs("div", {
                  className: "custom-clips-builder",
                  children: [
                    l.jsxs("div", {
                      style: {
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 4,
                      },
                      children: [
                        l.jsx("span", {
                          className: "fieldlabel",
                          style: { margin: 0, fontWeight: 700 },
                          children: "Custom Clip Ranges",
                        }),
                        l.jsxs("span", {
                          style: {
                            fontSize: "11px",
                            color: "var(--accent-hi)",
                            fontWeight: 600,
                          },
                          children: [
                            L.length,
                            " ",
                            L.length === 1 ? "clip" : "clips",
                            " defined",
                          ],
                        }),
                      ],
                    }),
                    l.jsxs("p", {
                      className: "custom-clips-help",
                      children: [
                        "Set exact start and end timestamps. Use ",
                        l.jsx("strong", { children: "📍 Current" }),
                        " to grab the preview position, and ",
                        l.jsx("strong", { children: "▶ Preview" }),
                        " to test the section.",
                      ],
                    }),
                    L.map((b, G) => {
                      const ie = b.end - b.start,
                        re = ie <= 0;
                      return l.jsxs(
                        "div",
                        {
                          className: "custom-clip-card",
                          children: [
                            l.jsxs("div", {
                              className: "custom-clip-top",
                              children: [
                                l.jsxs("span", {
                                  className: "custom-clip-badge",
                                  children: ["Clip ", G + 1],
                                }),
                                l.jsx("input", {
                                  type: "text",
                                  className: "custom-clip-title-input",
                                  placeholder: `Clip ${G + 1} title (optional)`,
                                  value: b.title || "",
                                  onChange: (je) =>
                                    un(b.id, { title: je.target.value }),
                                  onFocus: () => Se(b.id),
                                }),
                                L.length > 1 &&
                                  l.jsx("button", {
                                    type: "button",
                                    className: "custom-clip-del-btn",
                                    onClick: () => St(b.id),
                                    title: "Remove clip",
                                    children: l.jsx(B.trash, {}),
                                  }),
                              ],
                            }),
                            l.jsxs("div", {
                              className: "custom-clip-header-row",
                              children: [
                                l.jsxs("label", {
                                  className: "custom-clip-header-label",
                                  children: [l.jsx(B.type, {}), " Header:"],
                                }),
                                l.jsx("input", {
                                  type: "text",
                                  className: "custom-clip-header-input",
                                  placeholder: `Caption header above Clip ${G + 1} (e.g. "Wait till the end 😱")`,
                                  value: b.header || "",
                                  onChange: (je) =>
                                    un(b.id, { header: je.target.value }),
                                  onFocus: () => Se(b.id),
                                  maxLength: 120,
                                }),
                              ],
                            }),
                            l.jsxs("div", {
                              className: "custom-clip-range-row",
                              children: [
                                l.jsxs("div", {
                                  className: "custom-ts-field",
                                  children: [
                                    l.jsx("label", {
                                      className: "custom-ts-label",
                                      children: "Start",
                                    }),
                                    l.jsxs("div", {
                                      className: "custom-ts-input-group",
                                      children: [
                                        l.jsx("input", {
                                          type: "text",
                                          className: "custom-ts-input",
                                          placeholder: "0:00",
                                          value:
                                            b.startInput !== void 0
                                              ? b.startInput
                                              : ar(b.start),
                                          onChange: (je) =>
                                            tr(
                                              b.id,
                                              "startInput",
                                              je.target.value,
                                            ),
                                          onBlur: () => Pl(b.id, "start"),
                                        }),
                                        l.jsxs("button", {
                                          type: "button",
                                          className: "btn-pin-current",
                                          onClick: () => Dr(b.id, "start"),
                                          title:
                                            "Set Start to current preview time",
                                          children: [
                                            l.jsx(B.pin, {}),
                                            " Current",
                                          ],
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                l.jsxs("div", {
                                  className: "custom-ts-field",
                                  children: [
                                    l.jsx("label", {
                                      className: "custom-ts-label",
                                      children: "End",
                                    }),
                                    l.jsxs("div", {
                                      className: "custom-ts-input-group",
                                      children: [
                                        l.jsx("input", {
                                          type: "text",
                                          className: "custom-ts-input",
                                          placeholder: "0:30",
                                          value:
                                            b.endInput !== void 0
                                              ? b.endInput
                                              : ar(b.end),
                                          onChange: (je) =>
                                            tr(
                                              b.id,
                                              "endInput",
                                              je.target.value,
                                            ),
                                          onBlur: () => Pl(b.id, "end"),
                                        }),
                                        l.jsxs("button", {
                                          type: "button",
                                          className: "btn-pin-current",
                                          onClick: () => Dr(b.id, "end"),
                                          title:
                                            "Set End to current preview time",
                                          children: [
                                            l.jsx(B.pin, {}),
                                            " Current",
                                          ],
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            l.jsxs("div", {
                              className: "custom-clip-footer",
                              children: [
                                l.jsx("div", {
                                  className: "custom-clip-duration",
                                  children: re
                                    ? l.jsx("span", {
                                        className: "custom-clip-dur-err",
                                        children:
                                          "⚠️ End must be greater than Start",
                                      })
                                    : l.jsxs("span", {
                                        children: [
                                          "Duration: ",
                                          l.jsxs("strong", {
                                            children: [ie.toFixed(1), "s"],
                                          }),
                                          " (",
                                          ar(b.start),
                                          " → ",
                                          ar(b.end),
                                          ")",
                                        ],
                                      }),
                                }),
                                l.jsxs("button", {
                                  type: "button",
                                  className: "btn-preview-range",
                                  disabled: re,
                                  onClick: () => {
                                    (Se(b.id), Rl(b.start, b.end));
                                  },
                                  title: "Play this section in preview",
                                  children: [
                                    l.jsx(B.play, {}),
                                    " Preview Range",
                                  ],
                                }),
                              ],
                            }),
                          ],
                        },
                        b.id,
                      );
                    }),
                    l.jsxs("button", {
                      type: "button",
                      className: "btn-add-clip",
                      disabled:
                        pe > 0 &&
                        Number(
                          (Ll = L[L.length - 1]) == null ? void 0 : Ll.end,
                        ) >=
                          pe - 0.5,
                      title:
                        pe > 0 &&
                        Number(
                          (Il = L[L.length - 1]) == null ? void 0 : Il.end,
                        ) >=
                          pe - 0.5
                          ? "No video remains after the last clip."
                          : void 0,
                      onClick: Ml,
                      children: [l.jsx(B.create, {}), " Add Another Clip"],
                    }),
                  ],
                }),
            ],
          }),
          l.jsxs("div", {
            className: "w3-right",
            children: [
              l.jsx(ai, {
                cfg: de.cfg,
                cinematic: de.cinematic,
                language: w,
                media: e,
                preparing: !e && t,
                aspect: ue,
                fit: be,
                squareCorners: i,
                barText: oi,
                barTextColor: d,
                barTextAnim: m,
                signature: rt,
                setSig: A,
                videoRef: se,
                imageWatermark: Ve,
                setImageWatermark: Gt,
                overrides: de.overrides,
                setOverride: de.setOverride,
                captionsEnabled: Yt,
                splitScreen: pt,
                splitDivider: kt,
                splitBroll: Ee,
                customBrollPreviewUrl: ne,
                onTimeUpdate: z,
                onLoadedMetadata: I,
                onDurationChange: W,
                onPlay: Z,
                onPause: Q,
                onEnded: me,
                isMuted: O,
              }),
              (e == null ? void 0 : e.kind) === "video" &&
                l.jsx("div", {
                  className: "video-scrubber-card",
                  children: l.jsxs("div", {
                    className: "scrubber-row",
                    children: [
                      l.jsx("button", {
                        type: "button",
                        className: "btn-scrub-play",
                        onClick: () => {
                          T
                            ? T()
                            : se != null &&
                              se.current &&
                              (se.current.paused
                                ? se.current.play().catch(() => {})
                                : se.current.pause());
                        },
                        title: te ? "Pause preview" : "Play preview",
                        children: te ? l.jsx(B.pause, {}) : l.jsx(B.play, {}),
                      }),
                      l.jsx("input", {
                        type: "range",
                        className: "scrubber-slider",
                        min: "0",
                        max: pe > 0 ? pe : 100,
                        step: "0.05",
                        value: Math.min(U || 0, pe || 100),
                        onChange: (b) => Y && Y(parseFloat(b.target.value)),
                      }),
                      l.jsxs("span", {
                        className: "scrubber-ts",
                        children: [ar(U), " / ", ar(pe)],
                      }),
                      l.jsx("button", {
                        type: "button",
                        className: "btn-scrub-mute",
                        onClick: () => {
                          D
                            ? D()
                            : se != null &&
                              se.current &&
                              (se.current.muted = !se.current.muted);
                        },
                        title: O ? "Unmute preview" : "Mute preview",
                        children: O ? l.jsx(B.mute, {}) : l.jsx(B.volume, {}),
                      }),
                    ],
                  }),
                }),
              l.jsxs("div", {
                className: "prep prep-" + (n.phase || "idle"),
                children: [
                  l.jsxs("div", {
                    className: "prep-row",
                    style: {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 8,
                    },
                    children: [
                      l.jsxs("span", {
                        className: "prep-msg",
                        style: {
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          flex: 1,
                          minWidth: 200,
                        },
                        children: [
                          [
                            "downloading",
                            "transcribing",
                            "downloaded",
                          ].includes(n.phase) &&
                            l.jsx("span", { className: "spinner" }),
                          n.phase === "ready" &&
                            l.jsx("span", {
                              className: "prep-ok",
                              children: "✓",
                            }),
                          n.phase === "error" &&
                            l.jsx("span", {
                              className: "prep-ok",
                              style: { color: "var(--danger)" },
                              children: "!",
                            }),
                          n.message || "Preparing video…",
                        ],
                      }),
                      n.pct != null &&
                        l.jsxs("span", {
                          className: "prep-pct",
                          children: [n.pct, "%"],
                        }),
                      n.phase === "error" &&
                        l.jsx("button", {
                          type: "button",
                          className: "btn btn-ghost btn-sm",
                          onClick: Kt,
                          style: {
                            fontSize: "12px",
                            padding: "3px 10px",
                            borderRadius: "6px",
                            background: "rgba(239, 68, 68, 0.15)",
                            border: "1px solid rgba(239, 68, 68, 0.35)",
                            color: "var(--text)",
                            cursor: "pointer",
                          },
                          children: "← Change Link",
                        }),
                    ],
                  }),
                  l.jsx("div", {
                    className: "track",
                    children: l.jsx("div", {
                      className:
                        "fill" +
                        (n.pct == null &&
                        ["downloading", "transcribing", "downloaded"].includes(
                          n.phase,
                        )
                          ? " indeterminate"
                          : ""),
                      style:
                        n.pct == null
                          ? { width: "0%" }
                          : { width: n.pct + "%" },
                    }),
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      l.jsxs("div", {
        className: "wizard-nav",
        children: [
          l.jsx("button", {
            className: "btn btn-ghost",
            onClick: Kt,
            children: "← Back",
          }),
          l.jsx("button", {
            className: "btn btn-primary",
            disabled: !an || !On || fe,
            onClick: Ir,
            children: "Next →",
          }),
        ],
      }),
    ],
  });
}
function hn({
  label: e,
  unit: t,
  min: n,
  max: r,
  step: s = 1,
  value: i,
  onChange: a,
}) {
  const u = (o) => Math.max(n, Math.min(r, o));
  return l.jsxs("div", {
    className: "ctl",
    children: [
      l.jsxs("label", {
        children: [
          e,
          l.jsxs("span", {
            className: "val",
            children: [
              l.jsx("input", {
                type: "number",
                className: "val-num",
                min: n,
                max: r,
                step: s,
                value: Math.round(i),
                onChange: (o) =>
                  a(
                    o.target.value === ""
                      ? i
                      : u(parseFloat(o.target.value) || 0),
                  ),
              }),
              t,
            ],
          }),
        ],
      }),
      l.jsx("input", {
        type: "range",
        className: "range",
        min: n,
        max: r,
        step: s,
        value: i,
        onChange: (o) => a(parseFloat(o.target.value)),
      }),
    ],
  });
}
function Gr({ label: e, value: t, def: n, onChange: r }) {
  return l.jsxs("label", {
    className: "swatch",
    children: [
      e,
      l.jsx("input", {
        type: "color",
        value: t || n,
        onChange: (s) => r(s.target.value),
      }),
    ],
  });
}
function Ki({ label: e, on: t, onToggle: n, children: r }) {
  return l.jsxs("div", {
    className: "fxrow",
    children: [
      l.jsx("button", {
        type: "button",
        className: "tg fxtoggle" + (t ? " active" : ""),
        onClick: n,
        children: e,
      }),
      t && l.jsx("div", { className: "fxbody", children: r }),
    ],
  });
}
const Wm = [
    {
      id: "classic",
      label: "Classic",
      color: "#FFFFFF",
      font: "Roboto",
      ov: {
        font_family: "Roboto",
        primary_color: "#FFFFFF",
        highlight_color: "#FFD400",
        animation: "none",
        karaoke: !1,
        bold: !0,
        uppercase: !0,
        glow_enabled: !1,
      },
    },
    {
      id: "clean",
      label: "Clean",
      color: "#D8D8E6",
      font: "Poppins",
      ov: {
        font_family: "Poppins",
        primary_color: "#FFFFFF",
        highlight_color: "#FFFFFF",
        animation: "none",
        karaoke: !1,
        bold: !1,
        uppercase: !1,
        glow_enabled: !1,
      },
    },
    {
      id: "bold",
      label: "Bold",
      color: "#B39DFF",
      font: "Montserrat",
      ov: {
        font_family: "Montserrat",
        primary_color: "#FFFFFF",
        highlight_color: "#7C4DFF",
        animation: "highlight",
        karaoke: !1,
        bold: !0,
        uppercase: !0,
        glow_enabled: !1,
      },
    },
    {
      id: "neon",
      label: "Neon",
      color: "#22D3EE",
      font: "Poppins",
      ov: {
        font_family: "Poppins",
        primary_color: "#FFFFFF",
        highlight_color: "#22D3EE",
        animation: "highlight",
        karaoke: !1,
        bold: !0,
        uppercase: !0,
        glow_enabled: !0,
        glow_color: "#22D3EE",
        glow_intensity: 12,
      },
    },
    {
      id: "typewriter",
      label: "Typewriter",
      color: "#27E36B",
      font: "JetBrains Mono",
      ov: {
        font_family: "JetBrains Mono",
        primary_color: "#27E36B",
        highlight_color: "#27E36B",
        animation: "word_reveal",
        karaoke: !1,
        bold: !1,
        uppercase: !1,
        glow_enabled: !1,
      },
    },
  ],
  uc = [
    "#FFFFFF",
    "#FFD400",
    "#FFB020",
    "#FF3B30",
    "#FF2D78",
    "#27E36B",
    "#22D3EE",
    "#3B82F6",
    "#7C4DFF",
    "#000000",
  ],
  Hm = [
    { v: "none", label: "None" },
    { v: "highlight", label: "Highlight" },
    { v: "word_reveal", label: "Reveal" },
    { v: "one_word", label: "One word" },
    { v: "karaoke", label: "Karaoke" },
  ],
  cc = [
    [8, 14],
    [50, 14],
    [92, 14],
    [8, 50],
    [50, 50],
    [92, 50],
    [8, 88],
    [50, 88],
    [92, 88],
  ];
function Vm({ studio: e, onFontUpload: t }) {
  const {
      cfg: n,
      setOverride: r,
      resetOverrides: s,
      fonts: i,
      presets: a,
      styleId: u,
      selectPreset: o,
    } = e,
    d = x.useRef(null),
    [g, m] = x.useState(""),
    p = n.karaoke ? "karaoke" : n.animation || "none",
    w = (y) => {
      y === "karaoke"
        ? (r("karaoke", !0), r("animation", "none"))
        : (r("karaoke", !1), r("animation", y));
    },
    _ = (y) => Object.entries(y.ov).forEach(([U, oe]) => r(U, oe)),
    N = (y) => {
      const U = !Bt(n, y);
      (r(y, U),
        U &&
          y === "background_enabled" &&
          n.background_color == null &&
          r("background_color", "#000000"));
    },
    R = (n.highlight_color || "#FFD400").toUpperCase(),
    h = n.outline_width != null ? n.outline_width : n.outline || 0,
    c = Bt(n, "background_enabled"),
    f = n.background_opacity != null ? n.background_opacity : 100,
    v = c ? (f <= 60 ? "semi" : "solid") : "none",
    j = (y) => {
      if (y === "none") {
        r("background_enabled", !1);
        return;
      }
      (r("background_enabled", !0),
        r("background_color", n.background_color || "#000000"),
        r("background_opacity", y === "semi" ? 50 : 100));
    },
    k = n.pos_x != null ? n.pos_x : 50,
    E = n.pos_y != null ? n.pos_y : 88,
    C = cc.reduce(
      (y, U, oe) => {
        const Y = Math.abs(U[0] - k) + Math.abs(U[1] - E);
        return Y < y.d ? { i: oe, d: Y } : y;
      },
      { i: 7, d: 1e9 },
    ).i,
    H = Bt(n, "bold") ? "bold" : "regular",
    M = Math.round((n.font_scale || 1) * 100),
    F = [...(i.user || []), ...(i.multilingual || []), ...(i.bundled || [])];
  async function L(y) {
    if (y) {
      m(`Uploading ${y.name}…`);
      try {
        const U = await t(y);
        (r("font_family", U), m(""));
      } catch (U) {
        m(U.message);
      }
    }
  }
  return l.jsxs("div", {
    className: "cz",
    children: [
      l.jsx(CaptionPosition,{studio:e}),
      l.jsx(NativeControls,{studio:e}),
      l.jsxs("div", {
        className: "cz-field",
        children: [
          l.jsx("label", { className: "cz-label", children: "Caption Style" }),
          l.jsxs("div", {
            className: "cz-select",
            children: [
              l.jsx(B.create, {}),
              l.jsx("select", {
                value: u,
                onChange: (y) => o(y.target.value),
                children: a.map((y) =>
                  l.jsx("option", { value: y.id, children: y.label }, y.id),
                ),
              }),
              l.jsx("span", { className: "cz-chev" }),
            ],
          }),
          l.jsx("div", {
            className: "cz-preview",
            children: l.jsx("span", {
              className: "cz-preview-cap",
              style: Lo(n, {
                fontPx: Math.max(
                  12,
                  Math.round(
                    24 * ((n.font_size || 90) / 90) * (n.font_scale || 1),
                  ),
                ),
                scale: 0.22 * ((n.font_size || 90) / 90) * (n.font_scale || 1),
              }),
              children: ["Make", "it", "go", "viral"].map((y, U) =>
                l.jsxs(
                  "span",
                  {
                    style: {
                      color:
                        U === 3 && (p === "highlight" || p === "karaoke")
                          ? n.highlight_color || "#FFD400"
                          : void 0,
                    },
                    children: [y, " "],
                  },
                  U,
                ),
              ),
            }),
          }),
        ],
      }),
      l.jsxs("div", {
        className: "cz-field",
        children: [
          l.jsx("label", { className: "cz-label", children: "Theme" }),
          l.jsx("div", {
            className: "cz-cards",
            children: Wm.map((y) => {
              const U =
                (n.font_family || "Roboto") === y.font &&
                R === y.ov.highlight_color.toUpperCase();
              return l.jsxs(
                "button",
                {
                  type: "button",
                  className: "cz-card" + (U ? " active" : ""),
                  onClick: () => _(y),
                  children: [
                    l.jsx("span", {
                      className: "cz-aa",
                      style: {
                        color: y.color,
                        fontFamily: `'${y.font}', sans-serif`,
                        fontWeight: y.ov.bold ? 800 : 600,
                      },
                      children: "Aa",
                    }),
                    l.jsx("span", {
                      className: "cz-card-l",
                      children: y.label,
                    }),
                  ],
                },
                y.id,
              );
            }),
          }),
        ],
      }),
      l.jsxs("div", {
        className: "cz-field",
        children: [
          l.jsx("label", {
            className: "cz-label",
            children: "Highlight Color",
          }),
          l.jsxs("div", {
            className: "cz-colors",
            children: [
              uc.map((y) =>
                l.jsx(
                  "button",
                  {
                    type: "button",
                    "aria-label": y,
                    className: "cz-dot" + (R === y ? " active" : ""),
                    style: { background: y },
                    onClick: () => r("highlight_color", y),
                  },
                  y,
                ),
              ),
              l.jsx("label", {
                className:
                  "cz-dot cz-dot-rainbow" + (uc.includes(R) ? "" : " active"),
                title: "Custom colour",
                children: l.jsx("input", {
                  type: "color",
                  value: n.highlight_color || "#FFD400",
                  onChange: (y) => r("highlight_color", y.target.value),
                }),
              }),
            ],
          }),
        ],
      }),
      l.jsxs("div", {
        className: "cz-field",
        children: [
          l.jsx("label", {
            className: "cz-label",
            children: "Font & Typography",
          }),
          l.jsxs("div", {
            className: "cz-row-font",
            children: [
              l.jsxs("div", {
                className: "cz-subfield",
                children: [
                  l.jsx("span", {
                    className: "cz-sublabel",
                    children: "Font Family",
                  }),
                  l.jsxs("div", {
                    className: "cz-select",
                    children: [
                      l.jsx("span", {
                        className: "cz-font-icon",
                        children: "Aa",
                      }),
                      l.jsx("select", {
                        value: n.font_family || "Roboto",
                        onChange: (y) => r("font_family", y.target.value),
                        children: F.map((y) =>
                          l.jsx(
                            "option",
                            { value: y.family, children: y.family },
                            y.file,
                          ),
                        ),
                      }),
                      l.jsx("span", { className: "cz-chev" }),
                    ],
                  }),
                ],
              }),
              l.jsxs("div", {
                className: "cz-subfield",
                children: [
                  l.jsx("span", {
                    className: "cz-sublabel",
                    children: "Weight",
                  }),
                  l.jsxs("div", {
                    className: "cz-select",
                    children: [
                      l.jsxs("select", {
                        value: H,
                        onChange: (y) => r("bold", y.target.value === "bold"),
                        children: [
                          l.jsx("option", {
                            value: "regular",
                            children: "Regular",
                          }),
                          l.jsx("option", {
                            value: "bold",
                            children: "Extra Bold",
                          }),
                        ],
                      }),
                      l.jsx("span", { className: "cz-chev" }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          l.jsxs("button", {
            type: "button",
            className: "cz-upload",
            onClick: () => {
              var y;
              return (y = d.current) == null ? void 0 : y.click();
            },
            children: [l.jsx(B.upload, {}), " Upload custom font (.ttf, .otf)"],
          }),
          l.jsx("input", {
            ref: d,
            type: "file",
            accept: ".ttf,.otf",
            hidden: !0,
            onChange: (y) => L(y.target.files[0]),
          }),
          g && l.jsx("div", { className: "note", children: g }),
        ],
      }),
      l.jsxs("div", {
        className: "cz-field cz-size-field",
        children: [
          l.jsxs("div", {
            className: "cz-size-header",
            children: [
              l.jsx("label", {
                className: "cz-label",
                style: {
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                },
                children: l.jsx("span", { children: "Caption Size" }),
              }),
              l.jsxs("span", {
                className: "cz-size-badge",
                children: [M, "%"],
              }),
            ],
          }),
          l.jsxs("div", {
            className: "cz-size-slider-row",
            children: [
              l.jsxs("button", {
                type: "button",
                className: "cz-size-step-btn",
                onClick: () => r("font_scale", Math.max(0.5, (M - 10) / 100)),
                title: "Make captions smaller (A-)",
                children: [
                  l.jsx("span", {
                    style: { fontSize: 11, fontWeight: 700 },
                    children: "A",
                  }),
                  l.jsx("span", {
                    style: { fontSize: 9, fontWeight: 700 },
                    children: "-",
                  }),
                ],
              }),
              l.jsx("input", {
                type: "range",
                className: "cz-size-slider",
                min: "50",
                max: "200",
                step: "5",
                value: M,
                onChange: (y) =>
                  r("font_scale", parseFloat(y.target.value) / 100),
              }),
              l.jsxs("button", {
                type: "button",
                className: "cz-size-step-btn",
                onClick: () => r("font_scale", Math.min(2.2, (M + 10) / 100)),
                title: "Make captions larger (A+)",
                children: [
                  l.jsx("span", {
                    style: { fontSize: 13, fontWeight: 800 },
                    children: "A",
                  }),
                  l.jsx("span", {
                    style: { fontSize: 10, fontWeight: 800 },
                    children: "+",
                  }),
                ],
              }),
            ],
          }),
          l.jsx("div", {
            className: "cz-size-presets",
            children: [
              { label: "Small", pct: 80 },
              { label: "Normal", pct: 100 },
              { label: "Large", pct: 125 },
              { label: "Huge", pct: 150 },
            ].map((y) =>
              l.jsxs(
                "button",
                {
                  type: "button",
                  className:
                    "cz-size-preset-btn" + (M === y.pct ? " active" : ""),
                  onClick: () => r("font_scale", y.pct / 100),
                  children: [y.label, " (", y.pct, "%)"],
                },
                y.pct,
              ),
            ),
          }),
        ],
      }),
      l.jsxs("div", {
        className: "cz-field",
        children: [
          l.jsx("label", { className: "cz-label", children: "Animation" }),
          l.jsx("div", {
            className: "cz-cards",
            children: Hm.map((y) =>
              l.jsxs(
                "button",
                {
                  type: "button",
                  className: "cz-card" + (p === y.v ? " active" : ""),
                  onClick: () => w(y.v),
                  children: [
                    l.jsx("span", { className: "cz-aa", children: "Aa" }),
                    l.jsx("span", {
                      className: "cz-card-l",
                      children: y.label,
                    }),
                  ],
                },
                y.v,
              ),
            ),
          }),
        ],
      }),
      l.jsxs("div", {
        className: "cz-row2",
        children: [
          l.jsxs("div", {
            className: "cz-field",
            children: [
              l.jsx("label", { className: "cz-label", children: "Position" }),
              l.jsx("div", {
                className: "cz-posgrid",
                children: cc.map((y, U) =>
                  l.jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": "position " + (U + 1),
                      className: "cz-posdot" + (C === U ? " active" : ""),
                      onClick: () => {
                        (r("pos_x", y[0]), r("pos_y", y[1]));
                      },
                    },
                    U,
                  ),
                ),
              }),
            ],
          }),
          l.jsxs("div", {
            className: "cz-field",
            children: [
              l.jsx("label", { className: "cz-label", children: "Background" }),
              l.jsx("div", {
                className: "cz-bgcards",
                children: [
                  ["none", "None"],
                  ["semi", "Semi"],
                  ["solid", "Solid"],
                ].map(([y, U]) =>
                  l.jsxs(
                    "button",
                    {
                      type: "button",
                      className: "cz-bgcard" + (v === y ? " active" : ""),
                      onClick: () => j(y),
                      children: [
                        l.jsx("span", { className: "cz-bgicon cz-bg-" + y }),
                        l.jsx("span", { className: "cz-card-l", children: U }),
                      ],
                    },
                    y,
                  ),
                ),
              }),
            ],
          }),
        ],
      }),
      l.jsxs("details", {
        className: "cz-adv",
        children: [
          l.jsx("summary", {
            children: "Advanced — outline, shadow, glow & spacing",
          }),
          l.jsxs("div", {
            className: "cz-adv-body",
            children: [
              l.jsx("div", {
                className: "ctl",
                children: l.jsxs("div", {
                  className: "swatches",
                  children: [
                    l.jsx(Gr, {
                      label: "Text",
                      value: n.primary_color,
                      def: "#FFFFFF",
                      onChange: (y) => r("primary_color", y),
                    }),
                    l.jsx(Gr, {
                      label: "Outline",
                      value: n.outline_color,
                      def: "#000000",
                      onChange: (y) => r("outline_color", y),
                    }),
                  ],
                }),
              }),
              l.jsx(hn, {
                label: "Letter spacing",
                unit: "px",
                min: 0,
                max: 30,
                value: n.tracking || 0,
                onChange: (y) => r("tracking", y),
              }),
              l.jsx(hn, {
                label: "Outline",
                unit: "px",
                min: 0,
                max: 16,
                value: h,
                onChange: (y) => r("outline_width", y),
              }),
              l.jsx(hn, {
                label: "Rotation",
                unit: "°",
                min: -180,
                max: 180,
                value: n.rotation || 0,
                onChange: (y) => r("rotation", y),
              }),
              l.jsxs("div", {
                className: "tgs",
                children: [
                  l.jsx("button", {
                    type: "button",
                    className: "tg" + (Bt(n, "uppercase") ? " active" : ""),
                    onClick: () => N("uppercase"),
                    children: "UPPER",
                  }),
                  l.jsx("button", {
                    type: "button",
                    className: "tg" + (Bt(n, "underline") ? " active" : ""),
                    onClick: () => N("underline"),
                    children: "Underline",
                  }),
                ],
              }),
              l.jsxs(Ki, {
                label: "Drop shadow",
                on: Bt(n, "shadow_enabled"),
                onToggle: () => N("shadow_enabled"),
                children: [
                  l.jsx(Gr, {
                    label: "Colour",
                    value: n.shadow_color,
                    def: "#000000",
                    onChange: (y) => r("shadow_color", y),
                  }),
                  l.jsx(hn, {
                    label: "Distance",
                    unit: "px",
                    min: 0,
                    max: 30,
                    value: n.shadow_distance != null ? n.shadow_distance : 6,
                    onChange: (y) => r("shadow_distance", y),
                  }),
                  l.jsx(hn, {
                    label: "Opacity",
                    unit: "%",
                    min: 0,
                    max: 100,
                    value: n.shadow_opacity != null ? n.shadow_opacity : 75,
                    onChange: (y) => r("shadow_opacity", y),
                  }),
                ],
              }),
              l.jsxs(Ki, {
                label: "Glow",
                on: Bt(n, "glow_enabled"),
                onToggle: () => N("glow_enabled"),
                children: [
                  l.jsx(Gr, {
                    label: "Colour",
                    value: n.glow_color,
                    def: "#7C4DFF",
                    onChange: (y) => r("glow_color", y),
                  }),
                  l.jsx(hn, {
                    label: "Intensity",
                    unit: "px",
                    min: 0,
                    max: 30,
                    value: n.glow_intensity != null ? n.glow_intensity : 10,
                    onChange: (y) => r("glow_intensity", y),
                  }),
                ],
              }),
              l.jsxs(Ki, {
                label: "Box behind text",
                on: Bt(n, "background_enabled"),
                onToggle: () => N("background_enabled"),
                children: [
                  l.jsx(Gr, {
                    label: "Colour",
                    value: n.background_color,
                    def: "#000000",
                    onChange: (y) => r("background_color", y),
                  }),
                  l.jsx(hn, {
                    label: "Opacity",
                    unit: "%",
                    min: 0,
                    max: 100,
                    value:
                      n.background_opacity != null ? n.background_opacity : 100,
                    onChange: (y) => r("background_opacity", y),
                  }),
                  l.jsx(hn, {
                    label: "Corner radius",
                    unit: "px",
                    min: 0,
                    max: 40,
                    value:
                      n.background_radius != null ? n.background_radius : 10,
                    onChange: (y) => r("background_radius", y),
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      l.jsx("div", {
        className: "cust-foot",
        children: l.jsxs("button", {
          type: "button",
          className: "btn btn-ghost",
          onClick: s,
          children: [l.jsx(B.refresh, {}), " Reset to preset"],
        }),
      }),
    ],
  });
}
function Xr(e) {
  if (e == null || !isFinite(e)) return "0:00";
  e = Math.max(0, e);
  const t = Math.floor(e / 60),
    n = Math.floor(e % 60);
  return `${t}:${String(n).padStart(2, "0")}`;
}
function Km({ state: e, onSeek: t, currentTime: n, onEditSegment: r }) {
  const [s, i] = x.useState(null),
    [a, u] = x.useState("");
  if (e.loading && !e.ready)
    return l.jsxs("div", {
      className: "transcript-empty",
      children: [l.jsx("span", { className: "spinner" }), " Transcribing…"],
    });
  if (!e.ready)
    return l.jsx("div", {
      className: "transcript-empty",
      children: "Transcript will appear here once your video is processed.",
    });
  if (!e.segments.length)
    return l.jsx("div", {
      className: "transcript-empty",
      children: "No speech detected.",
    });
  function o(p, w) {
    (w && w.stopPropagation(), i(p.id), u((p.text || "").trim()));
  }
  function d(p) {
    const w = a.trim();
    (r && w && r(p, w), i(null));
  }
  function g(p) {
    (p && p.stopPropagation(), i(null));
  }
  function m(p, w) {
    p.key === "Enter" && !p.shiftKey
      ? (p.preventDefault(), d(w))
      : p.key === "Escape" && (p.preventDefault(), g());
  }
  return l.jsx("div", {
    className: "transcript-list",
    children: e.segments.map((p) => {
      const w = s === p.id,
        _ = n != null && n >= p.start && n < p.end;
      return w
        ? l.jsxs(
            "div",
            {
              className: "transcript-row editing",
              onClick: (N) => N.stopPropagation(),
              children: [
                l.jsxs("div", {
                  className: "transcript-edit-header",
                  children: [
                    l.jsxs("span", {
                      className: "transcript-ts",
                      children: [Xr(p.start), " – ", Xr(p.end)],
                    }),
                    l.jsx("span", {
                      className: "transcript-edit-hint",
                      children: "Enter to save · Esc to cancel",
                    }),
                  ],
                }),
                l.jsx("textarea", {
                  className: "transcript-edit-input",
                  value: a,
                  onChange: (N) => u(N.target.value),
                  onKeyDown: (N) => m(N, p.id),
                  rows: 2,
                  autoFocus: !0,
                }),
                l.jsxs("div", {
                  className: "transcript-edit-actions",
                  children: [
                    l.jsxs("button", {
                      type: "button",
                      className: "btn btn-sm btn-edit-save",
                      onClick: () => d(p.id),
                      title: "Save changes",
                      children: [l.jsx(B.check, {}), " Save"],
                    }),
                    l.jsxs("button", {
                      type: "button",
                      className: "btn btn-sm btn-edit-cancel",
                      onClick: g,
                      title: "Cancel editing",
                      children: [l.jsx(B.close, {}), " Cancel"],
                    }),
                  ],
                }),
              ],
            },
            p.id,
          )
        : l.jsxs(
            "div",
            {
              className: "transcript-row" + (_ ? " active" : ""),
              onClick: () => t(p.start),
              title: `Click to seek to ${Xr(p.start)} – ${Xr(p.end)}`,
              role: "button",
              tabIndex: 0,
              onKeyDown: (N) => {
                (N.key === "Enter" || N.key === " ") &&
                  (N.preventDefault(), t(p.start));
              },
              children: [
                l.jsx("span", {
                  className: "transcript-ts",
                  children: Xr(p.start),
                }),
                l.jsx("span", {
                  className: "transcript-text",
                  children: (p.text || "").trim(),
                }),
                l.jsx("button", {
                  type: "button",
                  className: "transcript-edit-btn",
                  onClick: (N) => o(p, N),
                  title: "Edit this line",
                  "aria-label": "Edit transcript line",
                  children: l.jsx(B.edit, {}),
                }),
              ],
            },
            p.id,
          );
    }),
  });
}
function dc({
  label: e,
  cfg: t,
  active: n,
  trending: r,
  custom: s,
  onClick: i,
  onDelete: a,
}) {
  const u = (e || "Aa").split(/\s+/).slice(0, 2),
    o = Lo(t, { fontPx: 16, scale: 0.16 }),
    d = t.animation === "highlight" || t.karaoke ? u.length - 1 : -1;
  return l.jsxs("button", {
    type: "button",
    className: "chip" + (n ? " active" : ""),
    onClick: i,
    children: [
      s
        ? l.jsx("span", { className: "tag custom", children: "Custom" })
        : r
          ? l.jsx("span", { className: "tag", children: "Trending" })
          : null,
      s &&
        l.jsx("span", {
          className: "chip-del",
          onClick: (g) => {
            (g.stopPropagation(), a());
          },
          children: "✕",
        }),
      l.jsx("span", {
        className: "stage",
        children: t.engine === "canvas" ? l.jsx(NativePreview,{cfg:t,thumbnail:true}) : l.jsx("span", {
          className: "sample",
          style: o,
          children: u.map((g, m) =>
            l.jsxs(
              "span",
              {
                style: {
                  color: m === d ? t.highlight_color || "#FFD400" : void 0,
                },
                children: [g, " "],
              },
              m,
            ),
          ),
        }),
      }),
      l.jsx("span", { className: "name", children: e }),
    ],
  });
}
function fc({ s: e, open: t, setOpen: n }) {
  const [r, s] = x.useState(""),
    i = () => {
      e.saveCurrentPreset(r) && (n(!1), s(""));
    };
  return t
    ? l.jsxs("div", {
        className: "save-form",
        children: [
          l.jsx("input", {
            type: "text",
            placeholder: "Name your style…",
            value: r,
            maxLength: 40,
            autoFocus: !0,
            onChange: (a) => s(a.target.value),
            onKeyDown: (a) => {
              (a.key === "Enter" && i(), a.key === "Escape" && n(!1));
            },
          }),
          l.jsx("button", {
            className: "btn btn-primary",
            onClick: i,
            children: "Save",
          }),
          l.jsx("button", {
            className: "btn",
            onClick: () => n(!1),
            children: "✕",
          }),
        ],
      })
    : null;
}
function Ym({
  studio: e,
  language: t,
  onFontUpload: n,
  media: r,
  prepView: s,
  sourceReady: i,
  transcript: a,
  curTime: u,
  seekTo: o,
  videoRef: d,
  duration: g,
  aspect: m,
  fit: p,
  squareCorners: w = "round",
  barText: _,
  barTextColor: N,
  barTextAnim: R,
  signature: h,
  setSig: c,
  imageWatermark: f = null,
  setImageWatermark: v = null,
  onBack: j,
  onNext: k,
  onEditSegment: E,
  splitScreen: C = !1,
  splitDivider: H = "black",
  splitBroll: M = "subway_surfers",
  customBrollPreviewUrl: F = null,
  progressBar: L = !1,
  progressBarColor: y = "#FACC15",
  progressBarPosition: U = "top",
  progressBarHeight: oe = 10,
  onTimeUpdate: Y,
  onLoadedMetadata: te,
  onDurationChange: T,
  onPlay: O,
  onPause: D,
  onEnded: X,
  isMuted: z = !0,
}) {
  var rt;
  const [I, W] = x.useState("themes"),
    [Z, Q] = x.useState("all"),
    [me, de] = x.useState(!1),
    ue = e,
    be = (ue.presets || []).filter((A) =>
      Z === "all" ? !0 : (A.category || "viral") === Z,
    );
  return l.jsxs("div", {
    className: "wizard-screen",
    children: [
      l.jsxs("div", {
        className: "w3-grid",
        children: [
          l.jsxs("div", {
            className: "card w3-left",
            children: [
              l.jsx("div", {
                className: "card-h",
                children: l.jsx("h2", { children: "Caption style" }),
              }),
              l.jsxs("div", {
                className: "studio-tabs",
                children: [
                  l.jsxs("button", {
                    className: "studio-tab" + (I === "themes" ? " active" : ""),
                    onClick: () => W("themes"),
                    children: [
                      l.jsx(B.library, {}),
                      l.jsx("span", {
                        className: "studio-tab-lbl",
                        children: "Themes",
                      }),
                    ],
                  }),
                  l.jsxs("button", {
                    className: "studio-tab" + (I === "style" ? " active" : ""),
                    onClick: () => W("style"),
                    children: [
                      l.jsx(B.create, {}),
                      l.jsx("span", {
                        className: "studio-tab-lbl",
                        children: "Customize",
                      }),
                    ],
                  }),
                  l.jsxs("button", {
                    className:
                      "studio-tab" + (I === "presets" ? " active" : ""),
                    onClick: () => W("presets"),
                    children: [
                      l.jsx(B.download, {}),
                      l.jsx("span", {
                        className: "studio-tab-lbl",
                        children: "My presets",
                      }),
                    ],
                  }),
                  l.jsxs("button", {
                    className:
                      "studio-tab" + (I === "transcript" ? " active" : ""),
                    onClick: () => W("transcript"),
                    children: [
                      l.jsx(B.bolt, {}),
                      l.jsx("span", {
                        className: "studio-tab-lbl",
                        children: "Transcript",
                      }),
                    ],
                  }),
                ],
              }),
              I === "themes" &&
                l.jsxs("div", {
                  className: "studio-pane",
                  children: [
                    l.jsx("div", {
                      className: "toggle",
                      style: {
                        marginBottom: "12px",
                        width: "100%",
                        justifyContent: "flex-start",
                        gap: "4px",
                      },
                      children: [
                        {
                          id: "all",
                          label: `All (${((rt = ue.presets) == null ? void 0 : rt.length) || 0})`,
                        },
                        { id: "viral", label: "🔥 Viral" },
                        { id: "cyber", label: "⚡ Cyber & Tech" },
                        { id: "boxed", label: "📦 Boxed" },
                        { id: "podcast", label: "🎙️ Podcast & Clean" },
                        { id:"Premium",label:"Premium" },
                        { id:"Multiline",label:"Multiline" },
                        { id:"Animated",label:"Animated" },
                      ].map((A) =>
                        l.jsx(
                          "button",
                          {
                            type: "button",
                            className: Z === A.id ? "active" : "",
                            style: { padding: "6px 12px", fontSize: "12px" },
                            onClick: () => Q(A.id),
                            children: A.label,
                          },
                          A.id,
                        ),
                      ),
                    }),
                    l.jsx("div", {
                      className: "chips",
                      style: { maxHeight: "420px" },
                      children: be.map((A) =>
                        l.jsx(
                          dc,
                          {
                            label: A.label,
                            trending: A.trending,
                            cfg: A,
                            active: ue.activeKey === A.id,
                            onClick: () => ue.selectPreset(A.id),
                          },
                          A.id,
                        ),
                      ),
                    }),
                  ],
                }),
              I === "style" &&
                l.jsxs("div", {
                  className: "studio-pane",
                  children: [
                    l.jsxs("div", {
                      className: "style-head",
                      children: [
                        l.jsx("span", {
                          className: "eyebrow",
                          children: "Customize",
                        }),
                        l.jsxs("button", {
                          className: "save-btn",
                          onClick: () => de((A) => !A),
                          children: [l.jsx(B.download, {}), " Save current"],
                        }),
                      ],
                    }),
                    l.jsx(fc, { s: ue, open: me, setOpen: de }),
                    l.jsx(Vm, { studio: ue, onFontUpload: n }),
                  ],
                }),
              I === "presets" &&
                l.jsxs("div", {
                  className: "studio-pane",
                  children: [
                    l.jsxs("div", {
                      className: "style-head",
                      children: [
                        l.jsx("span", {
                          className: "eyebrow",
                          children: "My styles",
                        }),
                        l.jsxs("button", {
                          className: "save-btn",
                          onClick: () => de((A) => !A),
                          children: [l.jsx(B.download, {}), " Save current"],
                        }),
                      ],
                    }),
                    l.jsx(fc, { s: ue, open: me, setOpen: de }),
                    l.jsxs("div", {
                      className: "chips",
                      children: [
                        ue.userPresets.map((A) =>
                          l.jsx(
                            dc,
                            {
                              label: A.label,
                              custom: !0,
                              active: ue.activeKey === A.id,
                              cfg: Pf(ue.presets, A.base, A.overrides),
                              onClick: () => ue.selectUserPreset(A),
                              onDelete: () => ue.removeUserPreset(A.id),
                            },
                            A.id,
                          ),
                        ),
                        !ue.userPresets.length &&
                          l.jsxs("div", {
                            className: "empty",
                            style: { gridColumn: "1/-1", padding: 24 },
                            children: [
                              "No saved styles yet — tune a look in ",
                              l.jsx("b", { children: "Customize" }),
                              " and hit “Save current”.",
                            ],
                          }),
                      ],
                    }),
                  ],
                }),
              I === "transcript" &&
                l.jsx("div", {
                  className: "studio-pane",
                  children: l.jsx(Km, {
                    state: a,
                    onSeek: o,
                    currentTime: u,
                    onEditSegment: E,
                  }),
                }),
            ],
          }),
          l.jsxs("div", {
            className: "w3-right",
            children: [
              l.jsx(ai, {
                cfg: e.cfg,
                cinematic: e.cinematic,
                language: t,
                media: r,
                preparing: !r && i,
                aspect: m,
                fit: p,
                squareCorners: w,
                barText: _,
                barTextColor: N,
                barTextAnim: R,
                signature: h,
                setSig: c,
                videoRef: d,
                imageWatermark: f,
                setImageWatermark: v,
                overrides: e.overrides,
                setOverride: e.setOverride,
                splitScreen: C,
                splitDivider: H,
                splitBroll: M,
                customBrollPreviewUrl: F,
                progressBar: L,
                progressBarColor: y,
                progressBarPosition: U,
                progressBarHeight: oe,
                onTimeUpdate: Y,
                onLoadedMetadata: te,
                onDurationChange: T,
                onPlay: O,
                onPause: D,
                onEnded: X,
                isMuted: z,
              }),
              l.jsxs("div", {
                className: "prep prep-" + (s.phase || "idle"),
                children: [
                  l.jsxs("div", {
                    className: "prep-row",
                    children: [
                      l.jsxs("span", {
                        className: "prep-msg",
                        children: [
                          [
                            "downloading",
                            "transcribing",
                            "downloaded",
                          ].includes(s.phase) &&
                            l.jsx("span", { className: "spinner" }),
                          s.phase === "ready" &&
                            l.jsx("span", {
                              className: "prep-ok",
                              children: "✓",
                            }),
                          s.phase === "error" &&
                            l.jsx("span", {
                              className: "prep-ok",
                              style: { color: "var(--danger)" },
                              children: "!",
                            }),
                          s.message || "Preparing video…",
                        ],
                      }),
                      s.pct != null &&
                        l.jsxs("span", {
                          className: "prep-pct",
                          children: [s.pct, "%"],
                        }),
                    ],
                  }),
                  l.jsx("div", {
                    className: "track",
                    children: l.jsx("div", {
                      className:
                        "fill" +
                        (s.pct == null &&
                        ["downloading", "transcribing", "downloaded"].includes(
                          s.phase,
                        )
                          ? " indeterminate"
                          : ""),
                      style:
                        s.pct == null
                          ? { width: "0%" }
                          : { width: s.pct + "%" },
                    }),
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      l.jsxs("div", {
        className: "wizard-nav",
        children: [
          l.jsx("button", {
            className: "btn btn-ghost",
            onClick: j,
            children: "← Back",
          }),
          l.jsx("button", {
            className: "btn btn-primary",
            onClick: k,
            children: "Next →",
          }),
        ],
      }),
    ],
  });
}
function At({ label: e, unit: t, min: n, max: r, value: s, onChange: i }) {
  return l.jsxs("div", {
    className: "ctl",
    children: [
      l.jsxs("label", {
        children: [
          e,
          l.jsxs("span", { className: "val", children: [Math.round(s), t] }),
        ],
      }),
      l.jsx("input", {
        type: "range",
        className: "range",
        min: n,
        max: r,
        value: s,
        onChange: (a) => i(parseFloat(a.target.value)),
      }),
    ],
  });
}
function mn({ label: e, on: t, onToggle: n, children: r }) {
  return l.jsxs("div", {
    className: "fxrow",
    children: [
      l.jsx("button", {
        type: "button",
        className: "tg fxtoggle" + (t ? " active" : ""),
        onClick: n,
        children: e,
      }),
      t && l.jsx("div", { className: "fxbody", children: r }),
    ],
  });
}
function Qm({ cinematic: e, setCine: t, resetCine: n }) {
  return l.jsxs("div", {
    className: "cust-grid",
    children: [
      l.jsx("div", {
        className: "grouphd",
        children: l.jsx("span", { children: "Colour grade" }),
      }),
      l.jsxs("div", {
        className: "ctl",
        children: [
          l.jsx("label", { children: "Look" }),
          l.jsx("select", {
            value: e.color_grade,
            onChange: (r) => t("color_grade", r.target.value),
            children: Em.map(([r, s]) =>
              l.jsx("option", { value: r, children: s }, r),
            ),
          }),
        ],
      }),
      l.jsx("div", {
        className: "grouphd",
        children: l.jsx("span", { children: "Gradients" }),
      }),
      l.jsxs("div", {
        className: "ctl",
        children: [
          l.jsxs(mn, {
            label: "Bottom fade",
            on: e.bottom_gradient,
            onToggle: () => t("bottom_gradient", !e.bottom_gradient),
            children: [
              l.jsx(At, {
                label: "Height",
                unit: "%",
                min: 0,
                max: 80,
                value: e.bottom_gradient_height,
                onChange: (r) => t("bottom_gradient_height", r),
              }),
              l.jsx(At, {
                label: "Strength",
                unit: "%",
                min: 0,
                max: 100,
                value: e.bottom_gradient_strength,
                onChange: (r) => t("bottom_gradient_strength", r),
              }),
            ],
          }),
          l.jsxs(mn, {
            label: "Top fade",
            on: e.top_gradient,
            onToggle: () => t("top_gradient", !e.top_gradient),
            children: [
              l.jsx(At, {
                label: "Height",
                unit: "%",
                min: 0,
                max: 80,
                value: e.top_gradient_height,
                onChange: (r) => t("top_gradient_height", r),
              }),
              l.jsx(At, {
                label: "Strength",
                unit: "%",
                min: 0,
                max: 100,
                value: e.top_gradient_strength,
                onChange: (r) => t("top_gradient_strength", r),
              }),
            ],
          }),
        ],
      }),
      l.jsx("div", {
        className: "grouphd",
        children: l.jsx("span", { children: "Atmosphere" }),
      }),
      l.jsxs("div", {
        className: "ctl",
        children: [
          l.jsx(mn, {
            label: "Vignette",
            on: e.vignette,
            onToggle: () => t("vignette", !e.vignette),
            children: l.jsx(At, {
              label: "Strength",
              unit: "%",
              min: 0,
              max: 100,
              value: e.vignette_strength,
              onChange: (r) => t("vignette_strength", r),
            }),
          }),
          l.jsx(mn, {
            label: "Glow",
            on: e.glow,
            onToggle: () => t("glow", !e.glow),
            children: l.jsx(At, {
              label: "Strength",
              unit: "%",
              min: 0,
              max: 100,
              value: e.glow_strength,
              onChange: (r) => t("glow_strength", r),
            }),
          }),
          l.jsxs(mn, {
            label: "Film grain",
            on: e.grain,
            onToggle: () => t("grain", !e.grain),
            children: [
              l.jsx(At, {
                label: "Strength",
                unit: "%",
                min: 0,
                max: 100,
                value: e.grain_strength,
                onChange: (r) => t("grain_strength", r),
              }),
              l.jsx("div", {
                className: "note",
                children: "Grain appears in the exported clip.",
              }),
            ],
          }),
          l.jsx(mn, {
            label: "Cinematic bars",
            on: e.letterbox,
            onToggle: () => t("letterbox", !e.letterbox),
            children: l.jsx(At, {
              label: "Size",
              unit: "%",
              min: 0,
              max: 100,
              value: e.letterbox_size,
              onChange: (r) => t("letterbox_size", r),
            }),
          }),
        ],
      }),
      l.jsx("div", {
        className: "grouphd",
        children: l.jsx("span", { children: "Detail & lens" }),
      }),
      l.jsxs("div", {
        className: "ctl",
        children: [
          l.jsx(mn, {
            label: "Sharpen",
            on: e.sharpen,
            onToggle: () => t("sharpen", !e.sharpen),
            children: l.jsx(At, {
              label: "Strength",
              unit: "%",
              min: 0,
              max: 100,
              value: e.sharpen_strength,
              onChange: (r) => t("sharpen_strength", r),
            }),
          }),
          l.jsxs(mn, {
            label: "Chromatic aberration",
            on: e.chroma_shift,
            onToggle: () => t("chroma_shift", !e.chroma_shift),
            children: [
              l.jsx(At, {
                label: "Strength",
                unit: "%",
                min: 0,
                max: 100,
                value: e.chroma_shift_strength,
                onChange: (r) => t("chroma_shift_strength", r),
              }),
              l.jsx("div", {
                className: "note",
                children:
                  "A subtle RGB channel split — a lens/glitch look. Only visible in the exported clip.",
              }),
            ],
          }),
        ],
      }),
      l.jsx("div", {
        className: "cust-foot",
        children: l.jsxs("button", {
          type: "button",
          className: "btn btn-ghost",
          onClick: n,
          children: [l.jsx(B.refresh, {}), " Reset effects"],
        }),
      }),
    ],
  });
}
const pc = [
  [8, 8],
  [50, 8],
  [92, 8],
  [8, 50],
  [50, 50],
  [92, 50],
  [8, 92],
  [50, 92],
  [92, 92],
];
function hc({ label: e, unit: t, min: n, max: r, value: s, onChange: i }) {
  const a = (u) => Math.max(n, Math.min(r, u));
  return l.jsxs("div", {
    className: "ctl",
    children: [
      l.jsxs("label", {
        children: [
          e,
          l.jsxs("span", {
            className: "val",
            children: [
              l.jsx("input", {
                type: "number",
                className: "val-num",
                min: n,
                max: r,
                value: Math.round(s),
                onChange: (u) =>
                  i(
                    u.target.value === ""
                      ? s
                      : a(parseFloat(u.target.value) || 0),
                  ),
              }),
              t,
            ],
          }),
        ],
      }),
      l.jsx("input", {
        type: "range",
        className: "range",
        min: n,
        max: r,
        value: s,
        onChange: (u) => i(parseFloat(u.target.value)),
      }),
    ],
  });
}
function Gm({ sig: e, setSig: t }) {
  if (!e) return null;
  const n = !!e.enabled,
    r = e.pos_x != null ? e.pos_x : 50,
    s = e.pos_y != null ? e.pos_y : 92,
    i = pc.reduce(
      (a, u, o) => {
        const d = Math.abs(u[0] - r) + Math.abs(u[1] - s);
        return d < a.d ? { i: o, d } : a;
      },
      { i: 7, d: 1e9 },
    ).i;
  return l.jsxs("div", {
    className: "cz",
    children: [
      l.jsx("div", {
        className: "style-head",
        children: l.jsx("span", {
          className: "eyebrow",
          children: "Signature / watermark",
        }),
      }),
      l.jsx("div", {
        className: "fxrow",
        children: l.jsx("button", {
          type: "button",
          className: "tg fxtoggle" + (n ? " active" : ""),
          onClick: () => t("enabled", !n),
          children: n ? "Signature ON" : "Signature OFF",
        }),
      }),
      n &&
        l.jsxs(l.Fragment, {
          children: [
            l.jsxs("div", {
              className: "cz-field",
              children: [
                l.jsx("label", { className: "cz-label", children: "Text" }),
                l.jsxs("div", {
                  className: "cz-select",
                  children: [
                    l.jsx(B.bolt, {}),
                    l.jsx("input", {
                      type: "text",
                      value: e.text || "",
                      placeholder: "@yourhandle",
                      onChange: (a) => t("text", a.target.value),
                    }),
                  ],
                }),
              ],
            }),
            l.jsxs("div", {
              className: "cz-row2",
              children: [
                l.jsxs("div", {
                  className: "cz-field",
                  children: [
                    l.jsx("label", {
                      className: "cz-label",
                      children: "Position",
                    }),
                    l.jsx("div", {
                      className: "cz-posgrid",
                      children: pc.map((a, u) =>
                        l.jsx(
                          "button",
                          {
                            type: "button",
                            className: "cz-posdot" + (i === u ? " active" : ""),
                            onClick: () => {
                              (t("pos_x", a[0]), t("pos_y", a[1]));
                            },
                          },
                          u,
                        ),
                      ),
                    }),
                  ],
                }),
                l.jsxs("div", {
                  className: "cz-field",
                  children: [
                    l.jsx("label", {
                      className: "cz-label",
                      children: "Colour",
                    }),
                    l.jsxs("label", {
                      className: "swatch",
                      children: [
                        "Pick",
                        l.jsx("input", {
                          type: "color",
                          value: e.color || "#FFFFFF",
                          onChange: (a) => t("color", a.target.value),
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            l.jsx(hc, {
              label: "Size",
              unit: "px",
              min: 14,
              max: 90,
              value: e.size != null ? e.size : 34,
              onChange: (a) => t("size", a),
            }),
            l.jsx(hc, {
              label: "Opacity",
              unit: "%",
              min: 10,
              max: 100,
              value: e.opacity != null ? e.opacity : 75,
              onChange: (a) => t("opacity", a),
            }),
            l.jsxs("div", {
              className: "note",
              children: [
                "Tip: you can also ",
                l.jsx("b", { children: "drag the signature" }),
                " right on the preview. Use the grid for static corners, or drag to place it freely (movable).",
              ],
            }),
          ],
        }),
    ],
  });
}
const mc = [
  { label: "Top Left", x: 6, y: 6 },
  { label: "Top Center", x: 50, y: 6 },
  { label: "Top Right", x: 94, y: 6 },
  { label: "Mid Left", x: 6, y: 50 },
  { label: "Center", x: 50, y: 50 },
  { label: "Mid Right", x: 94, y: 50 },
  { label: "Bottom Left", x: 6, y: 94 },
  { label: "Bottom Center", x: 50, y: 94 },
  { label: "Bottom Right", x: 94, y: 94 },
];
function gc({ label: e, unit: t, min: n, max: r, value: s, onChange: i }) {
  const a = (u) => Math.max(n, Math.min(r, u));
  return l.jsxs("div", {
    className: "ctl",
    style: { margin: "4px 0" },
    children: [
      l.jsxs("label", {
        children: [
          e,
          l.jsxs("span", {
            className: "val",
            children: [
              l.jsx("input", {
                type: "number",
                className: "val-num",
                min: n,
                max: r,
                value: Math.round(s),
                onChange: (u) =>
                  i(
                    u.target.value === ""
                      ? s
                      : a(parseFloat(u.target.value) || 0),
                  ),
              }),
              t,
            ],
          }),
        ],
      }),
      l.jsx("input", {
        type: "range",
        className: "range",
        min: n,
        max: r,
        value: s,
        onChange: (u) => i(parseFloat(u.target.value)),
      }),
    ],
  });
}
function Xm({
  wm: e,
  setWm: t,
  isSquare: n,
  onSwitchToSquare: r,
  onUploadingChange: s,
}) {
  const i = x.useRef(null),
    [a, u] = x.useState(!1),
    [o, d] = x.useState("");
  if (!n)
    return l.jsxs("div", {
      className: "card",
      style: {
        padding: 16,
        marginTop: 14,
        background: "var(--surface-2)",
        border: "1px solid var(--line)",
      },
      children: [
        l.jsxs("div", {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          },
          children: [
            l.jsxs("div", {
              style: { display: "flex", alignItems: "center", gap: 8 },
              children: [
                l.jsx("span", { style: { fontSize: "16px" }, children: "🖼️" }),
                l.jsx("span", {
                  style: { fontWeight: 600, fontSize: "13px" },
                  children: "Personal Image Watermark",
                }),
              ],
            }),
            l.jsx("span", {
              style: {
                fontSize: "11px",
                padding: "2px 8px",
                borderRadius: "6px",
                background: "rgba(156, 163, 175, 0.15)",
                color: "var(--muted)",
                fontWeight: 500,
              },
              children: "🔒 1:1 Square Only",
            }),
          ],
        }),
        l.jsx("p", {
          style: {
            fontSize: "12px",
            color: "var(--muted)",
            margin: "6px 0 12px",
            lineHeight: 1.4,
          },
          children:
            "Image watermark overlay is exclusively tailored for 1:1 Square video clips. Switch your aspect ratio to 1:1 Square to position and resize your personal watermark on the preview window.",
        }),
        r &&
          l.jsx("button", {
            type: "button",
            className: "btn btn-ghost",
            onClick: r,
            style: {
              fontSize: "12px",
              padding: "6px 12px",
              width: "100%",
              justifyContent: "center",
            },
            children: "📐 Switch to 1:1 Square Ratio",
          }),
      ],
    });
  const g = !!(e != null && e.enabled),
    m = (e == null ? void 0 : e.pos_x) != null ? e.pos_x : 85,
    p = (e == null ? void 0 : e.pos_y) != null ? e.pos_y : 15,
    w = (e == null ? void 0 : e.scale) != null ? e.scale : 18,
    _ = (e == null ? void 0 : e.opacity) != null ? e.opacity : 85,
    N = mc.reduce(
      (c, f, v) => {
        const j = Math.hypot(f.x - m, f.y - p);
        return j < c.dist ? { idx: v, dist: j } : c;
      },
      { idx: 2, dist: 1e9 },
    ).idx,
    R = async (c) => {
      if (!c || a) return;
      const f = c.name.toLowerCase();
      if (!f.endsWith(".png") && !f.endsWith(".jpg") && !f.endsWith(".jpeg")) {
        d("Please select a PNG, JPG, or JPEG image.");
        return;
      }
      (d(""), u(!0), s == null || s(!0));
      try {
        const v = await ee.uploadWatermark(c);
        if (!(v != null && v.watermark_id) || !(v != null && v.url))
          throw new Error("The upload did not return a watermark reference.");
        (t("image_id", v.watermark_id),
          t("url", v.url),
          t("filename", c.name),
          t("enabled", !0));
      } catch (v) {
        d(v.message || "Failed to upload watermark image.");
      } finally {
        (u(!1), s == null || s(!1));
      }
    },
    h = (c) => {
      (c.preventDefault(),
        c.stopPropagation(),
        c.dataTransfer.files &&
          c.dataTransfer.files[0] &&
          R(c.dataTransfer.files[0]));
    };
  return l.jsxs("div", {
    className: "card",
    style: {
      padding: 16,
      marginTop: 14,
      background: "var(--surface-2)",
      border: "1px solid var(--line)",
    },
    children: [
      l.jsxs("div", {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        },
        children: [
          l.jsxs("div", {
            style: { display: "flex", alignItems: "center", gap: 8 },
            children: [
              l.jsx("span", { style: { fontSize: "16px" }, children: "🖼️" }),
              l.jsxs("div", {
                children: [
                  l.jsx("div", {
                    style: { fontWeight: 600, fontSize: "13px" },
                    children: "Personal Image Watermark",
                  }),
                  l.jsx("div", {
                    style: { fontSize: "11px", color: "var(--muted)" },
                    children: "PNG, JPG, JPEG · Resizable & Placable",
                  }),
                ],
              }),
            ],
          }),
          l.jsx("button", {
            type: "button",
            className: "tg fxtoggle" + (g ? " active" : ""),
            disabled: a,
            onClick: () => t("enabled", !g),
            style: { minWidth: 100 },
            children: g ? "Watermark ON" : "Watermark OFF",
          }),
        ],
      }),
      g &&
        l.jsxs("div", {
          style: {
            display: "flex",
            flexDirection: "column",
            gap: 14,
            marginTop: 10,
          },
          children: [
            l.jsx("input", {
              type: "file",
              ref: i,
              accept: ".png,.jpg,.jpeg,.PNG,.JPG,.JPEG",
              style: { display: "none" },
              disabled: a,
              onChange: (c) => {
                var v;
                const f = (v = c.target.files) == null ? void 0 : v[0];
                ((c.target.value = ""), R(f));
              },
            }),
            e != null && e.url
              ? l.jsxs("div", {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 12px",
                    background: "var(--surface)",
                    border: "1px solid var(--line-2)",
                    borderRadius: 10,
                  },
                  children: [
                    l.jsx("div", {
                      style: {
                        width: 52,
                        height: 52,
                        borderRadius: 8,
                        overflow: "hidden",
                        display: "grid",
                        placeItems: "center",
                        background:
                          "repeating-conic-gradient(#1e2430 0% 25%, #2a3142 0% 50%) 50% / 12px 12px",
                        border: "1px solid var(--line-2)",
                        flexShrink: 0,
                      },
                      children: l.jsx("img", {
                        src: e.url,
                        alt: "Watermark preview",
                        style: {
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                        },
                      }),
                    }),
                    l.jsxs("div", {
                      style: { flex: 1, minWidth: 0 },
                      children: [
                        l.jsx("div", {
                          style: {
                            fontWeight: 600,
                            fontSize: "12.5px",
                            color: "var(--text)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          },
                          children: e.filename || "Watermark Image",
                        }),
                        l.jsx("div", {
                          style: {
                            fontSize: "11px",
                            color: "var(--muted)",
                            marginTop: 2,
                          },
                          children: a
                            ? "Uploading to server…"
                            : "Ready on 1:1 window",
                        }),
                      ],
                    }),
                    l.jsxs("div", {
                      style: { display: "flex", gap: 6, flexShrink: 0 },
                      children: [
                        l.jsx("button", {
                          type: "button",
                          className: "btn btn-ghost",
                          disabled: a,
                          onClick: () => i.current && i.current.click(),
                          style: { fontSize: "11.5px", padding: "4px 8px" },
                          title: "Change image",
                          children: "Change",
                        }),
                        l.jsx("button", {
                          type: "button",
                          className: "btn btn-ghost",
                          disabled: a,
                          onClick: () => {
                            (t("url", null),
                              t("image_id", null),
                              t("filename", ""));
                          },
                          style: {
                            fontSize: "11.5px",
                            padding: "4px 8px",
                            color: "var(--danger)",
                          },
                          title: "Remove image",
                          children: "Remove",
                        }),
                      ],
                    }),
                  ],
                })
              : l.jsxs("div", {
                  onDragOver: (c) => {
                    (c.preventDefault(), c.stopPropagation());
                  },
                  onDrop: h,
                  onClick: () => {
                    var c;
                    a || (c = i.current) == null || c.click();
                  },
                  style: {
                    border: "2px dashed var(--line-2)",
                    borderRadius: 12,
                    padding: "20px 14px",
                    textAlign: "center",
                    cursor: a ? "progress" : "pointer",
                    background: "rgba(56, 189, 248, 0.03)",
                    transition: "border-color .15s, background .15s",
                  },
                  children: [
                    l.jsx("div", {
                      style: { fontSize: "24px", marginBottom: 6 },
                      children: "📤",
                    }),
                    l.jsx("div", {
                      style: {
                        fontWeight: 600,
                        fontSize: "12.5px",
                        color: "var(--accent-hi)",
                      },
                      children: a
                        ? "Uploading watermark image…"
                        : "Click or drag & drop image watermark",
                    }),
                    l.jsx("div", {
                      style: {
                        fontSize: "11px",
                        color: "var(--muted)",
                        marginTop: 4,
                      },
                      children:
                        "Supports PNG, JPG, or JPEG (transparent PNG recommended)",
                    }),
                  ],
                }),
            o &&
              l.jsxs("div", {
                style: {
                  fontSize: "11.5px",
                  color: "var(--danger)",
                  background: "var(--danger-soft)",
                  padding: "6px 10px",
                  borderRadius: 8,
                },
                children: ["⚠️ ", o],
              }),
            l.jsxs("div", {
              style: {
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              },
              children: [
                l.jsx(gc, {
                  label: "Watermark Size",
                  unit: "%",
                  min: 8,
                  max: 50,
                  value: w,
                  onChange: (c) => t("scale", c),
                }),
                l.jsx(gc, {
                  label: "Opacity",
                  unit: "%",
                  min: 10,
                  max: 100,
                  value: _,
                  onChange: (c) => t("opacity", c),
                }),
              ],
            }),
            l.jsxs("div", {
              style: {
                display: "flex",
                flexDirection: "column",
                gap: 8,
                marginTop: 4,
              },
              children: [
                l.jsx("label", {
                  className: "fieldlabel",
                  style: { marginBottom: 0 },
                  children: "Placement Presets",
                }),
                l.jsxs("div", {
                  style: { display: "flex", gap: 14, alignItems: "center" },
                  children: [
                    l.jsx("div", {
                      className: "cz-posgrid",
                      style: {
                        width: 84,
                        height: 84,
                        gridTemplateColumns: "repeat(3, 1fr)",
                        padding: 6,
                      },
                      children: mc.map((c, f) =>
                        l.jsx(
                          "button",
                          {
                            type: "button",
                            title: c.label,
                            className: "cz-posdot" + (N === f ? " active" : ""),
                            onClick: () => {
                              (t("pos_x", c.x), t("pos_y", c.y));
                            },
                          },
                          c.label,
                        ),
                      ),
                    }),
                    l.jsxs("div", {
                      style: {
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      },
                      children: [
                        l.jsxs("div", {
                          style: {
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "11.5px",
                          },
                          children: [
                            l.jsx("span", {
                              style: { color: "var(--muted)" },
                              children: "Coordinates:",
                            }),
                            l.jsxs("span", {
                              style: {
                                fontFamily: "var(--mono)",
                                color: "var(--accent-hi)",
                              },
                              children: [
                                "X: ",
                                Math.round(m),
                                "% · Y: ",
                                Math.round(p),
                                "%",
                              ],
                            }),
                          ],
                        }),
                        l.jsxs("div", {
                          style: {
                            fontSize: "11px",
                            color: "var(--muted)",
                            lineHeight: 1.4,
                          },
                          children: [
                            "Click dots for standard corners or ",
                            l.jsx("b", {
                              children: "drag the watermark directly",
                            }),
                            " on the 1:1 preview window!",
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
    ],
  });
}
function Jm({
  studio: e,
  language: t,
  media: n,
  sourceReady: r,
  aspect: s,
  fit: i,
  squareCorners: a = "round",
  barText: u,
  barTextColor: o,
  barTextAnim: d,
  signature: g,
  setSig: m,
  videoRef: p,
  imageWatermark: w = null,
  setImageWatermark: _ = null,
  onSwitchToSquare: N = null,
  onBack: R,
  onNext: h,
  captionsEnabled: c = !0,
  splitScreen: f = !1,
  splitDivider: v = "black",
  splitBroll: j = "subway_surfers",
  customBrollPreviewUrl: k = null,
  progressBar: E = !1,
  setProgressBar: C,
  progressBarColor: H = "#FACC15",
  setProgressBarColor: M,
  progressBarPosition: F = "top",
  setProgressBarPosition: L,
  progressBarHeight: y = 10,
  setProgressBarHeight: U,
  onTimeUpdate: oe,
  onLoadedMetadata: Y,
  onDurationChange: te,
  onPlay: T,
  onPause: O,
  onEnded: D,
  isMuted: X = !0,
}) {
  const [z, I] = x.useState(!1);
  return l.jsxs("div", {
    className: "wizard-screen",
    children: [
      l.jsxs("div", {
        className: "w3-grid",
        children: [
          l.jsxs("div", {
            className: "card w3-left",
            children: [
              l.jsx("div", {
                className: "card-h",
                children: l.jsx("h2", { children: "Cinematic effects" }),
              }),
              l.jsx("div", {
                className: "studio-pane",
                style: { padding: "16px 0 0" },
                children: l.jsx(Qm, {
                  cinematic: e.cinematic,
                  setCine: e.setCine,
                  resetCine: e.resetCine,
                }),
              }),
              l.jsxs("div", {
                className: "card-h",
                style: {
                  marginTop: 22,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                },
                children: [
                  l.jsxs("div", {
                    children: [
                      l.jsx("h2", { children: "⏱️ Retention Progress Bar" }),
                      l.jsx("span", {
                        className: "hint",
                        style: { fontSize: "11px" },
                        children: "CapCut-style animated accent line",
                      }),
                    ],
                  }),
                  l.jsxs("label", {
                    style: {
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    },
                    children: [
                      l.jsx("input", {
                        type: "checkbox",
                        checked: E,
                        onChange: (W) => C && C(W.target.checked),
                        style: {
                          cursor: "pointer",
                          accentColor: "var(--accent)",
                        },
                      }),
                      l.jsx("span", {
                        style: {
                          fontSize: "12px",
                          fontWeight: 600,
                          color: E ? "var(--accent)" : "var(--text-dim)",
                        },
                        children: E ? "ON" : "OFF",
                      }),
                    ],
                  }),
                ],
              }),
              E &&
                l.jsxs("div", {
                  className: "studio-pane",
                  style: {
                    padding: "12px 0 0",
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                  },
                  children: [
                    l.jsxs("div", {
                      children: [
                        l.jsx("label", {
                          className: "fieldlabel",
                          style: { marginBottom: 6 },
                          children: "Position",
                        }),
                        l.jsxs("div", {
                          className: "toggle",
                          style: {
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                          },
                          children: [
                            l.jsx("button", {
                              type: "button",
                              className: F === "top" ? "active" : "",
                              onClick: () => L && L("top"),
                              children: "⬆️ Top of Video",
                            }),
                            l.jsx("button", {
                              type: "button",
                              className: F === "bottom" ? "active" : "",
                              onClick: () => L && L("bottom"),
                              children: "⬇️ Bottom of Video",
                            }),
                          ],
                        }),
                      ],
                    }),
                    l.jsxs("div", {
                      children: [
                        l.jsx("label", {
                          className: "fieldlabel",
                          style: { marginBottom: 6 },
                          children: "Accent Color",
                        }),
                        l.jsx("div", {
                          style: {
                            display: "flex",
                            gap: 8,
                            flexWrap: "wrap",
                            alignItems: "center",
                          },
                          children: [
                            ["#FACC15", "⚡ Yellow"],
                            ["#06B6D4", "🌊 Cyan"],
                            ["#EC4899", "🔥 Pink"],
                            ["#22C55E", "🟢 Green"],
                            ["#FFFFFF", "⚪ White"],
                            ["#EF4444", "🔴 Red"],
                          ].map(([W, Z]) =>
                            l.jsxs(
                              "button",
                              {
                                type: "button",
                                onClick: () => M && M(W),
                                style: {
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 6,
                                  padding: "6px 10px",
                                  borderRadius: "8px",
                                  border:
                                    H === W
                                      ? "2px solid var(--accent)"
                                      : "1px solid var(--line)",
                                  background:
                                    H === W
                                      ? "rgba(56, 189, 248, 0.15)"
                                      : "var(--surface-2)",
                                  color: "var(--text)",
                                  fontSize: "12px",
                                  cursor: "pointer",
                                },
                                children: [
                                  l.jsx("span", {
                                    style: {
                                      width: 12,
                                      height: 12,
                                      borderRadius: "50%",
                                      background: W,
                                      display: "inline-block",
                                      border: "1px solid rgba(0,0,0,0.3)",
                                    },
                                  }),
                                  Z,
                                ],
                              },
                              W,
                            ),
                          ),
                        }),
                      ],
                    }),
                    l.jsxs("div", {
                      children: [
                        l.jsxs("div", {
                          style: {
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 4,
                          },
                          children: [
                            l.jsx("label", {
                              className: "fieldlabel",
                              children: "Thickness",
                            }),
                            l.jsxs("span", {
                              style: {
                                fontSize: "11.5px",
                                color: "var(--text-dim)",
                              },
                              children: [y, "px"],
                            }),
                          ],
                        }),
                        l.jsx("input", {
                          type: "range",
                          min: "6",
                          max: "18",
                          step: "2",
                          value: y,
                          onChange: (W) => U && U(parseInt(W.target.value, 10)),
                          style: {
                            width: "100%",
                            accentColor: "var(--accent)",
                          },
                        }),
                      ],
                    }),
                  ],
                }),
              l.jsx("div", {
                className: "card-h",
                style: { marginTop: 22 },
                children: l.jsx("h2", { children: "Signature / watermark" }),
              }),
              l.jsxs("div", {
                className: "studio-pane",
                style: { padding: "16px 0 0" },
                children: [
                  l.jsx(Gm, { sig: g, setSig: m }),
                  l.jsx(Xm, {
                    wm: w,
                    setWm: _,
                    isSquare: i === "square",
                    onSwitchToSquare: N,
                    onUploadingChange: I,
                  }),
                ],
              }),
            ],
          }),
          l.jsx("div", {
            className: "w3-right",
            children: l.jsx(ai, {
              cfg: e.cfg,
              cinematic: e.cinematic,
              language: t,
              media: n,
              preparing: !n && r,
              aspect: s,
              fit: i,
              squareCorners: a,
              barText: u,
              barTextColor: o,
              barTextAnim: d,
              signature: g,
              setSig: m,
              videoRef: p,
              imageWatermark: w,
              setImageWatermark: _,
              overrides: e.overrides,
              setOverride: e.setOverride,
              captionsEnabled: c,
              splitScreen: f,
              splitDivider: v,
              splitBroll: j,
              customBrollPreviewUrl: k,
              progressBar: E,
              progressBarColor: H,
              progressBarPosition: F,
              progressBarHeight: y,
              onTimeUpdate: oe,
              onLoadedMetadata: Y,
              onDurationChange: te,
              onPlay: T,
              onPause: O,
              onEnded: D,
              isMuted: X,
            }),
          }),
        ],
      }),
      l.jsxs("div", {
        className: "wizard-nav",
        children: [
          l.jsx("button", {
            className: "btn btn-ghost",
            onClick: R,
            children: "← Back",
          }),
          l.jsx("button", {
            className: "btn btn-primary",
            disabled: z,
            onClick: h,
            children: "Next →",
          }),
        ],
      }),
    ],
  });
}
function qm({ src: e, start: t, onStart: n }) {
  const r = x.useRef(null),
    [s, i] = x.useState(null),
    [a, u] = x.useState([]),
    [o, d] = x.useState(0),
    [g, m] = x.useState(!1),
    [p, w] = x.useState("");
  (x.useEffect(() => {
    if (!e) {
      (i(null), u([]), d(0));
      return;
    }
    let N = !1;
    return (
      m(!0),
      w(""),
      (async () => {
        try {
          const h = await (await fetch(e)).arrayBuffer(),
            c = window.AudioContext || window.webkitAudioContext,
            f = new c(),
            v = await f.decodeAudioData(h);
          try {
            f.close();
          } catch {}
          if (N) return;
          const j = v.getChannelData(0),
            k = v.sampleRate,
            E = 640,
            C = Math.max(1, Math.floor(j.length / E)),
            H = new Float32Array(E);
          for (let Y = 0; Y < E; Y++) {
            let te = 0;
            for (let T = 0; T < C; T++) {
              const O = Math.abs(j[Y * C + T] || 0);
              O > te && (te = O);
            }
            H[Y] = te;
          }
          const M = 1024,
            F = Math.floor(j.length / M),
            L = new Float32Array(F);
          for (let Y = 0; Y < F; Y++) {
            let te = 0;
            for (let T = 0; T < M; T++) {
              const O = j[Y * M + T] || 0;
              te += O * O;
            }
            L[Y] = te / M;
          }
          const y = Math.max(4, Math.floor((0.4 * k) / M)),
            U = [];
          let oe = -1e9;
          for (let Y = 1; Y < F - 1; Y++) {
            let te = 0,
              T = 0;
            for (let D = Math.max(0, Y - y); D < Math.min(F, Y + y); D++)
              ((te += L[D]), T++);
            te /= T || 1;
            const O = (Y * M) / k;
            L[Y] > te * 1.5 &&
              L[Y] >= L[Y - 1] &&
              L[Y] > L[Y + 1] &&
              O - oe > 0.27 &&
              (U.push(+O.toFixed(3)), (oe = O));
          }
          (i(H), u(U), d(v.duration), m(!1));
        } catch {
          N || (w("Couldn't analyze this track."), m(!1));
        }
      })(),
      () => {
        N = !0;
      }
    );
  }, [e]),
    x.useEffect(() => {
      const N = r.current;
      if (!N || !s) return;
      const R = window.devicePixelRatio || 1,
        h = N.clientWidth,
        c = N.clientHeight;
      ((N.width = h * R), (N.height = c * R));
      const f = N.getContext("2d");
      (f.setTransform(R, 0, 0, R, 0, 0), f.clearRect(0, 0, h, c));
      const v = s.length,
        j = h / v;
      for (let E = 0; E < v; E++) {
        const C = Math.max(1, s[E] * c * 0.92),
          H = o ? (E / v) * o : 0;
        ((f.fillStyle =
          H < t ? "rgba(124,77,255,0.22)" : "rgba(179,157,255,0.9)"),
          f.fillRect(E * j, (c - C) / 2, Math.max(1, j - 0.6), C));
      }
      ((f.fillStyle = "rgba(255,255,255,0.16)"),
        a.forEach((E) => f.fillRect((E / (o || 1)) * h, 0, 1, c)));
      const k = (t / (o || 1)) * h;
      ((f.fillStyle = "#7c4dff"),
        f.fillRect(k - 1.5, 0, 3, c),
        (f.fillStyle = "#fff"),
        f.beginPath(),
        f.arc(k, 7, 5, 0, Math.PI * 2),
        f.fill());
    }, [s, a, o, t]));
  const _ = (N) => {
    const R = r.current;
    if (!R || !o) return;
    const h = R.getBoundingClientRect();
    let f = Math.min(1, Math.max(0, (N.clientX - h.left) / h.width)) * o,
      v = f,
      j = 0.45;
    (a.forEach((k) => {
      const E = Math.abs(k - f);
      E < j && ((j = E), (v = k));
    }),
      n(+v.toFixed(2)));
  };
  return e
    ? l.jsxs("div", {
        className: "wave",
        children: [
          l.jsxs("div", {
            className: "wave-head",
            children: [
              l.jsx("span", { children: "Beat analysis" }),
              l.jsx("span", {
                className: "wave-start",
                children: g
                  ? "Analyzing…"
                  : p || `Start ${t.toFixed(1)}s · ${a.length} beats`,
              }),
            ],
          }),
          l.jsx("canvas", { ref: r, className: "wave-canvas", onClick: _ }),
          l.jsxs("div", {
            className: "wave-row",
            children: [
              l.jsx("span", {
                className: "wave-hint",
                children:
                  "Click to set the music start — snaps to the nearest beat.",
              }),
              t > 0 &&
                l.jsx("button", {
                  type: "button",
                  className: "wave-reset",
                  onClick: () => n(0),
                  children: "Reset",
                }),
            ],
          }),
        ],
      })
    : null;
}
function Zm({
  tracks: e,
  track: t,
  volume: n,
  duck: r,
  musicStart: s,
  suggest: i,
  onTrack: a,
  onVolume: u,
  onDuck: o,
  onStart: d,
  onUpload: g,
  onRefresh: m,
}) {
  const p = x.useRef(null),
    w = x.useRef(null),
    [_, N] = x.useState(""),
    [R, h] = x.useState(!1),
    c = e.find((j) => j.file === t);
  x.useEffect(() => {
    (h(!1), w.current && w.current.pause());
  }, [t]);
  async function f(j) {
    if (!j) return;
    const k =
      /\.(mp4|mov|mkv|webm|m4v|avi|flv|wmv|mpe?g|ts|m2ts)$/i.test(j.name) ||
      j.type.startsWith("video/");
    N(k ? `Pulling audio from ${j.name}…` : `Uploading ${j.name}…`);
    try {
      const E = await g(j);
      (N(`Added “${E.name}”.`), a(E.file));
    } catch (E) {
      N(E.message);
    }
  }
  function v() {
    const j = w.current;
    j && (j.paused ? (j.play(), h(!0)) : (j.pause(), h(!1)));
  }
  return l.jsxs("details", {
    className: "card sect music-card",
    open: !0,
    children: [
      l.jsxs("summary", {
        className: "card-h sect-h",
        children: [
          l.jsxs("h2", {
            children: [
              l.jsx("span", {
                className: "music-ico",
                children: l.jsx(B.film, {}),
              }),
              "Background music",
              t
                ? l.jsx("span", { className: "sect-badge", children: "On" })
                : null,
            ],
          }),
          l.jsxs("span", {
            className: "sect-h-r",
            children: [
              l.jsxs("button", {
                className: "btn btn-ghost",
                style: { padding: "6px 10px", fontSize: 12 },
                onClick: (j) => {
                  (j.stopPropagation(), j.preventDefault(), m());
                },
                children: [l.jsx(B.refresh, {}), " Refresh"],
              }),
              l.jsx("span", { className: "sect-x" }),
            ],
          }),
        ],
      }),
      l.jsxs("div", {
        className: "music-grid",
        children: [
          l.jsxs("div", {
            className: "music-pick",
            children: [
              i &&
                l.jsxs("div", {
                  className: "music-suggest",
                  children: [
                    l.jsx("span", { className: "ms-emoji", children: i.emoji }),
                    l.jsxs("span", {
                      className: "ms-text",
                      children: [
                        "Suggested: ",
                        l.jsx("b", { children: i.label }),
                        " — ",
                        i.hint,
                      ],
                    }),
                  ],
                }),
              l.jsx("label", { className: "fieldlabel", children: "Track" }),
              l.jsxs("div", {
                className: "cz-select",
                children: [
                  l.jsx(B.film, {}),
                  l.jsxs("select", {
                    value: t || "",
                    onChange: (j) => a(j.target.value),
                    children: [
                      l.jsx("option", { value: "", children: "No music" }),
                      e.map((j) =>
                        l.jsx(
                          "option",
                          { value: j.file, children: j.name },
                          j.file,
                        ),
                      ),
                    ],
                  }),
                  l.jsx("span", { className: "cz-chev" }),
                ],
              }),
              l.jsxs("button", {
                type: "button",
                className: "cz-upload",
                onClick: () => {
                  var j;
                  return (j = p.current) == null ? void 0 : j.click();
                },
                children: [l.jsx(B.upload, {}), " Upload audio or video"],
              }),
              l.jsx("input", {
                ref: p,
                type: "file",
                accept:
                  "audio/*,video/*,.mp3,.m4a,.wav,.aac,.ogg,.flac,.mp4,.mov,.mkv,.webm,.m4v",
                hidden: !0,
                onChange: (j) => f(j.target.files[0]),
              }),
              t &&
                l.jsxs("div", {
                  className: "now-playing" + (R ? " on" : ""),
                  children: [
                    l.jsx("button", {
                      type: "button",
                      className: "np-play",
                      onClick: v,
                      "aria-label": R ? "Pause" : "Play",
                      children: R
                        ? l.jsxs("svg", {
                            viewBox: "0 0 24 24",
                            fill: "currentColor",
                            children: [
                              l.jsx("rect", {
                                x: "6",
                                y: "5",
                                width: "4",
                                height: "14",
                                rx: "1",
                              }),
                              l.jsx("rect", {
                                x: "14",
                                y: "5",
                                width: "4",
                                height: "14",
                                rx: "1",
                              }),
                            ],
                          })
                        : l.jsx("svg", {
                            viewBox: "0 0 24 24",
                            fill: "currentColor",
                            children: l.jsx("path", { d: "M8 5v14l11-7z" }),
                          }),
                    }),
                    l.jsxs("div", {
                      className: "np-info",
                      children: [
                        l.jsx("span", {
                          className: "np-name",
                          children: (c == null ? void 0 : c.name) || t,
                        }),
                        l.jsx("div", {
                          className: "np-bars",
                          "aria-hidden": "true",
                          children: Array.from({ length: 9 }).map((j, k) =>
                            l.jsx(
                              "span",
                              { style: { animationDelay: `${k * 0.09}s` } },
                              k,
                            ),
                          ),
                        }),
                      ],
                    }),
                    l.jsx("audio", {
                      ref: w,
                      src: `/music/${encodeURIComponent(t)}`,
                      preload: "none",
                      onEnded: () => h(!1),
                      onPause: () => h(!1),
                      onPlay: () => h(!0),
                    }),
                  ],
                }),
              t &&
                l.jsx(qm, {
                  src: `/music/${encodeURIComponent(t)}`,
                  start: s || 0,
                  onStart: d,
                }),
            ],
          }),
          l.jsxs("div", {
            className: "music-mix",
            children: [
              l.jsxs("div", {
                className: "ctl",
                children: [
                  l.jsxs("label", {
                    children: [
                      "Music volume ",
                      l.jsxs("span", {
                        className: "val",
                        children: [Math.round(n), "%"],
                      }),
                    ],
                  }),
                  l.jsx("input", {
                    type: "range",
                    className: "range",
                    min: "0",
                    max: "100",
                    value: n,
                    onChange: (j) => u(parseFloat(j.target.value)),
                  }),
                ],
              }),
              l.jsxs("div", {
                className: "ctl",
                children: [
                  l.jsxs("label", {
                    children: [
                      "Duck under voice ",
                      l.jsxs("span", {
                        className: "val",
                        children: [Math.round(r), "%"],
                      }),
                    ],
                  }),
                  l.jsx("input", {
                    type: "range",
                    className: "range",
                    min: "0",
                    max: "100",
                    value: r,
                    onChange: (j) => o(parseFloat(j.target.value)),
                  }),
                  l.jsx("div", {
                    className: "ctl-hint",
                    children:
                      r <= 5
                        ? "Off — music stays at one level the whole time."
                        : r < 40
                          ? "Gentle — music dips a little when someone talks."
                          : r < 75
                            ? "Balanced — music steps back so the voice leads."
                            : "Strong — music drops right down whenever there's a voice.",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      l.jsxs("div", {
        className: "note",
        children: [
          "Mixed under the original voice and auto-ducked while someone's talking — subtle, reels-style. Upload an audio file ",
          l.jsx("b", { children: "or an MP4/video" }),
          " (we'll pull just its sound), or drop files into ",
          l.jsx("b", { children: "assets/music/" }),
          ".",
        ],
      }),
      _ && l.jsx("div", { className: "note", children: _ }),
    ],
  });
}
function eg({
  tracks: e,
  musicTrack: t,
  musicVolume: n,
  musicDuck: r,
  musicStart: s,
  musicSuggest: i,
  onTrack: a,
  onVolume: u,
  onDuck: o,
  onStart: d,
  onMusicUpload: g,
  onRefreshMusic: m,
  studio: p,
  language: w,
  media: _,
  sourceReady: N,
  aspect: R,
  fit: h,
  squareCorners: c = "round",
  barText: f,
  barTextColor: v,
  barTextAnim: j,
  signature: k,
  setSig: E,
  videoRef: C,
  imageWatermark: H = null,
  setImageWatermark: M = null,
  onBack: F,
  onNext: L,
  captionsEnabled: y = !0,
  splitScreen: U = !1,
  splitDivider: oe = "black",
  splitBroll: Y = "subway_surfers",
  customBrollPreviewUrl: te = null,
  progressBar: T = !1,
  progressBarColor: O = "#FACC15",
  progressBarPosition: D = "top",
  progressBarHeight: X = 10,
  onTimeUpdate: z,
  onLoadedMetadata: I,
  onDurationChange: W,
  onPlay: Z,
  onPause: Q,
  onEnded: me,
  isMuted: de = !0,
}) {
  return l.jsxs("div", {
    className: "wizard-screen",
    children: [
      l.jsxs("div", {
        className: "w3-grid",
        children: [
          l.jsx("div", {
            className: "w3-left",
            children: l.jsx(Zm, {
              tracks: e,
              track: t,
              volume: n,
              duck: r,
              musicStart: s,
              suggest: i,
              onTrack: a,
              onVolume: u,
              onDuck: o,
              onStart: d,
              onUpload: g,
              onRefresh: m,
            }),
          }),
          l.jsx("div", {
            className: "w3-right",
            children: l.jsx(ai, {
              cfg: p.cfg,
              cinematic: p.cinematic,
              language: w,
              media: _,
              preparing: !_ && N,
              aspect: R,
              fit: h,
              squareCorners: c,
              barText: f,
              barTextColor: v,
              barTextAnim: j,
              signature: k,
              setSig: E,
              videoRef: C,
              imageWatermark: H,
              setImageWatermark: M,
              overrides: p.overrides,
              setOverride: p.setOverride,
              captionsEnabled: y,
              splitScreen: U,
              splitDivider: oe,
              splitBroll: Y,
              customBrollPreviewUrl: te,
              progressBar: T,
              progressBarColor: O,
              progressBarPosition: D,
              progressBarHeight: X,
              onTimeUpdate: z,
              onLoadedMetadata: I,
              onDurationChange: W,
              onPlay: Z,
              onPause: Q,
              onEnded: me,
              isMuted: de,
            }),
          }),
        ],
      }),
      l.jsxs("div", {
        className: "wizard-nav",
        children: [
          l.jsx("button", {
            className: "btn btn-ghost",
            onClick: F,
            children: "← Back to effects",
          }),
          l.jsx("button", {
            className: "btn btn-primary",
            onClick: L,
            children: "Next →",
          }),
        ],
      }),
    ],
  });
}
function Rf({ src: e, filename: t }) {
  return l.jsx("div", {
    className: "phone clip-phone",
    children: l.jsxs("div", {
      className: "phone-screen",
      children: [
        l.jsx("div", { className: "island" }),
        l.jsx("video", {
          src: e,
          controls: !0,
          preload: "metadata",
          playsInline: !0,
          title: t,
        }),
      ],
    }),
  });
}
const vc = [
  ["downloading", "Download"],
  ["transcribing", "Transcribe"],
  ["selecting", "Analyze"],
  ["rendering", "Render"],
];
function tg({
  busy: e,
  snap: t,
  clips: n,
  error: r,
  summary: s,
  onStartGenerate: i,
  onCancel: a,
  onOpenReframe: u,
  onBack: o,
  onNext: d,
}) {
  var h;
  const g = vc.findIndex(([c]) => c === (t == null ? void 0 : t.stage)),
    m = (t == null ? void 0 : t.status) === "done",
    p = Math.round(((t == null ? void 0 : t.progress) || 0) * 100),
    w =
      e &&
      ((t == null ? void 0 : t.stage) === "queued" ||
        (t == null ? void 0 : t.stage) === "rendering" ||
        (["downloading", "transcribing"].includes(
          t == null ? void 0 : t.stage,
        ) &&
          !((t == null ? void 0 : t.stage_progress) > 0))),
    _ =
      (t == null ? void 0 : t.status) === "error"
        ? "Stopped"
        : (t == null ? void 0 : t.status) === "cancelled"
          ? "Cancelled"
          : w
            ? "Working…"
            : `${p}%`,
    N = !e && !t && n.length === 0;
  async function R(c) {
    const f = (c.url || "").match(/\/clips\/([0-9a-f]{32})\/(\d+)\.mp4/);
    if (f)
      try {
        await ee.revealClip(f[1], parseInt(f[2], 10));
      } catch {}
  }
  return l.jsxs("div", {
    className: "wizard-screen",
    children: [
      l.jsxs("div", {
        className: "card",
        children: [
          l.jsxs("div", {
            className: "card-h",
            children: [
              l.jsx("h2", {
                children: N
                  ? "Review & Confirm"
                  : e
                    ? "Generating your clips…"
                    : m
                      ? "Clips Ready"
                      : "Generation",
              }),
              l.jsx("span", {
                className: "hint",
                children: N
                  ? "Confirm settings to start"
                  : `${n.length} clip${n.length === 1 ? "" : "s"} ready`,
              }),
            ],
          }),
          r &&
            l.jsx("div", {
              className: "error",
              style: { marginBottom: 14 },
              children: r,
            }),
          N &&
            l.jsxs("div", {
              className: "review-pre-card",
              style: { display: "flex", flexDirection: "column", gap: 16 },
              children: [
                l.jsxs("div", {
                  style: {
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: 12,
                    marginTop: 4,
                  },
                  children: [
                    l.jsxs("div", {
                      className: "summary-box",
                      style: {
                        background: "var(--surface-2)",
                        padding: "12px 14px",
                        borderRadius: "10px",
                        border: "1px solid var(--line)",
                      },
                      children: [
                        l.jsx("div", {
                          style: {
                            fontSize: "11px",
                            color: "var(--text-dim)",
                            textTransform: "uppercase",
                            fontWeight: 700,
                            letterSpacing: "0.04em",
                          },
                          children: "Layout & Format",
                        }),
                        l.jsx("div", {
                          style: {
                            fontSize: "13.5px",
                            fontWeight: 600,
                            marginTop: 4,
                            color: "var(--text)",
                          },
                          children:
                            s != null && s.splitScreen
                              ? s.splitBroll === "custom"
                                ? `🏄 Split (Custom: ${s.customBrollName || "Uploaded"})`
                                : `🏄 Viral Split (${s.splitBroll === "satisfying" ? "Oddly Satisfying" : "Subway Surfers"})`
                              : (s == null ? void 0 : s.outputAspect) === "1:1"
                                ? `📱 Square Reel · 1080 × 1920 (${(s == null ? void 0 : s.squareCorners) === "round" ? "Round" : "Square"} corners)`
                                : `📱 Standard ${(s == null ? void 0 : s.outputAspect) || "9:16"} (${(s == null ? void 0 : s.squareCorners) === "round" ? "Round" : "Square"} corners)`,
                        }),
                      ],
                    }),
                    l.jsxs("div", {
                      className: "summary-box",
                      style: {
                        background: "var(--surface-2)",
                        padding: "12px 14px",
                        borderRadius: "10px",
                        border: "1px solid var(--line)",
                      },
                      children: [
                        l.jsx("div", {
                          style: {
                            fontSize: "11px",
                            color: "var(--text-dim)",
                            textTransform: "uppercase",
                            fontWeight: 700,
                            letterSpacing: "0.04em",
                          },
                          children: "Clips Mode",
                        }),
                        l.jsx("div", {
                          style: {
                            fontSize: "13.5px",
                            fontWeight: 600,
                            marginTop: 4,
                            color: "var(--text)",
                          },
                          children:
                            (s == null ? void 0 : s.clipMode) === "custom"
                              ? `⏱️ Custom (${((h = s == null ? void 0 : s.customClips) == null ? void 0 : h.length) || 1} timestamps)`
                              : `🎯 Auto Viral (${(s == null ? void 0 : s.numClips) || 3} clips)`,
                        }),
                      ],
                    }),
                    l.jsxs("div", {
                      className: "summary-box",
                      style: {
                        background: "var(--surface-2)",
                        padding: "12px 14px",
                        borderRadius: "10px",
                        border: "1px solid var(--line)",
                      },
                      children: [
                        l.jsx("div", {
                          style: {
                            fontSize: "11px",
                            color: "var(--text-dim)",
                            textTransform: "uppercase",
                            fontWeight: 700,
                            letterSpacing: "0.04em",
                          },
                          children: "Captions",
                        }),
                        l.jsx("div", {
                          style: {
                            fontSize: "13.5px",
                            fontWeight: 600,
                            marginTop: 4,
                            color: "var(--text)",
                          },
                          children:
                            s != null && s.captionsEnabled
                              ? `✨ ${(s == null ? void 0 : s.styleName) || "Enabled"} (${(s == null ? void 0 : s.language) === "auto" || !(s != null && s.language) ? "Auto" : s.language})`
                              : "✕ Captions Off",
                        }),
                      ],
                    }),
                    l.jsxs("div", {
                      className: "summary-box",
                      style: {
                        background: "var(--surface-2)",
                        padding: "12px 14px",
                        borderRadius: "10px",
                        border: "1px solid var(--line)",
                      },
                      children: [
                        l.jsx("div", {
                          style: {
                            fontSize: "11px",
                            color: "var(--text-dim)",
                            textTransform: "uppercase",
                            fontWeight: 700,
                            letterSpacing: "0.04em",
                          },
                          children: "Audio & Features",
                        }),
                        l.jsxs("div", {
                          style: {
                            fontSize: "13.5px",
                            fontWeight: 600,
                            marginTop: 4,
                            color: "var(--text)",
                          },
                          children: [
                            s != null &&
                            s.splitScreen &&
                            s != null &&
                            s.splitFaceTracking
                              ? "🎯 AI Center · "
                              : "",
                            s != null && s.removeEmptyAir
                              ? "✂️ Silence Removal · "
                              : "",
                            s != null && s.progressBar
                              ? `⏱️ Progress Bar (${s.progressBarPosition}) · `
                              : "",
                            s != null && s.hasCustomHeaders
                              ? "🏷️ Custom Headers · "
                              : s != null && s.barText
                                ? "🏷️ Title Hook · "
                                : "",
                            s != null && s.musicTrack
                              ? "🎵 Music Added"
                              : "No Music",
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                l.jsxs("div", {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    marginTop: 8,
                    paddingTop: 14,
                    borderTop: "1px solid var(--line)",
                    flexWrap: "wrap",
                  },
                  children: [
                    l.jsx("div", {
                      style: { fontSize: "12.5px", color: "var(--text-dim)" },
                      children:
                        "Ready to generate your short-form clips with the chosen settings above.",
                    }),
                    l.jsxs("button", {
                      type: "button",
                      className: "btn btn-primary",
                      style: {
                        padding: "12px 28px",
                        fontSize: "14.5px",
                        fontWeight: 700,
                        gap: 8,
                        display: "inline-flex",
                        alignItems: "center",
                        borderRadius: "10px",
                      },
                      onClick: i,
                      children: [
                        l.jsx("span", { children: "🚀" }),
                        l.jsx("span", { children: "Start Generation" }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          e &&
            l.jsx("button", {
              className: "btn btn-cancel",
              style: { marginBottom: 14 },
              onClick: a,
              children: "Cancel",
            }),
          t &&
            l.jsxs("div", {
              className: "cc-progress",
              style: { padding: 0 },
              children: [
                l.jsx("div", {
                  className: "steps",
                  children: vc.map(([c, f], v) =>
                    l.jsxs(
                      "div",
                      {
                        className:
                          "step" +
                          (m || v < g ? " done" : v === g ? " active" : ""),
                        children: [
                          l.jsx("div", {
                            className: "ring",
                            children: m || v < g ? "✓" : v + 1,
                          }),
                          l.jsx("div", { className: "lbl", children: f }),
                        ],
                      },
                      c,
                    ),
                  ),
                }),
                l.jsxs("div", {
                  className: "bar-row",
                  children: [
                    l.jsxs("span", {
                      className: "msg",
                      children: [
                        e && l.jsx("span", { className: "spinner" }),
                        t.message,
                      ],
                    }),
                    l.jsx("span", { className: "pct", children: _ }),
                  ],
                }),
                l.jsx("div", {
                  className: "track",
                  children: l.jsx("div", {
                    className: "fill" + (w ? " indeterminate" : ""),
                    style: w ? {} : { width: p + "%" },
                  }),
                }),
              ],
            }),
        ],
      }),
      n.length > 0 &&
        l.jsx("div", {
          className: "card",
          children: l.jsx("div", {
            className: "clips",
            children: n.map((c) =>
              l.jsxs(
                "div",
                {
                  className: "clip",
                  children: [
                    l.jsx(Rf, { src: c.url, filename: c.filename }),
                    l.jsxs("div", {
                      className: "meta",
                      children: [
                        l.jsx("h3", { children: c.title }),
                        l.jsxs("div", {
                          className: "sub",
                          children: [
                            (c.end - c.start).toFixed(1),
                            "s · ",
                            c.start.toFixed(1),
                            "–",
                            c.end.toFixed(1),
                            "s",
                          ],
                        }),
                        l.jsxs("div", {
                          className: "acts",
                          children: [
                            l.jsx("a", {
                              href: c.url,
                              download: c.filename || "",
                              children: "Download",
                            }),
                            l.jsx("button", {
                              type: "button",
                              onClick: () => R(c),
                              title: "Open folder in File Explorer",
                              children: "📁 Folder",
                            }),
                            l.jsxs("button", {
                              onClick: () => u(c),
                              children: [l.jsx(B.crop, {}), " Reframe"],
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                },
                c.index,
              ),
            ),
          }),
        }),
      l.jsxs("div", {
        className: "wizard-nav",
        children: [
          l.jsx("button", {
            className: "btn btn-ghost",
            onClick: o,
            disabled: e,
            children: "← Back",
          }),
          m &&
            n.length > 0 &&
            l.jsx("button", {
              className: "btn btn-primary",
              onClick: d,
              children: "Continue to export →",
            }),
        ],
      }),
    ],
  });
}
function ng({ clips: e, onBack: t, onRestart: n }) {
  const [r, s] = x.useState(null);
  function i() {
    e.forEach((o, d) => {
      setTimeout(() => {
        const g = document.createElement("a");
        ((g.href = o.url),
          (g.download = o.filename || `clip-${d + 1}.mp4`),
          document.body.appendChild(g),
          g.click(),
          g.remove());
      }, d * 400);
    });
  }
  async function a(o) {
    const d = (o.url || "").match(/\/clips\/([0-9a-f]{32})\/(\d+)\.mp4/);
    if (d)
      try {
        await ee.revealClip(d[1], parseInt(d[2], 10));
      } catch {}
  }
  function u(o, d) {
    var m;
    const g = location.origin + d;
    if ((m = navigator.clipboard) != null && m.writeText)
      navigator.clipboard
        .writeText(g)
        .then(() => {
          (s(o), setTimeout(() => s(null), 1500));
        })
        .catch(() => {});
    else {
      const p = document.createElement("input");
      ((p.value = g), document.body.appendChild(p), p.select());
      try {
        (document.execCommand("copy"), s(o), setTimeout(() => s(null), 1500));
      } catch {}
      p.remove();
    }
  }
  return l.jsxs("div", {
    className: "wizard-screen",
    children: [
      l.jsxs("div", {
        className: "card",
        children: [
          l.jsxs("div", {
            className: "card-h",
            children: [
              l.jsxs("h2", {
                children: [
                  "All done — ",
                  e.length,
                  " clip",
                  e.length === 1 ? "" : "s",
                  " ready",
                ],
              }),
              l.jsxs("button", {
                className: "btn btn-primary",
                onClick: i,
                children: [l.jsx(B.download, {}), " Download all"],
              }),
            ],
          }),
          l.jsx("div", {
            className: "clips",
            children: e.map((o) =>
              l.jsxs(
                "div",
                {
                  className: "clip",
                  children: [
                    l.jsx(Rf, { src: o.url, filename: o.filename }),
                    l.jsxs("div", {
                      className: "meta",
                      children: [
                        l.jsx("h3", { children: o.title }),
                        l.jsxs("div", {
                          className: "sub",
                          children: [
                            (o.end - o.start).toFixed(1),
                            "s · ",
                            o.start.toFixed(1),
                            "–",
                            o.end.toFixed(1),
                            "s",
                          ],
                        }),
                        l.jsxs("div", {
                          className: "acts",
                          children: [
                            l.jsx("a", {
                              href: o.url,
                              download: o.filename || "",
                              children: "Download",
                            }),
                            l.jsx("button", {
                              type: "button",
                              onClick: () => a(o),
                              title: "Open folder in File Explorer",
                              children: "📁 Folder",
                            }),
                            l.jsx("button", {
                              type: "button",
                              onClick: () => u(o.index, o.url),
                              children:
                                r === o.index
                                  ? l.jsx(l.Fragment, { children: "✓ Copied!" })
                                  : l.jsxs(l.Fragment, {
                                      children: [
                                        l.jsx(B.link, {}),
                                        " Copy link",
                                      ],
                                    }),
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                },
                o.index,
              ),
            ),
          }),
        ],
      }),
      l.jsxs("div", {
        className: "wizard-nav",
        children: [
          l.jsx("button", {
            className: "btn btn-ghost",
            onClick: t,
            children: "← Back to review",
          }),
          l.jsxs("button", {
            className: "btn btn-primary",
            onClick: n,
            children: [l.jsx(B.bolt, {}), " Create another video"],
          }),
        ],
      }),
    ],
  });
}
function rg(e, t, n = !1) {
  return n
    ? 1080 / 960
    : t === "square"
      ? 1
      : e === "16:9"
        ? 16 / 9
        : e === "4:5"
          ? 4 / 5
          : 9 / 16;
}
function lg({ step: e, setStep: t }) {
  const canvas = x.useContext(CanvasContext);
  x.useEffect(()=>{const reset=()=>Qf();window.addEventListener("clipxy-new-task",reset);return()=>window.removeEventListener("clipxy-new-task",reset)},[]);
  var Ko, Yo;
  const [n, r] = x.useState([]),
    [s, i] = x.useState({ bundled: [], multilingual: [], user: [] }),
    [a, u] = x.useState(["auto"]),
    [o, d] = x.useState("url"),
    [g, m] = x.useState(""),
    [p, w] = x.useState(null),
    [_, N] = x.useState(null),
    [R, h] = x.useState(null),
    c = x.useRef(null),
    f = x.useRef(0),
    [v, j] = x.useState(!1),
    [k, E] = x.useState("9:16"),
    [C, H] = x.useState("crop"),
    [M, F] = x.useState(""),
    [L, y] = x.useState("#FFFFFF"),
    [U, oe] = x.useState("none"),
    [Y, te] = x.useState(3),
    [T, O] = x.useState(null),
    [D, X] = x.useState("auto"),
    [z, I] = x.useState("auto"),
    [W, Z] = x.useState("round"),
    [Q, me] = x.useState(!1),
    [de, ue] = x.useState("subway_surfers"),
    [be, rt] = x.useState("black"),
    [A, se] = x.useState(!0),
    [Kt, Ir] = x.useState(null),
    [an, Yt] = x.useState(""),
    [pt, Qt] = x.useState(null),
    [Ee, ht] = x.useState(!1),
    [kt, er] = x.useState("#FACC15"),
    [lt, Ln] = x.useState("top"),
    [Rt, In] = x.useState(10),
    on = C === "square" ? "1:1" : k;
  function Dn(S) {
    S === "1:1"
      ? (H("square"), me(!1), Z("round"))
      : (H("crop"), E(S), Ml(!1), S !== "9:16" && me(!1), Z("square"));
  }
  const [ne, J] = x.useState([]),
    [Ve, Gt] = x.useState(""),
    [Je, mt] = x.useState(35),
    [st, fe] = x.useState(70),
    [Fe, ye] = x.useState(0),
    [it, Lt] = x.useState(null),
    [pe, Pe] = x.useState({
      enabled: !1,
      text: "Clipxy4all",
      pos_x: 50,
      pos_y: 92,
      size: 34,
      color: "#FFFFFF",
      opacity: 75,
    }),
    Se = (S, V) => Pe((K) => ({ ...K, [S]: V })),
    [Le, oi] = x.useState({
      enabled: !1,
      image_id: null,
      url: null,
      filename: "",
      pos_x: 85,
      pos_y: 15,
      scale: 18,
      opacity: 85,
    }),
    un = (S, V) => oi((K) => ({ ...K, [S]: V })),
    [tr, Pl] = x.useState(!1),
    [Dr, Ml] = x.useState(!1),
    [St, Rl] = x.useState(!0),
    [On, Ll] = x.useState("auto"),
    [Il, b] = x.useState(1),
    [G, ie] = x.useState([
      { id: 1, start: 0, end: 30, title: "Custom Clip 1", header: "" },
    ]),
    [re, je] = x.useState(!1),
    [Ct, It] = x.useState(null),
    [Or, Dl] = x.useState([]),
    [ui, Io] = x.useState(null),
    [Do, _t] = x.useState(""),
    $n = x.useRef(null),
    ci = x.useRef(null),
    Lf = x.useRef(null),
    Oo = x.useRef(!1),
    [di, fi] = x.useState(null),
    $o = x.useRef({}),
    cn = x.useRef(null),
    [Ao, pi] = x.useState(0),
    [hi, Ol] = x.useState(null),
    [If, nr] = x.useState(!0),
    [$l, Uo] = x.useState(!0),
    [mi, rr] = x.useState({
      ready: !1,
      loading: !1,
      segments: [],
      duration: null,
    }),
    gt = Mm(n, s, D),
    Dt = Rm(z, D);
  x.useEffect(() => {
    b((S) => Math.max(S, e));
  }, [e]);
  function Bo() {
    o === "url" && g.trim()
      ? Dt.startUrl(g.trim())
      : o === "upload" &&
        p != null &&
        p.upload_id &&
        Dt.startUpload(p.upload_id);
  }
  (x.useEffect(() => {
    e >= 2 && Bo();
  }, [e >= 2, o, p == null ? void 0 : p.upload_id, g]),
    x.useEffect(
      () => (
        ee
          .captionStyles()
          .then((S) => r(S || []))
          .catch(() => {}),
        ee
          .fonts()
          .then((S) => i(S || { bundled: [], multilingual: [], user: [] }))
          .catch(() => {}),
        ee
          .devices()
          .then((S) => {
            (u(S.devices || ["auto"]), I(S.cuda_available ? "cuda" : "cpu"));
          })
          .catch(() => {}),
        ee
          .music()
          .then((S) => J(S.tracks || []))
          .catch(() => {}),
        () => {
          ((f.current += 1),
            c.current && URL.revokeObjectURL(c.current),
            (c.current = null),
            $n.current && $n.current());
        }
      ),
      [],
    ));
  const Wo = () =>
    ee
      .music()
      .then((S) => J(S.tracks || []))
      .catch(() => {});
  async function Df(S) {
    const V = await ee.uploadMusic(S);
    return (await Wo(), V);
  }
  x.useEffect(() => {
    const S = [
      ...(s.user || []),
      ...(s.multilingual || []),
      ...(s.bundled || []),
    ];
    let V = "";
    S.forEach((ae) => {
      V += `@font-face{font-family:'${ae.family}';src:url('/fonts/${encodeURIComponent(ae.file)}');font-display:swap;}`;
    });
    let K = document.getElementById("cf-fontfaces");
    (K ||
      ((K = document.createElement("style")),
      (K.id = "cf-fontfaces"),
      document.head.appendChild(K)),
      (K.textContent = V));
  }, [s]);
  const lr = o === "url" && Dt.downloadUrl === g.trim() ? Dt.downloadId : null,
    $r = x.useMemo(
      () =>
        o === "upload"
          ? R
            ? { kind: "video", src: R }
            : null
          : lr
            ? { kind: "video", src: `/api/download/${lr}/video` }
            : Fm(g.trim()),
      [o, R, g, lr],
    ),
    dn = (o === "upload" ? (p == null ? void 0 : p.upload_id) : lr) || null;
  (x.useEffect(() => {
    if (!dn) {
      Lt(null);
      return;
    }
    let S = !0;
    return (
      ee
        .musicSuggest(dn, D === "auto" ? null : D)
        .then((V) => {
          S && V && V.ready && Lt(V);
        })
        .catch(() => {}),
      () => {
        S = !1;
      }
    );
  }, [dn, D, (Ko = Dt.prep) == null ? void 0 : Ko.phase]),
    x.useEffect(() => {
      if (!dn) {
        rr({ ready: !1, loading: !1, segments: [], duration: null });
        return;
      }
      let S = !0;
      return (
        rr((V) => ({ ...V, loading: !0 })),
        ee
          .transcript(dn, D === "auto" ? null : D)
          .then((V) => {
            S &&
              rr({
                ready: !!V.ready,
                loading: !1,
                segments: V.segments || [],
                duration: V.duration ?? null,
              });
          })
          .catch(() => {
            S && rr((V) => ({ ...V, loading: !1 }));
          }),
        () => {
          S = !1;
        }
      );
    }, [dn, D, (Yo = Dt.prep) == null ? void 0 : Yo.phase]));
  const Al = (S) => {
      S != null &&
        S.target &&
        (pi(S.target.currentTime),
        isFinite(S.target.duration) &&
          S.target.duration > 0 &&
          !hi &&
          Ol(S.target.duration));
    },
    fn = (S) => {
      if (S != null && S.target) {
        const V = S.target.duration;
        isFinite(V) && V > 0 && Ol(V);
      }
    },
    Ul = () => nr(!0),
    Bl = () => nr(!1);
  function Of() {
    const S = cn.current;
    S && (S.paused ? (S.play().catch(() => {}), nr(!0)) : (S.pause(), nr(!1)));
  }
  function $f() {
    const S = cn.current;
    S && ((S.muted = !S.muted), Uo(S.muted));
  }
  function Ho(S) {
    if (S == null || !isFinite(S)) return;
    const V = cn.current;
    if (V)
      try {
        V.currentTime = Math.max(0, S);
      } catch {}
    pi(S);
  }
  x.useEffect(() => {
    const S = cn.current;
    if (!S) return;
    const V = () => pi(S.currentTime),
      K = () => {
        isFinite(S.duration) && S.duration > 0 && Ol(S.duration);
      },
      ae = () => nr(!S.paused);
    return (
      S.addEventListener("timeupdate", V),
      S.addEventListener("loadedmetadata", K),
      S.addEventListener("durationchange", K),
      S.addEventListener("play", ae),
      S.addEventListener("pause", ae),
      S.readyState >= 1 &&
        isFinite(S.duration) &&
        S.duration > 0 &&
        Ol(S.duration),
      nr(!S.paused),
      Uo(S.muted),
      () => {
        (S.removeEventListener("timeupdate", V),
          S.removeEventListener("loadedmetadata", K),
          S.removeEventListener("durationchange", K),
          S.removeEventListener("play", ae),
          S.removeEventListener("pause", ae));
      }
    );
  }, [$r, e, Q]);
  async function Vo(S) {
    const V = ++f.current;
    if ((c.current && URL.revokeObjectURL(c.current), (c.current = null), !S)) {
      (d("url"), w(null), N(null), h(null));
      return;
    }
    (d("upload"),
      w(null),
      N(0),
      _t(""),
      (c.current = URL.createObjectURL(S)),
      h(c.current));
    try {
      const K = await ee.upload(S, (ae) => {
        V === f.current && N(ae);
      });
      if (V !== f.current) return;
      (w({ upload_id: K.upload_id, filename: K.filename || S.name }), N(null));
    } catch (K) {
      if (V !== f.current) return;
      (_t(K.message), N(null));
    }
  }
  async function Af(S) {
    const V = await ee.uploadFont(S),
      K = await ee.fonts();
    return (i(K), V.family);
  }
  function Uf(S) {
    (X(S), gt.onLanguageChange(S), Dt.relang(S));
  }
  const Ar = o === "upload" ? !!p : !!g.trim(),
    gi = x.useMemo(
      () =>
        o === "upload" && _ != null && !p
          ? {
              phase: "downloading",
              pct: _ > 0 && _ < 100 ? _ : null,
              message:
                _ >= 100 ? "Processing upload…" : "Uploading your video…",
            }
          : Dt.prep,
      [o, _, p, Dt.prep],
    );
  async function Bf(S, V) {
    const K = (mi.segments || []).map((ae) =>
      ae.id === S ? { ...ae, text: V } : ae,
    );
    if ((rr((ae) => ({ ...ae, segments: K })), dn))
      try {
        const ae = await ee.updateTranscript(dn, K, D === "auto" ? null : D);
        ae &&
          ae.transcript &&
          rr((sr) => ({
            ...sr,
            segments: ae.transcript.segments || K,
            words: ae.transcript.words || sr.words,
          }));
      } catch (ae) {
        console.error("Failed to update transcript on server:", ae);
      }
  }
  async function Wf() {
    _t("");
    const S = {
      aspect_ratio: k,
      fit_mode: C,
      video_background: canvas.color,
      bar_text: !Q && M.trim() ? M.trim() : null,
      bar_text_color: L,
      bar_text_anim: U,
      num_clips: Y,
      device: z,
      caption_style: gt.styleId,
      language: D === "auto" ? null : D,
      square_corners: W,
      remove_empty_air: tr,
      face_tracking: C === "square" && Dr,
      captions_enabled: St,
      split_screen: Q,
      split_broll: de,
      split_divider: be,
      split_face_tracking: A,
      custom_broll_id: de === "custom" ? Kt : null,
      progress_bar: Ee,
      progress_bar_color: kt,
      progress_bar_position: lt,
      progress_bar_height: Rt,
    };
    if (On === "custom") {
      const V = G.filter((K) => parseFloat(K.end) > parseFloat(K.start)).map(
        (K, ae) => ({
          start: Math.max(0, parseFloat(K.start)),
          end: Math.max(0.5, parseFloat(K.end)),
          title: (K.title || "").trim() || `Custom Clip ${ae + 1}`,
          header: (K.header || "").trim() || null,
        }),
      );
      if (!V.length) {
        _t(
          "Please define at least one valid custom clip range with End > Start.",
        );
        return;
      }
      S.custom_clips = V;
    } else T != null && (S.clip_length = T);
    if (
      (Object.keys(gt.overrides).length && (S.caption_overrides = gt.overrides),
      zm(gt.cinematic) && (S.cinematic = gt.cinematic),
      Ve &&
        ((S.music_track = Ve),
        (S.music_volume = Je),
        (S.music_duck = st),
        (S.music_start = Fe)),
      pe.enabled && (pe.text || "").trim() && (S.signature = pe),
      C === "square" &&
        Le.enabled &&
        Le.image_id &&
        (S.image_watermark = {
          enabled: !0,
          image_id: Le.image_id,
          pos_x: Le.pos_x,
          pos_y: Le.pos_y,
          scale: Le.scale,
          opacity: Le.opacity,
        }),
      o === "upload")
    ) {
      if (!p) {
        _t("Wait for the upload to finish.");
        return;
      }
      ((S.upload_id = p.upload_id), (S.upload_name = p.filename));
    } else {
      if (!g.trim()) {
        _t("Paste a video URL.");
        return;
      }
      ((S.video_url = g.trim()), lr && (S.download_id = lr));
    }
    (je(!0),
      Dl([]),
      It({
        stage: "queued",
        progress: 0.02,
        message: "Starting…",
        status: "running",
      }));
    try {
      const { job_id: V } = await ee.generate(S);
      window.dispatchEvent(new Event("clipxy-job-submitted"));
      ((ci.current = V),
        ($n.current = Nm(
          V,
          (K) => {
            (It(K),
              K.clips && Dl(K.clips),
              K.clip_id && Io(K.clip_id),
              (K.status === "done" ||
                K.status === "error" ||
                K.status === "cancelled") &&
                (je(!1),
                K.status === "error" &&
                  _t(K.error || K.message || "Pipeline failed."),
                $n.current && $n.current()));
          },
          () => {
            (je(!1), _t("Lost connection to the progress stream."));
          },
        )));
    } catch (V) {
      (je(!1), _t(V.message));
    }
  }
  function Hf() {
    (ci.current && ee.cancel(ci.current).catch(() => {}),
      $n.current && $n.current(),
      je(!1),
      It(null),
      _t(""),
      (Oo.current = !1));
  }
  function Vf(S) {
    fi(S);
  }
  function Kf() {
    fi(null);
  }
  function Yf(S, V, K) {
    (($o.current[`${ui}:${S}`] = K),
      Dl((ae) => ae.map((sr) => (sr.index === S ? { ...sr, url: V } : sr))),
      fi(null));
  }
  function Qf() {
    if($n.current){$n.current();$n.current=null;}
    ci.current=null;je(false);canvas.setColor("black");
    ((f.current += 1),
      t(1),
      b(1),
      d("url"),
      m(""),
      w(null),
      N(null),
      c.current && URL.revokeObjectURL(c.current),
      (c.current = null),
      h(null),
      Dl([]),
      It(null),
      _t(""),
      Io(null),
      Rl(!0),
      (Oo.current = !1),
      Dt.reset());
  }
  if (di) {
    const S = `${ui}:${di.index}`;
    return l.jsx(Im, {
      clipId: ui,
      clip: di,
      targetAspect: rg(k, C, Q),
      initialKeyframes: $o.current[S],
      onClose: Kf,
      onSaved: Yf,
    });
  }
  const Gf = e >= 2 && e <= 7;
  return l.jsxs(l.Fragment, {
    children: [
      re && l.jsx("button",{className:"btn btn-secondary clipxy-new-video",onClick:Qf,children:"+ New video — keep processing in background"}),
      e === 2 && l.jsx(CanvasControl,{}),
      e === 1 &&
        l.jsx(Dm, {
          source: o,
          setSource: d,
          url: g,
          setUrl: m,
          upload: p,
          upPct: _,
          drag: v,
          setDrag: j,
          fileRef: Lf,
          doUpload: Vo,
          onClear: () => Vo(null),
          sourceReady: Ar,
          error: Do,
          onContinue: () => {
            (Bo(), t(2));
          },
          captionsEnabled: St,
          setCaptionsEnabled: Rl,
        }),
      e === 2 &&
        l.jsx(Bm, {
          media: $r,
          sourceReady: Ar,
          prepView: gi,
          outputAspect: on,
          setOutputAspect: Dn,
          squareCorners: W,
          setSquareCorners: Z,
          barText: M,
          setBarText: F,
          barTextColor: L,
          setBarTextColor: y,
          barTextAnim: U,
          setBarTextAnim: oe,
          language: D,
          changeLanguage: Uf,
          device: z,
          setDevice: I,
          devices: a,
          numClips: Y,
          setNumClips: te,
          clipLen: T,
          setClipLen: O,
          removeEmptyAir: tr,
          setRemoveEmptyAir: Pl,
          faceTracking: Dr,
          setFaceTracking: Ml,
          clipMode: On,
          setClipMode: Ll,
          customClips: G,
          setCustomClips: ie,
          curTime: Ao,
          vidDuration: hi,
          seekTo: Ho,
          isPlaying: If,
          togglePlay: Of,
          isMuted: $l,
          toggleMute: $f,
          transcript: mi,
          onTimeUpdate: Al,
          onLoadedMetadata: fn,
          onDurationChange: fn,
          onPlay: Ul,
          onPause: Bl,
          studio: gt,
          fonts: s,
          aspect: k,
          fit: C,
          signature: pe,
          setSig: Se,
          videoRef: cn,
          onBack: () => t(1),
          onNext: () => t(St ? 3 : 4),
          nextEnabled: !["downloading", "idle", "error"].includes(gi.phase),
          captionsEnabled: St,
          splitScreen: Q,
          setSplitScreen: me,
          splitBroll: de,
          setSplitBroll: ue,
          splitDivider: be,
          setSplitDivider: rt,
          splitFaceTracking: A,
          setSplitFaceTracking: se,
          customBrollId: Kt,
          setCustomBrollId: Ir,
          customBrollName: an,
          setCustomBrollName: Yt,
          customBrollPreviewUrl: pt,
          setCustomBrollPreviewUrl: Qt,
          imageWatermark: Le,
          setImageWatermark: un,
        }),
      (() => {
        var V, K;
        const S =
          On === "custom" &&
          G &&
          (V = G[0]) != null &&
          V.header &&
          typeof G[0].header == "string" &&
          G[0].header.trim()
            ? G[0].header
            : M;
        return l.jsxs(l.Fragment, {
          children: [
            e === 3 &&
              l.jsx(Ym, {
                studio: gt,
                language: D,
                onFontUpload: Af,
                media: $r,
                prepView: gi,
                sourceReady: Ar,
                transcript: mi,
                curTime: Ao,
                seekTo: Ho,
                videoRef: cn,
                duration: hi,
                aspect: k,
                fit: C,
                squareCorners: W,
                barText: S,
                barTextColor: L,
                barTextAnim: U,
                signature: pe,
                setSig: Se,
                imageWatermark: Le,
                setImageWatermark: un,
                onBack: () => t(2),
                onNext: () => t(4),
                onEditSegment: Bf,
                splitScreen: Q,
                splitDivider: be,
                splitBroll: de,
                customBrollPreviewUrl: pt,
                progressBar: Ee,
                progressBarColor: kt,
                progressBarPosition: lt,
                progressBarHeight: Rt,
                onTimeUpdate: Al,
                onLoadedMetadata: fn,
                onDurationChange: fn,
                onPlay: Ul,
                onPause: Bl,
                isMuted: $l,
              }),
            e === 4 &&
              l.jsx(Jm, {
                studio: gt,
                language: D,
                media: $r,
                sourceReady: Ar,
                aspect: k,
                fit: C,
                squareCorners: W,
                barText: S,
                barTextColor: L,
                barTextAnim: U,
                signature: pe,
                setSig: Se,
                videoRef: cn,
                imageWatermark: Le,
                setImageWatermark: un,
                onSwitchToSquare: () => Dn("1:1"),
                onBack: () => t(St ? 3 : 2),
                onNext: () => t(5),
                captionsEnabled: St,
                splitScreen: Q,
                splitDivider: be,
                splitBroll: de,
                customBrollPreviewUrl: pt,
                progressBar: Ee,
                setProgressBar: ht,
                progressBarColor: kt,
                setProgressBarColor: er,
                progressBarPosition: lt,
                setProgressBarPosition: Ln,
                progressBarHeight: Rt,
                setProgressBarHeight: In,
                onTimeUpdate: Al,
                onLoadedMetadata: fn,
                onDurationChange: fn,
                onPlay: Ul,
                onPause: Bl,
                isMuted: $l,
              }),
            e === 5 &&
              l.jsx(eg, {
                tracks: ne,
                musicTrack: Ve,
                musicVolume: Je,
                musicDuck: st,
                musicStart: Fe,
                musicSuggest: it,
                onTrack: (ae) => {
                  (Gt(ae), ye(0));
                },
                onVolume: mt,
                onDuck: fe,
                onStart: ye,
                onMusicUpload: Df,
                onRefreshMusic: Wo,
                studio: gt,
                language: D,
                media: $r,
                sourceReady: Ar,
                aspect: k,
                fit: C,
                squareCorners: W,
                barText: S,
                barTextColor: L,
                barTextAnim: U,
                signature: pe,
                setSig: Se,
                videoRef: cn,
                imageWatermark: Le,
                setImageWatermark: un,
                onBack: () => t(4),
                onNext: () => t(6),
                captionsEnabled: St,
                splitScreen: Q,
                splitDivider: be,
                splitBroll: de,
                customBrollPreviewUrl: pt,
                progressBar: Ee,
                progressBarColor: kt,
                progressBarPosition: lt,
                progressBarHeight: Rt,
                onTimeUpdate: Al,
                onLoadedMetadata: fn,
                onDurationChange: fn,
                onPlay: Ul,
                onPause: Bl,
                isMuted: $l,
              }),
            e === 6 &&
              l.jsx(tg, {
                busy: re,
                snap: Ct,
                clips: Or,
                error: Do,
                onStartGenerate: Wf,
                onCancel: Hf,
                onOpenReframe: Vf,
                onBack: () => t(5),
                onNext: () => t(7),
                summary: {
                  splitScreen: Q,
                  splitBroll: de,
                  splitDivider: be,
                  splitFaceTracking: A,
                  customBrollName: an,
                  outputAspect: on,
                  squareCorners: W,
                  barText: M,
                  clipMode: On,
                  customClips: G,
                  numClips: Y,
                  clipLen: T,
                  hasCustomHeaders:
                    On === "custom" &&
                    G.some((ae) => (ae.header || "").trim().length > 0),
                  styleName:
                    ((K = gt.cfg) == null ? void 0 : K.label) || gt.styleId,
                  language: D,
                  captionsEnabled: St,
                  musicTrack: Ve,
                  removeEmptyAir: tr,
                  progressBar: Ee,
                  progressBarColor: kt,
                  progressBarPosition: lt,
                },
              }),
          ],
        });
      })(),
      e === 7 && l.jsx(ng, { clips: Or, onBack: () => t(6), onRestart: Qf }),
      Gf &&
        l.jsx("div", {
          className: "wizard-steps wizard-steps-bottom",
          children: (St
            ? [
                { n: 2, label: "Settings" },
                { n: 3, label: "Captions" },
                { n: 4, label: "Effects" },
                { n: 5, label: "Music" },
                { n: 6, label: "Review" },
                { n: 7, label: "Export" },
              ]
            : [
                { n: 2, label: "Settings" },
                { n: 4, label: "Effects" },
                { n: 5, label: "Music" },
                { n: 6, label: "Review" },
                { n: 7, label: "Export" },
              ]
          ).map((S, V) =>
            l.jsxs(
              "button",
              {
                type: "button",
                className:
                  "wizard-step" +
                  (e === S.n ? " active" : e > S.n ? " done" : ""),
                disabled:
                  re ||
                  S.n > Il ||
                  (S.n === 7 &&
                    !(
                      (Ct == null ? void 0 : Ct.status) === "done" &&
                      Or.length > 0
                    )),
                onClick: () => t(S.n),
                title: `Jump to ${S.label}`,
                children: [
                  l.jsx("span", {
                    className: "wizard-step-dot",
                    children: e > S.n ? "✓" : V + 1,
                  }),
                  l.jsx("span", {
                    className: "wizard-step-lbl",
                    children: S.label,
                  }),
                ],
              },
              S.label,
            ),
          ),
        }),
    ],
  });
}
function sg(e) {
  if (e.source_type === "upload") return e.source || "Uploaded video";
  const t = e.source || "";
  let n = t.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  if (n) return "YouTube · " + n[1];
  try {
    return new URL(t).hostname.replace(/^www\./, "");
  } catch {
    return t || "Video";
  }
}
function ig() {
  const [e, t] = x.useState([]),
    [n, r] = x.useState(!0),
    s = () =>
      ee
        .history()
        .then((d) => t(Array.isArray(d) ? d : []))
        .catch(() => t([]))
        .finally(() => r(!1));
  x.useEffect(() => {
    s();
  }, []);
  const i = e.flatMap((d) => (d.clips || []).map((g) => ({ ...g, entry: d }))),
    a = i.length;
  async function u(d, g) {
    const m = (g.url || "").match(/\/clips\/([0-9a-f]{32})\/(\d+)\.mp4/);
    if (m && confirm("Delete this clip from disk?"))
      try {
        (await ee.deleteClip(m[1], +m[2])) && s();
      } catch (p) {
        alert(p.message || "Could not delete this clip.");
      }
  }
  async function o(d) {
    const g = (d.url || "").match(/\/clips\/([0-9a-f]{32})\/(\d+)\.mp4/);
    if (g)
      try {
        await ee.revealClip(g[1], +g[2]);
      } catch {}
  }
  return n
    ? l.jsx("div", { className: "empty", children: "Loading…" })
    : l.jsxs(l.Fragment, {
        children: [
          l.jsxs("div", {
            className: "kpis",
            children: [
              l.jsxs("div", {
                className: "kpi",
                children: [
                  l.jsx("div", { className: "v", children: e.length }),
                  l.jsx("div", {
                    className: "k",
                    children: "Videos processed",
                  }),
                ],
              }),
              l.jsxs("div", {
                className: "kpi",
                children: [
                  l.jsx("div", { className: "v", children: a }),
                  l.jsx("div", { className: "k", children: "Clips generated" }),
                ],
              }),
              l.jsxs("div", {
                className: "kpi",
                children: [
                  l.jsx("div", {
                    className: "v",
                    children: e.filter((d) => d.source_type === "upload")
                      .length,
                  }),
                  l.jsx("div", { className: "k", children: "Uploads" }),
                ],
              }),
            ],
          }),
          l.jsxs("div", {
            className: "card-h",
            style: { marginBottom: 6 },
            children: [
              l.jsx("h2", {
                style: { fontSize: 15, fontWeight: 700, margin: 0 },
                children: "All clips",
              }),
              l.jsxs("div", {
                style: { display: "flex", gap: 8, alignItems: "center" },
                children: [
                  l.jsxs("button", {
                    className: "btn btn-ghost",
                    onClick: async () => {
                      if (
                        confirm(`Clear downloaded source videos and temporary cache files?

Your finished clips in this Library are safe and will NOT be deleted.`)
                      )
                        try {
                          const g = (
                            (await ee.clearCache()).freed_bytes /
                            (1024 * 1024)
                          ).toFixed(1);
                          alert(`Freed ${g} MB of source video downloads!`);
                        } catch (d) {
                          alert("Could not clear cache: " + d.message);
                        }
                    },
                    title: "Clean up source video downloads and temp cache",
                    children: [l.jsx(B.trash, {}), " Clear Cache"],
                  }),
                  l.jsxs("button", {
                    className: "btn btn-ghost",
                    onClick: s,
                    children: [l.jsx(B.refresh, {}), " Refresh"],
                  }),
                ],
              }),
            ],
          }),
          a === 0
            ? l.jsxs("div", {
                className: "empty",
                children: [
                  "No clips yet — head to ",
                  l.jsx("b", { children: "Create" }),
                  " and generate your first short.",
                ],
              })
            : l.jsx("div", {
                className: "clips",
                children: i.map((d) => {
                  var g, m;
                  return l.jsxs(
                    "div",
                    {
                      className: "clip",
                      children: [
                        l.jsx("video", {
                          src: d.url,
                          controls: !0,
                          preload: "metadata",
                        }),
                        l.jsxs("div", {
                          className: "meta",
                          children: [
                            l.jsxs("div", {
                              style: {
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                flexWrap: "wrap",
                              },
                              children: [
                                l.jsx("h3", {
                                  style: { margin: 0 },
                                  children: d.title || `Clip ${d.index + 1}`,
                                }),
                                ((m =
                                  (g = d.entry) == null
                                    ? void 0
                                    : g.settings) == null
                                  ? void 0
                                  : m.aspect_ratio) &&
                                  l.jsx("span", {
                                    style: {
                                      fontSize: "11px",
                                      fontWeight: 700,
                                      padding: "2px 6px",
                                      borderRadius: 4,
                                      background:
                                        "var(--surface-3, rgba(255,255,255,0.08))",
                                      color: "var(--text-dim, #999)",
                                    },
                                    children:
                                      d.entry.settings.fit_mode === "square"
                                        ? "📱 Square Reel · 9:16"
                                        : d.entry.settings.aspect_ratio ===
                                            "9:16"
                                          ? "📱 9:16"
                                          : d.entry.settings.aspect_ratio,
                                  }),
                              ],
                            }),
                            l.jsx("div", {
                              className: "sub",
                              children: sg(d.entry),
                            }),
                            l.jsxs("div", {
                              className: "acts",
                              children: [
                                l.jsx("a", {
                                  href: d.url,
                                  download: d.filename || "",
                                  children: "Download",
                                }),
                                l.jsx("button", {
                                  type: "button",
                                  onClick: () => o(d),
                                  title: "Open folder in File Explorer",
                                  children: "📁 Folder",
                                }),
                                l.jsx("button", {
                                  type: "button",
                                  onClick: () => u(d.entry, d),
                                  children: "Delete",
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    },
                    d.url,
                  );
                }),
              }),
        ],
      });
}
function ag() {
  const [e, t] = x.useState(null),
    [n, r] = x.useState(null),
    [s, i] = x.useState(!1),
    [a, u] = x.useState("");
  x.useEffect(() => {
    (ee
      .devices()
      .then(t)
      .catch(() => t({ devices: [], cuda_available: !1 })),
      ee
        .cacheInfo()
        .then(r)
        .catch(() => r(null)));
  }, []);
  const o = (g) => {
      if (!g || g <= 0) return "0 MB";
      const m = g / (1024 * 1024);
      return m < 1024 ? `${m.toFixed(1)} MB` : `${(m / 1024).toFixed(2)} GB`;
    },
    d = async () => {
      if (
        window.confirm(`Clear downloaded source videos and temporary cache files?

Your finished clips in the Library are safe and will not be touched.`)
      ) {
        (i(!0), u(""));
        try {
          const m = (
            (await ee.clearCache()).freed_bytes /
            (1024 * 1024)
          ).toFixed(1);
          u(`Freed ${m} MB of disk space!`);
          const p = await ee.cacheInfo().catch(() => null);
          r(p);
        } catch (g) {
          u("Could not clear cache: " + g.message);
        } finally {
          i(!1);
        }
      }
    };
  return l.jsxs("div", {
    style: { display: "flex", flexDirection: "column", gap: 20, maxWidth: 560 },
    children: [
      l.jsxs("div", {
        className: "card",
        children: [
          l.jsx("div", {
            className: "card-h",
            children: l.jsx("h2", { children: "Compute & Hardware" }),
          }),
          e
            ? l.jsxs(l.Fragment, {
                children: [
                  l.jsxs("div", {
                    className: "row",
                    style: {
                      justifyContent: "space-between",
                      padding: "10px 0",
                      borderBottom: "1px solid var(--line)",
                    },
                    children: [
                      l.jsx("span", {
                        className: "note",
                        style: { margin: 0 },
                        children: "GPU (CUDA)",
                      }),
                      l.jsx("b", {
                        children: e.cuda_available
                          ? e.gpu_name || "Available"
                          : "Not available",
                      }),
                    ],
                  }),
                  l.jsxs("div", {
                    className: "row",
                    style: {
                      justifyContent: "space-between",
                      padding: "10px 0",
                      borderBottom: "1px solid var(--line)",
                    },
                    children: [
                      l.jsx("span", {
                        className: "note",
                        style: { margin: 0 },
                        children: "Active device",
                      }),
                      l.jsx("b", {
                        children: (e.default || "—").toUpperCase(),
                      }),
                    ],
                  }),
                  l.jsxs("div", {
                    className: "row",
                    style: {
                      justifyContent: "space-between",
                      padding: "10px 0",
                    },
                    children: [
                      l.jsx("span", {
                        className: "note",
                        style: { margin: 0 },
                        children: "Available",
                      }),
                      l.jsx("b", {
                        children:
                          (e.devices || [])
                            .map((g) => g.toUpperCase())
                            .join(" · ") || "—",
                      }),
                    ],
                  }),
                  l.jsx("div", {
                    className: "note",
                    style: { marginTop: 16 },
                    children:
                      "Everything runs locally — yt-dlp downloads, faster-whisper transcribes, and ffmpeg renders. No video or audio leaves this machine.",
                  }),
                ],
              })
            : l.jsx("div", { className: "note", children: "Checking…" }),
        ],
      }),
      l.jsxs("div", {
        className: "card",
        children: [
          l.jsx("div", {
            className: "card-h",
            children: l.jsx("h2", { children: "Storage & Cache" }),
          }),
          n
            ? l.jsxs(l.Fragment, {
                children: [
                  l.jsxs("div", {
                    className: "row",
                    style: {
                      justifyContent: "space-between",
                      padding: "10px 0",
                      borderBottom: "1px solid var(--line)",
                    },
                    children: [
                      l.jsx("span", {
                        className: "note",
                        style: { margin: 0 },
                        children: "Source Video Downloads",
                      }),
                      l.jsx("b", { children: o(n.downloads_bytes) }),
                    ],
                  }),
                  l.jsxs("div", {
                    className: "row",
                    style: {
                      justifyContent: "space-between",
                      padding: "10px 0",
                      borderBottom: "1px solid var(--line)",
                    },
                    children: [
                      l.jsx("span", {
                        className: "note",
                        style: { margin: 0 },
                        children: "Temporary Work Files",
                      }),
                      l.jsx("b", { children: o(n.temp_bytes) }),
                    ],
                  }),
                  l.jsxs("div", {
                    className: "row",
                    style: {
                      justifyContent: "space-between",
                      padding: "10px 0",
                    },
                    children: [
                      l.jsx("span", {
                        className: "note",
                        style: { margin: 0 },
                        children: "Total Recoverable Cache",
                      }),
                      l.jsx("b", {
                        style: { color: "var(--primary)" },
                        children: o(n.total_bytes),
                      }),
                    ],
                  }),
                  l.jsxs("div", {
                    className: "note",
                    style: { marginTop: 12, marginBottom: 16 },
                    children: [
                      "Clearing cache removes downloaded YouTube/uploaded source videos and temp slices. Your finished clips in ",
                      l.jsx("b", { children: "Library" }),
                      " are always preserved.",
                    ],
                  }),
                  l.jsxs("div", {
                    className: "row",
                    style: {
                      justifyContent: "space-between",
                      alignItems: "center",
                    },
                    children: [
                      l.jsxs("button", {
                        className: "btn btn-secondary",
                        onClick: d,
                        disabled: s || !n || n.total_bytes === 0,
                        style: {
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                        },
                        children: [
                          l.jsx(B.trash, { style: { width: 16, height: 16 } }),
                          s ? "Clearing..." : "Clear Source Cache",
                        ],
                      }),
                      a &&
                        l.jsxs("span", {
                          style: {
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "var(--ok, #22c55e)",
                          },
                          children: ["✓ ", a],
                        }),
                    ],
                  }),
                ],
              })
            : l.jsx("div", {
                className: "note",
                children: "Scanning storage…",
              }),
        ],
      }),
    ],
  });
}
const og = [
    { id: "create", label: "Create", icon: B.create },
    { id: "library", label: "Library", icon: B.library },
    { id: "settings", label: "Settings", icon: B.settings },
  ],
  ug = {
    create: {
      h: "Create clips",
      sub: "Turn any video into captioned vertical shorts",
    },
    library: { h: "Library", sub: "Every clip you've generated" },
    settings: { h: "Settings", sub: "Compute device & environment" },
  },
  cg = [
    { id: "dark", label: "Dark" },
    { id: "light", label: "Light" },
  ];
function dg({ status: e, onRetry: t, retrying: n }) {
  const [r, s] = x.useState(0);
  x.useEffect(() => {
    const u = setInterval(() => s((o) => o + 1), 1e3);
    return () => clearInterval(u);
  }, []);
  const i = e.progress > 0 ? Math.round(e.progress * 100) : null,
    a = e.status === "error";
  return l.jsxs("div", {
    className: "model-splash",
    children: [
      l.jsx("div", {
        className: "model-splash-mark",
        children: l.jsx("img", { src: Hs, alt: "Clipxy4all" }),
      }),
      l.jsx("div", { className: "model-splash-title", children: "Clipxy4all" }),
      a
        ? l.jsxs(l.Fragment, {
            children: [
              l.jsx("div", {
                className: "model-splash-msg",
                style: { color: "var(--danger)" },
                children: "Could not start the AI engine.",
              }),
              l.jsx("div", {
                className: "model-splash-detail",
                children: e.message,
              }),
              l.jsx("button", {
                className: "btn btn-primary",
                style: { marginTop: 16 },
                onClick: t,
                disabled: n,
                children: n ? "Retrying…" : "Retry AI engine",
              }),
            ],
          })
        : l.jsxs(l.Fragment, {
            children: [
              l.jsx("div", {
                className: "model-splash-msg",
                children: e.message || "Starting up…",
              }),
              l.jsx("div", {
                className: "track model-splash-track",
                children: l.jsx("div", {
                  className: "fill" + (i == null ? " indeterminate" : ""),
                  style: i == null ? {} : { width: i + "%" },
                }),
              }),
              l.jsxs("div", {
                style: {
                  width: 260,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 8,
                  fontSize: "12px",
                  color: "var(--muted-2)",
                },
                children: [
                  l.jsxs("span", { children: ["⚡ Initializing (", r, "s)"] }),
                  l.jsx("span", {
                    style: { fontWeight: 600, color: "var(--primary)" },
                    children: "Loading local AI model",
                  }),
                ],
              }),
            ],
          }),
    ],
  });
}
function Yi({ theme: e, setTheme: t, fixed: n }) {
  return l.jsx("div", {
    className: "theme-switch" + (n ? " theme-switch-fixed" : ""),
    role: "group",
    "aria-label": "Theme",
    children: cg.map((r) =>
      l.jsx(
        "button",
        {
          className: e === r.id ? "active" : "",
          onClick: () => t(r.id),
          title: `${r.label} theme`,
          children: r.label,
        },
        r.id,
      ),
    ),
  });
}
export const CanvasContext = x.createContext({color:"black",setColor:()=>{}});
export {x as React, Sm as captionSample};
function fg() {
  const [e, t] = x.useState("create"),
    [n, r] = x.useState(1),
    [s, i] = x.useState(null),
    [a, u] = x.useState(null),
    [o, d] = x.useState(!1),
    [g, m] = x.useState(() => {
      try {
        return localStorage.getItem("cf-theme") || "dark";
      } catch {
        return "dark";
      }
    }),
    [p, w] = x.useState({ status: "idle", message: "", progress: null }),
    [_, N] = x.useState(0),
    [R, h] = x.useState(!1),
    [c, f] = x.useState(!1),
    [v, j] = x.useState(!1),
    k = async () => {
      (f(!1), j(!0));
      try {
        await ee.shutdown();
      } catch {}
      setTimeout(() => {
        try {
          window.close();
        } catch {}
      }, 1800);
    },
    E = async () => {
      (h(!0),
        w({
          status: "loading",
          message: "Retrying local AI model…",
          progress: 0,
        }));
      try {
        const F = await ee.retryModel();
        (w(F), N((L) => L + 1));
      } catch (F) {
        w({
          status: "error",
          message: F.message || "Could not retry the AI engine.",
          progress: null,
        });
      } finally {
        h(!1);
      }
    };
  (x.useEffect(() => {
    let F = !0,
      L;
    async function y() {
      try {
        const U = await ee.modelStatus();
        if (!F || (w(U), U.status === "ready" || U.status === "error")) return;
      } catch {}
      F && (L = setTimeout(y, 1e3));
    }
    return (
      y(),
      () => {
        ((F = !1), clearTimeout(L));
      }
    );
  }, [_]),
    x.useEffect(() => {
      const F = document.documentElement;
      g === "dark"
        ? F.removeAttribute("data-theme")
        : F.setAttribute("data-theme", g);
      try {
        localStorage.setItem("cf-theme", g);
      } catch {}
    }, [g]),
    x.useEffect(() => {
      let F = !0;
      const L = () =>
        ee
          .health()
          .then((U) => {
            F && (u(!0), i(U.device));
          })
          .catch(() => {
            F && u(!1);
          });
      L();
      const y = setInterval(L, 8e3);
      return () => {
        ((F = !1), clearInterval(y));
      };
    }, []));
  const C = e === "create" && n === 1,
    H = ug[e],
    M = (F) => {
      (t(F), d(!1));
    };
  return v
    ? l.jsx("div", {
        className: "shell is-landing",
        style: {
          display: "grid",
          placeItems: "center",
          minHeight: "100vh",
          padding: 20,
        },
        children: l.jsxs("div", {
          className: "card",
          style: {
            maxWidth: 460,
            textAlign: "center",
            padding: "40px 24px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
          },
          children: [
            l.jsx("div", {
              style: { width: 68, height: 68, margin: "0 auto 16px" },
              children: l.jsx("img", {
                src: Hs,
                alt: "Clipxy4all",
                style: {
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  opacity: 0.7,
                },
              }),
            }),
            l.jsx("h2", {
              style: { fontSize: "1.4rem", fontWeight: 800, marginBottom: 10 },
              children: "Clipxy4all is Stopped",
            }),
            l.jsxs("p", {
              className: "note",
              style: { fontSize: "0.95rem", lineHeight: 1.6, marginBottom: 24 },
              children: [
                "The background AI server has completely shut down and all memory has been freed.",
                l.jsx("br", {}),
                "You can safely close this browser window.",
              ],
            }),
            l.jsx("button", {
              className: "btn btn-secondary",
              onClick: () => window.close(),
              children: "Close Browser Window",
            }),
          ],
        }),
      })
    : p.status !== "ready"
      ? l.jsxs("div", {
          className: "shell is-landing" + (o ? " nav-open" : ""),
          children: [
            l.jsx(Yi, { theme: g, setTheme: m, fixed: !0 }),
            l.jsx("div", {
              className: "content",
              children: l.jsx(dg, { status: p, onRetry: E, retrying: R }),
            }),
          ],
        })
      : l.jsxs("div", {
          className:
            "shell" + (C ? " is-landing" : "") + (o ? " nav-open" : ""),
          children: [
            C &&
              l.jsxs("div", {
                className: "landing-controls",
                children: [
                  l.jsx(Yi, { theme: g, setTheme: m }),
                  l.jsxs("button", {
                    className: "btn btn-secondary landing-library-btn",
                    onClick: () => M("library"),
                    title: "Open your generated clips",
                    "aria-label": "Open Library",
                    children: [
                      l.jsx(B.library, {}),
                      l.jsx("span", { children: "Library" }),
                    ],
                  }),
                  l.jsxs("button", {
                    className: "btn btn-secondary landing-exit-btn",
                    onClick: () => f(!0),
                    title: "Stop Clipxy4all server and exit",
                    children: [
                      l.jsx(B.power, {}),
                      l.jsx("span", { children: "Exit" }),
                    ],
                  }),
                ],
              }),
            l.jsx("div", {
              className: "nav-scrim",
              onClick: () => d(!1),
              "aria-hidden": "true",
            }),
            l.jsxs("aside", {
              className: "sidebar",
              children: [
                l.jsxs("div", {
                  className: "brand",
                  onClick: () => M("create"),
                  style: { cursor: "pointer" },
                  children: [
                    l.jsx("span", {
                      className: "logo",
                      children: l.jsx("img", { src: Hs, alt: "Clipxy4all" }),
                    }),
                    l.jsxs("span", {
                      className: "brand-text",
                      children: [
                        "Clipxy4all",
                        l.jsx("span", {
                          className: "brand-by",
                          children: "Create. Clip. Share.",
                        }),
                      ],
                    }),
                  ],
                }),
                l.jsxs("nav", {
                  className: "nav",
                  children: [
                    og.map((F) =>
                      l.jsxs(
                        "button",
                        {
                          className: "nav-item" + (e === F.id ? " active" : ""),
                          onClick: () => M(F.id),
                          children: [l.jsx(F.icon, {}), " ", F.label],
                        },
                        F.id,
                      ),
                    ),
                    l.jsxs("button", {
                      className: "nav-item",
                      onClick: () => f(!0),
                      style: { marginTop: 12, color: "#f87171" },
                      title: "Stop Clipxy4all and close",
                      children: [
                        l.jsx(B.power, {
                          style: { width: 18, height: 18, color: "#ef4444" },
                        }),
                        " Close Clipxy4all",
                      ],
                    }),
                  ],
                }),
                l.jsxs("div", {
                  className: "sidebar-foot",
                  children: [
                    "100% local pipeline",
                    l.jsx("br", {}),
                    "yt-dlp · faster-whisper · ffmpeg",
                  ],
                }),
              ],
            }),
            l.jsxs("div", {
              className: "main",
              children: [
                l.jsxs("header", {
                  className: "topbar",
                  children: [
                    l.jsx("button", {
                      className: "nav-toggle",
                      onClick: () => d((F) => !F),
                      "aria-label": "Menu",
                      children: l.jsxs("svg", {
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "2.2",
                        strokeLinecap: "round",
                        children: [
                          l.jsx("line", {
                            x1: "3",
                            y1: "6",
                            x2: "21",
                            y2: "6",
                          }),
                          l.jsx("line", {
                            x1: "3",
                            y1: "12",
                            x2: "21",
                            y2: "12",
                          }),
                          l.jsx("line", {
                            x1: "3",
                            y1: "18",
                            x2: "21",
                            y2: "18",
                          }),
                        ],
                      }),
                    }),
                    l.jsxs("div", {
                      className: "topbar-titles",
                      children: [
                        l.jsx("h1", { children: H.h }),
                        l.jsx("div", { className: "sub", children: H.sub }),
                      ],
                    }),
                    l.jsxs("div", {
                      className: "topbar-right",
                      children: [
                        l.jsx(Yi, { theme: g, setTheme: m }),
                        l.jsxs("button", {
                          className: "btn btn-ghost",
                          onClick: () => f(!0),
                          style: {
                            color: "#ef4444",
                            padding: "6px 10px",
                            height: "auto",
                            fontSize: "12.5px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                          },
                          title: "Stop Clipxy4all server and exit",
                          children: [
                            l.jsx(B.power, {
                              style: { width: 14, height: 14 },
                            }),
                            " Exit",
                          ],
                        }),
                        l.jsxs("span", {
                          className:
                            "badge " + (a ? "ok" : a === !1 ? "warn" : ""),
                          children: [
                            l.jsx("span", { className: "dot" }),
                            a == null
                              ? "Connecting…"
                              : a
                                ? `Backend · ${(s || "ready").toUpperCase()}`
                                : "Backend offline",
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                l.jsxs("div", {
                  className: "content",
                  children: [
                    l.jsxs("div", {
                      className: "landing-orbs",
                      "aria-hidden": "true",
                      children: [
                        l.jsx("span", { className: "orb orb-1" }),
                        l.jsx("span", { className: "orb orb-2" }),
                        l.jsx("span", { className: "orb orb-3" }),
                        l.jsx("span", { className: "orb orb-4" }),
                        l.jsx("span", { className: "orb orb-5" }),
                      ],
                    }),
                    l.jsx("div", {
                      style: { display: e === "create" ? "contents" : "none" },
                      children: l.jsx(lg, { step: n, setStep: r }),
                    }),
                    e === "library" && l.jsx(ig, {}),
                    e === "settings" && l.jsx(ag, {}),
                  ],
                }),
              ],
            }),
            l.jsx(ProcessingPanel,{onCreate:()=>{t("create");r(1);window.dispatchEvent(new Event("clipxy-new-task"));},onLibrary:()=>{t("library");d(false);}}),
            c &&
              l.jsx("div", {
                style: {
                  position: "fixed",
                  inset: 0,
                  background: "rgba(0,0,0,0.75)",
                  display: "grid",
                  placeItems: "center",
                  zIndex: 9999,
                  backdropFilter: "blur(4px)",
                  padding: 20,
                },
                children: l.jsxs("div", {
                  className: "card",
                  style: {
                    maxWidth: 420,
                    width: "100%",
                    padding: 26,
                    textAlign: "center",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                  },
                  children: [
                    l.jsx("div", {
                      style: {
                        width: 52,
                        height: 52,
                        borderRadius: "50%",
                        background: "rgba(239, 68, 68, 0.15)",
                        display: "grid",
                        placeItems: "center",
                        margin: "0 auto 16px",
                        color: "#ef4444",
                      },
                      children: l.jsx(B.power, {
                        style: { width: 26, height: 26 },
                      }),
                    }),
                    l.jsx("h2", {
                      style: {
                        fontSize: "1.25rem",
                        fontWeight: 800,
                        marginBottom: 8,
                      },
                      children: "Close Clipxy4all?",
                    }),
                    l.jsxs("p", {
                      className: "note",
                      style: {
                        marginBottom: 22,
                        fontSize: "0.9rem",
                        lineHeight: 1.5,
                      },
                      children: [
                        "This will stop the local background AI engine and release all GPU and system memory.",
                        l.jsx("br", {}),
                        l.jsx("br", {}),
                        "You can relaunch Clipxy4all anytime from your Desktop shortcut.",
                      ],
                    }),
                    l.jsxs("div", {
                      style: {
                        display: "flex",
                        gap: 12,
                        justifyContent: "center",
                      },
                      children: [
                        l.jsx("button", {
                          className: "btn btn-secondary",
                          onClick: () => f(!1),
                          style: { flex: 1 },
                          children: "Cancel",
                        }),
                        l.jsx("button", {
                          className: "btn btn-primary",
                          onClick: k,
                          style: {
                            flex: 1,
                            background: "#ef4444",
                            borderColor: "#ef4444",
                            color: "#fff",
                          },
                          children: "Exit & Stop",
                        }),
                      ],
                    }),
                  ],
                }),
              }),
          ],
        });
}
Tf(document.getElementById("root")).render(l.jsx(EnhancementShell, {children:l.jsx(fg,{})}));
