//app.js
App({
    onLaunch: function() {
        //调用API从本地缓存中获取数据
        let that = this
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
        wx.getSystemInfo({
            success: function(res) {
                that.globalData.dh = res.windowHeight
            }
        })
        wx.BaaS = requirePlugin('sdkPlugin')
        //让插件帮助完成登录、支付等功能
        wx.BaaS.wxExtend(wx.login,
            wx.getUserInfo,
            wx.requestPayment)
        wx.BaaS.init('ac4ff91280cf3fa152eb')
        wx.BaaS.login(false).then(res => {
            // 登录成功
        }, res => {
            // 登录失败
        })
        wx.getSetting({
            success(res) {
                if (!res.authSetting['scope.writePhotosAlbum']) {
                    wx.authorize({
                        scope: 'scope.writePhotosAlbum',
                        success() {
                            console.log('授权成功')
                        }
                    })
                }
            }
        })
    },
    getUserInfo: function(cb) {
        var that = this
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            //调用登录接口
            wx.login({
                success: function() {
                    wx.getUserInfo({
                        success: function(res) {
                            that.globalData.userInfo = res.userInfo
                            typeof cb == "function" && cb(that.globalData.userInfo)
                        }
                    })
                }
            })
        }
    },

    globalData: {
        userInfo: null,
        dh: ""
    }
})