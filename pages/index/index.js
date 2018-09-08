
const moment = require('../../utils/moment.min.js');
var feaUrl = "https://www.extrastu.xin/photos"
var cliendID = "17805ef4205f7051084afdf56296a3811b0d98deb7cf68688554bc54562cf222"

function fetchData(url, params, onSuccess) {
	wx.vibrateShort()
    wx.request({
        url: url,
		method:"POST",
        data: params,
        header: {
            "authorization": "Client-ID " + cliendID
        },
        success: onSuccess
    })
}

var app = getApp()
var colorArr= []
var colorList=[]
var isReq = false
Page({
    data: {
        latests: [],
        modalHidden: true,
        user: {},
        FeaActived: false,
        page: 1,
        height: "",
		
    },
    modalTap: function(e) {
        var index = e.target.dataset.item
        this.setData({
            user: this.data.latests[parseInt(index)].user,
            modalHidden: false
        })
    },
  
    loadFeaList: function() {
        var that = this
        var params = {
            page: 1,
            per_page: 12,
            order_by: 'latest'
        }
        fetchData(feaUrl, params, function(res) {
			let color = new wx.BaaS.TableObject(50752)
			
            for(let i=0;i<res.data.length;i++){
				let query = new wx.BaaS.Query()
                let time = moment(res.data[i].created_at).fromNow()
                res.data[i].time = time
				query.compare('photo_id', '=', res.data[i].id)
				color.setQuery(query).find().then(ress => {
					// success
					if (ress.data.meta.total_count==0){
						let photo = {
							author: res.data[i].user,
							photo_id: res.data[i].id,
							color: res.data[i].color,
							src: res.data[i].urls
						}
						colorArr.push(photo)
						colorList.push(res.data[i].color)
						isReq = true
						// console.log(colorArr)
					}else{
						isReq = false
						console.info("已存在不添加")
					}
				}, err => {
					// err
				})
            }
			
		
			setTimeout(()=>{
				if (isReq) {
					console.log(colorArr + "-----------")
					console.log(colorList+'==============')
					wx.setStorage({ //colorArr
						key: 'colorArr',
						data: colorList
					})
					color.createMany(colorArr).then(res => { }, err => { })
					isReq =false
				}
			},100)
            that.setData({
                latests: res.data,
                FeaActived: true,
                NewActived: false
            })
        })
    },
    loadMore: function(e) {
        wx.vibrateShort()
        var that = this
        that.setData({
            page: that.data.page + 1
        })
        var params = {
            page: this.data.page,
            per_page: 12,
            order_by: 'latest'
        }

        if (that.data.FeaActived) {
            var url = feaUrl
        } else {
            var url = newUrl
        }
        fetchData(url, params, function(res) {
			let colorList=[]
            // for (let i = 0; i < res.data.length; i++) {
            //     let time = moment(res.data[i].created_at).fromNow()
            //     res.data[i].time = time
			// 	let photo = {
			// 		author: res.data[i].user.name,
			// 		photo_id: res.data[i].id,
			// 		color: res.data[i].color,
			// 		src: res.data[i].urls
			// 	}
			// 	colorList.push(photo)
            // }
			
			// wx.setStorage({ //colorArr
			// 	key: 'colorArr',
			// 	data: colorList,
			// })
			let color = new wx.BaaS.TableObject(50752)
			//去重
			for (let i = 0; i < res.data.length; i++) {
				let query = new wx.BaaS.Query()
				let time = moment(res.data[i].created_at).fromNow()
				res.data[i].time = time
				query.compare('photo_id', '=', res.data[i].id)
				color.setQuery(query).find().then(ress => {
					// success
					if (ress.data.meta.total_count == 0) {
						let photo = {
							author: res.data[i].user,
							photo_id: res.data[i].id,
							color: res.data[i].color,
							src: res.data[i].urls
						}
						colorArr.push(photo)
						isReq = true
						// console.log(colorArr)
					} else {
						isReq = false
						console.info("已存在不添加")
					}
				}, err => {
					// err
				})
			}
			//避免异步data=[]
			setTimeout(() => {
				if (isReq) {
					console.log(colorArr + "-----------")
					wx.setStorage({ //colorArr
						key: 'colorArr',
						data: colorArr
					})
					color.createMany(colorArr).then(res => { }, err => { })
					isReq = false
				}
			}, 100)
            that.setData({
                latests: that.data.latests.concat(res.data),
            })
        })
    },
    closeModal: function(e) {
        this.setData({
            user: {},
            modalHidden: true
        })
    },
    previewImg: function(e) {
		wx.vibrateShort()
        let src = e.currentTarget.dataset.src
        let author = e.currentTarget.dataset.author
        let color = e.currentTarget.dataset.color
        const pic = {}
        pic.color = color
        pic.src = src
        pic.author = author
        let date = JSON.stringify(pic)
        wx.setStorage({ //设置color
            key: 'color',
            data: color,
        })
        wx.setStorage({ //设置author
            key: 'author',
            data: author,
        })
        wx.setStorage({ //设置src
            key: 'src',
            data: src,
        })
        wx.navigateTo({
            url: '../info/index?src=' + src
        })
    },
    onLoad: function() {
		wx.vibrateShort()
        this.loadFeaList()
        let h = app.globalData.dh
        this.setData({
            height: h + "px"
        })
    },
	/**
     * 页面相关事件处理函数--监听用户下拉动作
     */
	onPullDownRefresh: function () {
		wx.vibrateShort()
		var that = this
		that.setData({
			page: 1,
			latests: []
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
	}
    
})