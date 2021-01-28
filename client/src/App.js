import './App.css'
import React, { useEffect, createContext, useReducer, useContext } from 'react'
import NavBar from './components/NavBar'
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom'
import Home from './components/screens/Home'
import Signin from './components/screens/Signin'
import Profile from './components/screens/Profile'
import Signup from './components/screens/Signup'
import CreatePost from './components/screens/CreatePost'
import { reducer, initialState } from './reducers/userReducer'


export const UserContext = createContext()


const Routing = () => {
  const history = useHistory()
  const {state,dispatch} = useContext(UserContext)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    // if we have the user already then make use of history and push the user to home screen
    if (user) {
      dispatch({ type: "USER", payload: user })
      history.push('/')
    }
    // if we don't have the user, redirect to login screen
    else {
      history.push('/signin')
    }
  }, [])

  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>

      <Route path='/signin'>
        <Signin />
      </Route>

      <Route path='/signup'>
        <Signup />
      </Route>

      <Route path='/profile'>
        <Profile />
      </Route>

      <Route path='/create'>
        <CreatePost />
      </Route>
    </Switch>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{ state, dispatch }}>

      <BrowserRouter>
        <NavBar />
        <Routing />

      </BrowserRouter>

    </UserContext.Provider>



  );
}

export default App;
