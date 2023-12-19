import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "../firebase"

const Navigation = () => {
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      setVerified(user && user.emailVerified)
    })
    return () => listen()
  }, [verified])

  const userSignOut = () => {
    signOut(auth).then(() => {
    }).catch((error) => {
      console.log(error);
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
