// pages/plan/plans/plans.js
var app = getApp();
const baseUrl = app.baseUrl;
import { sortDate } from "../../../utils/util.js";

const date = new Date();
const Years = [];
const Months = [];
const Year = date.getFullYear();

for (let i = (Year - 5); i <= (Year + 5); i++) {
  Years.push(i + "年")
}

for (let i = 1; i <= 12; i++) {
  Months.push(i + "月");
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    stateIndex: 0,
    planStates: ['全部状态','未完成', '已完成'],
    Years: Years,
    Months: Months,
    DateIndex: [5, date.getMonth()],
    dates: [Years, Months],
    monthList: [],
    planList: [],
    dateMonth: ""
  },

  onLoad: function () {
    let dateMonth = Year + "-" + ((date.getMonth() + 1) > 10 ? (date.getMonth() + 1) : ("0" + (date.getMonth() + 1)));
    this.setData({
      dateMonth
    });
    wx.showLoading({ title: "请稍后..." });
    this.getPlans();
    wx.hideLoading();
  },

  getPlans() {
    let _self = this;
    let { dateMonth, stateIndex } = _self.data;
    stateIndex = stateIndex - 1;
    wx.request({
      url: baseUrl + "/plan/getPlans",
      method: "POST",
      data: {
        userId: app.globalData.userInfo.userId,
        Date: dateMonth,
        status: stateIndex
      },
      success: (res) => {
        if(res.data.code == 1) {
          let plans = res.data.data.plans;
          let monthList = sortDate(plans);
          _self.setData({
            planList: plans,
            monthList
          });
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none",
            duration: 2000
          });
        }
      }
    });
  },

  onPullDownRefresh() {
    this.getPlans();
    wx.stopPullDownRefresh();
  },

  /**
   * 用户选择计划列表展示状态
   */
  stateChoose: function (e) {
    let stateIndex = e.detail.value;
    this.setData({
      stateIndex
    });
    this.getPlans();
  },

  /**
   * 用户点击上一个月份
   */
  lastmonth: function () {
    let { dates, DateIndex } = this.data;
    let dateMonth = ""
    if (DateIndex[1] == 0) {
      if (DateIndex[0] != 0) {
        DateIndex[0]--;
      } else {
        DateIndex[0] = 0;
      }
      DateIndex[1] = 11;
    } else {
      DateIndex[1]--;
    }
    dateMonth = dates[0][DateIndex[0]].slice(0,4) + "-" + (dates[1][DateIndex[1]].length > 2 ? dates[1][DateIndex[1]].slice(0,2) : ("0" + dates[1][DateIndex[1]].slice(0,1)));
    this.setData({
      DateIndex,
      dateMonth
    });
    this.getPlans();
  },

  /**
   * 用户选择计划类表展示月份
   */
  dateChoose: function (e) {
    let dates = this.data.dates;
    let dateMonth = ""
    let DateIndex = e.detail.value;
    dateMonth = dates[0][DateIndex[0]].slice(0,4) + "-" + (dates[1][DateIndex[1]].length > 2 ? dates[1][DateIndex[1]].slice(0,2) : ("0" + dates[1][DateIndex[1]].slice(0,1)));
    this.setData({
      DateIndex,
      dateMonth
    });
    this.getPlans();
  },

  /**
   * 月份/年份序号改变
   */
  columnChoose: function (e) {
    let index = e.detail.column;
    let value = e.detail.value;
    let dateMonth = "";
    let { DateIndex, dates } = this.data;
    switch (index) {
      case 0: DateIndex[0] = value; break;
      case 1: DateIndex[1] = value; break;
    }
    dateMonth = dates[0][DateIndex[0]].slice(0,4) + "-" + (dates[1][DateIndex[1]].length > 2 ? dates[1][DateIndex[1]].slice(0,2) : ("0" + dates[1][DateIndex[1]].slice(0,1)));
    this.setData({
      DateIndex,
      dateMonth
    });
    this.getPlans();
  },

  /**
 * 用户点击下一个月份
 */
  nextmonth: function () {
    let { dates, DateIndex } = this.data;
    let dateMonth = ""
    if (DateIndex[1] == 11) {
      if (DateIndex[0] != 10) {
        DateIndex[0]++;
      } else {
        DateIndex[0] = 10;
      }
      DateIndex[1] = 0;
    } else {
      DateIndex[1]++;
    }
    dateMonth = dates[0][DateIndex[0]].slice(0,4) + "-" + (dates[1][DateIndex[1]].length > 2 ? dates[1][DateIndex[1]].slice(0,2) : ("0" + dates[1][DateIndex[1]].slice(0,1)));
    this.setData({
      DateIndex,
      dateMonth
    });
    this.getPlans();
  },

  /**
 * 跳转到计划详情页
 */
  goToPlan: function (e) {
    let planId = e.currentTarget.dataset.planid;
    wx.navigateTo({
      url: `/pages/plan/planRead/planRead?planId=${planId}`
    });
  },

  goToHome: function () {
    wx.navigateTo({
      url: "/pages/home/home"
    });
  },

  addNewPlan: function () {
    wx.navigateTo({
      url: "/pages/plan/planEdit/planEdit"
    });
  }
})