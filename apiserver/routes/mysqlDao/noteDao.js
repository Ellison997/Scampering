let db = require('../../common/mysql')
let log = require('../../common/log')
let utils = require('../../common/utils')

// 根据用户查询note列表
let queryList = async(userId = '', createdAt = '') => {
    let sql = `select * from note where true and userId=? and createdAt=?`

    let data = null
    try {
        data = await db.query(sql, [userId, createdAt], 'queryNoteList')
    } catch (error) {
        log.error('queryNoteList', error)
    }
    return data
}


// 查询ID 
let queryById = async(id) => {
    let sql = `select * from note where true and id=?`
    let values = [id]
    let dbres = null;
    try {
        dbres = await db.query(sql, values, 'queryByIdNote')
    } catch (error) {
        log.error('queryByIdNote', error)
    }
    return dbres
}


// 修改
let update = async(t) => {
    let updateNoteSql = `update note set title=?,content=?,createdAt=? where id=?`;
    let dbres = null
    try {
        dbres = await db.query(updateNoteSql, [t.title, t.content, t.createdAt, t.id], 'updateNote')

    } catch (error) {
        log.error('updateNote', error)
    }
    return dbres
}


// 添加
let insert = async(t) => {
    let sql = `insert into note(id,createTime,userId,title,content,createdAt)
                values(?,now(),?,?,?,?)`
    let values = [t.id, t.userId, t.title, t.content, t.createdAt]
    let dbres = null;
    try {
        dbres = await db.query(sql, values, 'insertnote')
    } catch (error) {
        log.error('insertnote', error)
    }
    return dbres
}


// 删除
let deleteT = async(id) => {
    let sql = `delete from note where id=?`
    let data = null
    try {
        data = await db.query(sql, [id], 'deletenote')
    } catch (error) {
        log.error('deletenote', error)
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