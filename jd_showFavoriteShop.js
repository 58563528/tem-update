/*
活动名称：关注店铺有礼 · 京耕
活动链接：https://jinggeng-isv.isvjcloud.com/ql/front/showFavoriteShop?id=<活动id>&user_id=<店铺id>
环境变量：jd_showFavoriteShop_activityUrl // 活动链接

*/
if (process.env.proxy_wind === 'true') {const setGlobalHttpProxy = require('./utils/proxy-wind.js');setGlobalHttpProxy();}
let lnrun = 0;


const $ = new Env('关注店铺有礼（京耕）')
const notify = $.isNode() ? require('./sendNotify') : ''
const jdCookieNode = $.isNode() ? require('./jdCookie') : ''
const getH5st = require('./function/getH5st3_0')
const getToken = require('./function/getToken')

let lz_cookie = {},
  activityCookie = "";
$.activityEnd = false;
let cookiesArr = [],
  cookie = "";
if ($.isNode()) {
  if (process.env.jd_showFavoriteShop_activityUrl) activityUrl = process.env.jd_showFavoriteShop_activityUrl;
  if (JSON.stringify(process.env).indexOf("GITHUB") > -1) process.exit(0);
  Object.keys(jdCookieNode).forEach(I1Ili1i1 => {
    cookiesArr.push(jdCookieNode[I1Ili1i1]);
  });
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === "false") console.log = () => {};
} else cookiesArr = [$.getdata("CookieJD"), $.getdata("CookieJD2"), ...$.toObj($.getdata("CookiesJD") || "[]").map(I1i1I1i => I1i1I1i.cookie)].filter(iilIl1i => !!iilIl1i);
let isGetCookie = typeof $request !== "undefined";
isGetCookie && (GetCookie(), $.done());
if (activityUrl) {
  activityId = getQueryString("" + activityUrl, "id");
  venderId = getQueryString("" + activityUrl, "user_id");
  $.domain = activityUrl.match(/https?:\/\/([^/]+)/)[1];
} else {
  console.log("请填写活动链接");
  return;
}
let domains = "https://" + $.domain;
!(async () => {
  if (!activityId) {
    $.msg($.name, "", "活动id不存在");
    $.done();
    return;
  }
  console.log("活动入口：https://jinggeng-isv.isvjcloud.com/ql/front/showFavoriteShop?id=" + activityId + "&user_id=" + venderId);
  if (!cookiesArr[0]) {
    $.msg($.name, "【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取", "https://bean.m.jd.com/", {
      "open-url": "https://bean.m.jd.com/"
    });
    return;
  }
  for (let IIIl1lli = 0; IIIl1lli < cookiesArr.length; IIIl1lli++) {
    if (cookiesArr[IIIl1lli]) {
      cookie = cookiesArr[IIIl1lli];
      originCookie = cookiesArr[IIIl1lli];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1]);
      $.index = IIIl1lli + 1;
      $.isLogin = true;
      $.nickName = "";
      console.log("\n******开始【京东账号" + $.index + "】" + ($.nickName || $.UserName) + "******\n");
      let Interval = process.env.jd_jk_interval || 60 * 1000;console.log("环境变量jd_task_interval已设置为"+Interval/1000+"秒");lnrun++;if(lnrun == 3){console.log(`\n【访问接口次数达到2次，休息一分钟.....】\n`);await $.wait(Interval);lnrun = 0}
      if (!$.isLogin) {
        $.msg($.name, "【提示】cookie已失效", "京东账号" + $.index + " " + ($.nickName || $.UserName) + "\n请重新登录获取\nhttps://bean.m.jd.com/", {
          "open-url": "https://bean.m.jd.com/"
        });
        $.isNode() && (await notify.sendNotify($.name + "cookie已失效 - " + $.UserName, "京东账号" + $.index + " " + $.UserName + "\n请重新登录获取cookie"));
        continue;
      }
      await getUA();
      await showFavoriteShop();
      if ($.hasEnd || $.activityEnd) break;
    }
  }
})().catch(ll1IiiII => {
  $.log("", " " + $.name + ", 失败! 原因: " + ll1IiiII + "!", "");
}).finally(() => {
  $.done();
});
async function showFavoriteShop() {
  $.shopid = venderId;
  $.token = "";
  $.errs = false;
  $.token = await getToken(originCookie, domains);
  if ($.token == "") {
    console.log("获取[token]失败！");
    return;
  }
  if ($.shopid) {
    await setMixNick();
    if ($.inviterNicks == "") {
      console.log("获取[inviterNick]失败！");
      return;
    }
    await showFavoriteShopz();
    if ($.activityEnd === true) return;
    await recordActPvUvData();
    await followShop();
    await $.wait(3000);
    await postFavoriteShop();
  } else console.log("【京东账号" + $.index + "】 未能获取活动信息");
}
function setMixNick() {
  return new Promise(i1IIliIl => {
    let Ii1Iil1l = "strTMMixNick=" + $.token + "&userId=" + $.shopid + "&source=01";
    $.post(taskPostUrl("/front/setMixNick", Ii1Iil1l), async (l111lIIl, IlI11ll1, liIl1l1i) => {
      try {
        l111lIIl ? (console.log("" + JSON.stringify(l111lIIl)), console.log($.name + " setMixNick API请求失败，请检查网路重试")) : (liIl1l1i = JSON.parse(liIl1l1i), liIl1l1i && liIl1l1i.succ && ($.inviterNicks = liIl1l1i.msg), IlI11ll1.status == 200 && refreshToken(IlI11ll1));
      } catch (Iii1IiIl) {
        $.logErr(Iii1IiIl, IlI11ll1);
      } finally {
        i1IIliIl();
      }
    });
  });
}
function recordActPvUvData() {
  return new Promise(IiillIIi => {
    let IiiIili = "userId=" + $.shopid + "&actId=" + activityId;
    $.post(taskPostUrl("/ql/front/reportActivity/recordActPvUvData", IiiIili), async (llIIll11, IllllliI, Iilil1lI) => {
      try {
        llIIll11 ? (console.log("" + JSON.stringify(llIIll11)), console.log($.name + " recordActPvUvData API请求失败，请检查网路重试")) : IllllliI.status == 200 && refreshToken(IllllliI);
      } catch (i1i111i) {
        $.logErr(i1i111i, IllllliI);
      } finally {
        IiillIIi();
      }
    });
  });
}
function followShop() {
  return new Promise(llIiili => {
    let IIiiiIil = "userId=" + $.shopid;
    $.post(taskPostUrl("/front/followShop", IIiiiIil), async (lI1ilii, Il1III1I, i1i1liII) => {
      try {
        if (lI1ilii) {
          console.log("" + JSON.stringify(lI1ilii));
          console.log($.name + " followShop API请求失败，请检查网路重试");
        } else {
          if (Il1III1I.status == 200) {
            refreshToken(Il1III1I);
          }
        }
      } catch (l1illl1l) {
        $.logErr(l1illl1l, Il1III1I);
      } finally {
        llIiili();
      }
    });
  });
}
function postFavoriteShop() {
  return new Promise(lIi1iIlI => {
    let IlIlli11 = "act_id=" + activityId + "&user_id=" + $.shopid;
    $.post(taskPostUrl("/ql/front/postFavoriteShop", IlIlli11), async (i1l1iI11, ii1lI1lI, IIII1IIl) => {
      try {
        if (i1l1iI11) {
          console.log("" + JSON.stringify(i1l1iI11));
          console.log($.name + " postFavoriteShop API请求失败，请检查网路重试");
        } else {
          IIII1IIl = JSON.parse(IIII1IIl);
          if (IIII1IIl && IIII1IIl.succ) {
            let l1iiIi1i = JSON.parse(IIII1IIl.msg).drawAwardDto,
              iiII1lil = l1iiIi1i.awardType;
            switch (iiII1lil) {
              case "JD_BEAN":
                console.log("🎉 " + l1iiIi1i.awardName + " 🐶");
                break;
              case "JD_POINT":
                console.log("🗑️ " + l1iiIi1i.awardSendNum + l1iiIi1i.awardName + " 🎟️");
                break;
              case "JD_COUPON":
                console.log("🗑️ 优惠券");
                break;
              default:
                console.log(l1iiIi1i);
                break;
            }
          } else {
            IIII1IIl.msg.includes("未中奖") ? console.log("💨 空气") : console.log("" + IIII1IIl.msg);
            i1l1iI11 = IIII1IIl.msg;
            for (let IIiIilli of ["不足", "部分会员", "火爆", "上限"]) {
              if (i1l1iI11.includes(IIiIilli)) {
                $.errs = true;
                break;
              }
            }
          }
          if (ii1lI1lI.status == 200) {
            refreshToken(ii1lI1lI);
          }
        }
      } catch (l1iI11ii) {
        $.logErr(l1iI11ii, ii1lI1lI);
      } finally {
        lIi1iIlI();
      }
    });
  });
}
function showFavoriteShopz() {
  return new Promise(IIIilIiI => {
    const lli1i1iI = {
      "url": "https://jinggeng-isv.isvjcloud.com/ql/front/showFavoriteShop?id=" + activityId + "&user_id=" + $.shopid,
      "headers": {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh-Hans;q=0.9",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "Host": "jinggeng-isv.isvjcloud.com",
        "Referer": "https://shopmember.m.jd.com/shopcard/?venderId=" + $.shopid + "&channel=401&returnUrl=https://jinggeng-isv.isvjcloud.com/ql/front/showFavoriteShop?id=" + activityId + "&user_id=" + $.shopid,
        "User-Agent": $.UA,
        "X-Requested-With": "XMLHttpRequest"
      }
    };
    $.get(lli1i1iI, async (IIilI1ll, iillIII, l1ll1l1l) => {
      try {
        if (IIilI1ll) {
          console.log("" + JSON.stringify(IIilI1ll));
          console.log($.name + " showInviteJoin API请求失败，请检查网路重试");
        } else {
          l1ll1l1l = l1ll1l1l;
          if (l1ll1l1l) {
            let i111IlI1 = l1ll1l1l.match(/(活动已结束)/) && l1ll1l1l.match(/(活动已结束)/)[1] || "";
            i111IlI1 && ($.activityEnd = true, console.log("活动已结束"));
          }
        }
      } catch (liI11lll) {
        $.logErr(liI11lll, iillIII);
      } finally {
        IIIilIiI();
      }
    });
  });
}
function getShopOpenCardInfo(i111I1l1) {
  let IiIilI11 = {
    "url": "https://api.m.jd.com/client.action?appid=jd_shop_member&functionId=getShopOpenCardInfo&body=" + encodeURIComponent(JSON.stringify(i111I1l1)) + "&client=H5&clientVersion=9.2.0&uuid=88888&h5st=20220412164645241%3B3634d1aeada6d9cd11a7526a3a6ac63e%3B169f1%3Btk02wd66f1d7418nXuLjsmO3oJMCxUqKVwIf4q1WRptKRT3nJSrx01oYYBAylbSuyg4sipnEzyEJOZuFjfG2QERcBtzd%3B6b455234e93be4ec963cd7c575d70882b838ba588149a1f54b69c8d0dacf14da%3B3.0%3B1649753205241",
    "headers": {
      "Host": "api.m.jd.com",
      "Accept": "*/*",
      "Connection": "keep-alive",
      "Cookie": cookie,
      "User-Agent": $.UA,
      "Referer": "https://shopmember.m.jd.com/shopcard/?venderId=" + $.joinVenderId + "&channel=801&returnUrl=" + encodeURIComponent(activityUrl),
      "Accept-Encoding": "gzip, deflate, br"
    }
  };
  return new Promise(lil11i1i => {
    $.get(IiIilI11, (l1lillli, l1ii1l1, I11il1ll) => {
      try {
        if (l1lillli) {
          if (l1lillli === "Response code 403 (Forbidden)") {
            $.err = true;
            console.log(String(l1lillli));
          }
        } else {
          res = JSON.parse(I11il1ll);
          res.success && ($.openCardStatus = res.result.userInfo.openCardStatus, res.result.interestsRuleList && ($.openCardActivityId = res.result.interestsRuleList[0].interestsInfo.activityId));
        }
      } catch (IiIill1l) {
        console.log(IiIill1l);
      } finally {
        lil11i1i();
      }
    });
  });
}
function getshopactivityId() {
  return new Promise(ili1IIl => {
    const Ii1liIII = {
      "url": "https://api.m.jd.com/client.action?appid=jd_shop_member&functionId=getShopOpenCardInfo&body=%7B%22venderId%22%3A%22" + $.joinVenderId + "%22%2C%22channel%22%3A401%7D&client=H5&clientVersion=9.2.0&uuid=88888",
      "headers": {
        "Content-Type": "text/plain; Charset=UTF-8",
        "Origin": "https://api.m.jd.com",
        "Host": "api.m.jd.com",
        "accept": "*/*",
        "User-Agent": $.UA,
        "content-type": "application/x-www-form-urlencoded",
        "Cookie": cookie
      }
    };
    $.get(Ii1liIII, async (iIiliiII, illIl1lI, llIIilIi) => {
      try {
        let Iii11Il = $.toObj(llIIilIi, llIIilIi);
        typeof Iii11Il == "object" ? Iii11Il.success == true && console.log("去加入店铺会员:" + (Iii11Il.result.shopMemberCardInfo.venderCardName || "")) : console.log(llIIilIi);
      } catch (i1iI111) {
        $.logErr(i1iI111, illIl1lI);
      } finally {
        ili1IIl();
      }
    });
  });
}
function taskPostUrl(liiIl11i, iIill1ii) {
  return {
    "url": "" + domains + liiIl11i,
    "body": iIill1ii,
    "headers": {
      "Accept": "application/json, text/javascript, */*; q=0.01",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-CN,zh-Hans;q=0.9",
      "Connection": "keep-alive",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "Cookie": cookie + activityCookie + ";IsvToken=" + $.token + ";AUTH_C_USER=" + $.AUTH_C_USER,
      "Host": "jinggeng-isv.isvjcloud.com",
      "Origin": "https://jinggeng-isv.isvjcloud.com",
      "Referer": "https://jinggeng-isv.isvjcloud.com/ql/front/showFavoriteShop?id=" + activityId + "&user_id=" + venderId,
      "User-Agent": $.UA,
      "X-Requested-With": "XMLHttpRequest"
    }
  };
}
function taskUrl(iiiiiil, lIiiiIll) {
  return {
    "url": "https://api.m.jd.com/client.action" + iiiiiil,
    "body": lIiiiIll,
    "headers": {
      "Accept": "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-cn",
      "Connection": "keep-alive",
      "Content-Type": "application/x-www-form-urlencoded",
      "Host": "api.m.jd.com",
      "Cookie": cookie,
      "User-Agent": $.UA
    }
  };
}
function refreshToken(IIlli1ii) {
  if (IIlli1ii) {
    if (IIlli1ii.headers["set-cookie"]) {
      cookie = "";
      for (let Il1ii11I of IIlli1ii.headers["set-cookie"]) {
        lz_cookie[Il1ii11I.split(";")[0].substr(0, Il1ii11I.split(";")[0].indexOf("="))] = Il1ii11I.split(";")[0].substr(Il1ii11I.split(";")[0].indexOf("=") + 1);
      }
      for (const i11iIIii of Object.keys(lz_cookie)) {
        cookie += i11iIIii + "=" + lz_cookie[i11iIIii] + ";";
      }
      activityCookie = cookie;
    }
  }
}
function getUA() {
  $.UA = "jdapp;iPhone;10.2.2;14.3;" + randomString(40) + ";M/5.0;network/wifi;ADID/;model/iPhone12,1;addressid/4199175193;appBuild/167863;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;";
}
function randomString(Il1lIil1) {
  Il1lIil1 = Il1lIil1 || 32;
  let i1illll1 = "abcdef0123456789",
    ii11I1Il = i1illll1.length,
    Iiiilili = "";
  for (i = 0; i < Il1lIil1; i++) Iiiilili += i1illll1.charAt(Math.floor(Math.random() * ii11I1Il));
  return Iiiilili;
}
function safeGet(II1lIil1) {
  if (!II1lIil1) return console.log("京东服务器返回数据为空"), false;
  try {
    if (typeof JSON.parse(II1lIil1) == "object") {
      return true;
    }
  } catch (i1l11ilI) {
    return console.log(i1l11ilI), false;
  }
}
function jsonParse(llill1II) {
  if (typeof llill1II == "string") try {
    return JSON.parse(llill1II);
  } catch (IiIlI1i1) {
    return console.log(IiIlI1i1), $.msg($.name, "", "请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie"), [];
  }
}
function getQueryString(iilii1ii, l1I1l1il) {
  let l1i111 = new RegExp("(^|[&?])" + l1I1l1il + "=([^&]*)(&|$)"),
    i11iilIi = iilii1ii.match(l1i111);
  if (i11iilIi != null) return decodeURIComponent(i11iilIi[2]);
  return "";
}
async function joinShop() {
  if (!$.joinVenderId) return;
  return new Promise(async IiIlilil => {
    $.errorJoinShop = "活动太火爆，请稍后再试";
    let ilII1i1i = "";
    if ($.shopactivityId) ilII1i1i = ",\"activityId\":" + $.shopactivityId;
    const IIIII111 = "{\"venderId\":\"" + $.joinVenderId + "\",\"shopId\":\"" + $.joinVenderId + "\",\"bindByVerifyCodeFlag\":1,\"registerExtend\":{},\"writeChildFlag\":0" + ilII1i1i + ",\"channel\":406}",
      IiIlIiii = {
        "appid": "jd_shop_member",
        "functionId": "bindWithVender",
        "clientVersion": "9.2.0",
        "client": "H5",
        "body": JSON.parse(IIIII111)
      },
      l1iII1I1 = await getH5st("8adfb", IiIlIiii),
      II1I11i = {
        "url": "https://api.m.jd.com/client.action?appid=jd_shop_member&functionId=bindWithVender&body=" + IIIII111 + "&clientVersion=9.2.0&client=H5&uuid=88888&h5st=" + encodeURIComponent(l1iII1I1),
        "headers": {
          "accept": "*/*",
          "accept-encoding": "gzip, deflate, br",
          "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
          "cookie": originCookie,
          "origin": "https://shopmember.m.jd.com/",
          "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36"
        }
      };
    $.get(II1I11i, async (IiIlll1I, IlliIl1l, Iiiiii1) => {
      try {
        Iiiiii1 = Iiiiii1 && Iiiiii1.match(/jsonp_.*?\((.*?)\);/) && Iiiiii1.match(/jsonp_.*?\((.*?)\);/)[1] || Iiiiii1;
        let IiIIIII1 = $.toObj(Iiiiii1, Iiiiii1);
        if (IiIIIII1 && typeof IiIIIII1 == "object") {
          if (IiIIIII1 && IiIIIII1.success === true) {
            console.log(IiIIIII1.message);
            $.errorJoinShop = IiIIIII1.message;
            if (IiIIIII1.result && IiIIIII1.result.giftInfo) for (let llli1ll1 of IiIIIII1.result.giftInfo.giftList) {
              console.log("入会获得: " + llli1ll1.discountString + llli1ll1.prizeName + llli1ll1.secondLineDesc);
            }
            console.log("");
          } else {
            if (IiIIIII1 && typeof IiIIIII1 == "object" && IiIIIII1.message) {
              $.errorJoinShop = IiIIIII1.message;
              console.log("" + (IiIIIII1.message || ""));
            } else {
              console.log(Iiiiii1);
            }
          }
        } else {
          console.log(Iiiiii1);
        }
      } catch (I1I1lilI) {
        $.logErr(I1I1lilI, IlliIl1l);
      } finally {
        IiIlilil();
      }
    });
  });
}
async function getshopactivityId() {
  return new Promise(async I1ilI1iI => {
    let Iii111I1 = "{\"venderId\":\"" + $.joinVenderId + "\",\"channel\":406,\"payUpShop\":true}";
    const Ililli1l = {
        "appid": "jd_shop_member",
        "functionId": "getShopOpenCardInfo",
        "clientVersion": "9.2.0",
        "client": "H5",
        "body": JSON.parse(Iii111I1)
      },
      liIiil1i = await getH5st("ef79a", Ililli1l),
      I1llilil = {
        "url": "https://api.m.jd.com/client.action?appid=jd_shop_member&functionId=getShopOpenCardInfo&body=" + Iii111I1 + "&clientVersion=9.2.0&client=H5&uuid=88888&h5st=" + encodeURIComponent(liIiil1i),
        "headers": {
          "accept": "*/*",
          "accept-encoding": "gzip, deflate, br",
          "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
          "cookie": originCookie,
          "origin": "https://shopmember.m.jd.com/",
          "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36"
        }
      };
    $.get(I1llilil, async (II111l, lll1Il1, Ii1i1I1) => {
      try {
        Ii1i1I1 = Ii1i1I1 && Ii1i1I1.match(/jsonp_.*?\((.*?)\);/) && Ii1i1I1.match(/jsonp_.*?\((.*?)\);/)[1] || Ii1i1I1;
        let IlI1i1i = $.toObj(Ii1i1I1, Ii1i1I1);
        IlI1i1i && typeof IlI1i1i == "object" ? IlI1i1i && IlI1i1i.success == true && (console.log("\n去加入店铺会员：" + (IlI1i1i.result.shopMemberCardInfo.venderCardName || "")), $.shopactivityId = IlI1i1i.result.interestsRuleList && IlI1i1i.result.interestsRuleList[0] && IlI1i1i.result.interestsRuleList[0].interestsInfo && IlI1i1i.result.interestsRuleList[0].interestsInfo.activityId || "") : console.log(Ii1i1I1);
      } catch (ilili11i) {
        $.logErr(ilili11i, lll1Il1);
      } finally {
        I1ilI1iI();
      }
    });
  });
}

function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(),"h+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), "S+": s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }
