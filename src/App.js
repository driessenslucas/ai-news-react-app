import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import News from './components/News';
import Article from './components/Article'; // New component to display full article

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<News />} />
        <Route path="/article/:index" element={<Article />} />
      </Routes>
    </Router>
  );
};

export default App;
