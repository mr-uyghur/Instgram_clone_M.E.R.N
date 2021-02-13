  
import React, { useState,useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'

const Signup = () => {
    const history = useHistory()
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState(undefined)
    useEffect(() => {
        if(url){
            uploadFields()
        }
    },[url])


    const uploadPic = () =>{
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

    const uploadFields = () => {
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({ html: "invalid email", classes: "#c62828 red darken-3" })
            return
        }
        fetch('http://localhost:5000/signup', {
            method: 'post',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                password: password,
                email: email,
                pic:url
            })
        }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    // error message if user don't sign up correctly
                    M.toast({ html: data.error, classes: "#c62828 red darken-3" })
                }
                else {
                    // success msg from the back end if use signup is sucessful
                    M.toast({ html: data.message, classes: "#43a047 green darken-1" })
                    // use history to navigate user to the login screen
                    history.push('/signin')
                }
            }).catch(err => {
                console.log(err)
            })

    }
    const PostData = () => {
        if(image){
            uploadPic()
        } else{
            uploadFields()
        }
        
    }
    return (

        <div className="mycard">
            <div className="card auth-card input-field">

                <h2> Instagram </h2>
                <input type="text"
                    placeholder="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />

                <input type="text"
                    placeholder="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />

                <input type="password"
                    placeholder="password"
                    minlength="8"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />

                <div className="file-field input-field">
                    <div className="btn #64b5f6 blue darken-1">
                        <span>Upload Profile Picture</span>
                        <input type="file"
                            onChange={e => setImage(e.target.files[0])}
                        />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>

                <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={() => PostData()}
                >
                    Signup
                </button>
                <h5>
                    <Link to="/signin" > Already have an account ?</Link>
                </h5>
            </div>
        </div>

    )
}

export default Signup