let db = require('../../common/mysql')
let log = require('../../common/log')
let utils = require('../../common/utils')


// 查询列表
let queryList = async(cid) => {
    let categoryId = (cid == '' ? `and 1=1` : `and categoryId = '${cid}'`)


    let sql = `select * from article where 1=1 ${categoryId}`

    // let sqlCount = `select count(*) as count from GY_LOGIN u where u.usertype=1 ${sqlrealname} ${sqlphone}`
    let data = null
        // let dbcount = [];
        // let count = 0;
    try {
        data = await db.query(sql, [], 'queryArticleList')
            // dbcount = await db.query(sqlCount, [], 'queryListCount')
            // count = dbcount[0].count;
    } catch (error) {
        log.error('queryArticleList', error)
    }
    return data
}


// 查询ID 
let queryById = async(openId) => {
    let sql = `select * from user where openId=?`
    let values = [openId]
    let dbres = null;
    try {
        dbres = await db.query(sql, values, 'queryByUserId')
    } catch (error) {
        log.error('queryUserById', error)
    }
    return dbres
}


// 修改
let update = async(u) => {
    let updateLoginSql = `update GY_LOGIN set realname=?,username=?,phone=?,password=? where id=?`;
    let dbres = null
    try {
        dbres = await db.query(updateLoginSql, [u.realname, u.username, u.phone, utils.md5(u.password), u.id], 'update')

    } catch (error) {
        log.error('update', error)
    }
    return dbres
}


// 添加
let insert = async(openId) => {
    let sql = `insert into user(id,createTime,openId) values(uuid(),now(),?)`
    let values = [openId]
    let dbres = null;
    try {
        dbres = await db.query(sql, values, 'insertUser')
    } catch (error) {
        log.error('insertUser', error)
    }
    return dbres
}

module.exports = {
    insert,
    update,
    queryList,
    queryById
}