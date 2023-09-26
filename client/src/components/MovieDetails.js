import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../firebase"
import axios from "../api/axios"
import Snackbar from './Snackbar';

const MovieDetails = () => {
    const navigate = useNavigate();
    let { id } = useParams();
    const [authUser, setAuthUser] = useState(null);
    const [form, setForm] = useState({})
    const [editedForm, setEditedForm] = useState({})
    const [notFound, setNotFound] = useState(false);
    const [popupActive, setPopupActive] = useState(false);
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

    const uploadMovie = (e) => {
        const selectedFile = e.target.files[0];
        const maxWidth = 800;
        const maxHeight = 600;

        const reader = new FileReader();
        reader.onload = (event) => {
            const image = new Image();
            image.src = event.target.result;

            image.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                let newWidth = image.width;
                let newHeight = image.height;

                // Calculate new dimensions while maintaining aspect ratio
                if (newWidth > maxWidth) {
                    const ratio = maxWidth / newWidth;
                    newWidth = maxWidth;
                    newHeight *= ratio;
                }

                if (newHeight > maxHeight) {
                    const ratio = maxHeight / newHeight;
                    newHeight = maxHeight;
                    newWidth *= ratio;
                }

                canvas.width = newWidth;
                canvas.height = newHeight;
                ctx.drawImage(image, 0, 0, newWidth, newHeight);
                const resizedImage = canvas.toDataURL('image/jpeg');
                setEditedForm({ ...editedForm, image: resizedImage });
            };
        };
        reader.readAsDataURL(selectedFile);
    };

    const editMovie = () => {
        setEditedForm({ ...form, email: authUser.email })
        setPopupActive(true)
    }
    const deleteMovie = async () => {
        /* eslint-disable no-restricted-globals */
        const result = confirm(`Are you sure want to delete ${ form.title } movie?`);
        if (result) {
            try {
                await axios.delete(`${ form._id }`);
                navigate('/');
            } catch (error) {
                console.error('Error deleting movie:', error);
            }
        }
        /* eslint-enable no-restricted-globals */
    };

    const submitMovie = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${ editedForm._id }`, editedForm);
            setPopupActive(false)
            navigate('/');
        } catch (error) {
            console.error('Error updating movie:', error);
        }
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
                                onChange={uploadMovie}
                            />
                            <label htmlFor='image'>Plot</label>
                            <textarea required id='plot' rows={5} value={editedForm.plot} onChange={(e) =>
                                setEditedForm({ ...editedForm, plot: e.target.value })
                            }></textarea>
                            <div className="buttons">
                                <button type="submit" className="save">Save</button>
                                <button type="button" className="cancel" onClick={(e) => setPopupActive(false)} >Cancel</button>
                            </div>
                        </form>
                    </div >
                </div >
            )
            }
        </>
    )
}

export default MovieDetails
