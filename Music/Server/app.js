const express = require('express')
const app = express() //服务端框架

const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));


/*跨域问题*/ 
var allowCrossDomain = function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "x-requested-with,Content-Type,Access-Token");
  res.setHeader("Access-Control-Expose-Headers", "*");
  next();
};
app.use(allowCrossDomain);

//引入不同的接口文件
let hdyRouter = require('./serverRouter/hdy')
let sRouter = require('./serverRouter/soasi')
let mRouter = require('./serverRouter/music')

app.use('/hdy', hdyRouter)
app.use('/soasi', sRouter)
app.use('/music', mRouter)

app.listen(3000, () => {
  console.log('服务器已开启！')
})