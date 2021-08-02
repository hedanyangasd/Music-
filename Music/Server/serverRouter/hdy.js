var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser());
let multer = require('multer')
let fs = require('fs')
var mySql = require('mysql');
var dbConfig = require('./DBConfig');
var {userSQL,replySQL,singerSQL,singerCDSQL,songlistSQL,musicSQL,collectionSQL,fansSQL}= require('./SqL');
var connection = mySql.createConnection(dbConfig.mysql);
connection.connect();



router.post('/regist', (req, res) => {
    let data = {};
    var addParams = [req.body.email, req.body.pwd, req.body.name];
    connection.query(userSQL.getALL, addParams[0], function (error, result) {
        console.log(error);
        if (result.length !== 0) {
            data = {
                code: 500,
                msg: "邮箱已被注册"
            };
            res.send(data);
        } else {
            connection.query(userSQL.insert, addParams, function (error, result) {
                if (error) {
                    data = {
                        code: 500,
                        msg: "注册失败"
                    };
                    res.send(data);
                } else {
                    data = {
                        code: 200,
                        msg: "注册成功"
                    };
                    res.send(data);
                }
            });
        }
        console.log(data);
    });
});
router.post('/login', (req, res) => {
    let data = {};
    var addParams = [req.body.email, req.body.pwd];
    connection.query(userSQL.getALL, addParams[0], function (error, result) {
        console.log(result[0].password);
        if (result.length === 0) {
            data = {
                code: 500,
                msg: "不存在该邮箱"
            };
            res.send(data);
        } else if (result[0].password !== addParams[1]) {
            data = {
                code: 500,
                msg: "密码不对"
            };
            res.send(data);
        } else {
            data = {
                code: 200,
                msg: "登陆成功",
                id: result[0].id
            };
            res.send(data);
        }
        console.log(data);
    })

})
router.post('/update', (req, res) => {
    let data = {};
    var addParams = [req.body.pwd, req.body.email];
    connection.query(userSQL.getALL, addParams[1], function (error, result) {
        if (result.length === 0) {
            data = {
                code: 500,
                msg: "不存在该邮箱"
            };
            res.send(data);
        } else {
            connection.query(userSQL.updateuser, addParams, function (error, result) {
                console.log(error, result);
                if (result.length === 0) {
                    data = {
                        code: 500,
                        msg: "修改失败"
                    };
                    res.send(data);
                } else {
                    data = {
                        code: 200,
                        msg: "修改成功",
                    };
                    res.send(data);
                }
            });
        }
    });

})

router.get('/info', function (req, res, next) {
    let data = {};
    connection.query(userSQL.getID, req.query.id, function (error, result) {
        data = {
            code: 200,
            name: result[0].name,
            image: result[0].image,
            address: result[0].address,
            intro: result[0].intro
        };
        res.send(data);
    })
});


// 使用硬盘存储模式设置存放接收到的文件的路径以及文件名
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 接收到文件后输出的保存路径（若不存在则需要创建）
        cb(null, '../static/image/upload');    
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 时间戳 + 文件原始名，比如 151342376785-123.jpg
        cb(null, file.originalname);  
    }
});

// 创建文件夹
var createFolder = function(folder){
    try{
        // 测试 path 指定的文件或目录的用户权限,我们用来检测文件是否存在
        // 如果文件路径不存在将会抛出错误"no such file or directory"
        fs.accessSync(folder); 
    }catch(e){
        // 文件夹不存在，以同步的方式创建文件目录。
        fs.mkdirSync(folder);
    }  
};

var uploadFolder = '../static/image/upload';
createFolder(uploadFolder);

// 创建 multer 对象
var upload = multer({ storage: storage });

/* POST upload listing. */
router.post('/uploadimg', upload.single('file'), function(req, res, next) {
    var file = req.file;
    var data = {};
    console.log(req.body.id);
    var path = 'image/upload/'+file.originalname;
    var addParams = [path, req.body.id];
    connection.query(userSQL.updateimage, addParams, function (error, result) {
        if (result.length === 0) {
            data = {
                code: 500,
                msg: "修改失败"
            };
            res.send(data);
        } else {
            data = {
                code: 200,
                msg: "修改成功",
            };
            res.send(data);
        }
    });
});

router.post('/updateinfo', (req, res) => {
    var data = {};
    var addParams = [req.body.name, req.body.intro,req.body.id];
    connection.query(userSQL.updatainfo, addParams, function (error, result) {
        if (result.length === 0) {
            data = {
                code: 500,
                msg: "修改失败"
            };
            res.send(data);
        } else {
            data = {
                code: 200,
                msg: "修改成功",
            };
            res.send(data);
        }
    });


})


/**************** 评论 ******************/
router.get('/incomment', function (req, res, next) {
    var data = {};
    var addParams = [req.query.typeid, req.query.userid, req.query.content,req.query.retype];
    connection.query(replySQL.incomment,addParams,function (error, result) {
        if (error) {
            data = {
                code: 500,
                msg: "评论失败"
            };
            res.send(data);
        } else {
            data = {
                code: 200,
                msg: "评论成功"
            };
            res.send(data);
        }
    })
});


router.get('/showcomment', function (req, res, next) {
    var addParams = [req.query.typeid,req.query.retype];
    connection.query(replySQL.showcomment,addParams,function (error, result) {
        res.send(result)
    })
});

router.get('/delcomment', function (req, res, next) {
    var data = {};
    connection.query(replySQL.delcomment,req.query.slid,function (error, result) {
        if (error) {
            data = {
                code: 500,
                msg: "删除失败"
            };
            res.send(data);
        } else {
            data = {
                code: 200,
                msg: "删除成功"
            };
            res.send(data);
        }
    })
});


module.exports = router;