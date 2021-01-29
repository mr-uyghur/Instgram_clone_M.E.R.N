import React, { useState, useEffect } from 'react';

const Home = () => {
    const [data, setData] = useState([])
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
            {/* use .map to show dymamic info from the data base */}
            {
                data.map(item => {
                    return (
                        <div className="card home-card" key = {item._id}>
                            <h5>{item.postedBy.name}</h5>
                            <div className="card-image">
                                <img src={item.photos} />
                            </div>

                            <div className="card-image">
                                <i className="material-icons" style={{ color: "red" }}>favorite</i>
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