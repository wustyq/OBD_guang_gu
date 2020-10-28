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
    value1: '',
    value2: '',
    value3: '',
    value4: '',
    value5: '',
    value6: '',
    value7: '',
    value8: '',
    value9: '',
    value10: '',
    value11: '',
    value12: '',
    value13: '',
    value14: '',
    value15: '',
    value16: '',
    value17: '',
    value18: '',
    value19: '',
    value20: '',
    value21: '',
    value22: '',
    value23: '',
    ishuidu_fk: false,
    receiverText: '',
    receiverLength: 0,
    isbtn_huidu: false,
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
      flag_huidu: 1,
      isbtn_huidu: true,
      value1: '',
      value2: '',
      value3: '',
      value4: '',
      value5: '',
      value6: '',
      value7: '',
      value8: '',
      value9: '',
      value10: '',
      value11: '',
      value12: '',
      value13: '',
      value14: '',
      value15: '',
      value16: '',
      value17: '',
      value18: '',
      value19: '',
      value20: '',
      value21: '',
      value22: '',
      value23: '',
      ishuidu_fk: false
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
    const sendText = "Req:1020,0,10\r\n"
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

    // setTimeout(() => {
    //   if(this.data.imei == ''){
    //     wx.showToast({
    //       title: '回读失败',
    //       duration: 3000,
    //       icon: 'none'
    //     })
    //   }
    // }, 5000)               //注意这个地方的5000ms以后根据实际情况

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
            setTimeout(()=>{
              if(!self.data.ishuidu_fk){
                wx.showToast({
                  title: '回读失败',
                  icon: 'none',
                  duration: 3000
                })
                self.setData({
                  isbtn_huidu: false
                })
              }
            },5000)
          /**
     * 监听蓝牙设备的特征值变化
     */
    // console.log("wozhixingle")
    wx.onBLECharacteristicValueChange((res)=>{
      const receiverText = self.buf2string(res.value);
      //console.log(receiverText + 'huidu')
      console.log(receiverText.split(','))
      self.setData({
        ishuidu_fk: true,
        isbtn_huidu: false
      })
      setTimeout(() => {
        if(receiverText.split(',')[0] == "Rsp:1020" && receiverText.split(',')[1] == "0"){
          //尿素液位
             if(receiverText.split(',')[3] < 255){
               self.setData({
                 value1: (receiverText.split(',')[3] * 0.4).toFixed(0) + '(%)'
               })
             }else{
               self.setData({
                 value1: "无数据"
               })
             }
          //尿素温度
             if(receiverText.split(',')[4] < 255){
              self.setData({
                value2: (receiverText.split(',')[4]  - 40).toFixed(0) + "(℃)"
              })
            }else{
              self.setData({
                value2: "无数据"
              })
            }
          //发动机转速
            if(receiverText.split(',')[5] < 65535){
              self.setData({
                value3: (receiverText.split(',')[5] * 0.125).toFixed(3) + '(rpm)'
              })
            }else{
              self.setData({
                value3: "无数据"
              })
            }
          //发动机指令扭矩百分比
            if(receiverText.split(',')[6] < 255){
              self.setData({
                value4: (receiverText.split(',')[6] - 125).toFixed(0) + '(%)'
              })
            }else{
              self.setData({
                value4: "无数据"
              })
            }
          //发动机实际扭矩百分比
            if(receiverText.split(',')[7] < 255){
              self.setData({
                value5: (receiverText.split(',')[7] - 125).toFixed(0) + '(%)'
              })
            }else{
              self.setData({
                value5: "无数据"
              })
            }
            //油位
            if(receiverText.split(',')[8] < 255){
              self.setData({
                value6: (receiverText.split(',')[8] * 4 / 10).toFixed(0) + '(%)'
              })
            }else{
              self.setData({
                value6: "无数据"
              })
            }
            //油耗
            if(receiverText.split(',')[9] < 65535){
              self.setData({
                value7: (receiverText.split(',')[9] * 5 / 100).toFixed(2) + '(L/h)'
              })
            }else{
              self.setData({
                value7: "无数据"
              })
            }
            //车速
            if(receiverText.split(',')[10] < 65535){
              self.setData({
                value8: (receiverText.split(',')[10] * 1 / 256).toFixed(3) + '(km/h)'
              })
            }else{
              self.setData({
                value8: "无数据"
              })
            }
            //大气压力
            if(receiverText.split(',')[11] < 255){
              self.setData({
                value9: (receiverText.split(',')[11] * 0.5).toFixed(0) + '(kPa)'
              })
            }else{
              self.setData({
                value9: "无数据"
              })
            }
            //发动机冷却液温度
            if(receiverText.split(',')[12] < 255){
              self.setData({
                value10: (receiverText.split(',')[12] -40).toFixed(0) + "(℃)"
              })
            }else{
              self.setData({
                value10: "无数据"
              })
            }
            //SCR入口温度
            if(receiverText.split(',')[13] < 65535){
              self.setData({
                value11: (receiverText.split(',')[13] * 0.03125 - 273).toFixed(5) + "(℃)"
              })
            }else{
              self.setData({
                value11: "无数据"
              })
            }
            //SCR出口温度
            if(receiverText.split(',')[14] < 65535){
              self.setData({
                value12: (receiverText.split(',')[14] * 0.03125 - 273).toFixed(5) + '(℃)'
              })
            }else{
              self.setData({
                value12: "无数据"
              })
            }
            //压差
            if(receiverText.split(',')[15] < 65535){
              self.setData({
                value13: (receiverText.split(',')[15] / 10).toFixed(1) + '(kPa)'
              })
            }else{
              self.setData({
                value13: "无数据"
              })
            }
            //后NOx
            if(receiverText.split(',')[16] < 65535){
              self.setData({
                value14: (receiverText.split(',')[16] * 0.05 - 200).toFixed(2) + '(ppm)'
              })
            }else if(receiverText.split(',')[16] == 65535){
              self.setData({
                value14: "无数据"
              })
            }else if(receiverText.split(',')[16] == 'FFFF'){
              self.setData({
                value14: "数据有误"
              })
            }
            //摩擦扭矩
            if(receiverText.split(',')[17] < 255){
              self.setData({
                value15: (receiverText.split(',')[17] -125).toFixed(0) + '(%)'
              })
            }else{
              self.setData({
                value15: "无数据"
              })
            }
            //车辆运行总里程
            if(receiverText.split(',')[18] != -1){
              self.setData({
                value16: (receiverText.split(',')[18] *0.125).toFixed(1) + '(km)'
              })
            }else{
              self.setData({
                value16: "无数据"
              })
            }
            //前NOx
            if(receiverText.split(',')[19] <65535){
              self.setData({
                value17: (receiverText.split(',')[19] *0.05 - 200).toFixed(2) + '(ppm)'
              })
            }else if(receiverText.split(',')[19] == 65535){
              self.setData({
                value17: "无数据"
              })
            }else if(receiverText.split(',')[19] == 'FFFF'){
              self.setData({
                value17: "数据有误"
              })
            }
            //尿素泵状态“准备”
            if(receiverText.split(',')[20] == 0){
              self.setData({
                value18: "休眠模式"
              })
            }else if(receiverText.split(',')[20] == 1){
              self.setData({
                value18: "准备模式"
              })
            }else if(receiverText.split(',')[20] == 2){
              self.setData({
                value18: "正常工作模式"
              })
            }else if(receiverText.split(',')[20] == 3){
              self.setData({
                value18: "系统错误"
              })
            }else if(receiverText.split(',')[20] == 4){
              self.setData({
                value18: "SAE预留"
              })
            }else if(receiverText.split(',')[20] == 5){
              self.setData({
                value18: "防止过热保护模式"
              })
            }else if(receiverText.split(',')[20] == 6){
              self.setData({
                value18: "防止过冷保护模式"
              })
            }else if(receiverText.split(',')[20] == 7){
              self.setData({
                value18: "关机"
              })
            }else if(receiverText.split(',')[20] == 8){
              self.setData({
                value18: "诊断"
              })
            }else if(receiverText.split(',')[20] == 9){
              self.setData({
                value18: "测试，允许诊断"
              })
            }else if(receiverText.split(',')[20] == 10){
              self.setData({
                value18: "测试，不允许诊断"
              })
            }else if(receiverText.split(',')[20] >= 11&&receiverText.split(',')[20]<=13){
              self.setData({
                value18: "SAE预留"
              })
            }else if(receiverText.split(',')[20] == 14){
              self.setData({
                value18: "错误"
              })
            }else if(receiverText.split(',')[20] == 15){
              self.setData({
                value18: "不可用"
              })
            }else{
              self.setData({
                value18: "无数据"
              })
            }
            //尿素泵喷射速率
            if(receiverText.split(',')[21] <65535){
              self.setData({
                value19: (receiverText.split(',')[21] *0.05).toFixed(2) + '(L/h)'
              })
            }else{
              self.setData({
                value19: "无数据"
              })
            }
            //进气量
            if(receiverText.split(',')[22] <65535){
              self.setData({
                value20: (receiverText.split(',')[22] *0.05).toFixed(2) + '(kg/h)'
              })
            }else{
              self.setData({
                value20: "无数据"
              })
            }
            //PM
            if(receiverText.split(',')[23] <65535){
              self.setData({
                value21: (receiverText.split(',')[23] *0.001).toFixed(3) + '(mg/m3)'
              })
            }else{
              self.setData({
                value21: "无数据"
              })
            }
            //K值
            if(receiverText.split(',')[24] <65535){
              self.setData({
                value22: (receiverText.split(',')[24] *0.001).toFixed(3) + '(m-1)'
              })
            }else{
              self.setData({
                value22: "无数据"
              })
            }
            //不透光度
            if(receiverText.split(',')[25] <65535){
              self.setData({
                value23: (receiverText.split(',')[25] *0.1).toFixed(1) + "(%)"
              })
            }else{
              self.setData({
                value23: "无数据"
              })
            }
            //油门踏板位置
            
        }else{
          wx.showToast({
            title: '回读失败',
            icon: 'none',
            duration: 3000
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