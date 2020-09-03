// miniprogram/pages/te/re.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carlist:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
this.getData()
  },
  getData: function() {
    const db = wx.cloud.database();
      var that = this
    db.collection('carlist').get({
        success: function(res) {
          that.setData({
            carlist: res.data,
          })
          wx.hideNavigationBarLoading(); //隐藏加载
          wx.stopPullDownRefresh();
  
        },
        fail: function(event) {
          wx.hideNavigationBarLoading(); //隐藏加载
          wx.stopPullDownRefresh();
        }
      })
  
  },
  navigate:function(e){
    var state=e.currentTarget.dataset.state
    var carname=e.currentTarget.dataset.carname
    if(!state){
      wx.navigateTo({
        url: "../../cardetail?carname=" + carname
       })
    }
    else{
      wx.navigateTo({
        url: "../../contribute/contribute?carname=" + carname
       })
    }
    console.log(state)
  },
  history:function(){
    wx.navigateTo({
    url: "../pages/history/history"
   })
  },

    //更新本页面
    go_update(){
      this.getData()
      console.log('我更新啦')
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