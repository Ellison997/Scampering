const request = require('./../common/request')
const qs = require('qs')


let get = function(page, limit) {
    return request({
        url: 'https://api.ibooc.cn/random',
        method: 'get'
    })
}


module.exports = {get }