/* 大衍占筮 · Android WebView 运行时
   把微信小程序的 App / Page / setData / wx.* 映射到浏览器环境。
   本文件由 tools/convert.py 原样复制进 assets/www。 */
(function () {
  var W = window;

  /* ---------- CommonJS 模块 ---------- */
  W.__M = {};
  W.__P = {};
  W.__T = W.__T || {};
  W.__APP = { globalData: {} };
  W.__cur = '';
  W.__def = function (id, fn) { W.__M[id] = { fn: fn, done: false, exports: {} }; };
  W.__req = function (id, base) {
    var parts = (base || '').split('/'); parts.pop();
    id.split('/').forEach(function (s) {
      if (s === '..') parts.pop();
      else if (s && s !== '.') parts.push(s);
    });
    var key = parts.join('/').replace(/\.js$/, '') + '.js';
    var m = W.__M[key];
    if (!m) throw new Error('module not found: ' + id + ' -> ' + key);
    if (!m.done) {
      var mod = { exports: {} };
      m.done = true;
      m.fn(mod, mod.exports, function (p) { return W.__req(p, key); });
      m.exports = mod.exports;
    }
    return m.exports;
  };
  W.Page = function (cfg) { W.__P[W.__cur] = cfg; };
  W.App = function (cfg) {
    W.__APP = cfg || {};
    if (!W.__APP.globalData) W.__APP.globalData = {};
  };
  W.getApp = function () { return W.__APP; };

  /* ---------- 模板辅助 ---------- */
  W.__E = function (v) {
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  };
  W.__each = function (arr, fn) {
    return (arr && arr.length !== undefined ? Array.prototype.slice.call(arr) : [])
      .map(fn).join('');
  };
  W.__rpx = function (v) { return (Number(v) || 0) / 100 + 'rem'; };

  /* ---------- 轻量 keyed DOM diff ----------
     保留同 key 的节点，让 CSS transition / canvas 位图不因 setData 重建而丢失。 */
  function kids(p) {
    return Array.prototype.slice.call(p.childNodes).filter(function (n) {
      return n.nodeType === 1 || (n.nodeType === 3 && /\S/.test(n.nodeValue));
    });
  }
  function keyOf(n) {
    if (n.nodeType === 3) return 'TXT';
    var k = n.getAttribute('data-wxk');
    return n.nodeName + '|' + (n.id || '') + '|' + (k == null ? '' : k);
  }
  function patchAttrs(o, n) {
    if (o.nodeName === 'CANVAS') return;         // 画布位图与宽高一律不动
    for (var i = o.attributes.length - 1; i >= 0; i--) {
      var a = o.attributes[i];
      if (!n.hasAttribute(a.name)) o.removeAttribute(a.name);
    }
    for (var j = 0; j < n.attributes.length; j++) {
      var b = n.attributes[j];
      if (o.getAttribute(b.name) !== b.value) o.setAttribute(b.name, b.value);
    }
    /* input 的 value 属性不会自动同步到 property；输入弹层重开时须显式对齐，
       否则会出现上一次输入残留。 */
    if (o.nodeName === 'INPUT' && n.hasAttribute('value')) {
      var v = n.getAttribute('value');
      if (o.value !== v) o.value = v;
    }
  }
  function patchNode(o, n) {
    if (o.nodeType === 3) { if (o.nodeValue !== n.nodeValue) o.nodeValue = n.nodeValue; return; }
    if (o.nodeName === 'CANVAS') return;
    patchAttrs(o, n);
    patchChildren(o, n);
  }
  function patchChildren(oldP, newP) {
    var olds = kids(oldP), news = kids(newP), pool = {}, used = [], nodes = [];
    olds.forEach(function (n) { var k = keyOf(n); (pool[k] = pool[k] || []).push(n); });
    news.forEach(function (nn) {
      var k = keyOf(nn), arr = pool[k], m = null;
      if (arr && arr.length) m = arr.shift();
      if (!m) {
        for (var kk in pool) {
          if (pool[kk].length && pool[kk][0].nodeName === nn.nodeName) { m = pool[kk].shift(); break; }
        }
      }
      if (m) { patchNode(m, nn); used.push(m); }
      else m = nn.cloneNode(true);
      nodes.push(m);
    });
    olds.forEach(function (o) {
      if (used.indexOf(o) < 0 && o.parentNode === oldP) oldP.removeChild(o);
    });
    /* 只在成员/顺序真的变化时才挪动节点。无条件 appendChild 会把已在文档中的
       节点 detach 再 attach，浏览器随之重置 CSS transition 与 animation ——
       挂一飞球因此从起点直接跳到太极位（「闪现」），日晕也反复从头重播。 */
    var cur = kids(oldP);
    var same = cur.length === nodes.length &&
      nodes.every(function (n, i) { return cur[i] === n; });
    if (same) return;
    nodes.forEach(function (n) { oldP.appendChild(n); });
  }
  function fromHTML(html) {
    var d = document.createElement('div'); d.innerHTML = html; return d;
  }

  /* ---------- 页面实例 ---------- */
  function makePage(route, options) {
    var cfg = W.__P[route];
    if (!cfg) throw new Error('no page: ' + route);
    var p = {};
    Object.keys(cfg).forEach(function (k) { if (k !== 'data') p[k] = cfg[k]; });
    p.data = JSON.parse(JSON.stringify(cfg.data || {}));
    p.route = route;
    p.options = options || {};
    p.__ready = false;
    p.setData = function (o) {
      if (!o) return;
      Object.keys(o).forEach(function (k) {
        if (k.indexOf('.') < 0) p.data[k] = o[k];
        else {
          var seg = k.split('.'), t = p.data;
          for (var i = 0; i < seg.length - 1; i++) t = t[seg[i]] = t[seg[i]] || {};
          t[seg[seg.length - 1]] = o[k];
        }
      });
      if (W.__router.top() === p) W.__render(p);
    };
    return p;
  }
  W.__render = function (p) {
    var tpl = W.__T[p.route];
    if (!tpl) return;
    var root = document.getElementById('app');
    patchChildren(root, fromHTML(tpl(p.data)));
    /* WebView 不认小程序 input 的 focus 属性；弹层首次出现时主动聚焦。
       已聚焦时不再重复 focus，避免每次 setData 都重弹软键盘。 */
    var f = root.querySelector && root.querySelector('input[focus="true"]');
    if (f && document.activeElement !== f) { try { f.focus(); } catch (e) {} }
    if (!p.__ready) { p.__ready = true; if (p.onReady) p.onReady(); }
  };

  /* ---------- 路由 ---------- */
  var stack = [];
  function parseUrl(url) {
    var s = String(url || '').replace(/^\//, ''), i = s.indexOf('?');
    var route = i < 0 ? s : s.slice(0, i), q = i < 0 ? '' : s.slice(i + 1), opts = {};
    q.split('&').forEach(function (kv) {
      if (!kv) return;
      var a = kv.split('=');
      opts[decodeURIComponent(a[0])] = decodeURIComponent(a[1] || '');
    });
    return { route: route, options: opts };
  }
  function drop(entry) {
    if (entry && entry.page.onUnload) { try { entry.page.onUnload(); } catch (e) {} }
  }
  function activate(entry, fresh) {
    stack.push(entry);
    var p = entry.page;
    if (fresh && p.onLoad) p.onLoad(entry.options);
    W.__render(p);
    if (p.onShow) p.onShow();
  }
  W.__router = {
    start: function (url) { this.reLaunch(url || (W.__ROUTES && W.__ROUTES[0])); },
    top: function () { return stack.length ? stack[stack.length - 1].page : null; },
    navigateTo: function (url) {
      var u = parseUrl(url), old = stack[stack.length - 1];
      if (old && old.page.onHide) old.page.onHide();
      activate({ route: u.route, options: u.options, page: makePage(u.route, u.options) }, true);
    },
    redirectTo: function (url) {
      var u = parseUrl(url);
      drop(stack.pop());
      activate({ route: u.route, options: u.options, page: makePage(u.route, u.options) }, true);
    },
    reLaunch: function (url) {
      while (stack.length) drop(stack.pop());
      var u = parseUrl(url);
      activate({ route: u.route, options: u.options, page: makePage(u.route, u.options) }, true);
    },
    back: function () {
      if (stack.length > 1) {
        drop(stack.pop());
        var e = stack[stack.length - 1];
        W.__render(e.page);
        if (e.page.onShow) e.page.onShow();
        return true;
      }
      return false;
    }
  };
  W.__back = function () {
    if (W.__router.back()) return;
    if (W.Android && W.Android.finishApp) W.Android.finishApp();
  };

  /* ---------- 事件委托（bindtap / bindtouch* / catchtouch* / bindlongpress） ---------- */
  function dataset(el) {
    var o = {};
    if (!el || !el.dataset) return o;
    Object.keys(el.dataset).forEach(function (k) { o[k] = el.dataset[k]; });
    return o;
  }
  function handlersFor(el, type) {
    var raw = el.getAttribute && el.getAttribute('data-ev');
    if (!raw) return null;
    var out = [];
    raw.split(';').forEach(function (seg) {
      var m = /^([a-z]+)(!?):(\w+)$/.exec(seg);
      if (m && m[1] === type) out.push({ fn: m[3], stop: m[2] === '!' });
    });
    return out.length ? out : null;
  }
  function pt(t, e) {
    var o = t || e || {};
    var x = o.clientX != null ? o.clientX : (o.pageX || 0);
    var y = o.clientY != null ? o.clientY : (o.pageY || 0);
    return { clientX: x, clientY: y, pageX: x, pageY: y, x: x, y: y, identifier: o.identifier || 0 };
  }
  function makeEv(native, cur, type) {
    var touches = native.touches ? Array.prototype.map.call(native.touches, function (t) { return pt(t); })
      : (type === 'touchend' || type === 'tap' ? [] : [pt(null, native)]);
    var changed = native.changedTouches ? Array.prototype.map.call(native.changedTouches, function (t) { return pt(t); })
      : (native.touches && native.touches.length ? touches : [pt(null, native)]);
    var ev = {
      type: type, timeStamp: native.timeStamp || Date.now(),
      touches: touches, changedTouches: changed, detail: {},
      currentTarget: { dataset: dataset(cur), id: cur && cur.id },
      target: { dataset: dataset(native.target), id: native.target && native.target.id }
    };
    /* 小程序的 bindinput 事件从 e.detail.value 取值 */
    if (type === 'input' && native.target && native.target.value != null) {
      ev.detail.value = native.target.value;
    }
    return ev;
  }
  function dispatch(native, type) {
    var p = W.__router.top();
    if (!p) return false;
    var el = native.target, chain = [], stop = false;
    while (el && el.nodeType === 1 && el !== document.body) {
      var hs = handlersFor(el, type);
      if (hs) chain.push({ el: el, hs: hs });
      el = el.parentNode;
    }
    for (var i = 0; i < chain.length && !stop; i++) {
      var ent = chain[i];
      for (var j = 0; j < ent.hs.length; j++) {
        var h = ent.hs[j];
        if (typeof p[h.fn] === 'function') p[h.fn].call(p, makeEv(native, ent.el, type));
        if (h.stop) { stop = true; break; }
      }
    }
    return chain.length > 0;
  }
  var longTimer = null, longStart = null;
  ['touchstart', 'touchmove', 'touchend', 'click', 'input'].forEach(function (evt) {
    var type = evt === 'click' ? 'tap' : evt;
    document.addEventListener(evt, function (e) {
      if (evt === 'touchstart') {
        longStart = { x: pt(e.touches[0]).x, y: pt(e.touches[0]).y, el: e.target };
        if (longTimer) clearTimeout(longTimer);
        longTimer = setTimeout(function () {
          var t = longStart && longStart.el;
          if (t) dispatch({ target: t, touches: [], changedTouches: [], timeStamp: Date.now() }, 'longpress');
          longTimer = null;
        }, 500);
      }
      if (evt === 'touchmove' && longStart) {
        var q = pt(e.touches[0]);
        if (Math.abs(q.x - longStart.x) > 10 || Math.abs(q.y - longStart.y) > 10) {
          if (longTimer) clearTimeout(longTimer); longTimer = null;
        }
      }
      if (evt === 'touchend' || evt === 'click') {
        if (longTimer) clearTimeout(longTimer); longTimer = null;
      }
      var hit = dispatch(e, type);
      if (hit && (evt === 'touchmove' || evt === 'touchstart') && e.cancelable) e.preventDefault();
    }, { passive: false });
  });
  /* 桌面浏览器调试：鼠标模拟划线 */
  var mouseDown = false;
  document.addEventListener('mousedown', function (e) {
    if (e.target.closest && !e.target.closest('.circl')) return;
    mouseDown = true;
    dispatch({ target: e.target, touches: [pt(null, e)], changedTouches: [pt(null, e)], timeStamp: e.timeStamp }, 'touchstart');
  });
  document.addEventListener('mousemove', function (e) {
    if (!mouseDown) return;
    dispatch({ target: e.target, touches: [pt(null, e)], changedTouches: [pt(null, e)], timeStamp: e.timeStamp }, 'touchmove');
  });
  document.addEventListener('mouseup', function (e) {
    if (!mouseDown) return;
    mouseDown = false;
    dispatch({ target: e.target, touches: [], changedTouches: [pt(null, e)], timeStamp: e.timeStamp }, 'touchend');
  });

  /* ---------- 选择器查询 ---------- */
  function Query() { this.q = []; }
  Query.prototype.in = function () { return this; };
  Query.prototype.select = function (sel) { this._sel = sel; this._all = false; return this; };
  Query.prototype.selectAll = function (sel) { this._sel = sel; this._all = true; return this; };
  Query.prototype.boundingClientRect = function () {
    this.q.push({ sel: this._sel, all: this._all, kind: 'rect' }); return this;
  };
  Query.prototype.fields = function (opts) {
    this.q.push({ sel: this._sel, all: this._all, kind: 'fields', opts: opts || {} }); return this;
  };
  function rectOf(el) {
    if (!el) return null;
    var r = el.getBoundingClientRect();
    return {
      left: r.left, top: r.top, right: r.right, bottom: r.bottom,
      width: r.width, height: r.height, id: el.id, dataset: dataset(el)
    };
  }
  Query.prototype.exec = function (cb) {
    var root = document.getElementById('app');
    var res = this.q.map(function (it) {
      var els = it.all
        ? Array.prototype.slice.call(root.querySelectorAll(it.sel))
        : [root.querySelector(it.sel)];
      if (it.kind === 'fields') {
        var el = els[0];
        if (!el) return null;
        var o = { node: el };
        var r = rectOf(el) || {};
        if (it.opts.size) { o.width = r.width; o.height = r.height; }
        if (it.opts.rect) { o.left = r.left; o.top = r.top; }
        return o;
      }
      if (it.all) return els.map(rectOf).filter(Boolean);
      return rectOf(els[0]);
    });
    cb && cb(res);
  };

  /* ---------- wx.* 垫片 ---------- */
  function sysInfo() {
    return {
      windowWidth: window.innerWidth, windowHeight: window.innerHeight,
      screenWidth: window.innerWidth, screenHeight: window.innerHeight,
      pixelRatio: window.devicePixelRatio || 2,
      statusBarHeight: 24, safeArea: { top: 24, bottom: window.innerHeight }
    };
  }
  var toastTimer = null;

  /* ---------- 占例持久化：原生文件为主 + WebView localStorage 为镜像 ----------
     Android 覆盖安装（升级）会保留 /data/data/<pkg> 下的私有文件与 WebView 数据，
     但 file:// 页面的 localStorage 依赖系统 WebView，个别机型上可能读不到。
     故对占例数据双写：
       写：app 私有 files/dayan_sessions.json ＋ localStorage；
       读：原生文件优先；原生无有效数据而 localStorage 有数据时，判定为
           v1.0 只写 localStorage 的旧占例，自动迁移回原生文件。
     这样「直接覆盖安装新版」不会清空历史，旧版本与后续版本都能读到。
     浏览器预览/无 bridge 环境自动退回纯 localStorage。 */
  var SESSION_KEY = 'dayan_sessions_v1';

  function hasBridge() {
    return !!(W.Android && W.Android.getSessions && W.Android.setSessions);
  }
  function encodeVal(v) { return JSON.stringify({ __v: v }); }
  function decodeVal(raw) {
    if (raw == null || raw === '') return null;
    try {
      var o = JSON.parse(raw);
      if (o && typeof o === 'object' && Object.prototype.hasOwnProperty.call(o, '__v')) return o.__v;
      return o;                                  // 兼容直接存数组的老格式
    } catch (e) { return null; }
  }
  function lsRaw(k) {
    try { return localStorage.getItem(k); } catch (e) { return null; }
  }
  function nativeRaw(k) {
    if (k !== SESSION_KEY || !hasBridge()) return null;
    try {
      var s = W.Android.getSessions();
      return (s == null || s === '') ? null : String(s);
    } catch (e) { return null; }
  }
  function lsWrite(k, raw) {
    try { localStorage.setItem(k, raw); } catch (e) {}
  }
  function nativeWrite(k, raw) {
    if (k !== SESSION_KEY || !hasBridge()) return;
    try { W.Android.setSessions(raw); } catch (e) {}
  }

  W.wx = {
    getWindowInfo: sysInfo,
    getSystemInfoSync: sysInfo,
    showToast: function (o) {
      o = o || {};
      var t = document.getElementById('__toast');
      if (!t) {
        t = document.createElement('div'); t.id = '__toast';
        t.style.cssText = 'position:fixed;left:50%;bottom:18%;transform:translateX(-50%);z-index:99999;' +
          'background:rgba(21,23,28,.9);color:#fff;padding:12px 22px;border-radius:8px;' +
          'font-size:14px;line-height:1.5;max-width:78%;text-align:center;pointer-events:none;';
        document.body.appendChild(t);
      }
      t.textContent = o.title || '';
      t.style.display = 'block';
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { t.style.display = 'none'; }, o.duration || 1600);
    },
    showModal: function (o) {
      o = o || {};
      /* Android WebView 默认 WebChromeClient 不显示 JS 对话框，
         MainActivity 已覆盖 onJsConfirm 用原生 AlertDialog 承接。 */
      var ok = window.confirm(o.content || o.title || '');
      if (o.success) o.success({ confirm: ok, cancel: !ok });
    },
    setStorageSync: function (k, v) {
      var raw = encodeVal(v);
      lsWrite(k, raw);
      nativeWrite(k, raw);                       // 原生与镜像同时更新
    },
    getStorageSync: function (k) {
      var nRaw = nativeRaw(k), nVal = decodeVal(nRaw);
      if (nVal != null) return nVal;
      var lRaw = lsRaw(k), lVal = decodeVal(lRaw);
      if (lVal != null) {
        /* 旧版本占例迁移：只在原生侧缺数据或数据损坏时回写一次 */
        if (k === SESSION_KEY && nVal == null) nativeWrite(k, lRaw);
        return lVal;
      }
      return '';
    },
    removeStorageSync: function (k) {
      try { localStorage.removeItem(k); } catch (e) {}
      if (k === SESSION_KEY) nativeWrite(k, '');
    },
    navigateTo: function (o) { W.__router.navigateTo(o.url); },
    redirectTo: function (o) { W.__router.redirectTo(o.url); },
    reLaunch: function (o) { W.__router.reLaunch(o.url); },
    navigateBack: function () { W.__router.back(); },
    createSelectorQuery: function () { return new Query(); },
    vibrateShort: function () {},
    hideKeyboard: function () {}
  };

  /* ---------- rpx 基准 ---------- */
  W.__setUnit = function () {
    document.documentElement.style.fontSize = (window.innerWidth / 750 * 100) + 'px';
  };
  W.__setUnit();
  window.addEventListener('resize', W.__setUnit);
  W.__boot = function () { W.__setUnit(); W.__router.start(); };
})();
