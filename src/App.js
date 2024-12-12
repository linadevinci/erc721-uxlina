/*import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
*/

/*
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom'; 
import './App.css';
import ChainInfo from './ChainInfo'; 
//import ErrorPage from './ErrorPage'; 
//import FakeBayc from './FakeBayc'; // Import de la nouvelle page

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/ChainInfo">Chain Info</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<h1>Welcome to the Home Page!</h1>} />
          <Route path="/ChainInfo" element={<ChainInfo />} />
        </Routes>
      </header>
    </div>
  );
}

export default App;*/
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import ChainInfo from './ChainInfo';
import FakeBayc from './FakeBayc';
import FakeBaycToken from './FakeBaycToken';
import ErrorPage from './ErrorPage';
import FakeNefturians from './FakeNefturians';
import UserNefturians from './UserNefturians';
import FakeMeebits from './FakeMeebits';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/ChainInfo">Chain Info</Link></li>
            <li><Link to="/fakeBayc">FakeBayc</Link></li>
            <li><Link to="/fakeNefturians">FakeNefturians</Link></li>
            <li><Link to="/fakeMeebits">FakeMeebits</Link></li>
          
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<h1>Welcome to the Home Page!</h1>} />
          <Route path="/ChainInfo" element={<ChainInfo />} />
          <Route path="/fakeBayc" element={<FakeBayc />} />
          <Route path="/fakeBayc/:tokenId" element={<FakeBaycToken />} />
          <Route path="/fakeNefturians" element={<FakeNefturians />} />
          <Route path="/fakeNefturians/:userAddress" element={<UserNefturians />} />
          <Route path="/fakeMeebits" element={<FakeMeebits />} />
          <Route path="/error" element={<ErrorPage />} />
        </Routes>
      </header>
    </div>
  );
}

export default App;