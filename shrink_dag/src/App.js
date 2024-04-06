import React from 'react';
import './App.css';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import Graph from './Graph.js';
import Sheet from './Sheet.js';

export default function App() {

  return (
    <Router>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Link to="/">
          <button className="button">Graph</button>
        </Link>
        <Link to="/another">
          <button className="button">Sheet</button>
        </Link>
      </div>
      <Routes>
        <Route path="/another" element={<Sheet />} />
        <Route path="/" element={<Graph />} />
      </Routes>
    </Router>
  );
}
