//logs.js
const app = getApp()
Page({
  data: {
    yhm: '',
    mima: '',
  },
  changeyhm: function(e){
    // console.log(e);
    this.setData({
      yhm: e.detail.value
    })
  },
  changemima: function(e){
    // console.log(e);
    this.setData({
      mima: e.detail.value
    })
  },
  denglu: function(){
    // console.log(this.data.flag)
    wx.request({
      url: app.globalData.domain+'/admin/yuanchengxiaochengxu/user.ds',
      data: {
        yhm: this.data.yhm,
        mima: this.data.mima
        },
        header: {
        'content-type': 'application/json' // 默认值
        },
        method: 'POST',
        success: (res)=> {
        //  console.log(res.data.rows[0]._value.token);
           if(res.data.count > 0){
             wx.request({
               url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=ptO27pa3dQ4ycrNkvP3LFbjP&client_secret=0YiZgEFUiwSE4LrGmqP6SvpGwXANRIMw',
               method: 'GET',
               header: {
                'Content-Type': 'text/json;charset=utf-8'
              },
               data: {
              },
               success(res){
                 console.log(res.data.access_token)
                 wx.setStorage({
                  key:"access_token",
                  data: res.data.access_token
                })
               }
             })
            //存取用户名，后面录入人和修改人和修改密码要用
            if(this.data.mima == '123456'){
              wx.setStorage({
                key:"username",
                data: this.data.yhm
              })
              wx.setStorage({
                key:"token",
                data: res.data.rows[0]._value.token
              })
              wx.setStorage({
                key:"password",
                data: this.data.mima
              })
              wx.redirectTo({
                url: "../person/person"
              })
            }else{
            wx.setStorage({
              key:"username",
              data: this.data.yhm
            })
            wx.setStorage({
              key:"token",
              data: res.data.rows[0]._value.token
            })
            wx.setStorage({
              key:"password",
              data: this.data.mima
            })
            wx.setStorage({
              key:"quyu",
              data: res.data.rows[0]._value['区域']
            })
        
            //改变flag
            wx.setStorage({
              key:"logbiaozhi",
              data: false
            })

              wx.redirectTo({
                     url: '../index/index',
              })
            }
           }else{
               wx.showModal({
                    title: '提示',
                    content: '不存在该用户',
            })
           }
        }, 
        }) 
  },
  onLoad: function () {
    
    },
  
})
