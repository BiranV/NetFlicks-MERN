import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "../firebase"

const Navigation = () => {
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      setVerified(user && user.emailVerified)
    })
    return () => listen()
  }, [verified])

  const userSignOut = () => {
    signOut(auth).then(() => {
      navigate("/login");
    }).catch((error) => {
      console.error(error);
    })
  }


  return (
    <header className="header">
      <Link to='/' className="title">NetFlicks</Link>
      <div>
        {!verified ?
          <Link to='/login' className="btn">Login</Link>
          :
          <Link onClick={userSignOut} className="btn">Logout</Link>
        }
      </div>
    </header >
  )
}

export default Navigation
