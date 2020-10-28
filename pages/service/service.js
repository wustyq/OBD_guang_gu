const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    services: [],
    characteristic: ''
  },
  /**
   * 自定义数据
   */
  customData: {
    deviceName: '',
    deviceId: '',
    services: [],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this
    this.customData.deviceId = options.deviceId
    this.customData.deviceName = options.deviceName
    this.setData({
      name: options.deviceName
    })
    /**
     * 获取蓝牙设备服务列表
     */
    wx.getBLEDeviceServices({
      deviceId: options.deviceId,
      success: function(res) {
        const services = res.services.filter((item, i) => {
          return !/^000018/.test(item.uuid)
        })
        self.customData.services = services
        self.setData({
          services: services
        })
      },
      fail: function(res) {
        wx.showToast({
          title: '设备服务获取失败',
          icon: 'none'
        })
      }
    })
    
  },
  /**
   * 监听页面初次渲染完成
   */
  onReady: function () {
    app.stopSearchDevs(); // 停止搜索
  },
  /**
   * 监听页面卸载
   */
  onUnload: function () {
    app.endConnect(this.customData.deviceId)
  },
  /**
   * 跳转获取特征值页面
   */
  getCharacteristic (event) {
    const self = this
    if (app.globalData.connectState) {
      //const serviceId = event.currentTarget.dataset.uuid
      //const deviceId = this.customData.deviceId
      //const characteristicId = ''
    //  console.log(deviceId)
    //  console.log(serviceId)
      /**
     * 获取characteristicid
     */
    wx.getBLEDeviceCharacteristics({
      deviceId: this.customData.deviceId,
      serviceId: event.currentTarget.dataset.uuid,
      success: (res) => {
        console.log(res.characteristics[0].uuid)
        self.setData({
          characteristic: res.characteristics[0].uuid
        })
        console.log(self.data.characteristic)
        // characteristicId = res.characteristics[0].uuid
        wx.navigateTo({
          url: "/pages/pzcs/pzcs?deviceId="+this.customData.deviceId+"&serviceId="+event.currentTarget.dataset.uuid+"&characteristicId="+this.data.characteristic+"",
        })
      }
    })
      
    } else {
      wx.showToast({
        title: '未连接蓝牙设备',
        icon: 'none'
      })
    }
  }
})