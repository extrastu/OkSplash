
Page({

    /**
     * 页面的初始数据
     */
    data: {
        src: "",
        color:"",
        author:"",
        isLoading:true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this
        wx.getStorage({
            key: 'color',
            success: function (res) {
                that.setData({
                    color: res.data
                })
            }
        })
        wx.getStorage({
            key: 'author',
            success: function (res) {
                that.setData({
                    author: res.data
                })
            }
        })
        wx.getStorage({
            key: 'src',
            success: function (res) {
                that.setData({
                    src: res.data
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
    // 下载图片
    downloadThisImg:(e)=>{
     
		let that = this
        wx.vibrateShort()
        console.log(e.currentTarget.dataset.src)
        let src = e.currentTarget.dataset.src
        const downloadTask =  wx.downloadFile({
            url: src, 
            success: function (res) {
               
                if (res.statusCode === 200) {
                   
                    wx.saveImageToPhotosAlbum({
                        filePath: res.tempFilePath,
                        success(result) {
                            console.log(result)
                        }
                    })

                }
            }
        })

        downloadTask.onProgressUpdate((res) => {
            console.log('下载进度', res.progress)
            console.log('已经下载的数据长度', res.totalBytesWritten)
            console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
			
			
            if (res.progress =="100"){
                wx.hideLoading()
                wx.vibrateShort()
                wx.showToast({
                    title: '保存成功',
                    icon: 'success',
                    duration: 2000
                })
            }else{
                wx.showLoading({
                    title: '下载中'
                })
            }
        })

    },
    imgload: function (e) {
        this.setData({
            isLoading:false
        })
            
       
    }, 
    previewImg: function (e) {
		wx.vibrateShort()
        var imgArr = []
        imgArr.push(e.currentTarget.dataset.src)
        wx.previewImage({
            current: e.currentTarget.dataset.src, //当前图片地址
            urls: imgArr, //所有要预览的图片的地址集合 数组形式
            success: function (res) {},
            fail: function (res) {},
            complete: function (res) {}
        })
        
    }

})