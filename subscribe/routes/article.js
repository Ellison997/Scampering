let express = require('express');
let router = express.Router();
let utils = require('../common/utils')
let log = require('../common/log')
let multer = require('multer')
let articleDao = require('./mysqlDao/articleDao')



let uploadFolder = './uploads'; // 临时文件夹
// 通过 filename 属性定制
let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadFolder); // 保存的路径，备注：需要自己创建
    },
    filename: function(req, file, cb) {
        // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
        cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.')[1]);
    }
});

// 通过 storage 选项来对 上传行为 进行定制化
let upload = multer({
    storage: storage
})


/**
 * @api {POST} /article/upload   上传图片
 * @apiDescription 上传图片
 * @apiName upload
 * @apiParam (body参数) {Object} img  上传图片
 * @apiSampleRequest /article/upload
 * @apiGroup article
 * @apiVersion 1.0.0
 */
router.post('/upload', upload.single('img'), function(req, res, next) {
    let file = req.file;
    res.json({
        code: 20000,
        msg: '上传图片',
        data: {
            mimetype: file.mimetype,
            originalname: file.originalname,
            size: file.size,
            path: file.path
        },
    })
});





/**
 * @api {GET} /article/list    获取列表
 * @apiDescription 获取列表
 * @apiName articleList
 * @apiParam (query参数) {String} categoryId 分类ID
 * @apiSampleRequest /article/list
 * @apiGroup article
 * @apiVersion 1.0.0
 */
router.get('/list', async function(req, res, next) {
    let categoryId = req.query.categoryId;

    let dbres = await articleDao.queryList(categoryId)
    if (dbres != null) {
        res.json({
            code: 20000,
            msg: '获取文章列表成功',
            data: dbres
        })
    } else {
        res.json({
            code: 50000,
            msg: '获取文章列表失败',
            data: null,
            count: 0
        })
    }

});






/**
 * @api {POST} /article/add   添加
 * @apiDescription 添加
 * @apiName add
 * @apiParam (body参数) {String} title 标题
 * @apiParam (body参数) {String} intro 描述
 * @apiParam (body参数) {String} img 封面照片地址
 * @apiParam (body参数) {String} content  内容
 * @apiParam (body参数) {String} categoryId  分类ID
 * @apiSampleRequest /article/add
 * @apiGroup article
 * @apiVersion 1.0.0
 */
router.post('/add', async function(req, res, next) {
    let article = req.body;
    let dbres = await articleDao.insert(article)
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
 * @api {PUT} /article/update   修改
 * @apiDescription 修改
 * @apiName update
 * @apiParam (body参数) {String} id  ID
 * @apiParam (body参数) {String} realname  真实姓名
 * @apiParam (body参数) {String} articlename 名
 * @apiParam (body参数) {String} phone   手机号
 * @apiParam (body参数) {String} password  密码
 * @apiSampleRequest /article/updateEpa
 * @apiGroup article
 * @apiVersion 1.0.0
 */
router.put('/update', async function(req, res, next) {
    let articleBody = req.body;

    let dbres = await articleDao.update(articleBody)
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