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
    imei: '',
    iccid: '',
    sn: '',
    wlxhqd: '',
    wlljzt: '',
    gpsdwzt: '',
    can1: '',
    can2: '',
    isbtn_huidu: false,
    receiverText: '',
    receiverLength: 0,
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
 
  //
  huidu: function(){
    if(this.data.flag_huidu == 1){ 
      wx.showToast({
        title: '操作间隔太短，间隔大约10s哦！',
        icon: 'none'
      })
      return false
    }
    this.setData({
      flag_huidu: 1,       //标志位，是请求间隔10秒发送
      isbtn_huidu: true,   //使按钮变灰
      imei: '',
     iccid: '',
        sn: '',
    wlxhqd: '',
    wlljzt: '',
    gpsdwzt: '',
    can1: '',
    can2: ''
    })
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
    const sendText = "Req:1012,0,10\r\n"
    //console.log(sendText.length)
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
        isbtn_huidu: false
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

         setTimeout(() => {
          if(self.data.imei == ''){
            wx.showToast({
              title: '回读失败',
              duration: 3000,
              icon: 'none'
            })
            self.setData({
              isbtn_huidu: false,
            })
          }
        }, 5000)               //注意这个地方的5000ms以后根据实际情况

          /**
     * 监听蓝牙设备的特征值变化
     */
    // console.log("wozhixingle")
    wx.onBLECharacteristicValueChange((res)=>{
      const receiverText = self.buf2string(res.value);
      //console.log(receiverText + 'huidu')
      console.log(receiverText.split(','))
      setTimeout(() => {
        if(receiverText.split(',')[0] == 'Rsp:1012'&&receiverText.split(',')[1] == '0'){
        var reg1 = /^[1-9][0-9]{14}$/;  //验证IMEI
        var reg2 = /^8986[\w]{16}$/;  //验证ICCID
        var reg3 = /^[A-Z0-9]{16}$/;  //验证SN
        
        if(!reg1.test(receiverText.split(',')[3])){
          self.setData({
            imei: ''
          })
        }else{
          self.setData({
            imei: receiverText.split(',')[3]
          })
        }
        if(!reg2.test(receiverText.split(',')[4])){
          self.setData({
            iccid: ''
          })
        }else{
          self.setData({
            iccid: receiverText.split(',')[4]
          })
        }
        if(!reg3.test(receiverText.split(',')[5])){
          self.setData({
            sn: ''
          })
        }else{
          self.setData({
            sn: receiverText.split(',')[5]
          })
        }
        self.setData({
        //   imei: receiverText.split(',')[3],
        //  iccid: receiverText.split(',')[4],
        //     sn: receiverText.split(',')[5],
        wlxhqd: receiverText.split(',')[6],
        isbtn_huidu: false,
        })
        if(receiverText.split(',')[7] == 0){
          self.setData({
            wlljzt: "不正常"
          })
        }else if(receiverText.split(',')[7] == 1){
          self.setData({
            wlljzt: "正常"
          })
        }
        if(receiverText.split(',')[8] == 0){
          self.setData({
            gpsdwzt: "不正常"
          })
        }else if(receiverText.split(',')[8] == 1){
          self.setData({
            gpsdwzt: "正常"
          })
        }
        if(receiverText.split(',')[9] == 0){
          self.setData({
            can1: "正常"
          })
        }else if(receiverText.split(',')[9] == 1){
          self.setData({
            can1: "不正常"
          })
        }
        if(receiverText.split(',')[10] == 0){
          self.setData({
            can2: "正常"
          })
        }else if(receiverText.split(',')[10] == 1){
          self.setData({
            can2: "不正常"
          })
        }
      }else{
        wx.showToast({
          title: '回读失败',
          duration: 3000,
          icon: 'none'
        })
        self.setData({
          isbtn_huidu: false,
        })
      }
      }, 200)
    },)

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
    // console.log(options)
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