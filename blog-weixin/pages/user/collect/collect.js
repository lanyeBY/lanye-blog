// pages/user/collect/collect.js
var app = getApp();
var SystemInfo = app.globalData.SystemInfo;
var baseUrl = app.baseUrl;

Page({
  data: {
    windowHeight: SystemInfo.windowHeight,
    collectList: [],
    bgcArray: ["#008080", "#22b14c", "#ff8040", "#8080c0", "#ff8080"]
  },
  onLoad: function () {
    this.getCollects();
  },
  getCollects() {
    let _self = this;
    wx.request({
      url: baseUrl + "/user/getUserCollects",
      method: "POST",
      data: {
        userId: app.globalData.userInfo.userId
      },
      success: (res) => {
        if(res.data.code == 1) {
          let blogs = res.data.data.collects;
          blogs.forEach((blog) => {
            let content = "";
            for(let i = 0; i < blog.content.length; i++) {
              if(blog.content[i].name == 'p') {
                content = blog.content[i].children[0].text;
                break;
              }
            }
            blog.content = content;
          });
          _self.setData({
            collectList: blogs
          });
        }
      }
    });
  },
  
  goToBlog: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/blog/blogRead/blogRead?blogId=${id}`
    });
  },

  dislikeBlog: function (e) {
    let blog = e.currentTarget.dataset.blog;
    let _self = this;
		wx.showModal({
			title: "提示",
			content: `确定取消收藏 “${blog.blogTitle}” ？`,
			success(res) {
				if (res.confirm) {
					wx.showLoading({ title: "请稍后..." });
					wx.request({
            url: baseUrl + "/user/deleteUserCollect",
            method: "POST",
            data: {
              userId: app.globalData.userInfo.userId,
              blogId: blog.blogId
            },
            success: (res) => {
              if(res.data.code == 1) {
                wx.showToast({
                  title: "取消收藏成功",
                  icon: "success",
                  duration: 2000
                });
                _self.setData({
                  collectList: []
                });
                _self.getCollects();
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
  }

})