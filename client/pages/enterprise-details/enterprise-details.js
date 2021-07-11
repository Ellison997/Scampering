// client/pages/enterprise-details/enterprise-details.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 选中未选中
    s_supply: true,
    s_purchase: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 发布
  supply: function () {
    let _this = this;
    _this.setData({
      s_supply: true,
      s_purchase: false
    })
  },
  // 求购
  purchase: function () {
    let _this = this;
    _this.setData({
      s_supply: false,
      s_purchase: true
    })
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