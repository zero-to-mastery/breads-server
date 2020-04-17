import requests
from bs4 import BeautifulSoup
import sys
from dotenv import load_dotenv
from gensim.summarization import summarize

load_dotenv()

####################scraping code####################
# print(sys.argv[1])
BASE_URL = sys.argv[1]
# BASE_URL = 'https://www.artofmanliness.com/articles/sunday-firesides-build-your-life-upon-multiple-pillars-of-support/'
reading = ''
summary = ''
headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36'}
# response = requests.get(f'{BASE_URL}')
response = requests.get(BASE_URL, headers=headers)
soup = BeautifulSoup(response.text, 'html.parser')

def get_reading():
    paragraphs = soup.find_all('p')
    all_words = [tag.get_text().strip() for tag in paragraphs]
    # Filter out sentences that contain newline characters '\n' or don't contain periods.
    sentence_list = [sentence for sentence in all_words if not '\n' in sentence]
    sentence_list = [sentence for sentence in sentence_list if '.' in sentence]
    # Combine list items into string.
    global reading
    reading = ' '.join(sentence_list)
    # print(reading)

def get_summary():
    global summary
    summary = summarize(reading, ratio=0.3)
    print(summary)
    # print(len(summary))

get_reading()
get_summary()