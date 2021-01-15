// pages/blog/blogRead/blogRead.js
var app = getApp();
const baseUrl = app.baseUrl;

Page({
	data: {
		blog: {},
		blogDate: {},
		blogAutor: {},
		user: {},
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let { blogId } = options;
		let _self = this;
		_self.setData({
			user: app.globalData.userInfo
		});
		wx.request({
			url: baseUrl + "/blog/getBlogById",
            method: "POST",
			data: {
				blogId: blogId
			},
			success: (res) => {
				if(res.data.code == 1) {
					let { createTime } = res.data.data.blog;
					let blogDate = {};
					blogDate.year = createTime.slice(0, 4);
					blogDate.mon = createTime.slice(5, 7);
					blogDate.day = createTime.slice(8, 10);
					blogDate.time = createTime.slice(11, 16);
					switch (blogDate.mon) {
						case '01': blogDate.mon = 'Jan'; break;
						case '02': blogDate.mon = 'Feb'; break;
						case '03': blogDate.mon = 'Mar'; break;
						case '04': blogDate.mon = 'Apr'; break;
						case '05': blogDate.mon = 'May'; break;
						case '06': blogDate.mon = 'Jun'; break;
						case '07': blogDate.mon = 'Jul'; break;
						case '08': blogDate.mon = 'Aug'; break;
						case '09': blogDate.mon = 'Sep'; break;
						case '10': blogDate.mon = 'Oct'; break;
						case '11': blogDate.mon = 'Nov'; break;
						case '12': blogDate.mon = 'Dec'; break;
					}
					_self.setData({
						blog: res.data.data.blog,
						blogAutor: res.data.data.autor,
						blogDate
					})
				} else {
					wx.showToast({
						title: "找不到博客\n可能已被删除...",
						icon: "none",
						duration: 2000
					});
					return;
				}
			}
		})
	},

	onShareAppMessage: function (res) {
		return {
			title: this.data.blog.blogTitle + " by " + this.data.blogAutor.userName,
			path: `/pages/blog/blogRead/blogRead?blogId=${this.data.blog.blogId}`
		}
	},

	goToUser: function (e) {
		let userId = e.currentTarget.dataset.id;
		wx.navigateTo({
			url: `/pages/user/user?userId=${userId}`
		});
	},
	praiseBlog: function () {
		let blogId = this.data.blog.blogId;
		let _self = this;
		wx.request({
			url: baseUrl + "/blog/updateBlog",
            method: "POST",
			data: {
				blogId: blogId,
				isLiked: true
			},
			success: (res) => {
				if(res.data.code == 1) {
					let blog = _self.data.blog;
					blog.likeNumber++;
					_self.setData({
						blog
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
	collectBlog: function () {
		let blogId = this.data.blog.blogId;
		let _self = this;
		wx.showModal({
			title: "提示",
			content: `是否收藏博客“${_self.data.blog.blogTitle}”？`,
			success(res) {
				if (res.confirm) {
					wx.showLoading({ title: "请稍后..." });
					wx.request({
						url: baseUrl + "/blog/updateBlog",
						method: "POST",
						data: {
							blogId: blogId,
							userId: app.globalData.userInfo.userId,
							isCollected: true
						},
						success: (res) => {
							wx.hideLoading();
							if(res.data.code == 1) {
								let blog = _self.data.blog;
								blog.collectNumber++;
								_self.setData({
									blog
								});
								wx.showToast({
									title: "收藏成功",
									icon: "success",
									duration: 2000
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
				} else if (res.cancel) {
					console.log("用户点击取消");
				}
			}
		});
	},
	settingBlog: function () {
		let _self = this;
		wx.showActionSheet({
			itemList: ['编辑博客', '删除博客', '修改权限'],
			success(res) {
				switch (res.tapIndex) {
					case 0: 
						wx.navigateTo({
							url: `/pages/blog/blogEdit/blogEdit?blogId=${_self.data.blog.blogId}`
						});
						break;
					case 1: wx.showModal({
						title: "提示",
						content: `确定删除博客“${_self.data.blog.blogTitle}”？`,
						success(res) {
							if (res.confirm) {
								wx.showLoading({ title: "请稍后..." });
								wx.request({
									url: baseUrl + "/blog/deleteBlog",
									method: "POST",
									data: {
										blogId: _self.data.blog.blogId
									},
									success: (res) => {
										if(res.data.code == 1) {
											wx.showToast({
												title: "删除成功",
												icon: "success",
												duration: 2000
											});
											let { userId, userName } = app.globalData.userInfo;
											wx.navigateTo({
												url: `/pages/blog/blogs?userId=${userId}&userName=${userName}&isOwner=true`
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
							} else if (res.cancel) {
								console.log("用户点击取消");
							}
						}
					});
						break;
					case 2: 
					wx.showActionSheet({
						itemList: ['设为私密', '设为公开'],
						success(res) {
							let blog = _self.data.blog;
							blog.permission = res.tapIndex;
							wx.request({
								url: baseUrl + "/blog/updateBlog",
								method: "POST",
								data: blog,
								success: (res) => {
									if(res.data.code == 1) {
										let title = "";
										_self.setData({
											blog
										});
										switch(blog.permission) {
											case 0: title = "已设为私密"; break;
											case 1: title = "已设为公开"; break;
										}
										wx.showToast({
											title: title,
											icon: "success",
											duration: 2000
										});
									} else {
										wx.showToast({
											title: "系统出了点问题...",
											icon: "none",
											duration: 2000
										});
									}
								}
							})
						},
						fail(res) {
							console.log(res.errMsg)
						}
					})
				}
			},
			fail(res) {
				console.log(res.errMsg)
			}
		})
	}
})