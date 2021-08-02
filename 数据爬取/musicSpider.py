# -*- coding:utf-8 -*-
import requests
import json
import re
from bs4 import BeautifulSoup
import pymysql

headers={
			'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
			'Accept-Language': 'zh-CN,zh;q=0.8',
			'Referer': 'https: // wuhan.anjuke.com / sale /?from=navigation',
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36'
		}

db = pymysql.connect(host='localhost',user='root',password='root',port=3306,db='hdymusic')
cursor = db.cursor()
sql="CREATE TABLE IF NOT EXISTS `message` (\
		`mname` varchar(100) COLLATE utf8_bin NOT NULL,\
		`url` varchar(200) COLLATE utf8_bin NOT NULL,\
		`ath` varchar(50) COLLATE utf8_bin NOT NULL,\
		`lrc` varchar(3000) COLLATE utf8_bin NOT NULL\
)"
try:
	cursor.execute(sql)
except Exception as e:
	pass
sql2="INSERT INTO music(mname,url,ath,lrc) VALUES(%s,%s,%s,%s)"


singer_url = 'http://music.163.com/artist?id=' + str(6731)
web_data = requests.get(singer_url,headers=headers)
soup = BeautifulSoup(web_data.text, 'lxml')
singer_name = soup.select("#artist-name")
r = soup.find('ul', {'class': 'f-hide'}).find_all('a')
r = (list(r))
print(r)
music_id_set=[]
message=[]
for each in r:
	song_name = each.text  # 歌曲名
	song_id = each.attrs["href"]
	song_lrc = song_id[9:]
	music_id_set.append(song_id[9:])
	song_url = "http://music.163.com/song/media/outer/url?id="+str(song_lrc)+".mp3"
	print(song_url)
	lrc_url = 'http://music.163.com/api/song/lyric?' + 'id=' + str(song_lrc) + '&lv=1&kv=1&tv=-1'
	print(lrc_url)
	lyric = requests.get(lrc_url,headers=headers)
	json_obj = lyric.text
	j = json.loads(json_obj)
	lrc=j['lrc']['lyric']
	message.append(song_name)
	message.append(song_url)
	message.append("赵雷")
	message.append(lrc)
	#cursor.execute(sql2,message)
	db.commit()
	print("**********"+song_name+"***********")
	print(lrc)
	# print("***************************************")
print(music_id_set)
# for each1 in music_id_set:
# 	lrc_url = 'http://music.163.com/api/song/lyric?' + 'id=' + str(each1) + '&lv=1&kv=1&tv=-1'
# 	lyric = requests.get(lrc_url)
# 	json_obj = lyric.text
# 	j = json.loads(json_obj)
# 	lrc = j['lrc']['lyric']
# 	print(lrc)
	# pat = re.compile(r'\[.*\]')
	# lrc = re.sub(pat, "", lrc)
	# lrc = lrc.strip()
	# print(lrc)
	# print("***********************************************")