package com.wjf.dayan;

import android.app.Activity;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/**
 * 大衍占筮 Android 壳：全屏 WebView 承载由微信小程序转换而来的本地 Web 应用。
 * 所有筮法逻辑、样式与资源都在 assets/www 内，不依赖网络。
 */
public class MainActivity extends Activity {

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
        mWeb.setWebChromeClient(new WebChromeClient());

        if (Build.VERSION.SDK_INT >= 19) {
            WebView.setWebContentsDebuggingEnabled(true);
        }
        mWeb.loadUrl("file:///android_asset/www/index.html");
    }

    private final class Bridge {
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
