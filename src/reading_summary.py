import requests
from bs4 import BeautifulSoup
import sys
from dotenv import load_dotenv
from gensim.summarization import summarize
from fake_useragent import UserAgent
from fake_useragent import FakeUserAgentError
from goose3 import Goose

load_dotenv()

BASE_URL = sys.argv[1]
body = ''
summary = ''

def useragent_generator():
    fallback = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36'
    try:
        ua = UserAgent(fallback=fallback)
    except FakeUserAgentError:
        pass
    headers = str(ua.random)
    return headers

def get_reading():
    global body
    try:
        g = Goose({'browser_user_agent': useragent_generator()})
        reading = g.extract(url=BASE_URL)
        body = reading.cleaned_text
    except:
        body = 'None'

def get_summary():
    global summary
    summary = summarize(body, word_count=500)
    print(summary)

get_reading()
get_summary()