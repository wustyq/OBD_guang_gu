// pages/person/person.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      username:'',
      password:'',
      psd:'',
      phone:'',
      email:'',
      token:'',
      kyf: true
  },
  cgusername: function(e){
    //  console.log(e.detail.value)
    this.setData({
      username: e.detail.value
    })
  },
  cgpassword: function(e){
    this.setData({
      password: e.detail.value
    })
  },
  cgpsd: function(e){
    this.setData({
      psd: e.detail.value
    })
  },
  cgphone: function(e){
    this.setData({
      phone: e.detail.value
    })
  },
  cgemail: function(e){
    this.setData({
      email: e.detail.value
    })
  },
  fanhui:function(){
     wx.redirectTo({
       url: '../index/index',
     })
  },
  tijiao: function(){
    //验证密码
    var password = this.data.password;
    var reg2 = /([a-zA-Z][0-9])|([0-9][a-zA-Z])/;
    var psd = this.data.psd;
    if(password == ''){
        wx.showToast({
          title: '请输入密码！',
          icon: 'none',
          duration: 2000
        })
        return false;
    }
    if(password.length < 8){
        wx.showToast({
          title: '您输入的密码太短啦！',
          icon: 'none',
          duration: 2000
        })
        return false;
    }
    if(!reg2.test(password)){
        wx.showToast({
          title: '英文和数字配合更安全哦！',
          icon: 'none',
          duration: 2000
        })
        return false;
    }
    if(psd != password){
        wx.showToast({
          title: '两次密码输入不一样，细心点呀！',
          icon: 'none',
          duration: 2000
        })
        return false;
    }
    //验证电话号码
    var phone = this.data.phone;
    var reg3 = /^[1-9][0-9]{10}$/;
    if(phone == ''){
        wx.showToast({
          title: '请输入手机号！',
          icon: 'none',
          duration: 2000
        })
        return false;
    }
    if(!reg3.test(phone)){
        wx.showToast({
          title: '手机号格式不对呀！',
          icon: 'none',
          duration: 2000
        })
        return false;
    }
    //验证邮箱
  //   var email = this.data.email;
  //   var reg = /[@]/;
  //   if(email == ''){
  //       wx.showToast({
  //         title: '请输入邮箱！',
  //         icon: 'none',
  //         duration: 2000
  //       })
  //       return false;
  //   }
  //   if(!reg.test(email)){
  //     wx.showToast({
  //       title: '邮箱格式不对呀！',
  //       icon: 'none',
  //       duration: 2000
  //     })
  //     return false;
  // }

  wx.request({
    url: app.globalData.domain+'/admin/yuanchengxiaochengxu/xiugai.ds',
    data: {
      username: this.data.username,
      password: this.data.password,
      token: this.data.token,
      phone: this.data.phone,
      email: this.data.email
      },
      header: {
      'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success: (res)=> {
        wx.showToast({
          title: res.data.data.message,
          icon: 'none',
          duration: 2000
        })
        wx.redirectTo({
          url: '../logs/logs'
        })
      }
  })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    wx.getStorage({
      key: 'username',
      success: (res)=> {
        // console.log(res.data)
        this.setData({
          username: res.data
        })
      }
    })
    wx.getStorage({
      key: 'password',
      success: (res)=> {
        this.setData({
          password: res.data,
          psd: res.data
        })
      }
    })
    wx.getStorage({
      key: 'token',
      success: (res)=> {
        this.setData({
          token:res.data
        })
      }
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if(this.data.password == '123456'){
      this.setData({
        kyf: false
      })
      wx.showToast({
        title: "您为初始密码，必须修改",
        icon: 'none',
        duration: 5000
      })
    }
    // console.log(this.data.username)
    wx.request({
      url: app.globalData.domain+'/admin/yuanchengxiaochengxu/user.ds',
      data: {
        yhm: this.data.username,
        mima: this.data.password
        },
        header: {
        'content-type': 'application/json' // 默认值
        },
        method: 'POST',
        success: (res)=> {
           console.log(res)
           this.setData({
             phone: res.data.rows[0]._value['手机号'],
             email: res.data.rows[0]._value['邮箱']
           })
        }, 
        })
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