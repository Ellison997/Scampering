let db = require('../../common/mysql')
let log = require('../../common/log')
let utils = require('../../common/utils')

// 查询列表
let addStaff = async (s) => {
    let sqlAdd = `select id,title as sonTitle,sort,type,supId from category where type=2 and supId=? order by sort;`
    let data = null
    try {
        data = await db.query(sql, [], 'addStaff')
    } catch (error) {
        log.error('addStaff', error)
    }
    return data;
}


module.exports = {
    addStaff
}