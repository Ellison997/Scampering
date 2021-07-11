let express = require('express');
let router = express.Router();
let utils = require('../common/utils')
let log = require('../common/log')
let multer = require('multer')
let categoryDao = require('./mysqlDao/categoryDao')

/**
 * @api {GET} /category/list    获取列表
 * @apiDescription 获取列表
 * @apiName categoryList
 * @apiSampleRequest /category/list
 * @apiGroup category
 * @apiVersion 1.0.0
 */
router.get('/list', async function(req, res, next) {
    let dbres = await categoryDao.queryList()
    if (dbres != null) {
        res.json({
            code: 20000,
            msg: '获取分类列表成功',
            data: dbres
        })
    } else {
        res.json({
            code: 50000,
            msg: '获取分类列表失败',
            data: null
        })
    }

});



/**
 * @api {POST} /category/add   添加
 * @apiDescription 添加
 * @apiName add
 * @apiParam (body参数) {String} Ledgername 名称
 * @apiParam (body参数) {Number} Ledgertype 类型
 * @apiParam (body参数) {String} Ledgeraddress 地址
 * @apiParam (body参数) {String} Ledgercontact   联系人
 * @apiParam (body参数) {String} Ledgerphone  联系人电话
 * @apiParam (body参数) {Number} categoryname 名
 * @apiParam (body参数) {String} password    密码
 * @apiParam (body参数) {String} photoUrl   照片
 * @apiSampleRequest /category/add
 * @apiGroup category
 * @apiVersion 1.0.0
 */
router.post('/add', async function(req, res, next) {
    let Ledger = req.body;
    let dbres = await categoryDao.insertLedger(Ledger)
    if (dbres != null) {
        res.json({
            code: 20000,
            msg: '添加成功',
            data: dbres
        })
    } else {
        res.json({
            code: 50000,
            msg: '添加失败',
            data: null
        })
    }

});


/**
 * @api {PUT} /category/update   修改
 * @apiDescription 修改
 * @apiName update
 * @apiParam (body参数) {String} id  ID
 * @apiParam (body参数) {String} realname  真实姓名
 * @apiParam (body参数) {String} categoryname 名
 * @apiParam (body参数) {String} phone   手机号
 * @apiParam (body参数) {String} password  密码
 * @apiSampleRequest /category/updateEpa
 * @apiGroup category
 * @apiVersion 1.0.0
 */
router.put('/update', async function(req, res, next) {
    let categoryBody = req.body;

    let dbres = await categoryDao.update(categoryBody)
    if (dbres != null && dbres.changedRows != 0) {
        res.json({
            code: 20000,
            msg: '修改成功',
            data: dbres
        })
    } else {
        res.json({
            code: 50000,
            msg: '修改失败',
            data: null
        })
    }
});

module.exports = router;