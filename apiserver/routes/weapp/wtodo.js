/**
 *  todo 任务信息
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
let todoDao = require('../mysqlDao/todoDao');

let multer = require('multer')




/**
 * @api {POST} /wtodo/add   添加任务
 * @apiDescription 添加任务
 * @apiName addTodo
 * @apiParam (body参数) {String} title 标题
 * @apiParam (body参数) {String} intro 描述
 * @apiParam (body参数) {String} img 封面照片地址
 * @apiParam (body参数) {String} content  内容
 * @apiParam (body参数) {String} categoryId  分类ID
 * @apiSampleRequest /wtodo/add 
 * @apiGroup Todo
 * @apiVersion 1.0.0
 */
router.post('/add', async function(req, res, next) {
    let todo = req.body;

    let resJson = {
        code: 20000,
        msg: '添加成功',
        data: null
    }

    let dbres = await todoDao.insert(todo)
    if (dbres != null) {
        resJson.data = dbres
    } else {
        resJson.code = 50000;
        resJson.msg = '添加失败'
    }
    res.json(resJson)
});

/**
 * @api {POST} /wtodo/sync   同步数据
 * @apiDescription 同步数据
 * @apiName syncTodo
 * @apiParam (body参数) {Array} data 数据
 * @apiSampleRequest /wtodo/sync 
 * @apiGroup Todo
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
    for (const todo of data) {
        // 先查询数据库中有没有
        dbres = await todoDao.queryById(todo.id)
        if (dbres != null && dbres.length != 0) {
            // 有就更新
            dbres = await todoDao.update(todo)
        } else {
            // 没有就插入
            dbres = await todoDao.insert(todo)
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
 * @api {DELETE} /wtodo/delete/:id   删除任务
 * @apiDescription 添加任务
 * @apiName deleteTodo
 * @apiParam (path参数) {String} id  任务ID
 * @apiSampleRequest /wtodo/delete/:id
 * @apiGroup Todo
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

    let dbres = await todoDao.deteleT(id)
    if (dbres != null) {
        resJson.data = dbres
    } else {
        resJson.code = 50000;
        resJson.msg = '删除失败'
    }

    res.json(resJson)

});




/**
 * @api {GET} /wtodo/list   获取任务列表
 * @apiDescription 获取任务列表
 * @apiName getUserInfo
 * @apiParam {String} userId 用户ID
 * @apiParam {String} createAt 创建日期
 * @apiSampleRequest /wtodo/list
 * @apiGroup Todo
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
        msg: '获取任务列表成功',
        data: null
    }

    let list = await todoDao.queryList(userId, createAt)

    if (user != null) {
        resData.data = list
    } else {
        resData.code = 50000;
        resData.msg = '获取任务列表失败'
    }

    res.json(resData)

});




module.exports = router;