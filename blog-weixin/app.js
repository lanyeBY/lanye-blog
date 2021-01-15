//app.js
App({
    onLaunch: function () {
      this.getSysInfo();
    },
    onShow: function () {
      this.ifGetUserInfo();
    },
    getSysInfo: function () {
      let that = this;
      wx.getSystemInfo({
        success: function (res){
          that.globalData.SystemInfo = res;
        },
        fail: function () {
          console.log("获取用户设备信息失败。");
        }
      });
    },
    globalData: {
      SystemInfo: Object,
      userInfo: Object,
      HasGetUserInfo: false,
    },
    ifGetUserInfo: function () {
      var value = wx.getStorageSync('HasGetUserInfo');
      var userId = wx.getStorageSync('userId');
      console.log(userId);
      let _self = this;
      if (value) {
        _self.globalData.HasGetUserInfo = value;
      }
      if (userId) {
        wx.request({
          url: _self.baseUrl + "/user/findUser",
          method: "POST",
          data: {
            userId: userId
          },
          success: (res) => {
            if(res.data.code == 1) {
              _self.globalData.userInfo = res.data.data.users[0]
            }
          }
        });
      }
    },
    baseUrl: "https://243jm03696.zicp.vip"
})