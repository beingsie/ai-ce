import requests
from bs4 import BeautifulSoup
import json
import time
import os

def scrape_index_page(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    links = soup.find_all('a')
    # Filter links that contain the specific format for angel numbers
    number_links = {link.text.strip(): link.get('href') for link in links if link.get('href') and "angel-number" in link.get('href')}
    return number_links

def scrape_number_page(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    # Targeting the specific div containing the content
    content = soup.find('div', style=lambda value: value and "text-align: left;" in value)
    # Extracting text from span tags within the div
    spans = content.find_all('span') if content else []
    meaning = ' '.join(span.text.strip() for span in spans if span.text.strip())
    return meaning if meaning else "No meaning found"

def save_data(file_name, data):
    with open(file_name, 'w') as file:
        json.dump(data, file)

def main():
    index_url = "http://sacredscribesangelnumbers.blogspot.com/p/index-numbers.html"
    number_links = scrape_index_page(index_url)
    
    file_name = 'angel_numbers_meanings.json'
    meanings = {}

    # Check if the file exists and is not empty
    if os.path.exists(file_name) and os.path.getsize(file_name) > 0:
        with open(file_name, 'r') as file:
            meanings = json.load(file)
    else:
        # If file doesn't exist or is empty, initialize it with an empty dictionary
        with open(file_name, 'w') as file:
            json.dump({}, file)

    for number, link in number_links.items():
        if number not in meanings:  # Check if the number is already scraped
            meaning = scrape_number_page(link)
            meanings[number] = meaning
            print(f"Scraped Angel Number {number}")
            save_data(file_name, meanings)  # Save data incrementally
            time.sleep(0.1)  # To prevent overwhelming the server

if __name__ == "__main__":
    main()
