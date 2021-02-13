import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'

const Profile = () => {
    const [mypics, setPics] = useState([])
    const { state, dispatch } = useContext(UserContext)
    const [image, setImage] = useState("")
    const [url, setUrl] = useState()

    useEffect(() => {
        fetch('/mypost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            }
        }).then(res => res.json())
            .then(result => {
                setPics(result.mypost)
            })
    }, [])

    useEffect(() =>{
        if(image){
              // use formData to save the data
        const data = new FormData()
        data.append("file", image)
        // upload images to cloud
        data.append("upload_preset", "insta_clone")
        data.append("cloud_name", "gloomy")
        // fetch those data back from cloud's API
        fetch("https://api.cloudinary.com/v1_1/gloomy/image/upload", {
            method: "POST",
            body: data,
        })
            .then(res => res.json())
            .then(data => {
                setUrl(data.url)
                localStorage.setItem("user",JSON.stringify({...state,pic:data.url}))
                dispatch({ type: "UPDATEPIC",payload:data.url})
                fetch('/updatepic',{
                    method:"put",
                    headers:{
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("jwt")
                    },
                    body:JSON.stringify({
                        pic:data.url
                    })
                }).then(res => res.json())
                // .then(result =>{
                
                // localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
                // dispatch({ type: "UPDATEPIC",payload:result.pic})
                // })
                
            })
            .catch(err => {
                console.log(err)
            })
        }

    },[image])
    const updatePhoto = (file) => {
        setImage(file)
    }
    return (
        <div style={{ maxWidth: "550px", margin: "0px auto" }}>
            <div style={{
                display: "flex",
                justifyContent: "space-around",
                margin: "18px 5px",
                borderBottom: "1px solid grey",
                paddingBottom: "10px"
            }}>
                <div >
                    <img style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                        src={state ? state.pic : "loading..."}
                        alt="profile pic"
                    />
                    
                    <div className="file-field input-field">
                    <div className="btn #64b5f6 blue darken-1">
                        <span>Upload Profile Picture</span>
                        <input type="file"
                            onChange={e => updatePhoto(e.target.files[0])}
                        />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                </div>

                <div>
                    <h4>{state ? state.name : ' loading'}</h4>
                    <h5>{state ? state.email : ' loading'}</h5>
                    <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
                        <h6> {mypics.length} post </h6>
                        <h6> {state ? state.followers.length : 0} followers </h6>
                        <h6> {state ? state.following.length : 0} following </h6>
                    </div>
                </div>
            </div>

            <div className="gallery">
                {
                    mypics.map(item => {
                        return (
                            <img ket={item._id} className="item" src={item.photos} alt="" />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Profile