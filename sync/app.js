let https = require('./common/https')

let osc = require('./api/osc')

// https().then(res => {
//     console.log('原生https请求成功！')
//     console.log(res)
// }).catch(err => {
//     console.log(err)
// })
let a = 0;
setInterval(function () {
    osc.demo().then(res => {
        console.log('axios模块请求成功！', a)
        a++
    }).catch(err => {
        console.log(err)
    })
    osc.demo().then(res => {
        console.log('axios模块请求成功！', a)
        a++
    }).catch(err => {
        console.log(err)
    })
    osc.demo().then(res => {
        console.log('axios模块请求成功！', a)
        a++
    }).catch(err => {
        console.log(err)
    })
}, 1)
