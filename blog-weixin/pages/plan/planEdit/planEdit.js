// pages/plan/planEdit/planEdit.js
var app = getApp();
const baseUrl = app.baseUrl;
const { SystemInfo } = app.globalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    today: '2019-01-01',
    endDay: '2019-01-02',
    pageHeight: SystemInfo.windowHeight,
    plan: {
      planTitle: "我的计划",
      userId: "",
      content: "",
      status: 0,
      isAlert: false,
      alertTime: '2019-05-10'
    },
    editType: "增加"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let today = new Date()
    let first, end;
    first = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate() + 1)
    end = (today.getFullYear() + 1) + '-' + (today.getMonth() + 1) + '-' + (today.getDate() + 1)
    this.setData({
      'plan.userId': app.globalData.userInfo.userId,
      today: first,
      endDay: end
    });
    if(options.planId) {
      let { planId } = options;
      let _self = this;
      _self.setData({
        editType: "修改"
      });
      wx.request({
        url: baseUrl + "/plan/getPlanById",
        method: "POST",
        data: {
          planId
        },
        success: (res) => {
          if(res.data.code == 1) {
            _self.setData({
              plan: res.data.data.plan
            });
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: "none",
              duration: 2000
            })
          }
        }
      });
    }
  },
  titleChange: function (e) {
    let title = e.detail.value;
    this.setData({
      'plan.planTitle': title
    })
  },
  textChange: function (e) {
    let content = e.detail.value;
    this.setData({
      'plan.content': content
    })
  },
  editFinnish: function () {
    let _self = this;
    let editType = _self.data.editType;
    let plan = _self.data.plan;
    if(plan.content == "") {
      wx.showToast({
        title: "请输入计划内容！",
        icon: "none",
        duration: 2000
      });
    } else {
      wx.showModal({
        title: '完成',
        content: `确定${editType}计划“${plan.planTitle}”？`,
        success(res) {
          if (res.confirm) {
            wx.showLoading({ title: '请稍候...' })
            if(editType == "修改") {
              wx.request({
                url: baseUrl + "/plan/updatePlan",
                method: "POST",
                data: plan,
                success: (res) => {
                  wx.hideLoading();
                  if(res.data.code == 1) {
                    wx.showToast({
                      title: `${editType}计划成功！`,
                      icon: "none",
                      duration: 2000
                    });
                  } else {
                    wx.showToast({
                      title: `${editType}计划失败..`,
                      icon: "none",
                      duration: 2000
                    })
                  }
                }
              });
            } else {
              wx.request({
                url: baseUrl + "/plan/addPlan",
                method: "POST",
                data: plan,
                success: (res) => {
                  wx.hideLoading();
                  if(res.data.code == 1) {
                    wx.showToast({
                      title: `${editType}计划成功！`,
                      icon: "none",
                      duration: 2000
                    });
                    _self.setData({
                      plan: res.data.data.plan
                    });
                  } else {
                    wx.showToast({
                      title: `${editType}计划失败..`,
                      icon: "none",
                      duration: 2000
                    })
                  }
                }
              });
            }
          } else if (res.cancel) {
            console.log(`取消${editType}计划`);
          }
        }
      });
    }
  },
  dateChange: function (e) {
    let alertTime = e.detail.value;
    let plan = this.data.plan;
    plan.isAlert = true;
    plan.alertTime = alertTime;
    this.setData({
      plan
    });
  }
})