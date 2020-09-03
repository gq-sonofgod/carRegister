const app = getApp();
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,

  },
  onLoad: function (options) {
    const db = wx.cloud.database();
    var that = this
    db.collection('caruser').orderBy('uploaddate', 'desc').get({
      success: function(res) {
        that.setData({
          log: res.data,
        })
      },
      fail: function(event) { console.log("获取失败")}
    })
   },

  
});
