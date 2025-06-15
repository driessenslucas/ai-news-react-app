# AI Technology News App

## Overview

The AI Technology News App is a full-stack React + Node.js application that scrapes and displays AI-related news articles. It fetches articles from external sources, processes them, and renders them in a clean, readable format.

⚠️ **Important Notes About Scraping**

- Articles are fetched via a backend scraper that extracts full article content using [Mozilla Readability](https://github.com/mozilla/readability).
- The scraper may occasionally fail or produce incomplete results depending on how the target website structures its HTML.
- This project is for **educational/demo purposes**. Scraping third-party websites may violate their terms of service. Use responsibly.

---

## Features

- Fetches news from an external API using a backend scraper.
- Extracts readable article content using a virtual DOM and Readability.
- Displays articles with title, excerpt, and full content.
- `.env`-based configuration for secure API key management.
- Local development via Docker and `docker-compose`.

---

## Technologies Used

- **Frontend:** React, Axios, React Router
- **Backend:** Node.js
- **DevOps:** Docker, Docker Compose
- **Styling:** CSS (Modular)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- News API Key from [newsapi.org](https://newsapi.org/)

---

## Local Development

### 1. Clone the Repository

```bash
git clone https://github.com/driessens-lucas/ai-news-react-app.git
cd ai-news-react-app
````

---

### 2. Add API Key

Create a `.env` file inside the `frontend/` directory:

```bash
touch frontend/.env
```

Then add your News API key:

```env
REACT_APP_API_KEY=your-api-key-here
```

---

### 3. Run with Docker

```bash
docker-compose build --no-cache
docker-compose up
```

This will start both the backend and frontend:

- Frontend: http://localhost:3000

- Backend: http://localhost:5600


---

## License

MIT