#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""微信小程序 → Android WebView 转换器（大衍占筮专用，通用 enough）。

把上游 dayan-miniprogram 的 WXML / WXSS / JS 原样搬进 WebView：
  * WXML 编译成 JS 模板函数（wx:for / wx:if / wx:elif / wx:else / {{表达式}} / 事件）
  * WXSS 的 rpx 按 750 设计宽换算成 rem
  * JS 用自带的 CommonJS loader 原样执行（utils/ 一行不改）
  * Page / App / setData / wx.* 由 runtime.js 提供

用法：python3 tools/convert.py [小程序目录] [输出 www 目录]
"""
import os
import re
import sys
import json
import html
import shutil
from html.parser import HTMLParser

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(BASE), 'dayan-miniprogram')
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(BASE, 'app', 'src', 'main', 'assets', 'www')

TAGS = {'view': 'div', 'text': 'span', 'button': 'button', 'canvas': 'canvas',
        'image': 'img', 'input': 'input', 'scroll-view': 'div', 'block': None,
        'navigator': 'div', 'icon': 'span', 'form': 'form'}
VOID = {'img', 'input', 'br', 'hr'}
EVENT_RE = re.compile(r'^(bind|catch)([a-z]+)$')


class Node:
    __slots__ = ('tag', 'attrs', 'children')

    def __init__(self, tag, attrs):
        self.tag = tag.lower()
        self.attrs = [(k.lower(), v if v is not None else '') for k, v in attrs]
        self.children = []

    def get(self, k, default=None):
        for a, v in self.attrs:
            if a == k:
                return v
        return default

    def has(self, k):
        return any(a == k for a, _ in self.attrs)


class WXMLParser(HTMLParser):
    def __init__(self):
        HTMLParser.__init__(self, convert_charrefs=True)
        self.root = Node('#root', [])
        self.stack = [self.root]

    def _add(self, tag, attrs, closed):
        n = Node(tag, attrs)
        self.stack[-1].children.append(n)
        if not closed:
            self.stack.append(n)

    def handle_starttag(self, tag, attrs):
        self._add(tag, attrs, False)

    def handle_startendtag(self, tag, attrs):
        self._add(tag, attrs, True)

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag.lower():
                self.stack = self.stack[:i]
                return

    def handle_data(self, data):
        self.stack[-1].children.append(data)


def jsstr(s):
    return json.dumps(s, ensure_ascii=False)


def interp(s):
    """把含 {{expr}} 的文本编译成 JS 字符串表达式（带 HTML 转义）。"""
    out, pos = [], 0
    for m in re.finditer(r'\{\{(.*?)\}\}', s, re.S):
        lit = s[pos:m.start()]
        if lit:
            out.append(jsstr(html.escape(lit, quote=False)))
        out.append('__E(' + m.group(1).strip() + ')')
        pos = m.end()
    tail = s[pos:]
    if tail:
        out.append(jsstr(html.escape(tail, quote=False)))
    return '+'.join(out) if out else "''"


def style_interp(s):
    """行内 style 里的 rpx：动态的 {{x}}rpx 走 __rpx()，静态的换算成 rem。"""
    s = re.sub(r'\{\{(.*?)\}\}rpx',
               lambda m: '{{__rpx(' + m.group(1).strip() + ')}}', s, flags=re.S)
    s = re.sub(r'(-?\d*\.?\d+)rpx',
               lambda m: ('%g' % (float(m.group(1)) / 100)) + 'rem', s)
    return interp(s)


def expr(s):
    s = (s or '').strip()
    if s.startswith('{{') and s.endswith('}}'):
        return s[2:-2].strip()
    return interp(s)


class Compiler:
    def __init__(self):
        self.lines = []
        self.depth = 0
        self.cur = '__h0'

    def emit(self, js_expr):
        self.lines.append(self.cur + ' += ' + js_expr + ';')

    def gen_children(self, children):
        i = 0
        while i < len(children):
            nd = children[i]
            if isinstance(nd, Node) and nd.get('wx:if') is not None:
                chain = [(nd, expr(nd.get('wx:if')))]
                j = i + 1
                while j < len(children) and isinstance(children[j], Node):
                    n2 = children[j]
                    if n2.get('wx:elif') is not None:
                        chain.append((n2, expr(n2.get('wx:elif'))))
                        j += 1
                    elif n2.has('wx:else'):
                        chain.append((n2, None))
                        j += 1
                        break
                    else:
                        break
                self.lines.append('if (' + chain[0][1] + ') {')
                self.gen_node(chain[0][0], strip=('wx:if',))
                self.lines.append('}')
                for node2, cond in chain[1:]:
                    self.lines.append(('else if (' + cond + ') {') if cond is not None else 'else {')
                    self.gen_node(node2, strip=('wx:if', 'wx:elif', 'wx:else'))
                    self.lines.append('}')
                i = j
                continue
            if isinstance(nd, str):
                if nd.strip():
                    self.emit(interp(nd))
            else:
                self.gen_node(nd)
            i += 1

    def gen_node(self, node, strip=()):
        amap = dict(node.attrs)
        cond = amap.get('wx:if') if 'wx:if' not in strip else None
        loop = amap.get('wx:for') if 'wx:for' not in strip else None
        if cond is not None:
            self.lines.append('if (' + expr(cond) + ') {')
            self.gen_element(node, strip, loop)
            self.lines.append('}')
        else:
            self.gen_element(node, strip, loop)

    def gen_element(self, node, strip, loop):
        amap = dict(node.attrs)
        if loop is not None:
            itemv = amap.get('wx:for-item') or 'item'
            idxv = amap.get('wx:for-index') or 'idx'
            keyfield = amap.get('wx:key')
            self.depth += 1
            inner = '__h%d' % self.depth
            outer = self.cur
            self.lines.append(outer + ' += __each(' + expr(loop) + ', function(' + itemv + ', ' + idxv + '){ var ' + inner + ' = "";')
            self.cur = inner
            keyexpr = None
            if keyfield:
                if keyfield == '*this':
                    keyexpr = itemv
                else:
                    kf = jsstr(keyfield)
                    keyexpr = '(' + itemv + ' && ' + itemv + '[' + kf + '] != null) ? ' + itemv + '[' + kf + '] : ' + idxv
            self.gen_tag(node, strip, keyexpr)
            self.cur = outer
            self.lines.append('return ' + inner + '; });')
        else:
            self.gen_tag(node, strip, None)

    def gen_tag(self, node, strip, keyexpr):
        tag = TAGS.get(node.tag, node.tag)
        if tag is None:                                  # <block>
            self.gen_children(node.children)
            return

        events = []
        segs = []
        for k, v in node.attrs:
            if k in strip or k.startswith('wx:'):
                continue
            m = EVENT_RE.match(k)
            if m:
                events.append(m.group(2) + ('!' if m.group(1) == 'catch' else '') + ':' + v)
                continue
            segs.append(jsstr(' ' + k + '="'))
            segs.append(style_interp(v) if k == 'style' else interp(v))
            segs.append(jsstr('"'))
        if events:
            segs += [jsstr(' data-ev="'), jsstr(';'.join(events)), jsstr('"')]
        if keyexpr is not None:
            segs += [jsstr(' data-wxk="'), '__E(' + keyexpr + ')', jsstr('"')]
        if tag == 'canvas':
            segs.append(jsstr(' data-keep="1"'))
        attrs = '+'.join(segs) if segs else "''"

        self.emit(jsstr('<' + tag) + ' + ' + attrs + ' + ' + jsstr('>') if attrs != "''" else jsstr('<' + tag + '>'))
        if tag not in VOID:
            self.gen_children(node.children)
            self.emit(jsstr('</' + tag + '>'))

    def build(self, route, root):
        body = ['window.__T[' + jsstr(route) + '] = function (d) {',
                '  with (d) {',
                '    var __h0 = "";']
        body += ['    ' + ln for ln in self.lines]
        body += ['    return __h0;', '  }', '};']
        return '\n'.join(body)


BASE_CSS = """/* WebView 基座：抹平浏览器默认样式，rpx 由 html font-size 提供 */
html, body { margin:0; padding:0; width:100%; height:100%; overflow-x:hidden; }
* { -webkit-tap-highlight-color: transparent; -webkit-user-select:none; user-select:none; }
button { appearance:none; -webkit-appearance:none; border:0; border-radius:0;
  background:transparent; color:inherit; font:inherit; line-height:normal;
  padding:0; margin:0; text-align:center; }
canvas { display:block; }
.circl, .ink { touch-action:none; }
#app { min-height:100%; }
"""


def convert_css():
    files = [os.path.join(SRC, 'app.wxss')]
    for root, dirs, fs in os.walk(os.path.join(SRC, 'pages')):
        for f in sorted(fs):
            if f.endswith('.wxss'):
                files.append(os.path.join(root, f))
    out = [BASE_CSS]
    for f in files:
        s = open(f, encoding='utf-8').read()
        s = re.sub(r'(?m)^\s*page\s*\{', 'html, body {', s)
        s = re.sub(r'(-?\d*\.?\d+)rpx', lambda m: ('%g' % (float(m.group(1)) / 100)) + 'rem', s)
        out.append('/* ===== ' + os.path.relpath(f, SRC) + ' ===== */\n' + s)
    return '\n'.join(out)


def convert_bundle(routes):
    out = ['/* 由 tools/convert.py 生成：模块定义 + 页面注册 + 启动 */',
           'window.__ROUTES = ' + jsstr_list(routes) + ';']
    app_js = open(os.path.join(SRC, 'app.js'), encoding='utf-8').read()
    out.append("__def('app.js', function(module, exports, require){\n" + app_js + "\n});")

    utils = os.path.join(SRC, 'utils')
    for f in sorted(os.listdir(utils)):
        if not f.endswith('.js'):
            continue
        src = open(os.path.join(utils, f), encoding='utf-8').read()
        out.append("__def('utils/" + f + "', function(module, exports, require){\n" + src + "\n});")

    for route in routes:
        p = os.path.join(SRC, route + '.js')
        src = open(p, encoding='utf-8').read()
        out.append("__def('" + route + ".js', function(module, exports, require){\n"
                   + "__cur = " + jsstr(route) + ";\n" + src + "\n});")

    out.append("__req('app.js');")
    for route in routes:
        out.append("__req('" + route + ".js');")
    out.append('__boot();')
    return '\n'.join(out)


def jsstr_list(a):
    return '[' + ','.join(jsstr(x) for x in a) + ']'


def main():
    appjson = json.load(open(os.path.join(SRC, 'app.json'), encoding='utf-8'))
    routes = appjson['pages']
    os.makedirs(OUT, exist_ok=True)

    tpls = []
    for route in routes:
        raw = open(os.path.join(SRC, route + '.wxml'), encoding='utf-8').read()
        p = WXMLParser()
        p.feed(raw)
        p.close()
        c = Compiler()
        c.gen_children(p.root.children)
        tpls.append(c.build(route, p.root))
        print('  WXML %-28s -> %3d 行渲染代码' % (route + '.wxml', len(c.lines)))

    open(os.path.join(OUT, 'templates.js'), 'w', encoding='utf-8').write('\n'.join(tpls))
    open(os.path.join(OUT, 'app.css'), 'w', encoding='utf-8').write(convert_css())
    open(os.path.join(OUT, 'bundle.js'), 'w', encoding='utf-8').write(convert_bundle(routes))
    shutil.copyfile(os.path.join(BASE, 'tools', 'runtime.js'), os.path.join(OUT, 'runtime.js'))

    title = appjson.get('window', {}).get('navigationBarTitleText', '大衍占筮')
    index = ('<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n'
             '<meta charset="utf-8">\n'
             '<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,'
             'minimum-scale=1,user-scalable=no,viewport-fit=cover">\n'
             '<meta name="format-detection" content="telephone=no">\n'
             '<title>' + html.escape(title) + '</title>\n'
             '<link rel="stylesheet" href="app.css">\n</head>\n<body>\n'
             '<div id="app"></div>\n'
             '<script src="runtime.js"></script>\n'
             '<script src="templates.js"></script>\n'
             '<script src="bundle.js"></script>\n'
             '</body>\n</html>\n')
    open(os.path.join(OUT, 'index.html'), 'w', encoding='utf-8').write(index)
    print('转换完成 ->', OUT)
    for f in sorted(os.listdir(OUT)):
        print('   %-16s %8d bytes' % (f, os.path.getsize(os.path.join(OUT, f))))


if __name__ == '__main__':
    main()
