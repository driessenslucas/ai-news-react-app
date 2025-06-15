// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import '../styles/News.css'; // Import the updated CSS file

// const CACHE_KEY = 'cachedNews'; // Key for localStorage
// const CACHE_EXPIRATION_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

// const News = () => {
//   const [news, setNews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate(); // Hook to navigate to new pages

//   useEffect(() => {
//     const cachedNews = localStorage.getItem(CACHE_KEY);

//     if (cachedNews) {
//       const parsedNews = JSON.parse(cachedNews);
//       const now = new Date().getTime();

//       if (now - parsedNews.timestamp < CACHE_EXPIRATION_TIME) {
//         setNews(parsedNews.data);
//         setLoading(false);
//         return;
//       }
//     }

//     const fetchNews = async () => {
//       try {
//         const response = await axios.get(
//           `https://newsapi.org/v2/everything?q=technology&apiKey=` + process.env.REACT_APP_API_KEY
//         );
//         const fetchedNews = response.data.articles;

//         localStorage.setItem(
//           CACHE_KEY,
//           JSON.stringify({
//             timestamp: new Date().getTime(),
//             data: fetchedNews,
//           })
//         );

//         setNews(fetchedNews);
//       } catch (error) {
//         console.error("Error fetching the news:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNews();
//   }, []);

//   const goToArticle = (index) => {
//     navigate(`/article/${index}`);
//   };

//   const filteredNews = news.filter(article => !article.title.includes('[Removed]'));

//   return (
//     <div className="newspaper">
//       <header className="newspaper-header">
//         <h1 className="newspaper-title">AI NEWS</h1>
//         {/* <p className="newspaper-subtitle">York, MA - Thursday August 30, 1978 - Seven Pages</p> */}
//       </header>
//       {/* <section>
//         <div className="weatherforcastbox">
//           <span style={{ fontStyle: 'italic' }}>Weatherforecast for the next 24 hours: Plenty of Sunshine</span><br />
//           <span>Wind: 7km/h SSE; Ther: 21°C; Hum: 82%</span>
//         </div>
//       </section> */}

//       <main className="main-content">
//         {loading ? (
//           <div className="loading">Loading...</div>
//         ) : (
//           <div className="news-container">
//             {filteredNews.map((article, index) => (
//               <div key={index} className="news-item">
//                 <img className="news-image" src={article.urlToImage} alt="News" />
//                 <div className="news-content">
//                   <h2 className="news-title">{article.title}</h2>
//                   <button onClick={() => goToArticle(index)}>Read More</button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </main>

//        <footer className="footer">
//          <p>© 2025 AI News. All rights reserved.</p>
//          <p>Last updated: {new Date().toLocaleString()}</p>
//        </footer>
//     </div>
//   );
// }

// export default News;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/News.css';

const CACHE_KEY = 'cachedNews';
const CACHE_EXPIRATION_TIME = 60 * 60 * 1000; // 1 hour
const API_URL = 'https://newsapi.org/v2/everything?q=technology';
const API_KEY = process.env.REACT_APP_API_KEY;

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const cachedNews = localStorage.getItem(CACHE_KEY);

    if (cachedNews) {
      const parsed = JSON.parse(cachedNews);
      const now = Date.now();

      if (now - parsed.timestamp < CACHE_EXPIRATION_TIME) {
        setNews(parsed.data);
        setLoading(false);
        return;
      }
    }

    const fetchNews = async () => {
      try {
        const response = await axios.get(`${API_URL}&apiKey=${API_KEY}`);
        const fetched = response.data.articles;

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ timestamp: Date.now(), data: fetched })
        );
        setNews(fetched);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const goToArticle = (index) => {
    if (news[index]) {
      navigate(`/article/${index}`);
    }
  };

  const filteredNews = news.filter(
    article => article.title && !article.title.includes('[Removed]')
  );

  return (
    <div className="newspaper">
      <header className="newspaper-header">
        <h1 className="newspaper-title">AI NEWS</h1>
      </header>

      <main className="main-content">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="news-container">
            {filteredNews.map((article, index) => (
              <div key={index} className="news-item">
                {article.urlToImage ? (
                  <img
                    className="news-image"
                    src={article.urlToImage}
                    alt={article.title || 'News'}
                  />
                ) : (
                  <div className="news-image-placeholder">No Image</div>
                )}
                <div className="news-content">
                  <h2 className="news-title">{article.title}</h2>
                  <button onClick={() => goToArticle(index)}>Read More</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="footer">
        <p>© 2025 AI News. All rights reserved.</p>
        <p>Last updated: {new Date().toLocaleString()}</p>
      </footer>
    </div>
  );
};

export default News;
