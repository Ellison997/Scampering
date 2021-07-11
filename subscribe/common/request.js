const axios = require('axios')

// 创建axios实例
const service = axios.create({
    timeout: 30000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
    config => {
        // config.headers['authorization'] = 'authorization' // 让每个请求携带自定义token 请根据实际情况自行修改
        config.headers['User-Agent'] = `Mozilla/5.0 (Linux; U; Android 5.0.2; zh-cn; Redmi Note 3 Build/LRX22G) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 UCBrowser/1.0.0.100 U3/0.8.0 Mobile Safari/534.30 Nebula AlipayDefined(nt:WIFI,ws:360|640|3.0) AliApp(AP/10.0.1.123166) AlipayClient/10.0.1.123166 Language/zh-Hans useStatusBar/true`
        
        // console.log(config)
        return config
    },
    error => {
        // Do something with request error
        Promise.reject(error)
    }
)

// response 拦截器
service.interceptors.response.use(
    response => {
        response.data
        return response.data

    },
    error => {
        console.log(`error:${error}`) // for debug
        return Promise.reject(error)
    }
)
module.exports = service