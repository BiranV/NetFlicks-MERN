import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "../firebase"

const Navigation = () => {
  const [authUser, setAuthUser] = useState(null);
  const navigate = useNavigate();

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
        {authUser ? <Link onClick={userSignOut} className="btn">Sign out {authUser.email}</Link> :
          <Link to='/auth' className="btn">Login</Link>}
      </div>
    </header >
  )
}

export default Navigation
