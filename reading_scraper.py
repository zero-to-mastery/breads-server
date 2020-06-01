import requests, re, sys, json
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from fake_useragent import UserAgent, FakeUserAgentError
from goose3 import Goose

load_dotenv()

BASE_URL = sys.argv[1]
USER_ID = sys.argv[2]
reading = ''
title = ''
domain = ''
word_count = 0

def useragent_generator():
    fallback = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36'
    try:
        ua = UserAgent(fallback=fallback)
    except FakeUserAgentError:
        pass
    headers = str(ua.random)
    return headers

def get_reading_data():
    global reading
    try:
        g = Goose({'browser_user_agent': useragent_generator()})
        reading = g.extract(url=BASE_URL)
    except:
        reading = 'None'
    # print(reading)

def get_title():
    global title
    if reading != 'None':
        title = reading.title
    elif title == '':
        title = 'Unable to get title of article'
    # print(title)

def get_domain():
    global domain
    try:
        domain = re.search(r'(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]', BASE_URL)
        domain = domain.group()
    except:
        domain = 'Unable to get domain'
    # print(domain)

def get_word_count():
    global word_count
    if reading != 'None':
        word_list = reading.cleaned_text.split(' ')
    else:
        word_list = ['None']
    word_count = len(word_list)
    # print(word_count)

get_reading_data()
get_title()
get_domain()
get_word_count()

values = {
    'title': title, 
    'domain': domain,
    'word_count': word_count, 
    'url': BASE_URL,
    'user_id': USER_ID
}

# print to send data to node.js
print(json.dumps(values))