// miniprogram/pages/advance/advance.js
var that
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    name: "",
    phonenumber: '',
    address: '',
    group: '',
    witness: '',
    tag1:"",
    user: {},
    images: [],
    picker: ['婚姻家庭', '工作事业', '医治释放', '物质层面', '财富加添', '灵性生命', '重生改变', '祷告成就', '关系修复', '生命成长', '其他'],
    imgList: [],
  },
  PickerChange(e) {
    console.log(e);
    this.setData({
      tag1: e.detail.value
    })
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '召唤师',
      content: '确定要删除这段回忆吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
/**
   * 选择图片
   */
  ChooseImage: function(event) {
    wx.chooseImage({
      count: 2,
      sizeType:["compressed","original"],
      // sourceType:["album","camera"],
      success: function(res) {
        // 设置图片
        that.setData({
          imgList: res.tempFilePaths,
        })
        that.data.imgList = []
        console.log(res.tempFilePaths)
        for (var i in res.tempFilePaths) {
          // 将图片上传至云存储空间
          wx.cloud.uploadFile({
            // 指定要上传的文件的小程序临时文件路径
            cloudPath: 'test/' + that.timetostr(new Date()),
           
            filePath: res.tempFilePaths[i],
            // 成功回调
            success: res => {
              that.data.imgList.push(res.fileID)
              console.log(res.fileID)
            },
          })
        }
      },
    })
  },
  /**
   * 图片路径格式化
   */
  timetostr(time){
    var randnum = Math.floor(Math.random() * (9999 - 1000)) + 1000;
    var str = randnum +"_"+ time.getMilliseconds() + ".png";
    return str;
  },
  //弹出提示
  alert:function(t){
    wx.showModal({
        title:"系统提示",
        content:t,
        showCancel: false,
        confirmColor: '#000'
    });
  
  },
  textareaAInput(e) {
    this.setData({
      reason: e.detail.value
    })
  },
  /**
   * 提交
   */
  formSubmit: function (e) {
    this.data.name = e.detail.value.name;
    this.data.phonenumber = e.detail.value.phonenumber;
    this.data.starttime = e.detail.value.starttime;
    this.data.startmile = e.detail.value.startmile;//获取填写数据   
    this.data.endtime = e.detail.value.endtime;
    this.data.endmile = e.detail.value.endmile;//获取填写数据 

    if (this.data.canIUse) {
      if (this.data.name == null|| this.data.name.length <= 0) {
        this.alert('请输入姓名')
      } 
      else if (this.data.phonenumber == null|| this.data.phonenumber.length <= 0) {
        this.alert('请输入电话')
      } 
      else if(!/^1[3|5|6|8|7]\d{9}$/.test(this.data.phonenumber)){
        this.alert('手机号码格式不正确');
        return
      }
      else {
        this.saveDataToServer()
        this.dateCar()
        wx.showToast({title: '提交成功~',})
        
      }

    } else {
      this.jugdeUserLogin();
    }
  },
  
  /**
   * 保存到user集合中
   */
  dateFormat: function (date) { //author: meizz   

    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hour = date.getHours()
    var minutes = date.getMinutes()
    var seconds = date.getSeconds()
    var realMonth = month > 9 ? month : "0" + month
    return year + "-" + realMonth + "-" + day + " " + hour + ":" + minutes + ":" + seconds

  },

  saveDataToServer: function (event) {
    var uploaddate = this.dateFormat(new Date())
    db.collection('caruser').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        uploaddate:uploaddate,
        name:this.data.name,
        phonenumber:this.data.phonenumber,
        starttime:this.data.starttime,
        startmile:this.data.startmile,
        endtime:this.data.endtime,
        endmile:this.data.endmile,
        car:this.data.carname,
        reason:this.data.reason
      },
      success: function(res) {
        console.log("保存成功")
      },
      fail: function(res) {
        console.log("保存失败")
      }
    })
  },

  dateCar(){

    wx.cloud.callFunction({
      name: 'dateCar',
      data: {
        carname: this.data.carname,
      }
    }).then(res => {
      console.log("updata成功")
      wx.redirectTo({
        url: '../home',
      })
    })
  }, 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var carname=options.carname
    this.setData({
      carname:carname
    })
    that = this
    this.jugdeUserLogin();
    
  },

  /**
   * 判断用户是否登录
   */
  jugdeUserLogin: function (event) {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {

              that.data.user = res.userInfo;
              console.log(that.data.user)
            }
          })
        }
      }
    })
  },
})
