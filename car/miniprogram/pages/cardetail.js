const app = getApp();
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    ColorList: app.globalData.ColorList,   
    log:[] 

  },
  onLoad: function (options) {
    var carname=options.carname
    this.setData({
      carname:carname
    })
    const db = wx.cloud.database();
    var that = this
    db.collection('caruser').where({car:carname}).orderBy('uploaddate', 'desc').get({
      success: function(res) {
        that.setData({
          log: res.data,
        })
      },
      fail: function(event) { console.log("获取失败")}
    })
   },

   cancelCar(){

    wx.cloud.callFunction({
      name: 'cancelCar',
      data: {
        carname: this.data.carname,
      }
    }).then(res => {
      console.log("updata成功")
      wx.redirectTo({
        url: 'home',
      })
    })
    
  }, 
  
});
