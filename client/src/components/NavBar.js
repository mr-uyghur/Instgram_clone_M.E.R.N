import React, { useContext } from 'react'
import { Link,useHistory } from 'react-router-dom'
import { UserContext } from '../App'

const NavBar = () => {
  const { state, dispatch } = useContext(UserContext)
  const history = useHistory()
  const renderList = () => {
    // state has details of the user
    // if use is true, profile page and create page shows
    if (state) {
      return [
        <li><Link to="/profile">Profile</Link></li>,
        <li><Link to="/create">Create Post</Link></li>,
        <li><Link to="/myfollowingpost"><button className="btn waves-effect waves-light">My followings</button></Link></li>,
        <li>
          <button className="btn waves-effect waves-light #c62828 red darken-3"
            onClick={() =>
            {
              localStorage.clear()
              dispatch({type:"CLEAR"})
              history.push('/signin')
            }
            }
          >
            Logout
                </button>
        </li>
      ]
    } else {
      return [
        <li><Link to="/signin">Log in</Link></li>,
        <li><Link to="/signup">Sign up</Link></li>,
        <li><Link to="/explore"><button className="btn waves-effect waves-light">Explore!</button></Link></li>
      ]
    }
  }


  return (
    <nav>
      <div className="nav-wrapper white" >
        {/* link below will only showup if user (state) is true */}
        <Link to={state ? "/" : "/signin"} className="brand-logo ">Instagram</Link>
        <ul id="nLinkv-mobile" className="right">
          {renderList()}
        </ul>
      </div>
      
    </nav>
  )
}

export default NavBar