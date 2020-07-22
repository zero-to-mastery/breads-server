import requests, re, sys, json, os
# from bs4 import BeautifulSoup
from dotenv import load_dotenv
from fake_useragent import UserAgent, FakeUserAgentError
from goose3 import Goose

load_dotenv()

# BASE_URL = 'https://daedtech.com/5-things-ive-learned-in-20-years-of-programming/'

BASE_URL = sys.argv[1]
CACHED = 'https://webcache.googleusercontent.com/search?q=cache:' + BASE_URL
USER_ID = sys.argv[2]
reading = ''
title = ''
description = ''
image = ''
domain = ''
word_count = 0
special_sites = ['www.bloomberg.com'] # list of domains that registers us as robots
link_preview = os.getenv('LINK_PREVIEW_KEY')

def useragent_generator():
    fallback = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36'
    try:
        ua = UserAgent(fallback=fallback)
    except FakeUserAgentError:
        pass
    headers = str(ua.random)
    # print(headers)
    return headers

full_headers = {
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US,en;q=0.9',
    'content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Cache-Control': 'no-cache',
    'DNT': '1',
    'Origin': 'https://www.bloomberg.com',
    'Pragma': 'no-cache',
    'Referer': BASE_URL,
    'User-Agent': useragent_generator(),
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'cross-site',
    'Upgrade-Insecure-Requests': '1',
}

def get_reading_data(url, cached_url):
    global reading, title, description, image, special_sites

    try:
        g = Goose({'http_headers': full_headers})
        # g = Goose({'browser_user_agent': useragent_generator()})
        # extract info with goose
        reading = g.extract(url = url)

        # if domain is 'special' or if title/description is blank, try cached version
        if (any(domain in url for domain in special_sites) or
            (reading.title == '' or reading.meta_description == '')):
            # print('needing to cache')
            reading = g.extract(url=cached_url)
            # print(reading.title)
        
        #  if we cache and 404 error is thrown, back to normal
        if ('Error 404 (Not Found)' in reading.title):
            # print('using link preview')
            r = requests.get(f'http://api.linkpreview.net/?key={link_preview}&q={url}')
            j = r.json()
            title = j['title']
            description = j['description']
            image = j['image']
    except:
        reading = 'None'
    # print(reading)

def get_title():
    global title, description, image
    if reading != 'None' and reading.title != '' and title == '':
        if ('title' in reading.opengraph):
            title = reading.opengraph['title']
        if (title == '' and reading.title):
            title = reading.title
        
        if ('description' in reading.opengraph):
            description = reading.opengraph['description']
        if (description == '' and reading.meta_description):
            description = reading.meta_description
        
        if ('image' in reading.opengraph):
            image = reading.opengraph['image']
        if (image == '' and reading.top_image):
            image = reading.top_image
    if title == '' or 'Error 404 (Not Found)' in title:
        title = 'Unable to get title of article'
        description = ''
        image = ''
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

get_reading_data(BASE_URL, CACHED)
get_title()
get_domain()
get_word_count()

values = {
    'title': title, 
    'domain': domain,
    'description': description,
    'image': image,
    'word_count': word_count, 
    'url': BASE_URL,
    'user_id': USER_ID
}

# print(values)

# print to send data to node.js
print(json.dumps(values))