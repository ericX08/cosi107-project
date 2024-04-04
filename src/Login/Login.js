import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import axios from 'axios';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const onSubmit = (e) => {
        e.preventDefault(); // Prevent the default form submission
        axios.post('http://localhost:3001/validatePassword', { username, password })
            .then(res => {
                if(res.data.validation) {
                    navigate('/Success')
                } else {
                    alert("Your password is incorrect");
                }
            }).catch(error => {
                console.error('There was an error!', error);
            });
    };

    const handleOnChange = () => {
        navigate("./Login_XSS");
    }
    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            alignItems: 'center', 
            height: '100vh',
        }}>
            <form onSubmit={onSubmit} style={{ marginBottom: '20px' }}>
                <div>
                    <label>Username</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div>
                    <label>Password</label>
                    <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit">Login</button>
            </form>
    
            <div>
                <p>Click this to go to XSS page</p>
                <button type="submit" onClick={handleOnChange}>XSS Page</button>
            </div>
        </div>
    );
    
    
}
