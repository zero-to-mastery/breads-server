import requests
from bs4 import BeautifulSoup
import re
import mysql.connector as mysql
import sys
from dotenv import load_dotenv
import os
from fake_useragent import UserAgent
from fake_useragent import FakeUserAgentError
from random import choice

load_dotenv()

def useragent_generator():
    fallback = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36'
    try:
        ua = UserAgent(fallback=fallback)
    except FakeUserAgentError:
        pass
    headers = {'User-Agent': str(ua.random)}
    print(headers)
    return headers

def proxy_generator():
    response = requests.get('https://sslproxies.org/')
    soup = BeautifulSoup(response.content, 'html.parser')
    ips = soup.findAll('td')[::8]
    ports = soup.findAll('td')[1::8]
    # convert ips and ports to text, combine into tuple to turn into full IP string, and make into a list
    addresses = list(map(lambda x:x[0]+':'+x[1], list(zip(map(lambda x:x.text, ips), map(lambda x:x.text, ports)))))
    proxy = {'https': choice(addresses)}
    print(proxy)
    return proxy

def data_scraper(url, **kwargs):
    while True:
        try:
            proxy = proxy_generator()
            header = useragent_generator()
            response = requests.request('get', url, headers=header, proxies=proxy, timeout=7, **kwargs)
            break
            # if the request is successful, no exception is raised
        except:
            print('Connection error, looking for another proxy')
            pass
    return response

# print(sys.argv[1])
# BASE_URL = sys.argv[1]
# USER_ID = sys.argv[2]
# print(USER_ID)

# BASE_URL = 'https://www.bloomberg.com/news/articles/2020-05-17/hsbc-citi-speed-up-digital-push-to-ward-off-asian-upstarts?srnd=premium&sref=73c0pvQV'
BASE_URL = 'https://www.espn.com/golf/story/_/id/29187617/mcilroy-johnson-dispatch-wolff-fowler-return-live-golf-tv'
word_count = 0
reading = ''
title = ''
domain = ''

data = data_scraper(BASE_URL)
soup = BeautifulSoup(data.text, 'html.parser')
# print(soup)

def get_reading():
    try:
        paragraphs = soup.find_all('p')
    except AttributeError:
        paragraphs = 'None'
    all_words = [tag.get_text().strip() for tag in paragraphs]
    # Filter out sentences that contain newline characters '\n' or don't contain periods.
    sentence_list = [sentence for sentence in all_words if not '\n' in sentence]
    sentence_list = [sentence for sentence in sentence_list if '.' in sentence]
    # Combine list items into string.
    global reading
    reading = ' '.join(sentence_list)
    # print_reading)

def get_title():
    title_elements = soup.find_all('h1')
    #filter out h1 that are the same as domain ###################
    # if no h1, look for h2
    global title
    try:
        title_texts = map(lambda t: t.get_text(), title_elements)
        title = max(list(title_texts), key=len)
        print(title)
        # if title = '', set to 'None' ###############
    except AttributeError: # if there was no h1 element, make title 'None'
        title = 'None'

def get_domain():
    global domain
    domain = re.search(r'(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]', BASE_URL)
    domain = domain.group()
    # print(domain)

def get_word_count():
    # word_string = ''.join([str(word.get_text()) for word in reading])
    global word_count
    # word_count = len(word_string)
    word_count = len(reading)
    # print(word_count)

# def get_author():
#     # pattern = re.compile(r'author')
#     global author
#     author = soup.find(class_ = 'author')
#     print(author.get_text())

get_reading()
get_title()
get_domain()
get_word_count()

# get_summary()

###############connect to db###############

# db = mysql.connect(
#     host= os.getenv('HOST') or 'localhost',
#     user= os.getenv('USERNAME') or 'root',
#     passwd= os.getenv('DBPASSWORD') or 'Basebal6$',
#     database= os.getenv('DB') or 'articly',
#     auth_plugin= os.getenv('AUTHPLUGIN')
# )

# cursor = db.cursor()

# query = 'INSERT INTO readings (title, domain, word_count, url, user_id) VALUES (%(title)s, %(domain)s, %(word_count)s, %(url)s, %(user_id)s)'
# # values = (title, domain, word_count, BASE_URL, USER_ID)
# values = {
#     'title': title, 
#     'domain': domain,
#     'word_count': word_count, 
#     'url': BASE_URL,
#     'user_id': USER_ID
# }
# print(values)
# cursor.execute(query, values)
# db.commit()

# print(cursor.rowcount, 'record inserted')