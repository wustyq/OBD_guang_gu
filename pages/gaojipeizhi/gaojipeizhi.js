// pages/zhuangtai/zhuangtai.js
const app = getApp()
Page({
  
  buf2string:function (buffer) {
    //console.log(buffer)
    // console.log(new Uint8Array(buffer))
    var arr = Array.prototype.map.call(new Uint8Array(buffer), x => x)
    //console.log(arr[0].toString(16).length)
    //console.log('%'+arr.map(function(item){if(item.toString(16).length == 1){return "0"+item.toString(16)}else if(item.toString(16).length == 2){return item.toString(16)}}).join('%'))
    var url = '%'+arr.map(function(item){if(item.toString(16).length == 1){return "0"+item.toString(16)}else if(item.toString(16).length == 2){return item.toString(16)}}).join('%')
    //console.log(decodeURIComponent(url))
    return decodeURIComponent(url)
    // arr.map((char, i) => {
    //   return String.fromCharCode(char);
    // }).join('');
  },

  /**
   * 页面的初始数据
   */
  data: {
    array_can1: ['请选择波特率','250kpbs','500kpbs'],
    index_can1: 1,
    flag_can1:'',
    array_can2: ['请选择波特率','250kpbs','500kpbs'],
    index_can2: 1,
    flag_can2:'',
    array_xm: ['请选择状态','允许','不允许'],
    index_xm: 2,
    flag_xm:'',
    array_can1_h: ['请选择状态','允许','不允许'],
    index_can1_h: 1,
    flag_can1_h:'',
    array_can2_h: ['请选择状态','允许','不允许'],
    index_can2_h: 2,
    flag_can2_h:'',
    receiverText: '',
    receiverLength: 0,
    isxiafa_fk: false,
    isbtn_xiafa: false,
    isbtn_huidu: false,
    flag_xiafa: 0,
    flag_huidu: 0
  },
  
/**
   * 自定义数据
   */
  customData: {
    sendText: '',
    deviceId: '',
    serviceId: '',
    characteristicId: '',
    canWrite: true,
    canRead: true,
    canNotify: true,
    canIndicate: false,
  },
  //选择器can1
  Picker_can1: function(e){
    //console.log(e.detail.value)
    this.setData({
      index_can1: e.detail.value
    })
  },
  //选择器can2
  Picker_can2: function(e){
    //console.log(e.detail.value)
    this.setData({
      index_can2: e.detail.value
    })
  },
  //选择器xm
  Picker_xm: function(e){
    //console.log(e.detail.value)
    this.setData({
      index_xm: e.detail.value
    })
  },
  //选择器can1_h
  Picker_can1_h: function(e){
    //console.log(e.detail.value)
    this.setData({
      index_can1_h: e.detail.value
    })
  },
  //选择器can2_h
  Picker_can2_h: function(e){
    //console.log(e.detail.value)
    this.setData({
      index_can2_h: e.detail.value
    })
  },
  //huidu操作
  huidu: function(){
    if(this.data.flag_huidu == 1){ 
      wx.showToast({
        title: '操作间隔太短，间隔大约10s哦！',
        icon: 'none'
      })
      return false
    }
    this.setData({
      isbtn_huidu: true,
      index_can1: 0,
      index_can2: 0,
      index_xm: 0,
      index_can1_h: 0,
      index_can2_h: 0,
      flag_huidu: 1
    })
    //超时报警
    setTimeout(()=>{
      if(this.data.index_can1 == 0){
        wx.showToast({
          title: '回读失败（超时）',
          icon: 'none',
          duration: 3000
        })
        this.setData({
          isbtn_huidu: false
        })
      }
    },10000)
    //定时回读间隔为10s
    setTimeout(()=>{
      this.setData({
        flag_huidu: 0
      })
    },10000)
     //发送数据
    const deviceId = this.customData.deviceId // 设备ID
    const serviceId = this.customData.serviceId // 服务ID
    const characteristicId = this.customData.characteristicId // 特征值ID
    const sendText = "Req:1014,0,10\r\n"
    //console.log(sendText)
    const sendPackage = app.subPackage(sendText)//sendText // // 数据分每20个字节一个数据包数组
    // console.log(sendPackage[0])
    // console.log(sendPackage[0].length)
    // console.log(sendPackage)

    //console.log(sendPackage[2])
    if (app.globalData.connectState) {
      if (this.customData.canWrite) { // 可写
        this.writeData_fb({ deviceId, serviceId, characteristicId, sendPackage })
      }
    } else {
      wx.showToast({
        title: '已断开连接',
        icon: 'none'
      })
      this.setData({
        isbtn_huidu: false
      })
    }
  },
  //xiafa操作
  xiafa: function(){
    if(this.data.flag_xiafa == 1){ 
      wx.showToast({
        title: '操作间隔太短，间隔大约10s哦！',
        icon: 'none'
      })
      return false
    }

    if(this.data.index_can1 == 0){
      wx.showToast({
        title: '请选择CAN1波特率',
        icon: 'none',
        duration: 3000
      })
      return false
    }
    if(this.data.index_can2 == 0){
      wx.showToast({
        title: '请选择CAN2波特率',
        icon: 'none',
        duration: 3000
      })
      return false
    }
    if(this.data.index_xm == 0){
      wx.showToast({
        title: '请选择休眠状态',
        icon: 'none',
        duration: 3000
      })
      return false
    }
    if(this.data.index_can1_h == 0){
      wx.showToast({
        title: '请选择CAN1唤醒状态',
        icon: 'none',
        duration: 3000
      })
      return false
    }
    if(this.data.index_can2_h == 0){
      wx.showToast({
        title: '请选择CAN2唤醒状态',
        icon: 'none',
        duration: 3000
      })
      return false
    }
    
    this.setData({
      isbtn_xiafa: true,
      flag_xiafa: 1
    })
    
    if(this.data.index_can1 == 1){
      this.setData({
        flag_can1: 0,
      })
    }else if(this.data.index_can1 == 2){
      this.setData({
        flag_can1: 1
      })
    }
    if(this.data.index_can2 == 1){
      this.setData({
        flag_can2: 0
      })
    }else if(this.data.index_can2 == 2){
      this.setData({
        flag_can2: 1
      })
    }
    if(this.data.index_xm == 1){
      this.setData({
        flag_xm: 1
      })
    }else if(this.data.index_xm == 2){
      this.setData({
        flag_xm: 0
      })
    }
    if(this.data.index_can1_h == 1){
      this.setData({
        flag_can1_h: 1
      })
    }else if(this.data.index_can1_h == 2){
      this.setData({
        flag_can1_h: 0
      })
    }
    if(this.data.index_can2_h == 1){
      this.setData({
        flag_can2_h: 1
      })
    }else if(this.data.index_can2_h == 2){
      this.setData({
        flag_can2_h: 0
      })
    }
    
    //超时报警
    setTimeout(()=>{
      if(!this.data.isxiafa_fk){
        wx.showToast({
          title: '下发失败（超时）',
          icon: 'none',
          duration: 3000
        })
        this.setData({
          isbtn_xiafa: false
        })
      }
    },10000)
    //定时下发间隔为10s
    setTimeout(()=>{
      this.setData({
        flag_xiafa: 0
      })
    },10000)

    //发送数据
    const deviceId = this.customData.deviceId // 设备ID
    const serviceId = this.customData.serviceId // 服务ID
    const characteristicId = this.customData.characteristicId // 特征值ID
    const sendText = "Req:1013,5,"+this.data.flag_can1+","+this.data.flag_can2+","+this.data.flag_xm+","+this.data.flag_can1_h+","+this.data.flag_can2_h+",10\r\n"
    //console.log(sendText)
    const sendPackage = app.subPackage(sendText)//sendText // // 数据分每20个字节一个数据包数组
    // console.log(sendPackage[0])
    // console.log(sendPackage[0].length)
    // console.log(sendPackage)

    //console.log(sendPackage[2])
    if (app.globalData.connectState) {
      if (this.customData.canWrite) { // 可写
        this.writeData({ deviceId, serviceId, characteristicId, sendPackage })
      }
    } else {
      wx.showToast({
        title: '已断开连接',
        icon: 'none'
      })
      this.setData({
        isbtn_xiafa: false
      })
    }
  },
  /**
   * 向特征值写数据(write)
   */
  writeData: function ({deviceId, serviceId, characteristicId, sendPackage, index = 0}) {
    const self = this
    let i = index;
    let len = sendPackage.length;
    if (len && len > i) {
      wx.writeBLECharacteristicValue({
        deviceId,
        serviceId,
        characteristicId,
        value: app.string2buf(sendPackage[i]),
        success: function (res) {
        console.log(sendPackage)
        self.setData({
          isxiafa_fk: false
        })
          /**
     * 监听蓝牙设备的特征值变化
     */
    // console.log("wozhixingle")
    wx.onBLECharacteristicValueChange(function (res) {
      const receiverText = self.buf2string(res.value);
     // console.log(receiverText + 'gaoji')
      console.log(receiverText.split(','))
      self.setData({
        receiverLength: self.data.receiverLength + receiverText.length,
        isxiafa_fk: true
      })
      setTimeout(() => {
        if(receiverText.split(',')[0] == 'Rsp:1013'&&receiverText.split(',')[1] == '0'){
          wx.showToast({
            title: '下发成功',
            duration:3000
          })
          self.setData({
            isbtn_xiafa: false
          })
        }else{
          wx.showToast({
            title: '下发失败',
            icon: 'none',
            duration:3000
          })
          self.setData({
            isbtn_xiafa: false
          })
        }
      }, 200)
    })

          self.setData({
            sendLength: self.data.sendLength + sendPackage[i].length // 更新已发送字节数
          })
          i += 1;
          self.writeData({deviceId, serviceId, characteristicId, sendPackage, index: i}) // 发送成功，发送下一个数据包
        },
        fail: function (res) {
          self.writeData({deviceId, serviceId, characteristicId, sendPackage, index}) // 发送失败，重新发送
        }
      })
    }
  },
  

  writeData_fb: function ({deviceId, serviceId, characteristicId, sendPackage, index = 0}) {
    const self = this
    let i = index;
    let len = sendPackage.length;
    if (len && len > i) {
      wx.writeBLECharacteristicValue({
        deviceId,
        serviceId,
        characteristicId,
        value: app.string2buf(sendPackage[i]),
        success: function (res) {
          console.log(sendPackage)
          /**
     * 监听蓝牙设备的特征值变化
     */
    // console.log("wozhixingle")
    wx.onBLECharacteristicValueChange(function (res) {
      const receiverText = self.buf2string(res.value);
      //console.log(receiverText + 'gaoji')
      console.log(receiverText.split(','))
      setTimeout(() => {
        if(receiverText.split(',')[0] == 'Rsp:1014'&&receiverText.split(',')[1] == '0'){
          if(receiverText.split(',')[3] == 0){
            self.setData({
              index_can1: 1,
              isbtn_huidu: false
            })
          }else if(receiverText.split(',')[3] == 1){
            self.setData({
              index_can1: 2
            })
          }

          if(receiverText.split(',')[4] == 0){
            self.setData({
              index_can2: 1
            })
          }else if(receiverText.split(',')[4] == 1){
            self.setData({
              index_can2: 2
            })
          }

          if(receiverText.split(',')[5] == 0){
            self.setData({
              index_xm: 2
            })
          }else if(receiverText.split(',')[5] == 1){
            self.setData({
              index_xm: 1
            })
          }

          if(receiverText.split(',')[6] == 0){
            self.setData({
              index_can1_h: 2
            })
          }else if(receiverText.split(',')[6] == 1){
            self.setData({
              index_can1_h: 1
            })
          }

          if(receiverText.split(',')[7] == 0){
            self.setData({
              index_can2_h: 2
            })
          }else if(receiverText.split(',')[7] == 1){
            self.setData({
              index_can2_h: 1
            })
          }
        }else{
          wx.showToast({
            title: '回读失败',
            icon: 'none',
            duration:3000
          })
          self.setData({
            isbtn_huidu: false
          })
        }
      }, 200)
    })

          self.setData({
            sendLength: self.data.sendLength + sendPackage[i].length // 更新已发送字节数
          })
          i += 1;
          self.writeData({deviceId, serviceId, characteristicId, sendPackage, index: i}) // 发送成功，发送下一个数据包
        },
        fail: function (res) {
          self.writeData({deviceId, serviceId, characteristicId, sendPackage, index}) // 发送失败，重新发送
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    const self = this
    this.customData.deviceId = options.deviceId
    this.customData.serviceId = options.serviceId
    this.customData.characteristicId = options.characteristicId
    /**
     * 如果支持notify
     */
    // if (options.notify) {
      wx.notifyBLECharacteristicValueChange({
        deviceId: options.deviceId,
        serviceId: options.serviceId,
        characteristicId: options.characteristicId,
        state: true,
        success: function(res) {
          // do something...
        }
      })
  // }
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