import requests, re, sys, json, os
from urllib.parse import unquote
# from bs4 import BeautifulSoup
from dotenv import load_dotenv
from fake_useragent import UserAgent, FakeUserAgentError
from goose3 import Goose

from auto_browser import auto_browser

load_dotenv()

# BASE_URL = 'https://daedtech.com/5-things-ive-learned-in-20-years-of-programming/'

reading = ''
title = ''
description = ''
image = ''
domain = ''
word_count = 0
special_sites = ['www.bloomberg.com'] # list of domains that registers us as robots
link_preview = os.getenv('LINK_PREVIEW_KEY')
chromdriver_dir = os.getenv("CHROMEDRIVER_DIR")

# fixes a lot of the issues with goose 
# package failing to scrape
def transform_url(url):
    url = unquote(url)
    url = url.replace(" ", "%20")

    has_www = re.match(r"www\.", url)
    has_http = re.match(r"http", url)

    if has_http and not has_www:
        # print(f"transformed and unquoted url: {url}")
        return url

    if not has_www:
        url = "www." + url
    if not has_http:
        url = "https://" + url
    
    # print(f"transformed and unquoted url: {url}")

    return url

def useragent_generator():
    fallback = 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Mobile Safari/537.36'
    try:
        ua = UserAgent(fallback=fallback)
    except FakeUserAgentError:
        pass
    headers = str(ua.random)
    # print(headers)
    return headers

def check_if_pdf(url):
    is_pdf = re.findall(r".pdf", url, flags=re.IGNORECASE)
    # print(is_pdf)
    if len(is_pdf) > 0:
        # print("it's a pdf")
        # go to pdf scraper
        return True
    else:
        return False

def get_reading_data(url, cached_url):
    global reading, title, description, image

    full_headers = {
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US,en;q=0.9',
    'content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Cache-Control': 'no-cache',
    'DNT': '1',
    'Pragma': 'no-cache',
    'Referer': "https://www.google.com/search",
    'User-Agent': useragent_generator(),
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'cross-site',
    'Upgrade-Insecure-Requests': '1',
    }

    
    g = Goose({'http_headers': full_headers})
    # g = Goose({'browser_user_agent': useragent_generator()})
    # extract info with goose
    try:
        reading = g.extract(url = url)
    except:
        print("Error occurred with 1st try getting reading data: ", sys.exc_info())
        reading = ''

    # if domain is 'special' or if title is blank, try cached version
    if (reading == '' or reading.title == '' 
        or '403 Forbidden' in reading.title
        or "Bloomberg" in reading.title): 
        # or any(domain in url for domain in special_sites)):
        print('needing to cache')
        # update header to refer from google
        full_headers = {
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'en-US,en;q=0.9',
            'content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Cache-Control': 'no-cache',
            'DNT': '1',
            'Pragma': 'no-cache',
            'Referer': 'https://www.google.com/',
            'User-Agent': useragent_generator(),
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'cross-site',
            'Upgrade-Insecure-Requests': '1',
        }
        try:
            reading = g.extract(url=cached_url)
        except:
            print("Error occurred with 1st try getting reading data: ", sys.exc_info())
            reading = ''
        # print(reading.title)
    
    #  if we cache and 404 error is thrown, back to normal
    if ('Not Found' in reading.title 
        or str(reading.title).startswith("https:///search?q=cache:")
        or '404' in reading.title
        or "Bloomberg" in reading.title
        or reading == ''):
        print('using link preview')
        r = requests.get(f'http://api.linkpreview.net/?key={link_preview}&q={url}')
        j = r.json()
        print(j)
        title = j['title']
        description = j['description']
        image = j['image']

    # print(reading)

def get_title():
    global title, description, image
    try:
        if reading != 'None' and reading.title != '' and title == '':
            if ('title' in reading.opengraph):
                title = reading.opengraph['title'].replace("\\u2019", "'")
            if (title == '' and reading.title):
                title = reading.title.replace("\\u2019", "'")
            
            if ('description' in reading.opengraph):
                description = reading.opengraph['description'].replace("\\u2019", "'")
            if (description == '' and reading.meta_description):
                description = reading.meta_description.replace("\\u2019", "'")
            if (len(description) > 500):
                description = (description[:497] + '...')
            
            if ('image' in reading.opengraph):
                image = reading.opengraph['image']
            if (image == '' and reading.top_image):
                image = reading.top_image
    except:
        print("Error occurred with getting title: ", sys.exc_info())
        title = ""
    if (title == '' 
        or 'Error 404 (Not Found)' in title
        or 'Bad Request' in title
        or title == "Redirecting"
        or "Page Not Found" in title):
        title = 'Unable to get title of article'
        description = ''
        image = ''
    # print(title)

def get_domain(url):
    global domain
    res = ''
    try:
        domain = re.search(r'(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]', url)
        domain = domain.group()
    except:
        domain = 'Unable to get domain'
        print("Error occurred with getting domain: ", sys.exc_info())
    # print(domain)
    res = domain
    return res

def get_word_count():
    global word_count
    try:
        if reading != 'None':
            word_list = reading.cleaned_text.split(' ')
        else:
            word_list = ['None']
        word_count = len(word_list)
    except:
        word_count = 0
    # print(word_count)

BASE_URL = transform_url(sys.argv[1])

CACHED = 'https://webcache.googleusercontent.com/search?q=cache:' + BASE_URL

check = check_if_pdf(BASE_URL)

if check:
    # send to scraper, and let that script create values array
    sys.exit()

get_reading_data(BASE_URL, CACHED)
get_title()
get_domain(BASE_URL)
get_word_count()

if ('Unable to get title of article' in title
    or 'Bloomberg - Are you a robot?' in title
    or "Access Denied" in title
    or "Error" in title
    or "ERROR" in title):
        # retry these from the webdriver,
        # which dumps the values array instead
        auto_browser(BASE_URL)
        sys.exit()

values = [
    title, 
    domain,
    description,
    image,
    word_count, 
    BASE_URL
]

# print(values)

# print to send data to node.js
print(json.dumps(values))