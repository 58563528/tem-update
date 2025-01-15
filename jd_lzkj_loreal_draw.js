/*
活动名称：幸运抽奖（超级无线）
活动链接：https://lzkj-isv.isvjcloud.com/prod/cc/interactsaas/index?activityType=<10001/10004/10020/10021/10026/10041/10042/10046/10054/10062/10063/10073/10080>&templateId=<模板id>&activityId=<活动id>&prd=cjwx
环境变量：jd_lzkj_loreal_draw_url // 活动链接
          jd_lzkj_loreal_draw_Notify // 是否推送通知（true/false），默认不推送
		  jd_lzkj_loreal_draw_opencard // 是否入会（true/false），默认不入会
		  jd_lzkj_loreal_draw_break // 493后继续执行，默认退出运行（true/false）
          jd_lzkj_loreal_draw_Interval // 自定义抽奖间隔（正整数），默认1秒
		  jd_lzkj_loreal_draw_Number // 连续无次数跳出，默认 7 次，火爆账号请设置黑名单，否则也会占用次数
		  jd_lzkj_loreal_draw_MaxMiss // 最大连续未抽中次数（正整数），达到此次数后会跳过运行对应账号，默认不启用此功能
		  
注释：
请使用本地IP环境 请使用本地IP环境 请使用本地IP环境
需要链接中的三个必要参数才能正常访问活动页，运行脚本至少需要提供 activityId 参数
只有在没有抽奖次数的前提下才会做任务，做任务静默运行没有打印日志

cron:1 1 1 1 *
============Quantumultx===============
[task_local]
#幸运抽奖（超级无线）
1 1 1 1 * jd_lzkj_loreal_draw.js, tag=幸运抽奖（超级无线）, enabled=true

*/
if (process.env.proxy_wind === 'true') {const setGlobalHttpProxy = require('./utils/proxy-wind.js');setGlobalHttpProxy();}
let lnrun = 0;

const $ = new Env('幸运抽奖（超级无线）');
var version_ = "jsjiami.com.v7";
const l1l1i = $.isNode() ? require("./jdCookie") : "",
  I1I1II = require("./function/jdCommon"),
  i11ll = require("./function/sendJDNotify"),
  Ili11I = require("./function/krgetToken"),
  {
    wuxianDefense: i11li
  } = require("./function/jdCrypto"),
  {
    loreal_savePrize: Illil
  } = require("./function/krsavePrize");
let Ill1II = [];
const llIili = process.env.jd_lzkj_loreal_draw_url || "",
  Illii = process.env.jd_lzkj_loreal_draw_opencard === "true",
  iIlI11 = process.env.jd_lzkj_loreal_draw_Notify === "true",
  IIII = process.env.jd_lzkj_loreal_draw_break === "true",
  l1IIlI = process.env.jd_lzkj_loreal_draw_Interval || "";
let iil111 = process.env.jd_lzkj_loreal_draw_MaxMiss || "",
  llIil1 = true,
  iiiIII = process.env.jd_lzkj_loreal_draw_Number ? process.env.jd_lzkj_loreal_draw_Number : "7",
  Ill1I1 = "",
  lIi1ii = "";
if ($.isNode()) {
  if (JSON.stringify(process.env).indexOf("GITHUB") > -1) {
    process.exit(0);
  }
  Object.keys(l1l1i).forEach(IiIli => {
    Ill1II.push(l1l1i[IiIli]);
  });
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === "false") {
    console.log = () => {};
  }
} else {
  Ill1II = [$.getdata("CookieJD"), $.getdata("CookieJD2"), ...$.toObj($.getdata("CookiesJD") || "[]").map(illil1 => illil1.cookie)].filter(IIIlii => !!IIIlii);
}
!Ill1II[0] && ($.msg($.name, "【提示】请先获取Cookie"), process.exit(1));
!(async () => {
  if (!llIili) {
    console.log("⚠ 请先定义必要的环境变量后再运行脚本");
    return;
  }
  const iII1II = I1I1II.parseUrl(llIili);
  if (!iII1II) {
    console.log("⚠ 请填写格式正确的链接");
    return;
  }
  $.activityUrl = llIili;
  $.activityId = I1I1II.getUrlParameter(llIili, "activityId");
  $.activityType = I1I1II.getUrlParameter(llIili, "activityType");
  $.hostname = iII1II.hostname;
  $.pathname = iII1II.pathname;
  let IiIll = "";
  if ($.hostname) {
    if ($.hostname.includes("lorealjdcampaign-rc")) {
      IiIll = "apps/interact";
    } else {
      $.hostname.includes("lzkj") && (IiIll = $.pathname.replace(/\/index$/, ""));
    }
    $.baseUrl = "https://" + $.hostname;
    $.newbaseUrl = "https://" + $.hostname + "/" + IiIll;
    $.origin = $.baseUrl;
  }
  if (!$.activityId || !IiIll || !$.hostname) {
    console.log("⚠ 请填写格式正确的变量");
    return;
  }
  try {
    iil111 = parseInt(iil111);
  } catch {
    iil111 = 0;
  }
  i11ll.config({
    title: $.name
  });
  console.log("活动入口：" + $.activityUrl);
  console.log("\n是否推送通知【" + (iIlI11 == true ? "通知" : "不通知") + "】 是否开卡 【" + (Illii == true ? "不开卡" : "默认开卡") + "】");
  console.log("\n当前设定连续 【" + iiiIII + "】 次无抽奖次数跳出");
  console.log("\n当前设定 493 是否继续运行【" + (IIII == true ? "不退出" : "退出") + "】");
  for (let iliIi = 0; iliIi < Ill1II.length; iliIi++) {
    if (iliIi > iiiIII && llIil1) {
      console.log("\n检测到多次无抽奖次数，跳过此次运行\n");
      break;
    }
    $.outFlag = false;
    if (Ill1II[iliIi]) {
      $.index = iliIi + 1;
      Ill1I1 = Ill1II[iliIi];
      lIi1ii = Ill1II[iliIi];
      I1I1II.setCookie(lIi1ii);
      $.UserName = decodeURIComponent(I1I1II.getCookieValue(Ill1I1, "pt_pin"));
      $.UA = I1I1II.genUA($.UserName);
      $.UUID = I1I1II.genUuid("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
      $.te = Math.floor(Math.random() * 9000) + 1000;
      $.message = i11ll.create($.index, $.UserName);
      $.nickName = "";
      console.log("\n******开始【京东账号" + $.index + "】" + ($.nickName || $.UserName) + "******\n");
      let Interval = process.env.jd_jk_interval || 60 * 1000;console.log("环境变量jd_task_interval已设置为"+Interval/1000+"秒");lnrun++;if(lnrun == 3){console.log(`\n【访问接口次数达到2次，休息一分钟.....】\n`);await $.wait(Interval);lnrun = 0}
      await lIi1il();
      I1I1II.unsetCookie();
      if ($.outFlag || $.runEnd) {
        break;
      }
    }
  }
  iIlI11 && i11ll.getMessage() && (i11ll.updateContent(i11ll.content + ("\n【活动地址】" + $.activityUrl)), await i11ll.push());
})().catch(iiil1I => $.logErr(iiil1I)).finally(() => $.done());
async function lIi1il() {
  try {
    $.skipRun = false;
    $.token = "";
    $.pinToken = "";
    if ($.runEnd || $.outFlag) {
      return;
    }
    $.jdToken = await Ili11I(lIi1ii, $.baseUrl);
    if (!$.jdToken) {
      console.log("获取 Token 失败！");
      $.message.fix("获取[Token]失败");
      return;
    }
    await l1l1l("login");
    if ($.runEnd || $.outFlag || $.skipRun) {
      return;
    }
    if (!$.token) {
      console.log("未能获取用户鉴权信息！");
      $.message.fix("未能获取用户鉴权信息");
      return;
    }
    await $.wait(500);
    if ($.joinCode) {
      switch ($.joinCode) {
        case "1004":
          await l1l1l("follow");
          await $.wait(500);
          await l1l1l("login");
          if ($.runEnd || $.outFlag || $.skipRun) {
            return;
          }
          await $.wait(500);
          break;
        case "1005":
          await l1l1l("follow");
          await $.wait(500);
          await l1l1l("login");
          if ($.runEnd || $.outFlag || $.skipRun) {
            return;
          }
          await $.wait(500);
        case "1006":
          if (Illii) {
            const l1I11i = await I1I1II.joinShopMember($.venderId);
            if (l1I11i) {
              console.log("加入店铺会员成功");
              await l1l1l("login");
              if ($.runEnd || $.outFlag || $.skipRun) {
                return;
              }
              await $.wait(500);
            } else {
              console.log("加入店铺会员失败，活动仅限店铺会员参与哦~");
              $.message.fix("加入店铺会员失败，活动仅限店铺会员参与");
              return;
            }
          } else {
            console.log("活动仅限店铺会员参与哦~");
            $.message.fix("活动仅限店铺会员参与");
            return;
          }
          break;
        default:
          if ($.joinCode !== "1001") {
            console.log($.joinDes);
            $.message.fix($.joinDes);
            return;
          }
          break;
      }
      if ($.runEnd || $.outFlag || $.skipRun) {
        return;
      }
    } else {
      if ($.runEnd || $.outFlag || $.skipRun) {
        return;
      }
      console.log("未能获取用户活动状态");
      $.message.fix("未能获取用户活动状态");
      return;
    }
    if ($.hostname.includes("lzkj") && $.pathname.includes("/prod/cc/interactsaas")) {
      await l1l1l("initPinToken");
      if (!$.pinToken) {
        console.log("获取 pinToken 失败！");
        $.message.fix("获取[pinToken]失败");
        return;
      }
      await $.wait(500);
    }
    if ($.runEnd || $.outFlag || $.skipRun) {
      return;
    }
    if ($.index === 1) {
      await l1l1l("basicInfo");
      if ($.runEnd || $.outFlag || $.skipRun) {
        return;
      }
      switch ($.activityType) {
        case "10001":
        case "10004":
        case "10020":
        case "10021":
        case "10026":
        case "10041":
        case "10042":
        case "10046":
        case "10054":
        case "10062":
        case "10063":
        case "10073":
        case "10080":
          break;
        case "":
          console.log("未能获取活动类型");
          $.message.fix("未能获取活动类型");
          $.runEnd = true;
          return;
        default:
          console.log("❌ 当前活动类型（" + $.activityType + "）暂不受本脚本支持，请联系作者进行反馈！");
          $.message.fix("活动类型（" + $.activityType + "）不受支持");
          $.runEnd = true;
          return;
      }
      if ($.runEnd || $.outFlag) {
        return;
      }
      await $.wait(500);
    }
    await l1l1l("drawPrize");
    await $.wait(500);
    if ($.index === 1 && $.prizeInfo) {
      let ilIIl1 = false,
        ii1l = "";
      for (let liIIlI = 0; liIIlI < $.prizeInfo.length; liIIlI++) {
        const IliIil = $.prizeInfo[liIIlI],
          iliiIi = IliIil.prizeName,
          i11Ill = IliIil.leftNum,
          iliiIl = IliIil.prizeType;
        i11Ill >= 1 && (ilIIl1 = true);
        ii1l += "  " + iliiIi + (iliiIl === 5 ? "[专享价]" : iliiIl === 3 ? "[实物]" : "") + "，" + (i11Ill >= 1 ? "剩余" + i11Ill + "件" : "已发完") + "\n";
      }
      console.log(($.shopName && "店铺名称：#" + $.shopName + "\n") + "店铺链接：https://shop.m.jd.com/?venderId=" + $.venderId + "\n活动奖品：\n" + ii1l);
      i11ll.updateContent(i11ll.content + (($.shopName && "\n【店铺名称】#" + $.shopName) + "\n【活动奖品】\n" + ii1l));
      const iIl1I = $.time("yyyy-MM-dd HH:mm", $.actStartTime),
        liIi = $.time("yyyy-MM-dd HH:mm", $.actEndTime);
      switch ($.actStatus) {
        case 0:
          const IliIii = Date.now();
          if ($.actStartTime && IliIii < $.actStartTime) {
            console.log("活动将在 " + iIl1I + " 开始，晚点再来吧~");
            $.message.fix("活动尚未开始，开始时间：" + iIl1I);
            $.runEnd = true;
            return;
          }
          if ($.actEndTime && IliIii > $.actEndTime) {
            console.log("活动已于 " + liIi + " 结束，下次早点来吧~");
            $.message.fix("活动已结束，结束时间：" + liIi);
            $.runEnd = true;
            return;
          }
          break;
        case 1:
          console.log("活动将在 " + iIl1I + " 开始，晚点再来吧~");
          $.message.fix("活动尚未开始，开始时间：" + iIl1I);
          $.runEnd = true;
          return;
        case 2:
          console.log("活动已于 " + liIi + " 结束，下次早点来吧~");
          $.message.fix("活动已结束，结束时间：" + liIi);
          $.runEnd = true;
          return;
        default:
          $.actStatus && (console.log("未知活动状态 " + $.actStatus), $.message.fix("未知活动状态 " + $.actStatus), $.runEnd = true);
          break;
      }
      if (!ilIIl1) {
        console.log("奖品已全部发完了，下次早点来吧~");
        $.message.fix("奖品已发完");
        $.runEnd = true;
        return;
      }
    }
    if ($.runEnd || $.outFlag || $.skipRun) {
      return;
    }
    $.memberLevelInsufficient = false;
    switch ($.activityType) {
      case "10020":
      case "10021":
      case "10041":
      case "10042":
      case "10046":
      case "10054":
      case "10062":
      case "10063":
      case "10073":
        if ($.drawNumber <= 0) {
          if (["10020", "10021"].includes($.activityType)) {
            await l1l1l("jiugongge_activity");
          } else {
            ["10054"].includes($.activityType) ? await l1l1l("upperSign_getTask") : await l1l1l("lotteryCenter_activity");
          }
          await $.wait(500);
          if ($.runEnd || $.outFlag || $.skipRun) {
            return;
          }
          for (let ilIIlI = 0; ilIIlI < $.taskList.length; ilIIlI++) {
            if ($.memberLevelInsufficient) {
              break;
            }
            const liiiI1 = $.taskList[ilIIlI],
              iIl11 = liiiI1?.["status"] || 0,
              ii1I = liiiI1.taskType;
            if (iIl11 === 0) {
              if (liiiI1.taskId) {
                switch (ii1I) {
                  case 1:
                  case 2:
                  case 4:
                  case 6:
                  case 9:
                  case 14:
                    $.taskId = liiiI1.taskId;
                    $.skuId = "";
                    await l1l1l("toDo");
                    await $.wait(500);
                    break;
                  case 3:
                  case 5:
                  case 7:
                    $.taskId = liiiI1.taskId;
                    const liII = liiiI1.skuInfoVO || [];
                    for (let liIIil = 0; liIIil < liII.length; liIIil++) {
                      if (liII[liIIil].status !== 1) {
                        if ($.memberLevelInsufficient) {
                          break;
                        }
                        $.skuId = liII[liIIil].skuId;
                        await l1l1l("toDo");
                        await $.wait(500);
                      }
                    }
                    break;
                  case 10:
                  case 12:
                    const l1IlI1 = liiiI1?.["finishNum"],
                      ii11 = liiiI1?.["shareCount"];
                    if (ii11 <= l1IlI1) {
                      $.taskId = liiiI1.taskId;
                      $.skuId = "";
                      for (let liiiII = 0; liiiII < l1IlI1; liiiII++) {
                        if ($.memberLevelInsufficient) {
                          break;
                        }
                        await l1l1l("toDo");
                        await $.wait(500);
                      }
                    }
                    break;
                  case 15:
                    !$.shareUserId && ($.maxShareTimes = liiiI1.finishNum || 1);
                    await l1l1l("getUserId");
                    await $.wait(500);
                    break;
                  case 8:
                  case 13:
                  case 22:
                    break;
                  default:
                    break;
                }
              }
            }
          }
          await l1l1l("drawPrize");
          await $.wait(500);
        }
        break;
      case "10001":
      case "10004":
        await l1l1l("sign_add");
        await $.wait(500);
        break;
      case "10026":
      case "10080":
        break;
    }
    if ($.runEnd || $.outFlag || $.skipRun) {
      return;
    }
    let l1I11l = 500;
    if (l1IIlI) {
      try {
        const Ii1I1 = parseInt(l1IIlI) * 1000;
        l1I11l = Ii1I1 || 500;
      } catch {
        $.index === 1 && console.log("自定义抽奖间隔格式错误，已使用默认值");
      }
    }
    $.drawMissTimes = 0;
    switch ($.activityType) {
      case "10001":
      case "10004":
      case "10020":
      case "10021":
      case "10041":
      case "10042":
      case "10046":
      case "10054":
      case "10062":
      case "10063":
        if ($.drawNumber <= 0) {
          console.log("没有抽奖机会了~");
          $.message.fix("抽奖机会不足");
          return;
        }
        for (let IIIlll = 0; IIIlll < $.drawNumber; IIIlll++) {
          await l1l1l("draw");
          if (iil111 && $.drawMissTimes >= iil111) {
            break;
          }
          await $.wait(l1I11l);
          if (IIIlll >= 8) {
            console.log("\n抽奖太多次了，下次再继续吧~");
            $.message.insert("抽奖太多次了，下次再抽");
            break;
          }
        }
        break;
      case "10026":
      case "10073":
      case "10080":
        await l1l1l("getPoints");
        if ($.runEnd || $.outFlag || $.skipRun) {
          return;
        }
        if ($.drawNumber && ["10073", "10080"].includes($.activityType)) {
          $.poorScore += $.drawNumber * $.consumePoints;
        }
        const illii1 = parseInt($.poorScore / $.consumePoints);
        if (illii1 <= 0) {
          console.log("积分不足无法抽奖~");
          $.message.insert("积分不足");
          return;
        }
        await $.wait(500);
        for (let iIIIi = 0; iIIIi < illii1; iIIIi++) {
          await l1l1l("draw");
          if (iil111 && $.drawMissTimes >= iil111) {
            break;
          }
          if (iIIIi >= 8) {
            console.log("\n抽奖太多次了，下次再继续吧~");
            $.message.insert("抽奖太多次了，下次再抽");
            break;
          }
          await $.wait(l1I11l);
        }
        break;
    }
  } catch (IIiiil) {
    console.log("❌ 脚本运行遇到了错误\n" + IIiiil);
  }
}
async function liI11i(iIIIl, IIiiii) {
  try {
    switch (iIIIl) {
      case "login":
        if (IIiiii.resp_code === 0 && IIiiii.data) {
          $.token = IIiiii?.["data"]?.["token"];
          $.joinInfo = IIiiii?.["data"]?.["joinInfo"];
          $.openCardUrl = $.joinInfo?.["openCardUrl"];
          $.shopId = IIiiii?.["data"]?.["shopId"];
          $.venderId = I1I1II.getUrlParameter($.openCardUrl, "venderId");
          $.shopName = IIiiii?.["data"]?.["shopName"];
          $.joinCode = $.joinInfo?.["joinCodeInfo"]?.["joinCode"];
          $.joinDes = $.joinInfo?.["joinCodeInfo"]?.["joinDes"];
          $.shareUserId && ($.shareTimes += 1);
        } else {
          IIiiii.resp_msg ? (console.log(iIIIl + " " + IIiiii.resp_msg), $.message.fix(IIiiii.resp_msg), $.skipRun = true) : console.log("❓" + iIIIl + " " + JSON.stringify(IIiiii));
        }
        break;
      case "follow":
        if (!(IIiiii.resp_code === 0)) {
          if (IIiiii.resp_msg) {
            console.log(iIIIl + " " + IIiiii.resp_msg);
            $.message.fix(IIiiii.resp_msg);
            $.skipRun = true;
          } else {
            console.log("❓" + iIIIl + " " + JSON.stringify(IIiiii));
          }
        }
        break;
      case "initPinToken":
        if (IIiiii.resp_code === 0 && IIiiii.data) {
          IIiiii = JSON.parse(IIiiii.data);
          if (IIiiii.resp_code === 0 && IIiiii.data) {
            $.pinToken = IIiiii?.["data"]?.["pinToken"];
            $.encryptPin = IIiiii?.["data"]?.["encryptPin"];
          } else {
            if (IIiiii.resp_code === 1000) {
              console.log(iIIIl + " " + IIiiii.resp_msg);
              $.message.fix(IIiiii.resp_msg);
              $.skipRun = true;
            } else {
              IIiiii.resp_msg ? (console.log(iIIIl + " " + IIiiii.resp_msg), $.message.fix(IIiiii.resp_msg), $.skipRun = true) : (console.log("❓" + iIIIl + " " + JSON.stringify(IIiiii)), $.skipRun = true);
            }
          }
        } else {
          console.log("❓" + iIIIl + " " + JSON.stringify(IIiiii));
        }
        break;
      case "basicInfo":
        if (IIiiii.resp_code === 0 && IIiiii.data) {
          $.actStartTime = IIiiii.data?.["startTime"];
          $.actEndTime = IIiiii.data?.["endTime"];
          $.actStatus = IIiiii.data?.["actStatus"];
          !$.activityType && ($.activityType = String(IIiiii.data?.["actType"] || ""));
        } else {
          IIiiii.resp_msg ? (console.log(iIIIl + " " + IIiiii.resp_msg), $.message.fix(IIiiii.resp_msg)) : console.log("❓" + iIIIl + " " + JSON.stringify(IIiiii));
        }
        break;
      case "getPoints":
        if (IIiiii.resp_code === 0 && IIiiii.data) {
          $.consumePoints = IIiiii.data?.["consumePoints"];
          $.poorScore = IIiiii.data?.["poorScore"];
        } else {
          if (IIiiii.resp_msg) {
            console.log(iIIIl + " " + IIiiii.resp_msg);
            $.message.fix(IIiiii.resp_msg);
            $.skipRun = true;
          } else {
            console.log("❓" + iIIIl + " " + JSON.stringify(IIiiii));
          }
        }
        break;
      case "getUserId":
        if (IIiiii.resp_code === 0 && IIiiii.data) {
          !$.shareUserIdArray && ($.shareUserIdArray = [], $.shareTimes = 0);
          $.shareUserIdArray.push(IIiiii.data?.["shareUserId"]);
          !$.shareUserId && ($.shareUserId = IIiiii.data?.["shareUserId"]);
          $.shareTimes >= $.maxShareTimes && ($.shareUserId = $.shareUserIdArray[0] || "", $.shareTimes = 0);
        } else {
          IIiiii.resp_msg ? (console.log(iIIIl + " " + IIiiii.resp_msg), ["会员等级不足"].some(iIiiII => IIiiii.resp_msg.includes(iIiiII)) && ($.memberLevelInsufficient = true)) : console.log("❓" + iIIIl + " " + JSON.stringify(IIiiii));
        }
        break;
      case "jiugongge_activity":
      case "lotteryCenter_activity":
      case "upperSign_getTask":
        if (IIiiii.resp_code === 0) {
          $.taskList = IIiiii?.["data"]?.["taskList"] || [];
        } else {
          if (IIiiii.resp_code === 1000) {
            console.log(iIIIl + " 获取任务失败");
            $.message.insert("获取任务失败");
          } else {
            IIiiii.resp_msg ? console.log(iIIIl + " " + IIiiii.resp_msg) : console.log("❓" + iIIIl + " " + JSON.stringify(IIiiii));
          }
        }
        break;
      case "sign_add":
        if (IIiiii.resp_code === 0) {
          IIiiii.data && IIiiii.data?.["score"] && ($.drawNumber += IIiiii.data?.["score"]);
        } else {
          if (!(IIiiii.resp_code === 50013 || IIiiii.resp_code === 50012)) {
            IIiiii.resp_msg ? console.log(iIIIl + " " + IIiiii.resp_msg) : console.log("❓" + iIIIl + " " + JSON.stringify(IIiiii));
          }
        }
        break;
      case "toDo":
        if (!(IIiiii.resp_code === 0)) {
          if (!(IIiiii.resp_code === 50013 || IIiiii.resp_code === 50012)) {
            IIiiii.resp_msg ? (["会员等级不足"].some(iIIIlI => IIiiii.resp_msg.includes(iIIIlI)) && ($.memberLevelInsufficient = true), console.log(iIIIl + " " + IIiiii.resp_msg)) : console.log("❓" + iIIIl + " " + JSON.stringify(IIiiii));
          }
        }
        break;
      case "draw":
        if (IIiiii.resp_code === 0) {
          if (IIiiii.data === "1") {
            console.log("积分不足无法抽奖");
            $.message.insert("积分不足");
          } else {
            if (IIiiii.data === "2") {
              console.log("抽奖机会不足");
              $.message.insert("抽奖机会不足");
            } else {
              const IIll1i = IIiiii.data;
              if (IIll1i) {
                switch (IIll1i.prizeType) {
                  case 1:
                    console.log("🎉 " + IIll1i.prizeName + " 🐶");
                    $.message.insert(IIll1i.prizeName + "🐶");
                    break;
                  case 2:
                    console.log("🗑️ 优惠券");
                    $.message.insert("🗑️ 优惠券");
                    break;
                  case 3:
                    const lI1iII = IIiiii.data.addressId,
                      IIll1l = IIll1i.prizeName;
                    console.log("🎉 恭喜获得实物~");
                    console.log("奖品名称：" + IIll1l);
                    if (IIll1i.showImg) {
                      console.log("预览图片：" + IIll1i.showImg);
                    }
                    const l1I1lI = {
                        baseUrl: $.baseUrl,
                        newbaseUrl: $.newbaseUrl,
                        cookie: lIi1ii,
                        ua: $.UA,
                        token: $.token,
                        prizeName: IIll1l,
                        orderCode: lI1iII
                      },
                      iIIIl1 = await Illil(l1I1lI);
                    !iIlI11 && iIIIl1 && (await i11ll.sendNotify($.name + "中奖通知", "【京东账号" + $.index + "】" + $.nickName + "\n抽中实物 " + IIll1l + "，已成功自动登记收货地址\n\n" + $.activityUrl));
                    $.message.insert(IIll1l + "(" + (iIIIl1 ? "已填地址" : "未填地址") + ")🎁");
                    break;
                  case 4:
                  case 11:
                    console.log("🗑️ " + IIll1i.prizeName + " 🎟️");
                    $.message.insert("🗑️ " + IIll1i.prizeName + " 🎟️");
                    break;
                  case 5:
                    console.log("🗑️ 专享价");
                    $.message.insert("🗑️ 专享价");
                    break;
                  case 6:
                    console.log("🎉 " + IIll1i.prizeName + " 🧧");
                    $.message.insert("🎉 " + IIll1i.prizeName + " 🧧");
                    break;
                  case 7:
                  case 8:
                  case 9:
                  case 10:
                  case 12:
                    console.log("🎉 恭喜获得" + IIll1i.prizeName + " 🎁");
                    $.message.insert("🎉 恭喜获得" + IIll1i.prizeName + " 🎁");
                    !iIlI11 && (await i11ll.sendNotify($.name + "中奖通知", "【京东账号" + $.index + "】" + $.nickName + "\n抽中 " + IIll1i.prizeName + "\n\n" + $.activityUrl));
                    break;
                  default:
                    console.log(IIll1i);
                    break;
                }
              } else {
                $.drawMissTimes += 1;
                console.log("💨 空气");
                $.message.insert("💨 空气");
              }
            }
          }
        } else {
          if (IIiiii.resp_msg) {
            ["未开始", "结束", "不存在", "不在"].some(liii1l => IIiiii.resp_msg.includes(liii1l)) && ($.runEnd = true);
            console.log(iIIIl + " " + IIiiii.resp_msg);
            $.message.fix(IIiiii.resp_msg);
          } else {
            console.log("❓" + iIIIl + " " + JSON.stringify(IIiiii));
          }
        }
        break;
      case "drawPrize":
        if (IIiiii.resp_code === 0) {
          $.drawNumber = IIiiii?.["data"]?.["drawNumber"];
          $.prizeInfo = IIiiii?.["data"]?.["prizeInfo"] || [];
        } else {
          IIiiii.resp_msg ? (console.log(iIIIl + " " + IIiiii.resp_msg), ["未开始", "结束", "不存在", "不在"].some(I1iiI1 => IIiiii.resp_msg.includes(I1iiI1)) && ($.runEnd = true), $.message.fix(IIiiii.resp_msg)) : console.log("❓" + iIIIl + " " + JSON.stringify(IIiiii));
        }
        break;
    }
  } catch (li11l1) {
    console.log("❌ 未能正确处理 " + iIIIl + " 请求响应 " + (li11l1.message || li11l1));
  }
}
async function l1l1l(IIlIIl) {
  if ($.runEnd || $.outFlag) {
    return;
  }
  let I1IIiI = $.newbaseUrl,
    ilIli1 = {},
    li11lI = {},
    l1I1ll = "POST";
  switch (IIlIIl) {
    case "login":
      I1IIiI += "/api/user-info/login";
      ilIli1 = {
        status: "1",
        activityId: $.activityId,
        tokenPin: $.jdToken,
        source: "01",
        shareUserId: $.shareUserId || "",
        uuid: $.UUID
      };
      break;
    case "follow":
      I1IIiI += "/api/task/followShop/follow";
      break;
    case "initPinToken":
      l1I1ll = "GET";
      I1IIiI += "/api/user-info/initPinToken?status=1&activityId=" + $.activityId + "&jdToken=" + $.jdToken + "&source=01&shareUserId=" + ($.shareUserId || "") + "&uuid=" + $.UUID + "&clientTime=" + Date.now() + "&shopId=" + $.shopId;
      break;
    case "basicInfo":
      I1IIiI += "/api/active/basicInfo";
      ilIli1 = {
        activityId: $.activityId
      };
      break;
    case "getPoints":
      I1IIiI += "/api/task/points/getPoints";
      break;
    case "getUserId":
      I1IIiI += "/api/task/share/getUserId";
      break;
    case "jiugongge_activity":
      I1IIiI += "/api/task/jiugongge/activity";
      break;
    case "lotteryCenter_activity":
      I1IIiI += "/api/task/lotteryCenter/activity";
      break;
    case "upperSign_getTask":
      I1IIiI += "/api/task/upperSign/getTask";
      ilIli1 = {
        shareUserId: $.shareUserId || ""
      };
      break;
    case "sign_add":
      I1IIiI += "/api/task/sign/add";
      break;
    case "toDo":
      I1IIiI += "/api/basic/task/toDo";
      ilIli1 = {
        taskId: $.taskId,
        skuId: $.skuId
      };
      break;
    case "drawPrize":
      I1IIiI += "/api/prize/drawPrize";
      break;
    case "draw":
      I1IIiI += "/api/prize/draw";
      ilIli1 = {
        consumePoints: $.consumePoints || 0
      };
      break;
    default:
      console.log("❌ 未知请求 " + IIlIIl);
      return;
  }
  const li1il = l1I1ll === "POST" && $.pathname.includes("/prod/cc/interactsaas") && i11li.isDefenseApi(I1IIiI.replace($.newbaseUrl, "").split("?")[0]);
  li1il && (ilIli1.actId = $.activityId, li11lI = {
    ecyText: i11li.encrypt(ilIli1, $.pinToken, $.te)
  });
  const l1I1li = {
    url: I1IIiI,
    headers: {
      Accept: "application/json, text/plain, */*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,en-GB;q=0.6",
      Connection: "keep-alive",
      "Content-Type": "application/json;charset=UTF-8",
      Cookie: "IsvToken=" + $.jdToken + "; " + ($.pinToken ? ";pToken=" + $.pinToken : "") + ($.te ? ";te=" + $.te : ""),
      Host: $.hostname,
      Origin: $.origin,
      Referer: $.activityUrl,
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      "User-Agent": $.UA
    },
    body: JSON.stringify(li1il ? li11lI : ilIli1),
    timeout: 30000
  };
  if ($.token) {
    l1I1li.headers.token = $.token;
  }
  l1I1ll === "GET" && (delete l1I1li.body, delete l1I1li.headers["Content-Type"]);
  const li1ii = 5;
  let lI1iI1 = 0,
    iIIIi1 = null,
    lIiIiI = false;
  while (lI1iI1 < li1ii) {
    if (lI1iI1 > 0) {
      await $.wait(1000);
    }
    const {
      err: ll1Iil,
      res: li1lI,
      data: iliiiI
    } = await illilI(l1I1li, l1I1ll);
    if (ll1Iil) {
      if (typeof ll1Iil === "string" && ll1Iil.includes("Timeout awaiting 'request'")) {
        iIIIi1 = IIlIIl + " 请求超时，请检查网络重试";
      } else {
        const i1Iil = li1lI?.["statusCode"];
        if (i1Iil) {
          if ([403, 493].includes(i1Iil)) {
            iIIIi1 = IIlIIl + " 请求失败，IP被限制（Response code " + i1Iil + "）";
            lIiIiI = true;
          } else {
            if ([400, 404].includes(i1Iil)) {
              iIIIi1 = IIlIIl + " 请求配置参数错误，请联系开发者进行反馈（Response code " + i1Iil + "）";
            } else {
              [500].includes(i1Iil) && li1il ? l1I1li.body = JSON.stringify({
                ecyText: i11li.encrypt(ilIli1, $.pinToken, $.te)
              }) : iIIIi1 = IIlIIl + " 请求失败（Response code " + i1Iil + "）";
            }
          }
        } else {
          iIIIi1 = IIlIIl + " 请求失败 => " + (ll1Iil.message || ll1Iil);
        }
      }
      lI1iI1++;
    } else {
      const lIl1Ii = I1I1II.getResponseCookie(li1lI),
        lIl1Il = false;
      lIl1Il && (console.log("\n---------------------------------------------------\n"), console.log("🔧 " + IIlIIl + " 响应Body => " + (iliiiI || "无") + "\n"), console.log("🔧 " + IIlIIl + " 响应Cookie => " + (lIl1Ii || "无") + "\n"), console.log("🔧 " + IIlIIl + " 请求参数"), console.log(l1I1li), console.log("\n---------------------------------------------------\n"));
      switch (IIlIIl) {
        case "initPinToken":
          const Ii1IlI = I1I1II.getCookieValue(lIl1Ii, "te");
          Ii1IlI && ($.te = Ii1IlI);
          break;
      }
      if (iliiiI) {
        try {
          const ll1Il1 = JSON.parse(iliiiI);
          liI11i(IIlIIl, ll1Il1);
          break;
        } catch (iliiii) {
          iIIIi1 = "❌ " + IIlIIl + " 接口响应数据解析失败: " + iliiii.message;
          console.log("🚫 " + IIlIIl + " => " + String(iliiiI));
          lI1iI1++;
        }
      } else {
        li1il && (l1I1li.body = JSON.stringify({
          ecyText: i11li.encrypt(ilIli1, $.pinToken, $.te)
        }));
        iIIIi1 = "❌ " + IIlIIl + " 接口无响应数据";
        lI1iI1++;
      }
      lIiIiI = false;
    }
  }
  lI1iI1 >= li1ii && (console.log(iIIIi1), lIiIiI && !IIII && ($.outFlag = true, $.message && $.message.fix(iIIIi1)));
}
async function illilI(IIlIIi, iliiil = "POST") {
  if (iliiil === "POST") {
    return new Promise(async lIilI1 => {
      $.post(IIlIIi, (I1IIll, i1Ii1, lIilII) => {
        lIilI1({
          err: I1IIll,
          res: i1Ii1,
          data: lIilII
        });
      });
    });
  } else {
    if (iliiil === "GET") {
      return new Promise(async ilIlli => {
        $.get(IIlIIi, (Ii1Iil, ll1IiI, li1li) => {
          ilIlli({
            err: Ii1Iil,
            res: ll1IiI,
            data: li1li
          });
        });
      });
    } else {
      const iIIIll = "不支持的请求方法";
      return {
        err: iIIIll,
        res: null,
        data: null
      };
    }
  }
}
var version_ = "jsjiami.com.v7";

function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(),"h+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), "S+": s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }
