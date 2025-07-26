// src/App.jsx
import React from 'react';
import OrderGeneratorContainer from './components/OrderGenerator/OrderGeneratorContainer';
import './App.css';

function App() {
  return (
    <div className="App">
      <main className="app-main">
        <OrderGeneratorContainer />
      </main>
    </div>
  );
}

export default App;
