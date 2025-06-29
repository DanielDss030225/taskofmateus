// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Create from './Create';
import CreateSuccessful from './CreateSuccessful';
import YourTask from './yourTask';
import Resultados from './resultados';

function App() {
  return (
    <Router>
      <div className="body" style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
        <Routes>
          <Route path="/" element={<Create />} />
          <Route path="/success" element={<CreateSuccessful />} />
          <Route path="/YourTask" element={<YourTask/>} />
        <Route path="/resultados" element={<Resultados />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
