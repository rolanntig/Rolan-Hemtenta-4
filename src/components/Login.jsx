import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {useNavigate} from "react-router-dom";

const Login = () => {
    const [formData, setFormData] = useState({})

    const navigate = useNavigate();

    useEffect(() => {
        axios.get("/admin/auth/login").then((response) => {
            if (response.data.loggedIn === true) {
                navigate("/admin/dashboard", { state: { loggedIn: true } });
            }
        });
    },[])


    const handleChange = (event) => {
        setFormData({...formData, [event.target.name]: event.target.value})
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('/admin/auth/login', formData )
    }
  return (
    <div>
          <form action="" method='post' onSubmit={handleSubmit}>
              <label htmlFor="username">username</label>
              <input type="text" name='username' id='username' onChange={handleChange}/>
              <label htmlFor="password">password</label>
              <input type="password" name='password' id='password' onChange={handleChange}/>
                <input type="submit" value="Login" />
      </form>
    </div>
  )
}

export default Login
