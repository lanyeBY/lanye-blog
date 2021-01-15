// pages/blog/blogEdit/blogEdit.js
var app = getApp();
const { SystemInfo } = app.globalData;
const baseUrl = app.baseUrl;

Page({
	data: {
		pageHeight: SystemInfo.windowHeight,
		newBlog: {
			blogTitle: '',
			postImg: '',
			status: 1,
			content: [{
				name: 'p',
				attrs: {
					class: 'content_input',
					style: 'text-align: left; text-decoration: none; font-size: 16px; text-index: 0; font-weight: normal; font-style: normal; color: black; margin-bottom: 10px;'
				},
				children: [{
					type: 'text',
					text: ''
				}]
			}]
		},
		editType: "增加",
		nodeIndex: 0,
		textBufferPool: [],
		isBlogSetting: false,
		isTextSetting: false,
		textAlign: 2,
		textDecoration: 2,
		textStyle: 3,
		isFondBlod: false,
		isFondItalic: false,
		fontSizeIndex: 3,
		fontSize: [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
		fontColorIndex: 0,
		fontColor: ['black', 'gray', 'white', 'red', 'pink', 'blue', 'skyblue', 'lightblue', 'green', 'lightgreen'],
		itaps: [],
		itapIndex: 0,
		txtHeight: [],
		isInput: [],
		txtLine: [1]
	},

	onLoad: function (options) {
		let _self = this;
		if(options.blogId) {
			let { blogId } = options;
			wx.request({
				url: baseUrl + "/blog/getBlogById",
				method: "POST",
				data: {
					blogId: blogId,
					userId: app.globalData.userInfo.userId
				},
				success: (res) => {
					if(res.data.code == 1) {
						_self.setData({
							newBlog: res.data.data.blog,
							editType: "更新"
						});
						let textBufferPool = this.data.textBufferPool;
						let newBlog = this.data.newBlog;
						newBlog.content.forEach((node, index) => {
							if (node.name == 'p') {
								textBufferPool[index] = node.children[0].text;
							}
						})
						this.setData({
							textBufferPool
						})
					} else {
						wx.showToast({
							title: res.data.msg,
							icon: "none",
							duration: 2000
						});
						wx.navigateBack({
							delta: 1
						});
					}
				}
			});
		}
		wx.request({
			url: baseUrl + "/itap/getItaps",
			method: "POST",
			success: (res) => {
				if(res.data.code == 1) {
					let itapIndex = 0;
					let itaps = res.data.data.itaps.map((item) => {
						return item.itap;
					});
					itaps.unshift("无");
					itaps.forEach((item, index) => {
						if(item == _self.data.newBlog.itap) {
							itapIndex = index;
						}
					})
					_self.setData({
						itaps,
						itapIndex
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

	titleChange: function (e) {
		let { value } = e.detail;
		let newBlog = this.data.newBlog;
		newBlog.blogTitle = value;
		this.setData({
			newBlog
		});
	},
	// 文本输入
	startTextareaInput: function (e) {
		let isInput = this.data.isInput;
		let index = e.currentTarget.dataset.index;
		isInput[index] = true;
		this.setData({
			nodeIndex: index,
			isBlogSetting: false,
			isTextSetting: false,
			isInput
		})
	},
	endTextareaInput: function (e) {
		let isInput = this.data.isInput;
		const index = e.currentTarget.dataset.index;
		let textBufferPool = this.data.textBufferPool;
		isInput[index] = false;
		textBufferPool[index] = e.detail.value;
		this.writeTextToNode();
		this.setData({
			textBufferPool,
			nodeIndex: index,
			isInput
		})
	},
	lineChange: function(e) {
		let { txtHeight, txtLine, nodeIndex, fontSize, fontSizeIndex } = this.data;
		txtLine[nodeIndex] = e.detail.lineCount;
		txtHeight[nodeIndex] = txtLine[nodeIndex] * fontSize[fontSizeIndex] * 1.5;
		this.setData({
			txtHeight,
			txtLine
		});
	},
	writeTextToNode: function () {
		const textBufferPool = this.data.textBufferPool;
		const newBlog = this.data.newBlog;
		newBlog.content.forEach((node, index) => {
			if (node.name == 'p') {
				node.children[0].text = textBufferPool[index];
			}
		})
		this.setData({
			newBlog
		})
	},

	blogDone: function () {
		let { newBlog, editType } = this.data;
		if (newBlog.blogTitle == '') {
			wx.showToast({
				title: '博客标题不能为空噢~',
				icon: 'none',
				duration: 2000
			});
		} else if (newBlog.content.length == 1 && newBlog.content[0].name != 'img' && newBlog.content[0].children[0].text == '') {
			wx.showToast({
				title: '博客内容不能为空噢~',
				icon: 'none',
				duration: 2000
			});
		} else {
			this.setData({
				isBlogSetting: false,
				isTextSetting: false
			});
			wx.showLoading({title: "请稍候..."});
			if(editType == "更新") {
				wx.request({
					url: baseUrl + "/blog/updateBlog",
					method: "POST",
					data: newBlog,
					success: (res) => {
						wx.hideLoading();
						if(res.data.code == 1) {
							wx.showModal({
								title: '提示',
								content: "已保存\n是否进入阅读页?",
								success(res) {
									if (res.confirm) {
										wx.navigateTo({
											url: `/pages/blog/blogRead/blogRead?blogId=${newBlog.blogId}`
										});
									} else if (res.cancel) {
										console.log('用户点击取消')
									}
								}
							})
						} else {
							wx.showToast({
								title: res.data.msg,
								icon: 'none',
								duration: 2000
							});
						}
					}
				});
			} else {
				newBlog.userId = app.globalData.userInfo.userId;
				newBlog.userName = app.globalData.userInfo.userName;
				newBlog.headImg = app.globalData.userInfo.headImg;
				newBlog.permission = newBlog.permission ? newBlog.permission : 1;
				wx.request({
					url: baseUrl + "/blog/addBlog",
					method: "POST",
					data: newBlog,
					success: (res) => {
						if(res.data.code == 1) {
							wx.hideLoading();
							wx.showModal({
								title: '提示',
								content: "添加成功\n是否进入阅读页?",
								success(subRes) {
									if (subRes.confirm) {
										wx.navigateTo({
											url: `/pages/blog/blogRead/blogRead?blogId=${res.data.data.result.blogId}`
										});
									} else if (subRes.cancel) {
										console.log('用户点击取消')
									}
								}
							});
						} else {
							wx.showToast({
								title: res.data.msg,
								icon: 'none',
								duration: 2000
							});
						}
					}
				});
			}
		}
	},

	blogSetting: function () {
		if (!this.data.isBlogSetting) {
			this.setData({
				isBlogSetting: true,
				isTextSetting: false
			});
		} else {
			this.setData({
				isBlogSetting: false,
				isTextSetting: false
			});
		}
	},

	addImageOrText: function () {
		let _self = this;
		_self.setData({
			isBlogSetting: false,
			isTextSetting: false
		});
		wx.showActionSheet({
			itemList: ['添加新段落', '插入一张图片'],
			success(res) {
				switch(res.tapIndex) {
					case 0: _self.addText();break;
					case 1: _self.addImage();break;
				}
			},
			fail(res) {
				console.log(res.errMsg)
			}
		});
	},
	addText: function () {
		let index = this.data.nodeIndex;
		this.writeTextToNode();
		index++;
		//文本节点初始化
		const node = {
			name: 'p',
			attrs: {
				class: 'content_input',
				style: 'text-align: left; text-decoration: none; font-size: 16px; text-index: 0; font-weight: normal; font-style: normal; color: black; margin-bottom: 10px;'
			},
			children: [{
				type: 'text',
				text: ''
			}]
		}
		const newBlog = this.data.newBlog;
		const textBufferPool = this.data.textBufferPool;
		newBlog.content.splice(index + 1, 0, node);
		textBufferPool.splice(index + 1, 0, '');
		this.setData({
			newBlog,
			textBufferPool,
			nodeIndex: index
		})
	},

	addImage: function () {
		let that = this;
		let index = that.data.nodeIndex;
		wx.chooseImage({
			count: 1,
			sizeType: ['original', 'compressed'],
			sourceType: ['album'],
			success(res) {
				const tempFilePath = res.tempFilePaths[0];
				const node = {
					name: 'img',
					attrs: {
						style: "width: 100%;margin: 13px 0;",
						src: tempFilePath
					},
				}
				let newBlog = that.data.newBlog;
				let textBufferPool = that.data.textBufferPool;
				if (newBlog.content[index].name == 'p' && newBlog.content[index].children[0].text == '') {
					newBlog.content.splice(index, 1, node);
					textBufferPool.splice(index, 1, tempFilePath);
				} else {
					newBlog.content.splice(index + 1, 1, node);
					textBufferPool.splice(index + 1, 1, tempFilePath);
				}
				that.setData({
					newBlog,
					textBufferPool,
					nodeIndex: index
				})
				that.addText();
			}
		})
	},
	deleteImage: function (e) {
		let that = this;
		wx.showActionSheet({
			itemList: ['删除这张图片'],
			success(res) {
				if(res.tapIndex == 0) {
					that.writeTextToNode();
					const index = e.currentTarget.dataset.index;
					let newBlog = that.data.newBlog;
					let textBufferPool = that.data.textBufferPool;
					if (newBlog.content[index - 1].name == 'p') {
						newBlog.content.splice(index, 2);
						textBufferPool.splice(index, 2);
					} else {
						newBlog.content.splice(index, 1);
						textBufferPool.splice(index, 1);
					}
					that.setData({
						newBlog,
						textBufferPool,
					})
				}
			},
			fail(res) {
				console.log(res.errMsg)
			}
		});
	},

	textSetting: function () {
		if (!this.data.isTextSetting) {
			this.setData({
				isBlogSetting: false,
				isTextSetting: true
			});
		} else {
			this.setData({
				isBlogSetting: false,
				isTextSetting: false
			});
		}
	},
	addPost: function () {
		let that = this;
		wx.showModal({
			title: '提示',
			content: "从相册中选择一张图片作为海报?",
			success(res) {
				if (res.confirm) {
					wx.chooseImage({
						count: 1,
						sizeType: ['original', 'compressed'],
						sourceType: ['album'],
						success(res) {
							const tempFilePath = res.tempFilePaths[0];
							let newBlog = that.data.newBlog;
							newBlog.blogPostImg = tempFilePath;
							that.setData({
								newBlog
							})
						}
					})
				} else if (res.cancel) {
					console.log('用户点击取消')
				}
			}
		})
	},
	settingPermission: function () {
		let _self = this;
		wx.showActionSheet({
			itemList: ['设为私密', '设为公开'],
			success(res) {
				let blog = _self.data.newBlog;
				blog.permission = res.tapIndex;
				blog.userId = app.globalData.userInfo.userId;
				wx.request({
					url: baseUrl + "/blog/updateBlog",
					method: "POST",
					data: blog,
					success: (res) => {
						if(res.data.code == 1) {
							let title = "";
							_self.setData({
								newBlog: res.data.data.blog
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
				});
			},
			fail(res) {
				console.log(res.errMsg)
			}
		});
	},
	settingItap: function (e) {
		let _self = this;
		let { newBlog, itaps } = _self.data;
		newBlog.itap = itaps[e.detail.value];
		newBlog.userId = app.globalData.userInfo.userId;
		wx.request({
			url: baseUrl + "/blog/updateBlog",
			method: "POST",
			data: newBlog,
			success: (res) => {
				if(res.data.code == 1) {
					_self.setData({
						newBlog: res.data.data.blog,
						itapIndex: e.detail.value
					});
				} else {
					wx.showToast({
						title: "标签设置失败..",
						icon: "none",
						duration: 2000
					});
				}
			}
		});
	},
	textAlignChange: function (e) {
		let textalign = e.currentTarget.dataset.textalign;
		let newBlog = this.data.newBlog;
		let index = this.data.nodeIndex;
		let style = newBlog.content[index].attrs.style.split(";");
		switch (textalign) {
			case '0': style[0] = 'text-align: center'; break;
			case '1': style[0] = 'text-align: justify'; break;
			case '2': style[0] = 'text-align: left'; break;
			case '3': style[0] = 'text-align: right'; break;
		}
		style = style.join(";");
		newBlog.content[index].attrs.style = style;
		this.setData({
			textAlign: textalign,
			newBlog
		});
	},
	textDecorationChange: function (e) {
		let textdecoration = e.currentTarget.dataset.textdecoration;
		let newBlog = this.data.newBlog;
		let index = this.data.nodeIndex;
		let style = newBlog.content[index].attrs.style.split(";");
		switch (textdecoration) {
			case '0': style[1] = 'text-decoration: line-through'; break;
			case '1': style[1] = 'text-decoration: underline'; break;
			case '2': style[1] = 'text-decoration: none'; break;
		}
		style = style.join(";");
		newBlog.content[index].attrs.style = style;
		this.setData({
			textDecoration: textdecoration,
			newBlog
		});
	},
	textStyleChange: function (e) {
		let textstyle = e.currentTarget.dataset.textstyle;
		let newBlog = this.data.newBlog;
		let index = this.data.nodeIndex;
		let style = newBlog.content[index].attrs.style.split(";");
		switch (textstyle) {
			case '0':
				if (newBlog.content[index].children[0].text.length > 8) break;
				else {
					style[2] = 'font-size: 2.1em'; break;
				}
			case '1':
				if (newBlog.content[index].children[0].text.length > 12) break;
				else {
					style[2] = 'font-size: 1.5em'; break;
				}
			case '2': style[3] = 'text-indent: 2em'; break;
			case '3': style[2] = 'font-size: 16px'; style[3] = 'text-index: 0'; break;
		}
		style = style.join(";");
		newBlog.content[index].attrs.style = style;
		this.setData({
			textStyle: textstyle,
			newBlog
		});
	},
	fontBlodChange: function () {
		let isFondBlod = this.data.isFondBlod;
		let newBlog = this.data.newBlog;
		let index = this.data.nodeIndex;
		let style = newBlog.content[index].attrs.style.split(";");
		if (!isFondBlod) {
			style[4] = 'font-weight: bold';
		} else {
			style[4] = 'font-weight: normal';
		}
		style = style.join(";");
		newBlog.content[index].attrs.style = style;
		this.setData({
			isFondBlod: !isFondBlod,
			newBlog
		});
	},
	fontItalicChange: function () {
		let isFondItalic = this.data.isFondItalic;
		let newBlog = this.data.newBlog;
		let index = this.data.nodeIndex;
		let style = newBlog.content[index].attrs.style.split(";");
		if (!isFondItalic) {
			style[5] = 'font-style: italic';
		} else {
			style[5] = 'font-style: normal';
		}
		style = style.join(";");
		newBlog.content[index].attrs.style = style;
		this.setData({
			isFondItalic: !isFondItalic,
			newBlog
		});
	},
	fontSizeChange: function (e) {
		let { value } = e.detail;
		let { fontSize, newBlog, nodeIndex, txtHeight, txtLine } = this.data;
		let style = newBlog.content[nodeIndex].attrs.style.split(";");
		style[2] = 'font-size: ' + fontSize[value]  + 'px';
		style = style.join(";");
		newBlog.content[nodeIndex].attrs.style = style;
		txtHeight[nodeIndex] = txtLine[nodeIndex] * fontSize[value] * 1.5;
		this.setData({
			fontSizeIndex: value,
			newBlog,
			txtHeight
		});
	},
	fontColorChange: function (e) {
		let { value } = e.detail;
		let fontColor = this.data.fontColor;
		let newBlog = this.data.newBlog;
		let index = this.data.nodeIndex;
		let style = newBlog.content[index].attrs.style.split(";");
		style[6] = 'color: ' + fontColor[value];
		style = style.join(";");
		newBlog.content[index].attrs.style = style;
		this.setData({
			fontColorIndex: value,
			newBlog
		});
	}
})