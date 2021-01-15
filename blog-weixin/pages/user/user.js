// pages/user/user.js
var app = getApp();
var baseUrl = app.baseUrl;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    isShowNav: false,
    isLikeFriend: false,
    isOwner: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { userId } = options;
    if (userId == app.globalData.userInfo.userId) {
      this.setData({
        user: app.globalData.userInfo,
        isShowNav: true,
        isOwner: true
      });
    } else{
      this.getUserInfo(userId);
    }
  },

  onPullDownRefresh() {
    this.getUserInfo(this.data.user.userId);
    wx.stopPullDownRefresh();
  },

  getUserInfo(userId) {
    let _self = this;
    let friends = [];
    wx.request({
      url: baseUrl + "/user/getUserFriends",
      method: "POST",
      data: {
        userId: app.globalData.userInfo.userId
      },
      success: (res) => {
        if(res.data.code == 1) {
          friends = res.data.data.friends;
        } else {
          wx.showToast({
            title: "获取用户好友关系失败...",
            icon: "none",
            duration: 2000
          })
        }
      }
    });
    wx.request({
      url: baseUrl + "/user/findUser",
      method: "POST",
      data: {
        userId: userId
      },
      success: (res) => {
        if(res.data.code == 1) {
          let isFriend = false;
          friends.forEach((friend) => {
            if(friend.userId == userId) {
              isFriend = true;
            }
          });
          _self.setData({
            user: res.data.data.users[0],
            isShowNav: false,
            isOwner: false,
            isLikeFriend: isFriend
          });
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none",
            duration: 2000
          });
        }
      }
    })
},
  
  postChange: function () {
    let isShowNav = this.data.isShowNav;
    if(isShowNav) {
      wx.showActionSheet({
        itemList: ['更换背景海报'],
        success(res) {
          if(res.tapIndex == 0) {
            console.log("用户点击更新背景海报");
          }
        },
        fail(res) {
          console.log(res.errMsg)
        }
      })
    }
  },
  goBack: function () {
    wx.navigateBack({
      delta: 1
    });
  },
  goToBlog: function () {
    let id = this.data.user.userId;
    let name = this.data.user.userName;
    let isOwner = this.data.isOwner;
    wx.navigateTo({
      url: `/pages/blog/blogs?userId=${id}&userName=${name}&isOwner=${isOwner}`
    });
  },
  deleteFriend: function () {
    let id = this.data.user.userId;
    let _self = this;
		wx.showModal({
			title: "提示",
			content: `是否取消关注“${_self.data.user.userName}”？`,
			success(res) {
				if (res.confirm) {
          wx.showLoading({ title: "请稍后..." });
          wx.request({
            url: baseUrl + "/user/deleteUserFriend",
            method: "POST",
            data: {
              userId: app.globalData.userInfo.userId,
              friendId: id
            },
            success: (res) => {
              if(res.data.code == 1) {
                wx.showToast({
                  title: "取消关注成功",
                  icon: "success",
                  duration: 2000
                });
                _self.setData({
                  isLikeFriend: false
                });
              } else {
                wx.showToast({
                  title: "操作有误",
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
  },
  addFriend: function () {
    let id = this.data.user.userId;
    let _self = this;
		wx.showModal({
			title: "提示",
			content: `是否关注“${_self.data.user.userName}”？`,
			success(res) {
				if (res.confirm) {
					wx.showLoading({ title: "请稍后..." });
          wx.request({
            url: baseUrl + "/user/addUserFriend",
            method: "POST",
            data: {
              userId: app.globalData.userInfo.userId,
              friendId: id
            },
            success: (res) => {
              if(res.data.code == 1) {
                wx.showToast({
                  title: "关注成功",
                  icon: "success",
                  duration: 2000
                });
                _self.setData({
                  isLikeFriend: true
                });
              } else {
                wx.showToast({
                  title: "操作有误",
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
  },
  goToPlan: function () {
    wx.navigateTo({
      url: "/pages/plan/plans/plans"
    });
  },
  goToFriend: function () {
    wx.navigateTo({
      url: "/pages/user/friend/friend"
    });
  },
  goToCollect: function () {
    wx.navigateTo({
      url: "/pages/user/collect/collect"
    });
  },
  goToSetting: function () {
    wx.navigateTo({
      url: "/pages/user/setting/setting"
    });
  }
})