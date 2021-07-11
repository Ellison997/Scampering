import {
  formatTime
} from '../../utils/util.js';

Page({

  data: {
    leastDays: 3,
    currentTab: 0,
    state: 0,
    scrollHight: 200,

    array: [{
      name: "227市场",
      detail: '定价依据客户判定',
      time: '16:21',
      role: 1
    },
    {
      name: "新软件",
      detail: '成立体验小组，测试软件',
      time: '13:34',
      role: 2
    },
    {
      name: "2-3-6手提项目",
      detail: '236手提灭火器项目，10月需要提交给需求方',
      time: '16:21',
      role: 1
    },
    {
      name: "消防资格考试",
      detail: '考试纲要 考试时间 考试地点',
      time: '16:21',
      role: 2
    },
    {
      name: "总裁办新招",
      detail: '新招人',
      time: '16:21',
      role: 1
    }
    ]
  },
  onLoad: function () {
    let that = this;
    that.setScrollHight();
  },

  // 点击某一天
  onCalendarChange: function (e) {
    const startDate = new Date(e.detail.days[0]);

    console.log(`选中 ${formatTime(startDate)},共 ${e.detail.count} 天`);
  },

  // 状态切换
  onStateChange: function (e) {
    let that = this;
    that.setScrollHight();
    console.log(e.detail.state);

  },


  //点击切换
  clickTab: function (e) {
    var that = this;
    if (that.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current
      })
    }
  },
  // 动态计算高度
  setScrollHight: function () {
    let that = this;
    //search-view高度计算
    let conTop = wx.createSelectorQuery();
    conTop.select('.top-view').boundingClientRect()
    conTop.exec(function (res) {
      console.log("top-view高度：", res);
      that.setData({
        conTopHeith: res[0].height
      }),
        wx.getSystemInfo({
          success: function (res) {
            console.log("窗口", res);
            that.setData({
              scrollHight: (res.windowHeight - that.data.conTopHeith)
            })
            console.log(that.data.scrollHight);
          },
        })

    })
  },
  onShareAppMessage: function (options) {
    return {
      title: '日程安排',
      desc: '面试试题',
      path: 'pages/index/index',
      success: function (res) {
        util.showToast(1, '分享成功');
      },

      fail: function () {
        util.showToast(0, '分享失败...');
      }
    }
  },



})