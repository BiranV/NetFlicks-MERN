import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase"
import Snackbar from "../components/Snackbar";


const Auth = () => {
    const navigate = useNavigate();
    const signInError = "The email or password you entered is incorrect. Please check your credentials or sign up if you don't have an account"
    const signUpError = "There is an error. Please try again"
    const [authUser, setAuthUser] = useState(null);
    const [haveAccount, setHaveAccount] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);

    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser(user)
            } else {
                setAuthUser(null)

            }
        })
        return () => listen()
    }, [])

    const userSignIn = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
            navigate("/");
        }).catch((error) => {
            console.log(error)
            setError(true)
        })
    }

    const userSignUp = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log(userCredential)
                navigate("/")
            }).catch((error) => {
                console.log(error)
                setError(true)
            })
    }

    const changeToSignIn = () => {
        setEmail("")
        setPassword("")
        setError(false);
        setHaveAccount(true)
    }

    const changeToSignUp = () => {
        setEmail("");
        setPassword("");
        setError(false);
        setHaveAccount(false);
    }
    return (
        <div className="auth">
            {!authUser ? <>
                {!haveAccount ? <form onSubmit={userSignUp}>
                    <h2>Sign Up</h2>
                    {error && <Snackbar text={signUpError} />}
                    <label htmlFor="email" >Email</label>
                    <input type="email" id="email" placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor="password" >Password</label>
                    <input type="password" id="password" placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    <p>Password should be at least 6 characters</p>
                    <button type='submit'>Sign Up</button>
                    <label>Already have an account? <a href="#" onClick={changeToSignIn}>Click here</a></label>
                </form> :
                    <form onSubmit={userSignIn}>
                        <h2>Sign In</h2>
                        {error && <Snackbar text={signInError} />}
                        <label htmlFor="email" >Email</label>
                        <input type="email" id="email" placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)}
                        />
                        <label htmlFor="password" >Password</label>
                        <input type="password" id="password" placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button type='submit'>Sign In</button>
                        <label>Not a member? <a href="#1" onClick={changeToSignUp}>Click here</a></label>
                    </form>}
            </> :
                <Snackbar text="You are already logged in" />
            }
        </div >
    )
}

export default Auth;
