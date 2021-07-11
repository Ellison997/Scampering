//app.js
var config = require('./config')
var util = require('./utils/util.js')
import storeManager from './store/storeManager'
import todoStore from './store/todoStore'
import noteStore from './store/noteStore'

App({
    onLaunch: function() {

        storeManager.read();

        // 监听网络状态
        wx.onNetworkStatusChange(function(res) {
            console.log('当前网络状态')
            let { isConnected, networkType } = res;
            if (networkType == 'none' || networkType == 'unknown') {
                // 没网从本地存储读取数据

            } else {
                let todos = todoStore.getTodos();
                let notes = noteStore.getNotes();
                let user = wx.getStorageSync('user');
                for (const todo of todos) {
                    todo.userId = user.userId
                }
                for (const note of notes) {
                    note.userId = user.userId
                }
                util.requestPromise({
                    url: config.service.host + '/wtodo/sync',
                    method: "POST",
                    data: todos
                }).then(res => {
                    console.log(res)
                }).catch(err => {
                    console.log(err)
                })

                util.requestPromise({
                        url: config.service.host + '/wnote/sync',
                        method: "POST",
                        data: notes
                    }).then(res => {
                        console.log(res)
                    }).catch(err => {
                        console.log(err)
                    })
                    // 将数据发送到服务端
                    // 服务端返回更新的数据ID 字符串

                // 删除今天之前的数据

            }
        })

        // 获取网络类型
        wx.getNetworkType({
            success(res) {
                console.log('网络接口调用成功', res);
                const networkType = res.networkType
                if (networkType == 'none' || networkType == 'unknown') {
                    // 没网从本地存储读取数据

                } else {
                    // 将数据发送到服务端
                    // 服务端返回更新的数据ID 字符串

                    // 删除今天之前的数据

                }
            },
            fail(err) {
                console.log('网络接口调用失败', res);
            }
        })



        let _this = this;
        // 判断session 是否过期
        wx.checkSession({
            success: () => {
                if (!wx.getStorageSync("sKey")) {
                    _this.login();
                }
            },
            fail: () => {
                _this.login();
            }
        });

        // 查看是否授权
        wx.getSetting({
            success(res) {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                    wx.getUserInfo({
                        success(res) {
                            console.log(res.userInfo)
                            util.requestPromise({
                                url: config.service.host + '/wuser/getUserInfo',
                                method: "POST",
                                data: res.userInfo
                            }).then(res => {
                                wx.setStorageSync("user", res.data);
                            }).catch(err => {
                                console.log(err)
                            })
                        }
                    })
                } else {
                    wx.authorize({
                        scope: 'scope.userInfo',
                        success() {
                            // 用户已经同意小程序使用获取用户信息功能，后续调用 wx.getUserInfo 接口不会弹窗询问
                            let e = wx.getUserInfo()
                            console.log(e)
                            util.showBusy('正在登录')
                            util.requestPromise({
                                url: config.service.host + '/wuser/getUserInfo',
                                method: "POST",
                                data: e.detail.userInfo
                            }).then(res => {
                                wx.setStorageSync("user", res.data);

                                util.showSuccess("登录成功");
                            })
                        }
                    })
                }
            }
        })

    },


    login() {
        wx.login({
            success: res => {
                util.requestPromise({
                    url: config.service.loginUrl,
                    method: "GET",
                    data: {
                        code: res.code
                    },
                }).then(res => {
                    var token = res.data.access_token;
                    console.log("将token存储到Storage...")
                    wx.setStorageSync("token", token);
                }).catch(err => {
                    console.log(err)
                })
            }
        });
    }
})