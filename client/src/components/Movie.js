import { memo } from "react";
import { useNavigate } from "react-router-dom";
import Card from "./Card"

const Movie = (props) => {
    const { title, rate, genre, image, _id } = props.movie;
    const navigate = useNavigate();

    const showDetails = () => {
        navigate(`/${ _id }`);
    }

    return (
        <Card>
            <li>
                <img src={image} alt={title} />
                <h3>{title}</h3>
                <address>{genre}</address>
                <p>{'★'.repeat(rate)}</p>
                <button onClick={showDetails}>Show Details</button>
            </li>
        </Card >
    )
}

export default memo(Movie)
