
const moment = require('../../utils/moment.min.js');
var feaUrl = "https://www.extrastu.xin/search/photos"
var cliendID = "17805ef4205f7051084afdf56296a3811b0d98deb7cf68688554bc54562cf222"

function fetchData(url, params, onSuccess) {
	wx.showLoading()
	wx.request({
		url: url,
		method: "POST",
		data: params,
		header: {
			"authorization": "Client-ID " + cliendID
		},
		success: onSuccess
	})
}
Page({
	data: {
		inputShowed: false,
		latests:[],
		page:1,
		inputVal:""
	},
	showInput: function () {
		this.setData({
			inputShowed: true
		});
	},
	hideInput: function () {
		this.setData({
			inputVal: "",
			inputShowed: false
		});
	},
	clearInput: function () {
		wx.vibrateShort()
		this.setData({
			inputVal: ""
		});
	},
	inputTyping: function (e) {
		wx.vibrateShort()
		let inputText = e.detail.value
		var that = this
		var params = {
			page: 1,
			per_page: 12,
			order_by: 'latest',
			query:inputText
		}
		fetchData(feaUrl, params, function (res) {
			
			console.log(res)
			let tableID = 50752
			let color = new wx.BaaS.TableObject(tableID)
			let photoArr = []
			for (let i = 0; i < res.data.results.length; i++) {
				let time = moment(res.data.results[i].created_at).fromNow()
				res.data.results[i].time = time
				let photo = {
					author: res.data.results[i].user.name,
					photos_id: res.data.results[i].id,
					color: res.data.results[i].color,
					src: res.data.results[i].urls
				}

				photoArr.push(photo)
			}
			// color.createMany(photoArr).then(res => { }, err => { })
			that.setData({
				latests: res.data.results,
				inputVal: e.detail.value
			})
			wx.hideLoading()
		})
	},
	/**
     * 页面上拉触底事件的处理函数
     */
	onReachBottom: function () {
		wx.vibrateShort()
		var that = this
		that.setData({
			page: that.data.page + 1
		})
		var params = {
			page: that.data.page,
			per_page: 12,
			order_by: 'latest',
			query: that.inputVal
		}
		fetchData(feaUrl, params, function (res) {
			for (let i = 0; i < res.data.results.length; i++) {
				let time = moment(res.data.results[i].created_at).fromNow()
				res.data.results[i].time = time
			}
			that.setData({
				latests: that.data.latests.concat(res.data.results),
			})
			wx.hideLoading()
		})
	},
	//点击预览图片
	previewImg: function (e) {
		wx.vibrateShort()
		var imgArr = []
		imgArr.push(e.currentTarget.dataset.src)
		wx.previewImage({
			current: e.currentTarget.dataset.src, //当前图片地址
			urls: imgArr, //所有要预览的图片的地址集合 数组形式
			success: function (res) { },
			fail: function (res) { },
			complete: function (res) { }
		})

	},
	/**
     * 页面相关事件处理函数--监听用户下拉动作
     */
	onPullDownRefresh: function () {
		wx.showNavigationBarLoading()
	},
});