import React, { useContext, useState } from 'react';
import './Login.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router-dom';

firebase.initializeApp(firebaseConfig);


function Login() {

    const [newUser, setNewUser] = useState(false);
    const [user, setUser] = useState({
        isSignIn: false,
        name: '',
        email: '',
        photo: '',

    })

    const [logInUser, setLogInUser] = useContext(UserContext);
    const history = useHistory();
    const location = useLocation();
    const { from } = location.state || { from: { pathname: "/" } };

    const provider = new firebase.auth.GoogleAuthProvider();
    const fbProvider = new firebase.auth.FacebookAuthProvider();

    const handleSignIn = () => {

        firebase.auth().signInWithPopup(provider)
            .then(res => {
                const { displayName, email, photoURL } = res.user;
                const signedInUser = {
                    isSignIn: true,
                    name: displayName,
                    email: email,
                    photo: photoURL,
                }
                setUser(signedInUser)

            })
            .catch(err => {
                console.log(err);
                console.log(err.message);
            })
    }
    const handleFbLogin = () => {

        firebase.auth().signInWithPopup(fbProvider).then(function (result) {
            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            // ...
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...

        });
    }

    const handleSignOut = () => {
        firebase.auth().signOut()
            .then(res => {
                const signOutUser = {
                    isSignIn: false,
                    name: '',
                    email: '',
                    photo: '',
                    error: '',
                    success: false,
                }
                setUser(signOutUser);
            })
            .catch(err => {

            })
    }





    const handleChange = (e) => {
        console.log(e.target.name, e.target.value);
        let isFromValid = true;

        if (e.target.name === 'email') {
            isFromValid = /\S+@\S+\.\S+/.test(e.target.value);
        }
        if (e.target.name === 'password') {
            const isPasswordValid = e.target.value.length > 6;
            const isNumberHasValid = /\d{1}/.test(e.target.value);
            isFromValid = isPasswordValid && isNumberHasValid;
        }
        if (isFromValid) {
            const newUserInfo = { ...user };
            newUserInfo[e.target.name] = e.target.value;
            setUser(newUserInfo)
        }

    }


    const handleSubmit = (e) => {

        if (newUser && user.email && user.password) {
            firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
                .then(res => {
                    const newUserInfo = { ...user };
                    newUserInfo.error = '';
                    newUserInfo.success = true;
                    setUser(newUserInfo);
                    updateUserName(user.name);
                })
                .catch(error => {
                    var errorMessage = error.message;
                    const newUserInfo = { ...user };
                    newUserInfo.error = errorMessage;
                    newUserInfo.success = false;
                    setUser(newUserInfo);
                });
        }

        if (!newUser && user.email && user.password) {
            firebase.auth().signInWithEmailAndPassword(user.email, user.password)
                .then(res => {
                    const newUserInfo = { ...user };
                    newUserInfo.error = '';
                    newUserInfo.success = true;
                    setUser(newUserInfo);
                    setLogInUser(newUserInfo);
                    history.replace(from);
                    console.log('sign in user info', res.user);
                })


                .catch(error => {
                    var errorMessage = error.message;
                    const newUserInfo = { ...user };
                    newUserInfo.error = errorMessage;
                    newUserInfo.success = false;
                    setUser(newUserInfo);
                });
        }

        e.preventDefault();
    }
    const updateUserName = name => {
        const user = firebase.auth().currentUser;

        user.updateProfile({
            displayName: name

        }).then(function () {
            console.log('User Name Updated successfully');
        }).catch(function (error) {
            console.log(error);
        });
    }


    return (
        <div className="App">
            {
                user.isSignIn ? <button onClick={handleSignOut} >Sign Out</button> : <button onClick={handleSignIn} >Sign in</button>
            }
            <br />
            <button onClick={handleFbLogin} >Sign in Facebook</button>
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
