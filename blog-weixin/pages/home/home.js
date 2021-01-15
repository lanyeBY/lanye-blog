// pages/home/home.js
var app = getApp();
var SystemInfo = app.globalData.SystemInfo;
var baseUrl = app.baseUrl;

Page({
  data: {
    HasGetUserInfo: false,
    navIndex: 0,
    isShowSearch: false,
    isLoad: false,
    user: {},
    blogList: [],
    windowHeight: SystemInfo.windowHeight,
    isShowTOP: false,
    isShowSon: false,
    funnyOptions: {}
  },

  onLoad: function (options) {
    this.setData({
      HasGetUserInfo: app.globalData.HasGetUserInfo,
      user: app.globalData.userInfo,
    });
    if(this.data.HasGetUserInfo) {
      if(options.search || options.interestItaps) {
        this.getFunnyBlogs(options);
        this.setData({
          funnyOptions: options,
          navIndex: 1,
          isShowSearch: true
        });
      } else {
        this.setData({
          navIndex: 0,
          isShowSearch: false
        });
        this.getFriendBlogs();
      }
    }
  },

  onPullDownRefresh() {
    if(this.data.isShowSearch) {
      this.getFunnyBlogs(this.data.funnyOptions);
    } else {
      this.getFriendBlogs();
    }
    wx.stopPullDownRefresh();
  },

  getUserInfo: function (e) {
    if(e.detail.userInfo) {
      var user = {};
      let _self = this;
      user.userName = e.detail.userInfo.nickName;
      user.headImg = e.detail.userInfo.avatarUrl;
      wx.showLoading({ title: "登录中..." });
      wx.login({
        success(res) {
          if (res.code) {
            wx.request({
              method: "POST",
              url: baseUrl + '/login',
              data: {
                code: res.code
              },
              success: (res) => {
                user.userId = res.data.data.userId;
                wx.request({
                  method: "POST",
                  url: baseUrl + "/user/addUser",
                  data: user,
                  success: (getUserRes) => {
                    wx.hideLoading();
                    if(getUserRes.data.code != 0) {
                      _self.setData({
                        HasGetUserInfo: true,
                        user: getUserRes.data.data.user
                      });
                      wx.setStorageSync('HasGetUserInfo', true);
                      wx.setStorageSync('userId', getUserRes.data.data.user.userId);
                      app.globalData.HasGetUserInfo = true;
                      app.globalData.userInfo = getUserRes.data.data.user;
                      wx.showToast({
                        title: '登陆成功',
                        icon: 'success',
                        duration: 2000
                      });
                      _self.getFriendBlogs();
                    } else {
                      wx.showToast({
                        title: '获取用户信息失败',
                        icon: 'none',
                        duration: 2000
                      })
                    }
                  }
                });
              }
            });
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      });
    }
  },

  getFriendBlogs: function () {
    let _self = this;
    this.setData({
      isLoad: true
    })
    wx.request({
      url: baseUrl + "/blog/getBlogsByFriend",
      method: "POST",
      data: {
        userId: _self.data.user.userId
      },
      success: (res) => {
        if(res.data.code == 1) {
          let blogs = res.data.data.blogs;
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
            blogList: blogs,
            isLoad: false
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    });
  },

  getFunnyBlogs: function (option = {}) {
    let _self = this;
    if(option.search || option.interestItaps) {
      var search = {};
      search = option;
    } else if(_self.data.user.interestItaps.length > 0) {
      var search = {};
      search.interestItaps = _self.data.user.interestItaps.toString();
    } else {
      var search = "";
    }
    this.setData({
      isLoad: true
    })
    wx.request({
      url: baseUrl + "/blog/searchBlog",
      method: "POST",
      data: search,
      success: (res) => {
        if(res.data.code == 1) {
          let blogs = res.data.data.blogs;
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
            blogList: blogs,
            isLoad: false
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    });
  },

  /**
   * 用户滚动页面
   */
  onPageScroll: function (options) {
    let { scrollTop } = options;
    let { windowHeight, isShowTop, isShowSon } = this.data;
    if (scrollTop >= windowHeight) {
      isShowTop = true;
    } else {
      isShowTop = false;
    }
    if(isShowSon) {
      this.setData({ isShowSon: false });
    }
    this.setData({
      isShowTOP: isShowTop
    });
  },

  /**
   * 用户点击个人头像
   */
  userTap: function () {
    let that = this;
    wx.navigateTo({ url: `/pages/user/user?userId=${that.data.user.userId}` });
  },

  /**
   * 用户点击顶部导航项
   */
  navTap: function (e) {
    let { index = 0 } = e.currentTarget.dataset;
    let showSearch = false;
    if(index == 0) {
      showSearch = false;
      this.getFriendBlogs();
    } else {
      showSearch = true;
      this.getFunnyBlogs();
    }
    this.setData({
      navIndex: index,
      isShowSearch: showSearch
    });
  },

  totoptap: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 600
    })
  },
  searchtap: function () {
    wx.navigateTo({ url: "../search/search" });
  },
  addTap: function () {
    let isShowSon = this.data.isShowSon;
    this.setData({ isShowSon: !isShowSon });
  },
  addblogTap: function () {
    wx.navigateTo({ url: "../blog/blogEdit/blogEdit" });
  },
  addplanTap: function () {
    wx.navigateTo({ url: "../plan/planEdit/planEdit" });
  },
  blogTap: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `../blog/blogRead/blogRead?blogId=${id}`
    });
  },
  autorTap: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "../user/user?userId=" + id
    });
  }
})