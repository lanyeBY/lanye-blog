// components/modulePage/pageHeader/pageHeader.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    headerArr: ['first.jpg', 'second.jpg', 'third.jpg', 'fourth.jpg'],
    headerBgi: String
  },

  attached: function (){
    let headerarr = this.data.headerArr;
    let headerbgi = this.data.headerBgi;
    let bgiIndex = Math.round(Math.random()*3);
    headerbgi = "/images/headImage/" + headerarr[bgiIndex];
    this.setData({ headerBgi: headerbgi });
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goBack: function () {
      wx.navigateBack({
        delta: 1
      });
    }
  }
})
