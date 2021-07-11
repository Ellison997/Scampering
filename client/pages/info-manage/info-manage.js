let util = require('../../utils/util.js');
let config = require('../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    com_img: [],
    com_info: "",
    com_name: "",
    detail_address: "",
    phone: "",
    real_name: "",
    indicatorDots: true, // 指式点  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this=this;
    util.requestPromise({
      url: `${config.service.host}/weapp/company/getCompany`,
      method: 'GET',
      data: {}
    }).then(res => {
      let res_data = res.data;
      _this.setData({
        com_img: res_data.com_img.split(','),
        com_info: res_data.com_info,
        com_name: res_data.com_name,
        detail_address: res_data.com_address.toString().replace(new RegExp(',', 'g'), ' ') + ' ' + res_data.detail_address,
        phone: res_data.phone,
        real_name: res_data.real_name
      })
    }).catch(err => {
      console.log(err)
    })
  },

  // 跳转到企业编辑
  goEdit: function (e) {
    wx.navigateTo({
      url: "../edit-info/edit-info"
    });
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
  onUnload: function () {
    wx.navigateBack({
      delta: 2
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },
  bindRegionChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },


  bindTextAreaBlur: function(e) {

  },

  upper: function(e) {
    console.log(e)
  },
  lower: function(e) {
    console.log(e)
  },
  scroll: function(e) {
    console.log(e)
  },
})