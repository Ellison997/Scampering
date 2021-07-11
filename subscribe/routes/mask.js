let express = require('express');
let router = express.Router();
let utils = require('../common/utils')
let log = require('../common/log')
let multer = require('multer')
let categoryDao = require('./mysqlDao/categoryDao')
let maskApi=require('../api/mask')
let md5 = require('js-md5');

/**
 * @api {GET} /mask/sum   获取口罩剩余数量--实时刷新
 * @apiDescription 获取口罩剩余数量
 * @apiName maskSum
 * @apiSampleRequest /mask/sum
 * @apiGroup mask
 * @apiVersion 1.0.0
 */
router.get('/sum', async function(req, res, next) {
    let resd=null
    try {
        resd = await maskApi.getMaskSum()
        log.info('获取数量！')
    } catch (error) {
        log.info(error)
    }

    res.json(resd)
});



/**
 * @api {post} /mask/sendVerifyCode   获取短信验证码
 * @apiDescription 获取短信验证码
 * @apiName maskSendVerifyCode
 * @apiSampleRequest /mask/SendVerifyCode
 * @apiParam (body参数) {String} mobileNo 手机号
 * @apiParam (body参数) {String} verifyCode 验证码
 * @apiGroup mask
 * @apiVersion 1.0.0
 */
router.post('/sendVerifyCode', async function(req, res, next) {
    let mobileNo=req.body.mobileNo;
    let verifyCode=req.body.verifyCode;
    log.info('验证码手机号：',mobileNo)
    let resd = await maskApi.sendVerifyCode(mobileNo,verifyCode)
    log.info('验证码结果：',resd)

    res.json(resd)
});



/**
 * @api {POST} /mask/appointment   开始预约
 * @apiDescription 开始预约
 * @apiName appointment
 * @apiParam (body参数) {String} userName 名字
 * @apiParam (body参数) {Number} idCardNo 身份证号码
 * @apiParam (body参数) {String} mobileNo 地址
 * @apiParam (body参数) {String} verifyCode   输入的验证码
 * @apiParam (body参数) {String} verifyId  验证码接口返回的
 * @apiParam (body参数) {String} area 区域
 * @apiParam (body参数) {String} address  地址
 * @apiSampleRequest /mask/appointment
 * @apiGroup mask
 * @apiVersion 1.0.0
 */
router.post('/appointment', async function(req, res, next) {
    let a = req.body;
    a.idCardNo=a.idCardNo.toUpperCase()
    log.info('预约信息:',a)
    let resd = await maskApi.appointment(a)
    log.info('预约结果：',resd)
    res.json(resd)

});

module.exports = router;