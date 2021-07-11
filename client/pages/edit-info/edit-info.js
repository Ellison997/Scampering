let util = require('../../utils/util.js');
let config = require('../../config.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    com_img: "",
    com_info: "",
    com_name: "",
    detail_address: "",
    phone: "",
    real_name: "",

    figureArr: [], //形象图
    aptitudeArr: [], //资质
    aptState: true,
    coord: '',
    location_icon: './../../asset/icon/location.png',
    region: ['请选择', '请选择', '请选择']

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;
    util.requestPromise({
      url: `${config.service.host}/weapp/company/getCompany`,
      method: 'GET',
      data: {},
    }).then(res => {
      let res_data = res.data;
      _this.setData({
        figureArr: res_data.com_img.split(','),
        com_info: res_data.com_info,
        com_name: res_data.com_name,
        region: res_data.com_address.split(','),
        detail_address: res_data.detail_address,
        phone: res_data.phone,
        real_name: res_data.real_name
      })
    })
    _this.getCoord();
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

  //获取当前位置的经纬度
  getCoord: function() {
    let _this = this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function(res) {
        var latitude = res.latitude //维度
        var longitude = res.longitude //经度
        _this.setData({
          coord: {
            lat: latitude,
            lng: longitude
          }
        })
        console.log(_this.data.coord);
      }
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
  formSubmit: function(e) {
    let _this = this;
    const val = e.detail.value;
    let uploadFigureArr = [];
    let uploadOk = false;
    let tempFigure = _this.data.figureArr;
    console.log(tempFigure);
    if (tempFigure.length!=0 && tempFigure.toString().indexOf("tmp") == -1) {
      postreq();
    } else if (tempFigure.length != 0 && tempFigure.toString().indexOf("upload") > 0) {
      util.showModel("提示", "请先删除原有的形象图，重新上传！");
    } else {
      uploadreq();
    }

   let interval = setInterval(function() {
      if (uploadOk) {
        clearInterval(interval);
        postreq();
      }
    }, 500);

    function uploadreq() {
      _this.data.figureArr.forEach(function(item) {
        wx.uploadFile({
          url: config.service.uploadUrl,
          filePath: item,
          name: 'file',
          success: function(res) {
            res = JSON.parse(res.data)
            uploadFigureArr.push(res.data.imgUrl);
            if (uploadFigureArr.length == _this.data.figureArr.length) {
              uploadOk = true;
              _this.setData({
                figureArr: uploadFigureArr
              })
            }

          },
          fail: function(e) {
            util.showModel('上传形象图失败！')
            error = true;
          }
        })
      })
    }

    function postreq() {
      // 上传表单
      util.requestPromise({
        url: `${config.service.host}/weapp/company/updateCompany`,
        method: 'POST',
        data: {
          real_name: val.real_name,
          com_name: val.com_name,
          com_info: val.com_info,
          com_coord: _this.data.coord,
          com_address: _this.data.region.toString(),
          detail_address: val.detail_address,
          phone: val.phone,
          com_img: _this.data.figureArr.toString(),
          bt_id: val.bt_name,
        },
      }).then(res => {
        util.showSuccess('修改成功')
        setTimeout(function () {
          wx.navigateTo({
            url: "../info-manage/info-manage"
          });
        }, 600)
      }).catch(err => {
        util.showModel("修改失败")
      })
    }


  },

  // 认证资质信息
  uploadApt() {
    let _this = this;
    let error = false;
    let tempAptitudeArr = [];
    _this.data.aptitudeArr.forEach(function(item) {
      wx.uploadFile({
        url: config.service.uploadUrl,
        filePath: item,
        name: 'file',
        success: function(res) {
          res = JSON.parse(res.data)
          tempAptitudeArr.push(res.data.imgUrl);
          console.log(tempAptitudeArr)

        },
        fail: function(e) {
          util.showModel('上传资质信息失败！')
          error = true;
        }
      })
    })
    if (error == false) {
      util.showSuccess('上传资质信息成功!')
      _this.setData({
        aptState: false
      })

    }

  },

  // 删除资质图片
  delectAptImg: function(e) {
    console.log(e);
    let aptitudeArr = this.data.aptitudeArr;
    aptitudeArr.splice(e.currentTarget.dataset.id, 1);
    this.setData({
      aptitudeArr: aptitudeArr
    })
    console.log(aptitudeArr)
  },
  //添加资质图片
  uploadAptImg: function() {
    var _this = this;
    let aptitudeArr = _this.data.aptitudeArr;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths[0];
        console.log(tempFilePaths)
        aptitudeArr.push(tempFilePaths);
        _this.setData({
          aptitudeArr: aptitudeArr
        })
      }
    })
  },
  // 添加形象图片
  uploadFigImg: function() {
    var _this = this;
    let figureArr = _this.data.figureArr;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths[0];
        console.log(tempFilePaths)
        aptitudeArr.push(tempFilePaths);
        _this.setData({
          figureArr: figureArr
        })
      }
    })
  },
  // 删除形象图片
  delectFigImg: function(e) {
    console.log(e);
    let figureArr = this.data.figureArr;
    figureArr.splice(e.currentTarget.dataset.id, 1);
    this.setData({
      figureArr: figureArr
    })
    console.log(figureArr)
  },

  //添加形象图片
  uploadFigImg: function() {
    var _this = this;
    let figureArr = _this.data.figureArr;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths[0];
        console.log(tempFilePaths)
        figureArr.push(tempFilePaths);
        _this.setData({
          figureArr: figureArr
        })
      }
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
  },
})