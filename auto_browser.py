import requests, re, sys, json, os, time
from urllib.parse import unquote

from bs4 import BeautifulSoup
from selenium import webdriver
from splinter import Browser
from random import seed, random
from collections import Counter
from string import punctuation
from fake_useragent import UserAgent, FakeUserAgentError

from dotenv import load_dotenv

load_dotenv()

chromedriver_dir = os.getenv("CHROMEDRIVER_DIR")

title = ''
description = ''
image = ''
word_count = 0
domain = ''

def get_domain(url):
    global domain
    res = ''
    try:
        domain = re.search(r'(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]', url)
        domain = domain.group()
    except:
        domain = 'Unable to get domain'
        # print("Error occurred with getting domain: ", sys.exc_info())
    # print(domain)
    res = domain
    return res

def useragent_generator():
    fallback = 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Mobile Safari/537.36'
    try:
        ua = UserAgent(fallback=fallback)
    except FakeUserAgentError:
        pass
    headers = str(ua.random)
    # print(headers)
    return headers

def auto_browser(url):
    global title, description, image, word_count, domain
    # define the location of the Chrome Driver
    executable_path = {'executable_path': chromedriver_dir}

    # Create a new instance of the browser. Leave Headless as False, as it seems to help with bot detection
    options = webdriver.ChromeOptions() 
    options.add_argument("start-maximized")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option('useAutomationExtension', False)
    browser = Browser('chrome', **executable_path, headless=False, incognito=True, options=options, user_agent=useragent_generator())
    # remove some flags for bot detection
    browser.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

    time.sleep(random()+random()*10+1)
    # go to the URL
    try:
        browser.visit(url)
    except:
        # print("Error occurred visiting url: ", sys.exc_info())
        title = ''
        description = ''
        image = ''
        word_count = 0
        domain = ''
        return
    seed(1)

    try:
        # quit if we find a recaptcha, but add a specific title 
        # so that we can search the db later and try to find entries
        # stopped by recaptcha
        if browser.is_element_present_by_id("rc-anchor-container", wait_time=5):
            browser.quit()
            title = "Whoops!" # probably should be something different
            description = "Looks like we had an issue getting that content! We'll try again in a minute or two, though!"
            image = "" # hosted face palm emoji jpg maybe?
            word_count = 0
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

    # create soup object out of html
    soup = BeautifulSoup(html, "lxml")

    # get title
    try:
        title_tag = soup.find("meta", property="og:title")
        title = title_tag['content']
    except:
        try:
            title = str(soup.title.string).strip()
            if title and len(title) >= 1:
                pass
            else:
                title = "Unable to get title"
        except:
            title = "Unable to get title"
    
    # get description
    try:
        description_tag = soup.find("meta", property="og:description")
        description = description_tag['content']
        if len(description) < 1:
            description_tag = soup.find("meta", attr={"name":"description"})
            description = description_tag['content']
    except:
        # print("can't find description")
        description = ''

    # get image
    try:
        image_tag = soup.find("meta", property="og:image")
        image = image_tag['content']
        if not image:
            # print("no og tag for image")
            try:
                image_tag = soup.find("img").get('src')
                image = image_tag
            except:
                image = ''
    except:
        image = '' # might think about a generic image so it's not blank

    # get domain
    domain = get_domain(url)
    
    # Word Count
    # Get the words within paragrphs
    text_p = (''.join(s.findAll(text=True))for s in soup.findAll('p'))
    c_p = Counter((x.rstrip(punctuation).lower() for y in text_p for x in y.split()))

    # Sum all the values of the counter
    total = list(c_p.values())
    for num in total:
        word_count += num

    values = [
        title, 
        domain,
        description,
        image,
        word_count, 
        url
    ]

    # print to send data to node.js
    print(json.dumps(values))