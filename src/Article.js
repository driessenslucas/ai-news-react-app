import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './article.css';

// Function to strip HTML tags and preserve links
const stripHtmlTags = (html) => {
  let linkCounter = 0;
  let links = [];

  // Extract and store links with placeholders
  let text = html
    .replace(/<a\s+href="([^"]+)"[^>]*>(.*?)<\/a>/gi, (match, url, linkText) => {
      links.push({ url, linkText });
      return `{{link_${linkCounter++}}}`;
    })
    // .replace(/<br\s*\/?>/gi, '<br>')
    // .replace(/<div.*?>/gi, '<br>')
    // .replace(/<p.*?>/gi, '<br>')
    // .replace(/<\/p>/gi, '<br><br>')
    .replace(/<\/h[1-6]>/gi, '<br>')
    .replace(/<h[1-6]>/gi, '<br>')
    // .replace(/<\/li>/gi, '<br>')
    // .replace(/<\/div>/gi, '<br><br>')
    // .replace(/<!--.*?-->/g, '')
    // .replace(/<\/?[^>]+>/gi, '')
    // .replace(/(<br\s*\/?>\s*){2,}/gi, '<br>')
    .replace(/\s{2,}/g, ' ')
    .trim();

  // Replace placeholders with actual links
   text = text.replace(/\{\{link_(\d+)\}\}/g, (match, index) => {
    const link = links[index];
    return `<a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.linkText}</a>`;
   });


  return text;
};

const Article = () => {
  const { index } = useParams();
  const navigate = useNavigate();
  const [articleContent, setArticleContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cachedNews = JSON.parse(localStorage.getItem('cachedNews'));
  const article = cachedNews ? cachedNews.data[index] : null;

  useEffect(() => {
    if (!article) {
      setError('No article found.');
      setLoading(false);
      return;
    }

    const fetchArticle = async () => {
      try {
        const response = await axios.get('http://localhost:5600/scrape', {
          params: { url: article.url },
        });
        setArticleContent(response.data.content);
      } catch (err) {
        setError('Error fetching article content');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [article]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Convert HTML to formatted content
  const formattedContent = stripHtmlTags(articleContent);
  // const formattedContent = articleContent;

  return (
    <div className="article-container">
      <button onClick={() => navigate(-1)}>Go Back</button>
      <h1>{article.title}</h1>
      <img src={article.urlToImage} alt="News" style={{ width: '100%', height: 'auto' }} />
      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: formattedContent }}
      />
      <a href={article.url} target="_blank" rel="noopener noreferrer">Read Full Article on Source</a>
    </div>
  );
};

export default Article;
