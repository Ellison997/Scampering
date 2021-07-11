const request = require('./../common/request')
const qs = require('qs')

// let address='http://xtroms.com:2020'
let address = ''


let addStaff = function (data) {
    return request({
        url: address + '/mpsq/add',
        method: 'post',
        data
    })
}



module.exports = {addStaff}