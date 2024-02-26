import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const Login = () => {
    const navigate = useNavigate();
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user && user.emailVerified) {
                navigate('/');
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleSignIn = async (e) => {
        e.preventDefault();
        setError(false); // Reset error state before attempting sign-in

        try {
            const userCredentials = await signInWithEmailAndPassword(
                auth,
                emailRef.current.value,
                passwordRef.current.value
            );

            // Redirect if user is authenticated and email is verified
            if (userCredentials.user.emailVerified) {
                navigate('/');
            } else {
                setError(true);
            }
        } catch (error) {
            console.error('Sign in error:', error);
            setError(true);
        }
    };

    const navigateToSignUp = () => {
        navigate('/signup');
    };

    return (
        <div className="auth">
            <form onSubmit={handleSignIn}>
                <h2>Sign In</h2>
                {error && (
                    <p>
                        The email or password you entered is incorrect. Please check your credentials or sign up if you don't have an account.
                    </p>
                )}
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="Enter your email" ref={emailRef} required />
                <label htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="Enter your password" ref={passwordRef} required />
                <button className="mode" type="submit">
                    Sign In
                </button>
                <label>
                    Not a member? <button type="button" onClick={navigateToSignUp}>Click here</button>
                </label>
            </form>
        </div>
    );
};

export default Login;
