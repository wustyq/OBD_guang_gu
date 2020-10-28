//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
   hover: 1,
   version: app.globalData.version,
   domain: app.globalData.domain
  },
  obd: function(){
     wx.redirectTo({
       url: '../obd/obd',
     })
  },
  cnbd: function(){
    wx.redirectTo({
      url: '../search/search',
    })
  },

  wd: function(){
    this.setData({
          hover:2
        })
    wx.redirectTo({
      url: '../person/person',
    })
 },

 onLoad: function () {
  

},

onReady: function () {
  
},

  onShow: function (options) {
    this.setData({
      hover:1
    })
  },
})
