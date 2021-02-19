import React, { useContext, useRef, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from '../App'
import M from 'materialize-css'

const NavBar = () => {
  const searchModal = useRef(null)
  const [search, setSearch] = useState('')
  const { state, dispatch } = useContext(UserContext)
  const history = useHistory()

  useEffect(() => {
    M.Modal.init(searchModal.current)
  }, [])

  const renderList = () => {
    // state has details of the user
    // if use is true, profile page and create page shows
    if (state) {
      return [
        <li><i data-target="modal1" className="large material-icons modal-trigger" style={{ color: 'black' }}>search</i> </li>,
        <li><Link to="/profile">Profile</Link></li>,
        <li><Link to="/create">Create Post</Link></li>,
        <li><Link to="/myfollowingpost"><button className="btn waves-effect waves-light">My followings</button></Link></li>,
        <li>
          <button className="btn waves-effect waves-light #c62828 red darken-3"
            onClick={() => {
              localStorage.clear()
              dispatch({ type: "CLEAR" })
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

      {/* we will use search button icon to trigger this model */}
      <div id="modal1" className="modal" ref={searchModal} style={{ color: 'black' }}>
        <div className="modal-content">
          <input type="text"
            placeholder="search users"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <ul className="collection" style={{ color: 'black' }}>
            <li className="collection-item">Alvin</li>
            <li className="collection-item">Alvin</li>
            <li className="collection-item">Alvin</li>
            <li className="collection-item">Alvin</li>
            <li className="collection-item">Alvin</li>
            <li className="collection-item">Alvin</li>
            <li className="collection-item">Alvin</li>
            <li className="collection-item">Alvin</li>
          </ul>

        </div>

        <div className="modal-footer">
          <button href="#!" className="modal-close waves-effect waves-green btn-flat">search</button>
        </div>
      </div>

    </nav>
  )
}

export default NavBar