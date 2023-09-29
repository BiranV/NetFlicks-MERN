import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth"
import { auth, storage } from "../firebase"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import axios from "../api/axios"
import Snackbar from './Snackbar';
import { v4 } from "uuid"

const MovieDetails = () => {
    const navigate = useNavigate();
    let { id } = useParams();
    const [authUser, setAuthUser] = useState(null);
    const [imageUpload, setImageUpload] = useState(null);
    const [form, setForm] = useState({})
    const [editedForm, setEditedForm] = useState({})
    const [notFound, setNotFound] = useState(false);
    const [popupActive, setPopupActive] = useState(false);
    const [popupError, setPopupError] = useState("");
    const [loading, setLoading] = useState(false);
    const genres = ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Thriller', 'Kids']
    const rates = ['★', '★★', '★★★', '★★★★', '★★★★★']

    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                const res = await axios.get(`${ id }`);
                setForm(res.data);
            } catch (error) {
                setNotFound(true)
                console.error('Error fetching movie:', error);
            }
        };

        fetchMovieData();
    }, [id]);

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

    const editMovie = () => {
        if (authUser.email !== form.email) {
            setPopupError("Editing other's movies is not allowed!")
        } else {
            setEditedForm({ ...form, email: authUser.email })
            setPopupActive(true)
        }
    }
    const deleteMovie = async () => {
        if (authUser.email !== form.email) {
            setPopupError("Deleting other's movies is not allowed!")
        } else {
            /* eslint-disable no-restricted-globals */
            const result = confirm(`Are you sure want to delete ${ form.title } movie?`);
            if (result) {
                try {
                    const imageRef = ref(storage, form.image);
                    await deleteObject(imageRef);
                    await axios.delete(`${ form._id }`);
                    navigate('/');
                } catch (error) {
                    console.error('Error deleting movie:', error);
                }
            }
        }
        /* eslint-enable no-restricted-globals */
    };

    const submitMovie = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (imageUpload) {
            const previousImageRef = ref(storage, form.image);

            try {
                await deleteObject(previousImageRef);
            } catch (error) {
                console.error('Error deleting previous image:', error);
            }

            const newImageRef = ref(storage, `images/${ v4() }`);
            try {
                await uploadBytes(newImageRef, imageUpload);
                const imageUrl = await getDownloadURL(newImageRef);
                const updatedForm = { ...editedForm, image: imageUrl };

                try {
                    await axios.put(`${ editedForm._id }`, updatedForm);
                    setPopupActive(false);
                    navigate('/');
                } catch (error) {
                    console.error('Error updating movie:', error);
                }

            } catch (error) {
                console.error('Error uploading new image:', error);
            }

        } else {
            try {
                await axios.put(`${ editedForm._id }`, editedForm);
                setPopupActive(false);
                navigate('/');
            } catch (error) {
                console.error('Error updating movie:', error);
            }
        }
        setLoading(false);
    }

    if (notFound) {
        return <Snackbar text={"Page Not Found"} />
    }
    return (
        <>
            <div className="movie-details">
                <img src={form.image} alt={form.title} />
                <h1>{form.title}</h1>
                <address>{form.genre}</address>
                <h3>{'★'.repeat(form.rate)}</h3>
                <div className="plot">{form.plot}
                </div>
                <div className="buttons">
                    <button disabled={!authUser} className="edit" onClick={editMovie}>Edit</button>
                    <button disabled={!authUser} className="delete" onClick={deleteMovie}>Delete</button>
                </div>
            </div>
            {popupActive && (
                <div className="popup">
                    <div className="inner">
                        <form onSubmit={submitMovie} >
                            <label htmlFor='title'>Movie Title</label>
                            <input type='text' required id='title' value={editedForm.title} onChange={(e) =>
                                setEditedForm({ ...editedForm, title: e.target.value })
                            } />
                            <label htmlFor='genre'>Genre</label>
                            <select required id="genre" name="genre" value={editedForm.genre} onChange={(e) => setEditedForm({ ...editedForm, genre: e.target.value })}>
                                <option value="" disabled>Select a genre...</option>
                                {genres.map((genre) => (
                                    <option key={genre} value={genre}>{genre}</option>
                                ))}
                            </select>
                            <label htmlFor='rate'>Rate</label>
                            <select required id="rate" name="rate" value={editedForm.rate} onChange={(e) => setEditedForm({ ...editedForm, rate: e.target.value })}>
                                <option value="" disabled>Rate the movie...</option>
                                {rates.map((rate) => (
                                    <option key={rate.length} value={rate.length}>{rate}</option>
                                ))}
                            </select>
                            <label htmlFor='image'>Image</label>
                            <input
                                accept="image/png, image/gif, image/jpeg"
                                type="file"
                                id="image"
                                name="image"
                                onChange={(e) => setImageUpload(e.target.files[0])}
                            />
                            <label htmlFor='image'>Plot</label>
                            <textarea required id='plot' rows={5} value={editedForm.plot} onChange={(e) =>
                                setEditedForm({ ...editedForm, plot: e.target.value })
                            }></textarea>
                            <div className="buttons">
                                <button disabled={loading} type="submit" className="save">Save</button>
                                <button disabled={loading} type="button" className="cancel" onClick={(e) => setPopupActive(false)} >Cancel</button>
                            </div>
                        </form>
                    </div >
                </div >
            )
            }
            {popupError &&
                <div className="popup">
                    <div className="error">
                        <h2>{popupError}</h2>
                        <button className="sorry" onClick={(e) => setPopupError("")}>OK, Sorry</button>
                    </div >
                </div >
            }
        </>
    )
}

export default MovieDetails
