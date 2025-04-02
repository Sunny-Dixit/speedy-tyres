//import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation} from "react-router-dom";
import Main from "./Components/main";
import Users from './Components/Users';
import Book from './Components/Book';
import SeeAllSlots from './Components/SeeAllSlots';
import SpeedyTyresPage from './Components/main';
import { useEffect } from 'react';


const PageTitle = () => {
  const location = useLocation();
  useEffect(() => {
    const titles = {
      "/": "Speedy Tyres",
      "/book": "Book The Slot",
      "/service": "Select The Service",
    };

    document.title = titles[location.pathname] || "Speedy Tyres";
  }, [location.pathname]);

  return null;
};


function App() {
  return (
   /* <div className="App">
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
    </div>*/
    <Router>
            <PageTitle />
    <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/user" element={<Users />} />
        <Route path="/service" element={<Book />} />
        <Route path="/book" element={<SeeAllSlots />} />
        <Route path="/enquiry" element={<SpeedyTyresPage />} />
    </Routes>
  </Router>

  );
}

export default App;
