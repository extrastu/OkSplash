
var feaUrl = "https://www.extrastu.xin/photos/random"
var cliendID = "17805ef4205f7051084afdf56296a3811b0d98deb7cf68688554bc54562cf222"
let randomTableID = 51052
let randomTable = new wx.BaaS.TableObject(randomTableID)
function fetchData(url, params, onSuccess) {
	wx.vibrateShort()
	wx.showLoading({ title: '加载中'})
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

	/**
	 * 页面的初始数据
	 */
	data: {
		colorArray: [],
		previousMargin: 0,
		nextMargin: 0,
		randomSrc:""
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let that = this;
		wx.vibrateShort()
		wx.getStorage({
			key: 'colorArr',
			success: function (res) {
				that.setData({
					colorArray: res.data
				})

			},
		})

		fetchData(feaUrl,"", (res) => {
			that.setData({
				randomSrc: res.data.urls.regular
			})
			wx.hideLoading()
			let records ={
				author: res.data.user,
				src:res.data.urls,
				color:res.data.color,
				photo_id:res.data.id
			}
			console.log(records)
			let randomProduct = new wx.BaaS.TableObject(randomTableID)
			let product = randomProduct.create()

			product.set('author', res.data.user)
			product.set('src', res.data.urls)
			product.set('color', res.data.color)
			product.set('photo_id', res.data.id)

			product.save().then(res => { }, err => { })
			// product.set(records).save().then(res => {
			// 	// success
			// }, err => {
			// 	// err
			// })
			// randomTable.createMany(records).then(res => { }, err => { })
		})
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

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
	//点击颜色item进入相应的view
	enterThisType:(e)=>{
		console.log(e)
	}
})