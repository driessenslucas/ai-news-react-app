import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/article.css';

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


// import React, { useEffect, useState, useCallback, useMemo } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import '../styles/article.css';

// // Constants
// const ARTICLE_CACHE_KEY = 'cachedArticleContent';
// const ARTICLE_CACHE_EXPIRATION = 30 * 60 * 1000; // 30 minutes
// const SCRAPER_API_URL = 'http://localhost:5600/scrape';
// const REQUEST_TIMEOUT = 15000; // 15 seconds

// const processHtmlContent = (html) => {
//   if (!html) return '';
  
//   let linkCounter = 0;
//   let links = [];

//   try {
//     let processedText = html
//       // Extract links and replace with placeholders
//       .replace(/<a\s+href="([^"]+)"([^>]*)>(.*?)<\/a>/gi, (match, url, attrs, linkText) => {
//         links.push({ url, linkText: linkText.trim(), attrs });
//         return `{{LINK_PLACEHOLDER_${linkCounter++}}}`;
//       })
//       // Headers add spacing
//       .replace(/<\/h[1-6]>/gi, '\n\n')
//       // Opening headers also newline
//       .replace(/<h[1-6][^>]*>/gi, '\n')
//       // Paragraphs add spacing
//       .replace(/<\/p>/gi, '\n\n')
//       .replace(/<p[^>]*>/gi, '')
//       // Divs add spacing
//       .replace(/<\/div>/gi, '\n')
//       .replace(/<div[^>]*>/gi, '')
//       // Line breaks
//       .replace(/<br\s*\/?>/gi, '\n')
//       // Lists: add bullets for <li>
//       .replace(/<\/li>/gi, '\n')
//       .replace(/<li[^>]*>/gi, '• ')
//       // List containers add line breaks
//       .replace(/<\/(ul|ol)>/gi, '\n')
//       .replace(/<(ul|ol)[^>]*>/gi, '\n')
//       // Remove comments, scripts, styles
//       .replace(/<!--[\s\S]*?-->/g, '')
//       .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
//       .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
//       // Remove all other HTML tags
//       .replace(/<\/?[^>]+>/gi, '')
//       // Clean up multiple line breaks and spaces
//       .replace(/\n\s*\n\s*\n/g, '\n\n')
//       .replace(/\n\s*\n/g, '\n\n')
//       .replace(/[ \t]+/g, ' ')
//       .trim();

//     // Restore links as clickable anchors with target & rel
//     processedText = processedText.replace(/\{\{LINK_PLACEHOLDER_(\d+)\}\}/g, (match, index) => {
//       const link = links[parseInt(index)];
//       if (link) {
//         return `<a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.linkText}</a>`;
//       }
//       return '';
//     });

//     // Convert line breaks to HTML <br>
//     processedText = processedText.replace(/\n/g, '<br>');

//     return processedText;

//   } catch (error) {
//     console.error('Error processing HTML content:', error);
//     return html; // fallback to original html if error occurs
//   }
// };



// // const processHtmlContent = (html) => {
// //   if (!html) return '';
  
// //   let linkCounter = 0;
// //   let links = [];
  
// //   try {
// //     // Extract and store links with placeholders
// //     let processedText = html
// //     .replace(/<a\s+href="([^"]+)"[^>]*>(.*?)<\/a>/gi, (match, url, linkText) => {
// //       links.push({ url, linkText });
// //       return `{{link_${linkCounter++}}}`;
// //     })
// //     // .replace(/<br\s*\/?>/gi, '<br>')
// //     // .replace(/<div.*?>/gi, '<br>')
// //     // .replace(/<p.*?>/gi, '<br>')
// //     // .replace(/<\/p>/gi, '<br><br>')
// //     .replace(/<\/h[1-6]>/gi, '<br>')
// //     .replace(/<h[1-6]>/gi, '<br>')
// //     // .replace(/<\/li>/gi, '<br>')
// //     // .replace(/<\/div>/gi, '<br><br>')
// //     // .replace(/<!--.*?-->/g, '')
// //     // .replace(/<\/?[^>]+>/gi, '')
// //     // .replace(/(<br\s*\/?>\s*){2,}/gi, '<br>')
// //     .replace(/\s{2,}/g, ' ')
// //     .trim();

// //     // Restore links with improved formatting
// //     // processedText = processedText.replace(/\{\{LINK_PLACEHOLDER_(\d+)\}\}/g, (match, index) => {
// //     //   const link = links[parseInt(index)];
// //     //   if (link) {
// //     //     return `<a href="${link.url}" target="_blank" rel="noopener noreferrer" class="article-link">${link.linkText}</a>`;
// //     //   }
// //     //   return '';
// //     // });

// //     // Replace placeholders with actual links
// //     processedText = processedText.replace(/\{\{link_(\d+)\}\}/g, (match, index) => {
// //       const link = links[index];
// //       return `<a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.linkText}</a>`;
// //     });

// //     // Convert line breaks to HTML
// //     processedText = processedText.replace(/\n/g, '<br>');

// //     return processedText;
// //   } catch (error) {
// //     console.error('Error processing HTML content:', error);
// //     return html; // Return original HTML if processing fails
// //   }
// // };


// // Cache management functions
// const getArticleFromCache = (articleUrl) => {
//   try {
//     const cacheKey = `${ARTICLE_CACHE_KEY}_${btoa(articleUrl)}`;
//     const cached = localStorage.getItem(cacheKey);
    
//     if (cached) {
//       const { content, timestamp } = JSON.parse(cached);
//       const now = Date.now();
      
//       if (now - timestamp < ARTICLE_CACHE_EXPIRATION) {
//         return content;
//       } else {
//         localStorage.removeItem(cacheKey);
//       }
//     }
//   } catch (error) {
//     console.error('Error reading article cache:', error);
//   }
//   return null;
// };

// const setArticleCache = (articleUrl, content) => {
//   try {
//     const cacheKey = `${ARTICLE_CACHE_KEY}_${btoa(articleUrl)}`;
//     localStorage.setItem(cacheKey, JSON.stringify({
//       content,
//       timestamp: Date.now()
//     }));
//   } catch (error) {
//     console.error('Error setting article cache:', error);
//   }
// };

// const Article = () => {
//   const { index } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   const [articleContent, setArticleContent] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [retryCount, setRetryCount] = useState(0);
//   const [imageError, setImageError] = useState(false);

//   // Get article data from navigation state or localStorage
//   const article = useMemo(() => {
//     // First try to get from navigation state
//     if (location.state?.article) {
//       return location.state.article;
//     }
    
//     // Fallback to localStorage
//     try {
//       const cachedNews = localStorage.getItem('cachedNews');
//       if (cachedNews) {
//         const parsedNews = JSON.parse(cachedNews);
//         return parsedNews.data?.[index];
//       }
//     } catch (error) {
//       console.error('Error reading cached news:', error);
//     }
    
//     return null;
//   }, [index, location.state]);

//   // Fetch article content with caching and retry logic
//   const fetchArticleContent = useCallback(async (forceRefresh = false) => {
//     if (!article?.url) {
//       setError('Article URL not found');
//       setLoading(false);
//       return;
//     }

//     try {
//       setError(null);
      
//       // Check cache first unless forcing refresh
//       if (!forceRefresh) {
//         const cachedContent = getArticleFromCache(article.url);
//         if (cachedContent) {
//           setArticleContent(cachedContent);
//           setLoading(false);
//           return;
//         }
//       }

//       const response = await axios.get(SCRAPER_API_URL, {
//         params: { url: article.url },
//         timeout: REQUEST_TIMEOUT,
//       });

//       if (response.data?.content) {
//         const content = response.data.content;
//         setArticleContent(content);
//         setArticleCache(article.url, content);
//       } else {
//         throw new Error('No content received from scraper');
//       }

//     } catch (error) {
//       console.error('Error fetching article:', error);
      
//       // Set appropriate error messages
//       if (error.code === 'ECONNABORTED') {
//         setError('Request timed out. The article might be taking too long to load.');
//       } else if (error.response?.status === 404) {
//         setError('Article not found. The content might have been moved or deleted.');
//       } else if (error.response?.status >= 500) {
//         setError('Server error. Please try again later.');
//       } else if (error.message.includes('Network Error')) {
//         setError('Network error. Please check your internet connection and ensure the scraper service is running.');
//       } else {
//         setError(`Failed to load article content: ${error.message}`);
//       }
      
//       // Try to load cached content as fallback
//       const cachedContent = getArticleFromCache(article.url);
//       if (cachedContent) {
//         setArticleContent(cachedContent);
//         setError(prevError => `${prevError} (Showing cached content)`);
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [article]);

//   // Retry function
//   const handleRetry = useCallback(() => {
//     setRetryCount(prev => prev + 1);
//     setLoading(true);
//     fetchArticleContent(true);
//   }, [fetchArticleContent]);

//   // Handle image load error
//   const handleImageError = useCallback(() => {
//     setImageError(true);
//   }, []);

//   // Format date helper
//   const formatDate = useCallback((dateString) => {
//     try {
//       return new Date(dateString).toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//       });
//     } catch {
//       return 'Unknown date';
//     }
//   }, []);

//   // Process content for display
//   const processedContent = useMemo(() => {
//     if (!articleContent) return '';
//     return processHtmlContent(articleContent);
//   }, [articleContent]);

//   // Load article on component mount
//   useEffect(() => {
//     if (!article) {
//       setError('Article not found. Please go back and select an article.');
//       setLoading(false);
//       return;
//     }
    
//     fetchArticleContent();
//   }, [article, fetchArticleContent]);

//   // Loading state
//   if (loading) {
//     return (
//       <div className="article-container">
//         <div className="article-loading">
//           <div className="loading-spinner"></div>
//           <p>Loading article content...</p>
//           <p className="loading-subtext">This may take a moment while we fetch the full article</p>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error && !articleContent) {
//     return (
//       <div className="article-container">
//         <div className="article-header">
//           <button onClick={() => navigate(-1)} className="back-button">
//             ← Go Back
//           </button>
//         </div>
        
//         <div className="article-error">
//           <h2>Unable to Load Article</h2>
//           <p className="error-message">{error}</p>
          
//           <div className="error-actions">
//             <button onClick={handleRetry} className="retry-button">
//               Try Again {retryCount > 0 && `(${retryCount})`}
//             </button>
            
//             {article?.url && (
//               <a 
//                 href={article.url} 
//                 target="_blank" 
//                 rel="noopener noreferrer"
//                 className="external-link-button"
//               >
//                 Read on Original Site
//               </a>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // No article found
//   if (!article) {
//     return (
//       <div className="article-container">
//         <div className="article-error">
//           <h2>Article Not Found</h2>
//           <p>The requested article could not be found.</p>
//           <button onClick={() => navigate('/')} className="home-button">
//             Go to Home
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="article-container">
//       <div className="article-header">
//         <button onClick={() => navigate(-1)} className="back-button">
//           ← Go Back
//         </button>
        
//         <div className="article-actions">
//           <button onClick={() => fetchArticleContent(true)} className="refresh-button">
//             Refresh Content
//           </button>
//         </div>
//       </div>

//       <article className="article-main">
//         <div className="article-meta">
//           <span className="article-source">{article.source?.name || 'Unknown Source'}</span>
//           <span className="article-date">{formatDate(article.publishedAt)}</span>
//           {article.author && <span className="article-author">By {article.author}</span>}
//         </div>

//         <h1 className="article-title">{article.title}</h1>
        
//         {article.description && (
//           <p className="article-description">{article.description}</p>
//         )}

//         {article.urlToImage && !imageError && (
//           <div className="article-image-container">
//             <img 
//               src={article.urlToImage} 
//               alt={article.title}
//               className="article-image"
//               onError={handleImageError}
//               loading="lazy"
//             />
//           </div>
//         )}

//         {error && (
//           <div className="article-warning">
//             <p>⚠️ {error}</p>
//           </div>
//         )}

//         <div className="article-content">
//           {processedContent ? (
//             <div dangerouslySetInnerHTML={{ __html: processedContent }} />
//           ) : (
//             <div className="no-content">
//               <p>Article content could not be loaded.</p>
//               <button onClick={handleRetry} className="retry-button">
//                 Try Loading Again
//               </button>
//             </div>
//           )}
//         </div>

//         <div className="article-footer">
//           <a 
//             href={article.url} 
//             target="_blank" 
//             rel="noopener noreferrer"
//             className="source-link"
//           >
//             Read Full Article on {article.source?.name || 'Original Site'} →
//           </a>
          
//           <div className="article-share">
//             <p className="share-text">Share this article:</p>
//             <button 
//               onClick={() => navigator.clipboard?.writeText(window.location.href)}
//               className="copy-link-button"
//             >
//               Copy Link
//             </button>
//           </div>
//         </div>
//       </article>
//     </div>
//   );
// };

// export default Article;