import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'


const CreatePost = () => {
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")
    const history = useHistory()
    useEffect(() => {
        // use effect will be triggered after url is updated
        // only trigger this function if URL exists
        if(url){
        // fetch data from server
        fetch('/createpost', {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                title: title,
                body: body,
                pic: url
            })
        }).then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.error) {
                    // error message if user don't sign up correctly
                    M.toast({ html: data.error, classes: "#c62828 red darken-3" })
                }
                else {

                    M.toast({ html: "Created post successfully", classes: "#43a047 green darken-1" })
                    // navigate user to dasboard home page after sucessful login
                    history.push('/')
                }
            }).catch(err => {
                console.log(err)
            })
        }
    }, [url])

    const postDetails = () => {
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
            })
            .catch(err => {
                console.log(err)
            })



    }


    return (
        <div className="card input-field"
            style={{
                margin: "30px auto",
                maxWidth: "500px",
                padding: "20px",
                textAlign: "center"
            }}
        >
            <input type="text" placeholder="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
            <input type="text" placeholder="body"
                onChange={e => setBody(e.target.value)}
                value={body}
            />

            <div className="file-field input-field">
                <div className="btn #64b5f6 blue darken-1">
                    <span>Upload image</span>
                    <input type="file"
                        onChange={e => setImage(e.target.files[0])}
                    />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>

            <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
                onClick={() => postDetails()}
            >
                Submit post
                </button>

        </div>
    )

}

export default CreatePost