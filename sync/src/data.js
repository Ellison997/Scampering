const https = require('../common/https')
const mysql = require('../common/mysql')
const saying = require('../api/saying')

let num = 0;
async function pulldata() {
    try {
        let pullResult = await saying.get();
        let a = pullResult.data;
        let sql = `INSERT INTO saying(cId,content,author,authorId,source,remark) VALUES(?,?,?,?,?,?)`
        await mysql.query(sql, [a.cId, a.content, a.author, a.authorId, a.source, a.remark], 'pulldata')
        console.log('num:', num++)
    } catch (error) {
        console.log(error)
    }
}

setInterval(async function() {
    await pulldata();
}, 1000)