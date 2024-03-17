import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import axios from '../api/axios';

const useFetch = (url) => {
    const [data, setData] = useState([]);
    const [authUser, setAuthUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Function to fetch data and handle authentication state changes
        const fetchDataAndAuth = async () => {
            try {
                // Fetch data from the specified URL
                const response = await axios.get(url);
                setData(response.data);

                // Listen for authentication state changes
                const unsubscribe = onAuthStateChanged(auth, (user) => {
                    // Set authenticated user if email is verified
                    setAuthUser(user && user.emailVerified ? user : null);
                });
                setIsLoading(false);

                return () => unsubscribe();
            } catch (error) {
                console.error('Error fetching movies:', error);
                setIsLoading(false);
            }
        };

        fetchDataAndAuth();
    }, [url]);

    return {
        isLoading,
        authUser,
        data,
        setData,
    };
};

export default useFetch;