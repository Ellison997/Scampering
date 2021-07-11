// pages/supply/supply.js
let WxSearch = require('./../wxSearchView/wxSearchView.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSearch:false,
    region: ['请选择', '请选择', '请选择'],
    customItem: '全部'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var _this = this;
    _this.setScrollHight();
    WxSearch.init(
      _this,  // 本页面一个引用
      ['草木', '花卉', "盆景", "兰花", '黄杨', '玫瑰'], // 热点搜索推荐，[]表示不使用
      ['月季', '牡丹', '盆莲', "毛桃"],// 搜索匹配，[]表示不使用
      _this.mySearchFunction, // 提供一个搜索回调函数
      _this.myGobackFunction //提供一个返回回调函数
    );
  },

  // 转发函数,固定部分
  wxSearchInput: WxSearch.wxSearchInput,  // 输入变化时的操作
  wxSearchKeyTap: WxSearch.wxSearchKeyTap,  // 点击提示或者关键字、历史记录时的操作
  wxSearchDeleteAll: WxSearch.wxSearchDeleteAll, // 删除所有的历史记录
  wxSearchConfirm: WxSearch.wxSearchConfirm,  // 搜索函数
  wxSearchClear: WxSearch.wxSearchClear,  // 清空函数

  // 搜索回调函数  
  mySearchFunction: function (value) {
    // do your job here
    // 跳转
    wx.redirectTo({
      url: '../index/index?searchValue=' + value
    })
  },

  // 返回回调函数
  myGobackFunction: function () {
    // do your job here
    // 跳转
    wx.redirectTo({
      url: '../index/index?searchValue=返回'
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

  // 跳转到物品详情
  goDetails: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../publish-details/publish-details?id=' + id,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  // 搜索入口  
  searchTab: function () {
    let _this=this;
    _this.setData({
      showSearch:true
    })
    // wx.redirectTo({
    //   url: '../search/search'
    // })
  },
  // 关闭搜索
  closeSearch:function(){
    let _this = this;
    _this.setData({
      showSearch: false
    })
  },
  // 动态计算高度
  setScrollHight: function () {
    let _this = this;
    //search-view高度计算
    let conTop = wx.createSelectorQuery();
    conTop.select('.con-top').boundingClientRect()
    conTop.exec(function (res) {
      console.log("conTop高度：", res);
      _this.setData({
        conTopHeith: res[0].height
      }),
        wx.getSystemInfo({
          success: function (res) {
            console.log("窗口", res);
            _this.setData({
              scrollHight: (res.windowHeight - _this.data.conTopHeith)
            })
            console.log(_this.data.scrollHight);
          },
        })

    })
  },

  upper: function (e) {
    console.log(e)
  },
  lower: function (e) {
    console.log(e)
  },
  scroll: function (e) {
    console.log(e)
  },
})