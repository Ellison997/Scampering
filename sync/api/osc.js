const request = require('./../common/request')
const qs = require('qs')


let get = function(page, limit) {
    return request({
        url: '/user/userList',
        method: 'get',
        params: {
            page,
            limit
        }
    })
}

let post = function(id, userName, state) {
    return request({
        url: '/user/stateChange',
        method: 'post',
        data: qs.stringify({
            id,
            userName,
            state
        })
    })
}


let demo = function() {
    return request({
        url: 'https://aiylqy.com/category/%E5%89%8D%E7%AB%AF/7/',
        method: 'get'
    })
}


module.exports = {get, post, demo }