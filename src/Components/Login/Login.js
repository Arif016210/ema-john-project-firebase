import React, { useContext, useState } from 'react';
import './Login.css';

import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router-dom';
import { handleGoogleSignIn, handleSignOut, initializeLoginFramework, handleFbLogin, CreateUserWithEmailAndPassword, signInWithEmailAndPassword } from './loginManager';




function Login() {

    const [newUser, setNewUser] = useState(false);
    const [user, setUser] = useState({
        isSignIn: false,
        name: '',
        email: '',
        photo: '',

    });
    initializeLoginFramework();

    const [logInUser, setLogInUser] = useContext(UserContext);
    const history = useHistory();
    const location = useLocation();
    const { from } = location.state || { from: { pathname: "/" } };

    const googleSignIn = () => {
        handleGoogleSignIn()
            .then(res => {
                handleResponse(res, true);
            });
    };
    const fbSignIn = () => {
        handleFbLogin()
            .then(res => {
                handleResponse(res, true);
            });

    };

    const signOut = () => {
        handleSignOut()
            .then(res => {
                handleResponse(res, false);
            });
    };




    const handleResponse = (res, redirect) => {
        setUser(res);
        setLogInUser(res);
        if (redirect) {
            history.replace(from);
        };
    };


    const handleChange = (e) => {
        console.log(e.target.name, e.target.value);
        let isFromValid = true;

        if (e.target.name === 'email') {
            isFromValid = /\S+@\S+\.\S+/.test(e.target.value);
        };
        if (e.target.name === 'password') {
            const isPasswordValid = e.target.value.length > 6;
            const isNumberHasValid = /\d{1}/.test(e.target.value);
            isFromValid = isPasswordValid && isNumberHasValid;
        };
        if (isFromValid) {
            const newUserInfo = { ...user };
            newUserInfo[e.target.name] = e.target.value;
            setUser(newUserInfo)
        };

    };


    const handleSubmit = (e) => {

        if (newUser && user.email && user.password) {
            CreateUserWithEmailAndPassword(user.name, user.email, user.password)
                .then(res => {
                    handleResponse(res, true);
                });
        };

        if (!newUser && user.email && user.password) {
            signInWithEmailAndPassword(user.email, user.password)
                .then(res => {
                    handleResponse(res, true);
                });
        };

        e.preventDefault();
    }



    return (
        <div className="App">
            {
                user.isSignIn ? <button onClick={signOut} >Sign Out</button> : <button onClick={googleSignIn} >Sign in</button>
            }
            <br />
            <button onClick={fbSignIn} >Sign in Facebook</button>
            {
                user.isSignIn && <div>
                    <p> Name : {user.name} </p>
                    <p> Email : {user.email} </p>
                    <img src={user.photo} alt="" />
                </div>
            }




            {/* 42.1 no modiual */}

            <h1>Our Own Authentication</h1>
            {/* <p> Name : {user.name} </p>
      <p>Email : {user.Email} </p>
      <p> Password : {user.Password} </p> */}

            <input type="checkbox" name="newUser" onChange={() => setNewUser(!newUser)} />
            <label htmlFor="newUser">New Sign Up</label>

            <form onSubmit={handleSubmit} >

                {
                    newUser && <input type="text" name="name" onBlur={handleChange} placeholder="Enter Your Name" />
                }
                <br />
                <input type="text" name="email" onBlur={handleChange} placeholder="Enter Your Email" />
                <br />
                <input type="password" name="password" onBlur={handleChange} placeholder="Enter Your Password" />
                <br />
                <input type="submit" value={newUser ? 'Sign up' : 'Sign in'} />
                <p style={{ color: 'red' }} >  {user.error} </p>
                {
                    user.success && <p style={{ color: 'green' }}> User {newUser ? 'Created' : 'logged In'} successfully</p>
                }
            </form>


            {/* 42.1 no modiual */}

        </div >
    );
}

export default Login;
