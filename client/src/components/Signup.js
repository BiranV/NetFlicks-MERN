import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification } from "firebase/auth"
import { auth } from "../firebase"
import Snackbar from "./Snackbar";


const Signup = () => {
    const navigate = useNavigate();
    const signUpError = "There is an error. Please try again"
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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

        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                sendEmailVerification(auth.currentUser).then(() => {
                    alert("Email verification sent!")
                    navigate("/login")
                }).catch((error) => {
                    console.log("Error sending verification email: ", error);
                    setError(true);
                })
            }).catch((error) => {
                console.log(error)
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
                {error && <Snackbar text={signUpError} />}
                <label htmlFor="email" >Email</label>
                <input type="email" id="email" placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="password" >Password</label>
                <input type="password" id="password" placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <p>Password should be at least 6 characters</p>
                <button type='submit'>Sign Up</button>
                <label>Already have an account? <a href="" onClick={changeToSignIn}>Click here</a></label>
            </form>
        </div >
    )
}

export default Signup;
