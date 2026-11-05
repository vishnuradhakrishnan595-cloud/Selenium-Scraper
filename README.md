# 📚 Selenium Book Scraper

A Python web scraping project using Selenium to extract book details from [Books to Scrape](https://books.toscrape.com/) and display them in a responsive dashboard.

## 🚀 Features
- Scrape book titles, prices, ratings and images.
- Extract availability status.
- Store scraped data in JSON.
- Interactive dashboard with search and filters.
- Sort books by price and title.
- Responsive frontend design.

## 🛠️ Technologies
- Python
- Selenium
- HTML5, CSS3, JavaScript
- JSON

## 📁 Project Structure

```text
Selenium-Scraper/
├── scraper.py
├── README.md
└── frontend/
    ├── index.html
    ├── style.css
    ├── script.js
    └── books.json
```

## ⚙️ Installation

```bash
git clone https://github.com/vishnuradhakrishnan595-cloud/Selenium-Scraper.git
cd Selenium-Scraper
python -m venv env
env\Scripts\activate
pip install selenium
```

## ▶️ Run Project

Run the scraper:

```bash
python scraper.py
```

Start the frontend:

```bash
cd frontend
python -m http.server 5500
```

Open `http://localhost:5500` in your browser.


⭐ Built for learning Python web scraping and frontend development.