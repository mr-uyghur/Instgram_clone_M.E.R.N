import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../App'
import { Link } from 'react-router-dom'


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

    const makeComment = (text, postId) => {
        // sent text and postId to the backend
        fetch('/comment', {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId,
                text
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result)
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

    const deletePost = (postid) => {
        fetch(`/deletepost/${postid}`, {
            method: 'delete',
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                const newData = data.filter(item => {
                    return item._id !== result._id
                })
                setData(newData)
            })

    }

    const deleteComment = (postId, commentId) => {
        fetch(`/deletecomment/${postId}/${commentId}`, {
            method: "delete",
            headers: {
                "Authorization": localStorage.getItem("jwt")
            },
        }).then(res => res.json())
            .then(result => {
                let newData = data.map(item => {
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
            {/* use map to show dymamic info from the data base */}
            {
                data.map(item => {
                    return (
                        <div className="card home-card" key={item._id}>

                            <h6 style={{ padding: "5px" }}>

                                <Link to={item.postedBy._id !== state._id ? "/profile/" + item.postedBy._id : "/profile"} >
                                    <img style={{ width: "30px", height: "30px", borderRadius: "80px" }} src={item.postedBy.pic} />
                                    {item.postedBy.name}
                                </Link>

                                {item.postedBy._id == state._id
                                    && <i className="material-icons"
                                        style={{ float: "right", color: "red" }}
                                        onClick={() => deletePost(item._id)}
                                    >delete_forever</i>
                                }

                            </h6>

                            <div className="card-image">
                                <img src={item.photos} />
                            </div>

                            <div className="card-image">

                                {/* user can only like post once, check if user is included 
                                in the likes array, then return like or unlike button accordingly*/}
                        
                                {item.likes.includes(state._id) ?

                                    <i className="material-icons"
                                    style={{ color: "red" }}
                                        onClick={() => { unlikePost(item._id) }}
                                    >favorite</i>
                                    :
                                    <i className="material-icons"
                                    style={{ color: "red" }}
                                        onClick={() => { likePost(item._id) }}
                                    >favorite_border</i>
                                }



                                {/* show the number of likes by getting the length of likes array */}
                                <h6> {item.likes.length} likes</h6>
                                <h6> Title: {item.title}</h6>
                                <p> Description: {item.body} </p>

                                {
                                    item.comments.map((record) => {
                                        return (
                                            <h6 key={record._id}><span style={{ fontWeight: "500" }}> {record.postedBy.name} </span>  {record.text}
                                                {record.postedBy._id === state._id || item.postedBy._id == state._id
                                                    ? <i className="material-icons small-icon"
                                                        onClick={() => deleteComment(item._id, record._id)}
                                                        style={{ float: "right", fontSize: "18px" }}  >delete</i>
                                                    :
                                                    record.postedBy._id === state._id
                                                    && <i className="material-icons small-icon"
                                                        onClick={() => deleteComment(item._id, record._id)}
                                                        style={{ float: "right", fontSize: "18px" }}  >delete </i>
                                                }
                                            </h6>
                                        )

                                    })

                                }

                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    makeComment(e.target[0].value, item._id)
                                }}>
                                    <input type="text" placeholder="add a comment" /> <button className="btn waves-effect waves-light #0288d1 light-blue darken-2" type="submit">Comment</button>

                                </form>
                            </div>
                        </div >
                    )
                })
            }

        </div >
    )
}

export default Home

