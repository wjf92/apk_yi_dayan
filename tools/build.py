#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""一键构建：转换小程序 → 编译 Java → dex → aapt2 → 对齐 → 签名 → APK。

不依赖 Gradle / Android Studio / 网络；只用本机 JDK8 + 下载好的 build-tools。
用法：python3 tools/build.py
"""
import os
import re
import sys
import stat
import shutil
import zipfile
import subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOOLS = os.path.join(ROOT, 'tools')
MAIN = os.path.join(ROOT, 'app', 'src', 'main')
ASSETS = os.path.join(MAIN, 'assets')
RES = os.path.join(MAIN, 'res')
MANIFEST = os.path.join(MAIN, 'AndroidManifest.xml')
JAVA_SRC = os.path.join(MAIN, 'java', 'com', 'wjf', 'dayan', 'MainActivity.java')
BUILD = os.path.join(ROOT, 'build')
DIST = os.path.join(ROOT, 'dist')
SDK = os.path.expanduser('~/.workbuddy/android-sdk')
BT = os.path.join(SDK, 'build-tools', '33.0.1')
ANDROID_JAR = os.path.join(SDK, 'platforms', 'android-30', 'android.jar')
AAPT2 = os.path.join(BT, 'aapt2')
ZIPALIGN = os.path.join(BT, 'zipalign')
APKSIGNER = os.path.join(BT, 'apksigner')
D8_JAR = os.path.join(BT, 'lib', 'd8.jar')
OUT_APK = os.path.join(DIST, 'dayan.apk')
KS = os.path.join(ROOT, 'dayan.jks')
# 本地自签名测试密钥的口令，可用环境变量覆盖；密钥本身不入库
KS_PASS = os.environ.get('DAYAN_KS_PASS', 'dayan123')


def run(cmd, quiet=False):
    print('  $ ' + ' '.join(str(x) for x in cmd))
    if quiet:
        p = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        if p.returncode:
            print(p.stdout.decode('utf-8', 'replace'))
            raise SystemExit('命令失败：' + str(cmd[0]))
        return p.stdout.decode('utf-8', 'replace')
    subprocess.run(cmd, check=True)
    return ''


def executable(p):
    st = os.stat(p)
    os.chmod(p, st.st_mode | stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)


def main():
    for p in (AAPT2, ZIPALIGN, APKSIGNER, ANDROID_JAR, D8_JAR):
        if not os.path.exists(p):
            raise SystemExit('缺少构建工具：' + p + '\n请先确认 ~/.workbuddy/android-sdk 已就绪')
    for p in (AAPT2, ZIPALIGN, APKSIGNER):
        executable(p)

    # 版本信息以 AndroidManifest.xml 为唯一来源；aapt2 link 的 --version-code
    # 会覆盖 manifest，这里读出来传回去，避免升级时版本号始终停在 1。
    manifest_xml = open(MANIFEST, encoding='utf-8').read()
    m = re.search(r'android:versionCode="(\d+)"', manifest_xml)
    version_code = m.group(1) if m else '1'
    m = re.search(r'android:versionName="([^"]+)"', manifest_xml)
    version_name = m.group(1) if m else '1.0'
    print('\n版本 %s (code %s) · 签名密钥 %s' % (version_name, version_code, os.path.basename(KS)))
    if not os.path.exists(KS):
        print('      注意：首次生成密钥；后续升级务必沿用同一密钥，否则必须卸载重装')

    print('\n[1/8] 转换小程序为 WebView 应用')
    run([sys.executable, os.path.join(TOOLS, 'convert.py')], quiet=True)

    shutil.rmtree(BUILD, ignore_errors=True)
    os.makedirs(BUILD)
    os.makedirs(DIST, exist_ok=True)
    base_apk = os.path.join(BUILD, 'base.apk')
    unsigned = os.path.join(BUILD, 'unsigned.apk')
    aligned = os.path.join(BUILD, 'aligned.apk')
    classes = os.path.join(BUILD, 'classes')
    dexdir = os.path.join(BUILD, 'dex')
    os.makedirs(classes)
    os.makedirs(dexdir)

    print('\n[2/8] aapt2 编译图标资源、打包 assets')
    if not os.path.exists(os.path.join(RES, 'mipmap-mdpi', 'ic_launcher.png')):
        run([sys.executable, os.path.join(TOOLS, 'make_icon.py')], quiet=True)
    flat = os.path.join(BUILD, 'res.zip')
    run([AAPT2, 'compile', '--dir', RES, '-o', flat], quiet=True)
    run([AAPT2, 'link', '-o', base_apk, '-I', ANDROID_JAR,
         '--manifest', MANIFEST, '-A', ASSETS, '-R', flat, '--auto-add-overlay',
         '--min-sdk-version', '21', '--target-sdk-version', '30',
         '--version-code', version_code, '--version-name', version_name], quiet=True)

    print('\n[3/8] javac 编译 MainActivity')
    run(['javac', '-source', '8', '-target', '8', '-classpath', ANDROID_JAR,
         '-d', classes, JAVA_SRC], quiet=True)
    classfiles = []
    for b, d, fs in os.walk(classes):
        classfiles += [os.path.join(b, f) for f in fs if f.endswith('.class')]
    print('       class 文件 %d 个' % len(classfiles))

    print('\n[4/8] D8 生成 classes.dex')
    run(['java', '-cp', D8_JAR, 'com.android.tools.r8.D8',
         '--lib', ANDROID_JAR, '--min-api', '21', '--output', dexdir] + classfiles, quiet=True)
    dex = os.path.join(dexdir, 'classes.dex')
    if not os.path.exists(dex):
        raise SystemExit('dex 未生成')

    print('\n[5/8] 合并 dex 进 APK')
    with zipfile.ZipFile(base_apk, 'r') as zin, zipfile.ZipFile(unsigned, 'w') as zout:
        for info in zin.infolist():
            zout.writestr(info, zin.read(info.filename))
        zout.write(dex, 'classes.dex', compress_type=zipfile.ZIP_STORED)

    print('\n[6/8] zipalign 对齐')
    run([ZIPALIGN, '-f', '4', unsigned, aligned], quiet=True)

    print('\n[7/8] 生成签名并签名')
    if not os.path.exists(KS):
        run(['keytool', '-genkeypair', '-alias', 'dayan', '-keyalg', 'RSA',
             '-keysize', '2048', '-validity', '10000', '-keystore', KS,
             '-storepass', KS_PASS, '-keypass', KS_PASS,
             '-dname', 'CN=Dayan, OU=Personal, O=Dayan, L=Shanghai, ST=Shanghai, C=CN'], quiet=True)
    if os.path.exists(OUT_APK):
        os.remove(OUT_APK)
    run([APKSIGNER, 'sign', '--ks', KS, '--ks-pass', 'pass:' + KS_PASS,
         '--key-pass', 'pass:' + KS_PASS, '--v1-signing-enabled', 'true',
         '--v2-signing-enabled', 'true', '--out', OUT_APK, aligned], quiet=True)

    print('\n[8/8] 验签与内容核对')
    out = run([APKSIGNER, 'verify', '--verbose', OUT_APK], quiet=True)
    print('\n'.join('       ' + l for l in out.strip().splitlines()[:8]))

    with zipfile.ZipFile(OUT_APK) as z:
        names = z.namelist()
        www = [n for n in names if n.startswith('assets/www/') and not n.endswith('/')]
        need = ['AndroidManifest.xml', 'classes.dex', 'resources.arsc',
                'assets/www/index.html', 'assets/www/runtime.js',
                'assets/www/templates.js', 'assets/www/bundle.js', 'assets/www/app.css']
        missing = [n for n in need if n not in names]
        print('       APK 条目 %d 个，assets/www 文件 %d 个，缺失 %s'
              % (len(names), len(www), missing or '无'))
        if missing:
            raise SystemExit('APK 内容不完整')
    print('\n✅ 打包完成：%s （%.1f KB）' % (OUT_APK, os.path.getsize(OUT_APK) / 1024.0))


if __name__ == '__main__':
    main()
