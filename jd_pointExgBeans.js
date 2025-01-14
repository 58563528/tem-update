/*
活动名称：积分兑换京豆 · 超级会员
活动链接：https://cjhy-isv.isvjcloud.com/mc/wxPointShopView/pointExgBeans?venderId=<店铺id>&giftId=<活动id>
环境变量：jd_pointExgBeans_activityUrl // 活动链接

*/
if (process.env.proxy_wind === 'true') {const setGlobalHttpProxy = require('./utils/proxy-wind.js');setGlobalHttpProxy();}
let lnrun = 0;


const $ = new Env('积分兑换京豆（超级会员）')
const notify = $.isNode() ? require('./sendNotify') : ''
const jdCookieNode = $.isNode() ? require('./jdCookie') : ''
const getToken = require('./function/getToken')

let lz_cookie = {},
  activityCookie = "",
  cookiesArr = [],
  cookie = "",
  message = "",
  activityUrl = process.env.jd_pointExgBeans_activityUrl ? process.env.jd_pointExgBeans_activityUrl : "";
if ($.isNode()) {
  if (JSON.stringify(process.env).indexOf("GITHUB") > -1) process.exit(0);
  Object.keys(jdCookieNode).forEach(lIili1iI => {
    cookiesArr.push(jdCookieNode[lIili1iI]);
  });
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === "false") console.log = () => {};
} else cookiesArr = [$.getdata("CookieJD"), $.getdata("CookieJD2"), ...$.toObj($.getdata("CookiesJD") || "[]").map(I11l1lli => I11l1lli.cookie)].filter(ii1lIiii => !!ii1lIiii);
if (activityUrl) {
  activityId = getQueryString("" + activityUrl, "giftId");
  venderId = getQueryString("" + activityUrl, "venderId");
  $.domain = activityUrl.match(/https?:\/\/([^/]+)/)[1];
} else {
  console.log("请填写活动链接");
  return;
}
let domains = "https://" + $.domain;
!(async () => {
  if (!activityId) {
    console.log("活动id不存在！");
    return;
  }
  if (!venderId) {
    console.log("店铺id不存在！");
    return;
  }
  console.log("活动入口：https://cjhy-isv.isvjcloud.com/mc/wxPointShopView/pointExgBeans?venderId=" + venderId + "&giftId=" + activityId);
  console.log("店铺会员：https://shopmember.m.jd.com/shopcard/?venderId=" + venderId);
  if (!cookiesArr[0]) {
    $.msg($.name, "【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取", "https://bean.m.jd.com/", {
      "open-url": "https://bean.m.jd.com/"
    });
    return;
  }
  for (let iililIli = 0; iililIli < cookiesArr.length; iililIli++) {
    if (cookiesArr[iililIli]) {
      cookie = cookiesArr[iililIli];
      originCookie = cookiesArr[iililIli];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1]);
      $.index = iililIli + 1;
      $.isLogin = true;
      $.nickName = "";
      console.log("\n******开始【京东账号" + $.index + "】" + ($.nickName || $.UserName) + "******\n");
      let Interval = process.env.jd_jk_interval || 60 * 1000;console.log("环境变量jd_task_interval已设置为"+Interval/1000+"秒");lnrun++;if(lnrun == 3){console.log(`\n【访问接口次数达到2次，休息一分钟.....】\n`);await $.wait(Interval);lnrun = 0}
      if (!$.isLogin) {
        $.msg($.name, "【提示】cookie已失效", "京东账号" + $.index + " " + ($.nickName || $.UserName) + "\n请重新登录获取\nhttps://bean.m.jd.com/", {
          "open-url": "https://bean.m.jd.com/"
        });
        if ($.isNode()) {
          await notify.sendNotify($.name + "cookie已失效 - " + $.UserName, "京东账号" + $.index + " " + $.UserName + "\n请重新登录获取cookie");
        }
        continue;
      }
      getUA();
      await pointExgBeans();
      await $.wait(2000);
      if ($.activityEnd || $.outFlag) break;
    }
  }
})().catch(liliI1lI => {
  $.log("", " " + $.name + ", 失败! 原因: " + liliI1lI + "!", "");
}).finally(() => {
  $.done();
});
async function pointExgBeans() {
  $.exgBeanNum = 1;
  $.buyerPoints = 0;
  $.canExgByPeopDay = 0;
  $.canExgByActivity = 0;
  $.newnums = 0;
  $.sid = "";
  $.venderId = venderId;
  $.token = "";
  $.Pin = "";
  $.hisPin = "";
  $.card = [];
  $.getPrize = false;
  $.exgStop = false;
  await getCk();
  if ($.activityEnd) return;
  if ($.outFlag) {
    console.log("此ip已被限制，请过更换IP后或者等待一会儿再执行脚本\n");
    return;
  }
  $.token = await getToken(originCookie, domains);
  if ($.token == "") {
    console.log("获取[token]失败！");
    return;
  }
  await $.wait(1000);
  if ($.venderId) {
    if ($.token) await getPin();
    if (!$.Pin) {
      console.log("未能获取用户鉴权信息！");
      return;
    }
    await $.wait(1000);
    await accessLog();
    await $.wait(500);
    await selectBeansForC();
    if ($.remainNum === 0) {
      console.log("当前京豆库存：" + $.remainNum + " / " + $.num + " 🐶");
      console.log("\n当前活动的京豆已全部发放完了，下次早点来吧~");
      $.activityEnd = true;
      return;
    }
    if ($.canExgByActivity === 0) {
      console.log("⛔️ 活动参与兑换数量已达到上限，没有可兑换的京豆了，下期再来吧~");
      return;
    }
    if ($.canExgByPeopDay === 0 && $.exgTimeType != 1) {
      console.log("⛔️ 今日用户可兑换次数已耗尽，明天再来吧~");
      return;
    }
    if ($.canExgTime === 0) {
      console.log("⛔️ 当前活动内用户可兑换次数已耗尽，下期再来吧~");
      return;
    }
    await $.wait(1000);
    await getBuyerPoints();
    if ($.grade === 0) {
      console.log("⛔️ 活动仅限店铺会员参与");
      return;
    }
    if ($.buyerPoints == 0) {
      console.log("⛔️ 用户当前没有积分");
      return;
    }
    await $.wait(1000);
    console.log("当前京豆库存：" + $.remainNum + " / " + $.num);
    console.log("用户等级：" + $.grade + " | 当前积分：" + $.buyerPoints);
    let ll1liiiI = null;
    switch (String($.grade)) {
      case "0":
        ll1liiiI = $.point0;
        break;
      case "1":
        ll1liiiI = $.point1;
        break;
      case "2":
        ll1liiiI = $.point2;
        break;
      case "3":
        ll1liiiI = $.point3;
        break;
      case "4":
        ll1liiiI = $.point4;
        break;
      case "5":
        ll1liiiI = $.point5;
        break;
    }
    if (ll1liiiI === null) {
      console.log("\n⛔️ 用户当前会员等级不符合兑换要求");
      return;
    }
    $.exgBeanNum = parseInt($.buyerPoints / ll1liiiI);
    if ($.buyerPoints < $.exgBeanNum) {
      console.log("\n⛔️ 用户积分不足");
      return;
    }
    if ($.exgStyle === 1) {
      if ($.exgBeanNum >= $.beansLevelCount) {
        $.exgBeanNum = $.beansLevelCount;
      } else {
        console.log("\n⛔️ 用户积分不足");
        return;
      }
    } else {
      if ($.canExgByPeopDay && $.canExgByActivity) $.exgBeanNum = Math.min($.exgBeanNum, $.canExgByPeopDay, $.canExgByActivity);else {
        if ($.canExgByPeopDay) {
          $.exgBeanNum = Math.min($.exgBeanNum, $.canExgByPeopDay);
        } else $.canExgByActivity && ($.exgBeanNum = Math.min($.exgBeanNum, $.canExgByActivity));
      }
    }
    if (!$.exgBeanNum || $.exgBeanNum <= 0) {
      console.log("\n⛔️ 用户积分不足或不符合兑换规则~");
      return;
    }
    console.log("");
    for (let ii11l1li = 0; ii11l1li < 20; ii11l1li++) {
      await exgBeans();
      if ($.getPrize || $.exgStop || $.activityEnd) break;
      await $.wait(1000);
    }
    !$.getPrize && !$.exgStop && !$.activityEnd && console.log("\n⛔️ 已尝试多次，未能兑换" + $.exgBeanNum + "京豆");
  } else {
    console.log("未能获取活动信息（店铺ID）");
    $.activityEnd = true;
  }
}
function showMsg() {
  return new Promise(lIIiiii => {
    $.msg($.name, "", "【京东账号" + $.index + "】" + $.nickName + "\n" + message);
    lIIiiii();
  });
}
function getSimpleActInfoVo() {
  return new Promise(iII111II => {
    let lll1Il = "activityId=" + activityId;
    $.post(taskPostUrl("/customer/getSimpleActInfoVo", lll1Il), async (llli1lI, IlII1il1, IilI11lI) => {
      try {
        if (llli1lI) {
          console.log(String(llli1lI));
          console.log($.name + " getSimpleActInfoVo API请求失败，请检查网路重试");
        } else {}
      } catch (i1liiii) {
        $.logErr(i1liiii, IlII1il1);
      } finally {
        iII111II();
      }
    });
  });
}
function getCk() {
  return new Promise(II1llIll => {
    let IIIi1iI1 = {
      "url": activityUrl,
      "headers": {
        "User-Agent": $.UA
      }
    };
    $.get(IIIi1iI1, async (iIIi1I, iil1I1, liiiil1i) => {
      try {
        if (iIIi1I) {
          if (iil1I1 && typeof iil1I1.statusCode != "undefined") {
            iil1I1.statusCode == 493 && (console.log("getCk 此ip已被限制，请过10分钟后再执行脚本"), $.outFlag = true);
          }
          console.log("" + JSON.stringify(iIIi1I));
          console.log($.name + " cookie API请求失败，请检查网路重试");
        } else {
          let I1IlilI1 = liiiil1i.match(/(活动已结束)/) && liiiil1i.match(/(活动已结束)/)[1] || liiiil1i.match(/(活动尚未开始)/) && liiiil1i.match(/(活动尚未开始)/)[1] || "";
          I1IlilI1 && ($.activityEnd = true, console.log("活动已结束或者未开始"));
          if (iil1I1.status == 200) {
            refreshToken(iil1I1);
          }
        }
      } catch (iliI1ii1) {
        $.logErr(iliI1ii1, iil1I1);
      } finally {
        II1llIll();
      }
    });
  });
}
function getPin() {
  return new Promise(iIill1I => {
    let iiIi1l11 = "userId=" + $.venderId + "&token=" + $.token + "&fromType=APP";
    $.post(taskPostUrl("/customer/getMyPing", iiIi1l11), async (I1IIiIi, iiliI1Ii, i1iiI11I) => {
      try {
        if (I1IIiIi) {
          console.log("" + JSON.stringify(I1IIiIi));
          console.log($.name + " 3 API请求失败，请检查网路重试");
        } else {
          iiliI1Ii.status == 200 && refreshToken(iiliI1Ii);
          if (safeGet(i1iiI11I)) {
            i1iiI11I = JSON.parse(i1iiI11I);
            if (i1iiI11I.result && i1iiI11I.data) {
              $.Pin = i1iiI11I.data.secretPin;
              $.AUTH_C_USER = $.Pin;
              $.attrTouXiang = i1iiI11I.data.yunMidImageUrl ? i1iiI11I.data.yunMidImageUrl : "https://img10.360buyimg.com/imgzone/jfs/t1/21383/2/6633/3879/5c5138d8E0967ccf2/91da57c5e2166005.jpg";
              $.nickName = i1iiI11I.data.pin;
            } else {}
          }
        }
      } catch (Ii1il1l1) {
        $.logErr(Ii1il1l1, iiliI1Ii);
      } finally {
        iIill1I();
      }
    });
  });
}
async function joinShop() {
  if (!$.joinVenderId) return;
  return new Promise(async i1i1llll => {
    $.errorJoinShop = "活动太火爆，请稍后再试";
    let IiIlll1i = "";
    if ($.shopactivityId) IiIlll1i = ",\"activityId\":" + $.shopactivityId;
    const llilliii = "{\"venderId\":\"" + $.joinVenderId + "\",\"shopId\":\"" + $.joinVenderId + "\",\"bindByVerifyCodeFlag\":1,\"registerExtend\":{},\"writeChildFlag\":0" + IiIlll1i + ",\"channel\":406}",
      il1iii = {
        "appid": "jd_shop_member",
        "functionId": "bindWithVender",
        "clientVersion": "9.2.0",
        "client": "H5",
        "body": JSON.parse(llilliii)
      },
      IiiIIiiI = await getH5st("8adfb", il1iii),
      IillI11 = {
        "url": "https://api.m.jd.com/client.action?appid=jd_shop_member&functionId=bindWithVender&body=" + llilliii + "&clientVersion=9.2.0&client=H5&uuid=88888&h5st=" + encodeURIComponent(IiiIIiiI),
        "headers": {
          "accept": "*/*",
          "accept-encoding": "gzip, deflate, br",
          "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
          "cookie": originCookie,
          "origin": "https://shopmember.m.jd.com/",
          "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36"
        }
      };
    $.get(IillI11, async (iiI1i11I, IlIlli1l, iiIi1i11) => {
      try {
        iiIi1i11 = iiIi1i11 && iiIi1i11.match(/jsonp_.*?\((.*?)\);/) && iiIi1i11.match(/jsonp_.*?\((.*?)\);/)[1] || iiIi1i11;
        let Illl1ili = $.toObj(iiIi1i11, iiIi1i11);
        if (Illl1ili && typeof Illl1ili == "object") {
          if (Illl1ili && Illl1ili.success === true) {
            console.log(Illl1ili.message);
            $.errorJoinShop = Illl1ili.message;
            if (Illl1ili.result && Illl1ili.result.giftInfo) for (let liIIIiI of Illl1ili.result.giftInfo.giftList) {
              console.log("入会获得: " + liIIIiI.discountString + liIIIiI.prizeName + liIIIiI.secondLineDesc);
            }
            console.log("");
          } else Illl1ili && typeof Illl1ili == "object" && Illl1ili.message ? ($.errorJoinShop = Illl1ili.message, console.log("" + (Illl1ili.message || ""))) : console.log(iiIi1i11);
        } else console.log(iiIi1i11);
      } catch (iiiiII1l) {
        $.logErr(iiiiII1l, IlIlli1l);
      } finally {
        i1i1llll();
      }
    });
  });
}
async function getshopactivityId() {
  return new Promise(async iiIlI1l1 => {
    let Il1ll1l1 = "{\"venderId\":\"" + $.joinVenderId + "\",\"channel\":406,\"payUpShop\":true}";
    const lli1iili = {
        "appid": "jd_shop_member",
        "functionId": "getShopOpenCardInfo",
        "clientVersion": "9.2.0",
        "client": "H5",
        "body": JSON.parse(Il1ll1l1)
      },
      i1I1il = await getH5st("ef79a", lli1iili),
      IilIIi1 = {
        "url": "https://api.m.jd.com/client.action?appid=jd_shop_member&functionId=getShopOpenCardInfo&body=" + Il1ll1l1 + "&clientVersion=9.2.0&client=H5&uuid=88888&h5st=" + encodeURIComponent(i1I1il),
        "headers": {
          "accept": "*/*",
          "accept-encoding": "gzip, deflate, br",
          "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
          "cookie": originCookie,
          "origin": "https://shopmember.m.jd.com/",
          "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36"
        }
      };
    $.get(IilIIi1, async (I11llII1, iii1II, I1Iil) => {
      try {
        I1Iil = I1Iil && I1Iil.match(/jsonp_.*?\((.*?)\);/) && I1Iil.match(/jsonp_.*?\((.*?)\);/)[1] || I1Iil;
        let iliIII1I = $.toObj(I1Iil, I1Iil);
        if (iliIII1I && typeof iliIII1I == "object") iliIII1I && iliIII1I.success == true && (console.log("\n去加入店铺会员：" + (iliIII1I.result.shopMemberCardInfo.venderCardName || "")), $.shopactivityId = iliIII1I.result.interestsRuleList && iliIII1I.result.interestsRuleList[0] && iliIII1I.result.interestsRuleList[0].interestsInfo && iliIII1I.result.interestsRuleList[0].interestsInfo.activityId || "");else {
          console.log(I1Iil);
        }
      } catch (lliIli1i) {
        $.logErr(lliIli1i, iii1II);
      } finally {
        iiIlI1l1();
      }
    });
  });
}
function getBuyerPoints(l1iIlill = 0) {
  return new Promise(iIi1IlIi => {
    let l1IIlliI = encodeURIComponent(encodeURIComponent($.Pin)),
      ilIii1Il = "venderId=" + venderId + "&buyerPin=" + l1IIlliI;
    $.post(taskPostUrl("/mc/wxPointShop/getBuyerPoints", ilIii1Il), async (iliI1I1l, lIll111i, iiiiIIII) => {
      try {
        iliI1I1l ? (console.log("" + JSON.stringify(iliI1I1l)), console.log($.name + "getBuyerPoints 请求失败，请检查网路重试")) : (safeGet(iiiiIIII) && (iiiiIIII = JSON.parse(iiiiIIII), iiiiIIII.result && iiiiIIII.data ? ($.grade = iiiiIIII.data.grade, $.buyerPoints = iiiiIIII.data.buyerPoints) : console.log(iiiiIIII.errorMessage || "")), lIll111i.status == 200 && refreshToken(lIll111i));
      } catch (I1lI1lI) {
        $.logErr(I1lI1lI, lIll111i);
      } finally {
        iIi1IlIi();
      }
    });
  });
}
function selectBeansForC(iIiiIliI = 0) {
  return new Promise(iI1IIiiI => {
    let l111illl = encodeURIComponent(encodeURIComponent($.Pin)),
      iIiIillI = "venderId=" + venderId + "&giftId=" + activityId + "&buyerPin=" + l111illl + "&beansLevel=1";
    $.post(taskPostUrl("/mc/beans/selectBeansForC", iIiIillI), async (IiIili, liliilIi, II111lIi) => {
      try {
        if (IiIili) {
          console.log("" + JSON.stringify(IiIili));
          console.log($.name + "selectBeansForC 请求失败，请检查网路重试");
        } else {
          if (safeGet(II111lIi)) {
            II111lIi = JSON.parse(II111lIi);
            if (II111lIi.result && II111lIi.data) {
              $.giftName = II111lIi.data.giftName;
              $.beansLevelCount = II111lIi.data.beansLevelCount;
              $.beansLevel = II111lIi.data.beansLevel;
              $.usedNum = II111lIi.data.usedNum;
              $.num = II111lIi.data.num;
              $.actrule = II111lIi.data.actrule;
              $.canExgTime = II111lIi.data.canExgTime;
              $.canExgByActivity = II111lIi.data.canExgByActivity;
              $.canExgByPeopDay = II111lIi.data.canExgByPeopDay;
              $.exgStyle = II111lIi.data.exgStyle;
              $.exgTimeType = II111lIi.data.exgTimeType;
              $.otherRule = II111lIi.data.otherRule;
              $.point0 = II111lIi.data.point0;
              $.point1 = II111lIi.data.point1;
              $.point2 = II111lIi.data.point2;
              $.point3 = II111lIi.data.point3;
              $.point4 = II111lIi.data.point4;
              $.point5 = II111lIi.data.point5;
              $.index === 1 && (console.log("活动名称：" + $.giftName), $.exgStyle === 1 ? console.log("活动类型：固定兑换数量") : console.log("活动类型：用户自定义兑换数量"), console.log("活动规则：\n" + $.actrule + "\n"));
              $.remainNum = parseInt($.num - $.usedNum);
            } else console.log(II111lIi.errorMessage || "");
          }
          liliilIi.status == 200 && refreshToken(liliilIi);
        }
      } catch (I1l1i11l) {
        $.logErr(I1l1i11l, liliilIi);
      } finally {
        iI1IIiiI();
      }
    });
  });
}
function exgBeans(iIIll1l = 0) {
  return new Promise(iiIlli11 => {
    let IllII1ll = encodeURIComponent(encodeURIComponent($.Pin)),
      ilIiI1Ii = "venderId=" + venderId + "&giftId=" + activityId + "&buyerNick=" + encodeURIComponent($.nickName) + "&buyerPin=" + IllII1ll + "&beansLevel=1&exgBeanNum=" + $.exgBeanNum;
    $.post(taskPostUrl("/mc/wxPointShop/exgBeans", ilIiI1Ii), async (IiilIilI, lllI1ill, Ilill1I1) => {
      try {
        if (IiilIilI) {
          console.log("" + JSON.stringify(IiilIilI));
          console.log($.name + "exgBeans 请求失败，请检查网路重试");
        } else {
          if (safeGet(Ilill1I1)) {
            Ilill1I1 = JSON.parse(Ilill1I1);
            if (Ilill1I1.result && Ilill1I1.data == null) {
              console.log("🎉 成功兑换" + $.exgBeanNum + "京豆 🐶");
              $.getPrize = true;
            } else {
              let i1iIl1I1 = Ilill1I1.errorMessage || "";
              if (!i1iIl1I1.includes("擦肩") && !i1iIl1I1.includes("火爆")) {
                console.log(i1iIl1I1 || "");
              }
              for (let iiIIIiil of ["未到", "未开始", "结束", "不存在", "不在", "发完", "兑完", "兑光", "发放完", "领完", "来晚", "抢光", "全部被领取", "余额不足"]) {
                if (i1iIl1I1.includes(iiIIIiil)) {
                  $.activityEnd = true;
                  break;
                }
              }
              for (let iIiiII1I of ["不足", "上限", "会员", "超过", "变更值", "擦肩"]) {
                if (i1iIl1I1.includes(iIiiII1I)) {
                  $.exgStop = true;
                  break;
                }
              }
            }
          }
          lllI1ill.status == 200 && refreshToken(lllI1ill);
        }
      } catch (IliIlIil) {
        $.logErr(IliIlIil, lllI1ill);
      } finally {
        iiIlli11();
      }
    });
  });
}
function getOpenCardInfo() {
  return new Promise(iIIl1l1l => {
    let IIiii1il = "activityType=40&venderId=" + $.venderId + "&buyerPin=" + encodeURIComponent(encodeURIComponent($.Pin));
    $.post(taskPostUrl("/mc/new/brandCard/common/shopAndBrand/getOpenCardInfo", IIiii1il), async (lI11lI1l, iI1il1li, iIlIili) => {
      try {
        if (lI11lI1l) {
          console.log("" + JSON.stringify(lI11lI1l));
          console.log($.getOpenCardInfo + "API请求失败，请检查网路重试");
        } else {
          if (safeGet(iIlIili)) {
            iIlIili = JSON.parse(iIlIili);
            if (iIlIili.result && iIlIili.data) {
              $.openedCard = iIlIili.data.openedCard || false;
              if (iIlIili.data.openCardLink) {
                $.channel = iIlIili.data.openCardLink.match(/channel=(\d+)/)[1];
                $.joinVenderId = iIlIili.data.openCardLink.match(/venderId=(\d+)/)[1];
              } else {}
            }
          }
        }
      } catch (Iii111iI) {
        $.logErr(Iii111iI, iI1il1li);
      } finally {
        iIIl1l1l();
      }
    });
  });
}
function taskPostUrl(Il1II1Ii, l11IIIll) {
  return {
    "url": "" + domains + Il1II1Ii,
    "body": l11IIIll,
    "headers": {
      "Accept": "application/json",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-cn",
      "Connection": "keep-alive",
      "Host": "cjhy-isv.isvjcloud.com",
      "Origin": "https://cjhy-isv.isvjcloud.com",
      "Content-Type": "application/x-www-form-urlencoded",
      "Referer": activityUrl + "/wx/completeInfoActivity/view/activity?activityId=" + activityId + "&venderId=" + venderId,
      "Cookie": activityCookie + ";IsvToken=" + $.token + ";AUTH_C_USER=" + $.AUTH_C_USER,
      "User-Agent": $.UA
    }
  };
}
function accessLog() {
  return new Promise(async ii1l1iI1 => {
    const Iii1I1I = {
      "url": "https://cjhy-isv.isvjcloud.com/common/accessLog",
      "headers": {
        "Accept": "application/json",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Host": "cjhy-isv.isvjcloud.com",
        "Origin": "https://cjhy-isv.isvjcloud.com",
        "Content-Type": "application/x-www-form-urlencoded",
        "Referer": activityUrl + "/wx/completeInfoActivity/view/activity?activityId=" + activityId + "&venderId=" + venderId,
        "Cookie": activityCookie + ";IsvToken=" + $.token + ";AUTH_C_USER=" + $.AUTH_C_USER,
        "User-Agent": $.UA
      },
      "body": "venderId=" + venderId + "&code=40&pin=" + encodeURIComponent(encodeURIComponent($.Pin)) + "&activityId=" + activityId + "&pageUrl=https%3A%2F%2F$cjhy-isv.isvjcloud.com%2FmicroDz%2Finvite%2Factivity%2Fwx%2Fview%2Findex%3FactivityId%3D" + activityId + "&subType=app"
    };
    $.post(Iii1I1I, (Ii1llIl1, i1iI1i1, IIliiIIi) => {
      try {
        if (Ii1llIl1) {
          console.log("" + JSON.stringify(Ii1llIl1));
          console.log($.name + " API请求失败，请检查网路重试");
        } else {
          i1iI1i1.status == 200 && refreshToken(i1iI1i1);
        }
      } catch (III1i1il) {
        $.logErr(III1i1il, i1iI1i1);
      } finally {
        ii1l1iI1();
      }
    });
  });
}
function refreshToken(llii11ll) {
  if (llii11ll) {
    if (llii11ll.headers["set-cookie"]) {
      cookie = "";
      for (let iiill1ll of llii11ll.headers["set-cookie"]) {
        lz_cookie[iiill1ll.split(";")[0].substr(0, iiill1ll.split(";")[0].indexOf("="))] = iiill1ll.split(";")[0].substr(iiill1ll.split(";")[0].indexOf("=") + 1);
      }
      for (const Ii1iI11 of Object.keys(lz_cookie)) {
        cookie += Ii1iI11 + "=" + lz_cookie[Ii1iI11] + ";";
      }
      activityCookie = cookie;
    }
  }
}
function getUA() {
  $.UA = "jdapp;iPhone;10.2.2;14.3;" + randomString(40) + ";M/5.0;network/wifi;ADID/;model/iPhone12,1;addressid/4199175193;appBuild/167863;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;";
}
function randomString(iiiii1li) {
  iiiii1li = iiiii1li || 32;
  let IlI1IliI = "abcdef0123456789",
    lI1Iliil = IlI1IliI.length,
    li1iI1Ii = "";
  for (i = 0; i < iiiii1li; i++) li1iI1Ii += IlI1IliI.charAt(Math.floor(Math.random() * lI1Iliil));
  return li1iI1Ii;
}
function safeGet(I1IIlIiI) {
  if (!I1IIlIiI) return console.log("京东服务器返回数据为空"), false;
  try {
    if (typeof JSON.parse(I1IIlIiI) == "object") return true;
  } catch (I11llIlI) {
    return console.log(I11llIlI), false;
  }
}
function jsonParse(liII1I1l) {
  if (typeof liII1I1l == "string") {
    try {
      return JSON.parse(liII1I1l);
    } catch (IillllIi) {
      return console.log(IillllIi), $.msg($.name, "", "请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie"), [];
    }
  }
}
function getQueryString(ilillilI, l111l11l) {
  let Il1I11Ii = new RegExp("(^|[&?])" + l111l11l + "=([^&]*)(&|$)"),
    IIlII1Il = ilillilI.match(Il1I11Ii);
  if (IIlII1Il != null) {
    return decodeURIComponent(IIlII1Il[2]);
  }
  return "";
}

function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(),"h+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), "S+": s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }
