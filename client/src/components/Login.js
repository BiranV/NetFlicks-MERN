import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase"

const Login = () => {
    const navigate = useNavigate();
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

    const userSignIn = (e) => {
        e.preventDefault();

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredentials) => {
                if (userCredentials.user.emailVerified) {
                    navigate("/");
                } else {
                    setError(true);
                }
            }).catch((error) => {
                console.log(error);
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
                <input type="email" id="email" placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="password" >Password</label>
                <input type="password" id="password" placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type='submit'>Sign In</button>
                <label>Not a member? <a href="" onClick={changeToSignUp}>Click here</a></label>
            </form>
        </div >
    )
}

export default Login;
