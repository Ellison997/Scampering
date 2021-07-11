/**
 *  note 笔记信息
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
let noteDao = require('../mysqlDao/noteDao');

let multer = require('multer')




/**
 * @api {POST} /wnote/add   添加笔记
 * @apiDescription 添加笔记
 * @apiName addnote
 * @apiParam (body参数) {String} title 标题
 * @apiParam (body参数) {String} intro 描述
 * @apiParam (body参数) {String} img 封面照片地址
 * @apiParam (body参数) {String} content  内容
 * @apiParam (body参数) {String} categoryId  分类ID
 * @apiSampleRequest /wnote/add 
 * @apiGroup note
 * @apiVersion 1.0.0
 */
router.post('/add', async function(req, res, next) {
    let note = req.body;

    let resJson = {
        code: 20000,
        msg: '添加成功',
        data: null
    }

    let dbres = await notesDao.insert(note)
    if (dbres != null) {
        resJson.data = dbres
    } else {
        resJson.code = 50000;
        resJson.msg = '添加失败'
    }
    res.json(resJson)
});

/**
 * @api {POST} /wnote/sync   同步数据
 * @apiDescription 同步数据
 * @apiName syncnote
 * @apiParam (body参数) {Array} data 数据
 * @apiSampleRequest /wnote/sync 
 * @apiGroup note
 * @apiVersion 1.0.0
 */
router.post('/sync', async function(req, res, next) {
    let data = req.body;
    log.info('同步的数据', data)

    let resJson = {
        code: 20000,
        msg: '同步成功',
        data: null
    }
    let dbres = null
    for (const note of data) {
        // 先查询数据库中有没有
        dbres = await notesDao.queryById(note.id)
        if (dbres != null && dbres.length != 0) {
            // 有就更新
            dbres = await notesDao.update(note)
        } else {
            // 没有就插入
            dbres = await notesDao.insert(note)
        }
    }

    if (dbres != null) {
        resJson.data = dbres
    } else {
        resJson.code = 50000;
        resJson.msg = '同步失败'
    }
    res.json(resJson)
});


/**
 * @api {DELETE} /wnote/delete/:id   删除笔记
 * @apiDescription 添加笔记
 * @apiName deletenote
 * @apiParam (path参数) {String} id  笔记ID
 * @apiSampleRequest /wnote/delete/:id
 * @apiGroup note
 * @apiVersion 1.0.0
 */
router.delete('/delete', async function(req, res, next) {
    let {
        id
    } = req.params;

    let resJson = {
        code: 20000,
        msg: '删除成功',
        data: null
    }

    let dbres = await notesDao.deteleT(id)
    if (dbres != null) {
        resJson.data = dbres
    } else {
        resJson.code = 50000;
        resJson.msg = '删除失败'
    }

    res.json(resJson)

});




/**
 * @api {GET} /wnote/list   获取笔记列表
 * @apiDescription 获取笔记列表
 * @apiName getUserInfo
 * @apiParam {String} userId 用户ID
 * @apiParam {String} createAt 创建日期
 * @apiSampleRequest /wnote/list
 * @apiGroup note
 * @apiVersion 1.0.0
 */
router.post('/list', async function(req, res, next) {
    let token = utils.getRequestToken(req);

    let {
        userId,
        createAt
    } = req.query;

    let resData = {
        code: 20000,
        msg: '获取笔记列表成功',
        data: null
    }

    let list = await notesDao.queryList(userId, createAt)

    if (user != null) {
        resData.data = list
    } else {
        resData.code = 50000;
        resData.msg = '获取笔记列表失败'
    }

    res.json(resData)

});




module.exports = router;