package com.wjf.dayan;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.JsResult;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;

/**
 * 大衍占筮 Android 壳：全屏 WebView 承载由微信小程序转换而来的本地 Web 应用。
 * 所有筮法逻辑、样式与资源都在 assets/www 内，不依赖网络。
 *
 * 占例历史写在 app 私有文件 files/dayan_sessions.json（见 Bridge）。
 * 该文件位于 /data/data/com.wjf.dayan/files/，覆盖安装（升级）时不会被清除，
 * 并被 android:allowBackup 纳入备份；因此不要用「先卸载再安装」的方式升级。
 */
public class MainActivity extends Activity {

    private static final String SESSIONS_FILE = "dayan_sessions.json";

    private WebView mWeb;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        mWeb = new WebView(this);
        setContentView(mWeb);

        WebSettings s = mWeb.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setAllowFileAccess(true);
        s.setAllowContentAccess(true);
        s.setLoadWithOverviewMode(false);
        s.setUseWideViewPort(false);
        s.setSupportZoom(false);
        s.setBuiltInZoomControls(false);
        s.setTextZoom(100);
        s.setDefaultFontSize(16);
        s.setCacheMode(WebSettings.LOAD_NO_CACHE);
        if (Build.VERSION.SDK_INT >= 21) {
            s.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }

        mWeb.setBackgroundColor(Color.parseColor("#f5f6f8"));
        mWeb.setOverScrollMode(View.OVER_SCROLL_NEVER);
        mWeb.setHorizontalScrollBarEnabled(false);
        mWeb.setVerticalScrollBarEnabled(false);
        mWeb.setLongClickable(false);
        mWeb.setOnLongClickListener(new View.OnLongClickListener() {
            @Override
            public boolean onLongClick(View v) {
                return true;                 // 屏蔽长按菜单，longpress 交给页面自己处理
            }
        });
        mWeb.addJavascriptInterface(new Bridge(), "Android");
        mWeb.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                return false;
            }
        });
        mWeb.setWebChromeClient(new WebChromeClient() {
            /* 默认 WebChromeClient 不显示 JS 的 alert/confirm，会让
               wx.showModal（历史页「删除占例」）永远返回取消。 */
            @Override
            public boolean onJsConfirm(WebView view, String url, String message,
                                       final JsResult result) {
                new AlertDialog.Builder(MainActivity.this)
                        .setMessage(message)
                        .setCancelable(false)
                        .setPositiveButton(android.R.string.ok,
                                new DialogInterface.OnClickListener() {
                                    @Override
                                    public void onClick(DialogInterface d, int w) {
                                        result.confirm();
                                    }
                                })
                        .setNegativeButton(android.R.string.cancel,
                                new DialogInterface.OnClickListener() {
                                    @Override
                                    public void onClick(DialogInterface d, int w) {
                                        result.cancel();
                                    }
                                })
                        .setOnCancelListener(new DialogInterface.OnCancelListener() {
                            @Override
                            public void onCancel(DialogInterface d) {
                                result.cancel();
                            }
                        })
                        .show();
                return true;
            }
        });

        if (Build.VERSION.SDK_INT >= 19) {
            WebView.setWebContentsDebuggingEnabled(true);
        }
        mWeb.loadUrl("file:///android_asset/www/index.html");
    }

    /** 原子写：先写 .tmp 再改名，避免中途退出留下半截 JSON。 */
    private void writeSessions(String json) {
        FileOutputStream out = null;
        try {
            File dir = getFilesDir();
            File tmp = new File(dir, SESSIONS_FILE + ".tmp");
            out = new FileOutputStream(tmp);
            out.write(json.getBytes("UTF-8"));
            out.flush();
            out.close();
            out = null;
            File dst = new File(dir, SESSIONS_FILE);
            if (!tmp.renameTo(dst)) {
                FileOutputStream direct = new FileOutputStream(dst);
                direct.write(json.getBytes("UTF-8"));
                direct.flush();
                direct.close();
                tmp.delete();
            }
        } catch (Exception ignored) {
        } finally {
            if (out != null) {
                try { out.close(); } catch (Exception ignored) {}
            }
        }
    }

    private String readSessions() {
        FileInputStream in = null;
        try {
            File f = new File(getFilesDir(), SESSIONS_FILE);
            if (!f.exists()) return "";
            in = new FileInputStream(f);
            ByteArrayOutputStream buf = new ByteArrayOutputStream();
            byte[] b = new byte[4096];
            int n;
            while ((n = in.read(b)) > 0) buf.write(b, 0, n);
            return new String(buf.toByteArray(), "UTF-8");
        } catch (Exception ignored) {
            return "";
        } finally {
            if (in != null) {
                try { in.close(); } catch (Exception ignored) {}
            }
        }
    }

    private final class Bridge {
        /** 供 runtime.js 的 wx.getStorageSync 读取占例，返回与 localStorage 相同的 {__v:...} 包装。 */
        @JavascriptInterface
        public String getSessions() {
            return readSessions();
        }

        /** 供 runtime.js 的 wx.setStorageSync 双写占例。 */
        @JavascriptInterface
        public void setSessions(String json) {
            writeSessions(json == null ? "" : json);
        }

        @JavascriptInterface
        public void finishApp() {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    finish();
                }
            });
        }
    }

    @Override
    public void onBackPressed() {
        // 先让页面栈回退；若已在首页，由 JS 调用 Android.finishApp()
        mWeb.evaluateJavascript("window.__back && window.__back()", null);
    }

    @Override
    protected void onDestroy() {
        if (mWeb != null) {
            mWeb.destroy();
            mWeb = null;
        }
        super.onDestroy();
    }
}
