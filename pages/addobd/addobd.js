// pages/addobd/addobd.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
     project:["请选择项目"],
     index_p:0,
     obd:["请选择OBD厂家"],
     index:0,
     imei: '',
     sn: '',
     carnum: '',
     vin: '',
     htobd:'',
     htproject:'',
     username: '',
     quyu: ''
  },
  bindPickerChange_p: function(e) {
    // console.log(this.data.project[ e.detail.value])
    this.setData({
    index_p: e.detail.value,
    htproject: this.data.project[ e.detail.value]
    })
    },
  bindPickerChange: function(e) {
    // console.log(this.data.obd[ e.detail.value])
    this.setData({
    index: e.detail.value,
    htobd: this.data.obd[ e.detail.value]
    })
    },
  cgimei: function(e){
     this.setData({
       imei: e.detail.value.toUpperCase()
     })
  },
  cgsn: function(e){
    this.setData({
      sn: e.detail.value.toUpperCase()
    })
 },
 cgcarnum: function(e){
  this.setData({
    carnum: e.detail.value.toUpperCase()
  })
},
cgvin: function(e){
  this.setData({
    vin: e.detail.value.toUpperCase()
  })
},

  //拍照识别
  camera_imei: function(){
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
              imei: '',
            })
            wx.request({
              url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token='+access_token,
              method: 'POST',
              header: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              data: {
                image: ans.data
              },
              success(_res) {
                wx.hideLoading();
                var reg1 = /^[1-9][0-9]{14}$/;
                var index
                console.log(_res)
                for(index in _res.data.words_result){
                  if(reg1.test(_res.data.words_result[index].words)){
                     console.log(_res.data.words_result[index].words)
                     self.setData({
                      imei: _res.data.words_result[index].words,
                    })
                    return false
                  }
                }
                wx.showToast({
                  title: '请对准IMEI号拍照',
                  icon: 'none',
                  duration: 3000
                })
                
              }, fail(_res) {
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

  tijiao: function(){
    //验证IMEI
    var str1 = this.data.imei;
    var reg1 = /^[1-9][0-9]{14}$/;
    if(str1 == ''){
      wx.showToast({
        title: '请输入IMEI！',
        icon: 'none',
        duration: 2000
      })
      return false;
    };
    if(str1 == "000000000000000"){
      wx.showToast({
        title: 'IMEI中不要一直输0啊！',
        icon: 'none',
        duration: 2000
      })
      return false;
    };
    if(!reg1.test(str1)){
      wx.showToast({
        title: 'IMEI格式不正确！要输入15位数字,不要以0开头哦！',
        icon: 'none',
        duration: 2000
      })
      return false;
    };
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
    //验证OBD厂家
    if(this.data.htobd == '请选择OBD厂家'||this.data.htobd == ''){
      wx.showToast({
        title: '请选择OBD厂家！',
        icon: 'none',
        duration: 2000
      })
      return false;
  }
  //验证项目
  if(this.data.htproject == '请选择项目'||this.data.htproject == ''){
      wx.showToast({
        title: '请选择项目！',
        icon: 'none',
        duration: 2000
      })
      return false;
  }
  //传数据
  wx.request({
    url: app.globalData.domain+'/admin/yuanchengxiaochengxu/addobd.ds',
    data: {
      IMEI: this.data.imei,
      SN: this.data.sn.toUpperCase(),
      carnum: this.data.carnum.toUpperCase(),
      VIN: this.data.vin.toUpperCase(),
      OBD: this.data.htobd,
      xiangmu: this.data.htproject,
      lururen: this.data.username
      },
      header: {
      'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success: (res)=> {
      //  console.log(res.data.code);
       if(res.data.code == 20000){
         wx.showToast({
           title: res.data.data.message,
           icon: 'none',
           duration: 2000
         })
      }else if(res.data.code == 10000){
        wx.showToast({
          title: res.data.data.message,
          icon: 'none',
          duration: 2000
        })
      //存取新增成功的IMEI
      wx.setStorage({
        key:"addimei",
        data: this.data.imei
      })
      //改变flag
      wx.setStorage({
        key:"biaozhi",
        data: true
      })
        //  新增后跳转
         wx.redirectTo({
           url: '../obd/obd',
         })
        }
      }, 
      })


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log(options.quyu)
      wx.request({
        url: app.globalData.domain+'/admin/yuanchengxiaochengxu/obdchangjiahuoqu.ds',
        header: {
          'content-type': 'application/json' // 默认值
          },
          method: 'POST',
          success: (res)=> {
            const obd = this.data.obd.concat(res.data)
            this.setData({
              obd: obd
            })
          }
      })
      wx.request({
        url: app.globalData.domain+'/admin/yuanchengxiaochengxu/xiangmuhuoqu.ds',
        data: {
          quyu: options.quyu,
        },
        header: {
          'content-type': 'application/json' // 默认值
          },
          method: 'POST',
          success: (res)=> {
            const project = this.data.project.concat(res.data)
            this.setData({
              project: project
            })
          }
      })
      wx.getStorage({
        key: 'username',
        success: (res)=> {
          // console.log(res.data)
          this.setData({
            username: res.data
          })
        }
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