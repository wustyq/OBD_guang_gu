//index.js
//获取应用实例
const app = getApp()

Page({
  data:{
    keyword: '',
    msg: [],
    quyu:'',
    flag: true,  //false
    Page: 1,
    Pagesize: 4,
    hasmore: true
  },

  change: function(e){
    // console.log(e.detail.value)
    this.setData({
      keyword: e.detail.value,
    })
  },

  sou: function(){
     this.data.Page = 1
     this.setData({
       Page: this.data.Page,
       hasmore: true,
       msg: []
     })
     if(this.data.keyword.length < 3){
       wx.showToast({
         title: '请至少输入3个字符',
         icon: 'none',
         duration: 3000
       })
       return
     }
      wx.request({
        url: app.globalData.domain+'/admin/yuanchengxiaochengxu/zhongduan.ds',
      data: {
        keyword: this.data.keyword,
        quyu: this.data.quyu,
        page: this.data.Page,
        pagesize: this.data.Pagesize
        },
        header: {
           'content-type': 'application/json' // 默认值
        },
        method: 'POST',
        success: (res)=> {
          // console.log(res.data.length)
          if(res.data.length == 0){
            wx.showToast({
              title: '您查询的结果为空',
              icon: 'none',
              duration: 3000
            })
            return
          }
          this.setData({
            msg: res.data
          })
          // console.log(this.data.msg)
        }
      })
  },
  xiugai: function(e){
    //  console.log(e.target.dataset.id)
    //存id
    wx.setStorage({
      key:"_id",
      data: e.target.dataset.id
    })
    wx.navigateTo({
      url: '../upobd/upobd?quyu='+this.data.quyu,
    })
  },
  addobd: function(){
    wx.navigateTo({
      url: '../addobd/addobd?quyu='+this.data.quyu,
    })
  },
  shouye: function(){
    wx.redirectTo({
      url: '../index/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   //获取区域
    wx.getStorage({
      key: 'quyu',
      success: (res)=> {
        console.log(res.data.split(","))
        this.setData({
          quyu: res.data
        })
      }
    })

     //刚新增imei获取
     wx.getStorage({
      key: 'addimei',
      success: (res)=> {
        // console.log(res.data)
        this.setData({
          keyword: res.data,
          msg: []
        })
        // console.log(this.data.keyword)
        wx.request({
          url: app.globalData.domain+'/admin/yuanchengxiaochengxu/zhongduan.ds',
        data: {
          keyword: res.data,
          quyu: this.data.quyu,
          page: 1,
          pagesize: 4
          },
          header: {
             'content-type': 'application/json' // 默认值
          },
          method: 'POST',
          success: (res)=> {
            // console.log(res.data)
            this.setData({
              msg: res.data
            })
            // console.log(this.data.msg)
          }
        })
      }
    })
    //刚修改imei获取
    wx.getStorage({
      key: 'upimei',
      success: (res)=> {
        // console.log(res.data)
        this.setData({
          keyword: res.data,
          msg: []
        })
        wx.request({
          url: app.globalData.domain+'/admin/yuanchengxiaochengxu/zhongduan.ds',
        data: {
          keyword: res.data,
          quyu: this.data.quyu,
          page: 1,
          pagesize: 4
          },
          header: {
             'content-type': 'application/json' // 默认值
          },
          method: 'POST',
          success: (res)=> {
            // console.log(res.data)
            this.setData({
              msg: res.data
            })
            // console.log(this.data.msg)
          }
        })
      }
    })
    
   //获取flag值
  //  wx.getStorage({
  //   key: 'biaozhi',
  //   success: (res)=> {
  //     // console.log(res.data)
  //     this.setData({
  //       flag: res.data
  //     })
  //   }
  // })
  // wx.getStorage({
  //   key: 'upbiaozhi',
  //   success: (res)=> {
  //     // console.log(res.data)
  //     this.setData({
  //       flag: res.data
  //     })
  //   }
  // })
  // wx.getStorage({
  //   key: 'logbiaozhi',
  //   success: (res)=> {
  //     // console.log(res.data)
  //     this.setData({
  //       flag: res.data
  //     })
  //   }
  // })

     //从本地中移除指定key
     wx.removeStorage({
      key: 'addimei',
      success (res) {
        // console.log(res)
      }
    })
    wx.removeStorage({
      key: 'upimei',
      success (res) {
        // console.log(res)
      }
    })
    wx.removeStorage({
      key: 'biaozhi',
      success (res) {
        // console.log(res)
      }
    })
    wx.removeStorage({
      key: 'upbiaozhi',
      success (res) {
        // console.log(res)
      }
    })
    wx.removeStorage({
      key: 'logbiaozhi',
      success (res) {
        // console.log(res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideHomeButton({
      success: (res) => {},
    })
  },

    /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // console.log("我离开了")
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
    if(!this.data.hasmore) return

    this.data.Page = this.data.Page + 1
    // console.log(this.data.Page)
    this.setData({
      Page: this.data.Page
    })
    wx.request({
      url: app.globalData.domain+'/admin/yuanchengxiaochengxu/zhongduan.ds',
    data: {
      keyword: this.data.keyword,
      quyu: this.data.quyu,
      page: this.data.Page,
      pagesize: this.data.Pagesize,
      },
      header: {
         'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success: (res)=> {
        var hasmore = (res.data.length != 0)
        console.log(hasmore)
        var msg = this.data.msg.concat (res.data)
        this.setData({
          msg: msg,
          hasmore: hasmore
        })
        // console.log(this.data.msg)
      }
    })
  },
})

