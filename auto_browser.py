#headless-browser-scraper 
import requests
import time
import sys
import os
import itertools
import lxml.html as lh
from lxml.html.clean import Cleaner

from bs4 import BeautifulSoup
from splinter import Browser
from random import seed, random

from dotenv import load_dotenv

load_dotenv()

CHROMEDRIVER_DIR = os.getenv("CHROMEDRIVER_DIR")

# define the location of the Chrome Driver
executable_path = {'executable_path': CHROMEDRIVER_DIR}

# Create a new instance of the browser. For dev purposes, make sure we can see it (Headless = False)
# Headless = True for production
browser = Browser('chrome', **executable_path, headless=False)

# define the components to build a URL
method = 'GET'

# build the URL and store it in a new variable
p = requests.Request(method, url).prepare()
myurl = p.url

# go to the URL
browser.visit(myurl)
seed(1)
# scroll through page with random intervals to trigger any lazy loading
time.sleep(random()+random()*10+2)
browser.execute_script("var main = document.querySelector('main'); main.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'nearest'});")
time.sleep(random()+random()*10+2)
browser.execute_script("var footer = document.querySelector('footer'); footer.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'nearest'});")
time.sleep(random()+random()*10+2)
browser.execute_script("var header = document.querySelector('header'); header.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'nearest'});")

# grab html
html = browser.html
doc = lh.fromstring(html)

# remove ads and other scripts
cleaner = Cleaner(page_structure=False, links=True)
doc = cleaner.clean_html(html)
doc = lh.fromstring(doc)

# create soup object out of cleaned html
soup = BeautifulSoup(doc, "lxml")

print(soup)