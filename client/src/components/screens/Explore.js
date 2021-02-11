
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../App'
import {Link} from 'react-router-dom'


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



    return (
        <div className="home">
            {/* use map to show dymamic info from the data base */}
            {
                data.map(item => {
                    return (
                        <div className="card home-card" key={item._id}>
                            <h5>
                        <Link to = { "/profile/"+item.postedBy._id } >{item.postedBy.name} </Link>
                

                            </h5>

                            <div className="card-image">
                                <img src={item.photos} />
                            </div>

                            <div className="card-image">
                                <i className="material-icons" style={{ color: "red" }}>favorite</i>
                    


                                {/* show the number of likes by getting the length of likes array */}
                                <h6> {item.likes.length} likes</h6>
                                <h6> Title: {item.title}</h6>
                                <p> Description: {item.body} </p>

                                {
                                    item.comments.map((record) => {
                                        return (
                                            <h6 key={record._id}><span style={{ fontWeight: "500" }}> {record.postedBy.name} </span>  {record.text}
                                            </h6>
                                        )

                                    })

                                }

                            </div>
                        </div >
                    )
                })
            }

        </div >
    )
}

export default Home