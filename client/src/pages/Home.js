import { useEffect, useState } from "react";
import Movie from '../components/Movie'
import Snackbar from "../components/Snackbar";
import axios from "../api/axios"
import { onAuthStateChanged } from "firebase/auth"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { auth, storage } from "../firebase"
import { v4 } from "uuid"

const Home = () => {
    const [imageUpload, setImageUpload] = useState(null);
    const [authUser, setAuthUser] = useState(null);
    const [form, setForm] = useState({
        title: "",
        genre: "",
        rate: "",
        image: "",
        plot: "",
        email: "",
    })
    const [filter, setFilter] = useState("");
    const [movies, setMovies] = useState([]);
    const [popupActive, setPopupActive] = useState(false);
    const [loading, setLoading] = useState(false);

    const genres = ['All', 'Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Thriller', 'Kids']
    const rates = ['★', '★★', '★★★', '★★★★', '★★★★★']


    useEffect(() => {
        if (!popupActive) {
            const fetchMoviesData = async () => {
                try {
                    const res = await axios.get("/");
                    setMovies(res.data);
                } catch (error) {
                    console.error('Error fetching movies:', error);
                }
            };

            fetchMoviesData();
        }
    }, [popupActive]);

    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser(user)
                setForm((prevForm) => ({
                    ...prevForm,
                    email: user.email || ""
                }));
            } else {
                setAuthUser(null)
            }
        })
        return () => listen()
    }, [])

    const filteredMovies = movies.filter((item) => item.genre === filter || filter === '');
    const filterMovies = (e) => {
        if (e.target.value === 'All') {
            setFilter('')
        } else setFilter(e.target.value);
    }

    const addMovie = () => {
        setForm({
            title: "",
            genre: "",
            rate: "",
            image: "",
            plot: "",
            email: authUser.email
        });
        setPopupActive(true);
    }

    const submitMovie = async (e) => {
        e.preventDefault();
        setLoading(true);

        const imageRef = ref(storage, `images/${ v4() }`);
        try {
            await uploadBytes(imageRef, imageUpload)
            const imageUrl = await getDownloadURL(imageRef);
            const updatedForm = { ...form, image: imageUrl };

            try {
                await axios.post("/", updatedForm)
            } catch (error) {
                console.error('Error adding movie:', error);
            }

        } catch (error) {
            console.error('Error adding movie:', error);
        }
        setPopupActive(false);
        setLoading(false);
    }

    return (
        <>
            <div className="movies-list">
                <button disabled={!authUser} className="add-btn" onClick={addMovie}>Add a movie</button>
                <select required id="filter" name="filter" value={filter} onChange={filterMovies}>
                    <option value="" disabled>Filter by genre</option>
                    {genres.map((genre) => (
                        <option key={genre} value={genre}>{genre}</option>
                    ))}
                </select>
                <ul>
                    {filteredMovies.length > 0 && filteredMovies.map((movie) => (
                        <Movie movie={movie} key={movie._id} />))}
                    {filteredMovies.length <= 0 && filter !== "" && <Snackbar text="There are no movies in this genre yet" />}
                </ul >
            </div >
            {popupActive && (
                <div className="popup">
                    <div className="inner">
                        <form onSubmit={submitMovie} >
                            <label htmlFor='title'>Movie Title</label>
                            <input type='text' required id='title' value={form.title} onChange={(e) =>
                                setForm({ ...form, title: e.target.value })
                            } />
                            <label htmlFor='genre'>Genre</label>
                            <select required id="genre" name="genre" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })}>
                                <option value="" disabled>Select a genre...</option>
                                {genres.slice(1).map((genre) => (
                                    <option key={genre} value={genre}>{genre}</option>
                                ))}
                            </select>
                            <label htmlFor='rate'>Rate</label>
                            <select required id="rate" name="rate" value={form.rate} onChange={(e) => setForm({ ...form, rate: e.target.value })}>
                                <option value="" disabled>Rate the movie...</option>
                                {rates.map((rate) => (
                                    <option key={rate.length} value={rate.length}>{rate}</option>
                                ))}
                            </select>
                            <label htmlFor='image'>Image</label>
                            <input required
                                accept="image/png, image/gif, image/jpeg"
                                type="file"
                                id="image"
                                name="image"
                                onChange={(e) => setImageUpload(e.target.files[0])}
                            />
                            <label htmlFor='image'>Plot</label>
                            <textarea required id='plot' rows={5} value={form.plot} onChange={(e) =>
                                setForm({ ...form, plot: e.target.value })
                            }></textarea>
                            <div className="">
                                <button disabled={loading} type="submit" className="save">Save</button>
                                <button disabled={loading} type="button" className="cancel" onClick={(e) => setPopupActive(false)} >Cancel</button>
                            </div>
                        </form>
                    </div >
                </div >
            )}
        </>
    )
}

export default Home
