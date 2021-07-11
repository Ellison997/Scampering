let db = require('../../common/mysql')
let log = require('../../common/log')
let utils = require('../../common/utils')

// 根据用户查询todo列表
let queryList = async(userId = '', createAt = '') => {
    let sql = `select * from todo where true and userId=? and createAt=?`

    let data = null
    try {
        data = await db.query(sql, [userId, createAt], 'queryList')
    } catch (error) {
        log.error('queryList', error)
    }
    return data
}


// 查询ID 
let queryById = async(id) => {
    let sql = `select * from todo where true and id=?`
    let values = [id]
    let dbres = null;
    try {
        dbres = await db.query(sql, values, 'queryByIdTodo')
    } catch (error) {
        log.error('queryByIdTodo', error)
    }
    return dbres
}


// 修改
let update = async(t) => {
    let updateLoginSql = `update todo set title=?,\`desc\`=?,\`level\`=?,completed=?,createdAt=?,completedAt=? where id=?`;
    let dbres = null
    try {
        dbres = await db.query(updateLoginSql, [t.title, t.desc, t.level, t.completed, t.createdAt, t.completedAt, t.id], 'updateTodo')

    } catch (error) {
        log.error('updateTodo', error)
    }
    return dbres
}


// 添加
let insert = async(t) => {
    let sql = `insert into todo(id,createTime,userId,title,\`desc\`,\`level\`,completed,createdAt,completedAt)
                values(?,now(),?,?,?,?,?,?,?)`
    let values = [t.id, t.userId, t.title, t.desc, t.level, t.completed, t.createdAt, t.completedAt]
    let dbres = null;
    try {
        dbres = await db.query(sql, values, 'insertTodo')
    } catch (error) {
        log.error('insertTodo', error)
    }
    return dbres
}


// 删除
let deleteT = async(id) => {
    let sql = `delete from todo where id=?`
    let data = null
    try {
        data = await db.query(sql, [id], 'deleteTodo')
    } catch (error) {
        log.error('deleteTodo', error)
    }
    return data
}



module.exports = {
    insert,
    update,
    queryList,
    deleteT,
    queryById
}