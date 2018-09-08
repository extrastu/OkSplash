const moment = require('../../utils/moment.min.js');
let feaUrl = "https://www.extrastu.xin/collections/curated"
let cliendID = "17805ef4205f7051084afdf56296a3811b0d98deb7cf68688554bc54562cf222"

function fetchData(url, params, onSuccess) {
	wx.showLoading({ title: '加载中' })
    wx.request({
        url: url,
        data: params,
		method: "POST",
        header: {
            "authorization": "Client-ID " + cliendID
        },
        success: onSuccess
    })
}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        grids: [0, 1, 2, 3, 4, 5, 6, 7, 8],
		latests:[],
		page: 1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
		wx.vibrateShort()
		wx.showLoading()
        this.loadFeaList()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
		wx.vibrateShort()
		var that = this
		that.setData({
			page:  1,
			latests:[]
		})
		var params = {
			page: this.data.page,
			per_page: 12,
			order_by: 'latest'
		}
		fetchData(feaUrl, params, function (res) {
			for (let i = 0; i < res.data.length; i++) {
				let time = moment(res.data[i].created_at).fromNow()
				res.data[i].time = time
			}
			that.setData({
				latests: that.data.latests.concat(res.data),
			})
			wx.stopPullDownRefresh()
		})
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
		wx.vibrateShort()
		wx.showLoading()
		var that = this
		that.setData({
			page: that.data.page + 1
		})
		var params = {
			page: this.data.page,
			per_page: 12,
			order_by: 'latest'
		}
		fetchData(feaUrl, params, function (res) {
			for (let i = 0; i < res.data.length; i++) {
				let time = moment(res.data[i].created_at).fromNow()
				res.data[i].time = time
			}
			that.setData({
				latests: that.data.latests.concat(res.data),
			})
			wx.hideLoading()
		})
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    //   进入搜索页面
    intoSearchView: () => {
		wx.navigateTo({
			url: '../search/index'
		})
    },
    //加载数据
    loadFeaList: function() {
        var that = this
        var params = {
            page: 1,
            per_page: 12,
            order_by: 'latest'
        }
        fetchData(feaUrl, params, function(res) {
            console.log(res)
            for (let i = 0; i < res.data.length; i++) {
            	let time = moment(res.data[i].created_at).fromNow()
            	res.data[i].time = time
            }
            that.setData({
            	latests: res.data,
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

	}
})