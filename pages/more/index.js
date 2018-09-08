var app = getApp()
var feaUrl = "https://www.extrastu.xin/stats/total"
var cliendID = "17805ef4205f7051084afdf56296a3811b0d98deb7cf68688554bc54562cf222"

function fetchData(url, params, onSuccess) {
	wx.showLoading()
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
        dh: "",
        applications: "",
        developers: "",
        downloads: "",
        photos: "",
        views: "",
        likes: "",
        views_per_second: "",
        requests: "",
        user_info:{},
        is_authorized:true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
		wx.vibrateShort()
        let that = this
        let h = app.globalData.dh
        console.log(h)
        that.setData({
            dh: h + "px"
        })

        fetchData(feaUrl, "", function(res) {
            that.setData({
                applications: res.data.applications,
                developers: res.data.developers,
                downloads: res.data.downloads,
                photos: res.data.photos,
                views: res.data.views,
                likes: res.data.likes,
                views_per_second: res.data.views_per_second,
                requests: res.data.requests
            })
			wx.hideLoading()
        })

        
        wx.getStorage({
            key: 'user_info',
            success: function (res) {
                that.setData({
                    user_info: res.data
                })
            }
        })

        wx.getStorage({
            key: 'is_authorized',
            success: function (res) {
                that.setData({
                    is_authorized: res.data
                })
            }
        })
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

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    userInfoHandler(data) {
       
        let that = this
        wx.BaaS.handleUserInfo(data).then(res => {
          
            wx.setStorage({ 
                key: 'user_info',
                data: res
            })
            wx.setStorage({
                key: 'is_authorized',
                data: false
            })
            that.setData({
                avatarUrl: res.avatarUrl,
                nickName:res.nickName,
                user_info:res,
                is_authorized:false
            })
        }, res => {
            
        })
    }

})