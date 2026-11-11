window.__T["pages/index/index"] = function (d) {
  with (d) {
    var __h0 = "";
    __h0 += "<div" + " class=\""+"page"+"\"" + ">";
    __h0 += "<div" + " class=\""+"hero"+"\"" + ">";
    __h0 += "<span" + " class=\""+"hero-title serif"+"\"" + ">";
    __h0 += "大衍占筮";
    __h0 += "</span>";
    __h0 += "<span" + " class=\""+"hero-sub"+"\"" + ">";
    __h0 += "刘君祖《易断全书》筮法 · 数字化";
    __h0 += "</span>";
    __h0 += "</div>";
    __h0 += "<div" + " class=\""+"illu"+"\"" + ">";
    __h0 += "<div" + " class=\""+"fly-ball"+"\"" + ">";
    __h0 += "</div>";
    __h0 += "<div" + " class=\""+"fly-arrow"+"\"" + ">";
    __h0 += "</div>";
    __h0 += "<div" + " class=\""+"mini-field"+"\"" + ">";
    __h0 += __each(balls, function(item, idx){ var __h1 = "";
    __h1 += "<div" + " class=\""+"ball"+"\""+" style=\""+"left:"+__E(__rpx(item.x))+";top:"+__E(__rpx(item.y))+";width:"+__E(__rpx(ballSize))+";height:"+__E(__rpx(ballSize))+"\""+" data-wxk=\""+__E((item && item["id"] != null) ? item["id"] : idx)+"\"" + ">";
    __h1 += "</div>";
    return __h1; });
    __h0 += "</div>";
    __h0 += "<span" + " class=\""+"illu-cap"+"\"" + ">";
    __h0 += "大衍之数五十，其用四十有九 · 拈出一枚不用";
    __h0 += "</span>";
    __h0 += "</div>";
    __h0 += "<div" + " class=\""+"ritual-card"+"\"" + ">";
    __h0 += "<span" + " class=\""+"ritual-line"+"\"" + ">";
    __h0 += "请闭目凝神";
    __h0 += "</span>";
    __h0 += "<span" + " class=\""+"ritual-strong serif"+"\"" + ">";
    __h0 += "心念所问之事";
    __h0 += "</span>";
    __h0 += "<span" + " class=\""+"ritual-line"+"\"" + ">";
    __h0 += "而后起卦";
    __h0 += "</span>";
    __h0 += "</div>";
    __h0 += "<div" + " class=\""+"tips"+"\"" + ">";
    __h0 += "分二由你亲手划线，挂一由程序代行";
    __h0 += "</div>";
    __h0 += "<div" + " class=\""+"tips sub"+"\"" + ">";
    __h0 += "太极既定：首爻八步，其后每爻七步 · 每步须你亲自推进";
    __h0 += "</div>";
    __h0 += "<button" + " class=\""+"btn"+"\""+" data-ev=\""+"tap:startDivine"+"\"" + ">";
    __h0 += "开 始 起 卦";
    __h0 += "</button>";
    __h0 += "<button" + " class=\""+"btn ghost"+"\""+" data-ev=\""+"tap:goHistory"+"\"" + ">";
    __h0 += "查 看 历 史";
    __h0 += "</button>";
    __h0 += "</div>";
    return __h0;
  }
};
window.__T["pages/divine/divine"] = function (d) {
  with (d) {
    var __h0 = "";
    __h0 += "<div" + " class=\""+"page dpage"+"\"" + ">";
    __h0 += "<div" + " class=\""+"dhead"+"\"" + ">";
    __h0 += "<span" + " class=\""+"dh-t serif"+"\"" + ">";
    __h0 += "大衍占筮";
    __h0 += "</span>";
    __h0 += "<span" + " class=\""+"dh-m"+"\"" + ">";
    __h0 += __E(metaText);
    __h0 += "</span>";
    __h0 += "</div>";
    __h0 += "<div" + " class=\""+"record"+"\"" + ">";
    __h0 += __each(yaoDots, function(item, idx){ var __h1 = "";
    __h1 += "<div" + " class=\""+"rec "+__E(item.cls)+"\""+" data-wxk=\""+__E((item && item["k"] != null) ? item["k"] : idx)+"\"" + ">";
    __h1 += "<span" + " class=\""+"rec-k"+"\"" + ">";
    __h1 += __E(item.k);
    __h1 += "</span>";
    __h1 += "<div" + " class=\""+"rec-v"+"\"" + ">";
    __h1 += __E(item.v);
    __h1 += "</div>";
    if (item.bian) {
    __h1 += "<span" + " class=\""+"rec-b"+"\"" + ">";
    __h1 += "变";
    __h1 += "</span>";
    }
    __h1 += "</div>";
    return __h1; });
    __h0 += "</div>";
    __h0 += "<div" + " class=\""+"taiji "+__E(taijiOn ? 'on' : '')+"\"" + ">";
    __h0 += "<div" + " class=\""+"tj-ring"+"\"" + ">";
    __h0 += "<div" + " class=\""+"tj-ball"+"\"" + ">";
    __h0 += "</div>";
    __h0 += "</div>";
    __h0 += "<div" + " class=\""+"tj-txt"+"\"" + ">";
    __h0 += "<div" + " class=\""+"tj-t"+"\"" + ">";
    __h0 += __E(taijiOn ? '挂 1 策 · 太 极' : '五 十 策 列 席');
    __h0 += "</div>";
    __h0 += "<div" + " class=\""+"tj-n"+"\"" + ">";
    __h0 += __E(taijiOn ? '起筮取一，虚一不用 · 十八变皆不参与' : '太极未立 · 点「下一步」自席上拈出一策');
    __h0 += "</div>";
    __h0 += "</div>";
    __h0 += "<div" + " class=\""+"tj-tag"+"\"" + ">";
    __h0 += __E(taijiOn ? '不 动' : '待 拈');
    __h0 += "</div>";
    __h0 += "</div>";
    __h0 += "<div" + " class=\""+"dbody"+"\"" + ">";
    __h0 += "<div" + " class=\""+"cwrap"+"\""+" style=\""+"width:"+__E(dia)+"px;height:"+__E(dia)+"px"+"\"" + ">";
    __h0 += "<div" + " class=\""+"pile-tag"+"\"" + ">";
    __h0 += "<span" + " class=\""+"pile-cap"+"\"" + ">";
    __h0 += "在 席";
    __h0 += "</span>";
    __h0 += "<span" + " class=\""+"pile-n serif"+"\"" + ">";
    __h0 += __E(pileCount);
    __h0 += "</span>";
    __h0 += "<span" + " class=\""+"pile-u"+"\"" + ">";
    __h0 += "策";
    __h0 += "</span>";
    __h0 += "</div>";
    __h0 += "<div" + " class=\""+"circl"+"\""+" id=\""+"ballField"+"\""+" style=\""+"width:"+__E(dia)+"px;height:"+__E(dia)+"px"+"\""+" data-ev=\""+"touchstart:onTouchStart;touchmove!:onTouchMove;touchend:onTouchEnd"+"\"" + ">";
    __h0 += __each(balls, function(item, idx){ var __h2 = "";
    __h2 += "<div" + " class=\""+"ball "+__E(item.cls)+"\""+" style=\""+"left:"+__E(item.x)+"px;top:"+__E(item.y)+"px;width:"+__E(ballSize)+"px;height:"+__E(ballSize)+"px;transition-duration:"+__E(item.d)+"ms;transition-delay:"+__E(item.dl)+"ms;animation-delay:"+__E(item.ad)+"ms"+"\""+" data-wxk=\""+__E((item && item["id"] != null) ? item["id"] : idx)+"\"" + ">";
    __h2 += "</div>";
    return __h2; });
    __h0 += "<canvas" + " type=\""+"2d"+"\""+" id=\""+"ink"+"\""+" class=\""+"ink"+"\""+" style=\""+"width:"+__E(dia)+"px;height:"+__E(dia)+"px"+"\""+" data-ev=\""+"touchstart:onTouchStart;touchmove!:onTouchMove;touchend:onTouchEnd"+"\""+" data-keep=\"1\"" + ">";
    __h0 += "</canvas>";
    __h0 += "<div" + " class=\""+"dtag dtag-l "+__E(splitDone ? 'on' : '')+"\"" + ">";
    __h0 += "左 ";
    __h0 += "<span" + " class=\""+"dtag-b"+"\"" + ">";
    __h0 += __E(leftCount);
    __h0 += "</span>";
    __h0 += "</div>";
    __h0 += "<div" + " class=\""+"dtag dtag-r "+__E(splitDone ? 'on' : '')+"\"" + ">";
    __h0 += "右 ";
    __h0 += "<span" + " class=\""+"dtag-b"+"\"" + ">";
    __h0 += __E(rightCount);
    __h0 += "</span>";
    __h0 += " · 挂 1";
    __h0 += "</div>";
    if (stepKey === 'yao') {
    __h0 += "<div" + " class=\""+"yao-calc"+"\"" + ">";
    __h0 += "<span" + " class=\""+"yc-cap"+"\"" + ">";
    __h0 += "三 变 余 策";
    __h0 += "</span>";
    __h0 += "<span" + " class=\""+"yc-eq"+"\"" + ">";
    __h0 += __E(yaoRemain)+" ÷ 4 ＝";
    __h0 += "</span>";
    __h0 += "<span" + " class=\""+"yc-num serif"+"\"" + ">";
    __h0 += __E(yaoNum);
    __h0 += "</span>";
    __h0 += "<div" + " class=\""+"yao-line "+__E(yaoYang ? 'yang' : 'yin')+"\"" + ">";
    __h0 += "</div>";
    __h0 += "</div>";
    }
    __h0 += "</div>";
    __h0 += "</div>";
    __h0 += "<div" + " class=\""+"pillars"+"\"" + ">";
    __h0 += __each(pillars, function(item, idx){ var __h3 = "";
    __h3 += "<div" + " class=\""+"pil"+"\""+" data-wxk=\""+__E((item && item["lab"] != null) ? item["lab"] : idx)+"\"" + ">";
    __h3 += "<span" + " class=\""+"pil-lab"+"\"" + ">";
    __h3 += __E(item.lab);
    __h3 += "</span>";
    __h3 += "<span" + " class=\""+"pil-num"+"\""+" style=\""+"color:"+__E(item.c)+"\"" + ">";
    __h3 += __E(item.val);
    __h3 += "</span>";
    __h3 += "<div" + " class=\""+"pil-dots"+"\"" + ">";
    __h3 += __each(item.dots, function(d, idx){ var __h4 = "";
    __h4 += "<div" + " class=\""+"bdot "+__E(item.done ? 'out' : 'g')+" "+__E(d.gap ? 'gap' : '')+"\""+" data-wxk=\""+__E((d && d["i"] != null) ? d["i"] : idx)+"\"" + ">";
    __h4 += "</div>";
    return __h4; });
    __h3 += "</div>";
    __h3 += "</div>";
    return __h3; });
    __h0 += "</div>";
    __h0 += "</div>";
    __h0 += "<div" + " class=\""+"stpname"+"\"" + ">";
    __h0 += __E(stepName);
    __h0 += "</div>";
    __h0 += "<div" + " class=\""+"steps"+"\"" + ">";
    __h0 += __each(rails, function(item, idx){ var __h5 = "";
    __h5 += "<div" + " class=\""+"stp "+__E(item.cls)+"\"" + ">";
    __h5 += __E(item.n);
    __h5 += "</div>";
    if (item.line) {
    __h5 += "<div" + " class=\""+"stp-line "+__E(item.lineCls)+"\"" + ">";
    __h5 += "</div>";
    }
    return __h5; });
    __h0 += "</div>";
    __h0 += "<div" + " class=\""+"dbot"+"\"" + ">";
    __h0 += "<button" + " class=\""+"btn "+__E(btnWait ? 'wait' : '')+"\""+" data-ev=\""+"tap:onNext"+"\"" + ">";
    __h0 += __E(btnText);
    __h0 += "</button>";
    __h0 += "<span" + " class=\""+"dhint"+"\"" + ">";
    __h0 += __E(hint);
    __h0 += "</span>";
    if (chips.length) {
    __h0 += "<div" + " class=\""+"chips"+"\"" + ">";
    __h0 += __each(chips, function(item, idx){ var __h6 = "";
    __h6 += "<div" + " class=\""+"chip "+__E(item.dark ? 'dark-chip' : '')+" "+__E(item.sum ? 'sum' : '')+"\""+" data-wxk=\""+__E((item && item["t"] != null) ? item["t"] : idx)+"\"" + ">";
    __h6 += __E(item.t);
    __h6 += "</div>";
    return __h6; });
    __h0 += "</div>";
    }
    if (stepKey === 'count') {
    __h0 += "<div" + " class=\""+"formula"+"\"" + ">";
    __h0 += "<span" + " class=\""+"f-cap"+"\"" + ">";
    __h0 += "本 变 余 策";
    __h0 += "</span>";
    __h0 += "<span" + " class=\""+"f-eq"+"\"" + ">";
    __h0 += __E(formulaText);
    __h0 += "</span>";
    __h0 += "<span" + " class=\""+"f-note"+"\"" + ">";
    __h0 += __E(formulaNote);
    __h0 += "</span>";
    __h0 += "</div>";
    }
    if (stepKey === 'hang') {
    __h0 += "<div" + " class=\""+"lock"+"\"" + ">";
    __h0 += "此步不可跳过 —— 须你亲自点「下一步」，太极之策方自席上拈出";
    __h0 += "</div>";
    }
    if (stepKey === 'split' && splitDone) {
    __h0 += "<div" + " class=\""+"relink"+"\""+" data-ev=\""+"tap:onRedraw"+"\"" + ">";
    __h0 += "重新划线";
    __h0 += "</div>";
    }
    __h0 += "</div>";
    __h0 += __each(fly, function(item, idx){ var __h7 = "";
    __h7 += "<div" + " class=\""+"flyball "+__E(item.sun ? 'sun' : '')+" "+__E(item.land ? 'land' : '')+"\""+" style=\""+"left:"+__E(item.x)+"px;top:"+__E(item.y)+"px;width:"+__E(item.size)+"px;height:"+__E(item.size)+"px;transform:translate("+__E(item.tx)+"px,"+__E(item.ty)+"px) scale("+__E(item.sc)+");transition-duration:"+__E(item.d)+"ms;transition-delay:"+__E(item.dl)+"ms"+"\""+" data-wxk=\""+__E((item && item["id"] != null) ? item["id"] : idx)+"\"" + ">";
    __h7 += "</div>";
    return __h7; });
    __h0 += "</div>";
    return __h0;
  }
};
window.__T["pages/result/result"] = function (d) {
  with (d) {
    var __h0 = "";
    __h0 += "<div" + " class=\""+"page"+"\"" + ">";
    if (ready) {
    __h0 += "<div" + " class=\""+"sec-title serif"+"\"" + ">";
    __h0 += "卦象生成";
    __h0 += "</div>";
    __h0 += "<div" + " class=\""+"rule"+"\"" + ">";
    __h0 += "</div>";
    __h0 += "<div" + " class=\""+"card verdict"+"\"" + ">";
    __h0 += "<span" + " class=\""+"verdict-k"+"\"" + ">";
    __h0 += "断占总结";
    __h0 += "</span>";
    __h0 += __each(summaryLines, function(item, idx){ var __h1 = "";
    __h1 += "<div" + " class=\""+"vline "+__E(item.last ? 'last' : '')+"\""+" data-wxk=\""+__E((item && item["key"] != null) ? item["key"] : idx)+"\"" + ">";
    __h1 += "<span" + " class=\""+"vk"+"\"" + ">";
    __h1 += __E(item.key);
    __h1 += "</span>";
    __h1 += "<span" + " class=\""+"vt serif"+"\"" + ">";
    __h1 += __E(item.text);
    __h1 += "</span>";
    __h1 += "</div>";
    return __h1; });
    __h0 += "</div>";
    __h0 += "<div" + " class=\""+"card"+"\"" + ">";
    __h0 += "<div" + " class=\""+"card-h"+"\"" + ">";
    __h0 += "<span" + " class=\""+"card-h-t"+"\"" + ">";
    __h0 += "本卦";
    __h0 += "</span>";
    __h0 += "<span" + " class=\""+"tag"+"\"" + ">";
    __h0 += __E(ben.tag);
    __h0 += "</span>";
    __h0 += "</div>";
    __h0 += "<div" + " class=\""+"hex-head"+"\"" + ">";
    __h0 += "<div" + " class=\""+"seal serif"+"\"" + ">";
    __h0 += __E(ben.shortName);
    __h0 += "</div>";
    __h0 += "<span" + " class=\""+"hex-name serif"+"\"" + ">";
    __h0 += __E(ben.name);
    __h0 += "</span>";
    __h0 += "</div>";
    __h0 += "<div" + " class=\""+"trigrams"+"\"" + ">";
    __h0 += __E(ben.upper)+" · "+__E(ben.lower);
    __h0 += "</div>";
    __h0 += "<div" + " class=\""+"hr"+"\"" + ">";
    __h0 += "</div>";
    __h0 += "<div" + " class=\""+"hex"+"\"" + ">";
    __h0 += __each(ben.lines, function(item, idx){ var __h2 = "";
    __h2 += "<div" + " class=\""+"hex-line "+__E(item.isYi ? 'yi' : '')+"\""+" data-wxk=\""+__E((item && item["label"] != null) ? item["label"] : idx)+"\"" + ">";
    __h2 += "<span" + " class=\""+"hex-label"+"\"" + ">";
    __h2 += __E(item.label);
    __h2 += "</span>";
    __h2 += "<div" + " class=\""+"hex-bars"+"\"" + ">";
    if (item.yang) {
    __h2 += "<div" + " class=\""+"bar "+__E(item.changing ? 'changing' : '')+"\"" + ">";
    __h2 += "</div>";
    }
    if (!item.yang) {
    __h2 += "<div" + " class=\""+"yin"+"\"" + ">";
    __h2 += "<div" + " class=\""+"bar half "+__E(item.changing ? 'changing' : '')+"\"" + ">";
    __h2 += "</div>";
    __h2 += "<div" + " class=\""+"bar half "+__E(item.changing ? 'changing' : '')+"\"" + ">";
    __h2 += "</div>";
    __h2 += "</div>";
    }
    __h2 += "</div>";
    __h2 += "<span" + " class=\""+"hex-val"+"\"" + ">";
    __h2 += __E(item.valueText);
    __h2 += "</span>";
    __h2 += "<div" + " class=\""+"marks"+"\"" + ">";
    if (item.changing) {
    __h2 += "<span" + " class=\""+"mk change"+"\"" + ">";
    __h2 += "变";
    __h2 += "</span>";
    }
    if (item.isYi) {
    __h2 += "<span" + " class=\""+"mk yi"+"\"" + ">";
    __h2 += "宜";
    __h2 += "</span>";
    }
    if (item.isMain) {
    __h2 += "<span" + " class=\""+"mk main"+"\"" + ">";
    __h2 += "主变数";
    __h2 += "</span>";
    }
    __h2 += "</div>";
    __h2 += "</div>";
    return __h2; });
    __h0 += "</div>";
    __h0 += "<div" + " class=\""+"legend"+"\"" + ">";
    __h0 += "<span>";
    __h0 += "朱红＝变爻";
    __h0 += "</span>";
    __h0 += "<span>";
    __h0 += "虚线＝宜变之爻";
    __h0 += "</span>";
    __h0 += "<span>";
    __h0 += "主变数＝相值";
    __h0 += "</span>";
    __h0 += "</div>";
    __h0 += "<span" + " class=\""+"lbl"+"\"" + ">";
    __h0 += "卦辞";
    __h0 += "</span>";
    __h0 += "<span" + " class=\""+"juan-text serif"+"\"" + ">";
    __h0 += __E(ben.judgment);
    __h0 += "</span>";
    __h0 += "<span" + " class=\""+"lbl"+"\"" + ">";
    __h0 += "爻辞";
    __h0 += "</span>";
    __h0 += "<div" + " class=\""+"ylist"+"\"" + ">";
    __h0 += __each(ben.yaoList, function(item, idx){ var __h3 = "";
    __h3 += "<div" + " class=\""+"yline "+__E(item.isMain ? 'main' : '')+"\""+" data-wxk=\""+__E((item && item["title"] != null) ? item["title"] : idx)+"\"" + ">";
    __h3 += "<span" + " class=\""+"yp"+"\"" + ">";
    __h3 += __E(item.title);
    __h3 += "</span>";
    __h3 += "<span" + " class=\""+"yc serif"+"\"" + ">";
    if (item.prefix) {
    __h3 += "<span" + " class=\""+"prefix "+__E(item.isRef ? 'ref' : '')+"\"" + ">";
    __h3 += __E(item.prefix);
    __h3 += "</span>";
    }
    __h3 += __E(item.text);
    __h3 += "</span>";
    __h3 += "</div>";
    return __h3; });
    __h0 += "</div>";
    __h0 += "</div>";
    __h0 += "<div" + " class=\""+"card"+"\"" + ">";
    __h0 += "<div" + " class=\""+"card-h"+"\"" + ">";
    __h0 += "<span" + " class=\""+"card-h-t"+"\"" + ">";
    __h0 += "变卦";
    __h0 += "</span>";
    __h0 += "<span" + " class=\""+"tag"+"\"" + ">";
    __h0 += __E(bian.tag);
    __h0 += "</span>";
    __h0 += "</div>";
    if (bian.mode == 'none') {
    __h0 += "<div" + " class=\""+"empty"+"\"" + ">";
    __h0 += "<span>";
    __h0 += "六爻皆静，之卦即本卦";
    __h0 += "</span>";
    __h0 += "<span>";
    __h0 += "依本卦卦辞卦象占断即可";
    __h0 += "</span>";
    __h0 += "</div>";
    }
    if (bian.mode != 'none') {
    __h0 += __each(bian.cards, function(card, idx){ var __h4 = "";
    __h4 += "<div" + " class=\""+"subcard "+__E(card.primary ? 'primary' : '')+" "+__E(card.mute ? 'mute' : '')+"\""+" data-wxk=\""+__E((card && card["title"] != null) ? card["title"] : idx)+"\"" + ">";
    __h4 += "<div" + " class=\""+"subcard-h"+"\"" + ">";
    __h4 += "<span" + " class=\""+"sub-t"+"\"" + ">";
    __h4 += __E(card.title);
    __h4 += "</span>";
    __h4 += "<span" + " class=\""+"badge"+"\"" + ">";
    __h4 += __E(card.badge);
    __h4 += "</span>";
    __h4 += "</div>";
    __h4 += "<div" + " class=\""+"subbody"+"\"" + ">";
    __h4 += "<div" + " class=\""+"minihex"+"\"" + ">";
    __h4 += __each(card.miniLines, function(item, idx){ var __h5 = "";
    __h5 += "<div" + " class=\""+"mline"+"\""+" data-wxk=\""+__E((item && item["key"] != null) ? item["key"] : idx)+"\"" + ">";
    if (item.yang) {
    __h5 += "<div" + " class=\""+"mbar full "+__E(item.changed ? 'c' : '')+"\"" + ">";
    __h5 += "</div>";
    }
    if (!item.yang) {
    __h5 += "<div" + " class=\""+"mbar-h"+"\"" + ">";
    __h5 += "<div" + " class=\""+"mbar half "+__E(item.changed ? 'c' : '')+"\"" + ">";
    __h5 += "</div>";
    __h5 += "<div" + " class=\""+"mbar half "+__E(item.changed ? 'c' : '')+"\"" + ">";
    __h5 += "</div>";
    __h5 += "</div>";
    }
    __h5 += "</div>";
    return __h5; });
    __h4 += "</div>";
    __h4 += "<div" + " class=\""+"subtxt"+"\"" + ">";
    __h4 += "<span" + " class=\""+"sub-nm serif"+"\"" + ">";
    __h4 += __E(card.name);
    __h4 += "</span>";
    __h4 += "<span" + " class=\""+"slbl"+"\"" + ">";
    __h4 += "卦辞";
    __h4 += "</span>";
    __h4 += "<span" + " class=\""+"sub-jc serif"+"\"" + ">";
    __h4 += __E(card.judgment);
    __h4 += "</span>";
    __h4 += "</div>";
    __h4 += "</div>";
    __h4 += "<span" + " class=\""+"slbl"+"\"" + ">";
    __h4 += "爻辞";
    __h4 += "</span>";
    __h4 += "<div" + " class=\""+"ylist"+"\"" + ">";
    __h4 += __each(card.yaoList, function(item, idx){ var __h6 = "";
    __h6 += "<div" + " class=\""+"yline "+__E(item.changed ? 'chg' : '')+"\""+" data-wxk=\""+__E((item && item["title"] != null) ? item["title"] : idx)+"\"" + ">";
    __h6 += "<span" + " class=\""+"yp"+"\"" + ">";
    __h6 += __E(item.title);
    __h6 += "</span>";
    __h6 += "<span" + " class=\""+"yc serif"+"\"" + ">";
    __h6 += __E(item.text);
    __h6 += "</span>";
    __h6 += "</div>";
    return __h6; });
    __h4 += "</div>";
    __h4 += "</div>";
    return __h4; });
    }
    __h0 += "</div>";
    if (question) {
    __h0 += "<div" + " class=\""+"question-line"+"\"" + ">";
    __h0 += "<span" + " class=\""+"ql-k"+"\"" + ">";
    __h0 += "所占事项";
    __h0 += "</span>";
    __h0 += "<span" + " class=\""+"ql-v serif"+"\"" + ">";
    __h0 += __E(question);
    __h0 += "</span>";
    __h0 += "</div>";
    }
    __h0 += "<div" + " class=\""+"time-line"+"\"" + ">";
    __h0 += __E(timeText);
    __h0 += "</div>";
    if (!saved) {
    __h0 += "<button" + " class=\""+"btn"+"\""+" data-ev=\""+"tap:onSave"+"\"" + ">";
    __h0 += "保 存 占 例";
    __h0 += "</button>";
    }
    __h0 += "<button" + " class=\""+"btn ghost"+"\""+" data-ev=\""+"tap:onRestart"+"\"" + ">";
    __h0 += "重 新 起 卦";
    __h0 += "</button>";
    __h0 += "<button" + " class=\""+"btn ghost"+"\""+" data-ev=\""+"tap:onHistory"+"\"" + ">";
    __h0 += "查 看 历 史";
    __h0 += "</button>";
    }
    if (asking) {
    __h0 += "<div" + " class=\""+"mask"+"\""+" data-ev=\""+"tap!:onCancelAsk"+"\"" + ">";
    __h0 += "<div" + " class=\""+"dialog"+"\""+" data-ev=\""+"tap!:noop"+"\"" + ">";
    __h0 += "<span" + " class=\""+"dlg-t serif"+"\"" + ">";
    __h0 += "所占事项";
    __h0 += "</span>";
    __h0 += "<span" + " class=\""+"dlg-d"+"\"" + ">";
    __h0 += "写下本次所问之事，保存后可在占例中回看";
    __h0 += "</span>";
    __h0 += "<input" + " class=\""+"dlg-input"+"\""+" value=\""+__E(questionInput)+"\""+" placeholder=\""+"如：求职、出行、家宅……"+"\""+" maxlength=\""+"40"+"\""+" focus=\""+__E(asking)+"\""+" confirm-type=\""+"done"+"\""+" data-ev=\""+"input:onQuestionInput;confirm:onConfirmAsk"+"\"" + ">";
    __h0 += "<div" + " class=\""+"dlg-btns"+"\"" + ">";
    __h0 += "<button" + " class=\""+"dlg-btn ghost"+"\""+" data-ev=\""+"tap!:onCancelAsk"+"\"" + ">";
    __h0 += "取 消";
    __h0 += "</button>";
    __h0 += "<button" + " class=\""+"dlg-btn"+"\""+" data-ev=\""+"tap!:onConfirmAsk"+"\"" + ">";
    __h0 += "保 存";
    __h0 += "</button>";
    __h0 += "</div>";
    __h0 += "</div>";
    __h0 += "</div>";
    }
    __h0 += "</div>";
    return __h0;
  }
};
window.__T["pages/history/history"] = function (d) {
  with (d) {
    var __h0 = "";
    __h0 += "<div" + " class=\""+"page"+"\"" + ">";
    __h0 += "<div" + " class=\""+"sec-title serif"+"\"" + ">";
    __h0 += "占 例";
    __h0 += "</div>";
    __h0 += "<div" + " class=\""+"rule"+"\"" + ">";
    __h0 += "</div>";
    if (empty) {
    __h0 += "<div" + " class=\""+"empty"+"\"" + ">";
    __h0 += "<span" + " class=\""+"empty-icon"+"\"" + ">";
    __h0 += "○";
    __h0 += "</span>";
    __h0 += "<span" + " class=\""+"empty-title"+"\"" + ">";
    __h0 += "尚无占例";
    __h0 += "</span>";
    __h0 += "<span" + " class=\""+"empty-desc"+"\"" + ">";
    __h0 += "起一卦并保存后，可在此回看";
    __h0 += "</span>";
    __h0 += "<button" + " class=\""+"btn"+"\""+" data-ev=\""+"tap:onBack"+"\"" + ">";
    __h0 += "开 始 起 卦";
    __h0 += "</button>";
    __h0 += "</div>";
    }
    __h0 += __each(list, function(item, idx){ var __h1 = "";
    __h1 += "<div" + " class=\""+"item"+"\""+" data-id=\""+__E(item.id)+"\""+" data-ev=\""+"tap:onOpen;longpress:onDelete"+"\""+" data-wxk=\""+__E((item && item["id"] != null) ? item["id"] : idx)+"\"" + ">";
    __h1 += "<div" + " class=\""+"item-main"+"\"" + ">";
    __h1 += "<span" + " class=\""+"item-name serif"+"\"" + ">";
    __h1 += __E(item.name);
    __h1 += "</span>";
    if (item.question) {
    __h1 += "<span" + " class=\""+"item-q"+"\"" + ">";
    __h1 += "所占 · "+__E(item.question);
    __h1 += "</span>";
    }
    if (item.changedName) {
    __h1 += "<span" + " class=\""+"item-sub"+"\"" + ">";
    __h1 += "之卦 "+__E(item.changedName);
    __h1 += "</span>";
    }
    __h1 += "<span" + " class=\""+"item-sub"+"\"" + ">";
    __h1 += "六爻不变";
    __h1 += "</span>";
    __h1 += "</div>";
    __h1 += "<div" + " class=\""+"item-side"+"\"" + ">";
    __h1 += "<div" + " class=\""+"seal-sm serif"+"\"" + ">";
    __h1 += __E(item.shortName);
    __h1 += "</div>";
    __h1 += "<span" + " class=\""+"item-time"+"\"" + ">";
    __h1 += __E(item.timeText);
    __h1 += "</span>";
    __h1 += "</div>";
    __h1 += "</div>";
    return __h1; });
    __h0 += "<div" + " class=\""+"img-note"+"\"" + ">";
    __h0 += "点击查看详情 · 长按删除";
    __h0 += "</div>";
    __h0 += "<button" + " class=\""+"btn ghost"+"\""+" data-ev=\""+"tap:onBack"+"\"" + ">";
    __h0 += "返 回 首 页";
    __h0 += "</button>";
    __h0 += "</div>";
    return __h0;
  }
};