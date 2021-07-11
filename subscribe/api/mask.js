const request = require('./../common/request')
const qs = require('qs')

let appointment = function(a) {
    return request({
        url: 'https://mss.iconntech.com:9443/mask-appointment-service/appointment/appointment',
        method: 'post',
        data: a
    })
}

let sendVerifyCode = function(mobileNo,verifyCode) {
    console.log('验证码手机号：',mobileNo)
    return request({
        url: 'https://mss.iconntech.com:9443/mask-appointment-service/appointment/sendVerifyCode',
        method: 'post',
        data: {
            mobileNo,
            verifyCode
        }
    })
}


let getMaskSum = function() {
    return request({
        url: 'https://mss.iconntech.com:9443/mask-appointment-service/query/getMaskSum',
        method: 'get',
        params: {
            random:Math.random()
        }
    })
}


module.exports = {appointment, sendVerifyCode, getMaskSum }