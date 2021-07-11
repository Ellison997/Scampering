let express = require('express');
let router = express.Router();
let utils = require('../common/utils')
let log = require('../common/log')
let multer = require('multer')
let categoryDao = require('./mysqlDao/categoryDao')
let maskApi = require('../api/mask')
let md5 = require('js-md5');
let psqDao = require('./mysqlDao/psqDao')

/**
 * @api {post} /psq/add  添加人员
 * @apiDescription 添加人员
 * @apiName psqAdd
 * @apiSampleRequest /psq/add
 * @apiParam (body参数) {String} name 姓名
 * @apiParam (body参数) {String} sex 性别
 * @apiParam (body参数) {String} phone 联系方式（仅限手机）
 * @apiParam (body参数) {String} idcard 身份证号
 * @apiParam (body参数) {String} idcardAdderss 身份证地址
 * @apiParam (body参数) {String} hangAddress 在杭住址（详细地址，需要到街道乡镇小区）
 * @apiParam (body参数) {String} hangMode 自住/租住
 * @apiParam (body参数) {String} is14  Y/N
 * @apiParam (body参数) {String} ishang Y/N
 * @apiParam (body参数) {String} province 省
 * @apiParam (body参数) {String} city 市
 * @apiParam (body参数) {String} district 区
 * @apiParam (body参数) {String} trafficMode 交通方式
 * @apiParam (body参数) {String} iswayHubei 是否途径湖北
 * @apiParam (body参数) {String} date 回杭日期
 * @apiParam (body参数) {String} planDate 计划回杭日期
 * @apiParam (body参数) {String} insulateMode 隔离方式
 * @apiParam (body参数) {String} physicalState 当前身体状态
 * @apiParam (body参数) {String} is14gathering 最近14天是否参过外部聚会
 * @apiParam (body参数) {String} is14emphasis 最近14天是否接触重点疫区来源人员
 * @apiParam (body参数) {String} note 备注
 * @apiGroup PSQ
 * @apiVersion 1.0.0
 */
router.post('/add', async function (req, res, next) {
    let staff = req.body
    let resd = await psqDao.addStaff(staff)
    res.json(resd)
});