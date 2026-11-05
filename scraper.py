
import json
import os

from urllib.parse import urljoin

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


# Website URL
URL = "https://books.toscrape.com/"


# Chrome browser configuration
options = webdriver.ChromeOptions()
options.add_argument("--start-maximized")

driver = webdriver.Chrome(options=options)

books = []

try:

    print("Opening website...")

    driver.get(URL)

    # Wait until books are loaded
    WebDriverWait(driver, 15).until(
        EC.presence_of_all_elements_located(
            (By.CSS_SELECTOR, "article.product_pod")
        )
    )

    # Find all books
    book_elements = driver.find_elements(
        By.CSS_SELECTOR, "article.product_pod"
    )

    print("Scraping started...")

    for book in book_elements:

        # Extract book title
        title = book.find_element(
            By.CSS_SELECTOR, "h3 a"
        ).get_attribute("title")

        # Extract price
        price = book.find_element(
            By.CSS_SELECTOR, ".price_color"
        ).text

        # Extract rating
        rating = book.find_element(
            By.CSS_SELECTOR, "p.star-rating"
        ).get_attribute("class").split()[-1]

        # Extract image URL
        image = book.find_element(
            By.CSS_SELECTOR, ".image_container img"
        ).get_attribute("src")

        image = urljoin(URL, image)

        # Extract availability
        availability = book.find_element(
            By.CSS_SELECTOR, ".availability"
        ).text.strip()

        # Store book information
        book_data = {
            "title": title,
            "price": price,
            "rating": rating,
            "image": image,
            "availability": availability
        }

        books.append(book_data)

        print("Scraped:", title)

    # Save scraped data into JSON
    output_path = os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        "frontend",
        "books.json"
    )

    with open(output_path, "w", encoding="utf-8") as file:

        json.dump(
            books,
            file,
            indent=4,
            ensure_ascii=False
        )

    print("\n-----------------------------")
    print("SCRAPING COMPLETED!")
    print("Total Books:", len(books))
    print("Data saved successfully!")
    print("-----------------------------")

except Exception as error:

    print("Scraping Error:", error)

finally:

    driver.quit()
