import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import axios from '../api/axios';
import Snackbar from '../components/Snackbar';
import PageNotFound from '../components/NotFound';
import { v4 as uuidv4 } from 'uuid';

const MovieDetails = () => {

    const navigate = useNavigate();
    const { id } = useParams();
    const { data, authUser, isLoading } = useFetch(id);
    const [imageUpload, setImageUpload] = useState(null);
    const [editedForm, setEditedForm] = useState({});
    const [popupActive, setPopupActive] = useState(false);
    const [popupError, setPopupError] = useState('');
    const [loading, setLoading] = useState(false);
    const [snackbarActive, setSnackbarActive] = useState({
        show: false,
        text: '',
    });

    const genres = ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Thriller', 'Kids'];
    const rates = ['★', '★★', '★★★', '★★★★', '★★★★★'];

    const editMovie = () => {
        if (authUser.email !== data.email) {
            setPopupError("Editing others' movies is not allowed!");
        } else {
            setEditedForm({ ...data, email: authUser.email });
            setPopupActive(true);
        }
    };

    const deleteMovie = async () => {
        if (authUser.email !== data.email) {
            setPopupError("Deleting others' movies is not allowed!");
        } else {
            const result = window.confirm(`Are you sure you want to delete the movie "${ data.title }"?`);
            if (result) {
                try {
                    const imageRef = ref(storage, data.image);
                    await deleteObject(imageRef);
                    const res = await axios.delete(data._id);
                    navigate('/');
                    handleSnackbar(res.data.message);
                } catch (error) {
                    console.error('Error deleting movie:', error);
                }
            }
        }
    };

    const submitMovie = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (imageUpload) {
            const previousImageRef = ref(storage, data.image);
            try {
                await deleteObject(previousImageRef);
            } catch (error) {
                console.error('Error deleting previous image:', error);
            }

            const newImageRef = ref(storage, `images/${ uuidv4() }`);
            try {
                await uploadBytes(newImageRef, imageUpload);
                const imageUrl = await getDownloadURL(newImageRef);
                const updatedForm = { ...editedForm, image: imageUrl };
                try {
                    const res = await axios.put(editedForm._id, updatedForm);
                    handleSnackbar(res.data.message);
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
                const res = await axios.put(editedForm._id, editedForm);
                handleSnackbar(res.data.message);
                setPopupActive(false);
                navigate('/');
            } catch (error) {
                console.error('Error updating movie:', error);
            }
        }
        setLoading(false);
    };

    const handleSnackbar = (val) => {
        setSnackbarActive({ show: true, text: val });
        setTimeout(() => {
            setSnackbarActive({ show: false, text: '' });
        }, 2000);
    };

    if (isLoading) {
        return <p className='loading'>Loading...</p>;
    }

    if (!data._id) {
        return <PageNotFound />;
    }

    return (
        <div className="movie-details">
            <div>
                <img src={data.image} alt={data.title} />
                <h1>{data.title}</h1>
                <address>{data.genre}</address>
                <h3>{'★'.repeat(data.rate)}</h3>
                <div className="plot">{data.plot}</div>
                <div className="buttons">
                    <button disabled={!authUser} className="edit" onClick={editMovie}>
                        Edit
                    </button>
                    <button disabled={!authUser} className="delete" onClick={deleteMovie}>
                        Delete
                    </button>
                </div>
            </div>
            {popupActive && (
                <div className="popup">
                    <div className="inner">
                        <form onSubmit={submitMovie}>
                            <label htmlFor="title">Movie Title</label>
                            <input
                                type="text"
                                required
                                id="title"
                                value={editedForm.title}
                                onChange={(e) => setEditedForm({ ...editedForm, title: e.target.value })}
                            />
                            <label htmlFor="genre">Genre</label>
                            <select
                                required
                                id="genre"
                                name="genre"
                                value={editedForm.genre}
                                onChange={(e) => setEditedForm({ ...editedForm, genre: e.target.value })}
                            >
                                <option value="" disabled>
                                    Select a genre...
                                </option>
                                {genres.map((genre) => (
                                    <option key={genre} value={genre}>
                                        {genre}
                                    </option>
                                ))}
                            </select>
                            <label htmlFor="rate">Rate</label>
                            <select
                                required
                                id="rate"
                                name="rate"
                                value={editedForm.rate}
                                onChange={(e) => setEditedForm({ ...editedForm, rate: e.target.value })}
                            >
                                <option value="" disabled>
                                    Rate the movie...
                                </option>
                                {rates.map((rate) => (
                                    <option key={rate.length} value={rate.length}>
                                        {rate}
                                    </option>
                                ))}
                            </select>
                            <label htmlFor="image">Image</label>
                            <input
                                accept="image/png, image/gif, image/jpeg"
                                type="file"
                                id="image"
                                name="image"
                                onChange={(e) => setImageUpload(e.target.files[0])}
                            />
                            <label htmlFor="image">Plot</label>
                            <textarea
                                required
                                id="plot"
                                rows={5}
                                value={editedForm.plot}
                                onChange={(e) => setEditedForm({ ...editedForm, plot: e.target.value })}
                            ></textarea>
                            <div className="buttons">
                                <button disabled={loading} type="submit" className="save">
                                    Save
                                </button>
                                <button disabled={loading} type="button" className="cancel" onClick={(e) => setPopupActive(false)}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {popupError && (
                <div className="popup">
                    <div className="error">
                        <h2>{popupError}</h2>
                        <button className="sorry" onClick={() => setPopupError('')}>
                            OK, Sorry
                        </button>
                    </div>
                </div>
            )}
            {snackbarActive.show && <Snackbar text={snackbarActive.text} />}
        </div>
    );
};

export default MovieDetails;
