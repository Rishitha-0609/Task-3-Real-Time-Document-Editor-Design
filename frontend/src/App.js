// frontend/src/App.js
import React from 'react';
import './App.css';
import EditorComponent from './EditorComponent'; // Make sure this path is correct

function App() {
  return (
    <div className="app-container">
      <h1>Real-Time Collaborative Document Editor</h1>
      <EditorComponent />
    </div>
  );
}

export default App;