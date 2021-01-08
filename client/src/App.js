import './App.css'
import React from 'react'
import NavBar from './components/NavBar'
import {BrowserRouter, Route} from 'react-router-dom'
import Home from './components/screens/Home'
import Signin from './components/screens/Signin'
import Profile from './components/screens/Profile'
import Signup from './components/screens/Signup'
function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <NavBar/>
      <Route exact path="/">
        <Home/>
        </Route>

        <Route path = '/signin'>
            <Signin/>
          </Route>

          <Route path = '/signup'>
            <Signup/>
          </Route>

          <Route path = '/profile'>
            <Profile/>
          </Route>

      </BrowserRouter>
   

    </div>
  );
}

export default App;
