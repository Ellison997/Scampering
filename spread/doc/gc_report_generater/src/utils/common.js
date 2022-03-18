

function getImageBase64(src){
    let arr = src.split('.')
    let ext = arr[arr.length-1]
    return new Promise((resolve, reject)=>{
        try{
            let img = new Image();
            img.setAttribute("crossOrigin",'Anonymous')
            img.src = src;
            img.onload = function(){
                var canvas = document.createElement("canvas");   //创建canvas DOM元素，并设置其宽高和图片一样
                canvas.width = img.width;
                canvas.height = img.height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, img.width, img.height); //使用画布画图
                var dataURL = canvas.toDataURL("image/" + ext);  //返回的是一串Base64编码的URL并指定格式
                canvas = null; //释放
                resolve(dataURL)
            }
            img.onerror = function(){
                resolve("")
            }
        }
        catch{
            resolve("")
        }
    });
}

export {
    getImageBase64
}