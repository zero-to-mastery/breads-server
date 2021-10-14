import requests, re, sys, json, os
from urllib.parse import unquote
from random import choice
from dotenv import load_dotenv
from fake_useragent import UserAgent, FakeUserAgentError
from goose3 import Goose

load_dotenv()
link_preview = os.getenv('LINK_PREVIEW_KEY')

# Scraper class defined here. Ctrl + F for "Scraper Logic" 
# to skip the class definition
class Scraper():
    # Since the only thing an user submits is a url,
    # we init class with url, and then gather data from there
    def __init__(self, url):
        self.url = url
        self.is_pdf = False
        self.reading = ''
        self.title = ''
        self.description = ''
        self.word_count = 0
        self.image = ''
        self.domain = ''
        self.headers = ''
        self.useragent = ''
        self.errors = []
    
    # make sure the url is valid
    @classmethod
    def transform_url(cls, url_str):
        # check first if it's valid, and if it is then return the class
        try:
            r = requests.get(url_str, timeout=10)
        except TimeoutError:
            # timeout error probably means the url is good, but there's some server issue
            return cls(url_str)
        except:
            r = ""
            pass
        if r != "" and r.status_code != 404:
            return cls(url_str)
        
        # if it's not valid, try to make it valid
        url = unquote(url_str)
        url = url.replace(" ", "%20")

        has_www = re.match(r"www\.", url)
        has_http = re.match(r"http", url)

        if has_http and not has_www:
            # print(f"transformed and unquoted url: {url}")
            return cls(url)

        if not has_www:
            url = "www." + url
        if not has_http:
            url = "https://" + url
        # retry url now that it's been "fixed"     
        try:
            r = requests.get(url, timeout=10)
        except TimeoutError:
            # timeout error probably means the url is good, but there's some server issue
            return cls(url)
        except:
            r = ""
            pass
        if r != "" and r.status_code != 404:
            return cls(url)
        # if it's still not valid, then tell the user.            
        else:
            values = ["Invalid URL.", "", "", "", 0, url_str]
            return values

    def useragent_generator(self):
        ua_list = [ # needs to have more options
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:77.0) Gecko/20100101 Firefox/77.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:77.0) Gecko/20100101 Firefox/77.0',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36',
        ]
        fallback = choice(ua_list)
        try:
            ua = UserAgent(fallback=fallback, cache=False, verify_ssl=False)
        except FakeUserAgentError:
            self.errors.append(sys.exc_info())
            # if there is an error with the package, set the user agent explicitly.
            # may end up just using this as the function.
            self.useragent = fallback
            return self.useragent
        self.useragent = str(ua.random)
        # print(headers)
        return self.useragent
    
    def get_domain(self):
        try:
            domain = re.search(r'(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]', self.url)
            domain = domain.group()
        except:
            self.domain = 'Unable to get domain'
            # print("Error occurred with getting domain: ", sys.exc_info())
            self.errors.append(sys.exc_info())
        # print(domain)
        self.domain = domain
        return self.domain

    def check_if_pdf(self):
        is_pdf = re.findall(r".pdf", self.url, flags=re.IGNORECASE)
        if len(is_pdf) > 0:
            self.is_pdf = True
        else:
            self.is_pdf = False

        return self.is_pdf

    def build_headers(self):
        headers = {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'en-US,en;q=0.9',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Cache-Control': 'no-cache',
            'DNT': '1',
            'Pragma': 'no-cache',
            'Referer': "https://www.google.com/search",
            'User-Agent': self.useragent,
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'cross-site',
            'Upgrade-Insecure-Requests': '1',
        }

        self.headers = headers

        # print(headers)

        return headers

    def get_reading_data(self):
        g = Goose({'http_headers': self.headers})
        # g = Goose({'browser_user_agent': useragent_generator()})
        # extract info with goose
        try:
            self.reading = g.extract(url = self.url)
        except:
            # print("Error occurred with 1st try getting reading data: ", sys.exc_info())
            self.reading = ''

        # if domain is 'special' or if title is blank, try cached version
        if (self.reading == '' or self.reading.title == '' 
            or '403 Forbidden' in self.reading.title
            or self.reading.title == "Bloomberg"): 
            # print('needing to cache')
            cached_url = 'https://webcache.googleusercontent.com/search?q=cache:' + self.url
            try:
                self.reading = g.extract(url=cached_url)
            except:
                # print("Error occurred with 1st try getting reading data: ", sys.exc_info())
                self.reading = ''
            # print(self.reading.title)
        
        #  if we cache and 404 error is thrown, back to normal
        if ('Not Found' in self.reading.title 
            or str(self.reading.title).startswith("https:///search?q=cache:")
            or '404' in self.reading.title
            or self.reading.title == "Bloomberg"
            or self.reading == ''):
            # print('using link preview')
            r = requests.get(f'http://api.linkpreview.net/?key={link_preview}&q={self.url}')
            j = r.json()
            # print(j)
            self.title = j['title']
            self.description = j['description']
            self.image = j['image']


        # print(reading)

    def get_title(self):
        try:
            if self.reading != 'None' and self.reading.title != '' and self.title == '':
                if ('title' in self.reading.opengraph):
                    self.title = self.reading.opengraph['title'].replace("\\u2019", "'")
                if (self.title == '' and self.reading.title):
                    self.title = self.reading.title.replace("\\u2019", "'")
                
                if ('description' in self.reading.opengraph):
                    self.description = self.reading.opengraph['description'].replace("\\u2019", "'")
                if (self.description == '' and self.reading.meta_description):
                    self.description = self.reading.meta_description.replace("\\u2019", "'")
                # if we still can't get a description, then just use the first 500 characters of text.
                if (self.description == '' and self.reading.cleaned_text):
                    self.description = self.reading.cleaned_text.replace("\\u2019", "'")
                if (len(self.description) > 500):
                    self.description = (self.description[:497] + '...')
                
                if ('image' in self.reading.opengraph):
                    self.image = self.reading.opengraph['image']
                if (self.image == '' and self.reading.top_image):
                    self.image = self.reading.top_image
        except:
            # print("Error occurred with getting title: ", sys.exc_info())
            self.title = ""
        
        if (self.title == '' 
            or 'Error 404 (Not Found)' in self.title
            or 'Bad Request' in self.title
            or self.title == "Redirecting"
            or "Page Not Found" in self.title):
                self.title = 'Unable to get title of article'
                self.description = ''
                self.image = ''
        # print(title)

    def get_word_count(self):
        try:
            if self.reading != 'None':
                word_list = self.reading.cleaned_text.split(' ')
            else:
                word_list = ['None']
            self.word_count = len(word_list)
        except:
            self.word_count = 0
            self.errors.append(sys.exc_info())
        # print(word_count)

# Scraper Logic
BASE_URL = sys.argv[1]
base_scrape = Scraper.transform_url(BASE_URL)
if isinstance(base_scrape, list):
    values = ["Invalid URL.", "", "", "", 0, BASE_URL]
    print(json.dumps(values))
    sys.exit()

base_scrape.useragent_generator()
base_scrape.build_headers()
base_scrape.get_domain()
base_scrape.get_reading_data()
base_scrape.get_title()
base_scrape.get_word_count()

values = [
    base_scrape.title, 
    base_scrape.domain,
    base_scrape.description,
    base_scrape.image,
    base_scrape.word_count, 
    BASE_URL.replace("\n", "")
]

# print(values)
# print to send data to node.js
print(json.dumps(values))