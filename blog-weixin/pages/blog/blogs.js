// pages/blog/blogs.js
var app = getApp();
const baseUrl = app.baseUrl;
Page({
	data: {
		user: {},
		isOwner: true,
		blogList: [],
		today:{}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let thisDay = new Date();
		let today = {},
			user = {},
			isOwner = true;
		today.day = thisDay.getDate() < 10 ? '0' + thisDay.getDate() : thisDay.getDate();
		today.month = thisDay.getMonth() + 1;
		switch(today.month) {
			case 1: today.month = "一月";break;
			case 2: today.month = "二月";break;
			case 3: today.month = "三月";break;
			case 4: today.month = "四月";break;
			case 5: today.month = "五月";break;
			case 6: today.month = "六月";break;
			case 7: today.month = "七月";break;
			case 8: today.month = "八月";break;
			case 9: today.month = "九月";break;
			case 10: today.month = "十月";break;
			case 11: today.month = "十一月";break;
			case 12: today.month = "十二月";break;
		}
		if (options.isOwner == "true") {
			user = app.globalData.userInfo;
			isOwner = true;
		} else {
			user.userId = options.userId;
			user.userName = options.userName;
			isOwner = false;
		}
		this.setData({
			today,
			user,
			isOwner
		});
		this.getBlogs();
	},

	onPullDownRefresh() {
		this.getBlogs();
		wx.stopPullDownRefresh();
	},
	
	getBlogs: function () {
		let { user, isOwner } = this.data;
		let _self = this;
		wx.request({
			url: baseUrl + "/blog/getBlogs",
			method: "POST",
			data: {
				userId: user.userId,
				isOwner: isOwner
			},
			success: (res) => {
				if(res.data.code == 1) {
					let blogList = res.data.data.blogs;
					if(blogList.length != 0) {
						blogList.forEach((blog) => {
							let createTime = blog.createTime;
							let date = {},
								content = "";
							date.day = createTime.slice(8, 10);
							date.month = createTime.slice(5, 7);
							switch(date.month) {
								case "01": date.month = "一月";break;
								case "02": date.month = "二月";break;
								case "03": date.month = "三月";break;
								case "04": date.month = "四月";break;
								case "05": date.month = "五月";break;
								case "06": date.month = "六月";break;
								case "07": date.month = "七月";break;
								case "08": date.month = "八月";break;
								case "09": date.month = "九月";break;
								case "10": date.month = "十月";break;
								case "11": date.month = "十一月";break;
								case "12": date.month = "十二月";break;
							};
							blog.date = date;
							blog.time = createTime.slice(11, 16);
							for(let i = 0; i < blog.content.length; i++) {
								if(blog.content[i].name == 'p') {
									content = blog.content[i].children[0].text;
									break;
								}
							}
							blog.content = content;
						});
					}
					_self.setData({
						blogList
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

	addNewBlog: function () {
		wx.navigateTo({
			url: "/pages/blog/blogEdit/blogEdit"
		});
	},
	goToBlog: function (e) {
		let id = e.currentTarget.dataset.id;
		wx.navigateTo({
			url: `/pages/blog/blogRead/blogRead?blogId=${id}`
		});
	}
})