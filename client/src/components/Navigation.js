import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

const Navigation = () => {
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setVerified(user && user.emailVerified);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="header">
      <Link to="/" className="title">NetFlicks</Link>
      <div>
        {!verified ? (
          <Link to="/login" className="btn">Login</Link>
        ) : (
          <button onClick={handleSignOut} className="btn">Logout</button>
        )}
      </div>
    </header>
  );
};

export default Navigation;
