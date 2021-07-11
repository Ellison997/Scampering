var QQMapWX = require('./../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
  data: {
    latitude: 0, //地图初次加载时的纬度坐标
    longitude: 0, //地图初次加载时的经度坐标
    name: "" //选择的位置名称
  },
  onLoad: function() {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'VXKBZ-IEWKU-NPXVO-BXDKV-67BOS-HWBFD'
    });

    this.moveToLocation();
  },
  //移动选点
  moveToLocation: function() {
    var _this = this;
    wx.chooseLocation({
      success: function(res) {
        console.log(res.name);
        //选择地点之后返回到原来页面
        wx.navigateTo({
          url: "/pages/publish-supply/publish-supply?address=" + res.name
        });
      },
      fail: function(err) {
        wx.navigateTo({
          url: "/pages/publish-supply/publish-supply"
        });
      }
    });
  }
});