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
singer_url = 'http://music.163.com/artist/desc?id=' + str(3684)

web_data = requests.get(singer_url,headers=headers)
soup = BeautifulSoup(web_data.text, 'lxml')

p = soup.select("p")[0].text
print(p)
