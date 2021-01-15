// pages/user/friend/friend.js
var app = getApp();
var User = app.globalData.userInfo;
var baseUrl = app.baseUrl;

Page({
  data: {
    friendList: []
  },

  onLoad: function () {
    this.getFriends();
  },

  getFriends() {
    let _self = this;
    wx.request({
      url: baseUrl + "/user/getUserFriends",
      method: "POST",
      data: {
        userId: app.globalData.userInfo.userId
      },
      success: (res) => {
        if(res.data.code == 1) {
          _self.setData({
            friendList: res.data.data.friends
          });
        }
      }
    });
  },

  goToFriend: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `../user?userId=${id}`
    });
  },

  dislikeFriend: function (e) {
    let friend = e.currentTarget.dataset.friend;
    let _self = this;
		wx.showModal({
			title: "提示",
			content: `确定取消关注 “${friend.userName}” ？`,
			success(res) {
				if (res.confirm) {
					wx.showLoading({ title: "请稍后..." });
					wx.request({
            url: baseUrl + "/user/deleteUserFriend",
            method: "POST",
            data: {
              userId: app.globalData.userInfo.userId,
              friendId: friend.userId
            },
            success: (res) => {
              if(res.data.code == 1) {
                wx.showToast({
                  title: "取消关注成功",
                  icon: "success",
                  duration: 2000
                });
                _self.getFriends();
              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: "none",
                  duration: 2000
                });
              }
            }
          })
				} else if (res.cancel) {
					console.log("用户点击取消");
				}
			}
		});
  }
})