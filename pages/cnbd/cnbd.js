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
    sn: '',
    carnum: '',
    carnum_fb: '',
    vin: '',
    iszhuce: 0,
    xiafa: 'Req:',
    receiverText: '',
    receiverLength: 0,
    sendLength: 0,
    checked: false,
    xiafa_fk: false,
    restart_fk: false,
    isbtn_huidu: false,
    isbtn_send: false,
    isbtn_restart: false,
    flag_xiafa: 0,
    flag_huidu: 0,
    flag_restart: 0,
    xs_flag: false,
    xs_i: 0
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
  //重启OBD终端
  restart: function(){
    wx.showModal({
      title: '提示',
      content: '确定重启OBD终端？',
      success: (res)=> {
        if (res.confirm) {
          console.log('用户点击确定')
          if(this.data.flag_restart == 1){ 
            wx.showToast({
              title: '操作间隔太短，间隔大约10s哦！',
              icon: 'none'
            })
            return false
          }
          this.setData({
          restart_fk: false,
          isbtn_restart: true,
          flag_restart: 1
          })
          setTimeout(() => {
            if(!this.data.restart_fk){
              wx.showToast({
                title: '重启失败（超时）',
                duration: 3000,
                icon: 'none'
              })
            }
            this.setData({
              isbtn_restart: false
            })
          }, 5000)
          //定时回读间隔为10s
          setTimeout(()=>{
            this.setData({
              flag_restart: 0
            })
          },10000)
           //发送数据
           const deviceId = this.customData.deviceId // 设备ID
           const serviceId = this.customData.serviceId // 服务ID
           const characteristicId = this.customData.characteristicId // 特征值ID
           const sendText = "Req:1022,0,10\r\n"
           //console.log(sendText.length)
           const sendPackage = app.subPackage(sendText)//sendText // // 数据分每20个字节一个数据包数组
           // console.log(sendPackage[0])
           // console.log(sendPackage[0].length)
           // console.log(sendPackage)
       
           //console.log(sendPackage[2])
           if (app.globalData.connectState) {
             if (this.customData.canWrite) { // 可写
               this.writeData_restart({ deviceId, serviceId, characteristicId, sendPackage })
             }
           } else {
             wx.showToast({
               title: '已断开连接',
               icon: 'none'
             })
             this.setData({
              isbtn_restart: false
             })
           }

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },
  //拍照识别
  camera: function(){
    const self = this;
    var access_token;
    wx.getStorage({
      key: 'access_token',
      success (res) {
        access_token = res.data;
        // console.log(access_token)
      }
    })
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res.tempFilePaths)
          //核心代码
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0],
          encoding: 'base64', //编码格式
          success(ans) {
            // console.log(ans.data)
            wx.showLoading({ title: '识别中' })
            self.setData({
              carnum_fb: '',
              carnum: '',
              vin: ''
            })
            wx.request({
              url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/vehicle_license?access_token='+access_token,
              method: 'POST',
              header: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              data: {
                image: ans.data
              },
              success(_res) {
                wx.hideLoading();
                console.log(_res.data.words_result.车辆识别代号.words);
                self.setData({
                  carnum_fb:  _res.data.words_result.号牌号码.words.toUpperCase(),
                  carnum: _res.data.words_result.号牌号码.words.toUpperCase(),
                  vin: _res.data.words_result.车辆识别代号.words.toUpperCase()
                })
                
              }, fail(_res) {
                wx.hideLoading();
                wx.showToast({
                  title: '请求出错',
                })
                console.log(_res)
              }
            })
          }
        })
      }
    })
  },
  //点八下显示
  xs_flag: function(){
    // console.log(1);
    var i = this.data.xs_i + 1;
    console.log(1);
    if(i < 8){
      this.setData({
        xs_i: i
      })
    }else{
      this.setData({
        xs_flag: true
      })
    }
  },

  //跳转状态
  zhuangtai: function() {
    const deviceId = this.customData.deviceId
    const serviceId = this.customData.serviceId
    const characteristicId = this.customData.characteristicId
    wx.navigateTo({
      url: `/pages/zhuangtai/zhuangtai?deviceId=${deviceId}&serviceId=${serviceId}&characteristicId=${characteristicId}`,
    })
  },
  //一键恢复
  huifu: function(){
    this.setData({
      sn: '',
    carnum: '',
    carnum_fb: '',
    vin: '',
    iszhuce: 0,
    checked: false
    })
    wx.getStorage({
      key: 'vin_sn',
      success: (res)=> {
        //console.log(res.data)
        this.setData({
          sn: res.data
        })
      }
    })
    wx.getStorage({
      key: 'vin_carnum',
      success: (res)=> {
        //console.log(res.data)
        this.setData({
          carnum: res.data,
          carnum_fb: res.data
        })
      }
    })
    wx.getStorage({
      key: 'vin_vin',
      success: (res)=> {
        //console.log(res.data)
        this.setData({
          vin: res.data
        })
      }
    })
    wx.getStorage({
      key: 'vin_iszhuce',
      success: (res)=> {
        //console.log(res.data)
        if(res.data == 0){
          this.setData({
            iszhuce: 0,
            checked: false,
          })
        }else if(res.data == 1){
          this.setData({
            iszhuce: 1,
            checked: true,
          })
        }
      }
    })
  },
  //回读命令
  huidu: function(){
    if(this.data.flag_huidu == 1){ 
      wx.showToast({
        title: '操作间隔太短，间隔大约10s哦！',
        icon: 'none'
      })
      return false
    }
    this.setData({
      sn: '',
    carnum: '',
    carnum_fb: '',
    vin: '',
    iszhuce: 0,
    checked: false,
    isbtn_huidu: true,
    flag_huidu: 1
    })

    setTimeout(() => {
      if(this.data.sn == ''){
        wx.showToast({
          title: '回读失败',
          duration: 3000,
          icon: 'none'
        })
      }
      this.setData({
        isbtn_huidu: false
      })
    }, 5000)               //注意这个地方的5000ms以后根据实际情况
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
    const sendText = "Req:1011,0,10\r\n"
    //console.log(sendText.length)
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



  //下发命令
  send: function(e){
    // console.log(e)
    if(this.data.flag_xiafa == 1){
      wx.showToast({
        title: '操作间隔太短，间隔大约10s哦！',
        icon: 'none'
      })
      return false
    }
    this.setData({
      xiafa: 'Req:'
    })
    //验证SN前缀
    var str2 = this.data.sn.toUpperCase();
    var reg2 = /^[A-Z0-9]{3}$/;
    if(str2 == ''){
      wx.showToast({
        title: '请输入SN！',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if(!reg2.test(str2)){
       wx.showToast({
        title: 'SN格式不正确！例如：ABC或123！',
        icon: 'none',
        duration: 2000
      })
       return false;
    }
    //验证车牌号
    var str3 = this.data.carnum.toUpperCase();
    var reg3 = /^[\u4E00-\u9FA5][A-Z]/;
    if(str3 == ''){
      wx.showToast({
        title: '请输入车牌号！',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if(!reg3.test(str3)){
      wx.showToast({
        title: '车牌号格式不正确！例如：鄂Axxxxxx！',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    //验证vin
    var str4 = this.data.vin.toUpperCase();
    var reg4 = /^[A-Z0-9]{17}$/;
    if(str4 == ''){
      wx.showToast({
        title: '请输入VIN！',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if(!reg4.test(str4)){
      wx.showToast({
        title: 'VIN格式不正确！',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    reg4 = /[IOQ]/;
    if(reg4.test(str4)){
      wx.showToast({
        title: '有非法字符 I 或 O 或 Q！',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    reg4 = /^[A-Z0-9]{9}[0UZ][A-Z0-9]{7}$/;
    if(reg4.test(str4)){
      wx.showToast({
        title: '生产型年有非法字符 0 或 U 或 Z！',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    var xiafa = this.data.xiafa + 1010 +','+ 4 +','+ this.data.sn +','+ this.data.carnum_fb +','+ this.data.vin +','+ this.data.iszhuce +','+ '10\r\n'

    this.setData({
      xiafa: xiafa,
      xiafa_fk: false,
      isbtn_send: true,
      flag_xiafa: 1
    })
    // console.log(this.data.xiafa)
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
    const sendText = this.data.xiafa
    //console.log(sendText.length)
    const sendPackage = app.subPackage(sendText)//sendText // // 数据分每20个字节一个数据包数组
    // console.log(sendPackage[0])
    // console.log(sendPackage[0].length)
    // console.log(sendPackage)

    //console.log(sendPackage[2])
    if (app.globalData.connectState) {
      if (this.customData.canWrite) { // 可写
        setTimeout(() => {
          if(!this.data.xiafa_fk){
            //console.log("下发失败")
            wx.showToast({
              title: '下发失败',
              duration: 3000,
              icon: 'none'
            })
            this.setData({
              isbtn_send: false
            })
          }
        }, 5000)                //注意这个地方的5000ms以后根据实际情况
        this.writeData({ deviceId, serviceId, characteristicId, sendPackage })
      }
    } else {
      wx.showToast({
        title: '已断开连接',
        icon: 'none'
      })
      this.setData({
        isbtn_send: false
      })
    }
  }, 

  //数据绑定
  checkboxChange: function(e){
    // console.log(e.detail.value[0])
    if(e.detail.value[0] == 1){
      this.setData({
        iszhuce: 1
      })
    }else if(e.detail.value[0] == undefined){
      this.setData({
        iszhuce: 0
      })
    }
    //缓存iszhuce
    wx.setStorage({
      data: this.data.iszhuce,
      key: 'vin_iszhuce',
    })
    // console.log(this.data.iszhuce)
  },
   cgsn: function(e){
    //  console.log(e.detail.value)
     this.setData({
       sn: e.detail.value.toUpperCase()
     })
     //缓存sn
     wx.setStorage({
      data: this.data.sn,
      key: 'vin_sn',
    })
   },
   cgcarnum: function(e){
    //  console.log(e.detail.value)
    this.setData({
      carnum: e.detail.value.toUpperCase(),
      carnum_fb: e.detail.value.toUpperCase()
    })
    //缓存车牌号
    wx.setStorage({
      data: this.data.carnum,
      key: 'vin_carnum',
    })
   },
   cgvin: function(e){
    //  console.log(e.detail.value)
     this.setData({
       vin: e.detail.value.toUpperCase()
     })
     //缓存vin
     wx.setStorage({
      data: this.data.vin,
      key: 'vin_vin',
    })
   },

  shouye: function(){
    wx.redirectTo({
      url: '../index/index',
    })
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
        success: (res)=> {
          console.log(sendPackage)

        /**
     * 监听蓝牙设备的特征值变化
     */
    // console.log("wozhixingle")
    wx.onBLECharacteristicValueChange( (res)=> {
      const receiverText = self.buf2string(res.value);
      //console.log(receiverText + 'send')
      console.log(receiverText.split(','))
      self.setData({
        xiafa_fk: true
      })
      setTimeout(() => {
        if(receiverText.split(',')[0] == 'Rsp:1010'&&receiverText.split(',')[1] == '0'){
          //console.log("下发成功")
          wx.showToast({
            title: '下发成功',
            duration: 4000
          })
          this.setData({
            isbtn_send: false
          })
        }else{
          wx.showToast({
            title: '下发失败',
            duration: 4000,
            icon: 'none'
          })
          this.setData({
            isbtn_send: false
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
  

   huidu_fk: function(res){
    const receiverText = this.buf2string(res.value);
    //console.log(receiverText + 'huidu')
    console.log(receiverText.split(','))
    setTimeout(() => {
      if(receiverText.split(',')[0] == "Rsp:1011" && receiverText.split(',')[1] == "0"){
        var reg3 = /^[A-Z0-9]{3}$/;  //验证SN
        if(!reg3.test(receiverText.split(',')[3])){
          self.setData({
            sn: ''
          })
        }else{
          self.setData({
            sn: receiverText.split(',')[3]
          })
        }
        this.setData({
      carnum: receiverText.split(',')[4],
   carnum_fb: receiverText.split(',')[4],
         vin: receiverText.split(',')[5],
         isbtn_huidu: false
        })
        if(receiverText.split(',')[6] == 0){
          this.setData({
            checked: false,
            iszhuce: 0
          })
        }else if(receiverText.split(',')[6] == 1){
          this.setData({
            checked: true,
            iszhuce: 1
          })
        }
      }else{
        wx.showToast({
          title: '回读失败',
          icon: 'none',
          duration: 3000
        })
        this.setData({
          isbtn_huidu: false
        })
      }
    }, 200)
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
        success: (res)=> {
          console.log(sendPackage)

          /**
     * 监听蓝牙设备的特征值变化
     */
    // console.log("wozhixingle")
    wx.onBLECharacteristicValueChange(this.huidu_fk)
          
          self.setData({
            sendLength: self.data.sendLength + sendPackage[i].length // 更新已发送字节数
          })
          i += 1;
          self.writeData_fb({deviceId, serviceId, characteristicId, sendPackage, index: i}) // 发送成功，发送下一个数据包
        },
        fail: function (res) {
          self.writeData_fb({deviceId, serviceId, characteristicId, sendPackage, index}) // 发送失败，重新发送
        }
      })
    }
  },
  writeData_restart:function({deviceId, serviceId, characteristicId, sendPackage, index = 0}) {
    const self = this
    let i = index;
    let len = sendPackage.length;
    if (len && len > i) {
      wx.writeBLECharacteristicValue({
        deviceId,
        serviceId,
        characteristicId,
        value: app.string2buf(sendPackage[i]),
        success: (res)=> {
          console.log(sendPackage)

        /**
     * 监听蓝牙设备的特征值变化
     */
    // console.log("wozhixingle")
    wx.onBLECharacteristicValueChange( (res)=> {
      const receiverText = self.buf2string(res.value);
      //console.log(receiverText + 'send')
      console.log(receiverText.split(','))
      self.setData({
        restart_fk: true
      })
      setTimeout(() => {
        if(receiverText.split(',')[0] == 'Rsp:1022'&&receiverText.split(',')[1] == '0'){
          //console.log("下发成功")
          wx.showToast({
            title: '重启成功',
            duration: 4000
          })
          this.setData({
            isbtn_restart: false
          })
        }else{
          wx.showToast({
            title: '重启失败',
            duration: 4000,
            icon: 'none'
          })
          this.setData({
            isbtn_restart: false
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
    //console.log(options)
    const self = this
    this.customData.deviceId = options.deviceId
    this.customData.serviceId = options.serviceId
    this.customData.characteristicId = options.characteristicId
    /**
     * 如果支持notify
     */
    if (this.customData.canNotify) {
      wx.notifyBLECharacteristicValueChange({
        deviceId: options.deviceId,
        serviceId: options.serviceId,
        characteristicId: options.characteristicId,
        state: true,
        success: function(res) {
          // do something...
        }
      })
    } 
  },

    /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (){
    // console.log(1);

    
    // console.log("wozhixingle")
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      xs_flag: false,
      xs_i: 0
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      receiverText: '',
      receiverLength: 0,
      sendText: '',
      sendLength: 0,
    })
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

  },
 
})