import React from 'react';

const Home = () => {
    return (
        <div className="home">
            <div className="card home-card">
                <h5>Ali</h5>
                <div className="card-image">
                    <img src="data:image/jpeg;base64,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" />
                </div>

                <div className="card-image">
                <i className="material-icons" style = {{color:"red"}}>favorite</i>
                    <h6> title</h6>
                    <p> image body </p>
                    <input type="text" placeholder="add a comment" />
                </div>
            </div>
        </div>
    )
}

export default Home