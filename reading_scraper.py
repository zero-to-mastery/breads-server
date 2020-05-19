import requests
from bs4 import BeautifulSoup
import re
import mysql.connector as mysql
import sys
from dotenv import load_dotenv
import os
from fake_useragent import UserAgent
from fake_useragent import FakeUserAgentError
from goose3 import Goose

load_dotenv()

BASE_URL = sys.argv[1]
USER_ID = sys.argv[2]

word_count = 0
reading = ''
title = ''
domain = ''

def useragent_generator():
    fallback = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36'
    try:
        ua = UserAgent(fallback=fallback)
    except FakeUserAgentError:
        pass
    headers = str(ua.random)
    return headers

def get_reading():
    global reading
    try:
        g = Goose({'browser_user_agent': useragent_generator()})
        reading = g.extract(url=BASE_URL)
    except:
        reading = 'None'
    print(reading)

def get_title():
    global title
    if reading != 'None':
        title = reading.title
    elif title == '':
        title = 'Unable to get title of article'
    print(title)

def get_domain():
    global domain
    try:
        domain = re.search(r'(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]', BASE_URL)
        domain = domain.group()
    except:
        domain = 'Unable to get domain'
    print(domain)

def get_word_count():
    global word_count
    if reading != 'None':
        word_list = reading.cleaned_text.split(' ')
    else:
        word_list = ['None']
    word_count = len(word_list)
    print(word_count)

get_reading()
get_title()
get_domain()
get_word_count()

db = mysql.connect(
    host= os.getenv('HOST') or 'localhost',
    user= os.getenv('USERNAME') or 'root',
    passwd= os.getenv('DBPASSWORD') or 'Basebal6$',
    database= os.getenv('DB') or 'articly',
    auth_plugin= os.getenv('AUTHPLUGIN')
)

cursor = db.cursor()

query = 'INSERT INTO readings (title, domain, word_count, url, user_id) VALUES (%(title)s, %(domain)s, %(word_count)s, %(url)s, %(user_id)s)'
# values = (title, domain, word_count, BASE_URL, USER_ID)
values = {
    'title': title, 
    'domain': domain,
    'word_count': word_count, 
    'url': BASE_URL,
    'user_id': USER_ID
}
print(values)
cursor.execute(query, values)
db.commit()

print(cursor.rowcount, 'record inserted')