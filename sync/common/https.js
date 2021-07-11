/**
 * 实现对https 的promises 封装
 */


const httpsClient = require('https');

let https = function(resp) {
    return new Promise((resolve, reject) => {
        const options = {
            host: 'api.nasa.gov',
            port: 443,
            method: 'get',
            path: '/planetary/apod?api_key=DEMO_KEY'
        }

        let req = httpsClient.request(options)

        // 当服务器把请求体发回来的时候，或者说客户端接受到响应的时候
        req.on('response', (res) => {
            let result = []
            res.on('data', (data) => {
                result.push(data)
            })
            res.on('end', () => {
                let str = Buffer.concat(result)
                resolve(JSON.parse(str.toString()))
            })
            res.on('error', (err) => {
                reject(err)
            })
        })
        req.on('error', (err) => {
            reject(err)
        })

        //只有调用end()才会真正向服务器发请求
        req.end()

    })
}





module.exports = https