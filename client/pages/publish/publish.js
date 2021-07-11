// pages/publish/publish.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentTab:0,
        // 选中未选中
        s_supply: true,
        s_purchase: false,
        array: [
            { src: 'https://resource01.ulifestyle.com.hk/res/v3/image/content/2015000/2015551/20180222_flower_02_1024.jpg', name: '小叶黄杨', qiye: '泰安吉祥苗圃', address: '山东 青州', vip: '[VIP][企业]', price: '2.5/棵', time: '2分钟前' },
            { src: 'https://resource01.ulifestyle.com.hk/res/v3/image/content/2015000/2015551/20180222_flower_02_1024.jpg', name: '小叶黄杨', qiye: '泰安吉祥苗圃', address: '山东 青州', vip: '[VIP][企业]', price: '2.5/棵', time: '2分钟前' },
            { src: 'https://resource01.ulifestyle.com.hk/res/v3/image/content/2015000/2015551/20180222_flower_02_1024.jpg', name: '小叶黄杨', qiye: '泰安吉祥苗圃', address: '山东 青州', vip: '[VIP][企业]', price: '2.5/棵', time: '2分钟前' }
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let _this = this;
        _this.setScrollHight();
    },
    //滑动切换
    swiperTab: function (e) {
        this.setData({
            currentTab: e.detail.current
        });
    },
    goDetails:function(){
        wx.navigateTo({
            url: '../publish-details/publish-details',
        })
    },
    //点击切换
    clickTab: function (e) {
        var _this = this;
        if (_this.data.currentTab === e.currentTarget.dataset.current) {
            return false;
        } else {
            _this.setData({
                currentTab: e.currentTarget.dataset.current
            })
        }
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

    bindRegionChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            region: e.detail.value
        })
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