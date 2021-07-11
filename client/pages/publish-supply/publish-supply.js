// pages/publish-supply/publish-supply.js
// 引入SDK核心类
let MapWX = require('./../../utils/qqmap-wx-jssdk.js');
let util = require('../../utils/util.js');
let config = require('../../config')
let mapsdk;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    states: ['在售', '已售', '失效'],
    index: 0,
    date: '2018-09-09',
    nowlocation: '',
    coord:'',
    location_icon: './../../asset/icon/location.png',
    imgUrl: '',
    imgUrls: [],
    coverImgUrl: '',
    isPublish:false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    /*判断是第一次加载还是从position页面返回,如果从position页面返回，会传递用户选择的地点*/
    if (options.address != null && options.address != '') {
      //设置变量 address 的值
      this.setData({
        nowlocation: options.address
      });
    } else {
      // 实例化API核心类
      mapsdk = new MapWX({
        key: 'VXKBZ-IEWKU-NPXVO-BXDKV-67BOS-HWBFD'
      });

      var _this = this;
      // 调用接口
      mapsdk.reverseGeocoder({
        success: function(res) {
          console.log(res);
          _this.setData({
            nowlocation: res.result.address,
            coord: res.result.location
          });
        },
        fail: function(res) {
        },
        complete: function(res) {
        }
      });
    }
  },

  onChangeAddress: function(e) {
    wx.navigateTo({
      url: "/pages/position/position"
    });
  },

  // 添加供应信息图片
  uploadImg: function () {
    var _this = this;
    let imgUrls = _this.data.imgUrls;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths[0];
        imgUrls.push(tempFilePaths);
        _this.setData({
          imgUrls: imgUrls
        })
      }
    })
  },
  // 添加封面图片
  uploadCoverImg: function () {
    var _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        _this.setData({
          coverImgUrl: res.tempFilePaths[0]
        })
      }
    })
  },
  // 删除供应信息图片
  delectImg: function (e) {
    console.log(e);
    let imgUrls = this.data.imgUrls;
    imgUrls.splice(e.currentTarget.dataset.id, 1);
    this.setData({
      imgUrls: imgUrls
    })
    console.log(imgUrls)
  },
  // 删除供应信息封面
  delectCoverImg: function (e) {
    this.setData({
      coverImgUrl: ''
    })
  },

  // 上传图片
  toUploadImg:function(){
    // 上传图片
    let _this=this;
    _this.data.
    wx.uploadFile({
      url: config.service.uploadUrl,
      filePath: filePath,
      name: 'file',
      success: function (res) {
       
      },
      fail: function (e) {
        util.showModel('上传图片失败')
      }
    })
  },

  // 修改状态
  bindStatesChange: function (e) {
    let _this = this;
    console.log(e.detail.value);
    _this.setData({
      index: e.detail.value
    })
    console.log(_this.data.index);
  },
  // 修改截至日期
  bindDateChange: function(e) {
    let _this = this;
    console.log(e.detail.value);
    _this.setData({
      date: e.detail.value
    })
    console.log(_this.data.date);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * publishSubmit 提交供应信息
   */
  publishSubmit:function(e){
    let _this=this;
    console.log("提交还是保存：",_this.data.isPublish);
    const val = e.detail.value
    util.requestPromise({
      url: `${config.service.host}/weapp/supply/addSupply`,
      method: 'POST',
      data: {
        name: val.name,
        standard: val.standard,
        number: val.number,
        state: val.state,
        cover_img: _this.data.coverImgUrl,
        imgs: _this.data.imgUrls.toString(),
        end_time: val.end_time,
        detail_address: _this.data.nowlocation,
        coord: _this.data.coord,
        details: val.details,
        is_supply: _this.data.isPublish
      }
    }).then(res => {
        console.log(res);
    })
   
  },

  // 清除表单
  formReset:function(e){
    let _this = this;
    _this.setData({
      imgUrls: [],
      coverImgUrl: '',
    })
  },


  // 保存供应信息
  save: function () {
    let _this=this;
    _this.setData({
      isPublish:false
    })
  },

  // 提交供应信息
  publish:function(){
    let _this = this;
    _this.setData({
      isPublish: true
    })
  },
  
  // 取消
  cancel: function () {

  }
})