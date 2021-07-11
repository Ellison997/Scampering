/**
 * 登录 获取用户信息   退出登录等程序全局操作
 */

var express = require('express');
var router = express.Router();
let log = require('../../common/log');
const {
    secretKey
} = require('../../common/constant');
const utils = require('../../common/utils');
const request = require('../../common/request');
const config = require('../../config');
let path = require('path');
const jwt = require("jsonwebtoken");
let categoryDao = require('../mysqlDao/categoryDao');
let userDao = require('../mysqlDao/userDao');

let multer = require('multer')




/**
 * @api {POST} /wuser/login  微信小程序登录认证
 * @apiDescription 微信小程序登录认证
 * @apiName login
 * @apiParam (body参数) {String} code 授权码
 * @apiSampleRequest /wuser/login
 * @apiGroup Index
 * @apiVersion 1.0.0
 */
router.get('/login', async function(req, res, next) {
    let code = req.query.code;

    let jscode2session = function() {
        return request({
            url: 'https://api.weixin.qq.com/sns/jscode2session',
            method: 'get',
            params: {
                appid: config.appId,
                secret: config.appSecret,
                js_code: code,
                grant_type: 'authorization_code'
            }
        })
    }
    let resd = await jscode2session()
    let users = null;
    if (resd.openid) {
        users = await userDao.queryById(resd.openid)
        if (users != null && users.length == 0) {
            // 添加新用户
            let insertRes = userDao.insert(resd.openid)
            if (insertRes != null) {
                users = await userDao.queryById(resd.openid)
            }
        }
    }
    let resData = {
        code: 50000,
        msg: '程序出现异常！',
        data: null
    }

    if (users != null && users.length > 0) {
        let tokenObj = {
                userId: users[0].id,
                openId: users[0].openId,
                lastTime: users[0].lastTime,
                session_key: resd.session_key
            }
            // 验证成功，生成token
        let token = jwt.sign(tokenObj,
            secretKey, {
                expiresIn: 60 * 60 * 2 * 24 // 授权时效两天
            }
        );
        resData.code = 20000;
        resData.msg = '登录成功！';
        resData.data = {
            access_token: token
        }
    }
    res.json(resData);
});




/**
 * @api {GET} /wuser/getUserInfo   获取登录的人员信息
 * @apiDescription 获取登录的人员信息
 * @apiName getUserInfo
 * @apiParam {String} token 访问令牌
 * @apiSampleRequest /wuser/getUserInfo
 * @apiGroup WUSER
 * @apiVersion 1.0.0
 */
router.post('/getUserInfo', async function(req, res, next) {
    let token = utils.getRequestToken(req);
    let wxuser = req.body;

    log.info('微信传入的用户信息：', wxuser)
    let resData = {
        code: 20000,
        msg: '获取用户信息成功',
        data: null
    }

    let user = null;
    try {
        user = jwt.verify(token, secretKey);
        if (user != null) {
            // 更新用户信息
            let u = {
                ...wxuser,
                id: user.userId
            }
            await userDao.update(u)
            user = Object.assign(user, wxuser)
        }
    } catch (error) {
        log.error('getUserInfo', error)
    }

    if (user != null) {
        resData.data = user
    } else {
        resData.code = 50000,
            resData.msg = '获取用户信息失败！'
    }

    res.json(resData)

});

module.exports = router;