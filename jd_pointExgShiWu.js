/*
活动名称：积分兑换实物 · 超级会员
活动链接：https://cjhy-isv.isvjcloud.com/mc/wxPointShopView/pointExgShiWu?venderId=<店铺id>&giftId=<活动id>
环境变量：jd_pointExgShiWu_activityUrl // 活动链接
		 jd_pointExgShiWu_address // 用户登记收货地址，按照顺序依次填写 收件人@手机号@省份@城市@区县@详细地址，多个用管道符分开

*/
if (process.env.proxy_wind === 'true') {const setGlobalHttpProxy = require('./utils/proxy-wind.js');setGlobalHttpProxy();}
let lnrun = 0;


const $ = new Env('积分兑换实物（超级会员）')
const notify = $.isNode() ? require('./sendNotify') : ''
const jdCookieNode = $.isNode() ? require('./jdCookie') : ''
const getH5st = require('./function/getH5st3_0')
const getToken = require('./function/getToken')

let lz_cookie = {},
  activityCookie = "",
  cookiesArr = [],
  cookie = "",
  message = "",
  activityUrl = process.env.jd_pointExgShiWu_activityUrl ? process.env.jd_pointExgShiWu_activityUrl : "",
  UserAdd_Data_Arr = null;
if ($.isNode()) {
  if (JSON.stringify(process.env).indexOf("GITHUB") > -1) process.exit(0);
  Object.keys(jdCookieNode).forEach(lilIIil1 => {
    cookiesArr.push(jdCookieNode[lilIIil1]);
  });
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === "false") console.log = () => {};
} else cookiesArr = [$.getdata("CookieJD"), $.getdata("CookieJD2"), ...$.toObj($.getdata("CookiesJD") || "[]").map(Iiil1iil => Iiil1iil.cookie)].filter(iili1iI => !!iili1iI);
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
  process.env.jd_pointExgShiWu_address ? UserAdd_Data_Arr = process.env.jd_pointExgShiWu_address : UserAdd_Data_Arr = process.env.WX_ADDRESS ? process.env.WX_ADDRESS : "";
  if (UserAdd_Data_Arr && UserAdd_Data_Arr != "") {
    let i1iI1lIi = [];
    i1iI1lIi = UserAdd_Data_Arr.split("|");
    var IiIi1l1i = Math.floor(Math.random() * i1iI1lIi.length);
    if (i1iI1lIi[IiIi1l1i] == "") {
      console.log("随机抽取到的收货地址信息为空，请正确使用 \"|\" 管道符以用于分割多个收货地址！");
      return;
    } else i1iI1lIi = i1iI1lIi[IiIi1l1i];
    if (process.env.WX_ADDRESS) {
      i1iI1lIi = i1iI1lIi.split("@");
      if (i1iI1lIi.length != 8) {
        console.log("随机抽取到的收货地址信息格式存在错误（参数不足或过多）");
        return;
      }
      for (let iiI1IIIl = 0; iiI1IIIl < 7; iiI1IIIl++) {
        if (i1iI1lIi[iiI1IIIl] == "") {
          console.log("随机抽取到的收货地址信息格式存在错误（参数不能为空）");
          return;
        }
      }
    } else {
      i1iI1lIi = i1iI1lIi.split("@");
      if (i1iI1lIi.length != 6) {
        console.log("随机抽取到的收货地址信息格式存在错误（参数不足或过多）");
        return;
      }
      for (let iiill11I = 0; iiill11I < 6; iiill11I++) {
        if (i1iI1lIi[iiill11I] == "") {
          console.log("随机抽取到的收货地址信息格式存在错误（参数不能为空）");
          return;
        }
      }
    }
    $.receiver = i1iI1lIi[0];
    $.phone = i1iI1lIi[1];
    $.province = i1iI1lIi[2];
    $.city = i1iI1lIi[3];
    $.county = i1iI1lIi[4];
    $.address = i1iI1lIi[5];
  } else {
    console.log("请先定义环境变量 jd_pointExgShiWu_address 用于设置实物类奖品的用户收货地址信息\n变量格式：收件人@手机号@省份@城市@区县@详细地址，需按照顺序依次填写，多个用管道符分开");
    return;
  }
  console.log("活动入口：" + activityUrl);
  if (!cookiesArr[0]) {
    $.msg($.name, "【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取", "https://bean.m.jd.com/", {
      "open-url": "https://bean.m.jd.com/"
    });
    return;
  }
  for (let i1IIIil1 = 0; i1IIIil1 < cookiesArr.length; i1IIIil1++) {
    if (cookiesArr[i1IIIil1]) {
      cookie = cookiesArr[i1IIIil1];
      originCookie = cookiesArr[i1IIIil1];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1]);
      $.index = i1IIIil1 + 1;
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
      await pointExgShiWu();
      await $.wait(2000);
      if ($.hasEnd || $.outFlag || $.activityEnd) break;
    }
  }
})().catch(li111iII => {
  $.log("", " " + $.name + ", 失败! 原因: " + li111iII + "!", "");
}).finally(() => {
  $.done();
});
async function pointExgShiWu() {
  $.buyerPoints = 0;
  $.exgByPeopDay = 0;
  $.exgByActivity = 0;
  $.sid = "";
  $.venderId = venderId;
  $.token = "";
  $.Pin = "";
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
    await $.wait(1000);
    await selectShiWu();
    if ($.remainNum == 0) {
      console.log("当前奖品库存：" + $.remainNum + " / " + $.num + " 🎁");
      console.log("\n当前活动的奖品已全部发放完了，下次早点来吧~");
      $.hasEnd = true;
      return;
    }
    if ($.takeBeginTime) {
      if (!checkAuditTime($.takeBeginTime, $.takeEndTime)) {
        console.log("⛔️ 当前不在每日兑换时间内！");
        $.hasEnd = true;
        return;
      }
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
    console.log("当前奖品库存：" + $.remainNum + " / " + $.num);
    console.log("用户等级：" + $.grade + " | 当前积分：" + $.buyerPoints);
    let lIiI1li1 = null;
    switch (String($.grade)) {
      case "0":
        lIiI1li1 = $.point0;
        break;
      case "1":
        lIiI1li1 = $.point1;
        break;
      case "2":
        lIiI1li1 = $.point2;
        break;
      case "3":
        lIiI1li1 = $.point3;
        break;
      case "4":
        lIiI1li1 = $.point4;
        break;
      case "5":
        lIiI1li1 = $.point5;
        break;
    }
    if (lIiI1li1 === null) {
      console.log("\n⛔️ 用户当前会员等级不符合兑换要求");
      return;
    }
    if ($.buyerPoints >= lIiI1li1) {
      console.log("");
      await saveAddress();
      await $.wait(1000);
      for (let llili1ii = 0; llili1ii < 10; llili1ii++) {
        await exgShiWu();
        if ($.getPrize || $.exgStop || $.activityEnd) break;
        await $.wait(1000);
      }
      !$.getPrize && !$.exgStop && !$.activityEnd && console.log("\n⛔️ 已尝试多次，未能兑换实物");
    } else console.log("\n⛔️ 用户积分不足");
  } else {
    console.log("未能获取活动信息（店铺ID）");
    $.activityEnd = true;
  }
}
function showMsg() {
  return new Promise(IIiiI1Ii => {
    $.msg($.name, "", "【京东账号" + $.index + "】" + $.nickName + "\n" + message);
    IIiiI1Ii();
  });
}
function getSimpleActInfoVo() {
  return new Promise(Iiil1llI => {
    let li1i1I1 = "activityId=" + activityId;
    $.post(taskPostUrl("/customer/getSimpleActInfoVo", li1i1I1), async (IiiIIlii, Iillli1i, ii1I1lii) => {
      try {
        if (IiiIIlii) {
          console.log(String(IiiIIlii));
          console.log($.name + " getSimpleActInfoVo API请求失败，请检查网路重试");
        } else {}
      } catch (IiIi1II1) {
        $.logErr(IiIi1II1, Iillli1i);
      } finally {
        Iiil1llI();
      }
    });
  });
}
function getCk() {
  return new Promise(il11II1 => {
    let l1lliiiI = {
      "url": activityUrl,
      "headers": {
        "User-Agent": $.UA
      }
    };
    $.get(l1lliiiI, async (lllIiiI, liIlili, IIIl1i1) => {
      try {
        if (lllIiiI) {
          if (liIlili && typeof liIlili.statusCode != "undefined") {
            liIlili.statusCode == 493 && (console.log("getCk 此ip已被限制，请过10分钟后再执行脚本"), $.outFlag = true);
          }
          console.log("" + JSON.stringify(lllIiiI));
          console.log($.name + " cookie API请求失败，请检查网路重试");
        } else {
          let l1llI1 = IIIl1i1.match(/(活动已结束)/) && IIIl1i1.match(/(活动已结束)/)[1] || IIIl1i1.match(/(活动尚未开始)/) && IIIl1i1.match(/(活动尚未开始)/)[1] || "";
          l1llI1 && ($.activityEnd = true, console.log("活动已结束或者未开始"));
          liIlili.status == 200 && refreshToken(liIlili);
        }
      } catch (IIIlI1i) {
        $.logErr(IIIlI1i, liIlili);
      } finally {
        il11II1();
      }
    });
  });
}
function getPin() {
  return new Promise(ili1iil => {
    let IlIlI1I1 = "userId=" + $.venderId + "&token=" + $.token + "&fromType=APP";
    $.post(taskPostUrl("/customer/getMyPing", IlIlI1I1), async (il1iI1Ii, liIII111, ll1Il1iI) => {
      try {
        if (il1iI1Ii) {
          console.log("" + JSON.stringify(il1iI1Ii));
          console.log($.name + " 3 API请求失败，请检查网路重试");
        } else {
          liIII111.status == 200 && refreshToken(liIII111);
          if (safeGet(ll1Il1iI)) {
            ll1Il1iI = JSON.parse(ll1Il1iI);
            if (ll1Il1iI.result && ll1Il1iI.data) {
              $.Pin = ll1Il1iI.data.secretPin;
              $.AUTH_C_USER = $.Pin;
              $.attrTouXiang = ll1Il1iI.data.yunMidImageUrl ? ll1Il1iI.data.yunMidImageUrl : "https://img10.360buyimg.com/imgzone/jfs/t1/21383/2/6633/3879/5c5138d8E0967ccf2/91da57c5e2166005.jpg";
              $.nickName = ll1Il1iI.data.pin;
            } else {}
          }
        }
      } catch (lliIl11I) {
        $.logErr(lliIl11I, liIII111);
      } finally {
        ili1iil();
      }
    });
  });
}
async function joinShop() {
  if (!$.joinVenderId) return;
  return new Promise(async l1Ililll => {
    $.errorJoinShop = "活动太火爆，请稍后再试";
    let i11IiliI = "";
    if ($.shopactivityId) i11IiliI = ",\"activityId\":" + $.shopactivityId;
    const IlIiIll1 = "{\"venderId\":\"" + $.joinVenderId + "\",\"shopId\":\"" + $.joinVenderId + "\",\"bindByVerifyCodeFlag\":1,\"registerExtend\":{},\"writeChildFlag\":0" + i11IiliI + ",\"channel\":406}",
      l1i1iiI = {
        "appid": "jd_shop_member",
        "functionId": "bindWithVender",
        "clientVersion": "9.2.0",
        "client": "H5",
        "body": JSON.parse(IlIiIll1)
      },
      lI1IIIl1 = await getH5st("8adfb", l1i1iiI),
      lilIili1 = {
        "url": "https://api.m.jd.com/client.action?appid=jd_shop_member&functionId=bindWithVender&body=" + IlIiIll1 + "&clientVersion=9.2.0&client=H5&uuid=88888&h5st=" + encodeURIComponent(lI1IIIl1),
        "headers": {
          "accept": "*/*",
          "accept-encoding": "gzip, deflate, br",
          "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
          "cookie": originCookie,
          "origin": "https://shopmember.m.jd.com/",
          "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36"
        }
      };
    $.get(lilIili1, async (li1ili1, i11il11, i1i1l111) => {
      try {
        i1i1l111 = i1i1l111 && i1i1l111.match(/jsonp_.*?\((.*?)\);/) && i1i1l111.match(/jsonp_.*?\((.*?)\);/)[1] || i1i1l111;
        let I1IllI1l = $.toObj(i1i1l111, i1i1l111);
        if (I1IllI1l && typeof I1IllI1l == "object") {
          if (I1IllI1l && I1IllI1l.success === true) {
            console.log(I1IllI1l.message);
            $.errorJoinShop = I1IllI1l.message;
            if (I1IllI1l.result && I1IllI1l.result.giftInfo) {
              for (let iIiilIl of I1IllI1l.result.giftInfo.giftList) {
                console.log("入会获得: " + iIiilIl.discountString + iIiilIl.prizeName + iIiilIl.secondLineDesc);
              }
            }
            console.log("");
          } else I1IllI1l && typeof I1IllI1l == "object" && I1IllI1l.message ? ($.errorJoinShop = I1IllI1l.message, console.log("" + (I1IllI1l.message || ""))) : console.log(i1i1l111);
        } else console.log(i1i1l111);
      } catch (IiI11IlI) {
        $.logErr(IiI11IlI, i11il11);
      } finally {
        l1Ililll();
      }
    });
  });
}
async function getshopactivityId() {
  return new Promise(async iII1iIIi => {
    let liii1l = "{\"venderId\":\"" + $.joinVenderId + "\",\"channel\":406,\"payUpShop\":true}";
    const IIiili = {
        "appid": "jd_shop_member",
        "functionId": "getShopOpenCardInfo",
        "clientVersion": "9.2.0",
        "client": "H5",
        "body": JSON.parse(liii1l)
      },
      l11l1Ill = await getH5st("ef79a", IIiili),
      llllii = {
        "url": "https://api.m.jd.com/client.action?appid=jd_shop_member&functionId=getShopOpenCardInfo&body=" + liii1l + "&clientVersion=9.2.0&client=H5&uuid=88888&h5st=" + encodeURIComponent(l11l1Ill),
        "headers": {
          "accept": "*/*",
          "accept-encoding": "gzip, deflate, br",
          "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
          "cookie": originCookie,
          "origin": "https://shopmember.m.jd.com/",
          "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36"
        }
      };
    $.get(llllii, async (IIl1I1I1, I1Iil1i, II11lii) => {
      try {
        II11lii = II11lii && II11lii.match(/jsonp_.*?\((.*?)\);/) && II11lii.match(/jsonp_.*?\((.*?)\);/)[1] || II11lii;
        let IIi1iili = $.toObj(II11lii, II11lii);
        IIi1iili && typeof IIi1iili == "object" ? IIi1iili && IIi1iili.success == true && (console.log("\n去加入店铺会员：" + (IIi1iili.result.shopMemberCardInfo.venderCardName || "")), $.shopactivityId = IIi1iili.result.interestsRuleList && IIi1iili.result.interestsRuleList[0] && IIi1iili.result.interestsRuleList[0].interestsInfo && IIi1iili.result.interestsRuleList[0].interestsInfo.activityId || "") : console.log(II11lii);
      } catch (iilil11i) {
        $.logErr(iilil11i, I1Iil1i);
      } finally {
        iII1iIIi();
      }
    });
  });
}
function getUserInfo() {
  return new Promise(lI1I1iIl => {
    let li11l1Ii = "pin=" + encodeURIComponent(encodeURIComponent($.Pin));
    $.post(taskPostUrl("/wxActionCommon/getUserInfo", li11l1Ii), async (l1Ii1i1I, llill1lI, i11I111I) => {
      try {
        if (l1Ii1i1I) {
          console.log("" + JSON.stringify(l1Ii1i1I));
          console.log($.name + " 6-1 API请求失败，请检查网路重试");
        } else {
          if (safeGet(i11I111I)) {
            i11I111I = JSON.parse(i11I111I);
            if (i11I111I.result && i11I111I.data) {
              $.attrTouXiang = i11I111I.data.yunMidImageUrl ? i11I111I.data.yunMidImageUrl : "https://img10.360buyimg.com/imgzone/jfs/t1/21383/2/6633/3879/5c5138d8E0967ccf2/91da57c5e2166005.jpg";
            } else console.log("异常6-2：" + JSON.stringify(i11I111I));
          }
        }
      } catch (i1IlIIII) {
        $.logErr(i1IlIIII, llill1lI);
      } finally {
        lI1I1iIl();
      }
    });
  });
}
function getBuyerPoints(ilIIilii = 0) {
  return new Promise(IIii1Iii => {
    let Ii1iIIi1 = encodeURIComponent(encodeURIComponent($.Pin)),
      llIiii1l = "venderId=" + venderId + "&buyerPin=" + Ii1iIIi1;
    $.post(taskPostUrl("/mc/wxPointShop/getBuyerPoints", llIiii1l), async (Iiil11ii, Ii11Iii, llI111lI) => {
      try {
        if (Iiil11ii) {
          console.log("" + JSON.stringify(Iiil11ii));
          console.log($.name + "getBuyerPoints 请求失败，请检查网路重试");
        } else {
          if (safeGet(llI111lI)) {
            llI111lI = JSON.parse(llI111lI);
            if (llI111lI.result && llI111lI.data) {
              $.grade = llI111lI.data.grade;
              $.buyerPoints = llI111lI.data.buyerPoints;
            } else {
              console.log(llI111lI.errorMessage || "");
            }
          }
        }
      } catch (i1lllii1) {
        $.logErr(i1lllii1, Ii11Iii);
      } finally {
        IIii1Iii();
      }
    });
  });
}
function exgShiWu(IlliIl1l = 0) {
  return new Promise(li1i1ilI => {
    let IiIlli1 = encodeURIComponent(encodeURIComponent($.Pin)),
      IIii1II = "buyerPin=" + IiIlli1 + "&buyerNick=" + encodeURIComponent($.nickName) + "&giftId=" + activityId + "&venderId=" + venderId + "&addressId=" + addressId;
    $.post(taskPostUrl("/mc/wxPointShop/exgShiWu", IIii1II), async (i11lIIl, li1III, IIiIIiiI) => {
      try {
        if (i11lIIl) {
          console.log("" + JSON.stringify(i11lIIl));
          console.log($.name + "exgShiWu 请求失败，请检查网路重试");
        } else {
          if (safeGet(IIiIIiiI)) {
            IIiIIiiI = JSON.parse(IIiIIiiI);
            if (IIiIIiiI.result) {
              console.log("🎉 兑换成功");
              $.getPrize = true;
            } else {
              let IiIIlliI = IIiIIiiI.errorMessage || "";
              if (!IiIIlliI.includes("擦肩") && !IiIIlliI.includes("火爆")) {
                console.log(IiIIlliI || "");
              }
              for (let l1IlllIl of ["未开始", "结束", "不存在", "不在", "发完", "兑完", "兑光", "发放完", "领完", "来晚", "抢光", "全部被领取", "余额不足"]) {
                if (IiIIlliI.includes(l1IlllIl)) {
                  $.activityEnd = true;
                  break;
                }
              }
              for (let Il1lli1 of ["不足", "上限", "会员", "变更值", "擦肩"]) {
                if (IiIIlliI.includes(Il1lli1)) {
                  $.exgStop = true;
                  break;
                }
              }
            }
          }
          li1III.status == 200 && refreshToken(li1III);
        }
      } catch (IlIl1Iii) {
        $.logErr(IlIl1Iii, li1III);
      } finally {
        li1i1ilI();
      }
    });
  });
}
function saveAddress(iilIIIi1 = 0) {
  return new Promise(IIi1liI => {
    let ll1iIiii = encodeURIComponent(encodeURIComponent($.Pin)),
      i1ilI1I = "buyerPin=" + ll1iIiii + "&venderId=" + venderId + "&receiver=" + encodeURIComponent($.receiver) + "&receiverPhone=" + $.phone + "&province=" + encodeURIComponent($.province) + "&city=" + encodeURIComponent($.city) + "&county=" + encodeURIComponent($.county) + "&address=" + encodeURIComponent($.address);
    $.post(taskPostUrl("/mc/wxPointShop/saveAddress", i1ilI1I), async (I1liii, lliIl1ll, illi1II) => {
      try {
        if (I1liii) {
          console.log("" + JSON.stringify(I1liii));
          console.log($.name + "saveAddress 请求失败，请检查网路重试");
        } else {
          if (safeGet(illi1II)) {
            illi1II = JSON.parse(illi1II);
            if (illi1II.result && illi1II.data) addressId = illi1II.data.addressId;else {
              console.log(illi1II.errorMessage || "");
            }
          }
        }
      } catch (iillIlI) {
        $.logErr(iillIlI, lliIl1ll);
      } finally {
        IIi1liI();
      }
    });
  });
}
function selectShiWu(l111i1I1 = 0) {
  return new Promise(I11l11iI => {
    let II1III1l = "venderId=" + venderId + "&giftId=" + activityId;
    $.post(taskPostUrl("/mc/shiWu/selectShiWu", II1III1l), async (Iillil1i, l1I1iii1, iIi1Ii1I) => {
      try {
        Iillil1i ? (console.log("" + JSON.stringify(Iillil1i)), console.log($.name + "selectShiWu 请求失败，请检查网路重试")) : safeGet(iIi1Ii1I) && (iIi1Ii1I = JSON.parse(iIi1Ii1I), iIi1Ii1I.result && iIi1Ii1I.data ? ($.giftName = iIi1Ii1I.data.mcGiftBaseInfo.giftName, $.usedNum = iIi1Ii1I.data.mcGiftBaseInfo.usedNum, $.num = iIi1Ii1I.data.mcGiftBaseInfo.num, $.actrule = iIi1Ii1I.data.mcGiftBaseInfo.actrule, $.exgTime = iIi1Ii1I.data.mcGiftBaseInfo.exgTime, $.exgByActivity = iIi1Ii1I.data.mcGiftBaseInfo.exgByActivity, $.exgByPeopDay = iIi1Ii1I.data.mcGiftBaseInfo.exgByPeopDay, $.exgTimeType = iIi1Ii1I.data.mcGiftBaseInfo.exgTimeType, $.otherRule = iIi1Ii1I.data.mcGiftBaseInfo.otherRule, $.point0 = iIi1Ii1I.data.mcGiftBaseInfo.point0, $.point1 = iIi1Ii1I.data.mcGiftBaseInfo.point1, $.point2 = iIi1Ii1I.data.mcGiftBaseInfo.point2, $.point3 = iIi1Ii1I.data.mcGiftBaseInfo.point3, $.point4 = iIi1Ii1I.data.mcGiftBaseInfo.point4, $.point5 = iIi1Ii1I.data.mcGiftBaseInfo.point5, $.takeBeginTime = iIi1Ii1I.data.mcShiWu.takeBeginTime, $.takeEndTime = iIi1Ii1I.data.mcShiWu.takeEndTime || "24:00", $.index === 1 && (console.log("活动名称：" + $.giftName), console.log("活动规则：\n" + $.actrule + "\n")), $.remainNum = parseInt($.num - $.usedNum)) : console.log(iIi1Ii1I.errorMessage || ""));
      } catch (IiIili1) {
        $.logErr(IiIili1, l1I1iii1);
      } finally {
        I11l11iI();
      }
    });
  });
}
function getOpenCardInfo() {
  return new Promise(IIll1il1 => {
    let IliIi111 = "activityType=40&venderId=" + $.venderId + "&buyerPin=" + encodeURIComponent(encodeURIComponent($.Pin));
    $.post(taskPostUrl("/mc/new/brandCard/common/shopAndBrand/getOpenCardInfo", IliIi111), async (i1iIII1I, ll111iIl, l11i11ii) => {
      try {
        if (i1iIII1I) {
          console.log("" + JSON.stringify(i1iIII1I));
          console.log($.getOpenCardInfo + "API请求失败，请检查网路重试");
        } else {
          if (safeGet(l11i11ii)) {
            l11i11ii = JSON.parse(l11i11ii);
            if (l11i11ii.result && l11i11ii.data) {
              $.openedCard = l11i11ii.data.openedCard || false;
              if (l11i11ii.data.openCardLink) {
                $.channel = l11i11ii.data.openCardLink.match(/channel=(\d+)/)[1];
                $.joinVenderId = l11i11ii.data.openCardLink.match(/venderId=(\d+)/)[1];
              } else {}
            }
          }
        }
      } catch (IIlIl1i1) {
        $.logErr(IIlIl1i1, ll111iIl);
      } finally {
        IIll1il1();
      }
    });
  });
}
function taskPostUrl(l1I1IlIi, lli1Ilii) {
  return {
    "url": "" + domains + l1I1IlIi,
    "body": lli1Ilii,
    "headers": {
      "Accept": "application/json",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-cn",
      "Connection": "keep-alive",
      "Host": $.domain,
      "Origin": domains,
      "Content-Type": "application/x-www-form-urlencoded",
      "Referer": activityUrl,
      "Cookie": activityCookie + ";IsvToken=" + $.token + ";AUTH_C_USER=" + $.AUTH_C_USER,
      "User-Agent": $.UA
    }
  };
}
function accessLog() {
  return new Promise(async Iii111 => {
    const Illii1lI = {
      "url": domains + "/common/accessLog",
      "headers": {
        "Accept": "application/json",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Host": $.domain,
        "Origin": domains,
        "Content-Type": "application/x-www-form-urlencoded",
        "Referer": activityUrl,
        "Cookie": activityCookie + ";IsvToken=" + $.token + ";AUTH_C_USER=" + $.AUTH_C_USER,
        "User-Agent": $.UA
      },
      "body": "venderId=" + venderId + "&code=202&pin=" + encodeURIComponent(encodeURIComponent($.Pin)) + "&activityId=" + activityId + "&pageUrl=https%3A%2F%2F$cjhy-isv.isvjcloud.com%2FmicroDz%2Finvite%2Factivity%2Fwx%2Fview%2Findex%3FactivityId%3D" + activityId + "&subType=app"
    };
    $.post(Illii1lI, (IliIiI1i, iilii1II, iiIlliIi) => {
      try {
        if (IliIiI1i) {
          console.log("" + JSON.stringify(IliIiI1i));
          console.log($.name + " API请求失败，请检查网路重试");
        } else {
          if (iilii1II.status == 200) {
            refreshToken(iilii1II);
          }
        }
      } catch (lI111II) {
        $.logErr(lI111II, iilii1II);
      } finally {
        Iii111();
      }
    });
  });
}
function refreshToken(IiiiIiii) {
  if (IiiiIiii) {
    if (IiiiIiii.headers["set-cookie"]) {
      cookie = "";
      for (let I1i1lI1 of IiiiIiii.headers["set-cookie"]) {
        lz_cookie[I1i1lI1.split(";")[0].substr(0, I1i1lI1.split(";")[0].indexOf("="))] = I1i1lI1.split(";")[0].substr(I1i1lI1.split(";")[0].indexOf("=") + 1);
      }
      for (const lilIlIil of Object.keys(lz_cookie)) {
        cookie += lilIlIil + "=" + lz_cookie[lilIlIil] + ";";
      }
      activityCookie = cookie;
    }
  }
}
function getUA() {
  $.UA = "jdapp;iPhone;10.2.2;14.3;" + randomString(40) + ";M/5.0;network/wifi;ADID/;model/iPhone12,1;addressid/4199175193;appBuild/167863;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;";
}
function randomString(lli1IllI) {
  lli1IllI = lli1IllI || 32;
  let l1llI11 = "abcdef0123456789",
    l1IIil = l1llI11.length,
    IlIilII = "";
  for (i = 0; i < lli1IllI; i++) IlIilII += l1llI11.charAt(Math.floor(Math.random() * l1IIil));
  return IlIilII;
}
function random(I1llIii1, IIi11l1l) {
  return Math.floor(Math.random() * (IIi11l1l - I1llIii1)) + I1llIii1;
}
function safeGet(Iiii1ili) {
  if (!Iiii1ili) {
    return console.log("京东服务器返回数据为空"), false;
  }
  try {
    if (typeof JSON.parse(Iiii1ili) == "object") return true;
  } catch (llII1lII) {
    return console.log(llII1lII), false;
  }
}
function jsonParse(I1iIiiii) {
  if (typeof I1iIiiii == "string") try {
    return JSON.parse(I1iIiiii);
  } catch (Ilil1l11) {
    return console.log(Ilil1l11), $.msg($.name, "", "请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie"), [];
  }
}
function getQueryString(lIl1lIi1, IIIIl1) {
  let IIIIIll = new RegExp("(^|[&?])" + IIIIl1 + "=([^&]*)(&|$)"),
    Ii1lII1I = lIl1lIi1.match(IIIIIll);
  if (Ii1lII1I != null) {
    return decodeURIComponent(Ii1lII1I[2]);
  }
  return "";
}
function checkAuditTime(Ili1I1iI, lIIiIIII) {
  var II11lIli = new Date();
  var li1IIII1 = new Date(II11lIli);
  var li11Ii1I = new Date(II11lIli);
  var IiiilI1l = Ili1I1iI.lastIndexOf(":");
  var iIiII = Ili1I1iI.substring(0, IiiilI1l);
  var IiI11i = Ili1I1iI.substring(IiiilI1l + 1, Ili1I1iI.length);
  li1IIII1.setHours(iIiII, IiI11i, 0, 0);
  var lliilil = lIIiIIII.lastIndexOf(":");
  var liIlill = lIIiIIII.substring(0, lliilil);
  var l1iII1 = lIIiIIII.substring(lliilil + 1, lIIiIIII.length);
  li11Ii1I.setHours(liIlill, l1iII1, 0, 0);
  return II11lIli.getTime() - li1IIII1.getTime() >= 0 && II11lIli.getTime() <= li11Ii1I.getTime();
}

function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(),"h+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), "S+": s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }
