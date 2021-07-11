const request = require('./../common/request')
const qs = require('qs')

let address='http://localhost:8080'
// let address=''

let appointment = function(a) {
    return request({
        url: address+'/mask/appointment',
        method: 'post',
        data: a
    })
}

let sendVerifyCode = function(mobileNo,verifyCode) {
    return request({
        url: address+'/mask/sendVerifyCode',
        method: 'post',
        data: {
            mobileNo,
            verifyCode
        }
    })
}


let getMaskSum = function() {
    return request({
        url: address+'/mask/sum',
        method: 'get'
    })
}


module.exports = {appointment, sendVerifyCode, getMaskSum }