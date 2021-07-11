//index.js
var config = require('../../config')
var util = require('../../utils/util.js')


import todoStore from '../../store/todoStore'
import noteStore from '../../store/noteStore'
import * as echarts from '../..//components/ec-canvas/echarts';



function initChart(canvas, width, height, dpr) {
    const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
    });
    canvas.setChart(chart);

    var option = {
        color: ["#37A2DA", "#67E0E3", "#9FE6B8"],
        legend: {
            data: ['已完成', '未完成'],
            top: 50,
            left: 'center',
            backgroundColor: 'red',
            z: 100
        },
        grid: {
            containLabel: true
        },
        tooltip: {
            show: true,
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            // show: false
        },
        yAxis: {
            x: 'center',
            type: 'value',
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            }
            // show: false
        },
        series: [{
            name: '已完成',
            type: 'line',
            smooth: true,
            data: [18, 36, 65, 30, 78, 40, 33]
        }, {
            name: '未完成',
            type: 'line',
            smooth: true,
            data: [12, 50, 51, 35, 70, 30, 20]
        }]
    };

    chart.setOption(option);
    return chart;
}


Page({
    data: {
        imgUrl: {},
        userInfo: {},
        logged: false,
        takeSession: false,
        requestResult: '',
        todosCount: 0,
        todosUncompletedCount: 0,
        todosCompletedCount: 0,
        notesCount: 0,
        ecA: {
            onInit: initChart
        }
    },

    onShow() {
        let _this = this;
        let user = wx.getStorageSync('user');
        if (user != '') {
            _this.setData({
                logged: true,
                userInfo: user
            })
        };
        this.syncData()
    },

    // 用户授权登录
    doLogin: function(e) {
        let _this = this
        console.log(e)
        util.showBusy('正在登录')
        util.requestPromise({
            url: config.service.host + '/wuser/getUserInfo',
            method: "POST",
            data: e.detail.userInfo
        }).then(res => {
            wx.setStorageSync("user", res.data);
            _this.setData({
                logged: true,
                userInfo: res.data
            })
            util.showSuccess("登录成功");
        })

    },

    onLoad: function(options) {
        var _this = this;
        // 获取系统消息
        try {
            var res = wx.getSystemInfoSync();
            this.data.windowWidth = res.windowWidth;
        } catch (e) {
            console.error('err: getSystemInfoSync failed!');
        }

        // update
        this.update()
    },

    onReady() {

    },



    toInfo: function() {
        wx.navigateTo({
            url: '../info-manage/info-manage',
        })
    },
    toProduct: function() {
        wx.navigateTo({
            url: '../product/product',
        })
    },

    syncData() {
        // 获取清单笔记信息
        this.data.todosCount = todoStore.getTodos().length
        this.data.todosCompletedCount = todoStore.getCompletedTodos().length
        this.data.todosUncompletedCount = todoStore.getUncompletedTodos().length
        this.data.notesCount = noteStore.getNotes().length

        // update
        this.update()
    },

    update(data) {
        data = data || this.data
        this.setData(data)
    },


    linkToTodos() {
        wx.switchTab({
            url: '../todo/index'
        })
    },

    linkToNotes() {
        wx.switchTab({
            url: '../note/index'
        })
    }
})