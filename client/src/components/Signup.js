import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebase';

const Signup = () => {
    const navigate = useNavigate();
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            // Redirect if the user is logged in and email is verified
            if (user && user.emailVerified) {
                navigate('/');
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleSignUp = async (e) => {
        e.preventDefault();
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        try {
            // Create user account
            await createUserWithEmailAndPassword(auth, email, password);
            // Send email verification
            await sendEmailVerification(auth.currentUser);
            // Show success message and redirect to login page
            alert('Email verification sent!');
            navigate('/login');
        } catch (error) {
            console.error('Sign up error:', error);
            setError(true);
        }
    };

    const changeToSignIn = () => {
        navigate('/login');
    };

    return (
        <div className="auth">
            <form onSubmit={handleSignUp}>
                <h2>Sign Up</h2>
                {error && <p>There was an error. Please try again.</p>}
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="Enter your email" ref={emailRef} required />
                <label htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="Enter your password" ref={passwordRef} required />
                <p>Password should be at least 6 characters</p>
                <button className="mode" type="submit">Sign Up</button>
                <label>Already have an account? <button type="button" onClick={changeToSignIn}>Click here</button></label>
            </form>
        </div>
    );
};

export default Signup;
