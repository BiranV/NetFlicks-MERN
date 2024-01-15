import { useState, useEffect, useRef } from 'react'
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification } from "firebase/auth"
import { auth } from "../firebase"

const Signup = () => {
    const navigate = useNavigate();
    const email = useRef('');
    const password = useRef('');
    const [error, setError] = useState(false);

    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if (user && user.emailVerified) {
                navigate("/")
            }
        })
        return () => listen()
    }, [])

    const userSignUp = (e) => {
        e.preventDefault();

        createUserWithEmailAndPassword(auth, email.current.value, password.current.value)
            .then(() => {
                sendEmailVerification(auth.currentUser).then(() => {
                    alert("Email verification sent!")
                    navigate("/login")
                }).catch((error) => {
                    console.error("Error sending verification email: ", error);
                    setError(true);
                })
            }).catch((error) => {
                console.error(error)
                setError(true)
            })
    }

    const changeToSignIn = () => {
        navigate("/login")
    }

    return (
        <div className="auth">
            <form onSubmit={userSignUp}>
                <h2>Sign Up</h2>
                {error && <p>There is an error. Please try again</p>}
                <label htmlFor="email" >Email</label>
                <input type="email" id="email" placeholder='Enter your email' ref={email} />
                <label htmlFor="password" >Password</label>
                <input type="password" id="password" placeholder='Enter your password' ref={password} />
                <p>Password should be at least 6 characters</p>
                <button type='submit'>Sign Up</button>
                <label>Already have an account? <a href="" onClick={changeToSignIn}>Click here</a></label>
            </form>
        </div >
    )
}

export default Signup;
