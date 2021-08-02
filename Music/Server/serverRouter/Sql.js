var userSQL = {
    insert: 'INSERT INTO user(email,password,name) VALUES(?,?,?)',
    queryAll: 'SELECT * FROM user', 
    getALL: 'SELECT * FROM user WHERE email = ?', 
    getID: 'SELECT * FROM user WHERE id = ?',
    updateuser:'UPDATE user SET password = ? WHERE email = ?',
    updateimage:'UPDATE user SET image = ? WHERE id = ?',
    updatainfo:'UPDATE user SET name = ?,intro = ? WHERE id = ?'
};

var singerSQL = {
    singer:'SELECT singerid,name,image FROM singer ORDER BY RAND() LIMIT 8',
    queryAll: 'SELECT singerid,name,image FROM singer LIMIT ?,?',
    count:'SELECT count(*) count FROM singer',
    queryinfo:'SELECT name,image,intro FROM singer WHERE singerid = ?',
    othersinger:'SELECT * FROM singer where singerid <> ? ORDER BY RAND() LIMIT 10',
    singerCD:'SELECT cdid,cdname,cdimage FROM cd WHERE singerid = ?'
};

var singerCDSQL = {
    queryAll: 'SELECT cdid,cdname,cdimage,singerid,singername FROM cd LIMIT ?,?',
    count:'SELECT count(*) count FROM cd',
    queryinfo:'SELECT cdname,cdimage,cdintro,singername,singerid FROM cd WHERE cdid = ?',
    otherCD:'SELECT cdid,cdname,cdimage FROM cd WHERE singerid in (SELECT singerid FROM cd WHERE cdid=?) and cdid <> ?'
};


var songlistSQL = {
    queryAll: 'SELECT slid,slname,slimage,name,user.id FROM songlist,user where songlist.userid= user.id  LIMIT ?,?',
    count:'SELECT count(*) count FROM songlist',
    insl:'INSERT INTO slandmusic(slid,mid) VALUES(?,?)',
    songlist:'SELECT * FROM songlist where userid = ?',
    delsl:'delete from slandmusic where mid = ? and slid = ?',
    delslist:'delete from songlist where slid = ?',
    delslimu:'delete from slandmusic where slid = ?',
    delcolsl:'delete from collsl where slid = ?',
    queryinfo:'SELECT slid,slname,slimage, songlist.userid,name,image,slintro FROM songlist,user WHERE songlist.userid= user.id and slid =?',
    otherlist:'SELECT slid,slname,slimage FROM songlist WHERE userid in (SELECT userid FROM songlist WHERE slid=?) and slid <> ?'
};

var musicSQL = {
    musicAsinger:'SELECT mname, src, mid, music.cdid, cdname FROM music,cd WHERE music.singerid = ? AND music.cdid = cd.cdid',
    musicinfo:'SELECT mname, mid,lyric, music.singerid,name, src,mimage,music.cdid,cdname FROM music,singer,cd where music.singerid =singer.singerid and music.cdid = cd.cdid and mid=?',
    songtatol:'SELECT mname, src, mid, music.singerid FROM music,cd WHERE music.cdid = ? AND music.cdid = cd.cdid',
    slsongs:'SELECT mname,src,mid,music.singerid,name,music.cdid,cdname FROM music,singer,cd WHERE music.mid in (SELECT mid FROM slandmusic WHERE slid =?) and singer.singerid = music.singerid and music.cdid=cd.cdid',
    othersl:'select songlist.slid,slname,slimage,user.id,name from songlist,slandmusic,user where slandmusic.slid =songlist.slid and mid = ? and user.id = songlist.userid',
    otheruser:'select userid,image from collection,user where mid = ? and user.id = collection.userid',
    creatsl:'INSERT INTO songlist(userid,slname,slimage,slintro) VALUES(?,?,?,?)',
    ranknew:'select mid,mname from music order by mdate desc limit 10',
    rankcreat:'select mid,mname from music where creat = 1 order by mdate desc limit 10 ',
    rankstore:'select mid,mname from music order by storecount desc limit 10',
    rankn:'select mid,mname,singer.singerid,name,cd.cdid,cdname from music,singer,cd where music.singerid=singer.singerid and music.cdid = cd.cdid order by mdate desc limit 15',
    rankc:'select mid,mname,singer.singerid,name,cd.cdid,cdname from music,singer,cd where music.singerid=singer.singerid and music.cdid = cd.cdid and creat = 1 order by mdate desc limit 15',
    ranks:'select mid,mname,singer.singerid,name,cd.cdid,cdname,storecount from music,singer,cd where music.singerid=singer.singerid and music.cdid = cd.cdid order by storecount desc limit 15'
}

var collectionSQL = {
    insert: 'INSERT INTO collection(mid,userid) VALUES(?,?)',
    queryex:'select mid,userid from collection where mid=? and userid=?',
    querystore:'select storecount from music where mid=?',
    updatecount:'UPDATE music SET storecount = ? WHERE mid = ?',
    collsto:'select collection.mid,mname,src,singer.singerid,name from collection,music,singer where userid=? and music.mid = collection.mid and singer.singerid = music.singerid',
    insertcsl: 'INSERT INTO collsl(slid,userid) VALUES(?,?)',
    querycsl:'select slid,userid from collsl where slid=? and userid=?',
    collsl:'select collsl.slid,slname,slimage from collsl,songlist where collsl.userid = ? and songlist.slid = collsl.slid',
    delcollsong:'delete from collection where mid = ? and userid = ?',
    mymusiccol:'select collsl.slid,slimage,slname from collsl,songlist where collsl.userid = ? and collsl.slid = songlist.slid',
    mymusiccreate:'select slid,slimage,slname from songlist where userid = ?',
    delcolsl:'delete from collsl where slid = ? and userid = ?'
}


var fansSQL = {
    isfollow:'select concer from fans where fanid = ? and concer = ?',
    follow:'INSERT INTO fans(fanid,concer) VALUES(?,?)',
    delfollow:'delete from fans where fanid = ? and concer = ?',
    fans:'select fanid from fans where concer=?',
    concer:'select concer from fans where fanid=?'
}

var replySQL={
    incomment:'INSERT INTO reply(typeid,userid,content,retype) VALUES(?,?,?,?)',
    delcomment:"delete from reply where retype = 'sl' and typeid = ?",
    showcomment:'select user.id,time,content,image,name from reply,user where user.id = reply.userid and typeid=? and retype= ?  order by time desc'
}


module.exports = {
    userSQL,
    singerSQL,
    singerCDSQL,
    songlistSQL,
    musicSQL,
    collectionSQL,
    fansSQL,
    replySQL
};