import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'
import { useParams } from 'react-router-dom'
const Profile = () => {
    const [userProfile, setProfile] = useState(null)
    const { state, dispatch } = useContext(UserContext)
    const { userid } = useParams()
    console.log(userid)
    useEffect(() => {
        fetch(`/user/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            }
        }).then(res => res.json())
            .then(result => {
                setProfile(result)
                console.log(result)
            })
    }, [])
    return (
        <>
            {userProfile ?
                <div style={{ maxWidth: "550px", margin: "0px auto" }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-around",
                        margin: "18px 0px",
                        borderBottom: "1px solid grey"
                    }}>
                        <div >
                            <img style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                                src="data:image/jpeg;base64,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"
                                alt="profile pic"
                            />
                        </div>

                        <div>
                            <h4>{userProfile.user.name}</h4>
                            <h5>{userProfile.user.email}</h5>

                            <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
                                <h6> {userProfile.posts.length} </h6>
                                <h6> followers </h6>
                                <h6> following </h6>
                            </div>
                        </div>
                    </div>

                    <div className="gallery">
                        {
                            userProfile.posts.map(item => {
                                return (
                                    <img ket={item._id} className="item" src={item.photos} alt="" />
                                )
                            })
                        }
                    </div>
                </div>
                :

                <h2> Loading...</h2>
            }

        </>
    )
}

export default Profile