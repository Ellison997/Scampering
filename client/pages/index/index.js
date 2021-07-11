//index.js
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  data: {
    imgUrls: [
      'http://pic.yayabizhi.com:7704/uploads/130525/co130525121A3-10.jpg',
      'http://img.hanyouwang.com/news/20170303/1488519922533340.jpg',
      'https://img.travel.rakuten.co.jp/m17n/com/campaign/ranking/flower-festival/img/key.jpg'
    ],
    indicatorDots: true, // 指式点  
    circular: false,
    
    scrollHight: 0,
  },
  onLoad: function() {
    let _this=this;
    wx.showShareMenu({
      withShareTicket: true
    })
    _this.setScrollHight();
  },
  // 跳转到企业详情
  goDetails: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../enterprise-details/enterprise-details?id=' + id
    })
  },
  // 动态计算高度
  setScrollHight: function() {
    let _this = this;
    //search-view高度计算
    let conTop = wx.createSelectorQuery();
    conTop.select('.con-top').boundingClientRect()
    conTop.exec(function(res) {
      console.log("conTop高度：", res);
      _this.setData({
          conTopHeith: res[0].height
        }),
        wx.getSystemInfo({
          success: function(res) {
            console.log("窗口", res);
            _this.setData({
              scrollHight: (res.windowHeight - _this.data.conTopHeith)
            })
            console.log(_this.data.scrollHight);
          },
        })

    })
  },

  upper: function(e) {
    console.log(e)
  },
  lower: function(e) {
    console.log(e)
  },
  scroll: function(e) {
    console.log(e)
  }

})