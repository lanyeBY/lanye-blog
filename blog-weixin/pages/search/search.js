// pages/search/search.js
var app = getApp();
var baseUrl = app.baseUrl;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchValue: '',
    chooseArr: [],
    interestList: []
  },

  onLoad: function () {
    let _self = this;
    wx.request({
      url: baseUrl + "/itap/getItaps",
      method: "POST",
      success: (res) => {
        if(res.data.code == 1) {
          let itaps = res.data.data.itaps;
          itaps.forEach((item) => {
            item.isChoose = false;
          });
          _self.setData({
            interestList: itaps
          })
        } else {
          wx.showToast({
            title: "获取兴趣标签失败",
            icon: 'none',
            duration: 2000
          })
        }
      }
    });
  },

  backTap: function () {
    wx.navigateBack({ delta: 1 });
  },

  inputcancel: function () {
    this.setData({ searchValue: '' });
  },

  interestTap: function (e) {
    let index = e.currentTarget.dataset.index;
    let list = this.data.interestList;
    list[index].isChoose = !list[index].isChoose;
    this.setData({ interestList: list });
  },

  searchConfirm: function (e) {
    let search = e.detail.value;
    this.setData({ searchValue: search });
    wx.navigateTo({ url: `/pages/home/home?search=${search}` });
  },

  chooseDone: function () {
    let list = this.data.interestList;
    let num = 0,
      choose = [];
    num = list.length;
    for(let i = 0; i < num; i++){
      if(list[i].isChoose){
        choose.push(list[i].itap);
      }
    }
    wx.request({
      url: baseUrl + "/user/updateUserItap",
      method: "POST",
      data: {
        userId: app.globalData.userInfo.userId,
        interestItaps: choose
      },
      success: (res) => {
        if(res.data.code == 1) {
          console.log("用户标签更新成功");
        } else {
          console.log(res.data.msg);
        }
      }
    });
    this.setData({chooseArr: choose});
    app.globalData.userInfo.interestItaps = choose;
    wx.navigateTo({ url: `/pages/home/home?interestItaps=${this.data.chooseArr}` });
  }
})