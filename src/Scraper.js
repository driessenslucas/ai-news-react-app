const express = require('express');
const axios = require('axios');
const { JSDOM } = require('jsdom');
const cors = require('cors');
const { Readability } = require('@mozilla/readability');

const app = express();
const PORT = 5600;

app.use(cors()); // Enable CORS for all routes

// // Function to clean HTML content using regex
// const stripHtmlTags = (html) => {
//   return html
//     .replace(/<!--.*?-->/g, '') // Remove comments
//     .replace(/<\/?[^>]+>/gi, '<br>') // Remove all HTML tags
//     .replace(/\s{2,}/g, ' ') // Replace multiple spaces with a single space
// };
const stripHtmlTags = (html) => {
  let text = html
    // Convert specific HTML tags to <br> for new lines
    .replace(/<br\s*\/?>/gi, '<br>') // Ensure <br> tags are standard
    .replace(/<div.*?>/gi, '<br>') // Convert <div> tags to <br> (replace any attributes)
    .replace(/<p.*?>/gi, '<br>') // Convert <p> tags to <br> (replace any attributes)
    .replace(/<\/p>/gi, '<br><br>') // End of <p> tags to double new lines
    .replace(/<\/h[1-6]>/gi, '<br><br>') // End of headings to double new lines
    .replace(/<\/li>/gi, '<br>') // End of list items to new lines
    .replace(/<\/div>/gi, '<br><br>') // End of <div> tags to double new lines
      .replace(/<!--.*?-->/g, '') // Remove comments

    // Replace remaining HTML tags with empty string
    // .replace(/<\/?[^>]+>/gi, '')s

    // Clean up multiple consecutive <br> tags
      .replace(/(<br\s*\/?>\s*){2,}/gi, '<br>')
      

    // Clean up multiple spaces and trim
    .replace(/\s{2,}/g, ' ') // Replace multiple spaces with a single space
      .trim();
    
      // Replace placeholders with HTML links
  text = text.replace(/\{\{link_(\d+)\}\}/g, (match, index) => {
    return `<a href="${links[index]}" target="_blank" rel="noopener noreferrer">Link ${index}</a>`;
  });

  return text;
};



app.get('/scrape', async (req, res) => {
  const articleUrl = req.query.url;

  try {
    // Fetch the HTML of the article page
    const { data } = await axios.get(articleUrl);

    // Load the HTML into a virtual DOM using JSDOM
    const dom = new JSDOM(data, { url: articleUrl });

    // Use Mozilla's Readability to extract readable content
    const reader = new Readability(dom.window.document);
    const article = reader.parse(); // This returns an object with 'title' and 'content'

      // Send the simplified article content
    
    res.json({ title: article.title, content: stripHtmlTags(article.content) });
  } catch (error) {
    console.error('Error scraping the page:', error);
    res.status(500).json({ error: 'Error scraping the article' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
