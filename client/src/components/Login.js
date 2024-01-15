import { useState, useEffect, useRef } from 'react'
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase"

const Login = () => {
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
    }, [navigate])

    const userSignIn = (e) => {
        e.preventDefault();

        signInWithEmailAndPassword(auth, email.current.value, password.current.value)
            .then((userCredentials) => {
                if (userCredentials.user.emailVerified) {
                    navigate("/");
                } else {
                    setError(true);
                }
            }).catch((error) => {
                console.error(error);
                setError(true);
            })
    }

    const changeToSignUp = () => {
        navigate("/signup")
    }
    return (
        <div className="auth">
            <form onSubmit={userSignIn}>
                <h2>Sign In</h2>
                {error && <p>The email or password you entered is incorrect. Please check your credentials or sign up if you don't have an account</p>}
                <label htmlFor="email" >Email</label>
                <input type="email" id="email" placeholder='Enter your email' ref={email} />
                <label htmlFor="password" >Password</label>
                <input type="password" id="password" placeholder='Enter your password' ref={password} />
                <button type='submit'>Sign In</button>
                <label>Not a member? <a href="" onClick={changeToSignUp}>Click here</a></label>
            </form>
        </div >
    )
}

export default Login;
