// pages/user/setting/setting.js
var app = getApp();
var SystemInfo = app.globalData.SystemInfo;
var baseUrl = app.baseUrl;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: SystemInfo.windowHeight,
    user: {},
    isChangeName: false,
    isChangeDec: false
  },
  
  onLoad: function () {
    this.setData({
      user: app.globalData.userInfo
    });
  },

  changeNameTap: function () {
    this.setData({
      isChangeName: true
    });
  },
  changeName: function () {
    let { value } = e.detail;
    let user = this.data.user;
    user.name = value;
    this.setData({
      user,
      isChangeName: false
    });
  },

  changeDecTap: function (e) {
    this.setData({
      isChangeDec: true
    });
  },
  changeDec: function (e) {
    let { value } = e.detail;
    let user = this.data.user;
    user.motto = value;
    this.setData({
      user,
      isChangeDec: false
    });
  },
  settingConfirm: function () {
    let user = this.data.user;
    wx.request({
      url: baseUrl + "/user/updateUser",
      method: "POST",
      data: user,
      success: (res) => {
        if(res.data.code == 1) {
          wx.showToast({
            title: "修改成功",
            icon: "success",
            duration: 2000
          })
          app.globalData.userInfo = user;
          setTimeout(() => {
            wx.navigateTo({
              url: `/pages/user/user?userId=${user.userId}`
            });
          }, 2000);
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
})