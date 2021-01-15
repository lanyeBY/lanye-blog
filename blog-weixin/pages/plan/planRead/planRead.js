// pages/plan/planRead/planRead.js
var app = getApp();
var baseUrl = app.baseUrl;

Page({
	data: {
		plan: {}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let { planId } = options;
		this.getPlan(planId);
	},
	onPullDownRefresh() {
		this.getPlan(this.data.plan.planId);
		wx.stopPullDownRefresh();
	},
	getPlan(planId) {
		let _self = this;
		wx.request({
			url: baseUrl + "/plan/getPlanById",
            method: "POST",
			data: {
				planId
			},
			success: (res) => {
				if(res.data.code == 1) {
					_self.setData({
						plan: res.data.data.plan
					});
				} else {
					wx.showToast({
						title: res.data.msg,
						icon: "none",
						duration: 2000
					})
				}
			}
		});
	},	
	statusChange: function () {
		let _self = this;
		wx.showActionSheet({
			itemList: ["未完成", "已完成"],
			success(res) {
				wx.showLoading({ title: "请稍候..." });
				let plan = _self.data.plan;
				let status = res.tapIndex
				plan.status = status;
				wx.request({
					url: baseUrl + "/plan/updatePlan",
					method: "POST",
					data: plan,
					success: (res) => {
						wx.hideLoading();
						if(res.data.code == 1) {
							_self.setData({
								"plan.status": status
							});
						} else {
							wx.showToast({
								title: "状态更新失败..",
								icon: "none",
								duration: 2000
							})
						}
					}
				})
			},
			fail(res) {
				console.log(res.errMsg);
			}
		});
	},
	planEdit: function () {
		let planId = this.data.plan.planId;
		wx.navigateTo({
			url: `/pages/plan/planEdit/planEdit?planId=${planId}`
		});
	},
	planDelete: function () {
		let _self = this;
		wx.showModal({
			title: "提示",
			content: `确定删除计划“${_self.data.plan.planTitle}”？`,
			success(res) {
				if (res.confirm) {
					wx.showLoading({ title: "请稍候..." });
					wx.request({
						url: baseUrl + "/plan/deletePlan",
						method: "POST",
						data: {
							planId: _self.data.plan.planId
						},
						success: (res) => {
							if(res.data.code == 1) {
								wx.hideLoading();
								wx.showToast({
									title: "计划删除成功！",
									icon: "success",
									duration: 2000
								});
								wx.navigateTo({
									url: "/pages/plan/plans/plans"
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
				} else if (res.cancel) {
					console.log("取消删除计划");
				}
			}
		});
	}
})