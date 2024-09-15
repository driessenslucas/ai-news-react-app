
# AI Technology News App

## Overview

The AI Technology News App is a React-based application that provides up-to-date news about AI and technology. It fetches news articles from an external API, caches them locally, and allows users to view details of each article. The app also handles filtering out articles with certain titles and manages content rendering efficiently.

## Features

- Fetches news articles from the News API.
- Caches news data in local storage to improve performance.
- Displays articles with titles, images, and a "Read More" button.
- View detailed content of articles in a separate view.
- Basic styling for a clean and responsive design.

## Technologies Used

- **React**: Front-end library for building user interfaces.
- **Axios**: HTTP client for making API requests.
- **React Router**: Routing library for navigation.
- **CSS**: Styling for the application.

## Getting Started

### Prerequisites

- Node.js and npm installed on your local machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/driessens-lucas/ai-news-react-app.git
   ```
2. Navigate to the project directory:
   ```bash
   cd ai-news-react-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

1. Start the development server:
   ```bash
   npm start
   ```
2. Open your browser and go to `http://localhost:3000` to see the app in action.

### API Key

To fetch news articles, you'll need an API key from [News API](https://newsapi.org/). Replace `YOUR_API_KEY` in the `.env` file with your actual API key.

```javascript
const response = await axios.get(
  `https://newsapi.org/v2/everything?q=ai+technology&apiKey=YOUR_API_KEY`
);
```

### Directory Structure

- `src/`
  - `components/` - Contains React components.
    - `News.js` - Component for displaying a list of news articles.
    - `Article.js` - Component for displaying a detailed view of a single article.
  - `App.js` - Main application component and routing configuration.
  - `index.js` - Entry point for the React application.
  - `styles/`
    - `News.css` - CSS styles for the News component.
    - `article.css` - CSS styles for the Article component.


### Contact

For any questions or issues, please contact [your-email@example.com](mailto:your-email@example.com).