var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser());
let multer = require('multer')
let fs = require('fs')
var mySql = require('mysql');
var dbConfig = require('./DBConfig');
var {
    userSQL,
    singerSQL,
    singerCDSQL,
    songlistSQL,
    musicSQL,
    collectionSQL,
    fansSQL,
    replySQL
} = require('./SqL');
var connection = mySql.createConnection(dbConfig.mysql);
connection.connect();



/**************    歌曲    ************ */

router.get('/musicinfo', function (req, res, next) {
    connection.query(musicSQL.musicinfo, req.query.mid, function (error, result) {
        res.send(result[0])
    });
});

router.get('/othersl', function (req, res, next) {
    connection.query(musicSQL.othersl, req.query.mid, function (error, result) {
        res.send(result)
    });
});


router.get('/otheruser', function (req, res, next) {
    connection.query(musicSQL.otheruser, req.query.mid, function (error, result) {
        res.send(result)
    });
});

router.get('/creatsl', function (req, res, next) {
    let data = {};
    var addParams = [req.query.id, req.query.slname, req.query.slimage, req.query.slintro];
    connection.query(musicSQL.creatsl,addParams, function (error, result) {
        if (error) {
            data = {
                code: 500,
                msg: "创建失败"
            };
            res.send(data);
        } else {
            data = {
                code: 200,
                msg: "创建成功"
            };
            res.send(data);
        }
    })
});

/*************************收藏**************/
router.get('/collin', function (req, res, next) {
    let data = {};
    var addParams = [req.query.mid, req.query.userid];
    connection.query(collectionSQL.queryex, addParams, function (error, result) {
        if (result.length !== 0) {
            data = {
                code: 500,
                msg: "已点赞过"
            };
            res.send(data);
        } else {
            connection.query(collectionSQL.insert, addParams, function (error, result) {
                if (error) {
                    data = {
                        code: 500,
                        msg: "点赞失败"
                    };
                    res.send(data);
                } else {
                    connection.query(collectionSQL.querystore, addParams[0], function (error, result) {
                        var count = ++result[0].storecount;
                        connection.query(collectionSQL.updatecount, [count, addParams[0]], function (error, result) {
                            data = {
                                code: 200,
                                msg: "点赞成功"
                            };
                            res.send(data);
                        })
                    })
                }
            })
        }

    })

});

router.get('/collsto', function (req, res, next) {
    connection.query(collectionSQL.collsto, req.query.id, function (error, result) {
        res.send(result)
    });
});


router.get('/iscollsl', function (req, res, next) {
    let data = {};
    var addParams = [req.query.slid, req.query.userid];
    connection.query(collectionSQL.querycsl, addParams, function (error, result) {
        if (result.length !== 0) {
            data = {
                msg: "ok"
            };
            res.send(data);
        } else {
            data = {
                msg: "no"
            };
            res.send(data);
        }
    })

});


router.get('/incolsl', function (req, res, next) {
    let data = {};
    var addParams = [req.query.slid, req.query.userid];
    connection.query(collectionSQL.insertcsl, addParams, function (error, result) {
        if (error) {
            data = {
                code: 500,
                msg: "插入失败"
            };
            res.send(data);
        } else {
            data = {
                code: 200,
                msg: "插入成功"
            };
            res.send(data);
        }
    })
})

router.get('/delcolsl', function (req, res, next) {
    let data = {};
    var addParams = [req.query.slid, req.query.userid];
    connection.query(collectionSQL.delcolsl, addParams, function (error, result) {
        if (error) {
            data = {
                code: 500,
                msg: "收删除失败"
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
})


router.get('/collsonglist', function (req, res, next) {
    connection.query(collectionSQL.collsl, req.query.id, function (error, result) {
        res.send(result)
    });
});

router.get('/delcollsong', function (req, res, next) {
    connection.query(collectionSQL.delcollsong, [req.query.mid, req.query.userid], function (error, result) {
        connection.query(collectionSQL.querystore, req.query.mid, function (error, result) {
            var count = --result[0].storecount;
            connection.query(collectionSQL.updatecount, [count, req.query.mid], function (error, result) {
                res.send({
                    msg: "删除成功"
                });
            })
        })
    });
});


/**************    关注   ******************/
router.get('/isfollow', function (req, res, next) {
    connection.query(fansSQL.isfollow, [req.query.fanid, req.query.userid], function (error, result) {
        if (result[0]) {
            res.send({
                msg: "yes"
            });
        } else {
            res.send({
                msg: "no"
            });
        }
    });
});



router.get('/follow', function (req, res, next) {
    var data = ''
    connection.query(fansSQL.follow, [req.query.fanid, req.query.userid], function (error, result) {
        if (error) {
            data = {
                code: 500,
                msg: "插入失败"
            };
            res.send(data);
        } else {
            data = {
                code: 200,
                msg: "插入成功"
            };
            res.send(data);
        }
    });
})

router.get('/delfollow', function (req, res, next) {
    var data = ''
    connection.query(fansSQL.delfollow, [req.query.fanid, req.query.userid], function (error, result) {
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
    });
})


router.get('/fans', function (req, res, next) {
    connection.query(fansSQL.fans, req.query.concer, function (error, result) {
        res.send(result)
    });
})

router.get('/concer', function (req, res, next) {
    connection.query(fansSQL.concer, req.query.fanid, function (error, result) {
        res.send(result)
    });
})


/*****************我的音乐*************/
router.get('/mymusiccol', function (req, res, next) {
    connection.query(collectionSQL.mymusiccol, req.query.id, function (error, result) {
        res.send(result)
    });
})


router.get('/mymusiccreate', function (req, res, next) {
    connection.query(collectionSQL.mymusiccreate, req.query.id, function (error, result) {
        res.send(result)
    });
})


router.get('/insl', function (req, res, next) {
    var data = ''
    connection.query(songlistSQL.insl, [req.query.slid, req.query.mid], function (error, result) {
        if (error) {
            data = {
                code: 500,
                msg: "插入失败"
            };
            res.send(data);
        } else {
            data = {
                code: 200,
                msg: "插入成功"
            };
            res.send(data);
        }
    });
})

router.get('/delsl', function (req, res, next) {
    var data = ''
    connection.query(songlistSQL.delsl, [req.query.mid, req.query.slid], function (error, result) {
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
    });
})


router.get('/delslist', function (req, res, next) {
    var data = ''
    connection.query(songlistSQL.delslist, req.query.slid, function (error, result) {
        if (error) {
            data = {
                code: 500,
                msg: "删除失败"
            };
            res.send(data);
        } else {
            connection.query(songlistSQL.delslimu, req.query.slid, function (error, result) {
                if (error) {
                    data = {
                        code: 500,
                        msg: "删除失败"
                    };
                    res.send(data);
                } else {
                    connection.query(songlistSQL.delcolsl, req.query.slid, function (error, result) {
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
                    });
                }
            });
        }
    });



})


// 使用硬盘存储模式设置存放接收到的文件的路径以及文件名
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 接收到文件后输出的保存路径（若不存在则需要创建）
        cb(null, '../static/image/songlist');    
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


var uploadFolder = '../static/image/songlist';
createFolder(uploadFolder);

// 创建 multer 对象
var upload = multer({ storage: storage });


router.post('/uploadimg', upload.single('file'), function(req, res, next) {
    var file = req.file
    var path = 'image/songlist/'+file.originalname;
    var addParams = [path, req.body.id];
    res.send(addParams);
});

module.exports = router;