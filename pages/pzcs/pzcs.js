// pages/pzcs/pzcs.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    characteristicId: '',
    serviceId: '',
    deviceId: ''
  },
  
  //vin跳转
  vin: function(){
    wx.navigateTo({
      url: "/pages/cnbd/cnbd?deviceId="+this.data.deviceId+"&serviceId="+this.data.serviceId+"&characteristicId="+this.data.characteristicId+"",
    })
  },
  //zd跳转
  zd: function(){
    wx.navigateTo({
      url: "/pages/zhuangtai/zhuangtai?deviceId="+this.data.deviceId+"&serviceId="+this.data.serviceId+"&characteristicId="+this.data.characteristicId+"",
    })
  },
  //gj跳转
  gj: function(){
    wx.navigateTo({
      url: "/pages/gaojipeizhi/gaojipeizhi?deviceId="+this.data.deviceId+"&serviceId="+this.data.serviceId+"&characteristicId="+this.data.characteristicId+"",
    })
  },
  //hd操作
  hd: function(){
    wx.navigateTo({
      url: "/pages/hdcnsj/hdcnsj?deviceId="+this.data.deviceId+"&serviceId="+this.data.serviceId+"&characteristicId="+this.data.characteristicId+"",
    })
  },
  //can操作
  can: function(){
    wx.navigateTo({
      url: "/pages/can/can?deviceId="+this.data.deviceId+"&serviceId="+this.data.serviceId+"&characteristicId="+this.data.characteristicId+"",
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options)
    this.setData({
      characteristicId: options.characteristicId,
      serviceId: options.serviceId,
      deviceId: options.deviceId
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

  }
})