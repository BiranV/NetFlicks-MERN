import { memo } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Card from "./Card";

const Movie = ({ movie }) => {
    const { title, rate, genre, image, _id } = movie;
    const navigate = useNavigate();

    const showDetails = () => {
        navigate(`/${ _id }`);
    };

    return (
        <Card>
            <li>
                <img src={image} alt={title} />
                <h3>{title}</h3>
                <address>{genre}</address>
                <p>{"★".repeat(rate)}</p>
                <button onClick={showDetails}>Show Details</button>
            </li>
        </Card>
    );
};

Movie.propTypes = {
    movie: PropTypes.shape({
        title: PropTypes.string.isRequired,
        rate: PropTypes.number.isRequired,
        genre: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        _id: PropTypes.string.isRequired,
    }).isRequired,
};

export default memo(Movie);
