import './App.css';
import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Fontpage from './compontent/fontpage';
import Home from './compontent/home';
import Viewpanel from './compontent/viewpanel';
import Enterpanel from './compontent/enterpanel/enterpanel';
import Viewdata from './compontent/enterpanel/viewcontent/viewdata';
import Editepopup from './compontent/alert/editpopup';
import { Bussinesschat } from './compontent/bussinesschat';
import Auth from './compontent/scrives/auth';

function App() {
  const isAuthenticated = Auth();

  return (
    <Router>
      {isAuthenticated ? (
        <AuthenticatedRoutes />
      ) : (
        <Routes>
          <Route path="/" element={<Fontpage />} />
        </Routes>
      )}
    </Router>
  );
}

function AuthenticatedRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Fontpage />} />
      <Route path="/home" element={<Home />} />
      <Route path="/home/chat" element={<Bussinesschat />} />
      <Route path="/viewpanel/:name" element={<Viewpanel />} />
      <Route path="/viewpanel/:name/id/:id" element={<Viewpanel />} />
      <Route path="/viewpanel/:name/:type" element={<Viewdata />} />
      <Route path="/viewpanel/:name/:type/:id" element={<Viewdata />} />
      <Route path="/viewpanel/:name/:type/adminpanel" element={<Enterpanel />} />
      <Route path="/viewpanel/:name/:type/:id/adminpanel" element={<Enterpanel />} />
    </Routes>
  );
}

export default App;
