import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../App'


const Home = () => {
    const [data, setData] = useState([])
    // the state will get the data of user whose logged in
    const { state, dispatch } = useContext(UserContext)

    useEffect(() => {
        fetch('/allpost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                setData(result.posts)
            })
    }, [])

    const likePost = (id) => {
        fetch('/like', {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }
    const unlikePost = (id) => {
        fetch('/unlike', {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                // console.log(result)
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }
    return (
        <div className="home">
            {/* use .map to show dymamic info from the data base */}
            {
                data.map(item => {
                    return (
                        <div className="card home-card" key={item._id}>
                            <h5>{item.postedBy.name}</h5>
                            <div className="card-image">
                                <img src={item.photos} />
                            </div>

                            <div className="card-image">
                                <i className="material-icons" style={{ color: "red" }}>favorite</i>
                                {/* user can only like post once, check if user is included 
                                in the likes array, then return like or unlike button accordingly*/}
                                {item.likes.includes(state._id) ?
                                    <i className="material-icons"
                                        onClick={() => { unlikePost(item._id) }}
                                    >thumb_down</i>
                                    :
                                    <i className="material-icons"
                                        onClick={() => { likePost(item._id) }}
                                    >thumb_up</i>
                                }


                                {/* show the number of likes by getting the length of likes array */}
                                <h6> {item.likes.length} likes</h6>
                                <h6> {item.title}</h6>
                                <p> {item.body} </p>
                                <input type="text" placeholder="add a comment" />
                            </div>
                        </div>
                    )
                })
            }

        </div>
    )
}

export default Home