var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser());
var mySql = require('mysql');
var dbConfig = require('./DBConfig');
var {userSQL,singerSQL,singerCDSQL,songlistSQL,musicSQL,collectionSQL,fansSQL,replySQL}= require('./SqL');
var connection = mySql.createConnection(dbConfig.mysql);
connection.connect();

/****************** 歌手  ***********************/
router.get('/singer', function (req, res, next) {
    var start=(req.query.page-1)*15; 
    connection.query(singerSQL.queryAll,[start,15],function (error, result) {
        res.send(result)
    });  
});

router.get('/allsinger', function (req, res, next) { 
    connection.query(singerSQL.singer,function (error, result) {
        res.send(result)
    });  
});

router.get('/singercount', function (req, res, next) {
    connection.query(singerSQL.count,function (error, result) {
        res.send(result[0])
    });
    
});

router.get('/singerinfo', function (req, res, next) {
    connection.query(singerSQL.queryinfo,req.query.singerid,function (error, result) {
        res.send(result[0]);
    });
});

router.get('/othersinger', function (req, res, next) {
    connection.query(singerSQL.othersinger,req.query.singerid,function (error, result) {
        res.send(result);
    });
});

router.get('/singerCD', function (req, res, next) {
    connection.query(singerSQL.singerCD,req.query.singerid,function (error, result) {
        res.send(result);
    });
});

router.get('/searchSinger', function (req, res, next) {
    let sql = `select singerid,name from singer where name like '%${req.query.content}%'`
    connection.query(sql,function (error, result) {
        res.send(result);
    });
});



/****************** 专辑 ***********************/

router.get('/CDs', function (req, res, next) {
    var start=(req.query.page-1)*15; 
    connection.query(singerCDSQL.queryAll,[start,15],function (error, result) {
        res.send(result)
    });  
});

router.get('/singerCDcount', function (req, res, next) {
    connection.query(singerCDSQL.count,function (error, result) {
        res.send(result[0])
    }); 
});


router.get('/cdinfo', function (req, res, next) {
    connection.query(singerCDSQL.queryinfo,req.query.cdid,function (error, result) {
        res.send(result[0])
    }); 
});


router.get('/otherCD', function (req, res, next) {
    connection.query(singerCDSQL.otherCD,[req.query.cdid,req.query.cdid],function (error, result) {
        res.send(result);
    }); 
});



/****************** 歌单 ***********************/

router.get('/songlist', function (req, res, next) {
    var start=(req.query.page-1)*15; 
    connection.query(songlistSQL.queryAll,[start,15],function (error, result) {
        res.send(result);
    });  
});

router.get('/songlistcount', function (req, res, next) {
    connection.query(songlistSQL.count,function (error, result) {
        res.send(result[0])
    }); 
});

router.get('/othersonglist', function (req, res, next) {
    connection.query(songlistSQL.songlist,req.query.id,function (error, result) {
        res.send(result)
    }); 
});

router.get('/slinfo', function (req, res, next) {
    connection.query(songlistSQL.queryinfo,req.query.slid,function (error, result) {
        res.send(result[0])
    }); 
});

router.get('/otherlist', function (req, res, next) {
    connection.query(songlistSQL.otherlist,[req.query.slid,req.query.slid],function (error, result) {
        res.send(result)
    }); 
});


/**************    歌曲    ************ */


router.get('/searchMusic', function (req, res, next) {
    let sql = `select mid,mname from music where mname like '%${req.query.content}%'`
    connection.query(sql,function (error, result) {
        res.send(result);
    });
});



router.get('/singersong', function (req, res, next) {
    connection.query(musicSQL.musicAsinger,req.query.singerid,function (error, result) {
        res.send(result);
    });
});

router.get('/songtatol', function (req, res, next) {
    connection.query(musicSQL.songtatol,req.query.cdid,function (error, result) {
        res.send(result);
    });
});


router.get('/slsongs', function (req, res, next) {
    connection.query(musicSQL.slsongs,req.query.slid,function (error, result) {
        res.send(result);
    });
});

router.get('/ranknew', function (req, res, next) {
   connection.query(musicSQL.ranknew,function(error,result){
       res.send(result)
   })
});

router.get('/rankn', function (req, res, next) {
    connection.query(musicSQL.rankn,function(error,result){
        res.send(result)
    })
 });

router.get('/rankcreat', function (req, res, next) {
    connection.query(musicSQL.rankcreat,function(error,result){
        res.send(result)
    })
 });

 router.get('/rankc', function (req, res, next) {
    connection.query(musicSQL.rankc,function(error,result){
        res.send(result)
    })
 });


 router.get('/rankstore', function (req, res, next) {
    connection.query(musicSQL.rankstore,function(error,result){
        res.send(result)
    })
 });

 router.get('/ranks', function (req, res, next) {
    connection.query(musicSQL.ranks,function(error,result){
        res.send(result)
    })
 });




module.exports = router;
