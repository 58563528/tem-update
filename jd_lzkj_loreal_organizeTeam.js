/*
活动名称：组队瓜分奖品（超级无线）
活动链接：https://lzkj-isv.isvjcloud.com/prod/cc/interactsaas/index?activityType=10033&templateId=<模板id>&activityId=<活动id>&prd=cjwx
环境变量：jd_lzkj_loreal_organizeTeam_url // 活动链接
		jd_lzkj_loreal_organizeTeam_opencard // 是否入会（true/false），默认不入会
        jd_lzkj_loreal_organizeTeam_Notify // 是否推送通知（true/false），默认不推送
		jd_lzkj_loreal_organizeTeam_break // 493后继续执行，默认退出运行（true/false）
		
cron:1 1 1 1 *
============Quantumultx===============
[task_local]
#组队瓜分奖品（超级无线）
1 1 1 1 * jd_lzkj_loreal_organizeTeam.js, tag=组队瓜分奖品（超级无线）, enabled=true		

*/
if (process.env.proxy_wind === 'true') {const setGlobalHttpProxy = require('./utils/proxy-wind.js');setGlobalHttpProxy();}
let lnrun = 0;


const $ = new Env('组队瓜分奖品（超级无线）')
const I1ll1i = require("./jdCookie"),
  i11iII = require("./function/jdCommon"),
  lI1Ii1 = require("./function/sendJDNotify"),
  i1I11 = require("./function/krgetToken"),
  {
    wuxianDefense: I1I1i1
  } = require("./function/jdCrypto"),
  i1I1l = process.env.jd_lzkj_loreal_organizeTeam_url || "",
  i1I1i = process.env.jd_lzkj_loreal_organizeTeam_opencard === "true",
  IIiiII = process.env.jd_lzkj_loreal_organizeTeam_Notify === "true",
  llIiI = process.env.jd_lzkj_loreal_organizeTeam_break === "true";
let Ilill = "",
  Ilili = "";
const I1ll1I = Object.keys(I1ll1i).map(l1iIil => I1ll1i[l1iIil]).filter(l1iIii => l1iIii);
!I1ll1I[0] && ($.msg($.name, "【提示】请先获取Cookie"), process.exit(1));
!(async () => {
  if (!i1I1l) {
    console.log("⚠ 请先定义必要的环境变量后再运行脚本");
    return;
  }
  const II1II = i11iII.parseUrl(i1I1l);
  if (!II1II) {
    console.log("⚠ 请填写格式正确的链接");
    return;
  }
  $.activityUrl = i1I1l;
  $.activityId = i11iII.getUrlParameter(i1I1l, "activityId");
  $.activityType = i11iII.getUrlParameter(i1I1l, "activityType");
  $.hostname = II1II?.["hostname"];
  $.pathname = II1II.pathname;
  let ii1l11 = "";
  if ($.hostname) {
    if ($.hostname.includes("lorealjdcampaign-rc")) {
      ii1l11 = "apps/interact";
    } else {
      $.hostname.includes("lzkj") && (ii1l11 = i1I1l.match(/\/(prod\/cc\/interact\w*)\//)[1]);
    }
    $.baseUrl = "https://" + $.hostname;
    $.newbaseUrl = "https://" + $.hostname + "/" + ii1l11;
    $.origin = $.baseUrl;
  }
  if (!$.activityId || !ii1l11 || !$.hostname) {
    console.log("⚠ 请填写格式正确的变量");
    return;
  }
  lI1Ii1.config({
    title: $.name
  });
  console.log("活动入口：" + $.activityUrl);
  for (let llIl1 = 0; llIl1 < I1ll1I.length; llIl1++) {
    $.index = llIl1 + 1;
    Ilill = I1ll1I[llIl1];
    Ilili = I1ll1I[llIl1];
    i11iII.setCookie(Ilili);
    $.UserName = decodeURIComponent(i11iII.getCookieValue(Ilill, "pt_pin"));
    $.UA = i11iII.genUA($.UserName);
    $.UUID = i11iII.genUuid("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    $.te = Math.floor(Math.random() * 9000) + 1000;
    $.message = lI1Ii1.create($.index, $.UserName);
    $.nickName = "";
    console.log("\n******开始【京东账号" + $.index + "】" + ($.nickName || $.UserName) + "******\n");
      let Interval = process.env.jd_jk_interval || 60 * 1000;console.log("环境变量jd_task_interval已设置为"+Interval/1000+"秒");lnrun++;if(lnrun == 3){console.log(`\n【访问接口次数达到2次，休息一分钟.....】\n`);await $.wait(Interval);lnrun = 0}
    await Iii1I1();
    i11iII.unsetCookie();
    if ($.outFlag || $.runEnd) {
      break;
    }
  }
  const IIIIii = lI1Ii1.getMessage();
  IIIIii && (console.log("\n📣运行结果\n" + IIIIii.replace(/：/g, " ➜ ")), IIiiII && (lI1Ii1.updateContent(lI1Ii1.content + ("\n【活动地址】" + $.activityUrl)), await lI1Ii1.push()));
})().catch(l1iIiI => $.logErr(l1iIiI)).finally(() => $.done());
async function Iii1I1() {
  try {
    $.skipRun = false;
    $.token = "";
    $.pinToken = "";
    if ($.runEnd || $.outFlag) {
      return;
    }
    $.jdToken = await i1I11(Ilili, $.baseUrl);
    if (!$.jdToken) {
      console.log("获取 Token 失败！");
      $.message.fix("获取[Token]失败");
      return;
    }
    await Iii1II("login");
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
          await Iii1II("follow");
          await $.wait(500);
          await Iii1II("login");
          if ($.runEnd || $.outFlag || $.skipRun) {
            return;
          }
          await $.wait(500);
          break;
        case "1005":
          await Iii1II("follow");
          await $.wait(500);
          await Iii1II("login");
          if ($.runEnd || $.outFlag || $.skipRun) {
            return;
          }
          await $.wait(500);
        case "1006":
          if (i1I1i) {
            const iIiiiI = await i11iII.joinShopMember($.venderId);
            if (iIiiiI) {
              console.log("加入店铺会员成功");
              await Iii1II("login");
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
    if ($.hostname.includes("lzkj")) {
      await Iii1II("initPinToken");
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
    await Iii1II("activity");
    await $.wait(500);
    if ($.runEnd || $.outFlag || $.skipRun) {
      return;
    }
    if ($.index === 1) {
      await Iii1II("basicInfo");
      if ($.runEnd || $.outFlag || $.skipRun) {
        return;
      }
      switch ($.activityType) {
        case "10033":
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
      const iIIlli = $.activityContent?.["prizeType"];
      let ll1li1 = "",
        iIIlll = "";
      switch (iIIlli) {
        case 1:
          ll1li1 = "京豆";
          iIIlll = "🐶";
          break;
        case 4:
          ll1li1 = "积分";
          iIIlll = "🎟️";
          break;
        default:
          ll1li1 = "未知";
          iIIlll = "❓";
      }
      const I1iiiI = $.time("yyyy-MM-dd HH:mm", $.actStartTime),
        iiI1il = $.time("yyyy-MM-dd HH:mm", $.actEndTime),
        iiI1ii = $.activityContent?.["prizeList"][0]?.["totalPrizeNum"],
        I1iii1 = $.activityContent?.["groupNumber"],
        lilii1 = $.activityContent?.["captainPrize"],
        iIiii1 = $.activityContent?.["memberPrize"],
        ll1lil = ($.shopName && "店铺名称：#" + $.shopName + "\n") + "开始时间：" + I1iiiI + "\n结束时间：" + iiI1il + "\n奖品类型：" + ll1li1 + " " + iIIlll + "\n总计奖池：" + iiI1ii + "\n可组队伍：" + I1iii1 + " 🚗\n瓜分数量：" + 5 * iIiii1 + " " + iIIlll + "\n队长奖励：" + lilii1 + " " + iIIlll + "\n成员获得：" + iIiii1 + " " + iIIlll + "\n最高可得：" + (I1iii1 * (lilii1 + iIiii1) + iIiii1) + " " + iIIlll + "\n";
      lI1Ii1.updateContent(lI1Ii1.content + ("\n" + ll1lil));
      console.log(ll1lil);
      switch ($.actStatus) {
        case 0:
          const IIlil1 = Date.now();
          if ($.actStartTime && IIlil1 < $.actStartTime) {
            console.log("活动将在 " + I1iiiI + " 开始，晚点再来吧~");
            $.message.fix("活动尚未开始，开始时间：" + I1iiiI);
            $.runEnd = true;
            return;
          }
          if ($.actEndTime && IIlil1 > $.actEndTime) {
            console.log("活动已于 " + iiI1il + " 结束，下次早点来吧~");
            $.message.fix("活动已结束，结束时间：" + iiI1il);
            $.runEnd = true;
            return;
          }
          break;
        case 1:
          console.log("活动将在 " + I1iiiI + " 开始，晚点再来吧~");
          $.message.fix("活动尚未开始，开始时间：" + I1iiiI);
          $.runEnd = true;
          return;
        case 2:
          console.log("活动已于 " + iiI1il + " 结束，下次早点来吧~");
          $.message.fix("活动已结束，结束时间：" + iiI1il);
          $.runEnd = true;
          return;
        default:
          $.actStatus && (console.log("未知活动状态 " + $.actStatus), $.message.fix("未知活动状态 " + $.actStatus), $.runEnd = true);
          break;
      }
      await $.wait(500);
    }
    if (!$.teamId) {
      let li11 = $.activityContent?.["captainList"];
      const ilIlI1 = $.activityContent?.["groupNumber"] * 4,
        I1Illi = $.activityContent?.["joinFlag"];
      switch (I1Illi) {
        case 5:
        case 2:
          await Iii1II("saveCaptain");
          await $.wait(500);
          if ($.runEnd || $.outFlag || $.skipRun) {
            return;
          }
          await Iii1II("activity");
          await $.wait(500);
          li11 = $.activityContent?.["captainList"];
          for (const Illlll of li11) {
            if (Illlll.memberCount === 5) {
              continue;
            }
            $.teamId = Illlll.id;
            break;
          }
          $.canJoinMembers = ilIlI1;
          break;
        case 3:
        case 4:
          let IIlilI = 0;
          for (const llli1l of li11) {
            IIlilI += llli1l.memberCount - 1;
            if (llli1l.memberCount === 5) {
              continue;
            }
            $.teamId = llli1l.id;
            break;
          }
          if (IIlilI >= ilIlI1) {
            console.log("队伍人数已满");
            $.message.fix("队伍已满");
            $.runEnd = true;
            return;
          } else {
            console.log("已经是队长了");
            $.message.fix("已是队长");
            $.canJoinMembers = ilIlI1 - IIlilI;
          }
          break;
        default:
          console.log("未知队伍状态");
          $.message.insert("未知队伍状态");
          break;
      }
      await Iii1II("getUserId");
      await $.wait(500);
    } else {
      const iiI1l1 = $.activityContent?.["captain"];
      iiI1l1 ? (console.log("已经加入过队伍了"), $.message.fix("已经加入过队伍")) : (await Iii1II("saveMember"), await $.wait(500));
    }
  } catch (i11lI1) {
    console.log("❌ 脚本运行遇到了错误\n" + i11lI1);
  }
}
async function i11iI1(liliiI, ilIIiI) {
  try {
    switch (liliiI) {
      case "login":
        if (ilIIiI.resp_code === 0 && ilIIiI.data) {
          $.token = ilIIiI?.["data"]?.["token"];
          $.joinInfo = ilIIiI?.["data"]?.["joinInfo"];
          $.openCardUrl = $.joinInfo?.["openCardUrl"];
          $.shopId = ilIIiI?.["data"]?.["shopId"];
          $.venderId = i11iII.getUrlParameter($.openCardUrl, "venderId");
          $.shopName = ilIIiI?.["data"]?.["shopName"];
          $.joinCode = $.joinInfo?.["joinCodeInfo"]?.["joinCode"];
          $.joinDes = $.joinInfo?.["joinCodeInfo"]?.["joinDes"];
        } else {
          ilIIiI.resp_msg ? (console.log(liliiI + " " + ilIIiI.resp_msg), $.message.fix(ilIIiI.resp_msg), $.skipRun = true) : console.log("❓" + liliiI + " " + JSON.stringify(ilIIiI));
        }
        break;
      case "follow":
        if (!(ilIIiI.resp_code === 0)) {
          if (ilIIiI.resp_msg) {
            console.log(liliiI + " " + ilIIiI.resp_msg);
            $.message.fix(ilIIiI.resp_msg);
            $.skipRun = true;
          } else {
            console.log("❓" + liliiI + " " + JSON.stringify(ilIIiI));
          }
        }
        break;
      case "initPinToken":
        if (ilIIiI.resp_code === 0 && ilIIiI.data) {
          ilIIiI = JSON.parse(ilIIiI.data);
          if (ilIIiI.resp_code === 0 && ilIIiI.data) {
            $.pinToken = ilIIiI?.["data"]?.["pinToken"];
            $.encryptPin = ilIIiI?.["data"]?.["encryptPin"];
          } else {
            if (ilIIiI.resp_code === 1000) {
              console.log(liliiI + " " + ilIIiI.resp_msg);
              $.message.fix(ilIIiI.resp_msg);
              $.skipRun = true;
            } else {
              ilIIiI.resp_msg ? (console.log(liliiI + " " + ilIIiI.resp_msg), $.message.fix(ilIIiI.resp_msg), $.skipRun = true) : (console.log("❓" + liliiI + " " + JSON.stringify(ilIIiI)), $.skipRun = true);
            }
          }
        } else {
          console.log("❓" + liliiI + " " + JSON.stringify(ilIIiI));
        }
        break;
      case "basicInfo":
        if (ilIIiI.resp_code === 0 && ilIIiI.data) {
          $.actStartTime = ilIIiI.data?.["startTime"];
          $.actEndTime = ilIIiI.data?.["endTime"];
          $.actStatus = ilIIiI.data?.["actStatus"];
          $.shopName = ilIIiI.data?.["shopName"];
          if (!$.activityType) {
            $.activityType = String(ilIIiI.data?.["actType"] || "");
          }
        } else {
          ilIIiI.resp_msg ? (console.log(liliiI + " " + ilIIiI.resp_msg), $.message.fix(ilIIiI.resp_msg)) : console.log("❓" + liliiI + " " + JSON.stringify(ilIIiI));
        }
        break;
      case "activity":
        if (ilIIiI.resp_code === 0 && ilIIiI.data) {
          $.activityContent = ilIIiI.data;
        } else {
          ilIIiI.resp_msg ? (console.log(liliiI + " " + ilIIiI.resp_msg), $.message.fix(ilIIiI.resp_msg), $.skipRun = true, ["未开始", "结束", "不存在", "不在"].some(Il1I1 => ilIIiI.resp_msg.includes(Il1I1)) && ($.runEnd = true)) : (console.log("❓" + liliiI + " " + JSON.stringify(ilIIiI)), $.skipRun = true);
        }
        break;
      case "getUserId":
        if (ilIIiI.resp_code === 0 && ilIIiI.data) {
          $.shareUserId = ilIIiI.data?.["shareUserId"];
        } else {
          ilIIiI.resp_msg ? console.log(liliiI + " " + ilIIiI.resp_msg) : console.log("❓" + liliiI + " " + JSON.stringify(ilIIiI));
        }
        break;
      case "saveCaptain":
        if (ilIIiI.resp_code === 0) {
          console.log("创建队伍成功");
          $.message.fix("创建队伍成功");
        } else {
          if (ilIIiI.resp_msg) {
            console.log(liliiI + " " + ilIIiI.resp_msg);
            $.message.insert(ilIIiI.resp_msg);
            $.skipRun = true;
            if (["未开始", "结束", "不存在", "不在"].some(ilIIi1 => ilIIiI.resp_msg.includes(ilIIi1))) {
              $.runEnd = true;
            }
          } else {
            console.log("❓" + liliiI + " " + JSON.stringify(ilIIiI));
            $.skipRun = true;
          }
        }
        break;
      case "saveMember":
        if (ilIIiI.resp_code === 0) {
          console.log("加入队伍成功");
          $.message.fix("加入队伍成功");
          $.canJoinMembers -= 1;
          $.canJoinMembers <= 0 && (console.log("战队已满，运行完毕"), $.runEnd = true);
        } else {
          if (ilIIiI.resp_msg) {
            console.log(liliiI + " " + ilIIiI.resp_msg);
            $.message.insert(ilIIiI.resp_msg);
            ["未开始", "结束", "不存在", "不在"].some(iIiili => ilIIiI.resp_msg.includes(iIiili)) && ($.runEnd = true);
            if (ilIIiI.resp_msg.includes("上限")) {
              $.runEnd = true;
              break;
            }
          } else {
            console.log("❓" + liliiI + " " + JSON.stringify(ilIIiI));
          }
        }
        break;
    }
  } catch (Ili1I1) {
    console.log("❌ 未能正确处理 " + liliiI + " 请求响应 " + (Ili1I1.message || Ili1I1));
  }
}
async function Iii1II(liI1II) {
  if ($.runEnd || $.outFlag) {
    return;
  }
  let l1liii = $.newbaseUrl,
    I1Ili1 = {},
    l1liil = {},
    i1ll1 = "POST";
  switch (liI1II) {
    case "login":
      l1liii += "/api/user-info/login";
      I1Ili1 = {
        status: "1",
        activityId: $.activityId,
        tokenPin: $.jdToken,
        source: "01",
        shareUserId: $.shareUserId || "",
        uuid: $.UUID
      };
      break;
    case "follow":
      l1liii += "/api/task/followShop/follow";
      break;
    case "initPinToken":
      i1ll1 = "GET";
      l1liii += "/api/user-info/initPinToken?status=1&activityId=" + $.activityId + "&jdToken=" + $.jdToken + "&source=01&shareUserId=" + ($.shareUserId || "") + "&uuid=" + $.UUID + "&clientTime=" + Date.now() + "&shopId=" + $.shopId;
      break;
    case "basicInfo":
      l1liii += "/api/active/basicInfo";
      I1Ili1 = {
        activityId: $.activityId
      };
      break;
    case "getUserId":
      l1liii += "/api/task/share/getUserId";
      break;
    case "activity":
      l1liii += "/api/task/organizeTeam/activity";
      I1Ili1 = {
        shareUserId: $.shareUserId || ""
      };
      break;
    case "saveCaptain":
      l1liii += "/api/task/organizeTeam/saveCaptain";
      break;
    case "saveMember":
      l1liii += "/api/task/organizeTeam/saveMember";
      I1Ili1 = {
        shareUserId: $.shareUserId,
        teamId: $.teamId
      };
      break;
    default:
      console.log("❌ 未知请求 " + liI1II);
      return;
  }
  const lilI1I = i1ll1 === "POST" && $.pathname.includes("/prod/cc/interactsaas") && I1I1i1.isDefenseApi(l1liii.replace($.newbaseUrl, "").split("?")[0]);
  if (lilI1I) {
    I1Ili1.actId = $.activityId;
    l1liil = {
      ecyText: I1I1i1.encrypt(I1Ili1, $.pinToken, $.te)
    };
  }
  const lI1I1l = {
    url: l1liii,
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
    body: JSON.stringify(lilI1I ? l1liil : I1Ili1),
    timeout: 30000
  };
  $.token && (lI1I1l.headers.token = $.token);
  i1ll1 === "GET" && (delete lI1I1l.body, delete lI1I1l.headers["Content-Type"]);
  const Il1Il = 5;
  let i1IiiI = 0,
    lI1I1I = null,
    l1lII = false;
  while (i1IiiI < Il1Il) {
    i1IiiI > 0 && (await $.wait(1000));
    const {
      err: Ili1Ii,
      res: Ii1l1I,
      data: iilII1
    } = await llIlI(lI1I1l, i1ll1);
    if (Ili1Ii) {
      if (typeof Ili1Ii === "string" && Ili1Ii.includes("Timeout awaiting 'request'")) {
        lI1I1I = liI1II + " 请求超时，请检查网络重试";
      } else {
        const l1lilI = Ii1l1I?.["statusCode"];
        if (l1lilI) {
          if ([403, 493].includes(l1lilI)) {
            lI1I1I = liI1II + " 请求失败，IP被限制（Response code " + l1lilI + "）";
            l1lII = true;
          } else {
            if ([400, 404].includes(l1lilI)) {
              lI1I1I = liI1II + " 请求配置参数错误，请联系开发者进行反馈（Response code " + l1lilI + "）";
            } else {
              [500].includes(l1lilI) && lilI1I ? lI1I1l.body = JSON.stringify({
                ecyText: I1I1i1.encrypt(I1Ili1, $.pinToken, $.te)
              }) : lI1I1I = liI1II + " 请求失败（Response code " + l1lilI + "）";
            }
          }
        } else {
          lI1I1I = liI1II + " 请求失败 => " + (Ili1Ii.message || Ili1Ii);
        }
      }
      i1IiiI++;
    } else {
      const Ili1II = i11iII.getResponseCookie(Ii1l1I);
      switch (liI1II) {
        case "initPinToken":
          const i1IilI = i11iII.getCookieValue(Ili1II, "te");
          i1IilI && ($.te = i1IilI);
          break;
      }
      if (iilII1) {
        try {
          const III1I1 = JSON.parse(iilII1);
          i11iI1(liI1II, III1I1);
          break;
        } catch (I1IllI) {
          lI1I1I = "❌ " + liI1II + " 接口响应数据解析失败: " + I1IllI.message;
          console.log("🚫 " + liI1II + " => " + String(iilII1));
          i1IiiI++;
        }
      } else {
        lilI1I && (lI1I1l.body = JSON.stringify({
          ecyText: I1I1i1.encrypt(I1Ili1, $.pinToken, $.te)
        }));
        lI1I1I = "❌ " + liI1II + " 接口无响应数据";
        i1IiiI++;
      }
      l1lII = false;
    }
  }
  if (i1IiiI >= Il1Il) {
    console.log(lI1I1I);
    l1lII && !llIiI && ($.outFlag = true, $.message && $.message.fix(lI1I1I));
  }
}
async function llIlI(i1Iili, i1Iill = "POST") {
  if (i1Iill === "POST") {
    return new Promise(async llIIIi => {
      $.post(i1Iili, (IiIiIl, I1Ilil, l1I1I1) => {
        llIIIi({
          err: IiIiIl,
          res: I1Ilil,
          data: l1I1I1
        });
      });
    });
  } else {
    if (i1Iill === "GET") {
      return new Promise(async III1Il => {
        $.get(i1Iili, (iill1l, IiIiII, iill1i) => {
          III1Il({
            err: iill1l,
            res: IiIiII,
            data: iill1i
          });
        });
      });
    } else {
      const iill11 = "不支持的请求方法";
      return {
        err: iill11,
        res: null,
        data: null
      };
    }
  }
}
function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(),"h+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), "S+": s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }
