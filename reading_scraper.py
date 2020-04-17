import requests
from bs4 import BeautifulSoup
import re
import mysql.connector as mysql
import sys
from dotenv import load_dotenv
import os
# from gensim.summarization import summarize

load_dotenv()

####################scraping code####################
# print(sys.argv[1])
BASE_URL = sys.argv[1]
USER_ID = sys.argv[2]
# print(USER_ID)
# BASE_URL = 'https://www.artofmanliness.com_readings/sunday-firesides-build-your-life-upon-multiple-pillars-of-support/'
word_count = 0
reading = ''
title = ''
# author = ''
domain = ''
headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36'}
# response = requests.get(f'{BASE_URL}')
response = requests.get(BASE_URL, headers=headers)
soup = BeautifulSoup(response.text, 'html.parser')

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
    title_element = soup.find('h1')
    global title
    try:
        title = title_element.get_text()
    except AttributeError:
        title = 'None'
    # print(title)

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

db = mysql.connect(
    host= os.getenv('HOST'),
    user= 'root',
    passwd= os.getenv('DBPASSWORD'),
    database= os.getenv('DB'),
    auth_plugin= os.getenv('AUTHPLUGIN')
)

cursor = db.cursor()

query = 'INSERT INTO readings (title, domain, word_count, url, user_id) VALUES (%(title)s, %(domain)s, %(word_count)s, %(url)s, %(user_id)s)'
# values = (title, domain, word_count, BASE_URL, USER_ID)
values = {
    'title': title, 
    'domain': domain,
    'word_count': word_count, 
    'url': BASE_URL,
    'user_id': USER_ID
}
print(values)
cursor.execute(query, values)
db.commit()

print(cursor.rowcount, 'record inserted')