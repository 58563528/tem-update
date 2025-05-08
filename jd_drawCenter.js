/*
活动名称：店铺抽奖中心 · 超级无线
活动链接：https://lzkj-isv.isvjd.com/drawCenter/activity/activity?activityId=<活动id>
环境变量：jd_drawCenter_activityId // 活动id
         jd_drawCenter_addCart // 是否做加购任务，默认不做

默认助力第一个号

*/
if (process.env.proxy_wind === 'true') {const setGlobalHttpProxy = require('./utils/proxy-wind.js');setGlobalHttpProxy();}
let lnrun = 0;


const $ = new Env('店铺抽奖中心（超级无线）')
const jdCookieNode = $.isNode() ? require('./jdCookie') : ''
const notify = $.isNode() ? require('./sendNotify') : ''
const getToken = require('./function/getToken')
const wxSavePrize = require('./function/wxSavePrize')

let cookiesArr = [],
  cookie = "",
  message = "",
  ownCode = {},
  isdoTask = true,
  isdraw = true,
  lz_cookie = {},
  drawCenterActivityId = "",
  Allmessage = "";
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach(lIIl1lII => {
    cookiesArr.push(jdCookieNode[lIIl1lII]);
  });
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === "false") console.log = () => {};
} else {
  let cookiesData = $.getdata("CookiesJD") || "[]";
  cookiesData = JSON.parse(cookiesData);
  cookiesArr = cookiesData.map(Illi1i1I => Illi1i1I.cookie);
  cookiesArr.reverse();
  cookiesArr.push(...[$.getdata("CookieJD2"), $.getdata("CookieJD")]);
  cookiesArr.reverse();
  cookiesArr = cookiesArr.filter(lli1ll11 => !!lli1ll11);
}
process.env.jd_drawCenter_activityId && process.env.jd_drawCenter_activityId != "" && (drawCenterActivityId = process.env.jd_drawCenter_activityId.split(","));
let addCart = process.env.jd_drawCenter_addCart ? process.env.jd_drawCenter_addCart : "false";
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, "【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取", "https://bean.m.jd.com/bean/signIndex.action", {
      "open-url": "https://bean.m.jd.com/bean/signIndex.action"
    });
    return;
  }
  console.log("活动入口：https://lzkj-isv.isvjd.com/drawCenter/activity/activity?activityId=" + drawCenterActivityId);
  for (let l1l1IiI = 0; l1l1IiI < cookiesArr.length; l1l1IiI++) {
    if (cookiesArr[l1l1IiI]) {
      cookie = cookiesArr[l1l1IiI];
      originCookie = cookiesArr[l1l1IiI];
      newCookie = "";
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1]);
      $.index = l1l1IiI + 1;
      $.isLogin = true;
      $.nickName = "";
      console.log("\n******开始【京东账号" + $.index + "】" + ($.nickName || $.UserName) + "******\n");
      let Interval = process.env.jd_jk_interval || 60 * 1000;console.log("环境变量jd_task_interval已设置为"+Interval/1000+"秒");lnrun++;if(lnrun == 3){console.log(`\n【访问接口次数达到2次，休息一分钟.....】\n`);await $.wait(Interval);lnrun = 0}
      if (!$.isLogin) {
        $.msg($.name, "【提示】cookie已失效", "京东账号" + $.index + " " + ($.nickName || $.UserName) + "\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action", {
          "open-url": "https://bean.m.jd.com/bean/signIndex.action"
        });
        $.isNode() && (await notify.sendNotify($.name + "cookie已失效 - " + $.UserName, "京东账号" + $.index + " " + $.UserName + "\n请重新登录获取cookie"));
        continue;
      }
      authorCodeList = [""];
      $.bean = 0;
      $.ADID = getUUID("xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", 1);
      $.UUID = getUUID("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
      $.authorCode = ownCode ? ownCode : authorCodeList[random(0, authorCodeList.length)];
      $.authorNum = "" + random(1000000, 9999999);
      $.activityId = drawCenterActivityId;
      $.activityUrl = "https://lzkj-isv.isvjd.com/drawCenter/activity/" + $.authorNum + "?activityId=" + $.activityId + "&shareUuid=" + encodeURIComponent($.authorCode) + "&shareuserid4minipg=null&shopid=" + $.venderId;
      message = "";
      await Main();
      if ($.outFlag || $.activityEnd) break;
      await $.wait(1000);
    }
  }
  Allmessage !== "" && $.isNode() && (await notify.sendNotify($.name, message, "", "\n"));
})().catch(liili1I1 => {
  $.log("", "❌ " + $.name + ", 失败! 原因: " + liili1I1 + "!", "");
}).finally(() => {
  $.done();
});
async function Main() {
  $.token = null;
  $.secretPin = null;
  $.activityEnd = false;
  $.needOpenCard = false;
  $.drawStop = false;
  await getFirstLZCK();
  $.token = await getToken(originCookie, "https://lzkj-isv.isvjd.com");
  if ($.index == 1) await taskPostUrl("customer/getSimpleActInfoVo", "activityId=" + $.activityId, 1);
  await $.wait(500);
  if ($.token) {
    await getMyPing();
    await $.wait(500);
    if ($.secretPin) {
      await taskPostUrl("common/accessLogWithAD", "venderId=" + $.venderId + "&code=" + $.activityType + "&pin=" + encodeURIComponent($.secretPin) + "&activityId=" + $.activityId + "&pageUrl=" + $.activityUrl + "&subType=app&adSource=null", 1);
      await $.wait(500);
      await taskPostUrl("wxActionCommon/getUserInfo", "pin=" + encodeURIComponent($.secretPin), 1);
      await $.wait(500);
      await taskPostUrl("activityContent", "activityId=" + $.activityId + "&pin=" + encodeURIComponent($.secretPin) + "&pinImg=" + encodeURIComponent($.pinImg) + "&nick=" + encodeURIComponent($.pin) + "&cjyxPin=&cjhyPin=&shareUuid=" + encodeURIComponent($.authorCode));
      await $.wait(500);
      if ($.index === 1) {
        await taskPostUrl("drawCenter/getPrizeList", "activityId=" + $.activityId + "&activityType=" + $.activityType + "&venderId=" + $.venderId, 1);
        await $.wait(500);
        await taskPostUrl("wxActionCommon/getShopInfoVO", "userId=" + $.venderId, 1);
        let I1ilIIil = prizeId = prizeName = "";
        for (let li1lll1i = 0; li1lll1i < $.prizeData.length; li1lll1i++) {
          prizeName = $.prizeData[li1lll1i].name;
          prizeId = $.prizeData[li1lll1i].id;
          if (prizeId == 0) {
            I1ilIIil += "谢谢参与";
            break;
          } else li1lll1i != $.prizeData.length - 1 ? I1ilIIil += prizeName + "，" : I1ilIIil += "" + prizeName;
        }
        console.log("店铺名称：" + ($.shopName || "未知") + "\n店铺链接：https://shop.m.jd.com/?venderId=" + $.venderId + "\n活动奖品：" + I1ilIIil + "\n");
      }
      if ($.activityContent) {
        if (isdoTask) {
          let IlI1i1l1 = false;
          await $.wait(500);
          await taskPostUrl("myInfo", "activityId=" + $.activityId + "&pin=" + encodeURIComponent($.secretPin));
          for (let lillII1 = 0; lillII1 < $.taskList.length; lillII1++) {
            $.taskType = $.taskList[lillII1].taskType;
            $.maxNeed = $.taskList[lillII1].maxNeed;
            $.curNum = $.taskList[lillII1].curNum;
            $.remaining = $.maxNeed - $.curNum;
            if ($.curNum == $.maxNeed) continue;
            await $.wait(500);
            switch ($.taskType) {
              case "share2help":
                if ($.index === 1) break;
                IlI1i1l1 = true;
                $.log("去助力好友");
                await taskPostUrl("helpFriend", "activityId=" + $.activityId + "&pin=" + encodeURIComponent($.secretPin) + "&shareUuid=" + encodeURIComponent($.authorCode));
                break;
              case "dailysign":
                IlI1i1l1 = true;
                $.log("进行每日签到");
                await taskPostUrl("doTask", "activityId=" + $.activityId + "&pin=" + encodeURIComponent($.secretPin) + "&taskId=dailysign&param=");
                break;
              case "followshop":
                IlI1i1l1 = true;
                $.log("去关注店铺");
                await taskPostUrl("doTask", "activityId=" + $.activityId + "&pin=" + encodeURIComponent($.secretPin) + "&taskId=followshop&param=");
                break;
              case "scanshop":
                IlI1i1l1 = true;
                $.log("去浏览店铺");
                await taskPostUrl("doTask", "activityId=" + $.activityId + "&pin=" + encodeURIComponent($.secretPin) + "&taskId=scanshop&param=");
                break;
              case "add2cart":
                if (addCart == "true") {
                  IlI1i1l1 = true;
                  await taskPostUrl("getProduct", "type=1&activityId=" + $.activityId + "&pin=" + encodeURIComponent($.secretPin));
                  for (let I1IiI11l = 0; I1IiI11l < $.getProduct.length; I1IiI11l++) {
                    await $.wait(500);
                    $.log("去加购商品");
                    await taskPostUrl("doTask", "activityId=" + $.activityId + "&pin=" + encodeURIComponent($.secretPin) + "&taskId=add2cart&param=" + $.getProduct[I1IiI11l].skuId);
                    if (I1IiI11l == $.remaining - 1) break;
                  }
                }
                break;
              case "ordersku":
                IlI1i1l1 = true;
                await taskPostUrl("getProduct", "type=2&activityId=" + $.activityId + "&pin=" + encodeURIComponent($.secretPin));
                for (let IlIliiil = 0; IlIliiil < $.getProduct.length; IlIliiil++) {
                  await $.wait(500);
                  $.log("去预约商品");
                  await taskPostUrl("doTask", "activityId=" + $.activityId + "&pin=" + encodeURIComponent($.secretPin) + "&taskId=ordersku&param=" + $.getProduct[IlIliiil].skuId);
                  if (IlIliiil == $.remaining - 1) break;
                }
                break;
              case "followsku":
                IlI1i1l1 = true;
                await taskPostUrl("getProduct", "type=3&activityId=" + $.activityId + "&pin=" + encodeURIComponent($.secretPin));
                for (let Il1Iiii = 0; Il1Iiii < $.getProduct.length; Il1Iiii++) {
                  await $.wait(500);
                  $.log("去关注商品");
                  await taskPostUrl("doTask", "activityId=" + $.activityId + "&pin=" + encodeURIComponent($.secretPin) + "&taskId=followsku&param=" + $.getProduct[Il1Iiii].skuId);
                  if (Il1Iiii == $.remaining - 1) break;
                }
                break;
              case "scansku":
                IlI1i1l1 = true;
                await taskPostUrl("getProduct", "type=4&activityId=" + $.activityId + "&pin=" + encodeURIComponent($.secretPin));
                for (let lIiIi1Il = 0; lIiIi1Il < $.getProduct.length; lIiIi1Il++) {
                  await $.wait(500);
                  $.log("去浏览商品");
                  await taskPostUrl("doTask", "activityId=" + $.activityId + "&pin=" + encodeURIComponent($.secretPin) + "&taskId=scansku&param=" + $.getProduct[lIiIi1Il].skuId);
                  if (lIiIi1Il == $.remaining - 1) break;
                }
                break;
              case "scanurl":
                IlI1i1l1 = true;
                $.venue_name = JSON.parse($.taskList[lillII1].params).name;
                $.log("去浏览会场");
                await taskPostUrl("doTask", "activityId=" + $.activityId + "&pin=" + encodeURIComponent($.secretPin) + "&taskId=" + $.taskList[lillII1].taskId + "&param=");
                break;
              default:
                break;
            }
          }
          if (IlI1i1l1) console.log("");
        }
        if ($.score > 0 && haveTasks) console.log("");
        if (isdraw) {
          await taskPostUrl("activityContent", "activityId=" + $.activityId + "&pin=" + encodeURIComponent($.secretPin) + "&pinImg=" + encodeURIComponent($.pinImg) + "&nick=" + encodeURIComponent($.pin) + "&cjyxPin=&cjhyPin=&shareUuid=" + encodeURIComponent($.authorCode));
          if ($.chance >= 1) {
            await $.wait(500);
            for (let IIIl1i = 0; IIIl1i < $.chance; IIIl1i++) {
              await taskPostUrl("draw/luckyDraw", "activityId=" + $.activityId + "&pin=" + encodeURIComponent($.secretPin));
              if ($.drawStop || $.needOpenCard || $.activityEnd) break;
              await $.wait(1000);
              if (IIIl1i == 9) {
                $.log("\n抽奖太多次了，下次再抽吧~");
                break;
              }
            }
          } else console.log("没有抽奖机会了~");
        }
      } else {
        console.log("未能成功获取到活动信息");
        $.activityEnd = true;
      }
    } else console.log("没有成功获取到用户信息");
  } else console.log("没有成功获取到用户鉴权信息");
}
function taskPostUrl(IIIIIII, l1I1IIIi, lill1l1l = 0) {
  return new Promise(I11III1 => {
    $.post(taskUrl(IIIIIII, l1I1IIIi, lill1l1l), async (lIlIlll1, lilII11i, ii11I1I1) => {
      try {
        if (lIlIlll1) $.log(lIlIlll1);else {
          if (ii11I1I1) {
            ii11I1I1 = JSON.parse(ii11I1I1);
            if (lilII11i.headers["set-cookie"]) {
              cookie = "";
              for (let Ilillii of lilII11i.headers["set-cookie"]) {
                lz_cookie[Ilillii.split(";")[0].substr(0, Ilillii.split(";")[0].indexOf("="))] = Ilillii.split(";")[0].substr(Ilillii.split(";")[0].indexOf("=") + 1);
              }
              for (const lliIlIl of Object.keys(lz_cookie)) {
                cookie += lliIlIl + "=" + lz_cookie[lliIlIl] + ";";
              }
            }
            if (ii11I1I1.result && ii11I1I1.result === true) {
              switch (IIIIIII) {
                case "customer/getSimpleActInfoVo":
                  $.jdActivityId = ii11I1I1.data.jdActivityId;
                  $.activityType = ii11I1I1.data.activityType;
                  $.venderId = ii11I1I1.data.venderId;
                  break;
                case "activityContent":
                  $.activityContent = ii11I1I1.data.activityId;
                  $.chance = ii11I1I1.data.chance || 0;
                  $.activityName = ii11I1I1.data.activityName || "";
                  $.isGameEnd = ii11I1I1.data.isGameEnd || false;
                  $.index === 1 && (ownCode = ii11I1I1.data.uid);
                  if ($.isGameEnd) $.activityEnd = true;
                  break;
                case "myInfo":
                  $.taskList = ii11I1I1.data.taskList;
                  break;
                case "wxActionCommon/getUserInfo":
                  if (ii11I1I1.data.yunMidImageUrl) {
                    $.index === 1 && (ownCode.pinImg = ii11I1I1.data.yunMidImageUrl, ownCode.nickname = ii11I1I1.data.nickname);
                    $.pinImg = ii11I1I1.data.yunMidImageUrl;
                  } else {
                    $.index === 1 && (ownCode.pinImg = "https://img10.360buyimg.com/imgzone/jfs/t1/7020/27/13511/6142/5c5138d8E4df2e764/5a1216a3a5043c5d.png", ownCode.nickname = ii11I1I1.data.nickname);
                    $.pinImg = "https://img10.360buyimg.com/imgzone/jfs/t1/7020/27/13511/6142/5c5138d8E4df2e764/5a1216a3a5043c5d.png";
                  }
                  break;
                case "helpFriend":
                  $.helpFriend = ii11I1I1.data.helpFriendMsg;
                  console.log("  >> " + $.helpFriend);
                  break;
                case "doTask":
                  console.log("  >> 任务完成");
                  break;
                case "getProduct":
                  $.getProduct = ii11I1I1.data;
                  break;
                case "wxActionCommon/getShopInfoVO":
                  $.shopName = ii11I1I1.data.shopName;
                  break;
                case "drawCenter/getPrizeList":
                  $.prizeData = ii11I1I1.data;
                  break;
                case "draw/luckyDraw":
                  if (ii11I1I1.data) {
                    let Ililliii = ii11I1I1.data.drawInfo;
                    if (Ililliii) switch (Ililliii.type) {
                      case 6:
                        console.log("🎉 " + Ililliii.name + " 🐶");
                        break;
                      case 7:
                        const III1l1l = ii11I1I1.data.addressId;
                        prizeName = Ililliii.name;
                        console.log("🎉 恭喜获得实物~");
                        console.log("奖品名称：" + prizeName);
                        console.log("参考价值：" + Ililliii.priceInfo + "（元）");
                        if (Ililliii.showImage) console.log("预览图片：" + Ililliii.showImage);
                        let lIil1ll = await wxSavePrize("https://lzkj-isv.isvjd.com", cookie, "jdapp;iPhone;9.5.4;13.6;" + $.UUID + ";network/wifi;ADID/" + $.ADID + ";model/iPhone10,3;addressid/0;appBuild/167668;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1", $.activityId, $.activityType, $.venderId, $.secretPin, prizeName, III1l1l);
                        if (lIil1ll) {
                          if ($.isNode()) {
                            await notify.sendNotify($.name + "中奖通知", "【京东账号" + $.index + "】" + $.nickName + "\n抽中实物 " + prizeName + "，已成功自动登记收货地址\n\nhttps://lzkj-isv.isvjd.com/drawCenter/activity/activity?activityId=" + $.activityId);
                          }
                        } else {
                          $.isNode() && (await notify.sendNotify($.name + "待领取奖品提醒", "【京东账号" + $.index + "】" + $.nickName + "\n抽中实物 " + prizeName + "，点击活动链接前往活动查看具体规则，若无套路请在我的奖品中填写收货地址领取！\n请在收到通知的一小时内进行操作，超过则无法再填写奖品收货地址可直接忽略本条消息，也可联系店铺客服加以甜言蜜语尝试挽回！\n\nhttps://lzkj-isv.isvjd.com/drawCenter/activity/activity?activityId=" + $.activityId));
                        }
                        break;
                      case 8:
                        console.log("🗑️ 专享价");
                        break;
                      case 9:
                        console.log("🗑️ " + Ililliii.name + " 🎟️");
                        break;
                      case 13:
                      case 14:
                      case 15:
                        console.log("🎉 恭喜获得" + Ililliii.name + " 🎁");
                        $.isNode() && (await notify.sendNotify($.name + "中奖通知", "【京东账号" + $.index + "】" + $.nickName + "\n抽中 " + Ililliii.name + "\n\nhttps://lzkj-isv.isvjd.com/drawCenter/activity/activity?activityId=" + $.activityId));
                        break;
                      case 16:
                        console.log("🎉 " + Ililliii.priceInfo + " 🧧");
                        break;
                      default:
                        Ililliii.name.includes("券") ? console.log("🗑️ 优惠券") : console.log("获得：" + Ililliii.name);
                        break;
                    } else console.log("💨 空气");
                    message += ii11I1I1.data.name;
                  }
                  break;
                default:
                  $.log(JSON.stringify(ii11I1I1));
                  break;
              }
              await $.wait(2000);
            } else {
              if (ii11I1I1.errorMessage) {
                if (IIIIIII == "draw/luckyDraw") {
                  let il1I1lI1 = ii11I1I1.errorMessage;
                  for (let i1Illli of ["上限", "不足", "超过"]) {
                    if (il1I1lI1.includes(i1Illli)) {
                      $.drawStop = true;
                      break;
                    }
                  }
                  for (let i1IlI1Il of ["未开始", "结束", "不存在", "不在"]) {
                    if (il1I1lI1.includes(i1IlI1Il)) {
                      $.activityEnd = true;
                      break;
                    }
                  }
                  for (let lI1iIIi of ["会员", "开卡"]) {
                    if (il1I1lI1.includes(lI1iIIi)) {
                      $.needOpenCard = true;
                      console.log("活动仅限店铺会员参与哦~");
                      break;
                    }
                  }
                  !il1I1lI1.includes("火爆") && !il1I1lI1.includes("擦肩") && !il1I1lI1.includes("缓存") && !$.drawStop && !$.needOpenCard && console.log(il1I1lI1 || "");
                }
              } else {
                if (IIIIIII == "doTask") console.log("  >> 任务失败，可能已经做过了");
              }
            }
          } else {}
        }
      } catch (lilll1Il) {
        $.log(lilll1Il);
      } finally {
        I11III1();
      }
    });
  });
}
function taskUrl(lli11Ii, l1ll1Ii1, lil11i11) {
  return {
    "url": lil11i11 ? "https://lzkj-isv.isvjd.com/" + lli11Ii : "https://lzkj-isv.isvjd.com/drawCenter/" + lli11Ii,
    "headers": {
      "Host": "lzkj-isv.isvjcloud.com",
      "Accept": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      "Accept-Language": "zh-cn",
      "Accept-Encoding": "gzip, deflate, br",
      "Content-Type": "application/x-www-form-urlencoded",
      "Origin": "https://lzkj-isv.isvjd.comm",
      "User-Agent": "jdapp;iPhone;9.5.4;13.6;" + $.UUID + ";network/wifi;ADID/" + $.ADID + ";model/iPhone10,3;addressid/0;appBuild/167668;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
      "Connection": "keep-alive",
      "Referer": $.activityUrl,
      "Cookie": cookie
    },
    "body": l1ll1Ii1
  };
}
function getMyPing() {
  let Iiil1iIl = {
    "url": "https://lzkj-isv.isvjd.com/customer/getMyPing",
    "headers": {
      "Host": "lzkj-isv.isvjcloud.com",
      "Accept": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      "Accept-Language": "zh-cn",
      "Accept-Encoding": "gzip, deflate, br",
      "Content-Type": "application/x-www-form-urlencoded",
      "Origin": "https://lzkj-isv.isvjd.com",
      "User-Agent": "jdapp;iPhone;9.5.4;13.6;" + $.UUID + ";network/wifi;ADID/" + $.ADID + ";model/iPhone10,3;addressid/0;appBuild/167668;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
      "Connection": "keep-alive",
      "Referer": $.activityUrl,
      "Cookie": cookie
    },
    "body": "userId=" + $.venderId + "&token=" + $.token + "&fromType=APP&riskType=1"
  };
  return new Promise(i1l111ll => {
    $.post(Iiil1iIl, (ii1lI1il, l1IIl1il, lIIIl111) => {
      try {
        if (ii1lI1il) $.log(ii1lI1il);else {
          if (l1IIl1il.headers["set-cookie"]) {
            cookie = "";
            for (let i1Ii1ll1 of l1IIl1il.headers["set-cookie"]) {
              lz_cookie[i1Ii1ll1.split(";")[0].substr(0, i1Ii1ll1.split(";")[0].indexOf("="))] = i1Ii1ll1.split(";")[0].substr(i1Ii1ll1.split(";")[0].indexOf("=") + 1);
            }
            for (const l1lIilII of Object.keys(lz_cookie)) {
              cookie += l1lIilII + "=" + lz_cookie[l1lIilII] + ";";
            }
          }
          lIIIl111 ? (lIIIl111 = JSON.parse(lIIIl111), lIIIl111.result ? ($.pin = lIIIl111.data.nickname, $.secretPin = lIIIl111.data.secretPin) : $.log(lIIIl111.errorMessage)) : $.log("京东返回了空数据");
        }
      } catch (IlllIi11) {
        $.log(IlllIi11);
      } finally {
        i1l111ll();
      }
    });
  });
}
function getFirstLZCK() {
  return new Promise(l1ll111I => {
    $.get({
      "url": $.activityUrl,
      "headers": {
        "user-agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : require("./USER_AGENTS").USER_AGENT : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"
      }
    }, (IIll1li, IliIili1, i1lII1) => {
      try {
        if (IIll1li) console.log(String(IIll1li));else {
          if (IliIili1.headers["set-cookie"]) {
            cookie = "";
            for (let lIil1IIl of IliIili1.headers["set-cookie"]) {
              lz_cookie[lIil1IIl.split(";")[0].substr(0, lIil1IIl.split(";")[0].indexOf("="))] = lIil1IIl.split(";")[0].substr(lIil1IIl.split(";")[0].indexOf("=") + 1);
            }
            for (const i1lIiIl of Object.keys(lz_cookie)) {
              cookie += i1lIiIl + "=" + lz_cookie[i1lIiIl] + ";";
            }
          }
        }
      } catch (llI1IIi) {
        console.log(llI1IIi);
      } finally {
        l1ll111I();
      }
    });
  });
}
function random(l11llli1, i11Ii11i) {
  return Math.floor(Math.random() * (i11Ii11i - l11llli1)) + l11llli1;
}
function getUUID(il1I1IiI = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", ilI111I = 0) {
  return il1I1IiI.replace(/[xy]/g, function (ilI1iII1) {
    var IIl1illi = Math.random() * 16 | 0,
      l1iI1i = ilI1iII1 == "x" ? IIl1illi : IIl1illi & 3 | 8;
    return ilI111I ? uuid = l1iI1i.toString(36).toUpperCase() : uuid = l1iI1i.toString(36), uuid;
  });
}
function checkCookie() {
  const ilIIIi1 = {
    "url": "https://me-api.jd.com/user_new/info/GetJDUserInfoUnion",
    "headers": {
      "Host": "me-api.jd.com",
      "Accept": "*/*",
      "Connection": "keep-alive",
      "Cookie": cookie,
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Mobile/15E148 Safari/604.1",
      "Accept-Language": "zh-cn",
      "Referer": "https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&",
      "Accept-Encoding": "gzip, deflate, br"
    }
  };
  return new Promise(ilii1lll => {
    $.get(ilIIIi1, (i11111il, i1iillII, iII1Il1I) => {
      try {
        if (i11111il) $.logErr(i11111il);else {
          if (iII1Il1I) {
            iII1Il1I = JSON.parse(iII1Il1I);
            if (iII1Il1I.retcode === "1001") {
              $.isLogin = false;
              return;
            }
            iII1Il1I.retcode === "0" && iII1Il1I.data.hasOwnProperty("userInfo") && ($.nickName = iII1Il1I.data.userInfo.baseInfo.nickname);
          } else {
            $.log("京东返回了空数据");
          }
        }
      } catch (ilill111) {
        $.logErr(ilill111);
      } finally {
        ilii1lll();
      }
    });
  });
}

function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(),"h+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), "S+": s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }
