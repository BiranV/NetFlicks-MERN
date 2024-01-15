import { useEffect, useState } from 'react'
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../firebase"
import axios from "../api/axios"

const useFetch = (url) => {
    const [data, setData] = useState([]);
    const [authUser, setAuthUser] = useState(null);

    useEffect(() => {
        const fetchDataAndAuth = async () => {
            try {
                const res = await axios.get(url);
                setData(res.data);

                const unsubscriber = onAuthStateChanged(auth, (user) => {
                    setAuthUser(user && user.emailVerified ? user : null);
                });

                return () => unsubscriber();
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        };

        fetchDataAndAuth();
    }, [url]);

    return {
        authUser,
        data,
        setData
    };
};

export default useFetch;