const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  yiweima: function(){
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
            wx.request({
              url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token=24.275ad6de9f3378b97cabdc8a6aed1b03.2592000.1606126163.282335-22869937',
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
                  if(reg1.test(_res.data.words_result[index].words))
                     console.log(_res.data.words_result[index].words)
                }
                
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
  shangchuan:function (){
      // var that = this;
      //识别身份证
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
              console.log(ans.data)
              wx.showLoading({ title: '识别中' })
              wx.request({
                url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/vehicle_license?access_token=24.275ad6de9f3378b97cabdc8a6aed1b03.2592000.1606126163.282335-22869937',
                method: 'POST',
                header: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: {
                  image: ans.data
                },
                success(_res) {
                  wx.hideLoading();
                  console.log(_res)
                  
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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