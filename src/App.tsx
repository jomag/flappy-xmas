import React from "react";
import logo from "./logo.svg";
import "./App.css";

import GameComponent from "./GameComponent";

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <br />
        <br />
        <br />
        <br />
        <GameComponent />
      </header>
    </div>
  );
};

export default App;
