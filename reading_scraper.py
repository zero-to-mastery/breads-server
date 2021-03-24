import requests, re, sys, json, os, time
from urllib.parse import unquote

# dependencies for reading scraper
from dotenv import load_dotenv
from fake_useragent import UserAgent, FakeUserAgentError
from goose3 import Goose

# dependencies for headless browser
from bs4 import BeautifulSoup
from selenium import webdriver
from splinter import Browser
from random import seed, random, choice
from collections import Counter
from string import punctuation

load_dotenv()

link_preview = os.getenv('LINK_PREVIEW_KEY')
chromedriver_dir = os.getenv("CHROMEDRIVER_DIR")

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

    def auto_browser(self):
        # define the location of the Chrome Driver
        executable_path = {'executable_path': chromedriver_dir}

        # Create a new instance of the browser. Leave Headless as False, as it seems to help with bot detection
        options = webdriver.ChromeOptions() 
        options.add_argument("start-maximized")
        options.add_experimental_option("excludeSwitches", ["enable-automation"])
        options.add_experimental_option('useAutomationExtension', False)
        browser = Browser('chrome', **executable_path, headless=False, incognito=True, options=options, user_agent=self.useragent)
        # remove some flags for bot detection
        browser.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

        time.sleep(random()+random()*10+1)
        # go to the URL
        try:
            browser.visit(self.url)
        except:
            # print("Error occurred visiting url: ", sys.exc_info())
            self.title = ''
            self.description = ''
            self.image = ''
            self.word_count = 0
            self.domain = ''
            return
        seed(1)

        try:
            # quit if we find a recaptcha, but add a specific title 
            # so that we can search the db later and try to find entries
            # stopped by recaptcha
            if browser.is_element_present_by_id("rc-anchor-container", wait_time=5):
                browser.quit()
                self.reading = ''
                self.title = ""
                self.description = "Looks like we had an issue getting that content! We'll try again in a minute or two, though!"
                self.image = "" # hosted face palm emoji jpg maybe?
                self.word_count = 0
                return
        except:
            # print("Error occurred looking for captcha: ", sys.exc_info())
            pass
        
        # scroll through page with random intervals to trigger any lazy loading
        time.sleep(random()+random()*10+2)
        try:
            browser.execute_script("var main = document.querySelector('main'); if(main){main.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'nearest'})};")
            browser.execute_script("var main = document.querySelector('#main'); if(main){main.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'nearest'})};")
            browser.execute_script("var main = document.querySelector('.main'); if(main){main.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'nearest'})};")
        except:
            # print("Error occurred triggering lazy loading: ", sys.exc_info())
            pass
        
        time.sleep(random()+random()*10+2)

        try:
            browser.execute_script("var footer = document.querySelector('footer'); if(footer){footer.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'nearest'})};")
            browser.execute_script("var footer = document.querySelector('#footer'); if(footer){footer.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'nearest'})};")
            browser.execute_script("var footer = document.querySelector('.footer'); if(footer){footer.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'nearest'})};")
        except:
            # print("Error occurred triggering lazy loading: ", sys.exc_info())
            pass
        
        time.sleep(random()+random()*10+2)
        try:
            browser.execute_script("var header = document.querySelector('header'); if(header){header.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'nearest'})};")
            browser.execute_script("var header = document.querySelector('#header'); if(header){header.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'nearest'})};")
            browser.execute_script("var header = document.querySelector('.header'); if(header){header.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'nearest'})};")
        except:
            # print("Error occurred triggering lazy loading: ", sys.exc_info())
            pass
        time.sleep(random()+random()*10+2)

        # grab html
        html = browser.html
        browser.quit()

        # create soup object out of cleaned html
        soup = BeautifulSoup(html, "lxml")

        # get title
        try:
            title_tag = soup.find("meta", property="og:title")
            self.title = title_tag['content']
        except:
            try:
                self.title = str(soup.title.string).strip()
                if self.title and len(self.title) >= 1:
                    pass
                else:
                    self.title = "Unable to get title"
            except:
                self.title = "Unable to get title"
        
        # get description
        try:
            description_tag = soup.find("meta", property="og:description")
            self.description = description_tag['content']
            if len(self.description) < 1:
                description_tag = soup.find("meta", attr={"name":"description"})
                self.description = description_tag['content']
            if len(self.description) < 1:
                description_tag = soup.find("meta", attr={"name":"twitter:description"})
                self.description = description_tag['content']
        except:
            # print("can't find description")
            # use first 500 words of text instead
            p_tags = soup.findAll('p')
            for tag in p_tags:
                try:
                    text = tag.getText()
                except:
                    text = ""
                self.description += text + " "
        if (len(self.description) > 150):
            self.description = (self.description[:147] + '...')

        # get image
        try:
            image_tag = soup.find("meta", property="og:image")
            self.image = image_tag['content']
            if not self.image:
                # print("no og tag for image")
                try:
                    image_tag = soup.find("img").get('src')
                    self.image = image_tag
                except:
                    self.image = ''
        except:
            self.image = '' # might think about a generic image so it's not blank

        # Word Count
        # Get the words within paragrphs
        text_p = (''.join(s.findAll(text=True))for s in soup.findAll('p'))
        c_p = Counter((x.rstrip(punctuation).lower() for y in text_p for x in y.split()))

        # Sum all the values of the counter
        total = list(c_p.values())
        for num in total:
            self.word_count += num

# Scraper Logic

BASE_URL = sys.argv[1]
base_scrape = Scraper.transform_url(BASE_URL)
if isinstance(base_scrape, list):
    values = ["Invalid URL.", "", "", "", 0, BASE_URL]
    print(json.dumps(values))
    sys.exit()
check = base_scrape.check_if_pdf()
if check:
    # send to pdf scraper, which should return the values array,
    # so we end the script here.
    sys.exit()
base_scrape.useragent_generator()
base_scrape.build_headers()
base_scrape.get_domain()
base_scrape.get_reading_data()
base_scrape.get_title()
base_scrape.get_word_count()

if ('Unable to get title of article' in base_scrape.title
    or 'Bloomberg - Are you a robot?' in base_scrape.title
    or "Access Denied" in base_scrape.title
    or "Error" in base_scrape.title
    or "ERROR" in base_scrape.title
    or base_scrape.title.startswith("https:///search?q=cache:")):
        # wait a minute, since we just did a few calls to the site and they failed.
        # Doing that to avoid bot detection
        time.sleep(60)
        base_scrape.auto_browser()

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