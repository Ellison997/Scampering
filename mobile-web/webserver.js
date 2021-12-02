const express = require("express");
const path = require("path");
let https = require('https');
let fs = require('fs'); //用于读写文件 (node原生模块)
const app = express();
app.use(function(req, res, next) {
    console.log(` 
    ------------------------
      访问 ${req.path} 接口`);

    next();
});

app.use("/favicon.ico", express.static(path.resolve(__dirname, "./dist/favicon.ico")));
app.use("/js", express.static(path.resolve(__dirname, "./dist/js")));
app.use("/css", express.static(path.resolve(__dirname, "./dist/css")));
app.use("/img", express.static(path.resolve(__dirname, "./dist/img")));

app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./dist") + "/index.html");
});


app.listen(1202, async() => {
    console.log("listening on port " + 1202);
});