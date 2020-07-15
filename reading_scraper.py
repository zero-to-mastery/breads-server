import requests, re, sys, json
# from requests_html import HTMLSession
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from fake_useragent import UserAgent, FakeUserAgentError
from goose3 import Goose

load_dotenv()

# session = HTMLSession()


# BASE_URL = 'https://www.bloomberg.com/news/articles/2020-06-22/schwarzman-sees-big-v-economic-rebound-over-next-few-months?sref=73c0pvQV'


# soup = BeautifulSoup(r.html, 'html.parser')
# print(soup)
BASE_URL = sys.argv[1]
CACHED = 'http://webcache.googleusercontent.com/search?q=cache:' + BASE_URL
USER_ID = sys.argv[2]
reading = ''
title = ''
domain = ''
word_count = 0
special_sites = ['www.bloomberg.com'] # list of domains that registers us as robots

def useragent_generator():
    fallback = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36'
    try:
        ua = UserAgent(fallback=fallback)
    except FakeUserAgentError:
        pass
    headers = str(ua.random)
    # print(headers)
    return headers

def get_reading_data(url, cached_url):
    global reading
    global special_sites
    try:
        g = Goose({'browser_user_agent': useragent_generator()})

        # parse article
        reading = g.extract(url = url)

        # if domain is 'special' or if title is blank, try cached version
        if (any(domain in url for domain in special_sites) or
            reading.title == ''):
            # print('needing to cache')
            reading = g.extract(url=cached_url)
            # print(reading.title)
        
        #  if we cache and 404 error is thrown, back to normal
        if ('Error 404 (Not Found)' in reading.title):
            # print('not using cache')
            reading = g.extract(url = url)
    except:
        reading = 'None'
    # print(reading)

def get_title():
    global title
    if reading != 'None' and reading.title != '':
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

# full_headers = {
#     "content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
#     "DNT": "1",
#     "Origin": 'https://' + get_domain(),
#     "Referer": BASE_URL,
#     "User-Agent": 'Googlebot-News'
#     # "User-Agent": useragent_generator()
# }
# print(full_headers)
# r = session.get(CACHED, headers = full_headers)
# r.html.render()
# print(r.html.text)

def get_word_count():
    global word_count
    if reading != 'None':
        word_list = reading.cleaned_text.split(' ')
    else:
        word_list = ['None']
    word_count = len(word_list)
    # print(word_count)

get_reading_data(BASE_URL, CACHED)
get_title()
get_domain()
get_word_count()

values = {
    'title': title, 
    'domain': domain,
    'word_count': word_count, 
    'url': BASE_URL,
    # 'user_id': USER_ID
}

# print(values)

# print to send data to node.js
print(json.dumps(values))