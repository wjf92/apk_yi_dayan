#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""生成 launcher 图标（纯标准库写 PNG，无第三方依赖）。

深墨圆角方底 + 米白环 + 阴阳鱼，呼应小程序的水墨/朱红配色。
输出 app/src/main/res/mipmap-*/ic_launcher.png，供 aapt2 compile 打包。
"""
import os
import math
import zlib
import struct

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RES = os.path.join(ROOT, 'app', 'src', 'main', 'res')
DENSITIES = [
    ('mipmap-mdpi', 48),
    ('mipmap-hdpi', 72),
    ('mipmap-xhdpi', 96),
    ('mipmap-xxhdpi', 144),
    ('mipmap-xxxhdpi', 192),
]

BG = (38, 49, 59)        # 深墨
INK = (24, 30, 36)       # 阴
PAPER = (247, 243, 232)  # 阳 / 米白


def rounded_rect(x, y, S, r):
    cx = min(max(x, r), S - r)
    cy = min(max(y, r), S - r)
    if (x < r or x > S - r) and (y < r or y > S - r):
        return (x - cx) ** 2 + (y - cy) ** 2 <= r * r
    return True


def render(S):
    cx = cy = (S - 1) / 2.0
    R = S * 0.345
    corner = S * 0.22
    rows = []
    for y in range(S):
        row = bytearray([0])            # PNG filter: None
        for x in range(S):
            if not rounded_rect(x, y, S, corner):
                row += bytes((0, 0, 0, 0))
                continue
            u = (x - cx) / R
            v = (y - cy) / R
            d2 = u * u + v * v
            if d2 <= (1 + 3.0 / R) ** 2:
                # 米白外环
                col = PAPER
                if d2 <= 1.0:
                    yang = 1 if u > 0 else 0
                    if u * u + (v - 0.5) ** 2 < 0.25:      # 下方小圆并入阳
                        yang = 1
                    if u * u + (v + 0.5) ** 2 < 0.25:      # 上方小圆并入阴
                        yang = 0
                    if u * u + (v - 0.5) ** 2 < 0.018:     # 阴眼
                        yang = 0
                    if u * u + (v + 0.5) ** 2 < 0.018:     # 阳眼
                        yang = 1
                    col = PAPER if yang else INK
            else:
                col = BG
            row += bytes((col[0], col[1], col[2], 255))
        rows.append(bytes(row))
    return b''.join(rows)


def chunk(tag, data):
    return (struct.pack('>I', len(data)) + tag + data +
            struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff))


def write_png(path, S, raw):
    ihdr = struct.pack('>IIBBBBB', S, S, 8, 6, 0, 0, 0)  # RGBA8
    png = (b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', ihdr) +
           chunk(b'IDAT', zlib.compress(raw, 9)) + chunk(b'IEND', b''))
    with open(path, 'wb') as f:
        f.write(png)


def main():
    for name, S in DENSITIES:
        d = os.path.join(RES, name)
        os.makedirs(d, exist_ok=True)
        p = os.path.join(d, 'ic_launcher.png')
        write_png(p, S, render(S))
        print('  %-18s %3dpx  %5d B' % (name, S, os.path.getsize(p)))


if __name__ == '__main__':
    main()
